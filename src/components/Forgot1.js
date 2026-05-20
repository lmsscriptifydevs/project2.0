import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import logo from "../assets/logo.png";
// Agar aap Redux use kar rahe hain toh inko uncomment karein
// import { useDispatch, useSelector } from "../redux/store/store";
import axios from '../utils/axios';

const ForgotPassword = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { isLoading } = useSelector((state) => state.user);
  const isLoading = false; // Isko Redux se replace kar lein agar zaroorat ho
  
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setIsError(true);
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsProcessing(true);
    setIsError(false);

    try {
      const response = await axios.post(
        "forgot-password", // Change this to your exact API endpoint
        { email: email },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        // OTP page par jane se pehle email save kar lein takay wahan auto-fill ho jaye
        localStorage.setItem('otpEmail', email);
        
        // Success ke baad OTP verify page par bhej dein
        // Make sure to pass state or adjust route accordingly
        navigate("/otp-reset-password", { state: { formType: "forgot-password" } }); 
      } else {
        setIsError(true);
        setErrorMessage(response.data.message || "Failed to process request.");
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
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
        .gto-wrapper {
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
        .gto-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .gto-blob-1 {
          width: 350px; height: 350px;
          top: -100px; left: -80px;
          background: var(--gt-orange-glow);
        }
        .gto-blob-2 {
          width: 300px; height: 300px;
          bottom: -60px; right: -60px;
          background: var(--gt-blue-blur);
        }

        /* ── CARD ── */
        .gto-card {
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
        .gto-form-panel {
          flex: 0 0 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gto-form-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Logo */
        .gto-logo {
          width: 130px;
          height: auto;
          object-fit: contain;
          margin-bottom: 24px;
          filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .gto-logo:hover {
          transform: scale(1.02);
          cursor: pointer;
        }

        .gto-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--gt-white);
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .gto-subtitle {
          font-size: 14px;
          color: var(--gt-gray-body);
          margin-bottom: 28px;
          line-height: 1.5;
        }
        
        /* ── INPUT FIELD ── */
        .gto-input-group {
          margin-bottom: 24px;
          width: 100%;
        }
        .gto-input-label {
          display: block;
          font-size: 13px;
          color: var(--gt-gray-title);
          margin-bottom: 8px;
          font-weight: 500;
        }
        .gto-input {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          border: 1.5px solid var(--gt-border-med);
          background: var(--gt-card-bg);
          color: var(--gt-white);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 0 16px;
          outline: none;
          transition: all 0.2s ease;
        }
        .gto-input::placeholder {
          color: var(--gt-gray-num);
        }
        .gto-input:focus {
          border-color: var(--gt-orange-border);
          box-shadow: 0 0 0 3px var(--gt-orange-glow);
          background: var(--gt-card-bg-active);
          transform: translateY(-2px);
        }

        /* ── ERROR ── */
        .gto-error {
          background: rgba(240,89,31,0.08); 
          border: 1px solid rgba(240,89,31,0.3);
          border-radius: 10px; 
          color: #f87171; 
          font-size: 13px;
          padding: 10px 14px; 
          margin-bottom: 16px;
          text-align: center;
        }

        /* ── SUBMIT BTN ── */
        .gto-submit-btn {
          width: 100%;
          padding: 14px;
          border: none; border-radius: 50px;
          background: var(--gt-orange); color: var(--gt-white);
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 600; cursor: pointer;
          transition: all 0.2s; margin-bottom: 16px;
          box-shadow: 0 4px 15px var(--gt-orange-glow);
        }
        .gto-submit-btn:hover:not(:disabled) {
          background: #d94e18; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(240,89,31,0.3);
        }
        .gto-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .gto-submit-btn:disabled { 
          opacity: 0.6;
          cursor: not-allowed;
        }

        .gto-resend-text {
          font-size: 14px; color: var(--gt-gray-body);
          margin-top: 10px; margin-bottom: 0;
          text-align: center;
        }
        .gto-resend-text a {
          color: var(--gt-orange); 
          font-weight: 600; 
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .gto-resend-text a:hover { text-decoration: underline; }

        /* ── PANEL FOOTER ── */
        .gto-panel-footer {
          margin-top: 30px; padding-top: 16px;
          border-top: 1px solid var(--gt-border-light);
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: space-between; align-items: center;
        }
        .gto-panel-footer-links { display: flex; gap: 14px; }
        .gto-panel-footer-links span, .gto-panel-footer-copy {
          font-size: 10px; color: var(--gt-gray-num); cursor: pointer; transition: color 0.2s;
        }
        .gto-panel-footer-links span:hover { color: var(--gt-gray-body); }

        /* ══════════ IMAGE SLIDER PANEL ══════════ */
        .gto-slider-panel {
          flex: 1;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gto-slider-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .gto-slides-wrapper {
          display: flex;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .gto-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .gto-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gto-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(2,6,23,0) 30%, rgba(2,6,23,0.8) 85%, rgba(2,6,23,0.95) 100%);
        }

        .gto-slide-content {
          position: absolute;
          bottom: 50px;
          left: 32px;
          right: 32px;
          text-align: left;
        }

.gto-slide-title {
  font-family: 'Fraunces', serif;
  
  /* 1. Dynamic Font Size: 
     Mobile par 18px tak chota ho jayega, aur screen ke hisab se 28px tak barhay ga */
  font-size: clamp(18px, 5vw, 28px); 
  
  font-weight: 600;
  color: var(--gt-white);
  line-height: 1.2;
  margin-bottom: 8px;
  
  /* 2. Single Line Control */
  white-space: nowrap;  /* Text break nahi hoga */
  overflow: hidden;     /* Baher nahi niklega */
  
  /* 3. Fill aur Fit settings */
  display: block;
  width: 100%;          /* Poori width cover karega */
  
  /* Agar aap dots (...) nahi chahte to ellipsis hata dein */
  /* text-overflow: ellipsis; */ 
}

        .gto-slide-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* ── ULTRA COMPACT & RESPONSIVE BADGES ── */
        @keyframes floatBadge {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }

        .gto-badges-wrapper {
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
        .gto-badge-primary {
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
        .gto-badge-secondary {
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
        .gto-fb-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .gto-fb-title {
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
          font-family: 'DM Sans', sans-serif;
        }

        .gto-fb-sub {
          color: rgba(255, 255, 255, 0.85);
          font-size: 9.5px;
          font-weight: 400;
          margin: 2px 0 0 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Tiny Dots */
        .gto-badge-primary .gto-fb-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #000000; box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }

        .gto-badge-secondary .gto-fb-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #f0591f; box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2);
          flex-shrink: 0;
        }

        /* Dots Indicator */
        .gto-slider-dots {
          position: absolute;
          bottom: 20px; left: 0; right: 0;
          display: flex; justify-content: center; gap: 8px;
          z-index: 10;
        }

        .gto-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer; transition: all 0.3s ease;
          border: none; padding: 0;
        }

        .gto-dot.active {
          background: var(--gt-orange);
          width: 24px; border-radius: 4px;
        }

        /* ── RESPONSIVE STYLING ── */
        @media (max-width: 992px) {
          .gto-card { max-width: 800px; }
          .gto-form-panel { padding: 30px; }
          .gto-slide-title { font-size: 22px; }
          .gto-badges-wrapper { top: 20px; left: 20px; }
        }

        @media (max-width: 768px) {
          .gto-wrapper { padding: 15px; }
          .gto-card { flex-direction: column; max-width: 100%; }

          .gto-slider-panel {
            padding: 16px; height: 280px; flex: none; order: -1;
          }
          .gto-slider-container { border-radius: 20px; }
          .gto-slide-content { bottom: 30px; left: 20px; right: 20px; }
          .gto-slide-title { font-size: 20px; }
          .gto-slide-sub { font-size: 12px; }
          .gto-slider-dots { bottom: 12px; }

          .gto-badges-wrapper { transform: scale(0.85); transform-origin: top left; }

          .gto-form-panel { padding: 24px; }
          .gto-logo { width: 110px; margin-bottom: 16px; }
          .gto-title { font-size: 22px; }

          .gto-panel-footer {
            flex-direction: column; justify-content: center;
            text-align: center; gap: 12px;
          }
          .gto-panel-footer-links { justify-content: center; flex-wrap: wrap; }
        }

        @media (max-width: 400px) {
          .gto-form-panel { padding: 20px 16px; }
        }
      `}</style>

      <div className="gto-wrapper">
        {/* Ambient blobs */}
        <div className="gto-blob gto-blob-1" />
        <div className="gto-blob gto-blob-2" />

        <div className="gto-card">
          {/* ══════════ LEFT: FORM ══════════ */}
          <div className="gto-form-panel">
            <div className="gto-form-content">
              <Link to="/" style={{ display: "inline-block", textDecoration: "none" }}>
                <img src={logo} className="gto-logo" alt="GrapeTask" loading="eager" />
              </Link>

              <p className="gto-title">Forgot Password?</p>
              <p className="gto-subtitle">
                Enter your registered email address below, and we'll send you a 6-digit code to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="gto-input-group">
                  <label className="gto-input-label">Email Address</label>
                  <input
                    type="email"
                    className="gto-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {isError && <div className="gto-error">{errorMessage}</div>}

                <button 
                  type="submit" 
                  className="gto-submit-btn" 
                  disabled={isLoading || isProcessing || !email}
                >
                  {isLoading || isProcessing ? <Spinner size="sm" color="light" /> : "Send Verification Code"}
                </button>

                <p className="gto-resend-text">
                  Remember your password?{" "}
                  <Link to="/login">Back to Login</Link>
                </p>
              </form>
            </div>

            {/* Panel footer */}
            <div className="gto-panel-footer">
              <div className="gto-panel-footer-links">
                <span>Terms & Conditions</span>
                <span>Privacy Policy</span>
                <span>Cookie Policy</span>
              </div>
              <span className="gto-panel-footer-copy">
                © {new Date().getFullYear()} GrapeTask
              </span>
            </div>
          </div>

          {/* ══════════ RIGHT: IMAGE SLIDER WITH STACKED BADGES ══════════ */}
          <div className="gto-slider-panel">
            <div className="gto-slider-container">
              {/* Slides Wrapper */}
              <div
                className="gto-slides-wrapper"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="gto-slide">
                    <img src={slide.img} alt={`Slide ${index + 1}`} />
                    <div className="gto-slide-overlay" />

                    {/* Floating Badges Group */}
                    <div className="gto-badges-wrapper">
                      {/* Box 1: Orange (Primary) */}
                      <div className="gto-badge-primary">
                        <div className="gto-fb-text">
                          <p className="gto-fb-title">{slide.badge1Title}</p>
                          <p className="gto-fb-sub">{slide.badge1Sub}</p>
                        </div>
                        <div className="gto-fb-dot"></div>
                      </div>

                      {/* Box 2: Navy Blue (Secondary) */}
                      <div className="gto-badge-secondary">
                        <div className="gto-fb-text">
                          <p className="gto-fb-title">{slide.badge2Title}</p>
                          <p className="gto-fb-sub">{slide.badge2Sub}</p>
                        </div>
                        <div className="gto-fb-dot"></div>
                      </div>
                    </div>

                    <div className="gto-slide-content">
                      <p className="gto-slide-title">{slide.title}</p>
                      <p className="gto-slide-sub">{slide.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots for navigation */}
              <div className="gto-slider-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`gto-dot ${currentSlide === index ? "active" : ""}`}
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

export default ForgotPassword;