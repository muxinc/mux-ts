import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { McpTool } from '../../types';

// The MCP Apps spec's RESOURCE_MIME_TYPE. ext-apps' own constant is ESM-only and this package is CommonJS.
const MCP_APP_MIME_TYPE = 'text/html;profile=mcp-app';

// The SDK's ErrorCode enum has no member for the spec's resource-not-found code.
const RESOURCE_NOT_FOUND = -32002;

export type UiResource = {
  readonly uri: string;
  readonly name: string;
  readonly html: string;
  readonly csp: {
    readonly connectDomains: readonly string[];
    readonly resourceDomains: readonly string[];
  };
};

export type McpAppTool = McpTool & { readonly ui: UiResource };

/** The flat `ui/resourceUri` key is the legacy spelling older hosts still read. */
export function withUi(tool: McpTool, ui: UiResource): McpAppTool {
  return {
    ...tool,
    ui,
    tool: {
      ...tool.tool,
      _meta: { ...tool.tool._meta, ui: { resourceUri: ui.uri }, 'ui/resourceUri': ui.uri },
    },
  };
}

/** Must run before the transport connects, because `registerCapabilities` throws afterwards. */
export function registerUiResources(server: Server, tools: readonly McpTool[]): void {
  const views = new Map(tools.filter(hasUi).map((tool) => [tool.ui.uri, tool.ui]));
  if (views.size === 0) return;

  server.registerCapabilities({ resources: {} });

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [...views.values()].map((ui) => ({
      uri: ui.uri,
      name: ui.name,
      mimeType: MCP_APP_MIME_TYPE,
      _meta: uiMeta(ui),
    })),
  }));

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({ resourceTemplates: [] }));

  server.setRequestHandler(ReadResourceRequestSchema, async ({ params }) => {
    const ui = views.get(params.uri);
    if (!ui) throw new McpError(RESOURCE_NOT_FOUND, `Resource not found: ${params.uri}`);
    return { contents: [{ uri: ui.uri, mimeType: MCP_APP_MIME_TYPE, text: ui.html, _meta: uiMeta(ui) }] };
  });
}

// Hosts read the CSP from the resources/read item and fall back to the resources/list entry, so both carry it.
function uiMeta(ui: UiResource) {
  return {
    ui: {
      csp: { connectDomains: [...ui.csp.connectDomains], resourceDomains: [...ui.csp.resourceDomains] },
      prefersBorder: false,
    },
  };
}

function hasUi(tool: McpTool): tool is McpAppTool {
  return 'ui' in tool;
}
