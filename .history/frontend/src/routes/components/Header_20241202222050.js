import React from 'react'
import Logo from './logo';

const Header = () => {
  return (
    <header className="h-16">
      <div className="container mx-auto">
        <div className=''>
          <Logo w={100} h={60}/>
        </div>
      </div>
    </header>
  )
}

export default Header