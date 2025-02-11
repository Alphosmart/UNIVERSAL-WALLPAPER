import React from 'react';
import Logo from './Logo';
import { CiSearch } from 'react-icons/ci';

const Header = () => {
  return (
    <header className="h-16 shadow-md">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className=''>
          <Logo w={90} h={50} />
        </div>

        <div className='flex items-center'>
          <input type="text" placeholder='search product here...' />
          <div className='text-lg'>
          <CiSearch/>
        </div>
        </div>
        
        
        <div>
          user icon and cart
        </div>
      </div>
    </header>
  );
}

export default Header;