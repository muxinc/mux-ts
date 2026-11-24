export const PLAYER_RESULT_KEY = 'com.mux/player';

export type PlayerPayload = {
  readonly media: PlayerMedia;
  readonly access: PlaybackAccess;
  readonly startSeconds: number;
};

export type PlayerMedia = {
  readonly playbackId: string;
  readonly assetId?: string | undefined;
  readonly title?: string | undefined;
  readonly durationSeconds?: number | undefined;
};

export type PlaybackAccess =
  | { readonly policy: 'public' }
  | { readonly policy: 'unverified' }
  | { readonly policy: 'signed'; readonly tokens: SignedTokens };

export type SignedTokens = {
  readonly playback: string;
  readonly thumbnail: string;
  readonly storyboard: string;
};

export type PlayerResultMeta = { readonly [PLAYER_RESULT_KEY]: PlayerPayload };

export type ParsedPlayerResult =
  | { readonly ok: true; readonly payload: PlayerPayload }
  | { readonly ok: false; readonly reason: 'tool-error'; readonly message: string }
  | { readonly ok: false; readonly reason: 'no-payload' };

export type RawToolResult = {
  readonly isError?: boolean | undefined;
  readonly content?: unknown;
  readonly _meta?: unknown;
};

export function toResultMeta(payload: PlayerPayload): PlayerResultMeta {
  return { [PLAYER_RESULT_KEY]: payload };
}

export function parsePlayerResult(result: RawToolResult): ParsedPlayerResult {
  if (result.isError) {
    return {
      ok: false,
      reason: 'tool-error',
      message: firstText(result.content) ?? 'The play_video tool failed.',
    };
  }
  const meta = asRecord(result._meta);
  const payload = meta ? parsePayload(meta[PLAYER_RESULT_KEY]) : undefined;
  return payload ? { ok: true, payload } : { ok: false, reason: 'no-payload' };
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
}

export function oneLine(text: string, max: number): string {
  const line = text.replace(/\s+/g, ' ').trim();
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}\u2026` : line;
}

export function describeMedia(media: PlayerMedia): string {
  const facts: string[] = [];
  if (media.assetId !== undefined) facts.push(`asset ${media.assetId}`);
  facts.push(`playback ID ${media.playbackId}`);
  if (media.durationSeconds !== undefined) facts.push(formatClock(media.durationSeconds));
  const title = media.title ? oneLine(media.title, 100) : '';
  const name = title ? quoteUntrusted(title) : 'Mux video';
  return `${name} (${facts.join(', ')})`;
}

const quoteUntrusted = (text: string): string => JSON.stringify(text);

export function publicWatchUrl(playbackId: string): string {
  return `https://player.mux.com/${encodeURIComponent(playbackId)}`;
}

function parsePayload(value: unknown): PlayerPayload | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const media = parseMedia(record['media']);
  const access = parseAccess(record['access']);
  const startSeconds = record['startSeconds'];
  if (!media || !access || !isNonNegativeNumber(startSeconds)) return undefined;
  return { media, access, startSeconds };
}

function parseMedia(value: unknown): PlayerMedia | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const playbackId = record['playbackId'];
  const assetId = record['assetId'];
  const title = record['title'];
  const durationSeconds = record['durationSeconds'];
  if (!isNonEmptyString(playbackId)) return undefined;
  return {
    playbackId,
    ...(isNonEmptyString(assetId) ? { assetId } : {}),
    ...(typeof title === 'string' ? { title } : {}),
    ...(isNonNegativeNumber(durationSeconds) ? { durationSeconds } : {}),
  };
}

function parseAccess(value: unknown): PlaybackAccess | undefined {
  const record = asRecord(value);
  const policy = record?.['policy'];
  if (policy === 'public') return { policy: 'public' };
  if (policy === 'unverified') return { policy: 'unverified' };
  if (policy !== 'signed') return undefined;
  const tokens = asRecord(record?.['tokens']);
  const playback = tokens?.['playback'];
  const thumbnail = tokens?.['thumbnail'];
  const storyboard = tokens?.['storyboard'];
  if (!isNonEmptyString(playback) || !isNonEmptyString(thumbnail) || !isNonEmptyString(storyboard)) {
    return undefined;
  }
  return { policy: 'signed', tokens: { playback, thumbnail, storyboard } };
}

function firstText(content: unknown): string | undefined {
  if (!Array.isArray(content)) return undefined;
  for (const block of content) {
    const record = asRecord(block);
    const text = record?.['text'];
    if (record?.['type'] === 'text' && isNonEmptyString(text)) return text;
  }
  return undefined;
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ?
      (value as Record<string, unknown>)
    : undefined;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
