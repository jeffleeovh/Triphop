import React from 'react';
import { CloudRain, Sun, Cloud, AlertTriangle, RefreshCw, Radio } from 'lucide-react';
import { LiveWeatherData } from '../types.ts';

interface WeatherBannerProps {
  weatherData: LiveWeatherData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  simulatedRain: boolean;
}

export const WeatherBanner: React.FC<WeatherBannerProps> = ({
  weatherData,
  loading,
  error,
  onRefresh,
  simulatedRain,
}) => {
  const isRain = simulatedRain || Boolean(weatherData?.isRainDetected);

  const keyAreas = ['Marina Bay', 'Sentosa', 'City', 'Orchard', 'Jurong West', 'Changi'];

  const getForecastFor = (areaName: string) => {
    if (simulatedRain) {
      return 'Thundery Showers';
    }
    const found = weatherData?.forecasts?.find(
      (f) => f.area.toLowerCase().includes(areaName.toLowerCase()) || areaName.toLowerCase().includes(f.area.toLowerCase())
    );
    return found ? found.forecast : 'Fair (Day)';
  };

  const getWeatherIcon = (forecast: string) => {
    const lower = forecast.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower')) {
      return <CloudRain className="w-4 h-4 text-cyan-300" />;
    }
    if (lower.includes('cloud')) {
      return <Cloud className="w-4 h-4 text-slate-200" />;
    }
    return <Sun className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all mb-8 shadow-xl ${
        isRain
          ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border-amber-500/60 shadow-amber-950/30'
          : 'bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-teal-950/40 border-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl flex-shrink-0 ${
              isRain ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Data.gov.sg Real-Time 2-Hour Forecast
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                Official Government API
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {weatherData?.validPeriod?.text
                ? `Valid Period: ${weatherData.validPeriod.text}`
                : 'National Environment Agency (NEA) live meteorological sensor feed'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isRain ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-200 border-2 border-amber-500/50 text-sm font-extrabold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Rainfall Warning</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/40 text-sm font-extrabold">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Clear Sky Conditions</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-md"
            title="Refresh live weather from Data.gov.sg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Plain Words Status Handling */}
      {loading && !weatherData && (
        <div className="py-6 text-center text-sm text-slate-300 font-mono">
          Loading real-time weather from Data.gov.sg...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-800 text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>Weather data refused or temporarily unavailable from Data.gov.sg: {error}</span>
        </div>
      )}

      {/* Area Forecast Chips */}
      {weatherData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-3">
          {keyAreas.map((area) => {
            const forecast = getForecastFor(area);
            const isAreaRain = forecast.toLowerCase().includes('rain') || forecast.toLowerCase().includes('shower');
            return (
              <div
                key={area}
                className={`p-3 rounded-2xl border-2 text-xs transition-all ${
                  isAreaRain
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="font-extrabold text-sm text-white truncate">{area}</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold mt-1 text-slate-300 truncate">
                  {getWeatherIcon(forecast)}
                  <span className="truncate">{forecast}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
