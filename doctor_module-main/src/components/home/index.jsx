import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { post } from '../../utility/fetch';
import InputField from '../UI/InputField';

import greenz from '../../assets/images/Greenzone.png';
import icon from '../../assets/images/Group-2.png';
import Footer from '../layouts/Footer';

const Home = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const makePostRequest = async () => {
    if (password === "" || email === "") {
      toast("Please enter email and password");
      return
    }
    setLoading(true);
    const payload = {
      email: email,
      password: password,
    };
    try {
      const data = await post(`/Auth/login/`, payload);

      if (data?.role.includes("Doctor")) {
        sessionStorage.setItem('token', "Bearer " + data.jwt.token);
        sessionStorage.setItem('token-expiry-date', data.jwt.expirationDate)
        localStorage.setItem('name', data.firstName + " " + data.lastName);
        localStorage.setItem('role', data.role[0].replace(/[^\w\s]/gi, ''));
        localStorage.setItem('USER_INFO', JSON.stringify(data));
        navigate('/doctor/dashboard');
      } else {
        throw ({ e: "Invalid Role" });
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem('USER_INFO');
      toast.error("Invalid login credentials");
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-100">
      <div className="banner">
        <div className="login flex-h-end w-100">
          <div>
            <div className='flex flex-v-center w-100 m-l-20'>
              <div className='margin-lg'>
                <div className='m-l-20'><img src={icon} alt='' width={26} height={26} className='m-l-20' /></div>
                <div> <img src={greenz} alt='' width={100} height={26} /></div>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className=' m-t-40'>
                <label>Email</label>
                <InputField type="text" name={"email"} value={email} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)} required={true} />
              </div>
              <div className='m-t-40'>
                <label>Password</label>
                <div className='password-input-container'>
                  <InputField type={showPassword ? "text" : "password"} name={"password"} value={password} placeholder={"password"} onChange={(e) => setPassword(e.target.value)} required={true} />
                  <button type="button" onClick={toggleShowPassword} className='password-toggle-btn pointer'>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              <div className='m-t-40'>
                <button disabled={loading} onClick={makePostRequest} className='w-100 btn' type='submit'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
