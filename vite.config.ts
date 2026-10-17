import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveSiteConfig } from './scripts/site-config'

const site = resolveSiteConfig()

export default defineConfig({
  plugins: [react()],
  define: { __SITE_ORIGIN__: JSON.stringify(site.origin), __SITE_INDEXABLE__: JSON.stringify(site.indexable) },
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false },
})
