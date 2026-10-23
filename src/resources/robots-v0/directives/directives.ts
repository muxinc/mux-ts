// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as RunsAPI from './runs';
import {
  DirectiveRun,
  DirectiveRunDetail,
  DirectiveRunDetailsBasePage,
  NodeState,
  RunCreateParams,
  RunListParams,
  Runs,
} from './runs';
import * as AnalyzeStructureAPI from '../jobs/analyze-structure';
import * as AskQuestionsAPI from '../jobs/ask-questions';
import * as EditCaptionsAPI from '../jobs/edit-captions';
import * as FindBestThumbnailsAPI from '../jobs/find-best-thumbnails';
import * as FindKeyMomentsAPI from '../jobs/find-key-moments';
import * as FindScenesAPI from '../jobs/find-scenes';
import * as GenerateChaptersAPI from '../jobs/generate-chapters';
import * as GenerateContextualTextAPI from '../jobs/generate-contextual-text';
import * as GeneratePremiumCaptionsAPI from '../jobs/generate-premium-captions';
import * as ModerateAPI from '../jobs/moderate';
import * as SummarizeAPI from '../jobs/summarize';
import * as TranslateAudioAPI from '../jobs/translate-audio';
import * as TranslateCaptionsAPI from '../jobs/translate-captions';
import { APIPromise } from '../../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../../core/pagination';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Define which Robots workflows should run against Mux assets, and under what conditions.
 */
export class Directives extends APIResource {
  runs: RunsAPI.Runs = new RunsAPI.Runs(this._client);

  /**
   * Creates a new directive that defines which Robots workflows should run against
   * Mux assets, and under what resource conditions.
   *
   * @example
   * ```ts
   * const directive = await client.robotsV0.directives.create({
   *   name: 'Generate captions, then translate',
   *   subject: { type: 'video.asset' },
   *   workflows: [
   *     {
   *       reference_id: 'premium_captions',
   *       workflow: 'generate-premium-captions',
   *     },
   *     {
   *       params: { to_language_code: 'es' },
   *       reference_id: 'translate_es',
   *       workflow: 'translate-captions',
   *     },
   *   ],
   * });
   * ```
   */
  create(body: DirectiveCreateParams, options?: RequestOptions): APIPromise<Directive> {
    return (
      this._client.post('/robots/v0/directives', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Directive }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns a paginated list of active directives for the current environment,
   * newest first.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const directive of client.robotsV0.directives.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: DirectiveListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DirectivesBasePage, Directive> {
    return this._client.getAPIList('/robots/v0/directives', BasePage<Directive>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Retrieves a directive by ID.
   *
   * @example
   * ```ts
   * const directive = await client.robotsV0.directives.retrieve(
   *   'x',
   * );
   * ```
   */
  retrieve(directiveID: string, options?: RequestOptions): APIPromise<Directive> {
    return (
      this._client.get(path`/robots/v0/directives/${directiveID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Directive }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes a directive. After this call, subsequent GET and LIST requests will no
   * longer return it and new directive runs cannot be triggered for it. In-flight
   * runs that have already read the directive config continue to completion.
   *
   * @example
   * ```ts
   * await client.robotsV0.directives.delete('x');
   * ```
   */
  delete(directiveID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/robots/v0/directives/${directiveID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type DirectivesBasePage = BasePage<Directive>;

export interface Directive {
  /**
   * Stable directive identifier (drv\_...).
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the directive was created.
   */
  created_at: number;

  /**
   * Human-readable directive name.
   */
  name: string;

  /**
   * Resource declarations.
   */
  resources: Array<TrackResourceDeclaration | ShotsResourceDeclaration>;

  subject: DirectiveSubject;

  /**
   * Unix timestamp (seconds) when the directive was last updated.
   */
  updated_at: number;

  /**
   * Workflow bindings.
   */
  workflows: Array<WorkflowBinding>;
}

export interface DirectiveSubject {
  /**
   * The entity type each run targets. The directive engine accepts "video.asset"
   * only; "video.live_stream" is reserved and rejected at save time.
   */
  type: 'video.asset' | 'video.live_stream';
}

export interface ShotsResourceDeclaration {
  /**
   * Customer-chosen identifier, unique within the directive. Workflow `inputs`
   * entries reference this handle.
   */
  reference_id: string;

  /**
   * The asset's shot-detection output.
   */
  type: 'video.asset.shots';

  /**
   * How the resource is materialized on the asset. Defaults to
   * `{ "via": "external" }`.
   */
  source?:
    | ShotsResourceDeclaration.SourceExternalV0
    | ShotsResourceDeclaration.SourceRequiredV0
    | ShotsResourceDeclaration.SourceWorkflowV0
    | ShotsResourceDeclaration.SourceMuxAPIGenerateSubtitlesV0
    | ShotsResourceDeclaration.SourceMuxAPICreateTrackV0
    | ShotsResourceDeclaration.SourceMuxAPIRequestShotsV0;
}

export namespace ShotsResourceDeclaration {
  /**
   * The resource is produced out-of-band (e.g. a track uploaded directly to the
   * asset). The engine waits for it to appear and become ready.
   */
  export interface SourceExternalV0 {
    via: 'external';
  }

  /**
   * The resource must already be ready on the asset when the run starts. If it is
   * absent, the dependency workflow fails immediately.
   */
  export interface SourceRequiredV0 {
    via: 'required';
  }

  /**
   * The resource is produced by another workflow binding in this directive.
   * Dependent workflows wait for that binding to complete and the resource to become
   * ready.
   */
  export interface SourceWorkflowV0 {
    /**
     * The reference_id of the workflow binding in this directive that produces the
     * resource.
     */
    binding: string;

    via: 'workflow';
  }

  /**
   * Generate subtitles from the asset's audio using Mux auto-generated captions.
   */
  export interface SourceMuxAPIGenerateSubtitlesV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    params?: SourceMuxAPIGenerateSubtitlesV0.Params;
  }

  export namespace SourceMuxAPIGenerateSubtitlesV0 {
    /**
     * Parameters for the generate_subtitles engine action.
     */
    export interface Params {
      /**
       * BCP 47 language code for the generated subtitles (e.g. "en"). Defaults to
       * "auto", which detects the language from the audio.
       */
      language_code?: string;

      /**
       * BCP 47 language code of the audio track to transcribe. When omitted, the first
       * audio track on the asset is used.
       */
      source_audio_language?: string;
    }
  }

  /**
   * Ingest a track file onto the asset from a URL. Text tracks are ingested as
   * subtitles.
   */
  export interface SourceMuxAPICreateTrackV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    params: SourceMuxAPICreateTrackV0.Params;

    via: 'mux_api';
  }

  export namespace SourceMuxAPICreateTrackV0 {
    /**
     * Parameters for the create_track engine action.
     */
    export interface Params {
      /**
       * BCP 47 language code of the track (e.g. "en").
       */
      language_code: string;

      /**
       * The kind of track to create. "text" tracks are ingested as subtitles.
       */
      type: 'text' | 'audio';

      /**
       * Publicly reachable URL of the track file to ingest.
       */
      url: string;
    }
  }

  /**
   * Request the asset's shot-detection output.
   */
  export interface SourceMuxAPIRequestShotsV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'request_shots';

    via: 'mux_api';

    /**
     * Parameters for the request_shots engine action.
     */
    params?: SourceMuxAPIRequestShotsV0.Params;
  }

  export namespace SourceMuxAPIRequestShotsV0 {
    /**
     * Parameters for the request_shots engine action.
     */
    export interface Params {
      /**
       * How shot images are derived. Defaults to "create_storyboards".
       */
      image_source?: 'create_storyboards' | 'use_shot_midpoint';
    }
  }
}

export interface TrackResourceDeclaration {
  /**
   * The track flavor to match: "caption" for text tracks, "audio" for audio tracks.
   */
  kind: 'caption' | 'audio';

  /**
   * Customer-chosen identifier that must be unique within the directive. Workflow
   * `inputs` reference this identifier.
   */
  reference_id: string;

  /**
   * A caption or audio track on the asset.
   */
  type: 'video.asset.track';

  /**
   * BCP 47 language code the track must match (e.g. "en"). When omitted, any
   * language of the declared kind matches.
   */
  language?: string;

  /**
   * How the resource is materialized on the asset. Defaults to
   * `{ "via": "external" }`.
   */
  source?:
    | TrackResourceDeclaration.SourceExternalV0
    | TrackResourceDeclaration.SourceRequiredV0
    | TrackResourceDeclaration.SourceWorkflowV0
    | TrackResourceDeclaration.SourceMuxAPIGenerateSubtitlesV0
    | TrackResourceDeclaration.SourceMuxAPICreateTrackV0
    | TrackResourceDeclaration.SourceMuxAPIRequestShotsV0;
}

export namespace TrackResourceDeclaration {
  /**
   * The resource is produced out-of-band (e.g. a track uploaded directly to the
   * asset). The engine waits for it to appear and become ready.
   */
  export interface SourceExternalV0 {
    via: 'external';
  }

  /**
   * The resource must already be ready on the asset when the run starts. If it is
   * absent, the dependency workflow fails immediately.
   */
  export interface SourceRequiredV0 {
    via: 'required';
  }

  /**
   * The resource is produced by another workflow binding in this directive.
   * Dependent workflows wait for that binding to complete and the resource to become
   * ready.
   */
  export interface SourceWorkflowV0 {
    /**
     * The reference_id of the workflow binding in this directive that produces the
     * resource.
     */
    binding: string;

    via: 'workflow';
  }

  /**
   * Generate subtitles from the asset's audio using Mux auto-generated captions.
   */
  export interface SourceMuxAPIGenerateSubtitlesV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    params?: SourceMuxAPIGenerateSubtitlesV0.Params;
  }

  export namespace SourceMuxAPIGenerateSubtitlesV0 {
    /**
     * Parameters for the generate_subtitles engine action.
     */
    export interface Params {
      /**
       * BCP 47 language code for the generated subtitles (e.g. "en"). Defaults to
       * "auto", which detects the language from the audio.
       */
      language_code?: string;

      /**
       * BCP 47 language code of the audio track to transcribe. When omitted, the first
       * audio track on the asset is used.
       */
      source_audio_language?: string;
    }
  }

  /**
   * Ingest a track file onto the asset from a URL. Text tracks are ingested as
   * subtitles.
   */
  export interface SourceMuxAPICreateTrackV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    params: SourceMuxAPICreateTrackV0.Params;

    via: 'mux_api';
  }

  export namespace SourceMuxAPICreateTrackV0 {
    /**
     * Parameters for the create_track engine action.
     */
    export interface Params {
      /**
       * BCP 47 language code of the track (e.g. "en").
       */
      language_code: string;

      /**
       * The kind of track to create. "text" tracks are ingested as subtitles.
       */
      type: 'text' | 'audio';

      /**
       * Publicly reachable URL of the track file to ingest.
       */
      url: string;
    }
  }

  /**
   * Request the asset's shot-detection output.
   */
  export interface SourceMuxAPIRequestShotsV0 {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'request_shots';

    via: 'mux_api';

    /**
     * Parameters for the request_shots engine action.
     */
    params?: SourceMuxAPIRequestShotsV0.Params;
  }

  export namespace SourceMuxAPIRequestShotsV0 {
    /**
     * Parameters for the request_shots engine action.
     */
    export interface Params {
      /**
       * How shot images are derived. Defaults to "create_storyboards".
       */
      image_source?: 'create_storyboards' | 'use_shot_midpoint';
    }
  }
}

export type WorkflowBinding =
  | WorkflowBinding.AnalyzeStructureBindingV0
  | WorkflowBinding.SummarizeBindingV0
  | WorkflowBinding.ModerateBindingV0
  | WorkflowBinding.GenerateChaptersBindingV0
  | WorkflowBinding.GenerateContextualTextBindingV0
  | WorkflowBinding.FindScenesBindingV0
  | WorkflowBinding.EditCaptionsBindingV0
  | WorkflowBinding.TranslateCaptionsBindingV0
  | WorkflowBinding.TranslateAudioBindingV0
  | WorkflowBinding.AskQuestionsBindingV0
  | WorkflowBinding.FindKeyMomentsBindingV0
  | WorkflowBinding.GenerateEngagementInsightsBindingV0
  | WorkflowBinding.GeneratePremiumCaptionsBindingV0
  | WorkflowBinding.FindBestThumbnailsBindingV0;

export namespace WorkflowBinding {
  export interface AnalyzeStructureBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'analyze-structure';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the analyze-structure workflow — the same fields accepted by POST
     * /robots/v0/jobs/analyze-structure, minus engine-supplied fields such as
     * asset_id.
     */
    params?: AnalyzeStructureBindingV0.Params;
  }

  export namespace AnalyzeStructureBindingV0 {
    /**
     * Parameters for the analyze-structure workflow — the same fields accepted by POST
     * /robots/v0/jobs/analyze-structure, minus engine-supplied fields such as
     * asset_id.
     */
    export interface Params {
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
      output_steering?: AnalyzeStructureAPI.AnalyzeStructureOutputSteering;

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
  }

  export interface SummarizeBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'summarize';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the summarize workflow — the same fields accepted by POST
     * /robots/v0/jobs/summarize, minus engine-supplied fields such as asset_id.
     */
    params?: SummarizeBindingV0.Params;
  }

  export namespace SummarizeBindingV0 {
    /**
     * Parameters for the summarize workflow — the same fields accepted by POST
     * /robots/v0/jobs/summarize, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * Maximum description length in words.
       */
      description_length?: number;

      /**
       * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
       * omitted, English subtitles are preferred when available, otherwise the first
       * ready text track is selected.
       */
      language_code?: string;

      /**
       * BCP 47 language code for the generated summary output (e.g. "en", "fr", "ja").
       * Auto-detected from the transcript if omitted.
       */
      output_language_code?: string;

      /**
       * Curated output_steering controls for execution scope, summary style, audience,
       * brand terminology, and tag taxonomy. Scope is enforced; other controls guide
       * model behavior but do not guarantee exact output.
       */
      output_steering?: SummarizeAPI.SummarizeOutputSteering;

      /**
       * @deprecated Use `output_steering` instead.
       */
      prompt_overrides?: Params.PromptOverrides;

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

    export namespace Params {
      /**
       * @deprecated Use `output_steering` instead.
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
  }

  export interface ModerateBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'moderate';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the moderate workflow — the same fields accepted by POST
     * /robots/v0/jobs/moderate, minus engine-supplied fields such as asset_id.
     */
    params?: ModerateBindingV0.Params;
  }

  export namespace ModerateBindingV0 {
    /**
     * Parameters for the moderate workflow — the same fields accepted by POST
     * /robots/v0/jobs/moderate, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code of the caption track to moderate. When omitted, an English
       * subtitles track is preferred and otherwise the first ready text track is used.
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
      on_flagged?: ModerateAPI.ActionOnFlagged;

      /**
       * Curated controls that optionally restrict moderation to an asset time range.
       */
      output_steering?: ModerateAPI.ModerateOutputSteering;

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
      thresholds?: Params.Thresholds;
    }

    export namespace Params {
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
  }

  export interface GenerateChaptersBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'generate-chapters';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the generate-chapters workflow — the same fields accepted by POST
     * /robots/v0/jobs/generate-chapters, minus engine-supplied fields such as
     * asset_id.
     */
    params?: GenerateChaptersBindingV0.Params;
  }

  export namespace GenerateChaptersBindingV0 {
    /**
     * Parameters for the generate-chapters workflow — the same fields accepted by POST
     * /robots/v0/jobs/generate-chapters, minus engine-supplied fields such as
     * asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
       * omitted, the first ready text track on the asset is selected.
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
      output_steering?: GenerateChaptersAPI.GenerateChaptersOutputSteering;

      /**
       * @deprecated Use `output_steering` instead.
       */
      prompt_overrides?: Params.PromptOverrides;

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

    export namespace Params {
      /**
       * @deprecated Use `output_steering` instead.
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
  }

  export interface GenerateContextualTextBindingV0 {
    /**
     * Parameters for the generate-contextual-text workflow — the same fields accepted
     * by POST /robots/v0/jobs/generate-contextual-text, minus engine-supplied fields
     * such as asset_id.
     */
    params: GenerateContextualTextBindingV0.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'generate-contextual-text';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace GenerateContextualTextBindingV0 {
    /**
     * Parameters for the generate-contextual-text workflow — the same fields accepted
     * by POST /robots/v0/jobs/generate-contextual-text, minus engine-supplied fields
     * such as asset_id.
     */
    export interface Params {
      /**
       * The deliverables to create for every variant. Supports 1-5 artifacts with unique
       * keys.
       */
      artifacts: Array<Params.Artifact>;

      /**
       * Named versions of the complete artifact set. Supports 1-5 variants with unique
       * keys.
       */
      variants: Array<Params.Variant>;

      /**
       * BCP 47 language code of the caption track to analyze. When omitted, the first
       * ready text track is used.
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
      output_steering?: GenerateContextualTextAPI.GenerateContextualTextOutputSteering;

      /**
       * When true for a video asset, generate or reuse Mux shots and attach a bounded
       * sample of shot frames as additional visual evidence. Video assets always include
       * a storyboard; the transcript remains authoritative. Not supported for audio-only
       * assets.
       */
      use_shots?: boolean;
    }

    export namespace Params {
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
          | Artifact.GenerateContextualTextCharacterMaxLengthV0
          | Artifact.GenerateContextualTextWordMaxLengthV0;
      }

      export namespace Artifact {
        export interface GenerateContextualTextCharacterMaxLengthV0 {
          unit: 'characters';

          value: number;
        }

        export interface GenerateContextualTextWordMaxLengthV0 {
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
  }

  export interface FindScenesBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'find-scenes';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the find-scenes workflow — the same fields accepted by POST
     * /robots/v0/jobs/find-scenes, minus engine-supplied fields such as asset_id.
     */
    params?: FindScenesBindingV0.Params;
  }

  export namespace FindScenesBindingV0 {
    /**
     * Parameters for the find-scenes workflow — the same fields accepted by POST
     * /robots/v0/jobs/find-scenes, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
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
      output_steering?: FindScenesAPI.FindScenesOutputSteering;
    }
  }

  export interface EditCaptionsBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'edit-captions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the edit-captions workflow — the same fields accepted by POST
     * /robots/v0/jobs/edit-captions, minus engine-supplied fields such as asset_id.
     * The engine selects the first ready subtitle track in asset track order; track_id
     * cannot be supplied.
     */
    params?: EditCaptionsBindingV0.Params;
  }

  export namespace EditCaptionsBindingV0 {
    /**
     * Parameters for the edit-captions workflow — the same fields accepted by POST
     * /robots/v0/jobs/edit-captions, minus engine-supplied fields such as asset_id.
     * The engine selects the first ready subtitle track in asset track order; track_id
     * cannot be supplied.
     */
    export interface Params {
      /**
       * Optional LLM-driven profanity detection and censorship rules applied to the
       * selected caption track.
       */
      auto_censor_profanity?: Params.AutoCensorProfanity;

      /**
       * @deprecated Use `replace_existing_tracks` instead.
       */
      delete_original_track?: boolean;

      /**
       * What to do with the source track. Defaults to `replace`: the source is deleted
       * and the edited track takes its place under the same name, language and
       * closed-captions setting; no other track is touched, and the source is restored
       * if the edited track can't be added. `fail` deletes nothing and adds the edited
       * track alongside the source, so it requires a `track_name` different from the
       * source's. Either way the request is rejected if a track other than the source
       * already has the edited track's name. `replace` requires `upload_to_mux` to be
       * true.
       */
      replace_existing_tracks?: 'replace' | 'fail';

      /**
       * Optional static word or phrase replacements applied directly to cue text.
       */
      replacements?: Array<Params.Replacement>;

      /**
       * Optional replacements for bracketed speaker labels at the start of caption cues.
       * Values omit the surrounding square brackets, and matching spoken text is not
       * changed.
       */
      speaker_replacements?: Array<EditCaptionsAPI.EditCaptionsSpeakerReplacement>;

      /**
       * Name for the edited Mux text track. Defaults to the source track's name.
       * Required and must differ from the source's name when `replace_existing_tracks`
       * is `fail`. Mux requires text track names to be unique on an asset.
       */
      track_name?: string;

      /**
       * @deprecated Use `track_name` instead.
       */
      track_name_suffix?: string;

      /**
       * Whether to upload the edited VTT back to the Mux asset as a text track. Defaults
       * to true.
       */
      upload_to_mux?: boolean;
    }

    export namespace Params {
      /**
       * Optional LLM-driven profanity detection and censorship rules applied to the
       * selected caption track.
       */
      export interface AutoCensorProfanity {
        /**
         * Additional words or short phrases that should always be censored even if the
         * model does not detect them.
         */
        always_censor?: Array<string>;

        /**
         * How profanity is detected. Currently only `llm` is supported, which uses an LLM
         * to identify profanity in cue text.
         */
        detection_method?: 'llm';

        /**
         * Replacement strategy for detected profanity: blank inserts bracketed
         * underscores, remove drops the match, and mask replaces characters with question
         * marks. Defaults to "blank".
         */
        mode?: 'blank' | 'remove' | 'mask';

        /**
         * Words or short phrases that should never be censored even if the model flags
         * them.
         */
        never_censor?: Array<string>;
      }

      export interface Replacement {
        /**
         * Exact word or phrase to replace in cue text.
         */
        find: string;

        /**
         * Replacement text to insert when a match is found.
         */
        replace: string;

        /**
         * When true, `find` is matched only with exact case. Defaults to false
         * (case-insensitive matching), so "gonna" also matches "Gonna" and "GONNA".
         */
        case_sensitive?: boolean;
      }
    }
  }

  export interface TranslateCaptionsBindingV0 {
    /**
     * Parameters for the translate-captions workflow — the same fields accepted by
     * POST /robots/v0/jobs/translate-captions, minus engine-supplied fields such as
     * asset_id. The engine selects the first ready subtitle track in asset track order
     * whose language differs from to_language_code, ignoring region subtags; track_id
     * cannot be supplied.
     */
    params: TranslateCaptionsBindingV0.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'translate-captions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateCaptionsBindingV0 {
    /**
     * Parameters for the translate-captions workflow — the same fields accepted by
     * POST /robots/v0/jobs/translate-captions, minus engine-supplied fields such as
     * asset_id. The engine selects the first ready subtitle track in asset track order
     * whose language differs from to_language_code, ignoring region subtags; track_id
     * cannot be supplied.
     */
    export interface Params {
      /**
       * BCP 47 language code for the translated output (e.g. "es", "ja"). Unless
       * replace_existing_tracks allows replacement, the asset must not already have a
       * text track for this language.
       */
      to_language_code: string;

      /**
       * Best-effort list of terms (brand names, proper nouns) to preserve verbatim in
       * the translated captions. Does not guarantee exact output. Terms must not contain
       * '<' or '>', invisible characters, or characters altered by Unicode
       * normalization.
       */
      never_translate?: Array<string>;

      /**
       * What to do when the asset already has a text track in the same language as, or
       * with the same name as, the translated track. Defaults to `fail`, which rejects
       * the request before any translation is billed. `replace_all` deletes every such
       * track first. `replace_generated` deletes only Mux Video auto-generated tracks
       * and rejects if an uploaded track is in the way. Any value other than `fail`
       * requires `upload_to_mux` to be true. Existing tracks are matched by language
       * ignoring region subtags, and by name ignoring case, in any status.
       */
      replace_existing_tracks?: TranslateCaptionsAPI.TranslateCaptionsReplaceExistingTracks;

      /**
       * Name for the translated Mux text track. Defaults to "{Language}
       * (Auto-translated)", e.g. "Spanish (Auto-translated)". Mux requires text track
       * names to be unique on an asset, and an existing track with this name is handled
       * according to `replace_existing_tracks`.
       */
      track_name?: string;

      /**
       * Whether to upload the translated VTT and attach it as a text track on the Mux
       * asset. Defaults to true.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface TranslateAudioBindingV0 {
    /**
     * Parameters for the translate-audio workflow — the same fields accepted by POST
     * /robots/v0/jobs/translate-audio, minus engine-supplied fields such as asset_id.
     */
    params: TranslateAudioBindingV0.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'translate-audio';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateAudioBindingV0 {
    /**
     * Parameters for the translate-audio workflow — the same fields accepted by POST
     * /robots/v0/jobs/translate-audio, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code for the target translation language (e.g. "es", "fr",
       * "ja").
       */
      to_language_code: string;

      /**
       * What to do when the asset already has an audio track in the same language as, or
       * with the same name as, the new dubbed track. Defaults to `fail`, which rejects
       * the request before any dubbing is billed. `replace_all` deletes every such track
       * first. Audio tracks are never auto-generated by Mux Video, so
       * `replace_generated` behaves as `fail` here. The asset's primary audio track is
       * never deleted. Any value other than `fail` requires `upload_to_mux` to be true.
       * Existing tracks are matched by language ignoring region subtags, and by name
       * ignoring case, in any status.
       */
      replace_existing_tracks?: TranslateAudioAPI.TranslateAudioReplaceExistingTracks;

      /**
       * Name for the dubbed Mux audio track. Defaults to "{Language} (Auto-dubbed)",
       * e.g. "Spanish (Auto-dubbed)". Mux requires audio track names to be unique on an
       * asset, and an existing track with this name is handled according to
       * `replace_existing_tracks`.
       */
      track_name?: string;

      /**
       * Whether to automatically upload the translated audio track to the Mux asset.
       * Defaults to true. Must be false for audio-only assets; the job returns
       * downloadable audio instead.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface AskQuestionsBindingV0 {
    /**
     * Parameters for the ask-questions workflow — the same fields accepted by POST
     * /robots/v0/jobs/ask-questions, minus engine-supplied fields such as asset_id.
     */
    params: AskQuestionsBindingV0.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'ask-questions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace AskQuestionsBindingV0 {
    /**
     * Parameters for the ask-questions workflow — the same fields accepted by POST
     * /robots/v0/jobs/ask-questions, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * One or more questions to ask about the video, up to 50. Each question can either
       * select from answer_options (defaults to yes/no) or, by setting free_form_reply:
       * true, receive a free-form prose answer.
       */
      questions: Array<Params.Question>;

      /**
       * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
       * omitted, English subtitles are preferred when available, otherwise the first
       * ready text track is selected.
       */
      language_code?: string;

      /**
       * Max character length for free-form answers, between 1 and 1000. Ignored unless
       * at least one question sets free_form_reply: true.
       */
      max_free_form_answer_length?: number;

      /**
       * Curated controls that optionally restrict question answering to an asset time
       * range.
       */
      output_steering?: AskQuestionsAPI.AskQuestionsOutputSteering;
    }

    export namespace Params {
      export interface Question {
        /**
         * The question to ask about the video content. Maximum 600 characters.
         */
        question: string;

        /**
         * Allowed answer values for this question. Defaults to ["yes", "no"] when omitted
         * and free_form_reply is not true. Mutually exclusive with free_form_reply. Each
         * option is a short label of at most 150 characters.
         */
        answer_options?: Array<string>;

        /**
         * When true, the model replies with free-form prose instead of selecting from
         * answer_options. Mutually exclusive with answer_options. Treat the answer as
         * untrusted model output.
         */
        free_form_reply?: boolean;
      }
    }
  }

  export interface FindKeyMomentsBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'find-key-moments';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the find-key-moments workflow — the same fields accepted by POST
     * /robots/v0/jobs/find-key-moments, minus engine-supplied fields such as asset_id.
     */
    params?: FindKeyMomentsBindingV0.Params;
  }

  export namespace FindKeyMomentsBindingV0 {
    /**
     * Parameters for the find-key-moments workflow — the same fields accepted by POST
     * /robots/v0/jobs/find-key-moments, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
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
      output_steering?: FindKeyMomentsAPI.FindKeyMomentsOutputSteering;

      /**
       * Preferred highlight duration range in milliseconds. When provided, the model
       * will aim to select moments within this range.
       */
      target_duration_ms?: Params.TargetDurationMs;

      /**
       * Controls whether video assets are analyzed using Mux shots. When true, shots are
       * generated or reused and visual evidence drives selection. When false or omitted,
       * selection uses transcript evidence and the asset must have a caption track. Not
       * supported for audio-only assets.
       */
      use_shots?: boolean;
    }

    export namespace Params {
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
  }

  export interface GenerateEngagementInsightsBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'generate-engagement-insights';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the generate-engagement-insights workflow — the same fields
     * accepted by POST /robots/v0/jobs/generate-engagement-insights, minus
     * engine-supplied fields such as asset_id.
     */
    params?: unknown;
  }

  export interface GeneratePremiumCaptionsBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'generate-premium-captions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the generate-premium-captions workflow — the same fields accepted
     * by POST /robots/v0/jobs/generate-premium-captions, minus engine-supplied fields
     * such as asset_id.
     */
    params?: GeneratePremiumCaptionsBindingV0.Params;
  }

  export namespace GeneratePremiumCaptionsBindingV0 {
    /**
     * Parameters for the generate-premium-captions workflow — the same fields accepted
     * by POST /robots/v0/jobs/generate-premium-captions, minus engine-supplied fields
     * such as asset_id.
     */
    export interface Params {
      /**
       * When true, speaker labels are identified and added to each caption cue. Useful
       * for interviews, podcasts, and multi-speaker content.
       */
      include_speakers?: boolean;

      /**
       * When true, word-level timestamps are exported as a JSON file accessible via
       * temporary_words_url in the job outputs. The URL expires 7 days after the job
       * completes. Billed at a higher unit rate.
       */
      include_words?: boolean;

      /**
       * BCP 47 language code of the audio (e.g. "en", "es"). A best-effort hint that
       * biases transcription toward this language — it is not verified against the audio
       * and does not guarantee the output language. When supplied, language detection is
       * skipped and the captions are labeled with this code. The language will be
       * auto-detected when omitted; existing tracks are then checked against
       * `replace_existing_tracks` after transcription, so a same-language conflict
       * errors the job at track creation instead of being rejected up front, and a
       * deleting policy only applies when the detection is confident.
       */
      language_code?: string;

      /**
       * Best-effort list of words or short phrases (proper nouns, product names, jargon)
       * likely to appear in the audio, used to bias recognition toward correct
       * spellings. Does not guarantee exact output. Each phrase may contain at most 49
       * characters and 5 words, and must not contain the characters <, >, {, }, [, ], or
       * \.
       */
      phrases?: Array<string>;

      /**
       * @deprecated Use `replace_existing_tracks` instead.
       */
      replace_existing?: boolean;

      /**
       * What to do when the asset already has a text track in the same language as, or
       * with the same name as, the new caption track. Defaults to `fail`, which rejects
       * the request before any work is billed. `replace_all` deletes every such track
       * first. `replace_generated` deletes only Mux Video auto-generated tracks and
       * rejects if an uploaded track is in the way. Existing tracks are matched by
       * language ignoring region subtags, and by name ignoring case, in any status. When
       * `language_code` is omitted the detected language is used, and tracks are only
       * deleted when the detection is confident; otherwise the job behaves as `fail`.
       */
      replace_existing_tracks?: GeneratePremiumCaptionsAPI.GeneratePremiumCaptionsReplaceExistingTracks;

      /**
       * Custom name for the uploaded Mux text track. Defaults to "{Language}
       * (Generated)", e.g. "English (Generated)". Mux requires text track names to be
       * unique on an asset.
       */
      track_name?: string;

      /**
       * Whether to upload the generated SRT to the Mux asset as a new text track.
       * Defaults to true. When false, no track is created and `replace_existing_tracks`
       * must be `fail`; the generated SRT remains available via `temporary_srt_url`.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface FindBestThumbnailsBindingV0 {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST
     * /robots/v0/jobs/{workflow}.
     */
    workflow: 'find-best-thumbnails';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;

    /**
     * Parameters for the find-best-thumbnails workflow — the same fields accepted by
     * POST /robots/v0/jobs/find-best-thumbnails, minus engine-supplied fields such as
     * asset_id.
     */
    params?: FindBestThumbnailsBindingV0.Params;
  }

  export namespace FindBestThumbnailsBindingV0 {
    /**
     * Parameters for the find-best-thumbnails workflow — the same fields accepted by
     * POST /robots/v0/jobs/find-best-thumbnails, minus engine-supplied fields such as
     * asset_id.
     */
    export interface Params {
      /**
       * Maximum number of candidate thumbnails to return (1-5). Defaults to 5.
       */
      max_thumbnails?: number;

      /**
       * Curated output_steering controls for execution scope, thumbnail scoring
       * strategy, explicit user intent, audience, campaign style, and scoring
       * priorities. Scope is enforced; other controls guide model behavior but do not
       * guarantee exact output.
       */
      output_steering?: FindBestThumbnailsAPI.FindBestThumbnailsOutputSteering;

      /**
       * When true, the highest-scoring thumbnail's timestamp is written to the Mux
       * asset's thumbnail_time once the job completes, making that frame the asset's
       * default poster image. The new thumbnail will appear for some clients sooner than
       * others, depending on local cache settings.
       */
      update_asset_thumbnail?: boolean;
    }
  }
}

export interface DirectiveCreateParams {
  /**
   * Human-readable directive name.
   */
  name: string;

  subject: DirectiveSubject;

  /**
   * The Robots workflows to dispatch on each run.
   */
  workflows: Array<WorkflowBinding>;

  /**
   * Resources the engine ensures on the asset before dependent workflows run. May be
   * omitted for workflows-only directives.
   */
  resources?: Array<TrackResourceDeclaration | ShotsResourceDeclaration>;
}

export interface DirectiveListParams extends BasePageParams {}

Directives.Runs = Runs;

export declare namespace Directives {
  export {
    type Directive as Directive,
    type DirectiveSubject as DirectiveSubject,
    type ShotsResourceDeclaration as ShotsResourceDeclaration,
    type TrackResourceDeclaration as TrackResourceDeclaration,
    type WorkflowBinding as WorkflowBinding,
    type DirectivesBasePage as DirectivesBasePage,
    type DirectiveCreateParams as DirectiveCreateParams,
    type DirectiveListParams as DirectiveListParams,
  };

  export {
    Runs as Runs,
    type DirectiveRun as DirectiveRun,
    type DirectiveRunDetail as DirectiveRunDetail,
    type NodeState as NodeState,
    type DirectiveRunDetailsBasePage as DirectiveRunDetailsBasePage,
    type RunCreateParams as RunCreateParams,
    type RunListParams as RunListParams,
  };
}
