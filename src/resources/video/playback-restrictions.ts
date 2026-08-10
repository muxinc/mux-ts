// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Playback Restrictions allows you to set additional rules for playing videos. You can set the domains/hostnames allowed to play your videos. For instance, viewers can play videos embedded on the `https://example.com` website when you set the Playback Restrictions with `example.com` as an allowed domain. Any Video requests from other websites are denied. Additionally, you can set rules for what user agents to allow. Please see [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation) for more details on this feature.
 */
export class PlaybackRestrictions extends APIResource {
  /**
   * Create a new Playback Restriction.
   *
   * @example
   * ```ts
   * const playbackRestriction =
   *   await client.video.playbackRestrictions.create({
   *     referrer: {
   *       allowed_domains: ['*.example.com'],
   *       allow_no_referrer: true,
   *     },
   *     user_agent: {
   *       allow_no_user_agent: false,
   *       allow_high_risk_user_agent: false,
   *     },
   *   });
   * ```
   */
  create(body: PlaybackRestrictionCreateParams, options?: RequestOptions): APIPromise<PlaybackRestriction> {
    return (
      this._client.post('/video/v1/playback-restrictions', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: PlaybackRestriction }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns a list of all Playback Restrictions.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const playbackRestriction of client.video.playbackRestrictions.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: PlaybackRestrictionListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PlaybackRestrictionsBasePage, PlaybackRestriction> {
    return this._client.getAPIList('/video/v1/playback-restrictions', BasePage<PlaybackRestriction>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Deletes a single Playback Restriction.
   *
   * @example
   * ```ts
   * await client.video.playbackRestrictions.delete(
   *   'PLAYBACK_RESTRICTION_ID',
   * );
   * ```
   */
  delete(playbackRestrictionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/playback-restrictions/${playbackRestrictionID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Retrieves a Playback Restriction associated with the unique identifier.
   *
   * @example
   * ```ts
   * const playbackRestriction =
   *   await client.video.playbackRestrictions.retrieve(
   *     'PLAYBACK_RESTRICTION_ID',
   *   );
   * ```
   */
  retrieve(playbackRestrictionID: string, options?: RequestOptions): APIPromise<PlaybackRestriction> {
    return (
      this._client.get(path`/video/v1/playback-restrictions/${playbackRestrictionID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: PlaybackRestriction }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Allows you to modify the list of domains or change how Mux validates playback
   * requests without the `Referer` HTTP header. The Referrer restriction fully
   * replaces the old list with this new list of domains.
   *
   * @example
   * ```ts
   * const playbackRestriction =
   *   await client.video.playbackRestrictions.updateReferrer(
   *     'PLAYBACK_RESTRICTION_ID',
   *     {
   *       allowed_domains: ['*.example.com'],
   *       allow_no_referrer: true,
   *     },
   *   );
   * ```
   */
  updateReferrer(
    playbackRestrictionID: string,
    body: PlaybackRestrictionUpdateReferrerParams,
    options?: RequestOptions,
  ): APIPromise<PlaybackRestriction> {
    return (
      this._client.put(path`/video/v1/playback-restrictions/${playbackRestrictionID}/referrer`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: PlaybackRestriction }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Allows you to modify how Mux validates playback requests with different user
   * agents. Please see
   * [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation)
   * for more details on this feature.
   *
   * @example
   * ```ts
   * const playbackRestriction =
   *   await client.video.playbackRestrictions.updateUserAgent(
   *     'PLAYBACK_RESTRICTION_ID',
   *     {
   *       allow_high_risk_user_agent: false,
   *       allow_no_user_agent: false,
   *     },
   *   );
   * ```
   */
  updateUserAgent(
    playbackRestrictionID: string,
    body: PlaybackRestrictionUpdateUserAgentParams,
    options?: RequestOptions,
  ): APIPromise<PlaybackRestriction> {
    return (
      this._client.put(path`/video/v1/playback-restrictions/${playbackRestrictionID}/user_agent`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: PlaybackRestriction }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type PlaybackRestrictionsBasePage = BasePage<PlaybackRestriction>;

export interface PlaybackRestriction {
  /**
   * Unique identifier for the Playback Restriction. Max 255 characters.
   */
  id: string;

  /**
   * Time the Playback Restriction was created, defined as a Unix timestamp (seconds
   * since epoch).
   */
  created_at: string;

  /**
   * A list of domains allowed to play your videos.
   */
  referrer: ReferrerDomainRestrictionSettings;

  /**
   * Time the Playback Restriction was last updated, defined as a Unix timestamp
   * (seconds since epoch).
   */
  updated_at: string;

  /**
   * Rules that control what user agents are allowed to play your videos. Please see
   * [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation)
   * for more details on this feature.
   */
  user_agent: UserAgentRestrictionSettings;
}

export interface PlaybackRestrictionResponse {
  data: PlaybackRestriction;
}

/**
 * A list of domains allowed to play your videos.
 */
export interface ReferrerDomainRestrictionSettings {
  /**
   * A boolean to determine whether to allow or deny HTTP requests without `Referer`
   * HTTP request header. Playback requests coming from non-web/native applications
   * like iOS, Android or smart TVs will not have a `Referer` HTTP header. Set this
   * value to `true` to allow these playback requests.
   */
  allow_no_referrer?: boolean;

  /**
   * List of domains allowed to play videos. Possible values are
   *
   * - `[]` Empty Array indicates deny video playback requests for all domains
   * - `["*"]` A Single Wildcard `*` entry means allow video playback requests from
   *   any domain
   * - `["*.example.com", "foo.com"]` A list of up to 10 domains or valid dns-style
   *   wildcards
   */
  allowed_domains?: Array<string>;
}

/**
 * Rules that control what user agents are allowed to play your videos. Please see
 * [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation)
 * for more details on this feature.
 */
export interface UserAgentRestrictionSettings {
  /**
   * Whether or not to allow high risk user agents. The high risk user agents are
   * defined by Mux.
   */
  allow_high_risk_user_agent?: boolean;

  /**
   * Whether or not to allow views without a `User-Agent` HTTP request header.
   */
  allow_no_user_agent?: boolean;
}

export interface PlaybackRestrictionCreateParams {
  /**
   * A list of domains allowed to play your videos.
   */
  referrer: PlaybackRestrictionCreateParams.Referrer;

  /**
   * Rules that control what user agents are allowed to play your videos. Please see
   * [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation)
   * for more details on this feature.
   */
  user_agent: PlaybackRestrictionCreateParams.UserAgent;
}

export namespace PlaybackRestrictionCreateParams {
  /**
   * A list of domains allowed to play your videos.
   */
  export interface Referrer {
    /**
     * List of domains allowed to play videos. Possible values are
     *
     * - `[]` Empty Array indicates deny video playback requests for all domains
     * - `["*"]` A Single Wildcard `*` entry means allow video playback requests from
     *   any domain
     * - `["*.example.com", "foo.com"]` A list of up to 10 domains or valid dns-style
     *   wildcards
     */
    allowed_domains: Array<string>;

    /**
     * A boolean to determine whether to allow or deny HTTP requests without `Referer`
     * HTTP request header. Playback requests coming from non-web/native applications
     * like iOS, Android or smart TVs will not have a `Referer` HTTP header. Set this
     * value to `true` to allow these playback requests.
     */
    allow_no_referrer?: boolean;
  }

  /**
   * Rules that control what user agents are allowed to play your videos. Please see
   * [Using User-Agent HTTP header for validation](https://docs.mux.com/guides/secure-video-playback#using-user-agent-http-header-for-validation)
   * for more details on this feature.
   */
  export interface UserAgent {
    /**
     * Whether or not to allow high risk user agents. The high risk user agents are
     * defined by Mux.
     */
    allow_high_risk_user_agent?: boolean;

    /**
     * Whether or not to allow views without a `User-Agent` HTTP request header.
     */
    allow_no_user_agent?: boolean;
  }
}

export interface PlaybackRestrictionListParams extends BasePageParams {}

export interface PlaybackRestrictionUpdateReferrerParams {
  /**
   * List of domains allowed to play videos. Possible values are
   *
   * - `[]` Empty Array indicates deny video playback requests for all domains
   * - `["*"]` A Single Wildcard `*` entry means allow video playback requests from
   *   any domain
   * - `["*.example.com", "foo.com"]` A list of up to 10 domains or valid dns-style
   *   wildcards
   */
  allowed_domains: Array<string>;

  /**
   * A boolean to determine whether to allow or deny HTTP requests without `Referer`
   * HTTP request header. Playback requests coming from non-web/native applications
   * like iOS, Android or smart TVs will not have a `Referer` HTTP header. Set this
   * value to `true` to allow these playback requests.
   */
  allow_no_referrer?: boolean;
}

export interface PlaybackRestrictionUpdateUserAgentParams {
  /**
   * Whether or not to allow high risk user agents. The high risk user agents are
   * defined by Mux.
   */
  allow_high_risk_user_agent: boolean;

  /**
   * Whether or not to allow views without a `User-Agent` HTTP request header.
   */
  allow_no_user_agent: boolean;
}

export declare namespace PlaybackRestrictions {
  export {
    type PlaybackRestriction as PlaybackRestriction,
    type PlaybackRestrictionResponse as PlaybackRestrictionResponse,
    type ReferrerDomainRestrictionSettings as ReferrerDomainRestrictionSettings,
    type UserAgentRestrictionSettings as UserAgentRestrictionSettings,
    type PlaybackRestrictionsBasePage as PlaybackRestrictionsBasePage,
    type PlaybackRestrictionCreateParams as PlaybackRestrictionCreateParams,
    type PlaybackRestrictionListParams as PlaybackRestrictionListParams,
    type PlaybackRestrictionUpdateReferrerParams as PlaybackRestrictionUpdateReferrerParams,
    type PlaybackRestrictionUpdateUserAgentParams as PlaybackRestrictionUpdateUserAgentParams,
  };
}
