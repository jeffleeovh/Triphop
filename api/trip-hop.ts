import type { Request, Response } from 'express';
import { getSingaporeFoodSpaces } from './gemini-food.ts';

/**
 * Serverless / API Route handler for Trip Hop
 * Endpoints:
 * - Weather: Data.gov.sg real-time 2-hour forecast
 * - Food & Dining: Pulls recommended food spaces from Gemini AI (gemini-3.8-flash) or Foursquare Places API
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

  // Food & Restaurant Ratings Endpoint
  if (type === 'foursquare' || type === 'restaurants' || type === 'food') {
    const foursquareKey = process.env.FOURSQUARE_API_KEY;

    // If Foursquare key is configured, query Foursquare Places API
    if (foursquareKey && foursquareKey.trim() !== '') {
      try {
        const fsqUrl = 'https://api.foursquare.com/v3/places/search?near=Singapore&categories=13000&sort=RATING&limit=20&fields=fsq_id,name,rating,price,location,categories,photos,description,website';
        const fsqRes = await fetch(fsqUrl, {
          headers: {
            Authorization: foursquareKey.trim(),
            Accept: 'application/json',
          },
        });

        if (fsqRes.ok) {
          const fsqData = await fsqRes.json();
          const rawResults = fsqData?.results || [];
          if (rawResults.length > 0) {
            const restaurants = rawResults.map((place: any) => ({
              id: place.fsq_id,
              name: place.name,
              rating: place.rating ? (place.rating / 2).toFixed(1) : '4.5',
              rawRating: place.rating || 9.0,
              priceTier: place.price ? '$'.repeat(place.price) : '$$',
              category: place.categories?.[0]?.name || 'Singapore Dining',
              address: place.location?.formatted_address || place.location?.locality || 'Singapore',
              area: place.location?.neighborhood?.[0] || 'Central Singapore',
              photoUrl: place.photos?.[0]
                ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
                : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
              website: place.website || null,
              source: 'Foursquare Places API',
            }));

            res.setHeader('Cache-Control', 'public, max-age=180');
            res.json({
              status: 'ok',
              source: 'Foursquare',
              count: restaurants.length,
              restaurants,
            });
            return;
          }
        }
      } catch (err: any) {
        console.warn('[Trip Hop] Foursquare API failed, falling back to Gemini AI Food Spaces:', err?.message);
      }
    }

    // Pull popular & recommended food spaces in Singapore from Gemini AI (gemini-3.8-flash)
    try {
      const searchQuery = (req.query.q as string) || '';
      const geminiFoodSpaces = await getSingaporeFoodSpaces(searchQuery);

      res.setHeader('Cache-Control', 'public, max-age=300');
      res.json({
        status: 'ok',
        source: 'Gemini AI Culinary Intelligence',
        model: 'gemini-3.8-flash',
        foursquareFallback: true,
        count: geminiFoodSpaces.length,
        restaurants: geminiFoodSpaces,
      });
      return;
    } catch (err: any) {
      res.status(500).json({
        status: 'error',
        source: 'Gemini AI',
        message: `Failed to load Singapore food spaces: ${err?.message || 'Unknown error'}`,
      });
      return;
    }
  }

  res.status(400).json({
    status: 'error',
    message: 'Invalid request. Specify ?type=weather or ?type=foursquare',
  });
}
