
import { GoogleGenAI, Type } from "@google/genai";
import { TripDetails, GeneratedItinerary } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    tripSummary: {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        purpose: { type: Type.STRING },
      },
      required: ["destination", "purpose"],
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          description: { type: Type.STRING },
          cost: { type: Type.NUMBER },
          location: { type: Type.STRING },
        },
        required: ["time", "activity", "description", "cost"],
      },
    },
    budget: {
      type: Type.OBJECT,
      properties: {
        totalBudget: { type: Type.NUMBER },
        estimatedCost: { type: Type.NUMBER },
        breakdown: {
          type: Type.OBJECT,
          properties: {
            travel: { type: Type.NUMBER },
            foodAndDrink: { type: Type.NUMBER },
            entertainment: { type: Type.NUMBER },
          },
          required: ["travel", "foodAndDrink", "entertainment"],
        },
      },
      required: ["totalBudget", "estimatedCost", "breakdown"],
    },
  },
  required: ["tripSummary", "schedule", "budget"],
};

export const generateItinerary = async (details: TripDetails): Promise<GeneratedItinerary> => {
  const prompt = `
    You are an expert day-trip planner for university students in the UK. Your goal is to create a detailed, fun, and highly budget-conscious one-day itinerary.
    
    The output must be a valid JSON object that strictly adheres to the provided schema.

    Here are the trip details:
    - Starting City: ${details.startCity}
    - Destination City: ${details.destinationCity}
    - Date of Trip: ${details.tripDate}
    - Number of People: ${details.people}
    - Budget per Person: £${details.budget}
    - Total Budget: £${details.budget * details.people}
    - Main Interests: ${details.interests.join(', ')}
    - Travel Preference: ${details.travelPreference}
    - Dietary Preferences: ${details.dietaryPreference}

    Instructions:
    1.  Create a step-by-step itinerary in the 'schedule' array. Include timings, activities, locations, and estimated costs per person.
    2.  Focus on student-friendly options: free museums, cheap eats, student discounts, and affordable transport.
    3.  The 'purpose' in 'tripSummary' should be a short, exciting summary based on the interests (e.g., "An artsy and foodie exploration of Manchester").
    4.  Calculate the 'budget' breakdown. 'totalBudget' is the budget per person multiplied by the number of people. 'estimatedCost' is the sum of all costs in the schedule multiplied by the number of people.
    5.  Ensure all costs are realistic for the UK in 2024.
    6.  The entire plan should be for a single day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeneratedItinerary;

  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to get a valid plan from the AI. It might be having a busy day!");
  }
};
