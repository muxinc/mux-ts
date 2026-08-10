#!/usr/bin/env -S npm run tsn -T
import Mux from '@mux/ts';

// Reads MUX_TOKEN_ID and MUX_TOKEN_SECRET from the environment
const mux = new Mux();

async function main() {
  const asset = await mux.video.assets.create({
    inputs: [{ url: 'https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4' }],
    playback_policies: ['public'],
  });
  console.log(asset);

  const assets = [];
  for await (const asset of mux.video.assets.list()) {
    console.log(asset.id);
    assets.push(asset);
  }
  console.log(assets.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
