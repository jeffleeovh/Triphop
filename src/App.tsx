/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { WeatherBanner } from './components/WeatherBanner.tsx';
import { SecondaryItineraryBanner } from './components/SecondaryItineraryBanner.tsx';
import { OutingCard } from './components/OutingCard.tsx';
import { ItineraryPlanner } from './components/ItineraryPlanner.tsx';
import { FoursquareDiningSection } from './components/FoursquareDiningSection.tsx';
import { PaywallModal } from './components/PaywallModal.tsx';
import { Footer } from './components/Footer.tsx';
import { SINGAPORE_OUTINGS } from './data/singaporeOutings.ts';
import { AudienceType, OutingItem, LiveWeatherData } from './types.ts';
import { Search, Lock, Building2 } from 'lucide-react';

export default function App() {
  const [groupSize, setGroupSize] = useState<number>(2); // Default to 2 (Free for couple)
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('Couples');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'explore' | 'itinerary' | 'foursquare'>('explore');

  // Paywall state
  // Free for couple or 2 person. Families (more than 3) or corporate behind paywall.
  const [isSubscriber, setIsSubscriber] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  const isPaywalled = (groupSize >= 3 || selectedAudience === 'Corporate') && !isSubscriber;

  // Itinerary state
  const [itineraryItems, setItineraryItems] = useState<OutingItem[]>([
    SINGAPORE_OUTINGS[0], // iFly Singapore (Team Building)
    SINGAPORE_OUTINGS[1], // Lost SG Escape Challenge
    SINGAPORE_OUTINGS[11], // Lau Pa Sat Satay Feast
  ]);
  const [isSecondaryActive, setIsSecondaryActive] = useState<boolean>(false);

  // Live Weather & PSI state from Data.gov.sg
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [psiData, setPsiData] = useState<any | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [simulatedRain, setSimulatedRain] = useState<boolean>(false);

  // Fetch real-time weather from /api/two-hr-forecast and PSI from /api/psi
  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch('/api/two-hr-forecast');
      const json = await res.json();

      if (!res.ok) {
        setWeatherError(json.message || `Weather service responded with status ${res.status}`);
        return;
      }

      const forecasts = json?.data?.items?.[0]?.forecasts || [];
      const validPeriod = json?.data?.items?.[0]?.valid_period;

      const rainForecasts = forecasts.filter((f: any) => {
        const text = f.forecast?.toLowerCase() || '';
        return text.includes('rain') || text.includes('shower');
      });

      setWeatherData({
        status: 'ok',
        source: 'Data.gov.sg',
        validPeriod: {
          start: validPeriod?.start || '',
          end: validPeriod?.end || '',
          text: validPeriod?.start && validPeriod?.end
            ? `${new Date(validPeriod.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(validPeriod.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} SGT`
            : undefined,
        },
        forecasts,
        isRainDetected: rainForecasts.length > 0,
        rainAreas: rainForecasts.map((f: any) => f.area),
      });

      // Air Quality from /api/psi
      try {
        const psiRes = await fetch('/api/psi');
        if (psiRes.ok) {
          const psiJson = await psiRes.json();
          const readings = psiJson?.data?.items?.[0]?.readings;
          if (readings) {
            const centralPsi = readings['psi_twenty_four_hourly']?.central || 45;
            setPsiData({
              centralPsi,
              descriptor: centralPsi <= 50 ? 'Good' : centralPsi <= 100 ? 'Moderate' : 'Unhealthy',
            });
          }
        }
      } catch {
        // Non-critical
      }
    } catch (err: any) {
      setWeatherError(err?.message || 'Unable to connect to Data.gov.sg API');
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const isRain = simulatedRain || Boolean(weatherData?.isRainDetected);

  // Pre-configured primary outdoor items vs secondary sheltered items
  const primaryOutdoorPlan = [
    SINGAPORE_OUTINGS[2], // Sentosa Mega Adventure & Zip (Outdoor)
    SINGAPORE_OUTINGS[3], // Kallang Marina Dragon Boat (Outdoor)
    SINGAPORE_OUTINGS[9], // Southern Ridges (Outdoor)
  ];

  const secondaryShelteredPlan = [
    SINGAPORE_OUTINGS[0], // iFly Sentosa (Indoor Cooled)
    SINGAPORE_OUTINGS[1], // Lost SG High-Tech Escape Room (Indoor Cooled)
    SINGAPORE_OUTINGS[6], // Gardens by the Bay Cloud Forest (Indoor Cooled)
    SINGAPORE_OUTINGS[7], // Jewel Changi Rain Vortex (Indoor Cooled)
  ];

  const handleActivateSecondary = () => {
    setIsSecondaryActive(true);
    setItineraryItems(secondaryShelteredPlan);
    setActiveTab('itinerary');
  };

  const handleRevertToPrimary = () => {
    setIsSecondaryActive(false);
    setItineraryItems(primaryOutdoorPlan);
  };

  const handleToggleAdd = (item: OutingItem) => {
    if (itineraryItems.some((i) => i.id === item.id)) {
      setItineraryItems(itineraryItems.filter((i) => i.id !== item.id));
    } else {
      setItineraryItems([...itineraryItems, item]);
    }
  };

  // Filter items
  const filteredOutings = SINGAPORE_OUTINGS.filter((item) => {
    const matchesAudience = item.audiences.includes(selectedAudience);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesCategory && matchesSearch;
  });

  const categories = [
    'All',
    'Team Building & Adventure',
    'Indoor & Rainproof',
    'Iconic & Sightseeing',
    'Dining & Social',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        groupSize={groupSize}
        setGroupSize={(size) => {
          setGroupSize(size);
          if (size >= 3 && !isSubscriber) {
            setIsPaywallOpen(true);
          }
        }}
        selectedAudience={selectedAudience}
        setSelectedAudience={setSelectedAudience}
        weatherData={weatherData}
        simulatedRain={simulatedRain}
        setSimulatedRain={setSimulatedRain}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itineraryCount={itineraryItems.length}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        isSubscriber={isSubscriber}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-Time Weather from Data.gov.sg */}
        <WeatherBanner
          weatherData={weatherData}
          psiData={psiData}
          loading={weatherLoading}
          error={weatherError}
          onRefresh={fetchWeather}
          simulatedRain={simulatedRain}
        />

        {/* Rain Contingency Secondary Itinerary (Sub-Goal 4) */}
        <SecondaryItineraryBanner
          isRain={isRain}
          isSecondaryActive={isSecondaryActive}
          onActivateSecondary={handleActivateSecondary}
          onRevertToPrimary={handleRevertToPrimary}
          primaryItems={primaryOutdoorPlan}
          secondaryItems={secondaryShelteredPlan}
          groupSize={groupSize}
        />

        {/* TAB 1: EXPLORE ACTIVITIES */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            {/* Paywall Banner for Families & Corporate */}
            {isPaywalled && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">
                      Free For Couples (Up to 2 Pax) • Party of {groupSize} Requires Pass
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Families with 3+ persons and Corporate groups unlock unlimited custom itinerary creation, split pricing, and team challenges.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPaywallOpen(true)}
                  className="flex-shrink-0 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  View Pass Options
                </button>
              </div>
            )}

            {/* Travel Party Persona Selector */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-emerald-800 block mb-2">
                  1. Select Travel Persona (Freemium Tier Aware)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setSelectedAudience('Couples');
                      setGroupSize(2);
                    }}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      selectedAudience === 'Couples' && groupSize <= 2
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-display font-extrabold text-base text-slate-900">
                      💑 Couples / Duos
                    </span>
                    <span className="text-xs font-bold text-emerald-700 mt-1">
                      FREE (Up to 2 Pax)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAudience('Families');
                      setGroupSize(4);
                      if (!isSubscriber) setIsPaywallOpen(true);
                    }}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      selectedAudience === 'Families'
                        ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-display font-extrabold text-base text-slate-900">
                      👨‍👩‍👧‍👦 Families (3+)
                    </span>
                    <span className="text-xs font-bold text-amber-700 mt-1">
                      Family Pass ($4.99/mo)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAudience('Friends');
                      setGroupSize(5);
                      if (!isSubscriber) setIsPaywallOpen(true);
                    }}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      selectedAudience === 'Friends'
                        ? 'bg-purple-50 border-purple-400 text-slate-900 shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-display font-extrabold text-base text-slate-900">
                      👥 Friend Groups
                    </span>
                    <span className="text-xs font-bold text-purple-700 mt-1">
                      Group Pass ($4.99/mo)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAudience('Corporate');
                      setGroupSize(12);
                      setSelectedCategory('Team Building & Adventure');
                      if (!isSubscriber) setIsPaywallOpen(true);
                    }}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      selectedAudience === 'Corporate'
                        ? 'bg-cyan-50 border-cyan-400 text-slate-900 shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-display font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-cyan-600" />
                      🏢 Corporate Teams
                    </span>
                    <span className="text-xs font-bold text-cyan-700 mt-1">
                      Corporate Pass ($29)
                    </span>
                  </button>
                </div>
              </div>

              {/* Search & Category Pills */}
              <div className="flex flex-col md:flex-row gap-3 pt-3 border-t-2 border-slate-100">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Singapore excursions (e.g. iFly, Lost SG, Sentosa, Jewel)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-2 ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'Team Building & Adventure' ? '🔥 Team Building & Adventure' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activities Grid Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-slate-900">
                  Curated Singapore Activities &amp; Outings
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Pricing dynamically scaled for <strong>{groupSize} pax</strong> ({selectedAudience})
                </p>
              </div>

              <span className="text-sm font-mono font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                {filteredOutings.length} Curated Options
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOutings.map((item) => (
                <OutingCard
                  key={item.id}
                  item={item}
                  groupSize={groupSize}
                  isAdded={itineraryItems.some((i) => i.id === item.id)}
                  onToggleAdd={handleToggleAdd}
                  isRain={isRain}
                />
              ))}
            </div>

            {filteredOutings.length === 0 && (
              <div className="p-16 text-center rounded-3xl bg-white border-2 border-slate-200 text-slate-600 text-sm">
                No activities found matching your search. Try switching categories or clearing search keywords.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FOURSQUARE FOOD & RESTAURANT RATINGS */}
        {activeTab === 'foursquare' && <FoursquareDiningSection />}

        {/* TAB 3: ITINERARY PLANNER */}
        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            items={itineraryItems}
            groupSize={groupSize}
            onRemoveItem={(id) => setItineraryItems(itineraryItems.filter((i) => i.id !== id))}
            onClearAll={() => setItineraryItems([])}
            isRain={isRain}
            isSecondaryActive={isSecondaryActive}
            onSwitchToSecondary={handleActivateSecondary}
            isPaywalled={isPaywalled}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        groupSize={groupSize}
        persona={selectedAudience}
        onUnlockDemo={() => {
          setIsSubscriber(!isSubscriber);
          setIsPaywallOpen(false);
        }}
        isUnlocked={isSubscriber}
      />

      {/* Footer crediting Data.gov.sg & Foursquare */}
      <Footer />
    </div>
  );
}
