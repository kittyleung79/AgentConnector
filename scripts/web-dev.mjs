// scripts/web-dev.mjs

import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = await createServer({
  root: path.resolve(__dirname, '../src/renderer'),
  plugins: [vue(), vueDevTools()],
  server: {
    port: 5173,
    open: true,
  },
});

await server.listen();
console.log('✅ Web-only DoesAIAgent is running at http://localhost:5173/');
