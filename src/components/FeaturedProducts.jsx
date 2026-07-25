import React, { useEffect, useRef } from 'react';

const FeaturedProducts = () => {
    const tiltCardsRef = useRef([]);
    const magneticButtonsRef = useRef([]);
    const floatElementsRef = useRef([]);

    useEffect(() => {
        // Tilt Effect for Cards
        const tiltCards = tiltCardsRef.current.filter(Boolean);
        tiltCards.forEach(card => {
            const handleTiltMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            };

            const handleTiltMouseLeave = () => {
                card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            };

            card.addEventListener('mousemove', handleTiltMouseMove);
            card.addEventListener('mouseleave', handleTiltMouseLeave);

            card._cleanup = () => {
                card.removeEventListener('mousemove', handleTiltMouseMove);
                card.removeEventListener('mouseleave', handleTiltMouseLeave);
            };
        });

        // Magnetic Hover Effect for Buttons
        const magneticButtons = magneticButtonsRef.current.filter(Boolean);
        magneticButtons.forEach(button => {
            const handleMagneticMouseMove = (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            };

            const handleMagneticMouseLeave = () => {
                button.style.transform = 'translate(0, 0)';
            };

            button.addEventListener('mousemove', handleMagneticMouseMove);
            button.addEventListener('mouseleave', handleMagneticMouseLeave);

            button._cleanup = () => {
                button.removeEventListener('mousemove', handleMagneticMouseMove);
                button.removeEventListener('mouseleave', handleMagneticMouseLeave);
            };
        });

        // Staggered Scroll Reveal
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach((el, i) => {
            el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
            el.style.transitionDelay = `${i * 100}ms`;
            observer.observe(el);
        });

        // Parallax Effect on Scroll
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            floatElementsRef.current.filter(Boolean).forEach(el => {
                const speed = 0.05;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            tiltCards.forEach(card => {
                if (card._cleanup) {
                    card._cleanup();
                }
            });
            magneticButtons.forEach(button => {
                if (button._cleanup) {
                    button._cleanup();
                }
            });
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Editorial Intro */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-20 sm:mb-32 md:mb-40">
                <div className="flex flex-col md:flex-row items-baseline gap-6 sm:gap-8">
                    <h1 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl max-w-4xl reveal-up">
                        Featured<br /><span className="opacity-30">Products</span>
                    </h1>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-[0.2em] md:translate-y-8 reveal-up">
                        A curated synthesis of fluid physics and structural purity.
                    </p>
                </div>
            </section>
            {/* Product Gallery - Broken Layout */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
                {/* Hero Feature Item */}
                <div className="relative w-full md:w-3/4 ml-auto mb-32 sm:mb-48 md:mb-64 perspective-lg">
                    <div className="absolute -top-20 -left-20 sm:-top-32 sm:-left-32 w-64 h-64 sm:w-96 sm:h-96 bg-secondary-container/20 blur-[120px] rounded-full animate-pulse" />
                    <div ref={(el) => (tiltCardsRef.current[0] = el)} className="tilt-card group cursor-pointer">
                        <div className="relative overflow-hidden rounded-3xl">
                            <img
                                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                src="https://lh3.googleusercontent.com/aida/AP1WRLshNgivYSYBVpscY7FkU7-dZ73U6UlwBNJ4KKv1u1zKBS8jEaivlRImUlN9zm08zAO7nsTyIdXDCD0xxOir35k4388uOkTAoju6x5pPIgwVr3kn9PTvSEpu2GsVr6GXxi0mcJcu6sY2HIwRvryxzQKKqR7bcyGegRN1Wp3XXaGgSb3gzJsGDoPUFBOtkdxsN5oeGhKERfaJyDUctpp39YrLM0F10AaJkVPp6U5BXrE-UjSkuz4qxBaLviY"
                                alt="Aura Hydro Pure"
                            />
                            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 glass-frost p-5 sm:p-6 md:p-8 rounded-2xl max-w-[80%] sm:max-w-xs group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700">
                                <span className="font-label-sm uppercase tracking-widest text-secondary block mb-2">
                                    Signature Series
                                </span>
                                <h3 className="font-headline-lg text-headline-lg text-primary mb-4">
                                    Aura Hydro Pure
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="font-display-xl text-[24px] text-primary">$180</span>
                                    <button ref={(el) => (magneticButtonsRef.current[0] = el)} className="bg-primary text-on-primary p-3 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined">arrow_outward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Orbiting Element */}
                    <div
                        ref={(el) => (floatElementsRef.current[0] = el)}
                        className="absolute -bottom-12 -right-6 sm:-bottom-20 sm:-right-20 w-40 h-40 sm:w-52 md:w-64 md:h-64 glass-frost rounded-full flex items-center justify-center animate-float z-20"
                    >
                        <div className="text-center p-4 sm:p-6 md:p-8">
                            <span
                                className="material-symbols-outlined text-[32px] sm:text-[40px] md:text-[48px] text-secondary mb-2"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                water_drop
                            </span>
                            <p className="font-label-sm uppercase text-[9px] sm:text-[10px] tracking-tighter">
                                BPA FREE • INSULATED
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-24 md:gap-32 items-start">
                    {/* Tech Accent Item */}
                    <div className="relative md:mt-32 reveal-up">
                        <div ref={(el) => (tiltCardsRef.current[1] = el)} className="tilt-card group cursor-pointer">
                            <div className="relative rounded-[4rem] overflow-hidden aspect-[3/4]">
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida/AP1WRLt9irAtW3pyn97MQH4QlTFVSsaahqZbK5F5nMT9UHmSgql1BVt8XOYNBWXyPpb9epTz3wm0XT8DH_yqlLYEe3jNO7yZSpJEnpwH9FNkAnbD6o9uEDK1sIB2rwtAFn0y8hhRJKNQ6J4oQ_n3pa3psyHSWYVYv1aSezkHL75Xqk8b3je7LIFI7Mfosm5Yb07DTauTlrmsCSNs-olLlNAnnUUkqhGwzfgQ0zFdO99AN7p3-4246h3RtViuCA"
                                    alt="Cyber Steel V.2"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-8 left-8 right-8 glass-frost p-6 rounded-3xl transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <h4 className="font-headline-lg text-[24px] text-primary">
                                        Cyber Steel V.2
                                    </h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="px-3 py-1 bg-primary text-on-primary font-label-sm text-[10px] rounded-full">
                                            LIMITED EDITION
                                        </span>
                                        <span className="font-label-sm text-on-surface-variant">$240</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Premium Classic Item */}
                    <div className="relative md:-mt-64 mt-0 reveal-up">
                        <div
                            ref={(el) => (floatElementsRef.current[1] = el)}
                            className="absolute -right-6 sm:-right-12 top-1/2 w-32 h-32 sm:w-48 sm:h-48 border border-outline-variant/30 rounded-full animate-float"
                            style={{ animationDelay: '-2s' }}
                        />
                        <div ref={(el) => (tiltCardsRef.current[2] = el)} className="tilt-card group cursor-pointer">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    src="https://lh3.googleusercontent.com/aida/AP1WRLvJtefOL_w7p-Ze1noNSIp75iK6FsstnSHKRmEKTWKDC0rktIfCvT7wbbjBDZWBF70L8Ianfp2G9D_qekKzl-aiYbQZHJixswbDdrtyO2_n0TT5DA3O-cpBgXD2qBXJTx3O2kxdMV1irX32auWyBNe-rxgW2B6O3Ykt7pzPjMNcDplwH-IDHuYoIAngsO3xnfD-jJLbFrhXSeuZxpk-EJDdJlJYSIGIDO5vjQ2WCHCB0sni5GkP-D8cEpc"
                                    alt="Matte Obsidian"
                                />
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] glass-frost p-8 rounded-full flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div>
                                        <h4 className="font-headline-lg text-[20px] text-primary leading-none">
                                            Matte Obsidian
                                        </h4>
                                        <p className="font-label-sm text-[11px] uppercase mt-1 opacity-60">
                                            Best Seller
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Floating 3D Elements */}
                <div className="absolute top-1/4 right-0 pointer-events-none opacity-40">
                    <div
                        ref={(el) => (floatElementsRef.current[2] = el)}
                        className="w-40 h-40 border-2 border-outline rounded-full transform rotate-45 animate-float"
                    />
                </div>
                <div className="absolute bottom-1/4 left-0 pointer-events-none opacity-20">
                    <div
                        ref={(el) => (floatElementsRef.current[3] = el)}
                        className="w-72 h-72 border border-secondary rounded-full animate-float"
                        style={{ animationDuration: '12s' }}
                    />
                </div>
            </section>
            {/* Newsletter / Editorial Glass CTA */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-32 sm:mt-48 md:mt-64 reveal-up">
                <div className="glass-frost rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] p-8 sm:p-16 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-secondary-container/10 blur-3xl rounded-full" />
                    <h2 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl mb-6 md:mb-8">
                        Join the Liquid Era
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-12 px-2">
                        Subscribe to receive early access to limited edition drops and curated artistry journals from our curators.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                        <input
                            className="flex-grow bg-white/20 border-b border-primary/20 focus:border-primary px-6 py-4 font-label-sm outline-none transition-all"
                            placeholder="YOUR EMAIL ADDRESS"
                            type="email"
                        />
                        <button
                            ref={(el) => (magneticButtonsRef.current[1] = el)}
                            className="bg-primary text-on-primary px-10 py-4 font-label-sm uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturedProducts;
