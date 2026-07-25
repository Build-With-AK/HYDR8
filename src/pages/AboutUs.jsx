import React, { useEffect, useRef, useState } from 'react';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const aboutUsFragmentShader = `precision highp float;
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
    
    // Create soft, undulating liquid motion for an "editorial documentary" feel
    float noise = sin(uv.x * 2.5 + u_time * 0.1) * cos(uv.y * 2.5 + u_time * 0.12) * 0.15;
    
    // Interactive Water Ripple logic
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 15.0 - u_time * 1.5) * exp(-distToMouse * 3.0) * 0.02;
    
    // Volumetric light blooms that move with the narrative flow
    float d1 = distance(uv, vec2(0.1, 0.9) + 0.2 * vec2(sin(u_time * 0.05), cos(u_time * 0.07)));
    float d2 = distance(uv, vec2(0.9, 0.1) + 0.2 * vec2(cos(u_time * 0.09), sin(u_time * 0.06)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.9, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.8, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.05, smoothstep(0.5, 0.0, distToMouse) * 0.25);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.01;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const AboutUs = () => {
  const threejsContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const [bottleTransform, setBottleTransform] = useState('rotateY(0deg) rotateX(0deg)');

  useEffect(() => {
    // Reveal Animations on Scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // Custom Cursor
    const cursor = cursorRef.current;
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
      
      // Hero Bottle Rotation
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      setBottleTransform(`rotateY(${xAxis}deg) rotateX(${yAxis}deg)`);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
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
    
    for(let i = 0; i < 30; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*15, (Math.random()-0.5)*10);
      scene.add(sphere);
      objects.push({ 
        mesh: sphere, 
        speed: 0.001 + Math.random()*0.003, 
        phase: Math.random() * Math.PI * 2 
      });
    }

    const ringGeo = new THREE.TorusGeometry(4, 0.008, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.08 });
    
    for(let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*12, -6);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0005 + Math.random()*0.001 });
    }

    camera.position.z = 15;

    const mouse = new THREE.Vector2();
    const handleThreeMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleThreeMouseMove);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      objects.forEach(obj => {
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 0.5;
        if(obj.phase !== undefined) {
          obj.mesh.position.y += Math.sin(Date.now() * 0.0004 + obj.phase) * 0.006;
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
      cursorRef.current.classList.add('scale-[2.5]', 'bg-primary/5');
    }
  };

  const handleCursorLeave = () => {
    if (cursorRef.current) {
      cursorRef.current.classList.remove('scale-[2.5]', 'bg-primary/5');
    }
  };

  return (
    <div className="font-body-md text-on-background bg-[#f9f9f9] overflow-x-hidden">
      
      <div 
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      ></div>

      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <WebGLBackground fragmentShader={aboutUsFragmentShader} opacity={0.4} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl leading-none reveal-up">Crafted for Every<br/><span className="text-secondary-container">Journey.</span></h1>
          <div className="relative w-64 md:w-96 mx-auto" style={{ perspective: '1000px' }}>
            <img 
              className="w-full h-auto drop-shadow-2xl reveal-up" 
              style={{ transition: 'transform 0.1s ease-out', transitionDelay: '0.2s', transform: bottleTransform }}
              src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU" 
              alt="Aura Bottle"
            />
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="font-label-sm uppercase tracking-tighter">Scroll to Explore</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </section>

      <section className="relative min-h-screen py-40 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-5 space-y-12">
          <span className="font-label-sm text-secondary tracking-[0.3em] uppercase">Chapter 01</span>
          <h2 className="font-display-xl text-[40px] sm:text-display-xl-mobile md:text-display-xl font-bold reveal-up">Every Great Journey Starts With One Simple Idea.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md reveal-up">Aura was born from a singular obsession: Why must the objects we carry be purely functional? We envisioned a vessel that bridged the gap between high-end industrial sculpture and human necessity.</p>
        </div>
        <div className="md:col-span-7 relative">
          <div className="relative w-full aspect-[4/5] glass-frost rounded-xl overflow-hidden reveal-up">
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBojiepRzkNpaRFpnVZkNThVqKcndRME7hVT0XQ0hVgYeT1z1EF7cdkKnBH2fvx15C3rJBePuTyCUr7uH0-UPvPqxC6UoFlwBLUcR1X9RqW9yE1Wg7x6FwWpmx_LuTsnPt6YHIDEuE6frQ6LVUHVtndDOyj_rXBh-phgde4rlhswa4IJzluAyHxyj01Ju_vLWPb9bbpIcLYbcnP1sheKkwqORk1716lI1kFXR_xb114SplsRGbxWFzH')" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center p-20">
              <div className="text-center">
                <span className="font-display-xl text-primary/10 select-none">Purity.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <WebGLBackground fragmentShader={aboutUsFragmentShader} opacity={0.1} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 max-w-4xl text-center px-margin-mobile reveal-up">
          <span className="font-label-sm text-secondary tracking-[0.3em] uppercase block mb-8">Chapter 02</span>
          <div className="glass-frost p-12 md:p-24 rounded-3xl relative">
            <div className="absolute -top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-primary/20"></div>
            <div className="absolute -bottom-12 -right-12 w-24 h-24 border-b-2 border-r-2 border-primary/20"></div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-12 italic">"Designed With Purpose."</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">We don't just build bottles; we engineer experiences. Every curve is calculated for ergonomics, every material chosen for its sensory feedback. Our mission is to create a physical anchor in a digital world—a tactile reminder to stay fluid, stay pure.</p>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen py-40 px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          <div className="order-2 md:order-1 relative h-[600px]">
            <div className="absolute inset-0 rounded-full bg-secondary-container/5 blur-[120px]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <WebGLBackground fragmentShader={aboutUsFragmentShader} opacity={1} className="w-full h-full" />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-12">
            <span className="font-label-sm text-secondary tracking-[0.3em] uppercase">Chapter 03</span>
            <h2 className="font-display-xl text-[40px] sm:text-display-xl-mobile md:text-display-xl font-bold reveal-up">Small Choices. Lasting Impact.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant reveal-up">Sustainability is not a marketing pillar; it is our foundation. By replacing single-use plastic fragments with infinite glass and titanium, we are not just saving the planet—we are elevating the ritual of hydration to a lasting art form.</p>
            <div className="grid grid-cols-2 gap-8 reveal-up">
              <div className="space-y-2">
                <span className="font-headline-lg text-primary block">100%</span>
                <span className="font-label-sm uppercase text-on-surface-variant">Infinite Recyclable</span>
              </div>
              <div className="space-y-2">
                <span className="font-headline-lg text-primary block">0.0</span>
                <span className="font-label-sm uppercase text-on-surface-variant">BPA / Toxins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen py-40 bg-primary text-on-primary overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop mb-24 text-center">
          <span className="font-label-sm text-secondary-fixed-dim tracking-[0.3em] uppercase">Chapter 04</span>
          <h2 className="font-display-xl text-[40px] sm:text-display-xl-mobile md:text-display-xl font-bold mt-4">Crafted Without Compromise.</h2>
        </div>
        <div className="relative h-[800px] flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute left-1/2 -translate-x-1/2 -top-40 reveal-up" style={{ transitionDelay: '0.1s' }}>
              <img className="w-32 h-auto opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ZphSncVNOj3ENodjhBlfDn0FAmcMmlCCCyOefW0i4WJSSELflnZhp9beFPxdJkRCZwhohXAm34Dk2Ztz3kFB6YsZCtyz6ULVkYhYfUfpbHXebIWVyjm1rpSylfirjQjfucGkcntqAO-EJKpbLG_7oQjJZNo3DlKR8JbkLlA3EP5xoELUwNBV7EZT5HwtMmaxlfoADmSy_j3eJH5jTLhN9QJ0FRlf_qvp-iCwfLVpe1qNYAGE1kMv" alt="Precision Seal"/>
              <div className="absolute left-40 top-1/2 w-48 h-px bg-white/20"></div>
              <div className="absolute left-96 top-1/2 -translate-y-1/2 font-label-sm uppercase whitespace-nowrap">Precision Seal</div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 reveal-up" style={{ transitionDelay: '0.3s' }}>
              <img className="w-48 h-auto opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7cixzv7tAanKZ1rYdPBhOohaVx0OIbCQ8TuGf4V7Gw-pOgyNe9na0AXhoTX7HrDXo8DeEqiOdIOP1fgj3ltPFtRuCTQ5ZPi1kXbXJaSLxv_w9kDA9JfdbPfqEo9EdiKu4TDQy2ck0QVKl3laiqZT9sEfkwg_nuYVTitr7jmoxa0PowpfTImWrgWGRYDbhc2zYh4cfsnVWKU90SGk-YClC0WFBYGaZ6jpJlI8KG-w7UnXgXm33efpJ" alt="Borosilicate Core"/>
              <div className="absolute right-56 top-1/2 w-48 h-px bg-white/20"></div>
              <div className="absolute right-[440px] top-1/2 -translate-y-1/2 font-label-sm uppercase whitespace-nowrap text-right">Borosilicate Core</div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-60 reveal-up" style={{ transitionDelay: '0.5s' }}>
              <img className="w-64 h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_-HltDGr3fBRWFeZA7mST60DWFZmBN8K47asj8JGJvlB38bXsyAQ-I4Iz1ecE2njr12Bo5nblUeNqrrEksuJH7NcKjtGzPpbzzCvFx1tUdhNksml1-Sc_vwzx8SqUxiLtlMsqrv1vbJYC0q1uf_51XeNMAXfbORlds72fXPtxz_CCzKMsm9iP0kIBzcP8jrVKf0MU4FiTviGSYENwvet8tXcPf6tOszhp75lAcZ4AHhV4VO5hYpgq" alt="Titanium Shield"/>
              <div className="absolute left-72 bottom-20 w-48 h-px bg-white/20"></div>
              <div className="absolute left-[540px] bottom-20 -translate-y-1/2 font-label-sm uppercase whitespace-nowrap">Titanium Shield</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-screen flex items-center justify-center px-margin-mobile overflow-hidden">
        <h2 className="font-display-xl text-[12vw] font-extrabold uppercase leading-[0.8] text-primary/5 absolute whitespace-nowrap select-none">Design That Lives With You</h2>
        <div className="relative z-10 text-center max-w-2xl reveal-up">
          <h3 className="font-headline-lg mb-8">Design That Lives With You.</h3>
          <p className="font-body-lg">Our philosophy is simple: perfection is achieved not when there is nothing left to add, but when there is nothing left to take away. Aura is the final distillation of form and function.</p>
        </div>
      </section>

      <section className="py-40 px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up">
            <span className="font-label-sm text-secondary mb-4">01</span>
            <h4 className="font-headline-lg-mobile font-bold">Craftsmanship</h4>
          </div>
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up" style={{ transitionDelay: '0.1s' }}>
            <span className="font-label-sm text-secondary mb-4">02</span>
            <h4 className="font-headline-lg-mobile font-bold">Sustainability</h4>
          </div>
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up" style={{ transitionDelay: '0.2s' }}>
            <span className="font-label-sm text-secondary mb-4">03</span>
            <h4 className="font-headline-lg-mobile font-bold">Innovation</h4>
          </div>
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up" style={{ transitionDelay: '0.3s' }}>
            <span className="font-label-sm text-secondary mb-4">04</span>
            <h4 className="font-headline-lg-mobile font-bold">Simplicity</h4>
          </div>
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up" style={{ transitionDelay: '0.4s' }}>
            <span className="font-label-sm text-secondary mb-4">05</span>
            <h4 className="font-headline-lg-mobile font-bold">Longevity</h4>
          </div>
          <div className="glass-frost p-12 aspect-square flex flex-col justify-end hover:scale-[1.02] transition-transform duration-500 reveal-up" style={{ transitionDelay: '0.5s' }}>
            <span className="font-label-sm text-secondary mb-4">06</span>
            <h4 className="font-headline-lg-mobile font-bold">Community</h4>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen py-40 flex flex-col items-center justify-center overflow-hidden">
        <WebGLBackground fragmentShader={aboutUsFragmentShader} opacity={0.2} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 text-center space-y-16 reveal-up">
          <h2 className="font-display-xl text-display-xl-mobile sm:text-[64px] md:text-display-xl">Carry the Future.</h2>
          <div className="relative w-72 md:w-96 mx-auto">
            <img className="w-full h-auto drop-shadow-[0_50px_80px_rgba(0,0,0,0.1)] hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida/AP1WRLtyMT_rrY6HNLWu6l0_UjrN1FpuqcQxLHFt6P7TxIyzW_cxBr3V9Pe8RUpyFz4ubJIJMyHk0pbp-t7POpsS0mvGcgDDTyFNH3vVIHkvN7kWZ9E_95_0-ARN1mIA3n-B9ukyf8kR-5NBZ_cj3eI-CSYrvBDOg4ece-Qx0yU3MEe6EQ8mNtHMXnfzs5vs6JaY5MegTZwIRsTWY3sD6ses1kl2J_nJh3KvTyliA9sP7X7cumJQp9tYiwVoNJw" alt="Aura Collection"/>
          </div>
          <a 
            className="inline-block bg-primary text-on-primary px-16 py-6 rounded-full font-label-sm uppercase tracking-widest hover:scale-105 hover:shadow-2xl transition-all duration-300" 
            href="#"
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            Explore Collection
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
