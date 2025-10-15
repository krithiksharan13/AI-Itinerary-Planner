import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CityAutocompleteInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  label: string;
  required?: boolean;
}

const POPULAR_CITIES = [
  'Aberdeen', 'Aberystwyth', 'Abingdon', 'Aldeburgh', 'Alnwick', 'Alton', 'Amersham', 'Andover', 'Armagh', 'Arundel', 'Aylesbury', 'Aylsham',
  'Bakewell', 'Bamburgh', 'Banbury', 'Bangor (Northern Ireland)', 'Bangor (Wales)', 'Barnstaple', 'Basingstoke', 'Bath', 'Beaconsfield', 'Belfast', 'Berwick-upon-Tweed', 'Bexhill', 'Billericay', 'Birmingham', 'Bishop’s Stortford', 'Bognor Regis', 'Boston', 'Bournemouth', 'Bradford', 'Brentwood', 'Bridport', 'Brighton', 'Brighton & Hove', 'Bristol', 'Broadstairs', 'Burford', 'Burnham-on-Sea', 'Bury St Edmunds', 'Cambridge', 'Canterbury', 'Cardiff', 'Carlisle', 'Chelmsford', 'Chertsey', 'Chester', 'Chichester', 'Chipping Norton', 'Christchurch', 'Cirencester', 'Clacton-on-Sea', 'Clevedon', 'Colchester', 'Coventry', 'Cromer', 'Deal', 'Derby', 'Didcot', 'Doncaster', 'Dorking', 'Dover', 'Dundee', 'Dunfermline', 'Durham', 'Eastbourne', 'Edinburgh', 'Ely', 'Epsom', 'Exeter', 'Exmouth', 'Falmouth', 'Fareham', 'Farnham', 'Faversham', 'Felixstowe', 'Fishguard', 'Folkestone', "Giant's Causeway", 'Glasgow', 'Gloucester', 'Gosport', 'Grantham', 'Great Yarmouth', 'Guildford', "Hadrian's Wall", 'Harwich', 'Haslemere', 'Hastings', 'Hemel Hempstead', 'Henley-on-Thames', 'Hereford', 'Herne Bay', 'Hitchin', 'Holt', 'Horncastle', 'Hove', 'Hunstanton', 'Ilfracombe', 'Inverness', 'Ipswich', 'Jurassic Coast', 'Kenilworth', 'King’s Lynn', 'Kingston upon Hull', 'Lake District National Park', 'Lancaster', 'Leamington Spa', 'Leatherhead', 'Leeds', 'Leicester', 'Lewes', 'Lichfield', 'Lincoln', 'Lisburn', 'Littlehampton', 'Liverpool', 'Llandudno', 'Loch Ness, Inverness', 'London', 'Londonderry (Derry)', 'Loughborough', 'Louth', 'Lowestoft', 'Lyme Regis', 'Lynmouth', 'Lynton', 'Maidenhead', 'Maidstone', 'Maldon', 'Manchester', 'Margate', 'Market Harborough', 'Marlow', 'Melton Mowbray', 'Milton Keynes', 'Minehead', 'Newbury', 'Newcastle upon Tyne', 'Newquay', 'Newry', 'Norwich', 'Nottingham', 'Oakham', 'Oxford', 'Padstow', 'Peak District National Park', 'Penrith', 'Penzance', 'Perth', 'Peterborough', 'Plymouth', 'Poole', 'Portsmouth', 'Preston', 'Ramsgate', 'Reading', 'Reigate', 'Ripon', 'Rochford', 'Rugby', 'Rye', 'Saffron Walden', 'Salcombe', 'Salford', 'Salisbury', 'Scarborough', 'Seaford', 'Sevenoaks', 'Shanklin', 'Sheffield', 'Sheringham', 'Sidmouth', 'Sittingbourne', 'Skegness', 'Skipton', 'Snowdonia National Park', 'Southampton', 'Southend-on-Sea', 'Southwold', 'Spalding', 'St Albans', 'St Andrews', 'St Asaph', 'St Davids', 'St Ives', 'Staines', 'Stamford', 'Stoke-on-Trent', 'Stonehenge', 'Stratford-upon-Avon', 'Sudbury', 'Sunderland', 'Swanage', 'Swansea', 'Tenby', 'The Cotswolds', 'Thetford', 'Torquay', 'Totnes', 'Tring', 'Truro', 'Tunbridge Wells', 'Tynemouth', 'Wakefield', 'Warwick', 'Watford', 'Wells', 'Westminster', 'Weston-super-Mare', 'Weymouth', 'Whitby', 'Whitstable', 'Winchester', 'Windsor', 'Withernsea', 'Witney', 'Woking', 'Wolverhampton', 'Woodstock', 'Worcester', 'Worthing', 'Wrexham', 'Wroxham', 'York'
];

const CityAutocompleteInput: React.FC<CityAutocompleteInputProps> = ({ id, name, value, onChange, label, required }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const fetchApiSuggestions = useCallback(async (query: string): Promise<string[]> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=gb&city=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const apiCityNames = data.map((item: any) => {
        const parts = item.display_name.split(',');
        return parts[0].trim();
      });
      return Array.from(new Set(apiCityNames));
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    // This effect handles the debounced fetching and merging of suggestions
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (inputValue.length > 1) {
      // Immediately filter local list for instant feedback
      const localSuggestions = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(localSuggestions);
      setShowSuggestions(true);

      // Debounce the API call
      debounceTimeout.current = window.setTimeout(async () => {
        setIsLoading(true);
        const apiSuggestions = await fetchApiSuggestions(inputValue);
        setIsLoading(false);
        
        // Merge API results with the current local suggestions
        // Using a functional update to avoid stale state
        setSuggestions(currentSuggestions => {
            const combined = [...apiSuggestions, ...currentSuggestions];
            // Use a Set to ensure uniqueness and preserve order (API results first)
            return [...new Set(combined)];
        });
      }, 300);

    } else {
      // Clear suggestions if input is too short
      setSuggestions([]);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, fetchApiSuggestions]);
  
  // Sync with parent state changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(name, newValue); // Update parent state immediately
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(name, suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (inputValue === '') {
        setSuggestions(POPULAR_CITIES);
        setShowSuggestions(true);
    } else if (suggestions.length > 0) { // re-show suggestions if user clicks back in
        setShowSuggestions(true);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={componentRef}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          required={required}
          className="w-full p-3 pr-10 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
        </div>
      </div>
      {showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 text-black hover:bg-pink-100 cursor-pointer"
                onMouseDown={() => handleSuggestionClick(suggestion)} // use onMouseDown to fire before blur
              >
                {suggestion}
              </li>
            ))
          ) : (
            inputValue.length > 1 && !isLoading && <li className="p-3 text-black">No results found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CityAutocompleteInput;
