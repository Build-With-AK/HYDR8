import React, { useEffect, useRef, useState } from 'react';

const CTABanner = () => {
    const magneticElementsRef = useRef([]);
    const bottleRef = useRef(null);
    const revealRef = useRef(null);

    useEffect(() => {
        // Reveal animation
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('h1, p, div');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);
        if (revealRef.current) observer.observe(revealRef.current);

        // Magnetic hover for button
        const btn = magneticElementsRef.current[0];
        if (btn) {
            const handleMouseMove = (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
            };
            const handleMouseLeave = () => {
                btn.style.transform = 'translate(0, 0) scale(1)';
            };
            btn.addEventListener('mousemove', handleMouseMove);
            btn.addEventListener('mouseleave', handleMouseLeave);
        }

        // Scroll parallax for bottle
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            if (bottleRef.current) {
                bottleRef.current.style.transform = `translateY(${scrolled * 0.15}px) rotate(${scrolled * 0.02}deg)`;
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-24 sm:py-32 md:py-40">
            <div className="absolute inset-0 z-0 pointer-events-none noise-texture"></div>
            <div className="relative z-20 container max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
                <div className="mb-12 relative group cursor-pointer w-full max-w-2xl">
                    <img
                        ref={bottleRef}
                        className="w-full h-auto object-contain floating-bottle drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-1000 group-hover:scale-105"
                        alt="A hyper-realistic 3D render of a matte charcoal AURA hydration bottle"
                        src="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80"
                    />
                </div>
                <div ref={revealRef} className="max-w-4xl space-y-8" id="reveal-content">
                    <h1 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl text-primary tracking-tight leading-none opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                        Stay Hydrated <br /> <span className="text-secondary italic">Everywhere.</span>
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-0 translate-y-10 transition-all duration-1000 delay-200 ease-out">
                        Engineered for molecular purity. Our signature matte charcoal finish meets aerospace-grade thermal insulation for a sensory experience that redefines the essence of water.
                    </p>
                    <div className="pt-10 opacity-0 translate-y-10 transition-all duration-1000 delay-500 ease-out">
                        <button
                            ref={(el) => (magneticElementsRef.current[0] = el)}
                            className="magnetic-hover glass-panel px-12 py-5 rounded-full font-label-sm text-label-sm uppercase tracking-widest text-primary hover:bg-white hover:border-transparent transition-all shadow-xl shadow-black/5"
                        >
                            Shop Collection
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-20 left-margin-desktop hidden lg:block opacity-30">
                <span className="font-label-sm text-label-sm uppercase rotate-90 origin-left inline-block tracking-widest">
                    Liquid Precision — v.2024
                </span>
            </div>
        </section>
    );
};

export default CTABanner;
