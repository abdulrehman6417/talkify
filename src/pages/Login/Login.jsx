import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

  return (
    <div className="login">
      {/* TALKIFY LOGO HERE */}

      <div className="logo">
        <img src={assets.talkify_logo} alt="" className="" />
        <h1 className="text-white text-6xl font-medium">Talkify</h1>
      </div>

      {/* SIGNUP FORM HERE */}

      <form className="login-form">
        <h2 className="text-2xl font-medium">{currentState}</h2>
        {currentState === "Sign Up" ? (
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        ) : null}
        <input type="text" placeholder="Email Address" className="form-input" />
        <input type="text" placeholder="Password" className="form-input" />
        <button type="submit" className="submit-btn">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="term-and-cond flex gap-1">
          <input type="checkbox" className="w-3.5" />
          <p className="text-gray-600 text-sm">
            Agree to the terms of use & privacy policy.
          </p>
        </div>
        <div className="forgot">
          {currentState === "Sign Up" ? (
            <p className="login-toggle text-gray-800 text-[14px]">
              Already have an account?
              <span
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer text-blue-700/90 font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="login-toggle text-gray-800 text-[14px]">
                Don't have an account?
                <span
                  onClick={() => setCurrentState("Sign Up")}
                  className="cursor-pointer text-blue-700/90 font-medium"
                >
                  Register here
                </span>
              </p>
              <p className="login-toggle text-gray-800 text-[14px]">
                Forgot Password?
                <span className="cursor-pointer text-blue-700/90 font-medium">
                  Click here
                </span>
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
