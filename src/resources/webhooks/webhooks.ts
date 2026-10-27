// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { buildHeaders, HeadersLike } from '../../internal/headers';

/** The raw request body as a string or bytes (`Buffer`, `Uint8Array`, `ArrayBuffer`). */
export type WebhookBody = string | Uint8Array | ArrayBuffer;

export class Webhooks extends APIResource {
  async unwrap(
    body: WebhookBody,
    headers: HeadersLike,
    secret: string | undefined | null = this._client.webhookSecret,
  ): Promise<UnwrapWebhookEvent> {
    const payload = this.bodyToString(body);
    await this.verifySignature(payload, headers, secret);
    return JSON.parse(payload) as UnwrapWebhookEvent;
  }

  private bodyToString(body: WebhookBody): string {
    if (typeof body === 'string') {
      return body;
    }
    if (body instanceof Uint8Array) {
      return new TextDecoder().decode(body);
    }
    if (body instanceof ArrayBuffer) {
      return new TextDecoder().decode(new Uint8Array(body));
    }
    throw new Error('Webhook body must be the raw request body (string or bytes), not parsed JSON.');
  }

  private getHeader(headers: HeadersLike, name: string): string | null {
    return buildHeaders([headers]).values.get(name) ?? null;
  }

  private parseHeader(header: string, scheme: string) {
    if (typeof header !== 'string') {
      return null;
    }

    return header.split(',').reduce(
      (accum, item) => {
        const kv: string[] = item.split('=');

        if (kv[0] === 't') {
          accum.timestamp = parseInt(kv[1]!, 10);
        }

        if (kv[0] === scheme && typeof kv[1] === 'string') {
          accum.signatures.push(kv[1]);
        }

        return accum;
      },
      {
        timestamp: -1,
        signatures: [] as string[],
      },
    );
  }

  /** Make an assertion, if not `true`, then throw. */
  private assert(expr: unknown, msg = ''): asserts expr {
    if (!expr) {
      throw new Error(msg);
    }
  }

  private async computeSignature(payload: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const raw = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(payload));
    return Array.from(new Uint8Array(raw))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /** Compare to array buffers or data views in a way that timing based attacks
   * cannot gain information about the platform. */
  private timingSafeEqual(
    a: ArrayBufferView | ArrayBufferLike | DataView,
    b: ArrayBufferView | ArrayBufferLike | DataView,
  ): boolean {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    if (!(a instanceof DataView)) {
      a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
    }
    if (!(b instanceof DataView)) {
      b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
    }
    this.assert(a instanceof DataView);
    this.assert(b instanceof DataView);
    const length = a.byteLength;
    let out = 0;
    let i = -1;
    while (++i < length) {
      out |= a.getUint8(i) ^ b.getUint8(i);
    }
    return out === 0;
  }

  /**
   * Validates whether or not the webhook payload was sent by Mux.
   *
   * If it was not sent by Mux then an error will be raised.
   */
  async verifySignature(
    body: WebhookBody,
    headers: HeadersLike,
    secret: string | undefined | null = this._client.webhookSecret,
  ): Promise<void> {
    if (!secret) {
      throw new Error(
        "The webhook secret must either be set using the env var, MUX_WEBHOOK_SECRET, on the client class, Mux({ webhookSecret: '123' }), or passed to this function",
      );
    }

    const header = this.getHeader(headers, 'mux-signature');
    if (!header) {
      throw new Error('Could not find a mux-signature header');
    }

    const payload = this.bodyToString(body);

    const details = this.parseHeader(header, 'v1');
    if (!details || details.timestamp === -1) {
      throw new Error('Unable to extract timestamp and signatures from header');
    }

    if (!details.signatures.length) {
      throw new Error('No v1 signatures found');
    }

    const expectedSignature = await this.computeSignature(`${details.timestamp}.${payload}`, secret);

    const encoder = new TextEncoder();
    const signatureFound = !!details.signatures.filter((sig) =>
      this.timingSafeEqual(encoder.encode(sig), encoder.encode(expectedSignature)),
    ).length;

    if (!signatureFound) {
      throw new Error('No signatures found matching the expected signature for payload.');
    }

    const timestampAge = Math.floor(Date.now() / 1000) - details.timestamp;

    const tolerance = 300; // 5 minutes
    if (timestampAge > tolerance) {
      throw new Error('Webhook timestamp is too old');
    }
  }
}

export interface BaseWebhookEvent {
  /**
   * Unique identifier for the event
   */
  id: string;

  /**
   * Attempts for sending out the webhook event
   */
  attempts: Array<BaseWebhookEvent.Attempt>;

  /**
   * Time the event was created
   */
  created_at: string;

  data: { [key: string]: unknown };

  environment: BaseWebhookEvent.Environment;

  object: BaseWebhookEvent.Object;

  /**
   * Type for the webhook event
   */
  type: string;
}

export namespace BaseWebhookEvent {
  export interface Attempt {
    /**
     * Unique identifier for the webhook attempt
     */
    id?: string;

    /**
     * URL address for the webhook attempt
     */
    address?: string;

    /**
     * Time the webhook request was attempted
     */
    created_at?: string;

    /**
     * Max attempts number for the webhook attempt
     */
    max_attempts?: number;

    /**
     * HTTP response body for the webhook attempt
     */
    response_body?: string | null;

    /**
     * HTTP response headers for the webhook attempt
     */
    response_headers?: { [key: string]: string };

    /**
     * HTTP response status code for the webhook attempt
     */
    response_status_code?: number;

    /**
     * Unique identifier for the webhook
     */
    webhook_id?: number;
  }

  export interface Environment {
    /**
     * Unique identifier for the environment
     */
    id: string;

    /**
     * Name for the environment
     */
    name: string;
  }

  export interface Object {
    id: string;

    type: string;
  }
}

/**
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookAnalyzeStructureJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookAnalyzeStructureJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookAnalyzeStructureJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookAnalyzeStructureJob.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookAnalyzeStructureJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookAnalyzeStructureJob.Resources;
}

export namespace WebhookAnalyzeStructureJob {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;

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

  export namespace Parameters {
    /**
     * Curated controls that restrict Analyze Structure execution or guide its
     * generated metadata without exposing raw prompt editing. The scope start is
     * inclusive, the end is exclusive, and returned timestamps remain absolute.
     */
    export interface OutputSteering {
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
      scope?: OutputSteering.Scope;

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      topic_taxonomy?: OutputSteering.TopicTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      export interface TopicTaxonomy {
        /**
         * When false, the model should prefer values from the taxonomy. When true,
         * non-taxonomy values may be used when no taxonomy value applies.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values used as best-effort model guidance.
         */
        values: Array<TopicTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy.
         */
        name?: string;
      }

      export namespace TopicTaxonomy {
        export interface Value {
          /**
           * Canonical taxonomy value to prefer when supported by the source content.
           */
          label: string;

          /**
           * Accepted alternate names that should normalize to the canonical label.
           */
          aliases?: Array<string>;

          /**
           * Short explanation of when this value applies.
           */
          description?: string;
        }
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Generated chapters in timeline order. Always present and empty below the chapter
     * threshold.
     */
    chapters: Array<Outputs.Chapter>;

    /**
     * Generated key moments in timeline order. Always present and empty when no moment
     * qualifies.
     */
    key_moments: Array<Outputs.KeyMoment>;

    /**
     * Generated scenes in timeline order. Always present and empty for audio-only
     * media.
     */
    scenes: Array<Outputs.Scene>;

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
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookAnalyzeStructureJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookAnalyzeStructureJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookAnalyzeStructureJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookAnalyzeStructureJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookAnalyzeStructureJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookAnalyzeStructureJobV0.Resources;
}

export namespace WebhookAnalyzeStructureJobV0 {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;

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

  export namespace Parameters {
    /**
     * Curated controls that restrict Analyze Structure execution or guide its
     * generated metadata without exposing raw prompt editing. The scope start is
     * inclusive, the end is exclusive, and returned timestamps remain absolute.
     */
    export interface OutputSteering {
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
      scope?: OutputSteering.Scope;

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      topic_taxonomy?: OutputSteering.TopicTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      export interface TopicTaxonomy {
        /**
         * When false, the model should prefer values from the taxonomy. When true,
         * non-taxonomy values may be used when no taxonomy value applies.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values used as best-effort model guidance.
         */
        values: Array<TopicTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy.
         */
        name?: string;
      }

      export namespace TopicTaxonomy {
        export interface Value {
          /**
           * Canonical taxonomy value to prefer when supported by the source content.
           */
          label: string;

          /**
           * Accepted alternate names that should normalize to the canonical label.
           */
          aliases?: Array<string>;

          /**
           * Short explanation of when this value applies.
           */
          description?: string;
        }
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Generated chapters in timeline order. Always present and empty below the chapter
     * threshold.
     */
    chapters: Array<Outputs.Chapter>;

    /**
     * Generated key moments in timeline order. Always present and empty when no moment
     * qualifies.
     */
    key_moments: Array<Outputs.KeyMoment>;

    /**
     * Generated scenes in timeline order. Always present and empty for audio-only
     * media.
     */
    scenes: Array<Outputs.Scene>;

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
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookAskQuestionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookAskQuestionsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'ask-questions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookAskQuestionsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookAskQuestionsJob.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookAskQuestionsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookAskQuestionsJob.Resources;
}

export namespace WebhookAskQuestionsJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to analyze.
     */
    asset_id: string;

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
    output_steering?: Parameters.OutputSteering;
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

    /**
     * Curated controls that optionally restrict question answering to an asset time
     * range.
     */
    export interface OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * One answer per question, in the same order as the input questions.
     */
    answers: Array<Outputs.Answer>;
  }

  export namespace Outputs {
    export interface Answer {
      /**
       * For enum questions, constrained to one of the provided answer_options. For
       * free-form questions, responds with prose up to max_free_form_answer_length
       * characters - treat as untrusted model output. Null when the question was
       * skipped.
       */
      answer: string | null;

      /**
       * Confidence score from 0.0 to 1.0. Values above 0.9 indicate clear, unambiguous
       * evidence; 0.7-0.9 strong evidence with minor ambiguity; 0.5-0.7 moderate
       * evidence; below 0.5 weak or uncertain evidence. Always 0 when skipped.
       */
      confidence: number;

      /**
       * The original question that was asked.
       */
      question: string;

      /**
       * Explanation citing specific visual or audio evidence from the video, or why the
       * question was skipped.
       */
      reasoning: string;

      /**
       * Whether the question was skipped due to irrelevance to the video content.
       */
      skipped: boolean;
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookAskQuestionsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookAskQuestionsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'ask-questions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookAskQuestionsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookAskQuestionsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookAskQuestionsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookAskQuestionsJobV0.Resources;
}

export namespace WebhookAskQuestionsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to analyze.
     */
    asset_id: string;

    /**
     * One or more questions to ask about the video, up to 50. Each question can either
     * select from answer_options (defaults to yes/no) or, by setting free_form_reply:
     * true, receive a free-form prose answer.
     */
    questions: Array<Parameters.Question>;

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
    output_steering?: Parameters.OutputSteering;
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

    /**
     * Curated controls that optionally restrict question answering to an asset time
     * range.
     */
    export interface OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * One answer per question, in the same order as the input questions.
     */
    answers: Array<Outputs.Answer>;
  }

  export namespace Outputs {
    export interface Answer {
      /**
       * For enum questions, constrained to one of the provided answer_options. For
       * free-form questions, responds with prose up to max_free_form_answer_length
       * characters - treat as untrusted model output. Null when the question was
       * skipped.
       */
      answer: string | null;

      /**
       * Confidence score from 0.0 to 1.0. Values above 0.9 indicate clear, unambiguous
       * evidence; 0.7-0.9 strong evidence with minor ambiguity; 0.5-0.7 moderate
       * evidence; below 0.5 weak or uncertain evidence. Always 0 when skipped.
       */
      confidence: number;

      /**
       * The original question that was asked.
       */
      question: string;

      /**
       * Explanation citing specific visual or audio evidence from the video, or why the
       * question was skipped.
       */
      reasoning: string;

      /**
       * Whether the question was skipped due to irrelevance to the video content.
       */
      skipped: boolean;
    }
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

export interface WebhookAsset {
  /**
   * Unique identifier for the Asset. Max 255 characters.
   */
  id: string;

  created_at: number;

  /**
   * @deprecated Use `video_quality` instead.
   */
  encoding_tier: 'smart' | 'baseline' | 'premium';

  master_access: 'temporary' | 'none';

  /**
   * Max resolution tier can be used to control the maximum `resolution_tier` your
   * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
   */
  max_resolution_tier: '1080p' | '1440p' | '2160p';

  /**
   * Detailed state information about the asset ingest process.
   */
  progress: WebhookAsset.Progress;

  /**
   * The status of the asset.
   */
  status: 'preparing' | 'ready' | 'errored';

  /**
   * The aspect ratio of the asset in the form of `width:height`, for example `16:9`.
   */
  aspect_ratio?: string;

  /**
   * The Mux Robots directives applied to the asset.
   */
  directives?: Array<WebhookAsset.Directive>;

  /**
   * The duration of the asset in seconds (max duration for a single asset is 12
   * hours).
   */
  duration?: number;

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  errors?: WebhookAsset.Errors;

  /**
   * Whether to perform shot detection on this asset. Shots are only generated for
   * video assets and will not be generated for audio-only assets.
   */
  generate_shots?: boolean;

  /**
   * The type of ingest used to create the asset.
   */
  ingest_type?: 'on_demand_url' | 'on_demand_direct_upload' | 'on_demand_clip' | 'live_rtmp' | 'live_srt';

  /**
   * Indicates whether the live stream that created this asset is currently `active`
   * and not in `idle` state. This is an optional parameter added when the asset is
   * created from a live stream.
   */
  is_live?: boolean;

  /**
   * Unique identifier for the live stream. This is an optional parameter added when
   * the asset is created from a live stream.
   */
  live_stream_id?: string;

  /**
   * An object containing the current status of Master Access and the link to the
   * Master MP4 file when ready. This object does not exist if `master_access` is set
   * to `none` and when the temporary URL expires.
   */
  master?: WebhookAsset.Master;

  /**
   * The maximum frame rate that has been stored for the asset. The asset may be
   * delivered at lower frame rates depending on the device and bandwidth, however it
   * cannot be delivered at a higher value than is stored. This field may return -1
   * if the frame rate of the input cannot be reliably determined.
   */
  max_stored_frame_rate?: number;

  /**
   * @deprecated Use `resolution_tier` instead.
   */
  max_stored_resolution?: 'Audio only' | 'SD' | 'HD' | 'FHD' | 'UHD';

  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: WebhookAsset.Meta;

  /**
   * @deprecated Use the Static Renditions API
   * (https://www.mux.com/docs/guides/enable-static-mp4-renditions) instead. This
   * field remains available only to support migration from `mp4_support` to static
   * renditions.
   */
  mp4_support?: 'standard' | 'none' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

  /**
   * An object containing one or more reasons the input file is non-standard. See
   * [the guide on minimizing processing time](https://docs.mux.com/guides/minimize-processing-time)
   * for more information on what a standard input is defined as. This object only
   * exists on on-demand assets that have non-standard inputs, so if missing you can
   * assume the input qualifies as standard.
   */
  non_standard_input_reasons?: WebhookAsset.NonStandardInputReasons;

  /**
   * Normalize the audio track loudness level. This parameter is only applicable to
   * on-demand (not live) assets.
   */
  normalize_audio?: boolean;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id` , you can use the `meta` object instead. **Max:
   * 255 characters**.
   */
  passthrough?: string;

  /**
   * An array of Playback ID objects. Use these to create HLS playback URLs. See
   * [Play your videos](https://docs.mux.com/guides/play-your-videos) for more
   * details.
   */
  playback_ids?: Array<WebhookAsset.PlaybackIds>;

  /**
   * An array of individual live stream recording sessions. A recording session is
   * created on each encoder connection during the live stream. Additionally any time
   * slate media is inserted during brief interruptions in the live stream media or
   * times when the live streaming software disconnects, a recording session
   * representing the slate media will be added with a "slate" type.
   */
  recording_times?: Array<WebhookAsset.RecordingTime>;

  /**
   * The resolution tier that the asset was ingested at, affecting billing for ingest
   * & storage. This field also represents the highest resolution tier that the
   * content can be delivered at, however the actual resolution may be lower
   * depending on the device, bandwidth, and exact resolution of the uploaded asset.
   */
  resolution_tier?: 'audio-only' | '720p' | '1080p' | '1440p' | '2160p';

  /**
   * The results of generating shots on the video
   */
  shots?: WebhookAsset.Shots;

  /**
   * Asset Identifier of the video used as the source for creating the clip.
   */
  source_asset_id?: string;

  /**
   * An object containing the current status of any static renditions (MP4s) for this
   * asset. The object does not exist if no static renditions have been requested.
   * See
   * [Download your videos](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   *
   * This object is populated by both the
   * [Static Renditions API](https://www.mux.com/docs/guides/enable-static-mp4-renditions)
   * and the deprecated `mp4_support` option, and the two report status differently:
   *
   * - Renditions created with the Static Renditions API each carry their own `id`,
   *   `status`, `type`, `resolution`, and `resolution_tier` in `files`. Track
   *   progress per rendition using `files[].status`.
   * - Renditions created with the deprecated `mp4_support` option share a single
   *   aggregate `status` on this object, and their `files` entries do not include
   *   the per-rendition fields above.
   */
  static_renditions?: WebhookAsset.StaticRenditions;

  /**
   * True means this live stream is a test asset. A test asset can help evaluate the
   * Mux Video APIs without incurring any cost. There is no limit on number of test
   * assets created. Test assets are watermarked with the Mux logo, limited to 10
   * seconds, and deleted after 24 hrs.
   */
  test?: boolean;

  /**
   * The media time within the asset used when a thumbnail without an explicit time
   * is requested.
   */
  thumbnail_time?: number;

  /**
   * The individual media tracks that make up an asset.
   */
  tracks?: Array<WebhookAssetEmbeddedTrack>;

  /**
   * Unique identifier for the Direct Upload. This is an optional parameter added
   * when the asset is created from a direct upload.
   */
  upload_id?: string;

  /**
   * The video quality controls the cost, quality, and available platform features
   * for the asset. The default video quality for an account can be set in the Mux
   * Dashboard. This field replaces the deprecated `encoding_tier` value.
   * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
   */
  video_quality?: 'basic' | 'plus' | 'premium';
}

export namespace WebhookAsset {
  /**
   * Detailed state information about the asset ingest process.
   */
  export interface Progress {
    /**
     * Represents the estimated completion percentage. Returns `0 - 100` when in
     * `ingesting`, `transcoding`, or `completed` state, and `-1` when in `live` or
     * `errored` state.
     */
    progress: number;

    /**
     * The detailed state of the asset ingest process. This field is useful for
     * relaying more granular processing information to end users when a
     * [non-standard input is encountered](https://www.mux.com/docs/guides/minimize-processing-time#non-standard-input).
     *
     * - `ingesting`: Asset is being ingested (initial processing before or after
     *   transcoding). While in this state, the `progress` percentage will be 0.
     * - `transcoding`: Asset is undergoing non-standard transcoding.
     * - `completed`: Asset processing is complete (`status` is `ready`). While in this
     *   state, the `progress` percentage will be 100.
     * - `live`: Asset is a live stream currently in progress. While in this state, the
     *   `progress` percentage will be -1.
     * - `errored`: Asset has encountered an error (`status` is `errored`). While in
     *   this state, the `progress` percentage will be -1.
     */
    state: 'ingesting' | 'transcoding' | 'completed' | 'live' | 'errored';
  }

  /**
   * A Mux Robots directive to apply to the asset.
   */
  export interface Directive {
    /**
     * The Mux Robots directive identifier.
     */
    id: string;
  }

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  export interface Errors {
    /**
     * Error messages with more details.
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred for this asset.
     */
    type?: string;
  }

  /**
   * An object containing the current status of Master Access and the link to the
   * Master MP4 file when ready. This object does not exist if `master_access` is set
   * to `none` and when the temporary URL expires.
   */
  export interface Master {
    status?: 'ready' | 'preparing' | 'errored';

    /**
     * The temporary URL to the master version of the video, as an MP4 file. This URL
     * will expire after 24 hours.
     */
    url?: string;
  }

  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  export interface Meta {
    /**
     * This is an identifier you provide to keep track of the creator of the asset. Max
     * 128 code points.
     */
    creator_id?: string;

    /**
     * This is an identifier you provide to link the asset to your own data. Max 128
     * code points.
     */
    external_id?: string;

    /**
     * The asset title. Max 512 code points.
     */
    title?: string;
  }

  /**
   * An object containing one or more reasons the input file is non-standard. See
   * [the guide on minimizing processing time](https://docs.mux.com/guides/minimize-processing-time)
   * for more information on what a standard input is defined as. This object only
   * exists on on-demand assets that have non-standard inputs, so if missing you can
   * assume the input qualifies as standard.
   */
  export interface NonStandardInputReasons {
    /**
     * The audio codec used on the input file. Non-AAC audio codecs are non-standard.
     */
    audio_codec?: string;

    /**
     * Audio Edit List reason indicates that the input file's audio track contains a
     * complex Edit Decision List.
     */
    audio_edit_list?: 'non-standard';

    /**
     * The video pixel aspect ratio of the input file.
     */
    pixel_aspect_ratio?: string;

    /**
     * A catch-all reason when the input file in created with non-standard encoding
     * parameters.
     */
    unexpected_media_file_parameters?: 'non-standard';

    unexpected_video_parameters?: string;

    /**
     * The video pixel format, as a string, returned by libav. Considered non-standard
     * if not one of yuv420p or yuvj420p. HEVC inputs additionally permit yuv420p10le.
     */
    unsupported_pixel_format?: string;

    /**
     * The video bitrate of the input file is `high`. This parameter is present when
     * the average bitrate of any key frame interval (also known as Group of Pictures
     * or GOP) is higher than what's considered standard which typically is 16 Mbps.
     */
    video_bitrate?: 'high';

    /**
     * The video codec used on the input file. For example, the input file encoded with
     * `av1` video codec is non-standard and the value of this parameter is `av1`.
     */
    video_codec?: string;

    /**
     * Video Edit List reason indicates that the input file's video track contains a
     * complex Edit Decision List.
     */
    video_edit_list?: 'non-standard';

    /**
     * The video frame rate of the input file. Video with average frames per second
     * (fps) less than 5 or greater than 120 is non-standard. A `-1` frame rate value
     * indicates Mux could not determine the frame rate of the video track.
     */
    video_frame_rate?: string;

    /**
     * The video key frame Interval (also called as Group of Picture or GOP) of the
     * input file is `high`. This parameter is present when the gop is greater than 20
     * seconds.
     */
    video_gop_size?: 'high';

    /**
     * The video resolution of the input file. Video resolution higher than 2048 pixels
     * on any one dimension (height or width) is considered non-standard, The
     * resolution value is presented as `width` x `height` in pixels.
     */
    video_resolution?: string;
  }

  export interface PlaybackIds {
    /**
     * Unique identifier for the PlaybackID
     */
    id: string;

    /**
     * - `public` playback IDs are accessible by constructing an HLS URL like
     *   `https://stream.mux.com/${PLAYBACK_ID}`
     *
     * - `signed` playback IDs should be used with tokens
     *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
     *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
     *   details about creating tokens.
     *
     * - `drm` playback IDs are protected with DRM technologies.
     *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
     */
    policy: 'public' | 'signed' | 'drm';

    /**
     * The DRM configuration used by this playback ID. Must only be set when `policy`
     * is set to `drm`.
     */
    drm_configuration_id?: string;
  }

  export interface RecordingTime {
    /**
     * The duration of the live stream recorded. The time value is in seconds.
     */
    duration?: number;

    started_at?: RecordingTime.StartedAt;

    /**
     * The type of media represented by the recording session, either `content` for
     * normal stream content or `slate` for slate media inserted during stream
     * interruptions.
     */
    type?: 'content' | 'slate';
  }

  export namespace RecordingTime {
    export interface StartedAt {
      seconds: number;

      nanos?: number;
    }
  }

  /**
   * The results of generating shots on the video
   */
  export interface Shots {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Shots.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Shots {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }

  /**
   * An object containing the current status of any static renditions (MP4s) for this
   * asset. The object does not exist if no static renditions have been requested.
   * See
   * [Download your videos](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   *
   * This object is populated by both the
   * [Static Renditions API](https://www.mux.com/docs/guides/enable-static-mp4-renditions)
   * and the deprecated `mp4_support` option, and the two report status differently:
   *
   * - Renditions created with the Static Renditions API each carry their own `id`,
   *   `status`, `type`, `resolution`, and `resolution_tier` in `files`. Track
   *   progress per rendition using `files[].status`.
   * - Renditions created with the deprecated `mp4_support` option share a single
   *   aggregate `status` on this object, and their `files` entries do not include
   *   the per-rendition fields above.
   */
  export interface StaticRenditions {
    /**
     * Array of file objects.
     */
    files?: Array<StaticRenditions.File>;

    /**
     * Indicates the aggregate status of MP4 renditions created with the deprecated
     * `mp4_support` option. This field is only meaningful when `mp4_support` is
     * enabled on the asset. For renditions created with the Static Renditions API, use
     * the per-rendition `files[].status` field instead.
     */
    status?: 'ready' | 'preparing' | 'disabled' | 'errored';
  }

  export namespace StaticRenditions {
    export interface File {
      /**
       * The ID of this static rendition, used in managing this static rendition. Only
       * present for static renditions created with the Static Renditions API. Not set
       * for renditions created with the deprecated `mp4_support` option.
       */
      id?: string;

      /**
       * The bitrate in bits per second
       */
      bitrate?: number;

      /**
       * Extension of the static rendition file
       */
      ext?: 'mp4' | 'm4a';

      /**
       * The file size in bytes
       */
      filesize?: number;

      /**
       * The height of the static rendition's file in pixels
       */
      height?: number;

      /**
       * Name of the static rendition file
       */
      name?:
        | 'low.mp4'
        | 'medium.mp4'
        | 'high.mp4'
        | 'highest.mp4'
        | 'audio.m4a'
        | 'capped-1080p.mp4'
        | '2160p.mp4'
        | '1440p.mp4'
        | '1080p.mp4'
        | '720p.mp4'
        | '540p.mp4'
        | '480p.mp4'
        | '360p.mp4'
        | '270p.mp4';

      /**
       * Arbitrary user-supplied metadata set for the static rendition. Max 255
       * characters.
       */
      passthrough?: string;

      /**
       * Indicates the resolution of this specific MP4 version of this asset. Only
       * present for static renditions created with the Static Renditions API. Not set
       * for renditions created with the deprecated `mp4_support` option.
       */
      resolution?:
        | 'highest'
        | 'audio-only'
        | '2160p'
        | '1440p'
        | '1080p'
        | '720p'
        | '540p'
        | '480p'
        | '360p'
        | '270p';

      /**
       * Indicates the resolution tier of this specific MP4 version of this asset. Only
       * present for static renditions created with the Static Renditions API. Not set
       * for renditions created with the deprecated `mp4_support` option.
       */
      resolution_tier?: '2160p' | '1440p' | '1080p' | '720p' | 'audio-only';

      /**
       * Indicates the status of this specific MP4 version of this asset. Only present
       * for static renditions created with the Static Renditions API. Not set for
       * renditions created with the deprecated `mp4_support` option. For `mp4_support`
       * renditions, see the top-level `static_renditions.status` field on the asset
       * instead.
       *
       * - `ready` indicates the MP4 has been generated and is ready for download
       * - `preparing` indicates the asset has not been ingested or the static rendition
       *   is still being generated after an asset is ready
       * - `skipped` indicates the static rendition will not be generated because the
       *   requested resolution conflicts with the asset attributes after the asset has
       *   been ingested
       * - `errored` indicates the static rendition cannot be generated. For example, an
       *   asset could not be ingested
       */
      status?: 'ready' | 'preparing' | 'skipped' | 'errored';

      /**
       * Indicates the static rendition type of this specific MP4 version of this asset.
       * Only present for static renditions created with the Static Renditions API. Not
       * set for renditions created with the deprecated `mp4_support` option.
       */
      type?: 'standard' | 'advanced';

      /**
       * The width of the static rendition's file in pixels
       */
      width?: number;
    }
  }
}

export interface WebhookAssetEmbeddedTrack {
  /**
   * Unique identifier for the Track
   */
  id?: string;

  /**
   * The confidence value (0-1) of the determined language. This value only is
   * available when automatic language detection is utilized in generated subtitles.
   */
  auto_language_confidence?: number;

  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   * This parameter is only set tracks where `type` is `text` and `text_type` is
   * `subtitles`.
   */
  closed_captions?: boolean;

  /**
   * The duration in seconds of the track media. This parameter is not set for `text`
   * type tracks. This field is optional and may not be set. The top level `duration`
   * field of an asset will always be set.
   */
  duration?: number;

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  error?: WebhookAssetEmbeddedTrack.Error;

  /**
   * The language code value represents [BCP 47](https://tools.ietf.org/html/bcp47)
   * specification compliant value, or 'auto'. For example, `en` for English or
   * `en-US` for the US version of English. This parameter is only set for `text` and
   * `audio` track types. During automatic language detection for generated
   * subtitles, this value will be set to `auto` until the language is determined.
   */
  language_code?: string;

  /**
   * The maximum number of audio channels the track supports. Only set for the
   * `audio` type track.
   */
  max_channels?: number;

  /**
   * The maximum frame rate available for the track. Only set for the `video` type
   * track. This field may return `-1` if the frame rate of the input cannot be
   * reliably determined.
   */
  max_frame_rate?: number;

  /**
   * The maximum height in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_height?: number;

  /**
   * The maximum width in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_width?: number;

  /**
   * The name of the track containing a human-readable description. The HLS manifest
   * will associate a subtitle `text` or `audio` track with this value. For example,
   * the value should be "English" for a subtitle text track for the `language_code`
   * value of `en-US`. This parameter is only set for `text` and `audio` track types.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the track either when creating the
   * asset or track. This parameter is only set for `text` type tracks. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * For an audio track, indicates that this is the primary audio track, ingested
   * from the main input for this asset. The primary audio track cannot be deleted.
   */
  primary?: boolean;

  /**
   * The status of the track.
   */
  status?: 'preparing' | 'ready' | 'errored' | 'deleted';

  /**
   * The source of the text contained in a Track of type `text`. Valid `text_source`
   * values are listed below.
   *
   * - `uploaded`: Tracks uploaded to Mux as caption or subtitle files using the
   *   Create Asset Track API.
   * - `embedded`: Tracks extracted from an embedded stream of CEA-608 closed
   *   captions.
   * - `generated_vod`: Tracks generated by automatic speech recognition on an
   *   on-demand asset.
   * - `generated_live`: Tracks generated by automatic speech recognition on a live
   *   stream configured with `generated_subtitles`. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   * - `generated_live_final`: Tracks generated by automatic speech recognition on a
   *   live stream using `generated_subtitles`. The accuracy, timing, and formatting
   *   of these subtitles is improved compared to the corresponding `generated_live`
   *   tracks. However, `generated_live_final` tracks will not be available in
   *   `ready` status until the live stream ends. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   */
  text_source?: 'uploaded' | 'embedded' | 'generated_live' | 'generated_live_final' | 'generated_vod';

  /**
   * This parameter is only set for `text` type tracks.
   */
  text_type?: 'subtitles' | 'chapters';

  /**
   * The type of track
   */
  type?: 'video' | 'audio' | 'text';
}

export namespace WebhookAssetEmbeddedTrack {
  /**
   * Object that describes any errors that happened when processing this asset.
   */
  export interface Error {
    /**
     * Error messages with more details.
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred for this asset.
     */
    type?: string;
  }
}

export interface WebhookAssetStaticRendition {
  /**
   * The ID of this static rendition, used in managing this static rendition. Only
   * present for static renditions created with the Static Renditions API. Not set
   * for renditions created with the deprecated `mp4_support` option.
   */
  id?: string;

  /**
   * Unique identifier for the Asset. Max 255 characters.
   */
  asset_id?: string;

  /**
   * The bitrate in bits per second
   */
  bitrate?: number;

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  error?: WebhookAssetStaticRendition.Error;

  /**
   * Extension of the static rendition file
   */
  ext?: 'mp4' | 'm4a';

  /**
   * The file size in bytes
   */
  filesize?: number;

  /**
   * The height of the static rendition's file in pixels
   */
  height?: number;

  /**
   * Name of the static rendition file
   */
  name?:
    | 'low.mp4'
    | 'medium.mp4'
    | 'high.mp4'
    | 'highest.mp4'
    | 'audio.m4a'
    | 'capped-1080p.mp4'
    | '2160p.mp4'
    | '1440p.mp4'
    | '1080p.mp4'
    | '720p.mp4'
    | '540p.mp4'
    | '480p.mp4'
    | '360p.mp4'
    | '270p.mp4';

  /**
   * Arbitrary user-supplied metadata set for the static rendition. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * Indicates the resolution of this specific MP4 version of this asset. Only
   * present for static renditions created with the Static Renditions API. Not set
   * for renditions created with the deprecated `mp4_support` option.
   */
  resolution?:
    | 'highest'
    | 'audio-only'
    | '2160p'
    | '1440p'
    | '1080p'
    | '720p'
    | '540p'
    | '480p'
    | '360p'
    | '270p';

  /**
   * Indicates the resolution tier of this specific MP4 version of this asset. Only
   * present for static renditions created with the Static Renditions API. Not set
   * for renditions created with the deprecated `mp4_support` option.
   */
  resolution_tier?: '2160p' | '1440p' | '1080p' | '720p' | 'audio-only';

  /**
   * Indicates the status of this specific MP4 version of this asset. Only present
   * for static renditions created with the Static Renditions API. Not set for
   * renditions created with the deprecated `mp4_support` option. For `mp4_support`
   * renditions, see the top-level `static_renditions.status` field on the asset
   * instead.
   *
   * - `ready` indicates the MP4 has been generated and is ready for download
   * - `preparing` indicates the asset has not been ingested or the static rendition
   *   is still being generated after an asset is ready
   * - `skipped` indicates the static rendition will not be generated because the
   *   requested resolution conflicts with the asset attributes after the asset has
   *   been ingested
   * - `errored` indicates the static rendition cannot be generated. For example, an
   *   asset could not be ingested
   */
  status?: 'ready' | 'preparing' | 'skipped' | 'errored' | 'deleted';

  /**
   * Indicates the static rendition type of this specific MP4 version of this asset.
   * Only present for static renditions created with the Static Renditions API. Not
   * set for renditions created with the deprecated `mp4_support` option.
   */
  type?: 'standard' | 'advanced';

  /**
   * The width of the static rendition's file in pixels
   */
  width?: number;
}

export namespace WebhookAssetStaticRendition {
  /**
   * Object that describes any errors that happened when processing this asset.
   */
  export interface Error {
    /**
     * Error messages with more details.
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred for this asset.
     */
    type?: string;
  }
}

export interface WebhookAssetTrack {
  /**
   * Unique identifier for the Track
   */
  id?: string;

  /**
   * Unique identifier for the Asset. Max 255 characters.
   */
  asset_id?: string;

  /**
   * The confidence value (0-1) of the determined language. This value only is
   * available when automatic language detection is utilized in generated subtitles.
   */
  auto_language_confidence?: number;

  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   * This parameter is only set tracks where `type` is `text` and `text_type` is
   * `subtitles`.
   */
  closed_captions?: boolean;

  /**
   * The duration in seconds of the track media. This parameter is not set for `text`
   * type tracks. This field is optional and may not be set. The top level `duration`
   * field of an asset will always be set.
   */
  duration?: number;

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  error?: WebhookAssetTrack.Error;

  /**
   * The language code value represents [BCP 47](https://tools.ietf.org/html/bcp47)
   * specification compliant value, or 'auto'. For example, `en` for English or
   * `en-US` for the US version of English. This parameter is only set for `text` and
   * `audio` track types. During automatic language detection for generated
   * subtitles, this value will be set to `auto` until the language is determined.
   */
  language_code?: string;

  /**
   * The maximum number of audio channels the track supports. Only set for the
   * `audio` type track.
   */
  max_channels?: number;

  /**
   * The maximum frame rate available for the track. Only set for the `video` type
   * track. This field may return `-1` if the frame rate of the input cannot be
   * reliably determined.
   */
  max_frame_rate?: number;

  /**
   * The maximum height in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_height?: number;

  /**
   * The maximum width in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_width?: number;

  /**
   * The name of the track containing a human-readable description. The HLS manifest
   * will associate a subtitle `text` or `audio` track with this value. For example,
   * the value should be "English" for a subtitle text track for the `language_code`
   * value of `en-US`. This parameter is only set for `text` and `audio` track types.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the track either when creating the
   * asset or track. This parameter is only set for `text` type tracks. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * For an audio track, indicates that this is the primary audio track, ingested
   * from the main input for this asset. The primary audio track cannot be deleted.
   */
  primary?: boolean;

  /**
   * The status of the track.
   */
  status?: 'preparing' | 'ready' | 'errored' | 'deleted';

  /**
   * The source of the text contained in a Track of type `text`. Valid `text_source`
   * values are listed below.
   *
   * - `uploaded`: Tracks uploaded to Mux as caption or subtitle files using the
   *   Create Asset Track API.
   * - `embedded`: Tracks extracted from an embedded stream of CEA-608 closed
   *   captions.
   * - `generated_vod`: Tracks generated by automatic speech recognition on an
   *   on-demand asset.
   * - `generated_live`: Tracks generated by automatic speech recognition on a live
   *   stream configured with `generated_subtitles`. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   * - `generated_live_final`: Tracks generated by automatic speech recognition on a
   *   live stream using `generated_subtitles`. The accuracy, timing, and formatting
   *   of these subtitles is improved compared to the corresponding `generated_live`
   *   tracks. However, `generated_live_final` tracks will not be available in
   *   `ready` status until the live stream ends. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   */
  text_source?: 'uploaded' | 'embedded' | 'generated_live' | 'generated_live_final' | 'generated_vod';

  /**
   * This parameter is only set for `text` type tracks.
   */
  text_type?: 'subtitles' | 'chapters';

  /**
   * The type of track
   */
  type?: 'video' | 'audio' | 'text';
}

export namespace WebhookAssetTrack {
  /**
   * Object that describes any errors that happened when processing this asset.
   */
  export interface Error {
    /**
     * Error messages with more details.
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred for this asset.
     */
    type?: string;
  }
}

export interface WebhookAssetWarning {
  /**
   * Unique identifier for the Asset. Max 255 characters.
   */
  id?: string;

  /**
   * Unique identifier for the live stream. This is an optional parameter added when
   * the asset is created from a live stream.
   */
  live_stream_id?: string;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id` , you can use the `meta` object instead. **Max:
   * 255 characters**.
   */
  passthrough?: string;

  /**
   * Asset Identifier of the video used as the source for creating the clip.
   */
  source_asset_id?: string;

  /**
   * The status of the asset.
   */
  status?: 'preparing' | 'ready' | 'errored';

  /**
   * Unique identifier for the Direct Upload. This is an optional parameter added
   * when the asset is created from a direct upload.
   */
  upload_id?: string;

  warning?: WebhookAssetWarning.Warning;
}

export namespace WebhookAssetWarning {
  export interface Warning {
    /**
     * Human-readable detail for the warning.
     */
    message?: string;

    /**
     * Short identifier for the warning, e.g. `custom_slate_unavailable`,
     * `custom_slate_invalid`, `custom_slate_error`, `embedded_subtitles_unsupported`.
     * New values may be added.
     */
    type?: string;
  }
}

export interface WebhookDirectUpload {
  /**
   * Unique identifier for the Direct Upload.
   */
  id: string;

  /**
   * If the upload URL will be used in a browser, you must specify the origin in
   * order for the signed URL to have the correct CORS headers.
   */
  cors_origin: string;

  status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';

  /**
   * Max time in seconds for the signed upload URL to be valid. If a successful
   * upload has not occurred before the timeout limit, the direct upload is marked
   * `timed_out`
   */
  timeout: number;

  /**
   * Only set once the upload is in the `asset_created` state.
   */
  asset_id?: string;

  new_asset_settings?: WebhookDirectUpload.NewAssetSettings;

  /**
   * Indicates if this is a test Direct Upload, in which case the Asset that gets
   * created will be a `test` Asset.
   */
  test?: boolean;

  /**
   * The URL to upload the associated source media to.
   */
  url?: string;
}

export namespace WebhookDirectUpload {
  export interface NewAssetSettings {
    /**
     * An array of playback policy objects that you want applied to this asset and
     * available through `playback_ids`. `advanced_playback_policies` must be used
     * instead of `playback_policies` when creating a DRM playback ID.
     */
    advanced_playback_policies?: Array<NewAssetSettings.AdvancedPlaybackPolicy>;

    /**
     * If the created asset is a clip, this controls whether overlays are copied from
     * the source asset.
     */
    copy_overlays?: boolean;

    /**
     * An array of Mux Robots directives to apply to the asset.
     */
    directives?: Array<NewAssetSettings.Directive>;

    /**
     * @deprecated Use `video_quality` instead.
     */
    encoding_tier?: 'smart' | 'baseline' | 'premium';

    /**
     * Whether to perform shot detection on this asset. Shots are only generated for
     * video assets and will not be generated for audio-only assets.
     */
    generate_shots?: boolean;

    /**
     * An array of objects that each describe an input file to be used to create the
     * asset. As a shortcut, input can also be a string URL for a file when only one
     * input file is used. See `input[].url` for requirements.
     */
    inputs?: Array<NewAssetSettings.Input>;

    /**
     * Specify what level (if any) of support for master access. Master access can be
     * enabled temporarily for your asset to be downloaded. See the
     * [Download your videos guide](https://docs.mux.com/guides/enable-static-mp4-renditions)
     * for more information.
     */
    master_access?: 'none' | 'temporary';

    /**
     * Max resolution tier can be used to control the maximum `resolution_tier` your
     * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
     */
    max_resolution_tier?: '1080p' | '1440p' | '2160p';

    /**
     * Customer provided metadata about this asset.
     *
     * Note: This metadata may be publicly available via the video player. Do not
     * include PII or sensitive information.
     */
    meta?: NewAssetSettings.Meta;

    /**
     * @deprecated See the Static Renditions API
     * (https://www.mux.com/docs/guides/enable-static-mp4-renditions).
     */
    mp4_support?: 'none' | 'standard' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

    /**
     * Normalize the audio track loudness level. This parameter is only applicable to
     * on-demand (not live) assets.
     */
    normalize_audio?: boolean;

    /**
     * You can set this field to anything you want. It will be included in the asset
     * details and related webhooks. If you're looking for more structured metadata,
     * such as `title` or `external_id`, you can use the `meta` object instead. **Max:
     * 255 characters**.
     */
    passthrough?: string;

    /**
     * An array of playback policy names that you want applied to this asset and
     * available through `playback_ids`. Options include:
     *
     * - `"public"` (anyone with the playback URL can stream the asset).
     * - `"signed"` (an additional access token is required to play the asset).
     *
     * If no `playback_policies` are set, the asset will have no playback IDs and will
     * therefore not be playable. For simplicity, a single string name can be used in
     * place of the array in the case of only one playback policy.
     */
    playback_policies?: Array<'public' | 'signed' | 'drm'>;

    /**
     * An array of static renditions to create for this asset. You may not enable both
     * `static_renditions` and the deprecated `mp4_support`.
     */
    static_renditions?: Array<NewAssetSettings.StaticRendition>;

    /**
     * Marks the asset as a test asset when the value is set to true. A Test asset can
     * help evaluate the Mux Video APIs without incurring any cost. There is no limit
     * on number of test assets created. Test asset are watermarked with the Mux logo,
     * limited to 10 seconds, deleted after 24 hrs.
     */
    test?: boolean;

    /**
     * The video quality controls the cost, quality, and available platform features
     * for the asset. The default video quality for an account can be set in the Mux
     * Dashboard. This field replaces the deprecated `encoding_tier` value.
     * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
     */
    video_quality?: 'basic' | 'plus' | 'premium';
  }

  export namespace NewAssetSettings {
    export interface AdvancedPlaybackPolicy {
      /**
       * The DRM configuration used by this playback ID. Must only be set when `policy`
       * is set to `drm`.
       */
      drm_configuration_id?: string;

      /**
       * - `public` playback IDs are accessible by constructing an HLS URL like
       *   `https://stream.mux.com/${PLAYBACK_ID}`
       *
       * - `signed` playback IDs should be used with tokens
       *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
       *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
       *   details about creating tokens.
       *
       * - `drm` playback IDs are protected with DRM technologies.
       *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
       */
      policy?: 'public' | 'signed' | 'drm';
    }

    /**
     * A Mux Robots directive to apply to the asset.
     */
    export interface Directive {
      /**
       * The Mux Robots directive identifier.
       */
      id: string;
    }

    /**
     * An array of objects that each describe an input file to be used to create the
     * asset. As a shortcut, `input` can also be a string URL for a file when only one
     * input file is used. See `input[].url` for requirements.
     */
    export interface Input {
      /**
       * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
       * This optional parameter should be used for tracks with `type` of `text` and
       * `text_type` set to `subtitles`.
       */
      closed_captions?: boolean;

      /**
       * The time offset in seconds from the beginning of the video, indicating the
       * clip's ending marker. The default value is the duration of the video when not
       * included. This parameter is only applicable for creating clips when `input.url`
       * has `mux://assets/{asset_id}` format.
       */
      end_time?: number;

      /**
       * Generate subtitle tracks using automatic speech recognition with this
       * configuration. Subtitles are generated using the audio of the input they are
       * nested within. For direct uploads, this first input should omit the url
       * parameter, as the main input file is provided via the direct upload. Note that
       * subtitle generation happens after initial ingest, so the generated tracks will
       * be in the `preparing` state when the asset transitions to `ready`.
       */
      generated_subtitles?: Array<Input.GeneratedSubtitle>;

      /**
       * The language code value must be a valid
       * [BCP 47](https://tools.ietf.org/html/bcp47) specification compliant value. For
       * example, `en` for English or `en-US` for the US version of English. This
       * parameter is required for `text` and `audio` track types.
       */
      language_code?: string;

      /**
       * The name of the track containing a human-readable description. This value must
       * be unique within each group of `text` or `audio` track types. The HLS manifest
       * will associate a subtitle text track with this value. For example, the value
       * should be "English" for a subtitle text track with `language_code` set to `en`.
       * This optional parameter should be used only for `text` and `audio` type tracks.
       * This parameter can be optionally provided for the first video input to denote
       * the name of the muxed audio track if present. If this parameter is not included,
       * Mux will auto-populate based on the `input[].language_code` value.
       */
      name?: string;

      /**
       * An object that describes how the image file referenced in URL should be placed
       * over the video (i.e. watermarking). Ensure that the URL is active and persists
       * the entire lifespan of the video object.
       */
      overlay_settings?: Input.OverlaySettings;

      /**
       * This optional parameter should be used for tracks with `type` of `text` and
       * `text_type` set to `subtitles`.
       */
      passthrough?: string;

      /**
       * The time offset in seconds from the beginning of the video indicating the clip's
       * starting marker. The default value is 0 when not included. This parameter is
       * only applicable for creating clips when `input.url` has
       * `mux://assets/{asset_id}` format.
       */
      start_time?: number;

      /**
       * Type of text track. Use `subtitles` for subtitles and closed captions, or
       * `chapters` for a chapters track. For more information on Subtitles / Closed
       * Captions,
       * [see this blog post](https://mux.com/blog/subtitles-captions-webvtt-hls-and-those-magic-flags/).
       * This parameter is required for `text` type tracks.
       */
      text_type?: 'subtitles' | 'chapters';

      /**
       * This parameter is required for `text` type tracks.
       */
      type?: 'video' | 'audio' | 'text';

      /**
       * The URL of the file that Mux should download and use.
       *
       * - For the main input file, this should be the URL to the muxed file for Mux to
       *   download, for example an MP4, MOV, MKV, or TS file. Mux supports most
       *   audio/video file formats and codecs, but for fastest processing, you should
       *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
       * - For `audio` tracks, the URL is the location of the audio file for Mux to
       *   download, for example an M4A, WAV, or MP3 file. Mux supports most audio file
       *   formats and codecs, but for fastest processing, you should
       *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
       * - For `text` tracks, the URL is the location of subtitle/captions file. Mux
       *   supports [SubRip Text (SRT)](https://en.wikipedia.org/wiki/SubRip) and
       *   [Web Video Text Tracks](https://www.w3.org/TR/webvtt1/) formats for ingesting
       *   Subtitles and Closed Captions.
       * - For Watermarking or Overlay, the URL is the location of the watermark image.
       *   The maximum size is 4096x4096.
       * - When creating clips from existing Mux assets, the URL is defined with
       *   `mux://assets/{asset_id}` template where `asset_id` is the Asset Identifier
       *   for creating the clip from. The url property may be omitted on the first input
       *   object when providing asset settings for LiveStream and Upload objects, in
       *   order to configure settings related to the primary (live stream or direct
       *   upload) input.
       */
      url?: string;
    }

    export namespace Input {
      export interface GeneratedSubtitle {
        /**
         * The language of the audio from which subtitles are generated. Selecting a
         * language of "auto" will allow language detection to set the language code
         * automatically.
         */
        language_code?:
          | 'en'
          | 'es'
          | 'it'
          | 'pt'
          | 'de'
          | 'fr'
          | 'pl'
          | 'ru'
          | 'nl'
          | 'ca'
          | 'tr'
          | 'sv'
          | 'uk'
          | 'no'
          | 'fi'
          | 'sk'
          | 'el'
          | 'cs'
          | 'hr'
          | 'da'
          | 'ro'
          | 'bg'
          | 'auto';

        /**
         * A name for this subtitle track.
         */
        name?: string;

        /**
         * Arbitrary metadata set for the subtitle track. Max 255 characters.
         */
        passthrough?: string;
      }

      /**
       * An object that describes how the image file referenced in URL should be placed
       * over the video (i.e. watermarking). Ensure that the URL is active and persists
       * the entire lifespan of the video object.
       */
      export interface OverlaySettings {
        /**
         * How tall the overlay should appear. Can be expressed as a percent ("10%") or as
         * a pixel value ("100px"). If both width and height are left blank the height will
         * be the true pixels of the image, applied as if the video has been scaled to fit
         * a 1920x1080 frame. If width is supplied with no height, the height will scale
         * proportionally to the width.
         */
        height?: string;

        /**
         * Where the horizontal positioning of the overlay/watermark should begin from.
         */
        horizontal_align?: 'left' | 'center' | 'right';

        /**
         * The distance from the horizontal_align starting point and the image's closest
         * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
         * Negative values will move the overlay offscreen. In the case of 'center', a
         * positive value will shift the image towards the right and and a negative value
         * will shift it towards the left.
         */
        horizontal_margin?: string;

        /**
         * How opaque the overlay should appear, expressed as a percent. (Default 100%)
         */
        opacity?: string;

        /**
         * Where the vertical positioning of the overlay/watermark should begin from.
         * Defaults to `"top"`
         */
        vertical_align?: 'top' | 'middle' | 'bottom';

        /**
         * The distance from the vertical_align starting point and the image's closest
         * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
         * Negative values will move the overlay offscreen. In the case of 'middle', a
         * positive value will shift the overlay towards the bottom and and a negative
         * value will shift it towards the top.
         */
        vertical_margin?: string;

        /**
         * How wide the overlay should appear. Can be expressed as a percent ("10%") or as
         * a pixel value ("100px"). If both width and height are left blank the width will
         * be the true pixels of the image, applied as if the video has been scaled to fit
         * a 1920x1080 frame. If height is supplied with no width, the width will scale
         * proportionally to the height.
         */
        width?: string;
      }
    }

    /**
     * Customer provided metadata about this asset.
     *
     * Note: This metadata may be publicly available via the video player. Do not
     * include PII or sensitive information.
     */
    export interface Meta {
      /**
       * This is an identifier you provide to keep track of the creator of the asset. Max
       * 128 code points.
       */
      creator_id?: string;

      /**
       * This is an identifier you provide to link the asset to your own data. Max 128
       * code points.
       */
      external_id?: string;

      /**
       * The asset title. Max 512 code points.
       */
      title?: string;
    }

    export interface StaticRendition {
      resolution:
        | 'highest'
        | 'audio-only'
        | '2160p'
        | '1440p'
        | '1080p'
        | '720p'
        | '540p'
        | '480p'
        | '360p'
        | '270p';

      /**
       * Arbitrary user-supplied metadata set for the static rendition. Max 255
       * characters.
       */
      passthrough?: string;
    }
  }
}

/**
 * Version 1 directive run delivered in the Mux webhook event data field.
 */
export interface WebhookDirectiveRun {
  /**
   * Opaque run identifier (drvrun\_...).
   */
  id: string;

  /**
   * Terminal Unix timestamp in seconds, or null while in progress.
   */
  completed_at: number | null;

  /**
   * Opaque parent directive identifier (drv\_...).
   */
  directive_id: string;

  /**
   * Per-binding state in configuration order. Failed nodes retain their reason
   * diagnostic.
   */
  node_states: Array<
    | WebhookDirectiveRun.DirectiveNodeDispatched
    | WebhookDirectiveRun.DirectiveNodeFailed
    | WebhookDirectiveRun.DirectiveNodeWaitingForResources
    | WebhookDirectiveRun.DirectiveNodeWaitingForSourceBindings
  >;

  /**
   * Run start Unix timestamp in seconds.
   */
  started_at: number;

  status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';

  /**
   * Bare Mux asset ID targeted by the run.
   */
  subject_id: string;
}

export namespace WebhookDirectiveRun {
  export interface DirectiveNodeDispatched {
    /**
     * Workflow job ID (rjob\_...).
     */
    job_id: string;

    /**
     * Declared binding reference_id from directive.bindings[].
     */
    reference_id: string;

    status: 'dispatched';

    /**
     * The Robots workflow for this binding.
     */
    workflow:
      | 'analyze-structure'
      | 'summarize'
      | 'generate-contextual-text'
      | 'moderate'
      | 'generate-chapters'
      | 'edit-captions'
      | 'translate-captions'
      | 'translate-audio'
      | 'ask-questions'
      | 'find-key-moments'
      | 'generate-engagement-insights'
      | 'generate-premium-captions'
      | 'find-best-thumbnails';
  }

  export interface DirectiveNodeFailed {
    /**
     * Human-readable diagnostic explaining why the binding didn't dispatch.
     */
    reason: string;

    /**
     * Declared binding reference_id from directive.bindings[].
     */
    reference_id: string;

    status: 'failed';
  }

  export interface DirectiveNodeWaitingForResources {
    /**
     * Declared binding reference_id from directive.bindings[].
     */
    reference_id: string;

    status: 'waiting_for_resources';

    /**
     * The Robots workflow for this binding.
     */
    workflow:
      | 'analyze-structure'
      | 'summarize'
      | 'generate-contextual-text'
      | 'moderate'
      | 'generate-chapters'
      | 'edit-captions'
      | 'translate-captions'
      | 'translate-audio'
      | 'ask-questions'
      | 'find-key-moments'
      | 'generate-engagement-insights'
      | 'generate-premium-captions'
      | 'find-best-thumbnails';
  }

  export interface DirectiveNodeWaitingForSourceBindings {
    /**
     * Declared binding reference_id from directive.bindings[].
     */
    reference_id: string;

    /**
     * reference_ids of producer bindings within this directive that must complete
     * before this binding can dispatch.
     */
    source_bindings: Array<string>;

    status: 'waiting_for_source_bindings';

    /**
     * The Robots workflow for this binding.
     */
    workflow:
      | 'analyze-structure'
      | 'summarize'
      | 'generate-contextual-text'
      | 'moderate'
      | 'generate-chapters'
      | 'edit-captions'
      | 'translate-captions'
      | 'translate-audio'
      | 'ask-questions'
      | 'find-key-moments'
      | 'generate-engagement-insights'
      | 'generate-premium-captions'
      | 'find-best-thumbnails';
  }
}

/**
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookEditCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookEditCaptionsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'edit-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookEditCaptionsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookEditCaptionsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookEditCaptionsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookEditCaptionsJob.Resources;
}

export namespace WebhookEditCaptionsJob {
  export interface Parameters {
    /**
     * The Mux asset ID whose existing text track should be edited.
     */
    asset_id: string;

    /**
     * Mux text track ID of the source captions. Must identify a ready subtitle track,
     * or the single ready legacy text transcript without subtitle metadata on an
     * audio-only asset. A missing or unready source is rejected.
     */
    track_id: string;

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
    speaker_replacements?: Array<Parameters.SpeakerReplacement>;

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

    export interface SpeakerReplacement {
      /**
       * Existing speaker label without the surrounding square brackets.
       */
      find: string;

      /**
       * New speaker label without the surrounding square brackets.
       */
      replace: string;
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Total count of cue text replacements applied across all edit operations.
     */
    total_replacement_count: number;

    /**
     * IDs of tracks deleted during replacement. Omitted when no deletions were
     * recorded; historical jobs may lack this information.
     */
    replaced_track_ids?: Array<string>;

    /**
     * Temporary pre-signed URL for downloading the edited VTT file. Expires 7 days
     * after the job completes.
     */
    temporary_vtt_url?: string;

    /**
     * Mux text track ID of the newly created edited captions, distinct from the source
     * parameters.track_id. Present when upload_to_mux is true and the upload succeeds.
     */
    track_id?: string;
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookEditCaptionsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookEditCaptionsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'edit-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookEditCaptionsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookEditCaptionsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookEditCaptionsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookEditCaptionsJobV0.Resources;
}

export namespace WebhookEditCaptionsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID whose existing text track should be edited.
     */
    asset_id: string;

    /**
     * The existing ready Mux text track ID to edit and optionally replace.
     */
    track_id: string;

    /**
     * Optional LLM-driven profanity detection and censorship rules applied to the
     * selected caption track.
     */
    auto_censor_profanity?: Parameters.AutoCensorProfanity;

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
    replacements?: Array<Parameters.Replacement>;

    /**
     * Optional replacements for bracketed speaker labels at the start of caption cues.
     * Values omit the surrounding square brackets, and matching spoken text is not
     * changed.
     */
    speaker_replacements?: Array<Parameters.SpeakerReplacement>;

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

    export interface SpeakerReplacement {
      /**
       * Existing speaker label without the surrounding square brackets.
       */
      find: string;

      /**
       * New speaker label without the surrounding square brackets.
       */
      replace: string;
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Total count of cue text replacements applied across all edit operations.
     */
    total_replacement_count: number;

    /**
     * Every track deleted before the new track was created. Present when
     * `replace_existing_tracks` was a deleting policy and at least one track was
     * removed.
     */
    replaced_tracks?: Array<Outputs.ReplacedTrack>;

    /**
     * Temporary pre-signed URL for downloading the edited VTT file. Expires 7 days
     * after the job completes.
     */
    temporary_vtt_url?: string;

    /**
     * Mux text track ID for the uploaded edited captions. Present when upload_to_mux
     * is true and the upload succeeds.
     */
    uploaded_track_id?: string;
  }

  export namespace Outputs {
    export interface ReplacedTrack {
      /**
       * Mux track ID of the deleted track.
       */
      id: string;

      /**
       * Language code of the deleted track.
       */
      language_code?: string;

      /**
       * Name of the deleted track.
       */
      name?: string;

      /**
       * `passthrough` value the deleted track carried, if any.
       */
      passthrough?: string;

      /**
       * Mux `text_source` of the deleted track, e.g. `uploaded` or `generated_vod`.
       * Absent for audio tracks.
       */
      text_source?: string;

      /**
       * Mux track type of the deleted track.
       */
      type?: 'text' | 'audio';
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookFindBestThumbnailsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookFindBestThumbnailsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'find-best-thumbnails';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookFindBestThumbnailsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookFindBestThumbnailsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookFindBestThumbnailsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookFindBestThumbnailsJob.Resources;
}

export namespace WebhookFindBestThumbnailsJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to find thumbnails for.
     */
    asset_id: string;

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
    output_steering?: Parameters.OutputSteering;

    /**
     * When true, the highest-scoring thumbnail's timestamp is written to the Mux
     * asset's thumbnail_time once the job completes, making that frame the asset's
     * default poster image. The new thumbnail will appear for some clients sooner than
     * others, depending on local cache settings.
     */
    update_asset_thumbnail?: boolean;
  }

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, thumbnail scoring
     * strategy, explicit user intent, audience, campaign style, and scoring
     * priorities. Scope is enforced; other controls guide model behavior but do not
     * guarantee exact output.
     */
    export interface OutputSteering {
      /**
       * Intended audience used as best-effort scoring guidance. Does not change the
       * output schema.
       */
      audience?: string;

      /**
       * Short description of the campaign/channel thumbnail style to prefer when
       * supported by the frame.
       */
      campaign_style?: string;

      /**
       * Open-ended description of what the user is explicitly looking for in candidate
       * thumbnails. Best-effort guidance only.
       */
      looking_for?: string;

      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

      /**
       * Rubric criteria to emphasize in close calls. Best-effort guidance only.
       */
      scoring_priorities?: Array<'focus' | 'face_or_action' | 'composition' | 'contrast_color' | 'brand_fit'>;

      /**
       * Best-effort guidance for what kind of thumbnail candidate should score highest.
       */
      selection_strategy?:
        | 'face_or_action'
        | 'clean_composition'
        | 'high_contrast'
        | 'brand_safe'
        | 'campaign_thumbnail';
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Selected thumbnails, ordered best to worst by overall quality score.
     */
    best_thumbnails: Array<Outputs.BestThumbnail>;

    /**
     * Recorded asset thumbnail update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
    export interface BestThumbnail {
      /**
       * AI-generated description of the frame content.
       */
      description: string;

      /**
       * Overall quality score from 0 to 1.
       */
      overall: number;

      /**
       * Per-category quality scores.
       */
      subscores: BestThumbnail.Subscores;

      /**
       * Absolute frame timestamp in seconds on the original asset timeline. Fractional
       * seconds are supported.
       */
      time: number;

      /**
       * Suggested alternative text for the candidate thumbnail image, suitable for use
       * with the thumbnail URL in an accessible UI.
       */
      alt_text?: string;
    }

    export namespace BestThumbnail {
      /**
       * Per-category quality scores.
       */
      export interface Subscores {
        /**
         * Alignment with brand guidelines score (0-1).
         */
        brand_fit: number;

        /**
         * Visual composition and framing quality score (0-1).
         */
        composition: number;

        /**
         * Color contrast and vibrancy score (0-1).
         */
        contrast_color: number;

        /**
         * Presence of faces or dynamic action score (0-1).
         */
        face_or_action: number;

        /**
         * Sharpness and focus quality score (0-1).
         */
        focus: number;
      }
    }

    /**
     * Recorded asset thumbnail update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    export interface AssetUpdates {
      thumbnail?: AssetUpdates.Thumbnail;
    }

    export namespace AssetUpdates {
      export interface Thumbnail {
        /**
         * Outcome of the requested asset thumbnail update.
         */
        status: 'updated' | 'failed';
      }
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookFindBestThumbnailsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookFindBestThumbnailsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'find-best-thumbnails';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookFindBestThumbnailsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookFindBestThumbnailsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookFindBestThumbnailsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookFindBestThumbnailsJobV0.Resources;
}

export namespace WebhookFindBestThumbnailsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to find thumbnails for.
     */
    asset_id: string;

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
    output_steering?: Parameters.OutputSteering;

    /**
     * When true, the highest-scoring thumbnail's timestamp is written to the Mux
     * asset's thumbnail_time once the job completes, making that frame the asset's
     * default poster image. The new thumbnail will appear for some clients sooner than
     * others, depending on local cache settings.
     */
    update_asset_thumbnail?: boolean;
  }

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, thumbnail scoring
     * strategy, explicit user intent, audience, campaign style, and scoring
     * priorities. Scope is enforced; other controls guide model behavior but do not
     * guarantee exact output.
     */
    export interface OutputSteering {
      /**
       * Intended audience used as best-effort scoring guidance. Does not change the
       * output schema.
       */
      audience?: string;

      /**
       * Short description of the campaign/channel thumbnail style to prefer when
       * supported by the frame.
       */
      campaign_style?: string;

      /**
       * Open-ended description of what the user is explicitly looking for in candidate
       * thumbnails. Best-effort guidance only.
       */
      looking_for?: string;

      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

      /**
       * Rubric criteria to emphasize in close calls. Best-effort guidance only.
       */
      scoring_priorities?: Array<'focus' | 'face_or_action' | 'composition' | 'contrast_color' | 'brand_fit'>;

      /**
       * Best-effort guidance for what kind of thumbnail candidate should score highest.
       */
      selection_strategy?:
        | 'face_or_action'
        | 'clean_composition'
        | 'high_contrast'
        | 'brand_safe'
        | 'campaign_thumbnail';
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Selected candidate thumbnails from the original asset timeline, ordered best to
     * worst by overall quality score.
     */
    best_thumbnails: Array<Outputs.BestThumbnail>;

    /**
     * Recorded asset thumbnail update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
    export interface BestThumbnail {
      /**
       * AI-generated description of the frame content.
       */
      description: string;

      /**
       * Overall quality score from 0 to 1.
       */
      overall: number;

      /**
       * Per-category quality scores.
       */
      subscores: BestThumbnail.Subscores;

      /**
       * Absolute frame timestamp in whole milliseconds on the original asset timeline.
       */
      timestamp_ms: number;

      /**
       * Suggested alternative text for the candidate thumbnail image, suitable for use
       * with the thumbnail URL in an accessible UI.
       */
      alt_text?: string;
    }

    export namespace BestThumbnail {
      /**
       * Per-category quality scores.
       */
      export interface Subscores {
        /**
         * Alignment with brand guidelines score (0-1).
         */
        brand_fit: number;

        /**
         * Visual composition and framing quality score (0-1).
         */
        composition: number;

        /**
         * Color contrast and vibrancy score (0-1).
         */
        contrast_color: number;

        /**
         * Presence of faces or dynamic action score (0-1).
         */
        face_or_action: number;

        /**
         * Sharpness and focus quality score (0-1).
         */
        focus: number;
      }
    }

    /**
     * Recorded asset thumbnail update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    export interface AssetUpdates {
      thumbnail?: AssetUpdates.Thumbnail;
    }

    export namespace AssetUpdates {
      export interface Thumbnail {
        /**
         * Outcome of the requested asset thumbnail update.
         */
        status: 'updated' | 'failed';
      }
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookFindKeyMomentsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookFindKeyMomentsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookFindKeyMomentsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookFindKeyMomentsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookFindKeyMomentsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookFindKeyMomentsJob.Resources;
}

export namespace WebhookFindKeyMomentsJob {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;

    /**
     * Preferred highlight duration range in seconds. Best-effort guidance, with
     * millisecond precision.
     */
    target_duration?: Parameters.TargetDuration;

    /**
     * Controls whether video assets are analyzed using Mux shots. When true, shots are
     * generated or reused and visual evidence drives selection. When false or omitted,
     * selection uses transcript evidence and the asset must have a caption track. Not
     * supported for audio-only assets.
     */
    use_shots?: boolean;
  }

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, selection strategy, title
     * style, audience, taxonomy, and rubric tie-breakers. Scope is enforced; other
     * controls guide model behavior but do not guarantee exact output.
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
       * Rubric dimensions to use as tie-breakers after applying selection strategy.
       * Best-effort guidance only.
       */
      rubric_priorities?: Array<
        'clarity_in_isolation' | 'emotional_intensity' | 'novelty' | 'soundbite_quality'
      >;

      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

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
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      topic_taxonomy?: OutputSteering.TopicTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      export interface TopicTaxonomy {
        /**
         * When false, the model should prefer values from the taxonomy. When true,
         * non-taxonomy values may be used when no taxonomy value applies.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values used as best-effort model guidance.
         */
        values: Array<TopicTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy.
         */
        name?: string;
      }

      export namespace TopicTaxonomy {
        export interface Value {
          /**
           * Canonical taxonomy value to prefer when supported by the source content.
           */
          label: string;

          /**
           * Accepted alternate names that should normalize to the canonical label.
           */
          aliases?: Array<string>;

          /**
           * Short explanation of when this value applies.
           */
          description?: string;
        }
      }
    }

    /**
     * Preferred highlight duration range in seconds. Best-effort guidance, with
     * millisecond precision.
     */
    export interface TargetDuration {
      /**
       * Preferred maximum highlight duration in seconds, with millisecond precision.
       */
      max: number;

      /**
       * Preferred minimum highlight duration in seconds, with millisecond precision.
       */
      min: number;
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Extracted key moments, ordered by their absolute position on the original asset
     * timeline.
     */
    moments: Array<Outputs.Moment>;
  }

  export namespace Outputs {
    export interface Moment {
      /**
       * One-sentence summary of what is being said during the moment. Empty when no
       * transcript evidence is available.
       */
      audible_narrative: string;

      /**
       * Contiguous transcript segments that comprise this moment. Empty when video
       * selection identifies the moment without transcript evidence.
       */
      cues: Array<Moment.Cue>;

      /**
       * Key moment end time in seconds on the original asset timeline. Fractional
       * seconds are supported.
       */
      end_time: number;

      /**
       * Multi-word descriptive phrases (2-5 words each) capturing key audible concepts.
       * Empty when no transcript evidence is available.
       */
      notable_audible_concepts: Array<string>;

      /**
       * Weighted quality score from 0.0 to 1.0 based on the audible and/or visual
       * evidence available to the selected analysis mode.
       */
      overall_score: number;

      /**
       * Key moment start time in seconds on the original asset timeline. Fractional
       * seconds are supported.
       */
      start_time: number;

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
       * Best short, verbatim quote from within this moment. Omitted when the selected
       * video moment has no source-grounded transcript quote.
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
         * Multi-word visual concept (2-5 words).
         */
        concept: string;

        /**
         * Brief explanation of the relevance score.
         */
        rationale: string;

        /**
         * Relevance score from 0.0 to 1.0 measuring how important the visual concept is to
         * the moment's available evidence.
         */
        score: number;
      }

      /**
       * Best short, verbatim quote from within this moment. Omitted when the selected
       * video moment has no source-grounded transcript quote.
       */
      export interface QuotableSegment {
        /**
         * Verbatim transcript quote selected from within the key moment.
         */
        text: string;

        /**
         * Quote start timestamp in seconds on the original asset timeline. Fractional
         * seconds are supported.
         */
        time: number;
      }
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookFindKeyMomentsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookFindKeyMomentsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookFindKeyMomentsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookFindKeyMomentsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookFindKeyMomentsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookFindKeyMomentsJobV0.Resources;
}

export namespace WebhookFindKeyMomentsJobV0 {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;

    /**
     * Preferred highlight duration range in milliseconds. When provided, the model
     * will aim to select moments within this range.
     */
    target_duration_ms?: Parameters.TargetDurationMs;

    /**
     * Controls whether video assets are analyzed using Mux shots. When true, shots are
     * generated or reused and visual evidence drives selection. When false or omitted,
     * selection uses transcript evidence and the asset must have a caption track. Not
     * supported for audio-only assets.
     */
    use_shots?: boolean;
  }

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, selection strategy, title
     * style, audience, taxonomy, and rubric tie-breakers. Scope is enforced; other
     * controls guide model behavior but do not guarantee exact output.
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
       * Rubric dimensions to use as tie-breakers after applying selection strategy.
       * Best-effort guidance only.
       */
      rubric_priorities?: Array<
        'clarity_in_isolation' | 'emotional_intensity' | 'novelty' | 'soundbite_quality'
      >;

      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

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
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      topic_taxonomy?: OutputSteering.TopicTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      export interface TopicTaxonomy {
        /**
         * When false, the model should prefer values from the taxonomy. When true,
         * non-taxonomy values may be used when no taxonomy value applies.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values used as best-effort model guidance.
         */
        values: Array<TopicTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy.
         */
        name?: string;
      }

      export namespace TopicTaxonomy {
        export interface Value {
          /**
           * Canonical taxonomy value to prefer when supported by the source content.
           */
          label: string;

          /**
           * Accepted alternate names that should normalize to the canonical label.
           */
          aliases?: Array<string>;

          /**
           * Short explanation of when this value applies.
           */
          description?: string;
        }
      }
    }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Extracted key moments, ordered by their absolute position on the original asset
     * timeline.
     */
    moments: Array<Outputs.Moment>;
  }

  export namespace Outputs {
    export interface Moment {
      /**
       * One-sentence summary of what is being said during the moment. Empty when no
       * transcript evidence is available.
       */
      audible_narrative: string;

      /**
       * Contiguous transcript segments that comprise this moment. Empty when video
       * selection identifies the moment without transcript evidence.
       */
      cues: Array<Moment.Cue>;

      /**
       * Moment end time in milliseconds.
       */
      end_ms: number;

      /**
       * Multi-word descriptive phrases (2-5 words each) capturing key audible concepts.
       * Empty when no transcript evidence is available.
       */
      notable_audible_concepts: Array<string>;

      /**
       * Weighted quality score from 0.0 to 1.0 based on the audible and/or visual
       * evidence available to the selected analysis mode.
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
       * Best short, verbatim quote from within this moment. Omitted when the selected
       * video moment has no source-grounded transcript quote.
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
         * Relevance score from 0.0 to 1.0 measuring how important the visual concept is to
         * the moment's available evidence.
         */
        score: number;
      }

      /**
       * Best short, verbatim quote from within this moment. Omitted when the selected
       * video moment has no source-grounded transcript quote.
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookFindScenesJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookFindScenesJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookFindScenesJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookFindScenesJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookFindScenesJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookFindScenesJobV0.Resources;
}

export namespace WebhookFindScenesJobV0 {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;
  }

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, segmentation strategy,
     * title style, narration detail, audience, brand terms, and topic taxonomy. Scope
     * is enforced; other controls guide model behavior but do not guarantee exact
     * output.
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
       * Best-effort guidance for how much detail scene narratives should include.
       */
      narration_detail?: 'concise' | 'balanced' | 'detailed';

      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

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
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      topic_taxonomy?: OutputSteering.TopicTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary used as best-effort guidance for generated labels and
       * concepts.
       */
      export interface TopicTaxonomy {
        /**
         * When false, the model should prefer values from the taxonomy. When true,
         * non-taxonomy values may be used when no taxonomy value applies.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values used as best-effort model guidance.
         */
        values: Array<TopicTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy.
         */
        name?: string;
      }

      export namespace TopicTaxonomy {
        export interface Value {
          /**
           * Canonical taxonomy value to prefer when supported by the source content.
           */
          label: string;

          /**
           * Accepted alternate names that should normalize to the canonical label.
           */
          aliases?: Array<string>;

          /**
           * Short explanation of when this value applies.
           */
          description?: string;
        }
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Ordered scene segments extracted from the original asset timeline using shot
     * boundaries plus any available transcript context.
     */
    scenes: Array<Outputs.Scene>;
  }

  export namespace Outputs {
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookGenerateChaptersJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateChaptersJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-chapters';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGenerateChaptersJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateChaptersJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookGenerateChaptersJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateChaptersJob.Resources;
}

export namespace WebhookGenerateChaptersJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to generate chapters for.
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
     * BCP 47 language code for the output chapter titles. Auto-detected from the
     * transcript if omitted.
     */
    output_language_code?: string;

    /**
     * Curated output_steering controls for chapter style, granularity, audience, and
     * brand terminology. These controls guide model behavior but do not guarantee
     * exact output.
     */
    output_steering?: Parameters.OutputSteering;

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

  export namespace Parameters {
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
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Generated chapters, ordered by start time.
     */
    chapters: Array<Outputs.Chapter>;

    /**
     * Recorded best-effort chapters track update outcome. A failed update does not
     * fail the analysis job. Omitted when no outcome was recorded.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
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

    /**
     * Recorded best-effort chapters track update outcome. A failed update does not
     * fail the analysis job. Omitted when no outcome was recorded.
     */
    export interface AssetUpdates {
      /**
       * What happened when the generated chapters were written back to the Mux asset.
       * Present only when update_asset_chapters was true. When status is `failed` and
       * replaced_track_ids is nonempty, deletion succeeded but replacement creation
       * failed, leaving the asset without a chapters track.
       */
      chapters?: AssetUpdates.Chapters;
    }

    export namespace AssetUpdates {
      /**
       * What happened when the generated chapters were written back to the Mux asset.
       * Present only when update_asset_chapters was true. When status is `failed` and
       * replaced_track_ids is nonempty, deletion succeeded but replacement creation
       * failed, leaving the asset without a chapters track.
       */
      export interface Chapters {
        /**
         * Outcome of the chapters track write. `created` means the asset now carries these
         * chapters. `failed` means the write was attempted and errored; the chapters in
         * this response are still valid and can be applied manually.
         */
        status: 'created' | 'failed';

        /**
         * IDs of tracks deleted during replacement. Omitted when no deletions were
         * recorded; historical jobs may lack this information.
         */
        replaced_track_ids?: Array<string>;

        /**
         * Mux text track ID of the chapters track created on the asset. Present when
         * status is `created`.
         */
        track_id?: string;
      }
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookGenerateChaptersJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateChaptersJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-chapters';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGenerateChaptersJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateChaptersJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookGenerateChaptersJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateChaptersJobV0.Resources;
}

export namespace WebhookGenerateChaptersJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to generate chapters for.
     */
    asset_id: string;

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
    output_steering?: Parameters.OutputSteering;

    /**
     * @deprecated Use `output_steering` instead.
     */
    prompt_overrides?: Parameters.PromptOverrides;

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

  export namespace Parameters {
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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Generated chapters, ordered by start time.
     */
    chapters: Array<Outputs.Chapter>;

    /**
     * @deprecated Use `asset_updates.chapters` instead.
     */
    asset_update?: Outputs.AssetUpdate;

    /**
     * Recorded chapters track update outcome. Omitted when no outcome was recorded.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
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

    /**
     * @deprecated Use `asset_updates.chapters` instead.
     */
    export interface AssetUpdate {
      /**
       * Outcome of the chapters track write. `created` means the asset now carries these
       * chapters. `failed` means the write was attempted and errored; the chapters in
       * this response are still valid and can be applied manually.
       */
      status: 'created' | 'failed';

      /**
       * Mux text track ID of the chapters track that was deleted to make room for the
       * new one. Absent when the asset had no chapters track. On a `failed` status it
       * means the delete succeeded but the create did not, leaving the asset with no
       * chapters track.
       */
      replaced_track_id?: string;

      /**
       * Mux text track ID of the chapters track created on the asset. Present when
       * status is `created`.
       */
      track_id?: string;
    }

    /**
     * Recorded chapters track update outcome. Omitted when no outcome was recorded.
     */
    export interface AssetUpdates {
      /**
       * What happened when the generated chapters were written back to the Mux asset.
       * Present only when update_asset_chapters was true.
       */
      chapters?: AssetUpdates.Chapters;
    }

    export namespace AssetUpdates {
      /**
       * What happened when the generated chapters were written back to the Mux asset.
       * Present only when update_asset_chapters was true.
       */
      export interface Chapters {
        /**
         * Outcome of the chapters track write. `created` means the asset now carries these
         * chapters. `failed` means the write was attempted and errored; the chapters in
         * this response are still valid and can be applied manually.
         */
        status: 'created' | 'failed';

        /**
         * Mux text track ID of the chapters track that was deleted to make room for the
         * new one. Absent when the asset had no chapters track. On a `failed` status it
         * means the delete succeeded but the create did not, leaving the asset with no
         * chapters track.
         */
        replaced_track_id?: string;

        /**
         * Mux text track ID of the chapters track created on the asset. Present when
         * status is `created`.
         */
        track_id?: string;
      }
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookGenerateContextualTextJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateContextualTextJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookGenerateContextualTextJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateContextualTextJob.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookGenerateContextualTextJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateContextualTextJob.Resources;
}

export namespace WebhookGenerateContextualTextJob {
  export interface Parameters {
    /**
     * The deliverables to create. Every variant produces each artifact. Supports 1-5
     * artifacts with unique keys.
     */
    artifacts: Array<Parameters.Artifact>;

    /**
     * The Mux asset ID whose transcript grounds the generated text.
     */
    asset_id: string;

    /**
     * Named versions of the complete artifact set. Every variant produces every
     * artifact. Supports 1-5 variants with unique keys.
     */
    variants: Array<Parameters.Variant>;

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
    output_steering?: Parameters.OutputSteering;

    /**
     * When true for a video asset, generate or reuse Mux shots and attach a bounded
     * sample of shot frames as additional visual evidence. Video assets always include
     * a storyboard; the transcript remains authoritative. Not supported for audio-only
     * assets.
     */
    use_shots?: boolean;
  }

  export namespace Parameters {
    /**
     * One deliverable, such as a social post, blog post, or newsletter entry. Every
     * variant produces each artifact. The channel sets conventions and a default cap,
     * max_length sets the hard cap, and format controls Markdown.
     */
    export interface Artifact {
      /**
       * Customer-chosen lowercase snake_case identifier used to correlate requested and
       * returned content.
       */
      key: string;

      /**
       * Publishing channel whose conventions guide the result and set its default
       * length: 300 words for generic and linkedin, 250 words for facebook and youtube,
       * 100 words for tiktok, 1,500 characters for instagram, and 280 characters for x.
       * generic has no platform conventions; its style follows the length cap, and a
       * max_length above 600 words produces article-style writing such as a blog post or
       * newsletter entry.
       */
      channel?: 'generic' | 'x' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

      /**
       * Whether the text may use Markdown syntax. plain contains no Markdown.
       */
      format?: 'plain' | 'markdown';

      /**
       * Optional guidance specific to this artifact, such as the deliverable to write.
       * Applies in every variant.
       */
      instructions?: string;

      /**
       * Hard output cap in characters or words. Defaults to the channel's cap. Text aims
       * for about 90% of the cap regardless of the source's length, so set the length
       * you want rather than relying on the default. x is always capped at 280
       * characters, even with a word cap.
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
     * A named version of the complete artifact set: every variant produces every
     * artifact, so 2 variants and 2 artifacts produce 4 pieces of text. The key is an
     * identifier only and does not steer generation; use instructions to give the
     * variant an angle.
     */
    export interface Variant {
      /**
       * Customer-chosen lowercase snake_case identifier used to correlate requested and
       * returned content.
       */
      key: string;

      /**
       * Optional bounded guidance that gives this variant a deliberate angle, such as a
       * voice, audience, or focus (for example, "Playful voice for a Gen Z audience").
       * Applies to every artifact in the variant. Omit it to request another independent
       * take on the same brief.
       */
      instructions?: string;
    }

    /**
     * Curated controls that apply to every generated artifact in every variant. Scope
     * bounds execution; the other fields are best-effort writing guidance. To vary
     * voice or audience between variants, use variant instructions.
     */
    export interface OutputSteering {
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
      scope?: OutputSteering.Scope;

      /**
       * Best-effort writing voice for every generated artifact in every variant. To give
       * variants different voices, describe the voice in each variant's instructions
       * instead.
       */
      voice?: 'conversational' | 'editorial' | 'playful' | 'professional';
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    variants: Array<Outputs.Variant>;
  }

  export namespace Outputs {
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookGenerateContextualTextJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateContextualTextJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookGenerateContextualTextJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateContextualTextJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookGenerateContextualTextJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateContextualTextJobV0.Resources;
}

export namespace WebhookGenerateContextualTextJobV0 {
  export interface Parameters {
    /**
     * The deliverables to create. Every variant produces each artifact. Supports 1-5
     * artifacts with unique keys.
     */
    artifacts: Array<Parameters.Artifact>;

    /**
     * The Mux asset ID whose transcript grounds the generated text.
     */
    asset_id: string;

    /**
     * Named versions of the complete artifact set. Every variant produces every
     * artifact. Supports 1-5 variants with unique keys.
     */
    variants: Array<Parameters.Variant>;

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
     * Curated controls that apply to every generated artifact in every variant. Scope
     * bounds execution; the other fields are best-effort writing guidance. To vary
     * voice or audience between variants, use variant instructions.
     */
    output_steering?: Parameters.OutputSteering;

    /**
     * When true for a video asset, generate or reuse Mux shots and attach a bounded
     * sample of shot frames as additional visual evidence. Video assets always include
     * a storyboard; the transcript remains authoritative. Not supported for audio-only
     * assets.
     */
    use_shots?: boolean;
  }

  export namespace Parameters {
    /**
     * One deliverable, such as a social post, blog post, or newsletter entry. Every
     * variant produces each artifact. The channel sets conventions and a default cap,
     * max_length sets the hard cap, and format controls Markdown.
     */
    export interface Artifact {
      /**
       * Customer-chosen lowercase snake_case identifier used to correlate requested and
       * returned content.
       */
      key: string;

      /**
       * Publishing channel whose conventions guide the result and set its default
       * length: 300 words for generic and linkedin, 250 words for facebook and youtube,
       * 100 words for tiktok, 1,500 characters for instagram, and 280 characters for x.
       * generic has no platform conventions; its style follows the length cap, and a
       * max_length above 600 words produces article-style writing such as a blog post or
       * newsletter entry.
       */
      channel?: 'generic' | 'x' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

      /**
       * Whether the text may use Markdown syntax. plain contains no Markdown.
       */
      format?: 'plain' | 'markdown';

      /**
       * Optional guidance specific to this artifact, such as the deliverable to write.
       * Applies in every variant.
       */
      instructions?: string;

      /**
       * Hard output cap in characters or words. Defaults to the channel's cap. Text aims
       * for about 90% of the cap regardless of the source's length, so set the length
       * you want rather than relying on the default. x is always capped at 280
       * characters, even with a word cap.
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
     * A named version of the complete artifact set: every variant produces every
     * artifact, so 2 variants and 2 artifacts produce 4 pieces of text. The key is an
     * identifier only and does not steer generation; use instructions to give the
     * variant an angle.
     */
    export interface Variant {
      /**
       * Customer-chosen lowercase snake_case identifier used to correlate requested and
       * returned content.
       */
      key: string;

      /**
       * Optional bounded guidance that gives this variant a deliberate angle, such as a
       * voice, audience, or focus (for example, "Playful voice for a Gen Z audience").
       * Applies to every artifact in the variant. Omit it to request another independent
       * take on the same brief.
       */
      instructions?: string;
    }

    /**
     * Curated controls that apply to every generated artifact in every variant. Scope
     * bounds execution; the other fields are best-effort writing guidance. To vary
     * voice or audience between variants, use variant instructions.
     */
    export interface OutputSteering {
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
      scope?: OutputSteering.Scope;

      /**
       * Best-effort writing voice for every generated artifact in every variant. To give
       * variants different voices, describe the voice in each variant's instructions
       * instead.
       */
      voice?: 'conversational' | 'editorial' | 'playful' | 'professional';
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    variants: Array<Outputs.Variant>;
  }

  export namespace Outputs {
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookGenerateEngagementInsightsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateEngagementInsightsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-engagement-insights';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGenerateEngagementInsightsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateEngagementInsightsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookGenerateEngagementInsightsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateEngagementInsightsJob.Resources;
}

export namespace WebhookGenerateEngagementInsightsJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to analyze engagement for.
     */
    asset_id: string;
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Per-moment engagement insights for identified hotspots.
     */
    moment_insights: Array<Outputs.MomentInsight>;

    /**
     * Overall engagement analysis across the video.
     */
    overall_insight: Outputs.OverallInsight;
  }

  export namespace Outputs {
    export interface MomentInsight {
      /**
       * Engagement insight end time in seconds on the original asset timeline.
       * Fractional seconds are supported.
       */
      end_time: number;

      /**
       * Normalized engagement score (0-1).
       */
      engagement_score: number;

      /**
       * Primary insight explaining the engagement pattern.
       */
      insight: string;

      /**
       * Engagement insight start time in seconds on the original asset timeline.
       * Fractional seconds are supported.
       */
      start_time: number;
    }

    /**
     * Overall engagement analysis across the video.
     */
    export interface OverallInsight {
      /**
       * Summary of overall engagement patterns.
       */
      summary: string;

      /**
       * Key trends identified across the video.
       */
      trends: Array<string>;
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookGenerateEngagementInsightsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGenerateEngagementInsightsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-engagement-insights';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGenerateEngagementInsightsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGenerateEngagementInsightsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookGenerateEngagementInsightsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGenerateEngagementInsightsJobV0.Resources;
}

export namespace WebhookGenerateEngagementInsightsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to analyze engagement for.
     */
    asset_id: string;
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Per-moment engagement insights for identified hotspots.
     */
    moment_insights: Array<Outputs.MomentInsight>;

    /**
     * Overall engagement analysis across the video.
     */
    overall_insight: Outputs.OverallInsight;
  }

  export namespace Outputs {
    export interface MomentInsight {
      /**
       * End time in milliseconds.
       */
      end_ms: number;

      /**
       * Normalized engagement score (0-1).
       */
      engagement_score: number;

      /**
       * Primary insight explaining the engagement pattern.
       */
      insight: string;

      /**
       * Start time in milliseconds.
       */
      start_ms: number;
    }

    /**
     * Overall engagement analysis across the video.
     */
    export interface OverallInsight {
      /**
       * Summary of overall engagement patterns.
       */
      summary: string;

      /**
       * Key trends identified across the video.
       */
      trends: Array<string>;
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookGeneratePremiumCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGeneratePremiumCaptionsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-premium-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGeneratePremiumCaptionsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGeneratePremiumCaptionsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookGeneratePremiumCaptionsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGeneratePremiumCaptionsJob.Resources;
}

export namespace WebhookGeneratePremiumCaptionsJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to caption.
     */
    asset_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Resolved language code of the generated captions (may differ from the requested
     * code when auto-detected).
     */
    language_code: string;

    /**
     * The transcription model's confidence in its automatic language detection, from 0
     * to 1. Always 1 when language_code was supplied in the request, since detection
     * is skipped.
     */
    auto_language_confidence?: number;

    /**
     * Language code reported by the transcription model. Only a genuine detection when
     * language_code was omitted from the request; when a language_code hint was
     * supplied, detection is skipped and this echoes the requested language.
     */
    detected_language_code?: string;

    /**
     * IDs of tracks deleted during replacement. Omitted when no deletions were
     * recorded; historical jobs may lack this information.
     */
    replaced_track_ids?: Array<string>;

    /**
     * Temporary pre-signed URL to download the generated SRT file. Expires 7 days
     * after the job completes.
     */
    temporary_srt_url?: string;

    /**
     * Temporary pre-signed URL to download the word-level timestamp JSON. Present when
     * include_words is true. Expires 7 days after the job completes. Download and
     * store this file for long-term access.
     */
    temporary_words_url?: string;

    /**
     * Mux text track ID of the newly uploaded caption track. Omitted when
     * upload_to_mux is false.
     */
    track_id?: string;
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookGeneratePremiumCaptionsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookGeneratePremiumCaptionsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'generate-premium-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookGeneratePremiumCaptionsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookGeneratePremiumCaptionsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookGeneratePremiumCaptionsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookGeneratePremiumCaptionsJobV0.Resources;
}

export namespace WebhookGeneratePremiumCaptionsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to caption.
     */
    asset_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Resolved language code of the generated captions (may differ from the requested
     * code when auto-detected).
     */
    language_code: string;

    /**
     * The transcription model's confidence in its automatic language detection, from 0
     * to 1. Always 1 when language_code was supplied in the request, since detection
     * is skipped.
     */
    auto_language_confidence?: number;

    /**
     * Language code reported by the transcription model. Only a genuine detection when
     * language_code was omitted from the request; when a language_code hint was
     * supplied, detection is skipped and this echoes the requested language.
     */
    detected_language?: string;

    /**
     * @deprecated Use `replaced_tracks` instead.
     */
    replaced_track_id?: string;

    /**
     * Every track deleted before the new track was created. Present when
     * `replace_existing_tracks` was a deleting policy and at least one track was
     * removed.
     */
    replaced_tracks?: Array<Outputs.ReplacedTrack>;

    /**
     * Temporary pre-signed URL to download the generated SRT file. Expires 7 days
     * after the job completes.
     */
    temporary_srt_url?: string;

    /**
     * Temporary pre-signed URL to download the word-level timestamp JSON. Present when
     * include_words is true. Expires 7 days after the job completes. Download and
     * store this file for long-term access.
     */
    temporary_words_url?: string;

    /**
     * Mux text track ID of the newly uploaded caption track. Omitted when
     * upload_to_mux is false.
     */
    track_id?: string;
  }

  export namespace Outputs {
    export interface ReplacedTrack {
      /**
       * Mux track ID of the deleted track.
       */
      id: string;

      /**
       * Language code of the deleted track.
       */
      language_code?: string;

      /**
       * Name of the deleted track.
       */
      name?: string;

      /**
       * `passthrough` value the deleted track carried, if any.
       */
      passthrough?: string;

      /**
       * Mux `text_source` of the deleted track, e.g. `uploaded` or `generated_vod`.
       * Absent for audio tracks.
       */
      text_source?: string;

      /**
       * Mux track type of the deleted track.
       */
      type?: 'text' | 'audio';
    }
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

export interface WebhookLiveStream {
  /**
   * Unique identifier for the Live Stream. Max 255 characters.
   */
  id: string;

  created_at: number;

  /**
   * Latency is the time from when the streamer transmits a frame of video to when
   * you see it in the player. Set this as an alternative to setting low latency or
   * reduced latency flags.
   */
  latency_mode: 'low' | 'reduced' | 'standard';

  /**
   * The time in seconds a live stream may be continuously active before being
   * disconnected. Defaults to 12 hours.
   */
  max_continuous_duration: number;

  /**
   * `idle` indicates that there is no active broadcast. `active` indicates that
   * there is an active broadcast and `disabled` status indicates that no future RTMP
   * streams can be published.
   */
  status: 'active' | 'idle' | 'disabled';

  /**
   * Unique key used for streaming to a Mux RTMP endpoint. This should be considered
   * as sensitive as credentials, anyone with this stream key can begin streaming.
   * Max 64 characters.
   */
  stream_key: string;

  /**
   * The Asset that is currently being created if there is an active broadcast.
   */
  active_asset_id?: string;

  /**
   * The protocol used for the active ingest stream. This is only set when the live
   * stream is active.
   */
  active_ingest_protocol?: 'rtmp' | 'srt';

  /**
   * The live stream only processes the audio track if the value is set to true. Mux
   * drops the video track if broadcasted.
   */
  audio_only?: boolean;

  connected?: boolean;

  /**
   * Describes the embedded closed caption configuration of the incoming live stream.
   */
  embedded_subtitles?: Array<WebhookLiveStream.EmbeddedSubtitle>;

  /**
   * Configure the incoming live stream to include subtitles created with automatic
   * speech recognition. Each Asset created from a live stream with
   * `generated_subtitles` configured will automatically receive two text tracks. The
   * first of these will have a `text_source` value of `generated_live`, and will be
   * available with `ready` status as soon as the stream is live. The second text
   * track will have a `text_source` value of `generated_live_final` and will contain
   * subtitles with improved accuracy, timing, and formatting. However,
   * `generated_live_final` tracks will not be available in `ready` status until the
   * live stream ends. If an Asset has both `generated_live` and
   * `generated_live_final` tracks that are `ready`, then only the
   * `generated_live_final` track will be included during playback.
   */
  generated_subtitles?: Array<WebhookLiveStream.GeneratedSubtitle>;

  /**
   * @deprecated Use `latency_mode` instead.
   */
  low_latency?: boolean;

  /**
   * Customer provided metadata about this live stream.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: WebhookLiveStream.Meta;

  new_asset_settings?: WebhookLiveStream.NewAssetSettings;

  /**
   * Arbitrary user-supplied metadata set for the asset. Max 255 characters.
   */
  passthrough?: string;

  /**
   * An array of Playback ID objects. Use these to create HLS playback URLs. See
   * [Play your videos](https://docs.mux.com/guides/play-your-videos) for more
   * details.
   */
  playback_ids?: Array<WebhookLiveStream.PlaybackIds>;

  /**
   * An array of strings with the most recent Asset IDs that were created from this
   * Live Stream. The most recently generated Asset ID is the last entry in the list.
   */
  recent_asset_ids?: Array<string>;

  /**
   * The URL of the image file that Mux should download and use as slate media during
   * interruptions of the live stream media. This file will be downloaded each time a
   * new recorded asset is created from the live stream. If this is not set, the
   * default slate media will be used.
   */
  reconnect_slate_url?: string;

  /**
   * When live streaming software disconnects from Mux, either intentionally or due
   * to a drop in the network, the Reconnect Window is the time in seconds that Mux
   * should wait for the streaming software to reconnect before considering the live
   * stream finished and completing the recorded asset. **Max**: 1800s (30 minutes).
   *
   * If not specified directly, Standard Latency streams have a Reconnect Window of
   * 60 seconds; Reduced and Low Latency streams have a default of 0 seconds, or no
   * Reconnect Window. For that reason, we suggest specifying a value other than zero
   * for Reduced and Low Latency streams.
   *
   * Reduced and Low Latency streams with a Reconnect Window greater than zero will
   * insert slate media into the recorded asset while waiting for the streaming
   * software to reconnect or when there are brief interruptions in the live stream
   * media. When using a Reconnect Window setting higher than 60 seconds with a
   * Standard Latency stream, we highly recommend enabling slate with the
   * `use_slate_for_standard_latency` option.
   */
  reconnect_window?: number;

  recording?: boolean;

  /**
   * @deprecated Use `latency_mode` instead.
   */
  reduced_latency?: boolean;

  /**
   * Each Simulcast Target contains configuration details to broadcast (or
   * "restream") a live stream to a third-party streaming service.
   * [See the Stream live to 3rd party platforms guide](https://docs.mux.com/guides/stream-live-to-3rd-party-platforms).
   */
  simulcast_targets?: Array<WebhookLiveStream.SimulcastTarget>;

  /**
   * Unique key used for encrypting a stream to a Mux SRT endpoint. Max 64
   * characters.
   */
  srt_passphrase?: string;

  /**
   * True means this live stream is a test live stream. Test live streams can be used
   * to help evaluate the Mux Video APIs for free. There is no limit on the number of
   * test live streams, but they are watermarked with the Mux logo, and limited to 5
   * minutes. The test live stream is disabled after the stream is active for 5 mins
   * and the recorded asset also deleted after 24 hours.
   */
  test?: boolean;

  /**
   * By default, Standard Latency live streams do not have slate media inserted while
   * waiting for live streaming software to reconnect to Mux. Setting this to true
   * enables slate insertion on a Standard Latency stream.
   */
  use_slate_for_standard_latency?: boolean;
}

export namespace WebhookLiveStream {
  export interface EmbeddedSubtitle {
    /**
     * CEA-608 caption channel to read data from.
     */
    language_channel: 'cc1' | 'cc2' | 'cc3' | 'cc4';

    /**
     * The language of the closed caption stream. Value must be BCP 47 compliant.
     */
    language_code: string;

    /**
     * A name for this live stream closed caption track.
     */
    name: string;

    /**
     * Arbitrary user-supplied metadata set for the live stream closed caption track.
     * Max 255 characters.
     */
    passthrough?: string;
  }

  export interface GeneratedSubtitle {
    /**
     * The language of the audio from which subtitles are generated.
     */
    language_code: 'en' | 'en-US' | 'es' | 'fr' | 'de' | 'pt' | 'it';

    /**
     * A name for this live stream subtitle track.
     */
    name: string;

    /**
     * Arbitrary metadata set for the live stream subtitle track. Max 255 characters.
     */
    passthrough?: string;

    /**
     * Unique identifiers for existing Transcription Vocabularies to use while
     * generating subtitles for the live stream. If the Transcription Vocabularies
     * provided collectively have more than 1000 phrases, only the first 1000 phrases
     * will be included.
     */
    transcription_vocabulary_ids?: Array<string>;
  }

  /**
   * Customer provided metadata about this live stream.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  export interface Meta {
    /**
     * The live stream title. Max 512 code points.
     */
    title?: string;
  }

  export interface NewAssetSettings {
    /**
     * An array of playback policy objects that you want applied to this asset and
     * available through `playback_ids`. `advanced_playback_policies` must be used
     * instead of `playback_policies` when creating a DRM playback ID.
     */
    advanced_playback_policies?: Array<NewAssetSettings.AdvancedPlaybackPolicy>;

    /**
     * If the created asset is a clip, this controls whether overlays are copied from
     * the source asset.
     */
    copy_overlays?: boolean;

    /**
     * An array of Mux Robots directives to apply to the asset.
     */
    directives?: Array<NewAssetSettings.Directive>;

    /**
     * @deprecated Use `video_quality` instead.
     */
    encoding_tier?: 'smart' | 'baseline' | 'premium';

    /**
     * Whether to perform shot detection on this asset. Shots are only generated for
     * video assets and will not be generated for audio-only assets.
     */
    generate_shots?: boolean;

    /**
     * An array of objects that each describe an input file to be used to create the
     * asset. As a shortcut, input can also be a string URL for a file when only one
     * input file is used. See `input[].url` for requirements.
     */
    inputs?: Array<NewAssetSettings.Input>;

    /**
     * Specify what level (if any) of support for master access. Master access can be
     * enabled temporarily for your asset to be downloaded. See the
     * [Download your videos guide](https://docs.mux.com/guides/enable-static-mp4-renditions)
     * for more information.
     */
    master_access?: 'none' | 'temporary';

    /**
     * Max resolution tier can be used to control the maximum `resolution_tier` your
     * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
     */
    max_resolution_tier?: '1080p' | '1440p' | '2160p';

    /**
     * Customer provided metadata about this asset.
     *
     * Note: This metadata may be publicly available via the video player. Do not
     * include PII or sensitive information.
     */
    meta?: NewAssetSettings.Meta;

    /**
     * @deprecated See the Static Renditions API
     * (https://www.mux.com/docs/guides/enable-static-mp4-renditions).
     */
    mp4_support?: 'none' | 'standard' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

    /**
     * Normalize the audio track loudness level. This parameter is only applicable to
     * on-demand (not live) assets.
     */
    normalize_audio?: boolean;

    /**
     * You can set this field to anything you want. It will be included in the asset
     * details and related webhooks. If you're looking for more structured metadata,
     * such as `title` or `external_id`, you can use the `meta` object instead. **Max:
     * 255 characters**.
     */
    passthrough?: string;

    /**
     * An array of playback policy names that you want applied to this asset and
     * available through `playback_ids`. Options include:
     *
     * - `"public"` (anyone with the playback URL can stream the asset).
     * - `"signed"` (an additional access token is required to play the asset).
     *
     * If no `playback_policies` are set, the asset will have no playback IDs and will
     * therefore not be playable. For simplicity, a single string name can be used in
     * place of the array in the case of only one playback policy.
     */
    playback_policies?: Array<'public' | 'signed' | 'drm'>;

    /**
     * An array of static renditions to create for this asset. You may not enable both
     * `static_renditions` and the deprecated `mp4_support`.
     */
    static_renditions?: Array<NewAssetSettings.StaticRendition>;

    /**
     * Marks the asset as a test asset when the value is set to true. A Test asset can
     * help evaluate the Mux Video APIs without incurring any cost. There is no limit
     * on number of test assets created. Test asset are watermarked with the Mux logo,
     * limited to 10 seconds, deleted after 24 hrs.
     */
    test?: boolean;

    /**
     * The video quality controls the cost, quality, and available platform features
     * for the asset. The default video quality for an account can be set in the Mux
     * Dashboard. This field replaces the deprecated `encoding_tier` value.
     * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
     */
    video_quality?: 'basic' | 'plus' | 'premium';
  }

  export namespace NewAssetSettings {
    export interface AdvancedPlaybackPolicy {
      /**
       * The DRM configuration used by this playback ID. Must only be set when `policy`
       * is set to `drm`.
       */
      drm_configuration_id?: string;

      /**
       * - `public` playback IDs are accessible by constructing an HLS URL like
       *   `https://stream.mux.com/${PLAYBACK_ID}`
       *
       * - `signed` playback IDs should be used with tokens
       *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
       *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
       *   details about creating tokens.
       *
       * - `drm` playback IDs are protected with DRM technologies.
       *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
       */
      policy?: 'public' | 'signed' | 'drm';
    }

    /**
     * A Mux Robots directive to apply to the asset.
     */
    export interface Directive {
      /**
       * The Mux Robots directive identifier.
       */
      id: string;
    }

    /**
     * An array of objects that each describe an input file to be used to create the
     * asset. As a shortcut, `input` can also be a string URL for a file when only one
     * input file is used. See `input[].url` for requirements.
     */
    export interface Input {
      /**
       * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
       * This optional parameter should be used for tracks with `type` of `text` and
       * `text_type` set to `subtitles`.
       */
      closed_captions?: boolean;

      /**
       * The time offset in seconds from the beginning of the video, indicating the
       * clip's ending marker. The default value is the duration of the video when not
       * included. This parameter is only applicable for creating clips when `input.url`
       * has `mux://assets/{asset_id}` format.
       */
      end_time?: number;

      /**
       * Generate subtitle tracks using automatic speech recognition with this
       * configuration. Subtitles are generated using the audio of the input they are
       * nested within. For direct uploads, this first input should omit the url
       * parameter, as the main input file is provided via the direct upload. Note that
       * subtitle generation happens after initial ingest, so the generated tracks will
       * be in the `preparing` state when the asset transitions to `ready`.
       */
      generated_subtitles?: Array<Input.GeneratedSubtitle>;

      /**
       * The language code value must be a valid
       * [BCP 47](https://tools.ietf.org/html/bcp47) specification compliant value. For
       * example, `en` for English or `en-US` for the US version of English. This
       * parameter is required for `text` and `audio` track types.
       */
      language_code?: string;

      /**
       * The name of the track containing a human-readable description. This value must
       * be unique within each group of `text` or `audio` track types. The HLS manifest
       * will associate a subtitle text track with this value. For example, the value
       * should be "English" for a subtitle text track with `language_code` set to `en`.
       * This optional parameter should be used only for `text` and `audio` type tracks.
       * This parameter can be optionally provided for the first video input to denote
       * the name of the muxed audio track if present. If this parameter is not included,
       * Mux will auto-populate based on the `input[].language_code` value.
       */
      name?: string;

      /**
       * An object that describes how the image file referenced in URL should be placed
       * over the video (i.e. watermarking). Ensure that the URL is active and persists
       * the entire lifespan of the video object.
       */
      overlay_settings?: Input.OverlaySettings;

      /**
       * This optional parameter should be used for tracks with `type` of `text` and
       * `text_type` set to `subtitles`.
       */
      passthrough?: string;

      /**
       * The time offset in seconds from the beginning of the video indicating the clip's
       * starting marker. The default value is 0 when not included. This parameter is
       * only applicable for creating clips when `input.url` has
       * `mux://assets/{asset_id}` format.
       */
      start_time?: number;

      /**
       * Type of text track. Use `subtitles` for subtitles and closed captions, or
       * `chapters` for a chapters track. For more information on Subtitles / Closed
       * Captions,
       * [see this blog post](https://mux.com/blog/subtitles-captions-webvtt-hls-and-those-magic-flags/).
       * This parameter is required for `text` type tracks.
       */
      text_type?: 'subtitles' | 'chapters';

      /**
       * This parameter is required for `text` type tracks.
       */
      type?: 'video' | 'audio' | 'text';

      /**
       * The URL of the file that Mux should download and use.
       *
       * - For the main input file, this should be the URL to the muxed file for Mux to
       *   download, for example an MP4, MOV, MKV, or TS file. Mux supports most
       *   audio/video file formats and codecs, but for fastest processing, you should
       *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
       * - For `audio` tracks, the URL is the location of the audio file for Mux to
       *   download, for example an M4A, WAV, or MP3 file. Mux supports most audio file
       *   formats and codecs, but for fastest processing, you should
       *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
       * - For `text` tracks, the URL is the location of subtitle/captions file. Mux
       *   supports [SubRip Text (SRT)](https://en.wikipedia.org/wiki/SubRip) and
       *   [Web Video Text Tracks](https://www.w3.org/TR/webvtt1/) formats for ingesting
       *   Subtitles and Closed Captions.
       * - For Watermarking or Overlay, the URL is the location of the watermark image.
       *   The maximum size is 4096x4096.
       * - When creating clips from existing Mux assets, the URL is defined with
       *   `mux://assets/{asset_id}` template where `asset_id` is the Asset Identifier
       *   for creating the clip from. The url property may be omitted on the first input
       *   object when providing asset settings for LiveStream and Upload objects, in
       *   order to configure settings related to the primary (live stream or direct
       *   upload) input.
       */
      url?: string;
    }

    export namespace Input {
      export interface GeneratedSubtitle {
        /**
         * The language of the audio from which subtitles are generated. Selecting a
         * language of "auto" will allow language detection to set the language code
         * automatically.
         */
        language_code?:
          | 'en'
          | 'es'
          | 'it'
          | 'pt'
          | 'de'
          | 'fr'
          | 'pl'
          | 'ru'
          | 'nl'
          | 'ca'
          | 'tr'
          | 'sv'
          | 'uk'
          | 'no'
          | 'fi'
          | 'sk'
          | 'el'
          | 'cs'
          | 'hr'
          | 'da'
          | 'ro'
          | 'bg'
          | 'auto';

        /**
         * A name for this subtitle track.
         */
        name?: string;

        /**
         * Arbitrary metadata set for the subtitle track. Max 255 characters.
         */
        passthrough?: string;
      }

      /**
       * An object that describes how the image file referenced in URL should be placed
       * over the video (i.e. watermarking). Ensure that the URL is active and persists
       * the entire lifespan of the video object.
       */
      export interface OverlaySettings {
        /**
         * How tall the overlay should appear. Can be expressed as a percent ("10%") or as
         * a pixel value ("100px"). If both width and height are left blank the height will
         * be the true pixels of the image, applied as if the video has been scaled to fit
         * a 1920x1080 frame. If width is supplied with no height, the height will scale
         * proportionally to the width.
         */
        height?: string;

        /**
         * Where the horizontal positioning of the overlay/watermark should begin from.
         */
        horizontal_align?: 'left' | 'center' | 'right';

        /**
         * The distance from the horizontal_align starting point and the image's closest
         * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
         * Negative values will move the overlay offscreen. In the case of 'center', a
         * positive value will shift the image towards the right and and a negative value
         * will shift it towards the left.
         */
        horizontal_margin?: string;

        /**
         * How opaque the overlay should appear, expressed as a percent. (Default 100%)
         */
        opacity?: string;

        /**
         * Where the vertical positioning of the overlay/watermark should begin from.
         * Defaults to `"top"`
         */
        vertical_align?: 'top' | 'middle' | 'bottom';

        /**
         * The distance from the vertical_align starting point and the image's closest
         * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
         * Negative values will move the overlay offscreen. In the case of 'middle', a
         * positive value will shift the overlay towards the bottom and and a negative
         * value will shift it towards the top.
         */
        vertical_margin?: string;

        /**
         * How wide the overlay should appear. Can be expressed as a percent ("10%") or as
         * a pixel value ("100px"). If both width and height are left blank the width will
         * be the true pixels of the image, applied as if the video has been scaled to fit
         * a 1920x1080 frame. If height is supplied with no width, the width will scale
         * proportionally to the height.
         */
        width?: string;
      }
    }

    /**
     * Customer provided metadata about this asset.
     *
     * Note: This metadata may be publicly available via the video player. Do not
     * include PII or sensitive information.
     */
    export interface Meta {
      /**
       * This is an identifier you provide to keep track of the creator of the asset. Max
       * 128 code points.
       */
      creator_id?: string;

      /**
       * This is an identifier you provide to link the asset to your own data. Max 128
       * code points.
       */
      external_id?: string;

      /**
       * The asset title. Max 512 code points.
       */
      title?: string;
    }

    export interface StaticRendition {
      resolution:
        | 'highest'
        | 'audio-only'
        | '2160p'
        | '1440p'
        | '1080p'
        | '720p'
        | '540p'
        | '480p'
        | '360p'
        | '270p';

      /**
       * Arbitrary user-supplied metadata set for the static rendition. Max 255
       * characters.
       */
      passthrough?: string;
    }
  }

  export interface PlaybackIds {
    /**
     * Unique identifier for the PlaybackID
     */
    id: string;

    /**
     * - `public` playback IDs are accessible by constructing an HLS URL like
     *   `https://stream.mux.com/${PLAYBACK_ID}`
     *
     * - `signed` playback IDs should be used with tokens
     *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
     *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
     *   details about creating tokens.
     *
     * - `drm` playback IDs are protected with DRM technologies.
     *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
     */
    policy: 'public' | 'signed' | 'drm';

    /**
     * The DRM configuration used by this playback ID. Must only be set when `policy`
     * is set to `drm`.
     */
    drm_configuration_id?: string;
  }

  export interface SimulcastTarget {
    /**
     * ID of the Simulcast Target
     */
    id: string;

    /**
     * The current status of the simulcast target. See Statuses below for detailed
     * description.
     *
     * - `idle`: Default status. When the parent live stream is in disconnected status,
     *   simulcast targets will be idle state.
     * - `starting`: The simulcast target transitions into this state when the parent
     *   live stream transition into connected state.
     * - `broadcasting`: The simulcast target has successfully connected to the third
     *   party live streaming service and is pushing video to that service.
     * - `errored`: The simulcast target encountered an error either while attempting
     *   to connect to the third party live streaming service, or mid-broadcasting.
     *   When a simulcast target has this status it will have an `error_severity` field
     *   with more details about the error.
     */
    status: 'idle' | 'starting' | 'broadcasting' | 'errored';

    /**
     * The RTMP(s) or SRT endpoint for a simulcast destination.
     *
     * - For RTMP(s) destinations, this should include the application name for the
     *   third party live streaming service, for example:
     *   `rtmp://live.example.com/app`.
     * - For SRT destinations, this should be a fully formed SRT connection string, for
     *   example:
     *   `srt://srt-live.example.com:1234?streamid={stream_key}&passphrase={srt_passphrase}`.
     *
     * Note: SRT simulcast targets can only be used when an source is connected over
     * SRT.
     */
    url: string;

    /**
     * The severity of the error encountered by the simulcast target. This field is
     * only set when the simulcast target is in the `errored` status. See the values of
     * severities below and their descriptions.
     *
     * - `normal`: The simulcast target encountered an error either while attempting to
     *   connect to the third party live streaming service, or mid-broadcasting. A
     *   simulcast may transition back into the broadcasting state if a connection with
     *   the service can be re-established.
     * - `fatal`: The simulcast target is incompatible with the current input to the
     *   parent live stream. No further attempts to this simulcast target will be made
     *   for the current live stream asset.
     */
    error_severity?: 'normal' | 'fatal';

    /**
     * Arbitrary user-supplied metadata set when creating a simulcast target.
     */
    passthrough?: string;

    /**
     * Stream Key represents a stream identifier on the third party live streaming
     * service to send the parent live stream to. Only used for RTMP(s) simulcast
     * destinations.
     */
    stream_key?: string;
  }
}

export interface WebhookLiveStreamWarning {
  /**
   * Unique identifier for the Live Stream. Max 255 characters.
   */
  id?: string;

  /**
   * The Asset that is currently being created if there is an active broadcast.
   */
  active_asset_id?: string;

  /**
   * Arbitrary user-supplied metadata set for the asset. Max 255 characters.
   */
  passthrough?: string;

  /**
   * `idle` indicates that there is no active broadcast. `active` indicates that
   * there is an active broadcast and `disabled` status indicates that no future RTMP
   * streams can be published.
   */
  status?: 'active' | 'idle' | 'disabled';

  /**
   * Unique key used for streaming to a Mux RTMP endpoint. This should be considered
   * as sensitive as credentials, anyone with this stream key can begin streaming.
   * Max 64 characters.
   */
  stream_key?: string;

  warning?: WebhookLiveStreamWarning.Warning;
}

export namespace WebhookLiveStreamWarning {
  export interface Warning {
    /**
     * Human-readable detail for the warning.
     */
    message?: string;

    /**
     * Short identifier for the warning, e.g. `custom_slate_unavailable`,
     * `custom_slate_invalid`, `custom_slate_error`, `embedded_subtitles_unsupported`.
     * New values may be added.
     */
    type?: string;
  }
}

/**
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookModerateJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookModerateJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'moderate';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookModerateJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookModerateJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookModerateJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookModerateJob.Resources;
}

export namespace WebhookModerateJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to moderate.
     */
    asset_id: string;

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
    on_flagged?: Parameters.OnFlagged;

    /**
     * Curated controls that optionally restrict moderation to an asset time range.
     */
    output_steering?: Parameters.OutputSteering;

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
     * Optional action taken automatically when exceeds_threshold is true. When
     * omitted, the job only reports scores and takes no action. Note: in a directive
     * run that targets the same asset with other workflows, deleting playback IDs can
     * break sibling workflows that need a playback ID.
     */
    export interface OnFlagged {
      /**
       * Action to take when exceeds_threshold is true. "delete_playback_ids" deletes
       * every playback ID on the asset, making it unplayable while preserving the
       * underlying asset so it can be re-published or reviewed.
       */
      action: 'delete_playback_ids';
    }

    /**
     * Curated controls that optionally restrict moderation to an asset time range.
     */
    export interface OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * True if any category's max score exceeds its configured threshold.
     */
    exceeds_threshold: boolean;

    /**
     * Highest scores across all thumbnails for each category.
     */
    max_scores: Outputs.MaxScores;

    /**
     * Per-thumbnail moderation scores.
     */
    thumbnail_scores: Array<Outputs.ThumbnailScore>;

    /**
     * Present only when on_flagged was set and exceeds_threshold was true. Records the
     * action taken and which playback IDs were deleted.
     */
    flagged_action?: Outputs.FlaggedAction;
  }

  export namespace Outputs {
    /**
     * Highest scores across all thumbnails for each category.
     */
    export interface MaxScores {
      sexual: number;

      violence: number;
    }

    export interface ThumbnailScore {
      /**
       * Sexual content score from 0.0 to 1.0.
       */
      sexual: number;

      /**
       * Violence content score from 0.0 to 1.0.
       */
      violence: number;

      /**
       * Time in seconds of the thumbnail within the video. Absent for transcript
       * moderation.
       */
      time?: number;
    }

    /**
     * Present only when on_flagged was set and exceeds_threshold was true. Records the
     * action taken and which playback IDs were deleted.
     */
    export interface FlaggedAction {
      action: 'delete_playback_ids';

      /**
       * Playback IDs that were deleted from the asset because it exceeded the threshold.
       */
      deleted_playback_ids: Array<string>;
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookModerateJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookModerateJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'moderate';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookModerateJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookModerateJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookModerateJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookModerateJobV0.Resources;
}

export namespace WebhookModerateJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to moderate.
     */
    asset_id: string;

    /**
     * BCP 47 language code of the caption track to moderate. Used only for audio-only
     * assets; ignored for video assets. When omitted, an English subtitles track is
     * preferred and otherwise the first ready text track is used.
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
    on_flagged?: Parameters.OnFlagged;

    /**
     * Curated controls that optionally restrict moderation to an asset time range.
     */
    output_steering?: Parameters.OutputSteering;

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
     * Optional action taken automatically when exceeds_threshold is true. When
     * omitted, the job only reports scores and takes no action. Note: in a directive
     * run that targets the same asset with other workflows, deleting playback IDs can
     * break sibling workflows that need a playback ID.
     */
    export interface OnFlagged {
      /**
       * Action to take when exceeds_threshold is true. "delete_playback_ids" deletes
       * every playback ID on the asset, making it unplayable while preserving the
       * underlying asset so it can be re-published or reviewed.
       */
      action: 'delete_playback_ids';
    }

    /**
     * Curated controls that optionally restrict moderation to an asset time range.
     */
    export interface OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }
    }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * True if any category's max score exceeds its configured threshold.
     */
    exceeds_threshold: boolean;

    /**
     * Highest scores across all thumbnails for each category.
     */
    max_scores: Outputs.MaxScores;

    /**
     * Per-thumbnail moderation scores.
     */
    thumbnail_scores: Array<Outputs.ThumbnailScore>;

    /**
     * Present only when on_flagged was set and exceeds_threshold was true. Records the
     * action taken and which playback IDs were deleted.
     */
    flagged_action?: Outputs.FlaggedAction;
  }

  export namespace Outputs {
    /**
     * Highest scores across all thumbnails for each category.
     */
    export interface MaxScores {
      sexual: number;

      violence: number;
    }

    export interface ThumbnailScore {
      /**
       * Sexual content score from 0.0 to 1.0.
       */
      sexual: number;

      /**
       * Violence content score from 0.0 to 1.0.
       */
      violence: number;

      /**
       * Time in seconds of the thumbnail within the video. Absent for transcript
       * moderation.
       */
      time?: number;
    }

    /**
     * Present only when on_flagged was set and exceeds_threshold was true. Records the
     * action taken and which playback IDs were deleted.
     */
    export interface FlaggedAction {
      action: 'delete_playback_ids';

      /**
       * Playback IDs that were deleted from the asset because it exceeded the threshold.
       */
      deleted_playback_ids: Array<string>;
    }
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

export interface WebhookSimulcastTarget {
  /**
   * ID of the Simulcast Target
   */
  id: string;

  /**
   * The current status of the simulcast target. See Statuses below for detailed
   * description.
   *
   * - `idle`: Default status. When the parent live stream is in disconnected status,
   *   simulcast targets will be idle state.
   * - `starting`: The simulcast target transitions into this state when the parent
   *   live stream transition into connected state.
   * - `broadcasting`: The simulcast target has successfully connected to the third
   *   party live streaming service and is pushing video to that service.
   * - `errored`: The simulcast target encountered an error either while attempting
   *   to connect to the third party live streaming service, or mid-broadcasting.
   *   When a simulcast target has this status it will have an `error_severity` field
   *   with more details about the error.
   */
  status: 'idle' | 'starting' | 'broadcasting' | 'errored';

  /**
   * The RTMP(s) or SRT endpoint for a simulcast destination.
   *
   * - For RTMP(s) destinations, this should include the application name for the
   *   third party live streaming service, for example:
   *   `rtmp://live.example.com/app`.
   * - For SRT destinations, this should be a fully formed SRT connection string, for
   *   example:
   *   `srt://srt-live.example.com:1234?streamid={stream_key}&passphrase={srt_passphrase}`.
   *
   * Note: SRT simulcast targets can only be used when an source is connected over
   * SRT.
   */
  url: string;

  /**
   * The severity of the error encountered by the simulcast target. This field is
   * only set when the simulcast target is in the `errored` status. See the values of
   * severities below and their descriptions.
   *
   * - `normal`: The simulcast target encountered an error either while attempting to
   *   connect to the third party live streaming service, or mid-broadcasting. A
   *   simulcast may transition back into the broadcasting state if a connection with
   *   the service can be re-established.
   * - `fatal`: The simulcast target is incompatible with the current input to the
   *   parent live stream. No further attempts to this simulcast target will be made
   *   for the current live stream asset.
   */
  error_severity?: 'normal' | 'fatal';

  /**
   * Unique identifier for the Live Stream. Max 255 characters.
   */
  live_stream_id?: string;

  /**
   * Arbitrary user-supplied metadata set when creating a simulcast target.
   */
  passthrough?: string;

  /**
   * Stream Key represents a stream identifier on the third party live streaming
   * service to send the parent live stream to. Only used for RTMP(s) simulcast
   * destinations.
   */
  stream_key?: string;
}

/**
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookSummarizeJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookSummarizeJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookSummarizeJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookSummarizeJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookSummarizeJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookSummarizeJob.Resources;
}

export namespace WebhookSummarizeJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to summarize.
     */
    asset_id: string;

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
    output_steering?: Parameters.OutputSteering;

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

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, summary style, audience,
     * brand terminology, and tag taxonomy. Scope is enforced; other controls guide
     * model behavior but do not guarantee exact output.
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
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

      /**
       * Best-effort style guidance for the generated title and description.
       */
      summary_style?: 'concise' | 'detailed' | 'editorial';

      /**
       * Controlled vocabulary for tag generation. This steers tags and may be
       * deterministically filtered after generation. Supports up to 50 values and 2000
       * serialized characters.
       */
      tag_taxonomy?: OutputSteering.TagTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary for tag generation. This steers tags and may be
       * deterministically filtered after generation. Supports up to 50 values and 2000
       * serialized characters.
       */
      export interface TagTaxonomy {
        /**
         * When false, generated tags are filtered to taxonomy labels and aliases. When
         * true, unmatched tags may remain.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values for generated tags. Supports 1-50 values.
         */
        values: Array<TagTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy, up to 100 characters.
         */
        name?: string;
      }

      export namespace TagTaxonomy {
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
    }
  }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
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

    /**
     * Recorded asset title update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
    /**
     * Recorded asset title update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    export interface AssetUpdates {
      title?: AssetUpdates.Title;
    }

    export namespace AssetUpdates {
      export interface Title {
        /**
         * Outcome of the requested asset title update.
         */
        status: 'updated' | 'failed';
      }
    }
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookSummarizeJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookSummarizeJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

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
  directive?: WebhookSummarizeJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookSummarizeJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookSummarizeJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookSummarizeJobV0.Resources;
}

export namespace WebhookSummarizeJobV0 {
  export interface Parameters {
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
    output_steering?: Parameters.OutputSteering;

    /**
     * @deprecated Use `output_steering` instead.
     */
    prompt_overrides?: Parameters.PromptOverrides;

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

  export namespace Parameters {
    /**
     * Curated output_steering controls for execution scope, summary style, audience,
     * brand terminology, and tag taxonomy. Scope is enforced; other controls guide
     * model behavior but do not guarantee exact output.
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
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      scope?: OutputSteering.Scope;

      /**
       * Best-effort style guidance for the generated title and description.
       */
      summary_style?: 'concise' | 'detailed' | 'editorial';

      /**
       * Controlled vocabulary for tag generation. This steers tags and may be
       * deterministically filtered after generation. Supports up to 50 values and 2000
       * serialized characters.
       */
      tag_taxonomy?: OutputSteering.TagTaxonomy;
    }

    export namespace OutputSteering {
      /**
       * Optional media execution window. Results remain timestamped against the original
       * media timeline.
       */
      export interface Scope {
        /**
         * End of the execution window in seconds from the beginning of the media. When
         * omitted, the window extends to the end.
         */
        end_time?: number;

        /**
         * Start of the execution window in seconds from the beginning of the media. When
         * omitted, the window starts at the beginning.
         */
        start_time?: number;
      }

      /**
       * Controlled vocabulary for tag generation. This steers tags and may be
       * deterministically filtered after generation. Supports up to 50 values and 2000
       * serialized characters.
       */
      export interface TagTaxonomy {
        /**
         * When false, generated tags are filtered to taxonomy labels and aliases. When
         * true, unmatched tags may remain.
         */
        allow_other: boolean;

        /**
         * Controlled vocabulary values for generated tags. Supports 1-50 values.
         */
        values: Array<TagTaxonomy.Value>;

        /**
         * Optional customer-facing name for the taxonomy, up to 100 characters.
         */
        name?: string;
      }

      export namespace TagTaxonomy {
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
    }

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
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

    /**
     * Recorded asset title update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    asset_updates?: Outputs.AssetUpdates;
  }

  export namespace Outputs {
    /**
     * Recorded asset title update outcome. Omitted when no outcome was recorded,
     * including historical jobs.
     */
    export interface AssetUpdates {
      title?: AssetUpdates.Title;
    }

    export namespace AssetUpdates {
      export interface Title {
        /**
         * Outcome of the requested asset title update.
         */
        status: 'updated' | 'failed';
      }
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookTranslateAudioJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookTranslateAudioJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'translate-audio';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookTranslateAudioJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookTranslateAudioJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookTranslateAudioJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookTranslateAudioJob.Resources;
}

export namespace WebhookTranslateAudioJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to translate.
     */
    asset_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * IDs of tracks deleted during replacement. Omitted when no deletions were
     * recorded; historical jobs may lack this information.
     */
    replaced_track_ids?: Array<string>;

    /**
     * Temporary pre-signed URL to download the dubbed audio file. Expires 7 days after
     * the job completes.
     */
    temporary_audio_url?: string;

    /**
     * Mux audio track ID, present when upload_to_mux is true.
     */
    track_id?: string;
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookTranslateAudioJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookTranslateAudioJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'translate-audio';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookTranslateAudioJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookTranslateAudioJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookTranslateAudioJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookTranslateAudioJobV0.Resources;
}

export namespace WebhookTranslateAudioJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video to translate.
     */
    asset_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Every track deleted before the new track was created. Present when
     * `replace_existing_tracks` was a deleting policy and at least one track was
     * removed.
     */
    replaced_tracks?: Array<Outputs.ReplacedTrack>;

    /**
     * Temporary pre-signed URL to download the dubbed audio file. Expires 7 days after
     * the job completes.
     */
    temporary_audio_url?: string;

    /**
     * Mux audio track ID, present when upload_to_mux is true.
     */
    uploaded_track_id?: string;
  }

  export namespace Outputs {
    export interface ReplacedTrack {
      /**
       * Mux track ID of the deleted track.
       */
      id: string;

      /**
       * Language code of the deleted track.
       */
      language_code?: string;

      /**
       * Name of the deleted track.
       */
      name?: string;

      /**
       * `passthrough` value the deleted track carried, if any.
       */
      passthrough?: string;

      /**
       * Mux `text_source` of the deleted track, e.g. `uploaded` or `generated_vod`.
       * Absent for audio tracks.
       */
      text_source?: string;

      /**
       * Mux track type of the deleted track.
       */
      type?: 'text' | 'audio';
    }
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
 * Version 1 job delivered in the Mux webhook event data field. The event type
 * identifies its workflow and transition.
 */
export interface WebhookTranslateCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookTranslateCaptionsJob.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'translate-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookTranslateCaptionsJob.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookTranslateCaptionsJob.Error>;

  /**
   * Workflow results. Present when status is completed.
   */
  outputs?: WebhookTranslateCaptionsJob.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookTranslateCaptionsJob.Resources;
}

export namespace WebhookTranslateCaptionsJob {
  export interface Parameters {
    /**
     * The Mux asset ID of the video whose captions will be translated.
     */
    asset_id: string;

    /**
     * BCP 47 language code for the translated output (e.g. "es", "ja"). Unless
     * replace_existing_tracks allows replacement, the asset must not already have a
     * text track for this language.
     */
    output_language_code: string;

    /**
     * Mux text track ID of the source captions. Must identify a ready subtitle track,
     * or the single ready legacy text transcript without subtitle metadata on an
     * audio-only asset. A missing or unready source is rejected.
     */
    track_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is completed.
   */
  export interface Outputs {
    /**
     * Present when never_translate terms were supplied. False when at least one term
     * was not preserved verbatim in the translated captions. Preservation is
     * best-effort: verified, not guaranteed.
     */
    never_translate_terms_preserved?: boolean;

    /**
     * IDs of tracks deleted during replacement. Omitted when no deletions were
     * recorded; historical jobs may lack this information.
     */
    replaced_track_ids?: Array<string>;

    /**
     * Temporary pre-signed URL to download the translated VTT file, including when
     * upload_to_mux is false. Expires 7 days after the job completes.
     */
    temporary_vtt_url?: string;

    /**
     * Mux text track ID of the newly created translated captions, distinct from the
     * source parameters.track_id. Present when upload_to_mux is true.
     */
    track_id?: string;
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
 * Job object delivered in the Mux webhook event's data field. The event type
 * identifies the workflow and transition.
 */
export interface WebhookTranslateCaptionsJobV0 {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: WebhookTranslateCaptionsJobV0.Parameters;

  /**
   * Current job status.
   */
  status: 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

  /**
   * Number of Mux AI units consumed by this job.
   */
  units_consumed: number;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  workflow: 'translate-captions';

  /**
   * The directive run that dispatched this job. Absent for jobs created via direct
   * API POST.
   */
  directive?: WebhookTranslateCaptionsJobV0.Directive;

  /**
   * Error details. Present when status is 'errored'.
   */
  errors?: Array<WebhookTranslateCaptionsJobV0.Error>;

  /**
   * Workflow results. Present when status is 'completed'.
   */
  outputs?: WebhookTranslateCaptionsJobV0.Outputs;

  /**
   * Arbitrary string supplied at creation, returned as-is.
   */
  passthrough?: string;

  /**
   * Related Mux resources linked to this job.
   */
  resources?: WebhookTranslateCaptionsJobV0.Resources;
}

export namespace WebhookTranslateCaptionsJobV0 {
  export interface Parameters {
    /**
     * The Mux asset ID of the video whose captions will be translated.
     */
    asset_id: string;

    /**
     * BCP 47 language code for the translated output (e.g. "es", "ja"). Unless
     * replace_existing_tracks allows replacement, the asset must not already have a
     * text track for this language.
     */
    to_language_code: string;

    /**
     * The Mux text track ID of the source caption track to translate. The asset must
     * have a ready text track matching this ID or the request will be rejected.
     */
    track_id: string;

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
    replace_existing_tracks?: 'fail' | 'replace_all' | 'replace_generated';

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

  export interface Error {
    /**
     * Human-readable public error message.
     */
    message: string;

    /**
     * Stable public error category identifier.
     */
    type: string;

    /**
     * Whether retrying this job may resolve the error.
     */
    retryable?: boolean;
  }

  /**
   * Workflow results. Present when status is 'completed'.
   */
  export interface Outputs {
    /**
     * Present when never_translate terms were supplied. False when at least one term
     * was not preserved verbatim in the translated captions. Preservation is
     * best-effort: verified, not guaranteed.
     */
    never_translate_terms_preserved?: boolean;

    /**
     * Every track deleted before the new track was created. Present when
     * `replace_existing_tracks` was a deleting policy and at least one track was
     * removed.
     */
    replaced_tracks?: Array<Outputs.ReplacedTrack>;

    /**
     * Temporary pre-signed URL to download the translated VTT file, including when
     * upload_to_mux is false. Expires 7 days after the job completes.
     */
    temporary_vtt_url?: string;

    /**
     * Mux text track ID of the uploaded translated captions. Present when
     * upload_to_mux is true.
     */
    uploaded_track_id?: string;
  }

  export namespace Outputs {
    export interface ReplacedTrack {
      /**
       * Mux track ID of the deleted track.
       */
      id: string;

      /**
       * Language code of the deleted track.
       */
      language_code?: string;

      /**
       * Name of the deleted track.
       */
      name?: string;

      /**
       * `passthrough` value the deleted track carried, if any.
       */
      passthrough?: string;

      /**
       * Mux `text_source` of the deleted track, e.g. `uploaded` or `generated_vod`.
       * Absent for audio tracks.
       */
      text_source?: string;

      /**
       * Mux track type of the deleted track.
       */
      type?: 'text' | 'audio';
    }
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

export interface WebhookVideoDeliveryHighTraffic {
  id?: string;

  data?: Array<WebhookVideoDeliveryHighTraffic.Data>;

  /**
   * Current threshold set for alerting
   */
  threshold?: number;

  timeframe?: Array<number>;
}

export namespace WebhookVideoDeliveryHighTraffic {
  export interface Data {
    /**
     * The duration of the asset in seconds.
     */
    asset_duration: number;

    /**
     * @deprecated Use `asset_video_quality` instead.
     */
    asset_encoding_tier: 'smart' | 'baseline' | 'premium';

    /**
     * Unique identifier for the asset.
     */
    asset_id: string;

    /**
     * The resolution tier that the asset was ingested at, affecting billing for ingest
     * & storage
     */
    asset_resolution_tier: 'audio-only' | '720p' | '1080p' | '1440p' | '2160p';

    /**
     * The state of the asset.
     */
    asset_state: 'ready' | 'errored' | 'deleted';

    /**
     * Time at which the asset was created. Measured in seconds since the Unix epoch.
     */
    created_at: number;

    /**
     * Total number of delivered seconds during this time window.
     */
    delivered_seconds: number;

    /**
     * Seconds delivered broken into resolution tiers. Each tier will only be displayed
     * if there was content delivered in the tier.
     */
    delivered_seconds_by_resolution: Data.DeliveredSecondsByResolution;

    /**
     * The video quality that the asset was ingested at. This field replaces
     * `asset_encoding_tier`.
     * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
     */
    asset_video_quality?: 'basic' | 'plus' | 'premium';

    /**
     * If exists, time at which the asset was deleted. Measured in seconds since the
     * Unix epoch.
     */
    deleted_at?: number;

    /**
     * Unique identifier for the live stream that created the asset.
     */
    live_stream_id?: string;

    /**
     * The `passthrough` value for the asset.
     */
    passthrough?: string;
  }

  export namespace Data {
    /**
     * Seconds delivered broken into resolution tiers. Each tier will only be displayed
     * if there was content delivered in the tier.
     */
    export interface DeliveredSecondsByResolution {
      /**
       * Total number of delivered seconds during this time window that had a resolution
       * larger than the 720p tier but less than or equal to the 1440p tier (over 921,600
       * and <= 2,073,600 pixels total).
       */
      tier_1080p?: number;

      /**
       * Total number of delivered seconds during this time window that had a resolution
       * larger than the 1080p tier but less than or equal to the 2160p tier (over
       * 2,073,600 and <= 4,194,304 pixels total).
       */
      tier_1440p?: number;

      /**
       * Total number of delivered seconds during this time window that had a resolution
       * larger than the 1440p tier (over 4,194,304 pixels total).
       */
      tier_2160p?: number;

      /**
       * Total number of delivered seconds during this time window that had a resolution
       * within the 720p tier (up to 921,600 pixels total, based on typical 1280x720).
       */
      tier_720p?: number;

      /**
       * Total number of delivered seconds during this time window that had a resolution
       * of audio only.
       */
      tier_audio_only?: number;
    }
  }
}

export interface VideoAssetCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.created';
}

export interface VideoAssetReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.ready';
}

export interface VideoAssetErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.errored';
}

export interface VideoAssetUpdatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.updated';
}

export interface VideoAssetDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.deleted';
}

export interface VideoAssetLiveStreamCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.live_stream_completed';
}

export interface VideoAssetStaticRenditionsReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.static_renditions.ready';
}

export interface VideoAssetStaticRenditionsPreparingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.static_renditions.preparing';
}

export interface VideoAssetStaticRenditionsDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.static_renditions.deleted';
}

export interface VideoAssetStaticRenditionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.static_renditions.errored';
}

export interface VideoAssetMasterReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.master.ready';
}

export interface VideoAssetMasterPreparingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.master.preparing';
}

export interface VideoAssetMasterDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.master.deleted';
}

export interface VideoAssetMasterErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.master.errored';
}

export interface VideoAssetTrackCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetTrack;

  type: 'video.asset.track.created';
}

export interface VideoAssetTrackReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetTrack;

  type: 'video.asset.track.ready';
}

export interface VideoAssetTrackErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetTrack;

  type: 'video.asset.track.errored';
}

export interface VideoAssetTrackDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetTrack;

  type: 'video.asset.track.deleted';
}

export interface VideoAssetShotsCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * The results of generating shots on the video
   */
  data: VideoAssetShotsCreatedWebhookEvent.Data;

  type: 'video.asset.shots.created';
}

export namespace VideoAssetShotsCreatedWebhookEvent {
  /**
   * The results of generating shots on the video
   */
  export interface Data {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * Unique identifier for the Asset. Max 255 characters.
     */
    asset_id?: string;

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Data.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Data {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }
}

export interface VideoAssetShotsReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * The results of generating shots on the video
   */
  data: VideoAssetShotsReadyWebhookEvent.Data;

  type: 'video.asset.shots.ready';
}

export namespace VideoAssetShotsReadyWebhookEvent {
  /**
   * The results of generating shots on the video
   */
  export interface Data {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * Unique identifier for the Asset. Max 255 characters.
     */
    asset_id?: string;

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Data.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Data {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }
}

export interface VideoAssetShotsSkippedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * The results of generating shots on the video
   */
  data: VideoAssetShotsSkippedWebhookEvent.Data;

  type: 'video.asset.shots.skipped';
}

export namespace VideoAssetShotsSkippedWebhookEvent {
  /**
   * The results of generating shots on the video
   */
  export interface Data {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * Unique identifier for the Asset. Max 255 characters.
     */
    asset_id?: string;

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Data.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Data {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }
}

export interface VideoAssetShotsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * The results of generating shots on the video
   */
  data: VideoAssetShotsErroredWebhookEvent.Data;

  type: 'video.asset.shots.errored';
}

export namespace VideoAssetShotsErroredWebhookEvent {
  /**
   * The results of generating shots on the video
   */
  export interface Data {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * Unique identifier for the Asset. Max 255 characters.
     */
    asset_id?: string;

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Data.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Data {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }
}

export interface VideoAssetShotsDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * The results of generating shots on the video
   */
  data: VideoAssetShotsDeletedWebhookEvent.Data;

  type: 'video.asset.shots.deleted';
}

export namespace VideoAssetShotsDeletedWebhookEvent {
  /**
   * The results of generating shots on the video
   */
  export interface Data {
    created_at: number;

    /**
     * The status of the shot detection process
     */
    status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

    /**
     * Unique identifier for the Asset. Max 255 characters.
     */
    asset_id?: string;

    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    errors?: Data.Errors;

    /**
     * A URL to a JSON manifest describing the shot changes detected in the video along
     * with shot preview images for each shot. This field is only present when `status`
     * is `completed`.
     */
    shots_manifest_url?: string;
  }

  export namespace Data {
    /**
     * An object describing any errors encountered during the shot detection process.
     * This field is only present when `status` is `errored`.
     */
    export interface Errors {
      /**
       * A list of error messages describing the errors that occurred in more detail
       */
      messages?: Array<string>;

      /**
       * The type of error that occurred
       */
      type?: string;
    }
  }
}

export interface VideoAssetStaticRenditionCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetStaticRendition;

  type: 'video.asset.static_rendition.created';
}

export interface VideoAssetStaticRenditionReadyWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetStaticRendition;

  type: 'video.asset.static_rendition.ready';
}

export interface VideoAssetStaticRenditionErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetStaticRendition;

  type: 'video.asset.static_rendition.errored';
}

export interface VideoAssetStaticRenditionDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetStaticRendition;

  type: 'video.asset.static_rendition.deleted';
}

export interface VideoAssetStaticRenditionSkippedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetStaticRendition;

  type: 'video.asset.static_rendition.skipped';
}

export interface VideoAssetWarningWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAssetWarning;

  type: 'video.asset.warning';
}

export interface VideoAssetNonStandardInputDetectedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookAsset;

  type: 'video.asset.non_standard_input_detected';
}

export interface VideoUploadAssetCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookDirectUpload;

  type: 'video.upload.asset_created';
}

export interface VideoUploadCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookDirectUpload;

  type: 'video.upload.cancelled';
}

export interface VideoUploadCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookDirectUpload;

  type: 'video.upload.created';
}

export interface VideoUploadErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookDirectUpload;

  type: 'video.upload.errored';
}

export interface VideoLiveStreamCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.created';
}

export interface VideoLiveStreamConnectedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.connected';
}

export interface VideoLiveStreamRecordingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.recording';
}

export interface VideoLiveStreamActiveWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.active';
}

export interface VideoLiveStreamDisconnectedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.disconnected';
}

export interface VideoLiveStreamIdleWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.idle';
}

export interface VideoLiveStreamUpdatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.updated';
}

export interface VideoLiveStreamEnabledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.enabled';
}

export interface VideoLiveStreamDisabledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.disabled';
}

export interface VideoLiveStreamDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStream;

  type: 'video.live_stream.deleted';
}

export interface VideoLiveStreamWarningWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookLiveStreamWarning;

  type: 'video.live_stream.warning';
}

export interface VideoLiveStreamSimulcastTargetCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.created';
}

export interface VideoLiveStreamSimulcastTargetIdleWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.idle';
}

export interface VideoLiveStreamSimulcastTargetStartingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.starting';
}

export interface VideoLiveStreamSimulcastTargetBroadcastingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.broadcasting';
}

export interface VideoLiveStreamSimulcastTargetErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.errored';
}

export interface VideoLiveStreamSimulcastTargetDeletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.deleted';
}

export interface VideoLiveStreamSimulcastTargetUpdatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookSimulcastTarget;

  type: 'video.live_stream.simulcast_target.updated';
}

export interface VideoDeliveryHighTrafficWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  data: WebhookVideoDeliveryHighTraffic;

  type: 'video.delivery.high_traffic';
}

export interface RobotsDirectiveRunCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  data: RobotsDirectiveRunCompletedWebhookEvent.Data;

  type: 'robots.directive_run.completed';
}

export namespace RobotsDirectiveRunCompletedWebhookEvent {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  export interface Data {
    /**
     * Unique run identifier (drvrun\_...).
     */
    id: string;

    /**
     * The Mux asset ID this run targeted.
     */
    asset_id: string;

    /**
     * Unix timestamp (seconds) when the run reached terminal state. Null if still in
     * progress.
     */
    completed_at: number | null;

    /**
     * The directive this run belongs to (drv\_...).
     */
    directive_id: string;

    /**
     * Per-binding status entries, one per binding, in the order the bindings appear in
     * `directive.workflows[]`.
     */
    node_states: Array<
      | Data.NodeStateDispatched
      | Data.NodeStateFailed
      | Data.NodeStateWaitingForResources
      | Data.NodeStateWaitingForSourceWorkflow
    >;

    /**
     * Unix timestamp (seconds) when the run started.
     */
    started_at: number;

    /**
     * Run status.
     */
    status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';
  }

  export namespace Data {
    export interface NodeStateDispatched {
      /**
       * Workflow job ID (rjob\_...).
       */
      job_id: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'dispatched';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateFailed {
      /**
       * Human-readable diagnostic explaining why the binding didn't dispatch.
       */
      reason: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'failed';
    }

    export interface NodeStateWaitingForResources {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'waiting_for_resources';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateWaitingForSourceWorkflow {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      /**
       * reference_ids of producer bindings within this directive that must complete
       * before this binding can dispatch.
       */
      source_workflows: Array<string>;

      status: 'waiting_for_source_workflow';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }
  }
}

export interface RobotsDirectiveRunCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  data: RobotsDirectiveRunCreatedWebhookEvent.Data;

  type: 'robots.directive_run.created';
}

export namespace RobotsDirectiveRunCreatedWebhookEvent {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  export interface Data {
    /**
     * Unique run identifier (drvrun\_...).
     */
    id: string;

    /**
     * The Mux asset ID this run targeted.
     */
    asset_id: string;

    /**
     * Unix timestamp (seconds) when the run reached terminal state. Null if still in
     * progress.
     */
    completed_at: number | null;

    /**
     * The directive this run belongs to (drv\_...).
     */
    directive_id: string;

    /**
     * Per-binding status entries, one per binding, in the order the bindings appear in
     * `directive.workflows[]`.
     */
    node_states: Array<
      | Data.NodeStateDispatched
      | Data.NodeStateFailed
      | Data.NodeStateWaitingForResources
      | Data.NodeStateWaitingForSourceWorkflow
    >;

    /**
     * Unix timestamp (seconds) when the run started.
     */
    started_at: number;

    /**
     * Run status.
     */
    status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';
  }

  export namespace Data {
    export interface NodeStateDispatched {
      /**
       * Workflow job ID (rjob\_...).
       */
      job_id: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'dispatched';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateFailed {
      /**
       * Human-readable diagnostic explaining why the binding didn't dispatch.
       */
      reason: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'failed';
    }

    export interface NodeStateWaitingForResources {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'waiting_for_resources';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateWaitingForSourceWorkflow {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      /**
       * reference_ids of producer bindings within this directive that must complete
       * before this binding can dispatch.
       */
      source_workflows: Array<string>;

      status: 'waiting_for_source_workflow';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }
  }
}

export interface RobotsDirectiveRunErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  data: RobotsDirectiveRunErroredWebhookEvent.Data;

  type: 'robots.directive_run.errored';
}

export namespace RobotsDirectiveRunErroredWebhookEvent {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  export interface Data {
    /**
     * Unique run identifier (drvrun\_...).
     */
    id: string;

    /**
     * The Mux asset ID this run targeted.
     */
    asset_id: string;

    /**
     * Unix timestamp (seconds) when the run reached terminal state. Null if still in
     * progress.
     */
    completed_at: number | null;

    /**
     * The directive this run belongs to (drv\_...).
     */
    directive_id: string;

    /**
     * Per-binding status entries, one per binding, in the order the bindings appear in
     * `directive.workflows[]`.
     */
    node_states: Array<
      | Data.NodeStateDispatched
      | Data.NodeStateFailed
      | Data.NodeStateWaitingForResources
      | Data.NodeStateWaitingForSourceWorkflow
    >;

    /**
     * Unix timestamp (seconds) when the run started.
     */
    started_at: number;

    /**
     * Run status.
     */
    status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';
  }

  export namespace Data {
    export interface NodeStateDispatched {
      /**
       * Workflow job ID (rjob\_...).
       */
      job_id: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'dispatched';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateFailed {
      /**
       * Human-readable diagnostic explaining why the binding didn't dispatch.
       */
      reason: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'failed';
    }

    export interface NodeStateWaitingForResources {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'waiting_for_resources';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateWaitingForSourceWorkflow {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      /**
       * reference_ids of producer bindings within this directive that must complete
       * before this binding can dispatch.
       */
      source_workflows: Array<string>;

      status: 'waiting_for_source_workflow';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }
  }
}

export interface RobotsDirectiveRunPartialWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  data: RobotsDirectiveRunPartialWebhookEvent.Data;

  type: 'robots.directive_run.partial';
}

export namespace RobotsDirectiveRunPartialWebhookEvent {
  /**
   * Directive run object delivered in the Mux webhook event's data field.
   */
  export interface Data {
    /**
     * Unique run identifier (drvrun\_...).
     */
    id: string;

    /**
     * The Mux asset ID this run targeted.
     */
    asset_id: string;

    /**
     * Unix timestamp (seconds) when the run reached terminal state. Null if still in
     * progress.
     */
    completed_at: number | null;

    /**
     * The directive this run belongs to (drv\_...).
     */
    directive_id: string;

    /**
     * Per-binding status entries, one per binding, in the order the bindings appear in
     * `directive.workflows[]`.
     */
    node_states: Array<
      | Data.NodeStateDispatched
      | Data.NodeStateFailed
      | Data.NodeStateWaitingForResources
      | Data.NodeStateWaitingForSourceWorkflow
    >;

    /**
     * Unix timestamp (seconds) when the run started.
     */
    started_at: number;

    /**
     * Run status.
     */
    status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';
  }

  export namespace Data {
    export interface NodeStateDispatched {
      /**
       * Workflow job ID (rjob\_...).
       */
      job_id: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'dispatched';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateFailed {
      /**
       * Human-readable diagnostic explaining why the binding didn't dispatch.
       */
      reason: string;

      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'failed';
    }

    export interface NodeStateWaitingForResources {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      status: 'waiting_for_resources';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }

    export interface NodeStateWaitingForSourceWorkflow {
      /**
       * Declared binding id from `directive.workflows[]`.
       */
      reference_id: string;

      /**
       * reference_ids of producer bindings within this directive that must complete
       * before this binding can dispatch.
       */
      source_workflows: Array<string>;

      status: 'waiting_for_source_workflow';

      /**
       * The Robots workflow for this binding.
       */
      workflow_name:
        | 'analyze-structure'
        | 'summarize'
        | 'generate-contextual-text'
        | 'moderate'
        | 'generate-chapters'
        | 'find-scenes'
        | 'edit-captions'
        | 'translate-captions'
        | 'translate-audio'
        | 'ask-questions'
        | 'find-key-moments'
        | 'generate-engagement-insights'
        | 'generate-premium-captions'
        | 'find-best-thumbnails';
    }
  }
}

export interface RobotsJobAnalyzeStructureCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAnalyzeStructureJobV0;

  type: 'robots.job.analyze_structure.cancelled';
}

export interface RobotsJobAnalyzeStructureCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAnalyzeStructureJobV0;

  type: 'robots.job.analyze_structure.completed';
}

export interface RobotsJobAnalyzeStructureErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAnalyzeStructureJobV0;

  type: 'robots.job.analyze_structure.errored';
}

export interface RobotsJobAnalyzeStructurePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAnalyzeStructureJobV0;

  type: 'robots.job.analyze_structure.pending';
}

export interface RobotsJobAnalyzeStructureProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAnalyzeStructureJobV0;

  type: 'robots.job.analyze_structure.processing';
}

export interface RobotsJobAskQuestionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAskQuestionsJobV0;

  type: 'robots.job.ask_questions.cancelled';
}

export interface RobotsJobAskQuestionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAskQuestionsJobV0;

  type: 'robots.job.ask_questions.completed';
}

export interface RobotsJobAskQuestionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAskQuestionsJobV0;

  type: 'robots.job.ask_questions.errored';
}

export interface RobotsJobAskQuestionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAskQuestionsJobV0;

  type: 'robots.job.ask_questions.pending';
}

export interface RobotsJobAskQuestionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookAskQuestionsJobV0;

  type: 'robots.job.ask_questions.processing';
}

export interface RobotsJobEditCaptionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookEditCaptionsJobV0;

  type: 'robots.job.edit_captions.cancelled';
}

export interface RobotsJobEditCaptionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookEditCaptionsJobV0;

  type: 'robots.job.edit_captions.completed';
}

export interface RobotsJobEditCaptionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookEditCaptionsJobV0;

  type: 'robots.job.edit_captions.errored';
}

export interface RobotsJobEditCaptionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookEditCaptionsJobV0;

  type: 'robots.job.edit_captions.pending';
}

export interface RobotsJobEditCaptionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookEditCaptionsJobV0;

  type: 'robots.job.edit_captions.processing';
}

export interface RobotsJobFindBestThumbnailsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindBestThumbnailsJobV0;

  type: 'robots.job.find_best_thumbnails.cancelled';
}

export interface RobotsJobFindBestThumbnailsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindBestThumbnailsJobV0;

  type: 'robots.job.find_best_thumbnails.completed';
}

export interface RobotsJobFindBestThumbnailsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindBestThumbnailsJobV0;

  type: 'robots.job.find_best_thumbnails.errored';
}

export interface RobotsJobFindBestThumbnailsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindBestThumbnailsJobV0;

  type: 'robots.job.find_best_thumbnails.pending';
}

export interface RobotsJobFindBestThumbnailsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindBestThumbnailsJobV0;

  type: 'robots.job.find_best_thumbnails.processing';
}

export interface RobotsJobFindKeyMomentsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindKeyMomentsJobV0;

  type: 'robots.job.find_key_moments.cancelled';
}

export interface RobotsJobFindKeyMomentsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindKeyMomentsJobV0;

  type: 'robots.job.find_key_moments.completed';
}

export interface RobotsJobFindKeyMomentsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindKeyMomentsJobV0;

  type: 'robots.job.find_key_moments.errored';
}

export interface RobotsJobFindKeyMomentsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindKeyMomentsJobV0;

  type: 'robots.job.find_key_moments.pending';
}

export interface RobotsJobFindKeyMomentsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindKeyMomentsJobV0;

  type: 'robots.job.find_key_moments.processing';
}

export interface RobotsJobFindScenesCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindScenesJobV0;

  type: 'robots.job.find_scenes.cancelled';
}

export interface RobotsJobFindScenesCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindScenesJobV0;

  type: 'robots.job.find_scenes.completed';
}

export interface RobotsJobFindScenesErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindScenesJobV0;

  type: 'robots.job.find_scenes.errored';
}

export interface RobotsJobFindScenesPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindScenesJobV0;

  type: 'robots.job.find_scenes.pending';
}

export interface RobotsJobFindScenesProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookFindScenesJobV0;

  type: 'robots.job.find_scenes.processing';
}

export interface RobotsJobGenerateChaptersCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateChaptersJobV0;

  type: 'robots.job.generate_chapters.cancelled';
}

export interface RobotsJobGenerateChaptersCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateChaptersJobV0;

  type: 'robots.job.generate_chapters.completed';
}

export interface RobotsJobGenerateChaptersErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateChaptersJobV0;

  type: 'robots.job.generate_chapters.errored';
}

export interface RobotsJobGenerateChaptersPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateChaptersJobV0;

  type: 'robots.job.generate_chapters.pending';
}

export interface RobotsJobGenerateChaptersProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateChaptersJobV0;

  type: 'robots.job.generate_chapters.processing';
}

export interface RobotsJobGenerateContextualTextCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateContextualTextJobV0;

  type: 'robots.job.generate_contextual_text.cancelled';
}

export interface RobotsJobGenerateContextualTextCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateContextualTextJobV0;

  type: 'robots.job.generate_contextual_text.completed';
}

export interface RobotsJobGenerateContextualTextErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateContextualTextJobV0;

  type: 'robots.job.generate_contextual_text.errored';
}

export interface RobotsJobGenerateContextualTextPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateContextualTextJobV0;

  type: 'robots.job.generate_contextual_text.pending';
}

export interface RobotsJobGenerateContextualTextProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateContextualTextJobV0;

  type: 'robots.job.generate_contextual_text.processing';
}

export interface RobotsJobGenerateEngagementInsightsCancelledWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJobV0;

  type: 'robots.job.generate_engagement_insights.cancelled';
}

export interface RobotsJobGenerateEngagementInsightsCompletedWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJobV0;

  type: 'robots.job.generate_engagement_insights.completed';
}

export interface RobotsJobGenerateEngagementInsightsErroredWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJobV0;

  type: 'robots.job.generate_engagement_insights.errored';
}

export interface RobotsJobGenerateEngagementInsightsPendingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJobV0;

  type: 'robots.job.generate_engagement_insights.pending';
}

export interface RobotsJobGenerateEngagementInsightsProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJobV0;

  type: 'robots.job.generate_engagement_insights.processing';
}

export interface RobotsJobGeneratePremiumCaptionsCancelledWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJobV0;

  type: 'robots.job.generate_premium_captions.cancelled';
}

export interface RobotsJobGeneratePremiumCaptionsCompletedWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJobV0;

  type: 'robots.job.generate_premium_captions.completed';
}

export interface RobotsJobGeneratePremiumCaptionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJobV0;

  type: 'robots.job.generate_premium_captions.errored';
}

export interface RobotsJobGeneratePremiumCaptionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJobV0;

  type: 'robots.job.generate_premium_captions.pending';
}

export interface RobotsJobGeneratePremiumCaptionsProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJobV0;

  type: 'robots.job.generate_premium_captions.processing';
}

export interface RobotsJobModerateCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookModerateJobV0;

  type: 'robots.job.moderate.cancelled';
}

export interface RobotsJobModerateCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookModerateJobV0;

  type: 'robots.job.moderate.completed';
}

export interface RobotsJobModerateErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookModerateJobV0;

  type: 'robots.job.moderate.errored';
}

export interface RobotsJobModeratePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookModerateJobV0;

  type: 'robots.job.moderate.pending';
}

export interface RobotsJobModerateProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookModerateJobV0;

  type: 'robots.job.moderate.processing';
}

export interface RobotsJobSummarizeCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookSummarizeJobV0;

  type: 'robots.job.summarize.cancelled';
}

export interface RobotsJobSummarizeCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookSummarizeJobV0;

  type: 'robots.job.summarize.completed';
}

export interface RobotsJobSummarizeErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookSummarizeJobV0;

  type: 'robots.job.summarize.errored';
}

export interface RobotsJobSummarizePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookSummarizeJobV0;

  type: 'robots.job.summarize.pending';
}

export interface RobotsJobSummarizeProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookSummarizeJobV0;

  type: 'robots.job.summarize.processing';
}

export interface RobotsJobTranslateAudioCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateAudioJobV0;

  type: 'robots.job.translate_audio.cancelled';
}

export interface RobotsJobTranslateAudioCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateAudioJobV0;

  type: 'robots.job.translate_audio.completed';
}

export interface RobotsJobTranslateAudioErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateAudioJobV0;

  type: 'robots.job.translate_audio.errored';
}

export interface RobotsJobTranslateAudioPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateAudioJobV0;

  type: 'robots.job.translate_audio.pending';
}

export interface RobotsJobTranslateAudioProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateAudioJobV0;

  type: 'robots.job.translate_audio.processing';
}

export interface RobotsJobTranslateCaptionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateCaptionsJobV0;

  type: 'robots.job.translate_captions.cancelled';
}

export interface RobotsJobTranslateCaptionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateCaptionsJobV0;

  type: 'robots.job.translate_captions.completed';
}

export interface RobotsJobTranslateCaptionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateCaptionsJobV0;

  type: 'robots.job.translate_captions.errored';
}

export interface RobotsJobTranslateCaptionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateCaptionsJobV0;

  type: 'robots.job.translate_captions.pending';
}

export interface RobotsJobTranslateCaptionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Job object delivered in the Mux webhook event's data field. The event type
   * identifies the workflow and transition.
   */
  data: WebhookTranslateCaptionsJobV0;

  type: 'robots.job.translate_captions.processing';
}

export interface RobotsV1DirectiveRunCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 directive run delivered in the Mux webhook event data field.
   */
  data: WebhookDirectiveRun;

  type: 'robots.v1.directive_run.completed';
}

export interface RobotsV1DirectiveRunCreatedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 directive run delivered in the Mux webhook event data field.
   */
  data: WebhookDirectiveRun;

  type: 'robots.v1.directive_run.created';
}

export interface RobotsV1DirectiveRunErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 directive run delivered in the Mux webhook event data field.
   */
  data: WebhookDirectiveRun;

  type: 'robots.v1.directive_run.errored';
}

export interface RobotsV1DirectiveRunPartialWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 directive run delivered in the Mux webhook event data field.
   */
  data: WebhookDirectiveRun;

  type: 'robots.v1.directive_run.partial';
}

export interface RobotsV1JobAnalyzeStructureCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAnalyzeStructureJob;

  type: 'robots.v1.job.analyze_structure.cancelled';
}

export interface RobotsV1JobAnalyzeStructureCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAnalyzeStructureJob;

  type: 'robots.v1.job.analyze_structure.completed';
}

export interface RobotsV1JobAnalyzeStructureErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAnalyzeStructureJob;

  type: 'robots.v1.job.analyze_structure.errored';
}

export interface RobotsV1JobAnalyzeStructurePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAnalyzeStructureJob;

  type: 'robots.v1.job.analyze_structure.pending';
}

export interface RobotsV1JobAnalyzeStructureProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAnalyzeStructureJob;

  type: 'robots.v1.job.analyze_structure.processing';
}

export interface RobotsV1JobAskQuestionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAskQuestionsJob;

  type: 'robots.v1.job.ask_questions.cancelled';
}

export interface RobotsV1JobAskQuestionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAskQuestionsJob;

  type: 'robots.v1.job.ask_questions.completed';
}

export interface RobotsV1JobAskQuestionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAskQuestionsJob;

  type: 'robots.v1.job.ask_questions.errored';
}

export interface RobotsV1JobAskQuestionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAskQuestionsJob;

  type: 'robots.v1.job.ask_questions.pending';
}

export interface RobotsV1JobAskQuestionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookAskQuestionsJob;

  type: 'robots.v1.job.ask_questions.processing';
}

export interface RobotsV1JobEditCaptionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookEditCaptionsJob;

  type: 'robots.v1.job.edit_captions.cancelled';
}

export interface RobotsV1JobEditCaptionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookEditCaptionsJob;

  type: 'robots.v1.job.edit_captions.completed';
}

export interface RobotsV1JobEditCaptionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookEditCaptionsJob;

  type: 'robots.v1.job.edit_captions.errored';
}

export interface RobotsV1JobEditCaptionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookEditCaptionsJob;

  type: 'robots.v1.job.edit_captions.pending';
}

export interface RobotsV1JobEditCaptionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookEditCaptionsJob;

  type: 'robots.v1.job.edit_captions.processing';
}

export interface RobotsV1JobFindBestThumbnailsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindBestThumbnailsJob;

  type: 'robots.v1.job.find_best_thumbnails.cancelled';
}

export interface RobotsV1JobFindBestThumbnailsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindBestThumbnailsJob;

  type: 'robots.v1.job.find_best_thumbnails.completed';
}

export interface RobotsV1JobFindBestThumbnailsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindBestThumbnailsJob;

  type: 'robots.v1.job.find_best_thumbnails.errored';
}

export interface RobotsV1JobFindBestThumbnailsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindBestThumbnailsJob;

  type: 'robots.v1.job.find_best_thumbnails.pending';
}

export interface RobotsV1JobFindBestThumbnailsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindBestThumbnailsJob;

  type: 'robots.v1.job.find_best_thumbnails.processing';
}

export interface RobotsV1JobFindKeyMomentsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindKeyMomentsJob;

  type: 'robots.v1.job.find_key_moments.cancelled';
}

export interface RobotsV1JobFindKeyMomentsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindKeyMomentsJob;

  type: 'robots.v1.job.find_key_moments.completed';
}

export interface RobotsV1JobFindKeyMomentsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindKeyMomentsJob;

  type: 'robots.v1.job.find_key_moments.errored';
}

export interface RobotsV1JobFindKeyMomentsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindKeyMomentsJob;

  type: 'robots.v1.job.find_key_moments.pending';
}

export interface RobotsV1JobFindKeyMomentsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookFindKeyMomentsJob;

  type: 'robots.v1.job.find_key_moments.processing';
}

export interface RobotsV1JobGenerateChaptersCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateChaptersJob;

  type: 'robots.v1.job.generate_chapters.cancelled';
}

export interface RobotsV1JobGenerateChaptersCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateChaptersJob;

  type: 'robots.v1.job.generate_chapters.completed';
}

export interface RobotsV1JobGenerateChaptersErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateChaptersJob;

  type: 'robots.v1.job.generate_chapters.errored';
}

export interface RobotsV1JobGenerateChaptersPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateChaptersJob;

  type: 'robots.v1.job.generate_chapters.pending';
}

export interface RobotsV1JobGenerateChaptersProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateChaptersJob;

  type: 'robots.v1.job.generate_chapters.processing';
}

export interface RobotsV1JobGenerateContextualTextCancelledWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateContextualTextJob;

  type: 'robots.v1.job.generate_contextual_text.cancelled';
}

export interface RobotsV1JobGenerateContextualTextCompletedWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateContextualTextJob;

  type: 'robots.v1.job.generate_contextual_text.completed';
}

export interface RobotsV1JobGenerateContextualTextErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateContextualTextJob;

  type: 'robots.v1.job.generate_contextual_text.errored';
}

export interface RobotsV1JobGenerateContextualTextPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateContextualTextJob;

  type: 'robots.v1.job.generate_contextual_text.pending';
}

export interface RobotsV1JobGenerateContextualTextProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateContextualTextJob;

  type: 'robots.v1.job.generate_contextual_text.processing';
}

export interface RobotsV1JobGenerateEngagementInsightsCancelledWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJob;

  type: 'robots.v1.job.generate_engagement_insights.cancelled';
}

export interface RobotsV1JobGenerateEngagementInsightsCompletedWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJob;

  type: 'robots.v1.job.generate_engagement_insights.completed';
}

export interface RobotsV1JobGenerateEngagementInsightsErroredWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJob;

  type: 'robots.v1.job.generate_engagement_insights.errored';
}

export interface RobotsV1JobGenerateEngagementInsightsPendingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJob;

  type: 'robots.v1.job.generate_engagement_insights.pending';
}

export interface RobotsV1JobGenerateEngagementInsightsProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGenerateEngagementInsightsJob;

  type: 'robots.v1.job.generate_engagement_insights.processing';
}

export interface RobotsV1JobGeneratePremiumCaptionsCancelledWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJob;

  type: 'robots.v1.job.generate_premium_captions.cancelled';
}

export interface RobotsV1JobGeneratePremiumCaptionsCompletedWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJob;

  type: 'robots.v1.job.generate_premium_captions.completed';
}

export interface RobotsV1JobGeneratePremiumCaptionsErroredWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJob;

  type: 'robots.v1.job.generate_premium_captions.errored';
}

export interface RobotsV1JobGeneratePremiumCaptionsPendingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJob;

  type: 'robots.v1.job.generate_premium_captions.pending';
}

export interface RobotsV1JobGeneratePremiumCaptionsProcessingWebhookEvent
  extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookGeneratePremiumCaptionsJob;

  type: 'robots.v1.job.generate_premium_captions.processing';
}

export interface RobotsV1JobModerateCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookModerateJob;

  type: 'robots.v1.job.moderate.cancelled';
}

export interface RobotsV1JobModerateCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookModerateJob;

  type: 'robots.v1.job.moderate.completed';
}

export interface RobotsV1JobModerateErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookModerateJob;

  type: 'robots.v1.job.moderate.errored';
}

export interface RobotsV1JobModeratePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookModerateJob;

  type: 'robots.v1.job.moderate.pending';
}

export interface RobotsV1JobModerateProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookModerateJob;

  type: 'robots.v1.job.moderate.processing';
}

export interface RobotsV1JobSummarizeCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookSummarizeJob;

  type: 'robots.v1.job.summarize.cancelled';
}

export interface RobotsV1JobSummarizeCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookSummarizeJob;

  type: 'robots.v1.job.summarize.completed';
}

export interface RobotsV1JobSummarizeErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookSummarizeJob;

  type: 'robots.v1.job.summarize.errored';
}

export interface RobotsV1JobSummarizePendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookSummarizeJob;

  type: 'robots.v1.job.summarize.pending';
}

export interface RobotsV1JobSummarizeProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookSummarizeJob;

  type: 'robots.v1.job.summarize.processing';
}

export interface RobotsV1JobTranslateAudioCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateAudioJob;

  type: 'robots.v1.job.translate_audio.cancelled';
}

export interface RobotsV1JobTranslateAudioCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateAudioJob;

  type: 'robots.v1.job.translate_audio.completed';
}

export interface RobotsV1JobTranslateAudioErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateAudioJob;

  type: 'robots.v1.job.translate_audio.errored';
}

export interface RobotsV1JobTranslateAudioPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateAudioJob;

  type: 'robots.v1.job.translate_audio.pending';
}

export interface RobotsV1JobTranslateAudioProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateAudioJob;

  type: 'robots.v1.job.translate_audio.processing';
}

export interface RobotsV1JobTranslateCaptionsCancelledWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateCaptionsJob;

  type: 'robots.v1.job.translate_captions.cancelled';
}

export interface RobotsV1JobTranslateCaptionsCompletedWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateCaptionsJob;

  type: 'robots.v1.job.translate_captions.completed';
}

export interface RobotsV1JobTranslateCaptionsErroredWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateCaptionsJob;

  type: 'robots.v1.job.translate_captions.errored';
}

export interface RobotsV1JobTranslateCaptionsPendingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateCaptionsJob;

  type: 'robots.v1.job.translate_captions.pending';
}

export interface RobotsV1JobTranslateCaptionsProcessingWebhookEvent extends Omit<BaseWebhookEvent, 'data'> {
  /**
   * Version 1 job delivered in the Mux webhook event data field. The event type
   * identifies its workflow and transition.
   */
  data: WebhookTranslateCaptionsJob;

  type: 'robots.v1.job.translate_captions.processing';
}

export type UnwrapWebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetUpdatedWebhookEvent
  | VideoAssetDeletedWebhookEvent
  | VideoAssetLiveStreamCompletedWebhookEvent
  | VideoAssetStaticRenditionsReadyWebhookEvent
  | VideoAssetStaticRenditionsPreparingWebhookEvent
  | VideoAssetStaticRenditionsDeletedWebhookEvent
  | VideoAssetStaticRenditionsErroredWebhookEvent
  | VideoAssetMasterReadyWebhookEvent
  | VideoAssetMasterPreparingWebhookEvent
  | VideoAssetMasterDeletedWebhookEvent
  | VideoAssetMasterErroredWebhookEvent
  | VideoAssetTrackCreatedWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetTrackErroredWebhookEvent
  | VideoAssetTrackDeletedWebhookEvent
  | VideoAssetShotsCreatedWebhookEvent
  | VideoAssetShotsReadyWebhookEvent
  | VideoAssetShotsSkippedWebhookEvent
  | VideoAssetShotsErroredWebhookEvent
  | VideoAssetShotsDeletedWebhookEvent
  | VideoAssetStaticRenditionCreatedWebhookEvent
  | VideoAssetStaticRenditionReadyWebhookEvent
  | VideoAssetStaticRenditionErroredWebhookEvent
  | VideoAssetStaticRenditionDeletedWebhookEvent
  | VideoAssetStaticRenditionSkippedWebhookEvent
  | VideoAssetWarningWebhookEvent
  | VideoAssetNonStandardInputDetectedWebhookEvent
  | VideoUploadAssetCreatedWebhookEvent
  | VideoUploadCancelledWebhookEvent
  | VideoUploadCreatedWebhookEvent
  | VideoUploadErroredWebhookEvent
  | VideoLiveStreamCreatedWebhookEvent
  | VideoLiveStreamConnectedWebhookEvent
  | VideoLiveStreamRecordingWebhookEvent
  | VideoLiveStreamActiveWebhookEvent
  | VideoLiveStreamDisconnectedWebhookEvent
  | VideoLiveStreamIdleWebhookEvent
  | VideoLiveStreamUpdatedWebhookEvent
  | VideoLiveStreamEnabledWebhookEvent
  | VideoLiveStreamDisabledWebhookEvent
  | VideoLiveStreamDeletedWebhookEvent
  | VideoLiveStreamWarningWebhookEvent
  | VideoLiveStreamSimulcastTargetCreatedWebhookEvent
  | VideoLiveStreamSimulcastTargetIdleWebhookEvent
  | VideoLiveStreamSimulcastTargetStartingWebhookEvent
  | VideoLiveStreamSimulcastTargetBroadcastingWebhookEvent
  | VideoLiveStreamSimulcastTargetErroredWebhookEvent
  | VideoLiveStreamSimulcastTargetDeletedWebhookEvent
  | VideoLiveStreamSimulcastTargetUpdatedWebhookEvent
  | VideoDeliveryHighTrafficWebhookEvent
  | RobotsDirectiveRunCompletedWebhookEvent
  | RobotsDirectiveRunCreatedWebhookEvent
  | RobotsDirectiveRunErroredWebhookEvent
  | RobotsDirectiveRunPartialWebhookEvent
  | RobotsJobAnalyzeStructureCancelledWebhookEvent
  | RobotsJobAnalyzeStructureCompletedWebhookEvent
  | RobotsJobAnalyzeStructureErroredWebhookEvent
  | RobotsJobAnalyzeStructurePendingWebhookEvent
  | RobotsJobAnalyzeStructureProcessingWebhookEvent
  | RobotsJobAskQuestionsCancelledWebhookEvent
  | RobotsJobAskQuestionsCompletedWebhookEvent
  | RobotsJobAskQuestionsErroredWebhookEvent
  | RobotsJobAskQuestionsPendingWebhookEvent
  | RobotsJobAskQuestionsProcessingWebhookEvent
  | RobotsJobEditCaptionsCancelledWebhookEvent
  | RobotsJobEditCaptionsCompletedWebhookEvent
  | RobotsJobEditCaptionsErroredWebhookEvent
  | RobotsJobEditCaptionsPendingWebhookEvent
  | RobotsJobEditCaptionsProcessingWebhookEvent
  | RobotsJobFindBestThumbnailsCancelledWebhookEvent
  | RobotsJobFindBestThumbnailsCompletedWebhookEvent
  | RobotsJobFindBestThumbnailsErroredWebhookEvent
  | RobotsJobFindBestThumbnailsPendingWebhookEvent
  | RobotsJobFindBestThumbnailsProcessingWebhookEvent
  | RobotsJobFindKeyMomentsCancelledWebhookEvent
  | RobotsJobFindKeyMomentsCompletedWebhookEvent
  | RobotsJobFindKeyMomentsErroredWebhookEvent
  | RobotsJobFindKeyMomentsPendingWebhookEvent
  | RobotsJobFindKeyMomentsProcessingWebhookEvent
  | RobotsJobFindScenesCancelledWebhookEvent
  | RobotsJobFindScenesCompletedWebhookEvent
  | RobotsJobFindScenesErroredWebhookEvent
  | RobotsJobFindScenesPendingWebhookEvent
  | RobotsJobFindScenesProcessingWebhookEvent
  | RobotsJobGenerateChaptersCancelledWebhookEvent
  | RobotsJobGenerateChaptersCompletedWebhookEvent
  | RobotsJobGenerateChaptersErroredWebhookEvent
  | RobotsJobGenerateChaptersPendingWebhookEvent
  | RobotsJobGenerateChaptersProcessingWebhookEvent
  | RobotsJobGenerateContextualTextCancelledWebhookEvent
  | RobotsJobGenerateContextualTextCompletedWebhookEvent
  | RobotsJobGenerateContextualTextErroredWebhookEvent
  | RobotsJobGenerateContextualTextPendingWebhookEvent
  | RobotsJobGenerateContextualTextProcessingWebhookEvent
  | RobotsJobGenerateEngagementInsightsCancelledWebhookEvent
  | RobotsJobGenerateEngagementInsightsCompletedWebhookEvent
  | RobotsJobGenerateEngagementInsightsErroredWebhookEvent
  | RobotsJobGenerateEngagementInsightsPendingWebhookEvent
  | RobotsJobGenerateEngagementInsightsProcessingWebhookEvent
  | RobotsJobGeneratePremiumCaptionsCancelledWebhookEvent
  | RobotsJobGeneratePremiumCaptionsCompletedWebhookEvent
  | RobotsJobGeneratePremiumCaptionsErroredWebhookEvent
  | RobotsJobGeneratePremiumCaptionsPendingWebhookEvent
  | RobotsJobGeneratePremiumCaptionsProcessingWebhookEvent
  | RobotsJobModerateCancelledWebhookEvent
  | RobotsJobModerateCompletedWebhookEvent
  | RobotsJobModerateErroredWebhookEvent
  | RobotsJobModeratePendingWebhookEvent
  | RobotsJobModerateProcessingWebhookEvent
  | RobotsJobSummarizeCancelledWebhookEvent
  | RobotsJobSummarizeCompletedWebhookEvent
  | RobotsJobSummarizeErroredWebhookEvent
  | RobotsJobSummarizePendingWebhookEvent
  | RobotsJobSummarizeProcessingWebhookEvent
  | RobotsJobTranslateAudioCancelledWebhookEvent
  | RobotsJobTranslateAudioCompletedWebhookEvent
  | RobotsJobTranslateAudioErroredWebhookEvent
  | RobotsJobTranslateAudioPendingWebhookEvent
  | RobotsJobTranslateAudioProcessingWebhookEvent
  | RobotsJobTranslateCaptionsCancelledWebhookEvent
  | RobotsJobTranslateCaptionsCompletedWebhookEvent
  | RobotsJobTranslateCaptionsErroredWebhookEvent
  | RobotsJobTranslateCaptionsPendingWebhookEvent
  | RobotsJobTranslateCaptionsProcessingWebhookEvent
  | RobotsV1DirectiveRunCompletedWebhookEvent
  | RobotsV1DirectiveRunCreatedWebhookEvent
  | RobotsV1DirectiveRunErroredWebhookEvent
  | RobotsV1DirectiveRunPartialWebhookEvent
  | RobotsV1JobAnalyzeStructureCancelledWebhookEvent
  | RobotsV1JobAnalyzeStructureCompletedWebhookEvent
  | RobotsV1JobAnalyzeStructureErroredWebhookEvent
  | RobotsV1JobAnalyzeStructurePendingWebhookEvent
  | RobotsV1JobAnalyzeStructureProcessingWebhookEvent
  | RobotsV1JobAskQuestionsCancelledWebhookEvent
  | RobotsV1JobAskQuestionsCompletedWebhookEvent
  | RobotsV1JobAskQuestionsErroredWebhookEvent
  | RobotsV1JobAskQuestionsPendingWebhookEvent
  | RobotsV1JobAskQuestionsProcessingWebhookEvent
  | RobotsV1JobEditCaptionsCancelledWebhookEvent
  | RobotsV1JobEditCaptionsCompletedWebhookEvent
  | RobotsV1JobEditCaptionsErroredWebhookEvent
  | RobotsV1JobEditCaptionsPendingWebhookEvent
  | RobotsV1JobEditCaptionsProcessingWebhookEvent
  | RobotsV1JobFindBestThumbnailsCancelledWebhookEvent
  | RobotsV1JobFindBestThumbnailsCompletedWebhookEvent
  | RobotsV1JobFindBestThumbnailsErroredWebhookEvent
  | RobotsV1JobFindBestThumbnailsPendingWebhookEvent
  | RobotsV1JobFindBestThumbnailsProcessingWebhookEvent
  | RobotsV1JobFindKeyMomentsCancelledWebhookEvent
  | RobotsV1JobFindKeyMomentsCompletedWebhookEvent
  | RobotsV1JobFindKeyMomentsErroredWebhookEvent
  | RobotsV1JobFindKeyMomentsPendingWebhookEvent
  | RobotsV1JobFindKeyMomentsProcessingWebhookEvent
  | RobotsV1JobGenerateChaptersCancelledWebhookEvent
  | RobotsV1JobGenerateChaptersCompletedWebhookEvent
  | RobotsV1JobGenerateChaptersErroredWebhookEvent
  | RobotsV1JobGenerateChaptersPendingWebhookEvent
  | RobotsV1JobGenerateChaptersProcessingWebhookEvent
  | RobotsV1JobGenerateContextualTextCancelledWebhookEvent
  | RobotsV1JobGenerateContextualTextCompletedWebhookEvent
  | RobotsV1JobGenerateContextualTextErroredWebhookEvent
  | RobotsV1JobGenerateContextualTextPendingWebhookEvent
  | RobotsV1JobGenerateContextualTextProcessingWebhookEvent
  | RobotsV1JobGenerateEngagementInsightsCancelledWebhookEvent
  | RobotsV1JobGenerateEngagementInsightsCompletedWebhookEvent
  | RobotsV1JobGenerateEngagementInsightsErroredWebhookEvent
  | RobotsV1JobGenerateEngagementInsightsPendingWebhookEvent
  | RobotsV1JobGenerateEngagementInsightsProcessingWebhookEvent
  | RobotsV1JobGeneratePremiumCaptionsCancelledWebhookEvent
  | RobotsV1JobGeneratePremiumCaptionsCompletedWebhookEvent
  | RobotsV1JobGeneratePremiumCaptionsErroredWebhookEvent
  | RobotsV1JobGeneratePremiumCaptionsPendingWebhookEvent
  | RobotsV1JobGeneratePremiumCaptionsProcessingWebhookEvent
  | RobotsV1JobModerateCancelledWebhookEvent
  | RobotsV1JobModerateCompletedWebhookEvent
  | RobotsV1JobModerateErroredWebhookEvent
  | RobotsV1JobModeratePendingWebhookEvent
  | RobotsV1JobModerateProcessingWebhookEvent
  | RobotsV1JobSummarizeCancelledWebhookEvent
  | RobotsV1JobSummarizeCompletedWebhookEvent
  | RobotsV1JobSummarizeErroredWebhookEvent
  | RobotsV1JobSummarizePendingWebhookEvent
  | RobotsV1JobSummarizeProcessingWebhookEvent
  | RobotsV1JobTranslateAudioCancelledWebhookEvent
  | RobotsV1JobTranslateAudioCompletedWebhookEvent
  | RobotsV1JobTranslateAudioErroredWebhookEvent
  | RobotsV1JobTranslateAudioPendingWebhookEvent
  | RobotsV1JobTranslateAudioProcessingWebhookEvent
  | RobotsV1JobTranslateCaptionsCancelledWebhookEvent
  | RobotsV1JobTranslateCaptionsCompletedWebhookEvent
  | RobotsV1JobTranslateCaptionsErroredWebhookEvent
  | RobotsV1JobTranslateCaptionsPendingWebhookEvent
  | RobotsV1JobTranslateCaptionsProcessingWebhookEvent;

export declare namespace Webhooks {
  export {
    type BaseWebhookEvent as BaseWebhookEvent,
    type WebhookAnalyzeStructureJob as WebhookAnalyzeStructureJob,
    type WebhookAnalyzeStructureJobV0 as WebhookAnalyzeStructureJobV0,
    type WebhookAskQuestionsJob as WebhookAskQuestionsJob,
    type WebhookAskQuestionsJobV0 as WebhookAskQuestionsJobV0,
    type WebhookAsset as WebhookAsset,
    type WebhookAssetEmbeddedTrack as WebhookAssetEmbeddedTrack,
    type WebhookAssetStaticRendition as WebhookAssetStaticRendition,
    type WebhookAssetTrack as WebhookAssetTrack,
    type WebhookAssetWarning as WebhookAssetWarning,
    type WebhookDirectUpload as WebhookDirectUpload,
    type WebhookDirectiveRun as WebhookDirectiveRun,
    type WebhookEditCaptionsJob as WebhookEditCaptionsJob,
    type WebhookEditCaptionsJobV0 as WebhookEditCaptionsJobV0,
    type WebhookFindBestThumbnailsJob as WebhookFindBestThumbnailsJob,
    type WebhookFindBestThumbnailsJobV0 as WebhookFindBestThumbnailsJobV0,
    type WebhookFindKeyMomentsJob as WebhookFindKeyMomentsJob,
    type WebhookFindKeyMomentsJobV0 as WebhookFindKeyMomentsJobV0,
    type WebhookFindScenesJobV0 as WebhookFindScenesJobV0,
    type WebhookGenerateChaptersJob as WebhookGenerateChaptersJob,
    type WebhookGenerateChaptersJobV0 as WebhookGenerateChaptersJobV0,
    type WebhookGenerateContextualTextJob as WebhookGenerateContextualTextJob,
    type WebhookGenerateContextualTextJobV0 as WebhookGenerateContextualTextJobV0,
    type WebhookGenerateEngagementInsightsJob as WebhookGenerateEngagementInsightsJob,
    type WebhookGenerateEngagementInsightsJobV0 as WebhookGenerateEngagementInsightsJobV0,
    type WebhookGeneratePremiumCaptionsJob as WebhookGeneratePremiumCaptionsJob,
    type WebhookGeneratePremiumCaptionsJobV0 as WebhookGeneratePremiumCaptionsJobV0,
    type WebhookLiveStream as WebhookLiveStream,
    type WebhookLiveStreamWarning as WebhookLiveStreamWarning,
    type WebhookModerateJob as WebhookModerateJob,
    type WebhookModerateJobV0 as WebhookModerateJobV0,
    type WebhookSimulcastTarget as WebhookSimulcastTarget,
    type WebhookSummarizeJob as WebhookSummarizeJob,
    type WebhookSummarizeJobV0 as WebhookSummarizeJobV0,
    type WebhookTranslateAudioJob as WebhookTranslateAudioJob,
    type WebhookTranslateAudioJobV0 as WebhookTranslateAudioJobV0,
    type WebhookTranslateCaptionsJob as WebhookTranslateCaptionsJob,
    type WebhookTranslateCaptionsJobV0 as WebhookTranslateCaptionsJobV0,
    type WebhookVideoDeliveryHighTraffic as WebhookVideoDeliveryHighTraffic,
    type VideoAssetCreatedWebhookEvent as VideoAssetCreatedWebhookEvent,
    type VideoAssetReadyWebhookEvent as VideoAssetReadyWebhookEvent,
    type VideoAssetErroredWebhookEvent as VideoAssetErroredWebhookEvent,
    type VideoAssetUpdatedWebhookEvent as VideoAssetUpdatedWebhookEvent,
    type VideoAssetDeletedWebhookEvent as VideoAssetDeletedWebhookEvent,
    type VideoAssetLiveStreamCompletedWebhookEvent as VideoAssetLiveStreamCompletedWebhookEvent,
    type VideoAssetStaticRenditionsReadyWebhookEvent as VideoAssetStaticRenditionsReadyWebhookEvent,
    type VideoAssetStaticRenditionsPreparingWebhookEvent as VideoAssetStaticRenditionsPreparingWebhookEvent,
    type VideoAssetStaticRenditionsDeletedWebhookEvent as VideoAssetStaticRenditionsDeletedWebhookEvent,
    type VideoAssetStaticRenditionsErroredWebhookEvent as VideoAssetStaticRenditionsErroredWebhookEvent,
    type VideoAssetMasterReadyWebhookEvent as VideoAssetMasterReadyWebhookEvent,
    type VideoAssetMasterPreparingWebhookEvent as VideoAssetMasterPreparingWebhookEvent,
    type VideoAssetMasterDeletedWebhookEvent as VideoAssetMasterDeletedWebhookEvent,
    type VideoAssetMasterErroredWebhookEvent as VideoAssetMasterErroredWebhookEvent,
    type VideoAssetTrackCreatedWebhookEvent as VideoAssetTrackCreatedWebhookEvent,
    type VideoAssetTrackReadyWebhookEvent as VideoAssetTrackReadyWebhookEvent,
    type VideoAssetTrackErroredWebhookEvent as VideoAssetTrackErroredWebhookEvent,
    type VideoAssetTrackDeletedWebhookEvent as VideoAssetTrackDeletedWebhookEvent,
    type VideoAssetShotsCreatedWebhookEvent as VideoAssetShotsCreatedWebhookEvent,
    type VideoAssetShotsReadyWebhookEvent as VideoAssetShotsReadyWebhookEvent,
    type VideoAssetShotsSkippedWebhookEvent as VideoAssetShotsSkippedWebhookEvent,
    type VideoAssetShotsErroredWebhookEvent as VideoAssetShotsErroredWebhookEvent,
    type VideoAssetShotsDeletedWebhookEvent as VideoAssetShotsDeletedWebhookEvent,
    type VideoAssetStaticRenditionCreatedWebhookEvent as VideoAssetStaticRenditionCreatedWebhookEvent,
    type VideoAssetStaticRenditionReadyWebhookEvent as VideoAssetStaticRenditionReadyWebhookEvent,
    type VideoAssetStaticRenditionErroredWebhookEvent as VideoAssetStaticRenditionErroredWebhookEvent,
    type VideoAssetStaticRenditionDeletedWebhookEvent as VideoAssetStaticRenditionDeletedWebhookEvent,
    type VideoAssetStaticRenditionSkippedWebhookEvent as VideoAssetStaticRenditionSkippedWebhookEvent,
    type VideoAssetWarningWebhookEvent as VideoAssetWarningWebhookEvent,
    type VideoAssetNonStandardInputDetectedWebhookEvent as VideoAssetNonStandardInputDetectedWebhookEvent,
    type VideoUploadAssetCreatedWebhookEvent as VideoUploadAssetCreatedWebhookEvent,
    type VideoUploadCancelledWebhookEvent as VideoUploadCancelledWebhookEvent,
    type VideoUploadCreatedWebhookEvent as VideoUploadCreatedWebhookEvent,
    type VideoUploadErroredWebhookEvent as VideoUploadErroredWebhookEvent,
    type VideoLiveStreamCreatedWebhookEvent as VideoLiveStreamCreatedWebhookEvent,
    type VideoLiveStreamConnectedWebhookEvent as VideoLiveStreamConnectedWebhookEvent,
    type VideoLiveStreamRecordingWebhookEvent as VideoLiveStreamRecordingWebhookEvent,
    type VideoLiveStreamActiveWebhookEvent as VideoLiveStreamActiveWebhookEvent,
    type VideoLiveStreamDisconnectedWebhookEvent as VideoLiveStreamDisconnectedWebhookEvent,
    type VideoLiveStreamIdleWebhookEvent as VideoLiveStreamIdleWebhookEvent,
    type VideoLiveStreamUpdatedWebhookEvent as VideoLiveStreamUpdatedWebhookEvent,
    type VideoLiveStreamEnabledWebhookEvent as VideoLiveStreamEnabledWebhookEvent,
    type VideoLiveStreamDisabledWebhookEvent as VideoLiveStreamDisabledWebhookEvent,
    type VideoLiveStreamDeletedWebhookEvent as VideoLiveStreamDeletedWebhookEvent,
    type VideoLiveStreamWarningWebhookEvent as VideoLiveStreamWarningWebhookEvent,
    type VideoLiveStreamSimulcastTargetCreatedWebhookEvent as VideoLiveStreamSimulcastTargetCreatedWebhookEvent,
    type VideoLiveStreamSimulcastTargetIdleWebhookEvent as VideoLiveStreamSimulcastTargetIdleWebhookEvent,
    type VideoLiveStreamSimulcastTargetStartingWebhookEvent as VideoLiveStreamSimulcastTargetStartingWebhookEvent,
    type VideoLiveStreamSimulcastTargetBroadcastingWebhookEvent as VideoLiveStreamSimulcastTargetBroadcastingWebhookEvent,
    type VideoLiveStreamSimulcastTargetErroredWebhookEvent as VideoLiveStreamSimulcastTargetErroredWebhookEvent,
    type VideoLiveStreamSimulcastTargetDeletedWebhookEvent as VideoLiveStreamSimulcastTargetDeletedWebhookEvent,
    type VideoLiveStreamSimulcastTargetUpdatedWebhookEvent as VideoLiveStreamSimulcastTargetUpdatedWebhookEvent,
    type VideoDeliveryHighTrafficWebhookEvent as VideoDeliveryHighTrafficWebhookEvent,
    type RobotsDirectiveRunCompletedWebhookEvent as RobotsDirectiveRunCompletedWebhookEvent,
    type RobotsDirectiveRunCreatedWebhookEvent as RobotsDirectiveRunCreatedWebhookEvent,
    type RobotsDirectiveRunErroredWebhookEvent as RobotsDirectiveRunErroredWebhookEvent,
    type RobotsDirectiveRunPartialWebhookEvent as RobotsDirectiveRunPartialWebhookEvent,
    type RobotsJobAnalyzeStructureCancelledWebhookEvent as RobotsJobAnalyzeStructureCancelledWebhookEvent,
    type RobotsJobAnalyzeStructureCompletedWebhookEvent as RobotsJobAnalyzeStructureCompletedWebhookEvent,
    type RobotsJobAnalyzeStructureErroredWebhookEvent as RobotsJobAnalyzeStructureErroredWebhookEvent,
    type RobotsJobAnalyzeStructurePendingWebhookEvent as RobotsJobAnalyzeStructurePendingWebhookEvent,
    type RobotsJobAnalyzeStructureProcessingWebhookEvent as RobotsJobAnalyzeStructureProcessingWebhookEvent,
    type RobotsJobAskQuestionsCancelledWebhookEvent as RobotsJobAskQuestionsCancelledWebhookEvent,
    type RobotsJobAskQuestionsCompletedWebhookEvent as RobotsJobAskQuestionsCompletedWebhookEvent,
    type RobotsJobAskQuestionsErroredWebhookEvent as RobotsJobAskQuestionsErroredWebhookEvent,
    type RobotsJobAskQuestionsPendingWebhookEvent as RobotsJobAskQuestionsPendingWebhookEvent,
    type RobotsJobAskQuestionsProcessingWebhookEvent as RobotsJobAskQuestionsProcessingWebhookEvent,
    type RobotsJobEditCaptionsCancelledWebhookEvent as RobotsJobEditCaptionsCancelledWebhookEvent,
    type RobotsJobEditCaptionsCompletedWebhookEvent as RobotsJobEditCaptionsCompletedWebhookEvent,
    type RobotsJobEditCaptionsErroredWebhookEvent as RobotsJobEditCaptionsErroredWebhookEvent,
    type RobotsJobEditCaptionsPendingWebhookEvent as RobotsJobEditCaptionsPendingWebhookEvent,
    type RobotsJobEditCaptionsProcessingWebhookEvent as RobotsJobEditCaptionsProcessingWebhookEvent,
    type RobotsJobFindBestThumbnailsCancelledWebhookEvent as RobotsJobFindBestThumbnailsCancelledWebhookEvent,
    type RobotsJobFindBestThumbnailsCompletedWebhookEvent as RobotsJobFindBestThumbnailsCompletedWebhookEvent,
    type RobotsJobFindBestThumbnailsErroredWebhookEvent as RobotsJobFindBestThumbnailsErroredWebhookEvent,
    type RobotsJobFindBestThumbnailsPendingWebhookEvent as RobotsJobFindBestThumbnailsPendingWebhookEvent,
    type RobotsJobFindBestThumbnailsProcessingWebhookEvent as RobotsJobFindBestThumbnailsProcessingWebhookEvent,
    type RobotsJobFindKeyMomentsCancelledWebhookEvent as RobotsJobFindKeyMomentsCancelledWebhookEvent,
    type RobotsJobFindKeyMomentsCompletedWebhookEvent as RobotsJobFindKeyMomentsCompletedWebhookEvent,
    type RobotsJobFindKeyMomentsErroredWebhookEvent as RobotsJobFindKeyMomentsErroredWebhookEvent,
    type RobotsJobFindKeyMomentsPendingWebhookEvent as RobotsJobFindKeyMomentsPendingWebhookEvent,
    type RobotsJobFindKeyMomentsProcessingWebhookEvent as RobotsJobFindKeyMomentsProcessingWebhookEvent,
    type RobotsJobFindScenesCancelledWebhookEvent as RobotsJobFindScenesCancelledWebhookEvent,
    type RobotsJobFindScenesCompletedWebhookEvent as RobotsJobFindScenesCompletedWebhookEvent,
    type RobotsJobFindScenesErroredWebhookEvent as RobotsJobFindScenesErroredWebhookEvent,
    type RobotsJobFindScenesPendingWebhookEvent as RobotsJobFindScenesPendingWebhookEvent,
    type RobotsJobFindScenesProcessingWebhookEvent as RobotsJobFindScenesProcessingWebhookEvent,
    type RobotsJobGenerateChaptersCancelledWebhookEvent as RobotsJobGenerateChaptersCancelledWebhookEvent,
    type RobotsJobGenerateChaptersCompletedWebhookEvent as RobotsJobGenerateChaptersCompletedWebhookEvent,
    type RobotsJobGenerateChaptersErroredWebhookEvent as RobotsJobGenerateChaptersErroredWebhookEvent,
    type RobotsJobGenerateChaptersPendingWebhookEvent as RobotsJobGenerateChaptersPendingWebhookEvent,
    type RobotsJobGenerateChaptersProcessingWebhookEvent as RobotsJobGenerateChaptersProcessingWebhookEvent,
    type RobotsJobGenerateContextualTextCancelledWebhookEvent as RobotsJobGenerateContextualTextCancelledWebhookEvent,
    type RobotsJobGenerateContextualTextCompletedWebhookEvent as RobotsJobGenerateContextualTextCompletedWebhookEvent,
    type RobotsJobGenerateContextualTextErroredWebhookEvent as RobotsJobGenerateContextualTextErroredWebhookEvent,
    type RobotsJobGenerateContextualTextPendingWebhookEvent as RobotsJobGenerateContextualTextPendingWebhookEvent,
    type RobotsJobGenerateContextualTextProcessingWebhookEvent as RobotsJobGenerateContextualTextProcessingWebhookEvent,
    type RobotsJobGenerateEngagementInsightsCancelledWebhookEvent as RobotsJobGenerateEngagementInsightsCancelledWebhookEvent,
    type RobotsJobGenerateEngagementInsightsCompletedWebhookEvent as RobotsJobGenerateEngagementInsightsCompletedWebhookEvent,
    type RobotsJobGenerateEngagementInsightsErroredWebhookEvent as RobotsJobGenerateEngagementInsightsErroredWebhookEvent,
    type RobotsJobGenerateEngagementInsightsPendingWebhookEvent as RobotsJobGenerateEngagementInsightsPendingWebhookEvent,
    type RobotsJobGenerateEngagementInsightsProcessingWebhookEvent as RobotsJobGenerateEngagementInsightsProcessingWebhookEvent,
    type RobotsJobGeneratePremiumCaptionsCancelledWebhookEvent as RobotsJobGeneratePremiumCaptionsCancelledWebhookEvent,
    type RobotsJobGeneratePremiumCaptionsCompletedWebhookEvent as RobotsJobGeneratePremiumCaptionsCompletedWebhookEvent,
    type RobotsJobGeneratePremiumCaptionsErroredWebhookEvent as RobotsJobGeneratePremiumCaptionsErroredWebhookEvent,
    type RobotsJobGeneratePremiumCaptionsPendingWebhookEvent as RobotsJobGeneratePremiumCaptionsPendingWebhookEvent,
    type RobotsJobGeneratePremiumCaptionsProcessingWebhookEvent as RobotsJobGeneratePremiumCaptionsProcessingWebhookEvent,
    type RobotsJobModerateCancelledWebhookEvent as RobotsJobModerateCancelledWebhookEvent,
    type RobotsJobModerateCompletedWebhookEvent as RobotsJobModerateCompletedWebhookEvent,
    type RobotsJobModerateErroredWebhookEvent as RobotsJobModerateErroredWebhookEvent,
    type RobotsJobModeratePendingWebhookEvent as RobotsJobModeratePendingWebhookEvent,
    type RobotsJobModerateProcessingWebhookEvent as RobotsJobModerateProcessingWebhookEvent,
    type RobotsJobSummarizeCancelledWebhookEvent as RobotsJobSummarizeCancelledWebhookEvent,
    type RobotsJobSummarizeCompletedWebhookEvent as RobotsJobSummarizeCompletedWebhookEvent,
    type RobotsJobSummarizeErroredWebhookEvent as RobotsJobSummarizeErroredWebhookEvent,
    type RobotsJobSummarizePendingWebhookEvent as RobotsJobSummarizePendingWebhookEvent,
    type RobotsJobSummarizeProcessingWebhookEvent as RobotsJobSummarizeProcessingWebhookEvent,
    type RobotsJobTranslateAudioCancelledWebhookEvent as RobotsJobTranslateAudioCancelledWebhookEvent,
    type RobotsJobTranslateAudioCompletedWebhookEvent as RobotsJobTranslateAudioCompletedWebhookEvent,
    type RobotsJobTranslateAudioErroredWebhookEvent as RobotsJobTranslateAudioErroredWebhookEvent,
    type RobotsJobTranslateAudioPendingWebhookEvent as RobotsJobTranslateAudioPendingWebhookEvent,
    type RobotsJobTranslateAudioProcessingWebhookEvent as RobotsJobTranslateAudioProcessingWebhookEvent,
    type RobotsJobTranslateCaptionsCancelledWebhookEvent as RobotsJobTranslateCaptionsCancelledWebhookEvent,
    type RobotsJobTranslateCaptionsCompletedWebhookEvent as RobotsJobTranslateCaptionsCompletedWebhookEvent,
    type RobotsJobTranslateCaptionsErroredWebhookEvent as RobotsJobTranslateCaptionsErroredWebhookEvent,
    type RobotsJobTranslateCaptionsPendingWebhookEvent as RobotsJobTranslateCaptionsPendingWebhookEvent,
    type RobotsJobTranslateCaptionsProcessingWebhookEvent as RobotsJobTranslateCaptionsProcessingWebhookEvent,
    type RobotsV1DirectiveRunCompletedWebhookEvent as RobotsV1DirectiveRunCompletedWebhookEvent,
    type RobotsV1DirectiveRunCreatedWebhookEvent as RobotsV1DirectiveRunCreatedWebhookEvent,
    type RobotsV1DirectiveRunErroredWebhookEvent as RobotsV1DirectiveRunErroredWebhookEvent,
    type RobotsV1DirectiveRunPartialWebhookEvent as RobotsV1DirectiveRunPartialWebhookEvent,
    type RobotsV1JobAnalyzeStructureCancelledWebhookEvent as RobotsV1JobAnalyzeStructureCancelledWebhookEvent,
    type RobotsV1JobAnalyzeStructureCompletedWebhookEvent as RobotsV1JobAnalyzeStructureCompletedWebhookEvent,
    type RobotsV1JobAnalyzeStructureErroredWebhookEvent as RobotsV1JobAnalyzeStructureErroredWebhookEvent,
    type RobotsV1JobAnalyzeStructurePendingWebhookEvent as RobotsV1JobAnalyzeStructurePendingWebhookEvent,
    type RobotsV1JobAnalyzeStructureProcessingWebhookEvent as RobotsV1JobAnalyzeStructureProcessingWebhookEvent,
    type RobotsV1JobAskQuestionsCancelledWebhookEvent as RobotsV1JobAskQuestionsCancelledWebhookEvent,
    type RobotsV1JobAskQuestionsCompletedWebhookEvent as RobotsV1JobAskQuestionsCompletedWebhookEvent,
    type RobotsV1JobAskQuestionsErroredWebhookEvent as RobotsV1JobAskQuestionsErroredWebhookEvent,
    type RobotsV1JobAskQuestionsPendingWebhookEvent as RobotsV1JobAskQuestionsPendingWebhookEvent,
    type RobotsV1JobAskQuestionsProcessingWebhookEvent as RobotsV1JobAskQuestionsProcessingWebhookEvent,
    type RobotsV1JobEditCaptionsCancelledWebhookEvent as RobotsV1JobEditCaptionsCancelledWebhookEvent,
    type RobotsV1JobEditCaptionsCompletedWebhookEvent as RobotsV1JobEditCaptionsCompletedWebhookEvent,
    type RobotsV1JobEditCaptionsErroredWebhookEvent as RobotsV1JobEditCaptionsErroredWebhookEvent,
    type RobotsV1JobEditCaptionsPendingWebhookEvent as RobotsV1JobEditCaptionsPendingWebhookEvent,
    type RobotsV1JobEditCaptionsProcessingWebhookEvent as RobotsV1JobEditCaptionsProcessingWebhookEvent,
    type RobotsV1JobFindBestThumbnailsCancelledWebhookEvent as RobotsV1JobFindBestThumbnailsCancelledWebhookEvent,
    type RobotsV1JobFindBestThumbnailsCompletedWebhookEvent as RobotsV1JobFindBestThumbnailsCompletedWebhookEvent,
    type RobotsV1JobFindBestThumbnailsErroredWebhookEvent as RobotsV1JobFindBestThumbnailsErroredWebhookEvent,
    type RobotsV1JobFindBestThumbnailsPendingWebhookEvent as RobotsV1JobFindBestThumbnailsPendingWebhookEvent,
    type RobotsV1JobFindBestThumbnailsProcessingWebhookEvent as RobotsV1JobFindBestThumbnailsProcessingWebhookEvent,
    type RobotsV1JobFindKeyMomentsCancelledWebhookEvent as RobotsV1JobFindKeyMomentsCancelledWebhookEvent,
    type RobotsV1JobFindKeyMomentsCompletedWebhookEvent as RobotsV1JobFindKeyMomentsCompletedWebhookEvent,
    type RobotsV1JobFindKeyMomentsErroredWebhookEvent as RobotsV1JobFindKeyMomentsErroredWebhookEvent,
    type RobotsV1JobFindKeyMomentsPendingWebhookEvent as RobotsV1JobFindKeyMomentsPendingWebhookEvent,
    type RobotsV1JobFindKeyMomentsProcessingWebhookEvent as RobotsV1JobFindKeyMomentsProcessingWebhookEvent,
    type RobotsV1JobGenerateChaptersCancelledWebhookEvent as RobotsV1JobGenerateChaptersCancelledWebhookEvent,
    type RobotsV1JobGenerateChaptersCompletedWebhookEvent as RobotsV1JobGenerateChaptersCompletedWebhookEvent,
    type RobotsV1JobGenerateChaptersErroredWebhookEvent as RobotsV1JobGenerateChaptersErroredWebhookEvent,
    type RobotsV1JobGenerateChaptersPendingWebhookEvent as RobotsV1JobGenerateChaptersPendingWebhookEvent,
    type RobotsV1JobGenerateChaptersProcessingWebhookEvent as RobotsV1JobGenerateChaptersProcessingWebhookEvent,
    type RobotsV1JobGenerateContextualTextCancelledWebhookEvent as RobotsV1JobGenerateContextualTextCancelledWebhookEvent,
    type RobotsV1JobGenerateContextualTextCompletedWebhookEvent as RobotsV1JobGenerateContextualTextCompletedWebhookEvent,
    type RobotsV1JobGenerateContextualTextErroredWebhookEvent as RobotsV1JobGenerateContextualTextErroredWebhookEvent,
    type RobotsV1JobGenerateContextualTextPendingWebhookEvent as RobotsV1JobGenerateContextualTextPendingWebhookEvent,
    type RobotsV1JobGenerateContextualTextProcessingWebhookEvent as RobotsV1JobGenerateContextualTextProcessingWebhookEvent,
    type RobotsV1JobGenerateEngagementInsightsCancelledWebhookEvent as RobotsV1JobGenerateEngagementInsightsCancelledWebhookEvent,
    type RobotsV1JobGenerateEngagementInsightsCompletedWebhookEvent as RobotsV1JobGenerateEngagementInsightsCompletedWebhookEvent,
    type RobotsV1JobGenerateEngagementInsightsErroredWebhookEvent as RobotsV1JobGenerateEngagementInsightsErroredWebhookEvent,
    type RobotsV1JobGenerateEngagementInsightsPendingWebhookEvent as RobotsV1JobGenerateEngagementInsightsPendingWebhookEvent,
    type RobotsV1JobGenerateEngagementInsightsProcessingWebhookEvent as RobotsV1JobGenerateEngagementInsightsProcessingWebhookEvent,
    type RobotsV1JobGeneratePremiumCaptionsCancelledWebhookEvent as RobotsV1JobGeneratePremiumCaptionsCancelledWebhookEvent,
    type RobotsV1JobGeneratePremiumCaptionsCompletedWebhookEvent as RobotsV1JobGeneratePremiumCaptionsCompletedWebhookEvent,
    type RobotsV1JobGeneratePremiumCaptionsErroredWebhookEvent as RobotsV1JobGeneratePremiumCaptionsErroredWebhookEvent,
    type RobotsV1JobGeneratePremiumCaptionsPendingWebhookEvent as RobotsV1JobGeneratePremiumCaptionsPendingWebhookEvent,
    type RobotsV1JobGeneratePremiumCaptionsProcessingWebhookEvent as RobotsV1JobGeneratePremiumCaptionsProcessingWebhookEvent,
    type RobotsV1JobModerateCancelledWebhookEvent as RobotsV1JobModerateCancelledWebhookEvent,
    type RobotsV1JobModerateCompletedWebhookEvent as RobotsV1JobModerateCompletedWebhookEvent,
    type RobotsV1JobModerateErroredWebhookEvent as RobotsV1JobModerateErroredWebhookEvent,
    type RobotsV1JobModeratePendingWebhookEvent as RobotsV1JobModeratePendingWebhookEvent,
    type RobotsV1JobModerateProcessingWebhookEvent as RobotsV1JobModerateProcessingWebhookEvent,
    type RobotsV1JobSummarizeCancelledWebhookEvent as RobotsV1JobSummarizeCancelledWebhookEvent,
    type RobotsV1JobSummarizeCompletedWebhookEvent as RobotsV1JobSummarizeCompletedWebhookEvent,
    type RobotsV1JobSummarizeErroredWebhookEvent as RobotsV1JobSummarizeErroredWebhookEvent,
    type RobotsV1JobSummarizePendingWebhookEvent as RobotsV1JobSummarizePendingWebhookEvent,
    type RobotsV1JobSummarizeProcessingWebhookEvent as RobotsV1JobSummarizeProcessingWebhookEvent,
    type RobotsV1JobTranslateAudioCancelledWebhookEvent as RobotsV1JobTranslateAudioCancelledWebhookEvent,
    type RobotsV1JobTranslateAudioCompletedWebhookEvent as RobotsV1JobTranslateAudioCompletedWebhookEvent,
    type RobotsV1JobTranslateAudioErroredWebhookEvent as RobotsV1JobTranslateAudioErroredWebhookEvent,
    type RobotsV1JobTranslateAudioPendingWebhookEvent as RobotsV1JobTranslateAudioPendingWebhookEvent,
    type RobotsV1JobTranslateAudioProcessingWebhookEvent as RobotsV1JobTranslateAudioProcessingWebhookEvent,
    type RobotsV1JobTranslateCaptionsCancelledWebhookEvent as RobotsV1JobTranslateCaptionsCancelledWebhookEvent,
    type RobotsV1JobTranslateCaptionsCompletedWebhookEvent as RobotsV1JobTranslateCaptionsCompletedWebhookEvent,
    type RobotsV1JobTranslateCaptionsErroredWebhookEvent as RobotsV1JobTranslateCaptionsErroredWebhookEvent,
    type RobotsV1JobTranslateCaptionsPendingWebhookEvent as RobotsV1JobTranslateCaptionsPendingWebhookEvent,
    type RobotsV1JobTranslateCaptionsProcessingWebhookEvent as RobotsV1JobTranslateCaptionsProcessingWebhookEvent,
    type UnwrapWebhookEvent as UnwrapWebhookEvent,
  };
}
