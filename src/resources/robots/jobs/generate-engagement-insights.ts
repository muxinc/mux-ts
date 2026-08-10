// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JobsAPI from './jobs';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Analyze viewer engagement patterns to identify high and low engagement moments with AI-powered insights. This workflow is experimental and subject to change.
 */
export class GenerateEngagementInsights extends APIResource {
  /**
   * Creates a new job that uses AI to analyze viewer engagement patterns and
   * generate insights for a Mux Video asset.
   *
   * @example
   * ```ts
   * const generateEngagementInsightsJob =
   *   await client.robots.jobs.generateEngagementInsights.create(
   *     { parameters: { asset_id: 'mux_asset_123abc' } },
   *   );
   * ```
   */
  create(
    body: GenerateEngagementInsightCreateParams,
    options?: RequestOptions,
  ): APIPromise<GenerateEngagementInsightsJob> {
    return (
      this._client.post('/robots/v0/jobs/generate-engagement-insights', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateEngagementInsightsJob }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves the current status and results of a 'generate-engagement-insights'
   * job. Jobs are automatically deleted after 30 days.
   *
   * @example
   * ```ts
   * const generateEngagementInsightsJob =
   *   await client.robots.jobs.generateEngagementInsights.retrieve(
   *     'x',
   *   );
   * ```
   */
  retrieve(jobID: string, options?: RequestOptions): APIPromise<GenerateEngagementInsightsJob> {
    return (
      this._client.get(path`/robots/v0/jobs/generate-engagement-insights/${jobID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: GenerateEngagementInsightsJob }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export interface GenerateEngagementInsightsJob {
  /**
   * Unique job identifier.
   */
  id: string;

  /**
   * Unix timestamp (seconds) when the job was created.
   */
  created_at: number;

  parameters: GenerateEngagementInsightsJobParameters;

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

  workflow: 'generate-engagement-insights';

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
  outputs?: GenerateEngagementInsightsJobOutputs;

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
export interface GenerateEngagementInsightsJobOutputs {
  /**
   * Per-moment engagement insights for identified hotspots.
   */
  moment_insights: Array<GenerateEngagementInsightsJobOutputs.MomentInsight>;

  /**
   * Overall engagement analysis across the video.
   */
  overall_insight: GenerateEngagementInsightsJobOutputs.OverallInsight;
}

export namespace GenerateEngagementInsightsJobOutputs {
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

export interface GenerateEngagementInsightsJobParameters {
  /**
   * The Mux asset ID of the video to analyze engagement for.
   */
  asset_id: string;
}

export interface GenerateEngagementInsightCreateParams {
  parameters: GenerateEngagementInsightsJobParameters;

  /**
   * Arbitrary string stored with the job and returned in responses. Useful for
   * correlating jobs with your own systems.
   */
  passthrough?: string;
}

export declare namespace GenerateEngagementInsights {
  export {
    type GenerateEngagementInsightsJob as GenerateEngagementInsightsJob,
    type GenerateEngagementInsightsJobOutputs as GenerateEngagementInsightsJobOutputs,
    type GenerateEngagementInsightsJobParameters as GenerateEngagementInsightsJobParameters,
    type GenerateEngagementInsightCreateParams as GenerateEngagementInsightCreateParams,
  };
}
