// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource playbackIds', () => {
  test('heatmap', async () => {
    const responsePromise = client.data.engagement.playbackIds.heatmap(
      'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('heatmap: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.engagement.playbackIds.heatmap(
        'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
        { timeframe: ['string'] },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('hotspots', async () => {
    const responsePromise = client.data.engagement.playbackIds.hotspots(
      'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('hotspots: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.data.engagement.playbackIds.hotspots(
        'nLp01dgPzELHV6101iHGXmS3Og7lEU01TUDb02kg2Z6mPRs',
        {
          limit: 0,
          order_direction: 'asc',
          timeframe: ['string'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });
});
