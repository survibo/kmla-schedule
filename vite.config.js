import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function serviceWorkerVersionPlugin(buildId) {
  return {
    name: 'service-worker-version',
    apply: 'build',
    closeBundle() {
      const swPath = resolve('dist', 'sw.js')
      const swSource = readFileSync(swPath, 'utf8')
      writeFileSync(swPath, swSource.replaceAll('__BUILD_ID__', buildId))
    },
  }
}

const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)

export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    react(),
    tailwindcss(),
    serviceWorkerVersionPlugin(buildId),
  ],
})
