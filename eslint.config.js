import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * The website's rules, for the same reason: what is written here decides
 * what reaches a public site, so a path, a manifest or a configuration is
 * what it says it is, and the types are held to it.
 */
export default defineConfig([
  { ignores: ['dist/**', '.astro/**', '.wrangler/**', 'snapshot/files/**'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
]);
