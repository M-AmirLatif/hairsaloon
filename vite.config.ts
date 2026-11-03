import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePluginSalonSeo } from './vite-plugin-salon-seo.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vitePluginSalonSeo(),
    tailwindcss(),
    react(),
  ],
});
