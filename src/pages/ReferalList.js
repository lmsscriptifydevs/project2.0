import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import {
  FaNetworkWired, FaCopy, FaCheckCircle, FaUsers, 
  FaTrophy, FaWhatsapp, FaTelegram, FaTimes, 
  FaQrcode, FaLink, FaExclamationTriangle
} from "react-icons/fa";
import QRCode from "react-qr-code";
import Navbar from "../components/Navbar";

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

const ModernReferralList = () => {
  const { userDetail } = useSelector((state) => state.profile);
  const [referrals, setReferrals] = useState([]);
  const [summary, setSummary] = useState({
    total_referrals: 0,
    total_bids_earned: 0,
    referral_code: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const referralLink = useMemo(() => {
    const code = summary?.referral_code || userDetail?.referral_code || "";
    return code ? `https://grapetask.co/signup?referral=${code}` : "Loading link...";
  }, [summary?.referral_code, userDetail?.referral_code]);

  const fetchReferralHistory = async (page = 1) => {
    setLoading(true);
    setError(null); 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://portal.grapetask.co/api/user/referrals?page=${page}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.status) {
        setReferrals(response.data.data.data || []);
        setSummary(response.data.summary || { total_referrals: 0, total_bids_earned: 0, referral_code: "" });
        setTotalPages(response.data.data.last_page || 1);
        setCurrentPage(response.data.data.current_page || 1);
      } else {
        setError("Failed to load data. Please try again.");
      }
    } catch (err) {
      setError("Network error. Unable to fetch your referral data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReferralHistory(currentPage); }, [currentPage]);

  useEffect(() => {
    if (showShareModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [showShareModal]);

  const handleCopy = () => {
    if (!referralLink || referralLink.includes("Loading")) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WARNING FIX: Error State Handle (Updated to Dark Theme)
  if (error) {
    return (
      <div className="vh-100 d-flex flex-column poppins" style={{ backgroundColor: theme.mainBg }}>
        <Navbar FirstNav="none" />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center p-3">
          <div className="text-center p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, maxWidth: '400px' }}>
            <FaExclamationTriangle size={40} color="#ef4444" className="mb-3" />
            <h5 className="fw-bold mb-2" style={{ color: theme.pureWhite }}>Oops! Something went wrong</h5>
            <p className="small mb-4" style={{ color: theme.bodyGrayText }}>{error}</p>
            <button className="btn w-100 rounded-pill py-2" style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite }} onClick={() => fetchReferralHistory(1)}>
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page poppins">
      <Navbar FirstNav="none" />

      <div className="container-xl py-4">
        {/* --- HEADER --- */}
        <div className="text-center text-md-start mb-4 slide-up">
          <span className="badge-orange mb-2">Affiliate Program</span>
          <h2 className="page-title">Network <span className="highlight-text">Overview</span></h2>
          <p className="page-subtitle">Track your referrals, earn bids, and expand your reach.</p>
        </div>

        {/* --- SLEEK COMPACT STATS WIDGETS --- */}
        <div className="row g-3 mb-4 slide-up delay-1">
          {/* Bids Earned Card */}
          <div className="col-6 col-md-4">
            <div className="sleek-stat-card d-flex flex-column justify-content-center align-items-start h-100">
              <div className="d-flex align-items-center gap-2 mb-2 w-100">
                <div className="icon-wrapper icon-orange"><FaTrophy size={14} /></div>
                <span className="stat-label">Bids Earned</span>
              </div>
              <div className="d-flex align-items-end gap-2 w-100">
                <h3 className="stat-number mb-0">{summary.total_bids_earned}</h3>
                <span className="stat-badge bg-success-soft">+ Lifetime</span>
              </div>
            </div>
          </div>

          {/* Connections Card */}
          <div className="col-6 col-md-4">
            <div className="sleek-stat-card d-flex flex-column justify-content-center align-items-start h-100">
              <div className="d-flex align-items-center gap-2 mb-2 w-100">
                <div className="icon-wrapper icon-grey"><FaUsers size={14} /></div>
                <span className="stat-label">Connections</span>
              </div>
              <div className="d-flex align-items-end gap-2 w-100">
                <h3 className="stat-number mb-0">{summary.total_referrals}</h3>
                <span className="stat-badge bg-light-soft">Active</span>
              </div>
            </div>
          </div>

          {/* Invite Card */}
          <div className="col-12 col-md-4">
            <div className="sleek-stat-card invite-card d-flex flex-column justify-content-center h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="stat-label text-white fw-bold">Invite Friends</span>
                <button className="qr-trigger-btn" onClick={() => setShowShareModal(true)}>
                  <FaQrcode size={12} className="me-1" /> View QR
                </button>
              </div>
              <div className="direct-link-box d-flex align-items-center mt-1">
                <FaLink size={12} color={theme.mediumGrayTitle} className="me-2 flex-shrink-0" />
                <span className="text-truncate flex-grow-1 link-text">{referralLink}</span>
                <button className="copy-icon-btn ms-2 flex-shrink-0" onClick={handleCopy}>
                  {copied ? <FaCheckCircle size={14} color="#10B981" /> : <FaCopy size={14} color={theme.primaryOrange} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REFINED MAP STRUCTURE --- */}
        <div className="sleek-map-card slide-up delay-2">
          <div className="map-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaNetworkWired size={16} color={theme.primaryOrange} />
              <h6 className="mb-0 fw-bold font-14" style={{ color: theme.pureWhite }}>Live Referral Map</h6>
            </div>
          </div>

          <div className="map-body bg-light-pattern">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border spinner-border-sm text-orange" role="status"></div>
                <p className="mt-2 font-12" style={{ color: theme.bodyGrayText }}>Syncing Nodes...</p>
              </div>
            ) : (
              <>
                <div className="tree-scroll-container">
                  <div className="css-tree">
                    <ul>
                      <li>
                        {/* ROOT NODE (YOU) */}
                        <div className="map-node root-node shadow-sm">
                          <img src={userDetail?.image || "/user.png"} alt="You" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=You&background=F16336&color=fff"} />
                          <div className="node-info">
                            <span className="node-title">{userDetail?.fname || "You"}</span>
                            <span className="node-role">Team Leader</span>
                          </div>
                        </div>

                        {/* CHILD NODES */}
                        {referrals.length > 0 && (
                          <ul className="children-list">
                            {referrals.map((ref, idx) => (
                              <li key={ref.id} style={{ animationDelay: `${idx * 0.1}s` }} className="fade-in">
                                <div className="map-node child-node">
                                  <img src={ref.image || "/user.png"} alt={ref.fname} onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${ref.fname}&background=020617&color=d4d4d8`} />
                                  <div className="node-info">
                                    <span className="node-title">{ref.fname} {ref.lname}</span>
                                    <span className="node-role">Level 1 Member</span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    </ul>

                    {referrals.length === 0 && (
                      <div className="text-center p-5 mx-auto">
                        <FaUsers size={30} color={theme.darkGrayNumber} className="mb-3 opacity-50" />
                        <h6 className="fw-bold font-14 mb-1" style={{ color: theme.lightGrayHover }}>No Connections Yet</h6>
                        <p className="font-12 mb-0" style={{ color: theme.bodyGrayText }}>Share your referral link to build your team.</p>
                      </div>
                    )}
                  </div>
                </div>

                {!loading && totalPages > 1 && (
                  <div className="mt-4 pt-3 border-top-dark d-flex justify-content-center">
                    <Pagination 
                      count={totalPages} page={currentPage} onChange={(e, v) => setCurrentPage(v)} 
                      shape="rounded" size="small" siblingCount={0} 
                      sx={{ 
                        "& .MuiPaginationItem-root": { color: theme.lightGrayHover, fontSize: "12px" },
                        "& .Mui-selected": { backgroundColor: `${theme.primaryOrange} !important`, color: "#fff" },
                        "& .MuiPaginationItem-root:hover": { backgroundColor: theme.cardBgActive }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- SHARE MODAL --- */}
      {showShareModal && (
        <div className="custom-overlay" onClick={() => setShowShareModal(false)}>
          <div className="custom-modal zoom-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowShareModal(false)}><FaTimes size={12} /></button>
            <div className="text-center mb-3 mt-1">
              <h6 className="fw-bold mb-1" style={{ color: theme.pureWhite }}>Share Network Link</h6>
              <p className="font-11" style={{ color: theme.bodyGrayText }}>Let others scan to join instantly.</p>
            </div>
            
            {/* White background exclusively for QR to ensure scanning works */}
            <div className="qr-box mx-auto mb-4 text-center bg-white p-3 rounded-3" style={{ width: 'fit-content' }}>
              <QRCode value={referralLink !== "Loading link..." ? referralLink : "https://grapetask.co"} size={130} />
            </div>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn-social btn-wa w-100" onClick={() => window.open(`https://api.whatsapp.com/send?text=${referralLink}`)}><FaWhatsapp size={16}/> WhatsApp</button>
              <button className="btn-social btn-tg w-100" onClick={() => window.open(`https://t.me/share/url?url=${referralLink}`)}><FaTelegram size={16}/> Telegram</button>
            </div>
          </div>
        </div>
      )}

      {/* --- REFINED PURE CSS DESIGN FOR DARK THEME --- */}
      <style>{`
        .poppins { font-family: 'Poppins', sans-serif; }
        .referral-page { background-color: ${theme.mainBg}; min-height: 100vh; padding-bottom: 50px; color: ${theme.pureWhite}; }

        .font-11 { font-size: 11px; }
        .font-12 { font-size: 12px; }
        .font-14 { font-size: 14px; }

        .page-title { font-weight: 700; font-size: 1.5rem; color: ${theme.pureWhite}; letter-spacing: -0.5px; margin-bottom: 2px; }
        .highlight-text { color: ${theme.primaryOrange}; }
        .page-subtitle { color: ${theme.mediumGrayTitle}; font-size: 0.85rem; margin: 0; }
        .badge-orange { display: inline-block; background: ${theme.orangeBorderActive}; color: ${theme.pureWhite}; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid ${theme.primaryOrange}; }

        /* Sleek Cards */
        .sleek-stat-card {
          background: ${theme.cardBg}; border-radius: 12px; padding: 14px 16px; 
          border: 1px solid ${theme.lightBorder};
          transition: 0.2s ease;
        }
        .sleek-stat-card:hover { background: ${theme.cardBgActive}; border-color: ${theme.mediumBorder}; }
        .invite-card { border-left: 2px solid ${theme.primaryOrange}; }

        .icon-wrapper { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .icon-orange { background: ${theme.orangeBorderActive}; color: ${theme.pureWhite}; }
        .icon-grey { background: ${theme.cardBgActive}; color: ${theme.lightGrayHover}; border: 1px solid ${theme.lightBorder}; }

        .stat-label { color: ${theme.mediumGrayTitle}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-number { font-size: 1.25rem; font-weight: 700; color: ${theme.pureWhite}; line-height: 1; }
        .stat-badge { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 8px; }
        .bg-success-soft { background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .bg-light-soft { background: ${theme.cardBgActive}; color: ${theme.lightGrayHover}; border: 1px solid ${theme.lightBorder}; }

        .direct-link-box { background: ${theme.cardBgActive}; border: 1px solid ${theme.mediumBorder}; padding: 5px 8px; border-radius: 6px; width: 100%; transition: 0.2s; }
        .link-text { font-size: 10px; font-weight: 500; color: ${theme.lightGrayHover}; }
        .copy-icon-btn { background: transparent; border: none; padding: 0; cursor: pointer; transition: 0.2s; }
        .copy-icon-btn:hover { transform: scale(1.1); }
        
        .qr-trigger-btn { background: ${theme.cardBgActive}; color: ${theme.lightGrayHover}; border: 1px solid ${theme.lightBorder}; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; }
        .qr-trigger-btn:hover { background: ${theme.mediumBorder}; color: ${theme.pureWhite}; }

        /* Map Structure */
        .sleek-map-card { background: ${theme.cardBg}; border-radius: 12px; border: 1px solid ${theme.lightBorder}; overflow: hidden; }
        .map-header { padding: 12px 16px; border-bottom: 1px solid ${theme.lightBorder}; background: ${theme.cardBgActive}; }
        .map-body { padding: 16px; }
        .border-top-dark { border-top: 1px solid ${theme.lightBorder}; }

        /* Subtle Dark Dot Pattern */
        .bg-light-pattern { 
          background-image: radial-gradient(${theme.lightBorder} 1px, transparent 1px); 
          background-size: 24px 24px; 
          background-color: transparent; 
        }

        /* --- PERFECT RESPONSIVE TREE --- */
        .tree-scroll-container { width: 100%; overflow-x: auto; padding-bottom: 10px; text-align: center; }
        .tree-scroll-container::-webkit-scrollbar { height: 4px; }
        .tree-scroll-container::-webkit-scrollbar-thumb { background: ${theme.darkGrayNumber}; border-radius: 10px; }

        .css-tree { display: inline-flex; justify-content: center; min-width: max-content; padding-top: 10px; }
        .css-tree ul { padding-top: 16px; position: relative; display: flex; justify-content: center; padding-left: 0; margin: 0; }
        .css-tree li { text-align: center; list-style-type: none; position: relative; padding: 16px 6px 0; }

        /* Lines Color Fixed for Dark Mode */
        .css-tree li::before, .css-tree li::after { content: ''; position: absolute; top: 0; right: 50%; border-top: 1px solid ${theme.darkGrayNumber}; width: 50%; height: 16px; }
        .css-tree li::after { right: auto; left: 50%; border-left: 1px solid ${theme.darkGrayNumber}; }
        .css-tree li:only-child::after, .css-tree li:only-child::before { display: none; }
        .css-tree li:first-child::before, .css-tree li:last-child::after { border: 0 none; }
        .css-tree li:last-child::before { border-right: 1px solid ${theme.darkGrayNumber}; border-radius: 0 6px 0 0; }
        .css-tree li:first-child::after { border-radius: 6px 0 0 0; }
        .css-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; border-left: 1px solid ${theme.darkGrayNumber}; width: 0; height: 16px; margin-left: -1px; }

        /* Nodes UI */
        .map-node { 
          background: ${theme.cardBgActive}; padding: 6px 12px; border-radius: 8px; 
          min-width: 130px; display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid ${theme.mediumBorder}; z-index: 2; position: relative; text-align: left;
          transition: 0.2s ease;
        }
        .map-node:hover { border-color: ${theme.lightGrayHover}; background: rgba(255,255,255,0.06); }
        .map-node img { width: 28px; height: 28px; border-radius: 50%; border: 1px solid ${theme.lightBorder}; object-fit: cover; }

        .node-info { display: flex; flex-direction: column; }
        .node-title { font-size: 11px; font-weight: 600; color: ${theme.pureWhite}; max-width: 90px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0px; }
        .node-role { font-size: 9px; color: ${theme.mediumGrayTitle}; font-weight: 500; }

        .root-node { border: 1px solid ${theme.primaryOrange}; background: ${theme.orangeBorderActive}; }
        .root-node .node-role { color: ${theme.pureWhite}; font-weight: 600; }

        /* Mobile Thread Layout Overlay */
        @media (max-width: 767px) {
          .page-title { font-size: 1.3rem; }
          .sleek-stat-card { padding: 12px; }
          .map-body { padding: 12px; }

          .tree-scroll-container { overflow-x: hidden !important; padding: 0; }
          .css-tree { display: block; width: 100%; min-width: auto; padding-top: 0; }
          .css-tree ul { display: block; padding: 0; }
          .css-tree li { display: block; padding: 0; text-align: left; margin-bottom: 8px; }

          .css-tree li::before, .css-tree li::after, .css-tree ul ul::before { display: none !important; }

          .map-node { width: 100%; min-width: 100%; margin-bottom: 0; }

          .children-list { 
            position: relative; 
            padding-left: 0 !important; 
            margin-left: 20px; 
            padding-top: 8px !important;
          }
          .children-list::before {
            content: ''; position: absolute;
            top: -8px; bottom: 20px; left: 0; 
            width: 1px; background: ${theme.darkGrayNumber}; z-index: 0;
          }
          .children-list li {
            position: relative;
            padding-left: 20px !important; 
          }
          .children-list li::before {
            content: ''; position: absolute;
            top: 20px; 
            left: 0; width: 20px; height: 1px;
            background: ${theme.darkGrayNumber}; display: block !important; z-index: 0;
          }
        }

        /* Modal Overhaul */
        .custom-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 15px; }
        .custom-modal { background: ${theme.mainBg}; border: 1px solid ${theme.lightBorder}; width: 100%; max-width: 300px; padding: 20px; border-radius: 16px; position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .modal-close { position: absolute; top: 10px; right: 10px; background: ${theme.cardBgActive}; border: 1px solid ${theme.lightBorder}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${theme.mediumGrayTitle}; cursor: pointer; transition: 0.2s; }
        .modal-close:hover { background: rgba(239, 68, 68, 0.2); color: #EF4444; border-color: rgba(239, 68, 68, 0.3); }

        .btn-social { border: none; padding: 8px; border-radius: 8px; font-weight: 500; font-size: 11px; color: white; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
        .btn-wa { background: #25D366; }
        .btn-tg { background: #0088cc; }
        .btn-social:hover { opacity: 0.8; }

        /* Animations */
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .slide-up { animation: slideUp 0.3s ease-out forwards; opacity: 0; }
        .zoom-in { animation: zoomIn 0.2s ease-out forwards; }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default ModernReferralList;