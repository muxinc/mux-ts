// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource transcriptionVocabularies', () => {
  test('retrieve', async () => {
    const responsePromise = client.video.transcriptionVocabularies.retrieve('TRANSCRIPTION_VOCABULARY_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: only required params', async () => {
    const responsePromise = client.video.transcriptionVocabularies.create({
      phrases: ['Mux', 'Live Stream', 'Playback ID', 'video encoding'],
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
    const response = await client.video.transcriptionVocabularies.create({
      phrases: ['Mux', 'Live Stream', 'Playback ID', 'video encoding'],
      name: 'Mux API Vocabulary',
      passthrough: 'passthrough',
    });
  });

  test('delete', async () => {
    const responsePromise = client.video.transcriptionVocabularies.delete('TRANSCRIPTION_VOCABULARY_ID');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: only required params', async () => {
    const responsePromise = client.video.transcriptionVocabularies.update('TRANSCRIPTION_VOCABULARY_ID', {
      phrases: ['Mux', 'Live Stream', 'RTMP', 'Stream Key'],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: required and optional params', async () => {
    const response = await client.video.transcriptionVocabularies.update('TRANSCRIPTION_VOCABULARY_ID', {
      phrases: ['Mux', 'Live Stream', 'RTMP', 'Stream Key'],
      name: 'Mux API Vocabulary - Updated',
      passthrough: 'passthrough',
    });
  });

  test('list', async () => {
    const responsePromise = client.video.transcriptionVocabularies.list();
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
      client.video.transcriptionVocabularies.list(
        { limit: 10, page: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Mux.NotFoundError);
  });
});
