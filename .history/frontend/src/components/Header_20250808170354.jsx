import React, { useState, memo, useCallback, useMemo, useRef, useEffect } from 'react';
import Logo from './Logo';
import { GrSearch } from 'react-icons/gr';
import {FaRegCircleUser} from 'react-icons/fa6';
import {FaShoppingCart} from "react-icons/fa";
import { FaChevronDown, FaUser, FaEnvelope, FaSignOutAlt, FaQuestionCircle, FaShippingFast, FaCreditCard, FaUndo, FaComments, FaTimes } from 'react-icons/fa';
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
  const [helpMenuDisplay, setHelpMenuDisplay] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getCartItemsCount } = useCart()
  const dropdownRef = useRef(null)
  const helpDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuDisplay(false)
      }
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target)) {
        setHelpMenuDisplay(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      setMenuDisplay(false)
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

  const toggleHelpMenu = useCallback(() => {
    setHelpMenuDisplay(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuDisplay(false)
  }, [])

  const closeHelpMenu = useCallback(() => {
    setHelpMenuDisplay(false)
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
          <Link 
            to={'/seller-dashboard'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>📊</span>
            Seller Dashboard
          </Link>
          <Link 
            to={'/my-products'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>📦</span>
            My Products
          </Link>
          <Link 
            to={'/seller-orders'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>📋</span>
            My Orders
          </Link>
          <Link 
            to={'/seller-account-settings'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>💳</span>
            Payment Settings
          </Link>
        </>
      )
    }
    
    if (user.sellerStatus === 'pending_verification') {
      return (
        <Link 
          to={'/become-seller'} 
          className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-yellow-600 transition-colors' 
          onClick={closeMenu}
        >
          <span className='text-sm'>⏳</span>
          Seller Application
        </Link>
      )
    }
    
    return (
      <Link 
        to={'/become-seller'} 
        className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-green-600 transition-colors' 
        onClick={closeMenu}
      >
        <span className='text-sm'>🏪</span>
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
          
          <Link to={"/track-order"} className='px-3 py-1 rounded-full text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors hidden md:block'>
            Track Order
          </Link>

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

          {/* Help & Support Dropdown */}
          <div className='relative' ref={helpDropdownRef}>
            <div 
              className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'
              onClick={toggleHelpMenu}
              onMouseEnter={() => setHelpMenuDisplay(true)}
            >
              <FaQuestionCircle className='text-lg text-blue-600' />
              <div className='hidden md:block'>
                <div className='text-sm font-medium text-gray-700'>Help</div>
                <div className='text-xs text-gray-500'>& Support</div>
              </div>
              <FaChevronDown className={`text-xs text-gray-400 transition-transform ${helpMenuDisplay ? 'rotate-180' : ''}`} />
            </div>
            
            {helpMenuDisplay && (
              <div 
                className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[250px] z-50'
                onMouseLeave={() => setHelpMenuDisplay(false)}
              >
                {/* Help Menu Header */}
                <div className='px-4 py-3 border-b border-gray-100 bg-blue-50 rounded-t-lg'>
                  <div className='flex items-center gap-2'>
                    <FaQuestionCircle className='text-blue-600' />
                    <span className='font-medium text-blue-900'>Help & Support</span>
                  </div>
                </div>

                {/* Help Menu Items */}
                <nav className='py-2'>
                  <Link 
                    to={'/help-center'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaQuestionCircle className='text-sm text-blue-500' />
                    Help Center
                  </Link>
                  <Link 
                    to={'/how-to-order'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaShoppingCart className='text-sm text-green-500' />
                    Place an order
                  </Link>
                  <Link 
                    to={'/payment-options'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaCreditCard className='text-sm text-purple-500' />
                    Payment options
                  </Link>
                  <Link 
                    to={'/track-order'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaShippingFast className='text-sm text-orange-500' />
                    Track an order
                  </Link>
                  <Link 
                    to={'/cancel-order'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaTimes className='text-sm text-red-500' />
                    Cancel an order
                  </Link>
                  <Link 
                    to={'/returns-refunds'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaUndo className='text-sm text-indigo-500' />
                    Returns & Refunds
                  </Link>
                </nav>

                {/* Live Chat Button */}
                <hr className='border-gray-100' />
                <div className='p-2'>
                  <button 
                    onClick={() => {
                      // Handle live chat functionality
                      toast.info('Live chat feature coming soon!');
                      closeHelpMenu();
                    }} 
                    className='flex items-center gap-3 w-full px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors'
                  >
                    <FaComments className='text-sm' />
                    Live Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className='relative' ref={dropdownRef}>
            {user?._id && (
              <div 
                className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'
                onClick={toggleMenu}
                onMouseEnter={() => setMenuDisplay(true)}
              >
                <div className='text-2xl'>
                  {userProfileImage}
                </div>
                <div className='hidden md:block'>
                  <div className='text-sm font-medium text-gray-700'>{user?.name}</div>
                  <div className='text-xs text-gray-500'>My Account</div>
                </div>
                <FaChevronDown className={`text-xs text-gray-400 transition-transform ${menuDisplay ? 'rotate-180' : ''}`} />
              </div>
            )}
            
            {menuDisplay && user?._id && (
              <div 
                className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] z-50'
                onMouseLeave={() => setMenuDisplay(false)}
              >
                {/* User Info Section */}
                <div className='px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='text-2xl'>
                      {userProfileImage}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <FaUser className='text-xs text-gray-500' />
                        <span className='font-medium text-gray-900'>{user?.name}</span>
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <FaEnvelope className='text-xs text-gray-500' />
                        <span className='text-sm text-gray-600'>{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className='py-2'>
                  <Link 
                    to={'/profile'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeMenu}
                  >
                    <FaUser className='text-sm' />
                    My Profile
                  </Link>
                  <Link 
                    to={'/my-orders'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeMenu}
                  >
                    <FaShoppingCart className='text-sm' />
                    My Orders
                  </Link>
                  
                  {user?.role === 'ADMIN' && (
                    <Link 
                      to={"/admin-panel/dashboard"} 
                      className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                      onClick={closeMenu}
                    >
                      <span className='text-sm'>⚙️</span>
                      Admin Panel
                    </Link>
                  )}
                  
                  {sellerMenuItems && (
                    <>
                      <hr className='my-2 border-gray-100' />
                      <div className='px-4 py-1'>
                        <span className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Seller</span>
                      </div>
                      {sellerMenuItems}
                    </>
                  )}
                </nav>

                {/* Logout Button */}
                <hr className='border-gray-100' />
                <div className='p-2'>
                  <button 
                    onClick={handleLogout} 
                    className='flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'
                  >
                    <FaSignOutAlt className='text-sm' />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {!user?._id && (
            <Link to={"/login"} className='px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors'>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
