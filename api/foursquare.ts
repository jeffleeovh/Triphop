import type { Request, Response } from 'express';

/**
 * Serverless API handler: Foursquare API Catalogue - Place Details
 * Endpoint: GET https://places-api.foursquare.com/places/{fsq_place_id}
 * Header: KeyID: <FOURSQUARE_API_KEY>
 * No hardcoded API keys. Reads FOURSQUARE_API_KEY from process.env.
 */

export default async function handler(req: Request, res: Response): Promise<void> {
  // Enforce GET method
  if (req.method && req.method !== 'GET') {
    res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Use GET.',
    });
    return;
  }

  // Read key strictly from environment variables (never hardcoded)
  const apiKey = process.env.FOURSQUARE_API_KEY || process.env.MAS_KEY_ID;

  if (!apiKey || apiKey.trim() === '') {
    res.status(503).json({
      status: 'error',
      code: 'key not configured',
      message: 'FOURSQUARE_API_KEY is not configured in process.env (503 key not configured). Please manually set FOURSQUARE_API_KEY in your environment variables.',
    });
    return;
  }

  // Extract fsq_place_id from route param or query string
  const fsqPlaceId = (req.params?.fsq_place_id as string) || (req.query?.fsq_place_id as string) || (req.query?.id as string);

  if (!fsqPlaceId || fsqPlaceId.trim() === '') {
    res.status(400).json({
      status: 'error',
      message: 'Missing required parameter: fsq_place_id. Example: /api/foursquare?fsq_place_id=4f323e5919d380e4e207644d or /api/foursquare/4f323e5919d380e4e207644d',
    });
    return;
  }

  const endpointUrl = `https://places-api.foursquare.com/places/${encodeURIComponent(fsqPlaceId.trim())}`;

  try {
    const upstreamRes = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'KeyID': apiKey.trim(),
        'Authorization': apiKey.trim(),
        'Accept': 'application/json',
        'User-Agent': 'TripHop-Foursquare-Client/1.0',
      },
    });

    if (!upstreamRes.ok) {
      res.status(upstreamRes.status).json({
        status: 'error',
        source: 'Foursquare API Catalogue',
        message: `Foursquare API responded with HTTP ${upstreamRes.status}: ${upstreamRes.statusText}`,
      });
      return;
    }

    const data = await upstreamRes.json();

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      source: 'Foursquare API Catalogue',
      fsq_place_id: fsqPlaceId,
      data,
    });
  } catch (err: any) {
    res.status(502).json({
      status: 'error',
      source: 'Foursquare API Catalogue',
      message: `Failed to connect to Foursquare places API: ${err?.message || 'Network error'}`,
    });
  }
}
