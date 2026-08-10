// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Usage Exports provide programmatic access to your organization's billing usage data. The Usage Exports feature must be enabled for your organization in the Mux Dashboard under **Usage > Exports**.
 */
export class UsageExports extends APIResource {
  /**
   * Lists available billing usage exports for your organization along with
   * pre-signed download URLs, sorted newest first. CSVs are available for dates
   * between 400 days ago and yesterday.
   */
  list(
    query: UsageExportListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UsageExportsResponse> {
    return this._client.get('/system/v1/usage/exports', {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export interface UsageExport {
  /**
   * The calendar date this CSV covers, in `YYYY-MM-DD` format.
   */
  date: string;

  /**
   * A pre-signed URL to download the CSV. Valid until `download_url_expires_at`.
   */
  download_url: string;

  /**
   * Unix timestamp (seconds since epoch) at which `download_url` expires.
   */
  download_url_expires_at: number;

  /**
   * Uncompressed size of the CSV file in bytes. May be `null` if the size is
   * unavailable.
   */
  file_size: number | null;
}

export interface UsageExportsMeta {
  /**
   * Maximum number of items per page.
   */
  limit: number;

  /**
   * Current page number (1-based).
   */
  page: number;

  /**
   * Total number of pages.
   */
  pages: number;

  /**
   * Total number of available export files matching the query.
   */
  total: number;
}

export interface UsageExportsResponse {
  data: Array<UsageExport>;

  meta: UsageExportsMeta;
}

export interface UsageExportListParams {
  /**
   * Lifetime in seconds for the pre-signed download URL.
   */
  download_url_ttl?: number;

  /**
   * Number of items to include in the response
   */
  limit?: number;

  /**
   * Offset by this many pages, of the size of `limit`
   */
  page?: number;

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

export declare namespace UsageExports {
  export {
    type UsageExport as UsageExport,
    type UsageExportsMeta as UsageExportsMeta,
    type UsageExportsResponse as UsageExportsResponse,
    type UsageExportListParams as UsageExportListParams,
  };
}
