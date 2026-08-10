// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Annotations allow you to add notes at a specific datetime to view in the Mux Data dashboard.
 */
export class Annotations extends APIResource {
  /**
   * Returns a list of annotations.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const annotation of client.data.annotations.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: AnnotationListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AnnotationsBasePage, Annotation> {
    return this._client.getAPIList('/data/v1/annotations', BasePage<Annotation>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Returns the details of a specific annotation.
   *
   * @example
   * ```ts
   * const annotation = await client.data.annotations.retrieve(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  retrieve(annotationID: string, options?: RequestOptions): APIPromise<Annotation> {
    return (
      this._client.get(path`/data/v1/annotations/${annotationID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Annotation }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Creates a new annotation.
   *
   * @example
   * ```ts
   * const annotation = await client.data.annotations.create({
   *   date: 1745438400,
   *   note: 'This is a note',
   *   sub_property_id: '123456',
   * });
   * ```
   */
  create(body: AnnotationCreateParams, options?: RequestOptions): APIPromise<Annotation> {
    return (
      this._client.post('/data/v1/annotations', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Annotation }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes an annotation.
   *
   * @example
   * ```ts
   * await client.data.annotations.delete(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  delete(annotationID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/data/v1/annotations/${annotationID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates an existing annotation.
   *
   * @example
   * ```ts
   * const annotation = await client.data.annotations.update(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *   {
   *     date: 1745438400,
   *     note: 'This is a note',
   *     sub_property_id: '123456',
   *   },
   * );
   * ```
   */
  update(
    annotationID: string,
    body: AnnotationUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Annotation> {
    return (
      this._client.patch(path`/data/v1/annotations/${annotationID}`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Annotation }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type AnnotationsBasePage = BasePage<Annotation>;

export interface Annotation {
  /**
   * Unique identifier for the annotation
   */
  id: string;

  /**
   * Datetime when the annotation applies
   */
  date: string;

  /**
   * The annotation note content
   */
  note: string;

  /**
   * Customer-defined sub-property identifier
   */
  sub_property_id?: string | null;
}

export interface AnnotationInput {
  /**
   * Datetime when the annotation applies (Unix timestamp)
   */
  date: number;

  /**
   * The annotation note content
   */
  note: string;

  /**
   * Customer-defined sub-property identifier
   */
  sub_property_id?: string;
}

export interface AnnotationResponse {
  data: Annotation;
}

export interface ListAnnotationsResponse {
  data: Array<Annotation>;

  /**
   * Total number of annotations available
   */
  total_row_count: number;

  /**
   * Start and end unix timestamps for the data range
   */
  timeframe?: Array<number>;
}

export interface AnnotationListParams extends BasePageParams {
  /**
   * Sort order.
   */
  order_direction?: 'asc' | 'desc';

  /**
   * Timeframe window to limit results by. Must be provided as an array query string
   * parameter (e.g. timeframe[]=).
   *
   * Accepted formats are...
   *
   * - array of epoch timestamps e.g. `timeframe[]=1498867200&timeframe[]=1498953600`
   * - duration string e.g. `timeframe[]=24:hours or timeframe[]=7:days`
   */
  timeframe?: Array<string>;
}

export interface AnnotationCreateParams {
  /**
   * Datetime when the annotation applies (Unix timestamp)
   */
  date: number;

  /**
   * The annotation note content
   */
  note: string;

  /**
   * Customer-defined sub-property identifier
   */
  sub_property_id?: string;
}

export interface AnnotationUpdateParams {
  /**
   * Datetime when the annotation applies (Unix timestamp)
   */
  date: number;

  /**
   * The annotation note content
   */
  note: string;

  /**
   * Customer-defined sub-property identifier
   */
  sub_property_id?: string;
}

export declare namespace Annotations {
  export {
    type Annotation as Annotation,
    type AnnotationInput as AnnotationInput,
    type AnnotationResponse as AnnotationResponse,
    type ListAnnotationsResponse as ListAnnotationsResponse,
    type AnnotationsBasePage as AnnotationsBasePage,
    type AnnotationListParams as AnnotationListParams,
    type AnnotationCreateParams as AnnotationCreateParams,
    type AnnotationUpdateParams as AnnotationUpdateParams,
  };
}
