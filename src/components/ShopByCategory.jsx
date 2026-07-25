import React, { useEffect, useRef } from 'react';

const ShopByCategory = () => {
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    // 3D Tilt Effect
    cardsRef.current.forEach(card => {
      if (!card) return;

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Parallax shift for internal image
        const img = card.querySelector('.parallax-layer') || card.querySelector('img');
        if (img) {
          const moveX = (x - centerX) / 15;
          const moveY = (y - centerY) / 15;
          img.style.transform = `translate3d(${moveX}px, ${moveY}px, 50px)`;
        }
      };

      const handleMouseLeave = () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        const img = card.querySelector('.parallax-layer') || card.querySelector('img');
        if (img) {
          img.style.transform = `translate3d(0, 0, 0)`;
        }
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup function stored on the card
      card._cleanup = () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Mouse follow spotlight reveal
    const section = sectionRef.current;
    const handleSectionMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);
    };
    if (section) {
      section.addEventListener('mousemove', handleSectionMouseMove);
    }

    // Staggered Scroll Entrance
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    cardsRef.current.forEach((item, i) => {
      if (!item) return;
      item.style.opacity = "0";
      item.style.transform = "translateY(40px)";
      item.style.transition = `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.1}s`;
      observer.observe(item);
    });

    // Cleanup
    return () => {
      cardsRef.current.forEach(card => {
        if (card && card._cleanup) {
          card._cleanup();
        }
      });
      if (section) {
        section.removeEventListener('mousemove', handleSectionMouseMove);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 md:py-[160px] px-margin-mobile md:px-margin-desktop mesh-bg overflow-hidden"
      id="shop-categories"
    >
      <div className="noise-overlay absolute inset-0"></div>
      {/* Animated Background Assets */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">

      </div>
      {/* Section Header */}
      <div className="max-w-container-max mx-auto mb-16 sm:mb-24 md:mb-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-gutter">
          <div className="max-w-2xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-4">Curated Selections</span>
            <h2 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl leading-tight mb-8">
              Shop by <br/><span className="text-secondary-container">Category</span>
            </h2>
          </div>
          <div className="max-w-md pb-6">
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Explore bottles designed for every lifestyle, adventure, and everyday ritual. From precision-engineered steel to intelligent smart hydration.
            </p>
          </div>
        </div>
      </div>
      {/* Categories Bento/Editorial Grid */}
      <div className="max-w-container-max mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Stainless Steel - Large Asymmetric Card */}
          <div
            ref={(el) => cardsRef.current[0] = el}
            className="md:col-span-7 category-item group relative h-[420px] sm:h-[500px] md:h-[600px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-10 md:p-12 flex flex-col justify-between cursor-pointer"
            data-tilt=""
          >
            <div className="relative z-20">
              <span className="font-label-sm text-label-sm px-4 py-2 bg-primary text-white rounded-full">SIGNATURE</span>
              <h3 className="font-headline-lg text-headline-lg mt-6">Stainless Steel</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative w-full h-full floating-element">
                <img 
                  className="w-full h-full object-contain parallax-layer" 
                  alt="A premium matte charcoal stainless steel water bottle floating gracefully against a clean white studio background. The lighting is soft and high-key, highlighting the smooth texture of the metal. Crystal clear water droplets and glass spheres orbit the bottle in a frozen-motion splash effect, creating a sense of liquid purity and high-end industrial design." 
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" 
                  style={{transform: 'translateZ(50px)'}}
                />
                <div className="absolute top-1/4 -right-10 w-24 h-24 glass-card rounded-full flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-primary text-4xl">water_drop</span>
                </div>
              </div>
            </div>
            <div className="relative z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-primary text-white px-8 py-4 rounded-full flex items-center gap-4 hover:scale-105 transition-transform">
                View Collection <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          {/* Insulated - Tall Card */}
          <div
            ref={(el) => cardsRef.current[1] = el}
            className="md:col-span-5 category-item group relative h-[420px] sm:h-[500px] md:h-[600px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-10 md:p-12 cursor-pointer"
            data-tilt=""
          >
            <div className="relative z-20">
              <h3 className="font-headline-lg text-headline-lg">Insulated</h3>
              <p className="font-body-md text-on-surface-variant mt-2">24h Cold / 12h Hot</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                className="w-4/5 h-4/5 object-contain floating-element" 
                src="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80" 
                style={{animationDelay: '-2s'}}
              />
              {/* Decorative liquid ribbon */}
              <div className="absolute inset-0 liquid-ribbon bg-secondary-container rounded-full scale-150 rotate-45 blur-3xl opacity-20"></div>
            </div>
            <div className="absolute bottom-12 right-12 z-20">
              <div className="w-16 h-16 rounded-full bg-white border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">north_east</span>
              </div>
            </div>
          </div>
          {/* Sports Bottles - Medium Horizontal */}
          <div
            ref={(el) => cardsRef.current[2] = el}
            className="md:col-span-5 category-item group relative h-[380px] sm:h-[440px] md:h-[500px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-10 md:p-12 cursor-pointer"
            data-tilt=""
          >
            <div className="relative z-20">
              <h3 className="font-headline-lg text-headline-lg">Sports</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                className="w-3/4 h-3/4 object-contain floating-element" 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80" 
                style={{animationDelay: '-1s'}}
              />
            </div>
            {/* Orbiting Metallic Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 border-[0.5px] border-primary/20 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
          {/* Glass Bottles - Large Feature */}
          <div
            ref={(el) => cardsRef.current[3] = el}
            className="md:col-span-7 category-item group relative h-[380px] sm:h-[440px] md:h-[500px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-10 md:p-12 flex items-end cursor-pointer"
            data-tilt=""
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-80" 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-20 flex justify-between items-end w-full">
              <div>
                <h3 className="font-display-xl-mobile text-[32px] sm:text-headline-lg-mobile md:text-headline-lg font-bold">Glass Collection</h3>
                <p className="font-body-md text-on-surface-variant">Pure taste, zero chemicals.</p>
              </div>
              <span className="font-label-sm uppercase tracking-widest border-b border-primary pb-1">Shop Now</span>
            </div>
          </div>
          {/* Smart Bottles - Wide Glassy Layout */}
          <div
            ref={(el) => cardsRef.current[4] = el}
            className="md:col-span-12 category-item group relative h-[420px] sm:h-[450px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card flex items-center cursor-pointer"
            data-tilt=""
          >
            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full p-6 sm:p-10 md:p-12">
              <div className="flex flex-col justify-center gap-6">
                <span className="font-label-sm text-label-sm tracking-[0.2em] text-secondary">INTELLIGENT HYDRATION</span>
                <h3 className="font-display-xl text-headline-lg-mobile sm:text-headline-lg md:text-display-xl-mobile leading-none">Smart <br/>Series</h3>
                <p className="max-w-xs font-body-md text-on-surface-variant">Real-time hydration tracking with UV-C purification technology integrated into the cap.</p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">bluetooth</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">device_thermostat</span>
                  </div>
                </div>
              </div>
              <div className="relative h-full flex items-center justify-center">
                <img 
                  className="h-[120%] object-contain floating-element relative z-10" 
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"
                />
                {/* Glowing glow background */}
                <div className="absolute inset-0 bg-secondary-container/20 blur-[100px] rounded-full scale-75 animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* Travel & Kids - Two Smaller Squares */}
          <div
            ref={(el) => cardsRef.current[5] = el}
            className="md:col-span-6 category-item group relative h-[320px] sm:h-[380px] md:h-[400px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-8 md:p-10 cursor-pointer"
            data-tilt=""
          >
            <div className="relative z-20">
              <h3 className="font-headline-lg text-headline-lg">Travel</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <img 
                className="w-2/3 h-2/3 object-contain floating-element" 
                alt="A sleek, lightweight travel water bottle with a built-in carabiner and a minimalist carry-handle. The bottle has a soft-touch texture in a serene sage green color. It is shown floating alongside abstract topographic map lines and a light-mode architectural aesthetic, emphasizing movement and journey." 
                src="https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&q=80"
              />
            </div>
          </div>
          <div
            ref={(el) => cardsRef.current[6] = el}
            className="md:col-span-6 category-item group relative h-[320px] sm:h-[380px] md:h-[400px] rounded-[28px] sm:rounded-[40px] overflow-hidden glass-card p-6 sm:p-8 md:p-10 cursor-pointer"
            data-tilt=""
          >
            <div className="relative z-20">
              <h3 className="font-headline-lg text-headline-lg">Kids</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <img 
                className="w-2/3 h-2/3 object-contain floating-element" 
                alt="A playful yet sophisticated kid-sized water bottle in a soft pastel coral shade. The design is durable and leak-proof, featuring a simple silicone straw cap. The bottle is surrounded by floating glass spheres of varying sizes in a bright, clean, minimalist white-themed studio setting that feels friendly but premium." 
                src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=500&q=80"
                style={{animationDelay: '-3s'}}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Drifting droplets and objects */}
      <div className="absolute top-1/4 right-10 w-4 h-4 bg-primary/10 rounded-full blur-sm floating-element"></div>
      <div className="absolute bottom-1/3 left-20 w-8 h-8 bg-secondary-container/20 rounded-full blur-md floating-element" style={{animationDuration: '8s'}}></div>
      <div className="absolute top-1/2 right-[5%] w-16 h-16 glass-card rounded-full blur-[2px] floating-element" style={{animationDelay: '-4s'}}></div>
    </section>
  );
};

export default ShopByCategory;
