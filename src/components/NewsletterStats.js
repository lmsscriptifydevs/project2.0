import { useState } from "react";
import { 
  FaUser, FaEnvelope, FaPen, FaCheckCircle, 
  FaRocket, FaGlobe, FaSmile, FaPaperPlane, FaShieldAlt 
} from "react-icons/fa";

const NewsletterStats = () => {
  const [formData, setFormData] = useState({ name: "", email: "", details: "" });

  const stats = [
    { label: "Active Freelancers", value: "10K+", icon: <FaUser />, color: "#f0591f" },
    { label: "Projects Done", value: "300+", icon: <FaRocket />, color: "#f0591f" },
    { label: "Pakistan's #1", value: "Top", icon: <FaGlobe />, color: "#f0591f" },
    { label: "Satisfaction", value: "95%", icon: <FaSmile />, color: "#f0591f" },
  ];

  return (
    <section className="ultra-modern-cta">
      {/* Background Mesh Glows */}
      <div className="mesh-gradient-orange"></div>
      <div className="mesh-gradient-blue"></div>

      <div className="cta-content-wrapper">

        {/* LEFT SIDE: Brand Story & Stats */}
        <div className="cta-left">
          <div className="modern-badge">
            <span className="dot"></span> 
            Work with the best
          </div>
          <h2 className="main-heading">
            Stay Updated with the <br />
            <span>Latest Opportunities</span>
          </h2>
          <p className="description">
            Get the newest job postings and career tips delivered to your inbox. 
            Join the elite community of global talent.
          </p>

          <div className="bento-stats">
            {stats.map((stat, index) => (
              <div key={index} className="bento-card">
                <div className="bento-icon">{stat.icon}</div>
                <div className="bento-info">
                  <span className="bento-val">{stat.value}</span>
                  <span className="bento-lab">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Support & Newsletter Form */}
        <div className="cta-right">
          <div className="glass-form-container">
            <div className="form-head">
              <h3>Need Assistance?</h3>
              <p>Any issue or problem? Enter details, our team will contact you.</p>
            </div>

            <form className="interactive-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Full Name" required />
                <FaUser className="field-icon" />
              </div>

              <div className="form-group">
                <input type="email" placeholder="Email Address" required />
                <FaEnvelope className="field-icon" />
              </div>

              <div className="form-group">
                <textarea placeholder="How can we help you?" rows="3" required></textarea>
                <FaPen className="field-icon" style={{ top: '15px' }} />
              </div>

              <button type="submit" className="mega-btn">
                <span>Send Message</span>
                <FaPaperPlane className="plane-icon" />
              </button>
            </form>

            <div className="trust-note">
              <FaShieldAlt size={14} color="#52525b" /> 
              <span>Your data is secure with GrapeTask</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .ultra-modern-cta {
          background: #020617; /* mainBg */
          padding: 100px 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #ffffff; /* pureWhite */
          position: relative;
          overflow: hidden;
        }

        /* Mesh Backgrounds based on schema */
        .mesh-gradient-orange {
          position: absolute;
          width: 500px; height: 500px;
          top: -10%; left: -10%;
          background: radial-gradient(circle, rgba(240, 89, 31, 0.08) 0%, transparent 60%);
          filter: blur(60px);
          pointer-events: none;
        }
        .mesh-gradient-blue {
          position: absolute;
          width: 500px; height: 500px;
          bottom: -10%; right: -10%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%);
          filter: blur(80px);
          pointer-events: none;
        }

        .cta-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 60px;
          position: relative;
          z-index: 5;
        }

        /* Left Side */
        .cta-left { flex: 1.2; }

        .modern-badge {
          background: rgba(240, 89, 31, 0.05); /* very light orange bg */
          border: 1px solid rgba(240, 89, 31, 0.3); /* orangeBorderActive */
          color: #f0591f; /* primaryOrange */
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-bottom: 24px;
        }

        .dot { width: 6px; height: 6px; background: #f0591f; border-radius: 50%; box-shadow: 0 0 8px #f0591f; }

        .main-heading {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 20px;
          color: #ffffff; /* pureWhite */
        }

        .main-heading span {
          color: #f0591f; /* primaryOrange */
        }

        .description {
          color: #71717a; /* bodyGrayText */
          font-size: 1.05rem;
          margin-bottom: 40px;
          line-height: 1.7;
          max-width: 500px;
        }

        /* Bento Stats */
        .bento-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .bento-card {
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          padding: 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
        }

        .bento-card:hover {
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .bento-icon { 
          font-size: 1.4rem; 
          color: #f0591f; 
          background: rgba(240, 89, 31, 0.1); 
          width: 45px; height: 45px; 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 12px;
        }
        .bento-val { display: block; font-size: 1.4rem; font-weight: 800; color: #ffffff; }
        .bento-lab { font-size: 0.8rem; color: #a1a1aa; /* mediumGrayTitle */ font-weight: 600; }

        /* Right Side Form */
        .cta-right { flex: 0.8; }

        .glass-form-container {
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          transition: 0.3s ease;
        }
        .glass-form-container:hover {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .form-head h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: #ffffff; }
        .form-head p { font-size: 0.9rem; color: #71717a; /* bodyGrayText */ margin-bottom: 30px; line-height: 1.6; }

        .form-group { position: relative; margin-bottom: 16px; }

        .form-group input, .form-group textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          padding: 14px 16px 14px 45px;
          border-radius: 14px;
          color: #ffffff; /* pureWhite */
          font-family: inherit;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder, .form-group textarea::placeholder {
          color: #52525b; /* darkGrayNumber */
        }

        .field-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          color: #52525b; /* darkGrayNumber */
          font-size: 0.9rem;
          transition: 0.3s ease;
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          box-shadow: 0 0 15px rgba(240, 89, 31, 0.1);
        }

        .form-group input:focus + .field-icon, 
        .form-group textarea:focus + .field-icon {
          color: #f0591f; /* primaryOrange */
        }

        .mega-btn {
          width: 100%;
          background: #f0591f; /* primaryOrange */
          color: #ffffff; /* pureWhite */
          padding: 16px;
          border-radius: 14px;
          border: none;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .mega-btn:hover {
          background: #d94a15;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240, 89, 31, 0.3);
        }

        .plane-icon { transition: 0.3s; }
        .mega-btn:hover .plane-icon { transform: translate(4px, -4px); }

        .trust-note {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #71717a; /* bodyGrayText */
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .cta-content-wrapper { flex-direction: column; text-align: center; }
          .modern-badge { margin: 0 auto 20px; }
          .description { margin: 0 auto 40px; }
          .bento-stats { max-width: 600px; margin: 0 auto; }
          .cta-right { width: 100%; max-width: 600px; }
        }

        @media (max-width: 600px) {
          .bento-stats { grid-template-columns: 1fr; }
          .glass-form-container { padding: 25px; }
        }
      `}</style>
    </section>
  );
};

export default NewsletterStats;