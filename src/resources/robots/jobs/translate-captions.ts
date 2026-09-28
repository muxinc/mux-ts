// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Translate captions from one language to another.
 */
export class TranslateCaptions extends APIResource {
  /**
   * Creates a new job that translates captions on a Mux Video asset from one
   * language to another.
   *
   * @example
   * ```ts
   * const translateCaptionsJob =
   *   await client.robots.jobs.translateCaptions.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       track_id: 'track_en_abc123',
   *       to_language_code: 'es',
   *       upload_to_mux: true,
   *       never_translate: ['Mux'],
   *       replace_existing_tracks: 'fail',
   *     },
   *   });
   * ```
   */
  create(body: TranslateCaptionCreateParams, options?: RequestOptions): APIPromise<TranslateCaptionsJob> {
    return (
      this._client.post('/robots/v0/jobs/translate-captions', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'translate-captions' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const translateCaptionsJob =
   *   await client.robots.jobs.translateCaptions.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<TranslateCaptionsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/translate-captions/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface TranslateCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: TranslateCaptionsJobParameters;

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

  workflow: 'translate-captions';

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
  outputs?: TranslateCaptionsJobOutputs;

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
export interface TranslateCaptionsJobOutputs {
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
  replaced_tracks?: Array<JobsAPI.ReplacedTrack>;

  /**
   * Temporary pre-signed URL to download the translated VTT file. Present when
   * upload_to_mux is true. Expires 7 days after the job completes.
   */
  temporary_vtt_url?: string;

  /**
   * Mux text track ID of the uploaded translated captions. Present when
   * upload_to_mux is true.
   */
  uploaded_track_id?: string;
}

export interface TranslateCaptionsJobParameters {
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
  replace_existing_tracks?: TranslateCaptionsReplaceExistingTracks;

  /**
   * Whether to upload the translated VTT and attach it as a text track on the Mux
   * asset. Defaults to true.
   */
  upload_to_mux?: boolean;
}

/**
 * What to do when the asset already has a text track in the same language as, or
 * with the same name as, the translated track. Defaults to `fail`, which rejects
 * the request before any translation is billed. `replace_all` deletes every such
 * track first. `replace_generated` deletes only Mux Video auto-generated tracks
 * and rejects if an uploaded track is in the way. Any value other than `fail`
 * requires `upload_to_mux` to be true. Existing tracks are matched by language
 * ignoring region subtags, and by name ignoring case, in any status.
 */
export type TranslateCaptionsReplaceExistingTracks = 'fail' | 'replace_all' | 'replace_generated';

export interface TranslateCaptionCreateParams {
  parameters: TranslateCaptionsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace TranslateCaptions {
  export {
    type TranslateCaptionsJob as TranslateCaptionsJob,
    type TranslateCaptionsJobOutputs as TranslateCaptionsJobOutputs,
    type TranslateCaptionsJobParameters as TranslateCaptionsJobParameters,
    type TranslateCaptionsReplaceExistingTracks as TranslateCaptionsReplaceExistingTracks,
    type TranslateCaptionCreateParams as TranslateCaptionCreateParams,
  };
}
