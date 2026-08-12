// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Sample thumbnails from a Mux Video asset, score them with AI, and select the best thumbnail candidates. This workflow is experimental and subject to change.
 */
export class FindBestThumbnails extends APIResource {
  /**
   * Creates a new job that samples thumbnails from a Mux Video asset, scores them
   * with AI, and selects the best thumbnail candidates. Optional
   * output_steering.scope hard-limits sampling to a time window expressed in seconds
   * while returned timestamps stay absolute to the asset timeline. Other output
   * steering can guide scoring strategy, explicit user intent, audience, and
   * campaign style without changing the response schema.
   *
   * @example
   * ```ts
   * const findBestThumbnailsJob =
   *   await client.robots.jobs.findBestThumbnails.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       max_thumbnails: 3,
   *       update_asset_thumbnail: true,
   *       output_steering: {
   *         scope: { start_time: 30, end_time: 180 },
   *         selection_strategy: 'campaign_thumbnail',
   *         scoring_priorities: ['composition', 'brand_fit'],
   *       },
   *     },
   *   });
   * ```
   */
  create(body: FindBestThumbnailCreateParams, options?: RequestOptions): APIPromise<FindBestThumbnailsJob> {
    return (
      this._client.post('/robots/v0/jobs/find-best-thumbnails', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindBestThumbnailsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'find-best-thumbnails' job. Jobs
   * are automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const findBestThumbnailsJob =
   *   await client.robots.jobs.findBestThumbnails.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<FindBestThumbnailsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/find-best-thumbnails/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindBestThumbnailsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface FindBestThumbnailsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: FindBestThumbnailsJobParameters;

  /**
   * Current job status.
   */
  status: JobsAPI.JobStatus;

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'find-best-thumbnails';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: JobsAPI.JobDirectiveContext;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<JobsAPI.JobError>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: FindBestThumbnailsJobOutputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: JobsAPI.JobResources;
}

/**
 * Workflow results. Present when status is 'completed'.
 */
export interface FindBestThumbnailsJobOutputs {
  /**
   * Selected candidate thumbnails from the original asset timeline, ordered best to
   * worst by overall quality score.
   */
  best_thumbnails: Array<FindBestThumbnailsJobOutputs.BestThumbnail>;
}

export namespace FindBestThumbnailsJobOutputs {
  export interface BestThumbnail {
    /**
     * AI-generated description of the frame content.
     */
    description: string;

    /**
     * Overall quality score from 0 to 1.
     */
    overall: number;

    /**
     * Per-category quality scores.
     */
    subscores: BestThumbnail.Subscores;

    /**
     * Absolute frame timestamp in whole milliseconds on the original asset timeline.
     */
    timestamp_ms: number;

    /**
     * Suggested alternative text for the candidate thumbnail image, suitable for use
     * with the thumbnail URL in an accessible UI.
     */
    alt_text?: string;
  }

  export namespace BestThumbnail {
    /**
     * Per-category quality scores.
     */
    export interface Subscores {
      /**
       * Alignment with brand guidelines score (0-1).
       */
      brand_fit: number;

      /**
       * Visual composition and framing quality score (0-1).
       */
      composition: number;

      /**
       * Color contrast and vibrancy score (0-1).
       */
      contrast_color: number;

      /**
       * Presence of faces or dynamic action score (0-1).
       */
      face_or_action: number;

      /**
       * Sharpness and focus quality score (0-1).
       */
      focus: number;
    }
  }
}

export interface FindBestThumbnailsJobParameters {
  /**
   * Mux asset ID.
   */
  asset_id: string;

  /**
   * Maximum number of candidate thumbnails to return (1-5). Defaults to 1.
   */
  max_thumbnails?: number;

  /**
   * Curated output_steering controls for execution scope, thumbnail scoring
   * strategy, explicit user intent, audience, campaign style, and scoring
   * priorities. Scope is enforced; other controls guide model behavior but do not
   * guarantee exact output.
   */
  output_steering?: FindBestThumbnailsOutputSteering;

  /**
   * When true, the highest-scoring thumbnail's timestamp is written to the Mux
   * asset's thumbnail_time once the job completes, making that frame the asset's
   * default poster image. The new thumbnail will appear for some clients sooner than
   * others, depending on local cache settings.
   */
  update_asset_thumbnail?: boolean;
}

/**
 * Curated output_steering controls for execution scope, thumbnail scoring
 * strategy, explicit user intent, audience, campaign style, and scoring
 * priorities. Scope is enforced; other controls guide model behavior but do not
 * guarantee exact output.
 */
export interface FindBestThumbnailsOutputSteering {
  /**
   * Intended audience used as best-effort scoring guidance. Does not change the
   * output schema.
   */
  audience?: string;

  /**
   * Short description of the campaign/channel thumbnail style to prefer when
   * supported by the frame.
   */
  campaign_style?: string;

  /**
   * Open-ended description of what the user is explicitly looking for in candidate
   * thumbnails. Best-effort guidance only.
   */
  looking_for?: string;

  /**
   * Optional execution window in seconds on the original asset timeline. Omit
   * start_time to begin at the asset start and omit end_time to continue through the
   * asset end. The summary and tags are generated only from media within this
   * window.
   */
  scope?: JobsAPI.OutputSteeringScope;

  /**
   * Rubric criteria to emphasize in close calls. Best-effort guidance only.
   */
  scoring_priorities?: Array<'focus' | 'face_or_action' | 'composition' | 'contrast_color' | 'brand_fit'>;

  /**
   * Best-effort guidance for what kind of thumbnail candidate should score highest.
   */
  selection_strategy?:
    | 'face_or_action'
    | 'clean_composition'
    | 'high_contrast'
    | 'brand_safe'
    | 'campaign_thumbnail';
}

export interface FindBestThumbnailCreateParams {
  parameters: FindBestThumbnailsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace FindBestThumbnails {
  export {
    type FindBestThumbnailsJob as FindBestThumbnailsJob,
    type FindBestThumbnailsJobOutputs as FindBestThumbnailsJobOutputs,
    type FindBestThumbnailsJobParameters as FindBestThumbnailsJobParameters,
    type FindBestThumbnailsOutputSteering as FindBestThumbnailsOutputSteering,
    type FindBestThumbnailCreateParams as FindBestThumbnailCreateParams,
  };
}
