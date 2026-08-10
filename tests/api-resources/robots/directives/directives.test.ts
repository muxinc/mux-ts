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
      name: 'Generate captions, then translate',
      subject: { type: 'video.asset' },
      workflows: [
        { reference_id: 'premium_captions', workflow: 'generate-premium-captions' },
        {
          params: { to_language_code: 'es' },
          reference_id: 'translate_es',
          workflow: 'translate-captions',
        },
      ],
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
      name: 'Generate captions, then translate',
      subject: { type: 'video.asset' },
      workflows: [
        {
          reference_id: 'premium_captions',
          workflow: 'generate-premium-captions',
          inputs: ['x'],
          params: {
            include_speakers: true,
            include_words: true,
            language_code: 'en',
            phrases: ['Mux', 'API'],
            replace_existing: true,
            track_name: 'x',
            upload_to_mux: true,
          },
        },
        {
          params: { to_language_code: 'es', upload_to_mux: true },
          reference_id: 'translate_es',
          workflow: 'translate-captions',
          inputs: ['captions_en'],
        },
      ],
      resources: [
        {
          kind: 'caption',
          reference_id: 'captions_en',
          type: 'video.asset.track',
          language: 'en',
          source: { binding: 'premium_captions', via: 'workflow' },
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
