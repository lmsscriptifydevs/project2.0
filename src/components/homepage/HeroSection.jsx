import React, { useState, useEffect, useCallback, useRef } from "react";
import { RiSearchLine } from "react-icons/ri";
import { GoLocation } from "react-icons/go";
import { FaPause, FaPlay } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const HERO_CATEGORIES = [
  "Website Development →", "Architecture & Interior Design →", 
  "UGC Video Creation →", "Professional Video Editing →", 
  "SEO Services →", "Mobile App Development →",
  "Social Media Marketing →", "Graphic Design →",
  "Content Writing →", "Voice Over →"
];

const INDEX_VIDEO_SOURCES = ["video/Freelance5.mp4", "video/Freelance2.mp4", "video/Freelance4.mp4"];

const VideoPlayer = ({ src, className, isPlaying, onVideoEnd, isActive }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, isActive]);

  return (
    <video 
      ref={videoRef} className={className} 
      muted playsInline onEnded={onVideoEnd}
      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const handleNextVideo = useCallback(() => {
    setActiveVideoIdx((prev) => (prev + 1) % INDEX_VIDEO_SOURCES.length);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = search.replace(" →", "");
    navigate("/search/gigs", { state: { data: { search: searchTerm, location: location } } });
  };

  const handleCategoryClick = (category) => {
    const cleanCategory = category.replace(" →", "");
    navigate("/search/gigs", { state: { data: { search: cleanCategory, location: "Pakistan" } } });
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>
        {`
          :root {
            --bg-main: #0a0e17;
            --bg-card: rgba(255,255,255,0.03);
            --bg-input: rgba(255,255,255,0.05);
            --accent-primary: #f0591f;
            --accent-hover: #d94a15;
            --accent-glow: rgba(240, 89, 31, 0.2);
            --text-heading: #ffffff;
            --text-body: #f8fafc;
            --text-muted: #94a3b8;
            --border-light: rgba(255,255,255,0.05);
            --border-strong: rgba(255,255,255,0.1);
          }

          .hero-main-container {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            background: var(--bg-main);
            padding: 80px 0;
          }

          .hero-video-engine { position: absolute; inset: 0; z-index: 1; }
          .v-layer { position: absolute; inset: 0; transition: opacity 1.5s ease; }

          .hero-overlay {
            position: absolute;
            inset: 0;
            z-index: 2;
            background: linear-gradient(135deg, var(--bg-main) 0%, rgba(10,14,23,0.5) 50%, var(--bg-main) 100%);
          }

          .hero-content { position: relative; z-index: 10; width: 100%; padding: 0 6%; }

          .hero-h1 {
            font-size: clamp(2.4rem, 6vw, 4.5rem);
            font-weight: 800;
            color: var(--text-heading);
            line-height: 1.1;
            margin-bottom: 25px;
            letter-spacing: -0.04em;
          }
          .hero-h1 span { 
            color: var(--accent-primary);
            background: linear-gradient(to right, var(--accent-primary), #ff8c5a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-p {
            font-size: clamp(1rem, 1.4vw, 1.25rem);
            color: var(--text-body);
            max-width: 650px;
            margin-bottom: 40px;
            line-height: 1.6;
          }

          .hero-search-bar {
            background: var(--bg-input);
            border: 1px solid var(--border-strong);
            backdrop-filter: blur(25px);
            border-radius: 22px;
            padding: 10px;
            display: flex;
            align-items: center;
            max-width: 900px;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hero-search-bar:focus-within {
            border-color: var(--accent-primary);
            box-shadow: 0 0 25px var(--accent-glow);
            background: rgba(255,255,255,0.12);
          }

          .h-input-group { display: flex; align-items: center; flex: 1; padding: 0 18px; }
          .h-input-group input {
            background: transparent;
            border: none;
            color: var(--text-body);
            padding: 14px 0;
            width: 100%;
            outline: none;
            font-size: 1rem;
            font-weight: 500;
          }
          .h-input-group input::placeholder { color: rgba(255,255,255,0.4); }

          .h-divider { width: 1px; height: 40px; background: var(--border-strong); }

          .h-search-btn {
            background: var(--accent-primary);
            color: var(--text-heading);
            border: none;
            padding: 16px 40px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 1.05rem;
            cursor: pointer;
            transition: 0.3s;
          }
          .h-search-btn:hover { background: var(--accent-hover); transform: scale(1.02); }

          .h-slider-row { position: relative; z-index: 10; width: 100vw; margin-top: 45px; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); overflow: hidden; mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
          .h-track { display: flex; gap: 15px; width: max-content; animation: h-scroll 60s linear infinite; }
          @keyframes h-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

          .h-pill {
            background: var(--bg-card);
            border: 1px solid var(--border-strong);
            padding: 11px 26px;
            border-radius: 100px;
            color: var(--text-body);
            font-size: 0.9rem;
            white-space: nowrap;
            cursor: pointer;
            transition: 0.3s ease;
            backdrop-filter: blur(10px);
          }
          .h-pill:hover { 
            background: var(--accent-primary); 
            border-color: var(--accent-primary); 
            color: var(--text-heading);
            transform: translateY(-4px);
          }

          .h-dots-container {
            position: absolute;
            bottom: 45px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 14px;
            z-index: 100;
          }
          .h-dot {
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.25);
            border-radius: 50%;
            cursor: pointer;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .h-dot.active {
            background: var(--accent-primary);
            width: 38px;
            border-radius: 20px;
            box-shadow: 0 0 20px var(--accent-glow);
          }

          .h-play-pause {
            position: absolute;
            bottom: 35px;
            right: 6%;
            z-index: 100;
            background: var(--bg-input);
            border: 1px solid rgba(255,255,255,0.2);
            color: var(--text-body);
            width: 50px; height: 50px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(10px);
          }

          @media (max-width: 768px) {
            .hero-main-container { padding: 60px 0; text-align: center; }
            .hero-content { padding: 0 5%; }
            .hero-h1 { font-size: 2.5rem; margin-bottom: 15px; }
            .hero-p { margin: 0 auto 30px auto; font-size: 1rem; }
            .hero-search-bar { flex-direction: column; border-radius: 28px; padding: 12px; gap: 5px; }
            .h-input-group { width: 100%; padding: 5px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .h-input-group:nth-child(3) { border-bottom: none; }
            .h-divider { display: none; }
            .h-search-btn { width: 100%; margin-top: 10px; padding: 16px; font-size: 1.1rem; border-radius: 20px; }
            .h-slider-row { margin-top: 35px; }
            .h-pill { padding: 9px 20px; font-size: 0.85rem; }
            .h-dots-container { bottom: 25px; }
            .h-play-pause { bottom: 20px; right: 50%; transform: translateX(110px); width: 40px; height: 40px; }
          }
        `}
      </style>

      <section className="hero-main-container">
        <div className="hero-video-engine">
          {INDEX_VIDEO_SOURCES.map((src, i) => (
            <div key={i} className="v-layer" style={{ opacity: i === activeVideoIdx ? 1 : 0 }}>
              <VideoPlayer 
                src={src} 
                isActive={i === activeVideoIdx} 
                isPlaying={isPlaying} 
                onVideoEnd={handleNextVideo} 
              />
            </div>
          ))}
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-h1">
            Find the Business, <span>Get Paid,</span> <br className="d-none d-lg-block" />
            Grow Your <span>Career</span>
          </h1>

          <p className="hero-p">
            Join Pakistan's premier freelance ecosystem. Connect with world-class clients, 
            discover daily opportunities, and build your professional legacy.
          </p>

          <form onSubmit={handleSearch}>
            <div className="hero-search-bar">
              <div className="h-input-group">
                <RiSearchLine size={22} color="var(--accent-primary)" />
                <input 
                  type="text" value={search} onChange={(e)=>setSearch(e.target.value)}
                  placeholder="Job title or skill..." required 
                />
              </div>
              <div className="h-divider"></div>
              <div className="h-input-group">
                <GoLocation size={22} color="var(--accent-primary)" />
                <input 
                  type="text" value={location} onChange={(e)=>setLocation(e.target.value)}
                  placeholder="City or Province" 
                />
              </div>
              <button type="submit" className="h-search-btn">Search Gigs</button>
            </div>
          </form>

          <div className="h-slider-row">
            <div className="h-track">
              {[...HERO_CATEGORIES, ...HERO_CATEGORIES].map((cat, idx) => (
                <div key={idx} className="h-pill" onClick={() => handleCategoryClick(cat)}>
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-dots-container">
          {INDEX_VIDEO_SOURCES.map((_, i) => (
            <div 
              key={i} 
              className={`h-dot ${i === activeVideoIdx ? 'active' : ''}`}
              onClick={() => setActiveVideoIdx(i)}
            />
          ))}
        </div>

        <div className="h-play-pause" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} style={{marginLeft: '2px'}} />}
        </div>
      </section>
    </>
  );
};

export default HeroSection;