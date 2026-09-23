// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource subviewMetrics', () => {
  test('getOverallValues', async () => {
    const responsePromise = client.data.subviewMetrics.getOverallValues('playing_time', 'rendition');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getOverallValues: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.subviewMetrics.getOverallValues(
        'playing_time',
        'rendition',
        { filters: ['string'], timeframe: ['string'] },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('listBreakdownValues', async () => {
    const responsePromise = client.data.subviewMetrics.listBreakdownValues('playing_time', 'rendition');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listBreakdownValues: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.subviewMetrics.listBreakdownValues(
        'playing_time',
        'rendition',
        {
          filters: ['string'],
          group_by: ['video_source_bitrate'],
          limit: 100,
          page: 0,
          timeframe: ['string'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  // Steady fails to recognize the required values[] bracket-array query param as present even when sent correctly (confirmed: identical request passes once required is dropped)
  test.skip('listComparisonValues: only required params', async () => {
    const responsePromise = client.data.subviewMetrics.listComparisonValues('playing_time', 'rendition', {
      dimension: 'dimension',
      values: ['string'],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Steady fails to recognize the required values[] bracket-array query param as present even when sent correctly (confirmed: identical request passes once required is dropped)
  test.skip('listComparisonValues: required and optional params', async () => {
    const response = await client.data.subviewMetrics.listComparisonValues('playing_time', 'rendition', {
      dimension: 'dimension',
      values: ['string'],
      breakdown_value_limit: 100,
      filters: ['string'],
      group_by: ['video_source_bitrate'],
      timeframe: ['string'],
    });
  });

  test('getBreakdownTimeseries', async () => {
    const responsePromise = client.data.subviewMetrics.getBreakdownTimeseries('playing_time', 'rendition');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getBreakdownTimeseries: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.subviewMetrics.getBreakdownTimeseries(
        'playing_time',
        'rendition',
        {
          breakdown_value_limit: 100,
          filters: ['string'],
          group_by: ['video_source_bitrate'],
          time_granularity: 'hour',
          timeframe: ['string'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('listDimensions', async () => {
    const responsePromise = client.data.subviewMetrics.listDimensions('rendition');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listDimensionValues', async () => {
    const responsePromise = client.data.subviewMetrics.listDimensionValues('rendition', 'country');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listDimensionValues: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.subviewMetrics.listDimensionValues(
        'rendition',
        'country',
        {
          filters: ['string'],
          limit: 250,
          order_by: 'playing_time',
          order_direction: 'asc',
          page: 0,
          query: 'query',
          timeframe: ['string'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });
});
