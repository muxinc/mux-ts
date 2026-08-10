// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource askQuestions', () => {
  test('create: only required params', async () => {
    const responsePromise = client.robots.jobs.askQuestions.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        questions: [
          { question: 'Is this video about glasses?' },
          { question: 'What is the primary subject?' },
          { question: 'Describe the primary subject in one sentence.' },
        ],
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
    const response = await client.robots.jobs.askQuestions.create({
      parameters: {
        asset_id: 'mux_asset_123abc',
        questions: [
          {
            question: 'Is this video about glasses?',
            answer_options: ['x'],
            free_form_reply: true,
          },
          {
            question: 'What is the primary subject?',
            answer_options: ['glasses', 'watches', 'shoes', 'hats'],
            free_form_reply: true,
          },
          {
            question: 'Describe the primary subject in one sentence.',
            answer_options: ['x'],
            free_form_reply: true,
          },
        ],
        language_code: 'x',
        max_free_form_answer_length: 300,
      },
      passthrough: 'passthrough',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.robots.jobs.askQuestions.retrieve('x');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
