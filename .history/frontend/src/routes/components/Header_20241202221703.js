import React from 'react'
import { class } from './../../../node_modules/jiti/dist/babel';
import Logo from './Logo';

const Header = () => {
  return (
    <header>
      <div className="cointainer mx-auto">
        <div className=''>
          <Logo/>
        </div>
      </div>
    </header>
  )
}

export default Header