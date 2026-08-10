// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource editCaptions', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.editCaptions.create({
      parameters: { asset_id: 'mux_asset_123abc', track_id: 'text_track_456def' },
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
    const response = await client.robots.jobs.editCaptions.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        track_id: 'text_track_456def',
        auto_censor_profanity: {
          always_censor: ['x'],
          detection_method: 'llm',
          mode: 'blank',
          never_censor: ['x'],
        },
        delete_original_track: true,
        replacements: [
          {
            find: 'Mucks',
            replace: 'Mux',
            case_sensitive: true,
          },
          {
            find: 'gonna',
            replace: 'going to',
            case_sensitive: true,
          },
        ],
        track_name_suffix: 'x',
        upload_to_mux: true,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.editCaptions.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
