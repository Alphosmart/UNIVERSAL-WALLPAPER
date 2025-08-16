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
    
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const dataApi = await dataResponse.json()

    if(dataApi.success){
      toast.success(dataApi.message)
      
      // Use optimized refresh method instead of duplicate fetch
      await refreshUserDetails()
      
      // Redirect to the page user was trying to access, or home
      navigate(from, { replace: true })
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

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4">Login</button>
          </form>

          <p className="my-5">Don't have account ? <Link to={"/sign-up"} className="text-red-600 hover:text-red-700 hover:underline">Sign up</Link></p>
          
          {/* Development Mode Notice */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 text-center">
              Database temporarily unavailable?<br />
              <Link to="/dev-login" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Try Development Mode
              </Link>
            </p>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Login;
