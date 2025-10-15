
import React, { useState, useEffect } from 'react';
import { LOADING_ITEMS } from '../constants';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Cauldron: React.FC = () => (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
        <div className="absolute inset-0 bg-gray-800 rounded-full transform -skew-y-6"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 md:w-96 md:h-24 bg-gray-700 rounded-t-full border-8 border-gray-800"></div>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 h-60 md:w-72 md:h-72 bg-green-500 rounded-full overflow-hidden">
            <div className="absolute w-full h-full bg-green-400 opacity-50 animate-pulse rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-300 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>
    </div>
);

interface AnimatedItem {
    id: number;
    text: string;
    style: string;
}

const LoadingScreen: React.FC = () => {
    const [items, setItems] = useState<AnimatedItem[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomItem = LOADING_ITEMS[Math.floor(Math.random() * LOADING_ITEMS.length)];
            const randomAnim = Math.ceil(Math.random() * 4);

            const newItem: AnimatedItem = {
                id: Date.now() + Math.random(),
                text: randomItem,
                style: `animate-fly-${randomAnim}`,
            };

            setItems(prevItems => [...prevItems, newItem]);

            // Clean up old items to prevent memory leaks
            setTimeout(() => {
                setItems(currentItems => currentItems.filter(item => item.id !== newItem.id));
            }, 3000);

        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 overflow-hidden">
            <div className="relative flex items-center justify-center w-full h-96">
                {items.map(item => (
                    <div key={item.id} className={`absolute text-white font-bold text-lg p-2 bg-black/30 rounded-lg ${item.style}`}>
                        {item.text}
                    </div>
                ))}
                <Cauldron />
            </div>
            <div className="text-center text-white mt-12">
                <h2 className="text-4xl font-bold animate-pulse">Brewing up the perfect trip...</h2>
                <div className="flex justify-center space-x-4 mt-4">
                    <HeartIcon className="w-8 h-8 text-pink-300" />
                    <HeartIcon className="w-8 h-8 text-blue-300" />
                    <HeartIcon className="w-8 h-8 text-green-300" />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
