// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource generateContextualText', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.generateContextualText.create({
      parameters: {
        artifacts: [{ key: 'x_post' }, { key: 'blog_post' }],
        asset_id: 'mux_asset_123abc',
        variants: [{ key: 'product_led' }, { key: 'insight_led' }],
      },
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
    const response = await client.robots.jobs.generateContextualText.create({
      parameters: {
        artifacts: [
          {
            key: 'x_post',
            channel: 'x',
            format: 'plain',
            instructions: 'x',
            max_length: { unit: 'characters', value: 280 },
          },
          {
            key: 'blog_post',
            channel: 'generic',
            format: 'markdown',
            instructions: 'x',
            max_length: { unit: 'words', value: 1200 },
          },
        ],
        asset_id: 'mux_asset_123abc',
        variants: [
          { key: 'product_led', instructions: 'Use a promotional, product-led angle.' },
          { key: 'insight_led', instructions: 'Use an educational, insight-led angle.' },
        ],
        language_code: 'olg-hCYD-0BWppl',
        output_language_code: 'olg-hCYD-0BWppl',
        output_steering: {
          audience: 'Video developers',
          brand_terms: ['x'],
          call_to_action: 'none',
          scope: { end_time: 1, start_time: 0 },
          voice: 'conversational',
        },
        use_shots: true,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.generateContextualText.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
