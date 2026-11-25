import { selectTools } from '../src/server';
import { parseCLIOptions, parseQueryOptions, McpOptions } from '../src/options';
import { sdkMethods } from '../src/methods';
import { operationTool, operationToolDefinitions } from '../src/lib/operation-tools';
import type { McpTool } from '../src/types';
import { configureLogger } from '../src/logger';

beforeAll(() => configureLogger({ level: 'error', pretty: false }));

const baseOptions: McpOptions = { codeExecutionMode: 'local' };
const HINTS = ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint'] as const;

const names = (tools: McpTool[]) => tools.map((t) => t.tool.name);

function expectFullyAnnotated(tools: McpTool[]) {
  for (const { tool } of tools) {
    expect(typeof tool.title).toBe('string');
    expect(tool.title!.length).toBeGreaterThan(0);
    expect(tool.annotations).toBeDefined();
    expect(tool.annotations!.title).toBe(tool.title);
    for (const hint of HINTS) {
      expect({ tool: tool.name, hint, type: typeof tool.annotations![hint] }).toEqual({
        tool: tool.name,
        hint,
        type: 'boolean',
      });
    }
  }
}

describe('tool selection', () => {
  it('defaults to the code-mode tools only', () => {
    expect(names(selectTools(baseOptions))).toEqual(['execute', 'search_docs']);
    expect(names(selectTools())).toEqual(['execute', 'search_docs']);
  });

  it('adds per-operation tools when enabled', () => {
    const tools = selectTools({ ...baseOptions, includeOperationTools: true });
    expect(names(tools).slice(0, 2)).toEqual(['execute', 'search_docs']);
    expect(names(tools)).toEqual(
      expect.arrayContaining([
        'list_video_assets',
        'retrieve_video_assets',
        'create_video_assets',
        'update_video_assets',
        'delete_video_assets',
        'create_video_uploads',
        'retrieve_video_playback_ids',
        'list_video_live_streams',
        'get_overall_values_data_metrics',
        'list_data_video_views',
        'list_data_dimensions',
        'list_robots_jobs',
        'create_summarize_robots_jobs',
      ]),
    );
  });

  it('supports an operations-only server', () => {
    const tools = selectTools({
      ...baseOptions,
      includeCodeTool: false,
      includeOperationTools: true,
    });
    expect(names(tools)).not.toContain('execute');
    expect(names(tools)).toContain('search_docs');
  });

  it('can narrow operation tools by name', () => {
    const tools = selectTools({
      ...baseOptions,
      includeCodeTool: false,
      includeDocsTools: false,
      includeOperationTools: true,
      operationToolNames: ['list_video_assets', 'retrieve_video_assets'],
    });
    expect(names(tools)).toEqual(['list_video_assets', 'retrieve_video_assets']);
  });

  it('honors code permissions for operation tools', () => {
    const tools = selectTools({
      ...baseOptions,
      includeCodeTool: false,
      includeDocsTools: false,
      includeOperationTools: true,
      codeAllowHttpGets: true,
    });
    expect(tools.length).toBeGreaterThan(0);
    for (const { tool } of tools) {
      expect(tool.annotations!.readOnlyHint).toBe(true);
    }
  });
});

describe('tool annotations', () => {
  it('every tool has a title and explicit boolean hints', () => {
    expectFullyAnnotated(selectTools({ ...baseOptions, includeOperationTools: true }));
  });

  it('annotates the code-mode tools', () => {
    const [execute, searchDocs] = selectTools(baseOptions);
    expect(execute!.tool.annotations).toEqual({
      title: 'Run Mux API code',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
    });
    expect(searchDocs!.tool.annotations).toEqual({
      title: 'Search Mux docs',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });

  it('keeps execute backwards compatible and drops telemetry wording from intent', () => {
    const [execute] = selectTools(baseOptions);
    const schema = execute!.tool.inputSchema as any;
    expect(schema.required).toEqual(['code']);
    expect(schema.properties.intent.type).toBe('string');
    expect(schema.properties.intent.description).not.toMatch(/improv|service|telemetry/i);
  });

  it('marks operations consistently with their HTTP method', () => {
    for (const def of operationToolDefinitions) {
      const a = def.annotations;
      if (def.httpMethod === 'get') {
        expect({ name: def.name, readOnly: a.readOnlyHint, destructive: a.destructiveHint }).toEqual({
          name: def.name,
          readOnly: true,
          destructive: false,
        });
      } else {
        expect({ name: def.name, readOnly: a.readOnlyHint }).toEqual({ name: def.name, readOnly: false });
      }
      if (def.httpMethod === 'delete') {
        expect({ name: def.name, destructive: a.destructiveHint }).toEqual({
          name: def.name,
          destructive: true,
        });
      }
    }
  });
});

describe('operation tool definitions', () => {
  it('have unique names and map to real SDK methods', () => {
    const seen = new Set<string>();
    const byName = new Map(sdkMethods.map((m) => [m.fullyQualifiedName, m]));
    for (const def of operationToolDefinitions) {
      expect(seen.has(def.name)).toBe(false);
      seen.add(def.name);
      const sdk = byName.get(def.method);
      expect({ name: def.name, found: !!sdk }).toEqual({ name: def.name, found: true });
      expect({ name: def.name, httpMethod: def.httpMethod, httpPath: def.httpPath }).toEqual({
        name: def.name,
        httpMethod: sdk!.httpMethod,
        httpPath: sdk!.httpPath,
      });
      expect(def.description.length).toBeGreaterThan(0);
    }
  });

  it('require their path params and declare object input schemas', () => {
    for (const def of operationToolDefinitions) {
      const schema = def.inputSchema as any;
      expect(schema.type).toBe('object');
      for (const p of def.pathParams) {
        expect(schema.properties[p]?.type).toBe('string');
        expect(schema.required).toContain(p);
      }
      expect(JSON.stringify(schema)).not.toContain('jq_filter');
    }
  });
});

describe('operation tool handlers', () => {
  const def = (name: string) => operationToolDefinitions.find((d) => d.name === name)!;

  it('passes path params positionally and the rest as params', async () => {
    const update = jest.fn().mockResolvedValue({ id: 'a1', passthrough: 'x' });
    const client: any = { video: { assets: { update } } };
    const result = await operationTool(def('update_video_assets')).handler({
      reqContext: { client },
      args: { ASSET_ID: 'a1', passthrough: 'x' },
    });
    expect(update).toHaveBeenCalledWith('a1', { passthrough: 'x' });
    expect(JSON.parse((result.content[0] as any).text)).toEqual({ id: 'a1', passthrough: 'x' });
  });

  it('does not pass a params object to methods without one', async () => {
    const retrieve = jest.fn().mockResolvedValue({ id: 'a1' });
    const client: any = { video: { assets: { retrieve } } };
    await operationTool(def('retrieve_video_assets')).handler({
      reqContext: { client },
      args: { ASSET_ID: 'a1' },
    });
    expect(retrieve).toHaveBeenCalledWith('a1');
  });

  it('returns the raw page body for paginated lists', async () => {
    const list = jest.fn().mockReturnValue({
      asResponse: async () => new Response(JSON.stringify({ data: [{ id: 'a1' }], next_cursor: 'c' })),
    });
    const client: any = { video: { assets: { list } } };
    const result = await operationTool(def('list_video_assets')).handler({
      reqContext: { client },
      args: { limit: 1 },
    });
    expect(list).toHaveBeenCalledWith({ limit: 1 });
    expect(JSON.parse((result.content[0] as any).text)).toEqual({ data: [{ id: 'a1' }], next_cursor: 'c' });
  });

  it('reports success for empty responses and errors for missing path params', async () => {
    const del = jest.fn().mockResolvedValue(undefined);
    const client: any = { video: { assets: { delete: del } } };
    const tool = operationTool(def('delete_video_assets'));
    const ok = await tool.handler({ reqContext: { client }, args: { ASSET_ID: 'a1' } });
    expect(JSON.parse((ok.content[0] as any).text)).toEqual({ success: true });
    const missing = await tool.handler({ reqContext: { client }, args: {} });
    expect(missing.isError).toBe(true);
    expect(del).toHaveBeenCalledTimes(1);
  });
});

describe('operations options', () => {
  const mockArgv = (args: string[]) => {
    const original = process.argv;
    process.argv = ['node', 'test.js', ...args];
    return () => {
      process.argv = original;
    };
  };

  it('parses --tools=operations and --operation-tool', () => {
    let cleanup = mockArgv([]);
    expect(parseCLIOptions().includeOperationTools).toBeUndefined();
    cleanup();

    cleanup = mockArgv(['--tools=operations', '--no-tools=code']);
    let opts = parseCLIOptions();
    expect(opts.includeOperationTools).toBe(true);
    expect(opts.includeCodeTool).toBe(false);
    cleanup();

    cleanup = mockArgv(['--operation-tool=list_video_assets']);
    opts = parseCLIOptions();
    expect(opts.includeOperationTools).toBe(true);
    expect(opts.operationToolNames).toEqual(['list_video_assets']);
    cleanup();
  });

  it('parses tools=operations and tool= from the query string', () => {
    expect(parseQueryOptions(baseOptions, '').includeOperationTools).toBeUndefined();
    let opts = parseQueryOptions(baseOptions, 'tools=operations&no_tools=code');
    expect(opts.includeOperationTools).toBe(true);
    expect(opts.includeCodeTool).toBe(false);
    opts = parseQueryOptions(baseOptions, 'tool=list_video_assets&tool=retrieve_video_assets');
    expect(opts.includeOperationTools).toBe(true);
    expect(opts.operationToolNames).toEqual(['list_video_assets', 'retrieve_video_assets']);
  });
});

describe('operation tool errors', () => {
  it('returns API errors as tool error results', async () => {
    const retrieve = jest.fn().mockRejectedValue(new Error('404 not found'));
    const client: any = { video: { assets: { retrieve } } };
    const def = operationToolDefinitions.find((d) => d.name === 'retrieve_video_assets')!;
    const result = await operationTool(def).handler({ reqContext: { client }, args: { ASSET_ID: 'nope' } });
    expect(result.isError).toBe(true);
    expect((result.content[0] as any).text).toContain('404');
  });
});
