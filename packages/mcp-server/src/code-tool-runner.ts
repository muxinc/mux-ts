// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { WorkerOutput } from './code-tool-types';
import { Mux, ClientOptions } from '@mux/ts';

export type DenoOutputListener = (stream: 'stdout' | 'stderr', line: string) => void;

export type RunCodeInput = {
  /** Source defining the caller's `run` function. */
  code: string;
  /** Options the worker instantiates the SDK client from, passed through verbatim. */
  opts: ClientOptions;
  /** Hosts for Deno's --allow-net. */
  allowNet: string[];
  /** Environment for the Deno subprocess. Defaults to process.env. */
  env?: NodeJS.ProcessEnv | undefined;
  /**
   * Receives Deno's own output lines. Defaults to stderr with a [deno] prefix — never
   * stdout, which is the MCP channel under the stdio transport.
   */
  onDenoOutput?: DenoOutputListener | undefined;
};

export type RunCodeResult = {
  /** Worker HTTP status: 200 when the code ran to completion, 400 when it failed to compile or threw. */
  status: number;
  output: WorkerOutput;
};

// deno-http-worker grants its socket as `unix:<path>`, which older Deno rejects outright.
const MIN_DENO_VERSION = '2.9';

export class DenoUnavailableError extends Error {
  constructor(reason: string) {
    super(
      `${reason} Code execution needs Deno ${MIN_DENO_VERSION} or newer: reinstall this package so its ` +
        'optional deno dependency installs, or set DENO_PATH to a Deno executable.',
    );
    this.name = 'DenoUnavailableError';
  }
}

// Hosts the SDK itself calls: environment base URLs plus the hosts some methods pin.
const SDK_HOSTS: readonly string[] = ['api.mux.com', 'image.mux.com', 'stream.mux.com'];

/** Every host the SDK can reach for this client: its base URL plus the hosts some methods pin. */
export function allowNetFor(client: Mux): string[] {
  return [...new Set([new URL(client.baseURL).hostname, ...SDK_HOSTS])];
}

function denoVersionOk(versionOutput: string): boolean {
  const match = /^deno (\d+)\.(\d+)/.exec(versionOutput);
  if (!match) return false;
  const [minMajor, minMinor] = MIN_DENO_VERSION.split('.').map(Number) as [number, number];
  const [major, minor] = [Number(match[1]), Number(match[2])];
  return major > minMajor || (major === minMajor && minor >= minMinor);
}

let denoPathLookup: Promise<string> | undefined;

/**
 * DENO_PATH if set, else the package's optional `deno` dependency; either must be a working
 * Deno at MIN_DENO_VERSION or newer. Memoized; the answer is stable for the process.
 */
export function resolveDenoPath(): Promise<string> {
  denoPathLookup ??= (async () => {
    const fs = await import('node:fs');
    const { execFileSync } = await import('node:child_process');

    let candidate = process.env['DENO_PATH'];
    if (!candidate) {
      const { getBundledDenoPath } = await import('./code-tool-paths.cjs');
      candidate = getBundledDenoPath() ?? undefined;
      if (!candidate) throw new DenoUnavailableError('The optional deno dependency is not installed.');
    }
    try {
      await fs.promises.access(candidate, fs.constants.X_OK);
    } catch {
      throw new DenoUnavailableError(`No Deno executable at ${candidate}.`);
    }
    let version: string;
    try {
      version = execFileSync(candidate, ['--version'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch {
      throw new DenoUnavailableError(`${candidate} is not a working Deno executable.`);
    }
    if (!denoVersionOk(version)) {
      throw new DenoUnavailableError(`${candidate} is ${version.split('\n')[0]}.`);
    }
    return candidate;
  })().catch((err: unknown) => {
    // Let the next call retry, e.g. after the user installs Deno or fixes DENO_PATH.
    denoPathLookup = undefined;
    throw err;
  });
  return denoPathLookup;
}

const denoOutputToStderr: DenoOutputListener = (_stream, line) => {
  process.stderr.write(`[deno] ${line}\n`);
};

/**
 * Runs one code-tool request in a fresh Deno worker. Deno confines the caller's code:
 * no run/ffi/write, reads limited to the SDK install, network limited to `allowNet`.
 */
export async function runCode(input: RunCodeInput): Promise<RunCodeResult> {
  const denoPath = await resolveDenoPath();

  // Node built-ins are loaded here, not at module scope, so importing the server in a
  // non-Node bundle (the Cloudflare worker) never touches them.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const readline = await import('node:readline');
  const url = await import('node:url');
  const { newDenoHTTPWorker } = await import('@valtown/deno-http-worker');
  const { getWorkerPath } = await import('./code-tool-paths.cjs');
  const workerPath = getWorkerPath();
  const packageRoot = path.resolve(path.dirname(workerPath), '..');

  const allowReadPaths = [
    'code-tool-worker.mjs',
    `${workerPath.replace(/([\/\\]node_modules)[\/\\].+$/, '$1')}/`,
    packageRoot,
  ];
  // Follow symlinks so a workspace-linked SDK stays readable.
  try {
    const sdkDir = path.resolve(packageRoot, 'node_modules', '@mux/ts');
    const realSdkDir = fs.realpathSync(sdkDir);
    if (realSdkDir !== sdkDir) allowReadPaths.push(realSdkDir);
  } catch {
    // Not linked; nothing to add.
  }

  const onDenoOutput = input.onDenoOutput ?? denoOutputToStderr;
  // The library leaves a spawn failure as an unhandled 'error' event on the child; reject instead.
  let rejectSpawn!: (err: Error) => void;
  const spawnFailed = new Promise<never>((_, reject) => {
    rejectSpawn = reject;
  });
  const worker = await Promise.race([
    spawnFailed,
    newDenoHTTPWorker(url.pathToFileURL(workerPath), {
      denoExecutable: denoPath,
      runFlags: [
        '--node-modules-dir=manual',
        `--allow-read=${allowReadPaths.join(',')}`,
        `--allow-net=${input.allowNet.join(',')}`,
        // Instantiating the client reads env vars even when none are set.
        '--allow-env',
      ],
      printOutput: false,
      onSpawn: (proc) => proc.on('error', rejectSpawn),
      spawnOptions: {
        cwd: path.dirname(workerPath),
        env: input.env ?? process.env,
      },
    }),
  ]);
  readline.createInterface({ input: worker.stdout }).on('line', (line) => onDenoOutput('stdout', line));
  readline.createInterface({ input: worker.stderr }).on('line', (line) => onDenoOutput('stderr', line));

  try {
    const { status, body } = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      worker.addEventListener('exit', (exitCode) => {
        reject(new Error(`Worker exited with code ${exitCode}`));
      });
      const req = worker.request(
        'http://localhost',
        { method: 'POST', headers: { 'content-type': 'application/json' } },
        (res) => {
          const chunks: Uint8Array[] = [];
          res.on('error', reject);
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () =>
            resolve({ status: res.statusCode ?? 200, body: Buffer.concat(chunks).toString() }),
          );
        },
      );
      req.write(JSON.stringify({ opts: input.opts, code: input.code }), (err) => {
        if (err != null) reject(err);
      });
      req.end();
    });
    return { status, output: JSON.parse(body) as WorkerOutput };
  } finally {
    worker.terminate();
  }
}
