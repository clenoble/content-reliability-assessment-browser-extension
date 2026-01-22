import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        sidepanel: resolve(__dirname, 'public/sidepanel.html'),
        options: resolve(__dirname, 'public/options.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep HTML files at root of dist/
          if (assetInfo.name?.endsWith('.html')) {
            return '[name][extname]';
          }
          // Keep other assets in assets/ folder
          return 'assets/[name][extname]';
        },
      },
    },
    copyPublicDir: true,
  },
  publicDir: 'public',
});
