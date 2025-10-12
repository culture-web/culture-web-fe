export interface Location {
  x: number;
  y: number;
  width: number;
  height: number;
  probability: number;
}

export interface Prediction {
  prediction: string;
  location: Location;
}

export interface PredictionMultiple {
  prediction: Prediction[];
}

export interface Character {
  name: string;
  shortDescription: string;
  examples: string;
  url: string;
  imagePath: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  start_time: string; // ISO 8601 format with timezone
  end_time: string | null; // ISO 8601 format with timezone
  location: string | null;
  url: string; // Unique URL for the event
  category: string | null;
  scraped_at: string; // ISO 8601 format with timezone
}

export interface GetEventsApiResponse {
  success: boolean;
  data: Event[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
