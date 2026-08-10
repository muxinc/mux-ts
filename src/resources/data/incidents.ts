// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Incidents occur when an anomaly alert is triggered in Mux Data. The Incidents API provides operations related to the raising and managing of alerting incidents.
 */
export class Incidents extends APIResource {
  /**
   * Returns the details of an incident.
   *
   * @example
   * ```ts
   * const incidentResponse =
   *   await client.data.incidents.retrieve('abcd1234');
   * ```
   */
  retrieve(incidentID: string, options?: RequestOptions): APIPromise<IncidentResponse> {
    return this._client.get(path`/data/v1/incidents/${incidentID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns all the incidents that seem related to a specific incident.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const incident of client.data.incidents.listRelated(
   *   'abcd1234',
   * )) {
   *   // ...
   * }
   * ```
   */
  listRelated(
    incidentID: string,
    query: IncidentListRelatedParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<IncidentsBasePage, Incident> {
    return this._client.getAPIList(path`/data/v1/incidents/${incidentID}/related`, BasePage<Incident>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns a list of incidents.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const incident of client.data.incidents.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: IncidentListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<IncidentsBasePage, Incident> {
    return this._client.getAPIList('/data/v1/incidents', BasePage<Incident>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }
}

export type IncidentsBasePage = BasePage<Incident>;

export interface Incident {
  id: string;

  affected_views: number;

  affected_views_per_hour: number;

  affected_views_per_hour_on_open: number;

  breakdowns: Array<IncidentBreakdown>;

  description: string;

  error_description: string;

  impact: string;

  incident_key: string;

  measured_value: number | null;

  measured_value_on_close: number | null;

  measurement: string;

  notification_rules: Array<IncidentNotificationRule>;

  notifications: Array<IncidentNotification>;

  resolved_at: string | null;

  sample_size: number;

  sample_size_unit: string;

  severity: string;

  started_at: string;

  status: string;

  threshold: number;
}

export interface IncidentBreakdown {
  id: string;

  name: string;

  value: string;
}

export interface IncidentNotification {
  id: number;

  attempted_at: string;

  queued_at: string;
}

export interface IncidentNotificationRule {
  id: string;

  action: string;

  property_id: string;

  rules: Array<NotificationRule>;

  status: string;
}

export interface IncidentResponse {
  data: Incident;

  timeframe: Array<number>;

  total_row_count: number | null;
}

export interface NotificationRule {
  id: string;

  name: string;

  value: string;
}

export interface IncidentListRelatedParams extends BasePageParams {
  /**
   * Value to order the results by
   */
  order_by?: 'negative_impact' | 'value' | 'views' | 'field';

  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';
}

export interface IncidentListParams extends BasePageParams {
  /**
   * Value to order the results by
   */
  order_by?: 'negative_impact' | 'value' | 'views' | 'field';

  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';

  /**
   * Severity to filter incidents by
   */
  severity?: 'warning' | 'alert';

  /**
   * Status to filter incidents by
   */
  status?: 'open' | 'closed' | 'expired';
}

export declare namespace Incidents {
  export {
    type Incident as Incident,
    type IncidentBreakdown as IncidentBreakdown,
    type IncidentNotification as IncidentNotification,
    type IncidentNotificationRule as IncidentNotificationRule,
    type IncidentResponse as IncidentResponse,
    type NotificationRule as NotificationRule,
    type IncidentsBasePage as IncidentsBasePage,
    type IncidentListRelatedParams as IncidentListRelatedParams,
    type IncidentListParams as IncidentListParams,
  };
}
