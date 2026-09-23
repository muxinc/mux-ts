// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * A single video view is made up of one or more subviews — for example, a `rendition` subview tracks a continuous period spent at a specific video quality level, and a `playback_mode` subview tracks a continuous period in a specific playback mode (such as fullscreen or picture-in-picture).
 *
 * Subview metrics let you measure and filter on this subview-level data directly, rather than relying only on view-level metrics. For example, you can find out how much playing time was spent at 1080p vs. 720p, or broken down further by country.
 */
export class SubviewMetrics extends APIResource {
  /**
   * Returns the total subview metric value across all views matching the given
   * filters and timeframe.
   *
   * @example
   * ```ts
   * const subviewOverallValuesResponse =
   *   await client.data.subviewMetrics.getOverallValues(
   *     'playing_time',
   *     'rendition',
   *   );
   * ```
   */
  getOverallValues(
    metricID: 'playing_time',
    subviewType: 'rendition' | 'playback_mode',
    query: SubviewMetricGetOverallValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SubviewOverallValuesResponse> {
    return this._client.get(path`/data/v1/subview-metrics/${metricID}/${subviewType}/overall`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the metric value broken down by subview attributes, with each row's
   * percentage of the total. By default, groups by all of the subview type's
   * attributes (for example, every rendition attribute for `rendition` subviews) —
   * use `group_by[]` to select a subset.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const subviewBreakdownValue of client.data.subviewMetrics.listBreakdownValues(
   *   'playing_time',
   *   'rendition',
   * )) {
   *   // ...
   * }
   * ```
   */
  listBreakdownValues(
    metricID: 'playing_time',
    subviewType: 'rendition' | 'playback_mode',
    query: SubviewMetricListBreakdownValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<SubviewBreakdownValuesBasePage, SubviewBreakdownValue> {
    return this._client.getAPIList(
      path`/data/v1/subview-metrics/${metricID}/${subviewType}/breakdown`,
      BasePage<SubviewBreakdownValue>,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }

  /**
   * Returns the metric value broken down by subview attributes, for each of up to 4
   * selected values of a given dimension. Powers side-by-side comparisons across
   * dimension values (for example, comparing the rendition breakdown for the US vs.
   * India).
   *
   * @example
   * ```ts
   * const subviewComparisonValuesResponse =
   *   await client.data.subviewMetrics.listComparisonValues(
   *     'playing_time',
   *     'rendition',
   *     { dimension: 'dimension', values: ['string'] },
   *   );
   * ```
   */
  listComparisonValues(
    metricID: 'playing_time',
    subviewType: 'rendition' | 'playback_mode',
    query: SubviewMetricListComparisonValuesParams,
    options?: RequestOptions,
  ): APIPromise<SubviewComparisonValuesResponse> {
    return this._client.get(path`/data/v1/subview-metrics/${metricID}/${subviewType}/comparison`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the metric value broken down by subview attributes over time, bucketed
   * by the requested time granularity. Powers stacked bar chart visualizations.
   *
   * Buckets the data pipeline has not yet finalized are omitted from `data`
   * entirely, rather than zero-filled. Check each entry's `status` and the
   * response's `meta.complete_through` to tell a genuinely-empty bucket apart from
   * one that's still incomplete.
   *
   * @example
   * ```ts
   * const subviewBreakdownTimeseriesResponse =
   *   await client.data.subviewMetrics.getBreakdownTimeseries(
   *     'playing_time',
   *     'rendition',
   *   );
   * ```
   */
  getBreakdownTimeseries(
    metricID: 'playing_time',
    subviewType: 'rendition' | 'playback_mode',
    query: SubviewMetricGetBreakdownTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SubviewBreakdownTimeseriesResponse> {
    return this._client.get(path`/data/v1/subview-metrics/${metricID}/${subviewType}/breakdown-timeseries`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Lists the dimensions available for filtering and breaking down subview metrics
   * for the given subview type. `view` dimensions describe the parent video view;
   * `subview` dimensions are specific to the subview type itself (for example,
   * rendition attributes for `rendition` subviews).
   *
   * @example
   * ```ts
   * const subviewDimensionsResponse =
   *   await client.data.subviewMetrics.listDimensions(
   *     'rendition',
   *   );
   * ```
   */
  listDimensions(
    subviewType: 'rendition' | 'playback_mode',
    options?: RequestOptions,
  ): APIPromise<SubviewDimensionsResponse> {
    return this._client.get(path`/data/v1/subview-metrics/${subviewType}/dimensions`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the distinct values for a dimension, each annotated with the total
   * playing time across all matching values. Sorted by playing time descending by
   * default.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const subviewDimensionValue of client.data.subviewMetrics.listDimensionValues(
   *   'rendition',
   *   'country',
   * )) {
   *   // ...
   * }
   * ```
   */
  listDimensionValues(
    subviewType: 'rendition' | 'playback_mode',
    dimensionName: string,
    query: SubviewMetricListDimensionValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<SubviewDimensionValuesBasePage, SubviewDimensionValue> {
    return this._client.getAPIList(
      path`/data/v1/subview-metrics/${subviewType}/dimensions/${dimensionName}`,
      BasePage<SubviewDimensionValue>,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }
}

export type SubviewBreakdownValuesBasePage = BasePage<SubviewBreakdownValue>;

export type SubviewDimensionValuesBasePage = BasePage<SubviewDimensionValue>;

export interface SubviewBreakdownTimeseriesDatapoint {
  date: string;

  status: 'complete' | 'partial';

  values: Array<SubviewBreakdownValue>;
}

export interface SubviewBreakdownTimeseriesResponse {
  data: Array<SubviewBreakdownTimeseriesDatapoint>;

  meta: SubviewBreakdownTimeseriesResponse.Meta;

  timeframe: Array<number>;

  /**
   * Number of time buckets in `data`.
   */
  total_row_count: number;
}

export namespace SubviewBreakdownTimeseriesResponse {
  export interface Meta {
    complete_through: string;

    group_by: Array<string>;

    metric: string;

    subview_type: string;

    time_granularity: 'hour' | 'day';

    unit: string;
  }
}

export interface SubviewBreakdownValue {
  breakdown_value: string;

  metric_value: number;
}

export interface SubviewBreakdownValuesResponse {
  data: Array<SubviewBreakdownValue>;

  meta: SubviewBreakdownValuesResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number;
}

export namespace SubviewBreakdownValuesResponse {
  export interface Meta {
    group_by: Array<string>;

    metric: string;

    subview_type: string;

    unit: string;
  }
}

export interface SubviewComparisonGroup {
  dimension_value: string;

  values: Array<SubviewBreakdownValue>;
}

export interface SubviewComparisonValuesResponse {
  data: Array<SubviewComparisonGroup>;

  meta: SubviewComparisonValuesResponse.Meta;

  timeframe: Array<number>;

  /**
   * Number of dimension-value groups in `data`.
   */
  total_row_count: number;
}

export namespace SubviewComparisonValuesResponse {
  export interface Meta {
    dimension: string;

    group_by: Array<string>;

    metric: string;

    subview_type: string;

    unit: string;
  }
}

export interface SubviewDimensionValue {
  playing_time: number;

  value: string;
}

export interface SubviewDimensionValuesResponse {
  data: Array<SubviewDimensionValue>;

  meta: SubviewDimensionValuesResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number;
}

export namespace SubviewDimensionValuesResponse {
  export interface Meta {
    dimension_name: string;

    metric: string;

    subview_type: string;

    unit: string;
  }
}

export interface SubviewDimensionsResponse {
  data: SubviewDimensionsResponse.Data;

  /**
   * Always `null` for this endpoint, matching `GET /data/v1/dimensions`, which also
   * never computes a row count.
   */
  total_row_count: number | null;
}

export namespace SubviewDimensionsResponse {
  export interface Data {
    subview: Array<string>;

    view: Array<string>;
  }
}

export interface SubviewOverallValuesResponse {
  data: SubviewOverallValuesResponse.Data;

  meta: SubviewOverallValuesResponse.Meta;

  timeframe: Array<number>;

  /**
   * Always `null` for this endpoint — a single aggregate value has no row count.
   */
  total_row_count: number | null;
}

export namespace SubviewOverallValuesResponse {
  export interface Data {
    metric_value: number;
  }

  export interface Meta {
    metric: string;

    subview_type: string;

    unit: string;
  }
}

export interface SubviewMetricGetOverallValuesParams {
  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * The set of filterable dimensions is distinct from the main Data API's
   * dimensions, and depends on the subview type — see the List Subview Dimensions
   * endpoint for the valid names.
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   * - `filters[]=dimension:__empty__` - Include rows where the dimension has no
   *   value
   *
   * Example: `filters[]=country:US`
   */
  filters?: Array<string>;

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

export interface SubviewMetricListBreakdownValuesParams extends BasePageParams {
  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * The set of filterable dimensions is distinct from the main Data API's
   * dimensions, and depends on the subview type — see the List Subview Dimensions
   * endpoint for the valid names.
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   * - `filters[]=dimension:__empty__` - Include rows where the dimension has no
   *   value
   *
   * Example: `filters[]=country:US`
   */
  filters?: Array<string>;

  /**
   * Subview attributes to group the results by. Must be provided as an array query
   * string parameter. Currently only supported for the `rendition` subview type, as
   * any combination of the 6 enum values below.
   *
   * If omitted, defaults to grouping by every attribute available for the subview
   * type.
   */
  group_by?: Array<
    | 'video_source_bitrate'
    | 'video_source_width'
    | 'video_source_height'
    | 'video_source_fps'
    | 'video_source_codec'
    | 'video_source_rendition_name'
  >;

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

export interface SubviewMetricListComparisonValuesParams {
  /**
   * Name of the dimension to compare across. See the List Subview Dimensions
   * endpoint for the valid values for a given subview type.
   */
  dimension: string;

  /**
   * The dimension values to compare, up to 4. Must be provided as an array query
   * string parameter. Use `__empty__` to select subviews where the dimension has no
   * value.
   *
   * Example: `values[]=US&values[]=FR`
   */
  values: Array<string>;

  /**
   * Number of breakdown rows to include per selected dimension value.
   */
  breakdown_value_limit?: number;

  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * The set of filterable dimensions is distinct from the main Data API's
   * dimensions, and depends on the subview type — see the List Subview Dimensions
   * endpoint for the valid names.
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   * - `filters[]=dimension:__empty__` - Include rows where the dimension has no
   *   value
   *
   * Example: `filters[]=country:US`
   */
  filters?: Array<string>;

  /**
   * Subview attributes to group the results by. Must be provided as an array query
   * string parameter. Currently only supported for the `rendition` subview type, as
   * any combination of the 6 enum values below.
   *
   * If omitted, defaults to grouping by every attribute available for the subview
   * type.
   */
  group_by?: Array<
    | 'video_source_bitrate'
    | 'video_source_width'
    | 'video_source_height'
    | 'video_source_fps'
    | 'video_source_codec'
    | 'video_source_rendition_name'
  >;

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

export interface SubviewMetricGetBreakdownTimeseriesParams {
  /**
   * Number of breakdown rows to include per selected dimension value.
   */
  breakdown_value_limit?: number;

  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * The set of filterable dimensions is distinct from the main Data API's
   * dimensions, and depends on the subview type — see the List Subview Dimensions
   * endpoint for the valid names.
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   * - `filters[]=dimension:__empty__` - Include rows where the dimension has no
   *   value
   *
   * Example: `filters[]=country:US`
   */
  filters?: Array<string>;

  /**
   * Subview attributes to group the results by. Must be provided as an array query
   * string parameter. Currently only supported for the `rendition` subview type, as
   * any combination of the 6 enum values below.
   *
   * If omitted, defaults to grouping by every attribute available for the subview
   * type.
   */
  group_by?: Array<
    | 'video_source_bitrate'
    | 'video_source_width'
    | 'video_source_height'
    | 'video_source_fps'
    | 'video_source_codec'
    | 'video_source_rendition_name'
  >;

  /**
   * Time bucket size for the timeseries.
   */
  time_granularity?: 'hour' | 'day';

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

export interface SubviewMetricListDimensionValuesParams extends BasePageParams {
  /**
   * Filter results using key:value pairs. Must be provided as an array query string
   * parameter.
   *
   * The set of filterable dimensions is distinct from the main Data API's
   * dimensions, and depends on the subview type — see the List Subview Dimensions
   * endpoint for the valid names.
   *
   * - `filters[]=dimension:value` - Include rows where dimension equals value
   * - `filters[]=!dimension:value` - Exclude rows where dimension equals value
   * - `filters[]=dimension:__empty__` - Include rows where the dimension has no
   *   value
   *
   * Example: `filters[]=country:US`
   */
  filters?: Array<string>;

  /**
   * Value to order the results by.
   */
  order_by?: 'playing_time' | 'value';

  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';

  /**
   * Only return dimension values containing this substring.
   */
  query?: string;

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

export declare namespace SubviewMetrics {
  export {
    type SubviewBreakdownTimeseriesDatapoint as SubviewBreakdownTimeseriesDatapoint,
    type SubviewBreakdownTimeseriesResponse as SubviewBreakdownTimeseriesResponse,
    type SubviewBreakdownValue as SubviewBreakdownValue,
    type SubviewBreakdownValuesResponse as SubviewBreakdownValuesResponse,
    type SubviewComparisonGroup as SubviewComparisonGroup,
    type SubviewComparisonValuesResponse as SubviewComparisonValuesResponse,
    type SubviewDimensionValue as SubviewDimensionValue,
    type SubviewDimensionValuesResponse as SubviewDimensionValuesResponse,
    type SubviewDimensionsResponse as SubviewDimensionsResponse,
    type SubviewOverallValuesResponse as SubviewOverallValuesResponse,
    type SubviewBreakdownValuesBasePage as SubviewBreakdownValuesBasePage,
    type SubviewDimensionValuesBasePage as SubviewDimensionValuesBasePage,
    type SubviewMetricGetOverallValuesParams as SubviewMetricGetOverallValuesParams,
    type SubviewMetricListBreakdownValuesParams as SubviewMetricListBreakdownValuesParams,
    type SubviewMetricListComparisonValuesParams as SubviewMetricListComparisonValuesParams,
    type SubviewMetricGetBreakdownTimeseriesParams as SubviewMetricGetBreakdownTimeseriesParams,
    type SubviewMetricListDimensionValuesParams as SubviewMetricListDimensionValuesParams,
  };
}
