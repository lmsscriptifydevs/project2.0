
import { BsPinterest } from "react-icons/bs";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import imges1 from "../assets/Qavi.webp";
import imges2 from "../assets/imge5.webp";
import imges3 from "../assets/imge6.webp";
import line from "../assets/line.webp";
// import lines from "../assets/line.webp";

const Client = () => {
  return (
    <div className="position-relative" style={{ backgroundColor: "#020617", padding: "80px 0", overflow: "hidden" }}>
      {/* Decorative Glows */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(240, 89, 31, 0.05) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "30px", fontSize: "14px", fontWeight: "600", marginBottom: "15px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              OUR EXPERTS
            </span>
            <h3 className="font-40 fw-bolder cocon mb-4" style={{ color: "#ffffff", fontSize: "2.8rem" }}>
              Meet The Elite Team
            </h3>
            <p className="mx-auto mb-4" style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "600px" }}>Ask your questions now to our highly experienced industry professionals.</p>
            <div className="d-flex justify-content-center">
              <div style={{ width: "80px", height: "4px", background: "#f0591f", borderRadius: "2px" }}></div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {[
            { img: imges1, name: "Abdul Qavi", role: "Chief Technology Officer" },
            { img: imges2, name: "David Thompson", role: "CEO, Tech Solutions" },
            { img: imges3, name: "Sarah Ahmed", role: "Marketing Manager" }
          ].map((expert, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-12 mb-5">
              <div className="card h-100 border-0 p-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05) !important", borderRadius: "24px", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="position-relative overflow-hidden" style={{ borderRadius: "16px", aspectRatio: "4/5" }}>
                  <img src={expert.img} className="w-100 h-100 object-fit-cover" alt={expert.name} loading="lazy" decoding="async" style={{ transition: "transform 0.5s ease" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                  
                  {/* Social overlay */}
                  <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-3" style={{ background: "linear-gradient(to top, rgba(2,6,23,0.95), rgba(2,6,23,0.6), transparent)" }}>
                    <div className="d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "#f0591f"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}><FiInstagram size={18} /></div>
                    <div className="d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "#f0591f"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}><FaFacebook size={18} /></div>
                    <div className="d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "#f0591f"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}><FaTwitter size={18} /></div>
                    <div className="d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "#f0591f"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}><BsPinterest size={18} /></div>
                  </div>
                </div>
                <div className="text-center mt-4 mb-2">
                  <h4 className="fw-bolder mb-1" style={{ color: "#ffffff", fontSize: "1.3rem" }}>{expert.name}</h4>
                  <p className="mb-0 fw-medium" style={{ color: "#f0591f", fontSize: "0.95rem" }}>{expert.role}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="col-12 text-center mt-4">
            <button className="px-5 py-3 fw-bold" style={{ backgroundColor: "rgba(240, 89, 31, 0.1)", color: "#f0591f", border: "1px solid rgba(240, 89, 31, 0.3)", borderRadius: "12px", fontSize: "1.1rem", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.backgroundColor = "#f0591f"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(240, 89, 31, 0.3)"; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = "rgba(240, 89, 31, 0.1)"; e.currentTarget.style.color = "#f0591f"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              Meet All Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
