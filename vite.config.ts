import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages のサブディレクトリデプロイに対応するため相対パスを使用
  base: './',
});
