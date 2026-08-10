// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource findScenes', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.findScenes.create({
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
    const response = await client.robots.jobs.findScenes.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        language_code: 'en',
        min_scene_duration_ms: 15000,
        min_scenes: 4,
        output_steering: {
          audience: 'x',
          brand_terms: ['x'],
          narration_detail: 'balanced',
          scope: { end_time: 180, start_time: 30 },
          segmentation_strategy: 'editorial_beats',
          title_style: 'descriptive',
          topic_taxonomy: {
            allow_other: true,
            values: [
              {
                label: 'x',
                aliases: ['x'],
                description: 'x',
              },
            ],
            name: 'x',
          },
        },
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.findScenes.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
