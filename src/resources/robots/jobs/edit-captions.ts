// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Edit an existing caption track with find-and-replace edits and optional profanity censoring.
 */
export class EditCaptions extends APIResource {
  /**
   * Creates a new job that edits an existing Mux text track using static
   * replacements, speaker-label replacements, and optional profanity censoring.
   * Provide at least one of `replacements`, `speaker_replacements`, or
   * `auto_censor_profanity`.
   *
   * @example
   * ```ts
   * const editCaptionsJob =
   *   await client.robots.jobs.editCaptions.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       track_id: 'text_track_456def',
   *       replacements: [
   *         {
   *           find: 'Mucks',
   *           replace: 'Mux',
   *           case_sensitive: true,
   *         },
   *         { find: 'gonna', replace: 'going to' },
   *       ],
   *       speaker_replacements: [
   *         { find: 'speaker_0', replace: 'Alice' },
   *       ],
   *       upload_to_mux: true,
   *       replace_existing_tracks: 'replace',
   *     },
   *   });
   * ```
   */
  create(body: EditCaptionCreateParams, options?: RequestOptions): APIPromise<EditCaptionsJob> {
    return (
      this._client.post('/robots/v0/jobs/edit-captions', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: EditCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of an 'edit-captions' job.
   *
   * @example
   * ```ts
   * const editCaptionsJob =
   *   await client.robots.jobs.editCaptions.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<EditCaptionsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/edit-captions/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: EditCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface EditCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: EditCaptionsJobParameters;

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

  workflow: 'edit-captions';

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
  outputs?: EditCaptionsJobOutputs;

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
export interface EditCaptionsJobOutputs {
  /**
   * Total count of cue text replacements applied across all edit operations.
   */
  total_replacement_count: number;

  /**
   * Every track deleted before the new track was created. Present when
   * `replace_existing_tracks` was a deleting policy and at least one track was
   * removed.
   */
  replaced_tracks?: Array<JobsAPI.ReplacedTrack>;

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

export interface EditCaptionsJobParameters {
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
  auto_censor_profanity?: EditCaptionsJobParameters.AutoCensorProfanity;

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
  replacements?: Array<EditCaptionsJobParameters.Replacement>;

  /**
   * Optional replacements for bracketed speaker labels at the start of caption cues.
   * Values omit the surrounding square brackets, and matching spoken text is not
   * changed.
   */
  speaker_replacements?: Array<EditCaptionsSpeakerReplacement>;

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

export namespace EditCaptionsJobParameters {
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

export interface EditCaptionsSpeakerReplacement {
  /**
   * Existing speaker label without the surrounding square brackets.
   */
  find: string;

  /**
   * New speaker label without the surrounding square brackets.
   */
  replace: string;
}

export interface EditCaptionCreateParams {
  parameters: EditCaptionsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace EditCaptions {
  export {
    type EditCaptionsJob as EditCaptionsJob,
    type EditCaptionsJobOutputs as EditCaptionsJobOutputs,
    type EditCaptionsJobParameters as EditCaptionsJobParameters,
    type EditCaptionsSpeakerReplacement as EditCaptionsSpeakerReplacement,
    type EditCaptionCreateParams as EditCaptionCreateParams,
  };
}
