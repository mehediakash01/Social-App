import Image from "next/image";
import LoginForm from "../components/LoginForm";
import SocialLogin from "../components/SocialLogin";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 md:w-32 md:h-32 opacity-20 z-0">
        <div className="w-full h-full bg-blue-200 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-10 md:right-20 w-16 h-16 md:w-24 md:h-24 opacity-20 z-0">
        <div className="w-full h-full bg-purple-200 rounded-lg rotate-45"></div>
      </div>
      <div className="absolute bottom-20 left-20 md:left-40 w-24 h-24 md:w-40 md:h-40 opacity-20 z-0">
        <div className="w-full h-full bg-pink-200 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 right-10 w-20 h-20 md:w-28 md:h-28 opacity-20 z-0">
        <div className="w-full h-full bg-indigo-200 rounded-lg rotate-12"></div>
      </div>

      <div className="max-w-7xl w-11/12 mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between relative z-10 py-8 md:py-12 gap-8 lg:gap-12">
        {/* Left Side - Illustration (Top on mobile) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <Image
            width={750}
            height={750}
            src="https://i.ibb.co.com/3Y97yjqG/login.png"
            alt="Login illustration showing a person with mobile device"
            className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto drop-shadow-2xl"
            priority
          />
        </div>

        {/* Right Side - Login Form (Bottom on mobile) */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <div>
                <Image 
                  src="/assets/images/logo.svg" 
                  width={158} 
                  height={33} 
                  alt="BuddyScript logo"
                  className="w-32 md:w-40"
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <p className="text-gray-500 text-xs md:text-sm mb-2">Welcome back</p>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                Login to your account
              </h1>
            </div>

            {/* Social Login Component */}
            <div className="mb-6">
              <SocialLogin />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-xs md:text-sm font-medium">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Form Component */}
            <LoginForm />

            {/* Sign Up Link */}
            <p className="text-center text-xs md:text-sm text-gray-600 mt-6 md:mt-8">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Create New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}