import React from "react";
import { motion } from "framer-motion";
import { 
  RiCodeSSlashLine, RiFolderSettingsFill, RiUserSearchFill, 
  RiShieldCheckFill, RiEyeFill, RiArrowRightSLine, 
  RiArrowLeftSLine, RiShieldUserLine 
} from "react-icons/ri";

const NeuralEcosystem = () => {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />

      <style>
        {`
          .gt-neural-wrapper {
            background-color: #020617; /* mainBg */
            padding: 100px 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #ffffff; /* pureWhite */
            position: relative;
            overflow: hidden;
          }

          .gt-container { max-width: 1300px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 10; }

          /* 🚀 ELITE HEADER & MONITORING */
          .gt-top-meta { text-align: center; margin-bottom: 80px; }
          .gt-top-meta h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.06em; margin-bottom: 15px; }
          .gt-top-meta h2 span { color: #f0591f; /* primaryOrange */ }
          .gt-tagline { color: #71717a; /* bodyGrayText */ text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; font-weight: 700; margin-bottom: 25px; }

          .gt-security-banner {
            display: inline-flex; align-items: center; gap: 10px;
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            padding: 10px 25px; border-radius: 50px;
            color: #71717a; /* bodyGrayText */ font-size: 0.85rem; font-weight: 600;
          }
          .eye-blink { animation: blink 2s infinite; color: #f0591f; /* primaryOrange */ }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

          /* 🚀 NEURAL GRID */
          .gt-neural-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            position: relative;
            z-index: 5;
          }

          /* 🚀 NODE CARDS */
          .gt-node-card {
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            border-radius: 20px;
            padding: 40px 25px;
            text-align: center;
            position: relative;
            backdrop-filter: blur(15px);
            transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .gt-node-card:hover { 
            border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
            transform: translateY(-10px); 
            background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          }

          .gt-vetted-badge {
            position: absolute; top: 15px; right: 15px;
            background: rgba(46, 213, 115, 0.1); color: #2ed573;
            padding: 4px 12px; border-radius: 50px; font-size: 0.65rem; font-weight: 800;
            border: 1px solid rgba(46, 213, 115, 0.2);
          }

          .gt-node-icon {
            width: 65px; height: 65px;
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border-radius: 15px;
            display: flex; align-items: center; justify-content: center;
            font-size: 2rem; color: #f0591f; margin: 0 auto 25px;
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          }

          .gt-node-card h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 10px; color: #ffffff; }
          .gt-node-card p { font-size: 0.85rem; color: #71717a; /* bodyGrayText */ line-height: 1.6; }

          /* 🚀 CURVED SVG CONNECTORS */
          .gt-connector-layer {
            position: absolute; top: 40%; left: 0; width: 100%; height: 150px;
            pointer-events: none; z-index: 1;
          }

          .neural-path {
            stroke-dasharray: 10, 15;
            animation: flow 3s linear infinite;
          }
          @keyframes flow { from { stroke-dashoffset: 25; } to { stroke-dashoffset: 0; } }

          /* 🚀 PAGINATION SYSTEM */
          .gt-footer-pag {
            display: flex; justify-content: center; align-items: center;
            gap: 10px; margin-top: 60px;
          }
          .gt-pag-dot {
            width: 35px; height: 35px; border-radius: 8px;
            background: rgba(255, 255, 255, 0.02); /* cardBg */ 
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.3s;
          }
          .gt-pag-dot.active { background: #f0591f; border-color: #f0591f; color: #fff; }
          .gt-pag-arrow { color: #f0591f; opacity: 0.5; }

          @media (max-width: 1024px) {
            .gt-neural-grid { grid-template-columns: repeat(2, 1fr); gap: 30px; }
            .gt-connector-layer { display: none; }
          }
          @media (max-width: 600px) {
            .gt-neural-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>

      <section className="gt-neural-wrapper">
        <div className="gt-container">
          <div className="gt-top-meta" style={{ textAlign: "center", paddingBottom: "2rem" }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                color: "#ffffff",
                fontWeight: 800,
                lineHeight: 1.4,
                margin: 0,
                fontSize: "clamp(1.4rem, 4vw, 2.8rem)", 
              }}
            >
              Curated World-Class Talent 
              <br /> 
              Meets <span style={{ color: "#f0591f" }}>Visionary Leadership</span>
            </motion.h2>
          </div>

          <div className="gt-neural-grid">

            {/* NODE 1 */}
            <motion.div className="gt-node-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="gt-vetted-badge">VETTED</div>
              <div className="gt-node-icon"><RiCodeSSlashLine /></div>
              <h3>Vetted Excellence</h3>
              <p>Technical powerhouse delivering top-tier project results.</p>
            </motion.div>

            {/* NODE 2 */}
            <motion.div className="gt-node-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="gt-node-icon"><RiFolderSettingsFill /></div>
              <h3>Hub of Opportunity</h3>
              <p>Strategic deal closing and quality assurance management.</p>
            </motion.div>

            {/* NODE 3 */}
            <motion.div className="gt-node-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="gt-node-icon"><RiShieldUserLine /></div>
              <h3>Built on Integrity</h3>
              <p>Uncompromising infrastructure and total peace of mind.</p>
            </motion.div>

            {/* NODE 4 */}
            <motion.div className="gt-node-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <div className="gt-node-icon"><RiShieldCheckFill /></div>
              <h3>GrapeTask</h3>
              <p>Escrow security, dispute resolution, and infrastructure.</p>
            </motion.div>

          </div>

          {/* 🚀 ANIMATED NEURAL CONNECTORS (Desktop) */}
          <svg className="gt-connector-layer" viewBox="0 0 1200 150">
            {/* Curve 1 to 2 */}
            <path d="M280 60 C 350 10, 350 110, 420 60" stroke="rgba(240,89,31,0.1)" strokeWidth="2" fill="none" />
            <path className="neural-path" d="M280 60 C 350 10, 350 110, 420 60" stroke="#f0591f" strokeWidth="2" fill="none" />

            {/* Curve 2 to 3 */}
            <path d="M580 60 C 650 110, 650 10, 720 60" stroke="rgba(240,89,31,0.1)" strokeWidth="2" fill="none" />
            <path className="neural-path" d="M580 60 C 650 110, 650 10, 720 60" stroke="#f0591f" strokeWidth="2" fill="none" />

            {/* Curve 3 to 4 */}
            <path d="M880 60 C 950 10, 950 110, 1020 60" stroke="rgba(240,89,31,0.1)" strokeWidth="2" fill="none" />
            <path className="neural-path" d="M880 60 C 950 10, 950 110, 1020 60" stroke="#f0591f" strokeWidth="2" fill="none" />
          </svg>

        </div>
      </section>
    </>
  );
};

export default NeuralEcosystem;