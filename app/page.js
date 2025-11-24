"use client"
import { useContext } from "react";
import FeedPage from "./feed/page";
import LoginPage from "./login/page";
import { AuthContext } from "./context/AuthContext";



export default function Home() {
  const { user } = useContext(AuthContext);

 
  return (
    <>
      {user?.email ? <FeedPage /> :     <LoginPage/>}
  
    </>
  );
}
