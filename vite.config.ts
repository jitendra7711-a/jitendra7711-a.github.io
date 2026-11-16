import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  // Relative assets support both account Pages and repository Pages URLs.
  base: './',
  build: { target: 'es2022' },
});
