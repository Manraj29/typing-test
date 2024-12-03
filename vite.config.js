import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/typing-test/', // Set this to your repository name
  plugins: [react()],
});