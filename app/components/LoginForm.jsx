"use client";

import { useContext, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      toast.success("Login successful! Redirecting...");
      router.push("/feed");
    } catch (err) {
      toast.error(err.message || "Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
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
          disabled={loading}
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
          disabled={loading}
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
            disabled={loading}
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
          Forgot password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login now"}
      </button>
    </div>
  );
}