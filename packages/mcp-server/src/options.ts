// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import qs from 'qs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import z from 'zod';
import { readEnv } from './util';

export type CLIOptions = McpOptions & {
  debug: boolean;
  logFormat: 'json' | 'pretty';
  transport: 'stdio' | 'http';
  port: number | undefined;
  socket: string | undefined;
};

export type McpOptions = {
  includeCodeTool?: boolean | undefined;
  includeDocsTools?: boolean | undefined;
  stainlessApiKey?: string | undefined;
  docsSearchMode?: 'local' | undefined;
  docsDir?: string | undefined;
  codeAllowHttpGets?: boolean | undefined;
  codeAllowedMethods?: string[] | undefined;
  codeBlockedMethods?: string[] | undefined;
  clientHeaderOverrides?: boolean | undefined;
  codeExecutionMode: McpCodeExecutionMode;
  codeSandboxUrl?: string | undefined;
  codeSandboxApiKey?: string | undefined;
  customInstructionsPath?: string | undefined;
};

export type McpCodeExecutionMode = 'local' | 'remote';

export function parseCLIOptions(): CLIOptions {
  const opts = yargs(hideBin(process.argv))
    .option('client-header-overrides', {
      type: 'boolean',
      default: true,
      description:
        'Honor the x-stainless-mcp-client-envs and x-stainless-mcp-client-permissions request headers (caller-supplied client environment values and code tool permission changes). Disable on a public deployment whose callers must not set either.',
    })
    .option('code-allow-http-gets', {
      type: 'boolean',
      description:
        'Allow all code tool methods that map to HTTP GET operations. If all code-allow-* flags are unset, then everything is allowed.',
    })
    .option('code-allowed-methods', {
      type: 'string',
      array: true,
      description:
        'Methods to explicitly allow for code tool. Evaluated as regular expressions against method fully qualified names. If all code-allow-* flags are unset, then everything is allowed.',
    })
    .option('code-blocked-methods', {
      type: 'string',
      array: true,
      description:
        'Methods to explicitly block for code tool. Evaluated as regular expressions against method fully qualified names. If all code-allow-* flags are unset, then everything is allowed.',
    })
    .option('code-execution-mode', {
      type: 'string',
      choices: ['local', 'remote'],
      default: 'local',
      description:
        "Where to run code from the code tool; 'local' executes on the MCP server machine via Deno, 'remote' sends code to a remote sandbox service (requires code-sandbox-url).",
    })
    .option('code-sandbox-api-key', {
      type: 'string',
      default: readEnv('CODE_SANDBOX_API_KEY'),
      description:
        "API key sent as a Bearer token to authenticate requests to the remote code sandbox service; required when code-execution-mode is 'remote'.",
    })
    .option('code-sandbox-url', {
      type: 'string',
      default: readEnv('CODE_SANDBOX_URL'),
      description: "URL of the remote code sandbox service; required when code-execution-mode is 'remote'.",
    })
    .option('custom-instructions-path', {
      type: 'string',
      description: 'Path to custom instructions for the MCP server',
    })
    .option('debug', { type: 'boolean', description: 'Enable debug logging' })
    .option('docs-dir', {
      type: 'string',
      description:
        'Path to a directory of local documentation files (markdown/JSON) to include in local docs search.',
    })
    .option('docs-search-mode', {
      type: 'string',
      choices: ['local'],
      default: 'local',
      description:
        "Documentation search will use an in-memory search index built from embedded SDK method data and optional local docs files; the 'stainless-api' option is unavailable.",
    })
    .option('log-format', {
      type: 'string',
      choices: ['json', 'pretty'],
      description: 'Format for log output; defaults to json unless tty is detected',
    })
    .option('no-tools', {
      type: 'string',
      array: true,
      choices: ['code', 'docs'],
      description: 'Tools to explicitly disable',
    })
    .option('port', {
      type: 'number',
      default: 3000,
      description: 'Port to serve on if using http transport',
    })
    .option('socket', { type: 'string', description: 'Unix socket to serve on if using http transport' })
    .option('tools', {
      type: 'string',
      array: true,
      choices: ['code', 'docs'],
      description: 'Tools to explicitly enable',
    })
    .option('transport', {
      type: 'string',
      choices: ['stdio', 'http'],
      default: 'stdio',
      description: 'What transport to use; stdio for local servers or http for remote servers',
    })
    .env('MCP_SERVER')
    .version(true)
    .help();

  const argv = opts.parseSync();

  if (argv.codeExecutionMode === 'remote' && (!argv.codeSandboxUrl || !argv.codeSandboxApiKey)) {
    console.error(
      "code-execution-mode 'remote' requires both --code-sandbox-url (CODE_SANDBOX_URL) and --code-sandbox-api-key (CODE_SANDBOX_API_KEY).",
    );
    process.exit(1);
  }

  const shouldIncludeToolType = (toolType: 'code' | 'docs') =>
    argv.noTools?.includes(toolType) ? false
    : argv.tools?.includes(toolType) ? true
    : undefined;

  const includeCodeTool = shouldIncludeToolType('code');
  const includeDocsTools = shouldIncludeToolType('docs');

  const transport = argv.transport as 'stdio' | 'http';
  const logFormat =
    argv.logFormat ? (argv.logFormat as 'json' | 'pretty')
    : process.stderr.isTTY ? 'pretty'
    : 'json';

  return {
    ...(includeCodeTool !== undefined && { includeCodeTool }),
    ...(includeDocsTools !== undefined && { includeDocsTools }),
    debug: !!argv.debug,

    docsSearchMode: argv.docsSearchMode as 'local' | undefined,
    docsDir: argv.docsDir,
    codeAllowHttpGets: argv.codeAllowHttpGets,
    codeAllowedMethods: argv.codeAllowedMethods,
    codeBlockedMethods: argv.codeBlockedMethods,
    clientHeaderOverrides: argv.clientHeaderOverrides,
    codeExecutionMode: argv.codeExecutionMode as McpCodeExecutionMode,
    codeSandboxUrl: argv.codeSandboxUrl,
    codeSandboxApiKey: argv.codeSandboxApiKey,
    customInstructionsPath: argv.customInstructionsPath,
    transport,
    logFormat,
    port: argv.port,
    socket: argv.socket,
  };
}

const coerceArray = <T extends z.ZodTypeAny>(zodType: T) =>
  z.preprocess(
    (val) =>
      Array.isArray(val) ? val
      : val ? [val]
      : val,
    z.array(zodType).optional(),
  );

const QueryOptions = z.object({
  tools: coerceArray(z.enum(['code', 'docs'])).describe('Specify which MCP tools to use'),
  no_tools: coerceArray(z.enum(['code', 'docs'])).describe('Specify which MCP tools to not use.'),
  tool: coerceArray(z.string()).describe('Include tools matching the specified names'),
});

export function parseQueryOptions(defaultOptions: McpOptions, query: unknown): McpOptions {
  const queryObject = typeof query === 'string' ? qs.parse(query) : query;
  const queryOptions = QueryOptions.parse(queryObject);

  let codeTool: boolean | undefined =
    queryOptions.no_tools && queryOptions.no_tools?.includes('code') ? false
    : queryOptions.tools?.includes('code') ? true
    : defaultOptions.includeCodeTool;

  let docsTools: boolean | undefined =
    queryOptions.no_tools && queryOptions.no_tools?.includes('docs') ? false
    : queryOptions.tools?.includes('docs') ? true
    : defaultOptions.includeDocsTools;

  return {
    ...(codeTool !== undefined && { includeCodeTool: codeTool }),
    ...(docsTools !== undefined && { includeDocsTools: docsTools }),
    codeExecutionMode: defaultOptions.codeExecutionMode,
    codeSandboxUrl: defaultOptions.codeSandboxUrl,
    codeSandboxApiKey: defaultOptions.codeSandboxApiKey,
    docsSearchMode: defaultOptions.docsSearchMode,
    docsDir: defaultOptions.docsDir,
  };
}
