// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/mux-node';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource uploads', () => {
  test('create: only required params', async () => {
    const responsePromise = client.video.uploads.create({ cors_origin: 'https://example.com/' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.video.uploads.create({
      cors_origin: 'https://example.com/',
      new_asset_settings: {
        advanced_playback_policies: [{ drm_configuration_id: 'drm_configuration_id', policy: 'public' }],
        copy_overlays: true,
        directives: [{ id: 'id' }],
        encoding_tier: 'smart',
        input: [
          {
            closed_captions: true,
            end_time: 0,
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'name',
                passthrough: 'passthrough',
              },
            ],
            language_code: 'language_code',
            name: 'name',
            overlay_settings: {
              height: 'height',
              horizontal_align: 'left',
              horizontal_margin: 'horizontal_margin',
              opacity: 'opacity',
              vertical_align: 'top',
              vertical_margin: 'vertical_margin',
              width: 'width',
            },
            passthrough: 'passthrough',
            start_time: 0,
            text_type: 'subtitles',
            type: 'video',
            url: 'url',
          },
        ],
        inputs: [
          {
            closed_captions: true,
            end_time: 0,
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'name',
                passthrough: 'passthrough',
              },
            ],
            language_code: 'language_code',
            name: 'name',
            overlay_settings: {
              height: 'height',
              horizontal_align: 'left',
              horizontal_margin: 'horizontal_margin',
              opacity: 'opacity',
              vertical_align: 'top',
              vertical_margin: 'vertical_margin',
              width: 'width',
            },
            passthrough: 'passthrough',
            start_time: 0,
            text_type: 'subtitles',
            type: 'video',
            url: 'url',
          },
        ],
        master_access: 'none',
        max_resolution_tier: '1080p',
        meta: {
          creator_id: 'creator_id',
          external_id: 'external_id',
          title: 'title',
        },
        mp4_support: 'none',
        normalize_audio: true,
        passthrough: 'passthrough',
        per_title_encode: true,
        playback_policies: ['public'],
        playback_policy: ['public'],
        static_renditions: [{ resolution: 'highest', passthrough: 'passthrough' }],
        test: true,
        video_quality: 'basic',
      },
      test: true,
      timeout: 60,
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.video.uploads.retrieve('abcd1234');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.video.uploads.list();
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
      client.video.uploads.list({ limit: 0, page: 0 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('cancel', async () => {
    const responsePromise = client.video.uploads.cancel('abcd1234');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
