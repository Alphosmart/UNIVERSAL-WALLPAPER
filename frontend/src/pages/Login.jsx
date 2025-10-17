import { useState, useEffect } from "react";
import React from "react";
import loginIcons from "../assets/signin.gif";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [data, setData] = useState({
    email : "",
    password : ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { refreshCart } = useCart()
  const user = useSelector(state => state?.user?.user) // Add user selector
  const [loginSuccess, setLoginSuccess] = useState(false) // Track login success

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/';

  // Effect to handle navigation after successful login and Redux state update
  useEffect(() => {
    if (loginSuccess && user && user._id) {
      console.log('🔑 User state updated in Redux, proceeding with navigation')
      console.log('🔑 Current user in Redux:', user)
      
      // Small delay to ensure all components have re-rendered
      setTimeout(async () => {
        try {
          // Refresh cart for the logged-in user
          await refreshCart()
          console.log('🔑 Cart refreshed after login')
        } catch (cartError) {
          console.log('🔑 Cart refresh failed, but continuing:', cartError)
        }
        
        console.log('🔑 Navigating to:', from)
        navigate(from, { replace: true })
        setIsLoggingIn(false)
        setLoginSuccess(false) // Reset flag
      }, 500) // Give more time for components to update
    }
  }, [user, loginSuccess, refreshCart, navigate, from])

  const handleOnChange = (e) => {
    const {name, value} = e.target

    setData((prev) => {
      return {
        ...prev,
        [name] : value
      }
    })
  }


  const handleSubmit = async(e) => {
    e.preventDefault()
    
    console.log('🔑 Login attempt starting...')
    
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const dataApi = await dataResponse.json()
    console.log('🔑 Login response:', dataApi)
    console.log('🔑 Login response data structure:', JSON.stringify(dataApi, null, 2))

    if(dataApi.success){
      toast.success(dataApi.message)
      
      console.log('🔑 Login successful, updating Redux state immediately')
      setIsLoggingIn(true)
      
      // Debug the data structure
      console.log('🔑 dataApi.data:', dataApi.data)
      console.log('🔑 dataApi.data.user:', dataApi.data?.user)
      
      // Immediately update Redux state with user data from login response
      if (dataApi.data && dataApi.data.user) {
        console.log('🔑 Setting user details in Redux immediately:', dataApi.data.user)
        dispatch(setUserDetails(dataApi.data.user))
        setLoginSuccess(true) // Trigger useEffect to handle navigation
        
      } else if (dataApi.data) {
        // Maybe the user data is directly in dataApi.data
        console.log('🔑 Setting user details from dataApi.data directly:', dataApi.data)
        dispatch(setUserDetails(dataApi.data))
        setLoginSuccess(true) // Trigger useEffect to handle navigation
        
      } else {
        console.log('🔑 No user data found in login response')
        setIsLoggingIn(false)
      }
    }

    if(dataApi.error){
      toast.error(dataApi.message)
      
      // Check if it's a database connectivity issue
      if(dataApi.message && dataApi.message.includes('Database service temporarily unavailable')) {
        toast.info('Use Development Mode to test the admin features', {
          autoClose: 5000
        })
      }
    }
  }



  return (
    <section id="login">
      <div className="mx-auto container p-4">

        <div className="bg-white p-5 py-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icon" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email :</label>
              <div className="bg-slate-100 p-2">
                <input 
                    type="email" placeholder="enter email" 
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"/>
              </div>
            </div>

            <div>
              <label>Password :</label>

              <div className="bg-slate-100 p-2 flex">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="enter password" 
                    value={data.password}
                    name="password"
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"/>

                <div className="cursor-pointer text-xl"  onClick={() => setShowPassword((prev) => !prev)}>
                                  <span>
                                    {showPassword ? (
                                      <FaRegEye />)
                                      :
                                      (
                                      <FaEyeSlash />
                                    )
                                    }
                                  </span>
                                </div>

              </div>
              <Link to={'/forgot-password'} className="block w-fit ml-auto hover:underline hover:text-red-600 text-right">
              Forgot Password ?
              </Link>

            </div>

            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="my-5">Don't have account ? <Link to={"/sign-up"} className="text-red-600 hover:text-red-700 hover:underline">Sign up</Link></p>
        </div>


      </div>
    </section>
  );
};

export default Login;
