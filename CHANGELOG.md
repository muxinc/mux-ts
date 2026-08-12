# Changelog

## [15.0.0](https://github.com/muxinc/mux-ts/compare/v14.1.1...v15.0.0) (2026-08-12)


### ⚠ BREAKING CHANGES

* the npm package is renamed to @mux/ts (@mux/mux-node continues as a same-version alias for v15). client.robotsPreview is replaced by client.robots. The deprecated Data filters and exports endpoints are removed (superseded by dimensions and video-views exports). Some type declarations moved or were renamed with the new generation pipeline — see api.md for the current surface and MIGRATION.md for upgrade notes.

### Features

* move to a new SDK generation pipeline as @mux/ts ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* engagement analytics (`client.data.engagement`): heatmaps and hotspots for assets, playback IDs, and videos ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* asset shots (`client.video.assets`): create, retrieve, and delete ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* track updates: `patch /video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}` ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* named TypeScript models for webhook event payloads ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* robots jobs gain time-scoped output steering, automatic asset thumbnail updates, and shot reuse ([ce5dcc5](https://github.com/muxinc/mux-ts/commit/ce5dcc50d5bf19cf6d7af93db93ceb93577ee020))
* set and unset an asset's default thumbnail time ([20606c5](https://github.com/muxinc/mux-ts/commit/20606c5547722be7767b8e46cda99187246f3cc4))


### Bug Fixes

* **docs:** await the async webhook methods in README examples — re-check handlers copied from earlier examples ([18f3411](https://github.com/muxinc/mux-ts/commit/18f3411775fd67b1a4cc60c819be363c606f7399))
* **mcp:** default docs search for programmatic consumers; reuse the search index across requests ([487a7f9](https://github.com/muxinc/mux-ts/commit/487a7f97933e9931611382199b36fb953bda8f60))
* migration materials target the real upgrade path ([f1a30df](https://github.com/muxinc/mux-ts/commit/f1a30df5cbc6c6ff6115fa9d1b87b118235c34d7))
* release doctor actually diagnoses the release token ([fb1339b](https://github.com/muxinc/mux-ts/commit/fb1339bc392ab8147f39f791ede3002bff033a46))


### Documentation

* Update update-asset description to include thumbnail_time ([4ee25c1](https://github.com/muxinc/mux-ts/commit/4ee25c1beb4c967dece1271cd8dc82e8d0d18892))



## 14.1.1 (2026-05-28)

Full Changelog: [v14.1.0...v14.1.1](https://github.com/muxinc/mux-node-sdk/compare/v14.1.0...v14.1.1)

### Bug Fixes

* **mcp:** use `pure-lockfile` when building mcp server ([daf8547](https://github.com/muxinc/mux-node-sdk/commit/daf85471234ecfbcb08308cd584502c4efbb26c7))
* **typescript:** upgrade tsc-multi so that it works with Node 26 ([67195ce](https://github.com/muxinc/mux-node-sdk/commit/67195ce7fa3381b63f4eb133cfb9ab00954741e6))


### Documentation

* Latest Robots OpenAPI spec ([#415](https://github.com/muxinc/mux-node-sdk/issues/415)) ([241cfa3](https://github.com/muxinc/mux-node-sdk/commit/241cfa3d942b07ab09174ee94929d479f30a2f2f))

## 14.1.0 (2026-05-18)

Full Changelog: [v14.0.1...v14.1.0](https://github.com/muxinc/mux-node-sdk/compare/v14.0.1...v14.1.0)

### Features

* Add edit-captions beta, examples, and loosen ID validation ([#414](https://github.com/muxinc/mux-node-sdk/issues/414)) ([eec5ff1](https://github.com/muxinc/mux-node-sdk/commit/eec5ff14f89e48d801bd19b94fe4abd33539c638))
* Robots: Add freeform option to ask-questions ([#413](https://github.com/muxinc/mux-node-sdk/issues/413)) ([e0e0ddb](https://github.com/muxinc/mux-node-sdk/commit/e0e0ddb2ed37a1fde05f113cf8fc01a4761df32a))
* support setting headers via env ([39c9a46](https://github.com/muxinc/mux-node-sdk/commit/39c9a460c517fd1cd14c6eac874fd684b1f640df))


### Bug Fixes

* support years in jwt expirations ([#622](https://github.com/muxinc/mux-node-sdk/issues/622)) ([9637b78](https://github.com/muxinc/mux-node-sdk/commit/9637b78af53ddcdc81d94491c1584096d26077c2))


### Documentation

* clarify forwards compat behavior ([29ee4d8](https://github.com/muxinc/mux-node-sdk/commit/29ee4d84bcab46ae246edd1f5458bc9dcb9dd198))
* update http mcp docs ([00785ec](https://github.com/muxinc/mux-node-sdk/commit/00785ec5fefcf60e35b53768e32322fc9121d97a))
* update logging docs ([5ee4c64](https://github.com/muxinc/mux-node-sdk/commit/5ee4c64e1553797aced31217f2f33e162f910ce1))
* update with proxy auth info ([a72ca69](https://github.com/muxinc/mux-node-sdk/commit/a72ca6986d407ba953cb5bb7bc54bd5ef264e6d9))

## 14.0.1 (2026-04-20)

Full Changelog: [v14.0.0...v14.0.1](https://github.com/muxinc/mux-node-sdk/compare/v14.0.0...v14.0.1)

### Bug Fixes

* fix issue where node crypto was required for non-node runtimes

### Documentation

* **readme:** consistent use of sentence case in headings ([#351](https://github.com/muxinc/mux-node-sdk/issues/351)) ([7b4a1ec](https://github.com/muxinc/mux-node-sdk/commit/7b4a1ec8f778ae2298a229782f03ce69c7eeb1b8))
* **readme:** document how to make undocumented requests ([#353](https://github.com/muxinc/mux-node-sdk/issues/353)) ([8c49b9c](https://github.com/muxinc/mux-node-sdk/commit/8c49b9cafbda4ddd987a72835655dd007be5a122))

## 8.2.1 (2024-03-19)

Full Changelog: [v8.2.0...v8.2.1](https://github.com/muxinc/mux-node-sdk/compare/v8.2.0...v8.2.1)

### Bug Fixes

* **internal:** make toFile use input file's options ([#350](https://github.com/muxinc/mux-node-sdk/issues/350)) ([ff05172](https://github.com/muxinc/mux-node-sdk/commit/ff051721d608082e14e3688b684b5e5dbe6f5ff7))


### Documentation

* fix typo in CONTRIBUTING.md ([#347](https://github.com/muxinc/mux-node-sdk/issues/347)) ([21dcae5](https://github.com/muxinc/mux-node-sdk/commit/21dcae5e253135b5f405a6654c73132c9b3acd34))

## 8.2.0 (2024-03-13)

Full Changelog: [v8.1.1...v8.2.0](https://github.com/muxinc/mux-node-sdk/compare/v8.1.1...v8.2.0)

### Features

* **api:** update documentation ([#344](https://github.com/muxinc/mux-node-sdk/issues/344)) ([cccf020](https://github.com/muxinc/mux-node-sdk/commit/cccf0205f28b7d9f4155c60a0b1409840aa24728))

## 8.1.1 (2024-03-12)

Full Changelog: [v8.1.0...v8.1.1](https://github.com/muxinc/mux-node-sdk/compare/v8.1.0...v8.1.1)

### Documentation

* add jwt helpers, webhooks, and version upgrade content back to readme ([#342](https://github.com/muxinc/mux-node-sdk/issues/342)) ([f339b9e](https://github.com/muxinc/mux-node-sdk/commit/f339b9e542e4d74055a14b84a7d2c68741f34101))

## 8.1.0 (2024-03-12)

Full Changelog: [v8.0.0...v8.1.0](https://github.com/muxinc/mux-node-sdk/compare/v8.0.0...v8.1.0)

### Features

* **api:** updates ([#338](https://github.com/muxinc/mux-node-sdk/issues/338)) ([29165ce](https://github.com/muxinc/mux-node-sdk/commit/29165ce927ca0d128afd904f37708c5c51435ce4))


### Documentation

* add release steps ([2432cf8](https://github.com/muxinc/mux-node-sdk/commit/2432cf824e05031c332ebbfd4ec94c5365e12e0f))
