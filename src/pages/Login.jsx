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
                                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"
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
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
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
