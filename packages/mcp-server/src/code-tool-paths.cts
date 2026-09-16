// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import path from 'node:path';

export function getWorkerPath(): string {
  return require.resolve('./code-tool-worker.mjs');
}

// The native binary the `deno` package's postinstall places beside its wrapper. Resolved
// from this package's context rather than by path (dist/ is flattened to the package root
// at publish), and never the wrapper itself: bin.cjs is a Node script, which exists even
// when the platform binary failed to install and cannot be spawned as an executable on
// Windows. Callers check the returned path exists before using it.
export function getBundledDenoPath(): string | null {
  try {
    const dir = path.dirname(require.resolve('deno/bin.cjs'));
    return path.join(dir, process.platform === 'win32' ? 'deno.exe' : 'deno');
  } catch {
    return null;
  }
}
