import React, { createContext, useContext, useState } from 'react';

const OccasionContext = createContext();

// Define active occasions
export const OCCASIONS = {
  valentine: {
    id: 'valentine',
    name: "Valentine's Special",
    description: 'Premium gifting for your loved ones',
    bgColor: 'from-pink-500 to-red-500',
    textColor: 'text-pink-700',
    emoji: '💕',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-02-28'),
    products: [37, 38, 39, 40, 41, 42, 43], // Gifting products
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali Special',
    description: 'Festival gifts and festive delicacies',
    bgColor: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-700',
    emoji: '🪔',
    startDate: new Date('2026-10-25'),
    endDate: new Date('2026-11-30'),
    products: [15, 16, 18, 19, 20], // Jaggery coated items
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas Special',
    description: 'Festive treats and gift hampers',
    bgColor: 'from-red-500 to-green-500',
    textColor: 'text-red-700',
    emoji: '🎄',
    startDate: new Date('2026-11-01'),
    endDate: new Date('2026-12-31'),
    products: [1, 2, 3, 4, 5, 6, 7, 8], // Chocolate products
  },
  newYear: {
    id: 'new-year',
    name: 'New Year Treats',
    description: 'Start the year with premium nuts and gifts',
    bgColor: 'from-purple-500 to-blue-500',
    textColor: 'text-purple-700',
    emoji: '🎉',
    startDate: new Date('2026-12-25'),
    endDate: new Date('2027-01-31'),
    products: [21, 22, 23, 25, 26, 27], // Dry fruits
  },
};

// Determine active occasion based on current date
const getActiveOccasion = () => {
  const now = new Date();

  for (const occasion of Object.values(OCCASIONS)) {
    if (now >= occasion.startDate && now <= occasion.endDate) {
      return occasion;
    }
  }

  return null;
};

export const OccasionProvider = ({ children }) => {
  const [activeOccasion, setActiveOccasion] = useState(getActiveOccasion());

  const changeOccasion = (occasionId) => {
    if (OCCASIONS[occasionId]) {
      setActiveOccasion(OCCASIONS[occasionId]);
    }
  };

  const getOccasionProducts = () => {
    return activeOccasion.products;
  };

  return (
    <OccasionContext.Provider
      value={{
        activeOccasion,
        changeOccasion,
        getOccasionProducts,
        allOccasions: OCCASIONS,
      }}
    >
      {children}
    </OccasionContext.Provider>
  );
};

export const useOccasion = () => {
  const context = useContext(OccasionContext);
  if (!context) {
    throw new Error('useOccasion must be used within OccasionProvider');
  }
  return context;
};
