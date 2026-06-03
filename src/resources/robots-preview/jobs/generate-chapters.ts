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
   *   await client.robotsPreview.jobs.generateChapters.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
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
      this._client.post('/robots/v0/jobs/generate-chapters', {
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
   *   await client.robotsPreview.jobs.generateChapters.retrieve(
   *     'x',
   *   );
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<GenerateChaptersJob> {
    return (
      this._client.get(path`/robots/v0/jobs/generate-chapters/${jobID}`, {
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
   * Unix timestamp (seconds) when the job was last updated.
   */
  updated_at: number;

  workflow: 'generate-chapters';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: GenerateChaptersJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<JobsAPI.JobError>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: GenerateChaptersJobOutputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: GenerateChaptersJob.Resources;
}

export namespace GenerateChaptersJob {
  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  export interface Directive {
    /**
     * ID of the directive that dispatched this job.
     */
    id: string;

    /**
     * ID of the specific directive run that dispatched this job.
     */
    run_id: string;
  }

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
export interface GenerateChaptersJobOutputs {
  /**
   * Generated chapters, ordered by start time.
   */
  chapters: Array<GenerateChaptersJobOutputs.Chapter>;
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
}

export interface GenerateChaptersJobParameters {
  /**
   * The Mux asset ID of the video to generate chapters for.
   */
  asset_id: string;

  /**
   * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
   * omitted, the SDK prefers English if available.
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
  output_steering?: GenerateChaptersJobParameters.OutputSteering;

  /**
   * Legacy/internal prompt-section overrides. Prefer output_steering for new
   * integrations.
   */
  prompt_overrides?: GenerateChaptersJobParameters.PromptOverrides;
}

export namespace GenerateChaptersJobParameters {
  /**
   * Curated output_steering controls for chapter style, granularity, audience, and
   * brand terminology. These controls guide model behavior but do not guarantee
   * exact output.
   */
  export interface OutputSteering {
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

  /**
   * Legacy/internal prompt-section overrides. Prefer output_steering for new
   * integrations.
   */
  export interface PromptOverrides {
    /**
     * Override the chapter density and timing constraints.
     */
    chapter_guidelines?: string;

    /**
     * Override the JSON output format instructions.
     */
    output_format?: string;

    /**
     * Override the core task instruction for chapter generation.
     */
    task?: string;

    /**
     * Override the chapter title style requirements.
     */
    title_guidelines?: string;
  }
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
    type GenerateChapterCreateParams as GenerateChapterCreateParams,
  };
}
