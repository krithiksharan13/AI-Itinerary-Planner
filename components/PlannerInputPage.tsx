import React, { useState, useCallback } from 'react';
import { TripDetails } from '../types';
import { INTERESTS_OPTIONS, TRAVEL_PREFERENCES, DIETARY_PREFERENCES } from '../constants';
import CityAutocompleteInput from './CityAutocompleteInput';

interface PlannerInputPageProps {
  onSubmit: (details: TripDetails) => void;
  initialData?: TripDetails | null;
  error?: string | null;
}

const PlannerInputPage: React.FC<PlannerInputPageProps> = ({ onSubmit, initialData, error }) => {
  const [details, setDetails] = useState<TripDetails>(initialData || {
    startCity: '',
    destinationCity: '',
    tripDate: new Date().toISOString().split('T')[0],
    budget: 50,
    people: 1,
    interests: [],
    travelPreference: TRAVEL_PREFERENCES[0],
    dietaryPreference: DIETARY_PREFERENCES[0],
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: (e.target.type === 'number') ? parseFloat(value) : value }));
  }, []);

  const handleCityChange = useCallback((name: string, value: string) => {
    setDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleInterestChange = useCallback((interest: string) => {
    setDetails(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.interests.length === 0) {
      alert("Please select at least one interest!");
      return;
    }
    onSubmit(details);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-200 via-blue-200 to-green-200">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-8 transform transition-all hover:shadow-lg">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">A Broke Uni Student's itinerary Planner</h1>
          <p className="text-pink-500 font-semibold mt-2">Let's cook with what we got</p>
        </header>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Oops!</p>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Top Half */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-pink-50 rounded-2xl border border-pink-200">
            <h2 className="md:col-span-2 text-2xl font-bold text-pink-600 mb-2">The Basics</h2>
            <div>
              <CityAutocompleteInput
                id="startCity"
                name="startCity"
                label="Starting City"
                value={details.startCity}
                onChange={handleCityChange}
                required
              />
            </div>
            <div>
              <CityAutocompleteInput
                id="destinationCity"
                name="destinationCity"
                label="Destination City"
                value={details.destinationCity}
                onChange={handleCityChange}
                required
              />
            </div>
            <div>
              <label htmlFor="tripDate" className="block text-sm font-semibold text-gray-700 mb-1">Date of Trip</label>
              <input type="date" name="tripDate" id="tripDate" value={details.tripDate} onChange={handleInputChange} required className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-1">Budget per Person (£)</label>
              <input type="number" name="budget" id="budget" value={details.budget} onChange={handleInputChange} required min="10" className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="people" className="block text-sm font-semibold text-gray-700 mb-1">Total Number of People</label>
              <input type="number" name="people" id="people" value={details.people} onChange={handleInputChange} required min="1" className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition" />
            </div>
          </div>

          {/* Bottom Half */}
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-6">
            <h2 className="text-2xl font-bold text-blue-600">The Vibe</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Interests & Vibe</label>
              <div className="flex flex-wrap gap-3">
                {INTERESTS_OPTIONS.map(interest => (
                  <button key={interest} type="button" onClick={() => handleInterestChange(interest)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-transform transform hover:scale-105 ${details.interests.includes(interest) ? 'bg-green-400 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-300'}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="travelPreference" className="block text-sm font-semibold text-gray-700 mb-1">Travel Preference</label>
                <select name="travelPreference" id="travelPreference" value={details.travelPreference} onChange={handleInputChange} className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition">
                  {TRAVEL_PREFERENCES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dietaryPreference" className="block text-sm font-semibold text-gray-700 mb-1">Dietary Preferences</label>
                <select name="dietaryPreference" id="dietaryPreference" value={details.dietaryPreference} onChange={handleInputChange} className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition">
                  {DIETARY_PREFERENCES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out">
              Plan my day
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlannerInputPage;