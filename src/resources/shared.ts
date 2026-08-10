// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface CreatePlaybackIdRequest {
  /**
   * The DRM configuration used by this playback ID. Must only be set when `policy`
   * is set to `drm`.
   */
  drm_configuration_id?: string;

  /**
   * - `public` playback IDs are accessible by constructing an HLS URL like
   *   `https://stream.mux.com/${PLAYBACK_ID}`
   *
   * - `signed` playback IDs should be used with tokens
   *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
   *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
   *   details about creating tokens.
   *
   * - `drm` playback IDs are protected with DRM technologies.
   *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
   */
  policy?: PlaybackPolicy;
}

export interface PlaybackId {
  /**
   * Unique identifier for the PlaybackID
   */
  id: string;

  /**
   * - `public` playback IDs are accessible by constructing an HLS URL like
   *   `https://stream.mux.com/${PLAYBACK_ID}`
   *
   * - `signed` playback IDs should be used with tokens
   *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
   *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
   *   details about creating tokens.
   *
   * - `drm` playback IDs are protected with DRM technologies.
   *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
   */
  policy: PlaybackPolicy;

  /**
   * The DRM configuration used by this playback ID. Must only be set when `policy`
   * is set to `drm`.
   */
  drm_configuration_id?: string;
}

/**
 * - `public` playback IDs are accessible by constructing an HLS URL like
 *   `https://stream.mux.com/${PLAYBACK_ID}`
 *
 * - `signed` playback IDs should be used with tokens
 *   `https://stream.mux.com/${PLAYBACK_ID}?token={TOKEN}`. See
 *   [Secure video playback](https://docs.mux.com/guides/secure-video-playback) for
 *   details about creating tokens.
 *
 * - `drm` playback IDs are protected with DRM technologies.
 *   [See DRM documentation for more details](https://docs.mux.com/guides/protect-videos-with-drm).
 */
export type PlaybackPolicy = 'public' | 'signed' | 'drm';
