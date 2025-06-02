import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      notification({ title: "Error", message: "Please fill in all fields", type: "danger" });
      return;
    }

    if (password !== confirmPassword) {
      notification({ title: "Error", message: "Passwords do not match", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/auth/reset-password?email=${encodeURIComponent(email)}`,
        {
          password,
          confirmPassword,
        }
      );

      console.log("Reset password response:", res);

      if (res?.status === 200) { 
        notification({ title: "Success", message: "Password reset successfully", type: "success" });
        // Redirect to login page
        window.location.href = "/";
      } else {
        notification({ title: "Error", message: res?.data?.message, type: "danger" });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      notification({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <div className="banner">
      <div className="log flex-h-center w-100">
      <h1>Reset Password</h1>
      <div className="form-group">
        <label>New Password</label>
        <TagInputs
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <TagInputs
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>
      <button className="submit-btn m-t-20" onClick={handleResetPassword} disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
      </div>
    </div>
  );
};

export default ResetPassword;