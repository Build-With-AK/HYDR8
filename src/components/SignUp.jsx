import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const magneticElementsRef = useRef([]);
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmValue, setConfirmValue] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [style, setStyle] = useState('HYDR8 NOIR - MATTE BLACK');
    const [submitState, setSubmitState] = useState('initial');

    useEffect(() => {
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

        return () => {
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
        }, 1000);
    };

    return (
        <>
            <main className="relative z-10 flex flex-col md:flex-row w-full h-screen">
                {/* Left Side: Brand Experience */}
                <section className="flex-1 flex flex-col justify-center px-margin-mobile md:px-margin-desktop pt-24 md:pt-0">
                    <div className="max-w-xl space-y-8">
                        <h1 className="font-display-xl-mobile md:font-display-xl font-bold leading-none text-primary tracking-tighter">
                            Begin Your <br/><span className="text-secondary-container">Journey.</span>
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-md">
                            Join an elite circle of visionaries committed to liquid purity. Unlock early access to archival drops and bespoke atelier services.
                        </p>
                        <div className="pt-12 relative">
                            {/* Premium Bottle Image Placeholder */}
                            <div className="floating-bottle relative z-10 w-64 md:w-80">
                                <img
                                    className="w-full drop-shadow-2xl"
                                    alt="A high-end, minimalist matte black AURA water bottle floating in a white studio environment. The lighting is cinematic, highlighting the bottle's elegant curves and its premium brushed metal cap. Soft water droplets cling to the surface of the bottle, creating a feeling of freshness and technological precision in line with a high-luxury wellness brand."
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoDfdyx9WG8UN6xaNAKN5PeR9m6hkVC_d6qK1ejgZ1EmA_p7Pscjc-oWoUOCqJyI1XvXq1gBIit4xQ8S7XdcaqObwp4WOjCJWN6bohcXW40QDhqRzdDiMp1q1qyZKycQl2wYefHglYZx52aqnE4SQpXCvAuZO5PgRFu5OtryTrjDyztbjtg9khNblOD8fVtIxcc3CqPWrYxWzB_z5DBeSYmmYqkRDC-665bn0ZWdUEgUFqqcEZiyQj"
                                />
                            </div>
                            {/* Decorative Glass Glow */}
                            <div className="absolute -inset-20 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>
                        </div>
                    </div>
                </section>
                {/* Right Side: Registration Experience */}
                <section className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop bg-white/5 md:bg-transparent">
                    <div className="glass-panel w-full max-w-lg p-8 md:p-12 rounded-3xl transition-all duration-700">
                        <header className="mb-10">
                            <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-2">Create Account</h2>
                            <p className="font-body-md text-on-surface-variant">Step into the future of clarity.</p>
                        </header>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="relative group">
                                    <label className="block font-label-sm text-label-sm mb-2 uppercase opacity-60">Full Name</label>
                                    <input
                                        className="glass-input w-full px-5 py-4 rounded-xl font-body-md text-primary placeholder:opacity-30"
                                        placeholder="ALEXANDER VOSS"
                                        required
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="block font-label-sm text-label-sm mb-2 uppercase opacity-60">Email Address</label>
                                    <input
                                        className="glass-input w-full px-5 py-4 rounded-xl font-body-md text-primary placeholder:opacity-30"
                                        placeholder="IDENTITY@AURA.CO"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <label className="block font-label-sm text-label-sm mb-2 uppercase opacity-60">Password</label>
                                        <input
                                            className="glass-input w-full px-5 py-4 rounded-xl font-body-md text-primary"
                                            id="passwordInput"
                                            placeholder="••••••••"
                                            required
                                            type="password"
                                            value={passwordValue}
                                            onChange={(e) => setPasswordValue(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <label className="block font-label-sm text-label-sm mb-2 uppercase opacity-60">Confirm</label>
                                        <input
                                            className="glass-input w-full px-5 py-4 rounded-xl font-body-md text-primary"
                                            placeholder="••••••••"
                                            required
                                            type="password"
                                            value={confirmValue}
                                            onChange={(e) => setConfirmValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <label className="block font-label-sm text-label-sm mb-2 uppercase opacity-60">Preferred Bottle Style</label>
                                    <select
                                        className="glass-input w-full px-5 py-4 rounded-xl font-body-md text-primary appearance-none cursor-pointer"
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                    >
                                        <option>HYDR8 NOIR - MATTE BLACK</option>
                                        <option>HYDR8 PURE - FROSTED GLASS</option>
                                        <option>HYDR8 TITAN - BRUSHED STEEL</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 bottom-4 pointer-events-none opacity-40">expand_more</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    className="button-sweep magnetic-hover w-full bg-primary text-on-primary py-5 rounded-xl font-label-sm text-label-sm uppercase tracking-widest flex justify-center items-center gap-3"
                                    type="submit"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                    style={{
                                        backgroundColor: submitState === 'success' ? 'var(--color-secondary-container)' : 'var(--color-primary)'
                                    }}
                                >
                                    {submitState === 'initial' && (
                                        <>
                                            Initiate Account
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </>
                                    )}
                                    {submitState === 'loading' && (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    )}
                                    {submitState === 'success' && (
                                        <>
                                            Success
                                            <span className="material-symbols-outlined">done_all</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-center font-label-sm text-[10px] uppercase opacity-40 mb-6 tracking-widest">Connect with Identity Providers</p>
                            <div className="flex justify-center gap-6">
                                <button
                                    className="glass-panel p-4 rounded-full magnetic-hover hover:bg-white/60 transition-all"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.136-1.248 1.248-3.2 2.52-6.952 2.52-5.752 0-10.32-4.664-10.32-10.42s4.568-10.42 10.32-10.42c3.128 0 5.376 1.224 7.064 2.824l2.32-2.32c-2.424-2.312-5.592-3.616-9.384-3.616-7.832 0-14.224 6.392-14.224 14.224s6.392 14.224 14.224 14.224c4.224 0 7.424-1.392 9.872-3.952 2.528-2.528 3.328-6.064 3.328-8.8 0-.84-.064-1.64-.192-2.424h-10.608z"></path>
                                    </svg>
                                </button>
                                <button
                                    className="glass-panel p-4 rounded-full magnetic-hover hover:bg-white/60 transition-all"
                                    ref={(el) => magneticElementsRef.current.push(el)}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.05 20.28c-.98.95-2.05 1.51-3.19 1.51-1.32 0-2.22-.61-3.66-.61-1.42 0-2.35.6-3.71.6-1.12 0-2.12-.55-3.04-1.46C1.51 18.23.49 15.22.49 12.18c0-3.32 1.76-5.46 3.61-5.46 1.05 0 2.05.57 3.02.57 1.05 0 1.95-.57 3.02-.57 1.42 0 2.81.72 3.66 1.96-3.12 1.29-2.59 5.86.37 6.94-.72 1.74-1.55 3.51-3.13 4.66zM12.02 5.07c.07-2.31-1.95-4.47-4.14-4.57-.22 2.45 2.15 4.54 4.14 4.57z"></path>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-center mt-6 font-body-md text-on-surface-variant">
                                Already part of the journey? <Link className="text-primary font-semibold underline decoration-secondary/30 underline-offset-4" to="/login">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default SignUp;
