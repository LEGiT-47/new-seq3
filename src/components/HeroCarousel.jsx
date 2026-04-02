import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const goPrev = useCallback(() => {
    if (!slides?.length) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides, goTo]);

  const goNext = useCallback(() => {
    if (!slides?.length) return;
    goTo((current + 1) % slides.length);
  }, [current, slides, goTo]);

  useEffect(() => {
    if (!slides?.length) return undefined;

    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides, goTo]);

  if (!slides?.length) return null;
  const slide = slides[current];

  return (
    <div className="relative h-[92vh] min-h-[560px] max-h-[780px] w-full overflow-hidden bg-[#0B1D35]">
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.image ? (
            <img
              src={s.image}
              alt=""
              className="h-full w-full object-cover object-center"
              style={{ transform: i === current ? 'scale(1.04)' : 'scale(1)', transition: 'transform 6s ease' }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0B1D35] via-[#1A3555] to-[#0B1D35]">
              <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-10">
                <div className="h-96 w-96 rounded-full border-2 border-[#C9A84C]" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D35]/80 via-[#0B1D35]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1D35]/70 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <div
            className="max-w-2xl"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(16px)' : 'translateY(0)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            {slide.badge && (
              <span className="mb-4 inline-flex items-center rounded-full bg-[#C9A84C]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B1D35] backdrop-blur-sm">
                {slide.badge}
              </span>
            )}

            <h1 className="font-display text-4xl font-normal uppercase tracking-wide leading-none text-white sm:text-5xl lg:text-6xl">
              {slide.title}
              {slide.subtitle && (
                <>
                  <br />
                  <span className="text-[#E8762A]">{slide.subtitle}</span>
                </>
              )}
            </h1>

            {slide.description && (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                {slide.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {slide.ctaButton && (
                <button
                  onClick={slide.ctaButton.onClick}
                  className="rounded-full bg-[#C9A84C] px-7 py-3.5 text-sm font-bold text-[#0B1D35] shadow-strong transition-all duration-200 hover:scale-105 hover:bg-[#DAC06E]"
                >
                  {slide.ctaButton.label} →
                </button>
              )}
              {slide.quoteButton && (
                <button
                  onClick={slide.quoteButton.onClick}
                  className="rounded-full border-2 border-[#C9A84C]/60 bg-[#C9A84C]/10 px-7 py-3.5 text-sm font-bold text-[#F8F4EC] backdrop-blur-sm transition-all duration-200 hover:bg-[#C9A84C]/20"
                >
                  {slide.quoteButton.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/35 bg-black/25 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/45 sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/35 bg-black/25 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/45 sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'h-2 w-8 bg-[#C9A84C]' : 'h-2 w-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 font-mono text-xs text-white/50">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
};

export default HeroCarousel;
