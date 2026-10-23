// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Generate coherent metadata, chapters, scenes, and key moments from shared asset evidence.
 */
export class AnalyzeStructure extends APIResource {
  /**
   * Creates a job that generates a coherent title, summary, tags, chapters, scenes,
   * and key moments from shared evidence for a Mux asset.
   *
   * @example
   * ```ts
   * const analyzeStructureJob =
   *   await client.robotsV0.jobs.analyzeStructure.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       language_code: 'en',
   *       output_language_code: 'en',
   *       output_steering: {
   *         scope: { start_time: 30, end_time: 300 },
   *         audience: 'Developers evaluating video APIs',
   *         brand_terms: ['Mux', 'Mux Data'],
   *         granularity: 'balanced',
   *       },
   *       update_asset_meta: true,
   *       update_asset_chapters: true,
   *     },
   *   });
   * ```
   */
  create(body: AnalyzeStructureCreateParams, options?: RequestOptions): APIPromise<AnalyzeStructureJob> {
    return (
      this._client.post('/robots/v0/jobs/analyze-structure', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AnalyzeStructureJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of an Analyze Structure job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const analyzeStructureJob =
   *   await client.robotsV0.jobs.analyzeStructure.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<AnalyzeStructureJob> {
    return (
      this._client.get(path`/robots/v0/jobs/analyze-structure/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AnalyzeStructureJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface AnalyzeStructureJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: AnalyzeStructureJobParameters;

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

  workflow: 'analyze-structure';

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
  outputs?: AnalyzeStructureJobOutputs;

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
export interface AnalyzeStructureJobOutputs {
  /**
   * Generated chapters in timeline order. Always present and empty below the chapter
   * threshold.
   */
  chapters: Array<AnalyzeStructureJobOutputs.Chapter>;

  /**
   * Generated key moments in timeline order. Always present and empty when no moment
   * qualifies.
   */
  key_moments: Array<AnalyzeStructureJobOutputs.KeyMoment>;

  /**
   * Generated scenes in timeline order. Always present and empty for audio-only
   * media.
   */
  scenes: Array<AnalyzeStructureJobOutputs.Scene>;

  /**
   * Generated summary of the analyzed media.
   */
  summary: string;

  /**
   * Generated tags. Always present and empty when no tag qualifies.
   */
  tags: Array<string>;

  /**
   * Generated title for the analyzed media.
   */
  title: string;

  /**
   * Best-effort outcomes for attempted asset updates. Omitted when no update was
   * attempted, including when only chapters were requested but none were generated.
   */
  asset_updates?: AnalyzeStructureJobOutputs.AssetUpdates;
}

export namespace AnalyzeStructureJobOutputs {
  export interface Chapter {
    /**
     * Chapter end time in seconds on the original asset timeline. Fractional seconds
     * are supported.
     */
    end_time: number;

    /**
     * Chapter start time in seconds on the original asset timeline. Fractional seconds
     * are supported.
     */
    start_time: number;

    /**
     * Concise chapter title.
     */
    title: string;
  }

  export interface KeyMoment {
    /**
     * Transcript cues overlapping this key moment. Empty when no usable transcript
     * evidence is available.
     */
    cues: Array<KeyMoment.Cue>;

    /**
     * Key moment end time in seconds on the original asset timeline. Fractional
     * seconds are supported.
     */
    end_time: number;

    /**
     * Overall evidence-grounded quality score from 0.0 to 1.0.
     */
    overall_score: number;

    /**
     * Key moment start time in seconds on the original asset timeline. Fractional
     * seconds are supported.
     */
    start_time: number;

    /**
     * Short title for the key moment.
     */
    title: string;

    /**
     * Summary of what is said during the moment.
     */
    audible_narrative?: string;

    /**
     * Evidence-grounded concepts from the audible content.
     */
    notable_audible_concepts?: Array<string>;

    /**
     * Scored concepts from the visual content.
     */
    notable_visual_concepts?: Array<KeyMoment.NotableVisualConcept>;

    /**
     * Best short verbatim quote from the moment when one is supported.
     */
    quotable_segment?: KeyMoment.QuotableSegment;

    /**
     * Summary of what visually happens during the moment.
     */
    visual_narrative?: string;
  }

  export namespace KeyMoment {
    export interface Cue {
      /**
       * Cue end time in seconds on the original asset timeline. Fractional seconds are
       * supported.
       */
      end_time: number;

      /**
       * Cue start time in seconds on the original asset timeline. Fractional seconds are
       * supported.
       */
      start_time: number;

      /**
       * Transcript text for this cue.
       */
      text: string;
    }

    export interface NotableVisualConcept {
      /**
       * Evidence-grounded visual concept containing 2-5 words.
       */
      concept: string;

      /**
       * Brief explanation of the relevance score.
       */
      rationale: string;

      /**
       * Relevance score from 0.0 to 1.0.
       */
      score: number;
    }

    /**
     * Best short verbatim quote from the moment when one is supported.
     */
    export interface QuotableSegment {
      /**
       * Verbatim transcript quote selected from the key moment.
       */
      text: string;

      /**
       * Quote start time in seconds on the original asset timeline. Fractional seconds
       * are supported.
       */
      time: number;
    }
  }

  export interface Scene {
    /**
     * Transcript cues overlapping this scene. Empty when no usable transcript evidence
     * is available.
     */
    cues: Array<Scene.Cue>;

    /**
     * Scene end time in seconds on the original asset timeline. Fractional seconds are
     * supported.
     */
    end_time: number;

    /**
     * Number of source shots or visual beats grouped into the scene.
     */
    shot_count: number;

    /**
     * Scene start time in seconds on the original asset timeline. Fractional seconds
     * are supported.
     */
    start_time: number;

    /**
     * Short human-readable title for the scene.
     */
    title: string;

    /**
     * Summary of what is said during the scene, when transcript evidence supports one.
     */
    audible_narrative?: string;

    /**
     * Combined audible and visual takeaway when both evidence types are meaningfully
     * present.
     */
    blended_narrative?: string;

    /**
     * Evidence-grounded concepts from the audible content.
     */
    notable_audible_concepts?: Array<string>;

    /**
     * Scored concepts from the visual content.
     */
    notable_visual_concepts?: Array<Scene.NotableVisualConcept>;

    /**
     * Optional ordered shot or beat breakdown within the scene.
     */
    shots?: Array<Scene.Shot>;

    /**
     * Summary of what visually happens during the scene.
     */
    visual_narrative?: string;
  }

  export namespace Scene {
    export interface Cue {
      /**
       * Cue end time in seconds on the original asset timeline. Fractional seconds are
       * supported.
       */
      end_time: number;

      /**
       * Cue start time in seconds on the original asset timeline. Fractional seconds are
       * supported.
       */
      start_time: number;

      /**
       * Transcript text for this cue.
       */
      text: string;
    }

    export interface NotableVisualConcept {
      /**
       * Evidence-grounded visual concept containing 2-5 words.
       */
      concept: string;

      /**
       * Brief explanation of the relevance score.
       */
      rationale: string;

      /**
       * Relevance score from 0.0 to 1.0.
       */
      score: number;
    }

    export interface Shot {
      /**
       * Shot or beat end time in seconds on the original asset timeline. Fractional
       * seconds are supported.
       */
      end_time: number;

      /**
       * Shot or beat start time in seconds on the original asset timeline. Fractional
       * seconds are supported.
       */
      start_time: number;

      /**
       * Short description of what happens during this shot or beat.
       */
      visual_description: string;
    }
  }

  /**
   * Best-effort outcomes for attempted asset updates. Omitted when no update was
   * attempted, including when only chapters were requested but none were generated.
   */
  export interface AssetUpdates {
    /**
     * Present when a chapters update was attempted. Omitted when no chapters were
     * generated; any existing chapters track is left unchanged. When status is
     * `failed` and replaced_track_ids is nonempty, deletion succeeded but replacement
     * creation failed, leaving the asset without a chapters track.
     */
    chapters?: AssetUpdates.Chapters;

    /**
     * Present when a title update was requested.
     */
    title?: AssetUpdates.Title;
  }

  export namespace AssetUpdates {
    /**
     * Present when a chapters update was attempted. Omitted when no chapters were
     * generated; any existing chapters track is left unchanged. When status is
     * `failed` and replaced_track_ids is nonempty, deletion succeeded but replacement
     * creation failed, leaving the asset without a chapters track.
     */
    export interface Chapters {
      /**
       * Outcome of the requested chapters track update.
       */
      status: 'created' | 'failed';

      /**
       * IDs of tracks deleted during replacement. Omitted when no deletions were
       * recorded; historical jobs may lack this information.
       */
      replaced_track_ids?: Array<string>;

      /**
       * ID of the newly created chapters track.
       */
      track_id?: string;
    }

    /**
     * Present when a title update was requested.
     */
    export interface Title {
      /**
       * Outcome of the requested asset title update.
       */
      status: 'updated' | 'failed';
    }
  }
}

export interface AnalyzeStructureJobParameters {
  /**
   * The Mux asset ID of the video to analyze.
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
   * BCP 47 language code for generated text. Auto-detected from available evidence
   * when omitted.
   */
  output_language_code?: string;

  /**
   * Curated controls that restrict Analyze Structure execution or guide its
   * generated metadata without exposing raw prompt editing. The scope start is
   * inclusive, the end is exclusive, and returned timestamps remain absolute.
   */
  output_steering?: AnalyzeStructureOutputSteering;

  /**
   * When true, replaces or creates the asset's chapters track after analysis.
   * Defaults to false. Best-effort: a chapters-write failure does not fail the
   * analysis. Check outputs.asset_updates.chapters for the outcome.
   */
  update_asset_chapters?: boolean;

  /**
   * When true, writes the generated title to asset.meta.title after analysis.
   * Defaults to false. Best-effort: a metadata-write failure does not fail the
   * analysis. Check outputs.asset_updates.title for the outcome.
   */
  update_asset_meta?: boolean;
}

/**
 * Curated controls that restrict Analyze Structure execution or guide its
 * generated metadata without exposing raw prompt editing. The scope start is
 * inclusive, the end is exclusive, and returned timestamps remain absolute.
 */
export interface AnalyzeStructureOutputSteering {
  /**
   * Intended audience used as best-effort guidance without changing the output
   * schema.
   */
  audience?: string;

  /**
   * Preferred brand or domain terms to use when supported by the source content.
   */
  brand_terms?: Array<string>;

  /**
   * Best-effort guidance that moves scene and chapter density together.
   */
  granularity?: 'coarse' | 'balanced' | 'fine';

  /**
   * Optional media execution window. Results remain timestamped against the original
   * media timeline.
   */
  scope?: JobsAPI.OutputSteeringScope;

  /**
   * Controlled vocabulary used as best-effort guidance for generated labels and
   * concepts.
   */
  topic_taxonomy?: JobsAPI.OutputSteeringTaxonomy;
}

export interface AnalyzeStructureCreateParams {
  parameters: AnalyzeStructureJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace AnalyzeStructure {
  export {
    type AnalyzeStructureJob as AnalyzeStructureJob,
    type AnalyzeStructureJobOutputs as AnalyzeStructureJobOutputs,
    type AnalyzeStructureJobParameters as AnalyzeStructureJobParameters,
    type AnalyzeStructureOutputSteering as AnalyzeStructureOutputSteering,
    type AnalyzeStructureCreateParams as AnalyzeStructureCreateParams,
  };
}
