import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import { 
  FiCheckCircle, FiFileText, FiSend, FiUserCheck, 
  FiLock, FiSearch, FiMessageSquare, FiCheckSquare, 
  FiDollarSign, FiPercent, FiShield, FiClock, FiStar
} from "react-icons/fi";
import videoImg from "../assets/aboutSlideImg.webp";
import Experienced from "../assets/Experienced.webp";
import line from "../assets/line.webp";
import ourMission from "../assets/OurMission.webp";
import skill from "../assets/skillProvider.webp";
import support from "../assets/support.webp";
import videoPlay from "../assets/VideoPlay.webp";
import Client from "../components/Client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Story from "../components/Story";

// PERF: Module-level video list + autoplay tick – avoid recreating on each render
const ABOUT_VIDEOS = [
  "/video/Freeelance1.mp4",
  "/video/Freeelance6.mp4",
  "/video/Freeelance7.mp4"
];

function carouselAutoplayTick() {
  try {
    const nextButton = document.querySelector('[data-bs-slide="next"]');
    if (nextButton && !nextButton.disabled) nextButton.click();
  } catch (error) {
    console.error('Carousel autoplay error:', error);
  }
}

// PERF: VideoPlayer at module level – avoids remount when AboutUS re-renders (e.g. slider state)
const VideoPlayer = ({ src, className = "", style = {}, controls = false, videoName = "video", fallbackImage = videoImg }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (event) => {
    console.error(`Video loading error for ${videoName}:`, event);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log(`${videoName} loaded successfully`);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={`${className} video-fallback`}
        style={{ ...style, backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', minHeight: '300px' }}
      >
        {fallbackImage ? (
          <img src={fallbackImage} alt="Video not available" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <div className="text-center">
            <p>Video unavailable</p>
            <small style={{ fontSize: "0.7rem", opacity: 0.5 }}>{src}</small>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="video-container h-100" style={{ position: 'relative' }}>
      {isLoading && (
        <div className="video-loading" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', zIndex: 1 }}>
          <div style={{ width: "30px", height: "30px", border: "3px solid rgba(240, 89, 31, 0.3)", borderTop: "3px solid #f0591f", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        </div>
      )}
      <video
        className={className}
        width="100%"
        height="100%"
        style={{ ...style, objectFit: "cover", opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
        muted
        loop
        autoPlay={!controls}
        controls={controls}
        preload="metadata"
        onError={handleError}
        onLoadedData={handleLoad}
        onCanPlay={handleLoad}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const AboutUS = () => {
  // Fixed statistics values as requested
  const stats = [
    { label: "Project Success Ratio", value: 75, icon: "🚀", color: "#f0591f" },
    { label: "Client Satisfaction", value: 80, icon: "❤️", color: "#3b82f6" },
    { label: "Client & Freelancers Relation", value: 75, icon: "🤝", color: "#10b981" },
    { label: "Expert Team", value: 90, icon: "⭐", color: "#a855f7" }
  ];

  useEffect(() => {
    let interval;
    try {
      interval = setInterval(carouselAutoplayTick, 5000);
    } catch (error) {
      console.error('Error setting up carousel interval:', error);
    }
    return () => { if (interval) clearInterval(interval); };
  }, []);

  // Fixed: Accessibility improvements and semantic HTML
  return (
    <div style={{ backgroundColor: "#020617", color: "#a1a1aa", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar SecondNav="none" />
      
      {/* Ultimate Premium Hero Section */}
      <section 
        className="container-fluid position-relative d-flex align-items-center justify-content-center"
        style={{ minHeight: "85vh", padding: "120px 0 80px 0" }}
        aria-label="About us introduction"
      >
        {/* Abstract Background Elements */}
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "70%", background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)", filter: "blur(60px)" }}></div>
          <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "70%", background: "radial-gradient(circle, rgba(240, 89, 31, 0.15) 0%, transparent 70%)", filter: "blur(60px)" }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6 col-md-12 mb-5 mb-lg-0 text-center text-lg-start">
              
              <div className="d-inline-flex align-items-center gap-2 px-4 py-2 mb-4" style={{ background: "rgba(240, 89, 31, 0.1)", border: "1px solid rgba(240, 89, 31, 0.2)", borderRadius: "50px", backdropFilter: "blur(10px)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f0591f", boxShadow: "0 0 10px #f0591f" }}></span>
                <span style={{ color: "#f0591f", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Welcome to GrapeTask</span>
              </div>

              <h1 className="fw-bolder mb-4 cocon" style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)", color: "#ffffff", lineHeight: "1.1", letterSpacing: "-1px" }}>
                Connecting <br className="d-none d-lg-block" />
                <span style={{ color: "#f0591f", position: "relative", display: "inline-block" }}>
                  Talent
                  <div style={{ position: "absolute", bottom: "5px", left: "0", width: "100%", height: "12px", background: "rgba(240, 89, 31, 0.2)", zIndex: -1, transform: "rotate(-2deg)" }}></div>
                </span> With <br className="d-none d-lg-block" /> Opportunity.
              </h1>
              
              <p className="mb-5 poppins" style={{ color: "#d4d4d8", fontSize: "1.2rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto 0 0" }}>
                GrapeTask is a Pakistan-based, completely structured freelancing platform designed to perfectly simplify project management and strongly empower digital talent across the globe.
              </p>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4">
                <button className="btn fw-bold px-5 py-3 poppins" style={{ background: "linear-gradient(135deg, #f0591f 0%, #d94a15 100%)", color: "#ffffff", borderRadius: "12px", fontSize: "1.1rem", border: "none", boxShadow: "0 10px 30px rgba(240, 89, 31, 0.3)", transition: "all 0.3s ease" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                  Join Our Network
                </button>
                <button className="btn fw-bold px-5 py-3 poppins" style={{ background: "rgba(255, 255, 255, 0.05)", color: "#ffffff", borderRadius: "12px", fontSize: "1.1rem", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Discover More
                </button>
              </div>

            </div>
            
            {/* Premium Video Showcase on Right */}
            <div className="col-lg-6 col-md-10 mx-auto mt-5 mt-lg-0">
              <div className="position-relative w-100 p-2 rounded-4" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
                {/* Minimalist 16:9 Video Container */}
                <div style={{ borderRadius: "16px", overflow: "hidden", position: "relative", aspectRatio: "16/9", background: "#020617" }}>
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade h-100 w-100"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner h-100">
                      {ABOUT_VIDEOS.map((video, index) => (
                        <div
                          key={video}
                          className={`carousel-item h-100 ${index === 0 ? 'active' : ''}`}
                        >
                          <VideoPlayer
                            src={video}
                            style={{ objectPosition: "center", objectFit: "cover" }}
                            videoName={`video${index + 1}`}
                            fallbackImage={videoImg}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Decorative floating badge overlapping the frame safely */}
                <div className="position-absolute d-flex align-items-center gap-3 p-2 px-3 rounded-5" style={{ bottom: "-15px", left: "20px", background: "rgba(2, 6, 23, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", zIndex: 2, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}>
                  <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: "25px", height: "25px" }}><FiCheckCircle size={14} /></div>
                  <div className="poppins pe-2">
                    <h6 className="mb-0 fw-bold text-white" style={{ fontSize: "0.85rem" }}>100% Verified Global Talent</h6>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation Tabs (Minimalist Elegant UI) */}
      <section className="container-fluid poppins py-5" aria-label="About us sections">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
          <nav aria-label="About us content navigation" className="position-relative z-2">
              <div className="d-flex justify-content-center mb-5">
                {/* Glassmorphism Container */}
                <div 
                  className="p-2" 
                  style={{ 
                    background: "rgba(15, 23, 42, 0.5)", 
                    backdropFilter: "blur(15px)", 
                    border: "1px solid rgba(255, 255, 255, 0.08)", 
                    borderRadius: "60px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.02)"
                  }}
                >
                  <ul
                    className="nav nav-pills d-inline-flex position-relative m-0"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active d-flex align-items-center justify-content-center gap-2 fw-bold px-4 px-md-5 py-3"
                        id="pills-story-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-story"
                        type="button"
                        role="tab"
                        aria-controls="pills-story"
                        aria-selected="true"
                      >
                        <FiStar size={18} className="tab-icon" /> About GrapeTask
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            
            {/* Super Smooth Animations & Gradients */}
            <style>{`
              .nav-pills .nav-link {
                background: transparent;
                border: 1px solid transparent;
                color: #a1a1aa;
                border-radius: 50px;
                font-size: 1.1rem;
                letter-spacing: 0.5px;
                transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
              }
              
              .nav-pills .nav-link .tab-icon {
                opacity: 0.7;
                transition: all 0.3s ease;
              }

              /* Active Tab Premium Look */
              .nav-pills .nav-link.active {
                background: linear-gradient(135deg, #f0591f 0%, #c2410c 100%) !important;
                color: #ffffff !important;
                border: 1px solid rgba(255, 150, 100, 0.3);
                box-shadow: 0 10px 25px rgba(240, 89, 31, 0.4), inset 0 2px 4px rgba(255,255,255,0.2) !important;
                transform: translateY(-3px);
              }

              .nav-pills .nav-link.active .tab-icon {
                opacity: 1;
                transform: scale(1.1);
              }

              /* Inactive Tab Hover Effect */
              .nav-pills .nav-link:hover:not(.active) {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.05);
                transform: translateY(-2px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
              }

              .nav-pills .nav-link:hover:not(.active) .tab-icon {
                opacity: 1;
              }
            `}</style>
            
            <div className="tab-content mt-5" id="pills-tabContent">
              {/* MAIN ABOUT TAB */}
              <div
                className="tab-pane fade show active"
                id="pills-story"
                role="tabpanel"
                aria-labelledby="pills-story-tab"
                tabIndex={0}
              >
                
                {/* Ultimate Core Mission */}
                <div className="mb-5 pb-5">
                  <div className="text-center mb-5">
                    <h2 className="fw-bolder mb-3 text-white cocon" style={{ fontSize: "2.8rem" }}>Our Core Mission</h2>
                    <p className="mx-auto poppins" style={{ color: "#a1a1aa", fontSize: "1.15rem", maxWidth: "600px" }}>
                      Bridging the gap between Clients and Freelancers through professional coordination, ensuring quality, speed, and absolute trust.
                    </p>
                  </div>
                  
                  <div className="row g-4 justify-content-center">
                    {[
                      { icon: "0%", title: "Zero-Fee for Clients", desc: "Provide completely zero-fee services for Clients, ensuring cost-effective project execution.", color: "#10b981" },
                      { icon: "⚡", title: "Blazing Fast Payouts", desc: "Offer exceptionally fast and reliable payouts for all Freelancers to keep motivation high.", color: "#3b82f6" },
                      { icon: "🛡️", title: "Structured Management", desc: "Create tightly structured project management utilizing experienced Business Developers.", color: "#a855f7" }
                    ].map((item, idx) => (
                      <div key={idx} className="col-lg-4 col-md-6">
                        <div className="card h-100 p-4 p-xl-5 border-0 text-center rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05) !important", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.borderColor = `rgba(${parseInt(item.color.slice(1,3),16)}, ${parseInt(item.color.slice(3,5),16)}, ${parseInt(item.color.slice(5,7),16)}, 0.3) !important`; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05) !important"; }}>
                          <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-4 mx-auto" style={{ width: "80px", height: "80px", background: `rgba(${parseInt(item.color.slice(1,3),16)}, ${parseInt(item.color.slice(3,5),16)}, ${parseInt(item.color.slice(5,7),16)}, 0.1)`, color: item.color, fontSize: "2rem", fontWeight: "900" }}>
                            {item.icon}
                          </div>
                          <h4 className="fw-bold text-white mb-3">{item.title}</h4>
                          <p className="mb-0" style={{ color: "#a1a1aa", lineHeight: "1.7" }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ultimate How GrapeTask Works */}
                <div className="mb-5 pb-5">
                  <div className="text-center mb-5">
                    <span style={{ display: "inline-block", padding: "8px 20px", background: "rgba(240, 89, 31, 0.1)", color: "#f0591f", borderRadius: "30px", fontWeight: "700", letterSpacing: "1px", border: "1px solid rgba(240, 89, 31, 0.2)", marginBottom: "20px" }}>
                      SIMPLE PROCESS
                    </span>
                    <h2 className="fw-bolder mb-3 text-white cocon" style={{ fontSize: "2.8rem" }}>How GrapeTask Works</h2>
                    <p className="mx-auto poppins" style={{ color: "#a1a1aa", fontSize: "1.15rem", maxWidth: "700px" }}>
                      Our system securely connects Clients, Business Developers (BDs), and Freelancers in a smooth, highly professional workflow.
                    </p>
                  </div>

                  <div className="row g-4 justify-content-center">
                    {[
                      { step: "1", title: "Client Posts a Job", desc: "The Client defines project requirements, budget, and timeline. It becomes visible to relevant Business Developers." },
                      { step: "2", title: "BDs Send Requests", desc: "Business Developers analyze scope and feasibility before applying. They cannot overcharge beyond the defined structure." },
                      { step: "3", title: "Client Selects a BD", desc: "The Client reviews all requests and selects the Business Developer they trust most. Direct communication starts." },
                      { step: "4", title: "Payment Hold", desc: "Payment is made to GrapeTask, not directly. Funds are securely held until work is completed and approved." },
                      { step: "5", title: "BD Hires a Freelancer", desc: "BD searches for qualified Freelancers based on skills and budget compatibility. Fixed 20% commission applies." },
                      { step: "6", title: "Freelancer Comm.", desc: "BD assigns project to the most suitable Freelancer. A separate internal order is successfully created." },
                      { step: "7", title: "Work Delivery", desc: "Freelancer delivers work to BD. BD reviews and submits to Client. Only after approval does it complete." },
                    ].map((item, i) => (
                      <div key={i} className="col-md-6 col-lg-3">
                        <div className="card h-100 p-4 border-0 position-relative overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05) !important", borderRadius: "20px", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1) !important"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05) !important"; }}>
                          <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "10rem", color: "rgba(255,255,255,0.02)", fontWeight: "900", lineHeight: "1", zIndex: 0 }}>{item.step}</div>
                          <div className="position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex align-items-center mb-4 gap-3">
                              <div className="d-flex justify-content-center align-items-center fw-bolder" style={{ width: "45px", height: "45px", background: "rgba(255, 255, 255, 0.1)", color: "#ffffff", borderRadius: "12px", fontSize: "1.3rem" }}>
                                {item.step}
                              </div>
                            </div>
                            <h5 className="fw-bold mb-3 text-white" style={{ fontSize: "1.1rem" }}>{item.title}</h5>
                            <p className="mb-0" style={{ color: "#a1a1aa", lineHeight: "1.6", fontSize: "0.95rem" }}>{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Ultimate Step 8 */}
                    <div className="col-md-6 col-lg-3">
                      <div className="card h-100 p-4 border-0 position-relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(240, 89, 31, 0.15) 0%, rgba(240, 89, 31, 0.05) 100%)", border: "1px solid rgba(240, 89, 31, 0.4) !important", borderRadius: "20px", boxShadow: "0 10px 30px rgba(240, 89, 31, 0.15)" }}>
                        <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "10rem", fontWeight: "900", color: "rgba(240, 89, 31, 0.05)", zIndex: 0 }}>8</div>
                        <div className="position-relative" style={{ zIndex: 1 }}>
                          <div className="d-flex align-items-center mb-4 gap-3">
                            <div className="d-flex justify-content-center align-items-center fw-bolder" style={{ width: "45px", height: "45px", background: "linear-gradient(135deg, #f0591f 0%, #d94a15 100%)", color: "#ffffff", borderRadius: "12px", fontSize: "1.3rem", boxShadow: "0 5px 15px rgba(240, 89, 31, 0.4)" }}>
                              8
                            </div>
                          </div>
                          <h5 className="fw-bold mb-3" style={{ color: "#f0591f", fontSize: "1.1rem" }}>Reviews & Fast Payouts</h5>
                          <p className="mb-0" style={{ color: "#d4d4d8", lineHeight: "1.6", fontSize: "0.95rem" }}>Client reviews BD. BD reviews Freelancer. Freelancer receives secure payment within just 3 days.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ultimate Payments Section */}
                <div className="card border-0 overflow-hidden rounded-4 mb-5" style={{ background: "rgba(255, 255, 255, 0.015)", border: "1px solid rgba(255, 255, 255, 0.06) !important" }}>
                  <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-5">
                      <span style={{ display: "inline-block", padding: "8px 20px", background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", borderRadius: "30px", fontWeight: "700", letterSpacing: "1px", border: "1px solid rgba(168, 85, 247, 0.2)", marginBottom: "20px" }}>
                        100% TRANSPARENT
                      </span>
                      <h2 className="fw-bolder mb-3 text-white cocon" style={{ fontSize: "2.8rem" }}>Payments, Fees & Withdrawals</h2>
                      <p className="mx-auto poppins" style={{ color: "#a1a1aa", fontSize: "1.15rem", maxWidth: "600px" }}>
                        Transparent policies, zero hidden charges, and ultra-fast secure payouts.
                      </p>
                    </div>

                    <div className="row g-4 mb-5">
                      <div className="col-md-4">
                        <div className="text-center p-4 p-xl-5 h-100 rounded-4 position-relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)", borderTop: "4px solid #3b82f6" }}>
                          <div className="d-flex justify-content-center mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "70px", height: "70px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                              <FiUserCheck size={32} />
                            </div>
                          </div>
                          <h4 className="fw-bold text-white mb-2" style={{ fontSize: "1.8rem" }}>Clients: <span style={{ color: "#3b82f6" }}>0%</span></h4>
                          <p className="mb-0" style={{ color: "#a1a1aa" }}>Absolutely no service fee</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-4 p-xl-5 h-100 rounded-4 position-relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(240, 89, 31, 0.1) 0%, transparent 100%)", borderTop: "4px solid #f0591f" }}>
                          <div className="d-flex justify-content-center mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "70px", height: "70px", background: "rgba(240, 89, 31, 0.1)", color: "#f0591f" }}>
                              <FiPercent size={32} />
                            </div>
                          </div>
                          <h4 className="fw-bold text-white mb-2" style={{ fontSize: "1.8rem" }}>Freelancers: <span style={{ color: "#f0591f" }}>10%</span></h4>
                          <p className="mb-0" style={{ color: "#a1a1aa" }}>Low and transparent platform fee</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-4 p-xl-5 h-100 rounded-4 position-relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)", borderTop: "4px solid #a855f7" }}>
                          <div className="d-flex justify-content-center mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "70px", height: "70px", background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                              <FiStar size={32} />
                            </div>
                          </div>
                          <h4 className="fw-bold text-white mb-2" style={{ fontSize: "1.8rem" }}>BDs: <span style={{ color: "#a855f7" }}>20%</span></h4>
                          <p className="mb-0" style={{ color: "#a1a1aa" }}>Fixed margin commission structure</p>
                        </div>
                      </div>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="p-4 p-lg-5 h-100 rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "50px", height: "50px", background: "rgba(240, 89, 31, 0.1)", color: "#f0591f" }}>
                              <FiClock size={24} />
                            </div>
                            <h4 className="fw-bold text-white mb-0" style={{ fontSize: "1.4rem" }}>Withdrawal Timeline</h4>
                          </div>
                          <ul className="list-unstyled mb-0">
                            <li className="d-flex align-items-center gap-3 mb-3">
                              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", background: "rgba(240, 89, 31, 0.2)", color: "#f0591f" }}>✓</div>
                              <span style={{ color: "#d4d4d8", fontSize: "1.1rem" }}>Payments are released within <strong className="text-white">3 days</strong></span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", background: "rgba(240, 89, 31, 0.2)", color: "#f0591f" }}>✓</div>
                              <span style={{ color: "#d4d4d8", fontSize: "1.1rem" }}>Faster than most global freelancing platforms</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-4 p-lg-5 h-100 rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "50px", height: "50px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                              <FiShield size={24} />
                            </div>
                            <h4 className="fw-bold text-white mb-0" style={{ fontSize: "1.4rem" }}>Secure Transactions</h4>
                          </div>
                          <ul className="list-unstyled mb-0">
                            <li className="d-flex align-items-center gap-3 mb-3">
                              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" }}>✓</div>
                              <span style={{ color: "#d4d4d8", fontSize: "1.1rem" }}>Funds are held securely until project is done</span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" }}>✓</div>
                              <span style={{ color: "#d4d4d8", fontSize: "1.1rem" }}>Transparent payment tracking for all users</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Story />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Mission Section */}
      <section className="container mt-5 pt-5 pb-5 poppins position-relative" aria-label="Our mission" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div style={{ position: "absolute", top: "30%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>
        
        <div className="text-center mb-5 position-relative" style={{ zIndex: 1 }}>
          <span style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#a855f7", borderRadius: "30px", fontSize: "14px", fontWeight: "600", marginBottom: "15px", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
            OUR VISION
          </span>
          <h2 className="fw-bolder mb-3 cocon" style={{ fontSize: "2.8rem", color: "#ffffff" }}>
            The GrapeTask Mission
          </h2>
          <p className="mx-auto" style={{ color: "#a1a1aa", maxWidth: "600px", fontSize: "1.15rem" }}>
            Empowering individuals and businesses globally to collaborate, create, and succeed without boundaries.
          </p>
        </div>

        <div className="row mt-5 align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-6 col-12 mb-5 mb-lg-0 pe-lg-5">
            <div className="p-4 p-xl-5 h-100" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
              <h3 className="fw-bold mb-4 text-white" style={{ fontSize: "1.8rem" }}>Core Principles</h3>
              
              <div className="d-flex flex-column gap-4">
                {[
                  { icon: "🌍", text: "Providing a trusted freelance marketplace for people to find self-employed jobs globally." },
                  { icon: "⚡", text: "Making outsourcing services easy and efficient for businesses of all sizes." },
                  { icon: "🛡️", text: "Prioritizing safety with secure payments, building unmatched trust on our platform." },
                  { icon: "🚀", text: "Dedicated to creating opportunities, supporting growth, and encouraging independence." }
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-start gap-4 p-3 rounded-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.transform = "translateX(5px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "50px", height: "50px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", fontSize: "1.5rem" }}>
                      {item.icon}
                    </div>
                    <p className="mb-0" style={{ color: "#d4d4d8", fontSize: "1.1rem", lineHeight: "1.6" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <div className="position-relative">
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "150px", height: "150px", background: "rgba(240, 89, 31, 0.15)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0 }}></div>
              <img 
                src={ourMission} 
                className="w-100 rounded-4" 
                alt="Our mission illustration" 
                style={{ position: "relative", zIndex: 1, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                loading="lazy"
                decoding="async"
              />
              
              {/* Floating feature card 1 */}
              <div className="position-absolute d-none d-md-flex align-items-center gap-3 p-3 rounded-4" style={{ bottom: "10%", left: "-10%", background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", zIndex: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
                <img src={skill} width={45} height={45} alt="Skill services" />
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "#ffffff", fontSize: "1rem" }}>Skill Services</h6>
                  <span style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Top rated talent</span>
                </div>
              </div>
              
              {/* Floating feature card 2 */}
              <div className="position-absolute d-none d-md-flex align-items-center gap-3 p-3 rounded-4" style={{ top: "10%", right: "-10%", background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", zIndex: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
                <img src={support} width={45} height={45} alt="Urgent support" />
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "#ffffff", fontSize: "1rem" }}>24/7 Support</h6>
                  <span style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Always here for you</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Experience Section */}
      <section className="container mt-5 pt-5 pb-5 poppins" aria-label="Our experience and statistics" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="row align-items-center mb-5">
          <div className="col-lg-5 mb-5 mb-lg-0">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "150px", height: "150px", backgroundColor: "rgba(240, 89, 31, 0.15)", borderRadius: "50%", filter: "blur(40px)" }}></div>
              <img 
                src={Experienced} 
                className="w-100 rounded-4 shadow-lg" 
                alt="Grapetask experienced professionals" 
                style={{ border: "1px solid rgba(255, 255, 255, 0.1)", position: "relative", zIndex: 2 }}
                loading="lazy"
                decoding="async"
              />
              <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "200px", height: "200px", backgroundColor: "rgba(59, 130, 246, 0.15)", borderRadius: "50%", filter: "blur(50px)" }}></div>
            </div>
          </div>
          <div className="col-lg-7 ps-lg-5">
            <div style={{ display: "inline-block", padding: "8px 20px", backgroundColor: "rgba(240, 89, 31, 0.1)", color: "#f0591f", borderRadius: "30px", fontSize: "14px", fontWeight: "700", marginBottom: "20px", border: "1px solid rgba(240, 89, 31, 0.2)", letterSpacing: "1px" }}>
              EXPERIENCE & STATISTICS
            </div>
            <h3 className="font-40 fw-bold mb-4 cocon" style={{ color: "#ffffff", fontSize: "2.8rem", lineHeight: "1.2" }}>
              Work with Highly <br className="d-none d-md-block" /> <span style={{ color: "#f0591f" }}>Experienced</span> Pros
            </h3>
            <p className="mb-5" style={{ color: "#a1a1aa", fontSize: "1.15rem", lineHeight: "1.8" }}>
              At Grapetask, we specialize in connecting businesses with skilled freelancers 
              through our trusted freelance marketplace. With years of experience in outsourcing 
              services, we understand the needs of both employers and freelancers. Our online 
              freelancing platform makes it easy to hire freelancers for any project, big or small.
            </p>
            
            <div className="row g-4">
              {stats.map((stat, index) => (
                <div key={index} className="col-md-6">
                  <div className="card h-100 p-4 border-0 position-relative overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05) !important", borderRadius: "20px", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)"; }}>
                    <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: `radial-gradient(circle, ${stat.color}33 0%, transparent 70%)`, filter: "blur(20px)", zIndex: 0 }}></div>
                    <div className="position-relative" style={{ zIndex: 1 }}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex justify-content-center align-items-center rounded-3" style={{ width: "45px", height: "45px", background: `rgba(${parseInt(stat.color.slice(1,3),16)}, ${parseInt(stat.color.slice(3,5),16)}, ${parseInt(stat.color.slice(5,7),16)}, 0.1)`, fontSize: "1.5rem" }}>
                            {stat.icon}
                          </div>
                          <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "1.1rem" }}>{stat.label}</span>
                        </div>
                        <span style={{ color: stat.color, fontWeight: "900", fontSize: "1.6rem", textShadow: `0 0 15px ${stat.color}66` }}>{stat.value}%</span>
                      </div>
                      
                      {/* Premium Custom Progress Bar */}
                      <div style={{ width: "100%", height: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                        <div style={{ 
                          width: `${stat.value}%`, 
                          height: "100%", 
                          background: `linear-gradient(90deg, ${stat.color}88 0%, ${stat.color} 100%)`, 
                          borderRadius: "10px",
                          boxShadow: `0 0 10px ${stat.color}88`,
                          transition: "width 1.5s cubic-bezier(0.22, 1, 0.36, 1)" 
                        }}>
                          {/* Shimmer effect */}
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                            animation: "shimmer 2s infinite"
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}</style>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUS;
