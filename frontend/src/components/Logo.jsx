import React from 'react';
import { FaTruck } from 'react-icons/fa';

const Logo = ({ w = 120, h = 40, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg'>
        <FaTruck className='text-white text-xl' />
      </div>
      {showText && (
        <div className='text-xl font-bold text-gray-800'>
          Universal Wallpaper
        </div>
      )}
    </div>
  );
};

export default Logo;