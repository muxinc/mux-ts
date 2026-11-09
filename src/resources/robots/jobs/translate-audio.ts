// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Translate the audio track to another language.
 */
export class TranslateAudio extends APIResource {
  /**
   * Creates a new job that translates the audio track of a Mux Video asset to
   * another language.
   *
   * @example
   * ```ts
   * const translateAudioJob =
   *   await client.robots.jobs.translateAudio.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       output_language_code: 'es',
   *       upload_to_mux: true,
   *       replace_existing_tracks: 'fail',
   *       captions: {
   *         upload_to_mux: true,
   *         replace_existing_tracks: 'fail',
   *       },
   *     },
   *   });
   * ```
   */
  create(body: TranslateAudioCreateParams, options?: RequestOptions): APIPromise<TranslateAudioJob> {
    return (
      this._client.post('/robots/v1/jobs/translate-audio', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateAudioJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'translate-audio' job. Jobs are
   * automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const translateAudioJob =
   *   await client.robots.jobs.translateAudio.retrieve('x');
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<TranslateAudioJob> {
    return (
      this._client.get(path`/robots/v1/jobs/translate-audio/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateAudioJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

/**
 * Optional subtitle attachment settings. Omitting this object or its upload_to_mux
 * disables caption upload; the dub's WebVTT download remains available when
 * retrieval succeeds.
 */
export interface TranslateAudioCaptions {
  /**
   * Subtitle conflict policy. Defaults to fail. Conflicts under this policy prevent
   * subtitle attachment and omit caption_track_id without failing the dubbing job.
   * replace_generated deletes only Mux-generated subtitles; uploaded tracks,
   * including earlier Robots outputs, block it. replace_all deletes every
   * conflicting subtitle or same-name text track. Conflicts match language ignoring
   * region or name ignoring case. A deleting policy requires captions.upload_to_mux
   * to be true. This policy never applies to audio tracks.
   */
  replace_existing_tracks?: TranslateAudioCaptionsReplaceExistingTracks;

  /**
   * Name for the dubbed subtitle track. Defaults to {Language} (dub), e.g. Spanish
   * (dub). Independent of the audio track_name.
   */
  track_name?: string;

  /**
   * Whether to attach the dub's translated WebVTT as a subtitle track. Defaults to
   * false, independently of the audio upload_to_mux. Caption conflicts and other
   * attachment failures omit caption_track_id without failing the completed dub.
   */
  upload_to_mux?: boolean;
}

/**
 * Subtitle conflict policy. Defaults to fail. Conflicts under this policy prevent
 * subtitle attachment and omit caption_track_id without failing the dubbing job.
 * replace_generated deletes only Mux-generated subtitles; uploaded tracks,
 * including earlier Robots outputs, block it. replace_all deletes every
 * conflicting subtitle or same-name text track. Conflicts match language ignoring
 * region or name ignoring case. A deleting policy requires captions.upload_to_mux
 * to be true. This policy never applies to audio tracks.
 */
export type TranslateAudioCaptionsReplaceExistingTracks = 'fail' | 'replace_all' | 'replace_generated';

export interface TranslateAudioJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: TranslateAudioJobParameters;

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

  workflow: 'translate-audio';

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
   * Workflow results. Present when status is completed.
   */
  outputs?: TranslateAudioJobOutputs;

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
 * Workflow results. Present when status is completed.
 */
export interface TranslateAudioJobOutputs {
  /**
   * Mux subtitle track ID when caption upload succeeded. Omitted when caption upload
   * was not requested or failed. Mux has accepted the track, which may still be
   * preparing.
   */
  caption_track_id?: string;

  /**
   * IDs of tracks deleted during replacement. Omitted when no deletions were
   * recorded; historical jobs may lack this information.
   */
  replaced_caption_track_ids?: JobsAPI.ReplacedTrackIDs;

  /**
   * IDs of tracks deleted during replacement. Omitted when no deletions were
   * recorded; historical jobs may lack this information.
   */
  replaced_track_ids?: JobsAPI.ReplacedTrackIDs;

  /**
   * Temporary pre-signed URL to download the dubbed audio with the FLAC output
   * format. Expires 7 days after the job completes.
   */
  temporary_audio_url?: string;

  /**
   * Temporary download URL for the dub's translated WebVTT, available independently
   * of asset uploads when retrieval succeeds. Expires after 7 days. This is the
   * dubbing translation, not a separate caption translation.
   */
  temporary_vtt_url?: string;

  /**
   * Mux audio track ID, present when upload_to_mux is true.
   */
  track_id?: string;
}

export interface TranslateAudioJobParameters {
  /**
   * The Mux asset ID of the video to translate.
   */
  asset_id: string;

  /**
   * BCP 47 language tag for the target audio (e.g. "es", "ur", "yue"). See
   * [supported languages](https://www.mux.com/docs/guides/robots-supported-languages#translate-audio).
   * Known ISO 639-3 aliases are accepted. Region and script subtags are retained on
   * Mux tracks, but dubbing uses the base language.
   */
  output_language_code: string;

  /**
   * Optional subtitle attachment settings. Omitting this object or its upload_to_mux
   * disables caption upload; the dub's WebVTT download remains available when
   * retrieval succeeds.
   */
  captions?: TranslateAudioCaptions;

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
  replace_existing_tracks?: TranslateAudioReplaceExistingTracks;

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
 * What to do when the asset already has an audio track in the same language as, or
 * with the same name as, the new dubbed track. Defaults to `fail`, which rejects
 * the request before any dubbing is billed. `replace_all` deletes every such track
 * first. Audio tracks are never auto-generated by Mux Video, so
 * `replace_generated` behaves as `fail` here. The asset's primary audio track is
 * never deleted. Any value other than `fail` requires `upload_to_mux` to be true.
 * Existing tracks are matched by language ignoring region subtags, and by name
 * ignoring case, in any status.
 */
export type TranslateAudioReplaceExistingTracks = 'fail' | 'replace_all' | 'replace_generated';

export interface TranslateAudioCreateParams {
  parameters: TranslateAudioJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace TranslateAudio {
  export {
    type TranslateAudioCaptions as TranslateAudioCaptions,
    type TranslateAudioCaptionsReplaceExistingTracks as TranslateAudioCaptionsReplaceExistingTracks,
    type TranslateAudioJob as TranslateAudioJob,
    type TranslateAudioJobOutputs as TranslateAudioJobOutputs,
    type TranslateAudioJobParameters as TranslateAudioJobParameters,
    type TranslateAudioReplaceExistingTracks as TranslateAudioReplaceExistingTracks,
    type TranslateAudioCreateParams as TranslateAudioCreateParams,
  };
}
