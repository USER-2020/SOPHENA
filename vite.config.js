import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { brand } from './src/config/brand.js';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: `${projectRoot}/index.html`,
        es: `${projectRoot}/es/index.html`,
        en: `${projectRoot}/en/index.html`
      }
    }
  },
  server: {
    host: true,
    allowedHosts: ['.trycloudflare.com']
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icon.svg', 'favicon.svg'],
      manifest: {
        name: brand.name,
        short_name: brand.name,
        description: brand.description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        lang: 'es',
        background_color: brand.colors.dark.bg,
        theme_color: brand.colors.dark.surface,
        orientation: 'portrait-primary',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webmanifest}']
      },
      devOptions: {
        enabled: false
      }
    })
  ]
});
