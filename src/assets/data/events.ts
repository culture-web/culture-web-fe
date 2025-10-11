import { CulturalEvent, CalendarEventData } from '../../types/events';

export const sampleEvents: CulturalEvent[] = [
  {
    id: '1',
    title: 'Kathakali Performance Workshop',
    description: 'Join us for an immersive workshop learning the traditional art of Kathakali dance and expressions.',
    date: '2025-10-15',
    time: '14:00',
    location: 'Cultural Center Auditorium',
    category: 'kathakali',
  },
  {
    id: '2',
    title: 'Kootiyattam Classical Theatre',
    description: 'Experience the ancient Sanskrit theatre tradition with professional artists.',
    date: '2025-10-18',
    time: '19:30',
    location: 'Traditional Arts Theatre',
    category: 'kootiyattam',
  },
  {
    id: '3',
    title: 'Cultural Heritage Festival',
    description: 'A grand celebration of diverse cultural traditions featuring performances, food, and art.',
    date: '2025-10-22',
    time: '10:00',
    location: 'Heritage Park',
    category: 'general',
  },
  {
    id: '4',
    title: 'Kathakali Makeup Demonstration',
    description: 'Learn about the intricate makeup techniques used in Kathakali performances.',
    date: '2025-10-25',
    time: '16:00',
    location: 'Arts Workshop Studio',
    category: 'kathakali',
  },
  {
    id: '5',
    title: 'Traditional Music Evening',
    description: 'An evening of classical Indian music accompanying traditional dance forms.',
    date: '2025-10-28',
    time: '18:00',
    location: 'Music Hall',
    category: 'general',
  },
  {
    id: '6',
    title: 'Kootiyattam Workshop Series',
    description: 'Three-day intensive workshop on Kootiyattam techniques and history.',
    date: '2025-11-02',
    time: '09:00',
    location: 'Cultural Institute',
    category: 'kootiyattam',
  },
  {
    id: '7',
    title: 'Youth Cultural Competition',
    description: 'Young performers showcase their talents in traditional art forms.',
    date: '2025-11-08',
    time: '15:00',
    location: 'Community Center',
    category: 'general',
  },
  {
    id: '8',
    title: 'Kathakali Story Session',
    description: 'Interactive storytelling session featuring famous Kathakali narratives.',
    date: '2025-11-12',
    time: '11:00',
    location: 'Children\'s Library',
    category: 'kathakali',
  }
];

// Transform events array into calendar format
export const calendarEventData: CalendarEventData = sampleEvents.reduce((acc, event) => {
  if (!acc[event.date]) {
    acc[event.date] = [];
  }
  acc[event.date].push(event);
  return acc;
}, {} as CalendarEventData);