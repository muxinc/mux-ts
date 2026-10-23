// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource directives', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.directives.create({
      bindings: [{ reference_id: 'moderation', workflow: 'moderate' }],
      name: 'Moderate new assets',
      subject: { type: 'video.asset' },
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
    const response = await client.robots.directives.create({
      bindings: [
        {
          reference_id: 'moderation',
          workflow: 'moderate',
          inputs: ['x'],
          parameters: {
            language_code: 'x',
            max_samples: 1,
            on_flagged: { action: 'delete_playback_ids' },
            output_steering: { scope: { end_time: 1, start_time: 0 } },
            sampling_interval: 5,
            thresholds: { sexual: 0, violence: 0 },
          },
        },
      ],
      name: 'Moderate new assets',
      subject: { type: 'video.asset' },
      resources: [
        {
          kind: 'subtitles',
          reference_id: 'subtitles_en',
          type: 'video.asset.track',
          language_code: 'en',
          source: { via: 'external' },
        },
      ],
    });
  });

  test('list', async () => {
    const responsePromise = client.robots.directives.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.robots.directives.list({ limit: 1, page: 1 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.directives.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete', async () => {
    const responsePromise = client.robots.directives.delete('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
