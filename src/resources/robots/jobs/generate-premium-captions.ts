// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Generate high-quality captions for a Mux asset and upload the result as a text track. This workflow is experimental and subject to change.
 */
export class GeneratePremiumCaptions extends APIResource {
  /**
   * Creates a new job that generates high-quality captions for a Mux Video asset and
   * uploads the resulting VTT as a text track.
   *
   * @example
   * ```ts
   * const generatePremiumCaptionsJob =
   *   await client.robots.jobs.generatePremiumCaptions.create({
   *     parameters: {
   *       asset_id: 'mux_asset_123abc',
   *       language_code: 'en',
   *       replace_existing: false,
   *       include_speakers: false,
   *       include_words: false,
   *       upload_to_mux: true,
   *       phrases: ['Mux', 'API'],
   *     },
   *   });
   * ```
   */
  create(
    body: GeneratePremiumCaptionCreateParams,
    options?: RequestOptions,
  ): APIPromise<GeneratePremiumCaptionsJob> {
    return (
      this._client.post('/robots/v0/jobs/generate-premium-captions', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GeneratePremiumCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'generate-premium-captions' job.
   * Jobs are automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const generatePremiumCaptionsJob =
   *   await client.robots.jobs.generatePremiumCaptions.retrieve(
   *     'x',
   *   );
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<GeneratePremiumCaptionsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/generate-premium-captions/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GeneratePremiumCaptionsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface GeneratePremiumCaptionsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: GeneratePremiumCaptionsJobParameters;

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

  workflow: 'generate-premium-captions';

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
  outputs?: GeneratePremiumCaptionsJobOutputs;

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
export interface GeneratePremiumCaptionsJobOutputs {
  /**
   * Resolved language code of the generated captions (may differ from the requested
   * code when auto-detected).
   */
  language_code: string;

  /**
   * Mux track ID of the deleted track when replace_existing was true.
   */
  replaced_track_id?: string;

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

export interface GeneratePremiumCaptionsJobParameters {
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

export interface GeneratePremiumCaptionCreateParams {
  parameters: GeneratePremiumCaptionsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace GeneratePremiumCaptions {
  export {
    type GeneratePremiumCaptionsJob as GeneratePremiumCaptionsJob,
    type GeneratePremiumCaptionsJobOutputs as GeneratePremiumCaptionsJobOutputs,
    type GeneratePremiumCaptionsJobParameters as GeneratePremiumCaptionsJobParameters,
    type GeneratePremiumCaptionCreateParams as GeneratePremiumCaptionCreateParams,
  };
}
