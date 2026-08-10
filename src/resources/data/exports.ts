// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Exports allow you to download the daily CSV files that are generated from the video views that occurred in the previous day. Please contact [support](mailto:support@mux.com) for information about enabling exports for your organization.
 */
export class Exports extends APIResource {
  /**
   * Lists the available video view exports along with URLs to retrieve them.
   *
   * @example
   * ```ts
   * const videoViewExportsResponse =
   *   await client.data.exports.listVideoViews();
   * ```
   */
  listVideoViews(options?: RequestOptions): APIPromise<VideoViewExportsResponse> {
    return this._client.get('/data/v1/exports/views', { defaultBaseURL: 'https://api.mux.com', ...options });
  }
}

export interface VideoViewExportsResponse {
  data: Array<VideoViewExportsResponse.Data>;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export namespace VideoViewExportsResponse {
  export interface Data {
    export_date: string;

    files: Array<Data.File>;
  }

  export namespace Data {
    export interface File {
      path: string;

      type: string;

      version: number;
    }
  }
}

export declare namespace Exports {
  export { type VideoViewExportsResponse as VideoViewExportsResponse };
}
