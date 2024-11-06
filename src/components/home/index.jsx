import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { post } from "../../utility/fetch";
import InputField from "../UI/InputField";

import greenz from "../../assets/images/Greenzone.png";
import icon from "../../assets/images/Group-2.png";
import Footer from "../layouts/Footer";

const Home = (props) => {
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const makePostRequest = async (urltoken) => {
    // if (password === "" || email === "") {
    //   toast("Please enter email and password");
    //   return;
    // }
    setLoading(true);
    const payload = {
      email: email,
      password: password,
    };
    try {
      const data = await post(`/Auth/auth?AuthToken=${urltoken}`);
      console.log(data);
      if (data?.role.includes("Doctor")) {
        sessionStorage.setItem("token", "Bearer " + data.jwt.token);
        sessionStorage.setItem("token-expiry-date", data.jwt.expirationDate);
        localStorage.setItem("name", data.firstName + " " + data.lastName);
        localStorage.setItem("role", data.role[0].replace(/[^\w\s]/gi, ""));
        localStorage.setItem("USER_INFO", JSON.stringify(data));
        navigate("/doctor/dashboard");
      } else {
        window.location.href =
        "https://emr-test.greenzonetechnologies.com.ng/home";
        throw { e: "Invalid Role" };
       
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("USER_INFO");
      toast.error("Invalid login credentials");
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const spinStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    animation: "spin 2s linear infinite", // Apply spinning animation
    borderRadius: "50%", // Circular shape
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`;

  let urltoken = "";
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Get the value of the 'username' parameter
    urltoken = params.get("emp");
    console.log(urltoken);
    // isadvance = params.get("isadvance");
    // fromdashboard = params.get("fromdashboard");
    // iscompliance = params.get("iscompliance");
    // isRequisition = params.get("isRequisition");
    // isVariation = params.get("isVariation");
    // requestid = params.get("requestid");

    // console.log(urltoken);
    urltoken
      ? makePostRequest(urltoken)
      : (window.location.href =
          "https://emr-test.greenzonetechnologies.com.ng/home");
    // const query = qs.parse(location.search);
    // // encodeToken({ api: query.base }, 'api');
    // handleAuthentication(query.emp);
    // console.log(isadvance);
  }, []);

  return (
    <div className="w-100">
      <div className="banner">
        <div
          className="login w-100"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div className="flex flex-v-center w-100">
              <style>{keyframes}</style> {/* Inject the keyframes CSS */}
              <div style={spinStyle} className="">
                <div className="">
                  <img
                    style={{
                      display: "flex",

                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    src={icon}
                    alt=""
                    width={100}
                    height={100}
                    className=""
                  />
                </div>
                <div className="w-100">
                  <img className="w-100" src={greenz} alt="" height={26} />
                </div>
              </div>
            </div>

            {/* <form onSubmit={(e) => e.preventDefault()}>
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
            </form> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
