import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import { userLogin, userLoginWithGoogle } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useGoogleLogin } from "@react-oauth/google";
import { getGoogleUserFromToken } from "../utils/googleAuth";

const Login1 = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const sessionExpiredShown = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleRole, setGoogleRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider Data (Same as OTP page)
  const slides = [
    {
      img: "http://portal.grapetask.co/uploads/Testomonial/login.jpeg",
      title: "Empowering Talent",
      sub: "Pakistan's Future of Freelancing Starts Here. Connect with top experts today.",
      badge1Title: "Top Rated Experts",
      badge1Sub: "Verified Profiles",
      badge2Title: "Quality Work",
      badge2Sub: "Guaranteed Results",
    },
    {
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Start Earning Today",
      sub: "Earn Smarter. Grow Faster with GrapeTask. Turn your skills into a stable income.",
      badge1Title: "Active Orders",
      badge1Sub: "High Paying Tasks",
      badge2Title: "Daily Payouts",
      badge2Sub: "Secure Withdrawals",
    },
    {
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Grow Freelance Career",
      sub: "Work. Earn. Scale — All in One Platform. Manage your business deals like a pro.",
      badge1Title: "Project Milestone",
      badge1Sub: "Success Tracked",
      badge2Title: "Business Scale",
      badge2Sub: "Global Opportunities",
    },
  ];

  const switchRoleLabel = useMemo(() => {
    const s = searchParams.get("switch");
    if (s === "client") return "Client";
    if (s === "bd") return "BD";
    if (s === "expert") return "Expert";
    return null;
  }, [searchParams]);

  // Auto Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (searchParams.get("session") === "expired" && !sessionExpiredShown.current) {
      sessionExpiredShown.current = true;
      const next = new URLSearchParams(searchParams);
      next.delete("session");
      setSearchParams(next, { replace: true });
      toast.info("Session expired. Please sign in again.", { position: "top-right", autoClose: 4000 });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(userLogin({ data: { email, password }, handleClose: handleResponse })).unwrap();
    } catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

  const handleResponse = async (data) => {
    if (!data) { toast.error("No response from server."); return; }
    if (data.status) {
      localStorage.setItem("accessToken", data?.access_token);
      localStorage.setItem("UserData", JSON.stringify(data?.data));
      localStorage.setItem("Role", data?.data?.role);
      localStorage.setItem("IsOnboarded", data?.data?.is_onboarded || 0);
      if (data?.expires_at) localStorage.setItem("tokenExpiry", data.expires_at);
      toast.success("Successfully Logged In", { position: "top-right", autoClose: 2000 });
      
      const isVerified = data?.data?.is_verified ?? data?.data?.email_verify ?? 1;
      const isOnboarded = data?.data?.is_onboarded ?? data?.data?.profile?.is_onboarded ?? 0;
      
      if (data?.data?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (Number(isVerified) === 0) {
        localStorage.setItem("otpEmail", data?.data?.email || "");
        navigate("/otp", { replace: true });
      } else if (Number(isOnboarded) === 0) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/freelancers", { replace: true });
      }
    } else {
      setErrorMessage(data?.message || "Login failed. Try again.");
      toast.error(data?.message || "Login failed. Try again.");
    }
  };

  const handleGoogleLoginResponse = (data) => {
    if (!data) { toast.error("No response from server."); return; }
    if (data.status) {
      localStorage.setItem("accessToken", data?.access_token);
      localStorage.setItem("UserData", JSON.stringify(data?.data));
      localStorage.setItem("Role", data?.data?.role);
      localStorage.setItem("IsOnboarded", data?.data?.is_onboarded ?? data?.data?.profile?.is_onboarded ?? 0);
      if (data?.expires_at) localStorage.setItem("tokenExpiry", data.expires_at);
      toast.success("Successfully Logged In with Google", { position: "top-right", autoClose: 2000 });
      
      const isVerified = data?.data?.is_verified ?? data?.data?.email_verify ?? 1;
      
      if (data?.data?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (Number(isVerified) === 0) {
        localStorage.setItem("otpEmail", data?.data?.email || "");
        navigate("/otp", { replace: true });
      } else if (Number(data?.data?.is_onboarded) === 0) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/freelancers", { replace: true });
      }
    } else {
      setErrorMessage(data?.message || "Google Login failed. Try again.");
      toast.error(data?.message || "Google Login failed. Try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUser = await getGoogleUserFromToken(tokenResponse.access_token);
        const payload = { ...googleUser, role: googleRole, intent: "login" };
        await dispatch(userLoginWithGoogle({ payload, handleClose: handleGoogleLoginResponse })).unwrap();
      } catch (err) {
        setErrorMessage(err?.message || "Google sign-in failed.");
        toast.error(err?.message || "Google sign-in failed.");
      }
    },
    onError: (err) => {
      if (err?.error !== "popup_closed_by_user") toast.error(err?.message || "Google sign-in failed.");
    },
    flow: "implicit",
  });

  const handleSignInWithGoogle = () => {
    if (!googleRole || !googleRole.trim()) { toast.error("Please select your role first."); return; }
    googleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');

        /* ── THEME TOKENS ── */
        :root {
          --gt-main-bg:       #020617;
          --gt-card-bg:       rgba(255, 255, 255, 0.02);
          --gt-card-bg-active:rgba(255, 255, 255, 0.04);
          --gt-orange:        #f0591f;
          --gt-orange-glow:   rgba(240, 89, 31, 0.18);
          --gt-orange-border: rgba(240, 89, 31, 0.4);
          --gt-blue-blur:     rgba(59, 130, 246, 0.05);
          --gt-white:         #ffffff;
          --gt-black:         #000000;
          --gt-gray-hover:    #d4d4d8;
          --gt-gray-title:    #a1a1aa;
          --gt-gray-body:     #71717a;
          --gt-gray-num:      #52525b;
          --gt-border-light:  rgba(255, 255, 255, 0.06);
          --gt-border-med:    rgba(255, 255, 255, 0.07);
        }

        /* ── WRAPPER ── */
        .gtl-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gt-main-bg);
          padding: 20px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow blobs */
        .gtl-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .gtl-blob-1 {
          width: 350px; height: 350px;
          top: -100px; left: -80px;
          background: var(--gt-orange-glow);
        }
        .gtl-blob-2 {
          width: 300px; height: 300px;
          bottom: -60px; right: -60px;
          background: var(--gt-blue-blur);
        }

        /* ── CARD ── */
        .gtl-card {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 950px; 
          min-height: 600px;
          border-radius: 24px;
          overflow: hidden;
          background: var(--gt-main-bg); 
          border: 1px solid var(--gt-border-med);
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }

        /* ── FORM PANEL (left) ── */
        .gtl-form-panel {
          flex: 0 0 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gtl-form-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Logo styling */
        .gtl-logo {
          width: 130px;
          height: auto;
          object-fit: contain;
          margin-bottom: 24px;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
        }
        .gtl-logo:hover {
          transform: scale(1.02);
          cursor: pointer;
        }

        .gtl-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--gt-white);
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .gtl-subtitle {
          font-size: 13px;
          color: var(--gt-gray-body);
          margin-bottom: 24px;
        }
        .gtl-subtitle strong { color: var(--gt-orange); }

        /* ── FIELD ── */
        .gtl-field-label {
          font-size: 11px;
          font-weight: 500;
          color: var(--gt-gray-title);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .gtl-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--gt-border-med);
          border-radius: 10px;
          background: var(--gt-card-bg);
          color: var(--gt-white);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          margin-bottom: 14px;
        }

        .gtl-input::placeholder { color: var(--gt-gray-num); }
        .gtl-input:focus {
          border-color: var(--gt-orange-border);
          box-shadow: 0 0 0 2px var(--gt-orange-glow);
          background: var(--gt-card-bg-active);
        }
        .gtl-input option {
          background: #0f172a;
          color: var(--gt-white);
        }

        .gtl-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2371717a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }

        .gtl-pwd-wrap { position: relative; margin-bottom: 4px; }
        .gtl-pwd-wrap .gtl-input { margin-bottom: 0; padding-right: 40px; }
        .gtl-pwd-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: var(--gt-gray-body);
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .gtl-pwd-toggle:hover { color: var(--gt-gray-hover); }

        .gtl-forgot-row {
          display: flex; justify-content: flex-end;
          margin-bottom: 16px; margin-top: 6px;
        }
        .gtl-forgot-btn {
          background: none; border: none;
          font-size: 12px; color: var(--gt-orange);
          cursor: pointer; padding: 0;
          font-family: 'DM Sans', sans-serif; transition: opacity 0.2s;
        }
        .gtl-forgot-btn:hover { opacity: 0.75; }

        .gtl-submit-btn {
          width: 100%;
          padding: 12px;
          border: none; border-radius: 50px;
          background: var(--gt-orange); color: var(--gt-white);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer;
          transition: all 0.2s; margin-bottom: 16px;
          box-shadow: 0 4px 15px var(--gt-orange-glow);
        }
        .gtl-submit-btn:hover {
          background: #d94e18; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(240,89,31,0.3);
        }
        .gtl-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .gtl-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 4px 0 16px; font-size: 11px;
          color: var(--gt-gray-num);
        }
        .gtl-divider::before, .gtl-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--gt-border-light);
        }

        .gtl-google-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          padding: 11px; border: 1.5px solid var(--gt-border-med);
          border-radius: 50px; background: var(--gt-card-bg);
          color: var(--gt-white); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; margin-top: 10px;
        }
        .gtl-google-btn:hover {
          border-color: var(--gt-orange-border); background: var(--gt-card-bg-active);
          transform: translateY(-1px);
        }

        .gtl-error {
          background: rgba(240,89,31,0.08); border: 1px solid rgba(240,89,31,0.3);
          border-radius: 8px; color: #f87171; font-size: 12px;
          padding: 8px 12px; margin-bottom: 12px;
        }

        .gtl-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; background: var(--gt-orange-glow);
          border: 1px solid var(--gt-orange-border); border-radius: 20px;
          font-size: 11px; color: #fb923c; font-weight: 500;
          margin-bottom: 16px;
        }

        .gtl-footer-text {
          font-size: 12px; color: var(--gt-gray-body);
          text-align: center; margin-top: 16px;
        }
        .gtl-footer-text span.link {
          color: var(--gt-orange); font-weight: 600; cursor: pointer;
        }
        .gtl-footer-text span.link:hover { text-decoration: underline; }

        .gtl-panel-footer {
          margin-top: 24px; padding-top: 16px;
          border-top: 1px solid var(--gt-border-light);
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: space-between; align-items: center;
        }
        .gtl-panel-footer-links { display: flex; gap: 12px; }
        .gtl-panel-footer-links span, .gtl-panel-footer-copy {
          font-size: 10px; color: var(--gt-gray-num); cursor: pointer; transition: color 0.2s;
        }
        .gtl-panel-footer-links span:hover { color: var(--gt-gray-body); }

        /* ══════════ IMAGE SLIDER PANEL ══════════ */
        .gtl-slider-panel {
          flex: 1;
          padding: 24px; 
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gtl-slider-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 30px; 
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .gtl-slides-wrapper {
          display: flex;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .gtl-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .gtl-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gtl-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(2,6,23,0) 30%, rgba(2,6,23,0.8) 85%, rgba(2,6,23,0.95) 100%);
        }

        .gtl-slide-content {
          position: absolute;
          bottom: 50px;
          left: 32px;
          right: 32px;
          text-align: left;
        }

        .gtl-slide-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--gt-white);
          line-height: 1.2;
          margin-bottom: 8px;
          white-space: pre-line;
        }

        .gtl-slide-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

/* ── ULTRA COMPACT & RESPONSIVE BADGES ── */
@keyframes floatBadge {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); } /* Subtle animation */
  100% { transform: translateY(0px); }
}

.gtl-badges-wrapper {
  position: absolute;
  top: 25px;
  /* Right ki jagah Left use karein */
  left: 25px; 
  
  display: flex;
  flex-direction: column;
  
  /* Items ko left side par align karne ke liye flex-start zaroori hai */
  align-items: flex-start; 
  
  z-index: 10;
  animation: floatBadge 4s ease-in-out infinite;
}

/* Primary Badge (Orange) */
.gtl-badge-primary {
  background: #f0591f;
  padding: 8px 14px; /* Bohot choti padding */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 130px; /* Thodi width fix ki hai taake text fit aye */
  gap: 15px;
  box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3);
  position: relative;
  z-index: 2;
}

/* Secondary Badge (Dark) */
.gtl-badge-secondary {
  background: #020617; 
  padding: 8px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 130px;
  gap: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
  margin-top: -6px; /* Image jaisa exact tight overlap */
  margin-right: 15px; /* Thoda piche ki taraf */
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Text Container (For Title & Subtitle alignment) */
.gtl-fb-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

/* All White Text - Title (Bold & Small) */
.gtl-fb-title {
  color: #ffffff;
  font-size: 11px; /* UI ko elegant banayega */
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  font-family: 'DM Sans', sans-serif;
}

/* All White Text - Subtitle (Thin & Smaller) */
.gtl-fb-sub {
  color: rgba(255, 255, 255, 0.85); /* White but slight transparency for hierarchy */
  font-size: 9.5px;
  font-weight: 400;
  margin: 2px 0 0 0;
  font-family: 'DM Sans', sans-serif;
}

/* Tiny Dots */
.gtl-badge-primary .gtl-fb-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #000000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.gtl-badge-secondary .gtl-fb-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f0591f;
  box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2);
  flex-shrink: 0;
}

/* Mobile par Mazeed Chota (Responsive) */
@media (max-width: 768px) {
  .gtl-badges-wrapper {
    top: 15px;
    right: 15px;
    transform: scale(0.85); /* Shrinks the entire component */
    transform-origin: top right;
  }
}

        .gtl-fb-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        /* Dots Indicator */
        .gtl-slider-dots {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 10;
        }

        .gtl-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }

        .gtl-dot.active {
          background: var(--gt-orange);
          width: 24px;
          border-radius: 4px;
        }

        /* ── RESPONSIVE STYLING ── */
        @media (max-width: 992px) {
          .gtl-card { max-width: 800px; }
          .gtl-form-panel { padding: 30px; }
          .gtl-slide-title { font-size: 22px; }
          .gtl-badges-wrapper { top: 20px; right: 20px; }
        }

        @media (max-width: 768px) {
          .gtl-wrapper { padding: 15px; }
          .gtl-card {
            flex-direction: column;
            max-width: 100%;
          }
          
          .gtl-slider-panel {
            padding: 16px;
            height: 280px; 
            flex: none;
            order: -1; 
          }
          .gtl-slider-container { border-radius: 20px; }

          .gtl-slide-content { bottom: 30px; left: 20px; right: 20px; }
          .gtl-slide-title { font-size: 20px; }
          .gtl-slide-sub { font-size: 12px; }
          .gtl-slider-dots { bottom: 12px; }
          
          .gtl-badges-wrapper {
            transform: scale(0.85);
            transform-origin: top right;
          }

          .gtl-form-panel { padding: 24px; }
          .gtl-logo { width: 110px; margin-bottom: 16px; }
          .gtl-title { font-size: 22px; }
          
          .gtl-panel-footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            gap: 12px;
          }
          .gtl-panel-footer-links { justify-content: center; flex-wrap: wrap; }
        }

        @media (max-width: 400px) {
          .gtl-form-panel { padding: 20px 16px; }
          .gtl-input { font-size: 12px; padding: 10px 12px; }
          .gtl-submit-btn, .gtl-google-btn { font-size: 12px; padding: 10px; }
        }
      `}</style>

      <div className="gtl-wrapper">
        <ToastContainer />

        {/* Ambient blobs */}
        <div className="gtl-blob gtl-blob-1" />
        <div className="gtl-blob gtl-blob-2" />

        <div className="gtl-card">
          {/* ══════════ LEFT: FORM ══════════ */}
          <div className="gtl-form-panel">
            <div className="gtl-form-content">
              <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img
                  src={logo}
                  className="gtl-logo"
                  alt="GrapeTask"
                  loading="eager"
                />
              </Link>

              <p className="gtl-title">Welcome back</p>
              <p className="gtl-subtitle">
                Sign in to <strong>GrapeTask</strong> — Pakistan's #1 freelance marketplace
              </p>

              {switchRoleLabel && (
                <div className="gtl-role-badge">
                  <span>●</span> Logging in as <strong>{switchRoleLabel}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="gtl-field-label">Email</div>
                <input
                  type="email"
                  className="gtl-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  required
                />

                <div className="gtl-field-label">Password</div>
                <div className="gtl-pwd-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="gtl-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="gtl-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>

                <div className="gtl-forgot-row">
                  <button
                    type="button"
                    className="gtl-forgot-btn"
                    onClick={() => navigate("/forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                {errorMessage && <div className="gtl-error">{errorMessage}</div>}

                <button type="submit" className="gtl-submit-btn" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" color="light" /> : "Let's go"}
                </button>

                <div className="gtl-divider">or sign in with Google</div>

                <div className="gtl-field-label">Select role for Google sign-in</div>
                <select
                  className="gtl-input gtl-select"
                  value={googleRole}
                  onChange={(e) => setGoogleRole(e.target.value)}
                >
                  <option value="">Select your role</option>
                  <option value="expert/freelancer">Expert / Freelancer</option>
                  <option value="Client">Client</option>
                  <option value="bidder/company representative/middleman">Business Developer</option>
                </select>

                <button
                  type="button"
                  className="gtl-google-btn"
                  onClick={handleSignInWithGoogle}
                  disabled={isLoading}
                >
                  <FcGoogle size={18} />
                  {isLoading ? <Spinner size="sm" /> : "Sign in with Google"}
                </button>

                <p className="gtl-footer-text">
                  Not a member?{" "}
                  <span
                    className="link"
                    onClick={() => navigate("/signup")}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/signup")}
                    role="button"
                    tabIndex={0}
                  >
                    Sign up here
                  </span>
                </p>
              </form>
            </div>

            {/* Panel footer */}
            <div className="gtl-panel-footer">
              <div className="gtl-panel-footer-links">
                <span>Terms & Conditions</span>
                <span>Privacy Policy</span>
                <span>Cookie Policy</span>
              </div>
              <span className="gtl-panel-footer-copy">
                © {new Date().getFullYear()} GrapeTask
              </span>
            </div>
          </div>

          {/* ══════════ RIGHT: NEW IMAGE SLIDER WITH STACKED BADGES ══════════ */}
          <div className="gtl-slider-panel">
            <div className="gtl-slider-container">
              {/* Slides Wrapper */}
              <div 
                className="gtl-slides-wrapper" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="gtl-slide">
                    <img src={slide.img} alt={`Slide ${index + 1}`} />
                    <div className="gtl-slide-overlay" />
                    
           {/* Floating Badges Group */}
<div className="gtl-badges-wrapper">
  
  {/* Box 1: Orange (Primary) */}
  <div className="gtl-badge-primary">
    <div className="gtl-fb-text">
      <p className="gtl-fb-title">{slide.badge1Title}</p>
      <p className="gtl-fb-sub">{slide.badge1Sub}</p>
    </div>
    <div className="gtl-fb-dot"></div>
  </div>

  {/* Box 2: Navy Blue (Secondary) */}
  <div className="gtl-badge-secondary">
    <div className="gtl-fb-text">
      <p className="gtl-fb-title">{slide.badge2Title}</p>
      <p className="gtl-fb-sub">{slide.badge2Sub}</p>
    </div>
    <div className="gtl-fb-dot"></div>
  </div>

</div>

                    <div className="gtl-slide-content">
                      <p className="gtl-slide-title">{slide.title}</p>
                      <p className="gtl-slide-sub">{slide.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots for navigation */}
              <div className="gtl-slider-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`gtl-dot ${currentSlide === index ? "active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login1;