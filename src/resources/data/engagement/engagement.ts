// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AssetsAPI from './assets';
import {
  AssetHeatmapParams,
  AssetHeatmapResponse,
  AssetHotspotsParams,
  AssetHotspotsResponse,
  Assets,
} from './assets';
import * as PlaybackIdsAPI from './playback-ids';
import {
  PlaybackIds,
  PlaybackIdsHeatmapParams,
  PlaybackIdsHeatmapResponse,
  PlaybackIdsHotspotsParams,
  PlaybackIdsHotspotsResponse,
} from './playback-ids';
import * as VideosAPI from './videos';
import {
  VideoHeatmapParams,
  VideoHeatmapResponse,
  VideoHotspotsParams,
  VideoHotspotsResponse,
  Videos,
} from './videos';

export class Engagement extends APIResource {
  assets: AssetsAPI.Assets = new AssetsAPI.Assets(this._client);
  playbackIds: PlaybackIdsAPI.PlaybackIds = new PlaybackIdsAPI.PlaybackIds(this._client);
  videos: VideosAPI.Videos = new VideosAPI.Videos(this._client);
}

export interface EngagementHeatmap {
  /**
   * Total number of views the heatmap was calculated from.
   */
  total_views: number;

  /**
   * Per-bucket engagement values across the content timeline, ordered from the start
   * to the end of the content. The number of buckets is dynamic (between 10
   * and 1000) and scales with the content duration.
   */
  value: Array<number>;
}

export interface EngagementHotspots {
  hotspots: Array<Hotspot>;

  /**
   * Total number of views the hotspots were calculated from.
   */
  total_views: number;
}

export interface Hotspot {
  /**
   * End of the hotspot (exclusive), in milliseconds from the beginning of the
   * content.
   */
  end_ms: number;

  /**
   * Engagement score for the hotspot, between 0 and 1. Higher scores indicate more
   * engaging moments; lower scores indicate less engaging moments (cold spots).
   */
  score: number;

  /**
   * Start of the hotspot, in milliseconds from the beginning of the content.
   */
  start_ms: number;
}

Engagement.Assets = Assets;
Engagement.PlaybackIds = PlaybackIds;
Engagement.Videos = Videos;

export declare namespace Engagement {
  export {
    type EngagementHeatmap as EngagementHeatmap,
    type EngagementHotspots as EngagementHotspots,
    type Hotspot as Hotspot,
  };

  export {
    Assets as Assets,
    type AssetHeatmapResponse as AssetHeatmapResponse,
    type AssetHotspotsResponse as AssetHotspotsResponse,
    type AssetHeatmapParams as AssetHeatmapParams,
    type AssetHotspotsParams as AssetHotspotsParams,
  };

  export {
    PlaybackIds as PlaybackIds,
    type PlaybackIdsHeatmapResponse as PlaybackIdsHeatmapResponse,
    type PlaybackIdsHotspotsResponse as PlaybackIdsHotspotsResponse,
    type PlaybackIdsHeatmapParams as PlaybackIdsHeatmapParams,
    type PlaybackIdsHotspotsParams as PlaybackIdsHotspotsParams,
  };

  export {
    Videos as Videos,
    type VideoHeatmapResponse as VideoHeatmapResponse,
    type VideoHotspotsResponse as VideoHotspotsResponse,
    type VideoHeatmapParams as VideoHeatmapParams,
    type VideoHotspotsParams as VideoHotspotsParams,
  };
}
