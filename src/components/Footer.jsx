import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 w-full py-16 bg-background border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-display-xl text-display-xl-mobile font-bold tracking-tighter text-primary">Hydr8</div>
          <p className="font-label-sm text-label-sm text-on-surface-variant text-center md:text-left">© 2024 HYDR8 LIQUID PURITY. ALL RIGHTS RESERVED.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity" href="#">Shipping</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:opacity-70 transition-opacity" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
