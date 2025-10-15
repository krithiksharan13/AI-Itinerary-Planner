
import React, { useState, useCallback } from 'react';
import PlannerInputPage from './components/PlannerInputPage';
import LoadingScreen from './components/LoadingScreen';
import ItineraryPage from './components/ItineraryPage';
import { TripDetails, GeneratedItinerary } from './types';
import { generateItinerary } from './services/geminiService';

type AppState = 'input' | 'loading' | 'itinerary';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlanMyDay = useCallback(async (details: TripDetails) => {
    setTripDetails(details);
    setAppState('loading');
    setError(null);
    try {
      const result = await generateItinerary(details);
      setItinerary(result);
      setAppState('itinerary');
    } catch (e) {
      console.error(e);
      setError('Oh no! Something went wrong while brewing your trip. Please try again.');
      setAppState('input');
    }
  }, []);

  const handleGoBack = useCallback(() => {
    setAppState('input');
    setItinerary(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingScreen />;
      case 'itinerary':
        return itinerary && tripDetails ? (
          <ItineraryPage itinerary={itinerary} tripDetails={tripDetails} onGoBack={handleGoBack} />
        ) : (
          <PlannerInputPage onSubmit={handlePlanMyDay} initialData={tripDetails} error={error} />
        );
      case 'input':
      default:
        return <PlannerInputPage onSubmit={handlePlanMyDay} initialData={tripDetails} error={error} />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      {renderContent()}
    </div>
  );
};

export default App;
