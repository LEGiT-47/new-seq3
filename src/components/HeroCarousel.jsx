import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';
import AutoPlay from 'embla-carousel-autoplay';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

const HeroCarousel = ({ slides = [] }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api]);

  if (!slides || slides.length === 0) {
    return null;
  }

  if (slides.length === 1) {
    const slide = slides[0];
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${slide.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 text-center text-white w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {slide.badge && (
            <Badge className="mb-4 sm:mb-6 bg-gradient-primary border-0 text-primary-foreground text-xs sm:text-sm">
              {slide.badge}
            </Badge>
          )}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            {slide.title}
            {slide.subtitle && <span className="block text-primary-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{slide.subtitle}</span>}
          </h1>
          {slide.description && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
              {slide.description}
            </p>
          )}
          {(slide.ctaButton || slide.quoteButton) && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up w-full">
              {slide.ctaButton && (
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
                  onClick={slide.ctaButton.onClick}
                >
                  {slide.ctaButton.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              {slide.quoteButton && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
                  onClick={slide.quoteButton.onClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {slide.quoteButton.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          startIndex: 0,
          align: 'start',
        }}
        plugins={[
          AutoPlay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-screen relative pl-0">
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${slide.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 z-10 h-full flex items-center justify-center text-center text-white w-full">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  {slide.badge && (
                    <Badge className="mb-6 bg-gradient-primary border-0 text-primary-foreground">
                      {slide.badge}
                    </Badge>
                  )}
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
                    {slide.title}
                    {slide.subtitle && <span className="block text-primary-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{slide.subtitle}</span>}
                  </h1>
                  {slide.description && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
                      {slide.description}
                    </p>
                  )}
                  {(slide.ctaButton || slide.quoteButton) && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up w-full">
                      {slide.ctaButton && (
                        <Button
                          size="lg"
                          className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
                          onClick={slide.ctaButton.onClick}
                        >
                          {slide.ctaButton.label}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      )}
                      {slide.quoteButton && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
                          onClick={slide.quoteButton.onClick}
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          {slide.quoteButton.label}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 sm:left-4 md:left-8 h-10 w-10 sm:h-11 sm:w-11" />
        <CarouselNext className="right-2 sm:right-4 md:right-8 h-10 w-10 sm:h-11 sm:w-11" />

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`rounded-full transition-all ${
                index === current ? 'bg-white h-2 w-8 sm:h-3 sm:w-10' : 'bg-white/50 h-2 w-2 sm:h-3 sm:w-3 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
