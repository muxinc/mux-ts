// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AskQuestionsAPI from './ask-questions';
import {
  AskQuestionCreateParams,
  AskQuestions,
  AskQuestionsJob,
  AskQuestionsJobOutputs,
  AskQuestionsJobParameters,
} from './ask-questions';
import * as EditCaptionsAPI from './edit-captions';
import {
  EditCaptionCreateParams,
  EditCaptions,
  EditCaptionsJob,
  EditCaptionsJobOutputs,
  EditCaptionsJobParameters,
} from './edit-captions';
import * as FindBestThumbnailsAPI from './find-best-thumbnails';
import {
  FindBestThumbnailCreateParams,
  FindBestThumbnails,
  FindBestThumbnailsJob,
  FindBestThumbnailsJobOutputs,
  FindBestThumbnailsJobParameters,
  FindBestThumbnailsOutputSteering,
} from './find-best-thumbnails';
import * as FindKeyMomentsAPI from './find-key-moments';
import {
  FindKeyMomentCreateParams,
  FindKeyMoments,
  FindKeyMomentsJob,
  FindKeyMomentsJobOutputs,
  FindKeyMomentsJobParameters,
  FindKeyMomentsOutputSteering,
} from './find-key-moments';
import * as FindScenesAPI from './find-scenes';
import {
  FindSceneCreateParams,
  FindScenes,
  FindScenesJob,
  FindScenesJobOutputs,
  FindScenesJobParameters,
  FindScenesOutputSteering,
} from './find-scenes';
import * as GenerateChaptersAPI from './generate-chapters';
import {
  GenerateChapterCreateParams,
  GenerateChapters,
  GenerateChaptersJob,
  GenerateChaptersJobOutputs,
  GenerateChaptersJobParameters,
  GenerateChaptersOutputSteering,
} from './generate-chapters';
import * as GenerateEngagementInsightsAPI from './generate-engagement-insights';
import {
  GenerateEngagementInsightCreateParams,
  GenerateEngagementInsights,
  GenerateEngagementInsightsJob,
  GenerateEngagementInsightsJobOutputs,
  GenerateEngagementInsightsJobParameters,
} from './generate-engagement-insights';
import * as GeneratePremiumCaptionsAPI from './generate-premium-captions';
import {
  GeneratePremiumCaptionCreateParams,
  GeneratePremiumCaptions,
  GeneratePremiumCaptionsJob,
  GeneratePremiumCaptionsJobOutputs,
  GeneratePremiumCaptionsJobParameters,
} from './generate-premium-captions';
import * as ModerateAPI from './moderate';
import {
  ActionOnFlagged,
  Moderate,
  ModerateCreateParams,
  ModerateJob,
  ModerateJobOutputs,
  ModerateJobParameters,
} from './moderate';
import * as SummarizeAPI from './summarize';
import {
  Summarize,
  SummarizeCreateParams,
  SummarizeJob,
  SummarizeJobOutputs,
  SummarizeJobParameters,
  SummarizeOutputSteering,
  SummaryTagTaxonomy,
} from './summarize';
import * as TranslateAudioAPI from './translate-audio';
import {
  TranslateAudio,
  TranslateAudioCreateParams,
  TranslateAudioJob,
  TranslateAudioJobOutputs,
  TranslateAudioJobParameters,
} from './translate-audio';
import * as TranslateCaptionsAPI from './translate-captions';
import {
  TranslateCaptionCreateParams,
  TranslateCaptions,
  TranslateCaptionsJob,
  TranslateCaptionsJobOutputs,
  TranslateCaptionsJobParameters,
} from './translate-captions';
import { APIPromise } from '../../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../../core/pagination';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * List and cancel jobs across all workflows.
 */
export class Jobs extends APIResource {
  askQuestions: AskQuestionsAPI.AskQuestions = new AskQuestionsAPI.AskQuestions(this._client);
  generateChapters: GenerateChaptersAPI.GenerateChapters = new GenerateChaptersAPI.GenerateChapters(
    this._client,
  );
  findKeyMoments: FindKeyMomentsAPI.FindKeyMoments = new FindKeyMomentsAPI.FindKeyMoments(this._client);
  moderate: ModerateAPI.Moderate = new ModerateAPI.Moderate(this._client);
  summarize: SummarizeAPI.Summarize = new SummarizeAPI.Summarize(this._client);
  translateCaptions: TranslateCaptionsAPI.TranslateCaptions = new TranslateCaptionsAPI.TranslateCaptions(
    this._client,
  );
  editCaptions: EditCaptionsAPI.EditCaptions = new EditCaptionsAPI.EditCaptions(this._client);
  findBestThumbnails: FindBestThumbnailsAPI.FindBestThumbnails = new FindBestThumbnailsAPI.FindBestThumbnails(
    this._client,
  );
  findScenes: FindScenesAPI.FindScenes = new FindScenesAPI.FindScenes(this._client);
  generateEngagementInsights: GenerateEngagementInsightsAPI.GenerateEngagementInsights =
    new GenerateEngagementInsightsAPI.GenerateEngagementInsights(this._client);
  generatePremiumCaptions: GeneratePremiumCaptionsAPI.GeneratePremiumCaptions =
    new GeneratePremiumCaptionsAPI.GeneratePremiumCaptions(this._client);
  translateAudio: TranslateAudioAPI.TranslateAudio = new TranslateAudioAPI.TranslateAudio(this._client);

  /**
   * Returns a paginated list of Robots jobs, with optional filters for workflow,
   * status, and asset_id. Jobs are automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const jobSummary of client.robots.jobs.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: JobListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<JobSummariesBasePage, JobSummary> {
    return this._client.getAPIList('/robots/v0/jobs', BasePage<JobSummary>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Cancels a job that is currently pending or processing.
   *
   * @example
   * ```ts
   * const jobSummary = await client.robots.jobs.cancel('x');
   * ```
   */
  cancel(jobID: string, options?: RequestOptions): APIPromise<JobSummary> {
    return (
      this._client.post(path`/robots/v0/jobs/${jobID}/cancel`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: JobSummary }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type JobSummariesBasePage = BasePage<JobSummary>;

/**
 * The directive run that dispatched this job. Absent for jobs created via direct
 * API POST.
 */
export interface JobDirectiveContext {
  /**
   * ID of the directive that dispatched this job.
   */
  id: string;

  /**
   * ID of the specific directive run that dispatched this job.
   */
  run_id: string;
}

export interface JobError {
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
 * Related Mux resources linked to this job.
 */
export interface JobResources {
  /**
   * Mux assets associated with this job.
   */
  assets: Array<SlimlineAsset>;
}

/**
 * Current job status.
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'errored' | 'cancelled';

export interface JobSummary {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Hypermedia links for this job.
   */
  _links: JobSummary._Links;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  /**
   * Current job status.
   */
  status: JobStatus;

  /**
   * Unix timestamp (seconds) of the job's last state transition (e.g. when it
   * started processing or reached a terminal state).
   */
  updated_at: number;

  /**
   * Workflow type that created this job.
   */
  workflow:
    | 'summarize'
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

export namespace JobSummary {
  /**
   * Hypermedia links for this job.
   */
  export interface _Links {
    self: _Links.Self;
  }

  export namespace _Links {
    export interface Self {
      /**
       * URL to this resource.
       */
      href: string;
    }
  }
}

/**
 * Optional execution window in seconds on the original asset timeline. The range
 * must contain a video frame at the asset frame rate. Omit start_time to begin at
 * the asset start and omit end_time to continue through the asset end. Returned
 * scene timestamps remain absolute asset timestamps.
 */
export interface OutputSteeringScope {
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
 * Controlled vocabulary used to steer scene concepts without changing the response
 * schema.
 */
export interface OutputSteeringTaxonomy {
  /**
   * When false, the model should prefer values from the taxonomy. When true,
   * non-taxonomy values may be used when no taxonomy value applies.
   */
  allow_other: boolean;

  /**
   * Controlled vocabulary values used as best-effort model guidance.
   */
  values: Array<OutputSteeringTaxonomyValue>;

  /**
   * Optional customer-facing name for the taxonomy.
   */
  name?: string;
}

export interface OutputSteeringTaxonomyValue {
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

export interface SlimlineAsset {
  /**
   * Mux asset ID.
   */
  id: string;

  /**
   * Hypermedia links for the asset.
   */
  _links: SlimlineAsset._Links;

  /**
   * Mux asset metadata, if available.
   */
  meta?: SlimlineAsset.Meta;

  /**
   * Passthrough string from the Mux asset.
   */
  passthrough?: string;
}

export namespace SlimlineAsset {
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

export interface JobListParams extends BasePageParams {
  /**
   * Filter by Mux asset ID
   */
  asset_id?: string;

  /**
   * Filter by job status
   */
  status?: JobStatus;

  /**
   * Filter by workflow name
   */
  workflow?:
    | 'summarize'
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

Jobs.AskQuestions = AskQuestions;
Jobs.GenerateChapters = GenerateChapters;
Jobs.FindKeyMoments = FindKeyMoments;
Jobs.Moderate = Moderate;
Jobs.Summarize = Summarize;
Jobs.TranslateCaptions = TranslateCaptions;
Jobs.EditCaptions = EditCaptions;
Jobs.FindBestThumbnails = FindBestThumbnails;
Jobs.FindScenes = FindScenes;
Jobs.GenerateEngagementInsights = GenerateEngagementInsights;
Jobs.GeneratePremiumCaptions = GeneratePremiumCaptions;
Jobs.TranslateAudio = TranslateAudio;

export declare namespace Jobs {
  export {
    type JobDirectiveContext as JobDirectiveContext,
    type JobError as JobError,
    type JobResources as JobResources,
    type JobStatus as JobStatus,
    type JobSummary as JobSummary,
    type OutputSteeringScope as OutputSteeringScope,
    type OutputSteeringTaxonomy as OutputSteeringTaxonomy,
    type OutputSteeringTaxonomyValue as OutputSteeringTaxonomyValue,
    type SlimlineAsset as SlimlineAsset,
    type JobSummariesBasePage as JobSummariesBasePage,
    type JobListParams as JobListParams,
  };

  export {
    AskQuestions as AskQuestions,
    type AskQuestionsJob as AskQuestionsJob,
    type AskQuestionsJobOutputs as AskQuestionsJobOutputs,
    type AskQuestionsJobParameters as AskQuestionsJobParameters,
    type AskQuestionCreateParams as AskQuestionCreateParams,
  };

  export {
    GenerateChapters as GenerateChapters,
    type GenerateChaptersJob as GenerateChaptersJob,
    type GenerateChaptersJobOutputs as GenerateChaptersJobOutputs,
    type GenerateChaptersJobParameters as GenerateChaptersJobParameters,
    type GenerateChaptersOutputSteering as GenerateChaptersOutputSteering,
    type GenerateChapterCreateParams as GenerateChapterCreateParams,
  };

  export {
    FindKeyMoments as FindKeyMoments,
    type FindKeyMomentsJob as FindKeyMomentsJob,
    type FindKeyMomentsJobOutputs as FindKeyMomentsJobOutputs,
    type FindKeyMomentsJobParameters as FindKeyMomentsJobParameters,
    type FindKeyMomentsOutputSteering as FindKeyMomentsOutputSteering,
    type FindKeyMomentCreateParams as FindKeyMomentCreateParams,
  };

  export {
    Moderate as Moderate,
    type ActionOnFlagged as ActionOnFlagged,
    type ModerateJob as ModerateJob,
    type ModerateJobOutputs as ModerateJobOutputs,
    type ModerateJobParameters as ModerateJobParameters,
    type ModerateCreateParams as ModerateCreateParams,
  };

  export {
    Summarize as Summarize,
    type SummarizeJob as SummarizeJob,
    type SummarizeJobOutputs as SummarizeJobOutputs,
    type SummarizeJobParameters as SummarizeJobParameters,
    type SummarizeOutputSteering as SummarizeOutputSteering,
    type SummaryTagTaxonomy as SummaryTagTaxonomy,
    type SummarizeCreateParams as SummarizeCreateParams,
  };

  export {
    TranslateCaptions as TranslateCaptions,
    type TranslateCaptionsJob as TranslateCaptionsJob,
    type TranslateCaptionsJobOutputs as TranslateCaptionsJobOutputs,
    type TranslateCaptionsJobParameters as TranslateCaptionsJobParameters,
    type TranslateCaptionCreateParams as TranslateCaptionCreateParams,
  };

  export {
    EditCaptions as EditCaptions,
    type EditCaptionsJob as EditCaptionsJob,
    type EditCaptionsJobOutputs as EditCaptionsJobOutputs,
    type EditCaptionsJobParameters as EditCaptionsJobParameters,
    type EditCaptionCreateParams as EditCaptionCreateParams,
  };

  export {
    FindBestThumbnails as FindBestThumbnails,
    type FindBestThumbnailsJob as FindBestThumbnailsJob,
    type FindBestThumbnailsJobOutputs as FindBestThumbnailsJobOutputs,
    type FindBestThumbnailsJobParameters as FindBestThumbnailsJobParameters,
    type FindBestThumbnailsOutputSteering as FindBestThumbnailsOutputSteering,
    type FindBestThumbnailCreateParams as FindBestThumbnailCreateParams,
  };

  export {
    FindScenes as FindScenes,
    type FindScenesJob as FindScenesJob,
    type FindScenesJobOutputs as FindScenesJobOutputs,
    type FindScenesJobParameters as FindScenesJobParameters,
    type FindScenesOutputSteering as FindScenesOutputSteering,
    type FindSceneCreateParams as FindSceneCreateParams,
  };

  export {
    GenerateEngagementInsights as GenerateEngagementInsights,
    type GenerateEngagementInsightsJob as GenerateEngagementInsightsJob,
    type GenerateEngagementInsightsJobOutputs as GenerateEngagementInsightsJobOutputs,
    type GenerateEngagementInsightsJobParameters as GenerateEngagementInsightsJobParameters,
    type GenerateEngagementInsightCreateParams as GenerateEngagementInsightCreateParams,
  };

  export {
    GeneratePremiumCaptions as GeneratePremiumCaptions,
    type GeneratePremiumCaptionsJob as GeneratePremiumCaptionsJob,
    type GeneratePremiumCaptionsJobOutputs as GeneratePremiumCaptionsJobOutputs,
    type GeneratePremiumCaptionsJobParameters as GeneratePremiumCaptionsJobParameters,
    type GeneratePremiumCaptionCreateParams as GeneratePremiumCaptionCreateParams,
  };

  export {
    TranslateAudio as TranslateAudio,
    type TranslateAudioJob as TranslateAudioJob,
    type TranslateAudioJobOutputs as TranslateAudioJobOutputs,
    type TranslateAudioJobParameters as TranslateAudioJobParameters,
    type TranslateAudioCreateParams as TranslateAudioCreateParams,
  };
}
