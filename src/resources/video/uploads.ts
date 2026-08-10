// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Direct upload allows you to push assets directly to Mux storage instead of needing to go through your own first. When you create a new direct upload, we'll give you back a signed URL for a Google Cloud Storage bucket. Their storage API is S3 compatible, so whatever tool you use to upload to either GCS or S3 should work, just remember you're probably uploading large video files and should [take advantage of things like resumable or multipart uploads](https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload).
 *
 * Particularly for customers that deal with a lot of user-generated content, it's common to expect quite a few abandoned uploads. To keep those abandoned uploads from cluttering up your asset lists, we don't create an asset for you until the upload is complete. Once that asset is created, you can expect all of the normal asset-related webhooks.
 */
export class Uploads extends APIResource {
  /**
   * Creates a new direct upload, through which video content can be uploaded for
   * ingest to Mux.
   *
   * @example
   * ```ts
   * const upload = await client.video.uploads.create({
   *   cors_origin: 'https://example.com/',
   *   new_asset_settings: { playback_policies: ['public'] },
   * });
   * ```
   */
  create(body: UploadCreateParams, options?: RequestOptions): APIPromise<Upload> {
    return (
      this._client.post('/video/v1/uploads', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Upload }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Fetches information about a single direct upload in the current environment.
   *
   * @example
   * ```ts
   * const upload = await client.video.uploads.retrieve(
   *   'abcd1234',
   * );
   * ```
   */
  retrieve(uploadID: string, options?: RequestOptions): APIPromise<Upload> {
    return (
      this._client.get(path`/video/v1/uploads/${uploadID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Upload }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Cancels a direct upload and marks it as cancelled. If a pending upload finishes
   * after this request, no asset will be created. This request will only succeed if
   * the upload is still in the `waiting` state.
   *
   * @example
   * ```ts
   * const upload = await client.video.uploads.cancel(
   *   'abcd1234',
   * );
   * ```
   */
  cancel(uploadID: string, options?: RequestOptions): APIPromise<Upload> {
    return (
      this._client.put(path`/video/v1/uploads/${uploadID}/cancel`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Upload }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Lists direct uploads in the current environment.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const upload of client.video.uploads.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: UploadListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<UploadsBasePage, Upload> {
    return this._client.getAPIList('/video/v1/uploads', BasePage<Upload>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export type UploadsBasePage = BasePage<Upload>;

export interface Upload {
  /**
   * Unique identifier for the Direct Upload.
   */
  id: string;

  /**
   * If the upload URL will be used in a browser, you must specify the origin in
   * order for the signed URL to have the correct CORS headers.
   */
  cors_origin: string;

  status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';

  /**
   * Max time in seconds for the signed upload URL to be valid. If a successful
   * upload has not occurred before the timeout limit, the direct upload is marked
   * `timed_out`
   */
  timeout: number;

  /**
   * Only set once the upload is in the `asset_created` state.
   */
  asset_id?: string;

  /**
   * Only set if an error occurred during asset creation.
   */
  error?: Upload.Error;

  new_asset_settings?: AssetsAPI.AssetOptions;

  /**
   * Indicates if this is a test Direct Upload, in which case the Asset that gets
   * created will be a `test` Asset.
   */
  test?: boolean;

  /**
   * The URL to upload the associated source media to.
   */
  url?: string;
}

export namespace Upload {
  /**
   * Only set if an error occurred during asset creation.
   */
  export interface Error {
    /**
     * Human readable error message
     */
    message?: string;

    /**
     * Label for the specific error
     */
    type?: string;
  }
}

export interface UploadResponse {
  data: Upload;
}

export interface UploadCreateParams {
  /**
   * If the upload URL will be used in a browser, you must specify the origin in
   * order for the signed URL to have the correct CORS headers.
   */
  cors_origin: string;

  new_asset_settings?: AssetsAPI.AssetOptions;

  /**
   * Indicates if this is a test Direct Upload, in which case the Asset that gets
   * created will be a `test` Asset.
   */
  test?: boolean;

  /**
   * Max time in seconds for the signed upload URL to be valid. If a successful
   * upload has not occurred before the timeout limit, the direct upload is marked
   * `timed_out`
   */
  timeout?: number;
}

export interface UploadListParams extends BasePageParams {}

export declare namespace Uploads {
  export {
    type Upload as Upload,
    type UploadResponse as UploadResponse,
    type UploadsBasePage as UploadsBasePage,
    type UploadCreateParams as UploadCreateParams,
    type UploadListParams as UploadListParams,
  };
}
