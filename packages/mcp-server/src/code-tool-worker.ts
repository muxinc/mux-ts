// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import path from 'node:path';
import util from 'node:util';
import Fuse from 'fuse.js';
import ts from 'typescript';
import { WorkerOutput } from './code-tool-types';
import { Mux, ClientOptions } from '@mux/ts';

async function tseval(code: string) {
  return import('data:application/typescript;charset=utf-8;base64,' + Buffer.from(code).toString('base64'));
}

function getRunFunctionSource(code: string): {
  type: 'declaration' | 'expression';
  client: string | undefined;
  code: string;
} | null {
  const sourceFile = ts.createSourceFile('code.ts', code, ts.ScriptTarget.Latest, true);
  const printer = ts.createPrinter();

  for (const statement of sourceFile.statements) {
    // Check for top-level function declarations
    if (ts.isFunctionDeclaration(statement)) {
      if (statement.name?.text === 'run') {
        return {
          type: 'declaration',
          client: statement.parameters[0]?.name.getText(),
          code: printer.printNode(ts.EmitHint.Unspecified, statement.body!, sourceFile),
        };
      }
    }

    // Check for variable declarations: const run = () => {} or const run = function() {}
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === 'run' &&
          // Check if it's initialized with a function
          declaration.initializer &&
          (ts.isFunctionExpression(declaration.initializer) || ts.isArrowFunction(declaration.initializer))
        ) {
          return {
            type: 'expression',
            client: declaration.initializer.parameters[0]?.name.getText(),
            code: printer.printNode(ts.EmitHint.Unspecified, declaration.initializer, sourceFile),
          };
        }
      }
    }
  }

  return null;
}

function getTSDiagnostics(code: string): string[] {
  const functionSource = getRunFunctionSource(code)!;
  const codeWithImport = [
    'import { Mux } from "@mux/ts";',
    functionSource.type === 'declaration' ?
      `async function run(${functionSource.client}: Mux)`
    : `const run: (${functionSource.client}: Mux) => Promise<unknown> =`,
    functionSource.code,
  ].join('\n');
  const sourcePath = path.resolve('code.ts');
  const ast = ts.createSourceFile(sourcePath, codeWithImport, ts.ScriptTarget.Latest, true);
  const options = ts.getDefaultCompilerOptions();
  options.target = ts.ScriptTarget.Latest;
  options.module = ts.ModuleKind.NodeNext;
  options.moduleResolution = ts.ModuleResolutionKind.NodeNext;
  const host = ts.createCompilerHost(options, true);
  const newHost: typeof host = {
    ...host,
    getSourceFile: (...args) => {
      if (path.resolve(args[0]) === sourcePath) {
        return ast;
      }
      return host.getSourceFile(...args);
    },
    readFile: (...args) => {
      if (path.resolve(args[0]) === sourcePath) {
        return codeWithImport;
      }
      return host.readFile(...args);
    },
    fileExists: (...args) => {
      if (path.resolve(args[0]) === sourcePath) {
        return true;
      }
      return host.fileExists(...args);
    },
  };
  const program = ts.createProgram({
    options,
    rootNames: [sourcePath],
    host: newHost,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program, ast);
  return diagnostics.map((d) => {
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    if (!d.file || !d.start) return `- ${message}`;
    const { line: lineNumber } = ts.getLineAndCharacterOfPosition(d.file, d.start);
    const line = codeWithImport.split('\n').at(lineNumber)?.trim();
    return line ? `- ${message}\n    ${line}` : `- ${message}`;
  });
}

const fuse = new Fuse(
  [
    'client.video.assets.create',
    'client.video.assets.createPlaybackId',
    'client.video.assets.createStaticRendition',
    'client.video.assets.createTrack',
    'client.video.assets.delete',
    'client.video.assets.deletePlaybackId',
    'client.video.assets.deleteShots',
    'client.video.assets.deleteStaticRendition',
    'client.video.assets.deleteTrack',
    'client.video.assets.generateShots',
    'client.video.assets.generateSubtitles',
    'client.video.assets.list',
    'client.video.assets.retrieve',
    'client.video.assets.retrieveInputInfo',
    'client.video.assets.retrievePlaybackId',
    'client.video.assets.retrieveShots',
    'client.video.assets.update',
    'client.video.assets.updateMP4Support',
    'client.video.assets.updateMasterAccess',
    'client.video.assets.updateTrack',
    'client.video.deliveryUsage.list',
    'client.video.liveStreams.complete',
    'client.video.liveStreams.create',
    'client.video.liveStreams.createPlaybackId',
    'client.video.liveStreams.createSimulcastTarget',
    'client.video.liveStreams.delete',
    'client.video.liveStreams.deleteNewAssetSettingsStaticRenditions',
    'client.video.liveStreams.deletePlaybackId',
    'client.video.liveStreams.deleteSimulcastTarget',
    'client.video.liveStreams.disable',
    'client.video.liveStreams.enable',
    'client.video.liveStreams.list',
    'client.video.liveStreams.resetStreamKey',
    'client.video.liveStreams.retrieve',
    'client.video.liveStreams.retrievePlaybackId',
    'client.video.liveStreams.retrieveSimulcastTarget',
    'client.video.liveStreams.update',
    'client.video.liveStreams.updateEmbeddedSubtitles',
    'client.video.liveStreams.updateGeneratedSubtitles',
    'client.video.liveStreams.updateNewAssetSettingsStaticRenditions',
    'client.video.playbackIds.retrieve',
    'client.video.playbackRestrictions.create',
    'client.video.playbackRestrictions.delete',
    'client.video.playbackRestrictions.list',
    'client.video.playbackRestrictions.retrieve',
    'client.video.playbackRestrictions.updateReferrer',
    'client.video.playbackRestrictions.updateUserAgent',
    'client.video.transcriptionVocabularies.create',
    'client.video.transcriptionVocabularies.delete',
    'client.video.transcriptionVocabularies.list',
    'client.video.transcriptionVocabularies.retrieve',
    'client.video.transcriptionVocabularies.update',
    'client.video.uploads.cancel',
    'client.video.uploads.create',
    'client.video.uploads.list',
    'client.video.uploads.retrieve',
    'client.video.drmConfigurations.list',
    'client.video.drmConfigurations.retrieve',
    'client.video.playback.animated',
    'client.video.playback.hls',
    'client.video.playback.staticRendition',
    'client.video.playback.storyboard',
    'client.video.playback.storyboardMeta',
    'client.video.playback.storyboardVtt',
    'client.video.playback.thumbnail',
    'client.video.playback.track',
    'client.video.playback.transcript',
    'client.robots.jobs.cancel',
    'client.robots.jobs.list',
    'client.robots.jobs.askQuestions.create',
    'client.robots.jobs.askQuestions.retrieve',
    'client.robots.jobs.generateChapters.create',
    'client.robots.jobs.generateChapters.retrieve',
    'client.robots.jobs.findKeyMoments.create',
    'client.robots.jobs.findKeyMoments.retrieve',
    'client.robots.jobs.moderate.create',
    'client.robots.jobs.moderate.retrieve',
    'client.robots.jobs.summarize.create',
    'client.robots.jobs.summarize.retrieve',
    'client.robots.jobs.translateCaptions.create',
    'client.robots.jobs.translateCaptions.retrieve',
    'client.robots.jobs.editCaptions.create',
    'client.robots.jobs.editCaptions.retrieve',
    'client.robots.jobs.findBestThumbnails.create',
    'client.robots.jobs.findBestThumbnails.retrieve',
    'client.robots.jobs.findScenes.create',
    'client.robots.jobs.findScenes.retrieve',
    'client.robots.jobs.generateEngagementInsights.create',
    'client.robots.jobs.generateEngagementInsights.retrieve',
    'client.robots.jobs.generatePremiumCaptions.create',
    'client.robots.jobs.generatePremiumCaptions.retrieve',
    'client.robots.jobs.translateAudio.create',
    'client.robots.jobs.translateAudio.retrieve',
    'client.robots.directives.create',
    'client.robots.directives.delete',
    'client.robots.directives.list',
    'client.robots.directives.retrieve',
    'client.robots.directives.runs.create',
    'client.robots.directives.runs.list',
    'client.robots.directives.runs.retrieve',
    'client.data.dimensions.list',
    'client.data.dimensions.listTraceElements',
    'client.data.dimensions.listValues',
    'client.data.monitoring.listDimensions',
    'client.data.monitoring.metrics.getBreakdown',
    'client.data.monitoring.metrics.getBreakdownTimeseries',
    'client.data.monitoring.metrics.getHistogramTimeseries',
    'client.data.monitoring.metrics.getTimeseries',
    'client.data.monitoring.metrics.list',
    'client.data.errors.list',
    'client.data.exports.listVideoViews',
    'client.data.incidents.list',
    'client.data.incidents.listRelated',
    'client.data.incidents.retrieve',
    'client.data.metrics.getInsights',
    'client.data.metrics.getOverallValues',
    'client.data.metrics.getTimeseries',
    'client.data.metrics.list',
    'client.data.metrics.listBreakdownValues',
    'client.data.realTime.listDimensions',
    'client.data.realTime.listMetrics',
    'client.data.realTime.retrieveBreakdown',
    'client.data.realTime.retrieveHistogramTimeseries',
    'client.data.realTime.retrieveTimeseries',
    'client.data.videoViews.list',
    'client.data.videoViews.retrieve',
    'client.data.annotations.create',
    'client.data.annotations.delete',
    'client.data.annotations.list',
    'client.data.annotations.retrieve',
    'client.data.annotations.update',
    'client.data.engagement.assets.heatmap',
    'client.data.engagement.assets.hotspots',
    'client.data.engagement.playbackIds.heatmap',
    'client.data.engagement.playbackIds.hotspots',
    'client.data.engagement.videos.heatmap',
    'client.data.engagement.videos.hotspots',
    'client.system.signingKeys.create',
    'client.system.signingKeys.delete',
    'client.system.signingKeys.list',
    'client.system.signingKeys.retrieve',
    'client.system.utilities.whoami',
    'client.system.usageExports.list',
    'client.webhooks.unwrap',
  ],
  { threshold: 1, shouldSort: true },
);

function getMethodSuggestions(fullyQualifiedMethodName: string): string[] {
  return fuse
    .search(fullyQualifiedMethodName)
    .map(({ item }) => item)
    .slice(0, 5);
}

const proxyToObj = new WeakMap<any, any>();
const objToProxy = new WeakMap<any, any>();

type ClientProxyConfig = {
  path: string[];
  isBelievedBad?: boolean;
};

function makeSdkProxy<T extends object>(obj: T, { path, isBelievedBad = false }: ClientProxyConfig): T {
  let proxy: T = objToProxy.get(obj);

  if (!proxy) {
    proxy = new Proxy(obj, {
      get(target, prop, receiver) {
        const propPath = [...path, String(prop)];
        const value = Reflect.get(target, prop, receiver);

        if (isBelievedBad || (!(prop in target) && value === undefined)) {
          // If we're accessing a path that doesn't exist, it will probably eventually error.
          // Let's proxy it and mark it bad so that we can control the error message.
          // We proxy an empty class so that an invocation or construction attempt is possible.
          return makeSdkProxy(class {}, { path: propPath, isBelievedBad: true });
        }

        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
          return makeSdkProxy(value, { path: propPath, isBelievedBad });
        }

        return value;
      },

      apply(target, thisArg, args) {
        if (isBelievedBad || typeof target !== 'function') {
          const fullyQualifiedMethodName = path.join('.');
          const suggestions = getMethodSuggestions(fullyQualifiedMethodName);
          throw new Error(
            `${fullyQualifiedMethodName} is not a function. Did you mean: ${suggestions.join(', ')}`,
          );
        }

        return Reflect.apply(target, proxyToObj.get(thisArg) ?? thisArg, args);
      },

      construct(target, args, newTarget) {
        if (isBelievedBad || typeof target !== 'function') {
          const fullyQualifiedMethodName = path.join('.');
          const suggestions = getMethodSuggestions(fullyQualifiedMethodName);
          throw new Error(
            `${fullyQualifiedMethodName} is not a constructor. Did you mean: ${suggestions.join(', ')}`,
          );
        }

        return Reflect.construct(target, args, newTarget);
      },
    });

    objToProxy.set(obj, proxy);
    proxyToObj.set(proxy, obj);
  }

  return proxy;
}

function parseError(code: string, error: unknown): string | undefined {
  if (!(error instanceof Error)) return;
  const cause = error.cause instanceof Error ? `: ${error.cause.message}` : '';
  const message = error.name ? `${error.name}: ${error.message}${cause}` : `${error.message}${cause}`;
  try {
    // Deno uses V8; the first "<anonymous>:LINE:COLUMN" is the top of stack.
    const lineNumber = error.stack?.match(/<anonymous>:([0-9]+):[0-9]+/)?.[1];
    // -1 for the zero-based indexing
    const line =
      lineNumber &&
      code
        .split('\n')
        .at(parseInt(lineNumber, 10) - 1)
        ?.trim();
    return line ? `${message}\n  at line ${lineNumber}\n    ${line}` : message;
  } catch {
    return message;
  }
}

const fetch = async (req: Request): Promise<Response> => {
  const { opts, code } = (await req.json()) as { opts: ClientOptions; code: string };

  const runFunctionSource = code ? getRunFunctionSource(code) : null;
  if (!runFunctionSource) {
    const message =
      code ?
        'The code is missing a top-level `run` function.'
      : 'The code argument is missing. Provide one containing a top-level `run` function.';
    return Response.json(
      {
        is_error: true,
        result: `${message} Write code within this template:\n\n\`\`\`\nasync function run(client) {\n  // Fill this out\n}\n\`\`\``,
        log_lines: [],
        err_lines: [],
      } satisfies WorkerOutput,
      { status: 400, statusText: 'Code execution error' },
    );
  }

  const diagnostics = getTSDiagnostics(code);
  if (diagnostics.length > 0) {
    return Response.json(
      {
        is_error: true,
        result: `The code contains TypeScript diagnostics:\n${diagnostics.join('\n')}`,
        log_lines: [],
        err_lines: [],
      } satisfies WorkerOutput,
      { status: 400, statusText: 'Code execution error' },
    );
  }

  const client = new Mux({
    ...opts,
  });

  const log_lines: string[] = [];
  const err_lines: string[] = [];
  const originalConsole = globalThis.console;
  globalThis.console = {
    ...originalConsole,
    log: (...args: unknown[]) => {
      log_lines.push(util.format(...args));
    },
    error: (...args: unknown[]) => {
      err_lines.push(util.format(...args));
    },
  };
  try {
    let run_ = async (client: any) => {};
    run_ = (await tseval(`${code}\nexport default run;`)).default;
    const result = await run_(makeSdkProxy(client, { path: ['client'] }));
    return Response.json({
      is_error: false,
      result,
      log_lines,
      err_lines,
    } satisfies WorkerOutput);
  } catch (e) {
    return Response.json(
      {
        is_error: true,
        result: parseError(code, e),
        log_lines,
        err_lines,
      } satisfies WorkerOutput,
      { status: 400, statusText: 'Code execution error' },
    );
  } finally {
    globalThis.console = originalConsole;
  }
};

export default { fetch };
