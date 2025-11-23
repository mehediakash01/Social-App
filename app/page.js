// import { useAuth } from "../auth/AuthContext";
import LoginPage from "./login/page";


export default function Home() {
  // const { user } = useAuth();

 
  return (
    <>
      {/* {user?.email ? <Feed /> : <Login />} */}
      <LoginPage/>
    </>
  );
}
