import { createHmac } from 'node:crypto';
import Mux from '@mux/ts';

const secret = 'whsec_test_secret';
const client = new Mux({ tokenId: 'id', tokenSecret: 'secret', webhookSecret: secret });

const event = {
  type: 'video.asset.ready',
  object: { type: 'asset', id: 'abc' },
  data: { id: 'abc', title: 'héllo ✓' },
};
const rawBody = JSON.stringify(event);

function signedHeaders(body: string, ts = Math.floor(Date.now() / 1000)) {
  const sig = createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex');
  return { 'mux-signature': `t=${ts},v1=${sig}` };
}

describe('webhooks', () => {
  describe('verifySignature()', () => {
    test.each([
      ['string', () => rawBody],
      ['Buffer', () => Buffer.from(rawBody, 'utf-8')],
      ['Uint8Array', () => new TextEncoder().encode(rawBody)],
      ['ArrayBuffer', () => new TextEncoder().encode(rawBody).buffer as ArrayBuffer],
    ])('accepts the raw body as a %s', async (_kind, body) => {
      await expect(client.webhooks.verifySignature(body(), signedHeaders(rawBody))).resolves.toBeUndefined();
    });

    test('rejects a parsed body', async () => {
      await expect(
        client.webhooks.verifySignature(event as unknown as string, signedHeaders(rawBody)),
      ).rejects.toThrow(/raw request body/);
    });

    test('rejects a tampered Buffer body', async () => {
      const tampered = Buffer.from(rawBody.replace('"abc"', '"xyz"'), 'utf-8');
      await expect(client.webhooks.verifySignature(tampered, signedHeaders(rawBody))).rejects.toThrow(
        /No signatures found matching/,
      );
    });

    test('rejects a stale timestamp', async () => {
      const staleTs = Math.floor(Date.now() / 1000) - 600;
      await expect(client.webhooks.verifySignature(rawBody, signedHeaders(rawBody, staleTs))).rejects.toThrow(
        /too old/,
      );
    });
  });

  describe('unwrap()', () => {
    test('verifies and parses a Buffer body', async () => {
      const parsed = await client.webhooks.unwrap(Buffer.from(rawBody, 'utf-8'), signedHeaders(rawBody));
      expect(parsed).toEqual(event);
    });

    test('verifies and parses a string body', async () => {
      const parsed = await client.webhooks.unwrap(rawBody, signedHeaders(rawBody));
      expect(parsed).toEqual(event);
    });
  });
});
