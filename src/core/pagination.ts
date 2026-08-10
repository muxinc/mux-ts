// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { MuxError } from './error';
import { FinalRequestOptions } from '../internal/request-options';
import { defaultParseResponse } from '../internal/parse';
import { type Mux } from '../client';
import { APIPromise } from './api-promise';
import { type APIResponseProps } from '../internal/parse';
import { maybeObj } from '../internal/utils/values';

export type PageRequestOptions = Pick<FinalRequestOptions, 'query' | 'headers' | 'body' | 'path' | 'method'>;

export abstract class AbstractPage<Item> implements AsyncIterable<Item> {
  #client: Mux;
  protected options: FinalRequestOptions;

  protected response: Response;
  protected body: unknown;

  constructor(client: Mux, response: Response, body: unknown, options: FinalRequestOptions) {
    this.#client = client;
    this.options = options;
    this.response = response;
    this.body = body;
  }

  abstract nextPageRequestOptions(): PageRequestOptions | null;

  abstract getPaginatedItems(): Item[];

  hasNextPage(): boolean {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageRequestOptions() != null;
  }

  async getNextPage(): Promise<this> {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new MuxError(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.',
      );
    }

    return await this.#client.requestAPIList(this.constructor as any, nextOptions);
  }

  async *iterPages(): AsyncGenerator<this> {
    let page: this = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
}

/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export class PagePromise<
    PageClass extends AbstractPage<Item>,
    Item = ReturnType<PageClass['getPaginatedItems']>[number],
  >
  extends APIPromise<PageClass>
  implements AsyncIterable<Item>
{
  constructor(
    client: Mux,
    request: Promise<APIResponseProps>,
    Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass,
  ) {
    super(
      client,
      request,
      async (client, props) =>
        new Page(client, props.response, await defaultParseResponse(client, props), props.options),
    );
  }

  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}

export interface PageWithTotalResponse<Item> {
  data: Array<Item>;

  total_row_count: number;

  timeframe: Array<number>;

  /**
   * Number of assets returned in this response. Default value is 100.
   */
  limit: number;
}

export interface PageWithTotalParams {
  page?: number;

  limit?: number;
}

export class PageWithTotal<Item> extends AbstractPage<Item> implements PageWithTotalResponse<Item> {
  data: Array<Item>;

  total_row_count: number;

  timeframe: Array<number>;

  /**
   * Number of assets returned in this response. Default value is 100.
   */
  limit: number;

  constructor(
    client: Mux,
    response: Response,
    body: PageWithTotalResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.total_row_count = body.total_row_count || 0;
    this.timeframe = body.timeframe || [];
    this.limit = body.limit || 0;
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const query = this.options.query as PageWithTotalParams;
    const currentPage = query?.page ?? 1;

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: currentPage + 1,
      },
    };
  }
}

export interface PageWithTimeframeResponse<Item> {
  data: Array<Item>;

  timeframe: Array<number>;

  page: number;

  /**
   * Number of items returned in this response.
   */
  limit: number;
}

export interface PageWithTimeframeParams {
  page?: number;

  limit?: number;
}

export class PageWithTimeframe<Item> extends AbstractPage<Item> implements PageWithTimeframeResponse<Item> {
  data: Array<Item>;

  timeframe: Array<number>;

  page: number;

  /**
   * Number of items returned in this response.
   */
  limit: number;

  constructor(
    client: Mux,
    response: Response,
    body: PageWithTimeframeResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.timeframe = body.timeframe || [];
    this.page = body.page || 0;
    this.limit = body.limit || 0;
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const currentPage = this.page;

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: currentPage + 1,
      },
    };
  }
}

export interface BasePageResponse<Item> {
  data: Array<Item>;
}

export interface BasePageParams {
  page?: number;

  limit?: number;
}

export class BasePage<Item> extends AbstractPage<Item> implements BasePageResponse<Item> {
  data: Array<Item>;

  constructor(client: Mux, response: Response, body: BasePageResponse<Item>, options: FinalRequestOptions) {
    super(client, response, body, options);

    this.data = body.data || [];
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const query = this.options.query as BasePageParams;
    const currentPage = query?.page ?? 1;

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: currentPage + 1,
      },
    };
  }
}

export interface CursorPageResponse<Item> {
  data: Array<Item>;

  next_cursor: string;
}

export interface CursorPageParams {
  cursor?: string;

  limit?: number;
}

export class CursorPage<Item> extends AbstractPage<Item> implements CursorPageResponse<Item> {
  data: Array<Item>;

  next_cursor: string;

  constructor(client: Mux, response: Response, body: CursorPageResponse<Item>, options: FinalRequestOptions) {
    super(client, response, body, options);

    this.data = body.data || [];
    this.next_cursor = body.next_cursor || '';
  }

  getPaginatedItems(): Item[] {
    return this.data ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const cursor = this.next_cursor;
    if (!cursor) {
      return null;
    }

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        cursor,
      },
    };
  }
}
