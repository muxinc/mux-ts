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
import * as FindBestThumbnailsAPI from '../jobs/find-best-thumbnails';
import * as FindKeyMomentsAPI from '../jobs/find-key-moments';
import * as FindScenesAPI from '../jobs/find-scenes';
import * as GenerateChaptersAPI from '../jobs/generate-chapters';
import * as ModerateAPI from '../jobs/moderate';
import * as SummarizeAPI from '../jobs/summarize';
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
   * const directive = await client.robots.directives.create({
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
   * for await (const directive of client.robots.directives.list()) {
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
   * const directive = await client.robots.directives.retrieve(
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
   * await client.robots.directives.delete('x');
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
   * The entity type each run targets. V1 accepts "video.asset" only;
   * "video.live_stream" is reserved and rejected at save time.
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
    | ShotsResourceDeclaration.SourceExternal
    | ShotsResourceDeclaration.SourceRequired
    | ShotsResourceDeclaration.SourceWorkflow
    | ShotsResourceDeclaration.SourceMuxAPIGenerateSubtitles
    | ShotsResourceDeclaration.SourceMuxAPICreateTrack
    | ShotsResourceDeclaration.SourceMuxAPIRequestShots;
}

export namespace ShotsResourceDeclaration {
  /**
   * The resource is produced out-of-band (e.g. a track uploaded directly to the
   * asset). The engine waits for it to appear and become ready.
   */
  export interface SourceExternal {
    via: 'external';
  }

  /**
   * The resource must already be ready on the asset when the run starts. If it is
   * absent, the dependency workflow fails immediately.
   */
  export interface SourceRequired {
    via: 'required';
  }

  /**
   * The resource is produced by another workflow binding in this directive.
   * Dependent workflows wait for that binding to complete and the resource to become
   * ready.
   */
  export interface SourceWorkflow {
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
  export interface SourceMuxAPIGenerateSubtitles {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    params?: SourceMuxAPIGenerateSubtitles.Params;
  }

  export namespace SourceMuxAPIGenerateSubtitles {
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
  export interface SourceMuxAPICreateTrack {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    params: SourceMuxAPICreateTrack.Params;

    via: 'mux_api';
  }

  export namespace SourceMuxAPICreateTrack {
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
  export interface SourceMuxAPIRequestShots {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'request_shots';

    via: 'mux_api';

    /**
     * Parameters for the request_shots engine action.
     */
    params?: SourceMuxAPIRequestShots.Params;
  }

  export namespace SourceMuxAPIRequestShots {
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
    | TrackResourceDeclaration.SourceExternal
    | TrackResourceDeclaration.SourceRequired
    | TrackResourceDeclaration.SourceWorkflow
    | TrackResourceDeclaration.SourceMuxAPIGenerateSubtitles
    | TrackResourceDeclaration.SourceMuxAPICreateTrack
    | TrackResourceDeclaration.SourceMuxAPIRequestShots;
}

export namespace TrackResourceDeclaration {
  /**
   * The resource is produced out-of-band (e.g. a track uploaded directly to the
   * asset). The engine waits for it to appear and become ready.
   */
  export interface SourceExternal {
    via: 'external';
  }

  /**
   * The resource must already be ready on the asset when the run starts. If it is
   * absent, the dependency workflow fails immediately.
   */
  export interface SourceRequired {
    via: 'required';
  }

  /**
   * The resource is produced by another workflow binding in this directive.
   * Dependent workflows wait for that binding to complete and the resource to become
   * ready.
   */
  export interface SourceWorkflow {
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
  export interface SourceMuxAPIGenerateSubtitles {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    params?: SourceMuxAPIGenerateSubtitles.Params;
  }

  export namespace SourceMuxAPIGenerateSubtitles {
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
  export interface SourceMuxAPICreateTrack {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    params: SourceMuxAPICreateTrack.Params;

    via: 'mux_api';
  }

  export namespace SourceMuxAPICreateTrack {
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
  export interface SourceMuxAPIRequestShots {
    /**
     * The Mux Video API call the engine fires to create the resource.
     */
    action: 'request_shots';

    via: 'mux_api';

    /**
     * Parameters for the request_shots engine action.
     */
    params?: SourceMuxAPIRequestShots.Params;
  }

  export namespace SourceMuxAPIRequestShots {
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
  | WorkflowBinding.SummarizeBinding
  | WorkflowBinding.ModerateBinding
  | WorkflowBinding.GenerateChaptersBinding
  | WorkflowBinding.FindScenesBinding
  | WorkflowBinding.EditCaptionsBinding
  | WorkflowBinding.TranslateCaptionsBinding
  | WorkflowBinding.TranslateAudioBinding
  | WorkflowBinding.AskQuestionsBinding
  | WorkflowBinding.FindKeyMomentsBinding
  | WorkflowBinding.GenerateEngagementInsightsBinding
  | WorkflowBinding.GeneratePremiumCaptionsBinding
  | WorkflowBinding.FindBestThumbnailsBinding;

export namespace WorkflowBinding {
  export interface SummarizeBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/summarize, minus engine-supplied fields such as asset_id.
     */
    params?: SummarizeBinding.Params;
  }

  export namespace SummarizeBinding {
    /**
     * Parameters for the summarize workflow — the same fields accepted by POST
     * /jobs/summarize, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
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
      output_steering?: SummarizeAPI.SummarizeOutputSteering;

      /**
       * Legacy/internal prompt-section overrides. Prefer output_steering for new
       * integrations.
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
  }

  export interface ModerateBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/moderate, minus engine-supplied fields such as asset_id.
     */
    params?: ModerateBinding.Params;
  }

  export namespace ModerateBinding {
    /**
     * Parameters for the moderate workflow — the same fields accepted by POST
     * /jobs/moderate, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code for transcript analysis. Used only for audio-only assets;
       * ignored for video assets with visual content. If omitted for audio-only assets,
       * the first ready text track is used. Defaults to "en".
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

  export interface GenerateChaptersBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/generate-chapters, minus engine-supplied fields such as asset_id.
     */
    params?: GenerateChaptersBinding.Params;
  }

  export namespace GenerateChaptersBinding {
    /**
     * Parameters for the generate-chapters workflow — the same fields accepted by POST
     * /jobs/generate-chapters, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
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
      output_steering?: GenerateChaptersAPI.GenerateChaptersOutputSteering;

      /**
       * Legacy/internal prompt-section overrides. Prefer output_steering for new
       * integrations.
       */
      prompt_overrides?: Params.PromptOverrides;
    }

    export namespace Params {
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
  }

  export interface FindScenesBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/find-scenes, minus engine-supplied fields such as asset_id.
     */
    params?: FindScenesBinding.Params;
  }

  export namespace FindScenesBinding {
    /**
     * Parameters for the find-scenes workflow — the same fields accepted by POST
     * /jobs/find-scenes, minus engine-supplied fields such as asset_id.
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

  export interface EditCaptionsBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/edit-captions, minus engine-supplied fields such as asset_id.
     */
    params?: EditCaptionsBinding.Params;
  }

  export namespace EditCaptionsBinding {
    /**
     * Parameters for the edit-captions workflow — the same fields accepted by POST
     * /jobs/edit-captions, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * Optional LLM-driven profanity detection and censorship rules applied to the
       * selected caption track.
       */
      auto_censor_profanity?: Params.AutoCensorProfanity;

      /**
       * Whether to delete the original source text track after the edited track upload
       * succeeds. Has effect only when upload_to_mux is true. Defaults to true.
       */
      delete_original_track?: boolean;

      /**
       * Optional static word or phrase replacements applied directly to cue text.
       */
      replacements?: Array<Params.Replacement>;

      /**
       * Optional suffix appended to the uploaded replacement track name. Defaults to
       * "edited".
       */
      track_name_suffix?: string;

      /**
       * Whether to upload the edited VTT back to the Mux asset as a new text track.
       * Defaults to true.
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

  export interface TranslateCaptionsBinding {
    /**
     * Parameters for the translate-captions workflow — the same fields accepted by
     * POST /jobs/translate-captions, minus engine-supplied fields such as asset_id.
     */
    params: TranslateCaptionsBinding.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
     */
    workflow: 'translate-captions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateCaptionsBinding {
    /**
     * Parameters for the translate-captions workflow — the same fields accepted by
     * POST /jobs/translate-captions, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code for the translated output (e.g. "es", "ja"). The asset must
       * not already have a text track for this language.
       */
      to_language_code: string;

      /**
       * Whether to upload the translated VTT and attach it as a text track on the Mux
       * asset. Defaults to true.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface TranslateAudioBinding {
    /**
     * Parameters for the translate-audio workflow — the same fields accepted by POST
     * /jobs/translate-audio, minus engine-supplied fields such as asset_id.
     */
    params: TranslateAudioBinding.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
     */
    workflow: 'translate-audio';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateAudioBinding {
    /**
     * Parameters for the translate-audio workflow — the same fields accepted by POST
     * /jobs/translate-audio, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * BCP 47 language code for the target translation language (e.g. "es", "fr",
       * "ja").
       */
      to_language_code: string;

      /**
       * Whether to automatically upload the translated audio track to the Mux asset.
       * Defaults to true.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface AskQuestionsBinding {
    /**
     * Parameters for the ask-questions workflow — the same fields accepted by POST
     * /jobs/ask-questions, minus engine-supplied fields such as asset_id.
     */
    params: AskQuestionsBinding.Params;

    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
     */
    workflow: 'ask-questions';

    /**
     * reference_ids of declared resources this workflow depends on. Each entry is a
     * hard dependency: the workflow is not dispatched until the referenced resource is
     * ready.
     */
    inputs?: Array<string>;
  }

  export namespace AskQuestionsBinding {
    /**
     * Parameters for the ask-questions workflow — the same fields accepted by POST
     * /jobs/ask-questions, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * One or more questions to ask about the video. Each question can either select
       * from answer_options (defaults to yes/no) or, by setting free_form_reply: true,
       * receive a free-form prose answer.
       */
      questions: Array<Params.Question>;

      /**
       * BCP 47 language code of the caption track to analyze (e.g. "en", "fr"). When
       * omitted, the SDK uses the default track.
       */
      language_code?: string;

      /**
       * Experimental. Max character length for free-form answers. Ignored unless at
       * least one question sets free_form_reply: true.
       */
      max_free_form_answer_length?: number;
    }

    export namespace Params {
      export interface Question {
        /**
         * The question to ask about the video content.
         */
        question: string;

        /**
         * Allowed answer values for this question. Defaults to ["yes", "no"] when omitted
         * and free_form_reply is not true. Mutually exclusive with free_form_reply.
         */
        answer_options?: Array<string>;

        /**
         * Experimental. When true, the model replies with free-form prose instead of
         * selecting from answer_options. Mutually exclusive with answer_options. Treat the
         * answer as untrusted model output.
         */
        free_form_reply?: boolean;
      }
    }
  }

  export interface FindKeyMomentsBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * /jobs/find-key-moments, minus engine-supplied fields such as asset_id.
     */
    params?: FindKeyMomentsBinding.Params;
  }

  export namespace FindKeyMomentsBinding {
    /**
     * Parameters for the find-key-moments workflow — the same fields accepted by POST
     * /jobs/find-key-moments, minus engine-supplied fields such as asset_id.
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

  export interface GenerateEngagementInsightsBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * accepted by POST /jobs/generate-engagement-insights, minus engine-supplied
     * fields such as asset_id.
     */
    params?: unknown;
  }

  export interface GeneratePremiumCaptionsBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * by POST /jobs/generate-premium-captions, minus engine-supplied fields such as
     * asset_id.
     */
    params?: GeneratePremiumCaptionsBinding.Params;
  }

  export namespace GeneratePremiumCaptionsBinding {
    /**
     * Parameters for the generate-premium-captions workflow — the same fields accepted
     * by POST /jobs/generate-premium-captions, minus engine-supplied fields such as
     * asset_id.
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
       * BCP 47 language code of the audio (e.g. "en", "es"). The language will be
       * auto-detected when omitted.
       */
      language_code?: string;

      /**
       * Best-effort list of words or short phrases (proper nouns, product names, jargon)
       * likely to appear in the audio, used to bias recognition toward correct
       * spellings. Does not guarantee exact output.
       */
      phrases?: Array<string>;

      /**
       * When true, any existing text track with the same language code is deleted before
       * uploading the new caption track. When false (default), the request is rejected
       * if a matching track already exists.
       */
      replace_existing?: boolean;

      /**
       * Custom name for the uploaded Mux text track. Defaults to "{Language}
       * (Generated)" using the resolved language code.
       */
      track_name?: string;

      /**
       * Whether to upload the generated VTT to the Mux asset as a new text track.
       * Defaults to true. When false, no track is created and `replace_existing` must
       * also be false; the generated SRT remains available via `temporary_srt_url`.
       */
      upload_to_mux?: boolean;
    }
  }

  export interface FindBestThumbnailsBinding {
    /**
     * Customer-chosen identifier, unique within the directive. Resource
     * `source.binding` refs point at this handle.
     */
    reference_id: string;

    /**
     * The Robots workflow to dispatch — the same identifier as POST /jobs/{workflow}.
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
     * POST /jobs/find-best-thumbnails, minus engine-supplied fields such as asset_id.
     */
    params?: FindBestThumbnailsBinding.Params;
  }

  export namespace FindBestThumbnailsBinding {
    /**
     * Parameters for the find-best-thumbnails workflow — the same fields accepted by
     * POST /jobs/find-best-thumbnails, minus engine-supplied fields such as asset_id.
     */
    export interface Params {
      /**
       * Maximum number of candidate thumbnails to return (1-5). Defaults to 1.
       */
      max_thumbnails?: number;

      /**
       * Curated output_steering controls for execution scope, thumbnail scoring
       * strategy, explicit user intent, audience, campaign style, and scoring
       * priorities. Scope is enforced; other controls guide model behavior but do not
       * guarantee exact output.
       */
      output_steering?: FindBestThumbnailsAPI.FindBestThumbnailsOutputSteering;
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
