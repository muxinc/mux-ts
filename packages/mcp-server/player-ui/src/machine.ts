import {
  describeMedia,
  formatClock,
  oneLine,
  publicWatchUrl,
  type ParsedPlayerResult,
  type PlayerMedia,
  type PlayerPayload,
} from '../../src/lib/player/contract';

export type Playhead = { readonly position: number; readonly duration: number | undefined };

export type Failure =
  | { readonly kind: 'tool-error'; readonly message: string }
  | { readonly kind: 'no-payload' }
  | { readonly kind: 'cancelled'; readonly reason: string | undefined }
  | { readonly kind: 'host-blocks-media'; readonly payload: PlayerPayload }
  | {
      readonly kind: 'media';
      readonly payload: PlayerPayload;
      readonly code: number;
      readonly message: string;
    };

export type PlayerState =
  | { readonly phase: 'waiting' }
  | { readonly phase: 'loading'; readonly payload: PlayerPayload }
  | {
      readonly phase: 'ready' | 'playing' | 'paused' | 'ended';
      readonly payload: PlayerPayload;
      readonly playhead: Playhead;
      /** The store's `started` is also true after a seek. */
      readonly played: boolean;
    }
  | { readonly phase: 'failed'; readonly failure: Failure };

export type MediaSnapshot = {
  readonly canPlay: boolean;
  readonly paused: boolean;
  readonly ended: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly error: { readonly code: number; readonly message: string } | null;
};

export type PlayerEvent =
  | { readonly type: 'result'; readonly result: ParsedPlayerResult }
  | { readonly type: 'cancelled'; readonly reason: string | undefined }
  | { readonly type: 'media'; readonly media: MediaSnapshot }
  | { readonly type: 'host-blocked-media' };

export type StreamSource = {
  readonly playbackId: string;
  readonly playback?: { readonly token: string };
  readonly poster?: { readonly token: string };
  readonly storyboard?: { readonly token: string };
};

export type Effect =
  | { readonly type: 'load'; readonly source: StreamSource }
  | { readonly type: 'seek'; readonly seconds: number };

export type Transition = { readonly state: PlayerState; readonly effects: readonly Effect[] };

export const initialState: PlayerState = { phase: 'waiting' };

const stay = (state: PlayerState): Transition => ({ state, effects: [] });

const fail = (failure: Failure): Transition => ({ state: { phase: 'failed', failure }, effects: [] });

export function reduce(state: PlayerState, event: PlayerEvent): Transition {
  switch (event.type) {
    case 'result':
      return state.phase === 'waiting' ? onResult(event.result) : stay(state);
    case 'cancelled':
      return state.phase === 'waiting' ? fail({ kind: 'cancelled', reason: event.reason }) : stay(state);
    case 'media':
      return onMedia(state, event.media);
    case 'host-blocked-media':
      return state.phase === 'waiting' || state.phase === 'failed' ?
          stay(state)
        : fail({ kind: 'host-blocks-media', payload: state.payload });
  }
}

function onResult(result: ParsedPlayerResult): Transition {
  if (!result.ok) {
    return fail(
      result.reason === 'tool-error' ?
        { kind: 'tool-error', message: result.message }
      : { kind: 'no-payload' },
    );
  }
  return {
    state: { phase: 'loading', payload: result.payload },
    effects: [{ type: 'load', source: streamSource(result.payload) }],
  };
}

function onMedia(state: PlayerState, media: MediaSnapshot): Transition {
  if (state.phase === 'waiting' || state.phase === 'failed') return stay(state);
  const { payload } = state;
  if (media.error) {
    return fail({ kind: 'media', payload, code: media.error.code, message: media.error.message });
  }
  if (state.phase === 'loading' && !media.canPlay) return stay(state);

  const playhead: Playhead = {
    position: media.currentTime,
    duration: media.duration > 0 && Number.isFinite(media.duration) ? media.duration : undefined,
  };
  const played = !media.paused || (state.phase !== 'loading' && state.played);
  const phase =
    media.ended ? 'ended'
    : !media.paused ? 'playing'
    : played ? 'paused'
    : 'ready';
  const effects: readonly Effect[] =
    state.phase === 'loading' && payload.startSeconds > 0 ?
      [{ type: 'seek', seconds: payload.startSeconds }]
    : [];
  return { state: { phase, payload, playhead, played }, effects };
}

function streamSource({ media, access }: PlayerPayload): StreamSource {
  if (access.policy !== 'signed') return { playbackId: media.playbackId };
  const { playback, thumbnail, storyboard } = access.tokens;
  return {
    playbackId: media.playbackId,
    playback: { token: playback },
    poster: { token: thumbnail },
    storyboard: { token: storyboard },
  };
}

const PREFIX = 'Mux player in this chat:';

export function modelContextText(state: PlayerState): string | undefined {
  switch (state.phase) {
    case 'waiting':
      return undefined;
    case 'loading':
      return `${PREFIX} ${describeMedia(state.payload.media)} is loading.`;
    case 'ready':
      return `${PREFIX} ${describePlayed(state)} is loaded and has not been played yet.`;
    case 'playing':
      return `${PREFIX} ${describePlayed(state)} is playing.`;
    case 'paused':
      return `${PREFIX} ${describePlayed(state)} is paused at ${formatClock(state.playhead.position)}.`;
    case 'ended':
      return `${PREFIX} ${describePlayed(state)} has finished playing.`;
    case 'failed':
      return failureText(state.failure);
  }
}

const redactUrls = (text: string): string => text.replace(/https?:\/\/\S+/g, '<url>');

function failureText(failure: Failure): string | undefined {
  switch (failure.kind) {
    case 'tool-error':
    case 'cancelled':
      return undefined;
    case 'no-payload':
      return `${PREFIX} the video could not be shown because the chat client did not pass the player its playback details.`;
    case 'host-blocks-media': {
      const { media, access } = failure.payload;
      const alternative =
        access.policy === 'signed' ? '' : ` The user can watch it at ${publicWatchUrl(media.playbackId)}.`;
      return `${PREFIX} ${describeMedia(
        media,
      )} could not be played because this chat client does not let the player stream video.${alternative}`;
    }
    case 'media': {
      const message = oneLine(redactUrls(failure.message), 120);
      const detail = message ? `: ${message}` : '';
      return `${PREFIX} ${describeMedia(failure.payload.media)} failed to play (media error ${
        failure.code
      }${detail}).`;
    }
  }
}

function describePlayed(state: { readonly payload: PlayerPayload; readonly playhead: Playhead }): string {
  const media: PlayerMedia = {
    ...state.payload.media,
    durationSeconds: state.payload.media.durationSeconds ?? state.playhead.duration,
  };
  return describeMedia(media);
}
