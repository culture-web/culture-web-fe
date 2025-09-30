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

export interface ChatbotResponseSection {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export interface ChatbotResponseTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ChatbotResponseMetadata {
  hasStructuredContent: boolean;
  responseLength: number;
  processingTimestamp: string;
}

export interface ChatbotResponse {
  shortAnswer: string;
  reasoning?: string | null;
  sections: ChatbotResponseSection[];
  tables: ChatbotResponseTable[];
  metadata: ChatbotResponseMetadata;
}
