# Mux TypeScript MCP Server

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export MUX_TOKEN_ID="my token id"
export MUX_TOKEN_SECRET="my secret"
export MUX_WEBHOOK_SECRET="My Webhook Secret"
export MUX_SIGNING_KEY="My Jwt Signing Key"
export MUX_PRIVATE_KEY="My Jwt Private Key"
export MUX_AUTHORIZATION_TOKEN="my authorization token"
npx -y @mux/mcp@latest
```

### Via MCP Client

There is a partial list of existing clients at [modelcontextprotocol.io](https://modelcontextprotocol.io/clients). If you already
have a client, consult their documentation to install the MCP server.

For clients with a configuration JSON, it might look something like this:

```json
{
  "mcpServers": {
    "mux": {
      "command": "npx",
      "args": ["-y", "@mux/mcp"],
      "env": {
        "MUX_TOKEN_ID": "my token id",
        "MUX_TOKEN_SECRET": "my secret",
        "MUX_WEBHOOK_SECRET": "My Webhook Secret",
        "MUX_SIGNING_KEY": "My Jwt Signing Key",
        "MUX_PRIVATE_KEY": "My Jwt Private Key",
        "MUX_AUTHORIZATION_TOKEN": "my authorization token"
      }
    }
  }
}
```

### Cursor

If you use Cursor, you can install the MCP server by using the button below. You will need to set your environment variables
in Cursor's `mcp.json`, which can be found in Cursor Settings > Tools & MCP > New MCP Server.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40mux%2Fmcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBtdXgvbWNwIl0sImVudiI6eyJNVVhfVE9LRU5fSUQiOiJteSB0b2tlbiBpZCIsIk1VWF9UT0tFTl9TRUNSRVQiOiJteSBzZWNyZXQiLCJNVVhfV0VCSE9PS19TRUNSRVQiOiJNeSBXZWJob29rIFNlY3JldCIsIk1VWF9TSUdOSU5HX0tFWSI6Ik15IEp3dCBTaWduaW5nIEtleSIsIk1VWF9QUklWQVRFX0tFWSI6Ik15IEp3dCBQcml2YXRlIEtleSIsIk1VWF9BVVRIT1JJWkFUSU9OX1RPS0VOIjoibXkgYXV0aG9yaXphdGlvbiB0b2tlbiJ9fQ)

### VS Code

If you use MCP, you can install the MCP server by clicking the link below. You will need to set your environment variables
in VS Code's `mcp.json`, which can be found via Command Palette > MCP: Open User Configuration.

[Open VS Code](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40mux%2Fmcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40mux%2Fmcp%22%5D%2C%22env%22%3A%7B%22MUX_TOKEN_ID%22%3A%22my%20token%20id%22%2C%22MUX_TOKEN_SECRET%22%3A%22my%20secret%22%2C%22MUX_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%2C%22MUX_SIGNING_KEY%22%3A%22My%20Jwt%20Signing%20Key%22%2C%22MUX_PRIVATE_KEY%22%3A%22My%20Jwt%20Private%20Key%22%2C%22MUX_AUTHORIZATION_TOKEN%22%3A%22my%20authorization%20token%22%7D%7D)

### Claude Code

If you use Claude Code, you can install the MCP server by running the command below in your terminal. You will need to set your
environment variables in Claude Code's `.claude.json`, which can be found in your home directory.

```
claude mcp add mux_mcp_api --env MUX_TOKEN_ID="my token id" MUX_TOKEN_SECRET="my secret" MUX_WEBHOOK_SECRET="My Webhook Secret" MUX_SIGNING_KEY="My Jwt Signing Key" MUX_PRIVATE_KEY="My Jwt Private Key" MUX_AUTHORIZATION_TOKEN="my authorization token" -- npx -y @mux/mcp
```

## Code Mode

This MCP server is built on the "Code Mode" tool scheme. In this MCP Server,
your agent will write code against the TypeScript SDK, which will then be executed in an
isolated sandbox. To accomplish this, the server will expose two tools to your agent:

- The first tool is a docs search tool, which can be used to generically query for
  documentation about your API/SDK.

- The second tool is a code tool, where the agent can write code against the TypeScript SDK.
  The code will be executed in a sandbox environment without web or filesystem access. Then,
  anything the code returns or prints will be returned to the agent as the result of the
  tool call.

Using this scheme, agents are capable of performing very complex tasks deterministically
and repeatably.

### Execution modes

By default (`--code-execution-mode=local`), code runs on the MCP server machine in an
isolated Deno sandbox. Setting `--code-execution-mode=remote` (or the
`MCP_SERVER_CODE_EXECUTION_MODE` environment variable) sends code to a remote code
sandbox service instead, configured with:

- `--code-sandbox-url` / `CODE_SANDBOX_URL`: URL of the sandbox service. Required in
  remote mode.
- `--code-sandbox-api-key` / `CODE_SANDBOX_API_KEY`: API key for the sandbox service,
  sent as a `Bearer` token. Required in remote mode.

Local mode runs the code under Deno, which the package installs for itself through its optional
`deno` dependency. Where that cannot install — a blocked binary download, `npm install --omit=optional`,
or a platform Deno does not ship an npm build for, such as Alpine — set `DENO_PATH` to a Deno 2.9 or
newer executable. The same variable applies to `mcp-code-runner` below. The desktop bundle (`.mcpb`) never
includes Deno; its settings expose `DENO_PATH` for the same purpose.

### Request headers a caller may send

Over the HTTP transport, `x-stainless-mcp-client-envs` lets a caller supply client environment values
(for example credentials) and `x-stainless-mcp-client-permissions` lets it adjust code tool permissions.
Both are honored by default so a trusted proxy in front of the server can use them. A public deployment
whose callers must not do either should start the server with `--no-client-header-overrides` (or pass
`clientHeaderOverrides: false` in `mcpOptions` when embedding `streamableHTTPApp`).

### Running code outside the server

The package also installs a `mcp-code-runner` bin for sandbox services that execute caller
code in their own VM. It runs one request through the same Deno worker as local execution
mode: feed it `{"code": ..., "client_opts": ...}` as JSON on stdin or as a file argument; it
writes one `{is_error, result, log_lines, err_lines}` JSON line to stdout and Deno's own
output to stderr. The network grant is the set of hosts the SDK calls (the client's base URL plus the
media hosts some endpoints use), as in local execution mode.

## Running remotely

Launching the client with `--transport=http` launches the server as a remote server using Streamable HTTP transport. The `--port` setting can choose the port it will run on, and the `--socket` setting allows it to run on a Unix socket.

Authorization can be provided via the `Authorization` header using the Basic or Bearer scheme.

Additionally, authorization can be provided via the following headers:
| Header | Equivalent client option | Security scheme |
| --------------------------- | ------------------------ | ------------------ |
| `x-mux-token-id` | `tokenId` | accessToken |
| `x-mux-token-secret` | `tokenSecret` | accessToken |
| `x-mux-authorization-token` | `authorizationToken` | authorizationToken |

A configuration JSON for this server might look like this, assuming the server is hosted at `http://localhost:3000`:

```json
{
  "mcpServers": {
    "mux": {
      "url": "http://localhost:3000",
      "headers": {
        "Authorization": "Basic <auth value>"
      }
    }
  }
}
```
