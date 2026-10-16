import React from 'react';
import { CloudRain, Sun, Cloud, AlertTriangle, RefreshCw, Radio } from 'lucide-react';
import { LiveWeatherData } from '../types.ts';

interface WeatherBannerProps {
  weatherData: LiveWeatherData | null;
  psiData?: { centralPsi: number; descriptor: string } | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  simulatedRain: boolean;
}

export const WeatherBanner: React.FC<WeatherBannerProps> = ({
  weatherData,
  psiData,
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
      return <CloudRain className="w-4 h-4 text-cyan-600" />;
    }
    if (lower.includes('cloud')) {
      return <Cloud className="w-4 h-4 text-slate-500" />;
    }
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all mb-8 shadow-sm ${
        isRain
          ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300 shadow-amber-100'
          : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-cyan-50/90 border-emerald-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl flex-shrink-0 ${
              isRain
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
            }`}
          >
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Data.gov.sg Real-Time 2-Hour Forecast
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-300 shadow-xs">
                Official API
              </span>
              {psiData && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-teal-800 border border-teal-300 shadow-xs">
                  PSI {psiData.centralPsi} ({psiData.descriptor})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {weatherData?.validPeriod?.text
                ? `Valid Period: ${weatherData.validPeriod.text}`
                : 'National Environment Agency (NEA) live meteorological sensor feed'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isRain ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-400 text-sm font-extrabold shadow-sm animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Rainfall Warning</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-emerald-800 border-2 border-emerald-300 text-sm font-extrabold shadow-xs">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Clear Sky Conditions</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 transition-colors shadow-xs"
            title="Refresh live weather from Data.gov.sg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Plain Words Status Handling */}
      {loading && !weatherData && (
        <div className="py-6 text-center text-sm text-slate-600 font-mono">
          Loading real-time weather from Data.gov.sg...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
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
                className={`p-3 rounded-2xl border-2 text-xs transition-all shadow-xs ${
                  isAreaRain
                    ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="font-extrabold text-sm text-slate-900 truncate">{area}</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold mt-1 text-slate-600 truncate">
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
