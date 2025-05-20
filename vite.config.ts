import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components/index"),
      "@utils": path.resolve(__dirname, "./src/utils/index"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
