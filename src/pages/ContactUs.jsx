import React, { useEffect, useRef, useState } from 'react';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const contactUsFragmentShader = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // AURA Editorial Palette (Surface, Aqua Bloom, Deep Slate)
    vec3 color1 = vec3(0.976, 0.976, 0.976); // #f9f9f9
    vec3 color2 = vec3(0.855, 0.965, 0.984); // Aqua highlight
    vec3 color3 = vec3(0.922, 0.922, 0.922); // Cool Gray
    
    // Create soft, undulating liquid motion for an "editorial studio" feel
    float noise = sin(uv.x * 2.8 + u_time * 0.15) * cos(uv.y * 3.2 + u_time * 0.1) * 0.12;
    
    // Interactive Water Ripple logic for the Contact atmosphere
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 18.0 - u_time * 1.8) * exp(-distToMouse * 3.5) * 0.025;
    
    // Volumetric light blooms that react to the "Conversation" focus
    float d1 = distance(uv, vec2(0.8, 0.8) + 0.2 * vec2(sin(u_time * 0.08), cos(u_time * 0.06)));
    float d2 = distance(uv, vec2(0.2, 0.2) + 0.15 * vec2(cos(u_time * 0.1), sin(u_time * 0.09)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.9, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.8, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.1, smoothstep(0.4, 0.0, distToMouse) * 0.3);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.012;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const ContactUs = () => {
  const threejsContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Custom Cursor Logic
    const cursor = cursorRef.current;
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Reveal Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Three.js Background Logic
    const container = threejsContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f2ff, 1.2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const objects = [];

    const sphereGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const sphereMat = new THREE.MeshPhongMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.2, 
      shininess: 100 
    });
    
    for(let i = 0; i < 22; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*12, (Math.random()-0.5)*10);
      scene.add(sphere);
      objects.push({ 
        mesh: sphere, 
        speed: 0.001 + Math.random()*0.004, 
        phase: Math.random() * Math.PI * 2 
      });
    }

    const ringGeo = new THREE.TorusGeometry(3.8, 0.009, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.07 });
    
    for(let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random()-0.5)*16, (Math.random()-0.5)*10, -5);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0006 + Math.random()*0.0012 });
    }

    camera.position.z = 12;

    const mouse = new THREE.Vector2();
    const handleThreeMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleThreeMouseMove);

    const handleMessageSent = () => {
      objects.forEach(obj => {
         if(obj.mesh.position.z > 0) {
            obj.mesh.position.y += 5; // Float up on send
         }
      });
    };
    window.addEventListener('aura-message-sent', handleMessageSent);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      objects.forEach(obj => {
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 0.5;
        if(obj.phase !== undefined) {
          obj.mesh.position.y += Math.sin(Date.now() * 0.0005 + obj.phase) * 0.005;
        }
      });
      
      scene.rotation.y += (mouse.x * 0.06 - scene.rotation.y) * 0.02;
      scene.rotation.x += (-mouse.y * 0.06 - scene.rotation.x) * 0.02;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleThreeMouseMove);
      window.removeEventListener('aura-message-sent', handleMessageSent);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleCursorEnter = () => {
    if (cursorRef.current) {
      cursorRef.current.style.width = '64px';
      cursorRef.current.style.height = '64px';
      cursorRef.current.style.background = 'rgba(64, 194, 253, 0.1)';
    }
  };

  const handleCursorLeave = () => {
    if (cursorRef.current) {
      cursorRef.current.style.width = '24px';
      cursorRef.current.style.height = '24px';
      cursorRef.current.style.background = 'white';
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);
    window.dispatchEvent(new Event('aura-message-sent'));

    setTimeout(() => {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setIsSending(false);
      }, 3000);
    }, 600);
  };

  const handleMagneticHover = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
  };

  const handleMagneticLeave = (e) => {
    const button = e.currentTarget;
    button.style.transform = `translate(0, 0) scale(1)`;
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container overflow-x-hidden font-body-md">

      {successMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-frost px-12 py-8 rounded-full z-[1000] font-headline-lg-mobile text-secondary reveal-up active" style={{ transition: 'opacity 1s ease-out' }}>
          Transmission Received
        </div>
      )}

      <main className="relative">
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
          <WebGLBackground fragmentShader={contactUsFragmentShader} opacity={0.6} className="absolute inset-0 w-full h-full pointer-events-none" />
          
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
          </div>

          <div className="relative z-10 text-center max-w-5xl px-margin-mobile reveal-up" id="hero-content">
            <span className="font-label-sm text-secondary uppercase tracking-[0.4em] mb-6 block">Contact the Atelier</span>
            <h1 className="font-display-xl-mobile text-[48px] sm:text-[64px] md:text-display-xl text-primary leading-[1.1] mb-8 tracking-tighter">
              Let's Create Something <span className="text-secondary italic">Refreshing</span> Together.
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
              Whether you're seeking a bespoke partnership or simply wishing to share a vision, our door is open. Pure water, pure design, pure connection.
            </p>
            <div className="relative w-64 h-96 mx-auto group">
              <img 
                className="w-full h-full object-contain contact-floating-sculpture transition-all duration-700 group-hover:scale-110 drop-shadow-2xl" 
                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"
              />
              <div className="absolute inset-0 bg-secondary/10 blur-[80px] -z-10 rounded-full opacity-30"></div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="font-label-sm uppercase tracking-widest text-[10px]">Scroll to descend</span>
            <div className="w-[1px] h-12 bg-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-bounce"></div>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen w-full flex items-center justify-center py-40 bg-surface-container-low/30 px-margin-mobile">
          <div className="w-full max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="reveal-up">
              <h2 className="font-headline-lg-mobile md:text-headline-lg text-primary mb-8">Begin the Dialogue</h2>
              <p className="font-body-md text-on-surface-variant mb-12 max-w-md">Our concierges are standing by to distill your inquiries into meaningful outcomes. Expect a response within 24 operational hours.</p>
              <div className="flex flex-col gap-12">
                <div 
                  className="group cursor-pointer"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <span className="font-label-sm text-secondary uppercase mb-2 block">Direct Inquiry</span>
                  <div className="font-headline-lg-mobile text-primary tracking-tight group-hover:translate-x-4 transition-transform duration-500">concierge@aura.com</div>
                </div>
                <div 
                  className="group cursor-pointer"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <span className="font-label-sm text-secondary uppercase mb-2 block">Global Press</span>
                  <div className="font-headline-lg-mobile text-primary tracking-tight group-hover:translate-x-4 transition-transform duration-500">+44 (0) 20 7946 0123</div>
                </div>
                <div 
                  className="group cursor-pointer"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <span className="font-label-sm text-secondary uppercase mb-2 block">Headquarters</span>
                  <div className="font-headline-lg-mobile text-primary tracking-tight group-hover:translate-x-4 transition-transform duration-500">London · Zurich · Tokyo</div>
                </div>
              </div>
            </div>
            <div className="reveal-up relative">
              <div className="glass-frost p-8 md:p-12 rounded-[2rem] shadow-2xl relative z-10">
                <form className="flex flex-col gap-8" id="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="font-label-sm text-on-surface-variant mb-2 block uppercase text-[10px]">Your Name</label>
                      <input 
                        className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-outline-variant" 
                        placeholder="Alexander Thorne" 
                        type="text"
                        onMouseEnter={handleCursorEnter}
                        onMouseLeave={handleCursorLeave}
                      />
                    </div>
                    <div className="relative group">
                      <label className="font-label-sm text-on-surface-variant mb-2 block uppercase text-[10px]">Email Address</label>
                      <input 
                        className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-outline-variant" 
                        placeholder="alex@design.co" 
                        type="email"
                        onMouseEnter={handleCursorEnter}
                        onMouseLeave={handleCursorLeave}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-label-sm text-on-surface-variant mb-4 block uppercase text-[10px]">Reason for contact</label>
                    <div className="flex flex-wrap gap-3">
                      <label className="cursor-pointer">
                        <input className="hidden peer" name="reason" type="radio" />
                        <span className="px-6 py-2 rounded-full border border-primary/10 font-label-sm text-[10px] uppercase peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all inline-block" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Partnership</span>
                      </label>
                      <label className="cursor-pointer">
                        <input defaultChecked className="hidden peer" name="reason" type="radio" />
                        <span className="px-6 py-2 rounded-full border border-primary/10 font-label-sm text-[10px] uppercase peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all inline-block" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Press</span>
                      </label>
                      <label className="cursor-pointer">
                        <input className="hidden peer" name="reason" type="radio" />
                        <span className="px-6 py-2 rounded-full border border-primary/10 font-label-sm text-[10px] uppercase peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all inline-block" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Bespoke Order</span>
                      </label>
                      <label className="cursor-pointer">
                        <input className="hidden peer" name="reason" type="radio" />
                        <span className="px-6 py-2 rounded-full border border-primary/10 font-label-sm text-[10px] uppercase peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all inline-block" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Other</span>
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="font-label-sm text-on-surface-variant mb-2 block uppercase text-[10px]">Your Message</label>
                    <textarea 
                      className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-outline-variant resize-none" 
                      placeholder="How can we help define your flow?" 
                      rows="4"
                      onMouseEnter={handleCursorEnter}
                      onMouseLeave={handleCursorLeave}
                    ></textarea>
                  </div>
                  <button 
                    className={`w-full bg-primary text-on-primary h-16 rounded-full font-label-sm uppercase tracking-widest relative overflow-hidden transition-all duration-500 hover:tracking-[0.2em] group flex items-center justify-center ${isSending ? 'contact-droplet-morph' : ''}`}
                    onClick={handleSend}
                    type="button"
                    style={{ opacity: isSending ? 0 : 1, transform: isSending ? 'translateY(-300px) scale(0)' : 'translateY(0) scale(1)' }}
                    onMouseEnter={handleCursorEnter}
                    onMouseLeave={handleCursorLeave}
                  >
                    <span className="relative z-10 group-hover:scale-110 transition-transform" style={{ opacity: isSending ? 0 : 1 }}>Send Message</span>
                    <div className="absolute bg-on-primary/10 inset-0 translate-y-full contact-droplet-animation"></div>
                  </button>
                </form>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-[60px] -z-0"></div>
            </div>
          </div>
        </section>

        <section className="relative py-40 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile">
            <div className="text-center mb-32 reveal-up">
              <h2 className="font-headline-lg text-primary mb-4">Connect Worldwide</h2>
              <p className="font-body-md text-on-surface-variant">Reach us through our digital ecosystems.</p>
            </div>
            <div className="relative h-[500px] flex items-center justify-center reveal-up">
              <div className="absolute w-[400px] h-[400px] border border-primary/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-[600px] h-[600px] border border-primary/5 rounded-full animate-[spin_35s_linear_infinite_reverse]"></div>
              <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(64,194,253,0.2)] relative z-20">
                <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              </div>
              <div className="absolute h-full w-full max-w-3xl">
                <div 
                  className="absolute top-[10%] left-[20%] glass-frost p-6 rounded-2xl magnetic-hover cursor-pointer contact-floating-sculpture" 
                  style={{ animationDelay: '0s' }}
                  onMouseMove={handleMagneticHover}
                  onMouseLeave={handleMagneticLeave}
                  onMouseEnter={handleCursorEnter}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">chat</span>
                  <div className="font-label-sm mt-2">Live Chat</div>
                </div>
                <div 
                  className="absolute top-[15%] right-[15%] glass-frost p-6 rounded-2xl magnetic-hover cursor-pointer contact-floating-sculpture" 
                  style={{ animationDelay: '1s' }}
                  onMouseMove={handleMagneticHover}
                  onMouseLeave={handleMagneticLeave}
                  onMouseEnter={handleCursorEnter}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                  <div className="font-label-sm mt-2">Email</div>
                </div>
                <div 
                  className="absolute bottom-[10%] left-[25%] glass-frost p-6 rounded-2xl magnetic-hover cursor-pointer contact-floating-sculpture" 
                  style={{ animationDelay: '2s' }}
                  onMouseMove={handleMagneticHover}
                  onMouseLeave={handleMagneticLeave}
                  onMouseEnter={handleCursorEnter}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">phone_iphone</span>
                  <div className="font-label-sm mt-2">WhatsApp</div>
                </div>
                <div 
                  className="absolute bottom-[15%] right-[20%] glass-frost p-6 rounded-2xl magnetic-hover cursor-pointer contact-floating-sculpture" 
                  style={{ animationDelay: '3s' }}
                  onMouseMove={handleMagneticHover}
                  onMouseLeave={handleMagneticLeave}
                  onMouseEnter={handleCursorEnter}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                  <div className="font-label-sm mt-2">Instagram</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-40 bg-surface-container">
          <div className="max-w-container-max mx-auto px-margin-mobile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal-up order-2 lg:order-1">
                <div className="glass-frost p-4 rounded-3xl shadow-[0_0_30px_rgba(64,194,253,0.2)] overflow-hidden h-[500px] relative group">
                  <div className="w-full h-full bg-surface-dim rounded-2xl grayscale transition-all duration-700 group-hover:grayscale-0 relative overflow-hidden">
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1000&q=80')" }}
                    ></div>
                    <div className="absolute inset-0 bg-secondary/5 mix-blend-overlay"></div>
                  </div>
                  <div className="absolute bottom-10 left-10 glass-frost px-8 py-6 rounded-2xl">
                    <div className="font-label-sm text-secondary mb-1">EUROPEAN FLAGSHIP</div>
                    <div className="font-body-md font-bold text-primary">12-14 New Bond St, London</div>
                    <div className="font-body-md text-on-surface-variant">W1S 3SR, United Kingdom</div>
                  </div>
                </div>
              </div>
              <div className="reveal-up order-1 lg:order-2">
                <h2 className="font-headline-lg-mobile md:text-headline-lg text-primary mb-8">Atmosphere Matters.</h2>
                <p className="font-body-lg text-on-surface-variant mb-12">Visit our London Atelier for a sensory experience of Liquid Purity. Witness the craftsmanship of AURA in a space designed by architectural visionaries.</p>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6 border-b border-primary/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-[10px] text-on-surface-variant uppercase">Mon — Fri</div>
                      <div className="font-body-md font-bold">10:00 — 19:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 border-b border-primary/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-[10px] text-on-surface-variant uppercase">Sat — Sun</div>
                      <div className="font-body-md font-bold">11:00 — 17:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h-[80vh] flex flex-col items-center justify-center text-center px-margin-mobile relative overflow-hidden">
          <WebGLBackground fragmentShader={contactUsFragmentShader} opacity={0.2} className="absolute inset-0 w-full h-full pointer-events-none" />
          
          <div className="max-w-4xl reveal-up">
            <blockquote className="font-display-xl-mobile text-[32px] sm:text-[40px] md:text-display-xl-mobile italic text-primary leading-tight mb-12">
              "Every Great Conversation Begins With <span className="text-secondary font-bold">One Drop</span>."
            </blockquote>
            <div className="h-[1px] w-32 bg-primary/20 mx-auto"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
