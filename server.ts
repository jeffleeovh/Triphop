import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import tripHopHandler from './api/trip-hop.ts';
import twoHrForecastHandler from './api/two-hr-forecast.ts';
import psiHandler from './api/psi.ts';
import healthHandler from './api/health.ts';
import placesHandler from './api/places.ts';
import exchangeRatesHandler from './api/exchangerates.ts';
import foursquareHandler from './api/foursquare.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless API handlers in root /api/ folder
app.all('/api/foursquare/:fsq_place_id?', (req: Request, res: Response) => {
  return foursquareHandler(req, res);
});

app.all('/api/places/:fsq_place_id?', (req: Request, res: Response) => {
  return placesHandler(req, res);
});

app.all('/api/exchangerates', (req: Request, res: Response) => {
  return exchangeRatesHandler(req, res);
});

app.all('/api/two-hr-forecast', (req: Request, res: Response) => {
  return twoHrForecastHandler(req, res);
});

app.all('/api/psi', (req: Request, res: Response) => {
  return psiHandler(req, res);
});

app.all('/api/health', (req: Request, res: Response) => {
  return healthHandler(req, res);
});

app.all('/api/heath', (req: Request, res: Response) => {
  return healthHandler(req, res);
});

// Trip Hop unified handler and aliases
app.all('/api/trip-hop', (req: Request, res: Response) => {
  return tripHopHandler(req, res);
});

app.get('/api/weather', (req: Request, res: Response) => {
  return twoHrForecastHandler(req, res);
});

app.get('/api/restaurants', (req: Request, res: Response) => {
  req.query.type = 'foursquare';
  return tripHopHandler(req, res);
});

// Overall server status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    app: 'Trip Hop & Foursquare API Gateway',
    status: 'online',
    endpoints: {
      foursquare: '/api/foursquare?fsq_place_id={fsq_place_id}',
      places: '/api/places?fsq_place_id={fsq_place_id}',
      exchangeRates: '/api/exchangerates',
      twoHourForecast: '/api/two-hr-forecast',
      psi: '/api/psi',
      health: '/api/health',
      heath: '/api/heath',
      tripHop: '/api/trip-hop',
    },
    keyConfigured: {
      foursquareApiKey: Boolean(process.env.FOURSQUARE_API_KEY),
      masKeyId: Boolean(process.env.MAS_KEY_ID),
    },
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
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
    console.log(`[Trip Hop & Foursquare API Gateway] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
