import { sign, isMuxJWTSignOptionsMultiple } from '@mux/ts/lib/jwt';

type CryptoKey = Awaited<ReturnType<typeof globalThis.crypto.subtle.importKey>>;

function decodeJwtPart(b64url: string): Record<string, any> {
  const decoded = Buffer.from(b64url.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

describe('jwt', () => {
  let privateKey: CryptoKey;

  beforeAll(async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      false,
      ['sign', 'verify'],
    );
    privateKey = keyPair.privateKey;
  });

  describe('sign()', () => {
    describe('timespan parsing via expiresIn', () => {
      test.each([
        ['number', 60, 60],
        ['numeric string', '60', 60],
        ['seconds: s', '30s', 30],
        ['seconds: sec', '30 sec', 30],
        ['seconds: secs', '30 secs', 30],
        ['seconds: second', '1 second', 1],
        ['seconds: seconds', '30 seconds', 30],
        ['minutes: m', '5m', 300],
        ['minutes: min', '5 min', 300],
        ['minutes: mins', '5 mins', 300],
        ['minutes: minute', '1 minute', 60],
        ['minutes: minutes', '5 minutes', 300],
        ['hours: h', '2h', 7200],
        ['hours: hr', '2 hr', 7200],
        ['hours: hrs', '2 hrs', 7200],
        ['hours: hour', '1 hour', 3600],
        ['hours: hours', '2 hours', 7200],
        ['days: d', '7d', 604800],
        ['days: day', '1 day', 86400],
        ['days: days', '7 days', 604800],
        ['weeks: w', '2w', 1209600],
        ['weeks: week', '1 week', 604800],
        ['weeks: weeks', '2 weeks', 1209600],
        ['years: y', '1y', 31536000],
        ['years: yr', '1 yr', 31536000],
        ['years: yrs', '2 yrs', 63072000],
        ['years: year', '1 year', 31536000],
        ['years: years', '2 years', 63072000],
      ])('%s: %s → %d seconds', async (_, expiresIn, expectedSeconds) => {
        const before = Math.floor(Date.now() / 1000);
        const token = await sign({}, privateKey, { expiresIn: expiresIn as string | number });
        const after = Math.floor(Date.now() / 1000);
        const [, payloadB64] = token.split('.');
        const payload = decodeJwtPart(payloadB64!);
        expect(payload['exp']).toBeGreaterThanOrEqual(before + (expectedSeconds as number));
        expect(payload['exp']).toBeLessThanOrEqual(after + (expectedSeconds as number));
      });

      test('invalid timespan throws', async () => {
        await expect(sign({}, privateKey, { expiresIn: 'not-a-time' })).rejects.toThrow('Invalid time span');
      });
    });

    describe('claims', () => {
      test('includes iat by default', async () => {
        const before = Math.floor(Date.now() / 1000);
        const token = await sign({}, privateKey, {});
        const after = Math.floor(Date.now() / 1000);
        const [, payloadB64] = token.split('.');
        const payload = decodeJwtPart(payloadB64!);
        expect(payload['iat']).toBeGreaterThanOrEqual(before);
        expect(payload['iat']).toBeLessThanOrEqual(after);
      });

      test('noTimestamp omits iat', async () => {
        const token = await sign({}, privateKey, { noTimestamp: true });
        const [, payloadB64] = token.split('.');
        const payload = decodeJwtPart(payloadB64!);
        expect(payload['iat']).toBeUndefined();
      });

      test('issuer sets iss', async () => {
        const token = await sign({}, privateKey, { issuer: 'test-issuer' });
        const [, payloadB64] = token.split('.');
        expect(decodeJwtPart(payloadB64!)['iss']).toBe('test-issuer');
      });

      test('subject sets sub', async () => {
        const token = await sign({}, privateKey, { subject: 'test-subject' });
        const [, payloadB64] = token.split('.');
        expect(decodeJwtPart(payloadB64!)['sub']).toBe('test-subject');
      });

      test('audience sets aud (string)', async () => {
        const token = await sign({}, privateKey, { audience: 'test-audience' });
        const [, payloadB64] = token.split('.');
        expect(decodeJwtPart(payloadB64!)['aud']).toBe('test-audience');
      });

      test('audience sets aud (array)', async () => {
        const token = await sign({}, privateKey, { audience: ['aud1', 'aud2'] });
        const [, payloadB64] = token.split('.');
        expect(decodeJwtPart(payloadB64!)['aud']).toEqual(['aud1', 'aud2']);
      });

      test('keyid sets kid in payload', async () => {
        const token = await sign({}, privateKey, { keyid: 'my-key-id' });
        const [, payloadB64] = token.split('.');
        expect(decodeJwtPart(payloadB64!)['kid']).toBe('my-key-id');
      });

      test('notBefore sets nbf', async () => {
        const before = Math.floor(Date.now() / 1000);
        const token = await sign({}, privateKey, { notBefore: '5m' });
        const after = Math.floor(Date.now() / 1000);
        const [, payloadB64] = token.split('.');
        const payload = decodeJwtPart(payloadB64!);
        expect(payload['nbf']).toBeGreaterThanOrEqual(before + 300);
        expect(payload['nbf']).toBeLessThanOrEqual(after + 300);
      });

      test('header has RS256 algorithm and JWT type', async () => {
        const token = await sign({}, privateKey, {});
        const [headerB64] = token.split('.');
        const header = decodeJwtPart(headerB64!);
        expect(header['alg']).toBe('RS256');
        expect(header['typ']).toBe('JWT');
      });

      test('payload fields are forwarded', async () => {
        const token = await sign({ sub: 'override', custom: 'value' }, privateKey, {});
        const [, payloadB64] = token.split('.');
        const payload = decodeJwtPart(payloadB64!);
        expect(payload['custom']).toBe('value');
      });
    });
  });

  describe('isMuxJWTSignOptionsMultiple()', () => {
    test('returns true when type is an array', () => {
      expect(isMuxJWTSignOptionsMultiple({ type: ['video', 'thumbnail'] })).toBe(true);
    });

    test('returns false when type is a string', () => {
      expect(isMuxJWTSignOptionsMultiple({ type: 'video' })).toBe(false);
    });

    test('returns false when type is undefined', () => {
      expect(isMuxJWTSignOptionsMultiple({})).toBe(false);
    });
  });
});
