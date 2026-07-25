import React, { useEffect, useRef, useState } from 'react';
import WebGLBackground from '../components/WebGLBackground';

const checkoutFragmentShader = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // AURA Editorial Palette (Surface, Aqua Bloom, Slate)
    vec3 color1 = vec3(0.976, 0.976, 0.976); // #f9f9f9
    vec3 color2 = vec3(0.85, 0.95, 0.98);   // Soft Aqua
    vec3 color3 = vec3(0.94, 0.94, 0.94);   // Platinum
    
    // Smooth, evolving noise for a liquid-metal-meets-water atmosphere
    float noise = sin(uv.x * 2.5 + u_time * 0.1) * cos(uv.y * 3.0 + u_time * 0.12) * 0.12;
    
    // Interactive Water Ripple logic for the Checkout focus
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 22.0 - u_time * 2.5) * exp(-distToMouse * 4.5) * 0.015;
    
    // Volumetric light blooms that move with the narrative flow
    float d1 = distance(uv, vec2(0.15, 0.85) + 0.15 * vec2(sin(u_time * 0.04), cos(u_time * 0.06)));
    float d2 = distance(uv, vec2(0.85, 0.15) + 0.15 * vec2(cos(u_time * 0.08), sin(u_time * 0.05)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(1.0, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.9, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.05, smoothstep(0.3, 0.0, distToMouse) * 0.2);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.01;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const Checkout = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    // Reveal Animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // Simple CountUp for total
    const target = 216.24;
    const duration = 2000;
    
    const animateValue = (start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setTotalValue((progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    setTimeout(() => animateValue(0, target, duration), 500);

    return () => observer.disconnect();
  }, []);

  const handleMagneticHover = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget;
    btn.style.transform = `translate(0, 0)`;
  };

  const handleCTAClick = (e) => {
    const cta = e.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = 'absolute bg-white/20 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping';
    const rect = cta.getBoundingClientRect();
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    ripple.style.left = e.clientX - rect.left + 'px';
    ripple.style.top = e.clientY - rect.top + 'px';
    cta.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  };

  const cardNameDisplay = `${firstName} ${lastName}`.trim() || 'JULIAN VANCE';

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 z-[-2]">
        <WebGLBackground fragmentShader={checkoutFragmentShader} opacity={0.4} className="absolute inset-0 w-full h-full" />
      </div>

      <header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="font-headline-lg text-headline-lg tracking-[0.2em] uppercase text-primary">Hydr8</div>
          <nav className="hidden md:flex space-x-8">
            <a className="text-secondary font-bold border-b-2 border-secondary font-body-md" href="#">Shipping</a>
            <a className="text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity font-body-md" href="#">Payment</a>
            <a className="text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity font-body-md" href="#">Review</a>
          </nav>
          <div className="flex items-center space-x-6">
            <button className="text-primary font-label-sm tracking-widest uppercase hover:scale-105 transition-transform">Boutique</button>
            <div className="relative cursor-pointer hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative pt-32 pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <section className="reveal-up mb-16 text-center md:text-left">
          <h1 className="font-display-xl-mobile sm:text-[64px] md:font-display-xl text-display-xl-mobile md:text-display-xl text-primary leading-tight">
            You're One <br className="hidden md:block"/>Step Away.
          </h1>
          <p className="mt-6 text-on-surface-variant font-body-lg text-body-lg max-w-xl opacity-70">
            Finalize your order for a purer lifestyle. Your selection of Hydr8 hydration systems is almost ready to ship.
          </p>
        </section>

        <section className="reveal-up mb-24 flex items-center justify-center md:justify-start">
          <div className="flex items-center space-x-4 md:space-x-12 relative w-full md:w-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border-2 border-secondary text-secondary shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <span className="mt-2 font-label-sm text-label-sm text-secondary">SHIPPING</span>
            </div>
            <div className="flex-1 h-px checkout-liquid-line min-w-[40px] md:min-w-[100px]"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="mt-2 font-label-sm text-label-sm">PAYMENT</span>
            </div>
            <div className="flex-1 h-px bg-outline-variant/30 min-w-[40px] md:min-w-[100px]"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <span className="mt-2 font-label-sm text-label-sm">REVIEW</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-7 space-y-12">
            <section className="reveal-up">
              <div className="flex items-center space-x-4 mb-8">
                <h2 className="font-headline-lg text-headline-lg">Shipping Details</h2>
              </div>
              <div className="bg-white/40 backdrop-blur-md p-10 rounded-2xl space-y-8 relative overflow-hidden border border-white/50">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-3xl rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input 
                      className="peer checkout-input-float w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" 
                      id="fname" 
                      placeholder=" " 
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label className="absolute left-0 top-3 text-on-surface-variant/50 transition-all duration-300 pointer-events-none font-body-md uppercase text-xs tracking-widest" htmlFor="fname">First Name</label>
                  </div>
                  <div className="relative group">
                    <input 
                      className="peer checkout-input-float w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" 
                      id="lname" 
                      placeholder=" " 
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label className="absolute left-0 top-3 text-on-surface-variant/50 transition-all duration-300 pointer-events-none font-body-md uppercase text-xs tracking-widest" htmlFor="lname">Last Name</label>
                  </div>
                </div>
                <div className="relative group">
                  <input className="peer checkout-input-float w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" id="address" placeholder=" " type="text"/>
                  <label className="absolute left-0 top-3 text-on-surface-variant/50 transition-all duration-300 pointer-events-none font-body-md uppercase text-xs tracking-widest" htmlFor="address">Street Address</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="relative group">
                    <input className="peer checkout-input-float w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" id="city" placeholder=" " type="text"/>
                    <label className="absolute left-0 top-3 text-on-surface-variant/50 transition-all duration-300 pointer-events-none font-body-md uppercase text-xs tracking-widest" htmlFor="city">City</label>
                  </div>
                  <div className="relative group">
                    <input className="peer checkout-input-float w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" id="zip" placeholder=" " type="text"/>
                    <label className="absolute left-0 top-3 text-on-surface-variant/50 transition-all duration-300 pointer-events-none font-body-md uppercase text-xs tracking-widest" htmlFor="zip">Zip Code</label>
                  </div>
                  <div className="relative group col-span-2 md:col-span-1">
                    <select className="w-full bg-transparent border-b-2 border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md text-on-surface-variant">
                      <option>USA</option>
                      <option>Canada</option>
                      <option>UK</option>
                      <option>Germany</option>
                    </select>
                    <label className="absolute left-0 -top-4 text-secondary scale-75 font-body-md uppercase text-xs tracking-widest">Country</label>
                  </div>
                </div>
              </div>
            </section>

            <section className="reveal-up">
              <h2 className="font-headline-lg text-headline-lg mb-8">Delivery Velocity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/40 hover:scale-105 hover:bg-white/60 transition-all duration-500 group cursor-pointer">
                  <div className="mb-4 text-on-surface-variant group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-4xl">eco</span>
                  </div>
                  <h3 className="font-headline-lg text-[18px] mb-1">Standard</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant/60">5-7 Business Days</p>
                  <p className="mt-4 font-headline-lg text-[20px] text-primary">Free</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border-2 border-secondary bg-secondary/5 hover:scale-105 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">POPULAR</div>
                  <div className="mb-4 text-secondary">
                    <span className="material-symbols-outlined text-4xl">bolt</span>
                  </div>
                  <h3 className="font-headline-lg text-[18px] mb-1">Express</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant/60">2-3 Business Days</p>
                  <p className="mt-4 font-headline-lg text-[20px] text-primary">$15.00</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/40 hover:scale-105 hover:bg-white/60 transition-all duration-500 group cursor-pointer">
                  <div className="mb-4 text-on-surface-variant group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                  </div>
                  <h3 className="font-headline-lg text-[18px] mb-1">Next-Day</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant/60">Arrives Tomorrow</p>
                  <p className="mt-4 font-headline-lg text-[20px] text-primary">$35.00</p>
                </div>
              </div>
            </section>

            <section className="reveal-up">
              <h2 className="font-headline-lg text-headline-lg mb-8">Secure Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="checkout-credit-card perspective-1000 h-64 w-full cursor-pointer group">
                  <div className="checkout-credit-card-inner relative w-full h-full">
                    <div className="checkout-front-face absolute inset-0 bg-white/40 backdrop-blur-md p-8 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl border border-white/60">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/40 to-transparent blur-3xl"></div>
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-black/5 backdrop-blur-sm rounded-lg border border-white/20"></div>
                        <div className="font-headline-lg text-lg italic opacity-70">AURA VIP</div>
                      </div>
                      <div className="space-y-4">
                        <div className="font-label-sm text-label-sm tracking-[0.4em] text-on-surface-variant">4532  ••••  ••••  9012</div>
                        <div className="flex justify-between">
                          <div>
                            <div className="text-[8px] uppercase tracking-widest opacity-40">Card Holder</div>
                            <div className="font-label-sm text-xs tracking-widest uppercase">{cardNameDisplay}</div>
                          </div>
                          <div>
                            <div className="text-[8px] uppercase tracking-widest opacity-40">Expires</div>
                            <div className="font-label-sm text-xs tracking-widest uppercase">08 / 28</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="checkout-back-face absolute inset-0 bg-white/40 backdrop-blur-md p-8 rounded-3xl flex flex-col justify-center shadow-2xl border border-white/60">
                      <div className="h-10 w-full bg-black/80 -mx-8"></div>
                      <div className="mt-8 self-end">
                        <div className="text-[8px] uppercase tracking-widest opacity-40 mb-1">CVV</div>
                        <div className="w-16 h-8 bg-white/40 flex items-center justify-center font-label-sm italic tracking-widest">***</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-white/40 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border-2 border-secondary bg-secondary/5 group transition-all">
                    <div className="flex items-center space-x-4">
                      <span className="material-symbols-outlined text-secondary">credit_card</span>
                      <span className="font-body-md font-semibold">Credit Card</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary">radio_button_checked</span>
                  </button>
                  <button className="w-full bg-white/40 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-white/40 opacity-60 hover:opacity-100 transition-all group">
                    <div className="flex items-center space-x-4">
                      <span className="material-symbols-outlined">payments</span>
                      <span className="font-body-md">Digital Wallet</span>
                    </div>
                    <span className="material-symbols-outlined">radio_button_unchecked</span>
                  </button>
                  <button className="w-full bg-white/40 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-white/40 opacity-60 hover:opacity-100 transition-all group">
                    <div className="flex items-center space-x-4">
                      <span className="material-symbols-outlined">account_balance</span>
                      <span className="font-body-md">Bank Transfer</span>
                    </div>
                    <span className="material-symbols-outlined">radio_button_unchecked</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 z-0 opacity-10">
                 <WebGLBackground fragmentShader={checkoutFragmentShader} opacity={1} className="w-full h-full" />
              </div>
              <div className="relative z-10">
                <h3 className="font-headline-lg text-headline-lg mb-8">Summary Sculpture</h3>
                <div className="relative h-80 w-full bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group cursor-crosshair overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                  <img alt="Suspended Aura Bottle" className="h-[80%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU"/>
                  <div className="absolute bottom-4 left-4 font-label-sm text-xs opacity-40 uppercase tracking-tighter">Responsive Interactive Preview</div>
                </div>
                <div className="space-y-4 border-b border-white/30 pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-body-md">Hydr8 Onyx Flask (1.2L)</span>
                    <span className="font-headline-lg text-lg">$189.00</span>
                  </div>
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-on-surface-variant font-body-md">Express Shipping</span>
                    <span className="font-headline-lg text-lg">$15.00</span>
                  </div>
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-on-surface-variant font-body-md">Calculated Tax</span>
                    <span className="font-headline-lg text-lg">$12.24</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <span className="text-on-surface-variant/40 font-label-sm text-xs uppercase tracking-widest">Total Investment</span>
                    <h4 className="font-display-xl text-[32px] sm:text-[40px] md:text-display-xl-mobile text-primary leading-none mt-1">${totalValue.toFixed(2)}</h4>
                  </div>
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white animate-pulse">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                </div>
                
                <button 
                  className="magnetic-button w-full py-6 bg-primary text-white rounded-full font-headline-lg text-lg flex items-center justify-center space-x-3 overflow-hidden relative group shadow-2xl hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  onMouseMove={handleMagneticHover}
                  onMouseLeave={handleMagneticLeave}
                  onMouseDown={handleCTAClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span>Complete Order</span>
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
                <p className="mt-6 text-center text-on-surface-variant/40 font-label-sm text-[10px] uppercase tracking-widest">
                  Secure encrypted checkout powered by Hydr8 Quantum Link
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full font-label-sm text-xs text-on-surface-variant border border-white/60">BPA FREE</div>
              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full font-label-sm text-xs text-on-surface-variant border border-white/60">24H INSULATED</div>
              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full font-label-sm text-xs text-on-surface-variant border border-white/60">CARBON NEUTRAL</div>
              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full font-label-sm text-xs text-on-surface-variant border border-white/60">AEROSPACE GRADE</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
