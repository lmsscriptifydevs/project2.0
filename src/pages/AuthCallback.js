import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BACKEND_BASE } from "../config";
import { setAuthFromCallback } from "../redux/slices/userSlice";

/**
 * Handles redirect from Laravel backend after Google OAuth (server-side flow).
 * URL: /auth/callback?token=...&expires_at=...&status=1  or  ?error=...
 * Uses BACKEND_BASE for validate (same server that issued the token) so 401 does not clear token.
 * Sets Redux auth state and navigates to dashboard so user is not sent back to login.
 */
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token");
    const expiresAt = searchParams.get("expires_at");

    if (error) {
      setStatus("error");
      setMessage(error || "Google sign-in failed.");
      return;
    }

    if (!token) {
      setStatus("error");
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
      setMessage(
        "No token received. Make sure you started sign up / login from this same site. " +
          "If you use " + currentOrigin + ", set FRONTEND_URL=" + currentOrigin + " in backend .env and restart Laravel, then try again from Sign up or Login."
      );
      return;
    }

    localStorage.setItem("accessToken", token);
    if (expiresAt) localStorage.setItem("tokenExpiry", expiresAt);

    const validateUrl = `${BACKEND_BASE.replace(/\/$/, "")}/api/auth/validate`;
    fetch(validateUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.user) {
          const u = data.user;
          const userData = {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            email_verify: u.email_verified ? 1 : 0,
            fname: u.name?.split(" ")[0] || "",
            lname: u.name?.split(" ").slice(1).join(" ") || "",
          };
          localStorage.setItem("UserData", JSON.stringify(userData));
          if (u.role) localStorage.setItem("Role", u.role);
          dispatch(setAuthFromCallback({ user: userData }));
        } else {
          dispatch(setAuthFromCallback({ user: { role: "user", name: "", email: "" } }));
        }
        setStatus("success");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.setItem("UserData", JSON.stringify({ role: "user" }));
        localStorage.setItem("Role", "user");
        dispatch(setAuthFromCallback({ user: { role: "user" } }));
        setStatus("success");
        navigate("/dashboard", { replace: true });
      });
  }, [searchParams, navigate, dispatch]);

  if (status === "loading") {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Signing you in...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-3">
        <div className="alert alert-danger shadow-sm" role="alert">
          <strong>Login failed</strong>
          <p className="mb-0 mt-2">{message}</p>
        </div>
        <div className="d-flex gap-2 mt-3 flex-wrap justify-content-center">
          <Link to="/signup" className="btn btn-outline-primary">Try again from Sign up</Link>
          <Link to="/login" className="btn btn-primary">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <p className="text-muted">Redirecting to dashboard...</p>
    </div>
  );
}

export default AuthCallback;
