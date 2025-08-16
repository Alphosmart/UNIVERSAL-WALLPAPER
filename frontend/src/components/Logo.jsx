import React from 'react';
import logoSvg from '../assets/ashamsmart logo RGB.svg';

const logo = ({ w, h }) => {
  return (
    <img 
      src={logoSvg} 
      alt="AshAmSmart Logo" 
      width={w} 
      height={h}
      className="object-contain"
    />
  );
};

export default logo;