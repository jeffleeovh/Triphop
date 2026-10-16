import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import tripHopHandler from './api/trip-hop.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless handler route
app.all('/api/trip-hop', (req: Request, res: Response) => {
  return tripHopHandler(req, res);
});

// Friendly aliases
app.get('/api/weather', (req: Request, res: Response) => {
  req.query.type = 'weather';
  return tripHopHandler(req, res);
});

app.get('/api/foursquare', (req: Request, res: Response) => {
  req.query.type = 'foursquare';
  return tripHopHandler(req, res);
});

app.get('/api/restaurants', (req: Request, res: Response) => {
  req.query.type = 'foursquare';
  return tripHopHandler(req, res);
});

// App status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    app: 'Trip Hop',
    status: 'online',
    foursquareConfigured: Boolean(process.env.FOURSQUARE_API_KEY),
    weatherEndpoint: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trip Hop] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
