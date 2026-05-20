import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  RiSearch2Line, RiStarFill, RiVerifiedBadgeFill, 
  RiArrowRightSLine, RiArrowLeftSLine, RiLayoutGridFill,
  RiCompass3Fill, RiPriceTag3Line, RiShieldCheckLine
} from "react-icons/ri";

const TopRatedFreelancers = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [dragWidth, setDragWidth] = useState(0);

  const scrollRef = useRef(null);

  const handleGigClick = (gig) => {
    const slugTitle = gig.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'gig';
    const sellerId = gig.seller?.user_name || gig.seller?.id || 'seller';
    navigate(`/g/${slugTitle}/${sellerId}/${gig.id}`, { state: { gig } });
  };

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://portal.grapetask.co/api/home-category-gigs", {
        params: {
          category_id: activeCat === "All Categories" ? null : activeCat,
          search: search,
          page: page,
          per_page: 8
        }
      });
      if (response.data.status) {
        setGigs(response.data.data);
        setCategories(response.data.categories);
        setPagination(response.data.pagination);
      }
    } catch (error) { console.error("Error:", error); } 
    finally { setLoading(false); }
  }, [activeCat, search, page]);

  useEffect(() => { fetchGigs(); }, [fetchGigs]);

  useEffect(() => {
    if (scrollRef.current) {
      setDragWidth(scrollRef.current.scrollWidth - scrollRef.current.offsetWidth);
    }
  }, [categories, loading]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>
        {`
          .gt-next-level-section {
            background-color: #020617; /* mainBg */
            padding: 80px 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #ffffff; /* pureWhite */
            overflow: hidden;
          }

          .gt-title-v6 { text-align: left; padding: 0 5%; margin-bottom: 35px; }
          .gt-title-v6 h2 { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 5px; color: #ffffff; }
          .gt-title-v6 span { color: #f0591f; /* primaryOrange */ }
          .gt-subtitle-v6 { color: #71717a; /* bodyGrayText */ font-size: 0.9rem; font-weight: 500; }

          /* 🚀 NEXT-LEVEL CATEGORY TRACK */
          .gt-cat-scroller { width: 100%; overflow: hidden; cursor: grab; margin-bottom: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */ }
          .gt-cat-inner { display: flex; gap: 25px; padding: 10px 5% 20px 5%; }

          .gt-cat-item-pro {
            position: relative;
            display: flex; align-items: center; gap: 10px;
            color: #71717a; /* bodyGrayText */ cursor: pointer; transition: 0.3s;
            white-space: nowrap; font-weight: 700; font-size: 0.9rem;
            padding: 5px 0;
          }
          .gt-cat-item-pro:hover { color: #d4d4d8; /* lightGrayHover */ }
          .gt-cat-item-pro.active { color: #f0591f; /* primaryOrange */ }
          .active-bar {
            position: absolute; bottom: -20px; left: 0; width: 100%; height: 3px;
            background: #f0591f; border-radius: 10px 10px 0 0;
          }

          /* 🚀 GIG CARD: NORMAL ROUNDED (Refined) */
          .gt-pro-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 20px; padding: 0 5%; }
          @media (min-width: 640px) { .gt-pro-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (min-width: 1024px) { .gt-pro-grid { grid-template-columns: repeat(4, 1fr); } }

          .gt-gig-pro-card {
            background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            border-radius: 16px;
            overflow: hidden;
            transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            cursor: pointer;
          }
          .gt-gig-pro-card:hover { 
            transform: translateY(-8px); 
            border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
            background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          }

          .gt-frame-16-9 {
            width: 100%; aspect-ratio: 16 / 9; overflow: hidden; position: relative;
            background: rgba(255, 255, 255, 0.02);
          }
          .gt-frame-16-9 img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
          .gt-gig-pro-card:hover .gt-frame-16-9 img { transform: scale(1.08); }

          /* User Profile Info Shifted Below Image */
          .gt-gig-content { padding: 16px; }

          .gt-seller-info {
            display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
          }
          .gt-seller-info img { 
            width: 24px; height: 24px; border-radius: 50%; object-fit: cover; 
            border: 1px solid rgba(255,255,255,0.1);
          }
          .gt-seller-info span { font-size: 0.85rem; font-weight: 600; color: #a1a1aa; /* mediumGrayTitle */ }

          .gt-gig-pro-title { font-size: 0.95rem; font-weight: 700; color: #ffffff; /* pureWhite */ line-height: 1.4; height: 2.7rem; overflow: hidden; margin-bottom: 15px; }

          .gt-gig-footer-pro {
            border-top: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
            padding-top: 12px; display: flex; justify-content: space-between; align-items: center;
          }
          .gt-rating-pro { display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 0.85rem; color: #ffb400; }
          .gt-price-pro { text-align: right; }
          .gt-price-pro small { font-size: 0.6rem; color: #71717a; /* bodyGrayText */ font-weight: 700; text-transform: uppercase; display: block; }
          .gt-price-pro strong { font-size: 1.1rem; color: #ffffff; /* pureWhite */ }

          /* 🚀 NEXT LEVEL PAGINATION */
          .gt-pag-v6 { display: flex; justify-content: center; gap: 10px; margin-top: 50px; align-items: center; }
          .gt-dot-v6 { width: 8px; height: 8px; background: #52525b; /* darkGrayNumber */ border-radius: 2px; transition: 0.4s; cursor: pointer; }
          .gt-dot-v6.active { background: #f0591f; width: 30px; box-shadow: 0 0 15px rgba(240, 89, 31, 0.3); }

          .gt-btn-v6 {
            width: 36px; height: 36px; border-radius: 8px; background: rgba(255, 255, 255, 0.02); /* cardBg */
            border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */ color: #f0591f; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: 0.2s;
          }
          .gt-btn-v6:disabled { opacity: 0.2; }
          .gt-btn-v6:hover:not(:disabled) { background: #f0591f; color: #fff; border-color: #f0591f; }
        `}
      </style>

      <section className="gt-next-level-section">
        <div className="gt-title-v6">
          <motion.h2 initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}}>
            Top Rated <span>Marketplace</span>
          </motion.h2>
          <div className="gt-subtitle-v6">Handpicked top-rated services from our best experts</div>
        </div>

        {/* 🚀 Next-Gen Category Slider */}
        <div className="gt-cat-scroller" ref={scrollRef}>
          <motion.div 
            drag="x" 
            dragConstraints={{ left: -dragWidth, right: 0 }}
            className="gt-cat-inner"
          >
            <div 
              className={`gt-cat-item-pro ${activeCat === "All Categories" ? 'active' : ''}`}
              onClick={() => { setActiveCat("All Categories"); setPage(1); }}
            >
              <RiLayoutGridFill size={18}/> All Services
              {activeCat === "All Categories" && <motion.div layoutId="bar" className="active-bar" />}
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`gt-cat-item-pro ${activeCat === cat.id ? 'active' : ''}`}
                onClick={() => { setActiveCat(cat.id); setPage(1); }}
              >
                {cat.name}
                {activeCat === cat.id && <motion.div layoutId="bar" className="active-bar" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* 🚀 Elite Gigs Grid */}
        <div className="gt-pro-grid">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={320} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px' }} />
            ))
          ) : (
            <AnimatePresence mode="wait">
              {gigs.map((gig, idx) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="gt-gig-pro-card"
                  onClick={() => handleGigClick(gig)}
                >
                  <div className="gt-frame-16-9">
                    <img src={gig.media?.image1} alt={gig.title} loading="lazy" />
                  </div>

                  <div className="gt-gig-content">
                    {/* Username and Badge Shifted Here */}
                    <div className="gt-seller-info">
                      <img src={gig.seller?.image || '/user.png'} alt={gig.seller?.fname} />
                      <span>{gig.seller?.user_name}</span>
                      <RiVerifiedBadgeFill color="#f0591f" size={16} />
                    </div>

                    <h4 className="gt-gig-pro-title">{gig.title}</h4>

                    <div className="gt-gig-footer-pro">
                      <div className="gt-rating-pro">
                        <RiStarFill /> {gig.ratings_avg_ratings ? Number(gig.ratings_avg_ratings).toFixed(1) : '5.0'}
                        <span style={{opacity: 0.3, fontWeight: 600}}>({gig.ratings_count})</span>
                      </div>
                      <div className="gt-price-pro">
                        <small>From</small>
                        <strong>${gig.packages[0]?.total || '5'}</strong>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* 🚀 Smart Dash Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="gt-pag-v6">
            <button className="gt-btn-v6" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <RiArrowLeftSLine size={20} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[...Array(pagination.total_pages)].map((_, i) => (
                <div 
                  key={i} 
                  className={`gt-dot-v6 ${page === i + 1 ? 'active' : ''}`} 
                  onClick={() => setPage(i + 1)} 
                />
              ))}
            </div>

            <button className="gt-btn-v6" onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))} disabled={page === pagination.total_pages}>
              <RiArrowRightSLine size={20} />
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default TopRatedFreelancers;