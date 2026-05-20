import PropTypes from "prop-types";
import React, { useState } from "react";
import axios from "axios"; // 👈 Axios import kiya hai API call ke liye
import {
  FaCheckCircle,
  FaStar,
  FaClock,
  FaRegThumbsUp,
  FaThumbsUp,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingBasket
} from "react-icons/fa";
import DefaultImage from "../assets/default.webp";

// Apne backend ka base URL yahan set karein
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Freelancer = React.memo(function Freelancer(props) {
  const {
    gigId, // 👈 ZAROORI: Gig ki ID yahan receive karni hai
    video,
    images = [],
    price,
    rating = 0,
    ratingCount = 0,
    initialLikes = 0,
    isLikedByMe = false, // 👈 Pata lagane ke liye ke user ne pehle se like kiya hai ya nahi
    ordersInQueue = 0,
    delivery,
    heading,
    seller,
    sellerAvatar,
    isPro,
    handleNavigate,
    tags = [],
    sellerLevel,
  } = props;

  // Media Management (Images/Video)
  const mediaList = [];
  if (video) mediaList.push({ type: "video", url: video });
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((img) => mediaList.push({ type: "image", url: img }));
  } else if (typeof images === "string" && images) {
    mediaList.push({ type: "image", url: images });
  }
  if (mediaList.length === 0) {
    mediaList.push({ type: "image", url: DefaultImage });
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Like Functionality State
  const [isLiked, setIsLiked] = useState(isLikedByMe);
  const [likesCount, setLikesCount] = useState(initialLikes);

  // 👈 API INTEGRATION FOR LIKES
  const toggleLike = async (e) => {
    e.stopPropagation(); // Prevents card click when liking

    // 1. Optimistic Update (Fori tor par UI update kar do taake user wait na kare)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    if (!gigId) {
      console.warn("Gig ID missing for Like API");
      return;
    }

    try {
      // 2. Laravel API ko data bhejain
      const response = await axios.post(`${API_BASE_URL}/api/gigs/toggle-like`, {
        gig_id: gigId,
        action: newLikedState ? 'like' : 'unlike'
      });

      // 3. Agar server se naya count aaye toh state ko sync kar lein (Optional)
      if (response.data && response.data.status) {
        setLikesCount(response.data.total_likes);
      }
    } catch (error) {
      console.error("Like API Error:", error);
      // Agar server error de, toh Like ko wapis purani halat par le aayen
      setIsLiked(!newLikedState);
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const formatPrice = (p) => {
    if (p === undefined || p === null) return "N/A";
    const num = typeof p === "string" ? parseFloat(p.replace(/[^0-9.-]+/g, "")) : Number(p);
    if (isNaN(num)) return "N/A";
    return num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const displayPrice = formatPrice(price);
  const userLevel = sellerLevel || "New";
  const currentMedia = mediaList[currentIndex];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .compact-gig-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.2s ease-in-out;
          position: relative;
        }

        .compact-gig-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(240, 89, 31, 0.4);
        }

        /* --- Media Area --- */
        .gig-media-sm {
          position: relative;
          width: 100%;
          height: 170px;
          background: #020617;
          overflow: hidden;
        }

        .gig-media-sm img,
        .gig-media-sm video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .compact-gig-card:hover .gig-media-sm img,
        .compact-gig-card:hover .gig-media-sm video {
          transform: scale(1.05);
        }

        .badge-pro {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #1dbf73;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          text-transform: uppercase;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .slide-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          z-index: 2;
          transition: opacity 0.2s, background 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          color: #404145;
        }
        .compact-gig-card:hover .slide-btn { opacity: 1; }
        .slide-btn:hover { background: #fff; }
        .slide-btn.left { left: 6px; }
        .slide-btn.right { right: 6px; }

        /* --- Content Area --- */
        .gig-body-sm {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* Seller Info */
        .seller-row-sm {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .avatar-sm {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .seller-info-sm {
          display: flex;
          flex-direction: column;
        }
        .seller-name-sm {
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          line-height: 1.2;
        }
        .seller-lvl-sm {
          font-size: 10px;
          color: #a1a1aa;
        }

        /* Title */
        .gig-title-sm {
          font-size: 13px;
          line-height: 19px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          transition: color 0.2s ease;
        }
        .compact-gig-card:hover .gig-title-sm { color: #f0591f; }

        /* Tags */
        .gig-tags-sm {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }
        .gig-tag-sm {
          font-size: 9px;
          color: #f0591f;
          background: rgba(240, 89, 31, 0.1);
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        /* Metrics Grid */
        .metrics-grid-sm {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 11px;
          color: #71717a;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 10px;
        }
        .metric-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .icon-star { color: #f0591f; }
        .icon-gray { color: #71717a; }
        .fw-600 { font-weight: 600; color: #d4d4d8; }

        /* Footer */
        .footer-sm {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-box-sm .label {
          font-size: 9px;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .price-box-sm .amount {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
        }

        /* Thumbs Up Button */
        .like-action-sm {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.02);
          padding: 5px 10px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: all 0.2s ease;
          color: #a1a1aa;
        }
        .like-action-sm:hover {
          background: rgba(240, 89, 31, 0.1);
          border-color: #f0591f;
          color: #f0591f;
        }
        .like-action-sm.liked {
          background: #f0591f;
          border-color: #f0591f;
          color: #fff;
        }
        .like-icon-sm { font-size: 12px; transition: transform 0.2s; }
        .like-action-sm:active .like-icon-sm { transform: scale(1.3); }
        .like-count-sm { font-size: 11px; font-weight: 600; }

        /* Responsive Breakpoints */
        @media (max-width: 576px) {
          .gig-media-sm { height: 190px; }
          .metrics-grid-sm { grid-template-columns: 1fr; gap: 4px; }
        }
        /* Desktop screens (lg aur xl) ke liye exactly 5 cards ki width (20%) */
        @media (min-width: 992px) {
          .col-custom-5 {
            flex: 0 0 auto;
            width: 20%;
          }
        }
      ` }} />

      <div className="compact-gig-card" onClick={handleNavigate}>
        {/* --- Media Section --- */}
        <div className="gig-media-sm">
          {currentMedia.type === "video" ? (
            <video src={currentMedia.url} autoPlay muted loop playsInline />
          ) : (
            <img
              src={imgError ? DefaultImage : currentMedia.url}
              alt={heading || "Service Thumbnail"}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {isPro && <div className="badge-pro">Pro</div>}

          {mediaList.length > 1 && (
            <>
              <button className="slide-btn left" onClick={prevSlide}>
                <FaChevronLeft size={10} />
              </button>
              <button className="slide-btn right" onClick={nextSlide}>
                <FaChevronRight size={10} />
              </button>
            </>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="gig-body-sm">

          {/* Seller Profile */}
          <div className="seller-row-sm">
            <img
              src={sellerAvatar || DefaultImage}
              alt={seller || "Seller"}
              className="avatar-sm"
              onError={(e) => { e.target.src = DefaultImage; }}
            />
            <div className="seller-info-sm">
              <span className="seller-name-sm">
                {seller || "Pro Seller"} 
                {isPro && <FaCheckCircle size={10} color="#1dbf73" />}
              </span>
              <span className="seller-lvl-sm">Level {userLevel} Seller</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="gig-title-sm">{heading || "I will deliver professional work for your business"}</h3>

          {/* Tags (Max 2 displayed) */}
          {tags && tags.length > 0 && (
            <div className="gig-tags-sm">
              {tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="gig-tag-sm">{tag}</span>
              ))}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="metrics-grid-sm">
            <div className="metric-item">
              <FaStar className="icon-star" size={12} />
              <span className="fw-600">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
              <span>({formatNumber(ratingCount)})</span>
            </div>

            {delivery && delivery !== "N/A" && (
              <div className="metric-item">
                <FaClock className="icon-gray" size={11} />
                <span>{delivery} Day{delivery > 1 ? 's' : ''}</span>
              </div>
            )}

            {ordersInQueue > 0 && (
              <div className="metric-item" style={{ gridColumn: "1 / -1" }}>
                <FaShoppingBasket className="icon-gray" size={11} />
                <span>{ordersInQueue} orders in queue</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="footer-sm">
            <div className="price-box-sm">
              <div className="label">Starting At</div>
              <div className="amount">{displayPrice !== "N/A" ? displayPrice : "Custom"}</div>
            </div>

            <div 
              className={`like-action-sm ${isLiked ? 'liked' : ''}`} 
              onClick={toggleLike}
            >
              {isLiked ? <FaThumbsUp className="like-icon-sm" /> : <FaRegThumbsUp className="like-icon-sm" />}
              <span className="like-count-sm">{formatNumber(likesCount)}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
});

Freelancer.propTypes = {
  gigId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 👈 Required prop
  video: PropTypes.string,
  images: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rating: PropTypes.number,
  ratingCount: PropTypes.number,
  initialLikes: PropTypes.number,
  isLikedByMe: PropTypes.bool,
  ordersInQueue: PropTypes.number,
  delivery: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heading: PropTypes.string,
  seller: PropTypes.string,
  sellerAvatar: PropTypes.string,
  sellerLevel: PropTypes.string,
  isPro: PropTypes.bool,
  handleNavigate: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default Freelancer;