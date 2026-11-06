import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repository under a path; Codespaces still runs at /.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/raw-selfie-prompt-engine/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Private Codespaces URLs use this domain; no blanket allowedHosts setting.
    allowedHosts: ['.app.github.dev'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: { host: '0.0.0.0' },
});
