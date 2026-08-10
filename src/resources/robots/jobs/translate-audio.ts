// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Translate the audio track to another language. This workflow is experimental and subject to change.
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
   *       to_language_code: 'es',
   *       upload_to_mux: true,
   *     },
   *   });
   * ```
   */
  create(body: TranslateAudioCreateParams, options?: RequestOptions): APIPromise<TranslateAudioJob> {
    return (
      this._client.post('/robots/v0/jobs/translate-audio', {
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
      this._client.get(path`/robots/v0/jobs/translate-audio/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranslateAudioJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

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
   * Workflow results. Present when status is 'completed'.
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
 * Workflow results. Present when status is 'completed'.
 */
export interface TranslateAudioJobOutputs {
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

export interface TranslateAudioJobParameters {
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
   * Whether to automatically upload the translated audio track to the Mux asset.
   * Defaults to true.
   */
  upload_to_mux?: boolean;
}

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
    type TranslateAudioJob as TranslateAudioJob,
    type TranslateAudioJobOutputs as TranslateAudioJobOutputs,
    type TranslateAudioJobParameters as TranslateAudioJobParameters,
    type TranslateAudioCreateParams as TranslateAudioCreateParams,
  };
}
