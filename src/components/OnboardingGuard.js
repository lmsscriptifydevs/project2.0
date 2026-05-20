import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Spinner } from "reactstrap";

const OnboardingGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(false); // Default false taake flash na ho

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        // Agar token nahi hai, toh guest ko public pages dekhne do
        return;
      }

      // Agar user pehle se onboarding page, ya OTP page par hai toh check rok do
      if (
        location.pathname.toLowerCase() === "/onboarding" || 
        location.pathname.toLowerCase() === "/otp" || 
        location.pathname.toLowerCase().startsWith("/auth")
      ) {
        return;
      }

      // ⚡ FAST CACHE CHECK: Bar bar API call se bachne ke liye localStorage use karein
      const cachedStatus = localStorage.getItem("IsOnboarded");
      
      if (cachedStatus === "1" || cachedStatus === 1) {
        return;
      } else if (cachedStatus === "0" || cachedStatus === 0) {
        navigate("/onboarding", { replace: true });
        return;
      }

      // Agar cache mein data nahi hai, tabhi API hit hogi aur spinner show hoga
      setChecking(true);
      try {
        const response = await axios.get("https://portal.grapetask.co/api/user/check-onboarding", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        const isOnboarded = data.is_onboarded ?? data.data?.profile?.is_onboarded;
        const completion = parseInt(data.profile_completion ?? data.data?.profile?.profile_completion);

        localStorage.setItem("IsOnboarded", isOnboarded);
        localStorage.setItem("ProfileCompletion", completion);

        if (Number(isOnboarded) === 0) {
          navigate("/onboarding", { replace: true });
        } else {
          setChecking(false);
        }

      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [location.pathname, navigate]);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#030712" }}>
        <div className="text-center">
           <Spinner color="warning" />
           <p className="mt-2" style={{color: '#94a3b8'}}>Checking onboarding status...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default OnboardingGuard;