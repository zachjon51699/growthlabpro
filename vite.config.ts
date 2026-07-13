import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import type { IncomingMessage, ServerResponse } from 'node:http';

const require = createRequire(import.meta.url);

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/**
 * Runs Netlify functions during `vite` / `npm run dev` so quiz submission
 * works locally without requiring `netlify dev`.
 */
function netlifyFunctionsDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      // Make GHL secrets available to the function the same way Netlify does.
      if (env.GHL_PRIVATE_INTEGRATION_TOKEN) {
        process.env.GHL_PRIVATE_INTEGRATION_TOKEN = env.GHL_PRIVATE_INTEGRATION_TOKEN;
      }
      if (env.GHL_LOCATION_ID) {
        process.env.GHL_LOCATION_ID = env.GHL_LOCATION_ID;
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        if (url !== '/.netlify/functions/submit-contractor-quiz') {
          next();
          return;
        }

        const sendJson = (statusCode: number, body: unknown) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(body));
        };

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.end('');
          return;
        }

        if (req.method !== 'POST') {
          sendJson(405, { success: false, error: 'Method not allowed.' });
          return;
        }

        try {
          // Local UI testing: if GHL secrets aren't in .env yet, still unlock the calendar.
          if (!process.env.GHL_PRIVATE_INTEGRATION_TOKEN || !process.env.GHL_LOCATION_ID) {
            console.warn(
              '[submit-contractor-quiz] Local Vite: GHL_PRIVATE_INTEGRATION_TOKEN / GHL_LOCATION_ID not set. Returning success so the calendar can open. Add them to .env for real CRM saves.',
            );
            const body = await readRequestBody(req as IncomingMessage);
            let parsed: Record<string, unknown> = {};
            try {
              parsed = JSON.parse(body || '{}');
            } catch {
              parsed = {};
            }
            console.info('[submit-contractor-quiz] Local quiz payload (CRM skipped)', {
              firstName: parsed.firstName ? '[set]' : '',
              phone: parsed.phone ? '[set]' : '',
              contractorType: parsed.contractorType,
              crewCount: parsed.crewCount,
              timeline: parsed.timeline,
              marketingBudget: parsed.marketingBudget,
              annualRevenue: parsed.annualRevenue,
            });
            sendJson(200, {
              success: true,
              contactId: 'local-dev',
              warnings: [
                'Local Vite mode: GoHighLevel save skipped (missing GHL_PRIVATE_INTEGRATION_TOKEN / GHL_LOCATION_ID). Calendar unlocked for testing.',
              ],
            });
            return;
          }

          // Clear require cache so function edits hot-reload during local work.
          const functionPath = require.resolve('./netlify/functions/submit-contractor-quiz.js');
          delete require.cache[functionPath];
          const { handler } = require('./netlify/functions/submit-contractor-quiz.js') as {
            handler: (event: {
              httpMethod: string;
              body: string;
              headers: Record<string, string | string[] | undefined>;
            }) => Promise<{ statusCode: number; headers?: Record<string, string>; body: string }>;
          };

          const body = await readRequestBody(req as IncomingMessage);
          const result = await handler({
            httpMethod: 'POST',
            body,
            headers: req.headers as Record<string, string | string[] | undefined>,
          });

          res.statusCode = result.statusCode || 200;
          if (result.headers) {
            for (const [key, value] of Object.entries(result.headers)) {
              res.setHeader(key, value);
            }
          } else {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(result.body || '');
        } catch (err) {
          console.error('[submit-contractor-quiz] Vite middleware error', err);
          sendJson(500, {
            success: false,
            error: 'We couldn’t save your information. Please try again.',
          });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), netlifyFunctionsDevPlugin(env)],
    server: {
      // Prefer 5173; fall back if another project already owns it.
      port: 5173,
      strictPort: false,
      watch: {
        // If saves don't refresh the browser, create `.env.local` with: VITE_DEV_POLL=1
        // (common on WSL, Docker, or iCloud/OneDrive project folders on macOS)
        usePolling: env.VITE_DEV_POLL === '1',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            lucide: ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ['lucide-react'],
    },
  };
});
