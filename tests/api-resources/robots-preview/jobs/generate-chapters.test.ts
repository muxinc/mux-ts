// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/mux-node';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource generateChapters', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robotsPreview.jobs.generateChapters.create({
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
    const response = await client.robotsPreview.jobs.generateChapters.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        language_code: 'x',
        output_language_code: 'x',
        output_steering: {
          audience: 'Developers',
          brand_terms: ['x'],
          chapter_granularity: 'balanced',
          chapter_style: 'descriptive',
        },
        prompt_overrides: {
          chapter_guidelines: 'x',
          output_format: 'x',
          task: 'x',
          title_guidelines: 'x',
        },
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robotsPreview.jobs.generateChapters.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
