import React from "react";
import image1 from "../assets/image1.webp";
import image2 from "../assets/image2.webp";
import image3 from "../assets/image3.webp";
import lines from "../assets/line.webp";

const Story = () => {
  return (
    <div className="position-relative" style={{ backgroundColor: "#020617", padding: "80px 0", overflow: "hidden" }}>
      {/* Decorative Premium Background Elements */}
      <div style={{ position: "absolute", top: "0%", left: "-10%", width: "40%", height: "80%", background: "radial-gradient(circle, rgba(240, 89, 31, 0.05) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "80%", background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(240, 89, 31, 0.1)", color: "#f0591f", borderRadius: "30px", fontSize: "14px", fontWeight: "600", marginBottom: "15px", border: "1px solid rgba(240, 89, 31, 0.2)" }}>
              OUR JOURNEY
            </span>
            <h2 className="font-40 fw-bolder cocon mb-4" style={{ color: "#ffffff", fontSize: "3rem" }}>The GrapeTask Story</h2>
            <div className="d-flex justify-content-center mb-4">
              <div style={{ width: "80px", height: "4px", background: "#f0591f", borderRadius: "2px" }}></div>
            </div>
            
            <div className="card border-0 p-4 p-md-5 mt-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05) !important", borderRadius: "24px", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
              <p className="font-18 mb-4 text-start" style={{ color: "#d4d4d8", lineHeight: "1.9" }}>
                GrapeTask was founded on a definitive desire to fundamentally change the way people work and communicate globally. As a revolutionary freelance marketplace, we passionately enable businesses and top-tier freelancers to seamlessly work together without boundaries. 
              </p>
              <p className="font-18 mb-4 text-start" style={{ color: "#a1a1aa", lineHeight: "1.9" }}>
                We saw the exponentially growing demand for reliable outsourcing services and boldly decided to build a platform that effectively and securely bridges this gap. Our journey began with the goal of creating the greatest online marketplace for businesses to hire elite freelancers, and for individuals to effortlessly find powerful self-employment opportunities.
              </p>
              <p className="font-18 mb-0 text-start" style={{ color: "#a1a1aa", lineHeight: "1.9" }}>
                GrapeTask is now a leading online freelancing platform that powerfully connects talent with endless opportunities. From agile startups to vast established businesses, we offer an environment where activities get done efficiently and ambitious goals are flawlessly met.
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-5 pt-4">
          <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="position-relative h-100 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}>
              <img src={image1} className="w-100 h-100 object-fit-cover" style={{ transition: "transform 0.5s ease" }} alt="best online marketplace" loading="lazy" decoding="async" onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "20px", background: "linear-gradient(to top, rgba(2,6,23,0.9), transparent)" }}>
                <h5 className="text-white fw-bold mb-0">Global Talent</h5>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="position-relative h-100 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}>
              <img src={image2} className="w-100 h-100 object-fit-cover" style={{ transition: "transform 0.5s ease" }} alt="freelance online" loading="lazy" decoding="async" onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "20px", background: "linear-gradient(to top, rgba(2,6,23,0.9), transparent)" }}>
                <h5 className="text-white fw-bold mb-0">Seamless Collaboration</h5>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="position-relative h-100 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}>
              <img src={image3} className="w-100 h-100 object-fit-cover" style={{ transition: "transform 0.5s ease" }} alt="freelance talent" loading="lazy" decoding="async" onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "20px", background: "linear-gradient(to top, rgba(2,6,23,0.9), transparent)" }}>
                <h5 className="text-white fw-bold mb-0">Unmatched Security</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
