import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Use VITE_BASE env var so GitHub Pages builds can set the repo subpath
// (e.g. "/Nexus.github.io/") while Lovable preview & root-domain hosting
// keep working with the default "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: {
    outDir: 'dist'
  }
})
