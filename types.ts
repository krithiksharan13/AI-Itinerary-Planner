
export interface TripDetails {
  startCity: string;
  destinationCity: string;
  tripDate: string;
  budget: number;
  people: number;
  interests: string[];
  travelPreference: string;
  dietaryPreference: string;
}

export interface ItineraryItem {
  time: string;
  activity: string;
  description: string;
  cost: number;
  location?: string;
}

export interface BudgetBreakdown {
  travel: number;
  foodAndDrink: number;
  entertainment: number;
}

export interface GeneratedItinerary {
  tripSummary: {
    destination: string;
    purpose: string;
  };
  schedule: ItineraryItem[];
  budget: {
    totalBudget: number;
    estimatedCost: number;
    breakdown: BudgetBreakdown;
  };
}
