// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as EngagementAPI from './engagement';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Engagement metrics are a subset of historical metrics that describe how viewers watch a specific asset, video, or playback ID across the duration of the content.
 */
export class Assets extends APIResource {
  /**
   * Returns the engagement heatmap for an asset. The heatmap is an array of
   * per-bucket engagement values across the content timeline, where the number of
   * buckets scales with the content duration. Each value represents how engaged
   * viewers were with that portion of the content.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.assets.heatmap(
   *     'rmp7fvw5lPD01l8PZ2aN74js84XrTWxHy',
   *   );
   * ```
   */
  heatmap(
    assetId: string,
    query: AssetHeatmapParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetHeatmapResponse> {
    return this._client.get(path`/data/v1/engagement/assets/${assetId}/heatmap`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the engagement hotspots for an asset. Hotspots are the most or least
   * engaging moments of the content, each described by a start and end time (in
   * milliseconds) and a score between 0 and 1. Set `order_direction` to `asc` to
   * return the least engaging moments (cold spots).
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.engagement.assets.hotspots(
   *     'rmp7fvw5lPD01l8PZ2aN74js84XrTWxHy',
   *   );
   * ```
   */
  hotspots(
    assetId: string,
    query: AssetHotspotsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AssetHotspotsResponse> {
    return this._client.get(path`/data/v1/engagement/assets/${assetId}/hotspots`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface AssetHeatmapResponse {
  data: EngagementAPI.EngagementHeatmap;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface AssetHotspotsResponse {
  data: EngagementAPI.EngagementHotspots;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface AssetHeatmapParams {
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

export interface AssetHotspotsParams {
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

export declare namespace Assets {
  export {
    type AssetHeatmapResponse as AssetHeatmapResponse,
    type AssetHotspotsResponse as AssetHotspotsResponse,
    type AssetHeatmapParams as AssetHeatmapParams,
    type AssetHotspotsParams as AssetHotspotsParams,
  };
}
