// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Monitoring metrics are used for operational monitoring of a video platform.
 * The metrics are aggregated in five second intervals, across the views that
 * are currently being watched. The real-time metrics' timeline, breakdown,
 * and histogram representations are available via the APIs.
 *
 * Monitoring metrics are similar but not directly comparable to the historical
 * metrics in the Metrics APIs. These metrics are aggregated to provide the most
 * operational detail possible used for resolving operational issues.
 * Mux Data Monitoring metrics are available to Mux Data customers on a Media plan.
 */
export class Metrics extends APIResource {
  /**
   * Lists available monitoring metrics.
   *
   * @example
   * ```ts
   * const metrics = await client.data.monitoring.metrics.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<MetricListResponse> {
    return this._client.get('/data/v1/monitoring/metrics', {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets breakdown information for a specific dimension and metric along with the
   * number of concurrent viewers and negative impact score.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.monitoring.metrics.getBreakdown(
   *     'current-concurrent-viewers',
   *   );
   * ```
   */
  getBreakdown(
    monitoringMetricID:
      | 'current-concurrent-viewers'
      | 'current-rebuffering-percentage'
      | 'exits-before-video-start'
      | 'playback-failure-percentage'
      | 'current-average-bitrate'
      | 'video-startup-failure-percentage',
    query: MetricGetBreakdownParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MetricGetBreakdownResponse> {
    return this._client.get(path`/data/v1/monitoring/metrics/${monitoringMetricID}/breakdown`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets Time series information for a specific metric along with the number of
   * concurrent viewers.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.monitoring.metrics.getTimeseries(
   *     'current-concurrent-viewers',
   *   );
   * ```
   */
  getTimeseries(
    monitoringMetricID:
      | 'current-concurrent-viewers'
      | 'current-rebuffering-percentage'
      | 'exits-before-video-start'
      | 'playback-failure-percentage'
      | 'current-average-bitrate'
      | 'video-startup-failure-percentage',
    query: MetricGetTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MetricGetTimeseriesResponse> {
    return this._client.get(path`/data/v1/monitoring/metrics/${monitoringMetricID}/timeseries`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets timeseries of breakdown information for a specific dimension and metric.
   * Each datapoint in the response represents 5 seconds worth of data.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.monitoring.metrics.getBreakdownTimeseries(
   *     'current-concurrent-viewers',
   *   );
   * ```
   */
  getBreakdownTimeseries(
    monitoringMetricID:
      | 'current-concurrent-viewers'
      | 'current-rebuffering-percentage'
      | 'exits-before-video-start'
      | 'playback-failure-percentage'
      | 'current-average-bitrate'
      | 'video-startup-failure-percentage',
    query: MetricGetBreakdownTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MetricGetBreakdownTimeseriesResponse> {
    return this._client.get(path`/data/v1/monitoring/metrics/${monitoringMetricID}/breakdown-timeseries`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets histogram timeseries information for a specific metric.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.monitoring.metrics.getHistogramTimeseries(
   *     'video-startup-time',
   *   );
   * ```
   */
  getHistogramTimeseries(
    monitoringHistogramMetricID: 'video-startup-time',
    query: MetricGetHistogramTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MetricGetHistogramTimeseriesResponse> {
    return this._client.get(
      path`/data/v1/monitoring/metrics/${monitoringHistogramMetricID}/histogram-timeseries`,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }
}

export interface MetricListResponse {
  data: Array<MetricListResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MetricListResponse {
  export interface Data {
    display_name: string;

    name: string;
  }
}

export interface MetricGetBreakdownResponse {
  data: Array<MetricGetBreakdownResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MetricGetBreakdownResponse {
  export interface Data {
    concurrent_viewers: number;

    metric_value: number | null;

    negative_impact: number;

    starting_up_viewers: number;

    value: string | null;

    display_value?: string;
  }
}

export interface MetricGetBreakdownTimeseriesResponse {
  data: Array<MetricGetBreakdownTimeseriesResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MetricGetBreakdownTimeseriesResponse {
  export interface Data {
    date: string;

    values: Array<Data.Value>;
  }

  export namespace Data {
    export interface Value {
      concurrent_viewers: number;

      metric_value: number | null;

      starting_up_viewers: number;

      value: string | null;
    }
  }
}

export interface MetricGetHistogramTimeseriesResponse {
  data: Array<MetricGetHistogramTimeseriesResponse.Data>;

  meta: MetricGetHistogramTimeseriesResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MetricGetHistogramTimeseriesResponse {
  export interface Data {
    average: number | null;

    bucket_values: Array<Data.BucketValue>;

    max_percentage: number;

    median: number | null;

    p95: number | null;

    sum: number;

    timestamp: string;
  }

  export namespace Data {
    export interface BucketValue {
      count: number;

      percentage: number;
    }
  }

  export interface Meta {
    bucket_unit: string;

    buckets: Array<Meta.Bucket>;
  }

  export namespace Meta {
    export interface Bucket {
      end: number | null;

      start: number;
    }
  }
}

export interface MetricGetTimeseriesResponse {
  data: Array<MetricGetTimeseriesResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MetricGetTimeseriesResponse {
  export interface Data {
    concurrent_viewers: number;

    date: string;

    value: number | null;
  }
}

export interface MetricGetBreakdownParams {
  /**
   * Dimension the specified value belongs to
   */
  dimension?:
    | 'asn'
    | 'cdn'
    | 'country'
    | 'operating_system'
    | 'player_name'
    | 'region'
    | 'stream_type'
    | 'sub_property_id'
    | 'video_series'
    | 'video_title'
    | 'view_has_ad';

  /**
   * Limit the results to rows that match conditions from provided key:value pairs.
   * Must be provided as an array query string parameter.
   *
   * To exclude rows that match a certain condition, prepend a `!` character to the
   * dimension.
   *
   * Possible filter names are the same as returned by the List Monitoring Dimensions
   * endpoint.
   *
   * Example:
   *
   * - `filters[]=operating_system:windows&filters[]=!country:US`
   */
  filters?: Array<string>;

  /**
   * Value to order the results by
   */
  order_by?: 'negative_impact' | 'value' | 'views' | 'field';

  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';

  /**
   * Timestamp to limit results by. This value must be provided as a unix timestamp.
   * Defaults to the current unix timestamp.
   */
  timestamp?: number;
}

export interface MetricGetTimeseriesParams {
  /**
   * Limit the results to rows that match conditions from provided key:value pairs.
   * Must be provided as an array query string parameter.
   *
   * To exclude rows that match a certain condition, prepend a `!` character to the
   * dimension.
   *
   * Possible filter names are the same as returned by the List Monitoring Dimensions
   * endpoint.
   *
   * Example:
   *
   * - `filters[]=operating_system:windows&filters[]=!country:US`
   */
  filters?: Array<string>;

  /**
   * Timestamp to use as the start of the timeseries data. This value must be
   * provided as a unix timestamp. Defaults to 30 minutes ago.
   */
  timestamp?: number;
}

export interface MetricGetBreakdownTimeseriesParams {
  /**
   * Dimension the specified value belongs to
   */
  dimension?:
    | 'asn'
    | 'cdn'
    | 'country'
    | 'operating_system'
    | 'player_name'
    | 'region'
    | 'stream_type'
    | 'sub_property_id'
    | 'video_series'
    | 'video_title'
    | 'view_has_ad';

  /**
   * Limit the results to rows that match conditions from provided key:value pairs.
   * Must be provided as an array query string parameter.
   *
   * To exclude rows that match a certain condition, prepend a `!` character to the
   * dimension.
   *
   * Possible filter names are the same as returned by the List Monitoring Dimensions
   * endpoint.
   *
   * Example:
   *
   * - `filters[]=operating_system:windows&filters[]=!country:US`
   */
  filters?: Array<string>;

  /**
   * Number of items to include in each timestamp's `value` list.
   *
   * The default is 10, and the maximum is 100.
   */
  limit?: number;

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
   * The default for this is the last 60 seconds of available data. Timeframes larger
   * than 10 minutes are not allowed, and must be within the last 24 hours.
   */
  timeframe?: Array<string>;
}

export interface MetricGetHistogramTimeseriesParams {
  /**
   * Limit the results to rows that match conditions from provided key:value pairs.
   * Must be provided as an array query string parameter.
   *
   * To exclude rows that match a certain condition, prepend a `!` character to the
   * dimension.
   *
   * Possible filter names are the same as returned by the List Monitoring Dimensions
   * endpoint.
   *
   * Example:
   *
   * - `filters[]=operating_system:windows&filters[]=!country:US`
   */
  filters?: Array<string>;
}

export declare namespace Metrics {
  export {
    type MetricListResponse as MetricListResponse,
    type MetricGetBreakdownResponse as MetricGetBreakdownResponse,
    type MetricGetBreakdownTimeseriesResponse as MetricGetBreakdownTimeseriesResponse,
    type MetricGetHistogramTimeseriesResponse as MetricGetHistogramTimeseriesResponse,
    type MetricGetTimeseriesResponse as MetricGetTimeseriesResponse,
    type MetricGetBreakdownParams as MetricGetBreakdownParams,
    type MetricGetTimeseriesParams as MetricGetTimeseriesParams,
    type MetricGetBreakdownTimeseriesParams as MetricGetBreakdownTimeseriesParams,
    type MetricGetHistogramTimeseriesParams as MetricGetHistogramTimeseriesParams,
  };
}
