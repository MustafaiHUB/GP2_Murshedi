import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../authentication/Login/LoginForm";
import LoginHeader from "../authentication/Login/LoginHeader";

function Login() {
  const navigate = useNavigate();
  useEffect(
    function () {
      localStorage.removeItem("email");
      localStorage.removeItem("forgotpassword");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        navigate("/chatbot/new");
      } else {
        navigate("/login");
      }
    },
    [navigate]
  );

  return (
    <div className='grid place-items-center py-24 bg-[#192836] min-h-[100dvh] px-5'>
      <div className='absolute left-1/2 -translate-x-1/2 sm:left-10 sm:-translate-x-0 top-5 sm:top-10'>
        <Link to='/'>
          <img
            src='/Eng_Logo.png'
            alt='Eng_Logo'
            className='h-20'
          />
        </Link>
      </div>
      <div className='space-y-10 px-5 sm:px-10 py-20 bg-gray-900 rounded-xl w-full max-w-[450px]'>
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
