export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time in HH:MM format
  location?: string;
  category: 'kathakali' | 'kootiyattam' | 'general';
  imageUrl?: string;
}

export interface CalendarEventData {
  [date: string]: CulturalEvent[];
}