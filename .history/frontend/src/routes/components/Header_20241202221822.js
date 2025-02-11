import React from 'react'
import Logo from './logo';

const Header = () => {
  return (
    <header>
      <div className="cointainer mx-auto">
        <div className=''>
          <Logo w={100} h={66}/>
        </div>
      </div>
    </header>
  )
}

export default Header