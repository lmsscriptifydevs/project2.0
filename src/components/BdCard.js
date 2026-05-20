import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import {
  BsClock,
  BsBarChart,
  BsPeople,
  BsGlobe2,
} from "react-icons/bs";
import Chating from "./frelancerChat/Chat/Chating";
import {
  clearConversationError,
  createOrFindConversation,
  setSelectedConversation,
} from "../redux/slices/messageSlice";

// Yahan apka logo import ho raha hai, isse path ka issue khatam ho jayega
import logoImg from "../assets/logo.png"; 
// Note: Agar component "src/components/" me hai aur image "src/assets/" me, toh path "../../assets/logo.png" ya "../assets/logo.png" hoga. Apne folder structure ke hisab se adjust kar lein.

const FALLBACK_AVATAR = "https://portal.grapetask.co/user.png";

const BdCard = memo(function BdCard({ user, showBdDetail }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatingConversation } = useSelector((state) => state.message);

  const [showChatPanel, setShowChatPanel] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  // --- API Data Mapping ---
  const fullName = `${user?.fname ?? ""} ${user?.lname ?? ""}`.trim() || "Business Developer";

  // Role override: Agar lamba role hai toh sirf "Business Developer" show kare
  let role = user?.role || "Business Developer";
  if (role.toLowerCase().includes("bidder") || role.toLowerCase().includes("middleman")) {
    role = "Business Developer";
  }

  // Bio/Summary mapping
  const summary = user?.bio || user?.professional_summary || 
    "Results-driven Business Development professional with 5+ years of experience in lead generation, partnerships, client acquisition, and revenue growth for digital and service-based businesses.";

  const responseTime = user?.response_time ?? "< 1hr";
  const dealsClosed = user?.completed_orders ?? user?.total_bids ?? 0;
  const partnerships = user?.partnerships ?? Math.floor(dealsClosed / 2) ?? 0; 

  const markets = user?.country ? [user.country] : ["MENA", "Asia", "Europe"];
  const marketsLabel = Array.isArray(markets) && markets.length > 1 
    ? markets.join(" • ") 
    : user?.country ? user.country : "MENA • Asia • Europe";

  const handleViewProfile = useCallback((e) => {
    e.stopPropagation();
    const id = user?.id ?? user?._id;
    if (id) navigate(`/profile/${id}`);
    else if (showBdDetail) showBdDetail(user);
  }, [navigate, user, showBdDetail]);

  const handleContact = useCallback(async (e) => {
    e.stopPropagation();
    const id = user?.id ?? user?._id;
    if (!id) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setIsStartingChat(true);
    dispatch(clearConversationError());

    try {
      const response = await dispatch(createOrFindConversation({ participantId: id })).unwrap();
      dispatch(setSelectedConversation(response));
      setShowChatPanel(true);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsStartingChat(false);
    }
  }, [dispatch, navigate, user]);

  const handleCardClick = useCallback((e) => {
    if (showBdDetail && !e.target.closest(".bd-card-actions")) {
      showBdDetail(user);
    }
  }, [showBdDetail, user]);

  return (
    <>
      <style>{InternalCSS}</style>

      <div
        className="bd-card-modern"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      >
        {/* --- Logo Top Right --- */}
        <div className="bd-card-logo">
          {/* Imported logo use ho raha hai */}
          <img src={logoImg} alt="GrapeTask" className="logo-img" />
        </div>

        <div className="bd-card-inner">
          {/* --- Header --- */}
          <div className="bd-card-header">
            <div className="bd-card-avatar-wrap">
              <img
                src={(user?.image && user?.image !== "null" && user?.image !== "") ? user.image : (user?.google_image || FALLBACK_AVATAR)}
                alt={fullName}
                className="bd-card-avatar"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_AVATAR;
                }}
              />
            </div>
            <div className="bd-card-title-wrap">
              <h3 className="bd-card-name" title={fullName}>{fullName}</h3>
              <p className="bd-card-role text-capitalize" title={role}>{role}</p>
            </div>
          </div>

          {/* --- Summary --- */}
          <div className="bd-card-section">
            <h4 className="bd-card-section-title">Professional Summary</h4>
            <p className="bd-card-summary" title={summary}>{summary}</p>
          </div>

          {/* --- Metrics (Perfect 2x2 Grid) --- */}
          <div className="bd-card-metrics">
            <div className="bd-card-metric" title={`Response: ${responseTime}`}>
              <BsClock className="bd-card-metric-icon" />
              <span className="metric-text">Response: <strong>{responseTime}</strong></span>
            </div>
            <div className="bd-card-metric" title={`Deals: ${dealsClosed}+`}>
              <BsBarChart className="bd-card-metric-icon" />
              <span className="metric-text">Deals: <strong>{dealsClosed}+</strong></span>
            </div>
            <div className="bd-card-metric" title={`Partners: ${partnerships}+`}>
              <BsPeople className="bd-card-metric-icon" />
              <span className="metric-text">Partners: <strong>{partnerships}+</strong></span>
            </div>
            <div className="bd-card-metric" title={`Markets: ${marketsLabel}`}>
              <BsGlobe2 className="bd-card-metric-icon" />
              <span className="metric-text">Markets: <strong>{marketsLabel}</strong></span>
            </div>
          </div>

          {/* --- Actions (Always One Row) --- */}
          <div className="bd-card-actions">
            <button type="button" className="bd-btn bd-btn-primary" onClick={handleViewProfile}>
              View Profile
            </button>
            <button 
              type="button" 
              className="bd-btn bd-btn-secondary" 
              onClick={handleContact} 
              disabled={isStartingChat || creatingConversation}
            >
              {isStartingChat ? "Opening Chat..." : "Contact for Business"}
            </button>
          </div>
        </div>
      </div>

      {/* --- Chat Side Panel --- */}
      <Offcanvas show={showChatPanel} onHide={() => setShowChatPanel(false)} placement="end" style={{ width: "450px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chat with {fullName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column">
          <div className="flex-grow-1"><Chating /></div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
});

export default BdCard;

/* ==========================================
   INTERNAL CSS FOR BD CARD
   ========================================== */
const InternalCSS = `
  .bd-card-modern {
    position: relative;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 18px; 
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .bd-card-modern:hover {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-color: rgba(240, 89, 31, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }

  .bd-card-modern:hover .bd-card-avatar {
    transform: scale(1.06);
  }

  /* Logo Image Style */
  .bd-card-logo {
    position: absolute;
    top: 16px;
    right: 18px;
    z-index: 2;
  }

  .logo-img {
    height: 20px; /* Thora sa chota kia taake neat lage */
    width: auto;
    object-fit: contain;
    opacity: 0.95;
  }

  .bd-card-inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .bd-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bd-card-avatar-wrap {
    width: 60px; /* Avatar ko thora aur compact kiya */
    height: 60px;
    border-radius: 50%;
    border: 2px solid #f0591f;
    padding: 2px;
    background: rgba(240, 89, 31, 0.1);
    flex-shrink: 0;
  }

  .bd-card-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    transition: transform 0.4s ease;
  }

  .bd-card-title-wrap {
    flex: 1;
    padding-right: 80px; /* Logo ki space chori hai */
    min-width: 0; /* Important for ellipsis to work */
  }

  /* Name Single Row Logic */
  .bd-card-name {
    font-family: 'Sora', sans-serif;
    font-size: 16px; 
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 2px 0;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Role Single Row */
  .bd-card-role {
    font-size: 12px;
    color: #a1a1aa;
    margin: 0;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bd-card-section {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 10px;
  }

  .bd-card-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: #f0591f;
    font-weight: 600;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .bd-card-summary {
    font-size: 12px;
    color: #d4d4d8;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 2 lines tak mehdood */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* --- 2x2 Grid setup for Metrics --- */
  .bd-card-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Exactly 2 columns barabar */
    gap: 8px;
    margin-top: 2px;
  }

  .bd-card-metric {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(240, 89, 31, 0.06); 
    border: 1px solid rgba(240, 89, 31, 0.15); 
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 11px; /* Font chota takay fit ho */
    color: #d4d4d8;
    white-space: nowrap;
    overflow: hidden; /* Dabbay se bahar nahi jayega */
  }

  .bd-card-metric-icon {
    color: #f0591f;
    font-size: 12px;
    flex-shrink: 0;
  }

  .metric-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bd-card-metric strong {
    color: #ffffff;
    font-weight: 600;
  }

  /* --- Actions (Buttons in One Row) --- */
  .bd-card-actions {
    display: flex;
    flex-direction: row; 
    gap: 8px;
    margin-top: 6px;
  }

  .bd-btn {
    flex: 1;
    padding: 8px 10px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap; 
  }

  .bd-btn-primary {
    background: #f0591f;
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 12px rgba(240, 89, 31, 0.2);
  }

  .bd-btn-primary:hover {
    background: #d84f1b;
    box-shadow: 0 6px 16px rgba(240, 89, 31, 0.4);
    transform: translateY(-2px);
  }

  .bd-btn-secondary {
    background: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .bd-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #f0591f;
    color: #f0591f;
    transform: translateY(-2px);
  }

  /* --- Mobile Responsive Rules --- */
  @media (max-width: 576px) {
    .bd-card-modern {
      padding: 14px;
    }
    .bd-card-header {
      align-items: flex-start;
      gap: 10px;
    }
    .bd-card-logo {
      top: 12px;
      right: 12px;
    }
    .bd-card-metrics {
      grid-template-columns: 1fr 1fr; /* Mobile par bhi 2 column rahega! */
    }
    .bd-btn {
      padding: 8px 6px; 
      font-size: 11px;
    }
  }
`;