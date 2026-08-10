// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import {
  Asset,
  AssetCreateParams,
  AssetCreatePlaybackIdParams,
  AssetCreateStaticRenditionParams,
  AssetCreateTrackParams,
  AssetGenerateShotsParams,
  AssetGenerateSubtitlesParams,
  AssetGenerateSubtitlesResponse,
  AssetGeneratedSubtitleSettings,
  AssetListParams,
  AssetMetadata,
  AssetOptions,
  AssetProgress,
  AssetResponse,
  AssetRetrieveInputInfoResponse,
  AssetShots,
  AssetUpdateMP4SupportParams,
  AssetUpdateMasterAccessParams,
  AssetUpdateParams,
  AssetUpdateTrackParams,
  Assets,
  AssetsCursorPage,
  CreateStaticRenditionRequest,
  Directive,
  InputInfo,
  InputSettings,
  StaticRendition,
  Track,
} from './assets';
import * as DeliveryUsageAPI from './delivery-usage';
import {
  DeliveryReport,
  DeliveryReportsPageWithTimeframe,
  DeliveryUsage,
  DeliveryUsageListParams,
} from './delivery-usage';
import * as DRMConfigurationsAPI from './drm-configurations';
import {
  DRMConfiguration,
  DRMConfigurationListParams,
  DRMConfigurations,
  DRMConfigurationsBasePage,
} from './drm-configurations';
import * as LiveStreamsAPI from './live-streams';
import {
  LiveStream,
  LiveStreamCreateParams,
  LiveStreamCreatePlaybackIdParams,
  LiveStreamCreateSimulcastTargetParams,
  LiveStreamEmbeddedSubtitleSettings,
  LiveStreamGeneratedSubtitleSettings,
  LiveStreamListParams,
  LiveStreamMetadata,
  LiveStreamUpdateEmbeddedSubtitlesParams,
  LiveStreamUpdateGeneratedSubtitlesParams,
  LiveStreamUpdateNewAssetSettingsStaticRenditionsParams,
  LiveStreamUpdateParams,
  LiveStreams,
  LiveStreamsBasePage,
  SimulcastTarget,
} from './live-streams';
import * as PlaybackAPI from './playback';
import {
  Playback,
  PlaybackAnimatedParams,
  PlaybackHlsParams,
  PlaybackStaticRenditionParams,
  PlaybackStoryboardMetaParams,
  PlaybackStoryboardMetaResponse,
  PlaybackStoryboardParams,
  PlaybackStoryboardVttParams,
  PlaybackStoryboardVttResponse,
  PlaybackThumbnailParams,
  PlaybackTrackParams,
  PlaybackTrackResponse,
  PlaybackTranscriptParams,
  PlaybackTranscriptResponse,
} from './playback';
import * as PlaybackIdsAPI from './playback-ids';
import { PlaybackIds, PlaybackIdsRetrieveResponse } from './playback-ids';
import * as PlaybackRestrictionsAPI from './playback-restrictions';
import {
  PlaybackRestriction,
  PlaybackRestrictionCreateParams,
  PlaybackRestrictionListParams,
  PlaybackRestrictionResponse,
  PlaybackRestrictionUpdateReferrerParams,
  PlaybackRestrictionUpdateUserAgentParams,
  PlaybackRestrictions,
  PlaybackRestrictionsBasePage,
  ReferrerDomainRestrictionSettings,
  UserAgentRestrictionSettings,
} from './playback-restrictions';
import * as TranscriptionVocabulariesAPI from './transcription-vocabularies';
import {
  TranscriptionVocabularies,
  TranscriptionVocabulariesBasePage,
  TranscriptionVocabulary,
  TranscriptionVocabularyCreateParams,
  TranscriptionVocabularyListParams,
  TranscriptionVocabularyResponse,
  TranscriptionVocabularyUpdateParams,
} from './transcription-vocabularies';
import * as UploadsAPI from './uploads';
import {
  Upload,
  UploadCreateParams,
  UploadListParams,
  UploadResponse,
  Uploads,
  UploadsBasePage,
} from './uploads';

export class Video extends APIResource {
  assets: AssetsAPI.Assets = new AssetsAPI.Assets(this._client);
  deliveryUsage: DeliveryUsageAPI.DeliveryUsage = new DeliveryUsageAPI.DeliveryUsage(this._client);
  liveStreams: LiveStreamsAPI.LiveStreams = new LiveStreamsAPI.LiveStreams(this._client);
  playbackIds: PlaybackIdsAPI.PlaybackIds = new PlaybackIdsAPI.PlaybackIds(this._client);
  playbackRestrictions: PlaybackRestrictionsAPI.PlaybackRestrictions =
    new PlaybackRestrictionsAPI.PlaybackRestrictions(this._client);
  transcriptionVocabularies: TranscriptionVocabulariesAPI.TranscriptionVocabularies =
    new TranscriptionVocabulariesAPI.TranscriptionVocabularies(this._client);
  uploads: UploadsAPI.Uploads = new UploadsAPI.Uploads(this._client);
  drmConfigurations: DRMConfigurationsAPI.DRMConfigurations = new DRMConfigurationsAPI.DRMConfigurations(
    this._client,
  );
  playback: PlaybackAPI.Playback = new PlaybackAPI.Playback(this._client);
}

Video.Assets = Assets;
Video.DeliveryUsage = DeliveryUsage;
Video.LiveStreams = LiveStreams;
Video.PlaybackIds = PlaybackIds;
Video.PlaybackRestrictions = PlaybackRestrictions;
Video.TranscriptionVocabularies = TranscriptionVocabularies;
Video.Uploads = Uploads;
Video.DRMConfigurations = DRMConfigurations;
Video.Playback = Playback;

export declare namespace Video {
  export {
    Assets as Assets,
    type Asset as Asset,
    type AssetGeneratedSubtitleSettings as AssetGeneratedSubtitleSettings,
    type AssetMetadata as AssetMetadata,
    type AssetOptions as AssetOptions,
    type AssetProgress as AssetProgress,
    type AssetResponse as AssetResponse,
    type AssetShots as AssetShots,
    type CreateStaticRenditionRequest as CreateStaticRenditionRequest,
    type Directive as Directive,
    type InputInfo as InputInfo,
    type InputSettings as InputSettings,
    type StaticRendition as StaticRendition,
    type Track as Track,
    type AssetGenerateSubtitlesResponse as AssetGenerateSubtitlesResponse,
    type AssetRetrieveInputInfoResponse as AssetRetrieveInputInfoResponse,
    type AssetsCursorPage as AssetsCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetListParams as AssetListParams,
    type AssetUpdateParams as AssetUpdateParams,
    type AssetCreatePlaybackIdParams as AssetCreatePlaybackIdParams,
    type AssetCreateTrackParams as AssetCreateTrackParams,
    type AssetUpdateTrackParams as AssetUpdateTrackParams,
    type AssetGenerateSubtitlesParams as AssetGenerateSubtitlesParams,
    type AssetUpdateMP4SupportParams as AssetUpdateMP4SupportParams,
    type AssetUpdateMasterAccessParams as AssetUpdateMasterAccessParams,
    type AssetCreateStaticRenditionParams as AssetCreateStaticRenditionParams,
    type AssetGenerateShotsParams as AssetGenerateShotsParams,
  };

  export {
    DeliveryUsage as DeliveryUsage,
    type DeliveryReport as DeliveryReport,
    type DeliveryReportsPageWithTimeframe as DeliveryReportsPageWithTimeframe,
    type DeliveryUsageListParams as DeliveryUsageListParams,
  };

  export {
    LiveStreams as LiveStreams,
    type LiveStream as LiveStream,
    type LiveStreamEmbeddedSubtitleSettings as LiveStreamEmbeddedSubtitleSettings,
    type LiveStreamGeneratedSubtitleSettings as LiveStreamGeneratedSubtitleSettings,
    type LiveStreamMetadata as LiveStreamMetadata,
    type SimulcastTarget as SimulcastTarget,
    type LiveStreamsBasePage as LiveStreamsBasePage,
    type LiveStreamCreateParams as LiveStreamCreateParams,
    type LiveStreamListParams as LiveStreamListParams,
    type LiveStreamUpdateParams as LiveStreamUpdateParams,
    type LiveStreamCreatePlaybackIdParams as LiveStreamCreatePlaybackIdParams,
    type LiveStreamUpdateEmbeddedSubtitlesParams as LiveStreamUpdateEmbeddedSubtitlesParams,
    type LiveStreamUpdateGeneratedSubtitlesParams as LiveStreamUpdateGeneratedSubtitlesParams,
    type LiveStreamCreateSimulcastTargetParams as LiveStreamCreateSimulcastTargetParams,
    type LiveStreamUpdateNewAssetSettingsStaticRenditionsParams as LiveStreamUpdateNewAssetSettingsStaticRenditionsParams,
  };

  export { PlaybackIds as PlaybackIds, type PlaybackIdsRetrieveResponse as PlaybackIdsRetrieveResponse };

  export {
    PlaybackRestrictions as PlaybackRestrictions,
    type PlaybackRestriction as PlaybackRestriction,
    type PlaybackRestrictionResponse as PlaybackRestrictionResponse,
    type ReferrerDomainRestrictionSettings as ReferrerDomainRestrictionSettings,
    type UserAgentRestrictionSettings as UserAgentRestrictionSettings,
    type PlaybackRestrictionsBasePage as PlaybackRestrictionsBasePage,
    type PlaybackRestrictionCreateParams as PlaybackRestrictionCreateParams,
    type PlaybackRestrictionListParams as PlaybackRestrictionListParams,
    type PlaybackRestrictionUpdateReferrerParams as PlaybackRestrictionUpdateReferrerParams,
    type PlaybackRestrictionUpdateUserAgentParams as PlaybackRestrictionUpdateUserAgentParams,
  };

  export {
    TranscriptionVocabularies as TranscriptionVocabularies,
    type TranscriptionVocabulary as TranscriptionVocabulary,
    type TranscriptionVocabularyResponse as TranscriptionVocabularyResponse,
    type TranscriptionVocabulariesBasePage as TranscriptionVocabulariesBasePage,
    type TranscriptionVocabularyCreateParams as TranscriptionVocabularyCreateParams,
    type TranscriptionVocabularyUpdateParams as TranscriptionVocabularyUpdateParams,
    type TranscriptionVocabularyListParams as TranscriptionVocabularyListParams,
  };

  export {
    Uploads as Uploads,
    type Upload as Upload,
    type UploadResponse as UploadResponse,
    type UploadsBasePage as UploadsBasePage,
    type UploadCreateParams as UploadCreateParams,
    type UploadListParams as UploadListParams,
  };

  export {
    DRMConfigurations as DRMConfigurations,
    type DRMConfiguration as DRMConfiguration,
    type DRMConfigurationsBasePage as DRMConfigurationsBasePage,
    type DRMConfigurationListParams as DRMConfigurationListParams,
  };

  export {
    Playback as Playback,
    type PlaybackStoryboardMetaResponse as PlaybackStoryboardMetaResponse,
    type PlaybackStoryboardVttResponse as PlaybackStoryboardVttResponse,
    type PlaybackTrackResponse as PlaybackTrackResponse,
    type PlaybackTranscriptResponse as PlaybackTranscriptResponse,
    type PlaybackThumbnailParams as PlaybackThumbnailParams,
    type PlaybackAnimatedParams as PlaybackAnimatedParams,
    type PlaybackStoryboardParams as PlaybackStoryboardParams,
    type PlaybackStoryboardVttParams as PlaybackStoryboardVttParams,
    type PlaybackStoryboardMetaParams as PlaybackStoryboardMetaParams,
    type PlaybackHlsParams as PlaybackHlsParams,
    type PlaybackStaticRenditionParams as PlaybackStaticRenditionParams,
    type PlaybackTrackParams as PlaybackTrackParams,
    type PlaybackTranscriptParams as PlaybackTranscriptParams,
  };
}
