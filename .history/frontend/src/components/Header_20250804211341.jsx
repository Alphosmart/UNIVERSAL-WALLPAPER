import React, { useState, memo, useCallback, useMemo } from 'react';
import Logo from './Logo';
import { GrSearch } from 'react-icons/gr';
import {FaRegCircleUser} from 'react-icons/fa6';
import {FaShoppingCart} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { useCart } from '../context/CartContext';

const Header = memo(() => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getCartItemsCount } = useCart()

  const handleLogout = useCallback(async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if(data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if(data.error) {
      toast.error(data.message)
    }
  }, [dispatch, navigate])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if(searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }, [searchQuery, navigate])

  const toggleMenu = useCallback(() => {
    setMenuDisplay(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuDisplay(false)
  }, [])

  const cartItemsCount = useMemo(() => getCartItemsCount(), [getCartItemsCount])

  const userProfileImage = useMemo(() => {
    if (user?.profilePic) {
      return <img src={user.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
    }
    return <FaRegCircleUser />
  }, [user?.profilePic, user?.name])

  const sellerMenuItems = useMemo(() => {
    if (!user) return null
    
    if (user.sellerStatus === 'verified') {
      return (
        <>
          <Link to={'/my-products'} className='whitespace-nowrap hover:bg-slate-100 p-2' onClick={closeMenu}>
            My Products
          </Link>
          <Link to={'/seller-account-settings'} className='whitespace-nowrap hover:bg-slate-100 p-2' onClick={closeMenu}>
            Payment Settings
          </Link>
        </>
      )
    }
    
    if (user.sellerStatus === 'pending_verification') {
      return (
        <Link to={'/become-seller'} className='whitespace-nowrap hover:bg-slate-100 p-2 text-yellow-600' onClick={closeMenu}>
          Seller Application
        </Link>
      )
    }
    
    return (
      <Link to={'/become-seller'} className='whitespace-nowrap hover:bg-slate-100 p-2 text-green-600' onClick={closeMenu}>
        Become a Seller
      </Link>
    )
  }, [user, closeMenu])

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className=''>
          <Link to={'/'}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <form onSubmit={handleSearch} className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input 
            type="text" 
            placeholder='Search products, brands...' 
            className='w-full outline-none py-2' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white hover:bg-red-700 transition-colors'>
            <GrSearch/>
          </button>
        </form>

        <div className='flex items-center gap-7'>
          
          {user?._id && (
            <Link to={"/add-product"} className='px-3 py-1 rounded-full text-white bg-green-600 hover:bg-green-700 hidden md:block'>
              Sell
            </Link>
          )}

          <Link to={"/cart"} className='text-2xl relative'>
            <span><FaShoppingCart/></span>
            {cartItemsCount > 0 && (
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-xs'>{cartItemsCount}</p>
              </div>
            )}
          </Link>

          <div className='relative flex justify-center'>
            {user?._id && (
              <div className='text-3xl cursor-pointer relative flex justify-center' onClick={toggleMenu}>
                {userProfileImage}
              </div>
            )}
            
            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                <nav>
                  <Link to={'/profile'} className='whitespace-nowrap hover:bg-slate-100 p-2' onClick={closeMenu}>
                    My Profile
                  </Link>
                  
                  {user?.role === 'ADMIN' && (
                    <Link to={"/admin-panel/dashboard"} className='whitespace-nowrap hover:bg-slate-100 p-2' onClick={closeMenu}>
                      Admin Panel
                    </Link>
                  )}
                  
                  {sellerMenuItems}
                </nav>
              </div>
            )}
          </div>

          <div>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                Logout
              </button>
            ) : (
              <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
