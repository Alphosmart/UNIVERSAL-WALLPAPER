import React from 'react';

const Logo = ({ w = 120, h = 40, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/logo.svg" 
        alt="Universal Wallpaper Logo"
        width={h}
        height={h}
        className="object-contain"
      />
      {showText && (
        <div className='text-xl font-bold text-gray-800'>
          Universal Wallpaper
        </div>
      )}
    </div>
  );
};

export default Logo;