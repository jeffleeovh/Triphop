import type { Request, Response } from 'express';

/**
 * Serverless API handler: MAS API Catalogue - Exchange Rates
 * Source: Monetary Authority of Singapore (MAS)
 * Endpoint: MAS Datastore Exchange Rates against SGD
 * Header: KeyID: <MAS_KEY_ID> (if configured)
 * No hardcoded API keys.
 */

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Use GET.',
    });
    return;
  }

  const masKeyId = process.env.MAS_KEY_ID;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;

  // Official MAS datastore endpoint for daily exchange rates
  const masUrl = `https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=132356c2-0731-419b-a0f5-566d5420364d&limit=${limit}&sort=end_of_day%20desc`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'TripHop-MAS-ExchangeRates/1.0',
  };

  // If user has provided MAS_KEY_ID, forward it in the KeyID header
  if (masKeyId && masKeyId.trim() !== '') {
    headers['KeyID'] = masKeyId.trim();
  }

  try {
    // 5-second timeout to handle MAS portal maintenance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(masUrl, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      res.status(response.status).json({
        status: 'error',
        source: 'Monetary Authority of Singapore (MAS)',
        message: `MAS API returned HTTP ${response.status}: ${response.statusText}`,
      });
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      res.status(503).json({
        status: 'error',
        source: 'Monetary Authority of Singapore (MAS)',
        message: 'MAS eServices portal is currently undergoing scheduled maintenance.',
      });
      return;
    }

    const json = await response.json();
    const records = json?.result?.records || [];

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      source: 'Monetary Authority of Singapore (MAS)',
      totalRecords: records.length,
      latestRates: records[0] || null,
      history: records,
    });
  } catch (err: any) {
    res.status(502).json({
      status: 'error',
      source: 'Monetary Authority of Singapore (MAS)',
      message: `Failed to connect to MAS exchange rates: ${err?.name === 'AbortError' ? 'Request timed out after 5s' : err?.message || 'Network error'}`,
    });
  }
}
