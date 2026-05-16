import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// A simple Vite plugin to mock Cloudflare Pages functions in dev mode
const cloudflarePagesMockPlugin = () => ({
  name: 'cloudflare-pages-mock',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        try {
          // Dynamically import the edge function (bypassing require cache to allow changes)
          const { onRequestPost } = await server.ssrLoadModule('/functions/api/chat.ts');
          
          // Read the raw body
          const body = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on('data', (chunk: Buffer) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
          });

          // Mock the Fetch API Request object
          const mockRequest = new Request(`http://${req.headers.host}${req.url}`, {
            method: 'POST',
            headers: req.headers as any,
            body: body.length > 0 ? body : undefined,
          });

          // Execute the function
          const mockResponse = await onRequestPost({
            request: mockRequest,
            env: {
              DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
            },
          });

          // Send the mock response back
          res.statusCode = mockResponse.status;
          mockResponse.headers.forEach((value: string, key: string) => {
            res.setHeader(key, value);
          });
          const text = await mockResponse.text();
          res.end(text);
          return;
        } catch (error) {
          console.error('Error executing edge function:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(error) }));
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), cloudflarePagesMockPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
