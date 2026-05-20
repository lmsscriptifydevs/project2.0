import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Globe } from "lucide-react"; 
import OptimizedImage from "../OptimizedImage"; 

import goodcmpny from "../../assets/banner123.png";
import profile1 from "../../assets/profile1.png"; 
import profile2 from "../../assets/profile2.png";

const HowGoodCompanies = ({ handleLearnMore }) => {
  const featureData = [
    { icon: <Users size={20} />, title: "Vetted Talent", text: "Connect with top-tier freelance experts ready to scale projects." },
    { icon: <ShieldCheck size={20} />, title: "Escrow Protection", text: "Payments are safe. Funds released only on 100% satisfaction." },
    { icon: <Globe size={20} />, title: "Global Reach", text: "A reliable marketplace to find experts from around the world." },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>
        {`
          .premium-modern-section {
            background-color: #020617; /* mainBg */
            padding: clamp(40px, 8vw, 80px) 0;
            font-family: 'Inter', sans-serif;
            color: #ffffff; /* pureWhite */
            overflow: hidden;
            position: relative;
          }

          .visual-box-modern { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; max-width: 500px; margin: 0 auto; }

          .orange-mesh-gradient {
            position: absolute;
            width: 85%;
            padding-bottom: 85%;
            background: linear-gradient(135deg, #f0591f 0%, #ff8c5a 100%);
            border-radius: 50%;
            z-index: 1;
            filter: drop-shadow(0 0 30px rgba(240, 89, 31, 0.3));
          }

          .main-hero-banner { width: 100%; height: auto; z-index: 2; position: relative; }

          .glass-profile-card {
            position: absolute;
            z-index: 10;
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            border-radius: clamp(12px, 2vw, 18px);
            padding: clamp(8px, 1.5vw, 15px);
            width: clamp(110px, 25vw, 155px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            text-align: center;
            transition: all 0.3s ease;
          }

          .glass-profile-card:hover {
            background: rgba(255, 255, 255, 0.04); /* cardBgActive */
            border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          }

          .up-left { top: 5%; left: -8%; }
          .down-right { bottom: 5%; right: -8%; }

          .profile-img-wrap { width: clamp(35px, 5vw, 50px); height: clamp(35px, 5vw, 50px); border-radius: 50%; margin: 0 auto clamp(5px, 1vw, 10px); border: 2px solid #f0591f; overflow: hidden; }

          .card-name { font-size: clamp(0.7rem, 1.5vw, 0.9rem); font-weight: 800; margin:0; color: #ffffff; /* pureWhite */ }
          .card-role { font-size: clamp(0.55rem, 1.2vw, 0.65rem); color: #71717a; /* bodyGrayText */ margin-bottom: 5px; }

          .mini-hire-btn { background: #f0591f; color: #ffffff; font-size: clamp(0.55rem, 1.2vw, 0.7rem); font-weight: 800; padding: 4px 0; border-radius: 8px; width: 100%; display: block; text-decoration: none; }

          .text-content-wrap { padding-left: clamp(0px, 5vw, 40px); }

          .modern-tag { color: #f0591f; font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }

          .modern-h2 { font-size: clamp(1.8rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.1; margin-bottom: clamp(20px, 4vw, 35px); letter-spacing: -0.03em; color: #ffffff; }

          .sleek-feature-box { display: flex; align-items: center; padding: clamp(10px, 2vw, 15px) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */ }

          .modern-icon-container { width: clamp(35px, 5vw, 45px); height: clamp(35px, 5vw, 45px); background: rgba(240, 89, 31, 0.1); color: #f0591f; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }

          .f-title-bold { font-size: clamp(0.95rem, 2vw, 1.15rem); font-weight: 700; margin: 0; color: #ffffff; /* pureWhite */ }
          .f-desc-muted { font-size: clamp(0.75rem, 1.5vw, 0.9rem); color: #71717a; /* bodyGrayText */ margin: 0; }

          .btn-modern-cta { background: #f0591f; color: #ffffff; padding: 14px 40px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; margin-top: 30px; border: none; cursor: pointer; transition: 0.3s; }
          .btn-modern-cta:hover { background: #d94a15; }

          @media (max-width: 991px) {
            .visual-box-modern { margin-bottom: 50px; max-width: 320px; }
            .text-content-wrap { text-align: center; padding-left: 0; }
            .sleek-feature-box { text-align: left; }
            .up-left { left: -10%; top: 5%; }
            .down-right { right: -10%; bottom: 5%; }
            .btn-modern-cta { width: 100%; }
          }
        `}
      </style>

      <section className="premium-modern-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="visual-box-modern">
                <div className="orange-mesh-gradient"></div>
                <img src={goodcmpny} className="main-hero-banner" alt="Professional Banner" />

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="glass-profile-card up-left">
                  <div className="profile-img-wrap">
                     <img src={profile1} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Ali" />
                  </div>
                  <h5 className="card-name">Muhamad Ali</h5>
                  <p className="card-role">Full-Stack Dev</p>
                  <span className="mini-hire-btn">Hire Me</span>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="glass-profile-card down-right">
                  <div className="profile-img-wrap">
                     <img src={profile2} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Hassan" />
                  </div>
                  <h5 className="card-name">Ali Hassan</h5>
                  <p className="card-role">Back-End Dev</p>
                  <span className="mini-hire-btn">Hire Me</span>
                </motion.div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="text-content-wrap">
                <p className="modern-tag">Expert Freelance Network</p>
                <h2 className="modern-h2">Success Happens <br /><span style={{color: '#f0591f'}}>When The Right People Connect</span></h2>

                <div className="feature-stack">
                  {featureData.map((item, index) => (
                    <div key={index} className="sleek-feature-box">
                      <div className="modern-icon-container">{item.icon}</div>
                      <div className="feature-info">
                        <h4 className="f-title-bold">{item.title}</h4>
                        <p className="f-desc-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleLearnMore} className="btn-modern-cta">Learn more about us</button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HowGoodCompanies;