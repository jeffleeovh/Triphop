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
    service: 'Trip Hop API Gateway',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      twoHourForecast: '/api/two-hr-forecast',
      psi: '/api/psi',
      tripHop: '/api/trip-hop',
      health: '/api/health',
    },
    sources: {
      dataGovSg: {
        twoHrForecast: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
        psi: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
        authRequired: false,
      },
    },
  });
}
