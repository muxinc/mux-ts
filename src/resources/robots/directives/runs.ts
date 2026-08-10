// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../../core/pagination';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * Define which Robots workflows should run against Mux assets, and under what conditions.
 */
export class Runs extends APIResource {
  /**
   * Starts a directive run against a specific Mux asset. The directive engine
   * dispatches the configured workflows and tracks the run to terminal.
   *
   * @example
   * ```ts
   * const directiveRun =
   *   await client.robots.directives.runs.create('x', {
   *     asset_id: 'abc123def456',
   *   });
   * ```
   */
  create(directiveID: string, body: RunCreateParams, options?: RequestOptions): APIPromise<DirectiveRun> {
    return (
      this._client.post(path`/robots/v0/directives/${directiveID}/runs`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: DirectiveRun }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns a paginated list of runs for a directive, newest first. Runs are
   * retained for 30 days.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const directiveRunDetail of client.robots.directives.runs.list(
   *   'x',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(
    directiveID: string,
    query: RunListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DirectiveRunDetailsBasePage, DirectiveRunDetail> {
    return this._client.getAPIList(
      path`/robots/v0/directives/${directiveID}/runs`,
      BasePage<DirectiveRunDetail>,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }

  /**
   * Retrieves the status, node states, and outcome of a specific directive run. Runs
   * are retained for 30 days.
   *
   * @example
   * ```ts
   * const directiveRunDetail =
   *   await client.robots.directives.runs.retrieve('x', 'x');
   * ```
   */
  retrieve(directiveID: string, runID: string, options?: RequestOptions): APIPromise<DirectiveRunDetail> {
    return (
      this._client.get(path`/robots/v0/directives/${directiveID}/runs/${runID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: DirectiveRunDetail }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type DirectiveRunDetailsBasePage = BasePage<DirectiveRunDetail>;

export interface DirectiveRun {
  /**
   * Unique run identifier (drvrun\_...).
   */
  run_id: string;

  /**
   * The run has been queued.
   */
  status: 'pending';

  /**
   * The bare Mux asset ID the directive is running against.
   */
  subject_id: string;
}

export interface DirectiveRunDetail {
  /**
   * Unix timestamp (seconds) when the run reached terminal state. Null if still in
   * progress.
   */
  completed_at: number | null;

  /**
   * Per-binding status entries, one per binding, in the order the bindings appear in
   * `directive.workflows[]`.
   */
  node_states: Array<NodeState>;

  /**
   * Unique run identifier (drvrun\_...).
   */
  run_id: string;

  /**
   * Unix timestamp (seconds) when the run started.
   */
  started_at: number;

  /**
   * Current run status.
   */
  status: 'pending' | 'dispatching' | 'running' | 'waiting' | 'completed' | 'partial' | 'errored';

  /**
   * The bare Mux asset ID this run targeted.
   */
  subject_id: string;
}

/**
 * The state of one workflow binding within a directive run.
 */
export type NodeState =
  | NodeState.NodeStateDispatched
  | NodeState.NodeStateFailed
  | NodeState.NodeStateWaitingForResources
  | NodeState.NodeStateWaitingForSourceWorkflow;

export namespace NodeState {
  export interface NodeStateDispatched {
    /**
     * Encoded workflow job identifier (rjob\_...).
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
}

export interface RunCreateParams {
  /**
   * The bare Mux asset ID to run the directive against, as returned by the Mux Video
   * API.
   */
  asset_id: string;
}

export interface RunListParams extends BasePageParams {}

export declare namespace Runs {
  export {
    type DirectiveRun as DirectiveRun,
    type DirectiveRunDetail as DirectiveRunDetail,
    type NodeState as NodeState,
    type DirectiveRunDetailsBasePage as DirectiveRunDetailsBasePage,
    type RunCreateParams as RunCreateParams,
    type RunListParams as RunListParams,
  };
}
