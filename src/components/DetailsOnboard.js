import React, { useEffect, useState, useCallback } from "react";
import {
  AiOutlineBook,
  AiOutlineTrophy,
  AiOutlineGlobal,
  AiOutlineBulb,
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiFillStar,
} from "react-icons/ai";
import { BiUser, BiPhone, BiMap, BiTargetLock, BiBriefcase, BiEnvelope } from "react-icons/bi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// ─── Level badge colour helper ────────────────────────────────────────────────
const levelColor = (level) => {
  const map = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    expert: "#f0591f",
    advanced: "#8b5cf6",
  };
  return map[(level || "").toLowerCase()] || "#71717a";
};

// ─── Skeleton shimmer widget ──────────────────────────────────────────────────
const Shimmer = ({ h = "100%", w = "100%", radius = 24 }) => (
  <div
    style={{
      height: h,
      width: w,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)",
      backgroundSize: "200% 100%",
      animation: "gt-shimmer 1.5s infinite linear",
    }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DetailsOnboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOnboarding = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("Auth token not found.");

      const res = await fetch(
        `https://portal.grapetask.co/api/get-user-onboarding`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Unauthorized");

      if (json.status) {
        setData(json.data);
      } else {
        throw new Error("Data not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  const { profile, extra_details, skills, educations, certifications } = data || {};
  const completionNum = parseInt(profile?.profile_completion) || 0;

  const userRole = profile?.role?.toLowerCase() || "";
  const isClient = userRole === "client";

  return (
    <div className="container-fluid gt-main-bg" style={{ padding: "0 0 40px 0" }}>
      {/* 🚀 GRAPETASK CUSTOM THEME CSS 🚀 */}
      <style>{`
        :root {
          /* EXACT JSON THEME COLORS APPLIED HERE */
          --mainBg: #020617;
          --cardBg: rgba(255, 255, 255, 0.02);
          --cardBgActive: rgba(255, 255, 255, 0.04);
          --primaryOrange: #f0591f;
          --secondaryBlueBlur: rgba(59, 130, 246, 0.05);
          
          --pureWhite: #ffffff;
          --pureBlack: #000000;
          --lightGrayHover: #d4d4d8;
          --mediumGrayTitle: #a1a1aa;
          --bodyGrayText: #71717a;
          --darkGrayNumber: #52525b;
          
          --lightBorder: rgba(255, 255, 255, 0.06);
          --mediumBorder: rgba(255, 255, 255, 0.07);
          --orangeBorderActive: rgba(240, 89, 31, 0.4);
          
          /* Utility Glow Color based on Primary Orange */
          --orangeGlow: rgba(240, 89, 31, 0.5);
        }

        .gt-main-bg { 
          background-color: var(--mainBg) !important; 
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        @keyframes gt-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes gt-fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gt-pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(240,89,31, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(240,89,31, 0); }
          100% { box-shadow: 0 0 0 0 rgba(240,89,31, 0); }
        }

        /* ─── BENTO GRID LAYOUT ─── */
        .gt-bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .gt-bento-box {
          background: var(--cardBg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--lightBorder);
          border-radius: 28px;
          padding: 36px;
          position: relative;
          overflow: hidden;
          animation: gt-fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: all 0.4s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .gt-bento-box:hover {
          background: var(--cardBgActive);
          border-color: var(--orangeBorderActive);
          transform: translateY(-4px);
        }

        /* ─── HERO BANNER ─── */
        .gt-box-hero {
          grid-column: span 12;
          padding: 0;
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
        }
        .gt-hero-inner-card {
          background: var(--cardBg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--lightBorder);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        
        .gt-hero-banner-animated {
          width: 100%;
          height: 250px;
          background: radial-gradient(circle at top right, rgba(240, 89, 31, 0.1), transparent 50%),
                      radial-gradient(circle at bottom left, var(--secondaryBlueBlur), transparent 50%),
                      var(--mainBg);
          position: relative;
          border-bottom: 1px solid var(--mediumBorder);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
        }
        .gt-hero-banner-animated::before {
          content: "";
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(var(--lightBorder) 1px, transparent 1px),
            linear-gradient(90deg, var(--lightBorder) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.5;
        }
        
        .gt-banner-text-content {
          position: relative;
          z-index: 3;
          padding: 0 20px;
          margin-top: -40px;
        }
        .gt-banner-main-title {
          font-size: clamp(24px, 4vw, 44px);
          font-weight: 900;
          color: var(--pureWhite);
          letter-spacing: -0.5px;
          margin-bottom: 16px;
          line-height: 1.25;
          text-shadow: 0 4px 15px rgba(0,0,0,0.5);
          word-wrap: break-word;
        }
        .gt-text-gradient {
          background: linear-gradient(135deg, var(--primaryOrange) 0%, #ffab73 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 2px 10px rgba(240, 89, 31, 0.4));
        }

        /* 🔥 SINGLE LINE BADGE FIX 🔥 */
        .gt-banner-badges {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 10px;
        }

        .gt-banner-single-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--cardBgActive); /* Using theme background */
          border: 1px solid var(--mediumBorder); /* Using theme border */
          padding: 8px 24px;
          border-radius: 50px;
          white-space: nowrap; /* 🔥 Yeh line ko tootne se rokta hai 🔥 */
        }
        
        .gt-badge-text {
          font-size: clamp(10px, 3vw, 14px); 
          font-weight: 700;
          color: var(--pureWhite);
          letter-spacing: 1px;
        }

        .gt-badge-star {
          font-size: clamp(12px, 3vw, 16px);
        }

        /* ─── HERO CONTENT (Avatar + Details) ─── */
        .gt-hero-content-wrapper {
          padding: 0 40px 40px 40px;
          display: flex;
          align-items: flex-end;
          gap: 32px;
          position: relative;
          z-index: 4;
        }

        .gt-avatar-container {
          margin-top: -85px; 
          position: relative;
          flex-shrink: 0;
        }
        .gt-avatar-ring {
          padding: 5px;
          background: linear-gradient(135deg, var(--primaryOrange), #3b82f6);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }
        .gt-avatar {
          width: 160px; 
          height: 160px;
          border-radius: 50%;
          object-fit: cover;
          aspect-ratio: 1 / 1;
          border: 6px solid var(--mainBg);
          background: var(--mainBg);
        }
        .gt-status-dot {
          position: absolute; 
          bottom: 15px; 
          right: 15px;
          width: 24px; 
          height: 24px;
          background: #10b981;
          border: 4px solid var(--mainBg);
          border-radius: 50%;
          animation: gt-pulseGlow 2s infinite;
        }

        .gt-hero-details {
          flex: 1;
          padding-bottom: 10px;
        }

        .gt-title {
          color: var(--pureWhite);
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          display: flex; 
          align-items: center; 
          gap: 12px; 
          flex-wrap: wrap;
        }
        .gt-subtitle {
          color: var(--mediumGrayTitle);
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .gt-text-muted { color: var(--bodyGrayText); font-size: 15px; font-weight: 500; }
        
        .gt-hero-progress {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--cardBgActive);
          padding: 16px 24px;
          border-radius: 20px;
          border: 1px solid var(--lightBorder);
          margin-bottom: 10px;
        }

        /* ─── OTHER SECTIONS ─── */
        .gt-box-bio { grid-column: span 7; }
        .gt-box-info { grid-column: span 5; }
        .gt-box-skills { grid-column: span 12; }
        .gt-box-edu { grid-column: span 6; }
        .gt-box-cert { grid-column: span 6; }

        .gt-section-title {
          color: var(--pureWhite);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 14px;
          letter-spacing: -0.5px;
        }
        .gt-icon-wrap {
          background: rgba(240, 89, 31, 0.1);
          color: var(--primaryOrange);
          padding: 10px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(240, 89, 31, 0.2);
        }

        .gt-badge-level {
          background: linear-gradient(90deg, rgba(240, 89, 31, 0.2), rgba(240, 89, 31, 0.05));
          border: 1px solid var(--orangeBorderActive);
          color: var(--primaryOrange);
          font-size: 13px; font-weight: 700; text-transform: uppercase;
          padding: 6px 16px; border-radius: 100px; letter-spacing: 0.5px;
        }

        .gt-info-list { display: flex; flex-direction: column; gap: 14px; }
        .gt-info-item {
          display: flex; align-items: center; gap: 16px;
          color: var(--lightGrayHover); font-size: 16px;
          background: var(--cardBg); 
          padding: 14px 20px; 
          border-radius: 16px; 
          border: 1px solid var(--lightBorder);
          transition: all 0.3s ease;
        }
        .gt-info-item:hover { 
          border-color: var(--orangeBorderActive); 
          background: var(--cardBgActive);
          transform: translateX(6px); 
        }
        .gt-info-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: var(--cardBgActive);
          display: flex; align-items: center; justify-content: center;
          color: var(--primaryOrange); font-size: 20px;
          flex-shrink: 0;
        }

        .gt-skills-wrap { display: flex; flex-wrap: wrap; gap: 12px; }
        .gt-skill-chip {
          padding: 10px 24px;
          background: var(--cardBgActive);
          border: 1px solid var(--lightBorder);
          border-radius: 100px;
          color: var(--lightGrayHover);
          font-size: 15px; font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex; align-items: center;
        }
        .gt-skill-chip:hover {
          background: var(--primaryOrange);
          border-color: var(--primaryOrange);
          color: var(--pureWhite);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 20px var(--orangeGlow);
        }

        .gt-timeline { position: relative; padding-left: 24px; }
        .gt-timeline::before {
          content: ""; position: absolute; left: 0; top: 10px; bottom: 0;
          width: 2px; background: var(--lightBorder);
        }
        .gt-timeline-item { position: relative; margin-bottom: 28px; }
        .gt-timeline-item:last-child { margin-bottom: 0; }
        .gt-timeline-item::before {
          content: ""; position: absolute; left: -30px; top: 4px;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--primaryOrange);
          border: 3px solid var(--mainBg);
          box-shadow: 0 0 10px var(--orangeGlow);
        }
        .gt-timeline-title { color: var(--pureWhite); font-size: 17px; font-weight: 700; margin-bottom: 6px; }
        .gt-timeline-sub { color: var(--mediumGrayTitle); font-size: 15px; margin-bottom: 10px; }
        .gt-timeline-date {
          display: inline-block; background: var(--cardBgActive); border: 1px solid var(--lightBorder);
          color: var(--lightGrayHover); font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px;
        }

        /* ─── 🔥 RESPONSIVE BREAKPOINTS (Mobile Perfect) 🔥 ─── */
        @media (max-width: 1024px) {
          .gt-box-bio, .gt-box-info, .gt-box-edu, .gt-box-cert { grid-column: span 12; }
        }
        
        @media (max-width: 768px) {
          .gt-bento-grid { gap: 12px; }
          .gt-bento-box { padding: 18px; border-radius: 20px; }
          
          .gt-hero-banner-animated { height: 200px; }
          .gt-banner-text-content { padding: 0 10px; margin-top: -20px; }
          .gt-banner-main-title { font-size: clamp(18px, 5vw, 28px); margin-bottom: 10px; }
          
          /* Auto scaling for smaller mobile screens */
          .gt-banner-single-badge { padding: 5px 12px; gap: 4px; }
          .gt-badge-text { font-size: 10px; }
          .gt-badge-star { font-size: 12px; }
          
          .gt-hero-content-wrapper { 
            flex-direction: column; 
            align-items: center; 
            text-align: center; 
            padding: 0 14px 24px; 
            gap: 14px; 
          }
          
          .gt-avatar-container { margin-top: -60px; }
          .gt-avatar-ring { padding: 3px; }
          .gt-avatar { width: 100px; height: 100px; border-width: 4px; }
          .gt-status-dot { width: 18px; height: 18px; bottom: 8px; right: 8px; border-width: 3px; }
          
          .gt-title { justify-content: center; font-size: 22px; gap: 6px; margin-top: 6px; }
          .gt-subtitle { justify-content: center; display: flex; flex-wrap: wrap; gap: 4px; font-size: 15px; }
          .gt-hero-progress { width: 100%; justify-content: center; margin-top: 10px; }
          .gt-text-muted { justify-content: center !important; font-size: 13px !important; }
          
          .gt-section-title { font-size: 17px; margin-bottom: 16px; }
          .gt-icon-wrap { padding: 8px; border-radius: 12px; }
          .gt-icon-wrap svg { width: 18px; height: 18px; }
          
          .gt-info-item { padding: 12px 14px; font-size: 14px; gap: 12px; border-radius: 14px; }
          .gt-info-icon { width: 34px; height: 34px; font-size: 16px; border-radius: 10px; }
          
          .gt-skill-chip { padding: 8px 16px; font-size: 13px; }
          .gt-skills-wrap { gap: 8px; }
          
          .gt-timeline-title { font-size: 15px; }
          .gt-timeline-sub { font-size: 13px; }
          .gt-timeline-item { margin-bottom: 20px; }
          .gt-timeline-item::before { width: 12px; height: 12px; left: -26px; }
          
          .gt-badge-level { font-size: 11px; padding: 4px 12px; }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .gt-bento-grid { gap: 10px; }
          .gt-bento-box { padding: 14px; border-radius: 16px; }
          
          .gt-hero-banner-animated { height: 170px; }
          .gt-banner-main-title { font-size: clamp(16px, 4.5vw, 22px); }
          .gt-banner-single-badge { padding: 4px 10px; }
          .gt-badge-text { font-size: 9px; letter-spacing: 0.5px; }
          .gt-badge-star { font-size: 10px; }
          
          .gt-hero-content-wrapper { padding: 0 10px 20px; gap: 10px; }
          .gt-avatar-container { margin-top: -50px; }
          .gt-avatar { width: 80px; height: 80px; border-width: 3px; }
          .gt-status-dot { width: 14px; height: 14px; bottom: 6px; right: 6px; border-width: 2px; }
          
          .gt-title { font-size: 18px; }
          .gt-subtitle { font-size: 13px; }
          .gt-hero-progress { padding: 12px 16px; border-radius: 16px; }
          .gt-hero-progress > div:first-child { width: 48px; height: 48px; }
          
          .gt-section-title { font-size: 15px; margin-bottom: 12px; gap: 10px; }
          .gt-info-item { padding: 10px 12px; font-size: 13px; border-radius: 12px; }
          .gt-info-icon { width: 30px; height: 30px; font-size: 14px; }
          
          .gt-skill-chip { padding: 6px 14px; font-size: 12px; }
          
          .gt-timeline-title { font-size: 14px; }
          .gt-timeline-sub { font-size: 12px; }
          .gt-timeline-date { font-size: 10px; padding: 4px 10px; }
        }

      `}</style>

      <div className="mx-lg-4 mx-md-3 mx-2 pt-4">
        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="gt-bento-grid">
            <div style={{ gridColumn: "span 12", height: "350px" }}><Shimmer /></div>
            <div style={{ gridColumn: "span 7", height: "250px" }}><Shimmer /></div>
            <div style={{ gridColumn: "span 5", height: "250px" }}><Shimmer /></div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {!loading && error && (
          <div className="d-flex justify-content-center py-5">
            <div className="gt-bento-box text-center" style={{ maxWidth: "500px", width: "100%" }}>
              <AiOutlineClose size={54} color="#ef4444" style={{ background: "rgba(239,68,68,0.1)", borderRadius: "50%", padding: 14, margin: "0 auto 20px" }} />
              <h4 style={{ color: "var(--pureWhite)", fontWeight: 800 }}>Profile Unavailable</h4>
              <p style={{ color: "var(--mediumGrayTitle)", fontSize: "16px" }}>{error}</p>
              <button
                onClick={fetchOnboarding}
                style={{ background: "var(--primaryOrange)", border: "none", color: "#fff", borderRadius: 14, padding: "14px 28px", fontSize: "16px", fontWeight: 600, marginTop: "15px", boxShadow: "0 4px 15px rgba(240,89,31,0.4)" }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS BENTO GRID ── */}
        {!loading && !error && data && (
          <div className="gt-bento-grid">
            
            {/* 1. HERO BANNER (12 Cols) */}
            <div className="gt-bento-box gt-box-hero" style={{ animationDelay: "0.1s" }}>
              <div className="gt-hero-inner-card">
                <div className="gt-hero-banner-animated">
                  <div className="gt-banner-text-content">
                    <h1 className="gt-banner-main-title">
                      Great People Work With <span className="gt-text-gradient">GrapeTask</span>
                    </h1>
                    
                    {/* 🔥 YAHAN BADGE FIX KIYA GAYA HAI 🔥 */}
                    <div className="gt-banner-badges">
                      <div className="gt-banner-single-badge">
                        <AiFillStar className="gt-badge-star" color="var(--primaryOrange)" />
                        <span className="gt-badge-text">
                          <span style={{ color: "var(--primaryOrange)" }}>PAKISTAN'S FIRST</span> FREELANCE MARKETPLACE
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
                
                <div className="gt-hero-content-wrapper w-100">
                  <div className="gt-avatar-container">
                    <div className="gt-avatar-ring">
                      <img
                        src={profile?.image || "/default-avatar.png"}
                        alt="Profile"
                        className="gt-avatar"
                        onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${profile?.fname} ${profile?.lname}`) + "&background=020617&color=f0591f")}
                      />
                    </div>
                    <div className="gt-status-dot"></div>
                  </div>
                  
                  <div className="gt-hero-details">
                    <h1 className="gt-title">
                      {profile?.fname} {profile?.lname}
                      {profile?.is_onboarded === 1 && <AiOutlineCheckCircle size={28} color="#10b981" title="Verified" />}
                      {profile?.level && <span className="gt-badge-level">{profile.level}</span>}
                    </h1>
                    <h3 className="gt-subtitle">
                      {profile?.role} {profile?.user_name ? <span className="gt-text-muted">| @{profile.user_name}</span> : ""}
                    </h3>
                    {profile?.country && (
                      <p className="gt-text-muted mb-0 d-flex align-items-center gap-2" style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
                        <BiMap size={18} color="var(--primaryOrange)" />
                        {profile.city ? `${profile.city}, ` : ''}{profile.state ? `${profile.state}, ` : ''}{profile.country}
                      </p>
                    )}
                  </div>

                  <div className="gt-hero-progress d-none d-md-flex">
                    <div style={{ width: 60, height: 60 }}>
                      <CircularProgressbar
                        value={completionNum}
                        text={`${completionNum}%`}
                        styles={buildStyles({
                          textSize: "24px",
                          textColor: "var(--pureWhite)",
                          pathColor: "var(--primaryOrange)",
                          trailColor: "var(--lightBorder)",
                        })}
                      />
                    </div>
                    <div>
                      <div style={{ color: "var(--pureWhite)", fontWeight: 700, fontSize: 15 }}>Profile Strength</div>
                      <div style={{ color: "var(--mediumGrayTitle)", fontSize: 13 }}>Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BIO / ABOUT (Not for clients) */}
            {!isClient && profile?.bio && (
              <div className="gt-bento-box gt-box-bio" style={{ animationDelay: "0.2s" }}>
                <h4 className="gt-section-title">
                  <span className="gt-icon-wrap"><BiUser size={22} /></span> About Me
                </h4>
                <p style={{ color: "var(--lightGrayHover)", fontSize: "17px", lineHeight: "1.8", whiteSpace: "pre-wrap", margin: 0, wordBreak: "break-word" }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* 4. CONTACT / INFO */}
            <div className={`gt-bento-box ${!isClient && profile?.bio ? 'gt-box-info' : 'gt-box-skills'}`} style={{ animationDelay: "0.3s" }}>
              <h4 className="gt-section-title">
                <span className="gt-icon-wrap"><BiEnvelope size={22} /></span> Details
              </h4>
              <div className="gt-info-list">
                {profile?.email && (
                  <div className="gt-info-item"><div className="gt-info-icon"><BiEnvelope /></div> {profile.email}</div>
                )}
                {profile?.phone && (
                  <div className="gt-info-item"><div className="gt-info-icon"><BiPhone /></div> {profile.phone}</div>
                )}
                {!isClient && extra_details?.occupation && (
                  <div className="gt-info-item"><div className="gt-info-icon"><BiBriefcase /></div> {extra_details.occupation}</div>
                )}
                {!isClient && extra_details?.goal && (
                  <div className="gt-info-item"><div className="gt-info-icon"><BiTargetLock /></div> {extra_details.goal}</div>
                )}
                {!isClient && extra_details?.website && (
                  <a href={extra_details.website} target="_blank" rel="noreferrer" className="gt-info-item" style={{ textDecoration: "none" }}>
                    <div className="gt-info-icon"><AiOutlineGlobal /></div> <span style={{ textDecoration: "underline" }}>{extra_details.website}</span>
                  </a>
                )}
              </div>
            </div>

            {/* 6. SKILLS */}
            {!isClient && skills?.length > 0 && (
              <div className="gt-bento-box gt-box-skills" style={{ animationDelay: "0.4s" }}>
                <h4 className="gt-section-title">
                  <span className="gt-icon-wrap"><AiOutlineBulb size={22} /></span> Core Skills
                </h4>
                <div className="gt-skills-wrap">
                  {skills.map((s, i) => (
                    <span key={i} className="gt-skill-chip">{s.skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 7. EDUCATION */}
            {!isClient && educations?.length > 0 && (
              <div className={`gt-bento-box ${certifications?.length > 0 ? 'gt-box-edu' : 'gt-box-skills'}`} style={{ animationDelay: "0.5s" }}>
                <h4 className="gt-section-title">
                  <span className="gt-icon-wrap"><AiOutlineBook size={22} /></span> Education
                </h4>
                <div className="gt-timeline">
                  {educations.map((edu, i) => (
                    <div key={i} className="gt-timeline-item">
                      <h5 className="gt-timeline-title">{edu.degree}</h5>
                      <p className="gt-timeline-sub">{edu.institution || edu.university}</p>
                      {(edu.passing_year || edu.year) && <span className="gt-timeline-date">{edu.passing_year || edu.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CERTIFICATIONS */}
            {!isClient && certifications?.length > 0 && (
              <div className={`gt-bento-box ${educations?.length > 0 ? 'gt-box-cert' : 'gt-box-skills'}`} style={{ animationDelay: "0.6s" }}>
                <h4 className="gt-section-title">
                  <span className="gt-icon-wrap"><AiOutlineTrophy size={22} /></span> Certifications
                </h4>
                <div className="gt-timeline">
                  {certifications.map((cert, i) => (
                    <div key={i} className="gt-timeline-item">
                      <h5 className="gt-timeline-title">{cert.name || cert.title}</h5>
                      <p className="gt-timeline-sub">{cert.issuer || cert.provider}</p>
                      {cert.year && <span className="gt-timeline-date">{cert.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DetailsOnboard);