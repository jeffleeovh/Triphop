import type { Request, Response } from 'express';

/**
 * Serverless API handler: Real-Time Pollutant Standards Index (PSI) & Air Quality
 * Source: Data.gov.sg (Public API - No API key required)
 * Endpoint: GET https://api-open.data.gov.sg/v2/real-time/api/psi
 */

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Use GET.',
    });
    return;
  }

  try {
    const response = await fetch('https://api-open.data.gov.sg/v2/real-time/api/psi', {
      headers: {
        'User-Agent': 'TripHop-DataGovSG-Client/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        status: 'error',
        source: 'Data.gov.sg',
        message: `Data.gov.sg returned HTTP ${response.status}: ${response.statusText}`,
      });
      return;
    }

    const json = await response.json();

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      source: 'Data.gov.sg',
      endpoint: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
      data: json.data || json,
    });
  } catch (err: any) {
    res.status(502).json({
      status: 'error',
      source: 'Data.gov.sg',
      message: `Failed to fetch PSI air quality from Data.gov.sg: ${err?.message || 'Network error'}`,
    });
  }
}
