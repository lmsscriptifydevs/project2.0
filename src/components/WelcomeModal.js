import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const WelcomeModal = () => {
  const [showModal, setShowModal] = useState(false);

  // Theme Schema
  const T = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
    primaryOrange: "#f0591f",
    pureWhite: "#ffffff",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    mediumBorder: "rgba(255, 255, 255, 0.07)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)"
  };

  useEffect(() => {
    const checkAndShowModal = () => {
      try {
        const hasDisplayedMessage = localStorage.getItem('hasDisplayedMessage');
        if (!hasDisplayedMessage) setShowModal(true);
      } catch (e) { console.error(e); }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkAndShowModal, { timeout: 1000 });
    } else {
      setTimeout(checkAndShowModal, 100);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    try { localStorage.setItem('hasDisplayedMessage', 'true'); } catch (e) {}
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      size="md"
      className="gt-premium-modal"
    >
      <style>{`
        /* Modal Background & Border */
        .gt-premium-modal .modal-content {
          background-color: ${T.mainBg};
          border: 1px solid ${T.mediumBorder};
          border-radius: 24px;
          box-shadow: 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(240, 89, 31, 0.05);
          overflow: hidden;
          position: relative;
        }

        /* Subtle Glow Overlay */
        .gt-premium-modal .modal-content::after {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background: ${T.primaryOrange};
          filter: blur(80px);
          opacity: 0.1;
          pointer-events: none;
        }

        /* Header Area */
        .gt-premium-modal .modal-header {
          border-bottom: 1px solid ${T.mediumBorder};
          padding: 1.5rem 2rem;
          background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gt-premium-modal .modal-title {
          color: ${T.pureWhite};
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Pulsing Dot */
        .status-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 10px #22c55e;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        /* Close Button Styling */
        .gt-premium-modal .btn-close {
          filter: invert(1) brightness(2);
          opacity: 0.5;
          transition: all 0.3s;
          padding: 1rem;
        }
        .gt-premium-modal .btn-close:hover { opacity: 1; transform: rotate(90deg); }

        /* Body Area */
        .gt-premium-modal .modal-body {
          padding: 2.5rem 2rem;
        }

        .gt-premium-modal .welcome-heading {
          color: ${T.pureWhite};
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .gt-premium-modal .welcome-text {
          color: ${T.bodyGrayText};
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .gt-feature-tag {
          color: ${T.primaryOrange};
          background: rgba(240, 89, 31, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          border: 1px solid rgba(240, 89, 31, 0.2);
        }

        /* Action Button */
        .gt-action-btn {
          background: linear-gradient(135deg, ${T.primaryOrange} 0%, #d94e18 100%);
          color: white;
          border: none;
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 20px rgba(240, 89, 31, 0.2);
          position: relative;
          overflow: hidden;
        }

        .gt-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(240, 89, 31, 0.3);
          filter: brightness(1.1);
        }

        .gt-action-btn:active { transform: translateY(0); }

        /* Small Footer Text */
        .modal-footer-note {
          text-align: center;
          margin-top: 1.2rem;
          font-size: 0.75rem;
          color: ${T.mediumGrayTitle};
          opacity: 0.6;
        }
      `}</style>

      <Modal.Header closeButton>
        <Modal.Title>
          GrapeTask <span className="status-dot"></span> <span style={{ color: T.primaryOrange, marginLeft: '-4px' }}>Live</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4 className="welcome-heading">Welcome to the Future of Freelancing</h4>
        <p className="welcome-text">
          Experience our brand new <span className="gt-feature-tag">Dark Interface</span>. 
          Manage your <span className="gt-feature-tag">Gigs</span>, track 
          <span className="gt-feature-tag">Orders</span>, and stay updated with 
          real-time <span className="gt-feature-tag">Notifications</span>. 
          All login & registration issues via Google have been fixed for seamless flow.
        </p>

        <button className="gt-action-btn" onClick={handleClose}>
          Get Started
        </button>

        <div className="modal-footer-note">
          Version 2.0.4 • Optimized for Experts & Bidders
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WelcomeModal;