import { useState, useContext } from "react";
import React from "react";
import loginIcons from "../assets/signin.gif";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [data, setData] = useState({
    email : "",
    password : ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUserDetails } = useContext(Context)

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/';

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

    if(dataApi.success){
      toast.success(dataApi.message)
      
      console.log('🔑 Login successful, fetching user details directly...')
      setIsLoggingIn(true)
      
      // Add small delay to ensure cookie is set before fetching user details
      setTimeout(async () => {
        try {
          // Use context to refresh user details which will handle Redux updates properly
          await refreshUserDetails()
          console.log('🔑 User details refreshed via context')
          
          // Navigate immediately after refresh is complete
          console.log('🔑 Navigating to:', from)
          setIsLoggingIn(false)
          navigate(from, { replace: true })
        } catch (error) {
          console.error('🔑 Error refreshing user details:', error)
          setIsLoggingIn(false)
        }
      }, 100)
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
