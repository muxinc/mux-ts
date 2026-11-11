// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Mux from '@mux/ts';
import { createPrivateKey } from 'node:crypto';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  jwtSigningKey: null,
  jwtPrivateKey: null,
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

// Shared with every Mux SDK generator; see stlc packages/mux-conformance/cases.json.
const keyId = 'conformance-key-id';
const encodedKey =
  'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2d0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktrd2dnU2xBZ0VBQW9JQkFRQy9TUFppWVJVYldFUjgKTHFFQzcxRXY5d1R4eEtjRzQzWjk2Z1k2bElzd3Q0VThXQmJFMDBmQzFQY1pCUUVwVHQxQ2p6UVlzUmMvV0tqKwo5Y1Z4OFp1QVI3dFVJZDAyMS9hRE5ST1MyZTN6NVlEZmU5RVB1RTNWTlluQU15cTFFR0t2MnBkRGFaR3V2UkF6CmthMVAzVUNBWVBWYkpnalhVWW1KWlhhSXFEZk9sV0NNSGtndXFJbTVwVFpwckxFK0JLVGlwVG5nMVJleU1hZysKcjZWNWRWUkhmbGhrUUJhQS96NXJnS0w4eVdRWHJDSVBKMVVaNGVYaFFDcFFGN01DYjRoWFpiSjVBdUx3SzZjNgpGc3JmK1U2cit1QWIvV2lKanBRTVRldWpRRnV1MjlGS3ZYMWpDYVovUjRBT0M3RnQ4djVuTHQzd1RpQ211MzJrClNtcEZIVm54QWdNQkFBRUNnZ0VBQ01jdzQxZmdMNWFQNGdFRHk0NHU5QndLWW92clBGSXc3RnRTZU5xN1BudVYKaGl6bXNwYWRpdS9aL1JCeE9yT1BUTkFrakdPSUZSU2RBTUpIa3RDTEdjcHc2czM1Q0Z6Rng4U21SczF3Y1lwZApMU1JSOWo0M2VDclNUUHNzSVE0RThWdi9LQTFPcmEyb2NpMWp2akFCbDBLYno5aUJmRndXQ3pPWVNuSXB5WFdXCkdHK2JmeVVGMTgxaVZkdE9kTDBDYUVaWTY0VlJjcU4rcFNObDF3VEhPWHZZK2RpNkdEWlBUaDgrWG9tZ3FKT1MKV1l5ZkpGR0lXdklmaUhYZXhEUDBFMi95Z0s2ck1OdVJGV0ZoMkVlMFZ5WldRMnRPT1NnVmtTZWVQejhoOW1SZgpmZkZDbzc2cDNCZ2NKZUx5a1FDWVdWSVFIS3VuNzVaVGR5ODJjQUc1eVFLQmdRRG9jUHd3c3NoK3d2SjV0SG91Cm5vMHplRXZOVUZ1ZzhxTzZVcjBRR0dMdS9aQ1dOSldNNkt5UExUeTJxdkhjR3pJL1B6WlFYVkZ2QzhIUnBPa3kKby9jNFBDYVZlS0pQSVpTaVY3UnA1ZXpCSzdDeERCQVlWSUVmamliRmxJQ2xhWDFGanB6dW9ZeW91dUZMZ05zRQp2YkMxZ0NGZG1xSldRV2QyYnhrUHhmR0hGUUtCZ1FEU3JCNWxETCtuMENsdERwcTJ0bjZma2JJbFNZR1lkYXk0CkIzQVllTTk0WUVSSmVBQllEMTlINmFhL3NVNExldWN2NE96cW5CTnpMUFRyeXRyUEE2Q3R5bmNWekRueGhiOVUKSXRMTnloODU5NzNJOERhM3Q0OElNdm5KcTdpcitDTHR4RkhneE40RkVNd291RmFPcFMzMElUS1R1T1lXMERlaQp6cVppUkVEK2JRS0JnUUROSHZmT1dkZEkxZXg0cm1Xc1FrckZBd0dSdTdwQWZCODBTOU9BSXFVYjFqUUQrWCtJCkM4Ukx6VlhvdFU0ZU9Qbk1pcEg1dFlBcGlLeVB2d0h6cUhKLzg4VHczcllOTXNzaHdGZjdvK1djU2x2d3dYNXEKbWhnZ3FxZFljTVplTW90VUdKZ3dsZXUwOHNYaWhXSEIrMHUzdjh5eDk4WU9iRVZMWkpzdktqVU1TUUtCZ1FDVwpQc0F5aXVRSWQxR0VBSDFnUDBpUTNxUnhLVG91bEFYSS9TejVsdmRIdjBnVUtXdjlZWUV2VlRoaHo3NThPM3V6ClRyTklJbVZRcDhoSWZWU05mT1hUNitmLytMVitSVWVOWm9SMjFXWnR2Znh3MkxmOVVBREc5U3Zsb3YxQ1QrWUIKTWhpK3QwZ3J6cTM3Z0hQaXFYVGJmZTJISXIrZGw0T0dMZURGaGkzZ0JRS0JnUURja0ZyNFY3RHZVbGNXTWhxNwp5MG4xNFpiZEI3emRPUDU0VVZ0dHpBVER5bHQ0MHl1djFOc1l2Wm53bHpod29QU05SQVVaVWx5dFNDL2hxMWg1Cmk0bVA2clZFMFIxM3V0RmZTOU9kNGpZaW1rT0dUYzZBbng0ekJqTUhNdUI1Z0RzTU9iZzVoWXdaMGxTa1NvM0YKVlJZUDdSNng5VE9kWE50Wi8yalBYczBFVlE9PQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==';
const pkcs8Pem = Buffer.from(encodedKey, 'base64').toString('utf-8');
const pkcs1Pem = createPrivateKey(pkcs8Pem).export({ type: 'pkcs1', format: 'pem' }).toString();
const publicKeyPem =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0j2YmEVG1hEfC6hAu9R\nL/cE8cSnBuN2feoGOpSLMLeFPFgWxNNHwtT3GQUBKU7dQo80GLEXP1io/vXFcfGb\ngEe7VCHdNtf2gzUTktnt8+WA33vRD7hN1TWJwDMqtRBir9qXQ2mRrr0QM5GtT91A\ngGD1WyYI11GJiWV2iKg3zpVgjB5ILqiJuaU2aayxPgSk4qU54NUXsjGoPq+leXVU\nR35YZEAWgP8+a4Ci/MlkF6wiDydVGeHl4UAqUBezAm+IV2WyeQLi8CunOhbK3/lO\nq/rgG/1oiY6UDE3ro0BbrtvRSr19Ywmmf0eADguxbfL+Zy7d8E4gprt9pEpqRR1Z\n8QIDAQAB\n-----END PUBLIC KEY-----\n';

type Method = 'signPlaybackId' | 'signDrmLicense' | 'signViewerCounts';

const sign = (method: Method, id: string, config: Record<string, unknown>): Promise<string> =>
  (client.jwt[method] as unknown as (id: string, config: Record<string, unknown>) => Promise<string>).call(
    client.jwt,
    id,
    config,
  );

const decodePart = (part: string): Record<string, unknown> =>
  JSON.parse(Buffer.from(part, 'base64url').toString('utf-8'));

async function decode(token: string) {
  const [header, claims, signature] = token.split('.') as [string, string, string];
  const publicKey = await globalThis.crypto.subtle.importKey(
    'spki',
    Buffer.from(publicKeyPem.replace(/-----[A-Z ]+-----|\s/g, ''), 'base64'),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const valid = await globalThis.crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    Buffer.from(signature, 'base64url'),
    new TextEncoder().encode(`${header}.${claims}`),
  );
  expect(valid).toBe(true);
  return { header: decodePart(header), claims: decodePart(claims) };
}

function expectClaims(claims: Record<string, unknown>, expected: Record<string, unknown>, expDelta: number) {
  const { exp, ...rest } = claims;
  expect(rest).toEqual(expected);
  expect(Math.abs((exp as number) - (Math.floor(Date.now() / 1000) + expDelta))).toBeLessThanOrEqual(5);
}

describe('resource jwt', () => {
  test.each([
    {
      name: 'playback default type and expiration',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: {},
      claims: {
        sub: 'playback-1',
        aud: 'v',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 604800,
    },
    {
      name: 'thumbnail with params',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: {
        type: 'thumbnail',
        expiration: '10m',
        params: { time: '10', width: '320' },
      },
      claims: {
        time: '10',
        width: '320',
        sub: 'playback-1',
        aud: 't',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 600,
    },
    {
      name: 'gif',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: { type: 'gif', expiration: 3600 },
      claims: {
        sub: 'playback-1',
        aud: 'g',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 3600,
    },
    {
      name: 'storyboard, spaced unit',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: { type: 'storyboard', expiration: '2 days' },
      claims: {
        sub: 'playback-1',
        aud: 's',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 172800,
    },
    {
      name: 'stats',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: { type: 'stats', expiration: '1h' },
      claims: {
        sub: 'playback-1',
        aud: 'playback_id',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 3600,
    },
    {
      name: 'drm license',
      method: 'signDrmLicense',
      id: 'playback-1',
      options: { expiration: '1d' },
      claims: {
        sub: 'playback-1',
        aud: 'd',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 86400,
    },
    {
      name: 'viewer counts default',
      method: 'signViewerCounts',
      id: 'video-1',
      options: {},
      claims: {
        sub: 'video-1',
        aud: 'video_id',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 604800,
    },
    {
      name: 'viewer counts live stream',
      method: 'signViewerCounts',
      id: 'live-1',
      options: { type: 'live_stream', expiration: '30m' },
      claims: {
        sub: 'live-1',
        aud: 'live_stream_id',
        kid: 'conformance-key-id',
      },
      exp_delta_seconds: 1800,
    },
  ])('conformance: $name', async ({ method, id, options, claims, exp_delta_seconds }) => {
    const token = await sign(method as Method, id, { ...options, keyId, keySecret: encodedKey });

    const decoded = await decode(token);
    expect(decoded.header).toEqual({ alg: 'RS256', typ: 'JWT' });
    expectClaims(decoded.claims, claims, exp_delta_seconds);
  });

  test('conformance: multiple types', async () => {
    const tokens = await client.jwt.signPlaybackId('playback-1', {
      type: ['video', 'thumbnail'],
      keyId,
      keySecret: encodedKey,
    });

    expect(Object.keys(tokens).sort()).toEqual(['playback-token', 'thumbnail-token']);
    for (const [name, audience] of Object.entries({ 'playback-token': 'v', 'thumbnail-token': 't' })) {
      const { claims } = await decode(tokens[name as keyof typeof tokens]!);
      expect(claims['aud']).toBe(audience);
    }
  });

  test.each([
    {
      name: 'unknown playback type',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: { type: 'audio' },
    },
    {
      name: 'unparseable expiration',
      method: 'signPlaybackId',
      id: 'playback-1',
      options: { expiration: 'soon' },
    },
  ])('conformance: rejects $name', async ({ method, id, options }) => {
    await expect(sign(method as Method, id, { ...options, keyId, keySecret: encodedKey })).rejects.toThrow();
  });

  test('per-type params are merged over shared params', async () => {
    const tokens = await client.jwt.signPlaybackId('playback-id', {
      type: ['video', ['thumbnail', { time: '2' }]],
      params: { width: '100' },
      keyId,
      keySecret: encodedKey,
    });

    expect((await decode(tokens['playback-token']!)).claims).toMatchObject({ width: '100' });
    expect((await decode(tokens['thumbnail-token']!)).claims).toMatchObject({ width: '100', time: '2' });
  });

  test.each([
    ['base64-encoded PKCS8 PEM', () => encodedKey],
    ['PKCS8 PEM', () => pkcs8Pem],
    ['PKCS1 PEM', () => pkcs1Pem],
    ['base64-encoded PKCS1 PEM', () => Buffer.from(pkcs1Pem).toString('base64')],
  ])('accepts a %s', async (_, key) => {
    const { claims } = await decode(
      await client.jwt.signPlaybackId('playback-id', { keyId, keySecret: key() }),
    );
    expect(claims['sub']).toBe('playback-id');
  });

  test('accepts an imported CryptoKey', async () => {
    const keySecret = await globalThis.crypto.subtle.importKey(
      'pkcs8',
      Buffer.from(pkcs8Pem.replace(/-----[A-Z ]+-----|\s/g, ''), 'base64'),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const { claims } = await decode(await client.jwt.signPlaybackId('playback-id', { keyId, keySecret }));
    expect(claims['kid']).toBe(keyId);
  });

  test('defaults to the client options', async () => {
    const token = await client
      .withOptions({ jwtSigningKey: 'client-key-id', jwtPrivateKey: encodedKey })
      .jwt.signViewerCounts('asset-id', { type: 'asset' });

    const { claims } = await decode(token);
    expect(claims).toMatchObject({ kid: 'client-key-id', sub: 'asset-id', aud: 'asset_id' });
  });

  test('requires a signing key', async () => {
    await expect(client.jwt.signPlaybackId('playback-id', { keySecret: encodedKey })).rejects.toThrow(
      'Signing key required; pass a keyId option to mux.jwt.sign*(), a jwtSigningKey option to new Mux(), or set the MUX_SIGNING_KEY environment variable',
    );
  });

  test('requires a private key', async () => {
    await expect(client.jwt.signPlaybackId('playback-id', { keyId })).rejects.toThrow(
      'Private key required; pass a keySecret option to mux.jwt.sign*(), a jwtPrivateKey option to new Mux(), or set the MUX_PRIVATE_KEY environment variable',
    );
  });

  test('rejects a key that is not a PEM', async () => {
    await expect(
      client.jwt.signPlaybackId('playback-id', { keyId, keySecret: 'bm90IGEga2V5' }),
    ).rejects.toThrow('PKCS1 or PKCS8');
  });
});
