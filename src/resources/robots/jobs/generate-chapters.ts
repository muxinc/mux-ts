// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Generate chapters for a video.
 */
export class GenerateChapters extends APIResource {
  /**
   * Creates a new job that uses AI to generate chapters for a Mux Video asset.
   * Optional output steering can guide chapter style, granularity, audience, and
   * brand terms without changing the response schema.
   *
   * @example
   * ```ts
   * const generateChaptersJob =
   *   await client.robots.jobs.generateChapters.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       update_asset_chapters: true,
   *       output_steering: {
   *         chapter_style: 'descriptive',
   *         chapter_granularity: 'balanced',
   *         audience: 'Developers',
   *       },
   *     },
   *   });
   * ```
   */
  create(body: GenerateChapterCreateParams, options?: RequestOptions): APIPromise<GenerateChaptersJob> {
    return (
      this._client.post('/robots/v1/jobs/generate-chapters', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateChaptersJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'generate-chapters' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const generateChaptersJob =
   *   await client.robots.jobs.generateChapters.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<GenerateChaptersJob> {
    return (
      this._client.get(path`/robots/v1/jobs/generate-chapters/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateChaptersJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface GenerateChaptersJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: GenerateChaptersJobParameters;

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

  workflow: 'generate-chapters';

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
  outputs?: GenerateChaptersJobOutputs;

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
export interface GenerateChaptersJobOutputs {
  /**
   * Generated chapters, ordered by start time.
   */
  chapters: Array<GenerateChaptersJobOutputs.Chapter>;

  /**
   * Recorded best-effort chapters track update outcome. A failed update does not
   * fail the analysis job. Omitted when no outcome was recorded.
   */
  asset_updates?: GenerateChaptersJobOutputs.AssetUpdates;
}

export namespace GenerateChaptersJobOutputs {
  export interface Chapter {
    /**
     * Chapter start time in seconds. The first chapter always starts at 0.
     */
    start_time: number;

    /**
     * Concise chapter title.
     */
    title: string;
  }

  /**
   * Recorded best-effort chapters track update outcome. A failed update does not
   * fail the analysis job. Omitted when no outcome was recorded.
   */
  export interface AssetUpdates {
    /**
     * What happened when the generated chapters were written back to the Mux asset.
     * Present only when update_asset_chapters was true. When status is `failed` and
     * replaced_track_ids is nonempty, deletion succeeded but replacement creation
     * failed, leaving the asset without a chapters track.
     */
    chapters?: AssetUpdates.Chapters;
  }

  export namespace AssetUpdates {
    /**
     * What happened when the generated chapters were written back to the Mux asset.
     * Present only when update_asset_chapters was true. When status is `failed` and
     * replaced_track_ids is nonempty, deletion succeeded but replacement creation
     * failed, leaving the asset without a chapters track.
     */
    export interface Chapters {
      /**
       * Outcome of the chapters track write. `created` means the asset now carries these
       * chapters. `failed` means the write was attempted and errored; the chapters in
       * this response are still valid and can be applied manually.
       */
      status: 'created' | 'failed';

      /**
       * IDs of tracks deleted during replacement. Omitted when no deletions were
       * recorded; historical jobs may lack this information.
       */
      replaced_track_ids?: JobsAPI.ReplacedTrackIDs;

      /**
       * Mux text track ID of the chapters track created on the asset. Present when
       * status is `created`.
       */
      track_id?: string;
    }
  }
}

export interface GenerateChaptersJobParameters {
  /**
   * The Mux asset ID of the video to generate chapters for.
   */
  asset_id: string;

  /**
   * BCP 47 language code of the caption source. An explicit language must match a
   * ready source exactly, including case; for example, en does not match en-US.
   * Translation target exclusion and track replacement instead compare base
   * languages case-insensitively. When omitted, automatic selection applies. Uses
   * the first ready subtitle in asset track order without English preference.
   * Audio-only assets with one ready text track lacking subtitle metadata can use
   * that legacy transcript.
   */
  language_code?: string;

  /**
   * BCP 47 language code for the output chapter titles. Auto-detected from the
   * transcript if omitted.
   */
  output_language_code?: string;

  /**
   * Curated output_steering controls for chapter style, granularity, audience, and
   * brand terminology. These controls guide model behavior but do not guarantee
   * exact output.
   */
  output_steering?: GenerateChaptersOutputSteering;

  /**
   * When true, the generated chapters are written back to the Mux asset as a
   * chapters text track once the job completes, making them deliverable with the
   * asset. Overwrites existing chapters: an asset holds a single chapters track, so
   * any chapters track already on the asset is deleted and replaced — including one
   * in a different language, and one you created yourself. Best-effort — a failed
   * write does not fail the job — so check `asset_updates.chapters` in the job
   * outputs for the outcome.
   */
  update_asset_chapters?: boolean;
}

/**
 * Curated output_steering controls for chapter style, granularity, audience, and
 * brand terminology. These controls guide model behavior but do not guarantee
 * exact output.
 */
export interface GenerateChaptersOutputSteering {
  /**
   * Intended audience used as best-effort model guidance. Does not change the output
   * schema.
   */
  audience?: string;

  /**
   * Preferred brand or domain terms to use when supported by the source content.
   */
  brand_terms?: Array<string>;

  /**
   * Best-effort guidance for how coarse or fine chapter boundaries should be.
   */
  chapter_granularity?: 'coarse' | 'balanced' | 'fine';

  /**
   * Best-effort style guidance for generated chapter titles.
   */
  chapter_style?: 'descriptive' | 'punchy' | 'educational' | 'seo' | 'platform_neutral';
}

export interface GenerateChapterCreateParams {
  parameters: GenerateChaptersJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace GenerateChapters {
  export {
    type GenerateChaptersJob as GenerateChaptersJob,
    type GenerateChaptersJobOutputs as GenerateChaptersJobOutputs,
    type GenerateChaptersJobParameters as GenerateChaptersJobParameters,
    type GenerateChaptersOutputSteering as GenerateChaptersOutputSteering,
    type GenerateChapterCreateParams as GenerateChapterCreateParams,
  };
}
