// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import {
  ContentBlock,
  McpRequestContext,
  McpTool,
  Metadata,
  ToolCallResult,
  asErrorResult,
  asTextContentResult,
} from './types';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { readEnv } from './util';
import { WorkerInput, WorkerOutput } from './code-tool-types';
import { allowNetFor, DenoUnavailableError, runCode, RunCodeResult } from './code-tool-runner';
import { getLogger } from './logger';
import { SdkMethod } from './methods';
import { McpCodeExecutionMode } from './options';
import { ClientOptions } from '@mux/ts';

const prompt = `Runs JavaScript code to interact with the Mux API.

You are a skilled TypeScript programmer writing code to interface with the service.
Define an async function named "run" that takes a single parameter of an initialized SDK client and it will be run.
For example:

\`\`\`
async function run(client) {
  const asset = await client.video.assets.create({ inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }], playback_policies: ['public'] });

  console.log(asset.id);
}
\`\`\`

You will be returned anything that your function returns, plus the results of any console.log statements.
Do not add try-catch blocks for single API calls. The tool will handle errors for you.
Do not add comments unless necessary for generating better code.
Code will run in a container, and cannot interact with the network outside of the given SDK client.
Variables will not persist between calls, so make sure to return or log any data you might need later.
Remember that you are writing TypeScript code, so you need to be careful with your types.
Always type dynamic key-value stores explicitly as Record<string, YourValueType> instead of {}.`;

/**
 * A tool that runs code against a copy of the SDK.
 *
 * Instead of exposing every endpoint as its own tool, which uses up too many tokens for LLMs to use at once,
 * we expose a single tool that can be used to search for endpoints by name, resource, operation, or tag, and then
 * a generic endpoint that can be used to invoke any endpoint with the provided arguments.
 *
 * @param blockedMethods - The methods to block for code execution. Blocking is done by simple string
 * matching, so it is not secure against obfuscation. For stronger security, block in the downstream API
 * with limited API keys.
 * @param codeExecutionMode - Whether to execute code in a local Deno environment or in a remote
 * sandbox environment.
 */
export function codeTool({
  blockedMethods,
  codeExecutionMode,
  codeSandboxUrl,
  codeSandboxApiKey,
}: {
  blockedMethods: SdkMethod[] | undefined;
  codeExecutionMode: McpCodeExecutionMode;
  codeSandboxUrl: string | undefined;
  codeSandboxApiKey: string | undefined;
}): McpTool {
  if (codeExecutionMode === 'remote') {
    if (!codeSandboxUrl) {
      throw new Error(
        "code-execution-mode 'remote' requires a sandbox URL; set the CODE_SANDBOX_URL environment variable or pass the --code-sandbox-url flag.",
      );
    }
    if (!codeSandboxApiKey) {
      throw new Error(
        "code-execution-mode 'remote' requires a sandbox API key; set the CODE_SANDBOX_API_KEY environment variable or pass the --code-sandbox-api-key flag.",
      );
    }
  }
  const metadata: Metadata = { resource: 'all', operation: 'write', tags: [] };
  const tool: Tool = {
    name: 'execute',
    description: prompt,
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Code to execute.',
        },
        intent: {
          type: 'string',
          description: 'Task you are trying to perform. Used for improving the service.',
        },
      },
      required: ['code'],
    },
  };

  const logger = getLogger();

  const handler = async ({
    reqContext,
    args,
  }: {
    reqContext: McpRequestContext;
    args: any;
  }): Promise<ToolCallResult> => {
    const code = args.code as string;
    // Do very basic blocking of code that includes forbidden method names.
    //
    // WARNING: This is not secure against obfuscation and other evasion methods. If
    // stronger security blocks are required, then these should be enforced in the downstream
    // API (e.g., by having users call the MCP server with API keys with limited permissions).
    if (blockedMethods) {
      const blockedMatches = blockedMethods.filter((method) => code.includes(method.fullyQualifiedName));
      if (blockedMatches.length > 0) {
        return asErrorResult(
          `The following methods have been blocked by the MCP server and cannot be used in code execution: ${blockedMatches
            .map((m) => m.fullyQualifiedName)
            .join(', ')}`,
        );
      }
    }

    let result: ToolCallResult;
    const startTime = Date.now();

    if (codeExecutionMode === 'remote') {
      logger.debug('Executing code in remote sandbox');
      result = await remoteSandboxHandler({ reqContext, args, codeSandboxUrl, codeSandboxApiKey });
    } else {
      logger.debug('Executing code in local Deno environment');
      result = await localDenoHandler({ reqContext, args });
    }

    logger.info(
      {
        codeExecutionMode,
        durationMs: Date.now() - startTime,
        isError: result.isError,
        contentRows: result.content?.length ?? 0,
      },
      'Got code tool execution result',
    );
    return result;
  };

  return { metadata, tool, handler };
}

const remoteSandboxHandler = async ({
  reqContext,
  args,
  codeSandboxUrl,
  codeSandboxApiKey,
}: {
  reqContext: McpRequestContext;
  args: any;
  codeSandboxUrl: string | undefined;
  codeSandboxApiKey: string | undefined;
}): Promise<ToolCallResult> => {
  const code = args.code as string;
  const intent = args.intent as string | undefined;
  const client = reqContext.client;

  if (!codeSandboxUrl) {
    return asErrorResult(
      'Remote code execution requires a sandbox URL; set the CODE_SANDBOX_URL environment variable or pass the --code-sandbox-url flag.',
    );
  }

  const localClientEnvs = {
    MUX_TOKEN_ID: client.tokenId ?? readEnv('MUX_TOKEN_ID') ?? undefined,
    MUX_TOKEN_SECRET: client.tokenSecret ?? readEnv('MUX_TOKEN_SECRET') ?? undefined,
    MUX_WEBHOOK_SECRET: client.webhookSecret ?? readEnv('MUX_WEBHOOK_SECRET') ?? undefined,
    MUX_SIGNING_KEY: client.jwtSigningKey ?? readEnv('MUX_SIGNING_KEY') ?? undefined,
    MUX_PRIVATE_KEY: client.jwtPrivateKey ?? readEnv('MUX_PRIVATE_KEY') ?? undefined,
    MUX_AUTHORIZATION_TOKEN: client.authorizationToken ?? readEnv('MUX_AUTHORIZATION_TOKEN') ?? undefined,
    MUX_BASE_URL: readEnv('MUX_BASE_URL') ?? client.baseURL ?? undefined,
  };
  // Merge any upstream client envs from the request header, with upstream values taking precedence.
  const mergedClientEnvs = { ...localClientEnvs, ...reqContext.upstreamClientEnvs };

  // Cap the round trip; the executor enforces its own execution limit.
  const timeoutMs = 300_000;
  let res: Response;
  try {
    res = await fetch(codeSandboxUrl, {
      method: 'POST',
      headers: {
        ...(codeSandboxApiKey && { Authorization: `Bearer ${codeSandboxApiKey}` }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_name: 'mux',
        code,
        intent,
        client_opts: {},
        client_envs: mergedClientEnvs,
      } satisfies WorkerInput),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return asErrorResult(`Code sandbox request timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  }

  if (!res.ok) {
    throw new Error(
      `${res.status}: ${
        res.statusText
      } error when trying to contact the code sandbox service. Details: ${await res.text()}`,
    );
  }

  const { is_error, result, log_lines, err_lines } = (await res.json()) as WorkerOutput;
  const hasLogs = log_lines.length > 0 || err_lines.length > 0;
  const output = {
    result,
    ...(log_lines.length > 0 && { log_lines }),
    ...(err_lines.length > 0 && { err_lines }),
  };
  if (is_error) {
    return asErrorResult(typeof result === 'string' && !hasLogs ? result : JSON.stringify(output, null, 2));
  }
  return asTextContentResult(output);
};

const localDenoHandler = async ({
  reqContext,
  args,
}: {
  reqContext: McpRequestContext;
  args: unknown;
}): Promise<ToolCallResult> => {
  const client = reqContext.client;
  const { code } = args as { code: string };

  // Strip null/undefined values so that the worker SDK client can fall back to
  // reading from environment variables (including any upstreamClientEnvs).
  const opts = {
    ...(client.baseURL != null ? { baseURL: client.baseURL } : undefined),
    ...(client.tokenId != null ? { tokenId: client.tokenId } : undefined),
    ...(client.tokenSecret != null ? { tokenSecret: client.tokenSecret } : undefined),
    ...(client.webhookSecret != null ? { webhookSecret: client.webhookSecret } : undefined),
    ...(client.jwtSigningKey != null ? { jwtSigningKey: client.jwtSigningKey } : undefined),
    ...(client.jwtPrivateKey != null ? { jwtPrivateKey: client.jwtPrivateKey } : undefined),
    ...(client.authorizationToken != null ? { authorizationToken: client.authorizationToken } : undefined),
    defaultHeaders: {
      'X-Stainless-MCP': 'true',
    },
  } satisfies Partial<ClientOptions> as ClientOptions;

  let run: RunCodeResult;
  try {
    run = await runCode({
      code,
      opts,
      allowNet: allowNetFor(client),
      // Upstream client envs take precedence over the server's own environment.
      env: { ...process.env, ...reqContext.upstreamClientEnvs },
    });
  } catch (err) {
    if (err instanceof DenoUnavailableError) return asErrorResult(err.message);
    throw err;
  }

  const { result, log_lines, err_lines } = run.output;
  const content: ContentBlock[] = [];
  if (result != null) {
    content.push({ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result) });
  }
  if (log_lines.length > 0) {
    content.push({ type: 'text', text: log_lines.join('\n') });
  }
  if (err_lines.length > 0) {
    content.push({ type: 'text', text: 'Error output:\n' + err_lines.join('\n') });
  }
  return run.status === 200 ? { content } : { content, isError: true };
};
