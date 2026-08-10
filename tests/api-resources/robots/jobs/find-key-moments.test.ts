// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource findKeyMoments', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.findKeyMoments.create({
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
    const response = await client.robots.jobs.findKeyMoments.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        max_moments: 10,
        output_steering: {
          audience: 'Developer advocates',
          brand_terms: ['x'],
          rubric_priorities: ['clarity_in_isolation', 'soundbite_quality'],
          scope: { end_time: 180, start_time: 30 },
          selection_strategy: 'educational_takeaways',
          title_style: 'punchy',
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
        target_duration_ms: { max: 45000, min: 15000 },
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.findKeyMoments.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
