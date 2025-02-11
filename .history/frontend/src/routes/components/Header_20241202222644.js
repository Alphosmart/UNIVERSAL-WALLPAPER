import React from 'react'
import Logo from './Logo';

const Header = () => {
  return (
    <header className="h-16">
      <div className="container mx-auto">
        <div className=''>
          <Logo w={0} h={30}/>
        </div>
      </div>
    </header>
  )
}

export default Header