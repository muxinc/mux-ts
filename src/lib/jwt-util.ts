// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export function isKeyLike(key: any): key is { type: string } {
  return typeof key === 'object' && key != null && typeof (key as any).type === 'string';
}

export const keyFormatErrorMessage =
  'Specified signing key must be either a valid PKCS1 or PKCS8 PEM string, a base64 encoded PEM, or an imported key';

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function uint8ArrayToBase64(array: Uint8Array): string {
  return btoa([...array].map((byte) => String.fromCharCode(byte)).join(''));
}

export function unwrapPem(key: string): Uint8Array {
  return base64ToUint8Array(
    key
      .trim()
      .replace(/\n/gm, '')
      .replace(/^-----[A-Z ]+-----|-----[A-Z ]+-----$/g, ''),
  );
}

export function toPkcs8Pem(key: Uint8Array) {
  const parts = ['-----BEGIN PRIVATE KEY-----'];
  const base64 = uint8ArrayToBase64(key);
  for (let i = 0; i < base64.length; i += 64) {
    parts.push(base64.substring(i, i + 64));
  }
  parts.push('-----END PRIVATE KEY-----');
  return parts.join('\n');
}

// PKCS8 version 0 and the rsaEncryption AlgorithmIdentifier.
const certAndRsa = Uint8Array.of(
  0x02,
  0x01,
  0x00,
  0x30,
  0x0d,
  0x06,
  0x09,
  0x2a,
  0x86,
  0x48,
  0x86,
  0xf7,
  0x0d,
  0x01,
  0x01,
  0x01,
  0x05,
  0x00,
);

// Minimal DER encoder: WebCrypto imports PKCS8 but not PKCS1.
const DER = {
  lengthBytes: (length: number): number[] => {
    const result: number[] = [];
    if (length <= 0x7f) {
      result.push(length);
    } else {
      while (length) {
        result.push(length & 0xff);
        length >>>= 8;
      }
      result.push(0x80 + result.length);
    }
    return result.reverse();
  },
  octetString: (octets: Uint8Array): Uint8Array => {
    const header = [0x04, ...DER.lengthBytes(octets.byteLength)];
    const result = new Uint8Array(header.length + octets.length);
    result.set(header, 0);
    result.set(octets, header.length);
    return result;
  },
  sequence: (...elements: Uint8Array[]): Uint8Array => {
    const totalElementLength = elements.reduce((len, i) => len + i.byteLength, 0);
    const header = [0x30, ...DER.lengthBytes(totalElementLength)];
    const result = new Uint8Array(header.length + totalElementLength);
    result.set(header, 0);
    let i = header.length;
    for (const elem of elements) {
      result.set(elem, i);
      i += elem.byteLength;
    }
    return result;
  },
};

export function pkcs1to8(pkcs1: Uint8Array): Uint8Array {
  return DER.sequence(certAndRsa, DER.octetString(pkcs1));
}
