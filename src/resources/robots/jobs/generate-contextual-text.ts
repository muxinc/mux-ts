// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Generate text, such as social posts and blog posts, grounded in a video or audio asset.
 */
export class GenerateContextualText extends APIResource {
  /**
   * Generates customizable text, such as social posts, blog posts, and newsletter
   * entries, from a Mux video or audio asset. Describe each piece of text you want
   * as an artifact, and request named variants to get several versions of the whole
   * set. Optional output steering limits the time range used and guides audience,
   * voice, call to action, and brand terminology.
   *
   * @example
   * ```ts
   * const generateContextualTextJob = await client.robots.jobs.generateContextualText.create({
   *   parameters: {
   *     asset_id: 'mux_asset_123abc',
   *     output_steering: { ... },
   *     variants: [
   *       { ... },
   *       { ... },
   *     ],
   *     artifacts: [
   *       { ... },
   *       { ... },
   *     ],
   *   },
   * });
   * ```
   */
  create(
    body: GenerateContextualTextCreateParams,
    options?: RequestOptions,
  ): APIPromise<GenerateContextualTextJob> {
    return (
      this._client.post('/robots/v1/jobs/generate-contextual-text', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateContextualTextJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and generated text artifacts. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const generateContextualTextJob =
   *   await client.robots.jobs.generateContextualText.retrieve(
   *     'x',
   *   );
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<GenerateContextualTextJob> {
    return (
      this._client.get(path`/robots/v1/jobs/generate-contextual-text/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateContextualTextJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface GenerateContextualTextJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: GenerateContextualTextJobParameters;

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

  workflow: 'generate-contextual-text';

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
  outputs?: GenerateContextualTextJobOutputs;

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
export interface GenerateContextualTextJobOutputs {
  variants: Array<GenerateContextualTextJobOutputs.Variant>;
}

export namespace GenerateContextualTextJobOutputs {
  export interface Variant {
    artifacts: Array<Variant.Artifact>;

    /**
     * Customer-chosen lowercase snake_case identifier used to correlate requested and
     * returned content.
     */
    key: string;
  }

  export namespace Variant {
    export interface Artifact {
      content: string;

      /**
       * Customer-chosen lowercase snake_case identifier used to correlate requested and
       * returned content.
       */
      key: string;
    }
  }
}

export interface GenerateContextualTextJobParameters {
  /**
   * The deliverables to create for every variant. Supports 1-5 artifacts with unique
   * keys.
   */
  artifacts: Array<GenerateContextualTextJobParameters.Artifact>;

  /**
   * The Mux asset ID whose transcript grounds the generated text.
   */
  asset_id: string;

  /**
   * Named versions of the complete artifact set. Supports 1-5 variants with unique
   * keys.
   */
  variants: Array<GenerateContextualTextJobParameters.Variant>;

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
   * BCP 47 language code for generated text. Defaults to the selected transcript
   * track's language when available.
   */
  output_language_code?: string;

  /**
   * Curated controls that apply to every generated artifact. Scope bounds execution;
   * the other fields are best-effort writing guidance.
   */
  output_steering?: GenerateContextualTextOutputSteering;

  /**
   * When true for a video asset, generate or reuse Mux shots and attach a bounded
   * sample of shot frames as additional visual evidence. Video assets always include
   * a storyboard; the transcript remains authoritative. Not supported for audio-only
   * assets.
   */
  use_shots?: boolean;
}

export namespace GenerateContextualTextJobParameters {
  /**
   * One deliverable, such as a social post, blog post, or newsletter entry. The
   * channel sets conventions and a default cap, max_length sets the hard cap, and
   * format controls Markdown.
   */
  export interface Artifact {
    /**
     * Customer-chosen lowercase snake_case identifier used to correlate requested and
     * returned content.
     */
    key: string;

    /**
     * Publishing channel whose conventions guide the result and set its default
     * length. generic is capped at 300 words.
     */
    channel?: 'generic' | 'x' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

    /**
     * Whether the text may use Markdown syntax. plain contains no Markdown.
     */
    format?: 'plain' | 'markdown';

    /**
     * Optional guidance specific to this artifact.
     */
    instructions?: string;

    /**
     * Hard output cap in characters or words. Defaults to the channel's cap.
     */
    max_length?:
      | Artifact.GenerateContextualTextCharacterMaxLength
      | Artifact.GenerateContextualTextWordMaxLength;
  }

  export namespace Artifact {
    export interface GenerateContextualTextCharacterMaxLength {
      unit: 'characters';

      value: number;
    }

    export interface GenerateContextualTextWordMaxLength {
      unit: 'words';

      value: number;
    }
  }

  /**
   * A named version of the complete artifact set. The key is an identifier only and
   * does not steer generation.
   */
  export interface Variant {
    /**
     * Customer-chosen lowercase snake_case identifier used to correlate requested and
     * returned content.
     */
    key: string;

    /**
     * Optional bounded guidance that gives this variant a deliberate angle. Omit it to
     * request another independent take on the same brief.
     */
    instructions?: string;
  }
}

/**
 * Curated controls that apply to every generated artifact. Scope bounds execution;
 * the other fields are best-effort writing guidance.
 */
export interface GenerateContextualTextOutputSteering {
  /**
   * The intended reader, used as best-effort guidance for framing, vocabulary, and
   * assumed context.
   */
  audience?: string;

  /**
   * Preferred brand or domain terms to use when supported by the source content.
   */
  brand_terms?: Array<string>;

  /**
   * Best-effort guidance for whether and how the text should invite the reader to
   * engage further.
   */
  call_to_action?: 'none' | 'soft' | 'direct';

  /**
   * Optional media execution window. Results remain timestamped against the original
   * media timeline.
   */
  scope?: JobsAPI.OutputSteeringScope;

  /**
   * Best-effort writing voice for every generated artifact.
   */
  voice?: 'conversational' | 'editorial' | 'playful' | 'professional';
}

export interface GenerateContextualTextCreateParams {
  parameters: GenerateContextualTextJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace GenerateContextualText {
  export {
    type GenerateContextualTextJob as GenerateContextualTextJob,
    type GenerateContextualTextJobOutputs as GenerateContextualTextJobOutputs,
    type GenerateContextualTextJobParameters as GenerateContextualTextJobParameters,
    type GenerateContextualTextOutputSteering as GenerateContextualTextOutputSteering,
    type GenerateContextualTextCreateParams as GenerateContextualTextCreateParams,
  };
}
