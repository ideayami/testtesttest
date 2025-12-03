import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@systems': path.resolve(__dirname, './src/systems'),
      '@patterns': path.resolve(__dirname, './src/patterns'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: true,
  },
  base: './',
});
