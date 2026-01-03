
import { CityData, Activity } from './types';

export const MOCK_CITIES: CityData[] = [
  { id: '1', name: 'Paris', country: 'France', costIndex: 'high', popularity: 98, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { id: '2', name: 'Tokyo', country: 'Japan', costIndex: 'medium', popularity: 95, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
  { id: '3', name: 'New York', country: 'USA', costIndex: 'high', popularity: 97, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
  { id: '4', name: 'Bali', country: 'Indonesia', costIndex: 'low', popularity: 92, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
  { id: '5', name: 'Rome', country: 'Italy', costIndex: 'medium', popularity: 94, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
  { id: '6', name: 'London', country: 'UK', costIndex: 'high', popularity: 96, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' }
];

export const SUGGESTED_ACTIVITIES: Activity[] = [
  { id: 'a1', name: 'Eiffel Tower Visit', type: 'sightseeing', cost: 45, duration: '2h', description: 'Iconic iron lattice tower on the Champ de Mars.' },
  { id: 'a2', name: 'Sushi Making Class', type: 'food', cost: 80, duration: '3h', description: 'Learn the art of rolling sushi from a master.' },
  { id: 'a3', name: 'Colosseum Tour', type: 'sightseeing', cost: 35, duration: '2.5h', description: 'Explore the grand amphitheatre of Ancient Rome.' },
  { id: 'a4', name: 'Surfing Lesson', type: 'adventure', cost: 50, duration: '2h', description: 'Catch some waves in the beautiful Balinese waters.' }
];
