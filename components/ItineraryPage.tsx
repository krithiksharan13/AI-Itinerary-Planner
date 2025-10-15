
import React from 'react';
import { GeneratedItinerary, TripDetails } from '../types';

interface ItineraryPageProps {
  itinerary: GeneratedItinerary;
  tripDetails: TripDetails;
  onGoBack: () => void;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-transform transform hover:scale-105">
        &larr; Plan Another Trip
    </button>
);

const BudgetCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className={`p-4 rounded-xl text-white ${color}`}>
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-2xl font-bold">£{value.toFixed(2)}</p>
    </div>
);

const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary, tripDetails, onGoBack }) => {

    const { tripSummary, schedule, budget } = itinerary;
    const totalPeople = tripDetails.people;
    const budgetDifference = budget.totalBudget - budget.estimatedCost;
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <BackButton onClick={onGoBack} />
            <div className="max-w-5xl mx-auto">
                <header className="text-center my-12">
                     <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-green-500">
                        Your Ultimate Day Trip!
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Prepared for {totalPeople} {totalPeople > 1 ? 'students' : 'student'} to explore <span className="font-bold text-pink-500">{tripSummary.destination}</span>
                    </p>
                    <p className="mt-2 text-md text-gray-500 italic">"{tripSummary.purpose}"</p>
                </header>
                
                {/* Budget Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Budget Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BudgetCard label="TRAVEL" value={budget.breakdown.travel} color="bg-pink-500" />
                        <BudgetCard label="FOOD & DRINK" value={budget.breakdown.foodAndDrink} color="bg-blue-500" />
                        <BudgetCard label="ENTERTAINMENT" value={budget.breakdown.entertainment} color="bg-green-500" />
                    </div>
                    <div className="mt-6 bg-white p-6 rounded-2xl shadow-md flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500">BUDGET</p>
                            <p className="text-2xl font-bold text-gray-800">£{budget.totalBudget.toFixed(2)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">ACTUAL SPENT (EST.)</p>
                            <p className="text-2xl font-bold text-gray-800">£{budget.estimatedCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${budgetDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>DIFFERENCE</p>
                            <p className={`text-2xl font-bold ${budgetDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {budgetDifference >= 0 ? `£${budgetDifference.toFixed(2)} Under` : `£${Math.abs(budgetDifference).toFixed(2)} Over`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Itinerary Timeline */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Step-by-Step Itinerary</h2>
                    <div className="relative border-l-4 border-blue-200 ml-4">
                        {schedule.map((item, index) => (
                            <div key={index} className="mb-10 ml-8">
                                <span className="absolute -left-5 flex items-center justify-center w-10 h-10 bg-blue-400 rounded-full ring-8 ring-white">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"></path></svg>
                                </span>
                                <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <time className="block mb-1 text-sm font-semibold leading-none text-gray-500">{item.time}</time>
                                            <h3 className="text-xl font-bold text-gray-900">{item.activity}</h3>
                                            {item.location && <p className="text-sm text-pink-600 font-medium">{item.location}</p>}
                                        </div>
                                        <div className="text-lg font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                            ~£{item.cost.toFixed(2)}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-base font-normal text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ItineraryPage;
