"use client";

import { useState, useContext } from "react";
import { Home, Bell, MessageSquare, User, Search } from "lucide-react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
            </svg>
          </div>
          <span className="text-xl font-bold">
            <span className="text-blue-500">Buddy</span>
            <span className="text-gray-700">Script</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Input search text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
            <Home className="w-6 h-6 text-gray-600" />
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg">
            <User className="w-6 h-6 text-gray-600" />
          </Link>
          
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 ml-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                {user?.displayName || user?.email || "User"}
              </span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <hr className="my-2" />
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}