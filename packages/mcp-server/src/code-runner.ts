#!/usr/bin/env node
// Runs one code-tool request outside the MCP server. Input: {code, client_opts} as JSON
// from the file argument or stdin. Output: exactly one WorkerOutput JSON line on stdout;
// Deno's own output goes to stderr. Exit 0 whenever the worker answered (is_error
// included); non-zero only when the run itself could not happen.
//
//   mcp-code-runner request.json
//   mcp-code-runner < request.json
//
// DENO_PATH  Deno executable to use instead of the package's bundled one.

import fs from 'node:fs';
import { Mux, ClientOptions } from '@mux/ts';
import { WorkerOutput } from './code-tool-types';
import { allowNetFor, runCode } from './code-tool-runner';

type Request = { code: string; client_opts: Record<string, unknown> };

function requestFile(argv: string[]): string | undefined {
  if (argv.length > 1) throw new Error('Only one request file may be given');
  const [arg] = argv;
  if (arg !== undefined && arg.startsWith('-') && arg !== '-') throw new Error(`Unknown option ${arg}`);
  return arg;
}

function readRequest(file: string | undefined): Request {
  const raw = fs.readFileSync(file === undefined || file === '-' ? 0 : file, 'utf8');
  const parsed = JSON.parse(raw) as Partial<Request>;
  if (typeof parsed.code !== 'string') throw new Error('request must have a string "code" field');
  return { code: parsed.code, client_opts: parsed.client_opts ?? {} };
}

function exitWith(output: WorkerOutput, code: number): void {
  process.stdout.write(JSON.stringify(output) + '\n', () => process.exit(code));
}

async function main(): Promise<void> {
  const request = readRequest(requestFile(process.argv.slice(2)));
  // Caller options first, MCP marker last, as local mode does.
  const { defaultHeaders, ...clientOpts } = request.client_opts;
  const opts = {
    ...clientOpts,
    defaultHeaders: { ...(defaultHeaders as Record<string, string> | undefined), 'X-Stainless-MCP': 'true' },
  } as ClientOptions;

  const { output } = await runCode({
    code: request.code,
    opts,
    allowNet: allowNetFor(new Mux(opts)),
  });
  exitWith(output, 0);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  // EarlyExitDenoHTTPWorkerError carries the Deno subprocess's own output; surface it.
  const detail = (err ?? {}) as { stderr?: unknown; stdout?: unknown };
  const err_lines = [detail.stderr, detail.stdout]
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .flatMap((s) => s.trimEnd().split('\n'));
  exitWith({ is_error: true, result: message, log_lines: [], err_lines }, 1);
});
