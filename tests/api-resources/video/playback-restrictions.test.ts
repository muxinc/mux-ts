// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource playbackRestrictions', () => {
  test('create: only required params', async () => {
    const responsePromise = client.video.playbackRestrictions.create({
      referrer: { allowed_domains: ['*.example.com'] },
      user_agent: {},
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
    const response = await client.video.playbackRestrictions.create({
      referrer: { allowed_domains: ['*.example.com'], allow_no_referrer: true },
      user_agent: { allow_high_risk_user_agent: false, allow_no_user_agent: false },
    });
  });

  test('list', async () => {
    const responsePromise = client.video.playbackRestrictions.list();
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
      client.video.playbackRestrictions.list({ limit: 0, page: 0 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Mux.NotFoundError);
  });

  test('delete', async () => {
    const responsePromise = client.video.playbackRestrictions.delete('PLAYBACK_RESTRICTION_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve', async () => {
    const responsePromise = client.video.playbackRestrictions.retrieve('PLAYBACK_RESTRICTION_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('updateReferrer: only required params', async () => {
    const responsePromise = client.video.playbackRestrictions.updateReferrer('PLAYBACK_RESTRICTION_ID', {
      allowed_domains: ['*.example.com'],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('updateReferrer: required and optional params', async () => {
    const response = await client.video.playbackRestrictions.updateReferrer('PLAYBACK_RESTRICTION_ID', {
      allowed_domains: ['*.example.com'],
      allow_no_referrer: true,
    });
  });

  test('updateUserAgent: only required params', async () => {
    const responsePromise = client.video.playbackRestrictions.updateUserAgent('PLAYBACK_RESTRICTION_ID', {
      allow_high_risk_user_agent: false,
      allow_no_user_agent: false,
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('updateUserAgent: required and optional params', async () => {
    const response = await client.video.playbackRestrictions.updateUserAgent('PLAYBACK_RESTRICTION_ID', {
      allow_high_risk_user_agent: false,
      allow_no_user_agent: false,
    });
  });
});
