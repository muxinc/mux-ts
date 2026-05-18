// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Generate a title, description, and tags for a video.
 */
export class Summarize extends APIResource {
  /**
   * Creates a new job that uses AI to generate a title, description, and tags for a
   * Mux Video asset.
   *
   * @example
   * ```ts
   * const summarizeJob =
   *   await client.robotsPreview.jobs.summarize.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       tone: 'neutral',
   *       tag_count: 10,
   *     },
   *   });
   * ```
   */
  create(body: SummarizeCreateParams, options?: RequestOptions): APIPromise<SummarizeJob> {
    return (
      this._client.post('/robots/v0/jobs/summarize', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: SummarizeJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'summarize' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const summarizeJob =
   *   await client.robotsPreview.jobs.summarize.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<SummarizeJob> {
    return (
      this._client.get(path`/robots/v0/jobs/summarize/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: SummarizeJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface SummarizeJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: SummarizeJobParameters;

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

  workflow: 'summarize';

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<JobsAPI.JobError>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: SummarizeJobOutputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: SummarizeJob.Resources;
}

export namespace SummarizeJob {
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
export interface SummarizeJobOutputs {
  /**
   * Generated description of the video content (typically 2-4 sentences).
   */
  description: string;

  /**
   * Generated keyword tags for the video.
   */
  tags: Array<string>;

  /**
   * Generated title capturing the essence of the video.
   */
  title: string;
}

export interface SummarizeJobParameters {
  /**
   * The Mux asset ID of the video to summarize.
   */
  asset_id: string;

  /**
   * Maximum description length in words.
   */
  description_length?: number;

  /**
   * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
   * omitted, the SDK uses the default track.
   */
  language_code?: string;

  /**
   * BCP 47 language code for the generated summary output (e.g. "en", "fr", "ja").
   * Auto-detected from the transcript if omitted.
   */
  output_language_code?: string;

  /**
   * Override specific sections of the summarization prompt.
   */
  prompt_overrides?: SummarizeJobParameters.PromptOverrides;

  /**
   * Maximum number of tags to include in the generated output. Defaults to 10.
   */
  tag_count?: number;

  /**
   * Maximum title length in words.
   */
  title_length?: number;

  /**
   * Tone for the generated summary. "neutral" for straightforward analysis,
   * "playful" for witty and conversational, "professional" for executive-level
   * reporting.
   */
  tone?: 'neutral' | 'playful' | 'professional';
}

export namespace SummarizeJobParameters {
  /**
   * Override specific sections of the summarization prompt.
   */
  export interface PromptOverrides {
    /**
     * Override the description generation requirements.
     */
    description?: string;

    /**
     * Override the keyword/tag extraction requirements.
     */
    keywords?: string;

    /**
     * Override the quality standards for analysis.
     */
    quality_guidelines?: string;

    /**
     * Override the core task instruction for summarization.
     */
    task?: string;

    /**
     * Override the title generation requirements.
     */
    title?: string;
  }
}

export interface SummarizeCreateParams {
  parameters: SummarizeJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace Summarize {
  export {
    type SummarizeJob as SummarizeJob,
    type SummarizeJobOutputs as SummarizeJobOutputs,
    type SummarizeJobParameters as SummarizeJobParameters,
    type SummarizeCreateParams as SummarizeCreateParams,
  };
}
