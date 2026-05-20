import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../OptimizedImage";

// Assets
import quality from "../../assets/quality.webp";
import cost from "../../assets/Cost.webp";
import Secure from "../../assets/Secure.webp";
import UserCheck from "../../assets/UserCheck.webp";
import client from "../../assets/client.webp";

// Icons
import { RiDoubleQuotesR, RiVerifiedBadgeFill, RiShieldCheckLine } from "react-icons/ri";

const TrustSection = () => {
  const navigate = useNavigate();

  const trustItems = [
    { 
      id: "01",
      icon: quality, 
      title: "Verified Professionals", 
      text: "Review expert portfolios, client feedback, and credentials before hiring." 
    },
    { 
      id: "02",
      icon: cost, 
      title: "No start-up costs", 
      text: "Post your job, interview candidates, and only pay when you're satisfied." 
    },
    { 
      id: "03",
      icon: Secure, 
      title: "Secure Transactions", 
      text: "We protect your payments and data with trusted security measures." 
    },
    { 
      id: "04",
      icon: UserCheck, 
      title: "Hassle-Free Hiring", 
      text: "A simple, intuitive platform designed for smooth collaboration." 
    },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>
        {`
          .gt-trust-wrap {
            background-color: #020617; /* mainBg */
            padding: 80px 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }

          .gt-container { max-width: 1300px; margin: 0 auto; padding: 0 25px; }

          /* 🚀 MAIN LAYOUT GRID */
          .gt-main-layout {
            display: grid;
            grid-template-columns: 1.8fr 1.2fr;
            gap: 25px;
            align-items: center;
          }

          /* 🚀 LEFT GRID (Numbered Boxes) */
          .gt-numbered-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .gt-trust-card {
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            border-radius: 20px;
            padding: 25px;
            position: relative;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          .gt-trust-card:hover { 
            transform: translateY(-5px); 
            background: rgba(255, 255, 255, 0.04); /* cardBgActive */
            border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
            box-shadow: 0 15px 35px rgba(240, 89, 31, 0.08);
          }

          .gt-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .gt-num-label {
            background: #f0591f; /* primaryOrange */
            color: #fff;
            font-size: 0.75rem;
            font-weight: 800;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(240, 89, 31, 0.3);
          }

          .gt-trust-card h4 { 
            font-size: 1.1rem; 
            font-weight: 800; 
            color: #ffffff; /* pureWhite */
            margin: 10px 0;
          }
          .gt-trust-card p { 
            font-size: 0.85rem; 
            color: #71717a; /* bodyGrayText */
            line-height: 1.5; 
            margin: 0;
          }

          /* 🚀 RIGHT HIGHLIGHT CARD */
          .gt-hero-navy-card {
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            border-radius: 24px;
            padding: 45px 35px;
            color: #ffffff; /* pureWhite */
            position: relative;
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .gt-hero-navy-card::after {
            content: ""; position: absolute; top: -50px; right: -50px;
            width: 150px; height: 150px;
            background: rgba(240, 89, 31, 0.1); /* primaryOrange glow */
            border-radius: 50%;
          }

          .gt-hero-navy-card h2 { 
            font-size: 2.2rem; 
            font-weight: 800; 
            line-height: 1.1; 
            margin-bottom: 20px;
            color: #ffffff; /* pureWhite */
          }
          .gt-hero-navy-card h2 span { color: #f0591f; /* primaryOrange */ }
          .gt-hero-navy-card p { 
            font-size: 1rem; 
            color: #71717a; /* bodyGrayText */
            line-height: 1.7; 
            margin-bottom: 30px;
          }

          .gt-action-btn {
            border: 2px solid #f0591f; /* primaryOrange */
            background: #f0591f;
            color: #ffffff;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            width: fit-content;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(240, 89, 31, 0.3);
            pointer-events: auto;
            z-index: 10;
            position: relative;
            outline: none;
            border: none;
            outline: 2px solid transparent;
            outline-offset: 2px;
          }
          .gt-action-btn:hover { 
            background: transparent; 
            color: #f0591f;
            box-shadow: 0 6px 20px rgba(240, 89, 31, 0.5);
            transform: translateY(-2px);
          }
          .gt-action-btn:active {
            transform: translateY(0);
          }
          .gt-action-btn:focus {
            outline: 2px solid #f0591f;
            outline-offset: 2px;
          }

          /* 📱 RESPONSIVE */
          @media (max-width: 1024px) {
            .gt-main-layout { grid-template-columns: 1fr; }
            .gt-hero-navy-card { order: -1; min-height: auto; padding: 40px; }
          }
          @media (max-width: 640px) {
            .gt-numbered-grid { grid-template-columns: 1fr; }
            .gt-hero-navy-card h2 { font-size: 1.8rem; }
          }
        `}
      </style>

      <section className="gt-trust-wrap">
        <div className="gt-container">

          <div className="gt-main-layout">

            {/* Left side: Numbered Trust Grid */}
            <div className="gt-numbered-grid">
              {trustItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="gt-trust-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="gt-card-top">
                    <OptimizedImage src={item.icon} width={35} height={40} alt="icon" />
                    <span className="gt-num-label">{item.id}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Right side: Branding Content */}
            <motion.div 
              className="gt-hero-navy-card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <RiDoubleQuotesR size={40} color="#f0591f" style={{ marginBottom: '20px', opacity: 0.5 }} />

              <h2>Why Businesses <br /> <span>Trust GrapeTask</span></h2>

              <p>
                We bridge the gap between world-class talent and mission-critical projects. 
                With zero upfront costs and 100% secure escrow transactions, 
                your success is guaranteed.
              </p>

              <button 
                className="gt-action-btn" 
                onClick={() => navigate('/login')}
                type="button"
              >
                Hire Top Talent
              </button>
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <RiVerifiedBadgeFill color="#f0591f" size={24} />
                <RiShieldCheckLine color="#f0591f" size={24} />
              </div>
            </motion.div>

          </div>

          {/* Footer visual with Client Image */}
          <motion.div 
            className="text-center mt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{ opacity: 0.8 }}
          >
           
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a', letterSpacing: '2px', marginTop: '10px' }}>
              TRUSTED BY 12,000+ ENTERPRISES NATIONWIDE
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default TrustSection;