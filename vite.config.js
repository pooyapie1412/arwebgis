import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  server: {
    https: {
      key: readFileSync(resolve(__dirname, 'localhost-key.pem')),
      cert: readFileSync(resolve(__dirname, 'localhost-cert.pem')),
    },
    host: '0.0.0.0', // برای دسترسی از IP محلی مثل 172.25.208.1
  },
})
