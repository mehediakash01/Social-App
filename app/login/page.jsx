"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const {loginWithEmail} = useContext(AuthContext);


  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    loginWithEmail(email,password

    )
    // Add your login logic here
    console.log("Login with:", { email, password, rememberMe });
  };

  const handleGoogle = () => {
    // Add your Google sign-in logic here
    console.log("Login with Google");
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Shapes - Update these paths to match your actual image paths */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20 z-0">
        <div className="w-full h-full bg-blue-200 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 opacity-20 z-0">
        <div className="w-full h-full bg-purple-200 rounded-lg rotate-45"></div>
      </div>
      <div className="absolute bottom-20 left-40 w-40 h-40 opacity-20 z-0">
        <div className="w-full h-full bg-pink-200 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 right-10 w-28 h-28 opacity-20 z-0">
        <div className="w-full h-full bg-indigo-200 rounded-lg rotate-12"></div>
      </div>

      <div className="max-w-7xl w-11/12 mx-auto min-h-screen flex items-center justify-between relative z-10 py-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            width={750}
            height={750}
            src="https://i.ibb.co.com/3Y97yjqG/login.png"
            alt="Login illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-blue-500">Buddy</span>
                  <span className="text-gray-700">Script</span>
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-2">Welcome back</p>
              <h1 className="text-3xl font-bold text-gray-800">Login to your account</h1>
            </div>

            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors duration-200 mb-6"
            >
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                  <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                  <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                  <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                </g>
              </svg>
              <span className="text-gray-700 font-medium">Or sign-in with google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Form */}
            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg shadow-blue-500/30"
              >
                Login now
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
                Create New Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}