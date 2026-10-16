export type WeatherCondition =
  | 'Fair (Day)'
  | 'Fair (Night)'
  | 'Fair and Warm'
  | 'Partly Cloudy (Day)'
  | 'Partly Cloudy (Night)'
  | 'Cloudy'
  | 'Hazy'
  | 'Slightly Hazy'
  | 'Windy'
  | 'Mist'
  | 'Fog'
  | 'Light Rain'
  | 'Moderate Rain'
  | 'Heavy Rain'
  | 'Passing Showers'
  | 'Light Showers'
  | 'Showers'
  | 'Heavy Showers'
  | 'Thundery Showers'
  | 'Heavy Thundery Showers'
  | 'Heavy Thundery Showers with Gusty Winds';

export interface AreaForecast {
  area: string;
  forecast: string;
}

export interface LiveWeatherData {
  status: 'ok' | 'error';
  source: string;
  updateTimestamp?: string;
  validPeriod?: {
    start: string;
    end: string;
    text?: string;
  };
  forecasts: AreaForecast[];
  isRainDetected: boolean;
  rainAreas: string[];
  rawMessage?: string;
}

export interface LivePsiData {
  status: 'ok' | 'error';
  twentyFourHourly?: Record<string, number>;
  nationalPsi?: number;
  descriptor?: string;
  updateTimestamp?: string;
}

export interface FoursquareRestaurant {
  id: string;
  name: string;
  rating: string | null;
  rawRating: number | null;
  priceTier: string;
  category: string;
  address: string;
  neighborhood: string;
  photoUrl: string | null;
  website: string | null;
}

export interface FoursquareState {
  status: 'idle' | 'loading' | 'ok' | 'error' | 'not-configured';
  message: string;
  restaurants: FoursquareRestaurant[];
}

export type OutingCategory =
  | 'Team Building & Adventure'
  | 'Iconic & Sightseeing'
  | 'Culture & Heritage'
  | 'Indoor & Rainproof'
  | 'Dining & Social';

export type AudienceType =
  | 'Couples'
  | 'Families'
  | 'Friends'
  | 'Corporate';

export interface OutingItem {
  id: string;
  name: string;
  category: OutingCategory;
  area: string;
  mrtStation: string;
  pricePerPax: number;
  priceTier: 'Free' | '$' | '$$' | '$$$';
  type: 'outdoor' | 'indoor' | 'sheltered';
  durationHours: number;
  audiences: AudienceType[];
  description: string;
  highlights: string[];
  imageUrl: string;
  weatherRisk: 'high' | 'medium' | 'low';
  isTeamBuildingFavorite?: boolean;
}

export interface ItineraryPlan {
  id: string;
  name: string;
  isSecondarySheltered: boolean;
  reason?: string;
  items: OutingItem[];
}
