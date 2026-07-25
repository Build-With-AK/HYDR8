import React, { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────
   Inject global CSS once (keyframes, classes
   that can't be expressed inline)
───────────────────────────────────────────── */
const injectStyles = () => {
  const id = 'wcu-styles';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    /* Glass card */
    .wcu-glass {
      background: rgba(255,255,255,0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.6);
    }

    /* Noise overlay */
    .wcu-noise {
      background-image: url(https://grainy-gradients.vercel.app/noise.svg);
      opacity: 0.03;
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    /* Cursor spotlight */
    .wcu-spotlight {
      background: radial-gradient(
        circle 160px at var(--wcu-x, -9999px) var(--wcu-y, -9999px),
        rgba(64,194,253,0.18),
        transparent 80%
      );
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 9;
    }

    /* Float animations */
    @keyframes wcuFloat {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-20px) rotate(2deg); }
    }
    .wcu-float         { animation: wcuFloat  8s ease-in-out infinite; }
    .wcu-float-delay   { animation: wcuFloat  8s ease-in-out infinite; animation-delay: -2s; }
    .wcu-float-slow    { animation: wcuFloat 12s ease-in-out infinite; }

    /* Scroll reveal */
    .wcu-reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.9s cubic-bezier(0.23,1,0.32,1),
                  transform 0.9s cubic-bezier(0.23,1,0.32,1);
    }
    .wcu-reveal.wcu-active {
      opacity: 1;
      transform: translateY(0);
    }

    /* Grayscale image on the Leak-Proof card */
    .wcu-gs {
      filter: grayscale(1);
      transition: filter 0.7s ease;
      width: 100%; height: 100%; object-fit: cover;
    }
    .wcu-gs:hover { filter: grayscale(0); }

    /* Product section glow */
    .wcu-prod-glow {
      position: absolute; inset: 0;
      background: rgba(64,194,253,0.1);
      filter: blur(120px);
      border-radius: 9999px;
      transform: scale(0.75);
      transition: transform 1s ease;
    }
    .wcu-prod-wrap:hover .wcu-prod-glow { transform: scale(1); }

    /* BPA hover CTA */
    .wcu-bpa-cta {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .wcu-card:hover .wcu-bpa-cta { opacity: 1; }

    /* Magnetic card transition */
    .wcu-card {
      transition: transform 0.35s cubic-bezier(0.23,1,0.32,1),
                  box-shadow 0.35s cubic-bezier(0.23,1,0.32,1);
      will-change: transform;
    }
  `;
  document.head.appendChild(s);
};

/* ─────────────────────────────────────────────
   Magnetic-card handlers (inline, always works)
───────────────────────────────────────────── */
const handleCardMove = (e) => {
  const card = e.currentTarget;
  const rect  = card.getBoundingClientRect();
  const x = e.clientX - rect.left  - rect.width  / 2;
  const y = e.clientY - rect.top   - rect.height / 2;
  card.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.025)`;
  card.style.boxShadow = `${-x * 0.18}px ${-y * 0.18}px 48px rgba(0,0,0,0.07)`;
};

const handleCardLeave = (e) => {
  const card = e.currentTarget;
  card.style.transform = 'translate(0,0) scale(1)';
  card.style.boxShadow = 'none';
};

/* ─────────────────────────────────────────────
   Reusable card wrapper
───────────────────────────────────────────── */
const Card = ({ children, style = {}, extraClass = '' }) => (
  <div
    className={`wcu-glass wcu-card ${extraClass}`}
    style={{ borderRadius: '2rem', cursor: 'default', ...style }}
    onMouseMove={handleCardMove}
    onMouseLeave={handleCardLeave}
  >
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   Icon helper
───────────────────────────────────────────── */
const Icon = ({ name, size = 36, color = '#000', filled = false }) => (
  <span
    className="material-symbols-outlined"
    style={{
      fontSize: `${size}px`,
      display: 'block',
      marginBottom: '28px',
      color,
      fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
    }}
  >
    {name}
  </span>
);

/* ─────────────────────────────────────────────
   Typography helpers
───────────────────────────────────────────── */
const H3 = ({ children }) => (
  <h3
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(24px, 2.5vw, 32px)',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      fontWeight: 600,
      marginBottom: '14px',
      color: '#1a1c1c',
    }}
  >
    {children}
  </h3>
);

const Body = ({ children }) => (
  <p
    style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      lineHeight: '28px',
      color: '#444748',
    }}
  >
    {children}
  </p>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const WhyChooseUs = () => {
  const spotlightRef = useRef(null);
  const revealRefs   = useRef([]);

  // Inject CSS once
  useEffect(() => { injectStyles(); }, []);

  // Spotlight
  useEffect(() => {
    const move = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--wcu-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--wcu-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('wcu-active');
      }),
      { threshold: 0.08 }
    );
    revealRefs.current.forEach((el) => { if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const reveal = useCallback((el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  return (
    <>
      {/* Global spotlight */}
      <div ref={spotlightRef} className="wcu-spotlight" aria-hidden="true" />

      {/* ═══════════════════════════════════════
          SECTION 1 — Why Choose Us
      ═══════════════════════════════════════ */}
      <section
        id="why-aura"
        className="wcu-section"
        style={{
          position: 'relative',
          padding: '120px 80px',
          maxWidth: '1440px',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <div className="wcu-noise" aria-hidden="true" />

        {/* Header */}
        <div ref={reveal} className="wcu-reveal" style={{ marginBottom: '80px', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.45em',
              fontWeight: 500,
              color: '#00668a',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '20px',
            }}
          >
            The Essence of Form
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 700,
              color: '#1a1c1c',
              margin: 0,
            }}
          >
            Why Choose{' '}
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#c4c7c7' }}>Us</span>
          </h2>
        </div>

        {/* ── Two-column staggered card grid ── */}
        {/*
          LEFT column : BPA Free (starts at top) + Thermal Mastery (offset down)
          RIGHT column: Leak Proof (offset down) + Eco / Steel / Certified (further down)
          Using flexbox + paddingTop for the stagger — no negative margins, no overlap.
        */}
        <div
          className="wcu-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'start',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. BPA Free */}
            <div ref={reveal} className="wcu-reveal">
              <Card extraClass="wcu-card-pad" style={{ padding: '44px' }}>
                <Icon name="health_and_safety" filled />
                <H3>BPA Free</H3>
                <Body>
                  Engineered for purity. Our commitment to your health means zero
                  endocrine disruptors, ensuring every sip is as clean as the source.
                </Body>
                <div
                  className="wcu-bpa-cta"
                  style={{
                    marginTop: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#00668a',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    fontWeight: 500,
                  }}
                >
                  <span>EXPLORE SCIENCE</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    arrow_forward
                  </span>
                </div>
              </Card>
            </div>

            {/* 2. Thermal Mastery — visually offset down via paddingTop wrapper */}
            <div ref={reveal} className="wcu-reveal" style={{ paddingTop: '60px' }}>
              <Card extraClass="wcu-card-pad" style={{ padding: '40px' }}>
                <Icon name="thermometer" />
                <H3>Thermal Mastery</H3>
                <Body>
                  Vacuum-insulated double walls preserve your ideal temperature
                  for 24 hours of cold or 12 hours of heat.
                </Body>
              </Card>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 3. Leak Proof — visually raised with paddingTop offset */}
            <div ref={reveal} className="wcu-reveal" style={{ paddingTop: '40px' }}>
              <Card
                extraClass="wcu-card-pad-lg"
                style={{
                  padding: '56px',
                  borderRadius: '2.5rem',
                  border: '1px solid rgba(64,194,253,0.25)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                }}
              >
                <Icon name="water_drop" size={44} color="#00668a" />
                <H3>Leak Proof Precision</H3>
                <Body>
                  Hermetic security meets industrial design. Our proprietary
                  triple-seal technology guarantees absolute containment in any
                  orientation.
                </Body>
                {/* Grayscale → colour on hover */}
                <div
                  style={{
                    marginTop: '40px',
                    aspectRatio: '16/9',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    className="wcu-gs"
                    src="https://images.unsplash.com/photo-1548872591-3bb2ee9d5293?w=800&q=80"
                    alt="Macro close-up of AURA bottle cap with water droplets"
                  />
                </div>
              </Card>
            </div>

            {/* 4. Eco Conscious */}
            <div ref={reveal} className="wcu-reveal">
              <Card
                className="wcu-card-pad"
                style={{
                  padding: '44px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <Icon name="eco" />
                  <H3>Eco Conscious</H3>
                  <Body>
                    A permanent alternative to single-use plastics. For every
                    AURA piece crafted, we extract 1 kg of ocean plastic.
                  </Body>
                </div>
                {/* Decorative glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '-60px',
                    bottom: '-60px',
                    width: '220px',
                    height: '220px',
                    opacity: 0.12,
                    background: '#00668a',
                    borderRadius: '9999px',
                    filter: 'blur(80px)',
                  }}
                />
              </Card>
            </div>

            {/* 5. Steel + Certified mini cards */}
            <div ref={reveal} className="wcu-reveal">
                  <div className="wcu-card-pad-mini-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                <Card style={{ padding: '28px', borderRadius: '1.5rem' }}>
                  <Icon name="precision_manufacturing" size={28} />
                  <h4
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '20px',
                      fontWeight: 600,
                      marginBottom: '6px',
                      color: '#1a1c1c',
                    }}
                  >
                    316 Steel
                  </h4>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                      color: '#444748',
                    }}
                  >
                    Surgical grade durability.
                  </p>
                </Card>

                <Card style={{ padding: '28px', borderRadius: '1.5rem' }}>
                  <Icon name="verified" size={28} />
                  <h4
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '20px',
                      fontWeight: 600,
                      marginBottom: '6px',
                      color: '#1a1c1c',
                    }}
                  >
                    Certified
                  </h4>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                      color: '#444748',
                    }}
                  >
                    Food grade security.
                  </p>
                </Card>

              </div>
            </div>

          </div>
        </div>

        {/* ── Floating decorative orbs ── */}
        <div
          aria-hidden="true"
          className="wcu-float"
          style={{
            position: 'absolute', top: '22%', left: '4%',
            width: '80px', height: '80px', borderRadius: '9999px',
            background: 'rgba(64,194,253,0.15)', filter: 'blur(8px)',
            opacity: 0.4, pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          className="wcu-float-delay"
          style={{
            position: 'absolute', bottom: '18%', right: '3%',
            width: '60px', height: '60px', borderRadius: '9999px',
            background: 'rgba(0,102,138,0.2)', filter: 'blur(8px)',
            opacity: 0.3, pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          className="wcu-glass wcu-float-slow"
          style={{
            position: 'absolute', top: '55%', right: '8%',
            width: '100px', height: '100px', borderRadius: '9999px',
            opacity: 0.18, filter: 'blur(4px)', pointerEvents: 'none',
          }}
        />
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — Crafted for the Discerning
      ═══════════════════════════════════════ */}
      <section
        style={{
          padding: '120px 80px',
          background: 'rgba(243,243,244,0.55)',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '96px',
            alignItems: 'center',
          }}
        >
          {/* Image col */}
          <div
            ref={reveal}
            className="wcu-reveal wcu-prod-wrap"
            style={{ position: 'relative' }}
          >
            <div className="wcu-prod-glow" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"
              alt="AURA bottle floating with glass spheres and water droplets"
              style={{
                position: 'relative', zIndex: 2,
                width: '100%', height: 'auto',
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.14))',
              }}
            />
          </div>

          {/* Text col */}
          <div ref={reveal} className="wcu-reveal">
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(32px, 3vw, 42px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                fontWeight: 600,
                marginBottom: '28px',
                color: '#1a1c1c',
              }}
            >
              Crafted for the
              <br />
              <span style={{ color: '#00668a' }}>Discerning</span>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '17px',
                lineHeight: '30px',
                color: '#444748',
                marginBottom: '44px',
                maxWidth: '420px',
              }}
            >
              Our design language speaks to those who demand performance without
              compromising aesthetic purity. Every radius, every texture, and every
              weight is balanced for sensory perfection.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['PVD Titanium Coating', 'Magnetic Tether System', 'Zero-Condensation Exterior'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      width: '7px', height: '7px',
                      borderRadius: '9999px',
                      background: '#00668a',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      color: '#1a1c1c',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
