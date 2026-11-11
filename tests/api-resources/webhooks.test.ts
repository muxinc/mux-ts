// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { createHmac } from 'node:crypto';

import Mux from '@mux/ts';

const client = new Mux({
  tokenId: 'my token id',
  tokenSecret: 'my secret',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource webhooks', () => {
  const sign = (body: string, secret: string, timestamp = Math.floor(Date.now() / 1000)) =>
    `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;

  test('unwrap', async () => {
    const secret = 'secret';
    const payload =
      '{"id":"id","attempts":[{"id":"id","address":"address","created_at":"2022-01-01T00:00:00.000000Z","max_attempts":0,"response_body":"response_body","response_headers":{"foo":"string"},"response_status_code":0,"webhook_id":0}],"created_at":"2022-01-01T00:00:00.000000Z","data":{"id":"id","created_at":0,"encoding_tier":"smart","master_access":"temporary","max_resolution_tier":"1080p","progress":{"progress":-1,"state":"ingesting"},"status":"preparing","aspect_ratio":"aspect_ratio","directives":[{"id":"id"}],"duration":0,"errors":{"messages":["string"],"type":"type"},"generate_shots":true,"ingest_type":"on_demand_url","is_live":true,"live_stream_id":"live_stream_id","master":{"status":"ready","url":"url"},"max_stored_frame_rate":0,"max_stored_resolution":"Audio only","meta":{"creator_id":"creator_id","external_id":"external_id","title":"title"},"mp4_support":"standard","non_standard_input_reasons":{"audio_codec":"audio_codec","audio_edit_list":"non-standard","pixel_aspect_ratio":"pixel_aspect_ratio","unexpected_media_file_parameters":"non-standard","unexpected_video_parameters":"unexpected_video_parameters","unsupported_pixel_format":"unsupported_pixel_format","video_bitrate":"high","video_codec":"video_codec","video_edit_list":"non-standard","video_frame_rate":"video_frame_rate","video_gop_size":"high","video_resolution":"video_resolution"},"normalize_audio":true,"passthrough":"passthrough","playback_ids":[{"id":"id","policy":"public","drm_configuration_id":"drm_configuration_id"}],"recording_times":[{"duration":0,"started_at":{"seconds":0,"nanos":0},"type":"content"}],"resolution_tier":"audio-only","shots":{"created_at":0,"status":"pending","errors":{"messages":["string"],"type":"type"},"shots_manifest_url":"shots_manifest_url"},"source_asset_id":"source_asset_id","static_renditions":{"files":[{"id":"id","bitrate":0,"ext":"mp4","filesize":0,"height":0,"name":"low.mp4","passthrough":"passthrough","resolution":"highest","resolution_tier":"2160p","status":"ready","type":"standard","width":0}],"status":"ready"},"test":true,"thumbnail_time":0,"tracks":[{"id":"id","auto_language_confidence":0,"closed_captions":true,"duration":0,"error":{"messages":["string"],"type":"type"},"language_code":"language_code","max_channels":0,"max_frame_rate":0,"max_height":0,"max_width":0,"name":"name","passthrough":"passthrough","primary":true,"status":"preparing","text_source":"uploaded","text_type":"subtitles","type":"video"}],"upload_id":"upload_id","video_quality":"basic"},"environment":{"id":"id","name":"name"},"object":{"id":"id","type":"type"},"type":"video.asset.created"}';
    const headers = { 'mux-signature': sign(payload, secret) };
    const bytes = new TextEncoder().encode(payload);

    await expect(client.webhooks.unwrap(payload, headers, secret)).resolves.toEqual(JSON.parse(payload));
    await expect(client.webhooks.unwrap(bytes, headers, secret)).resolves.toEqual(JSON.parse(payload));
    await expect(client.webhooks.unwrap(bytes.buffer as ArrayBuffer, headers, secret)).resolves.toEqual(
      JSON.parse(payload),
    );
    await expect(
      client.withOptions({ webhookSecret: secret }).webhooks.unwrap(payload, headers),
    ).resolves.toEqual(JSON.parse(payload));
    await expect(client.webhooks.unwrap(payload, headers, 'wrong')).rejects.toThrow(
      'No signatures found matching the expected signature for payload.',
    );
    await expect(client.webhooks.unwrap(JSON.parse(payload), headers, secret)).rejects.toThrow(
      'Webhook body must be the raw request body',
    );
    await expect(
      client.withOptions({ webhookSecret: null }).webhooks.unwrap(payload, headers),
    ).rejects.toThrow(
      "The webhook secret must either be set using the env var, MUX_WEBHOOK_SECRET, on the client class, Mux({ webhookSecret: '123' }), or passed to this function",
    );
  });

  // Shared with every Mux SDK generator; see stlc packages/mux-conformance/cases.json.
  test.each([
    {
      name: 'valid',
      header: 't={t},v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'accept',
    },
    {
      name: 'header name in any case',
      header: 't={t},v1={sig}',
      headerName: 'Mux-Signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'accept',
    },
    {
      name: 'one of several v1 values matches',
      header: 't={t},v1=00ff,v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'accept',
    },
    {
      name: 'inside the 300 s tolerance',
      header: 't={t},v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 290,
      expected: 'accept',
    },
    {
      name: 'wrong secret',
      header: 't={t},v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'not-the-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
    {
      name: 'tampered body',
      header: 't={t},v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.errored","id":"evt-conformance","data":{"id":"asset-conformance","status":"errored"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
    {
      name: 'older than 300 s',
      header: 't={t},v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 301,
      expected: 'reject',
    },
    {
      name: 'no v1 signature',
      header: 't={t}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
    {
      name: 'no timestamp',
      header: 'v1={sig}',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
    {
      name: 'no header',
      header: null,
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
    {
      name: 'malformed header',
      header: 'garbage',
      headerName: 'mux-signature',
      signSecret: 'conformance-webhook-secret',
      verifyBody:
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}',
      ageSeconds: 0,
      expected: 'reject',
    },
  ])(
    'verifySignature conformance: $name',
    async ({ header, headerName, signSecret, verifyBody, ageSeconds, expected }) => {
      const body =
        '{"type":"video.asset.ready","id":"evt-conformance","data":{"id":"asset-conformance","status":"ready"}}';
      const timestamp = Math.floor(Date.now() / 1000) - ageSeconds;
      const signature = createHmac('sha256', signSecret).update(`${timestamp}.${body}`).digest('hex');
      const headers: Record<string, string> =
        header === null ?
          {}
        : { [headerName]: header.replace(/\{t\}/g, String(timestamp)).replace(/\{sig\}/g, signature) };

      const result = client.webhooks.verifySignature(verifyBody, headers, 'conformance-webhook-secret');
      if (expected === 'accept') {
        await expect(result).resolves.toBeUndefined();
      } else {
        await expect(result).rejects.toThrow();
      }
    },
  );
});
