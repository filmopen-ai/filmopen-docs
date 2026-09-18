import { defineConfig } from 'vitest/config';

/**
 * Plain Node: what is tested is what runs before the site does — the
 * importer's refusals, the manifest, the placement, the configuration — and
 * the built site's files, which `npm test` builds first (`pretest`).
 *
 * One file at a time: the importer's tests run it against scratch
 * repositories, and the deploy wrapper's plant a competing configuration in
 * this one to see it refused.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
