# Mux TypeScript API Library

[![NPM version](<https://img.shields.io/npm/v/@mux/ts.svg?label=npm%20(stable)>)](https://npmjs.org/package/@mux/ts) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@mux/ts)

This library provides convenient access to the Mux REST API from server-side TypeScript or JavaScript.

The REST API documentation can be found on [docs.mux.com](https://docs.mux.com). The full API of this library can be found in [api.md](api.md).

Note: As of v14 of mux-node-sdk, we have changed some internal workings of the SDKs. You can read more about this [here](MIGRATION.md).

## MCP Server

Use the Mux MCP Server to enable AI assistants to interact with this API, allowing them to explore endpoints, make test requests, and use documentation to help integrate this SDK into your application.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40mux%2Fmcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBtdXgvbWNwIl0sImVudiI6eyJNVVhfVE9LRU5fSUQiOiJteSB0b2tlbiBpZCIsIk1VWF9UT0tFTl9TRUNSRVQiOiJteSBzZWNyZXQiLCJNVVhfV0VCSE9PS19TRUNSRVQiOiJNeSBXZWJob29rIFNlY3JldCIsIk1VWF9TSUdOSU5HX0tFWSI6Ik15IEp3dCBTaWduaW5nIEtleSIsIk1VWF9QUklWQVRFX0tFWSI6Ik15IEp3dCBQcml2YXRlIEtleSIsIk1VWF9BVVRIT1JJWkFUSU9OX1RPS0VOIjoibXkgYXV0aG9yaXphdGlvbiB0b2tlbiJ9fQ)
[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40mux%2Fmcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40mux%2Fmcp%22%5D%2C%22env%22%3A%7B%22MUX_TOKEN_ID%22%3A%22my%20token%20id%22%2C%22MUX_TOKEN_SECRET%22%3A%22my%20secret%22%2C%22MUX_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%2C%22MUX_SIGNING_KEY%22%3A%22My%20Jwt%20Signing%20Key%22%2C%22MUX_PRIVATE_KEY%22%3A%22My%20Jwt%20Private%20Key%22%2C%22MUX_AUTHORIZATION_TOKEN%22%3A%22my%20authorization%20token%22%7D%7D)

> Note: You may need to set environment variables in your MCP client.

## Installation

```sh
npm install @mux/ts
```

## Usage

The full API of this library can be found in [api.md](api.md).

<!-- prettier-ignore -->
```js
import Mux from '@mux/ts';

const client = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
  tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
});

const asset = await client.video.assets.create({
  inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }],
  playback_policies: ['public'],
});

console.log(asset.id);
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import Mux from '@mux/ts';

const client = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
  tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
});

const params: Mux.Video.AssetCreateParams = {
  inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }],
  playback_policies: ['public'],
};
const asset: Mux.Video.Asset = await client.video.assets.create(params);
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## JWT helpers

`client.jwt` signs the tokens Mux uses for [signed playback](https://www.mux.com/docs/guides/secure-video-playback) and [viewer counts](https://www.mux.com/docs/guides/see-how-many-people-are-watching). The signing key ID defaults to the `jwtSigningKey` client option (`MUX_SIGNING_KEY`) and the private key to the `jwtPrivateKey` client option (`MUX_PRIVATE_KEY`); pass `keyId` and `keySecret` to override them for one call. Tokens expire after 7 days unless you pass an `expiration` such as `'1d'`. Full signatures are in [api.md](api.md#jwt).

```ts
import Mux from '@mux/ts';

const client = new Mux();

// Playback; `type` defaults to 'video'
const token = await client.jwt.signPlaybackId('PLAYBACK_ID');
// https://stream.mux.com/PLAYBACK_ID.m3u8?token=${token}

// Images: 'thumbnail', 'gif' or 'storyboard', with image options as string params
const thumbnailToken = await client.jwt.signPlaybackId('PLAYBACK_ID', {
  type: 'thumbnail',
  params: { time: '14', width: '100' },
});
// https://image.mux.com/PLAYBACK_ID/thumbnail.jpg?token=${thumbnailToken}

const drmToken = await client.jwt.signDrmLicense('PLAYBACK_ID');

// Viewer counts: type is 'live_stream', 'asset', 'video' or 'playback'
const countsToken = await client.jwt.signViewerCounts('LIVE_STREAM_ID', { type: 'live_stream' });
// https://stats.mux.com/counts?token=${countsToken}
```

### Signing several tokens at once

Pass an array of types to get one token per type, keyed by Mux Player's token attribute names (`playback-token`, `thumbnail-token`, `storyboard-token`, `drm-token`). To give one type its own params, pass a `[type, params]` pair:

```ts
const tokens = await client.jwt.signPlaybackId('PLAYBACK_ID', {
  expiration: '1d',
  type: ['video', ['thumbnail', { time: '2' }], 'storyboard', 'drm_license'],
});
// { 'playback-token': '…', 'thumbnail-token': '…', 'storyboard-token': '…', 'drm-token': '…' }
```

## Webhooks

`client.webhooks.unwrap(body, headers)` checks a webhook's `Mux-Signature` header against your webhook signing secret and returns the parsed event. It throws if the header is missing or malformed, the signature doesn't match, or the request is more than 5 minutes old. See [Verify webhook signatures](https://www.mux.com/docs/core/verify-webhook-signatures).

Pass the raw request body (a string, `Buffer`, `Uint8Array` or `ArrayBuffer`), not parsed JSON: re-serializing changes the bytes, and the signature no longer matches. The secret defaults to the `webhookSecret` client option (`MUX_WEBHOOK_SECRET`). It's the signing secret shown for the webhook in your dashboard, not your API token secret; you can also pass it as a third argument.

```ts
import Mux from '@mux/ts';

const client = new Mux();

// A fetch-style handler, such as a Next.js route handler
export async function POST(request: Request) {
  const event = await client.webhooks.unwrap(await request.text(), request.headers);

  // `event` is a union of every webhook event; checking `event.type` narrows it
  console.log(event.type);

  return Response.json({ received: true });
}
```

With Express, read the body with `express.raw()`:

```ts
import express from 'express';

const app = express();

app.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await client.webhooks.unwrap(req.body, req.headers);
    console.log(event.type);
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${(err as Error).message}`);
  }
});
```

To check a signature without parsing the body, `await client.webhooks.verifySignature(body, headers)` resolves when it's valid and throws otherwise. Always `await` it: an unawaited check can't stop your handler.

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const liveStream = await client.video.liveStreams
  .create({ playback_policies: ['public'] })
  .catch(async (err) => {
    if (err instanceof Mux.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new Mux({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.video.assets.retrieve('t02rm...', {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new Mux({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.video.assets.retrieve('t02rm...', {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Auto-pagination

List methods in the Mux API are paginated.
You can use the `for await … of` syntax to iterate through items across all pages:

```ts
async function fetchAllDeliveryReports(params) {
  const allDeliveryReports = [];
  // Automatically fetches more pages as needed.
  for await (const deliveryReport of client.video.deliveryUsage.list()) {
    allDeliveryReports.push(deliveryReport);
  }
  return allDeliveryReports;
}
```

Alternatively, you can request a single page at a time:

```ts
let page = await client.video.deliveryUsage.list();
for (const deliveryReport of page.data) {
  console.log(deliveryReport);
}

// Convenience methods are provided for manually paginating:
while (page.hasNextPage()) {
  page = await page.getNextPage();
  // ...
}
```

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new Mux();

const response = await client.video.assets
  .create({
    inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }],
    playback_policies: ['public'],
  })
  .asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: asset, response: raw } = await client.video.assets
  .create({
    inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }],
    playback_policies: ['public'],
  })
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(asset.id);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `MUX_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import Mux from '@mux/ts';

const client = new Mux({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import Mux from '@mux/ts';
import pino from 'pino';

const logger = pino();

const client = new Mux({
  logger: logger.child({ name: 'Mux' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.video.assets.create({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import Mux from '@mux/ts';
import fetch from 'my-fetch';

const client = new Mux({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import Mux from '@mux/ts';

const client = new Mux({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import Mux from '@mux/ts';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new Mux({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import Mux from '@mux/ts';

const client = new Mux({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import Mux from 'npm:@mux/ts';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new Mux({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Frequently Asked Questions

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://www.github.com/muxinc/mux-ts/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 22 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).
