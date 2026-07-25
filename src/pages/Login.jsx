import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const magneticElementsRef = useRef([]);
    const cursorRef = useRef(null);
    const [emailValue, setEmailValue] = useState('');
    const [submitState, setSubmitState] = useState('initial'); // initial, loading, success

    useEffect(() => {
        // Cursor spotlight
        const handleMouseMove = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = e.clientX + 'px';
                cursorRef.current.style.top = e.clientY + 'px';
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Magnetic hover
        magneticElementsRef.current.forEach(el => {
            if (!el) return;
            const handleElMouseMove = (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
            };
            const handleElMouseLeave = () => {
                el.style.transform = `translate(0, 0) scale(1)`;
            };
            el.addEventListener('mousemove', handleElMouseMove);
            el.addEventListener('mouseleave', handleElMouseLeave);
            el._cleanup = () => {
                el.removeEventListener('mousemove', handleElMouseMove);
                el.removeEventListener('mouseleave', handleElMouseLeave);
            };
        });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            magneticElementsRef.current.forEach(el => {
                if (el && el._cleanup) {
                    el._cleanup();
                }
            });
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitState('loading');
        setTimeout(() => {
            setSubmitState('success');
        }, 1500);
    };

    return (
        <>
            <div ref={cursorRef} className="cursor-spotlight fixed inset-0 z-50 pointer-events-none w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2" style={{
                background: 'radial-gradient(circle, rgba(0, 102, 138, 0.05) 0%, rgba(255, 255, 255, 0) 70%)'
            }} />

            <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 h-screen w-full overflow-hidden mt-30">
                {/* Left Side: Brand Storytelling */}
                <section className="hidden md:flex flex-col justify-center px-margin-desktop bg-surface-dim/20 relative">
                    <div className="entrance-stagger space-y-8 max-w-lg z-20">
                        <div className="space-y-4">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.3em]">Excellence</span>
                            <h1 className="font-display-xl text-display-xl text-primary leading-tight">Welcome Back.</h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                                Every journey begins with a single drop. Continue exploring thoughtfully crafted hydration experiences designed for modern living.
                            </p>
                        </div>
                    </div>
                    {/* Floating Product Reveal */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bottle-container w-[400px] h-[600px] relative bottle-float">
                            {/* The bottle visual referencing image_10 */}
                            <img
                                alt="Aura Bottle"
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000"
                                src="https://lh3.googleusercontent.com/aida/AP1WRLvJtefOL_w7p-Ze1noNSIp75iK6FsstnSHKRmEKTWKDC0rktIfCvT7wbbjBDZWBF70L8Ianfp2G9D_qekKzl-aiYbQZHJixswbDdrtyO2_n0TT5DA3O-cpBgXD2qBXJTx3O2kxdMV1irX32auWyBNe-rxgW2B6O3Ykt7pzPjMNcDplwH-IDHuYoIAngsO3xnfD-jJLbFrhXSeuZxpk-EJDdJlJYSIGIDO5vjQ2WCHCB0sni5GkP-D8cEpc"
                            />
                            {/* Decorative Fluid Element Behind Bottle */}
                            <div className="absolute inset-0 -z-10 opacity-40 blur-3xl bg-secondary rounded-full transform scale-75 animate-pulse"></div>
                            {/* Water Fill Effect Logic */}
                            <div
                                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 bg-secondary/20 blur-md water-fill rounded-b-xl"
                                style={{ height: `${Math.min((emailValue.length / 30) * 100, 75)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="absolute bottom-12 left-margin-desktop font-label-sm text-label-sm text-on-primary-container">
                        HYDR8 LIQUID PURITY — 2024
                    </div>
                </section>
                {/* Right Side: Authentication */}
                <section className="flex items-center justify-center px-margin-mobile md:px-margin-desktop relative">
                    {/* Logo Floating Top Center on Mobile */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 md:left-margin-desktop md:translate-x-0 font-display-xl-mobile text-display-xl-mobile font-bold text-primary tracking-tighter entrance-stagger" style={{ animationDelay: '0.1s' }}>
                        Hydr8
                    </div>
                    {/* Login Panel */}
                    <div className="glass-panel w-full max-w-md p-10 md:p-14 rounded-3xl entrance-stagger" style={{ animationDelay: '0.2s' }}>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Sign In</h2>
                                <p className="font-body-md text-on-surface-variant">
                                    Access your account to manage orders and discover exclusive collections.
                                </p>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2 group">
                                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                                    <input
                                        className="glass-input w-full px-6 py-4 rounded-xl font-body-md text-on-surface"
                                        id="email"
                                        placeholder="name@atelier.aura"
                                        required
                                        type="email"
                                        value={emailValue}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                                        <Link className="font-label-sm text-label-sm text-secondary hover:opacity-70 transition-opacity" to="/forgot-password">Forgot?</Link>
                                    </div>
                                    <input
                                        className="glass-input w-full px-6 py-4 rounded-xl font-body-md text-on-surface"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                    />
                                </div>
                                <button
                                    className="magnetic-hover light-sweep w-full py-5 bg-primary text-on-primary rounded-xl font-body-md font-semibold tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                                    type="submit"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                >
                                    {submitState === 'initial' && (
                                        <>
                                            <span>Continue Journey</span>
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </>
                                    )}
                                    {submitState === 'loading' && (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    )}
                                    {submitState === 'success' && (
                                        <>
                                            <span className="material-symbols-outlined">done</span>
                                            <span>Authenticated</span>
                                        </>
                                    )}
                                </button>
                            </form>
                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-black/5"></div>
                                <span className="flex-shrink mx-4 font-label-sm text-label-sm text-on-primary-container">OR</span>
                                <div className="flex-grow border-t border-black/5"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className="magnetic-hover glass-input flex items-center justify-center py-4 rounded-xl hover:bg-white/60"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                >
                                    <img
                                        alt="Google"
                                        className="w-5 h-5 mr-3"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqIWi5z4GRlS5GIuiwUlvofhqnzklrHo-P2EIL_f2MxaV3JjZhRL58mPNqxGYXkATLPKKtjiOJ7G14Z_tht_rycCib__vQlGjI_V3qTnf_KudpsppbXG-IRuxlLvUsh4xJdFfugSglc52nHdDyjRBxlUd2HWjM5T5VodcBNG3ofA6KxwqLB5twfVh1WlmZPSG19GTuhBdcRwaVYumUy5t_JxjhNArGTFlWVoQo0TvhaVRUdRYiTcOV5"
                                    />
                                    <span className="font-label-sm text-label-sm">Google</span>
                                </button>
                                <button
                                    className="magnetic-hover glass-input flex items-center justify-center py-4 rounded-xl hover:bg-white/60"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                >
                                    <span className="material-symbols-outlined mr-3 text-[20px]">apps</span>
                                    <span className="font-label-sm text-label-sm">Apple</span>
                                </button>
                            </div>
                            <p className="text-center font-body-md text-on-surface-variant">
                                New to the experience? <Link className="text-primary font-semibold underline decoration-secondary/30 underline-offset-4" to="/signup">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;
