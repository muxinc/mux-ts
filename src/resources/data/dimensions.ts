// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Dimensions are the types of metadata that can be collected for a video view. Some dimensions are collected automatically based on the playback or device, such as the viewer's Country or the device information. Other dimensions are specified by the developer when configuring a Mux Data video view such as the video title. The Dimensions APIs allow you to get a list of the supported dimensions and their values.
 */
export class Dimensions extends APIResource {
  /**
   * List all available dimensions.
   *
   * Note: This API replaces the list-filters API call.
   *
   * @example
   * ```ts
   * const dimensionsResponse =
   *   await client.data.dimensions.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<DimensionsResponse> {
    return this._client.get('/data/v1/dimensions', { defaultBaseURL: 'https://api.mux.com', ...options });
  }

  /**
   * Lists the values for a dimension along with a total count of related views.
   *
   * Note: This API replaces the list-filter-values API call.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const dimensionValue of client.data.dimensions.listValues(
   *   'abcd1234',
   * )) {
   *   // ...
   * }
   * ```
   */
  listValues(
    dimensionID: string,
    query: DimensionListValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DimensionValuesBasePage, DimensionValue> {
    return this._client.getAPIList(path`/data/v1/dimensions/${dimensionID}`, BasePage<DimensionValue>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Lists the elements (values) for a trace dimension along with their total counts.
   * This endpoint is specifically designed for trace dimensions like video_cdn_trace
   * that contain arrays of values.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const dimensionValue of client.data.dimensions.listTraceElements(
   *   'abcd1234',
   * )) {
   *   // ...
   * }
   * ```
   */
  listTraceElements(
    dimensionID: string,
    query: DimensionListTraceElementsParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DimensionValuesBasePage, DimensionValue> {
    return this._client.getAPIList(
      path`/data/v1/dimensions/${dimensionID}/elements`,
      BasePage<DimensionValue>,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }
}

export type DimensionValuesBasePage = BasePage<DimensionValue>;

export interface DimensionValue {
  total_count: number;

  value: string | null;
}

export interface DimensionsResponse {
  data: DimensionsResponse.Data;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace DimensionsResponse {
  export interface Data {
    advanced: Array<string>;

    basic: Array<string>;
  }
}

export interface DimensionListValuesParams extends BasePageParams {
  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * **Basic filtering:**
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   *
   * **For trace dimensions (like video_cdn_trace):**
   *
   * - `filters[]=+dimension:value` - Include rows where trace contains value
   * - `filters[]=-dimension:value` - Exclude rows where trace contains value
   * - `filters[]=dimension:[value1,value2]` - Exact trace match
   *
   * **Examples:**
   *
   * - `filters[]=country:US` - US views only
   * - `filters[]=+video_cdn_trace:fastly` - Views using Fastly CDN
   */
  filters?: Array<string>;

  /**
   * Limit the results to rows that match inequality conditions from provided metric
   * comparison clauses. Must be provided as an array query string parameter.
   *
   * Possible filterable metrics are the same as the set of metric ids, with the
   * exceptions of `exits_before_video_start`, `unique_viewers`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`, and `views`.
   *
   * Example:
   *
   * - `metric_filters[]=aggregate_startup_time>=1000`
   */
  metric_filters?: Array<string>;

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

export interface DimensionListTraceElementsParams extends BasePageParams {
  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * **Basic filtering:**
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   *
   * **For trace dimensions (like video_cdn_trace):**
   *
   * - `filters[]=+dimension:value` - Include rows where trace contains value
   * - `filters[]=-dimension:value` - Exclude rows where trace contains value
   * - `filters[]=dimension:[value1,value2]` - Exact trace match
   *
   * **Examples:**
   *
   * - `filters[]=country:US` - US views only
   * - `filters[]=+video_cdn_trace:fastly` - Views using Fastly CDN
   */
  filters?: Array<string>;

  /**
   * Limit the results to rows that match inequality conditions from provided metric
   * comparison clauses. Must be provided as an array query string parameter.
   *
   * Possible filterable metrics are the same as the set of metric ids, with the
   * exceptions of `exits_before_video_start`, `unique_viewers`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`, and `views`.
   *
   * Example:
   *
   * - `metric_filters[]=aggregate_startup_time>=1000`
   */
  metric_filters?: Array<string>;

  /**
   * Value to order the results by
   */
  order_by?: 'negative_impact' | 'value' | 'views' | 'field';

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

export declare namespace Dimensions {
  export {
    type DimensionValue as DimensionValue,
    type DimensionsResponse as DimensionsResponse,
    type DimensionValuesBasePage as DimensionValuesBasePage,
    type DimensionListValuesParams as DimensionListValuesParams,
    type DimensionListTraceElementsParams as DimensionListTraceElementsParams,
  };
}
