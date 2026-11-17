import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCustomUiDesign, type CustomDesignRequest } from './server/aiDesign.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '15mb' }));

  app.post('/api/ai/design', async (req: Request, res: Response) => {
    try {
      const result = await generateCustomUiDesign((req.body ?? {}) as CustomDesignRequest);
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error & { statusCode?: number; status?: number };
      const status = err.statusCode || err.status || 500;
      res.status(status >= 400 && status < 600 ? status : 500).json({
        error: err.message || 'Failed to generate custom design.',
      });
    }
  });

  // Ensure any unknown /api/* route returns JSON instead of HTML fallback
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API route not found.' });
  });

  // Always return JSON errors for Express middleware issues (e.g. body too large or invalid JSON)
  app.use((err: Error & { status?: number; type?: string }, req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      const status = err.status || (err.type === 'entity.too.large' ? 413 : 400);
      res.status(status).json({
        error:
          err.type === 'entity.too.large'
            ? 'Uploaded image is too large. Please try a smaller screenshot.'
            : err.message || 'Request failed.',
      });
      return;
    }
    next(err);
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Looma server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Looma server:', err);
  process.exit(1);
});
