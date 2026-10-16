import React, { useEffect, useState } from 'react';
import { Utensils, Star, MapPin, ExternalLink, RefreshCw, AlertCircle, Sparkles, Key } from 'lucide-react';
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
      // Sub-goal 3 & guardrails: When data is empty, slow, or refused, say so in plain words. Never invent data.
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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/40 via-slate-900/90 to-purple-950/40 border-2 border-pink-500/30 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 flex-shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl text-white">
                  Foursquare Food &amp; Restaurant Ratings
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Foursquare API
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Verified community ratings, foodie hotspots, and top Singapore culinary recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={fetchFoursquarePlaces}
            disabled={state.status === 'loading'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-pink-500 hover:bg-pink-400 text-slate-950 shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${state.status === 'loading' ? 'animate-spin' : ''}`} />
            <span>Refresh Ratings</span>
          </button>
        </div>
      </div>

      {/* Loading State in plain words */}
      {state.status === 'loading' && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-300 text-sm">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Guardrail: 503 Key Not Configured */}
      {state.status === 'not-configured' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 text-amber-200 space-y-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Foursquare API Key: HTTP 503 Key Not Configured
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {state.message}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <div className="text-amber-400 font-bold uppercase tracking-wider">
              Ready for your API key
            </div>
            <p>
              When you are ready to include your key, simply add <code className="text-pink-400">FOURSQUARE_API_KEY</code> to your secrets / environment file.
            </p>
            <p className="text-slate-400">
              Per project guardrails: No sample rows or fake restaurant ratings are invented when the API key is not configured.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {state.status === 'error' && (
        <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-800 text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-base text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Foursquare Connection Status</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
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
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {place.photoUrl && (
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-full h-44 object-cover rounded-2xl mb-4 border border-slate-800"
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {place.category}
                  </span>
                  {place.rating && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{place.rawRating}/10</span>
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-pink-300 transition-colors">
                  {place.name}
                </h3>

                <div className="text-xs text-slate-400 mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Price: <span className="text-pink-400">{place.priceTier}</span>
                </span>
                {place.website ? (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300"
                  >
                    <span>View Menu</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Foursquare Place</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
