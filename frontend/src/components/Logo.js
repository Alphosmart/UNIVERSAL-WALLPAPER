import React from 'react';

const Logo = ({ w = 90, h = 50 }) => {
  return (
    <img 
      src="/uwi.png" 
      alt="Universal Wallpaper" 
      width={w} 
      height={h}
      className="object-contain"
      style={{ maxWidth: w, maxHeight: h }}
    />
  );
};

export default Logo;