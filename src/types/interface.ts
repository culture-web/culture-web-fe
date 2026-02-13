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

export interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
  };
  createdAt?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: object | null; // Supabase session object
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}
