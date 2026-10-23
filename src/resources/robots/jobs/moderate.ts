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
   * content. Optional output steering can restrict execution to a time scope in
   * seconds.
   *
   * @example
   * ```ts
   * const moderateJob =
   *   await client.robots.jobs.moderate.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       on_flagged: { action: 'delete_playback_ids' },
   *     },
   *   });
   * ```
   */
  create(body: ModerateCreateParams, options?: RequestOptions): APIPromise<ModerateJob> {
    return (
      this._client.post('/robots/v1/jobs/moderate', {
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
   *   await client.robots.jobs.moderate.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<ModerateJob> {
    return (
      this._client.get(path`/robots/v1/jobs/moderate/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: ModerateJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

/**
 * Optional action taken automatically when exceeds_threshold is true. When
 * omitted, the job only reports scores and takes no action. Note: in a directive
 * run that targets the same asset with other workflows, deleting playback IDs can
 * break sibling workflows that need a playback ID.
 */
export interface ActionOnFlagged {
  /**
   * Action to take when exceeds_threshold is true. "delete_playback_ids" deletes
   * every playback ID on the asset, making it unplayable while preserving the
   * underlying asset so it can be re-published or reviewed.
   */
  action: 'delete_playback_ids';
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
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'moderate';

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
   * Workflow results. Present when status is completed.
   */
  outputs?: ModerateJobOutputs;

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
 * Workflow results. Present when status is completed.
 */
export interface ModerateJobOutputs {
  /**
   * True if any category's max score exceeds its configured threshold.
   */
  exceeds_threshold: boolean;

  /**
   * Highest scores across all thumbnails and transcript windows for each category.
   */
  max_scores: ModerateJobOutputs.MaxScores;

  /**
   * Audit status for thumbnail moderation on this asset: whether it completed, was
   * skipped (and why), or failed because every thumbnail errored.
   */
  thumbnail_moderation: ModerateJobOutputs.ThumbnailModeration;

  /**
   * Per-thumbnail moderation scores. Empty when thumbnail_moderation.status is
   * "skipped".
   */
  thumbnail_scores: Array<ModerateJobOutputs.ThumbnailScore>;

  /**
   * Audit status for transcript moderation on this asset: whether it completed, was
   * skipped (and why), or failed because every transcript window errored.
   */
  transcript_moderation: ModerateJobOutputs.TranscriptModeration;

  /**
   * Per-time-window transcript moderation scores. Empty when
   * transcript_moderation.status is "skipped".
   */
  transcript_scores: Array<ModerateJobOutputs.TranscriptScore>;

  /**
   * Present only when on_flagged was set and exceeds_threshold was true. Records the
   * action taken and which playback IDs were deleted.
   */
  flagged_action?: ModerateJobOutputs.FlaggedAction;
}

export namespace ModerateJobOutputs {
  /**
   * Highest scores across all thumbnails and transcript windows for each category.
   */
  export interface MaxScores {
    sexual: number;

    violence: number;
  }

  /**
   * Audit status for thumbnail moderation on this asset: whether it completed, was
   * skipped (and why), or failed because every thumbnail errored.
   */
  export interface ThumbnailModeration {
    /**
     * "completed" if at least one thumbnail was moderated, "skipped" if nothing could
     * be moderated on this surface (see skip_reason), "failed" if every thumbnail
     * errored so this surface contributed no scores.
     */
    status: 'completed' | 'skipped' | 'failed';

    /**
     * Present only when status is "skipped". Human-readable explanation of
     * skip_reason.
     */
    skip_message?: string;

    /**
     * Present only when status is "skipped". Machine-readable reason nothing was
     * moderated.
     */
    skip_reason?: 'no_video_track' | 'no_video_in_scope';
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
     * Time in seconds of the thumbnail within the video.
     */
    time?: number;
  }

  /**
   * Audit status for transcript moderation on this asset: whether it completed, was
   * skipped (and why), or failed because every transcript window errored.
   */
  export interface TranscriptModeration {
    /**
     * "completed" if at least one transcript window was moderated, "skipped" if
     * nothing could be moderated on this surface (see skip_reason), "failed" if every
     * transcript window errored so this surface contributed no scores.
     */
    status: 'completed' | 'skipped' | 'failed';

    /**
     * Present only when status is "skipped". Human-readable explanation of
     * skip_reason.
     */
    skip_message?: string;

    /**
     * Present only when status is "skipped". Machine-readable reason nothing was
     * moderated.
     */
    skip_reason?: 'no_ready_text_track' | 'no_cues';
  }

  export interface TranscriptScore {
    /**
     * Time in seconds where the moderated transcript window ends.
     */
    end_time: number;

    /**
     * Sexual content score from 0.0 to 1.0.
     */
    sexual: number;

    /**
     * Time in seconds where the moderated transcript window starts.
     */
    start_time: number;

    /**
     * Violence content score from 0.0 to 1.0.
     */
    violence: number;
  }

  /**
   * Present only when on_flagged was set and exceeds_threshold was true. Records the
   * action taken and which playback IDs were deleted.
   */
  export interface FlaggedAction {
    action: 'delete_playback_ids';

    /**
     * Playback IDs that were deleted from the asset because it exceeded the threshold.
     */
    deleted_playback_ids: Array<string>;
  }
}

export interface ModerateJobParameters {
  /**
   * The Mux asset ID of the video to moderate.
   */
  asset_id: string;

  /**
   * Used only for audio-only transcript analysis; ignored for video assets. BCP 47
   * language code of the caption source. An explicit language must match a ready
   * source exactly, including case; for example, en does not match en-US.
   * Translation target exclusion and track replacement instead compare base
   * languages case-insensitively. When omitted, automatic selection applies. Uses
   * the first ready subtitle in asset track order without English preference.
   * Audio-only assets with one ready text track lacking subtitle metadata can use
   * that legacy transcript.
   */
  language_code?: string;

  /**
   * Maximum number of thumbnails to sample. Acts as a cap — if sampling_interval
   * produces fewer samples than this limit, the interval is respected; otherwise
   * samples are evenly distributed with first and last frames pinned.
   */
  max_samples?: number;

  /**
   * Optional action taken automatically when exceeds_threshold is true. When
   * omitted, the job only reports scores and takes no action. Note: in a directive
   * run that targets the same asset with other workflows, deleting playback IDs can
   * break sibling workflows that need a playback ID.
   */
  on_flagged?: ActionOnFlagged;

  /**
   * Curated controls that optionally restrict moderation to an asset time range.
   */
  output_steering?: ModerateOutputSteering;

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

/**
 * Curated controls that optionally restrict moderation to an asset time range.
 */
export interface ModerateOutputSteering {
  /**
   * Optional media execution window. Results remain timestamped against the original
   * media timeline.
   */
  scope?: JobsAPI.OutputSteeringScope;
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
    type ActionOnFlagged as ActionOnFlagged,
    type ModerateJob as ModerateJob,
    type ModerateJobOutputs as ModerateJobOutputs,
    type ModerateJobParameters as ModerateJobParameters,
    type ModerateOutputSteering as ModerateOutputSteering,
    type ModerateCreateParams as ModerateCreateParams,
  };
}
