import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const appBasePath = '/referral/help-center/';

export default defineConfig({
  base: appBasePath,
  plugins: [vue()],
  server: {
    fs: {
      // Allow the app to read markdown files from the shared repo-level docs directory.
      allow: [repoRoot],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
