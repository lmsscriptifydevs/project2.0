import React, { useState } from 'react'
import { FaGift } from 'react-icons/fa'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

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

const Referl = () => {
  const [referralCode, setReferralCode] = useState("");

  return (
    <>
      <Navbar FirstNav='none' />
      <div className="redeem-wrapper poppins">
        <div className="container py-5">
          <div className="row justify-content-center text-center slide-up">
            
            {/* Header Section */}
            <div className="col-12 mb-4">
              <span className="badge-level">Redeem Code</span>
              <h3 className="page-title mt-3">
                Redeem Your Referral Code to <br className="d-md-none" />
                <span className="highlight-text">Claim Bonus Bids!</span>
              </h3>
            </div>

            {/* Main Glassmorphism Card */}
            <div className="col-lg-6 col-md-8 col-11">
              <div className="glass-card">
                
                <h6 className="description-text">
                  Enter the referral code provided by your friend to claim your bonus bids. 
                  This referral unlocks <strong style={{ color: theme.pureWhite }}>bonus bids</strong> for you and rewards your friend as well!
                </h6>

                <hr className="divider" />

                {/* Code Input Section */}
                <div className="mt-4 pt-2">
                  <p className="font-13 mb-2 text-start fw-semibold" style={{ color: theme.lightGrayHover }}>
                    Referral Code:
                  </p>
                  
                  <div className="input-group-custom mb-4">
                    <div className="icon-box">
                      <FaGift size={18} color={theme.primaryOrange} />
                    </div>
                    <input 
                      type="text" 
                      className="custom-input uppercase-input" 
                      placeholder="ENTER CODE HERE" 
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    />
                  </div>

                  <p className="terms-link mb-4 text-start">
                    <span className="cursor-pointer">Terms & Conditions apply</span>
                  </p>

                  {/* Redeem Action Button */}
                  <Link to='/thanks' className="text-decoration-none">
                    <button 
                      type='button' 
                      className="action-btn w-100"
                      disabled={!referralCode.trim()}
                      style={{ opacity: !referralCode.trim() ? 0.5 : 1 }}
                    >
                      Redeem Bonus
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
        
        .redeem-wrapper { 
          background-color: ${theme.mainBg}; 
          min-height: 100vh; 
          color: ${theme.pureWhite}; 
          display: flex;
          align-items: center;
        }

        .badge-level {
          background: ${theme.secondaryBlueBlur};
          color: #60a5fa; /* A nice blue to distinguish from the orange levels */
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .page-title { 
          font-weight: 700; 
          font-size: 1.8rem; 
          color: ${theme.pureWhite}; 
          letter-spacing: -0.5px; 
          line-height: 1.3;
        }
        
        .highlight-text { color: ${theme.primaryOrange}; }

        .glass-card {
          background: ${theme.cardBg};
          border: 1px solid ${theme.lightBorder};
          border-radius: 20px;
          padding: 35px 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .glass-card:hover { border-color: ${theme.mediumBorder}; }

        .description-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          color: ${theme.mediumGrayTitle};
          margin-bottom: 0;
        }

        .divider {
          border-color: ${theme.lightBorder};
          opacity: 1;
          margin: 25px 0;
        }

        /* Custom Input Group */
        .input-group-custom {
          display: flex;
          align-items: stretch;
          background: ${theme.cardBgActive};
          border: 1px solid ${theme.mediumBorder};
          border-radius: 12px;
          overflow: hidden;
          transition: 0.3s;
        }
        .input-group-custom:focus-within {
          border-color: ${theme.primaryOrange};
          box-shadow: 0 0 0 2px ${theme.secondaryBlueBlur};
        }

        .icon-box {
          background: ${theme.cardBg};
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid ${theme.lightBorder};
        }

        .custom-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: ${theme.pureWhite};
          font-size: 15px;
          font-weight: 600;
          padding: 14px 16px;
          outline: none;
          letter-spacing: 1px;
        }
        .custom-input::placeholder {
          color: ${theme.darkGrayNumber};
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .uppercase-input {
          text-transform: uppercase;
        }

        .terms-link {
          font-size: 12px;
          font-weight: 500;
          color: ${theme.bodyGrayText};
          text-decoration: underline;
          transition: 0.2s;
        }
        .terms-link span:hover { color: ${theme.lightGrayHover}; }

        /* Action Button */
        .action-btn {
          background: ${theme.primaryOrange};
          border: 1px solid ${theme.primaryOrange};
          color: ${theme.pureWhite};
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          transition: 0.3s;
          cursor: pointer;
          letter-spacing: 0.5px;
        }
        .action-btn:hover:not(:disabled) {
          background: #d94b15;
          box-shadow: 0 8px 20px ${theme.orangeBorderActive};
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }

        /* Responsive Fixes */
        @media (max-width: 576px) {
          .glass-card { padding: 25px 20px; }
          .page-title { font-size: 1.5rem; }
          .custom-input { font-size: 14px; padding: 12px; }
        }
      `}</style>
    </>
  )
}

export default Referl