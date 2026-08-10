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
   * Mux Video asset. Optional output steering can guide summary style, audience,
   * brand terms, and tag taxonomy without changing the response schema.
   *
   * @example
   * ```ts
   * const summarizeJob =
   *   await client.robots.jobs.summarize.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       tone: 'neutral',
   *       tag_count: 10,
   *       output_steering: {
   *         summary_style: 'concise',
   *         audience: 'Product marketers',
   *         brand_terms: ['Mux', 'Robots'],
   *       },
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
   *   await client.robots.jobs.summarize.retrieve('x');
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
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'summarize';

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
  outputs?: SummarizeJobOutputs;

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
   * Curated output_steering controls for summary style, audience, brand terminology,
   * and tag taxonomy. These controls guide model behavior but do not guarantee exact
   * output.
   */
  output_steering?: SummarizeOutputSteering;

  /**
   * Legacy/internal prompt-section overrides. Prefer output_steering for new
   * integrations.
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

  /**
   * When true, the generated title is written to the Mux asset's metadata
   * (asset.meta.title) once the summary completes. Best-effort: a metadata-write
   * failure does not fail the summary.
   */
  update_asset_meta?: boolean;
}

export namespace SummarizeJobParameters {
  /**
   * Legacy/internal prompt-section overrides. Prefer output_steering for new
   * integrations.
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

/**
 * Curated output_steering controls for summary style, audience, brand terminology,
 * and tag taxonomy. These controls guide model behavior but do not guarantee exact
 * output.
 */
export interface SummarizeOutputSteering {
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
   * Best-effort style guidance for the generated title and description.
   */
  summary_style?: 'concise' | 'detailed' | 'editorial';

  /**
   * Controlled vocabulary for tag generation. This steers tags and may be
   * deterministically filtered after generation. Supports up to 50 values and 2000
   * serialized characters.
   */
  tag_taxonomy?: SummaryTagTaxonomy;
}

/**
 * Controlled vocabulary for tag generation. This steers tags and may be
 * deterministically filtered after generation. Supports up to 50 values and 2000
 * serialized characters.
 */
export interface SummaryTagTaxonomy {
  /**
   * When false, generated tags are filtered to taxonomy labels and aliases. When
   * true, unmatched tags may remain.
   */
  allow_other: boolean;

  /**
   * Controlled vocabulary values for generated tags. Supports 1-50 values.
   */
  values: Array<SummaryTagTaxonomy.Value>;

  /**
   * Optional customer-facing name for the taxonomy, up to 100 characters.
   */
  name?: string;
}

export namespace SummaryTagTaxonomy {
  export interface Value {
    /**
     * Canonical tag value to prefer in generated tags, up to 100 characters.
     */
    label: string;

    /**
     * Accepted alternate names that should normalize to the canonical label. Up to 10
     * aliases, each up to 100 characters.
     */
    aliases?: Array<string>;

    /**
     * Short explanation of when this tag applies, up to 300 characters.
     */
    description?: string;
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
    type SummarizeOutputSteering as SummarizeOutputSteering,
    type SummaryTagTaxonomy as SummaryTagTaxonomy,
    type SummarizeCreateParams as SummarizeCreateParams,
  };
}
