import type { Request, Response } from 'express';

/**
 * Serverless API handler: MAS API Catalogue - Foursquare Places
 * Endpoint: GET https://places-api.foursquare.com/places/{fsq_place_id}
 * Header: KeyID: <MAS_KEY_ID>
 * No hardcoded API keys. Reads MAS_KEY_ID from process.env.
 */

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Use GET.',
    });
    return;
  }

  // Read MAS_KEY_ID from process.env only (never hardcoded)
  const masKeyId = process.env.MAS_KEY_ID;

  if (!masKeyId || masKeyId.trim() === '') {
    res.status(503).json({
      status: 'error',
      code: 'key not configured',
      message: 'MAS_KEY_ID is not configured in process.env (503 key not configured). Please manually set MAS_KEY_ID in your environment variables.',
    });
    return;
  }

  // Extract fsq_place_id from query, params, or path
  const fsqPlaceId = (req.query.fsq_place_id as string) || (req.query.id as string) || req.params?.fsq_place_id;

  if (!fsqPlaceId || fsqPlaceId.trim() === '') {
    res.status(400).json({
      status: 'error',
      message: 'Missing required parameter: fsq_place_id. Example: /api/places?fsq_place_id=4f323e5919d380e4e207644d',
    });
    return;
  }

  const targetUrl = `https://places-api.foursquare.com/places/${encodeURIComponent(fsqPlaceId.trim())}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'KeyID': masKeyId.trim(),
        'Accept': 'application/json',
        'User-Agent': 'TripHop-MAS-Integration/1.0',
      },
    });

    if (!upstreamRes.ok) {
      res.status(upstreamRes.status).json({
        status: 'error',
        source: 'MAS API Catalogue - Foursquare Places',
        message: `Upstream service responded with HTTP ${upstreamRes.status}: ${upstreamRes.statusText}`,
      });
      return;
    }

    const data = await upstreamRes.json();
    res.setHeader('Cache-Control', 'public, max-age=120');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      source: 'MAS API Catalogue',
      fsq_place_id: fsqPlaceId,
      data,
    });
  } catch (err: any) {
    res.status(502).json({
      status: 'error',
      source: 'MAS API Catalogue',
      message: `Failed to connect to places API: ${err?.message || 'Network error'}`,
    });
  }
}
