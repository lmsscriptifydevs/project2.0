import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
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

const Thanks = () => {
  return (
    <>
      <Navbar FirstNav='none' />
      <div className="thanks-wrapper poppins">
        <div className="container py-5">
          <div className="row justify-content-center text-center slide-up">
            
            {/* Header Section */}
            <div className="col-12 mb-4">
              <div className="icon-glow mx-auto mb-3">
                <FaCheckCircle size={45} color={theme.primaryOrange} />
              </div>
              <h3 className="page-title mt-2">
                Thanks for <span className="highlight-text">Sharing!</span>
              </h3>
            </div>

            {/* Main Glassmorphism Card */}
            <div className="col-lg-5 col-md-7 col-11">
              <div className="glass-card">
                
                <h6 className="description-text mb-4">
                  Thanks for referring a friend. Remind your friends to check their emails and join the network to claim their rewards!
                </h6>

                {/* Action Button */}
                <Link to='/entercode' className="text-decoration-none">
                  <button type='button' className="action-btn w-100">
                    Refer More Friends
                  </button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- REFINED PURE CSS DESIGN FOR DARK THEME --- */}
      <style>{`
        .poppins { font-family: 'Poppins', sans-serif; }
        
        .thanks-wrapper { 
          background-color: ${theme.mainBg}; 
          min-height: 100vh; 
          color: ${theme.pureWhite}; 
          display: flex;
          align-items: center;
        }

        .icon-glow {
          background: ${theme.orangeBorderActive};
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid ${theme.primaryOrange};
          box-shadow: 0 0 20px ${theme.orangeBorderActive};
        }

        .page-title { 
          font-weight: 700; 
          font-size: 2rem; 
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
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          color: ${theme.lightGrayHover};
          margin-bottom: 0;
        }

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
        .action-btn:hover {
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
          .page-title { font-size: 1.6rem; }
          .icon-glow { width: 60px; height: 60px; }
        }
      `}</style>
    </>
  )
}

export default Thanks