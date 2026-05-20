import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "reactstrap";

const OtpGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(false); // Default false to prevent flash

  useEffect(() => {
    const checkOtpStatus = () => {
      const token = localStorage.getItem("accessToken");
      
      // If no token, guest users are allowed
      if (!token) {
        return;
      }

      // If user is already on OTP or Auth pages, do not block
      if (location.pathname.toLowerCase() === "/otp" || location.pathname.toLowerCase().startsWith("/auth")) {
        return;
      }

      let needsOtp = false;
      const otpEmail = localStorage.getItem("otpEmail");
      
      // If otpEmail exists, it means OTP verification is pending
      if (otpEmail) {
        needsOtp = true;
      } else {
        // Fallback: Check if UserData explicitly says verification is pending
        try {
          const userDataStr = localStorage.getItem("UserData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const isVerified = userData.is_verified ?? userData.email_verify ?? 1;
            if (Number(isVerified) === 0) {
              needsOtp = true;
              if (userData.email) {
                localStorage.setItem("otpEmail", userData.email);
              }
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      if (needsOtp) {
        navigate("/otp", { replace: true });
        return;
      }
    };

    checkOtpStatus();
  }, [location.pathname, navigate]);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#030712" }}>
        <div className="text-center">
           <Spinner color="warning" />
           <p className="mt-2" style={{color: '#94a3b8'}}>Checking verification status...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default OtpGuard;