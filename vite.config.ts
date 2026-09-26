import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every build (production and preview) to the
// production domain, custom domain included, so canonical and share links always name it.
const SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'localhost:5173'}`;

function siteUrl(): Plugin {
  return {
    name: 'site-url',
    // 'pre' so the URL is in place before Vite parses hrefs (it rejects '%SI' as bad percent-encoding).
    transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL) },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
</urlset>
`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteUrl()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
});
