import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { 
  RiDoubleQuotesL, RiVerifiedBadgeFill, 
  RiSendPlane2Fill, RiStarSFill 
} from "react-icons/ri";

// 🚀 SLIDER CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// 🚀 SAFE IMPORTS (Agar file missing hogi toh ye error de sakta hai, isliye path check karein)
import p1 from "../assets/home/profile1.png";
import p2 from "../assets/home/profile2.png";
import p3 from "../assets/home/profile3.jpg";


const TESTIMONIALS = [
    {
      id: 1,
      name: "Muhammad Ali",
      role: "Full Stack Expert",
      text: "GrapeTask has completely changed the freelance landscape in Pakistan. Secure, fast, and highly professional service every single time.",
      image: p1 || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: 2,
      name: "Ali Hassan",
      role: "UI/UX Designer",
      text: "The interface is clean and the projects are high-quality. Payouts are smooth and always on time. Best platform for Pakistani talent.",
      image: p2
    },
    {
      id: 3,
      name: "Fatima Ali",
      role: "Back-End Specialist",
      text: "I've worked on many platforms, but the community and support here is unmatched. Proudly Pakistani and truly global quality!",
      image: p3
    }
];

const Testomonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: dots => (
      <div style={{ bottom: "-40px" }}>
        <ul className="gt-custom-dots"> {dots} </ul>
      </div>
    ),
  };

  return (
    <section className="gt-premium-testimonial">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Ambient Glows from Color Schema */}
      <div className="gt-bg-glow-blue"></div>
      <div className="gt-bg-glow-orb"></div>

      <div className="container-xl">
        <div className="row g-5 align-items-center">

          <div className="col-lg-6 col-12">
            <motion.div 
              className="gt-text-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="gt-badge-vip">TESTIMONIAL</div>
              <h2 className="gt-title-main">Success speaks <br /> <span>for itself</span></h2>

              <div className="gt-desc-block">
                <p>Join thousands of users that trust our platform for high-quality freelance services. We help businesses connect with qualified experts.</p>
                <p>Whether you require experienced assistance or a creative mind, we have the ideal solution for you.</p>
              </div>

              <div className="gt-action-area">
                <p className="gt-mini-label">Share your experience with us</p>
                <div className="gt-premium-input">
                  <input type="text" placeholder="Write your assessment..." />
                  <button><RiSendPlane2Fill size={20} /></button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-6 col-12">
            <div className="gt-slider-wrapper">
              <Slider {...settings}>
                {TESTIMONIALS.map((item) => (
                  <div key={item.id} className="gt-slide-item">
                    <div className="gt-glass-card-vip">
                      <RiDoubleQuotesL className="gt-quote-icon-vip" />
                      <p className="gt-testimonial-quote">"{item.text}"</p>
                      <div className="gt-user-info-row">
                        <img src={item.image} alt={item.name} className="gt-user-avatar-vip" />
                        <div className="gt-user-meta-vip">
                          <h5>{item.name} <RiVerifiedBadgeFill color="#2ed573" /></h5>
                          <span>{item.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .gt-premium-testimonial { 
          background-color: #020617; /* mainBg */
          padding: 100px 0; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #ffffff; /* pureWhite */
          position: relative; 
          overflow: hidden; 
        }

        /* 🌌 Secondary Blue Blur */
        .gt-bg-glow-blue { 
          position: absolute; top: -10%; left: -5%; width: 500px; height: 500px; 
          background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%); 
          filter: blur(80px); pointer-events: none; 
        }

        /* 🟠 Primary Orange Glow */
        .gt-bg-glow-orb { 
          position: absolute; bottom: 10%; right: -5%; width: 400px; height: 400px; 
          background: radial-gradient(circle, rgba(240, 89, 31, 0.08) 0%, transparent 70%); 
          filter: blur(60px); pointer-events: none; 
        }

        .gt-badge-vip { 
          display: inline-block; 
          background: rgba(240, 89, 31, 0.08); 
          border: 1px solid rgba(240, 89, 31, 0.3); /* orangeBorderActive */
          color: #f0591f; /* primaryOrange */
          font-weight: 800; font-size: 0.7rem; letter-spacing: 2px; 
          padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; 
        }

        .gt-title-main { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 25px; color: #ffffff; }
        .gt-title-main span { color: #f0591f; }

        .gt-desc-block p { color: #71717a; /* bodyGrayText */ font-size: 1.05rem; line-height: 1.7; margin-bottom: 15px; }

        .gt-action-area { margin-top: 40px; }
        .gt-mini-label { color: #a1a1aa; /* mediumGrayTitle */ font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; }

        .gt-premium-input { 
          display: flex; 
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          border-radius: 12px; padding: 6px; max-width: 450px; 
          transition: 0.3s ease;
        }
        .gt-premium-input:focus-within {
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          box-shadow: 0 0 15px rgba(240, 89, 31, 0.1);
        }
        .gt-premium-input input { background: transparent; border: none; color: #ffffff; flex: 1; padding: 10px 15px; outline: none; font-size: 0.95rem; }
        .gt-premium-input input::placeholder { color: #52525b; /* darkGrayNumber */ }
        .gt-premium-input button { 
          background: #f0591f; border: none; color: #ffffff; width: 45px; height: 45px; 
          border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: 0.3s; 
        }
        .gt-premium-input button:hover { background: #d94a15; transform: scale(1.05); }

        .gt-slide-item { padding: 15px 10px; /* Essential for slick hover effects */ }

        .gt-glass-card-vip { 
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          border-radius: 24px; padding: 40px; position: relative; 
          backdrop-filter: blur(20px); 
          transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .gt-glass-card-vip:hover {
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .gt-quote-icon-vip { font-size: 4rem; color: #f0591f; opacity: 0.15; position: absolute; top: 25px; right: 30px; transition: 0.4s; }
        .gt-glass-card-vip:hover .gt-quote-icon-vip { opacity: 0.3; transform: scale(1.1) rotate(-5deg); }

        .gt-testimonial-quote { font-size: 1.15rem; line-height: 1.8; font-style: italic; color: #d4d4d8; /* lightGrayHover */ margin-bottom: 30px; position: relative; z-index: 2; }

        .gt-user-info-row { display: flex; align-items: center; gap: 15px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px; }
        .gt-user-avatar-vip { width: 55px; height: 55px; border-radius: 14px; object-fit: cover; border: 2px solid rgba(240, 89, 31, 0.3); }
        .gt-user-meta-vip h5 { font-size: 1.1rem; font-weight: 800; margin: 0; color: #ffffff; display: flex; align-items: center; gap: 6px; }
        .gt-user-meta-vip span { font-size: 0.75rem; color: #71717a; /* bodyGrayText */ font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-top: 4px; }

        .gt-custom-dots { display: flex !important; justify-content: center; list-style: none; padding: 0; margin-top: 20px; }
        .gt-custom-dots li { margin: 0 5px; }
        .gt-custom-dots li button { border: none; background: rgba(255, 255, 255, 0.06); width: 10px; height: 10px; border-radius: 50%; color: transparent; cursor: pointer; transition: 0.3s; }
        .gt-custom-dots li.slick-active button { background: #f0591f; width: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(240, 89, 31, 0.4); }

        @media (max-width: 991px) { 
          .gt-text-content { text-align: center; margin-bottom: 40px; } 
          .gt-premium-input { margin: 0 auto; } 
        }
      `}</style>
    </section>
  );
};

export default Testomonial;