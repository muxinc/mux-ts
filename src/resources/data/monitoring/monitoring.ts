// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as MetricsAPI from './metrics';
import {
  MetricGetBreakdownParams,
  MetricGetBreakdownResponse,
  MetricGetBreakdownTimeseriesParams,
  MetricGetBreakdownTimeseriesResponse,
  MetricGetHistogramTimeseriesParams,
  MetricGetHistogramTimeseriesResponse,
  MetricGetTimeseriesParams,
  MetricGetTimeseriesResponse,
  MetricListResponse,
  Metrics,
} from './metrics';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

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
export class Monitoring extends APIResource {
  metrics: MetricsAPI.Metrics = new MetricsAPI.Metrics(this._client);

  /**
   * Lists available monitoring dimensions.
   *
   * @example
   * ```ts
   * const response =
   *   await client.data.monitoring.listDimensions();
   * ```
   */
  listDimensions(options?: RequestOptions): APIPromise<MonitoringListDimensionsResponse> {
    return this._client.get('/data/v1/monitoring/dimensions', {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface MonitoringListDimensionsResponse {
  data: Array<MonitoringListDimensionsResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace MonitoringListDimensionsResponse {
  export interface Data {
    display_name: string;

    name: string;
  }
}

Monitoring.Metrics = Metrics;

export declare namespace Monitoring {
  export { type MonitoringListDimensionsResponse as MonitoringListDimensionsResponse };

  export {
    Metrics as Metrics,
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
