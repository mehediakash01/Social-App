"use client";

import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../lib/firebase";

const fetchUserProfile = async (uid) => {
  const response = await fetch(`/api/auth/user?userId=${uid}`);
  if (response.status === 404) {
    return { displayName: null };
  }
  if (!response.ok) {
    throw new Error("Failed to fetch user profile from DB");
  }
  const data = await response.json();
  return data.profile;
};

const saveUserProfile = async (user) => {
  const payload = {
    userId: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split("@")[0],
    firstName: null,
    lastName: null,
  };

  const response = await fetch("/api/auth/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      details: "No response body",
    }));
    throw new Error(
      `API error: ${response.status} - ${errorData.details || errorData.error}`
    );
  }

  const data = await response.json();
  return data.profile;
};

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const handleAuthChange = async (currentUser) => {
    if (currentUser) {
      try {
        const profileData = await fetchUserProfile(currentUser.uid);
        setUser({ ...currentUser, ...profileData });
      } catch (error) {
        console.error(
          "Error fetching user profile, setting basic user:",
          error
        );
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
    return () => unsubscribe();
  }, []);

  const postAuthAction = async (user, displayName) => {
    let profile = {};
    if (displayName) {
      user = { ...user, displayName };
    }
    try {
      profile = await saveUserProfile(user);
    } catch (error) {
      console.error(
        "CRITICAL: Failed to save user profile to DB after successful Firebase Auth. Proceeding with basic user:",
        error
      );
    }

    const augmentedUser = { ...user, ...profile };
    setUser(augmentedUser);
    return augmentedUser;
  };

  // ----------------------------
  // SIGN UP WITH EMAIL
  // ----------------------------
  const signUpWithEmail = async (email, password, displayName) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await postAuthAction(result.user, displayName);
      return result.user;
    } catch (error) {
      let message = "Failed to sign up.";
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            message = "Email already in use. Try logging in.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/weak-password":
            message = "Password is too weak.";
            break;
          default:
            message = error.message;
        }
      }
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // LOGIN WITH EMAIL
  // ----------------------------
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await postAuthAction(result.user);
      return result.user;
    } catch (error) {
      let message = "Failed to login. Please check your credentials.";
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            message = "No user found with this email.";
            break;
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          default:
            message = error.message || message;
        }
      }
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // LOGIN WITH GOOGLE
  // ----------------------------
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || user.email.split("@")[0];
      await postAuthAction(user, displayName);
      return result.user;
    } catch (error) {
      let message = "Failed to login with Google.";
      if (error.code) {
        message = error.message || message;
      }
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const authValue = {
    user,
    loading,
    signUpWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
