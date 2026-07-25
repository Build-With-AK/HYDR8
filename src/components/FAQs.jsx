import React, { useEffect, useRef, useState } from 'react';

const FAQs = () => {
  const cursorRef = useRef(null);
  const panelsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      colSpan: 'lg:col-span-7',
      floatClass: 'floating-1',
      category: 'Core Technology',
      question: 'How long does it keep water cold?',
      answer: 'Our proprietary AURA Double-wall vacuum insulation creates a thermal barrier that preserves the pristine temperature of your beverage. It keeps liquids cold for up to 24 hours and steaming hot for up to 12 hours, regardless of external conditions.',
      tags: ['24H COLD', '12H HOT'],
      icon: 'expand_more',
      type: 'large'
    },
    {
      floatClass: 'floating-2',
      category: 'Maintenance',
      question: 'Is it dishwasher safe?',
      answer: 'Yes. Every bottle is designed to withstand everyday dishwasher cleaning while maintaining its premium finish and structural integrity.',
      tags: [],
      icon: 'add',
      type: 'small',
      group: 'stack'
    },
    {
      floatClass: 'floating-3',
      category: 'Health & Safety',
      question: 'Is it BPA Free?',
      answer: 'Absolutely. Every bottle is manufactured using BPA-free, food-grade 18/8 stainless steel and premium silicone gaskets for safe, chemical-free daily use.',
      tags: [],
      icon: 'add',
      type: 'small',
      group: 'stack'
    },
    {
      colSpan: 'lg:col-span-4',
      floatClass: 'floating-2',
      category: 'Logistics',
      question: 'Shipping time?',
      answer: 'Orders are processed within 24 hours. Domestic delivery typically arrives within 3-5 business days. International shipping varies by region.',
      tags: [],
      icon: 'local_shipping',
      type: 'small',
      offset: 'lg:-mt-12'
    },
    {
      colSpan: 'lg:col-span-6 lg:col-start-6',
      floatClass: 'floating-1',
      category: 'Service',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If your AURA bottle doesn\'t meet your expectations, enjoy a hassle-free return window with simple exchanges and dedicated concierge support.',
      tags: [],
      link: 'READ FULL POLICY',
      icon: 'replay',
      type: 'medium'
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    panelsRef.current.filter(Boolean).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const stackFaqs = faqs.filter(f => f.group === 'stack');
  const otherFaqs = faqs.filter(f => f.group !== 'stack');

  return (
    <>
      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 mesh-gradient" />
      {/* Floating CSS Rings */}
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
              left: `${10 + i * 15}%`,
              top: `${15 + i * 10}%`,
              animation: `float ${12 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * -2}s`,
              opacity: 0.3
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`sphere-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${20 + i % 10 * 2}px`,
              height: `${20 + i % 10 * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * -5}s`
            }}
          />
        ))}
      </div>
      <div
        ref={cursorRef}
        className="cursor-spotlight hidden lg:block fixed inset-0 z-5 pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(64,194,253,0.08) 0%, rgba(255,255,255,0) 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
      <section className="relative z-10 pt-32 sm:pt-40 md:pt-48 pb-16 md:pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center md:text-left">
        <div className="max-w-4xl">
          <h1 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl text-primary uppercase tracking-tighter mb-8 leading-[0.9]">
            Frequently<br />Asked Questions
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl opacity-80">
            Everything you need to know about our bottles, craftsmanship, delivery, and care—beautifully explained in one place.
          </p>
        </div>
      </section>
      <section className="relative z-10 px-margin-mobile md:px-margin-desktop pb-24 sm:pb-32 md:pb-40 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {otherFaqs[0] && (
            <div key={0} className={`${otherFaqs[0].colSpan} ${otherFaqs[0].floatClass}`}>
              <div
                ref={(el) => (panelsRef.current[0] = el)}
                onClick={() => toggleFaq(0)}
                className={`faq-panel glass-panel ${activeIndex === 0 ? 'active' : ''} cursor-pointer group ${otherFaqs[0].type === 'large' ? 'p-10 md:p-16' : 'p-8'} rounded-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
                      {otherFaqs[0].category}
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-primary group-hover:text-secondary transition-colors duration-300">
                      {otherFaqs[0].question}
                    </h3>
                  </div>
                  <span
                    className="material-symbols-outlined text-primary/30 transition-transform duration-500"
                    style={{
                      transform: activeIndex === 0 ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '48px'
                    }}
                  >
                    {otherFaqs[0].icon}
                  </span>
                </div>
                <div className="faq-answer">
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    {otherFaqs[0].answer}
                  </p>
                  {otherFaqs[0].tags && otherFaqs[0].tags.length > 0 && (
                    <div className="mt-8 flex gap-4">
                      {otherFaqs[0].tags.map((tag, i) => (
                        <span key={i} className="bg-white/50 px-4 py-2 rounded-full font-label-sm text-label-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Stacked FAQs */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:pt-20">
            {stackFaqs.map((faq, index) => {
              const realIndex = index + 1;
              return (
                <div key={realIndex} className={faq.floatClass}>
                  <div
                    ref={(el) => (panelsRef.current[realIndex] = el)}
                    onClick={() => toggleFaq(realIndex)}
                    className={`faq-panel glass-panel ${activeIndex === realIndex ? 'active' : ''} cursor-pointer group p-8 rounded-xl`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
                          {faq.category}
                        </span>
                        <h4 className="font-headline-lg-mobile sm:text-[36px] md:text-headline-lg text-primary">
                          {faq.question}
                        </h4>
                      </div>
                      <span
                        className="material-symbols-outlined text-primary/30 transition-transform duration-500"
                        style={{
                          transform: activeIndex === realIndex ? 'rotate(180deg)' : 'rotate(0deg)',
                          fontSize: '24px'
                        }}
                      >
                        {faq.icon}
                      </span>
                    </div>
                    <div className="faq-answer">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {otherFaqs[1] && (
            <div key={3} className={`${otherFaqs[1].colSpan} ${otherFaqs[1].floatClass} ${otherFaqs[1].offset}`}>
              <div
                ref={(el) => (panelsRef.current[3] = el)}
                onClick={() => toggleFaq(3)}
                className={`faq-panel glass-panel ${activeIndex === 3 ? 'active' : ''} cursor-pointer group p-8 rounded-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
                      {otherFaqs[1].category}
                    </span>
                    <h4 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      {otherFaqs[1].question}
                    </h4>
                  </div>
                  <span
                    className="material-symbols-outlined text-primary/30 transition-transform duration-500"
                    style={{
                      transform: activeIndex === 3 ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '24px'
                    }}
                  >
                    {otherFaqs[1].icon}
                  </span>
                </div>
                <div className="faq-answer">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {otherFaqs[1].answer}
                  </p>
                </div>
              </div>
            </div>
          )}
          {otherFaqs[2] && (
            <div key={4} className={`${otherFaqs[2].colSpan} ${otherFaqs[2].floatClass}`}>
              <div
                ref={(el) => (panelsRef.current[4] = el)}
                onClick={() => toggleFaq(4)}
                className={`faq-panel glass-panel ${activeIndex === 4 ? 'active' : ''} cursor-pointer group p-10 rounded-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
                      {otherFaqs[2].category}
                    </span>
                    <h4 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      {otherFaqs[2].question}
                    </h4>
                  </div>
                  <span
                    className="material-symbols-outlined text-primary/30 transition-transform duration-500"
                    style={{
                      transform: activeIndex === 4 ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '24px'
                    }}
                  >
                    {otherFaqs[2].icon}
                  </span>
                </div>
                <div className="faq-answer">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {otherFaqs[2].answer}
                  </p>
                  {otherFaqs[2].link && (
                    <a className="inline-block mt-6 font-label-sm text-label-sm text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all" href="#">
                      {otherFaqs[2].link}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="relative z-10 py-20 sm:py-24 md:py-32 px-margin-mobile md:px-margin-desktop text-center">
        <div className="glass-panel max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Still have questions?</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10">Our concierge team is available 24/7 to assist with your journey.</p>
          <button className="bg-primary text-on-primary px-10 py-5 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl">
            Contact Concierge
          </button>
        </div>
      </section>
    </>
  );
};

export default FAQs;
