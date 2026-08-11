# Migration guide

This guide covers the two most recent major migrations of the Mux TypeScript SDK: v14 → v15 (the rename to `@mux/ts`), and the earlier v13 → v14 core migration.

## Migrating from v14 to v15 (`@mux/ts`)

v15 renames the package: the SDK is now published as [`@mux/ts`](https://www.npmjs.com/package/@mux/ts). For v15, the same artifact is also published as `@mux/mux-node` at the same version, so you can upgrade first and rename at your convenience — the alias is expected to stop after v15.

### Package rename

```sh
npm uninstall @mux/mux-node && npm install @mux/ts
```

```diff
- import Mux from '@mux/mux-node';
+ import Mux from '@mux/ts';
```

Subpath imports move the same way (for example `@mux/mux-node/lib/jwt` → `@mux/ts/lib/jwt`). No API shapes change as part of the rename itself.

### `client.robotsPreview` is now `client.robots`

The Robots API left preview: rename the accessor and any imported types. Job endpoints live under `client.robots.jobs.*`; the new job types added in v15 are additive.

### Removed deprecated Data endpoints

- `client.data.filters` is removed — use `client.data.dimensions` (`listValues`, `listTraceElements`).
- The deprecated raw exports listing is removed; video-view exports remain via `client.data.exports.listVideoViews()`.

### Moved type declarations

Some TypeScript declarations moved or were renamed with the new generation pipeline (nested sub-types, pagination types). If a type import breaks after upgrading, check [`api.md`](./api.md) for its current location.

Everything else in v15 is additive (engagement analytics, asset shots, track updates, named webhook payload models) and needs no migration.

## Migrating from v13 to v14

The sections below describe the earlier v13 → v14 migration, when the package was published as `@mux/mux-node` — they apply when upgrading from v13. The main changes were that the SDK moved to the [builtin Web fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of `node-fetch` and dropped to zero dependencies.

## Migration CLI

Most programs will only need minimal changes, but to assist there is a migration tool that will automatically update your code for the new version.
To use it, upgrade the `@mux/mux-node` package, then run `./node_modules/.bin/mux-mux-node migrate ./your/src/folders` to update your code.
To preview the changes without writing them to disk, run the tool with `--dry`.

## Environment requirements

The minimum supported runtime and tooling versions are now:

- Node.js 20 LTS (Most recent non-EOL Node version)
- TypeScript 4.9
- Jest 28

## Breaking changes

### Web types for `withResponse`, `asResponse`, and `APIError.headers`

Because we now use the builtin Web fetch API on all platforms, if you wrote code that used `withResponse` or `asResponse` and then accessed `node-fetch`-specific properties on the result, you will need to switch to standardized alternatives.
For example, `body` is now a [Web `ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) rather than a [node `Readable`](https://nodejs.org/api/stream.html#readable-streams).

```ts
// Before:
const res = await client.example.retrieve('string/with/slash').asResponse();
res.body.pipe(process.stdout);

// After:
import { Readable } from 'node:stream';
const res = await client.example.retrieve('string/with/slash').asResponse();
Readable.fromWeb(res.body).pipe(process.stdout);
```

Additionally, the `headers` property on `APIError` objects is now an instance of the Web [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) class. It was previously defined as `Record<string, string | null | undefined>`.

### URI encoded path parameters

Path params are now properly encoded by default. If you were manually encoding path parameters before giving them to the SDK, you must now stop doing that and pass the
param without any encoding applied.

For example:

```diff
- client.example.retrieve(encodeURIComponent('string/with/slash'))
+ client.example.retrieve('string/with/slash') // retrieves /example/string%2Fwith%2Fslash
```

Previously without the `encodeURIComponent()` call we would have used the path `/example/string/with/slash`; now we'll use `/example/string%2Fwith%2Fslash`.

### Removed request options overloads

When making requests with no required body, query or header parameters, you must now explicitly pass `null`, `undefined` or an empty object `{}` to the params argument in order to customise request options.

```diff
client.example.list();
client.example.list({}, { headers: { ... } });
client.example.list(null, { headers: { ... } });
client.example.list(undefined, { headers: { ... } });
- client.example.list({ headers: { ... } });
+ client.example.list({}, { headers: { ... } });
```

<details>

<summary>This affects the following methods</summary>

- `client.video.assets.list()`
- `client.video.deliveryUsage.list()`
- `client.video.liveStreams.list()`
- `client.video.playbackRestrictions.list()`
- `client.video.transcriptionVocabularies.list()`
- `client.video.uploads.list()`
- `client.video.drmConfigurations.list()`
- `client.video.playback.thumbnail()`
- `client.video.playback.animated()`
- `client.video.playback.storyboard()`
- `client.video.playback.storyboardVtt()`
- `client.video.playback.storyboardMeta()`
- `client.video.playback.hls()`
- `client.video.playback.staticRendition()`
- `client.video.playback.track()`
- `client.video.playback.transcript()`
- `client.robots.jobs.list()`
- `client.robots.directives.list()`
- `client.robots.directives.runs.list()`
- `client.data.dimensions.listValues()`
- `client.data.dimensions.listTraceElements()`
- `client.data.monitoring.metrics.getBreakdown()`
- `client.data.monitoring.metrics.getTimeseries()`
- `client.data.monitoring.metrics.getBreakdownTimeseries()`
- `client.data.monitoring.metrics.getHistogramTimeseries()`
- `client.data.errors.list()`
- `client.data.incidents.listRelated()`
- `client.data.incidents.list()`
- `client.data.metrics.list()`
- `client.data.metrics.listBreakdownValues()`
- `client.data.metrics.getOverallValues()`
- `client.data.metrics.getInsights()`
- `client.data.metrics.getTimeseries()`
- `client.data.realTime.retrieveBreakdown()`
- `client.data.realTime.retrieveTimeseries()`
- `client.data.realTime.retrieveHistogramTimeseries()`
- `client.data.videoViews.list()`
- `client.data.annotations.list()`
- `client.data.engagement.assets.heatmap()`
- `client.data.engagement.assets.hotspots()`
- `client.data.engagement.playbackIds.heatmap()`
- `client.data.engagement.playbackIds.hotspots()`
- `client.data.engagement.videos.heatmap()`
- `client.data.engagement.videos.hotspots()`
- `client.system.signingKeys.list()`
- `client.system.usageExports.list()`

</details>

### Removed `httpAgent` in favor of `fetchOptions`

The `httpAgent` client option has been removed in favor of a [platform-specific `fetchOptions` property](https://github.com/muxinc/mux-ts#fetch-options).
This change was made as `httpAgent` relied on `node:http` agents which are not supported by any runtime's builtin fetch implementation.

If you were using `httpAgent` for proxy support, check out the [new proxy documentation](https://github.com/muxinc/mux-ts#configuring-proxies).

Before:

```ts
import Mux from '@mux/mux-node';
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Configure the default for all requests:
const client = new Mux({
  httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
});
```

After:

```ts
import Mux from '@mux/mux-node';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent(process.env.PROXY_URL);
const client = new Mux({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

### Changed exports

#### Refactor of `@mux/mux-node/core`, `error`, `pagination`, `resource` and `uploads`

Much of the `@mux/mux-node/core` file was intended to be internal-only but it was publicly accessible, as such it has been refactored and split up into internal and public files, with public-facing code moved to a new `core` folder and internal code moving to the private `internal` folder.

At the same time, we moved some public-facing files which were previously at the top level into `core` to make the file structure cleaner and more clear:

```typescript
// Before
import '@mux/mux-node/error';
import '@mux/mux-node/pagination';
import '@mux/mux-node/resource';
import '@mux/mux-node/uploads';

// After
import '@mux/mux-node/core/error';
import '@mux/mux-node/core/pagination';
import '@mux/mux-node/core/resource';
import '@mux/mux-node/core/uploads';
```

If you were relying on anything that was only exported from `@mux/mux-node/core` and is also not accessible anywhere else, please open an issue and we'll consider adding it to the public API.

#### Resource classes

Previously under certain circumstances it was possible to import resource classes like `Video` directly from the root of the package. This was never valid at the type level and only worked in CommonJS files.
Now you must always either reference them as static class properties or import them directly from the files in which they are defined.

```typescript
// Before
const { Video } = require('@mux/mux-node');

// After
const { Mux } = require('@mux/mux-node');
Mux.Video; // or import directly from @mux/mux-node/resources/video/video
```

#### Cleaned up `uploads` exports

As part of the `core` refactor, `@mux/mux-node/uploads` was moved to `@mux/mux-node/core/uploads`
and the following exports were removed, as they were not intended to be a part of the public API:

- `fileFromPath`
- `BlobPart`
- `BlobLike`
- `FileLike`
- `ResponseLike`
- `isResponseLike`
- `isBlobLike`
- `isFileLike`
- `isUploadable`
- `isMultipartBody`
- `maybeMultipartFormRequestOptions`
- `multipartFormRequestOptions`
- `createForm`

Note that `Uploadable` & `toFile` **are** still exported:

```typescript
import { type Uploadable, toFile } from '@mux/mux-node/core/uploads';
```

#### `APIClient`

The `APIClient` base client class has been removed as it is no longer needed. If you were importing this class then you must now import the main client class:

```typescript
// Before
import { APIClient } from '@mux/mux-node/core';

// After
import { Mux } from '@mux/mux-node';
```

### File handling

The deprecated `fileFromPath` helper has been removed in favor of native Node.js streams:

```ts
// Before
Mux.fileFromPath('path/to/file');

// After
import fs from 'fs';
fs.createReadStream('path/to/file');
```

Note that this function previously only worked on Node.js. If you're using Bun, you can use [`Bun.file`](https://bun.sh/docs/api/file-io) instead.

### Shims removal

Previously you could configure the types that the SDK used like this:

```ts
// Tell TypeScript and the package to use the global Web fetch instead of node-fetch.
import '@mux/mux-node/shims/web';
import Mux from '@mux/mux-node';
```

The `@mux/mux-node/shims` imports have been removed. Your global types must now be [correctly configured](#minimum-types-requirements).

### Pagination changes

The `for await` syntax **is not affected**. This still works as-is:

```ts
// Automatically fetches more pages as needed.
for await (const deliveryReport of client.video.deliveryUsage.list()) {
  console.log(deliveryReport);
}
```

The interface for manually paginating through list results has been simplified:

```ts
// Before
page.nextPageParams();
page.nextPageInfo();
// Required manually handling { url } | { params } type

// After
page.nextPageRequestOptions();
```

#### Removed unnecessary classes

Page classes for individual methods are now type aliases:

```ts
// Before
export class DeliveryReportsPageWithTimeframe extends PageWithTimeframe<DeliveryReport> {}

// After
export type DeliveryReportsPageWithTimeframe = PageWithTimeframe<DeliveryReport>;
```

If you were importing these classes at runtime, you'll need to switch to importing the base class or only import them at the type-level.

### `@mux/mux-node/src` directory removed

Previously IDEs may have auto-completed imports from the `@mux/mux-node/src` directory, however this
directory was only included for an improved go-to-definition experience and should not have been used at runtime.

If you have any `@mux/mux-node/src/*` imports, you will need to replace them with `@mux/mux-node/*`.

```ts
// Before
import Mux from '@mux/mux-node/src';

// After
import Mux from '@mux/mux-node';
```

## TypeScript troubleshooting

When referencing the library after updating, you may encounter new type errors related to JS features like private properties or fetch classes like Request, Response, and Headers.
To resolve these issues, configure your tsconfig.json and install the appropriate `@types` packages for your runtime environment using the guidelines below:

### Browsers

`tsconfig.json`

```jsonc
{
  "target": "ES2018", // note: we recommend ES2020 or higher
  "lib": ["DOM", "DOM.Iterable", "ES2018"]
}
```

### Node.js

`tsconfig.json`

```jsonc
{
  "target": "ES2018" // note: we recommend ES2020 or higher
}
```

`package.json`

```json
{
  "devDependencies": {
    "@types/node": ">= 20"
  }
}
```

### Cloudflare Workers

`tsconfig.json`

```jsonc
{
  "target": "ES2018", // note: we recommend ES2020 or higher
  "lib": ["ES2020"], // <- needed by @cloudflare/workers-types
  "types": ["@cloudflare/workers-types"]
}
```

`package.json`

```json
{
  "devDependencies": {
    "@cloudflare/workers-types": ">= 0.20221111.0"
  }
}
```

### Bun

`tsconfig.json`

```jsonc
{
  "target": "ES2018" // note: we recommend ES2020 or higher
}
```

`package.json`

```json
{
  "devDependencies": {
    "@types/bun": ">= 1.2.0"
  }
}
```
