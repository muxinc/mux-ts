// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * The Mux Data Real-time API has been deprecated, please refer to the
 * Mux Data `Monitoring` APIs which provide the same functionality.
 * Mux Data Monitoring metrics are available to Mux Data customers on a Media plan.
 */
export class RealTime extends APIResource {
  /**
   * Gets breakdown information for a specific dimension and metric along with the
   * number of concurrent viewers and negative impact score. This API is now
   * deprecated, please use the `Get Monitoring Breakdown` API.
   *
   * @deprecated
   */
  retrieveBreakdown(
    realtimeMetricID:
      | 'current-concurrent-viewers'
      | 'current-rebuffering-percentage'
      | 'exits-before-video-start'
      | 'playback-failure-percentage'
      | 'current-average-bitrate',
    query: RealTimeRetrieveBreakdownParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RealTimeBreakdownResponse> {
    return this._client.get(path`/data/v1/realtime/metrics/${realtimeMetricID}/breakdown`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets Time series information for a specific metric along with the number of
   * concurrent viewers. This API is now deprecated, please use the
   * `Get Monitoring Timeseries` API.
   *
   * @deprecated
   */
  retrieveTimeseries(
    realtimeMetricID:
      | 'current-concurrent-viewers'
      | 'current-rebuffering-percentage'
      | 'exits-before-video-start'
      | 'playback-failure-percentage'
      | 'current-average-bitrate',
    query: RealTimeRetrieveTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RealTimeTimeseriesResponse> {
    return this._client.get(path`/data/v1/realtime/metrics/${realtimeMetricID}/timeseries`, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Lists available real-time metrics. This API is now deprecated, please use the
   * `List Monitoring Metrics` API.
   *
   * @deprecated
   */
  listMetrics(options?: RequestOptions): APIPromise<RealTimeMetricsResponse> {
    return this._client.get('/data/v1/realtime/metrics', {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Gets histogram timeseries information for a specific metric. This API is now
   * deprecated, please use the `Get Monitoring Histogram Timeseries` API.
   *
   * @deprecated
   */
  retrieveHistogramTimeseries(
    realtimeHistogramMetricID: 'video-startup-time',
    query: RealTimeRetrieveHistogramTimeseriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RealTimeHistogramTimeseriesResponse> {
    return this._client.get(
      path`/data/v1/realtime/metrics/${realtimeHistogramMetricID}/histogram-timeseries`,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }

  /**
   * Lists available real-time dimensions. This API is now deprecated, please use the
   * `List Monitoring Dimensions` API.
   *
   * @deprecated
   */
  listDimensions(options?: RequestOptions): APIPromise<RealTimeDimensionsResponse> {
    return this._client.get('/data/v1/realtime/dimensions', {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface RealTimeBreakdownResponse {
  data: Array<RealTimeBreakdownResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace RealTimeBreakdownResponse {
  export interface Data {
    concurrent_viewers: number;

    metric_value: number | null;

    negative_impact: number;

    starting_up_viewers: number;

    value: string | null;

    display_value?: string;
  }
}

export interface RealTimeDimensionsResponse {
  data: Array<RealTimeDimensionsResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace RealTimeDimensionsResponse {
  export interface Data {
    display_name: string;

    name: string;
  }
}

export interface RealTimeHistogramTimeseriesResponse {
  data: Array<RealTimeHistogramTimeseriesResponse.Data>;

  meta: RealTimeHistogramTimeseriesResponse.Meta;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace RealTimeHistogramTimeseriesResponse {
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

export interface RealTimeMetricsResponse {
  data: Array<RealTimeMetricsResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace RealTimeMetricsResponse {
  export interface Data {
    display_name: string;

    name: string;
  }
}

export interface RealTimeTimeseriesResponse {
  data: Array<RealTimeTimeseriesResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace RealTimeTimeseriesResponse {
  export interface Data {
    concurrent_viewers: number;

    date: string;

    value: number | null;
  }
}

export interface RealTimeRetrieveBreakdownParams {
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
    | 'video_title';

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

export interface RealTimeRetrieveTimeseriesParams {
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

export interface RealTimeRetrieveHistogramTimeseriesParams {
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

export declare namespace RealTime {
  export {
    type RealTimeBreakdownResponse as RealTimeBreakdownResponse,
    type RealTimeDimensionsResponse as RealTimeDimensionsResponse,
    type RealTimeHistogramTimeseriesResponse as RealTimeHistogramTimeseriesResponse,
    type RealTimeMetricsResponse as RealTimeMetricsResponse,
    type RealTimeTimeseriesResponse as RealTimeTimeseriesResponse,
    type RealTimeRetrieveBreakdownParams as RealTimeRetrieveBreakdownParams,
    type RealTimeRetrieveTimeseriesParams as RealTimeRetrieveTimeseriesParams,
    type RealTimeRetrieveHistogramTimeseriesParams as RealTimeRetrieveHistogramTimeseriesParams,
  };
}
