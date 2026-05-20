import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  RiMegaphoneLine, RiCodeBoxLine, RiQuillPenLine, 
  RiPieChartLine, RiVideoLine, RiPantoneLine, 
  RiBriefcaseLine, RiTerminalLine, RiArrowLeftSLine, RiArrowRightSLine
} from "react-icons/ri";

const BrowseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("marketing")) return <RiMegaphoneLine />;
    if (n.includes("web") || n.includes("tech") || n.includes("it")) return <RiCodeBoxLine />;
    if (n.includes("writing")) return <RiQuillPenLine />;
    if (n.includes("finance")) return <RiPieChartLine />;
    if (n.includes("video") || n.includes("animation")) return <RiVideoLine />;
    if (n.includes("design") || n.includes("graphics")) return <RiPantoneLine />;
    if (n.includes("business")) return <RiBriefcaseLine />;
    return <RiTerminalLine />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://portal.grapetask.co/api/category");
        if (res.data.status) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    const cleanCategory = category.replace(" →", "");
    navigate("/search/gigs", { state: { data: { search: cleanCategory, location: "Pakistan" } } });
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) return null;

  return (
    <section className="gt-categories-section">
      <div className="gt-container">
        <div className="gt-header">
          <h2>Explore Categories</h2>
          <div className="gt-nav-buttons">
            <button onClick={scrollLeft} className="gt-nav-btn" aria-label="Scroll left">
              <RiArrowLeftSLine />
            </button>
            <button onClick={scrollRight} className="gt-nav-btn" aria-label="Scroll right">
              <RiArrowRightSLine />
            </button>
          </div>
        </div>

        <div className="gt-slider-container">
          <div className="gt-slider" ref={sliderRef}>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="gt-category-card"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="gt-category-icon">
                  {getIcon(cat.name)}
                </div>
                <div className="gt-category-content">
                  <h3 className="gt-category-title">{cat.name}</h3>
                  <span className="gt-category-services">
                    {cat.sub_category ? cat.sub_category.length : 0} Services
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .gt-categories-section {
          background-color: #020617; /* mainBg */
          padding: 60px 0;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .gt-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .gt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .gt-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff; /* pureWhite */
          margin: 0;
        }

        .gt-nav-buttons {
          display: flex;
          gap: 12px;
        }

        .gt-nav-btn {
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          color: #a1a1aa; /* mediumGrayTitle */
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .gt-nav-btn:hover {
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          color: #ffffff;
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
        }

        .gt-slider-container {
          position: relative;
          margin: 0 -24px;
          padding: 0 24px;
        }

        .gt-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          padding-bottom: 20px;
        }

        .gt-slider::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .gt-category-card {
          flex: 0 0 auto;
          width: 260px;
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          scroll-snap-align: start;
          transition: all 0.3s ease;
        }

        .gt-category-card:hover {
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          transform: translateY(-2px);
        }

        .gt-category-icon {
          font-size: 28px;
          color: #a1a1aa; /* mediumGrayTitle */
          background: rgba(59, 130, 246, 0.05); /* secondaryBlueBlur */
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .gt-category-card:hover .gt-category-icon {
          color: #f0591f; /* primaryOrange */
          background: rgba(240, 89, 31, 0.1);
        }

        .gt-category-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .gt-category-title {
          font-size: 16px;
          font-weight: 600;
          color: #d4d4d8; /* lightGrayHover */
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }

        .gt-category-card:hover .gt-category-title {
          color: #ffffff; /* pureWhite */
        }

        .gt-category-services {
          font-size: 13px;
          color: #71717a; /* bodyGrayText */
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .gt-category-card {
            width: 240px;
            padding: 16px;
          }
          .gt-header h2 {
            font-size: 22px;
          }
          .gt-category-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .gt-category-card {
            width: 220px;
          }
          .gt-nav-buttons {
            display: none; /* Hide arrows on very small screens, let them swipe */
          }
        }
      `}</style>
    </section>
  );
};

export default BrowseCategories;
