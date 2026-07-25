import React, { useEffect, useRef, useState } from 'react';

const Statics = () => {
  const [counts, setCounts] = useState({ happy: 0, designs: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardsRef = useRef([]);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          setHasAnimated(true);

          // Count up animation
          const animateCount = (target, duration, setter) => {
            let start = 0;
            const increment = target / (duration / 16);
            const interval = setInterval(() => {
              start += increment;
              if (start >= target) {
                setter(target);
                clearInterval(interval);
              } else {
                setter(Math.ceil(start));
              }
            }, 16);
          };

          animateCount(10, 2000, (v) => setCounts(prev => ({ ...prev, happy: v })));
          animateCount(50, 2000, (v) => setCounts(prev => ({ ...prev, designs: v })));
        }
      });
    }, { threshold: 0.2 });

    cardsRef.current.forEach(card => {
      if (card && observerRef.current) {
        observerRef.current.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card && observerRef.current) {
          observerRef.current.unobserve(card);
        }
      });
    };
  }, [hasAnimated]);

  const handleCardMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(64, 194, 253, 0.15), rgba(255, 255, 255, 0.4))`;
  };

  const handleCardMouseLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.background = 'rgba(255, 255, 255, 0.4)';
  };

  return (
    <section className="relative z-20 py-32 overflow-hidden" id="trusted-section">
      <video playsInline autoPlay loop>
        <source src='' type="video/mp4"/>
      </video>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
        <div className="grid grid-cols-12 gap-y-12 md:gap-y-0 h-auto md:h-[600px] perspective-lg">
          <div
            ref={(el) => cardsRef.current[0] = el}
            className="trusted-card col-span-12 md:col-span-4 self-start md:mt-20 stagger-in"
            style={{ transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s' }}
          >
            <div
              className="glass-frost rounded-[32px] p-10 trusted-glow transform-gpu transition-all duration-500 hover:scale-[1.02] cursor-default border border-white/40 shadow-xl flex flex-col gap-4"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            >
              <span className="material-symbols-outlined text-secondary-container text-4xl">auto_awesome</span>
              <div>
                <div className="font-display-xl text-[44px] sm:text-[56px] md:text-[64px] font-bold text-primary leading-tight flex items-baseline">
                  <span>{counts.happy}</span>K+
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Happy Customers</p>
              </div>
            </div>
          </div>

          <div
            ref={(el) => cardsRef.current[1] = el}
            className="trusted-card col-span-12 md:col-span-3 md:col-start-6 self-center stagger-in"
            style={{ transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s' }}
          >
            <div
              className="glass-frost rounded-[32px] p-8 trusted-glow transform-gpu transition-all duration-500 hover:scale-[1.02] cursor-default border border-white/40 shadow-xl flex flex-col gap-4"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">fluid_med</span>
              <div>
                <div className="font-display-xl text-[40px] sm:text-[48px] md:text-[56px] font-bold text-primary leading-tight flex items-baseline">
                  <span>{counts.designs}</span>+
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Exclusive Designs</p>
              </div>
            </div>
          </div>

          <div
            ref={(el) => cardsRef.current[2] = el}
            className="trusted-card col-span-12 md:col-span-3 md:col-start-2 self-end md:mb-12 stagger-in"
            style={{ transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s' }}
          >
            <div
              className="glass-frost rounded-[32px] p-8 trusted-glow transform-gpu transition-all duration-500 hover:scale-[1.02] cursor-default border border-white/40 shadow-xl flex flex-col items-center text-center gap-4"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            >
              <span className="material-symbols-outlined text-emerald-500 text-3xl">eco</span>
              <div>
                <div className="font-display-xl text-[40px] sm:text-[48px] md:text-[56px] font-bold text-primary leading-tight">SAFE</div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">100% BPA FREE</p>
              </div>
            </div>
          </div>

          <div
            ref={(el) => cardsRef.current[3] = el}
            className="trusted-card col-span-12 md:col-span-4 md:col-start-9 self-center md:mt-40 stagger-in"
            style={{ transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.7s' }}
          >
            <div
              className="glass-frost rounded-[32px] p-10 trusted-glow transform-gpu transition-all duration-500 hover:scale-[1.02] cursor-default border border-white/40 shadow-xl flex flex-col gap-4"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            >
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary text-4xl">local_shipping</span>
                <span className="material-symbols-outlined text-primary/10 text-5xl md:text-6xl">north_east</span>
              </div>
              <div>
                <div className="font-display-xl text-[40px] sm:text-[48px] md:text-[56px] font-bold text-primary leading-tight uppercase">Fast</div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Worldwide Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statics;
