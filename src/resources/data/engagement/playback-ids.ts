// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as EngagementAPI from './engagement';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Engagement metrics are a subset of historical metrics that describe how viewers watch a specific asset, video, or playback ID across the duration of the content.
 */
export class PlaybackIds extends APIResource {
  /**
   * Returns the engagement heatmap for a playback ID. The heatmap is an array of
   * per-bucket engagement values across the content timeline, where the number of
   * buckets scales with the content duration. Each value represents how engaged
   * viewers were with that portion of the content. This only covers views for this
   * specific playback ID; to analyze the entire asset across all of its playback
   * IDs, use the asset ID or video ID endpoint instead.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.playbackIds.heatmap(
   *     'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
   *   );
   * ```
   */
  heatmap(
    playbackId: string,
    query: PlaybackIdsHeatmapParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PlaybackIdsHeatmapResponse> {
    return this._client.get(path`/data/v1/engagement/playback-ids/${playbackId}/heatmap`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the engagement hotspots for a playback ID. Hotspots are the most or
   * least engaging moments of the content, each described by a start and end time
   * (in milliseconds) and a score between 0 and 1. Set `order_direction` to `asc` to
   * return the least engaging moments (cold spots). This only covers views for this
   * specific playback ID; to analyze the entire asset across all of its playback
   * IDs, use the asset ID or video ID endpoint instead.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.playbackIds.hotspots(
   *     'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
   *   );
   * ```
   */
  hotspots(
    playbackId: string,
    query: PlaybackIdsHotspotsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PlaybackIdsHotspotsResponse> {
    return this._client.get(path`/data/v1/engagement/playback-ids/${playbackId}/hotspots`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface PlaybackIdsHeatmapResponse {
  data: EngagementAPI.EngagementHeatmap;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface PlaybackIdsHotspotsResponse {
  data: EngagementAPI.EngagementHotspots;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface PlaybackIdsHeatmapParams {
  /**
   * Timeframe window to limit results by. Must be provided as an array query string
   * parameter (e.g. timeframe[]=).
   *
   * Accepted formats are...
   *
   * - array of epoch timestamps e.g. `timeframe[]=1498867200&timeframe[]=1498953600`
   * - duration string e.g. `timeframe[]=24:hours or timeframe[]=7:days`
   */
  timeframe?: Array<string>;
}

export interface PlaybackIdsHotspotsParams {
  /**
   * Maximum number of hotspots to return. If omitted, all hotspots are returned.
   */
  limit?: number;

  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';

  /**
   * Timeframe window to limit results by. Must be provided as an array query string
   * parameter (e.g. timeframe[]=).
   *
   * Accepted formats are...
   *
   * - array of epoch timestamps e.g. `timeframe[]=1498867200&timeframe[]=1498953600`
   * - duration string e.g. `timeframe[]=24:hours or timeframe[]=7:days`
   */
  timeframe?: Array<string>;
}

export declare namespace PlaybackIds {
  export {
    type PlaybackIdsHeatmapResponse as PlaybackIdsHeatmapResponse,
    type PlaybackIdsHotspotsResponse as PlaybackIdsHotspotsResponse,
    type PlaybackIdsHeatmapParams as PlaybackIdsHeatmapParams,
    type PlaybackIdsHotspotsParams as PlaybackIdsHotspotsParams,
  };
}
