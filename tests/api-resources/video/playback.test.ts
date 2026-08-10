// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource playback', () => {
  test('thumbnail: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.thumbnail(
        'PLAYBACK_ID',
        'jpg',
        {
          fit_mode: 'preserve',
          flip_h: true,
          flip_v: true,
          height: 0,
          latest: true,
          program_time: 0,
          rotate: 90,
          time: 0,
          TOKEN: 'TOKEN',
          width: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('animated: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.animated(
        'PLAYBACK_ID',
        'gif',
        {
          end: 0,
          fps: 0,
          height: 0,
          start: 0,
          TOKEN: 'TOKEN',
          width: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('storyboard: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.storyboard(
        'PLAYBACK_ID',
        'jpg',
        {
          asset_end_time: 0,
          asset_start_time: 0,
          program_end_time: 0,
          program_start_time: 0,
          TOKEN: 'TOKEN',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  // Prism routes incorrectly
  test.skip('storyboardVtt', async () => {
    const responsePromise = client.video.playback.storyboardVtt('PLAYBACK_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism routes incorrectly
  test.skip('storyboardVtt: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.storyboardVtt(
        'PLAYBACK_ID',
        {
          asset_end_time: 0,
          asset_start_time: 0,
          program_end_time: 0,
          program_start_time: 0,
          TOKEN: 'TOKEN',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  // Prism routes incorrectly
  test.skip('storyboardMeta', async () => {
    const responsePromise = client.video.playback.storyboardMeta('PLAYBACK_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism routes incorrectly
  test.skip('storyboardMeta: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.storyboardMeta(
        'PLAYBACK_ID',
        {
          asset_end_time: 0,
          asset_start_time: 0,
          format: 'jpg',
          program_end_time: 0,
          program_start_time: 0,
          TOKEN: 'TOKEN',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('hls: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.hls(
        'PLAYBACK_ID',
        {
          asset_end_time: 0,
          asset_start_time: 0,
          default_subtitles_lang: 'default_subtitles_lang',
          exclude_pdt: true,
          max_resolution: '270p',
          min_resolution: '270p',
          program_end_time: 0,
          program_start_time: 0,
          redundant_streams: true,
          rendition_order: 'desc',
          roku_trick_play: true,
          TOKEN: 'TOKEN',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('staticRendition: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.staticRendition(
        'PLAYBACK_ID',
        'capped-1080p.mp4',
        { TOKEN: 'TOKEN' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('track', async () => {
    const responsePromise = client.video.playback.track('PLAYBACK_ID', 'TRACK_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('track: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.track(
        'PLAYBACK_ID',
        'TRACK_ID',
        { TOKEN: 'TOKEN' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('transcript', async () => {
    const responsePromise = client.video.playback.transcript('PLAYBACK_ID', 'TRACK_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('transcript: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.video.playback.transcript(
        'PLAYBACK_ID',
        'TRACK_ID',
        { TOKEN: 'TOKEN' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });
});
