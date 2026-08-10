// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Segment a Mux video asset into ordered scenes using shot boundaries and transcript cues. This workflow is experimental and subject to change.
 */
export class FindScenes extends APIResource {
  /**
   * Creates a new job that segments a Mux video asset into ordered scenes using
   * storyboard-backed generated shots for shot-level visual evidence, combined with
   * transcript cues when available. If the asset has no generated shots, the job
   * generates them on demand and waits for completion — they do not need to exist
   * beforehand. Optional output steering can restrict execution to a time scope in
   * seconds and guide segmentation strategy, title style, narration detail,
   * audience, brand terms, and topic taxonomy without changing the response schema.
   * Scoped results retain absolute timestamps on the original asset timeline.
   *
   * @example
   * ```ts
   * const findScenesJob =
   *   await client.robots.jobs.findScenes.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       language_code: 'en',
   *       min_scenes: 4,
   *       min_scene_duration_ms: 15000,
   *       output_steering: {
   *         scope: { start_time: 30, end_time: 180 },
   *         segmentation_strategy: 'editorial_beats',
   *         title_style: 'descriptive',
   *         narration_detail: 'balanced',
   *       },
   *     },
   *   });
   * ```
   */
  create(body: FindSceneCreateParams, options?: RequestOptions): APIPromise<FindScenesJob> {
    return (
      this._client.post('/robots/v0/jobs/find-scenes', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindScenesJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'find-scenes' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const findScenesJob =
   *   await client.robots.jobs.findScenes.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<FindScenesJob> {
    return (
      this._client.get(path`/robots/v0/jobs/find-scenes/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: FindScenesJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface FindScenesJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: FindScenesJobParameters;

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

  workflow: 'find-scenes';

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
  outputs?: FindScenesJobOutputs;

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
export interface FindScenesJobOutputs {
  /**
   * Ordered scene segments extracted from the original asset timeline using shot
   * boundaries plus any available transcript context.
   */
  scenes: Array<FindScenesJobOutputs.Scene>;
}

export namespace FindScenesJobOutputs {
  export interface Scene {
    /**
     * Transcript cues that overlap the scene. Can be empty when no usable transcript
     * is available.
     */
    cues: Array<Scene.Cue>;

    /**
     * Scene end time in milliseconds.
     */
    end_ms: number;

    /**
     * How many timed shot or beat entries make up the scene. When shots is present,
     * this equals shots.length.
     */
    shot_count: number;

    /**
     * Scene start time in milliseconds.
     */
    start_ms: number;

    /**
     * Short human-readable title for the scene.
     */
    title: string;

    /**
     * One-sentence summary of what is being said during the scene. Present only when
     * transcript cues are available.
     */
    audible_narrative?: string;

    /**
     * Combined audible and visual narrative for the scene when both signals are
     * meaningfully available. Omit when no transcript-backed audible signal exists.
     */
    blended_narrative?: string;

    /**
     * Multi-word descriptive phrases capturing key audible concepts in the scene.
     * Present only when transcript cues are available.
     */
    notable_audible_concepts?: Array<string>;

    /**
     * Scored visual concepts extracted from sampled scene frames. Present for video
     * assets when visual enrichment succeeds.
     */
    notable_visual_concepts?: Array<Scene.NotableVisualConcept>;

    /**
     * Optional ordered shot or beat breakdown within the scene, including timings and
     * short visual descriptions.
     */
    shots?: Array<Scene.Shot>;

    /**
     * One-sentence summary of what is visually happening during the scene. Present for
     * video assets when visual enrichment succeeds.
     */
    visual_narrative?: string;
  }

  export namespace Scene {
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
       * Brief explanation of why the concept is visually important for the scene.
       */
      rationale: string;

      /**
       * Salience score from 0.0 to 1.0 measuring how visually important the concept is
       * within the scene.
       */
      score: number;
    }

    export interface Shot {
      /**
       * Shot or beat end time in milliseconds within the scene.
       */
      end_ms: number;

      /**
       * Shot or beat start time in milliseconds within the scene.
       */
      start_ms: number;

      /**
       * Short visual description of what happens during this shot or beat.
       */
      visual_description: string;
    }
  }
}

export interface FindScenesJobParameters {
  /**
   * The Mux asset ID of the video asset to segment into scenes. Audio-only assets
   * are not supported.
   */
  asset_id: string;

  /**
   * Preferred transcript language code to analyze when a matching transcript track
   * is available. Defaults to the first ready transcript track on the asset.
   */
  language_code?: string;

  /**
   * Preferred minimum scene duration in milliseconds for scaffolded transcript
   * chunking. Defaults to 15000.
   */
  min_scene_duration_ms?: number;

  /**
   * Optional lower-bound hint for scene segmentation. When provided, the model
   * should avoid collapsing clearly distinct beats below this count when the content
   * supports more granular scene boundaries.
   */
  min_scenes?: number;

  /**
   * Curated output_steering controls for execution scope, segmentation strategy,
   * title style, narration detail, audience, brand terms, and topic taxonomy. Scope
   * is enforced; other controls guide model behavior but do not guarantee exact
   * output.
   */
  output_steering?: FindScenesOutputSteering;
}

/**
 * Curated output_steering controls for execution scope, segmentation strategy,
 * title style, narration detail, audience, brand terms, and topic taxonomy. Scope
 * is enforced; other controls guide model behavior but do not guarantee exact
 * output.
 */
export interface FindScenesOutputSteering {
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
   * Best-effort guidance for how much detail scene narratives should include.
   */
  narration_detail?: 'concise' | 'balanced' | 'detailed';

  /**
   * Optional execution window in seconds on the original asset timeline. The range
   * must contain a video frame at the asset frame rate. Omit start_time to begin at
   * the asset start and omit end_time to continue through the asset end. Returned
   * scene timestamps remain absolute asset timestamps.
   */
  scope?: JobsAPI.OutputSteeringScope;

  /**
   * Best-effort guidance for the kinds of boundaries the scene finder should prefer.
   */
  segmentation_strategy?:
    | 'editorial_beats'
    | 'topic_changes'
    | 'visual_transitions'
    | 'action_progression'
    | 'instructional_steps';

  /**
   * Best-effort title style guidance for generated scene titles.
   */
  title_style?: 'descriptive' | 'editorial' | 'search_optimized' | 'accessibility';

  /**
   * Controlled vocabulary used to steer scene concepts without changing the response
   * schema.
   */
  topic_taxonomy?: JobsAPI.OutputSteeringTaxonomy;
}

export interface FindSceneCreateParams {
  parameters: FindScenesJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace FindScenes {
  export {
    type FindScenesJob as FindScenesJob,
    type FindScenesJobOutputs as FindScenesJobOutputs,
    type FindScenesJobParameters as FindScenesJobParameters,
    type FindScenesOutputSteering as FindScenesOutputSteering,
    type FindSceneCreateParams as FindSceneCreateParams,
  };
}
