import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebGLBackground from '../components/WebGLBackground';
import * as THREE from 'three';

const Error404 = () => {
  const threejsContainerRef = useRef(null);

  useEffect(() => {
    const container = threejsContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear the container first in case of strict mode double invocation
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
    
    for(let i = 0; i < 25; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*12, (Math.random()-0.5)*10);
      scene.add(sphere);
      objects.push({ 
        mesh: sphere, 
        speed: 0.001 + Math.random()*0.003, 
        phase: Math.random() * Math.PI * 2 
      });
    }

    const ringGeo = new THREE.TorusGeometry(3.5, 0.01, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.08 });
    
    for(let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set((Math.random()-0.5)*15, (Math.random()-0.5)*10, -5);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.0005 + Math.random()*0.001 });
    }

    camera.position.z = 12;

    const mouse = new THREE.Vector2();
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
      
      scene.rotation.y += (mouse.x * 0.08 - scene.rotation.y) * 0.02;
      scene.rotation.x += (-mouse.y * 0.08 - scene.rotation.x) * 0.02;
      
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

  const createRipple = (event) => {
    const bottleContainer = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(bottleContainer.clientWidth, bottleContainer.clientHeight);
    const radius = diameter / 2;

    const rect = bottleContainer.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("error404-ripple-effect");

    const ripple = bottleContainer.getElementsByClassName("error404-ripple-effect")[0];
    if (ripple) {
      ripple.remove();
    }

    bottleContainer.appendChild(circle);
    
    const img = document.getElementById('aura-bottle');
    if (img) {
      img.style.transform = 'scale(1.15)';
      img.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      setTimeout(() => {
        img.style.transform = '';
      }, 200);
    }
  };

  const handleMagneticHover = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
  };

  const handleMagneticLeave = (e) => {
    const button = e.currentTarget;
    button.style.transform = '';
  };

  return (
    <div className="bg-background text-on-background overflow-hidden font-body-md h-screen w-screen selection:bg-secondary-container relative">
      <WebGLBackground className="absolute inset-0 w-full h-full z-0" opacity={0.4} />
      
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <div ref={threejsContainerRef} style={{ width: '100%', height: '100%' }}></div>
      </div>

      <main className="relative z-20 h-full w-full flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop">
        <div className="relative flex flex-col items-center">
          <div className="relative flex items-center justify-center select-none pointer-events-none">
            <span className="font-display-xl text-[240px] md:text-[400px] leading-none text-primary opacity-5">4</span>
            <div 
              className="relative w-[180px] h-[350px] md:w-[280px] md:h-[550px] mx-[-20px] md:mx-[-40px] z-30 pointer-events-auto cursor-pointer" 
              onClick={createRipple}
            >
              <img 
                id="aura-bottle" 
                className="w-full h-full object-contain error404-float drop-shadow-2xl" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLv_2Bd5p_10tzfGgDmWTBlto5BV92zYrtBJQ0W85IXCRln3tf_E3yl4bIZ1VmM3ga4gSBILYUeKF4XVdYKhgSvxx0Kf0EVK7G7zc3vMwYg_ahrkuKELQIcOubBCMT8zxBfwPZHGvVEM977NthIDMpBgpf-DD49N_VVwxSiYjhjxOmHLBEHn6Ky9Hq1QNqlgxNkNKX02nIj0wkGBYFOIt6RFPrTrOGOYDAZwb1CPUAoyuOPHUfOsIUnnpIU" 
                alt="Aura Bottle"
              />
            </div>
            <span className="font-display-xl text-[240px] md:text-[400px] leading-none text-primary opacity-5">4</span>
          </div>

          <div className="mt-[-40px] md:mt-[-80px] text-center max-w-2xl animate-fade-in-up">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-primary tracking-tight">
              Looks like this journey took a wrong turn.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 px-4 md:px-0">
              The page you're looking for has drifted away, but there are plenty of beautiful places waiting to be explored.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link 
                to="/" 
                className="glass-card error404-magnetic-hover px-10 py-5 rounded-none font-label-sm uppercase tracking-widest text-primary border border-primary/10 transition-all flex items-center group"
                onMouseMove={handleMagneticHover}
                onMouseLeave={handleMagneticLeave}
              >
                <span className="material-symbols-outlined mr-2">west</span>
                Return Home
              </Link>
              <Link 
                to="/shop" 
                className="bg-primary error404-magnetic-hover px-10 py-5 rounded-none font-label-sm uppercase tracking-widest text-white transition-all flex items-center group"
                onMouseMove={handleMagneticHover}
                onMouseLeave={handleMagneticLeave}
              >
                Continue Shopping
                <span className="material-symbols-outlined ml-2">shopping_bag</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full py-12 px-margin-desktop z-40 hidden md:block">
        <div className="grid grid-cols-12 gap-gutter items-end w-full">
          <div className="col-span-4">
            <p className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/60">
              © 2024 HYDR8. ENGINEERED FOR PURITY.
            </p>
          </div>
          <div className="col-span-8 flex justify-end space-x-12">
            <a className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors" href="#">The Gallery</a>
            <a className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors" href="#">Technical Specifications</a>
            <a className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors" href="#">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Error404;
