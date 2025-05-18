import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import InputField from "../../ui/InputField";
import PasswordInput from "../../ui/PasswordInput";
import Button from "../../ui/Button";
import Loader from "../../ui/Loader";
import { BASE_URL } from "../../services/apiChatbot";
import SpecialText from "../../ui/SpecialText";
import { setAdmin } from "./adminSlice";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  function handleSeePassword() {
    setSeePassword((seePassword) => !seePassword);
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();

    if (!email || !password) return;

    try {
      setIsLoading(true);
      // If info is correct
      const user = {
        email: email,
        password: password,
      };

      dispatch(setAdmin(true));

      // Send to the backend
      //   const response = await fetch(`${BASE_URL}/api`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(user),
      //   });

      //   if (!response.ok) {
      //     throw new Error("Failed to login!");
      //   }

      //   const data = await response.json();
      //   console.log(data);

      // Clear fields
      setEmail("");
      setPassword("");
      setSeePassword(false);
    } catch (err) {
      console.error(err.message);
      return;
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='grid place-items-center py-32 bg-[#192836] min-h-[100dvh] px-5'>
      <SpecialText>Admin Panel</SpecialText>
      <div className='space-y-10 px-5 sm:px-10 py-20 bg-gray-900 rounded-xl w-full max-w-[450px]'>
        <motion.form
          onSubmit={handleSubmitLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <InputField
            type='email'
            id='email'
            placeholder='example@email.com'
            value={email}
            onChange={setEmail}
          />
          <PasswordInput
            type='password'
            id='password'
            placeholder='Your Password'
            value={password}
            setPassword={setPassword}
            showPasswordMarker={false}
            seePassword={seePassword}
            handleSeePassword={handleSeePassword}
          />

          <Button
            type='primary'
            disabled={isLoading}
            className='flex justify-center mt-5'
          >
            {!isLoading ? "Login" : <Loader />}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}

export default AdminLogin;
