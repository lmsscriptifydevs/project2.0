import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  AiOutlineBook,
  AiOutlineTrophy,
  AiOutlineGlobal,
  AiOutlineBulb,
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiFillStar,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import {
  FaAngleDown, FaAngleUp, FaCircle, FaPowerOff,
  FaRegEnvelope, FaUserCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import logo1 from "../assets/logo.png";
import { useUserData, useUserRole, useAccessToken } from "../utils/useLocalStorage";
import NotificationBell from "./NotificationBell";

// ── Theme ────────────────────────────────────────────────────────────────────
const T = {
  mainBg:      "#020617",
  cardBg:      "rgba(255,255,255,0.02)",
  cardBgHover: "rgba(255,255,255,0.05)",
  orange:      "#f0591f",
  orangeFade:  "rgba(240,89,31,0.12)",
  orangeBorder:"rgba(240,89,31,0.35)",
  white:       "#ffffff",
  lightGray:   "#d4d4d8",
  midGray:     "#a1a1aa",
  bodyGray:    "#71717a",
  border:      "rgba(255,255,255,0.06)",
  borderMid:   "rgba(255,255,255,0.07)",
  dropBg:      "#0c1525",
};

// ── Constants ────────────────────────────────────────────────────────────────
const ROLES = {
  CLIENT:     "client",
  FREELANCER: "expert/freelancer",
  BIDDER:     "bidder/company representative/middleman",
};
const SWITCH_OPTIONS = [
  { key: "client", label: "Client", query: "client" },
  { key: "bd",     label: "BD",     query: "bd"     },
  { key: "expert", label: "Expert", query: "expert" },
];
const normalizeRole = (role) => {
  if (!role) return ROLES.CLIENT;
  const r = role.toLowerCase().trim();
  if (r.includes("client"))                                              return ROLES.CLIENT;
  if (r.includes("expert") || r.includes("freelancer"))               return ROLES.FREELANCER;
  if (r.includes("bidder") || r.includes("representative") || r.includes("middleman")) return ROLES.BIDDER;
  return ROLES.CLIENT;
};
const EMPTY_NOTIFICATIONS = { notifications: [] };

// ── Shared dropdown style ────────────────────────────────────────────────────
const dropStyle = {
  position:        "absolute",
  top:             "calc(100% + 8px)",
  left:            0,
  backgroundColor: T.dropBg,
  border:          `1px solid ${T.borderMid}`,
  borderRadius:    "12px",
  padding:         "6px",
  minWidth:        "170px",
  zIndex:          9999,
  boxShadow:       "0 16px 40px rgba(0,0,0,0.5)",
  listStyle:       "none",
  margin:          0,
};

const dropItemStyle = (extra = {}) => ({
  padding:      "7px 12px",
  borderRadius: "8px",
  fontSize:     "13px",
  cursor:       "pointer",
  display:      "block",
  color:        T.lightGray,
  textDecoration: "none",
  transition:   "all 0.15s",
  ...extra,
});

// ── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = (props) => {
  const navigate      = useNavigate();
  const token         = useAccessToken();
  const userRoleRaw   = useUserRole();
  const userData      = useUserData();
  const userRole      = useMemo(() => normalizeRole(userRoleRaw), [userRoleRaw]);
  const conversations = useSelector((state) => state.message?.conversations || []);
  const totalUnreadMessages = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + (conv.unread_count ?? conv.unreadCount ?? 0), 0);
  }, [conversations]);
  const [showActivities, setShowActivities] = useState(false);
  const [showProfile,    setShowProfile]    = useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const activitiesRef = useRef(null);
  const profileRef    = useRef(null);
  const switchRef     = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (activitiesRef.current && !activitiesRef.current.contains(e.target)) setShowActivities(false);
    if (profileRef.current    && !profileRef.current.contains(e.target))    setShowProfile(false);
    if (switchRef.current     && !switchRef.current.contains(e.target))     setShowSwitchMenu(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = () => { localStorage.clear(); navigate("/"); window.location.reload(); };

  const handleSwitchTo = useCallback((query) => {
    ["accessToken","refreshToken","UserData","Role"].forEach((k) => localStorage.removeItem(k));
    setShowSwitchMenu(false);
    navigate(`/login?switch=${query}`, { replace: true });
    window.location.reload();
  }, [navigate]);

  const currentRoleKey = useMemo(() => {
    if (userRole === ROLES.CLIENT)     return "client";
    if (userRole === ROLES.BIDDER)     return "bd";
    if (userRole === ROLES.FREELANCER) return "expert";
    return null;
  }, [userRole]);

  const switchTargets = useMemo(
    () => SWITCH_OPTIONS.filter((o) => o.key !== currentRoleKey),
    [currentRoleKey],
  );

  useSelector((state) => state.notifications ?? EMPTY_NOTIFICATIONS);

  const isClient     = () => userRole === ROLES.CLIENT;
  const isFreelancer = () => userRole === ROLES.FREELANCER;
  const isBidder     = () => userRole === ROLES.BIDDER;
  const isWorker     = () => isFreelancer() || isBidder();

  // ── Nav link style helper ──────────────────────────────────────────────────
  const navLinkCss = {
    color:       T.midGray,
    fontSize:    "13px",
    fontWeight:  500,
    padding:     "5px 10px",
    borderRadius:"8px",
    textDecoration: "none",
    transition:  "color 0.15s, background 0.15s",
    whiteSpace:  "nowrap",
  };

  const iconBtn = {
    background:  "none",
    border:      "none",
    cursor:      "pointer",
    padding:     "4px 6px",
    borderRadius:"8px",
    display:     "flex",
    alignItems:  "center",
    transition:  "background 0.15s",
  };

  return (
    <>
      <style>{`
        .gt-nav-link { color: ${T.midGray}; font-size:13px; font-weight:500; padding:5px 10px; border-radius:8px; text-decoration:none; transition:color .15s,background .15s; white-space:nowrap; }
        .gt-nav-link:hover, .gt-nav-link.active { color:${T.white} !important; background:${T.cardBgHover}; }
        .gt-drop-item { display:block; padding:7px 12px; border-radius:8px; font-size:13px; color:${T.lightGray}; text-decoration:none; transition:all .15s; }
        .gt-drop-item:hover { color:${T.white}; background:${T.cardBgHover}; }
        .gt-drop-divider { width:100%; height:1px; background:${T.border}; margin:4px 0; }
        .gt-icon-btn:hover { background:${T.cardBgHover}; }
        .gt-switch-item:hover { color:${T.orange}; background:${T.orangeFade}; }
        @media(max-width:991px){
          .gt-mobile-menu { padding:12px 0; border-top:1px solid ${T.border}; margin-top:8px; }
          .gt-mobile-menu .gt-nav-link { display:block; padding:8px 12px; }
        }
      `}</style>

      <div style={{ backgroundColor: T.mainBg, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 1000 }}>
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:"54px", maxWidth:"1400px", margin:"0 auto" }}>

          {/* ── Logo ── */}
          <Link to={token ? "/dashboard" : "/"} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <img src={logo1} alt="Logo" style={{ height:"30px", width:"auto" }} />
          </Link>

          {/* ── Desktop Nav ── */}
          <div style={{ display:"flex", alignItems:"center", gap:"2px", flex:1, justifyContent:"center" }} className="d-none d-lg-flex">
            {!token && (
              <>
                <NavLink className="gt-nav-link" to="/whygrapetask">Why GrapeTask</NavLink>
                <NavLink className="gt-nav-link" to="/aboutus">About Us</NavLink>
              </>
            )}

            {token && (
              <>
                <NavLink className="gt-nav-link" to="/dashboard">Dashboard</NavLink>
                <NavLink className="gt-nav-link" to="/freelancers">Browse</NavLink>

                {isWorker() && <NavLink className="gt-nav-link" to="/earning">Earnings</NavLink>}
                {isClient() && <NavLink className="gt-nav-link" to="/spending">Spendings</NavLink>}
                {isBidder() && <NavLink className="gt-nav-link" to="/hireExpert">Hire Expert</NavLink>}

                {/* My Activities dropdown */}
                <div style={{ position:"relative" }} ref={activitiesRef}>
                  <button
                    onClick={() => setShowActivities((p) => !p)}
                    style={{ ...iconBtn, color: showActivities ? T.white : T.midGray, background: showActivities ? T.cardBgHover : "none", fontSize:"13px", fontWeight:500, gap:4 }}
                    className="gt-icon-btn"
                  >
                    My Activities {showActivities ? <FaAngleUp size={11}/> : <FaAngleDown size={11}/>}
                  </button>
                  {showActivities && (
                    <ul style={dropStyle}>
                      {isWorker() && <><li><NavLink to="/gigs/manage"       className="gt-drop-item">Gigs</NavLink></li>
                                       <li><NavLink to="/gigs/states"       className="gt-drop-item">Gig States</NavLink></li></>}
                      {isClient() && <><li><NavLink to="/received-offers"   className="gt-drop-item">Proposals</NavLink></li>
                                       <li><NavLink to="/buyerRequest"      className="gt-drop-item">Create Buyer Request</NavLink></li></>}
                      {isBidder() && <><li><NavLink to="/userBuyerRequest"    className="gt-drop-item">Buyer Requests</NavLink></li>
                                       <li><NavLink to="/bd-tasks"            className="gt-drop-item">Create Buyer Request</NavLink></li></>}
                      {isFreelancer() && <><li><NavLink to="/jobInvitation"   className="gt-drop-item">Job Invitation</NavLink></li>
                                           <li><NavLink to="/expert-bd-tasks"     className="gt-drop-item">Create Buyer Request</NavLink></li></>}
                      <div className="gt-drop-divider"/>
                      <li><NavLink to="/order" className="gt-drop-item">Orders</NavLink></li>
                    </ul>
                  )}
                </div>

                {/* Switch To dropdown */}
                <div style={{ position:"relative" }} ref={switchRef}>
                  <button
                    onClick={() => setShowSwitchMenu((p) => !p)}
                    style={{ ...iconBtn, color: showSwitchMenu ? T.white : T.midGray, background: showSwitchMenu ? T.cardBgHover : "none", fontSize:"13px", fontWeight:500, gap:4 }}
                    className="gt-icon-btn"
                  >
                    Switch to {showSwitchMenu ? <FaAngleUp size={11}/> : <FaAngleDown size={11}/>}
                  </button>
                  {showSwitchMenu && (
                    <ul style={dropStyle}>
                      {switchTargets.map((opt) => (
                        <li key={opt.key}
                          className="gt-drop-item gt-switch-item"
                          style={{ cursor:"pointer" }}
                          onClick={() => handleSwitchTo(opt.query)}
                        >
                          Switch to {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Right side ── */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
            {!token && (
              <>
                <NavLink className="gt-nav-link d-none d-lg-flex" to="/login">Log In</NavLink>
                <button
                  onClick={() => navigate("/signup")}
                  style={{
                    backgroundColor: T.orange, color:"#fff", border:"none",
                    padding:"6px 16px", borderRadius:"8px", fontSize:"13px",
                    fontWeight:600, cursor:"pointer",
                    boxShadow:`0 4px 12px rgba(240,89,31,0.3)`,
                    transition:"background 0.15s",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor="#d94e18"}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor=T.orange}
                >
                  Join
                </button>
              </>
            )}

            {token && (
              <>
                {/* Bids */}
                {isWorker() && (
                  <NavLink to="/buy-bids"
                    style={{ color:T.midGray, fontSize:"12px", fontWeight:600, textDecoration:"none",
                             backgroundColor:T.cardBg, border:`1px solid ${T.border}`,
                             padding:"3px 10px", borderRadius:"20px", whiteSpace:"nowrap" }}
                  >
                    Bids {userData?.total_bids || 0} Bids
                  </NavLink>
                )}

                {/* Notification bell */}
                <div style={{ display:"flex", alignItems:"center" }}>
                  <NotificationBell token={token} />
                </div>

                {/* Messages - Mobile par theek rakhna hai toh theek warna isko bhi d-none d-lg-flex de sakte hain */}
                 <Link to="/Inbox" className="gt-icon-btn"
                  style={{ ...iconBtn, color:T.midGray, gap: "4px", position: "relative" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.cardBgHover;e.currentTarget.style.color=T.white;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.midGray;}}
                >
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <FaRegEnvelope size={18}/>
                    {totalUnreadMessages > 0 && (
                      <span style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: T.orange,
                        color: T.white,
                        fontSize: "9px",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: "14px",
                        height: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 4px rgba(240,89,31,0.6)"
                      }}>
                        {totalUnreadMessages}
                      </span>
                    )}
                  </div>
                  <span className="d-none d-lg-block" style={{ fontSize: "13px", fontWeight: 500 }}>Inbox</span>
                </Link>

                {/* 🔥 YAHAN CHANGE KIYA HAI: Mobile pe isay chupa diya (d-none d-lg-flex) 🔥 */}
                <Link to="/help" className="gt-icon-btn d-none d-lg-flex"
                  style={{ ...iconBtn, color:T.midGray, gap: "4px" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.cardBgHover;e.currentTarget.style.color=T.white;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.midGray;}}
                >
                  <AiOutlineQuestionCircle size={18}/>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Dispute Center</span>
                </Link>

                {/* Client Orders shortcut */}
                {isClient() && (
                  <NavLink to="/order" className="gt-nav-link d-none d-lg-flex" style={{ fontSize:"12px" }}>Orders</NavLink>
                )}

                {/* Profile dropdown */}
                <div style={{ position:"relative" }} ref={profileRef}>
                  <button
                    onClick={() => setShowProfile((p) => !p)}
                    style={{ ...iconBtn, padding:"2px", position:"relative" }}
                  >
                    {userData?.image ? (
                      <img src={userData.image} alt="Profile"
                        style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover",
                                 border:`2px solid ${showProfile ? T.orange : T.border}`,
                                 transition:"border-color 0.15s" }}
                      />
                    ) : (
                      <FaUserCircle size={32} color={showProfile ? T.orange : T.midGray} style={{ transition:"color 0.15s" }}/>
                    )}
                    <FaCircle size={9} color="#22c55e"
                      style={{ position:"absolute", bottom:1, right:1,
                               filter:"drop-shadow(0 0 3px #22c55e)" }}
                    />
                  </button>

                  {showProfile && (
                    <ul style={{ ...dropStyle, left:"auto", right:0 }}>
                      <li style={{ padding:"8px 12px 6px", borderBottom:`1px solid ${T.border}`, marginBottom:4 }}>
                        <p style={{ margin:0, fontSize:"13px", fontWeight:600, color:T.white }}>
                          {userData?.fname} {userData?.lname}
                        </p>
                        <p style={{ margin:0, fontSize:"11px", color:T.bodyGray }}>{userRoleRaw}</p>
                      </li>
                      
                      <li><NavLink to="/payoutMethod"   className="gt-drop-item">Billing & Payment</NavLink></li>
                      <li><NavLink to="/history"        className="gt-drop-item">Billing History</NavLink></li>
                     
                      {!isClient() && (
                        <>
                          <li><NavLink to="/profile/referral/link" className="gt-drop-item">Refer a Friend</NavLink></li>
                          <li><NavLink to="/profile/referrals"     className="gt-drop-item">Referral List</NavLink></li>
                        </>
                      )}
                      <li><NavLink to="/profileSetting" className="gt-drop-item">Settings</NavLink></li>
                      <div className="gt-drop-divider"/>
                      <li>
                        <button onClick={handleLogout}
                          style={{ ...dropItemStyle(), background:"none", border:"none", width:"100%",
                                   textAlign:"left", color:"#ef4444", display:"flex", alignItems:"center", gap:8 }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.08)"}
                          onMouseLeave={e=>e.currentTarget.style.background="none"}
                        >
                          <FaPowerOff size={12}/> Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* ── Mobile Toggle ── */}
            <button
              className="d-lg-none"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              style={{ 
                ...iconBtn, 
                color: T.midGray, 
                marginLeft: 4,
                display: "flex", 
                flexDirection: "column",
                gap: "3px",              
                padding: "8px"
              }}
            >
              <span style={{ display:"block", width:20, height:2, backgroundColor:T.midGray, borderRadius:2 }}/>
              <span style={{ display:"block", width:20, height:2, backgroundColor:T.midGray, borderRadius:2 }}/>
              <span style={{ display:"block", width:20, height:2, backgroundColor:T.midGray, borderRadius:2 }}/>
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        <div className="collapse d-lg-none" id="mobileMenu"
          style={{ backgroundColor:T.mainBg, borderTop:`1px solid ${T.border}`, padding:"10px 20px 16px" }}>
          {!token && (
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              <NavLink className="gt-nav-link" to="/whygrapetask">Why GrapeTask</NavLink>
              <NavLink className="gt-nav-link" to="/aboutus">About Us</NavLink>
              <NavLink className="gt-nav-link" to="/login">Log In</NavLink>
            </div>
          )}
          {token && (
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              <NavLink className="gt-nav-link" to="/dashboard">Dashboard</NavLink>
              <NavLink className="gt-nav-link" to="/freelancers">Browse</NavLink>
              {isWorker()    && <NavLink className="gt-nav-link" to="/earning">Earnings</NavLink>}
              {isClient()    && <NavLink className="gt-nav-link" to="/spending">Spendings</NavLink>}
              {isBidder()    && <NavLink className="gt-nav-link" to="/hireExpert">Hire Expert</NavLink>}
              {isWorker()    && <NavLink className="gt-nav-link" to="/gigs/manage">Gigs</NavLink>}
              {isWorker()    && <NavLink className="gt-nav-link" to="/gigs/states">Gig States</NavLink>}
              {isClient()    && <NavLink className="gt-nav-link" to="/received-offers">Proposals</NavLink>}
              {isClient()    && <NavLink className="gt-nav-link" to="/buyerRequest">Create Buyer Request</NavLink>}
              {isBidder()    && <NavLink className="gt-nav-link" to="/userBuyerRequest">Buyer Requests</NavLink>}
              {isBidder()    && <NavLink className="gt-nav-link" to="/bd-tasks">Create Buyer Request</NavLink>}
              {isFreelancer()&& <NavLink className="gt-nav-link" to="/jobInvitation">Job Invitation</NavLink>}
              {isFreelancer()&& <NavLink className="gt-nav-link" to="/expert-bd-tasks">Create Buyer Request</NavLink>}
              
              <NavLink className="gt-nav-link" to="/order">Orders</NavLink>
              
              {/* 🔥 YAHAN CHANGE KIYA HAI: Dispute Center Menu ke andar daal diya 🔥 */}
              <NavLink className="gt-nav-link" to="/help" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AiOutlineQuestionCircle size={16}/> Dispute Center
              </NavLink>

              <div style={{ height:1, background:T.border, margin:"6px 0" }}/>
              {switchTargets.map((opt) => (
                <button key={opt.key} onClick={() => handleSwitchTo(opt.query)}
                  style={{ ...iconBtn, color:T.midGray, fontSize:"13px", justifyContent:"flex-start", padding:"6px 10px" }}>
                  Switch to {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;