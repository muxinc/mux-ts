// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource summarize', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.summarize.create({
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
    const response = await client.robots.jobs.summarize.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        description_length: 1,
        language_code: 'x',
        output_language_code: 'x',
        output_steering: {
          audience: 'Product marketers',
          brand_terms: ['Mux', 'Robots'],
          scope: { end_time: 180, start_time: 30 },
          summary_style: 'concise',
          tag_taxonomy: {
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
        prompt_overrides: {
          description: 'x',
          keywords: 'x',
          quality_guidelines: 'x',
          task: 'x',
          title: 'x',
        },
        tag_count: 10,
        title_length: 1,
        tone: 'neutral',
        update_asset_meta: true,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.summarize.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
