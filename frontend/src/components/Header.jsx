import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Logo from './Logo';
import SmartSearchBar from './SmartSearchBar';
import {FaRegCircleUser} from 'react-icons/fa6';
import {FaShoppingCart} from "react-icons/fa";
import { FaChevronDown, FaUser, FaEnvelope, FaSignOutAlt, FaQuestionCircle, FaCreditCard, FaUndo, FaComments } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { useCart } from '../context/CartContext';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [helpMenuDisplay, setHelpMenuDisplay] = useState(false)
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

  const handleSearch = useCallback((query) => {
    if(query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }, [navigate])

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

  const adminMenuItems = useMemo(() => {
    if (!user) return null
    
    // Show product management options for admin and staff with upload permissions
    const canManageProducts = user.role === 'ADMIN' || 
                             (user.role === 'STAFF' && user.permissions?.canUploadProducts);
    
    if (canManageProducts) {
      return (
        <>
          <Link 
            to={'/add-product'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>➕</span>
            Add Product
          </Link>
          <Link 
            to={'/my-products'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>📦</span>
            Manage Products
          </Link>
          {user.role === 'ADMIN' && (
            <Link 
              to={'/admin-panel'} 
              className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
              onClick={closeMenu}
            >
              <span className='text-sm'>⚙️</span>
              Admin Panel
            </Link>
          )}
        </>
      )
    }
    
    return null
  }, [user, closeMenu])

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className=''>
          <Link to={'/'}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className='hidden lg:block w-full max-w-sm'>
          <SmartSearchBar 
            onSearch={handleSearch}
            placeholder="Search products, brands..."
            showSuggestions={true}
          />
        </div>

        {/* Main Navigation */}
        <nav className='hidden lg:flex items-center gap-6 text-gray-700'>
          <Link to='/search' className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium'>
            🛒 Shop
          </Link>
          <Link to='/about-us' className='hover:text-blue-600 transition-colors font-medium'>
            About
          </Link>
          <Link to='/contact-us' className='hover:text-blue-600 transition-colors font-medium'>
            Contact
          </Link>
        </nav>

        <div className='flex items-center gap-7'>
          
          {user?._id && user?.role === 'ADMIN' && (
            <Link to={"/add-product"} className='px-3 py-1 rounded-full text-white bg-green-600 hover:bg-green-700 hidden md:block'>
              Add Product
            </Link>
          )}

          {/* User Profile Dropdown */}
          {user?._id && (
            <div className='relative' ref={dropdownRef}>
              <div 
                className='flex items-center gap-2 cursor-pointer p-2 rounded-lg'
                onClick={toggleMenu}
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
              
              {menuDisplay && (
                <div 
                  className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] z-50'
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
                      to={'/order-history'} 
                      className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                      onClick={closeMenu}
                    >
                      <span className='text-sm'>📋</span>
                      Order History
                    </Link>
                    
                    {user?.role === 'ADMIN' && (
                      <Link 
                        to={'/admin-panel'} 
                        className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                        onClick={closeMenu}
                      >
                        <span className='text-sm'>⚙️</span>
                        Admin Panel
                      </Link>
                    )}
                    
                    {adminMenuItems && (
                      <>
                        <hr className='my-2 border-gray-100' />
                        <div className='px-4 py-1'>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Product Management</span>
                        </div>
                        {adminMenuItems}
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
          )}

          {/* Help & Support Dropdown - Positioned before cart */}
          <div className='relative' ref={helpDropdownRef}>
            <div 
              className='flex items-center gap-2 cursor-pointer p-2 rounded-lg'
              onClick={toggleHelpMenu}
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
                    How to Order
                  </Link>
                  <Link 
                    to={'/payment-options'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaCreditCard className='text-sm text-purple-500' />
                    Payment Options
                  </Link>
                  
                  <hr className='my-2 border-gray-100' />
                  <div className='px-4 py-1'>
                    <span className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Partnerships</span>
                  </div>
                  
                  <Link 
                    to={'/returns-exchanges'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaUndo className='text-sm text-red-500' />
                    Returns & Exchanges
                  </Link>
                  <Link 
                    to={'/contact-us'} 
                    className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
                    onClick={closeHelpMenu}
                  >
                    <FaComments className='text-sm text-indigo-500' />
                    Contact Us
                  </Link>
                </nav>
              </div>
            )}
          </div>

          {/* Shopping Cart - Positioned at extreme right */}
          <Link to={"/cart"} className='text-2xl relative'>
            <span><FaShoppingCart/></span>
            {cartItemsCount > 0 && (
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-xs'>{cartItemsCount}</p>
              </div>
            )}
          </Link>

          {!user?._id && (
            <Link to={"/login"} className='px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors'>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
