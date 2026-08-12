# Video

## Assets

Types:

- <code><a href="./src/resources/video/assets.ts">Asset</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetGeneratedSubtitleSettings</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetMetadata</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetOptions</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetProgress</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetResponse</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetShots</a></code>
- <code><a href="./src/resources/video/assets.ts">CreateStaticRenditionRequest</a></code>
- <code><a href="./src/resources/video/assets.ts">Directive</a></code>
- <code><a href="./src/resources/video/assets.ts">InputInfo</a></code>
- <code><a href="./src/resources/video/assets.ts">InputSettings</a></code>
- <code><a href="./src/resources/video/assets.ts">StaticRendition</a></code>
- <code><a href="./src/resources/video/assets.ts">Track</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetGenerateSubtitlesResponse</a></code>
- <code><a href="./src/resources/video/assets.ts">AssetRetrieveInputInfoResponse</a></code>

Methods:

- <code title="post /video/v1/assets">client.video.assets.<a href="./src/resources/video/assets.ts">create</a>({ ...params }) -> Asset</code>
- <code title="get /video/v1/assets">client.video.assets.<a href="./src/resources/video/assets.ts">list</a>({ ...params }) -> AssetsCursorPage</code>
- <code title="get /video/v1/assets/{ASSET_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">retrieve</a>(assetId) -> Asset</code>
- <code title="delete /video/v1/assets/{ASSET_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">delete</a>(assetId) -> void</code>
- <code title="patch /video/v1/assets/{ASSET_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">update</a>(assetId, { ...params }) -> Asset</code>
- <code title="get /video/v1/assets/{ASSET_ID}/playback-ids/{PLAYBACK_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">retrievePlaybackId</a>(assetId, playbackId) -> PlaybackId</code>
- <code title="post /video/v1/assets/{ASSET_ID}/playback-ids">client.video.assets.<a href="./src/resources/video/assets.ts">createPlaybackId</a>(assetId, { ...params }) -> PlaybackId</code>
- <code title="delete /video/v1/assets/{ASSET_ID}/playback-ids/{PLAYBACK_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">deletePlaybackId</a>(assetId, playbackId) -> void</code>
- <code title="post /video/v1/assets/{ASSET_ID}/tracks">client.video.assets.<a href="./src/resources/video/assets.ts">createTrack</a>(assetId, { ...params }) -> Track</code>
- <code title="delete /video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">deleteTrack</a>(assetId, trackId) -> void</code>
- <code title="patch /video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">updateTrack</a>(assetId, trackId, { ...params }) -> Track</code>
- <code title="post /video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}/generate-subtitles">client.video.assets.<a href="./src/resources/video/assets.ts">generateSubtitles</a>(assetId, trackId, { ...params }) -> AssetGenerateSubtitlesResponse</code>
- <code title="get /video/v1/assets/{ASSET_ID}/input-info">client.video.assets.<a href="./src/resources/video/assets.ts">retrieveInputInfo</a>(assetId) -> AssetRetrieveInputInfoResponse</code>
- <code title="put /video/v1/assets/{ASSET_ID}/mp4-support">client.video.assets.<a href="./src/resources/video/assets.ts">updateMP4Support</a>(assetId, { ...params }) -> Asset</code>
- <code title="put /video/v1/assets/{ASSET_ID}/master-access">client.video.assets.<a href="./src/resources/video/assets.ts">updateMasterAccess</a>(assetId, { ...params }) -> Asset</code>
- <code title="post /video/v1/assets/{ASSET_ID}/static-renditions">client.video.assets.<a href="./src/resources/video/assets.ts">createStaticRendition</a>(assetId, { ...params }) -> StaticRendition</code>
- <code title="delete /video/v1/assets/{ASSET_ID}/static-renditions/{STATIC_RENDITION_ID}">client.video.assets.<a href="./src/resources/video/assets.ts">deleteStaticRendition</a>(assetId, staticRenditionId) -> void</code>
- <code title="get /video/v1/assets/{ASSET_ID}/shots">client.video.assets.<a href="./src/resources/video/assets.ts">retrieveShots</a>(assetId) -> AssetShots</code>
- <code title="post /video/v1/assets/{ASSET_ID}/shots">client.video.assets.<a href="./src/resources/video/assets.ts">generateShots</a>(assetId) -> AssetShots</code>
- <code title="delete /video/v1/assets/{ASSET_ID}/shots">client.video.assets.<a href="./src/resources/video/assets.ts">deleteShots</a>(assetId) -> void</code>
- <code title="delete /video/v1/assets/{ASSET_ID}/thumbnail-time">client.video.assets.<a href="./src/resources/video/assets.ts">deleteThumbnailTime</a>(assetId) -> void</code>

## DeliveryUsage

Types:

- <code><a href="./src/resources/video/delivery-usage.ts">DeliveryReport</a></code>

Methods:

- <code title="get /video/v1/delivery-usage">client.video.deliveryUsage.<a href="./src/resources/video/delivery-usage.ts">list</a>({ ...params }) -> DeliveryReportsPageWithTimeframe</code>

## LiveStreams

Types:

- <code><a href="./src/resources/video/live-streams.ts">LiveStream</a></code>
- <code><a href="./src/resources/video/live-streams.ts">LiveStreamEmbeddedSubtitleSettings</a></code>
- <code><a href="./src/resources/video/live-streams.ts">LiveStreamGeneratedSubtitleSettings</a></code>
- <code><a href="./src/resources/video/live-streams.ts">LiveStreamMetadata</a></code>
- <code><a href="./src/resources/video/live-streams.ts">SimulcastTarget</a></code>

Methods:

- <code title="post /video/v1/live-streams">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">create</a>({ ...params }) -> LiveStream</code>
- <code title="get /video/v1/live-streams">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">list</a>({ ...params }) -> LiveStreamsBasePage</code>
- <code title="get /video/v1/live-streams/{LIVE_STREAM_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">retrieve</a>(liveStreamId) -> LiveStream</code>
- <code title="delete /video/v1/live-streams/{LIVE_STREAM_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">delete</a>(liveStreamId) -> void</code>
- <code title="patch /video/v1/live-streams/{LIVE_STREAM_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">update</a>(liveStreamId, { ...params }) -> LiveStream</code>
- <code title="post /video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">createPlaybackId</a>(liveStreamId, { ...params }) -> PlaybackId</code>
- <code title="get /video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids/{PLAYBACK_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">retrievePlaybackId</a>(liveStreamId, playbackId) -> PlaybackId</code>
- <code title="delete /video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids/{PLAYBACK_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">deletePlaybackId</a>(liveStreamId, playbackId) -> void</code>
- <code title="post /video/v1/live-streams/{LIVE_STREAM_ID}/reset-stream-key">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">resetStreamKey</a>(liveStreamId) -> LiveStream</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/complete">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">complete</a>(liveStreamId) -> void</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/disable">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">disable</a>(liveStreamId) -> void</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/enable">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">enable</a>(liveStreamId) -> void</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/embedded-subtitles">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">updateEmbeddedSubtitles</a>(liveStreamId, { ...params }) -> LiveStream</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/generated-subtitles">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">updateGeneratedSubtitles</a>(liveStreamId, { ...params }) -> LiveStream</code>
- <code title="post /video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">createSimulcastTarget</a>(liveStreamId, { ...params }) -> SimulcastTarget</code>
- <code title="delete /video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets/{SIMULCAST_TARGET_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">deleteSimulcastTarget</a>(liveStreamId, simulcastTargetId) -> void</code>
- <code title="get /video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets/{SIMULCAST_TARGET_ID}">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">retrieveSimulcastTarget</a>(liveStreamId, simulcastTargetId) -> SimulcastTarget</code>
- <code title="put /video/v1/live-streams/{LIVE_STREAM_ID}/new-asset-settings/static-renditions">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">updateNewAssetSettingsStaticRenditions</a>(liveStreamId, { ...params }) -> LiveStream</code>
- <code title="delete /video/v1/live-streams/{LIVE_STREAM_ID}/new-asset-settings/static-renditions">client.video.liveStreams.<a href="./src/resources/video/live-streams.ts">deleteNewAssetSettingsStaticRenditions</a>(liveStreamId) -> void</code>

## PlaybackIds

Types:

- <code><a href="./src/resources/video/playback-ids.ts">PlaybackIdsRetrieveResponse</a></code>

Methods:

- <code title="get /video/v1/playback-ids/{PLAYBACK_ID}">client.video.playbackIds.<a href="./src/resources/video/playback-ids.ts">retrieve</a>(playbackId) -> PlaybackIdsRetrieveResponse</code>

## PlaybackRestrictions

Types:

- <code><a href="./src/resources/video/playback-restrictions.ts">PlaybackRestriction</a></code>
- <code><a href="./src/resources/video/playback-restrictions.ts">PlaybackRestrictionResponse</a></code>
- <code><a href="./src/resources/video/playback-restrictions.ts">ReferrerDomainRestrictionSettings</a></code>
- <code><a href="./src/resources/video/playback-restrictions.ts">UserAgentRestrictionSettings</a></code>

Methods:

- <code title="post /video/v1/playback-restrictions">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">create</a>({ ...params }) -> PlaybackRestriction</code>
- <code title="get /video/v1/playback-restrictions">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">list</a>({ ...params }) -> PlaybackRestrictionsBasePage</code>
- <code title="delete /video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">delete</a>(playbackRestrictionID) -> void</code>
- <code title="get /video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">retrieve</a>(playbackRestrictionID) -> PlaybackRestriction</code>
- <code title="put /video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}/referrer">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">updateReferrer</a>(playbackRestrictionID, { ...params }) -> PlaybackRestriction</code>
- <code title="put /video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}/user_agent">client.video.playbackRestrictions.<a href="./src/resources/video/playback-restrictions.ts">updateUserAgent</a>(playbackRestrictionID, { ...params }) -> PlaybackRestriction</code>

## TranscriptionVocabularies

Types:

- <code><a href="./src/resources/video/transcription-vocabularies.ts">TranscriptionVocabulary</a></code>
- <code><a href="./src/resources/video/transcription-vocabularies.ts">TranscriptionVocabularyResponse</a></code>

Methods:

- <code title="get /video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}">client.video.transcriptionVocabularies.<a href="./src/resources/video/transcription-vocabularies.ts">retrieve</a>(transcriptionVocabularyID) -> TranscriptionVocabulary</code>
- <code title="post /video/v1/transcription-vocabularies">client.video.transcriptionVocabularies.<a href="./src/resources/video/transcription-vocabularies.ts">create</a>({ ...params }) -> TranscriptionVocabulary</code>
- <code title="delete /video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}">client.video.transcriptionVocabularies.<a href="./src/resources/video/transcription-vocabularies.ts">delete</a>(transcriptionVocabularyID) -> void</code>
- <code title="put /video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}">client.video.transcriptionVocabularies.<a href="./src/resources/video/transcription-vocabularies.ts">update</a>(transcriptionVocabularyID, { ...params }) -> TranscriptionVocabulary</code>
- <code title="get /video/v1/transcription-vocabularies">client.video.transcriptionVocabularies.<a href="./src/resources/video/transcription-vocabularies.ts">list</a>({ ...params }) -> TranscriptionVocabulariesBasePage</code>

## Uploads

Types:

- <code><a href="./src/resources/video/uploads.ts">Upload</a></code>
- <code><a href="./src/resources/video/uploads.ts">UploadResponse</a></code>

Methods:

- <code title="post /video/v1/uploads">client.video.uploads.<a href="./src/resources/video/uploads.ts">create</a>({ ...params }) -> Upload</code>
- <code title="get /video/v1/uploads/{UPLOAD_ID}">client.video.uploads.<a href="./src/resources/video/uploads.ts">retrieve</a>(uploadID) -> Upload</code>
- <code title="put /video/v1/uploads/{UPLOAD_ID}/cancel">client.video.uploads.<a href="./src/resources/video/uploads.ts">cancel</a>(uploadID) -> Upload</code>
- <code title="get /video/v1/uploads">client.video.uploads.<a href="./src/resources/video/uploads.ts">list</a>({ ...params }) -> UploadsBasePage</code>

## DRMConfigurations

Types:

- <code><a href="./src/resources/video/drm-configurations.ts">DRMConfiguration</a></code>

Methods:

- <code title="get /video/v1/drm-configurations">client.video.drmConfigurations.<a href="./src/resources/video/drm-configurations.ts">list</a>({ ...params }) -> DRMConfigurationsBasePage</code>
- <code title="get /video/v1/drm-configurations/{DRM_CONFIGURATION_ID}">client.video.drmConfigurations.<a href="./src/resources/video/drm-configurations.ts">retrieve</a>(drmConfigurationID) -> DRMConfiguration</code>

## Playback

Types:

- <code><a href="./src/resources/video/playback.ts">PlaybackStoryboardMetaResponse</a></code>
- <code><a href="./src/resources/video/playback.ts">PlaybackStoryboardVttResponse</a></code>
- <code><a href="./src/resources/video/playback.ts">PlaybackTrackResponse</a></code>
- <code><a href="./src/resources/video/playback.ts">PlaybackTranscriptResponse</a></code>

Methods:

- <code title="get /{PLAYBACK_ID}/thumbnail.{EXTENSION}">client.video.playback.<a href="./src/resources/video/playback.ts">thumbnail</a>(playbackId, extension, { ...params }) -> Response</code>
- <code title="get /{PLAYBACK_ID}/animated.{EXTENSION}">client.video.playback.<a href="./src/resources/video/playback.ts">animated</a>(playbackId, extension, { ...params }) -> Response</code>
- <code title="get /{PLAYBACK_ID}/storyboard.{EXTENSION}">client.video.playback.<a href="./src/resources/video/playback.ts">storyboard</a>(playbackId, extension, { ...params }) -> Response</code>
- <code title="get /{PLAYBACK_ID}/storyboard.vtt">client.video.playback.<a href="./src/resources/video/playback.ts">storyboardVtt</a>(playbackId, { ...params }) -> string</code>
- <code title="get /{PLAYBACK_ID}/storyboard.json">client.video.playback.<a href="./src/resources/video/playback.ts">storyboardMeta</a>(playbackId, { ...params }) -> string</code>
- <code title="get /{PLAYBACK_ID}.m3u8">client.video.playback.<a href="./src/resources/video/playback.ts">hls</a>(playbackId, { ...params }) -> Response</code>
- <code title="get /{PLAYBACK_ID}/{FILENAME}">client.video.playback.<a href="./src/resources/video/playback.ts">staticRendition</a>(playbackId, filename, { ...params }) -> Response</code>
- <code title="get /{PLAYBACK_ID}/text/{TRACK_ID}.vtt">client.video.playback.<a href="./src/resources/video/playback.ts">track</a>(playbackId, trackId, { ...params }) -> string</code>
- <code title="get /{PLAYBACK_ID}/text/{TRACK_ID}.txt">client.video.playback.<a href="./src/resources/video/playback.ts">transcript</a>(playbackId, trackId, { ...params }) -> string</code>
