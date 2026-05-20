import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import { userRegister, userLoginWithGoogle } from "../redux/slices/userSlice";
import { getGoogleUserFromToken } from "../utils/googleAuth";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const referralCode = queryParams.get("referral");

  const { isLoadingRegister, isLoading } = useSelector((state) => state.user);
  const pendingGoogleRoleRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorShow, setIsErrorShow] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleRole, setGoogleRole] = useState("");
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
  // Auto Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !role || !email || !password || !terms) {
      setIsError(true);
      setIsErrorShow("All fields are required.");
      return;
    }
    const data = {
      fname: firstName.trim(),
      lname: lastName.trim(),
      user_name: email.split("@")[0],
      email: email.trim().toLowerCase(),
      role: role,
      password: password,
      agree_with_terms: terms ? 1 : 0,
    };
    if (referralCode && referralCode.trim() && referralCode !== "0") {
      data.referral_code = referralCode.trim();
    }
    dispatch(userRegister({ data, handleClose: handleResponse }));
  };

  const handleResponse = async (data) => {
    if (data?.status) {
      toast.success("Successfully Registered! Please verify your email.", {
        position: "top-right",
        autoClose: 2000,
      });
      if (data?.access_token) localStorage.setItem("accessToken", data.access_token);
      if (data?.data) localStorage.setItem("UserData", JSON.stringify(data.data));
      if (data?.data?.role) localStorage.setItem("Role", data?.data.role);
      
      // Store email for OTP verification
      localStorage.setItem("otpEmail", email.trim().toLowerCase());
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/otp");
    } else {
      setIsError(true);
      const msg =
        data?.message ||
        (data?.errors && Object.values(data.errors).flat()[0]) ||
        "Registration failed. Please try again.";
      setIsErrorShow(msg);
    }
  };

  const roleToFormValue = {
    freelancer: "expert/freelancer",
    client: "Client",
    bd: "bidder/company representative/middleman",
  };

  const handleGoogleSignUpResponse = (data) => {
    if (data?.status) {
      localStorage.setItem("accessToken", data?.access_token);
      localStorage.setItem("UserData", JSON.stringify(data?.data));
      localStorage.setItem("Role", data?.data?.role ?? "user");
      localStorage.setItem("IsOnboarded", data?.data?.is_onboarded || 0);
      if (data?.expires_at) localStorage.setItem("tokenExpiry", data.expires_at);
      toast.success("Successfully signed up with Google!", {
        position: "top-right",
        autoClose: 2000,
      });
      if (Number(data?.data?.is_onboarded) === 0) {
        navigate("/onboarding");
      } else {
        navigate("/freelancers");
      }
    } else {
      setIsError(true);
      setIsErrorShow(data?.message || "Sign up with Google failed.");
      toast.error(data?.message || "Sign up with Google failed.");
    }
  };

  const googleSignUpLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUser = await getGoogleUserFromToken(tokenResponse.access_token);
        const backendRole = roleToFormValue[pendingGoogleRoleRef.current] || "user";
        const payload = {
          ...googleUser,
          role: backendRole,
          agree_with_terms: 1,
          referral_code: referralCode || undefined,
        };
        await dispatch(
          userLoginWithGoogle({ payload, handleClose: handleGoogleSignUpResponse })
        ).unwrap();
      } catch (err) {
        setIsError(true);
        setIsErrorShow(err?.message || "Sign up with Google failed.");
        toast.error(err?.message || "Sign up with Google failed.");
      }
    },
    onError: (err) => {
      if (err?.error !== "popup_closed_by_user") {
        toast.error(err?.message || "Google sign-in failed.");
      }
    },
    flow: "implicit",
  });

  const handleSignUpWithGoogle = () => {
    if (!googleRole || !googleRole.trim()) {
      toast.error("Please select your role for Google sign-up first.");
      return;
    }
    pendingGoogleRoleRef.current =
      Object.entries(roleToFormValue).find(([, v]) => v === googleRole)?.[0] || googleRole;
    googleSignUpLogin();
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
        .gts-wrapper {
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
        .gts-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .gts-blob-1 {
          width: 350px; height: 350px;
          top: -100px; left: -80px;
          background: var(--gt-orange-glow);
        }
        .gts-blob-2 {
          width: 300px; height: 300px;
          bottom: -60px; right: -60px;
          background: var(--gt-blue-blur);
        }

        /* ── CARD ── */
        .gts-card {
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
        .gts-form-panel {
          flex: 0 0 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gts-form-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Logo styling */
        .gts-logo {
          width: 130px;
          height: auto;
          object-fit: contain;
          margin-bottom: 24px;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
        }
        .gts-logo:hover {
          transform: scale(1.02);
          cursor: pointer;
        }

        .gts-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--gt-white);
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .gts-subtitle {
          font-size: 13px;
          color: var(--gt-gray-body);
          margin-bottom: 24px;
        }
        .gts-subtitle strong { color: var(--gt-orange); }

        /* ── FIELD ── */
        .gts-field-label {
          font-size: 11px;
          font-weight: 500;
          color: var(--gt-gray-title);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .gts-input {
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
          box-sizing: border-box;
        }

        .gts-input::placeholder { color: var(--gt-gray-num); }
        .gts-input:focus {
          border-color: var(--gt-orange-border);
          box-shadow: 0 0 0 2px var(--gt-orange-glow);
          background: var(--gt-card-bg-active);
        }
        .gts-input option {
          background: #0f172a;
          color: var(--gt-white);
        }

        .gts-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2371717a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
          padding-right: 40px;
        }

        /* Name row */
        .gts-name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gts-pwd-wrap { position: relative; margin-bottom: 4px; }
        .gts-pwd-wrap .gts-input { margin-bottom: 0; padding-right: 40px; }
        .gts-pwd-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: var(--gt-gray-body);
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .gts-pwd-toggle:hover { color: var(--gt-gray-hover); }

        /* Terms */
        .gts-terms-row {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 14px;
        }
        .gts-terms-check {
          width: 15px; height: 15px;
          margin-top: 2px;
          accent-color: var(--gt-orange);
          flex-shrink: 0;
          cursor: pointer;
        }
        .gts-terms-label {
          font-size: 11px;
          color: var(--gt-gray-body);
          line-height: 1.5;
          cursor: pointer;
        }
        .gts-terms-label span { color: var(--gt-orange); }

        .gts-submit-btn {
          width: 100%;
          padding: 12px;
          border: none; border-radius: 50px;
          background: var(--gt-orange); color: var(--gt-white);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer;
          transition: all 0.2s; margin-bottom: 16px;
          box-shadow: 0 4px 15px var(--gt-orange-glow);
        }
        .gts-submit-btn:hover {
          background: #d94e18; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(240,89,31,0.3);
        }
        .gts-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .gts-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 4px 0 16px; font-size: 11px;
          color: var(--gt-gray-num);
        }
        .gts-divider::before, .gts-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--gt-border-light);
        }

        .gts-google-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          padding: 11px; border: 1.5px solid var(--gt-border-med);
          border-radius: 50px; background: var(--gt-card-bg);
          color: var(--gt-white); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; margin-top: 10px;
        }
        .gts-google-btn:hover {
          border-color: var(--gt-orange-border); background: var(--gt-card-bg-active);
          transform: translateY(-1px);
        }
        .gts-google-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .gts-error {
          background: rgba(240,89,31,0.08); border: 1px solid rgba(240,89,31,0.3);
          border-radius: 8px; color: #f87171; font-size: 12px;
          padding: 8px 12px; margin-bottom: 12px;
        }

        .gts-footer-text {
          font-size: 12px; color: var(--gt-gray-body);
          text-align: center; margin-top: 16px;
        }
        .gts-footer-text span.link {
          color: var(--gt-orange); font-weight: 600; cursor: pointer;
        }
        .gts-footer-text span.link:hover { text-decoration: underline; }

        .gts-panel-footer {
          margin-top: 24px; padding-top: 16px;
          border-top: 1px solid var(--gt-border-light);
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: space-between; align-items: center;
        }
        .gts-panel-footer-links { display: flex; gap: 12px; }
        .gts-panel-footer-links span, .gts-panel-footer-copy {
          font-size: 10px; color: var(--gt-gray-num); cursor: pointer; transition: color 0.2s;
        }
        .gts-panel-footer-links span:hover { color: var(--gt-gray-body); }

        /* ══════════ IMAGE SLIDER PANEL ══════════ */
        .gts-slider-panel {
          flex: 1;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gts-slider-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .gts-slides-wrapper {
          display: flex;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .gts-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .gts-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gts-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(2,6,23,0) 30%, rgba(2,6,23,0.8) 85%, rgba(2,6,23,0.95) 100%);
        }

        .gts-slide-content {
          position: absolute;
          bottom: 50px;
          left: 32px;
          right: 32px;
          text-align: left;
        }

        .gts-slide-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--gt-white);
          line-height: 1.2;
          margin-bottom: 8px;
          white-space: pre-line;
        }

        .gts-slide-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* ── ULTRA COMPACT & RESPONSIVE BADGES ── */
        @keyframes floatBadge {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }

        .gts-badges-wrapper {
          position: absolute;
          top: 25px;
          left: 25px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 10;
          animation: floatBadge 4s ease-in-out infinite;
        }

        /* Primary Badge (Orange) */
        .gts-badge-primary {
          background: #f0591f;
          padding: 8px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 130px;
          gap: 15px;
          box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3);
          position: relative;
          z-index: 2;
        }

        /* Secondary Badge (Dark) */
        .gts-badge-secondary {
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
          margin-top: -6px;
          margin-right: 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Text Container */
        .gts-fb-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        /* All White Text - Title */
        .gts-fb-title {
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
          font-family: 'DM Sans', sans-serif;
        }

        /* All White Text - Subtitle */
        .gts-fb-sub {
          color: rgba(255, 255, 255, 0.85);
          font-size: 9.5px;
          font-weight: 400;
          margin: 2px 0 0 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Tiny Dots */
        .gts-badge-primary .gts-fb-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }

        .gts-badge-secondary .gts-fb-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f0591f;
          box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2);
          flex-shrink: 0;
        }

        /* Dots Indicator */
        .gts-slider-dots {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 10;
        }

        .gts-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }

        .gts-dot.active {
          background: var(--gt-orange);
          width: 24px;
          border-radius: 4px;
        }

        /* ── RESPONSIVE STYLING ── */
        @media (max-width: 992px) {
          .gts-card { max-width: 800px; }
          .gts-form-panel { padding: 30px; }
          .gts-slide-title { font-size: 22px; }
          .gts-badges-wrapper { top: 20px; left: 20px; }
        }

        @media (max-width: 768px) {
          .gts-wrapper { padding: 15px; }
          .gts-card {
            flex-direction: column;
            max-width: 100%;
          }

          .gts-slider-panel {
            padding: 16px;
            height: 280px;
            flex: none;
            order: -1;
          }
          .gts-slider-container { border-radius: 20px; }

          .gts-slide-content { bottom: 30px; left: 20px; right: 20px; }
          .gts-slide-title { font-size: 20px; }
          .gts-slide-sub { font-size: 12px; }
          .gts-slider-dots { bottom: 12px; }

          .gts-badges-wrapper {
            transform: scale(0.85);
            transform-origin: top left;
          }

          .gts-form-panel {
            padding: 24px;
            max-height: none;
          }
          .gts-logo { width: 110px; margin-bottom: 16px; }
          .gts-title { font-size: 22px; }

          .gts-panel-footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            gap: 12px;
          }
          .gts-panel-footer-links { justify-content: center; flex-wrap: wrap; }

          .gts-name-row { grid-template-columns: 1fr; gap: 0; }
        }

        @media (max-width: 400px) {
          .gts-form-panel { padding: 20px 16px; }
          .gts-input { font-size: 12px; padding: 10px 12px; }
          .gts-submit-btn, .gts-google-btn { font-size: 12px; padding: 10px; }
        }
      `}</style>

      <div className="gts-wrapper">
        <ToastContainer />

        {/* Ambient blobs */}
        <div className="gts-blob gts-blob-1" />
        <div className="gts-blob gts-blob-2" />

        <div className="gts-card">
          {/* ══════════ LEFT: FORM ══════════ */}
          <div className="gts-form-panel">
            <div className="gts-form-content">
              <Link to="/" style={{ display: "inline-block", textDecoration: "none" }}>
                <img src={logo} className="gts-logo" alt="GrapeTask" loading="eager" />
              </Link>

              <p className="gts-title">Create your account</p>
              <p className="gts-subtitle">
                Join <strong>GrapeTask</strong> — Pakistan's #1 freelance marketplace
              </p>

              <form onSubmit={handleSubmit}>
                {/* Name Row */}
                <div className="gts-name-row">
                  <div>
                    <div className="gts-field-label">First Name</div>
                    <input
                      type="text"
                      className="gts-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <div className="gts-field-label">Last Name</div>
                    <input
                      type="text"
                      className="gts-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="gts-field-label">Your Role</div>
                <select
                  className="gts-input gts-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="expert/freelancer">Expert / Freelancer</option>
                  <option value="Client">Client</option>
                  <option value="bidder/company representative/middleman">Business Developer</option>
                </select>

                {/* Email */}
                <div className="gts-field-label">Email</div>
                <input
                  type="email"
                  className="gts-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  required
                />

                {/* Password */}
                <div className="gts-field-label">Password</div>
                <div className="gts-pwd-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="gts-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="gts-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>

                {/* Terms */}
                <div className="gts-terms-row">
                  <input
                    type="checkbox"
                    id="gts-terms"
                    className="gts-terms-check"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="gts-terms" className="gts-terms-label">
                    I agree with the <span>Terms of Service</span>,{" "}
                    <span>Privacy Policy</span>, and GrapeTask default Notification Settings.
                  </label>
                </div>

                {isError && <div className="gts-error">{isErrorShow}</div>}

                {/* Submit */}
                <button type="submit" className="gts-submit-btn" disabled={isLoadingRegister}>
                  {isLoadingRegister ? <Spinner size="sm" color="light" /> : "Let's go"}
                </button>

                {/* Divider */}
                <div className="gts-divider">or sign up with Google</div>

                {/* Google role select */}
                <div className="gts-field-label">Select role for Google sign-up</div>
                <select
                  className="gts-input gts-select"
                  value={googleRole}
                  onChange={(e) => setGoogleRole(e.target.value)}
                >
                  <option value="">Select your role</option>
                  <option value="expert/freelancer">Expert / Freelancer</option>
                  <option value="Client">Client</option>
                  <option value="bidder/company representative/middleman">Business Developer</option>
                </select>

                {/* Google Btn */}
                <button
                  type="button"
                  className="gts-google-btn"
                  onClick={handleSignUpWithGoogle}
                  disabled={isLoading || isLoadingRegister}
                >
                  <FcGoogle size={18} />
                  {isLoading ? <Spinner size="sm" /> : "Sign up with Google"}
                </button>

                <p className="gts-footer-text">
                  Already a member?{" "}
                  <span
                    className="link"
                    onClick={() => navigate("/login")}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/login")}
                    role="button"
                    tabIndex={0}
                  >
                    Log in here
                  </span>
                </p>
              </form>
            </div>

            {/* Panel footer */}
            <div className="gts-panel-footer">
              <div className="gts-panel-footer-links">
                <span>Terms & Conditions</span>
                <span>Privacy Policy</span>
                <span>Cookie Policy</span>
              </div>
              <span className="gts-panel-footer-copy">
                © {new Date().getFullYear()} GrapeTask
              </span>
            </div>
          </div>

          {/* ══════════ RIGHT: IMAGE SLIDER WITH STACKED BADGES ══════════ */}
          <div className="gts-slider-panel">
            <div className="gts-slider-container">
              {/* Slides Wrapper */}
              <div
                className="gts-slides-wrapper"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="gts-slide">
                    <img src={slide.img} alt={`Slide ${index + 1}`} />
                    <div className="gts-slide-overlay" />

                    {/* Floating Badges Group */}
                    <div className="gts-badges-wrapper">
                      {/* Box 1: Orange (Primary) */}
                      <div className="gts-badge-primary">
                        <div className="gts-fb-text">
                          <p className="gts-fb-title">{slide.badge1Title}</p>
                          <p className="gts-fb-sub">{slide.badge1Sub}</p>
                        </div>
                        <div className="gts-fb-dot"></div>
                      </div>

                      {/* Box 2: Navy Blue (Secondary) */}
                      <div className="gts-badge-secondary">
                        <div className="gts-fb-text">
                          <p className="gts-fb-title">{slide.badge2Title}</p>
                          <p className="gts-fb-sub">{slide.badge2Sub}</p>
                        </div>
                        <div className="gts-fb-dot"></div>
                      </div>
                    </div>

                    <div className="gts-slide-content">
                      <p className="gts-slide-title">{slide.title}</p>
                      <p className="gts-slide-sub">{slide.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots for navigation */}
              <div className="gts-slider-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`gts-dot ${currentSlide === index ? "active" : ""}`}
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

export default Signup;