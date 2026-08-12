// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { McpOptions } from './options';

export type SdkMethod = {
  clientCallName: string;
  fullyQualifiedName: string;
  httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'query';
  httpPath?: string;
};

export const sdkMethods: SdkMethod[] = [
  {
    clientCallName: 'client.video.assets.create',
    fullyQualifiedName: 'video.assets.create',
    httpMethod: 'post',
    httpPath: '/video/v1/assets',
  },
  {
    clientCallName: 'client.video.assets.list',
    fullyQualifiedName: 'video.assets.list',
    httpMethod: 'get',
    httpPath: '/video/v1/assets',
  },
  {
    clientCallName: 'client.video.assets.retrieve',
    fullyQualifiedName: 'video.assets.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/assets/{ASSET_ID}',
  },
  {
    clientCallName: 'client.video.assets.delete',
    fullyQualifiedName: 'video.assets.delete',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}',
  },
  {
    clientCallName: 'client.video.assets.update',
    fullyQualifiedName: 'video.assets.update',
    httpMethod: 'patch',
    httpPath: '/video/v1/assets/{ASSET_ID}',
  },
  {
    clientCallName: 'client.video.assets.retrievePlaybackId',
    fullyQualifiedName: 'video.assets.retrievePlaybackId',
    httpMethod: 'get',
    httpPath: '/video/v1/assets/{ASSET_ID}/playback-ids/{PLAYBACK_ID}',
  },
  {
    clientCallName: 'client.video.assets.createPlaybackId',
    fullyQualifiedName: 'video.assets.createPlaybackId',
    httpMethod: 'post',
    httpPath: '/video/v1/assets/{ASSET_ID}/playback-ids',
  },
  {
    clientCallName: 'client.video.assets.deletePlaybackId',
    fullyQualifiedName: 'video.assets.deletePlaybackId',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}/playback-ids/{PLAYBACK_ID}',
  },
  {
    clientCallName: 'client.video.assets.createTrack',
    fullyQualifiedName: 'video.assets.createTrack',
    httpMethod: 'post',
    httpPath: '/video/v1/assets/{ASSET_ID}/tracks',
  },
  {
    clientCallName: 'client.video.assets.deleteTrack',
    fullyQualifiedName: 'video.assets.deleteTrack',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}',
  },
  {
    clientCallName: 'client.video.assets.updateTrack',
    fullyQualifiedName: 'video.assets.updateTrack',
    httpMethod: 'patch',
    httpPath: '/video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}',
  },
  {
    clientCallName: 'client.video.assets.generateSubtitles',
    fullyQualifiedName: 'video.assets.generateSubtitles',
    httpMethod: 'post',
    httpPath: '/video/v1/assets/{ASSET_ID}/tracks/{TRACK_ID}/generate-subtitles',
  },
  {
    clientCallName: 'client.video.assets.retrieveInputInfo',
    fullyQualifiedName: 'video.assets.retrieveInputInfo',
    httpMethod: 'get',
    httpPath: '/video/v1/assets/{ASSET_ID}/input-info',
  },
  {
    clientCallName: 'client.video.assets.updateMP4Support',
    fullyQualifiedName: 'video.assets.updateMP4Support',
    httpMethod: 'put',
    httpPath: '/video/v1/assets/{ASSET_ID}/mp4-support',
  },
  {
    clientCallName: 'client.video.assets.updateMasterAccess',
    fullyQualifiedName: 'video.assets.updateMasterAccess',
    httpMethod: 'put',
    httpPath: '/video/v1/assets/{ASSET_ID}/master-access',
  },
  {
    clientCallName: 'client.video.assets.createStaticRendition',
    fullyQualifiedName: 'video.assets.createStaticRendition',
    httpMethod: 'post',
    httpPath: '/video/v1/assets/{ASSET_ID}/static-renditions',
  },
  {
    clientCallName: 'client.video.assets.deleteStaticRendition',
    fullyQualifiedName: 'video.assets.deleteStaticRendition',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}/static-renditions/{STATIC_RENDITION_ID}',
  },
  {
    clientCallName: 'client.video.assets.retrieveShots',
    fullyQualifiedName: 'video.assets.retrieveShots',
    httpMethod: 'get',
    httpPath: '/video/v1/assets/{ASSET_ID}/shots',
  },
  {
    clientCallName: 'client.video.assets.generateShots',
    fullyQualifiedName: 'video.assets.generateShots',
    httpMethod: 'post',
    httpPath: '/video/v1/assets/{ASSET_ID}/shots',
  },
  {
    clientCallName: 'client.video.assets.deleteShots',
    fullyQualifiedName: 'video.assets.deleteShots',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}/shots',
  },
  {
    clientCallName: 'client.video.assets.deleteThumbnailTime',
    fullyQualifiedName: 'video.assets.deleteThumbnailTime',
    httpMethod: 'delete',
    httpPath: '/video/v1/assets/{ASSET_ID}/thumbnail-time',
  },
  {
    clientCallName: 'client.video.deliveryUsage.list',
    fullyQualifiedName: 'video.deliveryUsage.list',
    httpMethod: 'get',
    httpPath: '/video/v1/delivery-usage',
  },
  {
    clientCallName: 'client.video.liveStreams.create',
    fullyQualifiedName: 'video.liveStreams.create',
    httpMethod: 'post',
    httpPath: '/video/v1/live-streams',
  },
  {
    clientCallName: 'client.video.liveStreams.list',
    fullyQualifiedName: 'video.liveStreams.list',
    httpMethod: 'get',
    httpPath: '/video/v1/live-streams',
  },
  {
    clientCallName: 'client.video.liveStreams.retrieve',
    fullyQualifiedName: 'video.liveStreams.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.delete',
    fullyQualifiedName: 'video.liveStreams.delete',
    httpMethod: 'delete',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.update',
    fullyQualifiedName: 'video.liveStreams.update',
    httpMethod: 'patch',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.createPlaybackId',
    fullyQualifiedName: 'video.liveStreams.createPlaybackId',
    httpMethod: 'post',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids',
  },
  {
    clientCallName: 'client.video.liveStreams.retrievePlaybackId',
    fullyQualifiedName: 'video.liveStreams.retrievePlaybackId',
    httpMethod: 'get',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids/{PLAYBACK_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.deletePlaybackId',
    fullyQualifiedName: 'video.liveStreams.deletePlaybackId',
    httpMethod: 'delete',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/playback-ids/{PLAYBACK_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.resetStreamKey',
    fullyQualifiedName: 'video.liveStreams.resetStreamKey',
    httpMethod: 'post',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/reset-stream-key',
  },
  {
    clientCallName: 'client.video.liveStreams.complete',
    fullyQualifiedName: 'video.liveStreams.complete',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/complete',
  },
  {
    clientCallName: 'client.video.liveStreams.disable',
    fullyQualifiedName: 'video.liveStreams.disable',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/disable',
  },
  {
    clientCallName: 'client.video.liveStreams.enable',
    fullyQualifiedName: 'video.liveStreams.enable',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/enable',
  },
  {
    clientCallName: 'client.video.liveStreams.updateEmbeddedSubtitles',
    fullyQualifiedName: 'video.liveStreams.updateEmbeddedSubtitles',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/embedded-subtitles',
  },
  {
    clientCallName: 'client.video.liveStreams.updateGeneratedSubtitles',
    fullyQualifiedName: 'video.liveStreams.updateGeneratedSubtitles',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/generated-subtitles',
  },
  {
    clientCallName: 'client.video.liveStreams.createSimulcastTarget',
    fullyQualifiedName: 'video.liveStreams.createSimulcastTarget',
    httpMethod: 'post',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets',
  },
  {
    clientCallName: 'client.video.liveStreams.deleteSimulcastTarget',
    fullyQualifiedName: 'video.liveStreams.deleteSimulcastTarget',
    httpMethod: 'delete',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets/{SIMULCAST_TARGET_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.retrieveSimulcastTarget',
    fullyQualifiedName: 'video.liveStreams.retrieveSimulcastTarget',
    httpMethod: 'get',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/simulcast-targets/{SIMULCAST_TARGET_ID}',
  },
  {
    clientCallName: 'client.video.liveStreams.updateNewAssetSettingsStaticRenditions',
    fullyQualifiedName: 'video.liveStreams.updateNewAssetSettingsStaticRenditions',
    httpMethod: 'put',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/new-asset-settings/static-renditions',
  },
  {
    clientCallName: 'client.video.liveStreams.deleteNewAssetSettingsStaticRenditions',
    fullyQualifiedName: 'video.liveStreams.deleteNewAssetSettingsStaticRenditions',
    httpMethod: 'delete',
    httpPath: '/video/v1/live-streams/{LIVE_STREAM_ID}/new-asset-settings/static-renditions',
  },
  {
    clientCallName: 'client.video.playbackIds.retrieve',
    fullyQualifiedName: 'video.playbackIds.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/playback-ids/{PLAYBACK_ID}',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.create',
    fullyQualifiedName: 'video.playbackRestrictions.create',
    httpMethod: 'post',
    httpPath: '/video/v1/playback-restrictions',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.list',
    fullyQualifiedName: 'video.playbackRestrictions.list',
    httpMethod: 'get',
    httpPath: '/video/v1/playback-restrictions',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.delete',
    fullyQualifiedName: 'video.playbackRestrictions.delete',
    httpMethod: 'delete',
    httpPath: '/video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.retrieve',
    fullyQualifiedName: 'video.playbackRestrictions.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.updateReferrer',
    fullyQualifiedName: 'video.playbackRestrictions.updateReferrer',
    httpMethod: 'put',
    httpPath: '/video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}/referrer',
  },
  {
    clientCallName: 'client.video.playbackRestrictions.updateUserAgent',
    fullyQualifiedName: 'video.playbackRestrictions.updateUserAgent',
    httpMethod: 'put',
    httpPath: '/video/v1/playback-restrictions/{PLAYBACK_RESTRICTION_ID}/user_agent',
  },
  {
    clientCallName: 'client.video.transcriptionVocabularies.retrieve',
    fullyQualifiedName: 'video.transcriptionVocabularies.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}',
  },
  {
    clientCallName: 'client.video.transcriptionVocabularies.create',
    fullyQualifiedName: 'video.transcriptionVocabularies.create',
    httpMethod: 'post',
    httpPath: '/video/v1/transcription-vocabularies',
  },
  {
    clientCallName: 'client.video.transcriptionVocabularies.delete',
    fullyQualifiedName: 'video.transcriptionVocabularies.delete',
    httpMethod: 'delete',
    httpPath: '/video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}',
  },
  {
    clientCallName: 'client.video.transcriptionVocabularies.update',
    fullyQualifiedName: 'video.transcriptionVocabularies.update',
    httpMethod: 'put',
    httpPath: '/video/v1/transcription-vocabularies/{TRANSCRIPTION_VOCABULARY_ID}',
  },
  {
    clientCallName: 'client.video.transcriptionVocabularies.list',
    fullyQualifiedName: 'video.transcriptionVocabularies.list',
    httpMethod: 'get',
    httpPath: '/video/v1/transcription-vocabularies',
  },
  {
    clientCallName: 'client.video.uploads.create',
    fullyQualifiedName: 'video.uploads.create',
    httpMethod: 'post',
    httpPath: '/video/v1/uploads',
  },
  {
    clientCallName: 'client.video.uploads.retrieve',
    fullyQualifiedName: 'video.uploads.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/uploads/{UPLOAD_ID}',
  },
  {
    clientCallName: 'client.video.uploads.cancel',
    fullyQualifiedName: 'video.uploads.cancel',
    httpMethod: 'put',
    httpPath: '/video/v1/uploads/{UPLOAD_ID}/cancel',
  },
  {
    clientCallName: 'client.video.uploads.list',
    fullyQualifiedName: 'video.uploads.list',
    httpMethod: 'get',
    httpPath: '/video/v1/uploads',
  },
  {
    clientCallName: 'client.video.drmConfigurations.list',
    fullyQualifiedName: 'video.drmConfigurations.list',
    httpMethod: 'get',
    httpPath: '/video/v1/drm-configurations',
  },
  {
    clientCallName: 'client.video.drmConfigurations.retrieve',
    fullyQualifiedName: 'video.drmConfigurations.retrieve',
    httpMethod: 'get',
    httpPath: '/video/v1/drm-configurations/{DRM_CONFIGURATION_ID}',
  },
  {
    clientCallName: 'client.video.playback.thumbnail',
    fullyQualifiedName: 'video.playback.thumbnail',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/thumbnail.{EXTENSION}',
  },
  {
    clientCallName: 'client.video.playback.animated',
    fullyQualifiedName: 'video.playback.animated',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/animated.{EXTENSION}',
  },
  {
    clientCallName: 'client.video.playback.storyboard',
    fullyQualifiedName: 'video.playback.storyboard',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/storyboard.{EXTENSION}',
  },
  {
    clientCallName: 'client.video.playback.storyboardVtt',
    fullyQualifiedName: 'video.playback.storyboardVtt',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/storyboard.vtt',
  },
  {
    clientCallName: 'client.video.playback.storyboardMeta',
    fullyQualifiedName: 'video.playback.storyboardMeta',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/storyboard.json',
  },
  {
    clientCallName: 'client.video.playback.hls',
    fullyQualifiedName: 'video.playback.hls',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}.m3u8',
  },
  {
    clientCallName: 'client.video.playback.staticRendition',
    fullyQualifiedName: 'video.playback.staticRendition',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/{FILENAME}',
  },
  {
    clientCallName: 'client.video.playback.track',
    fullyQualifiedName: 'video.playback.track',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/text/{TRACK_ID}.vtt',
  },
  {
    clientCallName: 'client.video.playback.transcript',
    fullyQualifiedName: 'video.playback.transcript',
    httpMethod: 'get',
    httpPath: '/{PLAYBACK_ID}/text/{TRACK_ID}.txt',
  },
  {
    clientCallName: 'client.robots.jobs.list',
    fullyQualifiedName: 'robots.jobs.list',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs',
  },
  {
    clientCallName: 'client.robots.jobs.cancel',
    fullyQualifiedName: 'robots.jobs.cancel',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/{JOB_ID}/cancel',
  },
  {
    clientCallName: 'client.robots.jobs.askQuestions.create',
    fullyQualifiedName: 'robots.jobs.askQuestions.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/ask-questions',
  },
  {
    clientCallName: 'client.robots.jobs.askQuestions.retrieve',
    fullyQualifiedName: 'robots.jobs.askQuestions.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/ask-questions/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.generateChapters.create',
    fullyQualifiedName: 'robots.jobs.generateChapters.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/generate-chapters',
  },
  {
    clientCallName: 'client.robots.jobs.generateChapters.retrieve',
    fullyQualifiedName: 'robots.jobs.generateChapters.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/generate-chapters/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.findKeyMoments.create',
    fullyQualifiedName: 'robots.jobs.findKeyMoments.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/find-key-moments',
  },
  {
    clientCallName: 'client.robots.jobs.findKeyMoments.retrieve',
    fullyQualifiedName: 'robots.jobs.findKeyMoments.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/find-key-moments/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.moderate.create',
    fullyQualifiedName: 'robots.jobs.moderate.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/moderate',
  },
  {
    clientCallName: 'client.robots.jobs.moderate.retrieve',
    fullyQualifiedName: 'robots.jobs.moderate.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/moderate/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.summarize.create',
    fullyQualifiedName: 'robots.jobs.summarize.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/summarize',
  },
  {
    clientCallName: 'client.robots.jobs.summarize.retrieve',
    fullyQualifiedName: 'robots.jobs.summarize.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/summarize/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.translateCaptions.create',
    fullyQualifiedName: 'robots.jobs.translateCaptions.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/translate-captions',
  },
  {
    clientCallName: 'client.robots.jobs.translateCaptions.retrieve',
    fullyQualifiedName: 'robots.jobs.translateCaptions.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/translate-captions/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.editCaptions.create',
    fullyQualifiedName: 'robots.jobs.editCaptions.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/edit-captions',
  },
  {
    clientCallName: 'client.robots.jobs.editCaptions.retrieve',
    fullyQualifiedName: 'robots.jobs.editCaptions.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/edit-captions/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.findBestThumbnails.create',
    fullyQualifiedName: 'robots.jobs.findBestThumbnails.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/find-best-thumbnails',
  },
  {
    clientCallName: 'client.robots.jobs.findBestThumbnails.retrieve',
    fullyQualifiedName: 'robots.jobs.findBestThumbnails.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/find-best-thumbnails/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.findScenes.create',
    fullyQualifiedName: 'robots.jobs.findScenes.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/find-scenes',
  },
  {
    clientCallName: 'client.robots.jobs.findScenes.retrieve',
    fullyQualifiedName: 'robots.jobs.findScenes.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/find-scenes/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.generateEngagementInsights.create',
    fullyQualifiedName: 'robots.jobs.generateEngagementInsights.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/generate-engagement-insights',
  },
  {
    clientCallName: 'client.robots.jobs.generateEngagementInsights.retrieve',
    fullyQualifiedName: 'robots.jobs.generateEngagementInsights.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/generate-engagement-insights/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.generatePremiumCaptions.create',
    fullyQualifiedName: 'robots.jobs.generatePremiumCaptions.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/generate-premium-captions',
  },
  {
    clientCallName: 'client.robots.jobs.generatePremiumCaptions.retrieve',
    fullyQualifiedName: 'robots.jobs.generatePremiumCaptions.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/generate-premium-captions/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.jobs.translateAudio.create',
    fullyQualifiedName: 'robots.jobs.translateAudio.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/jobs/translate-audio',
  },
  {
    clientCallName: 'client.robots.jobs.translateAudio.retrieve',
    fullyQualifiedName: 'robots.jobs.translateAudio.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/jobs/translate-audio/{JOB_ID}',
  },
  {
    clientCallName: 'client.robots.directives.create',
    fullyQualifiedName: 'robots.directives.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/directives',
  },
  {
    clientCallName: 'client.robots.directives.list',
    fullyQualifiedName: 'robots.directives.list',
    httpMethod: 'get',
    httpPath: '/robots/v0/directives',
  },
  {
    clientCallName: 'client.robots.directives.retrieve',
    fullyQualifiedName: 'robots.directives.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/directives/{DIRECTIVE_ID}',
  },
  {
    clientCallName: 'client.robots.directives.delete',
    fullyQualifiedName: 'robots.directives.delete',
    httpMethod: 'delete',
    httpPath: '/robots/v0/directives/{DIRECTIVE_ID}',
  },
  {
    clientCallName: 'client.robots.directives.runs.create',
    fullyQualifiedName: 'robots.directives.runs.create',
    httpMethod: 'post',
    httpPath: '/robots/v0/directives/{DIRECTIVE_ID}/runs',
  },
  {
    clientCallName: 'client.robots.directives.runs.list',
    fullyQualifiedName: 'robots.directives.runs.list',
    httpMethod: 'get',
    httpPath: '/robots/v0/directives/{DIRECTIVE_ID}/runs',
  },
  {
    clientCallName: 'client.robots.directives.runs.retrieve',
    fullyQualifiedName: 'robots.directives.runs.retrieve',
    httpMethod: 'get',
    httpPath: '/robots/v0/directives/{DIRECTIVE_ID}/runs/{RUN_ID}',
  },
  {
    clientCallName: 'client.data.dimensions.list',
    fullyQualifiedName: 'data.dimensions.list',
    httpMethod: 'get',
    httpPath: '/data/v1/dimensions',
  },
  {
    clientCallName: 'client.data.dimensions.listValues',
    fullyQualifiedName: 'data.dimensions.listValues',
    httpMethod: 'get',
    httpPath: '/data/v1/dimensions/{DIMENSION_ID}',
  },
  {
    clientCallName: 'client.data.dimensions.listTraceElements',
    fullyQualifiedName: 'data.dimensions.listTraceElements',
    httpMethod: 'get',
    httpPath: '/data/v1/dimensions/{DIMENSION_ID}/elements',
  },
  {
    clientCallName: 'client.data.monitoring.listDimensions',
    fullyQualifiedName: 'data.monitoring.listDimensions',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/dimensions',
  },
  {
    clientCallName: 'client.data.monitoring.metrics.list',
    fullyQualifiedName: 'data.monitoring.metrics.list',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/metrics',
  },
  {
    clientCallName: 'client.data.monitoring.metrics.getBreakdown',
    fullyQualifiedName: 'data.monitoring.metrics.getBreakdown',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/breakdown',
  },
  {
    clientCallName: 'client.data.monitoring.metrics.getTimeseries',
    fullyQualifiedName: 'data.monitoring.metrics.getTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/timeseries',
  },
  {
    clientCallName: 'client.data.monitoring.metrics.getBreakdownTimeseries',
    fullyQualifiedName: 'data.monitoring.metrics.getBreakdownTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/breakdown-timeseries',
  },
  {
    clientCallName: 'client.data.monitoring.metrics.getHistogramTimeseries',
    fullyQualifiedName: 'data.monitoring.metrics.getHistogramTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/monitoring/metrics/{MONITORING_HISTOGRAM_METRIC_ID}/histogram-timeseries',
  },
  {
    clientCallName: 'client.data.errors.list',
    fullyQualifiedName: 'data.errors.list',
    httpMethod: 'get',
    httpPath: '/data/v1/errors',
  },
  {
    clientCallName: 'client.data.exports.listVideoViews',
    fullyQualifiedName: 'data.exports.listVideoViews',
    httpMethod: 'get',
    httpPath: '/data/v1/exports/views',
  },
  {
    clientCallName: 'client.data.incidents.retrieve',
    fullyQualifiedName: 'data.incidents.retrieve',
    httpMethod: 'get',
    httpPath: '/data/v1/incidents/{INCIDENT_ID}',
  },
  {
    clientCallName: 'client.data.incidents.listRelated',
    fullyQualifiedName: 'data.incidents.listRelated',
    httpMethod: 'get',
    httpPath: '/data/v1/incidents/{INCIDENT_ID}/related',
  },
  {
    clientCallName: 'client.data.incidents.list',
    fullyQualifiedName: 'data.incidents.list',
    httpMethod: 'get',
    httpPath: '/data/v1/incidents',
  },
  {
    clientCallName: 'client.data.metrics.list',
    fullyQualifiedName: 'data.metrics.list',
    httpMethod: 'get',
    httpPath: '/data/v1/metrics/comparison',
  },
  {
    clientCallName: 'client.data.metrics.listBreakdownValues',
    fullyQualifiedName: 'data.metrics.listBreakdownValues',
    httpMethod: 'get',
    httpPath: '/data/v1/metrics/{METRIC_ID}/breakdown',
  },
  {
    clientCallName: 'client.data.metrics.getOverallValues',
    fullyQualifiedName: 'data.metrics.getOverallValues',
    httpMethod: 'get',
    httpPath: '/data/v1/metrics/{METRIC_ID}/overall',
  },
  {
    clientCallName: 'client.data.metrics.getInsights',
    fullyQualifiedName: 'data.metrics.getInsights',
    httpMethod: 'get',
    httpPath: '/data/v1/metrics/{METRIC_ID}/insights',
  },
  {
    clientCallName: 'client.data.metrics.getTimeseries',
    fullyQualifiedName: 'data.metrics.getTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/metrics/{METRIC_ID}/timeseries',
  },
  {
    clientCallName: 'client.data.realTime.retrieveBreakdown',
    fullyQualifiedName: 'data.realTime.retrieveBreakdown',
    httpMethod: 'get',
    httpPath: '/data/v1/realtime/metrics/{REALTIME_METRIC_ID}/breakdown',
  },
  {
    clientCallName: 'client.data.realTime.retrieveTimeseries',
    fullyQualifiedName: 'data.realTime.retrieveTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/realtime/metrics/{REALTIME_METRIC_ID}/timeseries',
  },
  {
    clientCallName: 'client.data.realTime.listMetrics',
    fullyQualifiedName: 'data.realTime.listMetrics',
    httpMethod: 'get',
    httpPath: '/data/v1/realtime/metrics',
  },
  {
    clientCallName: 'client.data.realTime.retrieveHistogramTimeseries',
    fullyQualifiedName: 'data.realTime.retrieveHistogramTimeseries',
    httpMethod: 'get',
    httpPath: '/data/v1/realtime/metrics/{REALTIME_HISTOGRAM_METRIC_ID}/histogram-timeseries',
  },
  {
    clientCallName: 'client.data.realTime.listDimensions',
    fullyQualifiedName: 'data.realTime.listDimensions',
    httpMethod: 'get',
    httpPath: '/data/v1/realtime/dimensions',
  },
  {
    clientCallName: 'client.data.videoViews.list',
    fullyQualifiedName: 'data.videoViews.list',
    httpMethod: 'get',
    httpPath: '/data/v1/video-views',
  },
  {
    clientCallName: 'client.data.videoViews.retrieve',
    fullyQualifiedName: 'data.videoViews.retrieve',
    httpMethod: 'get',
    httpPath: '/data/v1/video-views/{VIDEO_VIEW_ID}',
  },
  {
    clientCallName: 'client.data.annotations.list',
    fullyQualifiedName: 'data.annotations.list',
    httpMethod: 'get',
    httpPath: '/data/v1/annotations',
  },
  {
    clientCallName: 'client.data.annotations.retrieve',
    fullyQualifiedName: 'data.annotations.retrieve',
    httpMethod: 'get',
    httpPath: '/data/v1/annotations/{ANNOTATION_ID}',
  },
  {
    clientCallName: 'client.data.annotations.create',
    fullyQualifiedName: 'data.annotations.create',
    httpMethod: 'post',
    httpPath: '/data/v1/annotations',
  },
  {
    clientCallName: 'client.data.annotations.delete',
    fullyQualifiedName: 'data.annotations.delete',
    httpMethod: 'delete',
    httpPath: '/data/v1/annotations/{ANNOTATION_ID}',
  },
  {
    clientCallName: 'client.data.annotations.update',
    fullyQualifiedName: 'data.annotations.update',
    httpMethod: 'patch',
    httpPath: '/data/v1/annotations/{ANNOTATION_ID}',
  },
  {
    clientCallName: 'client.data.engagement.assets.heatmap',
    fullyQualifiedName: 'data.engagement.assets.heatmap',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/assets/{ASSET_ID}/heatmap',
  },
  {
    clientCallName: 'client.data.engagement.assets.hotspots',
    fullyQualifiedName: 'data.engagement.assets.hotspots',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/assets/{ASSET_ID}/hotspots',
  },
  {
    clientCallName: 'client.data.engagement.playbackIds.heatmap',
    fullyQualifiedName: 'data.engagement.playbackIds.heatmap',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/playback-ids/{PLAYBACK_ID}/heatmap',
  },
  {
    clientCallName: 'client.data.engagement.playbackIds.hotspots',
    fullyQualifiedName: 'data.engagement.playbackIds.hotspots',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/playback-ids/{PLAYBACK_ID}/hotspots',
  },
  {
    clientCallName: 'client.data.engagement.videos.heatmap',
    fullyQualifiedName: 'data.engagement.videos.heatmap',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/videos/{VIDEO_ID}/heatmap',
  },
  {
    clientCallName: 'client.data.engagement.videos.hotspots',
    fullyQualifiedName: 'data.engagement.videos.hotspots',
    httpMethod: 'get',
    httpPath: '/data/v1/engagement/videos/{VIDEO_ID}/hotspots',
  },
  {
    clientCallName: 'client.system.signingKeys.create',
    fullyQualifiedName: 'system.signingKeys.create',
    httpMethod: 'post',
    httpPath: '/system/v1/signing-keys',
  },
  {
    clientCallName: 'client.system.signingKeys.list',
    fullyQualifiedName: 'system.signingKeys.list',
    httpMethod: 'get',
    httpPath: '/system/v1/signing-keys',
  },
  {
    clientCallName: 'client.system.signingKeys.retrieve',
    fullyQualifiedName: 'system.signingKeys.retrieve',
    httpMethod: 'get',
    httpPath: '/system/v1/signing-keys/{SIGNING_KEY_ID}',
  },
  {
    clientCallName: 'client.system.signingKeys.delete',
    fullyQualifiedName: 'system.signingKeys.delete',
    httpMethod: 'delete',
    httpPath: '/system/v1/signing-keys/{SIGNING_KEY_ID}',
  },
  {
    clientCallName: 'client.system.utilities.whoami',
    fullyQualifiedName: 'system.utilities.whoami',
    httpMethod: 'get',
    httpPath: '/system/v1/whoami',
  },
  {
    clientCallName: 'client.system.usageExports.list',
    fullyQualifiedName: 'system.usageExports.list',
    httpMethod: 'get',
    httpPath: '/system/v1/usage/exports',
  },
  { clientCallName: 'client.webhooks.unwrap', fullyQualifiedName: 'webhooks.unwrap' },
];

function allowedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  if (!options) {
    return undefined;
  }

  let allowedMethods: SdkMethod[];

  if (options.codeAllowHttpGets || options.codeAllowedMethods) {
    // Start with nothing allowed and then add into it from options
    let allowedMethodsSet = new Set<SdkMethod>();

    if (options.codeAllowHttpGets) {
      // Add all methods that map to an HTTP GET
      sdkMethods
        .filter((method) => method.httpMethod === 'get')
        .forEach((method) => allowedMethodsSet.add(method));
    }

    if (options.codeAllowedMethods) {
      // Add all methods that match any of the allowed regexps
      const allowedRegexps = options.codeAllowedMethods.map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (e) {
          throw new Error(
            `Invalid regex pattern for allowed method: "${pattern}": ${e instanceof Error ? e.message : e}`,
          );
        }
      });

      sdkMethods
        .filter((method) => allowedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)))
        .forEach((method) => allowedMethodsSet.add(method));
    }

    allowedMethods = Array.from(allowedMethodsSet);
  } else {
    // Start with everything allowed
    allowedMethods = [...sdkMethods];
  }

  if (options.codeBlockedMethods) {
    // Filter down based on blocked regexps
    const blockedRegexps = options.codeBlockedMethods.map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch (e) {
        throw new Error(
          `Invalid regex pattern for blocked method: "${pattern}": ${e instanceof Error ? e.message : e}`,
        );
      }
    });

    allowedMethods = allowedMethods.filter(
      (method) => !blockedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)),
    );
  }

  return allowedMethods;
}

export function blockedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  const allowedMethods = allowedMethodsForCodeTool(options);
  if (!allowedMethods) {
    return undefined;
  }

  const allowedSet = new Set(allowedMethods.map((method) => method.fullyQualifiedName));

  // Return any methods that are not explicitly allowed
  return sdkMethods.filter((method) => !allowedSet.has(method.fullyQualifiedName));
}
