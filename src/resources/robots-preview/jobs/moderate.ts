// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Analyze a video for inappropriate content.
 */
export class Moderate extends APIResource {
  /**
   * Creates a new job that uses AI to analyze a Mux Video asset for inappropriate
   * content.
   *
   * @example
   * ```ts
   * const moderateJob =
   *   await client.robotsPreview.jobs.moderate.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       thresholds: { sexual: 0.7, violence: 0.8 },
   *     },
   *   });
   * ```
   */
  create(body: ModerateCreateParams, options?: RequestOptions): APIPromise<ModerateJob> {
    return (
      this._client.post('/robots/v0/jobs/moderate', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: ModerateJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'moderate' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const moderateJob =
   *   await client.robotsPreview.jobs.moderate.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<ModerateJob> {
    return (
      this._client.get(path`/robots/v0/jobs/moderate/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: ModerateJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface ModerateJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: ModerateJobParameters;

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

  workflow: 'moderate';

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<JobsAPI.JobError>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: ModerateJobOutputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: ModerateJob.Resources;
}

export namespace ModerateJob {
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
export interface ModerateJobOutputs {
  /**
   * True if any category's max score exceeds its configured threshold.
   */
  exceeds_threshold: boolean;

  /**
   * Highest scores across all thumbnails for each category.
   */
  max_scores: ModerateJobOutputs.MaxScores;

  /**
   * Per-thumbnail moderation scores.
   */
  thumbnail_scores: Array<ModerateJobOutputs.ThumbnailScore>;
}

export namespace ModerateJobOutputs {
  /**
   * Highest scores across all thumbnails for each category.
   */
  export interface MaxScores {
    sexual: number;

    violence: number;
  }

  export interface ThumbnailScore {
    /**
     * Sexual content score from 0.0 to 1.0.
     */
    sexual: number;

    /**
     * Violence content score from 0.0 to 1.0.
     */
    violence: number;

    /**
     * Time in seconds of the thumbnail within the video. Absent for transcript
     * moderation.
     */
    time?: number;
  }
}

export interface ModerateJobParameters {
  /**
   * The Mux asset ID of the video to moderate.
   */
  asset_id: string;

  /**
   * BCP 47 language code for transcript analysis. Used only for audio-only assets;
   * ignored for video assets with visual content. If omitted for audio-only assets,
   * the first ready text track is used. Defaults to "en".
   */
  language_code?: string;

  /**
   * Maximum number of thumbnails to sample. Acts as a cap — if sampling_interval
   * produces fewer samples than this limit, the interval is respected; otherwise
   * samples are evenly distributed with first and last frames pinned.
   */
  max_samples?: number;

  /**
   * Interval, in seconds, between sampled thumbnails. Minimum 5 seconds. When
   * max_samples is also set, the actual sampling density is the more restrictive of
   * the two constraints.
   */
  sampling_interval?: number;

  /**
   * Score thresholds that determine whether content is flagged. When combined with
   * sampling_interval or max_samples, the exceeds_threshold flag reflects whether
   * any category's highest observed score exceeds its configured threshold. Defaults
   * to {sexual: 0.7, violence: 0.8}.
   */
  thresholds?: ModerateJobParameters.Thresholds;
}

export namespace ModerateJobParameters {
  /**
   * Score thresholds that determine whether content is flagged. When combined with
   * sampling_interval or max_samples, the exceeds_threshold flag reflects whether
   * any category's highest observed score exceeds its configured threshold. Defaults
   * to {sexual: 0.7, violence: 0.8}.
   */
  export interface Thresholds {
    /**
     * Score threshold for sexual content. Content scoring above this value triggers
     * exceeds_threshold.
     */
    sexual?: number;

    /**
     * Score threshold for violent content. Content scoring above this value triggers
     * exceeds_threshold.
     */
    violence?: number;
  }
}

export interface ModerateCreateParams {
  parameters: ModerateJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace Moderate {
  export {
    type ModerateJob as ModerateJob,
    type ModerateJobOutputs as ModerateJobOutputs,
    type ModerateJobParameters as ModerateJobParameters,
    type ModerateCreateParams as ModerateCreateParams,
  };
}
