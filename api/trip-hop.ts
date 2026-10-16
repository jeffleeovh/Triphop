import type { Request, Response } from 'express';

/**
 * Serverless / API Route handler for Trip Hop
 * Guardrails:
 * - Read every key from process.env inside api/ only. Never give a key the VITE_ prefix.
 * - Never write a key into any file.
 * - Never invent data. If the API fails, show a message, not sample rows.
 * - If a key variable is empty, api/ returns 503 'key not configured' and does not call the provider.
 * - Data sources: Data.gov.sg (real-time weather) & Foursquare (food & restaurant ratings)
 */

export default async function handler(req: Request, res: Response): Promise<void> {
  const { type = 'weather' } = req.query;

  // Weather Endpoint: Data.gov.sg 2-hour forecast
  if (type === 'weather') {
    try {
      const weatherRes = await fetch(
        'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
        {
          headers: {
            'User-Agent': 'TripHop-SingaporeOutings/1.0',
          },
        }
      );

      if (!weatherRes.ok) {
        res.status(weatherRes.status).json({
          status: 'error',
          source: 'Data.gov.sg',
          message: `Data.gov.sg returned error status ${weatherRes.status}: ${weatherRes.statusText}`,
        });
        return;
      }

      const weatherData = await weatherRes.json();
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.json({
        status: 'ok',
        source: 'Data.gov.sg',
        data: weatherData,
      });
      return;
    } catch (err: any) {
      res.status(502).json({
        status: 'error',
        source: 'Data.gov.sg',
        message: `Failed to connect to Data.gov.sg: ${err?.message || 'Network error'}`,
      });
      return;
    }
  }

  // Foursquare Food & Restaurant Ratings Endpoint
  if (type === 'foursquare' || type === 'restaurants') {
    const foursquareKey = process.env.FOURSQUARE_API_KEY;

    // Strict guardrail check:
    // If a key variable is empty, api/ returns 503 'key not configured' and does not call the provider.
    if (!foursquareKey || foursquareKey.trim() === '') {
      res.status(503).json({
        status: 'error',
        code: 'key not configured',
        source: 'Foursquare',
        message: 'Foursquare API key not configured (503 key not configured). Please configure FOURSQUARE_API_KEY in the server environment.',
      });
      return;
    }

    try {
      // Query Foursquare Places API for top-rated dining & food spots in Singapore (category 13000 = Dining and Drinking)
      const fsqUrl = 'https://api.foursquare.com/v3/places/search?near=Singapore&categories=13000&sort=RATING&limit=20&fields=fsq_id,name,rating,price,location,categories,photos,description,website';

      const fsqRes = await fetch(fsqUrl, {
        headers: {
          Authorization: foursquareKey.trim(),
          Accept: 'application/json',
        },
      });

      if (!fsqRes.ok) {
        res.status(fsqRes.status).json({
          status: 'error',
          source: 'Foursquare',
          message: `Foursquare API returned status ${fsqRes.status}: ${fsqRes.statusText}`,
        });
        return;
      }

      const fsqData = await fsqRes.json();
      const rawResults = fsqData?.results || [];

      // Clean & map places without inventing data
      const restaurants = rawResults.map((place: any) => ({
        id: place.fsq_id,
        name: place.name,
        rating: place.rating ? (place.rating / 2).toFixed(1) : null, // Foursquare is 0-10, scale to 5 stars or keep 10
        rawRating: place.rating || null,
        priceTier: place.price ? '$'.repeat(place.price) : '$$',
        category: place.categories?.[0]?.name || 'Dining',
        address: place.location?.formatted_address || place.location?.locality || 'Singapore',
        neighborhood: place.location?.neighborhood?.[0] || place.location?.cross_street || 'Central Singapore',
        photoUrl: place.photos?.[0]
          ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
          : null,
        website: place.website || null,
      }));

      res.setHeader('Cache-Control', 'public, max-age=180');
      res.json({
        status: 'ok',
        source: 'Foursquare',
        count: restaurants.length,
        restaurants,
      });
      return;
    } catch (err: any) {
      res.status(502).json({
        status: 'error',
        source: 'Foursquare',
        message: `Failed to connect to Foursquare API: ${err?.message || 'Network error'}`,
      });
      return;
    }
  }

  res.status(400).json({
    status: 'error',
    message: 'Invalid request. Specify ?type=weather or ?type=foursquare',
  });
}
