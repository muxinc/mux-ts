// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Historical metrics are used for tracking KPIs, diagnosing issues, and
 * measuring viewers' quality of experience. Metrics are calculated using the
 * video views that have been completed and are bucketed on the view end time
 * for quality of experience metrics and view start time for engagement
 * metrics. Historical metrics provide a large collection of dimensions that
 * can be used to aggregate quality of experience based on view metadata. You
 * can also easily compare experiences across viewer populations to, for
 * example, find issues with specific devices or geographies.
 *
 * Historical metrics are similar but not directly comparable to the real-time
 * metrics in the Real-time APIs. These metrics are aggregated for long-term
 * storage historical reporting and are generated using different viewer
 * populations.
 */
export class Metrics extends APIResource {
  /**
   * List all of the values across every breakdown for a specific metric.
   *
   * @example
   * ```ts
   * const allMetricValuesResponse =
   *   await client.data.metrics.list();
   * ```
   */
  list(
    query: MetricListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AllMetricValuesResponse> {
    return this._client.get('/data/v1/metrics/comparison', {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * List the breakdown values for a specific metric.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const breakdownValue of client.data.metrics.listBreakdownValues(
   *   'video_startup_time',
   * )) {
   *   // ...
   * }
   * ```
   */
  listBreakdownValues(
    metricID:
      | 'aggregate_startup_time'
      | 'downscale_percentage'
      | 'exits_before_video_start'
      | 'live_stream_latency'
      | 'max_downscale_percentage'
      | 'max_request_latency'
      | 'max_upscale_percentage'
      | 'page_load_time'
      | 'playback_failure_percentage'
      | 'playback_success_score'
      | 'player_startup_time'
      | 'playing_time'
      | 'rebuffer_count'
      | 'rebuffer_duration'
      | 'rebuffer_frequency'
      | 'rebuffer_percentage'
      | 'request_latency'
      | 'request_throughput'
      | 'rebuffer_score'
      | 'requests_for_first_preroll'
      | 'seek_latency'
      | 'startup_time_score'
      | 'unique_viewers'
      | 'upscale_percentage'
      | 'video_quality_score'
      | 'video_startup_preroll_load_time'
      | 'video_startup_preroll_request_time'
      | 'video_startup_time'
      | 'viewer_experience_score'
      | 'views'
      | 'weighted_average_bitrate'
      | 'video_startup_failure_percentage'
      | 'ad_attempt_count'
      | 'ad_break_count'
      | 'ad_break_error_count'
      | 'ad_break_error_percentage'
      | 'ad_error_count'
      | 'ad_error_percentage'
      | 'ad_exit_before_start_count'
      | 'ad_exit_before_start_percentage'
      | 'ad_impression_count'
      | 'ad_startup_error_count'
      | 'ad_startup_error_percentage'
      | 'playback_business_exception_percentage'
      | 'video_startup_business_exception_percentage'
      | 'view_content_startup_time'
      | 'ad_preroll_startup_time'
      | 'view_dropped_percentage'
      | 'rendition_change_count'
      | 'rendition_upshift_count'
      | 'rendition_downshift_count',
    query: MetricListBreakdownValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<BreakdownValuesBasePage, BreakdownValue> {
    return this._client.getAPIList(path`/data/v1/metrics/${metricID}/breakdown`, BasePage<BreakdownValue>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the overall value for a specific metric, as well as the total view count
   * and watch time.
   *
   * @example
   * ```ts
   * const overallValuesResponse =
   *   await client.data.metrics.getOverallValues(
   *     'video_startup_time',
   *   );
   * ```
   */
  getOverallValues(
    metricID:
      | 'aggregate_startup_time'
      | 'downscale_percentage'
      | 'exits_before_video_start'
      | 'live_stream_latency'
      | 'max_downscale_percentage'
      | 'max_request_latency'
      | 'max_upscale_percentage'
      | 'page_load_time'
      | 'playback_failure_percentage'
      | 'playback_success_score'
      | 'player_startup_time'
      | 'playing_time'
      | 'rebuffer_count'
      | 'rebuffer_duration'
      | 'rebuffer_frequency'
      | 'rebuffer_percentage'
      | 'request_latency'
      | 'request_throughput'
      | 'rebuffer_score'
      | 'requests_for_first_preroll'
      | 'seek_latency'
      | 'startup_time_score'
      | 'unique_viewers'
      | 'upscale_percentage'
      | 'video_quality_score'
      | 'video_startup_preroll_load_time'
      | 'video_startup_preroll_request_time'
      | 'video_startup_time'
      | 'viewer_experience_score'
      | 'views'
      | 'weighted_average_bitrate'
      | 'video_startup_failure_percentage'
      | 'ad_attempt_count'
      | 'ad_break_count'
      | 'ad_break_error_count'
      | 'ad_break_error_percentage'
      | 'ad_error_count'
      | 'ad_error_percentage'
      | 'ad_exit_before_start_count'
      | 'ad_exit_before_start_percentage'
      | 'ad_impression_count'
      | 'ad_startup_error_count'
      | 'ad_startup_error_percentage'
      | 'playback_business_exception_percentage'
      | 'video_startup_business_exception_percentage'
      | 'view_content_startup_time'
      | 'ad_preroll_startup_time'
      | 'view_dropped_percentage'
      | 'rendition_change_count'
      | 'rendition_upshift_count'
      | 'rendition_downshift_count',
    query: MetricGetOverallValuesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OverallValuesResponse> {
    return this._client.get(path`/data/v1/metrics/${metricID}/overall`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns a list of insights for a metric. These are the worst performing values
   * across all breakdowns sorted by how much they negatively impact a specific
   * metric.
   *
   * @example
   * ```ts
   * const insightsResponse =
   *   await client.data.metrics.getInsights(
   *     'video_startup_time',
   *   );
   * ```
   */
  getInsights(
    metricID:
      | 'aggregate_startup_time'
      | 'downscale_percentage'
      | 'exits_before_video_start'
      | 'live_stream_latency'
      | 'max_downscale_percentage'
      | 'max_request_latency'
      | 'max_upscale_percentage'
      | 'page_load_time'
      | 'playback_failure_percentage'
      | 'playback_success_score'
      | 'player_startup_time'
      | 'playing_time'
      | 'rebuffer_count'
      | 'rebuffer_duration'
      | 'rebuffer_frequency'
      | 'rebuffer_percentage'
      | 'request_latency'
      | 'request_throughput'
      | 'rebuffer_score'
      | 'requests_for_first_preroll'
      | 'seek_latency'
      | 'startup_time_score'
      | 'unique_viewers'
      | 'upscale_percentage'
      | 'video_quality_score'
      | 'video_startup_preroll_load_time'
      | 'video_startup_preroll_request_time'
      | 'video_startup_time'
      | 'viewer_experience_score'
      | 'views'
      | 'weighted_average_bitrate'
      | 'video_startup_failure_percentage'
      | 'ad_attempt_count'
      | 'ad_break_count'
      | 'ad_break_error_count'
      | 'ad_break_error_percentage'
      | 'ad_error_count'
      | 'ad_error_percentage'
      | 'ad_exit_before_start_count'
      | 'ad_exit_before_start_percentage'
      | 'ad_impression_count'
      | 'ad_startup_error_count'
      | 'ad_startup_error_percentage'
      | 'playback_business_exception_percentage'
      | 'video_startup_business_exception_percentage'
      | 'view_content_startup_time'
      | 'ad_preroll_startup_time'
      | 'view_dropped_percentage'
      | 'rendition_change_count'
      | 'rendition_upshift_count'
      | 'rendition_downshift_count',
    query: MetricGetInsightsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InsightsResponse> {
    return this._client.get(path`/data/v1/metrics/${metricID}/insights`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns timeseries data for a specific metric.
   *
   * Each interval represented in the data array contains an array with the following
   * values:
   *
   * - the first element is the interval time
   * - the second element is the calculated metric value
   * - the third element is the number of views in the interval that have a valid
   *   metric value
   *
   * @example
   * ```ts
   * const metricTimeseriesDataResponse =
   *   await client.data.metrics.getTimeseries(
   *     'video_startup_time',
   *   );
   * ```
   */
  getTimeseries(
    metricID:
      | 'aggregate_startup_time'
      | 'downscale_percentage'
      | 'exits_before_video_start'
      | 'live_stream_latency'
      | 'max_downscale_percentage'
      | 'max_request_latency'
      | 'max_upscale_percentage'
      | 'page_load_time'
      | 'playback_failure_percentage'
      | 'playback_success_score'
      | 'player_startup_time'
      | 'playing_time'
      | 'rebuffer_count'
      | 'rebuffer_duration'
      | 'rebuffer_frequency'
      | 'rebuffer_percentage'
      | 'request_latency'
      | 'request_throughput'
      | 'rebuffer_score'
      | 'requests_for_first_preroll'
      | 'seek_latency'
      | 'startup_time_score'
      | 'unique_viewers'
      | 'upscale_percentage'
      | 'video_quality_score'
      | 'video_startup_preroll_load_time'
      | 'video_startup_preroll_request_time'
      | 'video_startup_time'
      | 'viewer_experience_score'
      | 'views'
      | 'weighted_average_bitrate'
      | 'video_startup_failure_percentage'
      | 'ad_attempt_count'
      | 'ad_break_count'
      | 'ad_break_error_count'
      | 'ad_break_error_percentage'
      | 'ad_error_count'
      | 'ad_error_percentage'
      | 'ad_exit_before_start_count'
      | 'ad_exit_before_start_percentage'
      | 'ad_impression_count'
      | 'ad_startup_error_count'
      | 'ad_startup_error_percentage'
      | 'playback_business_exception_percentage'
      | 'video_startup_business_exception_percentage'
      | 'view_content_startup_time'
      | 'ad_preroll_startup_time'
      | 'view_dropped_percentage'
      | 'rendition_change_count'
      | 'rendition_upshift_count'
      | 'rendition_downshift_count',
    query: MetricGetTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MetricTimeseriesDataResponse> {
    return this._client.get(path`/data/v1/metrics/${metricID}/timeseries`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export type BreakdownValuesBasePage = BasePage<BreakdownValue>;

export interface AllMetricValuesResponse {
  data: Array<AllMetricValuesResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace AllMetricValuesResponse {
  export interface Data {
    name: string;

    ended_views?: number;

    items?: Array<Data.Item>;

    metric?: string;

    started_views?: number;

    total_playing_time?: number | null;

    type?: string;

    unique_viewers?: number;

    value?: number;

    view_count?: number;

    watch_time?: number | null;
  }

  export namespace Data {
    export interface Item {
      metric: string;

      name: string;

      type: string;

      value: number | null;

      measurement?: string;
    }
  }
}

export interface BreakdownValue {
  field: string | null;

  negative_impact: number;

  total_playing_time: number | null;

  total_watch_time: number | null;

  value: number;

  views: number;
}

export interface InsightsResponse {
  data: Array<InsightsResponse.Data>;

  meta: InsightsResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number;
}

export namespace InsightsResponse {
  export interface Data {
    filter_column: string;

    filter_value: string | null;

    metric: number;

    negative_impact_score: number;

    total_playing_time: number | null;

    total_views: number;

    total_watch_time: number | null;
  }

  export interface Meta {
    aggregation?: string;

    granularity?: string;
  }
}

export interface MetricTimeseriesDataResponse {
  data: Array<Array<string | number | null>>;

  meta: MetricTimeseriesDataResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number;
}

export namespace MetricTimeseriesDataResponse {
  export interface Meta {
    aggregation?: string;

    granularity?: string;
  }
}

export interface OverallValuesResponse {
  data: OverallValuesResponse.Data;

  meta: OverallValuesResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace OverallValuesResponse {
  export interface Data {
    total_playing_time: number | null;

    total_views: number;

    total_watch_time: number | null;

    value: number;

    /**
     * @deprecated No longer updated; do not use.
     */
    global_value?: number | null;
  }

  export interface Meta {
    aggregation?: string;

    granularity?: string;
  }
}

export interface MetricListParams {
  /**
   * Dimension the specified value belongs to
   */
  dimension?:
    | 'asn'
    | 'asset_id'
    | 'browser'
    | 'browser_version'
    | 'cdn'
    | 'continent_code'
    | 'country'
    | 'custom_1'
    | 'custom_2'
    | 'custom_3'
    | 'custom_4'
    | 'custom_5'
    | 'custom_6'
    | 'custom_7'
    | 'custom_8'
    | 'custom_9'
    | 'custom_10'
    | 'exit_before_video_start'
    | 'experiment_name'
    | 'live_stream_id'
    | 'operating_system'
    | 'operating_system_version'
    | 'page_type'
    | 'page_url'
    | 'playback_failure'
    | 'playback_business_exception'
    | 'playback_id'
    | 'player_autoplay'
    | 'player_error_code'
    | 'player_mux_plugin_name'
    | 'player_mux_plugin_version'
    | 'player_name'
    | 'player_preload'
    | 'player_remote_played'
    | 'player_software'
    | 'player_software_version'
    | 'player_version'
    | 'preroll_ad_asset_hostname'
    | 'preroll_ad_tag_hostname'
    | 'preroll_played'
    | 'preroll_requested'
    | 'region'
    | 'source_hostname'
    | 'source_type'
    | 'stream_type'
    | 'sub_property_id'
    | 'video_content_type'
    | 'video_encoding_variant'
    | 'video_id'
    | 'video_series'
    | 'video_startup_failure'
    | 'video_startup_business_exception'
    | 'video_title'
    | 'view_drm_type'
    | 'view_has_ad'
    | 'view_session_id'
    | 'viewer_connection_type'
    | 'viewer_device_category'
    | 'viewer_device_manufacturer'
    | 'viewer_device_model'
    | 'viewer_device_name'
    | 'viewer_user_id'
    | 'ad_playback_failure'
    | 'content_playback_failure'
    | 'view_dropped'
    | 'client_application_name'
    | 'client_application_version'
    | 'video_affiliate'
    | 'viewer_plan'
    | 'viewer_plan_status'
    | 'viewer_plan_category'
    | 'view_drm_level'
    | 'video_brand'
    | 'used_pip'
    | 'time_shift_enabled'
    | 'used_captions'
    | 'video_codec'
    | 'audio_codec'
    | 'video_dynamic_range_type'
    | 'view_cdn_edge_pop'
    | 'view_cdn_origin'
    | 'video_creator_id'
    | 'video_cdn_trace';

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

  /**
   * Value to show all available metrics for
   */
  value?: string;
}

export interface MetricListBreakdownValuesParams extends BasePageParams {
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
   * Breakdown value to group the results by
   */
  group_by?:
    | 'asn'
    | 'asset_id'
    | 'browser'
    | 'browser_version'
    | 'cdn'
    | 'continent_code'
    | 'country'
    | 'custom_1'
    | 'custom_2'
    | 'custom_3'
    | 'custom_4'
    | 'custom_5'
    | 'custom_6'
    | 'custom_7'
    | 'custom_8'
    | 'custom_9'
    | 'custom_10'
    | 'exit_before_video_start'
    | 'experiment_name'
    | 'live_stream_id'
    | 'operating_system'
    | 'operating_system_version'
    | 'page_type'
    | 'page_url'
    | 'playback_failure'
    | 'playback_business_exception'
    | 'playback_id'
    | 'player_autoplay'
    | 'player_error_code'
    | 'player_mux_plugin_name'
    | 'player_mux_plugin_version'
    | 'player_name'
    | 'player_preload'
    | 'player_remote_played'
    | 'player_software'
    | 'player_software_version'
    | 'player_version'
    | 'preroll_ad_asset_hostname'
    | 'preroll_ad_tag_hostname'
    | 'preroll_played'
    | 'preroll_requested'
    | 'region'
    | 'source_hostname'
    | 'source_type'
    | 'stream_type'
    | 'sub_property_id'
    | 'video_content_type'
    | 'video_encoding_variant'
    | 'video_id'
    | 'video_series'
    | 'video_startup_business_exception'
    | 'video_startup_failure'
    | 'video_title'
    | 'view_drm_type'
    | 'view_has_ad'
    | 'view_session_id'
    | 'viewer_connection_type'
    | 'viewer_device_category'
    | 'viewer_device_manufacturer'
    | 'viewer_device_model'
    | 'viewer_device_name'
    | 'viewer_user_id'
    | 'ad_playback_failure'
    | 'content_playback_failure'
    | 'view_dropped'
    | 'client_application_name'
    | 'client_application_version'
    | 'video_affiliate'
    | 'viewer_plan'
    | 'viewer_plan_status'
    | 'viewer_plan_category'
    | 'view_drm_level'
    | 'video_brand'
    | 'used_pip'
    | 'time_shift_enabled'
    | 'used_captions'
    | 'video_codec'
    | 'audio_codec'
    | 'video_dynamic_range_type'
    | 'view_cdn_edge_pop'
    | 'view_cdn_origin'
    | 'video_creator_id'
    | 'video_cdn_trace'
    | 'video_source_height_initial'
    | 'video_source_width_initial'
    | 'video_source_bitrate_initial'
    | 'video_codec_initial'
    | 'audio_codec_initial'
    | 'video_source_fps_initial'
    | 'video_dynamic_range_type_initial'
    | 'video_source_fps'
    | 'video_source_bitrate'
    | 'video_source_height'
    | 'video_source_width';

  /**
   * Measurement for the provided metric. If omitted, the default for the metric will
   * be used. The default measurement for each metric is: "sum" : `ad_attempt_count`,
   * `ad_break_count`, `ad_break_error_count`, `ad_error_count`,
   * `ad_impression_count`, `playing_time` "median" : `ad_preroll_startup_time`,
   * `aggregate_startup_time`, `content_startup_time`, `max_downscale_percentage`,
   * `max_upscale_percentage`, `page_load_time`, `player_average_live_latency`,
   * `player_startup_time`, `rebuffer_count`, `rebuffer_duration`,
   * `requests_for_first_preroll`, `video_startup_preroll_load_time`,
   * `video_startup_preroll_request_time`, `video_startup_time`,
   * `view_average_request_latency`, `view_average_request_throughput`,
   * `view_max_request_latency`, `weighted_average_bitrate` "avg" :
   * `ad_break_error_percentage`, `ad_error_percentage`,
   * `ad_exit_before_start_count`, `ad_exit_before_start_percentage`,
   * `ad_playback_failure_percentage`, `ad_startup_error_count`,
   * `ad_startup_error_percentage`, `content_playback_failure_percentage`,
   * `downscale_percentage`, `exits_before_video_start`,
   * `playback_business_exception_percentage`, `playback_failure_percentage`,
   * `playback_success_score`, `rebuffer_frequency`, `rebuffer_percentage`,
   * `seek_latency`, `smoothness_score`, `startup_time_score`, `upscale_percentage`,
   * `video_quality_score`, `video_startup_business_exception_percentage`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`,
   * `viewer_experience_score` "count" : `started_views`, `unique_viewers`
   */
  measurement?: '95th' | 'median' | 'avg' | 'count' | 'sum';

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

export interface MetricGetOverallValuesParams {
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
   * Measurement for the provided metric. If omitted, the default for the metric will
   * be used. The default measurement for each metric is: "sum" : `ad_attempt_count`,
   * `ad_break_count`, `ad_break_error_count`, `ad_error_count`,
   * `ad_impression_count`, `playing_time` "median" : `ad_preroll_startup_time`,
   * `aggregate_startup_time`, `content_startup_time`, `max_downscale_percentage`,
   * `max_upscale_percentage`, `page_load_time`, `player_average_live_latency`,
   * `player_startup_time`, `rebuffer_count`, `rebuffer_duration`,
   * `requests_for_first_preroll`, `video_startup_preroll_load_time`,
   * `video_startup_preroll_request_time`, `video_startup_time`,
   * `view_average_request_latency`, `view_average_request_throughput`,
   * `view_max_request_latency`, `weighted_average_bitrate` "avg" :
   * `ad_break_error_percentage`, `ad_error_percentage`,
   * `ad_exit_before_start_count`, `ad_exit_before_start_percentage`,
   * `ad_playback_failure_percentage`, `ad_startup_error_count`,
   * `ad_startup_error_percentage`, `content_playback_failure_percentage`,
   * `downscale_percentage`, `exits_before_video_start`,
   * `playback_business_exception_percentage`, `playback_failure_percentage`,
   * `playback_success_score`, `rebuffer_frequency`, `rebuffer_percentage`,
   * `seek_latency`, `smoothness_score`, `startup_time_score`, `upscale_percentage`,
   * `video_quality_score`, `video_startup_business_exception_percentage`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`,
   * `viewer_experience_score` "count" : `started_views`, `unique_viewers`
   */
  measurement?: '95th' | 'median' | 'avg' | 'count' | 'sum';

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

export interface MetricGetInsightsParams {
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
   * Measurement for the provided metric. If omitted, the default for the metric will
   * be used. The default measurement for each metric is: "sum" : `ad_attempt_count`,
   * `ad_break_count`, `ad_break_error_count`, `ad_error_count`,
   * `ad_impression_count`, `playing_time` "median" : `ad_preroll_startup_time`,
   * `aggregate_startup_time`, `content_startup_time`, `max_downscale_percentage`,
   * `max_upscale_percentage`, `page_load_time`, `player_average_live_latency`,
   * `player_startup_time`, `rebuffer_count`, `rebuffer_duration`,
   * `requests_for_first_preroll`, `video_startup_preroll_load_time`,
   * `video_startup_preroll_request_time`, `video_startup_time`,
   * `view_average_request_latency`, `view_average_request_throughput`,
   * `view_max_request_latency`, `weighted_average_bitrate` "avg" :
   * `ad_break_error_percentage`, `ad_error_percentage`,
   * `ad_exit_before_start_count`, `ad_exit_before_start_percentage`,
   * `ad_playback_failure_percentage`, `ad_startup_error_count`,
   * `ad_startup_error_percentage`, `content_playback_failure_percentage`,
   * `downscale_percentage`, `exits_before_video_start`,
   * `playback_business_exception_percentage`, `playback_failure_percentage`,
   * `playback_success_score`, `rebuffer_frequency`, `rebuffer_percentage`,
   * `seek_latency`, `smoothness_score`, `startup_time_score`, `upscale_percentage`,
   * `video_quality_score`, `video_startup_business_exception_percentage`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`,
   * `viewer_experience_score` "count" : `started_views`, `unique_viewers`
   */
  measurement?: '95th' | 'median' | 'avg' | 'count' | 'sum';

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

export interface MetricGetTimeseriesParams {
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
   * Time granularity to group results by. If this value is omitted, a default
   * granularity is chosen based on the timeframe.
   *
   * For timeframes of less than 90 minutes, the default granularity is `minute`.
   * Between 90 minutes and 6 hours, the default granularity is `ten_minutes`.
   * Between 6 hours and 15 days inclusive, the default granularity is `hour`. The
   * granularity of timeframes that exceed 15 days is `day`. This default behavior is
   * subject to change; it is strongly suggested that you explicitly specify the
   * granularity.
   */
  group_by?: 'minute' | 'ten_minutes' | 'hour' | 'day';

  /**
   * Measurement for the provided metric. If omitted, the default for the metric will
   * be used. The default measurement for each metric is: "sum" : `ad_attempt_count`,
   * `ad_break_count`, `ad_break_error_count`, `ad_error_count`,
   * `ad_impression_count`, `playing_time` "median" : `ad_preroll_startup_time`,
   * `aggregate_startup_time`, `content_startup_time`, `max_downscale_percentage`,
   * `max_upscale_percentage`, `page_load_time`, `player_average_live_latency`,
   * `player_startup_time`, `rebuffer_count`, `rebuffer_duration`,
   * `requests_for_first_preroll`, `video_startup_preroll_load_time`,
   * `video_startup_preroll_request_time`, `video_startup_time`,
   * `view_average_request_latency`, `view_average_request_throughput`,
   * `view_max_request_latency`, `weighted_average_bitrate` "avg" :
   * `ad_break_error_percentage`, `ad_error_percentage`,
   * `ad_exit_before_start_count`, `ad_exit_before_start_percentage`,
   * `ad_playback_failure_percentage`, `ad_startup_error_count`,
   * `ad_startup_error_percentage`, `content_playback_failure_percentage`,
   * `downscale_percentage`, `exits_before_video_start`,
   * `playback_business_exception_percentage`, `playback_failure_percentage`,
   * `playback_success_score`, `rebuffer_frequency`, `rebuffer_percentage`,
   * `seek_latency`, `smoothness_score`, `startup_time_score`, `upscale_percentage`,
   * `video_quality_score`, `video_startup_business_exception_percentage`,
   * `video_startup_failure_percentage`, `view_dropped_percentage`,
   * `viewer_experience_score` "count" : `started_views`, `unique_viewers`
   */
  measurement?: '95th' | 'median' | 'avg' | 'count' | 'sum';

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

export declare namespace Metrics {
  export {
    type AllMetricValuesResponse as AllMetricValuesResponse,
    type BreakdownValue as BreakdownValue,
    type InsightsResponse as InsightsResponse,
    type MetricTimeseriesDataResponse as MetricTimeseriesDataResponse,
    type OverallValuesResponse as OverallValuesResponse,
    type BreakdownValuesBasePage as BreakdownValuesBasePage,
    type MetricListParams as MetricListParams,
    type MetricListBreakdownValuesParams as MetricListBreakdownValuesParams,
    type MetricGetOverallValuesParams as MetricGetOverallValuesParams,
    type MetricGetInsightsParams as MetricGetInsightsParams,
    type MetricGetTimeseriesParams as MetricGetTimeseriesParams,
  };
}
