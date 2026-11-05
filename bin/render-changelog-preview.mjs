#!/usr/bin/env node
// Prints the promote-preview changelog using release-please's own parser and writer.
// Usage: RP_PREFIX=<npm prefix with release-please installed> node bin/render-changelog-preview.mjs [range] [config-ref]
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(`${process.env.RP_PREFIX}/`);
const { parseConventionalCommits } = require('release-please/build/src/commit');
const { DefaultChangelogNotes } = require('release-please/build/src/changelog-notes/default');
const rpVersion = require('release-please/package.json').version;

const [range = 'origin/production-mirror..origin/main', configRef = 'origin/main'] = process.argv.slice(2);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 26 });
const [owner, repository] = process.env.GITHUB_REPOSITORY.split('/');

const sections = JSON.parse(git('show', `${configRef}:release-please-config.json`))['changelog-sections'];
const hidden = sections.filter((s) => s.hidden).map((s) => s.type);
const shownTypes = new Set(sections.filter((s) => !s.hidden).map((s) => s.type));

const commits = git('log', '-z', '--format=%H%n%B', range)
  .split('\0')
  .filter(Boolean)
  .map((rec) => ({ sha: rec.slice(0, 40), message: rec.slice(41) }));
const parsed = parseConventionalCommits(commits);
const notes = await new DefaultChangelogNotes().buildNotes(parsed, {
  owner,
  repository,
  version: 'next',
  currentTag: 'main',
  targetBranch: 'main',
  changelogSections: sections,
  commits: parsed,
});
// Drop the version header; the PR body has its own.
const lines = notes.split('\n').filter((l) => !l.startsWith('## '));

// Same text twice in one section prints twice in the release changelog.
const counts = new Map();
let section = '';
for (const line of lines) {
  if (line.startsWith('### ')) section = line;
  if (!line.startsWith('* ')) continue;
  const key = `${section}\n${line.replace(/ \(\[[0-9a-f]{7,}\]\([^)]*\)\)$/, '')}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}
const dupes = [...counts].filter(([, n]) => n > 1).map(([key]) => key.split('\n')[1]);

const shownShas = new Set(parsed.filter((c) => shownTypes.has(c.type) || c.breaking).map((c) => c.sha));
const out = [];
if (dupes.length) {
  out.push(
    "> [!WARNING]\n> Repeated entries: each prints more than once in the release changelog. Remove the extras from the release PR's CHANGELOG.md before merging it:",
    dupes.map((d) => `> ${d}`).join('\n'),
    '',
  );
}
out.push(lines.join('\n').trim() || '_No changelog entries pending._', '');
const leftOut = commits.length - shownShas.size;
const hiddenTypes = hidden.join(', ');
out.push(
  `_${leftOut} commit(s) left out (hidden types: ${hiddenTypes}; other types; non-conventional subjects). Rendered by release-please ${rpVersion}; the release PR is the changelog of record._`,
);
process.stdout.write(out.join('\n'));
