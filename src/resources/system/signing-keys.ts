// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Signing keys are used to sign JSON Web Tokens (JWTs) for securing certain requests, such as secure playback URLs and access to real-time viewer counts in Mux Data. **One signing key can be used to sign multiple requests - you probably only need one active at a time.** However, you can create multiple signing keys to enable key rotation, creating a new key and deleting the old only after any existing signed requests have expired.
 */
export class SigningKeys extends APIResource {
  /**
   * Creates a new signing key pair. When creating a new signing key, the API will
   * generate a 2048-bit RSA key-pair and return the private key and a generated
   * key-id; the public key will be stored at Mux to validate signed tokens.
   */
  create(options?: RequestOptions): APIPromise<SigningKey> {
    return (
      this._client.post('/system/v1/signing-keys', {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: SigningKey }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns a list of signing keys.
   */
  list(
    query: SigningKeyListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<SigningKeysBasePage, SigningKey> {
    return this._client.getAPIList('/system/v1/signing-keys', BasePage<SigningKey>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Retrieves the details of a signing key that has previously been created. Supply
   * the unique signing key ID that was returned from your previous request, and Mux
   * will return the corresponding signing key information. **The private key is not
   * returned in this response.**
   */
  retrieve(signingKeyID: string, options?: RequestOptions): APIPromise<SigningKey> {
    return (
      this._client.get(path`/system/v1/signing-keys/${signingKeyID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: SigningKey }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes an existing signing key. Use with caution, as this will invalidate any
   * existing signatures and no JWTs can be signed using the key again.
   */
  delete(signingKeyID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/system/v1/signing-keys/${signingKeyID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type SigningKeysBasePage = BasePage<SigningKey>;

export interface SigningKey {
  /**
   * Unique identifier for the Signing Key.
   */
  id: string;

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created_at: string;

  /**
   * A Base64 encoded private key that can be used with the RS256 algorithm when
   * creating a [JWT](https://jwt.io/). **Note that this value is only returned once
   * when creating a URL signing key.**
   */
  private_key?: string;
}

export interface SigningKeyResponse {
  data: SigningKey;
}

export interface SigningKeyListParams extends BasePageParams {}

export declare namespace SigningKeys {
  export {
    type SigningKey as SigningKey,
    type SigningKeyResponse as SigningKeyResponse,
    type SigningKeysBasePage as SigningKeysBasePage,
    type SigningKeyListParams as SigningKeyListParams,
  };
}
