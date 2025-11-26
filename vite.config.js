// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const httpsConfig = (() => {
  try {
    const keyPath = resolve(__dirname, 'localhost-key.pem')
    const certPath = resolve(__dirname, 'localhost-cert.pem')
    if (existsSync(keyPath) && existsSync(certPath)) {
      return {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      }
    }
  } catch (e) {
    // ignore
  }
  return null
})()

export default defineConfig({
  plugins: [react(), cesium()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  // در Render هنگام build متغیر محیطی RENDER=true را خواهیم گذاشت
  base: process.env.RENDER ? '/' : './',
  server: httpsConfig ? { https: httpsConfig, host: '0.0.0.0' } : { host: '0.0.0.0' },
})

