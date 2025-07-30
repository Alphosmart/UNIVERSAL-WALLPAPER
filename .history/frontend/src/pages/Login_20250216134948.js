import React from "react";
import loginIcons from "../assets/signin.gif";
import { FaRegEye } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-2 py-5 w-full max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login" />
          </div>

          <form>
            <div className="grid">
              <label>Email :</label>
              <div className="bg-slate-100 p-2">
                <input type="email" placeholder="enter email" className="w-full h-full outline-none bg-transparent"/>
              </div>
            </div>

            <div>
              <label>Password :</label>
              <div className="bg-slate-100 p-2 flex">
                <input type={showPassword ? } placeholder="enter password" className="w-full h-full outline-none bg-transparent"/>

                <div className="cursor-pointer">
                  <span>
                  <FaRegEye />
                  </span>
                </div>
              </div>
            </div>

            <button>Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
