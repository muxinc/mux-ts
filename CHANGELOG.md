# Changelog

## [15.0.0](https://github.com/muxinc/mux-ts/compare/v14.1.1...v15.0.0) (2026-08-12)


### ⚠ BREAKING CHANGES

* the npm package is renamed to @mux/ts (@mux/mux-node continues as a same-version alias for v15). client.robotsPreview is replaced by client.robots. The deprecated Data filters and exports endpoints are removed (superseded by dimensions and video-views exports). Some type declarations moved or were renamed with the new generation pipeline — see api.md for the current surface and MIGRATION.md for upgrade notes.

### Features

* move to a new SDK generation pipeline as @mux/ts ([dbca20f](https://github.com/muxinc/mux-ts/commit/dbca20fdc59f9c1bcbe6e67c9efbcfc792153194))
* robots jobs gain time-scoped output steering, automatic asset thumbnail updates, and shot reuse ([ce5dcc5](https://github.com/muxinc/mux-ts/commit/ce5dcc50d5bf19cf6d7af93db93ceb93577ee020))
* set and unset an asset's default thumbnail time ([20606c5](https://github.com/muxinc/mux-ts/commit/20606c5547722be7767b8e46cda99187246f3cc4))


### Bug Fixes

* **docs:** await the async webhook methods in README examples ([18f3411](https://github.com/muxinc/mux-ts/commit/18f3411775fd67b1a4cc60c819be363c606f7399))
* **mcp:** default docs search for programmatic consumers; reuse the search index across requests ([487a7f9](https://github.com/muxinc/mux-ts/commit/487a7f97933e9931611382199b36fb953bda8f60))
* migration materials target the real upgrade path ([f1a30df](https://github.com/muxinc/mux-ts/commit/f1a30df5cbc6c6ff6115fa9d1b87b118235c34d7))
* release doctor actually diagnoses the release token ([fb1339b](https://github.com/muxinc/mux-ts/commit/fb1339bc392ab8147f39f791ede3002bff033a46))


### Chores

* absorb out-of-band staging changes ([493bea1](https://github.com/muxinc/mux-ts/commit/493bea1f7c9b4a2a30ff45aad11dd4e377d7c145))
* adopt promote/sync/publish workflows ([b823936](https://github.com/muxinc/mux-ts/commit/b82393609887bd57b66c1e4855569f8da22a468f))
* adopt promote/sync/publish workflows ([882c1d0](https://github.com/muxinc/mux-ts/commit/882c1d0c71f99d9d6f7bc658379bee4c376ca0e7))
* publish all three npm artifacts; retire the dual script ([08d9545](https://github.com/muxinc/mux-ts/commit/08d9545b5b72e416576dfa3fe4abcfa914b6943e))
* remove revoked MCP publish key ([#633](https://github.com/muxinc/mux-ts/issues/633)) ([be39f12](https://github.com/muxinc/mux-ts/commit/be39f1260cdc3adbac2dfb3798899b29ef889ca3))


### Documentation

* Update update-asset description to include thumbnail_time ([4ee25c1](https://github.com/muxinc/mux-ts/commit/4ee25c1beb4c967dece1271cd8dc82e8d0d18892))


### Styles

* format bin/cli ([9f57c84](https://github.com/muxinc/mux-ts/commit/9f57c84025ac4f6c28d1c58d1a3f82ff06ee96e4))

## 14.1.1 (2026-05-28)

Full Changelog: [v14.1.0...v14.1.1](https://github.com/muxinc/mux-node-sdk/compare/v14.1.0...v14.1.1)

### Bug Fixes

* **mcp:** use `pure-lockfile` when building mcp server ([daf8547](https://github.com/muxinc/mux-node-sdk/commit/daf85471234ecfbcb08308cd584502c4efbb26c7))
* **typescript:** upgrade tsc-multi so that it works with Node 26 ([67195ce](https://github.com/muxinc/mux-node-sdk/commit/67195ce7fa3381b63f4eb133cfb9ab00954741e6))


### Chores

* **tests:** remove redundant File import ([337704a](https://github.com/muxinc/mux-node-sdk/commit/337704a0386923bb8f23a7dc699e276880c1bda6))


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


### Chores

* avoid formatting file that gets changed during releases ([7f0ba51](https://github.com/muxinc/mux-node-sdk/commit/7f0ba515ed66e8c42a07a7f5d4d34cfcc15d128b))
* fix formatting ([1bffd6c](https://github.com/muxinc/mux-node-sdk/commit/1bffd6c7a3bf355b726baa3e41efa46f360b4885))
* fix naming of mcpb file ([#621](https://github.com/muxinc/mux-node-sdk/issues/621)) ([82e3c03](https://github.com/muxinc/mux-node-sdk/commit/82e3c03c15462609c63af38c3f9b11b481cbe09a))
* **format:** run eslint and prettier separately ([073dc3d](https://github.com/muxinc/mux-node-sdk/commit/073dc3de0c14102342f35ab0610c633661d53fe9))
* **formatter:** run prettier and eslint separately ([c9751c7](https://github.com/muxinc/mux-node-sdk/commit/c9751c71b8c350b68f92f20157d40e8c3c91a79a))
* **internal:** codegen related update ([69b49ec](https://github.com/muxinc/mux-node-sdk/commit/69b49ec9595df6de8f40446e3faabea29f8d5840))
* **internal:** codegen related update ([d01b4ba](https://github.com/muxinc/mux-node-sdk/commit/d01b4bafa9c5a3344c46a43ceadc88960e6efb90))
* **internal:** fix MCP cloudflare worker builds ([42982d4](https://github.com/muxinc/mux-node-sdk/commit/42982d47a63272df80d7ac846063d4181469310a))
* **internal:** fix MCP cloudflare worker initialization ([2f836ee](https://github.com/muxinc/mux-node-sdk/commit/2f836eee76546c4483e0c0b2c976befd485b6cf0))
* **internal:** more robust bootstrap script ([6b8de5a](https://github.com/muxinc/mux-node-sdk/commit/6b8de5af6fcda143d3e26dd94aafe11afb355f2a))
* **internal:** update docs ordering ([53fba06](https://github.com/muxinc/mux-node-sdk/commit/53fba06e3d6e41c704e492319eb2dca9dcf0efb9))
* redact api-key headers in debug logs ([8cbd26c](https://github.com/muxinc/mux-node-sdk/commit/8cbd26c66dc9a1c5ab53bbb4f2f7b5be0601cda9))
* restructure docs search code ([4191d7b](https://github.com/muxinc/mux-node-sdk/commit/4191d7bea19dafc1870997fd7e06a262a3a43af9))


### Documentation

* clarify forwards compat behavior ([29ee4d8](https://github.com/muxinc/mux-node-sdk/commit/29ee4d84bcab46ae246edd1f5458bc9dcb9dd198))
* update http mcp docs ([00785ec](https://github.com/muxinc/mux-node-sdk/commit/00785ec5fefcf60e35b53768e32322fc9121d97a))
* update logging docs ([5ee4c64](https://github.com/muxinc/mux-node-sdk/commit/5ee4c64e1553797aced31217f2f33e162f910ce1))
* update with proxy auth info ([a72ca69](https://github.com/muxinc/mux-node-sdk/commit/a72ca6986d407ba953cb5bb7bc54bd5ef264e6d9))

## 14.0.1 (2026-04-20)

Full Changelog: [v14.0.0...v14.0.1](https://github.com/muxinc/mux-node-sdk/compare/v14.0.0...v14.0.1)

### Bug Fixes

* fix issue where node crypto was required for non-node runtimes

### Chores

* **tests:** bump steady to v0.22.1 ([869f2bc](https://github.com/muxinc/mux-node-sdk/commit/869f2bcf3767abf5cb6adb79e49ca4c038d78056))
* update robots docs for 30-day job availability ([#411](https://github.com/muxinc/mux-node-sdk/issues/411)) ([786b1e8](https://github.com/muxinc/mux-node-sdk/commit/786b1e8e8db383527fe6e080369f677149b5b14c))
* use webcrypto rather than node crypto ([#619](https://github.com/muxinc/mux-node-sdk/issues/619)) ([acef073](https://github.com/muxinc/mux-node-sdk/commit/acef07315b4b9590c3b599ff62b519475b250323))

## 14.0.0 (2026-04-16)

Full Changelog: [v12.2.0...v14.0.0](https://github.com/muxinc/mux-node-sdk/compare/v12.2.0...v14.0.0)

### Chores

* fix mcp naming ([5355ccc](https://github.com/muxinc/mux-node-sdk/commit/5355ccc411add5c9dd5cfd8e08f691ede9e75b0f))
* publish typescript generator ([0ed5b1c](https://github.com/muxinc/mux-node-sdk/commit/0ed5b1c37f2f2c49d5dd0dbd4164ca67d0e6707e))
* sync repo ([1784c78](https://github.com/muxinc/mux-node-sdk/commit/1784c78531f0afa3f52dad3d27dfea9883c7581a))

## 8.2.3 (2024-03-25)

Full Changelog: [v8.2.2...v8.2.3](https://github.com/muxinc/mux-node-sdk/compare/v8.2.2...v8.2.3)

### Bug Fixes

* **client:** correctly send deno version header ([#356](https://github.com/muxinc/mux-node-sdk/issues/356)) ([adf845e](https://github.com/muxinc/mux-node-sdk/commit/adf845ec2189de870d7643d4624e1d3c7f0b26b7))

## 8.2.2 (2024-03-21)

Full Changelog: [v8.2.1...v8.2.2](https://github.com/muxinc/mux-node-sdk/compare/v8.2.1...v8.2.2)

### Bug Fixes

* handle process.env being undefined in debug func ([#354](https://github.com/muxinc/mux-node-sdk/issues/354)) ([e8ce1fb](https://github.com/muxinc/mux-node-sdk/commit/e8ce1fb7d8950681dcb47abc2ebc835db1de6697))


### Documentation

* **readme:** consistent use of sentence case in headings ([#351](https://github.com/muxinc/mux-node-sdk/issues/351)) ([7b4a1ec](https://github.com/muxinc/mux-node-sdk/commit/7b4a1ec8f778ae2298a229782f03ce69c7eeb1b8))
* **readme:** document how to make undocumented requests ([#353](https://github.com/muxinc/mux-node-sdk/issues/353)) ([8c49b9c](https://github.com/muxinc/mux-node-sdk/commit/8c49b9cafbda4ddd987a72835655dd007be5a122))

## 8.2.1 (2024-03-19)

Full Changelog: [v8.2.0...v8.2.1](https://github.com/muxinc/mux-node-sdk/compare/v8.2.0...v8.2.1)

### Bug Fixes

* **internal:** make toFile use input file's options ([#350](https://github.com/muxinc/mux-node-sdk/issues/350)) ([ff05172](https://github.com/muxinc/mux-node-sdk/commit/ff051721d608082e14e3688b684b5e5dbe6f5ff7))


### Chores

* **internal:** update generated pragma comment ([#349](https://github.com/muxinc/mux-node-sdk/issues/349)) ([a7472a7](https://github.com/muxinc/mux-node-sdk/commit/a7472a744ca45e29ef24879c4e9fc63838b02712))


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
