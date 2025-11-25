"use client";

import SocialLogin from "../components/SocialLogin";
import RegisterForm from "../components/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 relative overflow-hidden">

      {/* Soft background shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20 z-0 bg-blue-200 rounded-full"></div>
      <div className="absolute top-40 right-20 w-24 h-24 opacity-20 z-0 bg-purple-200 rounded-lg rotate-45"></div>
      <div className="absolute bottom-20 left-40 w-40 h-40 opacity-20 z-0 bg-pink-200 rounded-full"></div>
      <div className="absolute bottom-40 right-10 w-28 h-28 opacity-20 z-0 bg-indigo-200 rounded-lg rotate-12"></div>

      <div className="max-w-7xl w-11/12 mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-between relative z-10 py-12 gap-12">

        {/* Mobile Image */}
        <div className="w-full flex lg:hidden justify-center mb-6">
          <img
            src="/assets/images/registration1.png"
            width={850}
            height={850}
            alt="Registration Illustration"
            className="w-72 sm:w-80 md:w-[420px] drop-shadow-2xl"
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden lg:flex items-center justify-center flex-[1.2]">
          <img
            src="/assets/images/registration1.png"
            width={850}
            height={850}
            alt="Registration Illustration"
            className="w-[520px] xl:w-[600px] drop-shadow-2xl"
          />
        </div>

        {/* Form Area */}
        <div className="w-full lg:w-1/2 max-w-lg mx-auto lg:mx-0 flex-[1]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">

            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/assets/images/logo.svg"
                width={158}
                height={33}
                alt="BuddyScript logo"
                className="w-32 md:w-40"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-2">Get Started Now</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Registration
              </h1>
            </div>

            {/* Social Login */}
            <div className="mb-6">
              <SocialLogin buttonText="Register with google" />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Registration Form */}
            <RegisterForm />

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Login now
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
