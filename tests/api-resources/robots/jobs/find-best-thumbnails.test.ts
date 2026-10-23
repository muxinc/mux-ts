// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource findBestThumbnails', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.findBestThumbnails.create({
      parameters: { asset_id: 'mux_asset_123abc' },
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.robots.jobs.findBestThumbnails.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        max_thumbnails: 5,
        output_steering: {
          audience: 'x',
          campaign_style: 'x',
          looking_for: 'x',
          scope: { end_time: 1, start_time: 0 },
          scoring_priorities: ['focus'],
          selection_strategy: 'face_or_action',
        },
        update_asset_thumbnail: true,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.findBestThumbnails.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
