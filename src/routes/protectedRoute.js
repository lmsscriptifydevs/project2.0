import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import NavbarComponent from "../components/NavbarComponent";

/**
 * PERF STARTUP: Defer localStorage read to avoid blocking render
 * Note: This component may not be in use if routes/index.js handles protection
 */
const ProtectedRoute = () => {
  const [token, setToken] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      try {
        setToken(localStorage.getItem("accessToken"));
      } catch {
        setToken(null);
      } finally {
        setTokenChecked(true);
      }
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkToken, { timeout: 0 });
    } else {
      setTimeout(checkToken, 0);
    }
  }, []);
 
  // Show nothing until token is checked (prevents flash)
  if (!tokenChecked) {
    return null;
  }
 
  return token ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
