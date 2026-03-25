import React from 'react';

const AnnouncementBar = () => {
  const items = [
    'Now Delivering in Mumbai & Goa',
    'Custom Gifting Available',
    'Free Shipping above Rs. 499',
    '100% Natural Ingredients',
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#E8762A] text-white border-b border-[#D56B23] overflow-hidden">
      <div className="whitespace-nowrap py-2 text-sm font-medium">
        <div className="marquee-track inline-flex min-w-full animate-[marquee_22s_linear_infinite]">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="mx-6 inline-flex items-center gap-2">
              <span>•</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
