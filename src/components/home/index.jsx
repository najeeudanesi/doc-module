import React, { useEffect, useState } from 'react';
import greenz from '../../assets/images/Greenzone.png';
import icon from '../../assets/images/Group-2.png';
import Footer from '../layouts/Footer';
import notification from '../../utility/notification';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import OTP from './OTP';
import { get, post } from '../../utility/fetch2';

const Home = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState("login");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const changeView = (views) => {
    if (views === "password") {
      if (!userEmail) {
        notification({ title: "Error", message: "Please enter a username", type: "danger" });
        return;
      }

      if (userEmail.length < 4) {
        notification({ title: "Error", message: "Username must be more than 4 characters", type: "danger" });
        return;
      }
    }

    // !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(email) Email validation
    setView(views);
  }

  const submitOTP = async () => {
    

    if (!otp) {
      notification({ title: "Error", message: "Please enter the OTP", type: "danger" });
      return;
    }

    try {
      const res = await get(
        `/auth/validateotp?otp=${encodeURIComponent(otp)}&email=${encodeURIComponent(userEmail)}`
      );

      // handle the various status codes
      const { statusCode } = res.data;
      if ([400, 404, 409, 500, 401].includes(statusCode)) {
        notification({ title: "Error", message: res?.data?.message, type: "error" });
        return;
      }

      if (res?.data?.resultList?.isSuccess === false) {
        notification({ title: "Error", message: res?.data?.resultList?.message, type: "error" });
        return;
      } else {
        notification({ title: "Success", message: res?.data?.resultList?.message, type: "success" });
        navigate(`/reset-password?email=${encodeURIComponent(userEmail)}`);
      }
    } catch (err) {
      console.error("submitOTP error:", err);
      notification({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    }
  };

  const submitEmail = async () => {
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      notification({ title: "Error", message: "Please enter a valid email address", type: "danger" });
      return;
    }

    try {
      const res = await post(
        `/auth/forget-password/${encodeURIComponent(userEmail)}`
      );

      const { statusCode } = res.data;
      if ([400, 404, 409, 500, 401].includes(statusCode)) {
        notification({ title: "Error", message: res?.data?.message, type: "error" });
        return;
      }

      if (res?.data?.resultList?.isSuccess === false) {
        notification({ title: "Error", message: res?.data?.resultList?.message, type: "error" });
        return;
      } else {
        notification({ title: "Success", message: res?.data?.resultList?.message, type: "success" });
        setView("otp"); // Change view to OTP component
      }
    } catch (err) {
      console.error("submitEmail error:", err);
      notification({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    }
  };

  const makePostRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: email,
      password: password,
    };

    try {
      const url = `/Auth/login`;
      const data = await post(url, payload);
      console.log("Login response:", data?.data?.expirationDate);
      if (data?.statusCode === 200) {
        sessionStorage.setItem('token', data?.data?.token);
        sessionStorage.setItem('expTokenDate', data?.data?.expirationDate)
        sessionStorage.setItem('clinicId', data?.data?.clinicId);
        sessionStorage.setItem('userId', data?.data?.userId);
        localStorage.setItem('nurseRole', data?.data?.roles[0]?.name);
        localStorage.setItem('USER_INFO', JSON.stringify(data?.data));
        sessionStorage.setItem('isAdmin', data?.data?.isAdmin);

        const loginTime = new Date().getTime();
        localStorage.setItem('LOGIN_TIME', loginTime);
        navigate('/doctor/dashboard');


      }
    } catch (error) {
      localStorage.removeItem('USER_INFO');
      notification({
        title: 'ACCESS DENIED',
        message: 'Sorry, This user does not have access to this application. Please Contact Admin Or Check your internet connection',
        type: 'error',
      });
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-100">
      <div className="banner">
        {view === "login" &&
          <div className="log flex-h-center w-100">
            <div className="flex flex-col">
              <div className="">
                <div className="m-l-20">
                  <img src={icon} alt="" width={26} height={26} />
                </div>
                <div>
                  <img src={greenz} alt="" width={100} height={26} />
                </div>
              </div>
              <div className='w-100'>
                <form onSubmit={makePostRequest}>
                  <div className="m-t-40">
                    <label>Username or Email</label>
                    <InputField
                      type="text"
                      name="email"
                      value={email}
                      placeholder="username or email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="m-t-40 flex flex-direction-v">
                    <label>Password</label>
                    <div className="password-input-container">
                      <InputField
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="password-toggle-btn pointer"
                      >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                      </button>
                    </div>
                  </div>

                  <div className="m-t-40">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-100 submit-btn"
                    >
                      Log In
                    </button>
                    <div className='m-t-10'>

                      <p onClick={() => changeView("username")} className='text-green pointer underline'>
                        Change Password?
                      </p>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        }
        {view === "username" &&
          <div className="log flex-h-center w-100">
            <div className="">
              <div className="m-l-20">
                <img src={icon} alt="" width={26} height={26} />
              </div>
              <div>
                <img src={greenz} alt="" width={100} height={26} />
              </div>
            </div>
            <h3 className='center-text m-t-40'>
              Hey, It seems you can't remember your password
            </h3>
            <p className='center-text m-t-0'>
              Please enter your email to reset your password
            </p>

            <div className=' w-100  m-t-20'>
            <label>Email</label>

              <InputField type="text" name="userEmail" value={userEmail} placeholder="Email" onChange={(e) => setUserEmail(e.target.value)} />
            </div>

            <div className='m-t-40'> <button disabled={loading} onClick={() => submitEmail()} className='w-100 submit-btn'>Submit</button></div>
            <div onClick={() => setView("login")} className='m-t-10 underline pointer'>Back to Sign in</div>
          </div>
        }
        {view === "otp" && (
          <div className="log flex-h-center w-100">
            <OTP submitOTP={submitOTP} setOtp={setOtp} otp={otp} />
            <div onClick={() => setView("username")} className="m-t-10 underline pointer">
              Back to Email Submission
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
