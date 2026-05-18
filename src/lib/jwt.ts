import { Mux } from '../index';
import { isKeyLike, keyFormatErrorMessage, pkcs1to8, toPkcs8Pem, unwrapPem } from './jwt-util';

type CryptoKey = Awaited<ReturnType<typeof globalThis.crypto.subtle.importKey>>;

export interface SignOptions {
  /**
   * Signature algorithm. Could be one of these values :
   * - RS256:    RSASSA using SHA-256 hash algorithm
   */
  algorithm?: Algorithm | undefined;
  keyid?: string | undefined;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number | undefined;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  notBefore?: string | number | undefined;
  audience?: string | string[] | undefined;
  subject?: string | undefined;
  issuer?: string | undefined;
  jwtid?: string | undefined;
  noTimestamp?: boolean | undefined;
}

export type Algorithm = 'RS256';

// standard names https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1
export interface JwtHeader {
  alg: string | Algorithm;
  typ?: string | undefined;
  cty?: string | undefined;
  crit?: Array<string | Exclude<keyof JwtHeader, 'crit'>> | undefined;
  kid?: string | undefined;
  jku?: string | undefined;
  x5u?: string | string[] | undefined;
  'x5t#S256'?: string | undefined;
  x5t?: string | undefined;
  x5c?: string | string[] | undefined;
}

export enum TypeClaim {
  video = 'v',
  thumbnail = 't',
  gif = 'g',
  storyboard = 's',
  stats = 'playback_id',
  drm_license = 'd',
}
export enum TypeToken {
  video = 'playback-token',
  thumbnail = 'thumbnail-token',
  storyboard = 'storyboard-token',
  drm_license = 'drm-token',
  gif = 'gif-token', // Not supported by Mux Player
  stats = 'stats-token', // Not supported by Mux Player
}
export type TypeTokenValues = (typeof TypeToken)[keyof typeof TypeToken];
export type Tokens = Partial<Record<TypeTokenValues, string>>;
// ['thumbnail', { time: 2 }]
export type TypeWithParams<Type extends string = string> = [Type, MuxJWTSignOptions<Type>['params']];

interface MuxJWTSignOptionsBase<Type extends string = string> {
  keyId?: string;
  keySecret?: string | CryptoKey;
  keyFilePath?: string;
  type?: Type | Array<Type | TypeWithParams<Type>>;
  expiration?: string;
  params?: Record<string, string>;
}
export interface MuxJWTSignOptions<Type extends string = string> extends MuxJWTSignOptionsBase<Type> {
  type?: Type;
}
export interface MuxJWTSignOptionsMultiple<Type extends string = string> extends MuxJWTSignOptionsBase<Type> {
  type: Array<Type | TypeWithParams<Type>>;
}
export const isMuxJWTSignOptionsMultiple = (
  config: MuxJWTSignOptions | MuxJWTSignOptionsMultiple,
): config is MuxJWTSignOptionsMultiple => Array.isArray(config.type);

export enum DataTypeClaim {
  video = 'video_id',
  asset = 'asset_id',
  playback = 'playback_id',
  live_stream = 'live_stream_id',
}

export type KeyLike = CryptoKey | Uint8Array;

function base64url(data: Uint8Array): string {
  let str = '';
  for (let i = 0; i < data.length; i++) {
    str += String.fromCharCode(data[i]!);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlString(str: string): string {
  return base64url(new TextEncoder().encode(str));
}

const SECONDS_PER: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  w: 60 * 60 * 24 * 7,
  y: 60 * 60 * 24 * 365,
};

function parseTimespan(value: string | number): number {
  if (typeof value === 'number') return value;
  const trimmed = value.trim();
  const match =
    /^(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/.exec(
      trimmed,
    );
  if (match) {
    const n = parseInt(match[1]!, 10);
    const unit = match[2]![0]!;
    const multiplier = SECONDS_PER[unit];
    if (multiplier !== undefined) return n * multiplier;
  }
  const num = Number(trimmed);
  if (!isNaN(num)) return num;
  throw new Error(`Invalid time span: ${value}`);
}

async function importPKCS8(pem: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'pkcs8',
    unwrapPem(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    false,
    ['sign'],
  );
}

export async function sign(
  payload: object,
  secretOrPrivateKey: KeyLike,
  options: SignOptions,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: options.algorithm || 'RS256', typ: 'JWT' };

  const claims: Record<string, any> = {
    ...(payload as any),
    ...(options.keyid ? { kid: options.keyid } : {}),
  };

  if (options.issuer) claims['iss'] = options.issuer;
  if (options.subject) claims['sub'] = options.subject;
  if (options.audience != null) claims['aud'] = options.audience;
  if (!options.noTimestamp) claims['iat'] = now;
  if (options.notBefore != null) claims['nbf'] = now + parseTimespan(options.notBefore);
  if (options.expiresIn != null) claims['exp'] = now + parseTimespan(options.expiresIn);

  const key =
    secretOrPrivateKey instanceof Uint8Array ?
      await importPKCS8(toPkcs8Pem(pkcs1to8(secretOrPrivateKey)))
    : secretOrPrivateKey;

  const headerB64 = base64urlString(JSON.stringify(header));
  const payloadB64 = base64urlString(JSON.stringify(claims));
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = await globalThis.crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

export function getSigningKey(mux: Mux, opts: MuxJWTSignOptions): string {
  const keyId = opts.keyId || mux.jwtSigningKey;
  if (!keyId) {
    throw new Error(
      'Signing key required; pass a keyId option to mux.jwt.sign*(), a jwtSigningKey option to new Mux(), or set the MUX_SIGNING_KEY environment variable',
    );
  }

  return keyId;
}

export async function getPrivateKey(mux: Mux, opts: MuxJWTSignOptions): Promise<KeyLike> {
  let key = await getPrivateKeyHelper(mux, opts);
  if (typeof key === 'string') {
    if (key.startsWith('-----BEGIN RSA PRIVATE')) {
      key = toPkcs8Pem(pkcs1to8(unwrapPem(key)));
    }
    return await importPKCS8(key);
  } else if (key instanceof Uint8Array) {
    return await importPKCS8(toPkcs8Pem(pkcs1to8(key)));
  } else if (isKeyLike(key)) {
    return key as CryptoKey;
  }
  throw new TypeError(keyFormatErrorMessage);
}

async function getPrivateKeyHelper(mux: Mux, opts: MuxJWTSignOptions): Promise<CryptoKey | string> {
  let key;
  if (opts.keySecret) {
    key = opts.keySecret;
  } else if (opts.keyFilePath) {
    throw new Error(`keyFilePath is not supported in this environment`);
  } else if (mux.jwtPrivateKey) {
    key = mux.jwtPrivateKey;
  }

  if (isKeyLike(key)) return key as CryptoKey;

  if (typeof key === 'string') {
    key = key.trim();
    if (key.startsWith('-----BEGIN')) {
      return key;
    }

    try {
      key = atob(key);
      if (key.startsWith('-----BEGIN')) {
        return key;
      }
    } catch {
      // fallthrough
    }

    throw new TypeError(keyFormatErrorMessage);
  }

  throw new TypeError(
    'Private key required; pass a keySecret option to mux.jwt.sign*(), a jwtPrivateKey option to new Mux(), or set the MUX_PRIVATE_KEY environment variable',
  );
}
