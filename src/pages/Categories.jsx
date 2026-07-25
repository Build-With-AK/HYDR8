import React, { useEffect, useRef, useState } from 'react';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const categoriesFragmentShader = `precision highp float;
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
    
    // Volumetric light blooms that react to the explorer's presence
    float d1 = distance(uv, vec2(0.2, 0.8) + 0.2 * vec2(sin(u_time * 0.05), cos(u_time * 0.07)));
    float d2 = distance(uv, vec2(0.8, 0.2) + 0.2 * vec2(cos(u_time * 0.1), sin(u_time * 0.08)));
    float d3 = distance(uv, m);
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.9, 0.0, d1 + noise));
    finalColor = mix(finalColor, color3, smoothstep(0.8, 0.0, d2 + noise));
    finalColor = mix(finalColor, color2 * 1.1, smoothstep(0.4, 0.0, d3) * 0.2);
    
    // Premium editorial grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.012;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

const Categories = () => {
  const threejsContainerRef = useRef(null);
  const heroBottleRef = useRef(null);
  const [filterStyle, setFilterStyle] = useState('none');

  useEffect(() => {
    // Hero Parallax
    const handleScrollParallax = () => {
      const scroll = window.pageYOffset;
      if (heroBottleRef.current) {
        heroBottleRef.current.style.transform = `translateY(${scroll * 0.1}px) rotate(${scroll * 0.02}deg)`;
      }
    };
    window.addEventListener('scroll', handleScrollParallax);

    // Intersection Observer for Background Color Morphs
    const sections = document.querySelectorAll('section[data-color]');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const color = entry.target.getAttribute('data-color');
          updateAtmosphere(color);
          window.dispatchEvent(new Event('aura-category-switch'));
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateAtmosphere(theme) {
      switch (theme) {
        case 'cool-metallic':
          setFilterStyle('hue-rotate(0deg) saturate(0.5)');
          break;
        case 'crystal-refraction':
          setFilterStyle('hue-rotate(180deg) saturate(1.2)');
          break;
        case 'electric-aura':
          setFilterStyle('hue-rotate(220deg) saturate(1.5) brightness(1.2)');
          break;
        case 'arctic-mist':
          setFilterStyle('hue-rotate(160deg) saturate(0.8)');
          break;
        default:
          setFilterStyle('none');
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScrollParallax);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Three.js Logic
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

    for (let i = 0; i < 25; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10);
      scene.add(sphere);
      objects.push({
        mesh: sphere,
        speed: 0.001 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2
      });
    }

    const ringGeo = new THREE.TorusGeometry(4, 0.008, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.08 });

    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, -5);
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0005 + Math.random() * 0.001 });
    }

    camera.position.z = 12;

    const mouse = new THREE.Vector2();
    const handleThreeMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleThreeMouseMove);

    const handleCategorySwitch = () => {
      objects.forEach(obj => {
        obj.mesh.position.y += (Math.random() - 0.5) * 2;
      });
    };
    window.addEventListener('aura-category-switch', handleCategorySwitch);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      objects.forEach(obj => {
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 0.5;
        if (obj.phase !== undefined) {
          obj.mesh.position.y += Math.sin(Date.now() * 0.0004 + obj.phase) * 0.005;
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
      window.removeEventListener('aura-category-switch', handleCategorySwitch);
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
    <div className="bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container overflow-x-hidden font-body-md min-h-screen">

      {/* Fixed Atmosphere Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ filter: filterStyle, transition: 'filter 1s ease-in-out' }}>
        <WebGLBackground fragmentShader={categoriesFragmentShader} opacity={0.4} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
          <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>


      <main className="relative z-10">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden px-margin-mobile">
          <div className="text-center z-20 max-w-4xl">
            <span className="font-label-sm text-secondary uppercase tracking-[0.3em] mb-6 block">The Essence of Form</span>
            <h1 className="font-display-xl-mobile text-[48px] sm:text-[64px] md:text-display-xl font-bold leading-tight tracking-tighter text-primary mb-12">
              Find Your <br /> Perfect Bottle.
            </h1>
          </div>
          <div className="relative w-full max-w-[500px] aspect-[0.67] z-10 transition-transform" id="hero-bottle-container" ref={heroBottleRef} onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}>
            <img alt="AURA Noir" className="w-full h-full object-contain drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU" />
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
            <span className="font-label-sm uppercase tracking-widest">Scroll to Explore</span>
            <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent"></div>
          </div>
        </section>

        {/* Category Exhibition */}
        {/* 1. Stainless Steel Bottles */}
        <section className="w-full flex items-center justify-center py-40 relative px-margin-mobile md:px-margin-desktop bg-transparent transition-colors duration-1000" data-color="cool-metallic" id="stainless">
          <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1 flex flex-col gap-8">
              <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 inline-flex w-fit rounded-full px-6">
                <span className="font-label-sm text-primary uppercase">Series 01</span>
              </div>
              <h2 className="font-headline-lg-mobile md:text-headline-lg font-bold text-primary leading-none">Stainless Steel</h2>
              <p className="font-body-lg text-on-surface-variant max-w-md">Precision engineered from aerospace-grade 18/8 steel. A monolithic statement of purity and permanence.</p>
              <button
                className="bg-primary text-on-primary w-fit px-12 py-5 font-label-sm uppercase tracking-widest transition-transform mt-4 flex items-center gap-4 group"
                onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}
              >
                Explore Collection
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="md:col-span-7 relative order-1 md:order-2 h-[600px] md:h-[600px] flex items-center justify-center">
              {/* <img alt="Stainless Hero" className="h-4/5 object-contain z-10 transition-transform duration-700 hover:scale-105" src="https://bergnerhome.in/cdn/shop/files/BGIN-6565-1.jpg?v=1736093998&width=2048"/> */}
              <div className='rounded-4xl overflow-hidden '>
                <video autoPlay loop playsInline className="h-4/5 object-contain z-10 transition-transform duration-700 hover:scale-105">
                  <source src="https://res.cloudinary.com/kn1xtgkw/video/upload/v1784148874/StainLessStellBottle1_gsphgd.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-80 left-0 w-32 h-32 categories-orbit-mini" style={{ animationDelay: '0s' }}>
                <img alt="Mini 1" className="w-full h-full object-contain opacity-80 grayscale" src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784148874/Stainless_steel_water_bottle_sta__202607160212_kkmgog.jpg" />
              </div>
              <div className="absolute bottom-10 right-0 w-40 h-40 categories-orbit-mini" style={{ animationDelay: '-2s' }}>
                <img alt="Mini 2" className="w-full h-full object-contain opacity-80 blur-[1px]" src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784148875/Luxury_water_bottle_frozen_envir__202607160212_yjhfei.jpg" />
              </div>
              <div className="absolute top-40 right-20 w-24 h-24 categories-orbit-mini" style={{ animationDelay: '-4s' }}>
                <img alt="Mini 3" className="w-full h-full object-contain opacity-80" src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784148874/Stainless_steel_bottle_on_stone_202607160223_nnp7gd.jpg" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Silicon Bottles */}
        <section
          className="w-full flex items-center justify-center py-40 relative px-margin-mobile md:px-margin-desktop"
          data-color="crystal-refraction"
          id="glass"
        >
          <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7 relative h-[600px] md:h-[800px] flex items-center justify-center">
              <img
                alt="Silicone Bottle Hero"
                className="h-4/5 object-contain z-10"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4yeIzh_zC71KHlIPrkNhf8B02smtP4Ghet4qe_CakLr4sn3UwbE333qwJ&s=10"
              />
              <div
                className="absolute top-1/4 right-0 w-40 h-40 categories-orbit-mini"
                style={{ animationDelay: '-1s' }}
              >
                <img
                  alt="Silicone Detail 1"
                  className="w-full h-full object-contain opacity-40"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLsdxuQC4wqLgO9kruobx4o66N9M8uQe6btGbTqvOXVEkjZrwd1Tim2Xc7XhoLJy43pB6aWEDHq95Pr5lJO0t__KkjBmK7-0uKVBbGeD24IVOpaZPjXNkQXDEU0lmf-PWGqVpRukFGECzRuP8Mu5Ym0XJ1yQqADwIZLR2GRVixLGPReUmPeGL4edz2d2Q8078ZCY_N2IWIVz9nPnVx_iDnSCTB99yPwEw0En0Zvwe1W8FiFYyCj6QeprTps"
                />
              </div>
              <div
                className="absolute bottom-1/4 left-0 w-32 h-32 categories-orbit-mini"
                style={{ animationDelay: '-3s' }}
              >
                <img
                  alt="Silicone Detail 2"
                  className="w-full h-full object-contain opacity-60"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLsdxuQC4wqLgO9kruobx4o66N9M8uQe6btGbTqvOXVEkjZrwd1Tim2Xc7XhoLJy43pB6aWEDHq95Pr5lJO0t__KkjBmK7-0uKVBbGeD24IVOpaZPjXNkQXDEU0lmf-PWGqVpRukFGECzRuP8Mu5Ym0XJ1yQqADwIZLR2GRVixLGPReUmPeGL4edz2d2Q8078ZCY_N2IWIVz9nPnVx_iDnSCTB99yPwEw0En0Zvwe1W8FiFYyCj6QeprTps"
                />
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 inline-flex w-fit rounded-full px-6">
                <span className="font-label-sm text-primary uppercase">Series 02</span>
              </div>

              <h2 className="font-headline-lg-mobile md:text-headline-lg font-bold text-primary leading-none">
                Silicone Bottles
              </h2>

              <p className="font-body-lg text-on-surface-variant max-w-md">
                Soft-touch, flexible, and built for everyday use, our food-grade silicone bottles keep your drinks tasting clean while standing up to drops, commutes, and workouts.
              </p>


              <button
                className="bg-primary text-on-primary w-fit px-12 py-5 font-label-sm uppercase tracking-widest transition-transform mt-4"
                onMouseMove={handleMagneticHover}
                onMouseLeave={handleMagneticLeave}
              >
                Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* 3. Smart */}
        <section className="w-full flex items-center justify-center py-40 relative px-margin-mobile md:px-margin-desktop" data-color="electric-aura" id="smart">
          <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1 flex flex-col gap-8">
              <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 inline-flex w-fit rounded-full px-6">
                <span className="font-label-sm text-secondary uppercase">The Future</span>
              </div>
              <h2 className="font-headline-lg-mobile md:text-headline-lg font-bold text-primary leading-none">Smart Hydration</h2>
              <p className="font-body-lg text-on-surface-variant max-w-md">Bio-metric tracking meets liquid purity. Glowing rings of light communicate your hydration status in real-time.</p>
              <button
                className="bg-primary text-on-primary w-fit px-12 py-5 font-label-sm uppercase tracking-widest transition-transform mt-4"
                onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}
              >
                Discover Intelligence
              </button>
            </div>
            <div className="md:col-span-7 relative order-1 md:order-2 h-[600px] md:h-[800px] flex items-center justify-center">
              <img alt="Smart Hero" className="h-4/5 object-contain z-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4yeIzh_zC71KHlIPrkNhf8B02smtP4Ghet4qe_CakLr4sn3UwbE333qwJ&s=10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] border border-secondary/20 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-10 right-20 w-28 h-28 categories-orbit-mini">
                <img alt="Mini" className="w-full h-full object-contain opacity-30" src="https://lh3.googleusercontent.com/aida/AP1WRLvxRDSfleZlCo9X5DemLMclfVtCTsm5t_ZQ4410juc9ZoYe3tY6Q7eCq3WJesI69B9Pw3A9xgDQMGYGrysp0-OEQDqBfgRnqbb-7oFwHmUmjCvenLouo4PUXRBsDICe7lSV516l8qFyELQwvGP0u8gISgF5x8vCLdv5yALi11i49C5IoqxVTzHcPtY2MZFnX2j6h7jezUeOc3wJxunIIRGFwl-l86spWjQG_PK9WOZr70514sMO5pumSA" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Travel/Sports */}
        <section className="w-full flex items-center justify-center py-40 relative px-margin-mobile md:px-margin-desktop" data-color="arctic-mist" id="travel">
          <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7 relative h-[600px] md:h-[800px] flex items-center justify-center">
              <img alt="Travel Collection" className="h-4/5 object-contain z-10" src="https://lh3.googleusercontent.com/aida/AP1WRLvZwRdSlR_ft58wALPM9z9rd1cFzj84viYAt-00QB4gtlbQz5D8f-8MFT6A0EDHyoYJz2P1zp1z8kBawpONFUjohZFCuGC22ADwYI5CEbxBup--VNL4PsfBKLe44EoSrwrHrmL418YTy2-3kCMDUF-R9_OeqVo1FvtQ-oONo6bnZYzIkEkDrqiVpwUKCcWMHIzoY511WDxmDYueY4NC46ruvuvUuXDBOI07DNLJJLVV2n0RfJmsr53ykHI" />
              <div className="absolute top-1/4 left-1/4 w-48 h-48 categories-orbit-mini opacity-20 blur-xl bg-secondary-container rounded-full"></div>
            </div>
            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 inline-flex w-fit rounded-full px-6">
                <span className="font-label-sm text-primary uppercase">Active Series</span>
              </div>
              <h2 className="font-headline-lg-mobile md:text-headline-lg font-bold text-primary leading-none">Travel & Sports Bottles</h2>
              <p className="font-body-lg text-on-surface-variant max-w-md">Designed for the nomadic soul. High-flow caps and lightweight carbiner-ready builds for every peak and terminal.</p>
              <button
                className="bg-primary text-on-primary w-fit px-12 py-5 font-label-sm uppercase tracking-widest transition-transform mt-4"
                onMouseMove={handleMagneticHover} onMouseLeave={handleMagneticLeave}
              >
                Shop Performance
              </button>
            </div>
          </div>
        </section>

        {/* 5. Kids Bottles  */}
        <section
          className="w-full flex items-center justify-center py-40 relative px-margin-mobile md:px-margin-desktop"
          data-color="electric-aura"
          id="smart"
        >
          <div className="max-w-container-max w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1 flex flex-col gap-8">
              <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 inline-flex w-fit rounded-full px-6">
                <span className="font-label-sm text-secondary uppercase">For Little Explorers</span>
              </div>

              <h2 className="font-headline-lg-mobile md:text-headline-lg font-bold text-primary leading-none">
                Smart Kids Bottles
              </h2>

              <p className="font-body-lg text-on-surface-variant max-w-md">
                Made for tiny hands and big adventures, our kids’ bottles are light, grippy, and easy to sip from, keeping water close by through school days and playtime.
              </p>

              <button
                className="bg-primary text-on-primary w-fit px-12 py-5 font-label-sm uppercase tracking-widest transition-transform mt-4"
                onMouseMove={handleMagneticHover}
                onMouseLeave={handleMagneticLeave}
              >
                Discover Kids Range
              </button>
            </div>

            <div className="md:col-span-7 relative order-1 md:order-2 h-[600px] md:h-[800px] flex items-center justify-center">
              <img
                alt="Kids Bottle Hero"
                className="h-4/5 object-contain z-10"
                src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784148874/Stainless_steel_bottle_on_stone_202607160223_nnp7gd.jpg"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] border border-secondary/20 rounded-full animate-pulse"></div>
              </div>

              <div className="absolute top-10 right-20 w-28 h-28 categories-orbit-mini">
                <img
                  alt="Kids Bottle Detail"
                  className="w-full h-full object-contain opacity-30"
                  src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784148874/Stainless_steel_bottle_on_stone_202607160223_nnp7gd.jpg"
                />
              </div>
              <div className="absolute top-130 left-15 w-28 h-90 categories-orbit-mini">
                <img
                  alt="Kids Bottle Detail"
                  className="w-full h-full object-contain opacity-100"
                  src="https://res.cloudinary.com/kn1xtgkw/image/upload/v1784151271/Kids_water_bottle_on_desk_202607160224_wwxe6h.jpg"
                />
              </div>
            </div>
          </div>
        </section>
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 sm:px-margin-mobile md:py-0">

          {/* ambient liquid glow — evokes water/purity without adding new colors */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[520px] w-[70vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] animate-[breathe_8s_ease-in-out_infinite]"
          />

          <div className="sticky top-1/2 -translate-y-1/2 z-10 mx-auto max-w-3xl text-center">
            <h3 className="select-none bg-gradient-to-b from-primary/25 via-primary/10 to-primary/5 bg-clip-text font-display-xl-mobile text-display-xl-mobile sm:text-[64px] md:text-display-xl font-bold leading-[0.95] tracking-tight text-transparent">
              CONTINUOUS <br /> EVOLUTION
            </h3>

            <p className="font-body-lg text-on-surface-variant mx-auto mt-6 max-w-xl rounded-xl border border-white/50 bg-white/40 p-6 shadow-[0_8px_32px_-8px] shadow-primary/10 backdrop-blur-md sm:p-8 md:mt-8">
              Our collection extends further. Insulated for 48-hour cold, miniaturized for kids, and expanded for smart lifestyle integration. Each piece carries the AURA hallmark of liquid purity.
            </p>
          </div>

          <style>{`
    @keyframes breathe {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-\\[breathe_8s_ease-in-out_infinite\\] { animation: none; }
    }
  `}</style>
        </div>
      </main>

    </div>
  );
};

export default Categories;
