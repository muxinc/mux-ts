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
   * Starts a v1 run for a v1 directive. A directive owned by v0 returns 404.
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
      this._client.post(path`/robots/v1/directives/${directiveID}/runs`, {
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
   * for await (const directiveRun of client.robots.directives.runs.list(
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
  ): PagePromise<DirectiveRunsBasePage, DirectiveRun> {
    return this._client.getAPIList(path`/robots/v1/directives/${directiveID}/runs`, BasePage<DirectiveRun>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Retrieves the status, node states, and outcome of a specific directive run. Runs
   * are retained for 30 days.
   *
   * @example
   * ```ts
   * const directiveRun =
   *   await client.robots.directives.runs.retrieve('x', 'x');
   * ```
   */
  retrieve(directiveID: string, runID: string, options?: RequestOptions): APIPromise<DirectiveRun> {
    return (
      this._client.get(path`/robots/v1/directives/${directiveID}/runs/${runID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: DirectiveRun }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type DirectiveRunsBasePage = BasePage<DirectiveRun>;

export type DirectiveNodeState =
  | DirectiveNodeState.DirectiveNodeDispatched
  | DirectiveNodeState.DirectiveNodeFailed
  | DirectiveNodeState.DirectiveNodeWaitingForResources
  | DirectiveNodeState.DirectiveNodeWaitingForSourceBindings;

export namespace DirectiveNodeState {
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

export interface DirectiveRun {
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
  node_states: Array<DirectiveNodeState>;

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
    type DirectiveNodeState as DirectiveNodeState,
    type DirectiveRun as DirectiveRun,
    type DirectiveRunsBasePage as DirectiveRunsBasePage,
    type RunCreateParams as RunCreateParams,
    type RunListParams as RunListParams,
  };
}
