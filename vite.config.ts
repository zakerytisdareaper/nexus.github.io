import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/Nexus.github.io/',
  build: {
    outDir: 'dist'
  }
})
