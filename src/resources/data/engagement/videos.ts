// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as EngagementAPI from './engagement';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Engagement metrics are a subset of historical metrics that describe how viewers watch a specific asset, video, or playback ID across the duration of the content.
 */
export class Videos extends APIResource {
  /**
   * Returns the engagement heatmap for a video. The heatmap is an array of
   * per-bucket engagement values across the content timeline, where the number of
   * buckets scales with the content duration. Each value represents how engaged
   * viewers were with that portion of the content.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.videos.heatmap('abcd1234');
   * ```
   */
  heatmap(
    videoID: string,
    query: VideoHeatmapParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VideoHeatmapResponse> {
    return this._client.get(path`/data/v1/engagement/videos/${videoID}/heatmap`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the engagement hotspots for a video. Hotspots are the most or least
   * engaging moments of the content, each described by a start and end time (in
   * milliseconds) and a score between 0 and 1. Set `order_direction` to `asc` to
   * return the least engaging moments (cold spots).
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.videos.hotspots('abcd1234');
   * ```
   */
  hotspots(
    videoID: string,
    query: VideoHotspotsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VideoHotspotsResponse> {
    return this._client.get(path`/data/v1/engagement/videos/${videoID}/hotspots`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface VideoHeatmapResponse {
  data: EngagementAPI.EngagementHeatmap;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface VideoHotspotsResponse {
  data: EngagementAPI.EngagementHotspots;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface VideoHeatmapParams {
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

export interface VideoHotspotsParams {
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

export declare namespace Videos {
  export {
    type VideoHeatmapResponse as VideoHeatmapResponse,
    type VideoHotspotsResponse as VideoHotspotsResponse,
    type VideoHeatmapParams as VideoHeatmapParams,
    type VideoHotspotsParams as VideoHotspotsParams,
  };
}
