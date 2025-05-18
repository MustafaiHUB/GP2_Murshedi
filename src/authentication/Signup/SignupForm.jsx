import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import PasswordInput from "../../ui/PasswordInput";
import { useDispatch } from "react-redux";
import { setSignupUser } from "../userSlice";
import Loader from "../../ui/Loader";
import { userSignup } from "../../services/apiUser";

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

function testPassword(password) {
  return passwordRegex.test(password);
}

function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPasswordRegix, setShowPasswordRegix] = useState(false);
  const [blindMode, setBlindMode] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const dispatch = useDispatch();

  function handleSeePassword() {
    setSeePassword((seePassword) => !seePassword);
  }

  async function handleSubmitSignup(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) return;
    let valid = true;

    setPasswordError(false);
    setTermsError(false);

    if (!testPassword(password)) {
      setPasswordError(true);
      setShowPasswordRegix(true);
      valid = false;
    }

    if (!agreedToTerms) {
      setTermsError(true);
      valid = false;
    }

    if (!valid) return;
    try {
      setIsLoading(true);

      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        blindMode: blindMode,
      };

      const data = await userSignup(user);
      console.log(data);
      if (!data) {
        console.log("Signup failed.");
        return;
      }
      const signupUser = {
        email: email, // add this
        token: data.token,
        user: {
          firstName: firstName,
          lastName: lastName,
          blindMode: blindMode,
          email: email,
          role: data.appUserRole,
          userId: data.userId,
        },
      };

      dispatch(setSignupUser(signupUser));
      console.log(signupUser);

      navigate("/confirm");
      // Send to the backend

      // Clear fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPasswordError(false);
      setSeePassword(false);
      setShowPasswordRegix(false);
      setBlindMode(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmitSignup}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <InputField
        type='text'
        placeholder='First Name'
        value={firstName}
        onChange={setFirstName}
        id='first_name'
      />
      <InputField
        type='text'
        placeholder='Last Name'
        value={lastName}
        onChange={setLastName}
        id='last_name'
      />
      <InputField
        type='email'
        placeholder='example@email.com'
        value={email}
        onChange={setEmail}
        id='email'
      />
      <PasswordInput
        placeholder='Your Password'
        password={password}
        setPassword={setPassword}
        showPasswordRegix={showPasswordRegix}
        setShowPasswordRegix={setShowPasswordRegix}
        passwordError={passwordError}
        seePassword={seePassword}
        handleSeePassword={handleSeePassword}
        showPasswordMarker={true}
      />
      {passwordError && (
        <p className='text-red-500 text-sm mt-1'>
          Password must be at least 8 characters long, contain uppercase and
          lowercase letters, a number, and a special character.
        </p>
      )}
      <div className='flex items-center justify-between mt-2 mb-5'>
        <div className='space-x-2 flex items-center'>
          <input
            id='blind'
            name='blind'
            type='checkbox'
            className='h-4 w-4 cursor-pointer'
            value={blindMode}
            onChange={(e) => {
              setBlindMode(e.target.checked);
            }}
          />
          <label
            htmlFor='blind'
            className='text-stone-300 text-sm cursor-pointer'
          >
            Blind Support
          </label>
        </div>
      </div>

      <div className='flex items-center justify-between mt-2 mb-5'>
        <div className='space-x-2 flex items-center'>
          <input
            id='terms'
            name='terms'
            type='checkbox'
            className='h-4 w-4 cursor-pointer'
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <label
            htmlFor='terms'
            className='text-stone-300 text-sm cursor-pointer'
          >
            By signing up, you agree to our{" "}
            <a
              href='/terms'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline'
            >
              Terms and Conditions
            </a>
            .
          </label>
        </div>
      </div>
      {termsError && (
        <p className='text-red-500 text-sm mb-3'>
          You must agree to the Terms and Conditions to continue.
        </p>
      )}
      {/* <InputField> */}
      <Button
        type='primary'
        disabled={false}
        // disabled={isLoading || !agreedToTerms}
        className='flex justify-center'
      >
        {!isLoading ? "Register" : <Loader />}
      </Button>
      {/* </InputField> */}
    </motion.form>
  );
}

export default SignupForm;
