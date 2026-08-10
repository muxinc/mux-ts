// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Identify key moments in a video.
 */
export class FindKeyMoments extends APIResource {
  /**
   * Creates a new job that uses AI to identify key moments in a Mux Video asset.
   * Optional output steering can restrict execution to a time scope in seconds and
   * guide selection strategy, title style, audience, topic taxonomy, and scoring
   * priorities without changing the response schema. Scoped results retain absolute
   * timestamps on the original asset timeline.
   *
   * @example
   * ```ts
   * const findKeyMomentsJob =
   *   await client.robots.jobs.findKeyMoments.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       max_moments: 10,
   *       target_duration_ms: { min: 15000, max: 45000 },
   *       output_steering: {
   *         scope: { start_time: 30, end_time: 180 },
   *         selection_strategy: 'educational_takeaways',
   *         title_style: 'punchy',
   *         audience: 'Developer advocates',
   *         rubric_priorities: [
   *           'clarity_in_isolation',
   *           'soundbite_quality',
   *         ],
   *       },
   *     },
   *   });
   * ```
   */
  create(body: FindKeyMomentCreateParams, options?: RequestOptions): APIPromise<FindKeyMomentsJob> {
    return (
      this._client.post('/robots/v0/jobs/find-key-moments', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindKeyMomentsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'find-key-moments' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const findKeyMomentsJob =
   *   await client.robots.jobs.findKeyMoments.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<FindKeyMomentsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/find-key-moments/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindKeyMomentsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface FindKeyMomentsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: FindKeyMomentsJobParameters;

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

  workflow: 'find-key-moments';

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
  outputs?: FindKeyMomentsJobOutputs;

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
export interface FindKeyMomentsJobOutputs {
  /**
   * Extracted key moments, ordered by their absolute position on the original asset
   * timeline.
   */
  moments: Array<FindKeyMomentsJobOutputs.Moment>;
}

export namespace FindKeyMomentsJobOutputs {
  export interface Moment {
    /**
     * One-sentence summary of what is being said during the moment.
     */
    audible_narrative: string;

    /**
     * Contiguous transcript segments that comprise this moment.
     */
    cues: Array<Moment.Cue>;

    /**
     * Moment end time in milliseconds.
     */
    end_ms: number;

    /**
     * Multi-word descriptive phrases (2-5 words each) capturing key audible concepts.
     */
    notable_audible_concepts: Array<string>;

    /**
     * Weighted quality score from 0.0 to 1.0 based on hook strength, clarity,
     * emotional intensity, novelty, and soundbite quality.
     */
    overall_score: number;

    /**
     * Moment start time in milliseconds.
     */
    start_ms: number;

    /**
     * Short catchy title for the moment (3-8 words).
     */
    title: string;

    /**
     * Scored visual concepts extracted from sampled frames. Present for video assets
     * only.
     */
    notable_visual_concepts?: Array<Moment.NotableVisualConcept>;

    /**
     * Best short, verbatim quote from within this moment. New jobs include this field;
     * older stored results may omit it.
     */
    quotable_segment?: Moment.QuotableSegment;

    /**
     * One-sentence summary of what is visually happening. Present for video assets
     * only.
     */
    visual_narrative?: string;
  }

  export namespace Moment {
    export interface Cue {
      /**
       * Cue end time in milliseconds.
       */
      end_ms: number;

      /**
       * Cue start time in milliseconds.
       */
      start_ms: number;

      /**
       * Transcript text for this cue.
       */
      text: string;
    }

    export interface NotableVisualConcept {
      /**
       * Multi-word visual concept (2-5 words).
       */
      concept: string;

      /**
       * Brief explanation of the relevance score.
       */
      rationale: string;

      /**
       * Relevance score from 0.0 to 1.0 measuring how closely the visual concept relates
       * to the audible narrative.
       */
      score: number;
    }

    /**
     * Best short, verbatim quote from within this moment. New jobs include this field;
     * older stored results may omit it.
     */
    export interface QuotableSegment {
      /**
       * Quote segment start time in milliseconds.
       */
      start_ms: number;

      /**
       * Verbatim transcript quote selected from within the key moment.
       */
      text: string;
    }
  }
}

export interface FindKeyMomentsJobParameters {
  /**
   * The Mux asset ID of the video to analyze.
   */
  asset_id: string;

  /**
   * Maximum number of key moments to extract. When omitted, defaults to 10 for
   * assets up to one hour and 25 for longer assets.
   */
  max_moments?: number;

  /**
   * Curated output_steering controls for execution scope, selection strategy, title
   * style, audience, taxonomy, and rubric tie-breakers. Scope is enforced; other
   * controls guide model behavior but do not guarantee exact output.
   */
  output_steering?: FindKeyMomentsOutputSteering;

  /**
   * Preferred highlight duration range in milliseconds. When provided, the model
   * will aim to select moments within this range.
   */
  target_duration_ms?: FindKeyMomentsJobParameters.TargetDurationMs;
}

export namespace FindKeyMomentsJobParameters {
  /**
   * Preferred highlight duration range in milliseconds. When provided, the model
   * will aim to select moments within this range.
   */
  export interface TargetDurationMs {
    /**
     * Preferred maximum highlight duration in milliseconds.
     */
    max: number;

    /**
     * Preferred minimum highlight duration in milliseconds.
     */
    min: number;
  }
}

/**
 * Curated output_steering controls for execution scope, selection strategy, title
 * style, audience, taxonomy, and rubric tie-breakers. Scope is enforced; other
 * controls guide model behavior but do not guarantee exact output.
 */
export interface FindKeyMomentsOutputSteering {
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
   * Rubric dimensions to use as tie-breakers after applying selection strategy.
   * Best-effort guidance only.
   */
  rubric_priorities?: Array<'clarity_in_isolation' | 'emotional_intensity' | 'novelty' | 'soundbite_quality'>;

  /**
   * Optional execution window in seconds on the original asset timeline. The range
   * must contain a video frame at the asset frame rate. Omit start_time to begin at
   * the asset start and omit end_time to continue through the asset end. Returned
   * scene timestamps remain absolute asset timestamps.
   */
  scope?: JobsAPI.OutputSteeringScope;

  /**
   * Best-effort guidance for what qualifies as a strong standalone key moment.
   */
  selection_strategy?:
    | 'standalone_hooks'
    | 'educational_takeaways'
    | 'story_beats'
    | 'product_moments'
    | 'speaker_highlights';

  /**
   * Best-effort title style guidance for generated moment titles.
   */
  title_style?: 'descriptive' | 'punchy' | 'educational' | 'social';

  /**
   * Controlled vocabulary used to steer scene concepts without changing the response
   * schema.
   */
  topic_taxonomy?: JobsAPI.OutputSteeringTaxonomy;
}

export interface FindKeyMomentCreateParams {
  parameters: FindKeyMomentsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace FindKeyMoments {
  export {
    type FindKeyMomentsJob as FindKeyMomentsJob,
    type FindKeyMomentsJobOutputs as FindKeyMomentsJobOutputs,
    type FindKeyMomentsJobParameters as FindKeyMomentsJobParameters,
    type FindKeyMomentsOutputSteering as FindKeyMomentsOutputSteering,
    type FindKeyMomentCreateParams as FindKeyMomentCreateParams,
  };
}
