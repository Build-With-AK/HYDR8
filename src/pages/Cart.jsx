import React, { useEffect, useRef, useState } from 'react';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const cartFragmentShader = `precision highp float;
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
    
    // Smooth, evolving noise for a liquid-metal-meets-water atmosphere
    float noise = sin(uv.x * 3.0 + u_time * 0.1) * cos(uv.y * 3.5 + u_time * 0.12) * 0.15;
    
    // Interactive Water Ripple logic for the "Curated" atmosphere
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 20.0 - u_time * 2.0) * exp(-distToMouse * 4.0) * 0.02;
    
    // Volumetric light blooms that move with the narrative flow
    float d1 = distance(uv, vec2(0.2, 0.8) + 0.2 * vec2(sin(u_time * 0.05), cos(u_time * 0.07)));
    float d2 = distance(uv, vec2(0.8, 0.2) + 0.2 * vec2(cos(u_time * 0.1), sin(u_time * 0.08)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.9, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.8, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.1, smoothstep(0.4, 0.0, distToMouse) * 0.25);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.012;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const Cart = () => {
  const threejsContainerRef = useRef(null);
  const heroBottleRef = useRef(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Simple count-up effect for grand total
    let startValue = 0;
    const endValue = 415.00;
    const duration = 2000;
    const increment = endValue / (duration / 16);
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        setGrandTotal(endValue);
        clearInterval(timer);
      } else {
        setGrandTotal(startValue);
      }
    }, 16);

    return () => clearInterval(timer);
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
    
    for(let i = 0; i < 24; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*12, (Math.random()-0.5)*10);
      scene.add(sphere);
      objects.push({ 
        mesh: sphere, 
        speed: 0.001 + Math.random()*0.003, 
        phase: Math.random() * Math.PI * 2 
      });
    }

    const ringGeo = new THREE.TorusGeometry(4.2, 0.008, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.06 });
    
    for(let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random()-0.5)*16, (Math.random()-0.5)*10, -5);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0004 + Math.random()*0.0008 });
    }

    camera.position.z = 12;

    const mouse = new THREE.Vector2();
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Cursor-responsive bottle tilt
      if (heroBottleRef.current) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        heroBottleRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      objects.forEach(obj => {
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 0.5;
        if(obj.phase !== undefined) {
          obj.mesh.position.y += Math.sin(Date.now() * 0.0004 + obj.phase) * 0.005;
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleMagneticHover = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05) translateY(-5px)`;
  };

  const handleMagneticLeave = (e) => {
    const button = e.currentTarget;
    button.style.transform = `translate(0px, 0px) scale(1)`;
  };

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-fixed-dim/30 overflow-x-hidden relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WebGLBackground fragmentShader={cartFragmentShader} opacity={0.6} className="w-full h-full" />
        <div className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
          <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>

      <main className="relative z-10 pt-40 pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <section className="flex flex-col md:flex-row items-center justify-between gap-16 min-h-[70vh]">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="font-label-sm text-secondary uppercase tracking-[0.3em]">Curation Stage 01</span>
              <h1 className="font-display-xl-mobile text-[48px] sm:text-[64px] md:text-display-xl font-bold leading-tight text-primary">
                Your Curated<br/>Collection.
              </h1>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Every bottle you've selected has been thoughtfully crafted. Review your collection before continuing your journey into the realm of liquid purity.
            </p>
            <div className="flex gap-6">
              <button className="flex items-center gap-3 bg-primary text-on-primary px-10 py-5 font-label-sm rounded-full transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] group">
                <span>SECURE CHECKOUT</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center" style={{ perspective: '1000px' }}>
            <div className="relative cart-floating-parallax cursor-pointer transition-transform duration-500 ease-out" ref={heroBottleRef}>
              <img 
                alt="Hydr8 Noir Bottle" 
                className="w-72 md:w-[450px] drop-shadow-[0_80px_100px_rgba(0,0,0,0.15)] filter saturate-[0.8] contrast-[1.1]" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU"
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 blur-2xl rounded-full"></div>
            </div>
          </div>
        </section>

        <section className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-7 group">
            <div 
              className="glass-frost rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 magnetic-hover relative overflow-hidden"
              onMouseMove={handleMagneticHover}
              onMouseLeave={handleMagneticLeave}
            >
              <div className="w-full md:w-1/2">
                <img alt="Hydr8 Noir" className="w-full h-auto drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU"/>
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <div className="space-y-2">
                  <span className="font-label-sm text-secondary">01 / 03</span>
                  <h3 className="font-headline-lg text-headline-lg text-primary">Hydr8 Noir</h3>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Finish: Matte Charcoal</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant mb-2">QUANTITY</span>
                    <div className="flex items-center gap-4 glass-frost rounded-full px-4 py-2 border-white/20">
                      <button className="material-symbols-outlined text-primary hover:text-secondary-fixed-dim transition-colors cart-liquid-ripple p-1">remove</button>
                      <span className="font-body-md font-bold px-2">01</span>
                      <button className="material-symbols-outlined text-primary hover:text-secondary-fixed-dim transition-colors cart-liquid-ripple p-1">add</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-grow">
                    <span className="font-label-sm text-on-surface-variant mb-2">PRICE</span>
                    <span className="font-headline-lg text-headline-lg text-primary">$185.00</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 font-label-sm text-error/60 hover:text-error transition-colors group/del">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span className="border-b border-transparent group-hover/del:border-error">DISSOLVE FROM COLLECTION</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:row-span-2">
            <div className="sticky top-32 glass-frost rounded-[40px] p-12 space-y-12">
              <h2 className="font-headline-lg text-headline-lg text-primary">Curated Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="font-body-md text-on-surface-variant">Collection Subtotal</span>
                  <span className="font-body-md font-bold text-primary">$415.00</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="font-body-md text-on-surface-variant">Sustainable Logistics</span>
                  <span className="font-body-md font-bold text-primary">COMPLIMENTARY</span>
                </div>
                <div className="flex flex-col gap-4 py-4">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">ACCESS CODE</span>
                  <div className="relative group/input">
                    <input className="w-full bg-white/5 border-b border-white/20 focus:border-secondary-fixed-dim focus:ring-0 px-0 py-4 font-body-md transition-all outline-none" placeholder="GIFT-AURA-2024" type="text"/>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary-fixed-dim hover:text-secondary transition-colors">arrow_forward</button>
                  </div>
                </div>
              </div>
              <div className="pt-8 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-label-sm text-on-surface-variant mb-4">GRAND TOTAL</span>
                  <div className="text-right">
                    <span className="font-display-xl-mobile md:text-[64px] font-bold text-primary tracking-tighter leading-none">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary py-6 rounded-full font-label-sm tracking-[0.2em] overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
                  <span className="relative z-10">INITIATE SECURE CHECKOUT</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-fixed-dim/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
                <button className="w-full text-center font-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">keyboard_backspace</span>
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div 
              className="glass-frost rounded-[40px] p-12 flex flex-col md:flex-row-reverse items-center gap-12 magnetic-hover overflow-hidden"
              onMouseMove={handleMagneticHover}
              onMouseLeave={handleMagneticLeave}
            >
              <div className="w-full md:w-1/2">
                <img alt="AURA Crystal" className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLsdxuQC4wqLgO9kruobx4o66N9M8uQe6btGbTqvOXVEkjZrwd1Tim2Xc7XhoLJy43pB6aWEDHq95Pr5lJO0t__KkjBmK7-0uKVBbGeD24IVOpaZPjXNkQXDEU0lmf-PWGqVpRukFGECzRuP8Mu5Ym0XJ1yQqADwIZLR2GRVixLGPReUmPeGL4edz2d2Q8078ZCY_N2IWIVz9nPnVx_iDnSCTB99yPwEw0En0Zvwe1W8FiFYyCj6QeprTps"/>
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <div className="space-y-2">
                  <span className="font-label-sm text-secondary">02 / 03</span>
                  <h3 className="font-headline-lg text-headline-lg text-primary">Hydr8 Crystal</h3>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Finish: Borosilicate Clear</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant mb-2">QUANTITY</span>
                    <div className="flex items-center gap-4 glass-frost rounded-full px-4 py-2">
                      <button className="material-symbols-outlined text-primary cart-liquid-ripple">remove</button>
                      <span className="font-body-md font-bold px-2">01</span>
                      <button className="material-symbols-outlined text-primary cart-liquid-ripple">add</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-grow">
                    <span className="font-label-sm text-on-surface-variant mb-2">PRICE</span>
                    <span className="font-headline-lg text-headline-lg text-primary">$135.00</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 font-label-sm text-error/60 hover:text-error transition-colors group/del">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>DISSOLVE FROM COLLECTION</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div 
              className="glass-frost rounded-[40px] p-12 flex flex-col items-center gap-8 magnetic-hover"
              onMouseMove={handleMagneticHover}
              onMouseLeave={handleMagneticLeave}
            >
              <div className="h-64 flex items-center justify-center">
                <img alt="AURA Aqua" className="h-full w-auto drop-shadow-xl" src="https://lh3.googleusercontent.com/aida/AP1WRLtyMT_rrY6HNLWu6l0_UjrN1FpuqcQxLHFt6P7TxIyzW_cxBr3V9Pe8RUpyFz4ubJIJMyHk0pbp-t7POpsS0mvGcgDDTyFNH3vVIHkvN7kWZ9E_95_0-ARN1mIA3n-B9ukyf8kR-5NBZ_cj3eI-CSYrvBDOg4ece-Qx0yU3MEe6EQ8mNtHMXnfzs5vs6JaY5MegTZwIRsTWY3sD6ses1kl2J_nJh3KvTyliA9sP7X7cumJQp9tYiwVoNJw"/>
              </div>
              <div className="w-full text-center space-y-4">
                <h3 className="font-headline-lg text-headline-lg text-primary">Hydr8 Frost</h3>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Finish: Arctic Blue</p>
                <span className="block font-headline-lg text-headline-lg text-primary">$95.00</span>
                <div className="flex justify-center gap-4 pt-4">
                  <div className="flex items-center gap-4 glass-frost rounded-full px-6 py-3">
                    <button className="material-symbols-outlined text-primary cart-liquid-ripple">remove</button>
                    <span className="font-body-md font-bold">01</span>
                    <button className="material-symbols-outlined text-primary cart-liquid-ripple">add</button>
                  </div>
                  <button className="glass-frost w-14 h-14 rounded-full flex items-center justify-center text-error/60 hover:text-error transition-all hover:rotate-12">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-primary rounded-[40px] p-12 flex flex-col justify-end text-on-primary overflow-hidden relative group">
            <div className="absolute inset-0 opacity-40 mix-blend-screen group-hover:scale-110 transition-transform duration-[2s]">
              <WebGLBackground fragmentShader={cartFragmentShader} opacity={1} className="w-full h-full" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="font-label-sm text-secondary-fixed uppercase tracking-widest">THE EXPERIENCE</span>
              <h2 className="font-display-xl-mobile text-[48px] sm:text-[64px] md:text-display-xl font-bold leading-tight">Elevated<br/>Hydration.</h2>
              <p className="font-body-md text-on-primary-fixed max-w-xs">Complete your checkout to access the exclusive AURA rewards program and sustainability dashboard.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cart;
