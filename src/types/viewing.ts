export type PageRoute = 'home' | 'residences' | 'architecture' | 'cities' | 'viewing';

export type BuildingType =
  | 'Plexes'
  | 'Laneway Houses & Garden Suites'
  | 'Movable Houses';

export type CityLocation = 'Toronto' | 'Vancouver' | 'Montreal' | 'Calgary';

export interface ViewingFormValues {
  fullName: string;
  email: string;
  phone: string;
  buildingTypes: BuildingType[];
  viewingDate: string;
  viewingTime: string;
  budget: string;
  location: CityLocation | '';
  moreRequest: string;
}

export interface DynamicTimeSlot {
  id: string;
  label: string;
  date?: string;
  time?: string;
  dateTime?: string;
  raw: unknown;
}

export interface WebhookOutcome {
  kind: 'success' | 'unavailable' | 'error';
  headline: string;
  message: string;
  slots: DynamicTimeSlot[];
  details: Array<{ label: string; value: string }>;
  rawData: unknown;
}
