"use client";

import { useState, useContext } from "react";
import {
  Home,
  Bell,
  MessageSquare,
  User,
  Search,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-blue-500" : "text-gray-600";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2">
         
          
          <div>
            <Image src="/assets/images/logo.svg" width={158} height={33} alt="logo"/>
          </div>
        </Link>

        {/* Desktop Search Bar */}
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

        {/* MOBILE SEARCH BUTTON */}
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Search className="w-6 h-6 text-gray-600" />
        </button>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
            <Home className={`w-6 h-6 ${isActive("/feed")}`} />
          </Link>

          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 right-1 w-2 h-2 text-blue-500 rounded-full">6</span>
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 text-blue-500 rounded-full">2</span>
          </button>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 ml-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user?.photoURL || "/assets/images/chat6_img.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <p>{user?.displayName}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-3">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pb-3">
                  <img
                    src={user?.photoURL || "/assets/images/chat6_img.png"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {user?.displayName || "User"}
                    </p>
                    <Link
                      href="/profile"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                <hr />

                {/* Settings */}
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5 text-blue-500" />
                  Settings
                </Link>

                {/* Help */}
                <Link
                  href="/help"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Help & Support
                </Link>

                <hr />

                {/* Logout */}
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
