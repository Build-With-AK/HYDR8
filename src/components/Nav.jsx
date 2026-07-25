import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onButtonClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 sm:px-8 md:px-10 py-3 md:py-4 bg-white/40 backdrop-blur-md rounded-full mt-4 md:mt-6 mx-auto w-[92%] sm:w-[90%] max-w-container-max border border-white/50 dark:border-white/10 shadow-sm transition-all duration-500 ease-in-out">
      <Link to="/" onClick={closeMenu} className="font-display-xl text-[20px] sm:text-[24px] font-bold tracking-tighter text-black">Hydr8</Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="font-body-md text-label-sm uppercase tracking-widest text-black font-bold border-b border-primary">Home</Link>
        <Link to="/about" className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
        <Link to="/categories" className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Categories</Link>
        <Link to="/blog" className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Blogs</Link>
        <Link to="/contact" className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Contact Us</Link>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <button onClick={() => onButtonClick("/cart")} className="material-symbols-outlined text-primary hover:scale-105 transition-transform text-[22px]">shopping_bag</button>
        <button onClick={() => onButtonClick("/login")} className="material-symbols-outlined text-primary hover:scale-105 transition-transform text-[22px]">person</button>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden material-symbols-outlined text-primary text-[24px]"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? 'close' : 'menu'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[92%] sm:w-[90%] bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl py-4 px-2 flex flex-col gap-1 animate-[fadeIn_0.2s_ease-out]">
          <Link to="/" onClick={closeMenu} className="font-body-md text-label-sm uppercase tracking-widest text-black font-bold border-b border-primary px-5 py-3">Home</Link>
          <Link to="/about" onClick={closeMenu} className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors px-5 py-3">About Us</Link>
          <Link to="/categories" onClick={closeMenu} className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors px-5 py-3">Categories</Link>
          <Link to="/blog" onClick={closeMenu} className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors px-5 py-3">Blogs</Link>
          <Link to="/contact" onClick={closeMenu} className="font-body-md text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors px-5 py-3">Contact Us</Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
