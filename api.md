# Shared

Types:

- <code><a href="./src/resources/shared.ts">CreatePlaybackIdRequest</a></code>
- <code><a href="./src/resources/shared.ts">PlaybackId</a></code>
- <code><a href="./src/resources/shared.ts">PlaybackPolicy</a></code>

# [Video](src/resources/video/api.md)

# [RobotsV0](src/resources/robots-v0/api.md)

# [Data](src/resources/data/api.md)

# System

## SigningKeys

Types:

- <code><a href="./src/resources/system/signing-keys.ts">SigningKey</a></code>
- <code><a href="./src/resources/system/signing-keys.ts">SigningKeyResponse</a></code>

Methods:

- <code title="post /system/v1/signing-keys">client.system.signingKeys.<a href="./src/resources/system/signing-keys.ts">create</a>() -> SigningKey</code>
- <code title="get /system/v1/signing-keys">client.system.signingKeys.<a href="./src/resources/system/signing-keys.ts">list</a>({ ...params }) -> SigningKeysBasePage</code>
- <code title="get /system/v1/signing-keys/{SIGNING_KEY_ID}">client.system.signingKeys.<a href="./src/resources/system/signing-keys.ts">retrieve</a>(signingKeyID) -> SigningKey</code>
- <code title="delete /system/v1/signing-keys/{SIGNING_KEY_ID}">client.system.signingKeys.<a href="./src/resources/system/signing-keys.ts">delete</a>(signingKeyID) -> void</code>

## Utilities

Types:

- <code><a href="./src/resources/system/utilities.ts">WhoamiResponse</a></code>
- <code><a href="./src/resources/system/utilities.ts">UtilityWhoamiResponse</a></code>

Methods:

- <code title="get /system/v1/whoami">client.system.utilities.<a href="./src/resources/system/utilities.ts">whoami</a>() -> UtilityWhoamiResponse</code>

## UsageExports

Types:

- <code><a href="./src/resources/system/usage-exports.ts">UsageExport</a></code>
- <code><a href="./src/resources/system/usage-exports.ts">UsageExportsMeta</a></code>
- <code><a href="./src/resources/system/usage-exports.ts">UsageExportsResponse</a></code>

Methods:

- <code title="get /system/v1/usage/exports">client.system.usageExports.<a href="./src/resources/system/usage-exports.ts">list</a>({ ...params }) -> UsageExportsResponse</code>

## Webhooks

Types:

- <code><a href="./src/resources/system/webhooks.ts">Webhook</a></code>
- <code><a href="./src/resources/system/webhooks.ts">WebhookResponse</a></code>

Methods:

- <code title="post /system/v1/webhooks">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">create</a>({ ...params }) -> Webhook</code>
- <code title="get /system/v1/webhooks">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">list</a>({ ...params }) -> WebhooksBasePage</code>
- <code title="get /system/v1/webhooks/{WEBHOOK_ID}">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">retrieve</a>(webhookID) -> Webhook</code>
- <code title="patch /system/v1/webhooks/{WEBHOOK_ID}">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">update</a>(webhookID, { ...params }) -> Webhook</code>
- <code title="delete /system/v1/webhooks/{WEBHOOK_ID}">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">delete</a>(webhookID) -> void</code>

# [Webhooks](src/resources/webhooks/api.md)

# JWT

Methods:

- <code>client.jwt.<a href="./src/resources/jwt.ts">signPlaybackId</a>(playbackId, config) -> Promise&lt;string&gt;</code>
- <code>client.jwt.<a href="./src/resources/jwt.ts">signViewerCounts</a>(id, config) -> Promise&lt;string&gt;</code>
