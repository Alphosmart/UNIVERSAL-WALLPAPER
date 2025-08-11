import React from 'react'
import { useState } from 'react';
import loginIcons from "../assets/signin.gif";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import imageTobase64 from '../helper/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
      email : "",
      password : "",
      name : "",
      confirmPassword : "",
      profilePic : "",
    })
    const navigate = useNavigate()
    const location = useLocation()
    
    // Get the page user was trying to access before signup
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
  
    const handleUploadPic = async(e) => {
      const file = e.target.files[0]

      const imagePic = await imageTobase64(file)
      
      setData((prev) => {
        return {
          ...prev,
          profilePic : imagePic
        }
      })
    }
  
    const handleSubmit = async(e) => {
      e.preventDefault()
      
      if(data.password === data.confirmPassword){

        const dataResponse = await fetch(SummaryApi.signUP.url,{
            method : SummaryApi.signUP.method,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })
    
          const dataApi = await dataResponse.json()

          if(dataApi.success){
            toast.success(dataApi.message)
            // Pass the intended destination to login page
            navigate("/login", { state: { from: location.state?.from } })
          }

          if(dataApi.error){
            toast.error(dataApi.message)
          }

      }else{
        toast.error("Please check password and confirm password")
      }

    }
  
  return (
      <section id="signup">
      <div className="mx-auto container p-4">

        <div className="bg-white p-5 py-5 w-full max-w-sm mx-auto overflow-hidden rounded-full">
          <div className="w-20 h-20 mx-auto relative">
            <div>
              <img src={data.profilePic || loginIcons} alt="login icon" />
            </div>

            <form >
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
              Upload Photo
            </div>
                <input type="file" className='hidden' onChange={handleUploadPic}/>
              </label>
            </form>

          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
<div className="grid">
              <label>Name :</label>
              <div className="bg-slate-100 p-2">
                <input 
                    type="text" placeholder="enter your name" 
                    name="name"
                    value={data.name}
                    onChange={handleOnChange}
                    required
                    className="w-full h-full outline-none bg-transparent"/>
              </div>
            </div>

            <div className="grid">
              <label>Email :</label>
              <div className="bg-slate-100 p-2">
                <input 
                    type="email" placeholder="enter email" 
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    required
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
                    required
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
            </div>

            <div>
              <label>Confirm Password :</label>

              <div className="bg-slate-100 p-2 flex">
                <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="confirm password" 
                    value={data.confirmPassword}
                    name="confirmPassword"
                    onChange={handleOnChange}
                    required
                    className="w-full h-full outline-none bg-transparent"/>
                    
                    <div className="cursor-pointer text-xl"  onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  <span>
                    {showConfirmPassword ? (
                      <FaRegEye />)
                      :
                      (
                      <FaEyeSlash />
                    )
                    }
                  </span>
                </div>

              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4">Sign Up</button>
          </form>

          <p className="my-5">Already have account ? <Link to={"/login"} className="text-red-600 hover:text-red-700 hover:underline">Login</Link></p>
        </div>


      </div>
    </section>
  )
}

export default SignUp