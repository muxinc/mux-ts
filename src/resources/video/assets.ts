// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * An asset refers to a piece of media content that is stored or is being live streamed through the Mux system. An asset always has a duration and one or more tracks (audio, video, and text data).
 *
 * The media content of an asset cannot be updated once created, however an asset can be used to create another asset, and can be modified within that process.
 */
export class Assets extends APIResource {
  /**
   * Create a new Mux Video asset.
   *
   * @example
   * ```ts
   * const asset = await client.video.assets.create({
   *   inputs: [
   *     { url: 'https://muxed.s3.amazonaws.com/leds.mp4' },
   *   ],
   *   playback_policies: ['public'],
   *   video_quality: 'basic',
   * });
   * ```
   */
  create(body: AssetCreateParams, options?: RequestOptions): APIPromise<Asset> {
    return (
      this._client.post('/video/v1/assets', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Asset }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * List all Mux assets.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const asset of client.video.assets.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: AssetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<AssetsCursorPage, Asset> {
    return this._client.getAPIList('/video/v1/assets', CursorPage<Asset>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Retrieves the details of an asset that has previously been created. Supply the
   * unique asset ID that was returned from your previous request, and Mux will
   * return the corresponding asset information. The same information is returned
   * when creating an asset.
   *
   * @example
   * ```ts
   * const asset = await client.video.assets.retrieve(
   *   'ASSET_ID',
   * );
   * ```
   */
  retrieve(assetId: string, options?: RequestOptions): APIPromise<Asset> {
    return (
      this._client.get(path`/video/v1/assets/${assetId}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Asset }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes a video asset and all its data.
   *
   * @example
   * ```ts
   * await client.video.assets.delete('ASSET_ID');
   * ```
   */
  delete(assetId: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates the details of an existing Asset with the provided Asset ID. This API
   * currently only supports the `passthrough` and `meta` fields.
   *
   * @example
   * ```ts
   * const asset = await client.video.assets.update('ASSET_ID', {
   *   passthrough: 'Example',
   * });
   * ```
   */
  update(assetId: string, body: AssetUpdateParams, options?: RequestOptions): APIPromise<Asset> {
    return (
      this._client.patch(path`/video/v1/assets/${assetId}`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Asset }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Retrieves information about the specified playback ID.
   *
   * @example
   * ```ts
   * const playbackId =
   *   await client.video.assets.retrievePlaybackId(
   *     'ASSET_ID',
   *     'PLAYBACK_ID',
   *   );
   * ```
   */
  retrievePlaybackId(
    assetId: string,
    playbackId: string,
    options?: RequestOptions,
  ): APIPromise<Shared.PlaybackId> {
    return (
      this._client.get(path`/video/v1/assets/${assetId}/playback-ids/${playbackId}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Shared.PlaybackId }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Creates a playback ID that can be used to stream the asset to a viewer.
   *
   * @example
   * ```ts
   * const playbackId =
   *   await client.video.assets.createPlaybackId('ASSET_ID', {
   *     policy: 'public',
   *   });
   * ```
   */
  createPlaybackId(
    assetId: string,
    body: AssetCreatePlaybackIdParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PlaybackId> {
    return (
      this._client.post(path`/video/v1/assets/${assetId}/playback-ids`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Shared.PlaybackId }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes a playback ID, rendering it nonfunctional for viewing an asset's video
   * content. Please note that deleting the playback ID removes access to the
   * underlying asset; a viewer who started playback before the playback ID was
   * deleted may be able to watch the entire video for a limited duration.
   *
   * @example
   * ```ts
   * await client.video.assets.deletePlaybackId(
   *   'ASSET_ID',
   *   'PLAYBACK_ID',
   * );
   * ```
   */
  deletePlaybackId(assetId: string, playbackId: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}/playback-ids/${playbackId}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Adds an asset track (for example, subtitles, or an alternate audio track) to an
   * asset. Assets must be in the `ready` state before tracks can be added.
   *
   * @example
   * ```ts
   * const track = await client.video.assets.createTrack(
   *   'ASSET_ID',
   *   {
   *     language_code: 'en-US',
   *     type: 'text',
   *     url: 'https://example.com/myVideo_en.srt',
   *     closed_captions: true,
   *     name: 'English',
   *     passthrough: 'English',
   *     text_type: 'subtitles',
   *   },
   * );
   * ```
   */
  createTrack(assetId: string, body: AssetCreateTrackParams, options?: RequestOptions): APIPromise<Track> {
    return (
      this._client.post(path`/video/v1/assets/${assetId}/tracks`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Track }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Removes a text or additional audio track from an asset. Neither video nor the
   * primary audio track can be removed.
   *
   * @example
   * ```ts
   * await client.video.assets.deleteTrack(
   *   'ASSET_ID',
   *   'TRACK_ID',
   * );
   * ```
   */
  deleteTrack(assetId: string, trackId: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}/tracks/${trackId}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates the details of an existing Asset Track with the provided Asset ID and
   * Track ID.
   *
   * @example
   * ```ts
   * const track = await client.video.assets.updateTrack(
   *   'ASSET_ID',
   *   'TRACK_ID',
   *   { language_code: 'en-US', name: 'English' },
   * );
   * ```
   */
  updateTrack(
    assetId: string,
    trackId: string,
    body: AssetUpdateTrackParams,
    options?: RequestOptions,
  ): APIPromise<Track> {
    return (
      this._client.patch(path`/video/v1/assets/${assetId}/tracks/${trackId}`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Track }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Generates subtitles (captions) for a given audio track.
   * [See docs for more information.](https://mux.com/docs/guides/add-autogenerated-captions-and-use-transcripts#retroactively-enable-auto-generated-captions)
   *
   * @example
   * ```ts
   * const tracks = await client.video.assets.generateSubtitles(
   *   'ASSET_ID',
   *   'TRACK_ID',
   *   {
   *     generated_subtitles: [
   *       {
   *         language_code: 'en',
   *         name: 'English (generated)',
   *         passthrough: 'English (generated)',
   *       },
   *     ],
   *   },
   * );
   * ```
   */
  generateSubtitles(
    assetId: string,
    trackId: string,
    body: AssetGenerateSubtitlesParams,
    options?: RequestOptions,
  ): APIPromise<AssetGenerateSubtitlesResponse> {
    return (
      this._client.post(path`/video/v1/assets/${assetId}/tracks/${trackId}/generate-subtitles`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AssetGenerateSubtitlesResponse }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Returns a list of the input objects that were used to create the asset along
   * with any settings that were applied to each input.
   *
   * @example
   * ```ts
   * const inputInfos =
   *   await client.video.assets.retrieveInputInfo('ASSET_ID');
   * ```
   */
  retrieveInputInfo(assetId: string, options?: RequestOptions): APIPromise<AssetRetrieveInputInfoResponse> {
    return (
      this._client.get(path`/video/v1/assets/${assetId}/input-info`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AssetRetrieveInputInfoResponse }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * This method has been deprecated. Please see the
   * [Static Rendition API](https://www.mux.com/docs/guides/enable-static-mp4-renditions#after-asset-creation).
   * Allows you to add or remove mp4 support for assets that were created without it.
   * The values supported are `capped-1080p`, `audio-only`,
   * `audio-only,capped-1080p`, `standard`(deprecated), and `none`. `none` means that
   * an asset _does not_ have mp4 support, so submitting a request with `mp4_support`
   * set to `none` will delete the mp4 assets from the asset in question.
   *
   * @deprecated
   */
  updateMP4Support(
    assetId: string,
    body: AssetUpdateMP4SupportParams,
    options?: RequestOptions,
  ): APIPromise<Asset> {
    return (
      this._client.put(path`/video/v1/assets/${assetId}/mp4-support`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Asset }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Allows you to add temporary access to the master (highest-quality) version of
   * the asset in MP4 format. A URL will be created that can be used to download the
   * master version for 24 hours. After 24 hours Master Access will revert to "none".
   * This master version is not optimized for web and not meant to be streamed, only
   * downloaded for purposes like archiving or editing the video offline.
   *
   * @example
   * ```ts
   * const asset = await client.video.assets.updateMasterAccess(
   *   'ASSET_ID',
   *   { master_access: 'temporary' },
   * );
   * ```
   */
  updateMasterAccess(
    assetId: string,
    body: AssetUpdateMasterAccessParams,
    options?: RequestOptions,
  ): APIPromise<Asset> {
    return (
      this._client.put(path`/video/v1/assets/${assetId}/master-access`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: Asset }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Creates a static rendition (i.e. MP4) for an asset
   *
   * @example
   * ```ts
   * const staticRendition =
   *   await client.video.assets.createStaticRendition(
   *     'ASSET_ID',
   *     { resolution: 'highest' },
   *   );
   * ```
   */
  createStaticRendition(
    assetId: string,
    body: AssetCreateStaticRenditionParams,
    options?: RequestOptions,
  ): APIPromise<StaticRendition> {
    return (
      this._client.post(path`/video/v1/assets/${assetId}/static-renditions`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: StaticRendition }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes a single static rendition for an asset
   *
   * @example
   * ```ts
   * await client.video.assets.deleteStaticRendition(
   *   'ASSET_ID',
   *   'STATIC_RENDITION_ID',
   * );
   * ```
   */
  deleteStaticRendition(
    assetId: string,
    staticRenditionId: string,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}/static-renditions/${staticRenditionId}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Retrieves the shot manifest URL containing shot boundaries and shot preview
   * image URLs.
   *
   * @example
   * ```ts
   * const assetShots = await client.video.assets.retrieveShots(
   *   'ASSET_ID',
   * );
   * ```
   */
  retrieveShots(assetId: string, options?: RequestOptions): APIPromise<AssetShots> {
    return (
      this._client.get(path`/video/v1/assets/${assetId}/shots`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AssetShots }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Generate shot boundaries and shot preview images.
   *
   * @example
   * ```ts
   * const assetShots = await client.video.assets.generateShots(
   *   'ASSET_ID',
   * );
   * ```
   */
  generateShots(
    assetId: string,
    body?: AssetGenerateShotsParams | null | undefined,
    options?: RequestOptions,
  ): APIPromise<AssetShots> {
    return (
      this._client.post(path`/video/v1/assets/${assetId}/shots`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: AssetShots }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes detected shot boundaries and shot preview images on the asset.
   *
   * @example
   * ```ts
   * await client.video.assets.deleteShots('ASSET_ID');
   * ```
   */
  deleteShots(assetId: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}/shots`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Unset the thumbnail time for an asset, returning the thumbnail to default
   * behavior
   *
   * @example
   * ```ts
   * await client.video.assets.deleteThumbnailTime('ASSET_ID');
   * ```
   */
  deleteThumbnailTime(assetId: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/assets/${assetId}/thumbnail-time`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type AssetsCursorPage = CursorPage<Asset>;

export interface Asset {
  /**
   * Unique identifier for the Asset. Max 255 characters.
   */
  id: string;

  /**
   * Time the Asset was created, defined as a Unix timestamp (seconds since epoch).
   */
  created_at: string;

  /**
   * @deprecated Use `video_quality` instead.
   */
  encoding_tier: 'smart' | 'baseline' | 'premium';

  master_access: 'temporary' | 'none';

  /**
   * Max resolution tier can be used to control the maximum `resolution_tier` your
   * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
   */
  max_resolution_tier: '1080p' | '1440p' | '2160p';

  /**
   * Detailed state information about the asset ingest process.
   */
  progress: AssetProgress;

  /**
   * The status of the asset.
   */
  status: 'preparing' | 'ready' | 'errored';

  /**
   * The aspect ratio of the asset in the form of `width:height`, for example `16:9`.
   */
  aspect_ratio?: string;

  /**
   * The Mux Robots directives applied to the asset.
   */
  directives?: Array<Directive>;

  /**
   * The duration of the asset in seconds (max duration for a single asset is 12
   * hours).
   */
  duration?: number;

  /**
   * Object that describes any errors that happened when processing this asset.
   */
  errors?: Asset.Errors;

  /**
   * Whether to perform shot detection on this asset. Shots are only generated for
   * video assets and will not be generated for audio-only assets.
   */
  generate_shots?: boolean;

  /**
   * The type of ingest used to create the asset.
   */
  ingest_type?: 'on_demand_url' | 'on_demand_direct_upload' | 'on_demand_clip' | 'live_rtmp' | 'live_srt';

  /**
   * Indicates whether the live stream that created this asset is currently `active`
   * and not in `idle` state. This is an optional parameter added when the asset is
   * created from a live stream.
   */
  is_live?: boolean;

  /**
   * Unique identifier for the live stream. This is an optional parameter added when
   * the asset is created from a live stream.
   */
  live_stream_id?: string;

  /**
   * An object containing the current status of Master Access and the link to the
   * Master MP4 file when ready. This object does not exist if `master_access` is set
   * to `none` and when the temporary URL expires.
   */
  master?: Asset.Master;

  /**
   * The maximum frame rate that has been stored for the asset. The asset may be
   * delivered at lower frame rates depending on the device and bandwidth, however it
   * cannot be delivered at a higher value than is stored. This field may return -1
   * if the frame rate of the input cannot be reliably determined.
   */
  max_stored_frame_rate?: number;

  /**
   * @deprecated Use `resolution_tier` instead.
   */
  max_stored_resolution?: 'Audio only' | 'SD' | 'HD' | 'FHD' | 'UHD';

  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: AssetMetadata;

  /**
   * @deprecated Use the Static Renditions API
   * (https://www.mux.com/docs/guides/enable-static-mp4-renditions) instead. This
   * field remains available only to support migration from `mp4_support` to static
   * renditions.
   */
  mp4_support?: 'standard' | 'none' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

  /**
   * An object containing one or more reasons the input file is non-standard. See
   * [the guide on minimizing processing time](https://docs.mux.com/guides/minimize-processing-time)
   * for more information on what a standard input is defined as. This object only
   * exists on on-demand assets that have non-standard inputs, so if missing you can
   * assume the input qualifies as standard.
   */
  non_standard_input_reasons?: Asset.NonStandardInputReasons;

  /**
   * Normalize the audio track loudness level. This parameter is only applicable to
   * on-demand (not live) assets.
   */
  normalize_audio?: boolean;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id` , you can use the `meta` object instead. **Max:
   * 255 characters**.
   */
  passthrough?: string;

  /**
   * An array of Playback ID objects. Use these to create HLS playback URLs. See
   * [Play your videos](https://docs.mux.com/guides/play-your-videos) for more
   * details.
   */
  playback_ids?: Array<Shared.PlaybackId>;

  /**
   * An array of individual live stream recording sessions. A recording session is
   * created on each encoder connection during the live stream. Additionally any time
   * slate media is inserted during brief interruptions in the live stream media or
   * times when the live streaming software disconnects, a recording session
   * representing the slate media will be added with a "slate" type.
   */
  recording_times?: Array<Asset.RecordingTime>;

  /**
   * The resolution tier that the asset was ingested at, affecting billing for ingest
   * & storage. This field also represents the highest resolution tier that the
   * content can be delivered at, however the actual resolution may be lower
   * depending on the device, bandwidth, and exact resolution of the uploaded asset.
   */
  resolution_tier?: 'audio-only' | '720p' | '1080p' | '1440p' | '2160p';

  /**
   * The results of generating shots on the video
   */
  shots?: AssetShots;

  /**
   * Asset Identifier of the video used as the source for creating the clip.
   */
  source_asset_id?: string;

  /**
   * An object containing the current status of any static renditions (mp4s). The
   * object does not exist if no static renditions have been requested. See
   * [Download your videos](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   */
  static_renditions?: Asset.StaticRenditions;

  /**
   * True means this live stream is a test asset. A test asset can help evaluate the
   * Mux Video APIs without incurring any cost. There is no limit on number of test
   * assets created. Test assets are watermarked with the Mux logo, limited to 10
   * seconds, and deleted after 24 hrs.
   */
  test?: boolean;

  /**
   * The media time within the asset used when a thumbnail without an explicit time
   * is requested.
   */
  thumbnail_time?: number;

  /**
   * The individual media tracks that make up an asset.
   */
  tracks?: Array<Track>;

  /**
   * Unique identifier for the Direct Upload. This is an optional parameter added
   * when the asset is created from a direct upload.
   */
  upload_id?: string;

  /**
   * The video quality controls the cost, quality, and available platform features
   * for the asset. The default video quality for an account can be set in the Mux
   * Dashboard. This field replaces the deprecated `encoding_tier` value.
   * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
   */
  video_quality?: 'basic' | 'plus' | 'premium';
}

export namespace Asset {
  /**
   * Object that describes any errors that happened when processing this asset.
   */
  export interface Errors {
    /**
     * Error messages with more details.
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred for this asset.
     */
    type?: string;
  }

  /**
   * An object containing the current status of Master Access and the link to the
   * Master MP4 file when ready. This object does not exist if `master_access` is set
   * to `none` and when the temporary URL expires.
   */
  export interface Master {
    status?: 'ready' | 'preparing' | 'errored';

    /**
     * The temporary URL to the master version of the video, as an MP4 file. This URL
     * will expire after 24 hours.
     */
    url?: string;
  }

  /**
   * An object containing one or more reasons the input file is non-standard. See
   * [the guide on minimizing processing time](https://docs.mux.com/guides/minimize-processing-time)
   * for more information on what a standard input is defined as. This object only
   * exists on on-demand assets that have non-standard inputs, so if missing you can
   * assume the input qualifies as standard.
   */
  export interface NonStandardInputReasons {
    /**
     * The audio codec used on the input file. Non-AAC audio codecs are non-standard.
     */
    audio_codec?: string;

    /**
     * Audio Edit List reason indicates that the input file's audio track contains a
     * complex Edit Decision List.
     */
    audio_edit_list?: 'non-standard';

    /**
     * The video pixel aspect ratio of the input file.
     */
    pixel_aspect_ratio?: string;

    /**
     * A catch-all reason when the input file in created with non-standard encoding
     * parameters.
     */
    unexpected_media_file_parameters?: 'non-standard';

    /**
     * The video pixel format, as a string, returned by libav. Considered non-standard
     * if not one of yuv420p or yuvj420p. HEVC inputs additionally permit yuv420p10le.
     */
    unsupported_pixel_format?: string;

    /**
     * The video bitrate of the input file is `high`. This parameter is present when
     * the average bitrate of any key frame interval (also known as Group of Pictures
     * or GOP) is higher than what's considered standard which typically is 16 Mbps.
     */
    video_bitrate?: 'high';

    /**
     * The video codec used on the input file. For example, the input file encoded with
     * `av1` video codec is non-standard and the value of this parameter is `av1`.
     */
    video_codec?: string;

    /**
     * Video Edit List reason indicates that the input file's video track contains a
     * complex Edit Decision List.
     */
    video_edit_list?: 'non-standard';

    /**
     * The video frame rate of the input file. Video with average frames per second
     * (fps) less than 5 or greater than 120 is non-standard. A `-1` frame rate value
     * indicates Mux could not determine the frame rate of the video track.
     */
    video_frame_rate?: string;

    /**
     * The video key frame Interval (also called as Group of Picture or GOP) of the
     * input file is `high`. This parameter is present when the gop is greater than 20
     * seconds.
     */
    video_gop_size?: 'high';

    /**
     * The video resolution of the input file. Video resolution higher than 2048 pixels
     * on any one dimension (height or width) is considered non-standard, The
     * resolution value is presented as `width` x `height` in pixels.
     */
    video_resolution?: string;
  }

  export interface RecordingTime {
    /**
     * The duration of the live stream recorded. The time value is in seconds.
     */
    duration?: number;

    /**
     * The time at which the recording for the live stream started. The time value is
     * Unix epoch time represented in ISO 8601 format.
     */
    started_at?: string;

    /**
     * The type of media represented by the recording session, either `content` for
     * normal stream content or `slate` for slate media inserted during stream
     * interruptions.
     */
    type?: 'content' | 'slate';
  }

  /**
   * An object containing the current status of any static renditions (mp4s). The
   * object does not exist if no static renditions have been requested. See
   * [Download your videos](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   */
  export interface StaticRenditions {
    /**
     * Array of file objects.
     */
    files?: Array<AssetsAPI.StaticRendition>;

    /**
     * Indicates the status of downloadable MP4 versions of this asset. This field is
     * only valid when `mp4_support` is enabled
     */
    status?: 'ready' | 'preparing' | 'disabled' | 'errored';
  }
}

export interface AssetGeneratedSubtitleSettings {
  /**
   * The language of the audio from which subtitles are generated. Selecting a
   * language of "auto" will allow language detection to set the language code
   * automatically.
   */
  language_code?:
    | 'en'
    | 'es'
    | 'it'
    | 'pt'
    | 'de'
    | 'fr'
    | 'pl'
    | 'ru'
    | 'nl'
    | 'ca'
    | 'tr'
    | 'sv'
    | 'uk'
    | 'no'
    | 'fi'
    | 'sk'
    | 'el'
    | 'cs'
    | 'hr'
    | 'da'
    | 'ro'
    | 'bg'
    | 'auto';

  /**
   * A name for this subtitle track.
   */
  name?: string;

  /**
   * Arbitrary metadata set for the subtitle track. Max 255 characters.
   */
  passthrough?: string;
}

/**
 * Customer provided metadata about this asset.
 *
 * Note: This metadata may be publicly available via the video player. Do not
 * include PII or sensitive information.
 */
export interface AssetMetadata {
  /**
   * This is an identifier you provide to keep track of the creator of the asset. Max
   * 128 code points.
   */
  creator_id?: string;

  /**
   * This is an identifier you provide to link the asset to your own data. Max 128
   * code points.
   */
  external_id?: string;

  /**
   * The asset title. Max 512 code points.
   */
  title?: string;
}

export interface AssetOptions {
  /**
   * An array of playback policy objects that you want applied to this asset and
   * available through `playback_ids`. `advanced_playback_policies` must be used
   * instead of `playback_policies` when creating a DRM playback ID.
   */
  advanced_playback_policies?: Array<Shared.CreatePlaybackIdRequest>;

  /**
   * If the created asset is a clip, this controls whether overlays are copied from
   * the source asset.
   */
  copy_overlays?: boolean;

  /**
   * An array of Mux Robots directives to apply to the asset.
   */
  directives?: Array<Directive>;

  /**
   * @deprecated Use `video_quality` instead.
   */
  encoding_tier?: 'smart' | 'baseline' | 'premium';

  /**
   * Whether to perform shot detection on this asset. Shots are only generated for
   * video assets and will not be generated for audio-only assets.
   */
  generate_shots?: boolean;

  /**
   * @deprecated Use `inputs` instead.
   */
  input?: Array<InputSettings>;

  /**
   * An array of objects that each describe an input file to be used to create the
   * asset. As a shortcut, input can also be a string URL for a file when only one
   * input file is used. See `input[].url` for requirements.
   */
  inputs?: Array<InputSettings>;

  /**
   * Specify what level (if any) of support for master access. Master access can be
   * enabled temporarily for your asset to be downloaded. See the
   * [Download your videos guide](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   */
  master_access?: 'none' | 'temporary';

  /**
   * Max resolution tier can be used to control the maximum `resolution_tier` your
   * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
   */
  max_resolution_tier?: '1080p' | '1440p' | '2160p';

  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: AssetMetadata;

  /**
   * @deprecated See the Static Renditions API
   * (https://www.mux.com/docs/guides/enable-static-mp4-renditions).
   */
  mp4_support?: 'none' | 'standard' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

  /**
   * Normalize the audio track loudness level. This parameter is only applicable to
   * on-demand (not live) assets.
   */
  normalize_audio?: boolean;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id`, you can use the `meta` object instead. **Max:
   * 255 characters**.
   */
  passthrough?: string;

  /**
   * An array of playback policy names that you want applied to this asset and
   * available through `playback_ids`. Options include:
   *
   * - `"public"` (anyone with the playback URL can stream the asset).
   * - `"signed"` (an additional access token is required to play the asset).
   *
   * If no `playback_policies` are set, the asset will have no playback IDs and will
   * therefore not be playable. For simplicity, a single string name can be used in
   * place of the array in the case of only one playback policy.
   */
  playback_policies?: Array<Shared.PlaybackPolicy>;

  /**
   * @deprecated Use `playback_policies` instead.
   */
  playback_policy?: Array<Shared.PlaybackPolicy>;

  /**
   * An array of static renditions to create for this asset. You may not enable both
   * `static_renditions` and `mp4_support (the latter being deprecated)`
   */
  static_renditions?: Array<CreateStaticRenditionRequest>;

  /**
   * Marks the asset as a test asset when the value is set to true. A Test asset can
   * help evaluate the Mux Video APIs without incurring any cost. There is no limit
   * on number of test assets created. Test asset are watermarked with the Mux logo,
   * limited to 10 seconds, deleted after 24 hrs.
   */
  test?: boolean;

  /**
   * The video quality controls the cost, quality, and available platform features
   * for the asset. The default video quality for an account can be set in the Mux
   * Dashboard. This field replaces the deprecated `encoding_tier` value.
   * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
   */
  video_quality?: 'basic' | 'plus' | 'premium';
}

/**
 * Detailed state information about the asset ingest process.
 */
export interface AssetProgress {
  /**
   * Represents the estimated completion percentage. Returns `0 - 100` when in
   * `ingesting`, `transcoding`, or `completed` state, and `-1` when in `live` or
   * `errored` state.
   */
  progress: number;

  /**
   * The detailed state of the asset ingest process. This field is useful for
   * relaying more granular processing information to end users when a
   * [non-standard input is encountered](https://www.mux.com/docs/guides/minimize-processing-time#non-standard-input).
   *
   * - `ingesting`: Asset is being ingested (initial processing before or after
   *   transcoding). While in this state, the `progress` percentage will be 0.
   * - `transcoding`: Asset is undergoing non-standard transcoding.
   * - `completed`: Asset processing is complete (`status` is `ready`). While in this
   *   state, the `progress` percentage will be 100.
   * - `live`: Asset is a live stream currently in progress. While in this state, the
   *   `progress` percentage will be -1.
   * - `errored`: Asset has encountered an error (`status` is `errored`). While in
   *   this state, the `progress` percentage will be -1.
   */
  state: 'ingesting' | 'transcoding' | 'completed' | 'live' | 'errored';
}

export interface AssetResponse {
  data: Asset;
}

/**
 * The results of generating shots on the video
 */
export interface AssetShots {
  /**
   * The status of the shot detection process
   */
  status: 'pending' | 'completed' | 'errored' | 'skipped' | 'deleted';

  /**
   * An object describing any errors encountered during the shot detection process.
   * This field is only present when `status` is `errored`.
   */
  errors?: AssetShots.Errors;

  /**
   * A URL to a JSON manifest describing the shot changes detected in the video along
   * with shot preview images for each shot. This field is only present when `status`
   * is `completed`.
   */
  shots_manifest_url?: string;
}

export namespace AssetShots {
  /**
   * An object describing any errors encountered during the shot detection process.
   * This field is only present when `status` is `errored`.
   */
  export interface Errors {
    /**
     * A list of error messages describing the errors that occurred in more detail
     */
    messages?: Array<string>;

    /**
     * The type of error that occurred
     */
    type?: string;
  }
}

export interface CreateStaticRenditionRequest {
  resolution:
    | 'highest'
    | 'audio-only'
    | '2160p'
    | '1440p'
    | '1080p'
    | '720p'
    | '540p'
    | '480p'
    | '360p'
    | '270p';

  /**
   * Arbitrary user-supplied metadata set for the static rendition. Max 255
   * characters.
   */
  passthrough?: string;
}

/**
 * A Mux Robots directive to apply to the asset.
 */
export interface Directive {
  /**
   * The Mux Robots directive identifier.
   */
  id: string;
}

export interface InputInfo {
  file?: InputInfo.File;

  /**
   * An array of objects that each describe an input file to be used to create the
   * asset. As a shortcut, `input` can also be a string URL for a file when only one
   * input file is used. See `input[].url` for requirements.
   */
  settings?: InputSettings;
}

export namespace InputInfo {
  export interface File {
    container_format?: string;

    tracks?: Array<File.Track>;
  }

  export namespace File {
    export interface Track {
      type: string;

      channels?: number;

      duration?: number;

      encoding?: string;

      frame_rate?: number;

      height?: number;

      sample_rate?: number;

      sample_size?: number;

      width?: number;
    }
  }
}

/**
 * An array of objects that each describe an input file to be used to create the
 * asset. As a shortcut, `input` can also be a string URL for a file when only one
 * input file is used. See `input[].url` for requirements.
 */
export interface InputSettings {
  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   * This optional parameter should be used for tracks with `type` of `text` and
   * `text_type` set to `subtitles`.
   */
  closed_captions?: boolean;

  /**
   * The time offset in seconds from the beginning of the video, indicating the
   * clip's ending marker. The default value is the duration of the video when not
   * included. This parameter is only applicable for creating clips when `input.url`
   * has `mux://assets/{asset_id}` format.
   */
  end_time?: number;

  /**
   * Generate subtitle tracks using automatic speech recognition with this
   * configuration. Subtitles are generated using the audio of the input they are
   * nested within. For direct uploads, this first input should omit the url
   * parameter, as the main input file is provided via the direct upload. Note that
   * subtitle generation happens after initial ingest, so the generated tracks will
   * be in the `preparing` state when the asset transitions to `ready`.
   */
  generated_subtitles?: Array<AssetGeneratedSubtitleSettings>;

  /**
   * The language code value must be a valid
   * [BCP 47](https://tools.ietf.org/html/bcp47) specification compliant value. For
   * example, `en` for English or `en-US` for the US version of English. This
   * parameter is required for `text` and `audio` track types.
   */
  language_code?: string;

  /**
   * The name of the track containing a human-readable description. This value must
   * be unique within each group of `text` or `audio` track types. The HLS manifest
   * will associate a subtitle text track with this value. For example, the value
   * should be "English" for a subtitle text track with `language_code` set to `en`.
   * This optional parameter should be used only for `text` and `audio` type tracks.
   * This parameter can be optionally provided for the first video input to denote
   * the name of the muxed audio track if present. If this parameter is not included,
   * Mux will auto-populate based on the `input[].language_code` value.
   */
  name?: string;

  /**
   * An object that describes how the image file referenced in URL should be placed
   * over the video (i.e. watermarking). Ensure that the URL is active and persists
   * the entire lifespan of the video object.
   */
  overlay_settings?: InputSettings.OverlaySettings;

  /**
   * This optional parameter should be used for tracks with `type` of `text` and
   * `text_type` set to `subtitles`.
   */
  passthrough?: string;

  /**
   * The time offset in seconds from the beginning of the video indicating the clip's
   * starting marker. The default value is 0 when not included. This parameter is
   * only applicable for creating clips when `input.url` has
   * `mux://assets/{asset_id}` format.
   */
  start_time?: number;

  /**
   * Type of text track. This parameter only supports subtitles value. For more
   * information on Subtitles / Closed Captions,
   * [see this blog post](https://mux.com/blog/subtitles-captions-webvtt-hls-and-those-magic-flags/).
   * This parameter is required for `text` type tracks.
   */
  text_type?: 'subtitles';

  /**
   * This parameter is required for `text` type tracks.
   */
  type?: 'video' | 'audio' | 'text';

  /**
   * The URL of the file that Mux should download and use.
   *
   * - For the main input file, this should be the URL to the muxed file for Mux to
   *   download, for example an MP4, MOV, MKV, or TS file. Mux supports most
   *   audio/video file formats and codecs, but for fastest processing, you should
   *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
   * - For `audio` tracks, the URL is the location of the audio file for Mux to
   *   download, for example an M4A, WAV, or MP3 file. Mux supports most audio file
   *   formats and codecs, but for fastest processing, you should
   *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
   * - For `text` tracks, the URL is the location of subtitle/captions file. Mux
   *   supports [SubRip Text (SRT)](https://en.wikipedia.org/wiki/SubRip) and
   *   [Web Video Text Tracks](https://www.w3.org/TR/webvtt1/) formats for ingesting
   *   Subtitles and Closed Captions.
   * - For Watermarking or Overlay, the URL is the location of the watermark image.
   *   The maximum size is 4096x4096.
   * - When creating clips from existing Mux assets, the URL is defined with
   *   `mux://assets/{asset_id}` template where `asset_id` is the Asset Identifier
   *   for creating the clip from. The url property may be omitted on the first input
   *   object when providing asset settings for LiveStream and Upload objects, in
   *   order to configure settings related to the primary (live stream or direct
   *   upload) input.
   */
  url?: string;
}

export namespace InputSettings {
  /**
   * An object that describes how the image file referenced in URL should be placed
   * over the video (i.e. watermarking). Ensure that the URL is active and persists
   * the entire lifespan of the video object.
   */
  export interface OverlaySettings {
    /**
     * How tall the overlay should appear. Can be expressed as a percent ("10%") or as
     * a pixel value ("100px"). If both width and height are left blank the height will
     * be the true pixels of the image, applied as if the video has been scaled to fit
     * a 1920x1080 frame. If width is supplied with no height, the height will scale
     * proportionally to the width.
     */
    height?: string;

    /**
     * Where the horizontal positioning of the overlay/watermark should begin from.
     */
    horizontal_align?: 'left' | 'center' | 'right';

    /**
     * The distance from the horizontal_align starting point and the image's closest
     * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
     * Negative values will move the overlay offscreen. In the case of 'center', a
     * positive value will shift the image towards the right and and a negative value
     * will shift it towards the left.
     */
    horizontal_margin?: string;

    /**
     * How opaque the overlay should appear, expressed as a percent. (Default 100%)
     */
    opacity?: string;

    /**
     * Where the vertical positioning of the overlay/watermark should begin from.
     * Defaults to `"top"`
     */
    vertical_align?: 'top' | 'middle' | 'bottom';

    /**
     * The distance from the vertical_align starting point and the image's closest
     * edge. Can be expressed as a percent ("10%") or as a pixel value ("100px").
     * Negative values will move the overlay offscreen. In the case of 'middle', a
     * positive value will shift the overlay towards the bottom and and a negative
     * value will shift it towards the top.
     */
    vertical_margin?: string;

    /**
     * How wide the overlay should appear. Can be expressed as a percent ("10%") or as
     * a pixel value ("100px"). If both width and height are left blank the width will
     * be the true pixels of the image, applied as if the video has been scaled to fit
     * a 1920x1080 frame. If height is supplied with no width, the width will scale
     * proportionally to the height.
     */
    width?: string;
  }
}

export interface StaticRendition {
  /**
   * The ID of this static rendition, used in managing this static rendition. This
   * field is only valid for `static_renditions`, not for `mp4_support`.
   */
  id?: string;

  /**
   * The bitrate in bits per second
   */
  bitrate?: number;

  /**
   * Extension of the static rendition file
   */
  ext?: 'mp4' | 'm4a';

  /**
   * The file size in bytes
   */
  filesize?: string;

  /**
   * The height of the static rendition's file in pixels
   */
  height?: number;

  /**
   * Name of the static rendition file
   */
  name?:
    | 'low.mp4'
    | 'medium.mp4'
    | 'high.mp4'
    | 'highest.mp4'
    | 'audio.m4a'
    | 'capped-1080p.mp4'
    | '2160p.mp4'
    | '1440p.mp4'
    | '1080p.mp4'
    | '720p.mp4'
    | '540p.mp4'
    | '480p.mp4'
    | '360p.mp4'
    | '270p.mp4';

  /**
   * Arbitrary user-supplied metadata set for the static rendition. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * Indicates the resolution of this specific MP4 version of this asset. This field
   * is only valid for `static_renditions`, not for `mp4_support`.
   */
  resolution?:
    | 'highest'
    | 'audio-only'
    | '2160p'
    | '1440p'
    | '1080p'
    | '720p'
    | '540p'
    | '480p'
    | '360p'
    | '270p';

  /**
   * Indicates the resolution tier of this specific MP4 version of this asset. This
   * field is only valid for `static_renditions`, not for `mp4_support`.
   */
  resolution_tier?: '2160p' | '1440p' | '1080p' | '720p' | 'audio-only';

  /**
   * Indicates the status of this specific MP4 version of this asset. This field is
   * only valid for `static_renditions`, not for `mp4_support`.
   *
   * - `ready` indicates the MP4 has been generated and is ready for download
   * - `preparing` indicates the asset has not been ingested or the static rendition
   *   is still being generated after an asset is ready
   * - `skipped` indicates the static rendition will not be generated because the
   *   requested resolution conflicts with the asset attributes after the asset has
   *   been ingested
   * - `errored` indicates the static rendition cannot be generated. For example, an
   *   asset could not be ingested
   */
  status?: 'ready' | 'preparing' | 'skipped' | 'errored';

  /**
   * Indicates the static rendition type of this specific MP4 version of this asset.
   * This field is only valid for `static_renditions`, not for `mp4_support`.
   */
  type?: 'standard' | 'advanced';

  /**
   * The width of the static rendition's file in pixels
   */
  width?: number;
}

export interface Track {
  /**
   * Unique identifier for the Track
   */
  id?: string;

  /**
   * The confidence value (0-1) of the determined language. This value only is
   * available when automatic language detection is utilized in generated subtitles.
   */
  auto_language_confidence?: number;

  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   * This parameter is only set tracks where `type` is `text` and `text_type` is
   * `subtitles`.
   */
  closed_captions?: boolean;

  /**
   * The duration in seconds of the track media. This parameter is not set for `text`
   * type tracks. This field is optional and may not be set. The top level `duration`
   * field of an asset will always be set.
   */
  duration?: number;

  /**
   * The language code value represents [BCP 47](https://tools.ietf.org/html/bcp47)
   * specification compliant value, or 'auto'. For example, `en` for English or
   * `en-US` for the US version of English. This parameter is only set for `text` and
   * `audio` track types. During automatic language detection for generated
   * subtitles, this value will be set to `auto` until the language is determined.
   */
  language_code?: string;

  /**
   * The maximum number of audio channels the track supports. Only set for the
   * `audio` type track.
   */
  max_channels?: number;

  /**
   * The maximum frame rate available for the track. Only set for the `video` type
   * track. This field may return `-1` if the frame rate of the input cannot be
   * reliably determined.
   */
  max_frame_rate?: number;

  /**
   * The maximum height in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_height?: number;

  /**
   * The maximum width in pixels available for the track. Only set for the `video`
   * type track.
   */
  max_width?: number;

  /**
   * The name of the track containing a human-readable description. The HLS manifest
   * will associate a subtitle `text` or `audio` track with this value. For example,
   * the value should be "English" for a subtitle text track for the `language_code`
   * value of `en-US`. This parameter is only set for `text` and `audio` track types.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the track either when creating the
   * asset or track. This parameter is only set for `text` type tracks. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * For an audio track, indicates that this is the primary audio track, ingested
   * from the main input for this asset. The primary audio track cannot be deleted.
   */
  primary?: boolean;

  /**
   * The status of the track.
   */
  status?: 'preparing' | 'ready' | 'errored' | 'deleted';

  /**
   * The source of the text contained in a Track of type `text`. Valid `text_source`
   * values are listed below.
   *
   * - `uploaded`: Tracks uploaded to Mux as caption or subtitle files using the
   *   Create Asset Track API.
   * - `embedded`: Tracks extracted from an embedded stream of CEA-608 closed
   *   captions.
   * - `generated_vod`: Tracks generated by automatic speech recognition on an
   *   on-demand asset.
   * - `generated_live`: Tracks generated by automatic speech recognition on a live
   *   stream configured with `generated_subtitles`. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   * - `generated_live_final`: Tracks generated by automatic speech recognition on a
   *   live stream using `generated_subtitles`. The accuracy, timing, and formatting
   *   of these subtitles is improved compared to the corresponding `generated_live`
   *   tracks. However, `generated_live_final` tracks will not be available in
   *   `ready` status until the live stream ends. If an Asset has both
   *   `generated_live` and `generated_live_final` tracks that are `ready`, then only
   *   the `generated_live_final` track will be included during playback.
   */
  text_source?: 'uploaded' | 'embedded' | 'generated_live' | 'generated_live_final' | 'generated_vod';

  /**
   * This parameter is only set for `text` type tracks.
   */
  text_type?: 'subtitles';

  /**
   * The type of track
   */
  type?: 'video' | 'audio' | 'text';
}

export type AssetGenerateSubtitlesResponse = Array<Track>;

export type AssetRetrieveInputInfoResponse = Array<InputInfo>;

export interface AssetCreateParams {
  /**
   * An array of objects that each describe an input file to be used to create the
   * asset. As a shortcut, input can also be a string URL for a file when only one
   * input file is used. See `input[].url` for requirements.
   */
  inputs: Array<InputSettings>;

  /**
   * An array of playback policy objects that you want applied to this asset and
   * available through `playback_ids`. `advanced_playback_policies` must be used
   * instead of `playback_policies` when creating a DRM playback ID.
   */
  advanced_playback_policies?: Array<Shared.CreatePlaybackIdRequest>;

  /**
   * If the created asset is a clip, this controls whether overlays are copied from
   * the source asset.
   */
  copy_overlays?: boolean;

  /**
   * An array of Mux Robots directives to apply to the asset.
   */
  directives?: Array<Directive>;

  /**
   * @deprecated Use `video_quality` instead.
   */
  encoding_tier?: 'smart' | 'baseline' | 'premium';

  /**
   * Whether to perform shot detection on this asset. Shots are only generated for
   * video assets and will not be generated for audio-only assets.
   */
  generate_shots?: boolean;

  /**
   * @deprecated Use `inputs` instead.
   */
  input?: Array<InputSettings>;

  /**
   * Specify what level (if any) of support for master access. Master access can be
   * enabled temporarily for your asset to be downloaded. See the
   * [Download your videos guide](https://docs.mux.com/guides/enable-static-mp4-renditions)
   * for more information.
   */
  master_access?: 'none' | 'temporary';

  /**
   * Max resolution tier can be used to control the maximum `resolution_tier` your
   * asset is encoded, stored, and streamed at. If not set, this defaults to `1080p`.
   */
  max_resolution_tier?: '1080p' | '1440p' | '2160p';

  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: AssetMetadata;

  /**
   * @deprecated See the Static Renditions API
   * (https://www.mux.com/docs/guides/enable-static-mp4-renditions).
   */
  mp4_support?: 'none' | 'standard' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';

  /**
   * Normalize the audio track loudness level. This parameter is only applicable to
   * on-demand (not live) assets.
   */
  normalize_audio?: boolean;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id`, you can use the `meta` object instead. **Max:
   * 255 characters**.
   */
  passthrough?: string;

  /**
   * An array of playback policy names that you want applied to this asset and
   * available through `playback_ids`. Options include:
   *
   * - `"public"` (anyone with the playback URL can stream the asset).
   * - `"signed"` (an additional access token is required to play the asset).
   *
   * If no `playback_policies` are set, the asset will have no playback IDs and will
   * therefore not be playable. For simplicity, a single string name can be used in
   * place of the array in the case of only one playback policy.
   */
  playback_policies?: Array<Shared.PlaybackPolicy>;

  /**
   * @deprecated Use `playback_policies` instead.
   */
  playback_policy?: Array<Shared.PlaybackPolicy>;

  /**
   * An array of static renditions to create for this asset. You may not enable both
   * `static_renditions` and `mp4_support (the latter being deprecated)`
   */
  static_renditions?: Array<CreateStaticRenditionRequest>;

  /**
   * Marks the asset as a test asset when the value is set to true. A Test asset can
   * help evaluate the Mux Video APIs without incurring any cost. There is no limit
   * on number of test assets created. Test asset are watermarked with the Mux logo,
   * limited to 10 seconds, deleted after 24 hrs.
   */
  test?: boolean;

  /**
   * The video quality controls the cost, quality, and available platform features
   * for the asset. The default video quality for an account can be set in the Mux
   * Dashboard. This field replaces the deprecated `encoding_tier` value.
   * [See the video quality guide for more details.](https://docs.mux.com/guides/use-video-quality-levels)
   */
  video_quality?: 'basic' | 'plus' | 'premium';
}

export interface AssetListParams extends CursorPageParams {
  /**
   * Filter response to return all the assets for this live stream only
   */
  live_stream_id?: string;

  /**
   * Offset by this many pages, of the size of `limit`
   */
  page?: number;

  /**
   * Filter response to return an asset created from this direct upload only
   */
  upload_id?: string;
}

export interface AssetUpdateParams {
  /**
   * Customer provided metadata about this asset.
   *
   * Note: This metadata may be publicly available via the video player. Do not
   * include PII or sensitive information.
   */
  meta?: AssetMetadata;

  /**
   * You can set this field to anything you want. It will be included in the asset
   * details and related webhooks. If you're looking for more structured metadata,
   * such as `title` or `external_id` , you can use the `meta` object instead. **Max:
   * 255 characters**. In order to clear this value, the field should be included
   * with an empty string value.
   */
  passthrough?: string;

  /**
   * The media time within the asset used when a thumbnail without an explicit time
   * is requested.
   */
  thumbnail_time?: number;
}

export interface AssetCreatePlaybackIdParams {
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
  policy?: Shared.PlaybackPolicy;
}

export interface AssetCreateTrackParams {
  /**
   * The language code of this track. The value must be a valid BCP 47 specification
   * compliant value. For example, en for English or en-US for the US version of
   * English.
   */
  language_code: string;

  type: 'text' | 'audio';

  /**
   * The URL of the file that Mux should download and use.
   *
   * - For `audio` tracks, the URL is the location of the audio file for Mux to
   *   download, for example an M4A, WAV, or MP3 file. Mux supports most audio file
   *   formats and codecs, but for fastest processing, you should
   *   [use standard inputs wherever possible](https://docs.mux.com/guides/minimize-processing-time).
   * - For `text` tracks, the URL is the location of subtitle/captions file. Mux
   *   supports [SubRip Text (SRT)](https://en.wikipedia.org/wiki/SubRip) and
   *   [Web Video Text Tracks](https://www.w3.org/TR/webvtt1/) formats for ingesting
   *   Subtitles and Closed Captions.
   */
  url: string;

  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   */
  closed_captions?: boolean;

  /**
   * The name of the track containing a human-readable description. This value must
   * be unique within each group of `text` or `audio` track types. The HLS manifest
   * will associate the `text` or `audio` track with this value. For example, set the
   * value to "English" for subtitles text track with `language_code` as en-US. If
   * this parameter is not included, Mux will auto-populate a value based on the
   * `language_code` value.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the track either when creating the
   * asset or track.
   */
  passthrough?: string;

  text_type?: 'subtitles';
}

export interface AssetUpdateTrackParams {
  /**
   * Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH).
   */
  closed_captions?: boolean;

  /**
   * The language code of this track. The value must be a valid BCP 47 specification
   * compliant value. For example, en for English or en-US for the US version of
   * English.
   */
  language_code?: string;

  /**
   * The name of the track containing a human-readable description. This value must
   * be unique within each group of `text` or `audio` track types. The HLS manifest
   * will associate the `text` or `audio` track with this value. For example, set the
   * value to "English" for subtitles text track with `language_code` as en-US. If
   * this parameter is not included, Mux will auto-populate a value based on the
   * `language_code` value.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the track either when creating the
   * asset or track.
   */
  passthrough?: string;
}

export interface AssetGenerateSubtitlesParams {
  /**
   * Generate subtitle tracks using automatic speech recognition with this
   * configuration.
   */
  generated_subtitles: Array<AssetGeneratedSubtitleSettings>;
}

export interface AssetUpdateMP4SupportParams {
  /**
   * Specify what level of support for mp4 playback.
   *
   * - The `capped-1080p` option produces a single MP4 file, called
   *   `capped-1080p.mp4`, with the video resolution capped at 1080p. This option
   *   produces an `audio.m4a` file for an audio-only asset.
   * - The `audio-only` option produces a single M4A file, called `audio.m4a` for a
   *   video or an audio-only asset. MP4 generation will error when this option is
   *   specified for a video-only asset.
   * - The `audio-only,capped-1080p` option produces both the `audio.m4a` and
   *   `capped-1080p.mp4` files. Only the `capped-1080p.mp4` file is produced for a
   *   video-only asset, while only the `audio.m4a` file is produced for an
   *   audio-only asset.
   *
   * The `standard`(deprecated) option produces up to three MP4 files with different
   * levels of resolution (`high.mp4`, `medium.mp4`, `low.mp4`, or `audio.m4a` for an
   * audio-only asset).
   *
   * `none` will delete the MP4s from the asset in question.
   */
  mp4_support: 'standard' | 'none' | 'capped-1080p' | 'audio-only' | 'audio-only,capped-1080p';
}

export interface AssetUpdateMasterAccessParams {
  /**
   * Add or remove access to the master version of the video.
   */
  master_access: 'temporary' | 'none';
}

export interface AssetCreateStaticRenditionParams {
  resolution:
    | 'highest'
    | 'audio-only'
    | '2160p'
    | '1440p'
    | '1080p'
    | '720p'
    | '540p'
    | '480p'
    | '360p'
    | '270p';

  /**
   * Arbitrary user-supplied metadata set for the static rendition. Max 255
   * characters.
   */
  passthrough?: string;
}

export interface AssetGenerateShotsParams {}

export declare namespace Assets {
  export {
    type Asset as Asset,
    type AssetGeneratedSubtitleSettings as AssetGeneratedSubtitleSettings,
    type AssetMetadata as AssetMetadata,
    type AssetOptions as AssetOptions,
    type AssetProgress as AssetProgress,
    type AssetResponse as AssetResponse,
    type AssetShots as AssetShots,
    type CreateStaticRenditionRequest as CreateStaticRenditionRequest,
    type Directive as Directive,
    type InputInfo as InputInfo,
    type InputSettings as InputSettings,
    type StaticRendition as StaticRendition,
    type Track as Track,
    type AssetGenerateSubtitlesResponse as AssetGenerateSubtitlesResponse,
    type AssetRetrieveInputInfoResponse as AssetRetrieveInputInfoResponse,
    type AssetsCursorPage as AssetsCursorPage,
    type AssetCreateParams as AssetCreateParams,
    type AssetListParams as AssetListParams,
    type AssetUpdateParams as AssetUpdateParams,
    type AssetCreatePlaybackIdParams as AssetCreatePlaybackIdParams,
    type AssetCreateTrackParams as AssetCreateTrackParams,
    type AssetUpdateTrackParams as AssetUpdateTrackParams,
    type AssetGenerateSubtitlesParams as AssetGenerateSubtitlesParams,
    type AssetUpdateMP4SupportParams as AssetUpdateMP4SupportParams,
    type AssetUpdateMasterAccessParams as AssetUpdateMasterAccessParams,
    type AssetCreateStaticRenditionParams as AssetCreateStaticRenditionParams,
    type AssetGenerateShotsParams as AssetGenerateShotsParams,
  };
}
