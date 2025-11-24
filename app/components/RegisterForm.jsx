"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUpWithEmail } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!firstName.trim()) {
      toast.error("First name is required!");
      return;
    }

    if (!lastName.trim()) {
      toast.error("Last name is required!");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms & conditions!");
      return;
    }

    setLoading(true);

    try {
      
      const user = await signUpWithEmail(email, password);
      
      
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      
      const saveResponse = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          displayName
        })
      });

      if (!saveResponse.ok) {
        console.error("Failed to save user profile to database");
      }

      toast.success("Account created successfully! Redirecting...");
      router.push("/feed");
    } catch (err) {
      toast.error(err.message || "Failed to create account. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* First Name and Last Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="John"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Doe"
            required
            disabled={loading}
          />
        </div>
      </div>

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

      {/* Repeat Password Field */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Repeat Password
        </label>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Repeat your password"
          required
          disabled={loading}
        />
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 mt-1 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          disabled={loading}
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          I agree to{" "}
          <Link href="/terms" className="text-blue-500 hover:text-blue-600 font-medium">
            terms & conditions
          </Link>
        </label>
      </div>

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Register now"}
      </button>
    </div>
  );
}