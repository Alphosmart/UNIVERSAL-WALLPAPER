import React from 'react';
import Logo from './Logo';
import { GrSearch } from 'react-icons/gr';
import {FaRegCircleUser} from 'react-icons/fa6';
import {FaShoppingCart} from

const Header = () => {
  return (
    <header className="h-16 shadow-md">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className=''>
          <Logo w={90} h={50} />
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow  pl-2'>
          <input type="text" placeholder='search product here...' className='w-full outline-none' />
          <div className='text-lg min-w-[50px] h-8 b bg-red-600 flex items-center justify-center rounded-r-full text-white'>
          <GrSearch/>
        </div>
        </div>
        
        
        <div  className='text-3xl cursor-pointer'>
          <FaRegCircleUser/>
        </div>
      </div>
    </header>
  );
}

export default Header;