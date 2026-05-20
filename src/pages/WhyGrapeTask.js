import React from "react";
import assist from "../assets/Whygraptask-hero-img.webp";
import whyimg from "../assets/why-grap-img2.webp";
import proposl from "../assets/proposl.webp";
import togwork from "../assets/togwork.webp";
import thnks from "../assets/thanks.webp";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import lines from "../assets/line.webp";
import { Link } from "react-router-dom";
import { SiFuturelearn } from "react-icons/si";
import { FaChevronRight, FaCode, FaHandshake, FaProjectDiagram } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { MessageSquare, Users, Award, Star } from "lucide-react";
import Flexibility from "../assets/flexible.webp";
import Independence from "../assets/Independence.webp";
const WhyGrapeTask = () => {
  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#a1a1aa", overflowX: "hidden" }}>
      <Navbar SecondNav="none" />
      
      {/* Premium Hero Section */}
      <div className="container-fluid position-relative d-flex align-items-center why-grape-herosection" style={{ padding: "80px 0" }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: "40%", height: "60%", background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "40%", height: "60%", background: "radial-gradient(circle, rgba(240, 89, 31, 0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 px-lg-4 px-3 mb-5 mb-lg-0">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4" style={{ background: "rgba(240, 89, 31, 0.1)", border: "1px solid rgba(240, 89, 31, 0.2)", borderRadius: "50px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f0591f", boxShadow: "0 0 10px #f0591f" }}></span>
                <span style={{ color: "#f0591f", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>Transform Your Career</span>
              </div>
              <h1 className="fw-bolder cocon" style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)", color: "#ffffff", lineHeight: "1.2", letterSpacing: "-1px", marginBottom: "30px" }}>
                How Can Grape<span style={{ color: "#f0591f" }}>Task</span> assist <br className="d-none d-xl-block" /> you in Your Freelancing <br className="d-none d-xl-block" /> Business?
              </h1>
              <p className="poppins mb-5" style={{ fontSize: "1.15rem", color: "#d4d4d8", lineHeight: "1.7", maxWidth: "600px" }}>
                Empowering independent professionals and agencies with the tools, network, and completely structured environment needed to scale successfully.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn px-5 py-3 fw-bold" style={{ backgroundColor: "#f0591f", color: "#ffffff", borderRadius: "12px", border: "none", boxShadow: "0 10px 20px rgba(240, 89, 31, 0.3)", transition: "all 0.3s ease" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>Get Started</Link>
                <Link to="/aboutus" className="btn px-5 py-3 fw-bold" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#ffffff", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>Learn More</Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 text-center">
              <div className="position-relative d-inline-block">
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", height: "90%", background: "linear-gradient(135deg, rgba(240, 89, 31, 0.2) 0%, transparent 100%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0 }}></div>
                <img src={assist} className="img-fluid position-relative" alt="Hero illustration" style={{ zIndex: 1, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))", maxWidth: "90%" }} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Why GrapeTask Section */}
      <div className="container-fluid position-relative py-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.01)", borderTop: "1px solid rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
        <div className="container py-4">
          <div className="text-center mb-5 pb-3">
            <span style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "30px", fontSize: "14px", fontWeight: "600", marginBottom: "15px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              CORE BENEFITS
            </span>
            <h3 className="font-40 fw-bolder cocon text-white mb-3">Why GrapeTask?</h3>
            <p className="mx-auto" style={{ color: "#a1a1aa", maxWidth: "600px", fontSize: "1.1rem" }}>Discover the unmatched advantages of using our completely optimized and structured platform.</p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-5 col-12 mb-5 mb-lg-0 text-center text-lg-start">
              <div className="position-relative d-inline-block">
                <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%", background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }}></div>
                <img src={whyimg} alt="Why GrapeTask" className="img-fluid rounded-4 position-relative" style={{ zIndex: 1, border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }} loading="lazy" decoding="async" />
              </div>
            </div>
            
            <div className="col-lg-7 col-12 ps-lg-5">
              <div className="row g-4">
                {[
                  { icon: <SiFuturelearn size={24} />, title: "Earning Potential", color: "#3b82f6", desc: "Leverage your expertise to attract high-paying clients and substantially increase your income potential." },
                  { icon: <img src={Flexibility} width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} alt="flex" />, title: "Flexibility", color: "#f0591f", desc: "Enjoy the freedom to choose your own schedule, work from anywhere, and achieve a better work-life balance." },
                  { icon: <img src={Independence} width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} alt="indep" />, title: "Independence", color: "#10b981", desc: "Be your own boss, make definitive decisions, and have full unparalleled control over your career path." },
                  { icon: <MdOutlineAccountBalanceWallet size={24} />, title: "Work-Life Balance", color: "#8b5cf6", desc: "Prioritize personal commitments, completely avoid long commutes, and have more time for family." },
                  { icon: <FaCode size={24} />, title: "Skill Development", color: "#ec4899", desc: "Continuously learn and adapt to new projects, technologies, and client requirements seamlessly." },
                  { icon: <FaProjectDiagram size={24} />, title: "Variety of Projects", color: "#eab308", desc: "Explore diverse projects and clients across industries, rapidly expanding your professional network." }
                ].map((feature, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="card h-100 p-4 border-0" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04) !important", borderRadius: "20px", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.borderColor = `rgba(${parseInt(feature.color.slice(1,3),16)}, ${parseInt(feature.color.slice(3,5),16)}, ${parseInt(feature.color.slice(5,7),16)}, 0.3) !important`; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04) !important"; }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", borderRadius: "14px", background: `rgba(${parseInt(feature.color.slice(1,3),16)}, ${parseInt(feature.color.slice(3,5),16)}, ${parseInt(feature.color.slice(5,7),16)}, 0.1)`, color: feature.color }}>
                          {feature.icon}
                        </div>
                      </div>
                      <h5 className="fw-bold mb-2 poppins" style={{ color: "#ffffff", fontSize: "1.15rem" }}>{feature.title}</h5>
                      <p className="mb-0 poppins" style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: "1.6" }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Premium How GrapeTask Works & BD Role */}
      <div className="container-fluid py-5 poppins">
        <div className="container-lg py-5">
          <div className="row justify-content-center text-center mb-5 pb-3">
            <div className="col-lg-8">
              <span style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(240, 89, 31, 0.1)", color: "#f0591f", borderRadius: "30px", fontSize: "14px", fontWeight: "600", marginBottom: "15px", border: "1px solid rgba(240, 89, 31, 0.2)" }}>
                PROFESSIONAL WORKFLOW
              </span>
              <h2 className="font-40 fw-bolder cocon text-white mb-3">How GrapeTask Works</h2>
              <p className="text-center mx-auto mb-0" style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "700px" }}>
                GrapeTask is a highly structured platform connecting Clients, Business Developers (BDs), and Freelancers in a secure workflow.
              </p>
            </div>
          </div>

          {/* Business Developer Role Section */}
          <div className="row justify-content-center mb-5 pb-5">
            <div className="col-12 text-center mb-5">
              <h3 className="font-30 fw-bold text-white mb-3">Role of a Business Developer on GrapeTask</h3>
              <p className="mx-auto" style={{ color: "#a1a1aa", fontSize: "1.05rem", maxWidth: "600px" }}>
                Business Developers act as the vital bridge ensuring top-tier quality and flawless coordination.
              </p>
            </div>
            
            <div className="col-lg-10">
              <div className="row g-4">
                {[
                  { icon: <FaProjectDiagram size={24} />, title: "Review Job Posts", desc: "BDs carefully review job details and feasibility before accepting.", color: "#3b82f6" },
                  { icon: <FaHandshake size={24} />, title: "Send Offers & Negotiate", desc: "BDs send customized offers to Clients and securely negotiate terms.", color: "#10b981" },
                  { icon: <MessageSquare size={24} />, title: "Manage Communication", desc: "BDs actively manage all communication between Client and Freelancer.", color: "#f59e0b" },
                  { icon: <Users size={24} />, title: "Hire Freelancers", desc: "BDs hire the most suitable Freelancers based on budget and skill.", color: "#8b5cf6" },
                  { icon: <Star size={24} />, title: "Ensure Quality", desc: "BDs rigorously review work to ensure all quality standards are met.", color: "#ec4899" }
                ].map((item, idx) => (
                  <div key={idx} className="col-lg-4 col-md-6">
                    <div className="card h-100 p-4 border-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.05) !important", borderRadius: "20px", transition: "transform 0.3s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px", borderRadius: "12px", background: `rgba(${parseInt(item.color.slice(1,3),16)}, ${parseInt(item.color.slice(3,5),16)}, ${parseInt(item.color.slice(5,7),16)}, 0.1)`, color: item.color }}>
                          {item.icon}
                        </div>
                        <h5 className="mb-0 fw-bold" style={{ color: "#ffffff", fontSize: "1.05rem" }}>{item.title}</h5>
                      </div>
                      <p className="mb-0" style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: "1.6" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
                
                {/* Highlighted BD Role Card */}
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 p-4 border-0" style={{ background: "linear-gradient(135deg, rgba(240, 89, 31, 0.15) 0%, rgba(240, 89, 31, 0.05) 100%)", border: "1px solid rgba(240, 89, 31, 0.3) !important", borderRadius: "20px" }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px", borderRadius: "12px", background: "linear-gradient(135deg, #f0591f 0%, #d94a15 100%)", color: "#ffffff", boxShadow: "0 5px 15px rgba(240, 89, 31, 0.3)" }}>
                        <Award size={24} />
                      </div>
                      <h5 className="mb-0 fw-bold" style={{ color: "#ffffff", fontSize: "1.05rem" }}>Submit Final Work</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#d4d4d8", fontSize: "0.95rem", lineHeight: "1.6" }}>BDs seamlessly earn by managing projects efficiently and delivering massive value.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step by Step Guide (Using previous premium steps style) */}
          <div className="row justify-content-center mt-5 pt-5" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div className="col-12 text-center mb-5">
              <h2 className="font-40 fw-bolder cocon text-white mb-3">Step-by-Step Guide</h2>
              <p className="mx-auto" style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "600px" }}>Follow our fully transparent and simple process from start to completion.</p>
            </div>
            
            <div className="col-lg-12">
              <div className="row g-4">
                {[
                  { title: "Client Posts a Job", desc: "The Client defines project requirements, budget, and timeline. It becomes visible to BDs." },
                  { title: "BDs Send Requests", desc: "BDs analyze scope and feasibility before applying. They strictly follow the defined structure." },
                  { title: "Client Selects a BD", desc: "The Client carefully reviews all requests and selects the Business Developer they trust most." },
                  { title: "Payment Hold", desc: "Funds are securely held by GrapeTask until work is definitively completed and approved." },
                  { title: "BD Hires a Freelancer", desc: "BD searches for qualified Freelancers based on strict requirements. Commission rules apply." },
                  { title: "Freelancer Comm.", desc: "BD accurately assigns project to the most suitable Freelancer. A separate internal order is created." },
                  { title: "Work Delivery", desc: "Freelancer delivers to BD. BD reviews and submits to Client. Handled entirely securely." }
                ].map((step, idx) => (
                  <div key={idx} className="col-lg-4 col-md-6">
                    <div className="card h-100 p-4 border-0 position-relative overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04) !important", borderRadius: "20px", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}>
                      <div style={{ position: "absolute", top: "-15px", right: "-15px", fontSize: "8rem", color: "rgba(255,255,255,0.02)", fontWeight: "900", zIndex: 0 }}>{idx + 1}</div>
                      <div className="position-relative" style={{ zIndex: 1 }}>
                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center justify-content-center fw-bolder" style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", fontSize: "1.1rem" }}>{idx + 1}</div>
                        </div>
                        <h5 className="fw-bold mb-2" style={{ color: "#ffffff", fontSize: "1.1rem" }}>{step.title}</h5>
                        <p className="mb-0" style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: "1.6" }}>{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Step 8 Highlighted */}
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 p-4 border-0 position-relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(240, 89, 31, 0.15) 0%, rgba(240, 89, 31, 0.05) 100%)", border: "1px solid rgba(240, 89, 31, 0.3) !important", borderRadius: "20px" }}>
                    <div style={{ position: "absolute", top: "-15px", right: "-15px", fontSize: "8rem", color: "rgba(240, 89, 31, 0.05)", fontWeight: "900", zIndex: 0 }}>8</div>
                    <div className="position-relative" style={{ zIndex: 1 }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center justify-content-center fw-bolder" style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #f0591f 0%, #d94a15 100%)", color: "#ffffff", fontSize: "1.1rem", boxShadow: "0 5px 15px rgba(240, 89, 31, 0.3)" }}>8</div>
                      </div>
                      <h5 className="fw-bold mb-2" style={{ color: "#ffffff", fontSize: "1.1rem" }}>Reviews & Fast Payment</h5>
                      <p className="mb-0" style={{ color: "#d4d4d8", fontSize: "0.95rem", lineHeight: "1.6" }}>Client reviews BD. BD reviews Freelancer. Freelancer seamlessly receives secure payment within 3 days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
       
      <Footer />
      <style>{`
                .why-grape-herosection{
                    min-height:calc(100vh - 98px);
                }
                @media (max-width:768px){
                    .why-grape-herosection{
                        min-height:auto;
                    }
                }
                `}</style>
    </div>
  );
};

export default WhyGrapeTask;
