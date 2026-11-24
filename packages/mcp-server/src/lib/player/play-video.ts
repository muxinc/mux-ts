import { APIError, type Mux } from '@mux/ts';
import type { PlaybackPolicy } from '@mux/ts/resources/shared';
import { asErrorResult, type HandlerFunction, type ToolCallResult } from '../../types';
import {
  describeMedia,
  formatClock,
  publicWatchUrl,
  toResultMeta,
  type PlaybackAccess,
  type PlayerMedia,
  type PlayerPayload,
  type PlayerResultMeta,
  type SignedTokens,
} from './contract';
import { PLAYER_HTML } from './player-html';
import { withUi, type McpAppTool } from './ui-resource';

const SIGNED_PLAYBACK_TTL = '6h';

type PlaybackId = string & { readonly __brand: 'PlaybackId' };

type PlayTarget =
  | { readonly kind: 'asset'; readonly assetId: string }
  | { readonly kind: 'playback'; readonly playbackId: PlaybackId };

type PlayRequest = { readonly target: PlayTarget; readonly startSeconds: number };

type Located = {
  readonly media: PlayerMedia & { readonly playbackId: PlaybackId };
  readonly policy: PlaybackPolicy | 'unverified';
};

class PlayVideoError extends Error {}

type PlayVideoResult = ToolCallResult & { _meta: PlayerResultMeta };

const INPUT_PROPERTIES = {
  asset_id: {
    type: 'string',
    description: 'Mux asset ID. Needs Mux API credentials to look up its playback ID.',
  },
  playback_id: {
    type: 'string',
    description: 'Mux playback ID, the ID in a stream.mux.com URL.',
  },
  start_time: {
    type: 'number',
    minimum: 0,
    description: 'Position to start from, in seconds. Defaults to 0.',
  },
};
const ARGUMENT_NAMES = Object.keys(INPUT_PROPERTIES);
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

const DRM_MESSAGE =
  'This video uses DRM playback, which the in-chat player cannot play because MCP Apps hosts do not grant the ' +
  'encrypted-media permission. Use a video with a public or signed playback ID instead.';

export const playVideoTool: McpAppTool = withUi(
  {
    metadata: { resource: 'video.playback', operation: 'read', tags: ['player'] },
    tool: {
      name: 'play_video',
      title: 'Play Mux video',
      description:
        'Show a Mux video to the user in an inline player in the conversation. Pass exactly one of asset_id or ' +
        'playback_id; start_time is a position in seconds. Use this instead of printing stream URLs. The user ' +
        'presses play themselves, and on clients that support it the player reports what is playing and where ' +
        'they paused. To change the position, call play_video again with a new start_time. Public playback IDs ' +
        'play without Mux API credentials. asset_id needs MUX_TOKEN_ID and MUX_TOKEN_SECRET, and signed videos ' +
        'also need MUX_SIGNING_KEY and MUX_PRIVATE_KEY. DRM-protected videos are not supported.',
      inputSchema: {
        type: 'object',
        properties: INPUT_PROPERTIES,
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
    },
    handler: playVideo,
  },
  {
    uri: 'ui://mux/player.html',
    name: 'Mux video player',
    html: PLAYER_HTML,
    csp: { connectDomains: ['https://*.mux.com'], resourceDomains: ['https://*.mux.com'] },
  },
);

async function playVideo({ reqContext, args }: Parameters<HandlerFunction>[0]): ReturnType<HandlerFunction> {
  try {
    const request = parsePlayRequest(args ?? {});
    const payload = await resolvePlayback(reqContext.client, request);
    const result: PlayVideoResult = {
      content: [{ type: 'text', text: describeResult(payload) }],
      _meta: toResultMeta(payload),
    };
    return result;
  } catch (error) {
    if (error instanceof PlayVideoError) return asErrorResult(error.message);
    throw error;
  }
}

function parsePlayRequest(args: Record<string, unknown>): PlayRequest {
  const unknownNames = Object.keys(args).filter((name) => !ARGUMENT_NAMES.includes(name));
  if (unknownNames.length > 0) {
    throw new PlayVideoError(
      `Unknown argument ${unknownNames.join(', ')}. The accepted arguments are ${ARGUMENT_NAMES.join(', ')}.`,
    );
  }

  const assetId = parseId(args, 'asset_id');
  const playbackId = parseId(args, 'playback_id');
  const startSeconds = parseStartTime(args['start_time']);

  if (assetId !== undefined && playbackId !== undefined) {
    throw new PlayVideoError('Pass exactly one of asset_id or playback_id, not both.');
  }
  if (assetId !== undefined) return { target: { kind: 'asset', assetId }, startSeconds };
  if (playbackId !== undefined) {
    return { target: { kind: 'playback', playbackId: asPlaybackId(playbackId) }, startSeconds };
  }
  throw new PlayVideoError('Pass exactly one of asset_id or playback_id. Neither was given.');
}

function parseId(args: Record<string, unknown>, name: 'asset_id' | 'playback_id'): string | undefined {
  const value = args[name];
  if (value === undefined || value === null) return undefined;
  const id = typeof value === 'string' ? value.trim() : '';
  if (!ID_PATTERN.test(id)) {
    throw new PlayVideoError(`${name} must be a bare Mux ID such as "a1B2c3", not a URL and not empty.`);
  }
  return id;
}

function parseStartTime(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new PlayVideoError('start_time must be a number of seconds, 0 or greater.');
  }
  return value;
}

function asPlaybackId(id: string): PlaybackId {
  return id as PlaybackId;
}

async function resolvePlayback(client: Mux, request: PlayRequest): Promise<PlayerPayload> {
  const { target } = request;
  const located =
    target.kind === 'asset' ?
      await locateAsset(client, target.assetId)
    : await locatePlayback(client, target.playbackId);
  return {
    media: located.media,
    access: await grantAccess(client, located),
    startSeconds: request.startSeconds,
  };
}

async function locatePlayback(client: Mux, playbackId: PlaybackId): Promise<Located> {
  if (!hasApiCredentials(client)) return unverifiedLocation(playbackId);
  try {
    const { policy, object } = await client.video.playbackIds.retrieve(playbackId);
    const assetId = object.type === 'asset' ? object.id : undefined;
    return { media: { playbackId, assetId }, policy };
  } catch (error) {
    if (error instanceof APIError) return unverifiedLocation(playbackId);
    throw error;
  }
}

const unverifiedLocation = (playbackId: PlaybackId): Located => ({
  media: { playbackId },
  policy: 'unverified',
});

async function locateAsset(client: Mux, assetId: string): Promise<Located> {
  if (!hasApiCredentials(client)) {
    throw new PlayVideoError(
      'Looking up an asset ID needs Mux API credentials. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET, or pass a ' +
        'playback_id instead.',
    );
  }

  const asset = await retrieveAsset(client, assetId);
  if (asset.status === 'preparing') {
    throw new PlayVideoError(`Asset ${asset.id} is still processing. Try again once its status is ready.`);
  }
  if (asset.status === 'errored') {
    const reason = asset.errors?.messages?.join(' ');
    throw new PlayVideoError(`Asset ${asset.id} failed to process${reason ? `: ${reason}` : '.'}`);
  }

  const playbackIds = asset.playback_ids ?? [];
  const chosen =
    playbackIds.find((candidate) => candidate.policy === 'public') ??
    playbackIds.find((candidate) => candidate.policy === 'signed');
  if (!chosen) {
    throw new PlayVideoError(
      playbackIds.length > 0 ?
        DRM_MESSAGE
      : `Asset ${asset.id} has no playback ID. Create a public or signed playback ID for it first.`,
    );
  }

  return {
    media: {
      playbackId: asPlaybackId(chosen.id),
      assetId: asset.id,
      title: asset.meta?.title,
      durationSeconds: asset.duration,
    },
    policy: chosen.policy,
  };
}

async function retrieveAsset(client: Mux, assetId: string) {
  try {
    return await client.video.assets.retrieve(assetId);
  } catch (error) {
    if (!(error instanceof APIError)) throw error;
    switch (error.status) {
      case 401:
        throw new PlayVideoError(
          'Mux rejected the API credentials. Check MUX_TOKEN_ID and MUX_TOKEN_SECRET.',
        );
      case 403:
        throw new PlayVideoError(
          'The Mux API credentials may not read assets. Use an access token with Mux Video read permission.',
        );
      case 404:
        throw new PlayVideoError(
          `No asset ${assetId} exists in this Mux environment. Check the ID, and that the credentials belong ` +
            'to the environment that holds it.',
        );
      default:
        throw new PlayVideoError(`The Mux API request for asset ${assetId} failed: ${error.message}`);
    }
  }
}

async function grantAccess(client: Mux, { media, policy }: Located): Promise<PlaybackAccess> {
  switch (policy) {
    case 'public':
      return { policy: 'public' };
    case 'unverified':
      return { policy: 'unverified' };
    case 'drm':
      throw new PlayVideoError(DRM_MESSAGE);
    case 'signed':
      return { policy: 'signed', tokens: await signTokens(client, media.playbackId) };
  }
}

async function signTokens(client: Mux, playbackId: PlaybackId): Promise<SignedTokens> {
  if (!client.jwtSigningKey || !client.jwtPrivateKey) {
    throw new PlayVideoError(
      `Playback ID ${playbackId} is signed, so the player needs signed tokens. Set MUX_SIGNING_KEY and ` +
        'MUX_PRIVATE_KEY (the ID and private key of a Mux signing key) and try again.',
    );
  }

  const sign = (type: 'video' | 'thumbnail' | 'storyboard') =>
    client.jwt.signPlaybackId(playbackId, { type, expiration: SIGNED_PLAYBACK_TTL });
  try {
    const [playback, thumbnail, storyboard] = await Promise.all([
      sign('video'),
      sign('thumbnail'),
      sign('storyboard'),
    ]);
    return { playback, thumbnail, storyboard };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new PlayVideoError(
      `Could not sign tokens for playback ID ${playbackId}: ${reason} Check MUX_SIGNING_KEY and MUX_PRIVATE_KEY.`,
    );
  }
}

function hasApiCredentials(client: Mux): boolean {
  return Boolean((client.tokenId && client.tokenSecret) || client.authorizationToken);
}

function describeResult({ media, access, startSeconds }: PlayerPayload): string {
  const start = startSeconds > 0 ? `, starting at ${formatClock(startSeconds)}` : '';
  const showing = `Showing ${describeMedia(media)} in an inline player${start}.`;
  const watchUrl = publicWatchUrl(media.playbackId);
  switch (access.policy) {
    case 'public':
      return `${showing} If the player does not render, the user can watch at ${watchUrl}.`;
    case 'unverified':
      return (
        `${showing} Its access policy could not be checked with the Mux API, so it is played as public. If ` +
        `playback fails, the ID may be signed or belong to another Mux environment. If the player does not ` +
        `render, the user can try ${watchUrl}.`
      );
    case 'signed':
      return `${showing} This video uses signed playback, so it has no shareable link.`;
  }
}
