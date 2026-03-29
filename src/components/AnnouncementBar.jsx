import React from 'react';

const messages = [
  '🚚 Delivering across Mumbai & Goa',
  '🎁 Custom Corporate Gifting Available',
  '📦 Free Shipping above ₹499',
  '🌿 100% Natural Ingredients',
  '⚡ Fresh stock every week',
];

const AnnouncementBar = () => (
  <div className="sticky top-0 z-50 overflow-hidden bg-[#1A0A00] py-2 text-sm text-white">
    <div
      className="flex w-max gap-12 whitespace-nowrap"
      style={{
        animation: 'marquee 28s linear infinite',
      }}
    >
      {[...messages, ...messages].map((msg, i) => (
        <span key={i} className="mx-6 font-medium tracking-wide">{msg}</span>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export default AnnouncementBar;
