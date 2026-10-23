// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource analyzeStructure', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robotsV0.jobs.analyzeStructure.create({
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
    const response = await client.robotsV0.jobs.analyzeStructure.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        language_code: 'en',
        output_language_code: 'en',
        output_steering: {
          audience: 'Developers evaluating video APIs',
          brand_terms: ['Mux', 'Mux Data'],
          granularity: 'balanced',
          scope: { end_time: 300, start_time: 30 },
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
        update_asset_chapters: true,
        update_asset_meta: true,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robotsV0.jobs.analyzeStructure.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
