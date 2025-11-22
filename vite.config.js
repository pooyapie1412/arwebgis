import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
});
