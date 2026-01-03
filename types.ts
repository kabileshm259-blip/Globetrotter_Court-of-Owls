
export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  MY_TRIPS = 'MY_TRIPS',
  CREATE_TRIP = 'CREATE_TRIP',
  ITINERARY_BUILDER = 'ITINERARY_BUILDER',
  ITINERARY_VIEW = 'ITINERARY_VIEW',
  BUDGET = 'BUDGET',
  PROFILE = 'PROFILE',
  PUBLIC_VIEW = 'PUBLIC_VIEW'
}

export interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'food' | 'adventure' | 'relaxation';
  cost: number;
  duration: string;
  description: string;
}

export interface Stop {
  id: string;
  cityId: string;
  cityName: string;
  arrivalDate: string;
  departureDate: string;
  activities: Activity[];
  stayCost: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImage: string;
  stops: Stop[];
  totalBudget: number;
  userId: string;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  costIndex: 'low' | 'medium' | 'high';
  popularity: number;
  image: string;
}
