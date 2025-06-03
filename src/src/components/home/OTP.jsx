import React, { useState } from "react";

const OTP = ({ submitOTP, setOtp, otp }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    submitOTP(otp);
  };

  return (
    <div>
      <h1>We’ll like to verify the email address you provided</h1>
      <h3 className="m-t-10">Please check the email address for an OTP</h3>
      <form className="m-t-20" onSubmit={handleSubmit}>
        <input
          className="styledInput m-r-10"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      <p className="m-t-10">
        Didn't receive OTP? <a href="#">Resend</a>.
      </p>
    </div>
  );
};

export default OTP;