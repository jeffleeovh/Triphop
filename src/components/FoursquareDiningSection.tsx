import React, { useEffect, useState } from 'react';
import { Utensils, Star, MapPin, ExternalLink, RefreshCw, Sparkles, Train, Flame, Search, Check, ShieldCheck } from 'lucide-react';
import { FoursquareRestaurant, FoursquareState } from '../types.ts';

interface FoodSpaceItem extends FoursquareRestaurant {
  signatureDishes?: string[];
  bestFor?: string;
  mrtStation?: string;
  description?: string;
  area?: string;
  source?: string;
}

export const FoursquareDiningSection: React.FC = () => {
  const [restaurants, setRestaurants] = useState<FoodSpaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>('Gemini AI Dining Intelligence');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchDiningPlaces = async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Calls unified endpoint which pulls live from Gemini (or Foursquare if key active)
      const url = query
        ? `/api/trip-hop?type=foursquare&q=${encodeURIComponent(query)}`
        : '/api/trip-hop?type=foursquare';
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `Service responded with status ${res.status}`);
        return;
      }

      const list = data.restaurants || [];
      setRestaurants(list);
      setSourceName(data.source || 'Gemini AI Culinary Intelligence');
    } catch (err: any) {
      setError(`Failed to connect: ${err?.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiningPlaces();
  }, []);

  const categories = [
    'All',
    'Hawker Centre',
    'Seafood & Chilli Crab',
    'Michelin Heritage',
    'Cocktail Lounge',
  ];

  const filteredPlaces = restaurants.filter((place) => {
    const text = `${place.name} ${place.category} ${place.address} ${place.area || ''} ${place.description || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      place.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Hawker Centre' && text.includes('hawker')) ||
      (selectedCategory === 'Seafood & Chilli Crab' && (text.includes('seafood') || text.includes('crab')));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-2 border-pink-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/25 flex-shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display font-extrabold text-2xl text-slate-900">
                  Most Popular Singapore Food Spaces &amp; Culinary Hotspots
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-pink-700 border border-pink-300 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Gemini AI Powered
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Connection Active
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Curated dining spaces, landmark Victorian hawker centres, waterfront seafood feasts, and Michelin-recognized institutions across Singapore.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchDiningPlaces(searchQuery)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-md shadow-pink-600/20 transition-all self-start md:self-auto active:scale-95 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Food Spaces</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-5 border-t-2 border-pink-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, venues, or areas (e.g. Lau Pa Sat, Chilli Crab, Newton, Satay)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-2 ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-16 text-center rounded-3xl bg-white border-2 border-slate-200 text-slate-600 text-sm shadow-sm">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-extrabold text-base text-slate-900">Querying Gemini AI Singapore Food Registry...</p>
          <p className="text-xs text-slate-500 mt-1">Fetching signature dishes, Michelin ratings, and authentic hawker stalls</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 text-sm">
          <strong>Connection notice:</strong> {error}
        </div>
      )}

      {/* Food Spaces Grid */}
      {!loading && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-pink-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-0.5"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4 bg-slate-100 border border-slate-100">
                  <img
                    src={place.photoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top pill badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-white/95 text-pink-700 border border-pink-200 shadow-xs">
                      {place.category}
                    </span>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>{place.rating || '4.8'}</span>
                    </div>
                  </div>

                  {/* Bottom tags */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono font-bold">
                    <span className="drop-shadow">Price: {place.priceTier || '$$'}</span>
                    {place.area && <span className="drop-shadow truncate">{place.area}</span>}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1 mb-1.5">
                  {place.name}
                </h3>

                {/* Description */}
                {place.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {place.description}
                  </p>
                )}

                {/* Signature Dishes */}
                {place.signatureDishes && place.signatureDishes.length > 0 && (
                  <div className="mb-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Must-Try Signature Dishes:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {place.signatureDishes.slice(0, 3).map((dish, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white text-slate-800 text-[11px] font-semibold border border-amber-200 shadow-2xs"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location & MRT */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>
                  {place.mrtStation && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Train className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{place.mrtStation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 mt-4 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 truncate">
                  {place.bestFor || 'Great for groups & foodies'}
                </span>

                {place.website ? (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-bold transition-colors flex-shrink-0"
                  >
                    <span>Official Info</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Singapore Dining</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPlaces.length === 0 && (
        <div className="p-16 text-center rounded-3xl bg-white border-2 border-slate-200 text-slate-600 text-sm">
          No food spaces found matching your search. Try clearing keywords or selecting "All".
        </div>
      )}
    </div>
  );
};
