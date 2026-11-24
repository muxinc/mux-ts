import '@videojs/html/video/player';
import '@videojs/html/video/skin';
import '@videojs/html/media/mux-video';

import { App, applyDocumentTheme } from '@modelcontextprotocol/ext-apps/app-with-deps';
import type { VideoPlayerElement } from '@videojs/html/video';
import { parsePlayerResult, publicWatchUrl } from '../../src/lib/player/contract';
import {
  initialState,
  modelContextText,
  reduce,
  type Effect,
  type Failure,
  type MediaSnapshot,
  type PlayerEvent,
  type PlayerState,
} from './machine';

const CONTEXT_DEBOUNCE_MS = 400;

function required<T extends Element>(element: T | null, selector: string): T {
  if (!element) throw new Error(`player-ui: ${selector} is missing from index.html`);
  return element;
}

const root = required(document.querySelector<HTMLElement>('#root'), '#root');
const overlay = required(document.querySelector<HTMLElement>('#overlay'), '#overlay');
const status = required(document.querySelector<HTMLElement>('#status'), '#status');
const expandButton = required(document.querySelector<HTMLButtonElement>('#expand'), '#expand');
const openLinkButton = required(document.querySelector<HTMLButtonElement>('#open-link'), '#open-link');
const player = required(document.querySelector<VideoPlayerElement>('video-player'), 'video-player');
const video = required(document.querySelector('mux-video'), 'mux-video');

const app = new App(
  { name: 'mux-player', version: '1.0.0' },
  { availableDisplayModes: ['inline', 'fullscreen'] },
);

let state: PlayerState = initialState;
let connectError: string | undefined;

function dispatch(event: PlayerEvent): void {
  const next = reduce(state, event);
  state = next.state;
  for (const effect of next.effects) apply(effect);
  render();
  scheduleContextUpdate();
}

function apply(effect: Effect): void {
  if (effect.type === 'load') {
    video.source = effect.source;
  } else {
    player.store.seek(effect.seconds).catch(() => undefined);
  }
}

function mediaSnapshot(): MediaSnapshot {
  const { canPlay, paused, ended, currentTime, duration, error } = player.store;
  return {
    canPlay,
    paused,
    ended,
    currentTime,
    duration,
    error: error && { code: error.code, message: error.message },
  };
}

/** A media error is left to the skin, which shows its own dialog for it. */
function failureMessage(failure: Failure): string | undefined {
  switch (failure.kind) {
    case 'tool-error':
      return failure.message;
    case 'no-payload':
      return 'The chat client did not pass this player a video to play.';
    case 'cancelled':
      return 'Playback was cancelled.';
    case 'host-blocks-media':
      return failure.payload.access.policy === 'signed' ?
          'This chat client does not let the player stream video, and this video needs a signed link that cannot be opened elsewhere.'
        : 'This chat client does not let the player stream video.';
    case 'media':
      return undefined;
  }
}

function setText(element: HTMLElement, text: string): void {
  if (element.textContent !== text) element.textContent = text;
}

function setHidden(element: HTMLElement, hidden: boolean): void {
  if (element.hidden !== hidden) element.hidden = hidden;
}

function render(): void {
  const context = app.getHostContext();
  if (root.dataset['phase'] !== state.phase) root.dataset['phase'] = state.phase;

  const message =
    connectError ??
    (state.phase === 'waiting' ? 'Waiting for the video…'
    : state.phase === 'failed' ? failureMessage(state.failure)
    : undefined);
  setHidden(overlay, message === undefined);
  setText(status, message ?? '');

  const blocked =
    state.phase === 'failed' && state.failure.kind === 'host-blocks-media' ? state.failure : undefined;
  setHidden(
    openLinkButton,
    !(blocked && blocked.payload.access.policy !== 'signed' && app.getHostCapabilities()?.openLinks),
  );

  // Video.js fullscreen is 'unsupported' when the host iframe lacks allow="fullscreen"; the host's own display mode
  // is the only way to enlarge the player then.
  const hostModes = context?.availableDisplayModes ?? [];
  const hasMedia = state.phase !== 'waiting' && state.phase !== 'failed';
  setHidden(
    expandButton,
    !(hasMedia && player.store.fullscreenAvailability === 'unsupported' && hostModes.includes('fullscreen')),
  );
  setText(expandButton, context?.displayMode === 'fullscreen' ? 'Collapse' : 'Expand');
}

function applyDisplayMode(mode: string | undefined): void {
  document.documentElement.dataset['displayMode'] = mode ?? 'inline';
}

function applyHostContext(): void {
  const context = app.getHostContext();
  applyDisplayMode(context?.displayMode);
  // Chrome paints an opaque backdrop behind an iframe whose color-scheme differs from its host frame's, and it shows
  // around the player's rounded corners.
  if (context?.theme) applyDocumentTheme(context.theme);
  render();
}

let contextTimer: ReturnType<typeof setTimeout> | undefined;
let latestText: string | undefined;
let sentText: string | undefined;

function scheduleContextUpdate(): void {
  const text = modelContextText(state);
  if (text === latestText) return;
  latestText = text;
  clearTimeout(contextTimer);
  contextTimer = setTimeout(sendContext, CONTEXT_DEBOUNCE_MS);
}

function sendContext(): void {
  if (latestText === undefined || latestText === sentText) return;
  if (!app.getHostCapabilities()?.updateModelContext) return;
  sentText = latestText;
  app.updateModelContext({ content: [{ type: 'text', text: latestText }] }).catch(() => undefined);
}

player.store.subscribe(() => dispatch({ type: 'media', media: mediaSnapshot() }));

// Only a blob: media-src violation matters: hls.js plays through a MediaSource blob URL, which a strict host CSP
// forbids. A worker-src violation is ignored because hls.js falls back to the main thread.
document.addEventListener('securitypolicyviolation', (event) => {
  if (event.effectiveDirective === 'media-src' && event.blockedURI.startsWith('blob')) {
    dispatch({ type: 'host-blocked-media' });
  }
});

expandButton.addEventListener('click', () => {
  const mode = app.getHostContext()?.displayMode === 'fullscreen' ? 'inline' : 'fullscreen';
  app
    .requestDisplayMode({ mode })
    .then((result) => {
      applyDisplayMode(result.mode);
      render();
    })
    .catch(() => undefined);
});

openLinkButton.addEventListener('click', () => {
  if (state.phase !== 'failed' || state.failure.kind !== 'host-blocks-media') return;
  app.openLink({ url: publicWatchUrl(state.failure.payload.media.playbackId) }).catch(() => undefined);
});

app.addEventListener('toolresult', (result) =>
  dispatch({ type: 'result', result: parsePlayerResult(result) }),
);
app.addEventListener('toolcancelled', ({ reason }) => dispatch({ type: 'cancelled', reason }));
app.addEventListener('hostcontextchanged', () => {
  applyHostContext();
});

app
  .connect()
  .then(() => {
    applyHostContext();
  })
  .catch((error: unknown) => {
    connectError = `Could not connect to the chat client: ${
      error instanceof Error ? error.message : String(error)
    }`;
    render();
  });
