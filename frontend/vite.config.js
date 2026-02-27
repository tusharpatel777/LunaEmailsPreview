import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the Email Preview frontend.
 *
 * Proxy setup: Forwards /api requests to the Express backend during
 * development so CORS issues are avoided. In production, configure
 * your web server (nginx, etc.) to do the same.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
