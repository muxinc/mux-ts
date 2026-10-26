// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as RunsAPI from './runs';
import {
  DirectiveNodeState,
  DirectiveRun,
  DirectiveRunsBasePage,
  RunCreateParams,
  RunListParams,
  Runs,
} from './runs';
import * as AnalyzeStructureAPI from '../jobs/analyze-structure';
import * as AskQuestionsAPI from '../jobs/ask-questions';
import * as EditCaptionsAPI from '../jobs/edit-captions';
import * as FindBestThumbnailsAPI from '../jobs/find-best-thumbnails';
import * as FindKeyMomentsAPI from '../jobs/find-key-moments';
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
   * const directive = await client.robots.directives.create({
   *   bindings: [
   *     { reference_id: 'moderation', workflow: 'moderate' },
   *   ],
   *   name: 'Moderate new assets',
   *   subject: { type: 'video.asset' },
   * });
   * ```
   */
  create(body: DirectiveCreateParams, options?: RequestOptions): APIPromise<Directive> {
    return (
      this._client.post('/robots/v1/directives', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Directive }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns active v0 and v1 directive summaries, newest first. Follow each self
   * link to retrieve the owning-version configuration.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const directiveListResponse of client.robots.directives.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: DirectiveListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DirectiveListResponsesBasePage, DirectiveListResponse> {
    return this._client.getAPIList('/robots/v1/directives', BasePage<DirectiveListResponse>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns a v1 directive. A directive owned by v0 returns 404.
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
      this._client.get(path`/robots/v1/directives/${directiveID}`, {
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
    return this._client.delete(path`/robots/v1/directives/${directiveID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type DirectiveListResponsesBasePage = BasePage<DirectiveListResponse>;

export interface Directive {
  /**
   * Opaque directive identifier (drv\_...).
   */
  id: string;

  _links: DirectiveLinks;

  bindings: Array<DirectiveBinding>;

  /**
   * Creation Unix timestamp in seconds.
   */
  created_at: number;

  /**
   * Human-readable directive name.
   */
  name: string;

  resources: Array<DirectiveTrackResource | DirectiveShotsResource>;

  /**
   * Mux asset lifecycle subject. Live streams are not supported.
   */
  subject: DirectiveSubject;

  /**
   * Last update Unix timestamp in seconds.
   */
  updated_at: number;
}

export type DirectiveBinding =
  | DirectiveBinding.AnalyzeStructureDirectiveBinding
  | DirectiveBinding.SummarizeDirectiveBinding
  | DirectiveBinding.ModerateDirectiveBinding
  | DirectiveBinding.GenerateChaptersDirectiveBinding
  | DirectiveBinding.GenerateContextualTextDirectiveBinding
  | DirectiveBinding.EditCaptionsDirectiveBinding
  | DirectiveBinding.TranslateCaptionsDirectiveBinding
  | DirectiveBinding.TranslateAudioDirectiveBinding
  | DirectiveBinding.AskQuestionsDirectiveBinding
  | DirectiveBinding.FindKeyMomentsDirectiveBinding
  | DirectiveBinding.GenerateEngagementInsightsDirectiveBinding
  | DirectiveBinding.GeneratePremiumCaptionsDirectiveBinding
  | DirectiveBinding.FindBestThumbnailsDirectiveBinding;

export namespace DirectiveBinding {
  export interface AnalyzeStructureDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/analyze-structure.
     */
    workflow: 'analyze-structure';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for analyze-structure, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    parameters?: AnalyzeStructureDirectiveBinding.Parameters;
  }

  export namespace AnalyzeStructureDirectiveBinding {
    /**
     * Parameters for analyze-structure, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    export interface Parameters {
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

  export interface SummarizeDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/summarize.
     */
    workflow: 'summarize';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for summarize, excluding engine-supplied asset_id and source track_id
     * where applicable.
     */
    parameters?: SummarizeDirectiveBinding.Parameters;
  }

  export namespace SummarizeDirectiveBinding {
    /**
     * Parameters for summarize, excluding engine-supplied asset_id and source track_id
     * where applicable.
     */
    export interface Parameters {
      /**
       * Maximum description length in words.
       */
      description_length?: number;

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
  }

  export interface ModerateDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/moderate.
     */
    workflow: 'moderate';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for moderate, excluding engine-supplied asset_id and source track_id
     * where applicable.
     */
    parameters?: ModerateDirectiveBinding.Parameters;
  }

  export namespace ModerateDirectiveBinding {
    /**
     * Parameters for moderate, excluding engine-supplied asset_id and source track_id
     * where applicable.
     */
    export interface Parameters {
      /**
       * Used only for audio-only transcript analysis; ignored for video assets. BCP 47
       * language code of the caption source. An explicit language must match a ready
       * source exactly, including case; for example, en does not match en-US.
       * Translation target exclusion and track replacement instead compare base
       * languages case-insensitively. When omitted, automatic selection applies. Uses
       * the first ready subtitle in asset track order without English preference.
       * Audio-only assets with one ready text track lacking subtitle metadata can use
       * that legacy transcript.
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
      thresholds?: Parameters.Thresholds;
    }

    export namespace Parameters {
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

  export interface GenerateChaptersDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/generate-chapters.
     */
    workflow: 'generate-chapters';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for generate-chapters, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    parameters?: GenerateChaptersDirectiveBinding.Parameters;
  }

  export namespace GenerateChaptersDirectiveBinding {
    /**
     * Parameters for generate-chapters, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    export interface Parameters {
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
      output_steering?: GenerateChaptersAPI.GenerateChaptersOutputSteering;

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
  }

  export interface GenerateContextualTextDirectiveBinding {
    /**
     * Parameters for generate-contextual-text, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    parameters: GenerateContextualTextDirectiveBinding.Parameters;

    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/generate-contextual-text.
     */
    workflow: 'generate-contextual-text';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;
  }

  export namespace GenerateContextualTextDirectiveBinding {
    /**
     * Parameters for generate-contextual-text, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    export interface Parameters {
      /**
       * The deliverables to create. Every variant produces each artifact. Supports 1-5
       * artifacts with unique keys.
       */
      artifacts: Array<GenerateContextualTextAPI.GenerateContextualTextArtifact>;

      /**
       * Named versions of the complete artifact set. Every variant produces every
       * artifact. Supports 1-5 variants with unique keys.
       */
      variants: Array<GenerateContextualTextAPI.GenerateContextualTextVariant>;

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
       * Curated controls that apply to every generated artifact in every variant. Scope
       * bounds execution; the other fields are best-effort writing guidance. To vary
       * voice or audience between variants, use variant instructions.
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
  }

  export interface EditCaptionsDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/edit-captions.
     */
    workflow: 'edit-captions';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for edit-captions, excluding engine-supplied asset_id and source
     * track_id where applicable. The engine selects the first ready subtitle in asset
     * track order, or the single ready legacy text transcript on an audio-only asset.
     */
    parameters?: EditCaptionsDirectiveBinding.Parameters;
  }

  export namespace EditCaptionsDirectiveBinding {
    /**
     * Parameters for edit-captions, excluding engine-supplied asset_id and source
     * track_id where applicable. The engine selects the first ready subtitle in asset
     * track order, or the single ready legacy text transcript on an audio-only asset.
     */
    export interface Parameters {
      /**
       * Optional LLM-driven profanity detection and censorship rules applied to the
       * selected caption track.
       */
      auto_censor_profanity?: Parameters.AutoCensorProfanity;

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
      replacements?: Array<Parameters.Replacement>;

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
       * Whether to upload the edited VTT back to the Mux asset as a text track. Defaults
       * to true.
       */
      upload_to_mux?: boolean;
    }

    export namespace Parameters {
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

  export interface TranslateCaptionsDirectiveBinding {
    /**
     * Parameters for translate-captions, excluding engine-supplied asset_id and source
     * track_id where applicable. The engine selects the first eligible ready subtitle
     * in asset track order, or the single ready legacy text transcript on an
     * audio-only asset, whose language differs from output_language_code.
     * Target-language comparison ignores case and region subtags, matching the track
     * replacement rules.
     */
    parameters: TranslateCaptionsDirectiveBinding.Parameters;

    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/translate-captions.
     */
    workflow: 'translate-captions';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateCaptionsDirectiveBinding {
    /**
     * Parameters for translate-captions, excluding engine-supplied asset_id and source
     * track_id where applicable. The engine selects the first eligible ready subtitle
     * in asset track order, or the single ready legacy text transcript on an
     * audio-only asset, whose language differs from output_language_code.
     * Target-language comparison ignores case and region subtags, matching the track
     * replacement rules.
     */
    export interface Parameters {
      /**
       * BCP 47 language code for the translated output (e.g. "es", "ja"). Unless
       * replace_existing_tracks allows replacement, the asset must not already have a
       * text track for this language.
       */
      output_language_code: string;

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

  export interface TranslateAudioDirectiveBinding {
    /**
     * Parameters for translate-audio, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    parameters: TranslateAudioDirectiveBinding.Parameters;

    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/translate-audio.
     */
    workflow: 'translate-audio';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;
  }

  export namespace TranslateAudioDirectiveBinding {
    /**
     * Parameters for translate-audio, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    export interface Parameters {
      /**
       * BCP 47 language code for the target translation language (e.g. "es", "fr",
       * "ja").
       */
      output_language_code: string;

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

  export interface AskQuestionsDirectiveBinding {
    /**
     * Parameters for ask-questions, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    parameters: AskQuestionsDirectiveBinding.Parameters;

    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/ask-questions.
     */
    workflow: 'ask-questions';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;
  }

  export namespace AskQuestionsDirectiveBinding {
    /**
     * Parameters for ask-questions, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    export interface Parameters {
      /**
       * One or more questions to ask about the video, up to 50. Each question can either
       * select from answer_options (defaults to yes/no) or, by setting free_form_reply:
       * true, receive a free-form prose answer.
       */
      questions: Array<Parameters.Question>;

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

    export namespace Parameters {
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

  export interface FindKeyMomentsDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/find-key-moments.
     */
    workflow: 'find-key-moments';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for find-key-moments, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    parameters?: FindKeyMomentsDirectiveBinding.Parameters;
  }

  export namespace FindKeyMomentsDirectiveBinding {
    /**
     * Parameters for find-key-moments, excluding engine-supplied asset_id and source
     * track_id where applicable.
     */
    export interface Parameters {
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
       * Preferred highlight duration range in seconds. Best-effort guidance, with
       * millisecond precision.
       */
      target_duration?: FindKeyMomentsAPI.FindKeyMomentsTargetDuration;

      /**
       * Controls whether video assets are analyzed using Mux shots. When true, shots are
       * generated or reused and visual evidence drives selection. When false or omitted,
       * selection uses transcript evidence and the asset must have a caption track. Not
       * supported for audio-only assets.
       */
      use_shots?: boolean;
    }
  }

  export interface GenerateEngagementInsightsDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/generate-engagement-insights.
     */
    workflow: 'generate-engagement-insights';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for generate-engagement-insights, excluding engine-supplied asset_id
     * and source track_id where applicable.
     */
    parameters?: GenerateEngagementInsightsDirectiveBinding.Parameters;
  }

  export namespace GenerateEngagementInsightsDirectiveBinding {
    /**
     * Parameters for generate-engagement-insights, excluding engine-supplied asset_id
     * and source track_id where applicable.
     */
    export interface Parameters {}
  }

  export interface GeneratePremiumCaptionsDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/generate-premium-captions.
     */
    workflow: 'generate-premium-captions';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for generate-premium-captions, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    parameters?: GeneratePremiumCaptionsDirectiveBinding.Parameters;
  }

  export namespace GeneratePremiumCaptionsDirectiveBinding {
    /**
     * Parameters for generate-premium-captions, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    export interface Parameters {
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

  export interface FindBestThumbnailsDirectiveBinding {
    /**
     * Binding identifier, unique within the directive. Producer references point to
     * this identifier.
     */
    reference_id: string;

    /**
     * Workflow identifier used by POST /robots/v1/jobs/find-best-thumbnails.
     */
    workflow: 'find-best-thumbnails';

    /**
     * Resource reference IDs that must become ready before dispatch.
     */
    inputs?: Array<string>;

    /**
     * Parameters for find-best-thumbnails, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    parameters?: FindBestThumbnailsDirectiveBinding.Parameters;
  }

  export namespace FindBestThumbnailsDirectiveBinding {
    /**
     * Parameters for find-best-thumbnails, excluding engine-supplied asset_id and
     * source track_id where applicable.
     */
    export interface Parameters {
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

export interface DirectiveLinks {
  self: DirectiveSelfLink;
}

export interface DirectiveSelfLink {
  /**
   * URL to the directive in its creation API version.
   */
  href: string;
}

export interface DirectiveShotsResource {
  /**
   * Customer-chosen resource identifier, unique within resources. Binding `inputs`
   * entries reference this handle.
   */
  reference_id: string;

  /**
   * The asset's shot-detection output.
   */
  type: 'video.asset.shots';

  /**
   * How the resource is materialized. Defaults to an external source.
   */
  source?:
    | DirectiveShotsResource.DirectiveSourceExternal
    | DirectiveShotsResource.DirectiveSourceRequired
    | DirectiveShotsResource.DirectiveSourceWorkflow
    | DirectiveShotsResource.DirectiveSourceGenerateSubtitles
    | DirectiveShotsResource.DirectiveSourceCreateTrack
    | DirectiveShotsResource.DirectiveSourceGenerateShots;
}

export namespace DirectiveShotsResource {
  /**
   * Wait for an externally produced resource to become ready.
   */
  export interface DirectiveSourceExternal {
    via: 'external';
  }

  /**
   * Require the resource to be ready when the run starts.
   */
  export interface DirectiveSourceRequired {
    via: 'required';
  }

  /**
   * Wait for the declared producer binding and its resource.
   */
  export interface DirectiveSourceWorkflow {
    /**
     * The reference_id of the workflow binding in this directive that produces the
     * resource.
     */
    binding: string;

    via: 'workflow';
  }

  /**
   * Generate subtitles from the asset audio.
   */
  export interface DirectiveSourceGenerateSubtitles {
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    parameters?: DirectiveSourceGenerateSubtitles.Parameters;
  }

  export namespace DirectiveSourceGenerateSubtitles {
    /**
     * Parameters for the generate_subtitles engine action.
     */
    export interface Parameters {
      /**
       * BCP 47 language code for the generated subtitles (e.g. "en"). Defaults to
       * "auto", which detects the language from the audio.
       */
      language_code?: string;

      /**
       * BCP 47 language code of the audio track to transcribe. When omitted, the first
       * audio track on the asset is used.
       */
      source_audio_language_code?: string;
    }
  }

  /**
   * Ingest a text subtitle track or audio track from a URL.
   */
  export interface DirectiveSourceCreateTrack {
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    parameters: DirectiveSourceCreateTrack.Parameters;

    via: 'mux_api';
  }

  export namespace DirectiveSourceCreateTrack {
    /**
     * Parameters for the create_track engine action.
     */
    export interface Parameters {
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
   * Generate the asset shot-detection output.
   */
  export interface DirectiveSourceGenerateShots {
    action: 'generate_shots';

    via: 'mux_api';

    /**
     * Parameters for the generate_shots engine action.
     */
    parameters?: DirectiveSourceGenerateShots.Parameters;
  }

  export namespace DirectiveSourceGenerateShots {
    /**
     * Parameters for the generate_shots engine action.
     */
    export interface Parameters {
      /**
       * How shot images are derived. Defaults to "create_storyboards".
       */
      image_source?: 'create_storyboards' | 'use_shot_midpoint';
    }
  }
}

/**
 * Mux asset lifecycle subject. Live streams are not supported.
 */
export interface DirectiveSubject {
  type: 'video.asset';
}

export interface DirectiveTrackResource {
  /**
   * Match subtitle text tracks or audio tracks. Other text track types are not
   * eligible.
   */
  kind: 'subtitles' | 'audio';

  /**
   * Customer-chosen resource identifier, unique within resources. Binding `inputs`
   * entries reference this handle.
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
  language_code?: string;

  /**
   * How the resource is materialized. Defaults to an external source.
   */
  source?:
    | DirectiveTrackResource.DirectiveSourceExternal
    | DirectiveTrackResource.DirectiveSourceRequired
    | DirectiveTrackResource.DirectiveSourceWorkflow
    | DirectiveTrackResource.DirectiveSourceGenerateSubtitles
    | DirectiveTrackResource.DirectiveSourceCreateTrack
    | DirectiveTrackResource.DirectiveSourceGenerateShots;
}

export namespace DirectiveTrackResource {
  /**
   * Wait for an externally produced resource to become ready.
   */
  export interface DirectiveSourceExternal {
    via: 'external';
  }

  /**
   * Require the resource to be ready when the run starts.
   */
  export interface DirectiveSourceRequired {
    via: 'required';
  }

  /**
   * Wait for the declared producer binding and its resource.
   */
  export interface DirectiveSourceWorkflow {
    /**
     * The reference_id of the workflow binding in this directive that produces the
     * resource.
     */
    binding: string;

    via: 'workflow';
  }

  /**
   * Generate subtitles from the asset audio.
   */
  export interface DirectiveSourceGenerateSubtitles {
    action: 'generate_subtitles';

    via: 'mux_api';

    /**
     * Parameters for the generate_subtitles engine action.
     */
    parameters?: DirectiveSourceGenerateSubtitles.Parameters;
  }

  export namespace DirectiveSourceGenerateSubtitles {
    /**
     * Parameters for the generate_subtitles engine action.
     */
    export interface Parameters {
      /**
       * BCP 47 language code for the generated subtitles (e.g. "en"). Defaults to
       * "auto", which detects the language from the audio.
       */
      language_code?: string;

      /**
       * BCP 47 language code of the audio track to transcribe. When omitted, the first
       * audio track on the asset is used.
       */
      source_audio_language_code?: string;
    }
  }

  /**
   * Ingest a text subtitle track or audio track from a URL.
   */
  export interface DirectiveSourceCreateTrack {
    action: 'create_track';

    /**
     * Parameters for the create_track engine action.
     */
    parameters: DirectiveSourceCreateTrack.Parameters;

    via: 'mux_api';
  }

  export namespace DirectiveSourceCreateTrack {
    /**
     * Parameters for the create_track engine action.
     */
    export interface Parameters {
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
   * Generate the asset shot-detection output.
   */
  export interface DirectiveSourceGenerateShots {
    action: 'generate_shots';

    via: 'mux_api';

    /**
     * Parameters for the generate_shots engine action.
     */
    parameters?: DirectiveSourceGenerateShots.Parameters;
  }

  export namespace DirectiveSourceGenerateShots {
    /**
     * Parameters for the generate_shots engine action.
     */
    export interface Parameters {
      /**
       * How shot images are derived. Defaults to "create_storyboards".
       */
      image_source?: 'create_storyboards' | 'use_shot_midpoint';
    }
  }
}

/**
 * Directive summary. Follow the self link to retrieve its configuration through
 * its creation API version.
 */
export interface DirectiveListResponse {
  /**
   * Opaque directive identifier (drv\_...).
   */
  id: string;

  _links: DirectiveLinks;

  /**
   * Creation Unix timestamp in seconds.
   */
  created_at: number;

  /**
   * Human-readable directive name.
   */
  name: string;

  /**
   * Last update Unix timestamp in seconds.
   */
  updated_at: number;
}

export interface DirectiveCreateParams {
  bindings: Array<DirectiveBinding>;

  /**
   * Human-readable directive name.
   */
  name: string;

  /**
   * Mux asset lifecycle subject. Live streams are not supported.
   */
  subject: DirectiveSubject;

  /**
   * Resources required by dependent workflow bindings.
   */
  resources?: Array<DirectiveTrackResource | DirectiveShotsResource>;
}

export interface DirectiveListParams extends BasePageParams {}

Directives.Runs = Runs;

export declare namespace Directives {
  export {
    type Directive as Directive,
    type DirectiveBinding as DirectiveBinding,
    type DirectiveLinks as DirectiveLinks,
    type DirectiveSelfLink as DirectiveSelfLink,
    type DirectiveShotsResource as DirectiveShotsResource,
    type DirectiveSubject as DirectiveSubject,
    type DirectiveTrackResource as DirectiveTrackResource,
    type DirectiveListResponse as DirectiveListResponse,
    type DirectiveListResponsesBasePage as DirectiveListResponsesBasePage,
    type DirectiveCreateParams as DirectiveCreateParams,
    type DirectiveListParams as DirectiveListParams,
  };

  export {
    Runs as Runs,
    type DirectiveNodeState as DirectiveNodeState,
    type DirectiveRun as DirectiveRun,
    type DirectiveRunsBasePage as DirectiveRunsBasePage,
    type RunCreateParams as RunCreateParams,
    type RunListParams as RunListParams,
  };
}
