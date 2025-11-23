"use client";

import axios from "axios";
import { useEffect } from "react";
import { auth } from "@/firebase.config";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Auto attach Firebase ID token
export default function useAxiosSecure() {
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(async (config) => {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // clean interceptor on unmount
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, []);

  return axiosSecure;
}
