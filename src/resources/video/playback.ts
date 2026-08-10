// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Playback extends APIResource {
  /**
   * [Fetch a thumbnail image from a video](https://docs.mux.com/guides/get-images-from-a-video)
   * at a specified time with optional transformations.
   *
   * @example
   * ```ts
   * const response = await client.video.playback.thumbnail(
   *   'PLAYBACK_ID',
   *   'jpg',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  thumbnail(
    playbackId: string,
    extension: 'jpg' | 'png' | 'webp',
    query: PlaybackThumbnailParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/${playbackId}/thumbnail.${extension}`, {
      query,
      defaultBaseURL: 'https://image.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'application/binary' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * [Fetch an animated GIF or WebP image](https://docs.mux.com/guides/get-images-from-a-video#get-an-animated-gif-from-a-video)
   * from a video segment with optional transformations.
   *
   * @example
   * ```ts
   * const response = await client.video.playback.animated(
   *   'PLAYBACK_ID',
   *   'gif',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  animated(
    playbackId: string,
    extension: 'gif' | 'webp',
    query: PlaybackAnimatedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/${playbackId}/animated.${extension}`, {
      query,
      defaultBaseURL: 'https://image.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'application/binary' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Fetch a storyboard image composed of multiple thumbnails for use in
   * [timeline hover previews](https://docs.mux.com/guides/create-timeline-hover-previews).
   *
   * @example
   * ```ts
   * const response = await client.video.playback.storyboard(
   *   'PLAYBACK_ID',
   *   'jpg',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  storyboard(
    playbackId: string,
    extension: 'jpg' | 'png' | 'webp',
    query: PlaybackStoryboardParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/${playbackId}/storyboard.${extension}`, {
      query,
      defaultBaseURL: 'https://image.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'application/binary' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Fetch metadata for the
   * [storyboard image in WebVTT format](https://docs.mux.com/guides/create-timeline-hover-previews#webvtt),
   * detailing the coordinates and time ranges of each thumbnail.
   *
   * @example
   * ```ts
   * const response = await client.video.playback.storyboardVtt(
   *   'PLAYBACK_ID',
   * );
   * ```
   */
  storyboardVtt(
    playbackId: string,
    query: PlaybackStoryboardVttParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<string> {
    return this._client.get(path`/${playbackId}/storyboard.vtt`, {
      query,
      defaultBaseURL: 'https://image.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'text/vtt' }, options?.headers]),
    });
  }

  /**
   * Fetch metadata for the
   * [storyboard image in JSON format](https://docs.mux.com/guides/create-timeline-hover-previews#json),
   * detailing the coordinates and time ranges of each thumbnail.
   *
   * @example
   * ```ts
   * const response = await client.video.playback.storyboardMeta(
   *   'PLAYBACK_ID',
   * );
   * ```
   */
  storyboardMeta(
    playbackId: string,
    query: PlaybackStoryboardMetaParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<string> {
    return this._client.get(path`/${playbackId}/storyboard.json`, {
      query,
      defaultBaseURL: 'https://image.mux.com',
      ...options,
    });
  }

  /**
   * Fetch an HLS (HTTP Live Streaming) playlist for the specified video asset, with
   * optional query parameters to
   * [modify playback behavior](https://docs.mux.com/guides/modify-playback-behavior).
   *
   * @example
   * ```ts
   * const response = await client.video.playback.hls(
   *   'PLAYBACK_ID',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  hls(
    playbackId: string,
    query: PlaybackHlsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/${playbackId}.m3u8`, {
      query,
      defaultBaseURL: 'https://stream.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'application/vnd.apple.mpegurl' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Fetch a static rendition (usually an MP4 or M4A file) of the specified video
   * asset. [MP4 Support](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * must be enabled on the asset before using these URLs.
   *
   * @example
   * ```ts
   * const response =
   *   await client.video.playback.staticRendition(
   *     'PLAYBACK_ID',
   *     'capped-1080p.mp4',
   *   );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  staticRendition(
    playbackId: string,
    filename: 'capped-1080p.mp4' | 'audio.m4a' | 'low.mp4' | 'medium.mp4' | 'high.mp4',
    query: PlaybackStaticRenditionParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/${playbackId}/${filename}`, {
      query,
      defaultBaseURL: 'https://stream.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'application/binary' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Fetch a standalone WebVTT version of a text track from an asset.
   *
   * @example
   * ```ts
   * const response = await client.video.playback.track(
   *   'PLAYBACK_ID',
   *   'TRACK_ID',
   * );
   * ```
   */
  track(
    playbackId: string,
    trackId: string,
    query: PlaybackTrackParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<string> {
    return this._client.get(path`/${playbackId}/text/${trackId}.vtt`, {
      query,
      defaultBaseURL: 'https://stream.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'text/vtt' }, options?.headers]),
    });
  }

  /**
   * Fetch a
   * [transcript of an asset](https://docs.mux.com/guides/add-autogenerated-captions-and-use-transcripts#retrieve-a-transcript).
   * This is only possible for assets with a text track generated using the
   * [VOD generated captions feature](https://docs.mux.com/guides/add-autogenerated-captions-and-use-transcripts).
   *
   * @example
   * ```ts
   * const response = await client.video.playback.transcript(
   *   'PLAYBACK_ID',
   *   'TRACK_ID',
   * );
   * ```
   */
  transcript(
    playbackId: string,
    trackId: string,
    query: PlaybackTranscriptParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<string> {
    return this._client.get(path`/${playbackId}/text/${trackId}.txt`, {
      query,
      defaultBaseURL: 'https://stream.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: 'text/plain' }, options?.headers]),
    });
  }
}

export type PlaybackStoryboardMetaResponse = string;

export type PlaybackStoryboardVttResponse = string;

export type PlaybackTrackResponse = string;

export type PlaybackTranscriptResponse = string;

export interface PlaybackThumbnailParams {
  /**
   * How to fit a thumbnail within the specified width + height.
   */
  fit_mode?: 'preserve' | 'stretch' | 'crop' | 'smartcrop' | 'pad';

  /**
   * Flip the image left-right after performing all other transformations.
   */
  flip_h?: boolean;

  /**
   * Flip the image top-bottom after performing all other transformations.
   */
  flip_v?: boolean;

  /**
   * The height of the thumbnail (in pixels). Defaults to the height of the original
   * video.
   */
  height?: number;

  /**
   * When set to `true`, pulls the latest thumbnail from the playback ID of an
   * ongoing live stream. Can only be used with live streams. Can be used to build
   * moderation and classification workflows,
   * [see documentation for more details](https://mux.com/docs/guides/get-images-from-a-video#getting-the-latest-thumbnail-from-a-live-stream).
   */
  latest?: boolean;

  /**
   * Set the time of the thumbnail for an asset created from a live stream when using
   * the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_time?: number;

  /**
   * Rotate the image clockwise by the given number of degrees.
   */
  rotate?: 90 | 180 | 270;

  /**
   * The time (in seconds) of the video timeline where the image should be pulled.
   * Defaults to the middle of the original video.
   */
  time?: number;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;

  /**
   * The width of the thumbnail (in pixels). Defaults to the width of the original
   * video.
   */
  width?: number;
}

export interface PlaybackAnimatedParams {
  /**
   * The time (in seconds) of the video timeline where the GIF ends. Defaults to 5
   * seconds after the start. Maximum total duration of GIF is limited to 10 seconds;
   * minimum total duration of GIF is 250ms.
   */
  end?: number;

  /**
   * The frame rate of the generated GIF. Defaults to 15 fps. Max 30 fps.
   */
  fps?: number;

  /**
   * The height in pixels of the animated GIF. The default height is determined by
   * preserving aspect ratio with the width provided. Maximum height is 640px.
   */
  height?: number;

  /**
   * The time (in seconds) of the video timeline where the animated GIF should begin.
   * Defaults to 0.
   */
  start?: number;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;

  /**
   * The width in pixels of the animated GIF. Default is 320px, or if height is
   * provided, the width is determined by preserving aspect ratio with the height.
   * Max width is 640px.
   */
  width?: number;
}

export interface PlaybackStoryboardParams {
  /**
   * Set the relative end time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_end_time?: number;

  /**
   * Set the relative start time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_start_time?: number;

  /**
   * Set the end time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_end_time?: number;

  /**
   * Set the start time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_start_time?: number;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackStoryboardVttParams {
  /**
   * Set the relative end time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_end_time?: number;

  /**
   * Set the relative start time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_start_time?: number;

  /**
   * Set the end time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_end_time?: number;

  /**
   * Set the start time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_start_time?: number;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackStoryboardMetaParams {
  /**
   * Set the relative end time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_end_time?: number;

  /**
   * Set the relative start time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_start_time?: number;

  /**
   * The format of the storyboard image URL in the response. Can be either 'jpg',
   * 'png', or 'webp'. Defaults to 'jpg'.
   */
  format?: 'jpg' | 'png' | 'webp';

  /**
   * Set the end time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_end_time?: number;

  /**
   * Set the start time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_start_time?: number;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackHlsParams {
  /**
   * Set the relative end time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_end_time?: number;

  /**
   * Set the relative start time of the asset (in seconds) when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   */
  asset_start_time?: number;

  /**
   * Set the
   * [default subtitles/captions language](https://docs.mux.com/guides/add-subtitles-to-your-videos#showing-subtitles-by-default)
   * (BCP47 compliant language code).
   */
  default_subtitles_lang?: string;

  /**
   * If set to true, EXT-X-PROGRAM-DATE-TIME tags will be omitted from HLS manifests
   * for assets from live streams.
   */
  exclude_pdt?: boolean;

  /**
   * Set the
   * [maximum resolution](https://docs.mux.com/guides/control-playback-resolution#specify-maximum-resolution)
   * of renditions included in the manifest.
   */
  max_resolution?: '270p' | '360p' | '480p' | '540p' | '720p' | '1080p' | '1440p' | '2160p';

  /**
   * Set the
   * [minimum resolution](https://docs.mux.com/guides/control-playback-resolution#specify-minimum-resolution)
   * of renditions included in the manifest.
   */
  min_resolution?: '270p' | '360p' | '480p' | '540p' | '720p' | '1080p' | '1440p' | '2160p';

  /**
   * Set the end time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_end_time?: number;

  /**
   * Set the start time of the asset created from a live stream when using the
   * [instant clipping feature](https://docs.mux.com/guides/create-instant-clips).
   * The timestamp should be provided as an epoch integer, and is compared to the
   * program date time (PDT) generated by a live stream.
   */
  program_start_time?: number;

  /**
   * Include
   * [HLS redundant streams](https://docs.mux.com/guides/play-your-videos#add-delivery-redundancy-with-redundant-streams)
   * in the manifest.
   */
  redundant_streams?: boolean;

  /**
   * Set the logic to
   * [order renditions in the HLS manifest](https://www.mux.com/blog/more-tools-to-control-playback-behavior-min-resolution-and-rendition-order#rendition_order).
   */
  rendition_order?: 'desc';

  /**
   * Add support for
   * [timeline hover previews on Roku devices](https://docs.mux.com/guides/create-timeline-hover-previews#roku-trick-play).
   */
  roku_trick_play?: boolean;

  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackStaticRenditionParams {
  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackTrackParams {
  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export interface PlaybackTranscriptParams {
  /**
   * Signed token (JWT) for
   * [secure video playback](https://docs.mux.com/guides/secure-video-playback).
   */
  TOKEN?: string;
}

export declare namespace Playback {
  export {
    type PlaybackStoryboardMetaResponse as PlaybackStoryboardMetaResponse,
    type PlaybackStoryboardVttResponse as PlaybackStoryboardVttResponse,
    type PlaybackTrackResponse as PlaybackTrackResponse,
    type PlaybackTranscriptResponse as PlaybackTranscriptResponse,
    type PlaybackThumbnailParams as PlaybackThumbnailParams,
    type PlaybackAnimatedParams as PlaybackAnimatedParams,
    type PlaybackStoryboardParams as PlaybackStoryboardParams,
    type PlaybackStoryboardVttParams as PlaybackStoryboardVttParams,
    type PlaybackStoryboardMetaParams as PlaybackStoryboardMetaParams,
    type PlaybackHlsParams as PlaybackHlsParams,
    type PlaybackStaticRenditionParams as PlaybackStaticRenditionParams,
    type PlaybackTrackParams as PlaybackTrackParams,
    type PlaybackTranscriptParams as PlaybackTranscriptParams,
  };
}
