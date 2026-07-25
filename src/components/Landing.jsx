import React, { useEffect, useRef, useState } from 'react';

const Landing = () => {
  const bottleWrapRef = useRef(null);
  const headlineRef = useRef(null);
  const spotlightRef = useRef(null);
  const parallaxElementsRef = useRef([]);
  const buttonsRef = useRef([]);
  const buttonListenersRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth) - 0.5;
      const yPos = (clientY / window.innerHeight) - 0.5;

      // Spotlight
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '1';
        spotlightRef.current.style.setProperty('--x', `${clientX}px`);
        spotlightRef.current.style.setProperty('--y', `${clientY}px`);
      }

      // Bottle tilt
      if (bottleWrapRef.current) {
        bottleWrapRef.current.style.transform = `translate(${xPos * 20}px, ${yPos * 20}px) rotateX(${-yPos * 15}deg) rotateY(${xPos * 15}deg)`;
      }

      // Headline parallax
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate(${xPos * -40}px, ${yPos * -40}px)`;
      }

      // Parallax elements
      parallaxElementsRef.current.forEach(el => {
        if (el) {
          const speed = el.getAttribute('data-parallax');
          el.style.transform = `translate(${xPos * speed * 200}px, ${yPos * speed * 200}px)`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    buttonsRef.current.forEach((btn, index) => {
      if (btn) {
        const moveListener = (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        };
        const leaveListener = () => {
          btn.style.transform = 'translate(0, 0) scale(1)';
        };
        buttonListenersRef.current[index] = { move: moveListener, leave: leaveListener };
        btn.addEventListener('mousemove', moveListener);
        btn.addEventListener('mouseleave', leaveListener);
      }
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      buttonsRef.current.forEach((btn, index) => {
        if (btn && buttonListenersRef.current[index]) {
          btn.removeEventListener('mousemove', buttonListenersRef.current[index].move);
          btn.removeEventListener('mouseleave', buttonListenersRef.current[index].leave);
        }
      });
    };
  }, []);

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden perspective-lg pt-28 sm:pt-24 px-margin-mobile md:px-margin-desktop">
      <div className="absolute top-32 left-10 hidden lg:block">
        <span className="font-label-sm text-label-sm text-on-surface-variant opacity-50 tracking-[0.3em]">SINCE 2026</span>
      </div>

      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-0 transition-opacity duration-700"
        style={{ '--x': '50%', '--y': '50%' }}
      >
        <div className="w-full h-full spotlight bg-gradient-to-tr from-secondary-container/40 to-transparent" />
      </div>

      <div className="relative w-full max-w-4xl h-[55vh] sm:h-[60vh] flex items-center justify-center">
        <h1
          ref={headlineRef}
          className="absolute z-0 font-display-xl text-[64px] xs:text-[80px] sm:text-[120px] md:text-[180px] text-center leading-none pointer-events-none select-none text-primary/5 uppercase whitespace-nowrap"
        >
          PURE FLOW
        </h1>

        <div
          ref={bottleWrapRef}
          className="relative z-10 h-full flex items-center justify-center animate-float drop-shadow-[0_35px_35px_rgba(0,0,0,0.05)]"
        >
          <img
            alt="Aura Luxury Bottle"
            className="h-[70%] sm:h-full object-contain transform-gpu hover:scale-105 transition-transform duration-1000 ease-out"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9nLBKsl-c19E6tRq1NQnmcNa3YgQF8DL7syD2RftPkoxWX0pbktY2fZxwncnal-o0nI3vmZ8cidBJEgNtgk3dhmyax-tNtJqWSB7gNl3J93gtjBSYT2YJgVAXinapkRGlEDe6fCavWlCZOel6qBm8kzuVdYzc5jFdbd78cWkj7TNO4Vf3lf_HBDzbwqqgDGYLPQlOzogvnyasqnVLz90V0-8G6W21P8Egdt6UBrhZAQkXO0w5jAX"
          />
        </div>

        {/* Hide floating badges below sm to keep mobile hero clean (still present on tablet/desktop) */}
        <div
          ref={(el) => parallaxElementsRef.current[0] = el}
          data-parallax="0.15"
          className="hidden sm:flex absolute top-[10%] left-[5%] md:left-[15%] z-30 glass-frost px-4 sm:px-6 py-2 sm:py-3 rounded-full items-center gap-2 transform -rotate-6 hover:rotate-0 transition-transform duration-500 cursor-default shadow-lg"
        >
          <span className="material-symbols-outlined text-amber-500 text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-label-sm text-label-sm text-primary">4.9 RATING</span>
        </div>

        <div
          ref={(el) => parallaxElementsRef.current[1] = el}
          data-parallax="0.2"
          className="hidden sm:flex absolute bottom-[20%] right-[0%] md:right-[10%] z-30 glass-frost px-4 sm:px-6 py-2 sm:py-3 rounded-full items-center gap-2 transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default shadow-lg"
        >
          <span className="material-symbols-outlined text-secondary text-[18px] sm:text-[20px]">ac_unit</span>
          <span className="font-label-sm text-label-sm text-primary uppercase">24 Hours Cold</span>
        </div>

        <div
          ref={(el) => parallaxElementsRef.current[2] = el}
          data-parallax="0.1"
          className="hidden sm:flex absolute top-[40%] right-[-2%] md:right-[-2%] z-30 glass-frost px-4 sm:px-6 py-2 sm:py-3 rounded-full items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-default shadow-lg"
        >
          <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">verified</span>
          <span className="font-label-sm text-label-sm text-primary uppercase">BPA FREE</span>
        </div>

        <div
          ref={(el) => parallaxElementsRef.current[3] = el}
          data-parallax="0.25"
          className="hidden sm:flex absolute bottom-[10%] left-[2%] md:left-[8%] z-30 glass-frost px-4 sm:px-6 py-2 sm:py-3 rounded-full items-center gap-2 transform rotate-6 hover:rotate-0 transition-transform duration-500 cursor-default shadow-lg"
        >
          <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">water_drop</span>
          <span className="font-label-sm text-label-sm text-primary uppercase">Leak Proof</span>
        </div>
      </div>

      <div className="relative z-30 flex flex-col items-center mt-8 sm:mt-gutter text-center max-w-2xl px-2">
        <h2 className="font-headline-lg md:font-display-xl text-headline-lg-mobile md:text-display-xl text-primary mb-6">
          Hydration, Reimagined.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
          Crafted from aerospace-grade materials with an unmatched thermal core. Designed for the discerning few.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <button
            ref={(el) => buttonsRef.current[0] = el}
            className="bg-primary text-on-primary px-8 sm:px-10 py-4 sm:py-5 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 hover:shadow-2xl transition-all duration-300 active:scale-95 w-full sm:w-auto text-center"
          >
            Shop Collection
          </button>
          <button
            ref={(el) => buttonsRef.current[1] = el}
            className="px-8 sm:px-10 py-4 sm:py-5 rounded-full font-label-sm text-label-sm uppercase tracking-widest text-primary border border-outline/20 hover:bg-white/50 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto text-center"
          >
            Explore Bottles
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
        <span className="font-label-sm text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </main>
  );
};

export default Landing;
