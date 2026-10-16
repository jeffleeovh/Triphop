import React, { useEffect, useState } from 'react';
import { Utensils, Star, MapPin, ExternalLink, RefreshCw, AlertCircle, Key } from 'lucide-react';
import { FoursquareRestaurant, FoursquareState } from '../types.ts';

export const FoursquareDiningSection: React.FC = () => {
  const [state, setState] = useState<FoursquareState>({
    status: 'idle',
    message: '',
    restaurants: [],
  });

  const fetchFoursquarePlaces = async () => {
    setState((prev) => ({
      ...prev,
      status: 'loading',
      message: 'Connecting to Foursquare Places API for Singapore dining ratings...',
    }));

    try {
      const res = await fetch('/api/trip-hop?type=foursquare');
      const data = await res.json();

      if (res.status === 503) {
        // Strict guardrail: 503 key not configured
        setState({
          status: 'not-configured',
          message:
            data.message ||
            'Foursquare API key not configured (503 key not configured). Add FOURSQUARE_API_KEY in the server environment to load live Foursquare food & restaurant ratings.',
          restaurants: [],
        });
        return;
      }

      if (!res.ok) {
        setState({
          status: 'error',
          message: data.message || `Foursquare API responded with status ${res.status}.`,
          restaurants: [],
        });
        return;
      }

      if (!data.restaurants || data.restaurants.length === 0) {
        setState({
          status: 'ok',
          message: 'No dining locations returned by Foursquare for Singapore.',
          restaurants: [],
        });
        return;
      }

      setState({
        status: 'ok',
        message: '',
        restaurants: data.restaurants,
      });
    } catch (err: any) {
      setState({
        status: 'error',
        message: `Failed to connect to Foursquare API: ${err?.message || 'Network error'}.`,
        restaurants: [],
      });
    }
  };

  useEffect(() => {
    fetchFoursquarePlaces();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-2 border-pink-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/25 flex-shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl text-slate-900">
                  Foursquare Food &amp; Restaurant Ratings
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-pink-700 border border-pink-300 shadow-xs">
                  Foursquare API
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Verified community ratings, foodie hotspots, and top Singapore culinary recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={fetchFoursquarePlaces}
            disabled={state.status === 'loading'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-600/20 transition-all self-start sm:self-auto active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${state.status === 'loading' ? 'animate-spin' : ''}`} />
            <span>Refresh Ratings</span>
          </button>
        </div>
      </div>

      {/* Loading State in plain words */}
      {state.status === 'loading' && (
        <div className="p-12 text-center rounded-3xl bg-white border-2 border-slate-200 text-slate-600 text-sm shadow-sm">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Guardrail: 503 Key Not Configured */}
      {state.status === 'not-configured' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 text-amber-950 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Foursquare API Key: HTTP 503 Key Not Configured
              </h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {state.message}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
            <div className="text-amber-800 font-bold uppercase tracking-wider">
              Ready for your API key
            </div>
            <p>
              When ready, include <code className="text-pink-600 font-bold">FOURSQUARE_API_KEY</code> in your environment variables.
            </p>
            <p className="text-slate-500">
              Per project guardrails: No sample rows or fake restaurant ratings are invented when the API key is not configured.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {state.status === 'error' && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-base text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Foursquare Connection Status</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {state.message}
          </p>
        </div>
      )}

      {/* Live Restaurants List if key active & places returned */}
      {state.status === 'ok' && state.restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.restaurants.map((place) => (
            <div
              key={place.id}
              className="p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-pink-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                {place.photoUrl && (
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-full h-44 object-cover rounded-2xl mb-4 border border-slate-100"
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-pink-50 text-pink-700 border border-pink-200">
                    {place.category}
                  </span>
                  {place.rating && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{place.rawRating}/10</span>
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-pink-600 transition-colors">
                  {place.name}
                </h3>

                <div className="text-xs text-slate-500 mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700">
                  Price: <span className="text-pink-600">{place.priceTier}</span>
                </span>
                {place.website ? (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700"
                  >
                    <span>View Menu</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Foursquare Place</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
