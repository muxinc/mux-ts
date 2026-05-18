// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Translate captions from one language to another.
 */
export class TranslateCaptions extends APIResource {
  /**
   * Creates a new job that translates captions on a Mux Video asset from one
   * language to another.
   *
   * @example
   * ```ts
   * const translateCaptionsJob =
   *   await client.robotsPreview.jobs.translateCaptions.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       track_id: 'track_en_abc123',
   *       to_language_code: 'es',
   *       upload_to_mux: true,
   *     },
   *   });
   * ```
   */
  create(body: TranslateCaptionCreateParams, options?: RequestOptions): APIPromise<TranslateCaptionsJob> {
    return (
      this._client.post('/robots/v0/jobs/translate-captions', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'translate-captions' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const translateCaptionsJob =
   *   await client.robotsPreview.jobs.translateCaptions.retrieve(
   *     'x',
   *   );
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<TranslateCaptionsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/translate-captions/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface TranslateCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: TranslateCaptionsJobParameters;

  /**
   * Current job status.
   */
  status: JobsAPI.JobStatus;

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) when the job was last updated.
   */
  updated_at: number;

  workflow: 'translate-captions';

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<JobsAPI.JobError>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: TranslateCaptionsJobOutputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: TranslateCaptionsJob.Resources;
}

export namespace TranslateCaptionsJob {
  /**
   * Related Mux resources linked to this job.
   */
  export interface Resources {
    /**
     * Mux assets associated with this job.
     */
    assets: Array<Resources.Asset>;
  }

  export namespace Resources {
    export interface Asset {
      /**
       * Mux asset ID.
       */
      id: string;

      /**
       * Hypermedia links for the asset.
       */
      _links: Asset._Links;

      /**
       * Mux asset metadata, if available.
       */
      meta?: Asset.Meta;

      /**
       * Passthrough string from the Mux asset.
       */
      passthrough?: string;
    }

    export namespace Asset {
      /**
       * Hypermedia links for the asset.
       */
      export interface _Links {
        self: _Links.Self;
      }

      export namespace _Links {
        export interface Self {
          /**
           * URL to the Mux asset resource.
           */
          href: string;
        }
      }

      /**
       * Mux asset metadata, if available.
       */
      export interface Meta {
        /**
         * Creator identifier from Mux metadata.
         */
        creator_id?: string;

        /**
         * External identifier from Mux metadata.
         */
        external_id?: string;

        /**
         * Asset title from Mux metadata.
         */
        title?: string;
      }
    }
  }
}

/**
 * Workflow results. Present when status is 'completed'.
 */
export interface TranslateCaptionsJobOutputs {
  /**
   * Temporary pre-signed URL to download the translated VTT file. Present when
   * upload_to_mux is true.
   */
  temporary_vtt_url?: string;

  /**
   * The Mux text track ID of the source caption track that was translated.
   */
  track_id?: string;

  /**
   * Mux text track ID of the uploaded translated captions. Present when
   * upload_to_mux is true.
   */
  uploaded_track_id?: string;
}

export interface TranslateCaptionsJobParameters {
  /**
   * The Mux asset ID of the video whose captions will be translated.
   */
  asset_id: string;

  /**
   * BCP 47 language code for the translated output (e.g. "es", "ja"). The asset must
   * not already have a text track for this language.
   */
  to_language_code: string;

  /**
   * The Mux text track ID of the source caption track to translate. The asset must
   * have a ready text track matching this ID or the request will be rejected.
   */
  track_id: string;

  /**
   * Whether to upload the translated VTT and attach it as a text track on the Mux
   * asset. Defaults to true.
   */
  upload_to_mux?: boolean;
}

export interface TranslateCaptionCreateParams {
  parameters: TranslateCaptionsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace TranslateCaptions {
  export {
    type TranslateCaptionsJob as TranslateCaptionsJob,
    type TranslateCaptionsJobOutputs as TranslateCaptionsJobOutputs,
    type TranslateCaptionsJobParameters as TranslateCaptionsJobParameters,
    type TranslateCaptionCreateParams as TranslateCaptionCreateParams,
  };
}
