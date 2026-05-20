import React, { useState } from "react";
import { BsFacebook, BsMessenger } from "react-icons/bs";
import { FaEnvelope, FaTwitter, FaCheck } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useUserData } from "../../utils/useLocalStorage";

// --- GRAPETASK DARK THEME ---
const theme = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  pureWhite: "#ffffff",
  pureBlack: "#000000",
  lightGrayHover: "#d4d4d8",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  darkGrayNumber: "#52525b",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  mediumBorder: "rgba(255, 255, 255, 0.07)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)",
};

const Level2 = () => {
  const userDetail = useUserData();
  const [copied, setCopied] = useState(false);

  // Fixed the HTTP to HTTPS for better security and modern standards
  const referralLink = `https://grapetask.co/signup?referral=${userDetail?.referral_code || ""}`;

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar FirstNav="none" />
      <div className="level-wrapper poppins">
        <div className="container py-5">
          <div className="row justify-content-center text-center slide-up">
            
            {/* Header Section */}
            <div className="col-12 mb-4">
              <span className="badge-level">Level 2 Unlocked</span>
              <h3 className="page-title mt-2">
                Level 2 Referral Bonus: <br className="d-md-none" />
                <span className="highlight-text">Earn 25 Bonus Bids!</span>
              </h3>
            </div>

            {/* Main Glassmorphism Card */}
            <div className="col-lg-6 col-md-8 col-11">
              <div className="glass-card">
                
                <h6 className="description-text">
                  Invite your extended network and earn an indirect bonus of <strong style={{ color: theme.pureWhite }}>25 bids</strong> upon successful referrals. 
                  Your friend will also receive a <strong style={{ color: theme.pureWhite }}>50 bid</strong> sign-up bonus!
                </h6>
                
                <p className="terms-link mt-2 mb-4">
                  <span className="cursor-pointer">Terms & Conditions</span>
                </p>

                <hr className="divider" />

                {/* Social Sharing Section (Now fully functional) */}
                <div className="mt-4">
                  <h6 className="font-14 fw-semibold mb-3" style={{ color: theme.lightGrayHover }}>
                    Share your referral link using:
                  </h6>
                  <div className="d-flex justify-content-center align-items-center gap-3 gap-md-4 mt-3">
                    <button className="social-btn" onClick={() => window.open(`mailto:?subject=Join GrapeTask&body=${referralLink}`)} title="Share via Email">
                      <FaEnvelope size={20} />
                    </button>
                    <button className="social-btn" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`)} title="Share on Facebook">
                      <BsFacebook size={20} />
                    </button>
                    <button className="social-btn" onClick={() => window.open(`fb-messenger://share/?link=${referralLink}`)} title="Share on Messenger">
                      <BsMessenger size={20} />
                    </button>
                    <button className="social-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${referralLink}`)} title="Share on Twitter">
                      <FaTwitter size={20} />
                    </button>
                  </div>
                </div>

                {/* Link Copy Section */}
                <div className="mt-5">
                  <p className="font-13 mb-2 text-start" style={{ color: theme.mediumGrayTitle }}>
                    Or copy your personal referral link:
                  </p>
                  
                  <div className="copy-input-group">
                    <input
                      type="text"
                      className="custom-input"
                      value={referralLink}
                      readOnly
                    />
                    <button className="copy-btn" onClick={handleCopy} title="Copy Link">
                      {copied ? <FaCheck size={18} color={theme.pureWhite} /> : <MdOutlineContentCopy size={18} color={theme.pureWhite} />}
                    </button>
                  </div>

                  {/* Proceed to Level 3 */}
                  <Link to="/level3" className="text-decoration-none">
                    <button type="button" className="action-btn w-100 mt-4">
                      Unlock Level 3 Now
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- REFINED PURE CSS DESIGN FOR DARK THEME --- */}
      <style>{`
        .poppins { font-family: 'Poppins', sans-serif; }
        
        .level-wrapper { 
          background-color: ${theme.mainBg}; 
          min-height: 100vh; 
          color: ${theme.pureWhite}; 
          display: flex;
          align-items: center;
        }

        .badge-level {
          background: ${theme.orangeBorderActive};
          color: ${theme.primaryOrange};
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border: 1px solid ${theme.primaryOrange};
        }

        .page-title { 
          font-weight: 700; 
          font-size: 1.8rem; 
          color: ${theme.pureWhite}; 
          letter-spacing: -0.5px; 
        }
        
        .highlight-text { color: ${theme.primaryOrange}; }

        .glass-card {
          background: ${theme.cardBg};
          border: 1px solid ${theme.lightBorder};
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .glass-card:hover { border-color: ${theme.mediumBorder}; }

        .description-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.7;
          color: ${theme.mediumGrayTitle};
        }

        .terms-link {
          font-size: 12px;
          font-weight: 500;
          color: ${theme.bodyGrayText};
          text-decoration: underline;
          transition: 0.2s;
        }
        .terms-link span:hover { color: ${theme.lightGrayHover}; }

        .divider {
          border-color: ${theme.lightBorder};
          opacity: 1;
          margin: 20px 0;
        }

        /* Social Buttons */
        .social-btn {
          background: ${theme.cardBgActive};
          border: 1px solid ${theme.lightBorder};
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.primaryOrange};
          cursor: pointer;
          transition: 0.3s ease;
        }
        .social-btn:hover {
          background: ${theme.orangeBorderActive};
          border-color: ${theme.primaryOrange};
          color: ${theme.pureWhite};
          transform: translateY(-3px);
        }

        /* Copy Input Group */
        .copy-input-group {
          display: flex;
          align-items: stretch;
          background: ${theme.cardBgActive};
          border: 1px solid ${theme.mediumBorder};
          border-radius: 12px;
          overflow: hidden;
          transition: 0.3s;
        }
        .copy-input-group:focus-within {
          border-color: ${theme.primaryOrange};
          box-shadow: 0 0 0 2px ${theme.secondaryBlueBlur};
        }

        .custom-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: ${theme.lightGrayHover};
          font-size: 13px;
          padding: 12px 16px;
          outline: none;
        }

        .copy-btn {
          background: ${theme.primaryOrange};
          border: none;
          padding: 0 20px;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .copy-btn:hover { background: #d94b15; }

        /* Action Button */
        .action-btn {
          background: ${theme.cardBg};
          border: 1px solid ${theme.primaryOrange};
          color: ${theme.primaryOrange};
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.3s;
        }
        .action-btn:hover {
          background: ${theme.primaryOrange};
          color: ${theme.pureWhite};
          box-shadow: 0 8px 20px ${theme.orangeBorderActive};
        }

        /* Animations */
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }

        /* Responsive Fixes */
        @media (max-width: 576px) {
          .glass-card { padding: 20px; }
          .page-title { font-size: 1.5rem; }
          .social-btn { width: 40px; height: 40px; }
        }
      `}</style>
    </>
  );
};

export default Level2;