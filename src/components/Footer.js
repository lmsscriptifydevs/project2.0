import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaChevronDown, FaWhatsapp, FaFacebookF, FaInstagram, 
  FaYoutube, FaPaperPlane, FaCircle, FaUser, FaEnvelope, 
  FaPen, FaCheckCircle, FaRocket, FaGlobe, FaSmile 
} from "react-icons/fa";
import logo from "../assets/logo.png";

const FOOTER_SECTIONS = [
  { title: "For Clients", links: [
    { path: "/how-to-hire", label: "How to Hire" },
    { path: "/how-client-hire-bd", label: "How Client Hire BD" },
    { path: "/client-benefits", label: "Client Benefits" },
    { path: "/talent-marketplace", label: "Talent Marketplace" },
  ]},
  { title: "For Talents", links: [
    { path: "/how-to-find-work", label: "How to Find Work" },
    { path: "/freelancer-benefits", label: "Freelancer Benefits" },
    { path: "/business-developer-role", label: "Business Developer Role" },
    { path: "/success-stories", label: "Success Stories" },
    { path: "/careers", label: "Careers" },
  ]},
  { title: "Resources", links: [
    { path: "/withdrawal-policy", label: "Withdrawal Policy" },
    { path: "/help-support", label: "Help & Support" },
    { path: "/community", label: "Community" },
    { path: "/affiliate-program", label: "Affiliate Program" },
  ]},
  { title: "Company", links: [
    { path: "/how-grapetask-works", label: "How GrapeTask Works" },
    { path: "/about-us", label: "About Us" },
    { path: "/press", label: "Press" },
    { path: "/contact-us", label: "Contact Us" },
    { path: "/trust-safety", label: "Trust & Safety" },
  ]},
];

const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, url: "https://www.facebook.com/share/18V1wjqG5s/" },
  { icon: <FaInstagram />, url: "https://www.instagram.com/grapetask?igsh=MW80Y3p6Zmx2bWJqZA==" },
  { icon: <FaYoutube />, url: "https://youtube.com/@grapetask?si=WytRJ-eMiSwuPefk" },
  { icon: <FaWhatsapp />, url: "https://wa.me/+923411228760" },
];

const Footer = () => {
  const [openSections, setOpenSections] = useState({});
  const [formData, setFormData] = useState({ name: "Grapetask", email: "grapetak786@gmail.com", details: "Grapetask Pakistan Frist Freelancers Platfrom" });

  const toggleSection = (title) => {
    if (window.innerWidth <= 768) {
      setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    }
  };



  return (
    <footer className="footer-wrapper-main">


      {/* 2. MAIN FOOTER LINKS SECTION */}
      <div className="compact-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="brand-info">
              <Link to="/" className="footer-logo">
                <img src={logo} alt="GrapeTask" style={{ height: '35px' }} />
              </Link>
              <p className="footer-tagline">
                Connecting talent with opportunity worldwide. Find your next project or hire the perfect freelancer.
              </p>
              
            </div>

            <div className="footer-column contact-col-top">
              <h5>Connect With Us</h5>
              <div className="social-grid">
                {SOCIAL_LINKS.map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noreferrer" className="social-btn">
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="support-text">grapetak786@gmail.com</p>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-main-grid">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className={`footer-column ${openSections[section.title] ? 'is-active' : ''}`}>
                <h5 onClick={() => toggleSection(section.title)}>
                  {section.title}
                  <FaChevronDown className="mobile-chevron" />
                </h5>
                <ul className="footer-link-list">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} GrapeTask® Global. All rights reserved.</p>
            <div className="bottom-links">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper-main {
          background-color: #020617;
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Stats Section */
        .cta-section {
          padding: 60px 0 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .cta-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .section-title { font-size: 2rem; font-weight: 800; margin-bottom: 25px; }
        .section-title span { color: #f0591f; }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon { color: #f0591f; font-size: 1.2rem; }
        .stat-info h3 { font-size: 1.4rem; margin: 0; font-weight: 700; }
        .stat-info p { color: #94a3b8; margin: 0; font-size: 0.8rem; }

        /* Form Styling */
        .glass-form-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 25px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .glass-form-card h3 { margin-bottom: 20px; font-size: 1.2rem; }
        .actual-form { display: flex; flex-direction: column; gap: 12px; }

        .input-group { position: relative; }
        .input-icon { position: absolute; left: 12px; top: 14px; color: #64748b; font-size: 0.8rem; }

        .input-group input, .input-group textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 12px 10px 35px;
          border-radius: 8px;
          color: white;
          outline: none;
          font-size: 0.85rem;
        }

        .submit-btn {
          background: #f0591f;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.3s;
        }

        /* Footer Main */
        .compact-footer { padding: 40px 0 20px; }
        .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .footer-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .footer-tagline { color: #94a3b8; font-size: 0.85rem; margin: 10px 0; max-width: 350px; }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.05);
          color: #4ade80;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .pulse-icon { font-size: 6px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .footer-divider { height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 30px; }
        .footer-main-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }

        .footer-column h5 { font-size: 0.85rem; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; }
        .footer-link-list { list-style: none; padding: 0; }
        .footer-link-list li { margin-bottom: 8px; }
        .footer-link-list a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; transition: 0.2s; }
        .footer-link-list a:hover { color: #f0591f; padding-left: 5px; }

        .social-grid { display: flex; gap: 10px; margin-bottom: 10px; }
        .social-btn {
          width: 32px; height: 32px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08); display: flex;
          align-items: center; justify-content: center; border-radius: 6px;
          color: #94a3b8; transition: 0.3s;
        }
        .social-btn:hover { background: #f0591f; color: white; transform: translateY(-3px); }
        .support-text { font-size: 0.8rem; color: #fff; }

        .footer-bottom {
          display: flex; justify-content: space-between; padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05); color: #64748b; font-size: 0.8rem;
        }
        .bottom-links { display: flex; gap: 20px; }
        .bottom-links a { color: #64748b; text-decoration: none; }

        .mobile-chevron { display: none; }

        @media (max-width: 992px) {
          .cta-container { grid-template-columns: 1fr; gap: 30px; text-align: center; }
          .stats-grid { max-width: 500px; margin: 0 auto; }
          .footer-main-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .footer-top { flex-direction: column; align-items: center; text-align: center; }
          .footer-main-grid { grid-template-columns: 1fr; gap: 0; }
          .footer-column { border-bottom: 1px solid rgba(255,255,255,0.05); }
          .footer-column h5 { padding: 15px 0; margin: 0; display: flex; justify-content: space-between; }
          .mobile-chevron { display: block; }
          .footer-link-list { max-height: 0; overflow: hidden; opacity: 0; transition: 0.3s; }
          .footer-column.is-active .footer-link-list { max-height: 300px; padding-bottom: 15px; opacity: 1; }
          .footer-bottom { flex-direction: column; gap: 15px; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;