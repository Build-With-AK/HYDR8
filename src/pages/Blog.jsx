import React, { useEffect, useRef } from 'react';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const blogFragmentShader = `precision highp float;
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
    
    // Smooth, evolving noise for an editorial "paper-and-water" atmosphere
    float noise = sin(uv.x * 2.5 + u_time * 0.1) * cos(uv.y * 3.0 + u_time * 0.12) * 0.15;
    
    // Interactive Water Ripple logic for the Journal focus
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 20.0 - u_time * 2.0) * exp(-distToMouse * 4.0) * 0.02;
    
    // Volumetric light blooms that move with the narrative flow
    float d1 = distance(uv, vec2(0.1, 0.9) + 0.2 * vec2(sin(u_time * 0.05), cos(u_time * 0.07)));
    float d2 = distance(uv, vec2(0.9, 0.1) + 0.2 * vec2(cos(u_time * 0.09), sin(u_time * 0.06)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.9, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.8, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.1, smoothstep(0.4, 0.0, distToMouse) * 0.25);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.012;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const Blog = () => {
  const threejsContainerRef = useRef(null);
  const scrollProgressRef = useRef(null);

  useEffect(() => {
    // Reading Progress Indicator Logic
    const handleScroll = () => {
      if (scrollProgressRef.current) {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgressRef.current.style.height = progress + '%';
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for Fade In
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-aos="fade-up"]').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    
    for(let i = 0; i < 28; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*15, (Math.random()-0.5)*12);
      scene.add(sphere);
      objects.push({ 
        mesh: sphere, 
        speed: 0.001 + Math.random()*0.003, 
        phase: Math.random() * Math.PI * 2 
      });
    }

    const ringGeo = new THREE.TorusGeometry(4.5, 0.009, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.07 });
    
    for(let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*12, -8);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0006 + Math.random()*0.0012 });
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
          obj.mesh.position.y += Math.sin(Date.now() * 0.0005 + obj.phase) * 0.006;
        }
      });
      
      scene.rotation.y += (mouse.x * 0.05 - scene.rotation.y) * 0.02;
      scene.rotation.x += (-mouse.y * 0.05 - scene.rotation.x) * 0.02;
      
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

  const handleMagneticHover = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
  };

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget;
    btn.style.transform = `translate(0, 0) scale(1)`;
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary/30 overflow-x-hidden min-h-screen">
      <div className="blog-noise-overlay"></div>
      
      {/* Reading Progress */}
      <div className="blog-vertical-progress hidden md:block">
        <div className="blog-progress-fill" ref={scrollProgressRef}></div>
      </div>

      <main className="relative pt-20">
        {/* Liquid Background Shader */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <WebGLBackground fragmentShader={blogFragmentShader} opacity={0.4} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
            <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="min-h-[80vh] relative flex items-center justify-center px-margin-mobile md:px-margin-desktop pt-12 pb-40 overflow-hidden">
          <div className="max-w-container-max grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10 w-full">
            <div className="md:col-span-8 flex flex-col items-start gap-8">
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/30 px-4 py-1 rounded-full uppercase">Editorial Issue 04</span>
              <h1 className="font-display-xl-mobile text-[48px] sm:text-[64px] md:text-display-xl text-primary leading-[0.9] tracking-tighter max-w-4xl">
                Stories That Inspire <br/><span className="text-on-surface-variant/40">Better Hydration.</span>
              </h1>
            </div>
            <div className="md:col-span-4 relative flex justify-center">
              <div className="blog-animate-float relative">
                <img alt="Flagship Aura Bottle" className="w-full max-w-[400px] object-contain drop-shadow-2xl" src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"/>
                <div className="absolute -top-10 -right-10 w-24 h-24 glass-frost rounded-full blog-animate-float" style={{ animationDelay: '-2s' }}></div>
                <div className="absolute bottom-20 -left-16 w-12 h-12 border-2 border-primary/20 rounded-full blog-animate-float" style={{ animationDelay: '-4s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Topic Filter Rail */}
        <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-md sticky top-20 z-40">
          <div className="flex justify-center gap-12 overflow-x-auto no-scrollbar px-margin-mobile whitespace-nowrap">
            <button className="font-label-sm text-label-sm uppercase tracking-widest text-primary magnetic-hover transition-transform" onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>Health</button>
            <button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-primary magnetic-hover transition-transform" onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>Environment</button>
            <button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-primary magnetic-hover transition-transform" onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>Design</button>
            <button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-primary magnetic-hover transition-transform" onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>Performance</button>
            <button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-primary magnetic-hover transition-transform" onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>Wellness</button>
          </div>
        </section>

        {/* Featured Story */}
        <section className="min-h-[80vh] flex items-center bg-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-white flex flex-col gap-8 w-full">
            <div className="flex items-center gap-6">
              <span className="glass-frost px-6 py-2 rounded-full font-label-sm text-label-sm text-white border-white/20">Wellness</span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase opacity-80">5 MIN READ</span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg max-w-2xl leading-tight">
              How Much Water Should You Drink Every Day? <br/><span className="text-white/40 italic">The Science of Cellular Vitality.</span>
            </h2>
            <a className="inline-flex items-center gap-4 group/btn" href="#">
              <span className="font-label-sm text-label-sm uppercase tracking-widest">Read Article</span>
              <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-2">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* Editorial Story Panels */}
        <section className="py-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 gap-x-gutter">
            {/* Story 1 */}
            <article className="md:col-span-7 group cursor-pointer relative" data-aos="fade-up">
              <div className="relative overflow-hidden aspect-[4/5] md:aspect-[16/10] mb-12">
                <img alt="Stainless Steel Anatomy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=900&q=80"/>
                <div className="absolute top-8 left-8 glass-frost p-8 max-w-xs transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                  <span className="font-label-sm text-label-sm text-primary mb-4 block uppercase tracking-widest">Material Study</span>
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-6">Benefits of Stainless Steel Bottles</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Beyond durability. Exploring the temperature-lock technology that preserves purity for 24 hours.</p>
                </div>
              </div>
            </article>

            {/* Story 2 */}
            <article className="md:col-start-9 md:col-span-4 self-center group cursor-pointer" data-aos="fade-up" data-aos-delay="200">
              <div className="glass-frost p-12 relative z-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-4 border-l-4 border-primary">
                <span className="font-label-sm text-label-sm text-secondary mb-6 block uppercase tracking-widest">Maintenance</span>
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-8 leading-tight">How to Clean Your Bottle Properly</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-12">A step-by-step guide to maintaining antimicrobial integrity and ensuring a lifelong companion.</p>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase opacity-40 tracking-widest">3 MIN READ</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_outward</span>
                </div>
              </div>
              <div className="mt-8 overflow-hidden aspect-square">
                <div className="w-full h-full bg-surface-container-high transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&q=80')", backgroundSize: 'cover' }}></div>
              </div>
            </article>

            {/* Story 3 */}
            <article className="md:col-start-2 md:col-span-10 group cursor-pointer mt-20" data-aos="fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-white/20">
                <div className="bg-primary p-20 flex flex-col justify-between text-on-primary">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] mb-12 block text-secondary-container">The Impact</span>
                    <h3 className="font-display-xl-mobile text-[40px] sm:text-display-xl-mobile md:text-[56px] leading-none mb-12">Plastic vs <br/>Stainless Steel</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="h-[1px] w-full bg-white/20"></div>
                    <p className="font-body-lg text-body-lg text-on-primary-container">An investigative look at the microplastic epidemic and the structural solution of AURA.</p>
                    <button className="mt-8 border border-white/20 px-8 py-4 rounded-full font-label-sm text-label-sm uppercase hover:bg-white hover:text-primary transition-all">Read Investigation</button>
                  </div>
                </div>
                <div className="relative min-h-[400px] overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80')" }}></div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-40 px-margin-mobile md:px-margin-desktop bg-surface-container-low relative overflow-hidden">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-20 relative z-10">
            <div className="max-w-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-8">Never Miss A Story</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">Join 50,000+ hydration enthusiasts receiving our weekly dispatch on wellness, design, and environmental innovation.</p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input className="flex-grow bg-white border-b-2 border-primary/10 focus:border-primary p-4 outline-none font-body-md text-body-md transition-all" placeholder="email@address.com" type="email"/>
                <button className="bg-primary text-on-primary px-12 py-4 font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 transition-transform">Subscribe</button>
              </form>
            </div>
            <div className="hidden lg:block relative group">
              <div className="absolute -inset-10 glass-frost rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img alt="Aura Bottle" className="w-64 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"/>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blog;
