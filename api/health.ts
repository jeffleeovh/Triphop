import type { Request, Response } from 'express';

/**
 * Serverless API handler: Health Check
 * Endpoint: GET /api/health (or /api/heath)
 */

export default function handler(req: Request, res: Response): void {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Trip Hop & MAS API Gateway',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      places: '/api/places?fsq_place_id={fsq_place_id}',
      exchangeRates: '/api/exchangerates',
      twoHourForecast: '/api/two-hr-forecast',
      psi: '/api/psi',
      tripHop: '/api/trip-hop',
    },
    credentialsStatus: {
      masKeyConfigured: Boolean(process.env.MAS_KEY_ID),
      foursquareConfigured: Boolean(process.env.FOURSQUARE_API_KEY),
    },
    sources: {
      masApiCatalogue: {
        places: 'https://places-api.foursquare.com/places/{fsq_place_id}',
        exchangeRates: 'https://eservices.mas.gov.sg/api/action/datastore/search.json',
        headerRequired: 'KeyID',
      },
      dataGovSg: {
        twoHrForecast: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
        psi: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
        authRequired: false,
      },
    },
  });
}
