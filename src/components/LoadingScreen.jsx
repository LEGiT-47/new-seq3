import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ minDuration = 500 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const finalPause = 200; // ms to keep the completed state visible

  useEffect(() => {
    startTimeRef.current = Date.now();
    let timer = null;
    let hideTimer = null;

    const finishAndHide = () => {
      setProgress(100);
      hideTimer = setTimeout(() => setIsVisible(false), finalPause);
    };

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDuration - elapsedTime);
      if (remainingTime > 0) {
        timer = setTimeout(() => finishAndHide(), remainingTime);
      } else {
        finishAndHide();
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, [minDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let rafId;
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / minDuration) * 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, minDuration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[hsl(40_55%_85%)] via-gradient-warm to-[hsl(43_96%_97%)] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          style={{
            animation: 'float 10s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo Container */}
        <div className="mb-12 relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer rotating ring with gradient */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary"
              style={{
                animation: 'spin 2.5s linear infinite'
              }}
            />
            
            {/* Middle pulsing ring */}
            <div 
              className="absolute inset-3 rounded-full border-2 border-transparent border-b-accent border-l-accent"
              style={{
                animation: 'spin 3.5s linear infinite reverse'
              }}
            />
            
            {/* Inner rotating ring */}
            <div 
              className="absolute inset-6 rounded-full border-2 border-primary/30"
              style={{
                animation: 'spin 1.5s linear infinite'
              }}
            />
            
            {/* Center circle with gradient and glow */}
            <div className="absolute inset-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-display text-3xl font-bold animate-pulse">S</span>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  animation: `orbit 6s linear infinite`,
                  animationDelay: `${i * 1.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Text Content with animations */}
        <div className="animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Sequeira Foods
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Loading premium delicacies...
          </p>
        </div>

        {/* Enhanced Loading Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              style={{
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center">
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
