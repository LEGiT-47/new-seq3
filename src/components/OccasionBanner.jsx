import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useOccasion } from '../context/OccasionContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const OccasionBanner = () => {
  const navigate = useNavigate();
  const { activeOccasion } = useOccasion();

  if (!activeOccasion) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r ${activeOccasion.bgColor} text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 rounded-lg overflow-hidden relative`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-10 text-6xl">
        {activeOccasion.emoji}
      </div>
      <div className="absolute bottom-0 left-0 opacity-10 text-6xl">
        {activeOccasion.emoji}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Limited Time Offer</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
          {activeOccasion.name}
        </h2>

        <p className="text-base sm:text-lg opacity-95 mb-6 max-w-2xl">
          {activeOccasion.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
            onClick={() => navigate('/gifting')}
          >
            Shop Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <p className="text-sm opacity-90">
            Premium gifting solutions and festive special products
          </p>
        </div>
      </div>
    </div>
  );
};

export default OccasionBanner;
