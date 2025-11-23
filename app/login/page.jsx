import SocialLogin from "../components/SocialLogin";
import LoginForm from "../components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Shapes - Replace with your actual images */}
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

      <div className="max-w-7xl w-11/12 mx-auto min-h-screen flex items-center justify-between relative z-10 py-12 gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <img
            width={750}
            height={750}
            src="https://i.ibb.co.com/3Y97yjqG/login.png"
            alt="Login illustration showing a person with mobile device"
            className="w-full max-w-lg mx-auto drop-shadow-2xl"
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                  </svg>
                </div>
                <span className="text-2xl font-bold">
                  <span className="text-blue-500">Buddy</span>
                  <span className="text-gray-700">Script</span>
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-2">Welcome back</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
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
              <span className="text-gray-400 text-sm font-medium">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Form Component */}
            <LoginForm />

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">
                Create New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}