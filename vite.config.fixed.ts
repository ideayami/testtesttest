import { defineConfig } from 'vite';
import path from 'path';

// GitHub Pagesのリポジトリ名を設定
// 例: https://username.github.io/repo-name/ の場合、base: '/repo-name/'
// 例: https://username.github.io/ の場合、base: '/'
const REPO_NAME = process.env.REPO_NAME || '/';

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
  // GitHub Pages用のbase設定
  // リポジトリ名に合わせて変更してください
  base: REPO_NAME,
});
