import { Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef, // 👈 useRef import kiya sliders ke liye
} from "react";
import { BsChevronLeft, BsChevronRight, BsSearch, BsGrid3X3Gap, BsList, BsArrowRight } from "react-icons/bs";
import { FiFilter, FiStar, FiClock, FiTrendingUp } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import videoImg from "../../assets/blogVideoImg.webp";
import Loader from "../../assets/LoaderImg.gif";
import NewWay from "../../assets/NewWay.webp";
import videoPlay from "../../assets/VideoPlay.webp";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Profilreviw from "../../components/Profilreviw";
import { geAllGigs } from "../../redux/slices/allGigsSlice";
import { getBds } from "../../redux/slices/buyerRequestSlice";
import { getCategory } from "../../redux/slices/gigsSlice";
import { getAllFreelancers } from "../../redux/slices/userSlice";
import { titleToSlug } from "../../utils/helpers";
import Faq from "../../components/homepage/Faq";

const BdCard = lazy(() => import("../../components/BdCard"));
const ExpertCard = lazy(() => import("../../components/ExpertCard"));
const Freelancer = lazy(() => import("../../components/Freelancer"));

// Backend URL
const API_BASE_URL = "https://portal.grapetask.co";

const normalizeRole = (role) => (!role ? "" : role.toLowerCase().trim());
const getSellerName = (seller) => {
  if (Array.isArray(seller)) return seller[0]?.fname || "seller";
  return seller?.fname || "seller";
};
const getGigImage = (media) => {
  if (!media) return null;
  return media.image1 || media.image2 || media.image3 || null;
};

const handleGigNavigate = async (gig, navigate) => {
  try {
    axios.post(`${API_BASE_URL}/api/gigs/track-click`, {
      gig_id: gig.id
    }).catch(e => console.log("Click Track Error:", e));
  } catch (error) {}

  const slug = titleToSlug(gig.title);
  const sellerName = getSellerName(gig.seller);
  navigate(`/g/${slug}/${sellerName}/${gig.id}`);
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

/* ─── Inline Gig Card ─── */
const GigCard = React.memo(({ item, onNavigate, onVisible }) => {
  const price = item?.packages?.[0]?.total || "$0";
  const rating = Number(item.ratings_avg_ratings) || 0;
  const ratingCount = Number(item.ratings_count || 0);
  const delivery = item?.packages?.[0]?.delivery_time || "N/A";
  const sellerName = getSellerName(item?.seller);
  const sellerAvatar = item?.seller?.image;
  const image = getGigImage(item.media);
  const categoryName = item?.category?.name || "Service";

  // 👈 LIKE SYSTEM FIX (Local Storage fallback for persistence)
  const [isLiked, setIsLiked] = useState(() => {
    if (item?.is_liked_by_me) return true;
    try {
      const localLikes = JSON.parse(localStorage.getItem('gt_liked_gigs') || '[]');
      return localLikes.includes(item.id);
    } catch(e) { return false; }
  }); 
  const [likesCount, setLikesCount] = useState(Number(item?.total_likes) || 0);

  const handleLike = async (e) => {
    e.stopPropagation(); 
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    // Save to LocalStorage immediately
    try {
      let localLikes = JSON.parse(localStorage.getItem('gt_liked_gigs') || '[]');
      if (newLikedState) {
        if (!localLikes.includes(item.id)) localLikes.push(item.id);
      } else {
        localLikes = localLikes.filter(id => id !== item.id);
      }
      localStorage.setItem('gt_liked_gigs', JSON.stringify(localLikes));
    } catch(e) {}

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/gigs/toggle-like`, {
        gig_id: item.id,
        action: newLikedState ? 'like' : 'unlike'
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (error) {
      console.error("Like Error:", error);
    }
  };

  useEffect(() => {
    if (!onVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible(item.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5 } 
    );
    const cardElement = document.getElementById(`gig-card-${item.id}`);
    if (cardElement) observer.observe(cardElement);
    return () => observer.disconnect();
  }, [item.id, onVisible]);

  return (
    <div id={`gig-card-${item.id}`} className="gt-gig-card" onClick={onNavigate}>
      <div className="gt-gig-thumb">
        {image ? (
          <img src={image} alt={item.title} loading="lazy" />
        ) : (
          <div className="gt-gig-thumb-placeholder">
            <span>{categoryName.charAt(0)}</span>
          </div>
        )}
        <span className="gt-gig-category-badge">{categoryName}</span>
      </div>

      <div className="gt-gig-body">
        <div className="gt-gig-seller">
          {sellerAvatar ? (
            <img src={sellerAvatar} alt={sellerName} className="gt-seller-avatar" />
          ) : (
            <div className="gt-seller-avatar gt-seller-initials">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="gt-seller-name">{sellerName}</span>
        </div>

        <h3 className="gt-gig-title">{item.title}</h3>

        <div className="gt-gig-meta">
          {rating > 0 && (
            <span className="gt-rating">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0l1.5 3.5L11 4l-2.5 2.5.5 3.5L6 8.5 3 10l.5-3.5L1 4l3.5-.5z"/>
              </svg>
              {rating.toFixed(1)}
              <em>({ratingCount})</em>
            </span>
          )}
          <span className="gt-delivery">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {delivery}d
          </span>
        </div>
      </div>

      <div className="gt-gig-footer">
        <button 
          className={`gt-like-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
          title={isLiked ? "Unlike" : "Save Gig"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likesCount > 0 && <span className="like-count">{formatNumber(likesCount)}</span>}
        </button>

        <div className="gt-price-wrap">
          <span className="gt-price-label">Starting at</span>
          <span className="gt-price">{price}</span>
        </div>
      </div>
    </div>
  );
});

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
};

/* ─── Category Slider Row Component ─── */
const GigCategorySlider = ({ categoryName, categoryId, gigs, onViewAll, onGigVisible, navigate }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="gt-category-section">
      <div className="gt-category-header">
        <h2 className="gt-category-title">{categoryName}</h2>
        <button className="gt-view-all-btn" onClick={() => onViewAll(categoryId)}>
          View All <BsArrowRight />
        </button>
      </div>

      <div className="gt-slider-wrapper">
        <button className="gt-slider-arrow left" onClick={scrollLeft}><BsChevronLeft size={20} /></button>

        <div className="gt-slider-track" ref={scrollRef}>
          {gigs.map((item, idx) => (
            <div className="gt-slider-item" key={item.id || idx}>
              <GigCard
                item={item}
                onNavigate={() => handleGigNavigate(item, navigate)}
                onVisible={onGigVisible}
              />
            </div>
          ))}
        </div>

        <button className="gt-slider-arrow right" onClick={scrollRight}><BsChevronRight size={20} /></button>
      </div>
    </div>
  );
};

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="gt-skeleton">
    <div className="gt-skeleton-thumb" />
    <div className="gt-skeleton-body">
      <div className="gt-skeleton-line" style={{ width: "40%", height: "10px" }} />
      <div className="gt-skeleton-line" style={{ width: "90%", height: "14px", marginTop: "8px" }} />
      <div className="gt-skeleton-line" style={{ width: "70%", height: "14px", marginTop: "6px" }} />
      <div className="gt-skeleton-line" style={{ width: "30%", height: "10px", marginTop: "12px" }} />
    </div>
  </div>
);

const CategoryPill = ({ cat, active, onClick }) => (
  <button
    className={`gt-cat-pill${active ? " active" : ""}`}
    onClick={() => onClick(active ? "" : cat.id)}
  >
    {cat.name}
  </button>
);

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════ */
const Freelancers = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword, 500);
  const [selectCategory, setSelectCategory] = useState("");
  const [searchType, setSearchType] = useState("services");
  const [page, setPage] = useState(1);
  const [bdPage, setBdPage] = useState(1);
  const [expertPage, setExpertPage] = useState(1);
  const [limit] = useState(12);
  const bdLimit = 10;
  const [expertDetail, setExpertDetail] = useState(null);
  const [bdDetail, setBdDetail] = useState(null);
  const [expertModal, setExpertModal] = useState(false);
  const [bdModal, setBdModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(new Set([0]));
  const [viewMode, setViewMode] = useState("grid");

  const [visibleGigs, setVisibleGigs] = useState(new Set());

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { gigsDetail, pagination, isLoading } = useSelector((s) => s.allGigs);
  const { userCategory } = useSelector((s) => s.gig);
  const { userDetail, userList: freelancers, isLoading: freelancersLoading } = useSelector((s) => s.user);
  const { bdList, bdListLoading } = useSelector((s) => s.buyer);

  const [UserData, setUserData] = useState(null);
  useEffect(() => {
    const fn = () => {
      try {
        const d = localStorage.getItem("UserData");
        setUserData(d ? JSON.parse(d) : null);
      } catch {}
    };
    "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 0 }) : setTimeout(fn, 0);
  }, []);

  const userRole = userDetail?.role || UserData?.role || "client";

  useEffect(() => {
    const fn = () => dispatch(getCategory());
    "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 500 }) : setTimeout(fn, 0);
  }, [dispatch]);

  // If no category selected, fetch more gigs to populate sliders properly
  const fetchLimit = selectCategory ? limit : 50; 

  useEffect(() => {
    if (searchType === "services") {
      dispatch(geAllGigs({ page, limit: fetchLimit, categoryId: selectCategory || undefined, search: debouncedSearch || undefined }));
    }
  }, [dispatch, searchType, page, fetchLimit, selectCategory, debouncedSearch]);

  useEffect(() => {
    if (searchType === "experts") {
      dispatch(getAllFreelancers({ page: expertPage, perPage: 12, search: debouncedSearch || "" }));
    } else if (searchType === "bds" && (!bdList || (Array.isArray(bdList) && bdList.length === 0))) {
      dispatch(getBds());
    }
  }, [dispatch, searchType, expertPage, debouncedSearch, bdList]);

  useEffect(() => {
    if (visibleGigs.size === 0) return;
    const trackImpressions = async () => {
      const gigIdsArray = Array.from(visibleGigs);
      try {
        await axios.post(`${API_BASE_URL}/api/gigs/track-impressions`, { gig_ids: gigIdsArray });
        setVisibleGigs(new Set()); 
      } catch (error) {}
    };
    const timer = setTimeout(() => trackImpressions(), 5000);
    return () => clearTimeout(timer);
  }, [visibleGigs]);

  const handleGigVisible = useCallback((id) => {
    setVisibleGigs((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // 👈 GROUP GIGS BY CATEGORY
  const groupedGigs = useMemo(() => {
    if (!gigsDetail || gigsDetail.length === 0) return {};
    const groups = {};
    gigsDetail.forEach(gig => {
      const catName = gig.category?.name || "Uncategorized";
      const catId = gig.category?.id || "";
      if (!groups[catName]) {
        groups[catName] = { id: catId, gigs: [] };
      }
      groups[catName].gigs.push(gig);
    });
    return groups;
  }, [gigsDetail]);

  const isBdRole = useCallback((r) => {
    if (!r) return false;
    const n = normalizeRole(r);
    return n.includes("bd") || n.includes("business") || n.includes("bidder") || n.includes("middleman") || n.includes("representative");
  }, []);

  const isExpertRole = useCallback((r) => {
    if (!r) return false;
    const n = normalizeRole(r);
    return n.includes("expert") || n.includes("freelancer") || n.includes("developer") || n.includes("designer") || n.includes("consultant");
  }, []);

  const safeGetBdList = useCallback(() => {
    if (!bdList) return [];
    return bdList?.data || bdList?.users || bdList?.results || bdList || [];
  }, [bdList]);

  const safeGetFreelancersList = useCallback(() => {
    if (freelancers?.data && Array.isArray(freelancers.data)) return freelancers.data;
    if (Array.isArray(freelancers)) return freelancers;
    return freelancers?.users || freelancers?.results || [];
  }, [freelancers]);

  const bdCurrentData = useMemo(() => {
    const bds = safeGetBdList();
    if (!debouncedSearch.trim()) return bds;
    const kw = debouncedSearch.toLowerCase();
    return bds.filter((b) => `${b.fname || ""} ${b.skills || ""} ${b.bio || ""} ${b.country || ""}`.toLowerCase().includes(kw));
  }, [safeGetBdList, debouncedSearch]);

  const expertCurrentData = useMemo(() => {
    // The backend now handles the search and pagination for experts
    return safeGetFreelancersList().filter((u) => isExpertRole(u.role));
  }, [safeGetFreelancersList, isExpertRole]);

  const paginatedExperts = expertCurrentData;
  const { meta: userMeta } = useSelector((s) => s.user);
  const expertTotalPages = userMeta?.total_pages || Math.ceil(expertCurrentData.length / limit) || 1;

  const paginatedBDs = useMemo(() => bdCurrentData.slice((bdPage - 1) * bdLimit, bdPage * bdLimit), [bdCurrentData, bdPage, bdLimit]);
  const bdTotalPages = useMemo(() => Math.ceil(bdCurrentData.length / bdLimit), [bdCurrentData.length, bdLimit]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setBdPage(1); setExpertPage(1); }, 100);
    return () => clearTimeout(t);
  }, [debouncedSearch, searchType, selectCategory]);

  useEffect(() => {
    const iv = setInterval(() => setActiveVideo((p) => (p + 1) % 3), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const next = (activeVideo + 1) % 3;
    if (!loadedVideos.has(next)) setLoadedVideos((p) => new Set([...p, next]));
  }, [activeVideo, loadedVideos]);

  const videos = useMemo(() => ["/video/Freelance8.mp4", "/video/Freelance9.mp4", "/video/Freelance3.mp4"], []);

  const getSearchOptions = useMemo(() => {
    const r = normalizeRole(userRole);
    if (r.includes("client")) return [{ value: "services", label: "Services" }, { value: "bds", label: "Business Developers" }];
    if (isBdRole(userRole)) return [{ value: "services", label: "Services" }, { value: "bds", label: "Business Developers" }, { value: "experts", label: "Experts" }];
    if (isExpertRole(userRole)) return [{ value: "services", label: "Services" }, { value: "experts", label: "Experts" }];
    return [{ value: "services", label: "Services" }];
  }, [userRole, isBdRole, isExpertRole]);

  const handleSearchTypeChange = useCallback((val) => {
    setSearchType(val); setSearchKeyword(""); setSelectCategory(""); setPage(1); setBdPage(1); setExpertPage(1);
  }, []);

  const handlePageChange = useCallback((_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const handleExpertPageChange = useCallback((_, p) => { setExpertPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const handleBdPageChange = useCallback((_, p) => { setBdPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const closeModal = useCallback(() => { setExpertModal(false); setBdModal(false); setExpertDetail(null); setBdDetail(null); }, []);

  const isAnyLoading = (searchType === "services" && isLoading) || (searchType === "bds" && bdListLoading) || (searchType === "experts" && freelancersLoading);

  const pageTitle = useMemo(() => {
    const r = normalizeRole(userRole);
    if (r.includes("client")) return <>Find the Perfect Talent for Your <em>Vision</em></>;
    if (isBdRole(userRole)) return <span style={{ whiteSpace: 'nowrap' }}>Coordinate, Connect & <em>Grow</em></span>;
    if (isExpertRole(userRole)) return <>Showcase Your Expertise to Top <em>Clients</em></>;
    return <>Discover Amazing <em>Services</em></>;
  }, [userRole, isBdRole, isExpertRole]);

  const pageSubtitle = useMemo(() => {
    const r = normalizeRole(userRole);
    if (r.includes("client")) return "Top-rated experts ready to deliver excellence.";
    if (isBdRole(userRole)) return <>Connecting <em>Ideas</em>, Coordinating <em>Actions</em>, Growing <em>Results</em>.</>;
    if (isExpertRole(userRole)) return "Turn your skills into a thriving career.";
    return "Start your journey by exploring our services";
  }, [userRole, isBdRole, isExpertRole]);

  // Determine if we should show sliders or grid
  const showSliders = searchType === "services" && !selectCategory && !debouncedSearch;

  return (
    <>
      <style>{CSS}</style>
      <Navbar FirstNav="none" />

      {/* ═══ HERO ═══ */}
      <section className="gt-hero">
        <div className="gt-hero-video-bg">
          {videos.map((src, i) => (
            loadedVideos.has(i) && (
              <video
                key={i}
                className={`gt-hero-video${i === activeVideo ? " active" : ""}`}
                muted 
                loop 
                autoPlay 
                playsInline
                preload="auto"
              >
                <source src={src} type="video/mp4" />
              </video>
            )
          ))}
          <div className="gt-hero-overlay" />
        </div>

        <div className="gt-hero-inner">
          <h1 className="gt-hero-title">{pageTitle}</h1>
          <p className="gt-hero-subtitle">{pageSubtitle}</p>

          <form className="gt-search-bar" onSubmit={(e) => e.preventDefault()}>
            <div className="gt-search-input-wrap">
              <BsSearch className="gt-search-icon" />
              <input
                type="search"
                placeholder={
                  searchType === "bds" ? "Search business developers…" :
                  searchType === "experts" ? "Search experts by skill…" :
                  "What service are you looking for?"
                }
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="gt-search-input"
              />
            </div>
            {searchType === "services" && userCategory?.length > 0 && (
              <select
                className="gt-search-select"
                value={selectCategory}
                onChange={(e) => { setSelectCategory(e.target.value); setPage(1); }}
              >
                <option value="">All Categories</option>
                {userCategory.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button type="submit" className="gt-search-btn">Search</button>
          </form>

          {getSearchOptions.length > 1 && (
            <div className="gt-type-tabs">
              {getSearchOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`gt-type-tab${searchType === opt.value ? " active" : ""}`}
                  onClick={() => handleSearchTypeChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CATEGORY CHIPS ═══ */}
      {searchType === "services" && userCategory?.length > 0 && (
        <div className="gt-cat-strip">
          <div className="gt-cat-scroll">
            <CategoryPill
              cat={{ id: "", name: "All" }}
              active={selectCategory === ""}
              onClick={() => { setSelectCategory(""); setPage(1); }}
            />
            {userCategory.map((c) => (
              <CategoryPill
                key={c.id}
                cat={c}
                active={String(selectCategory) === String(c.id)}
                onClick={(id) => { setSelectCategory(id); setPage(1); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="gt-main">
        {/* Only show top toolbar if NOT in slider mode */}
        {!showSliders && (
          <div className="gt-toolbar">
            <div className="gt-toolbar-left">
              {searchType === "services" && (
                <h2 className="gt-section-title">
                  {selectCategory && userCategory?.find((c) => String(c.id) === String(selectCategory))
                    ? <>
                        <span>{userCategory.find((c) => String(c.id) === String(selectCategory))?.name}</span>
                        <em> Services</em>
                      </>
                    : <>Popular <em>Services</em></>
                  }
                </h2>
              )}
              {searchType === "experts" && <h2 className="gt-section-title">Available <em>Experts</em></h2>}
              {searchType === "bds" && <h2 className="gt-section-title">Business <em>Developers</em></h2>}
            </div>
            <div className="gt-toolbar-right">
              {searchType === "services" && (
                <>
                  <span className="gt-count">
                    {pagination ? `${pagination.total?.toLocaleString()} results` : ""}
                    {debouncedSearch && ` for "${debouncedSearch}"`}
                  </span>
                  <div className="gt-view-toggle">
                    <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title="Grid view">
                      <BsGrid3X3Gap size={15} />
                    </button>
                    <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} title="List view">
                      <BsList size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isAnyLoading ? (
          <div className={`gt-grid${viewMode === "list" ? " gt-list" : ""}`}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {searchType === "services" && (
              <>
                {gigsDetail && gigsDetail.length > 0 ? (
                  showSliders ? (
                    // 👈 SLIDER VIEW (Home/All Categories)
                    <div className="gt-categories-container">
                      {Object.entries(groupedGigs).map(([catName, data], idx) => (
                        <GigCategorySlider
                          key={idx}
                          categoryName={catName}
                          categoryId={data.id}
                          gigs={data.gigs}
                          onViewAll={(id) => { setSelectCategory(id); setPage(1); window.scrollTo(0,400); }}
                          onGigVisible={handleGigVisible}
                          navigate={navigate}
                        />
                      ))}
                    </div>
                  ) : (
                    // 👈 GRID/LIST VIEW (Filtered)
                    <div className={`gt-grid${viewMode === "list" ? " gt-list" : ""}`}>
                      {gigsDetail.map((item, idx) => (
                        <GigCard
                          key={item.id || idx}
                          item={item}
                          onNavigate={() => handleGigNavigate(item, navigate)}
                          onVisible={handleGigVisible}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <EmptyState
                    title="No services found"
                    desc={debouncedSearch ? `No results for "${debouncedSearch}"` : "No services available yet"}
                  />
                )}
                {/* Pagination only shown in Grid mode */}
                {!showSliders && pagination && pagination.total_pages > 1 && (
                  <div className="gt-pagination">
                    <Stack spacing={2}>
                      <Pagination
                        onChange={handlePageChange}
                        count={pagination.total_pages}
                        page={pagination.current_page}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        sx={{
                          '& .MuiPaginationItem-root': { color: 'var(--text-primary)', borderColor: 'var(--border-md)' },
                          '& .Mui-selected': { backgroundColor: 'var(--brand) !important', color: '#fff', borderColor: 'var(--brand)' }
                        }}
                      />
                    </Stack>
                  </div>
                )}
              </>
            )}

            {/* Experts & BDs logic remains unchanged */}
            {searchType === "experts" && (
              <>
                {/* ... */}
                {paginatedExperts.length > 0 ? (
                  <div className="gt-user-grid">
                    {paginatedExperts.map((val, i) => (
                      <Suspense key={val.id || i} fallback={<SkeletonCard />}>
                        <ExpertCard user={val} showExpertDetail={(d) => { setExpertDetail(d); setExpertModal(true); }} />
                      </Suspense>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No experts found" desc="Try different keywords" />
                )}
                {/* Pagination ... */}
              </>
            )}

            {searchType === "bds" && (
              <>
                {/* ... */}
                {paginatedBDs.length > 0 ? (
                  <div className="gt-user-grid">
                    {paginatedBDs.map((bd, i) => (
                      <div key={bd.id || i} className="gt-bd-col">
                        <Suspense fallback={<SkeletonCard />}>
                          <BdCard user={bd} bd={bd} showBdDetail={(d) => { setBdDetail(d); setBdModal(true); }} />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No business developers found" desc="Try different keywords" />
                )}
                {/* Pagination ... */}
              </>
            )}
          </>
        )}
      </main>

      {/* ─── Drawers ─── */}
      {[{ show: expertModal, detail: expertDetail, id: "expertDrawer" }, { show: bdModal, detail: bdDetail, id: "bdDrawer" }].map(({ show, detail, id }) => (
        <div key={id} className={`gt-drawer${show ? " open" : ""}`}>
          <div className="gt-drawer-backdrop" onClick={closeModal} />
          <div className="gt-drawer-panel">
            <button className="gt-drawer-close" onClick={closeModal}>
              <BsChevronLeft size={20} /> Back
            </button>
            <div className="gt-drawer-body">
              {detail && <Profilreviw expertDetail={detail} />}
            </div>
          </div>
        </div>
      ))}

      {/* Banner */}
      <div className="gt-banner-wrap">
        <img src={NewWay} className="gt-banner-img" alt="New way" loading="lazy" />
      </div>
      <Faq />
      <Footer />
    </>
  );
};

/* ─── Empty State ─── */
const EmptyState = ({ title, desc }) => (
  <div className="gt-empty">
    <div className="gt-empty-icon">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="22" cy="22" r="16"/><line x1="33" y1="33" x2="44" y2="44"/>
        <line x1="16" y1="22" x2="28" y2="22"/><line x1="22" y1="16" x2="22" y2="28"/>
      </svg>
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

/* ==========================================
   UPDATED CSS FOR GRAPETASK DARK THEME (WITH SLIDERS)
   ========================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body, .gt-hero, .gt-main { 
  font-family: 'DM Sans', sans-serif; 
  background-color: var(--dark);
  color: var(--text-primary);
}

/* ─── GRAPETASK DARK THEME CSS VARS ─── */
:root {
  --dark: #020617; 
  --surface: #020617; 
  --surface-2: rgba(255, 255, 255, 0.02); 
  --surface-active: rgba(255, 255, 255, 0.04); 
  --brand: #f0591f; 
  --brand-dark: #d84f1b; 
  --brand-light: rgba(240, 89, 31, 0.1); 
  --secondary-blur: rgba(59, 130, 246, 0.05); 
  --text-primary: #ffffff; 
  --text-pure-black: #000000; 
  --text-hover: #d4d4d8; 
  --text-secondary: #a1a1aa; 
  --text-muted: #71717a; 
  --text-number: #52525b; 
  --border: rgba(255, 255, 255, 0.06); 
  --border-md: rgba(255, 255, 255, 0.07); 
  --border-brand: rgba(240, 89, 31, 0.4); 
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ═══ HERO ═══ */
.gt-hero { position: relative; min-height: 520px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--dark); }
.gt-hero-video-bg { position: absolute; inset: 0; z-index: 0; }
.gt-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1.2s ease; }
.gt-hero-video.active { opacity: 1; }
.gt-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%); }
.gt-hero-inner { position: relative; z-index: 2; max-width: 760px; width: 100%; padding: 3rem 1.5rem; text-align: center; }
.gt-hero-title { font-family: 'Sora', sans-serif; font-size: clamp(32px, 5.5vw, 56px); font-weight: 800; color: var(--text-primary); line-height: 1.2; margin-bottom: 16px; text-shadow: 0 4px 20px rgba(0,0,0,0.9), 0 0 40px rgba(240, 89, 31, 0.4); animation: gtFadeUp 0.6s ease both; }
.gt-hero-title em { font-style: normal; color: var(--brand); text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
.gt-hero-subtitle { font-size: clamp(16px, 2.5vw, 20px); color: #e2e8f0; font-weight: 500; margin-bottom: 32px; text-shadow: 0 2px 10px rgba(0,0,0,0.9); letter-spacing: 0.5px; animation: gtFadeUp 0.8s ease both; }
.gt-hero-subtitle em { font-style: normal; color: var(--brand); font-weight: 600; }
.gt-search-bar { display: flex; align-items: center; gap: 8px; background: var(--surface-2); backdrop-filter: blur(20px); border: 1px solid var(--border-md); border-radius: 100px; padding: 6px 6px 6px 0; max-width: 680px; margin: 0 auto 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); animation: gtFadeUp 1s ease both; }
.gt-search-input-wrap { flex: 1; position: relative; display: flex; align-items: center; }
.gt-search-icon { position: absolute; left: 18px; font-size: 18px; color: var(--text-muted); pointer-events: none; }
.gt-search-input { width: 100%; border: none; outline: none; background: transparent; padding: 13px 16px 13px 48px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-primary); }
.gt-search-input::placeholder { color: var(--text-muted); }
.gt-search-select { border: none; outline: none; background: var(--surface-2); border-radius: 50px; padding: 10px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-hover); cursor: pointer; min-width: 140px; max-width: 160px; }
.gt-search-select option { background: var(--dark); color: var(--text-primary); }
.gt-search-btn { background: var(--brand); color: var(--text-primary); border: none; border-radius: 50px; padding: 12px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: var(--transition); }
.gt-search-btn:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 4px 20px var(--border-brand); }
.gt-type-tabs { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.gt-type-tab { border: 1px solid var(--border); background: var(--surface-2); color: var(--text-secondary); border-radius: 50px; padding: 7px 18px; font-size: 13px; font-weight: 500; cursor: pointer; transition: var(--transition); white-space: nowrap; }
.gt-type-tab:hover { background: var(--surface-active); border-color: var(--border-md); color: var(--text-primary); }
.gt-type-tab.active { background: var(--brand); border-color: var(--brand); color: var(--text-primary); }

/* ═══ CATEGORY STRIP ═══ */
.gt-cat-strip { background: var(--dark); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.gt-cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 12px 24px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.gt-cat-scroll::-webkit-scrollbar { display: none; }
.gt-cat-pill { border: 1.5px solid var(--border); background: var(--surface-2); color: var(--text-secondary); border-radius: 50px; padding: 7px 16px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: var(--transition); flex-shrink: 0; }
.gt-cat-pill:hover { border-color: var(--brand); color: var(--text-hover); background: var(--secondary-blur); }
.gt-cat-pill.active { border-color: var(--brand); background: var(--brand); color: var(--text-primary); }

/* ═══ MAIN ═══ */
.gt-main { max-width: 1320px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.gt-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 12px; }
.gt-section-title { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 600; color: var(--text-primary); }
.gt-section-title em { font-style: normal; color: var(--brand); }
.gt-toolbar-right { display: flex; align-items: center; gap: 12px; }
.gt-count { font-size: 13px; color: var(--text-muted); }
.gt-view-toggle { display: flex; border: 1px solid var(--border-md); border-radius: var(--radius-sm); overflow: hidden; }
.gt-view-toggle button { border: none; background: var(--surface-2); padding: 7px 10px; cursor: pointer; color: var(--text-muted); transition: var(--transition); }
.gt-view-toggle button:hover { color: var(--brand); background: var(--secondary-blur); }
.gt-view-toggle button.active { color: var(--brand); background: var(--secondary-blur); }

/* ═══ CATEGORY SLIDERS (NEW) ═══ */
.gt-categories-container { display: flex; flex-direction: column; gap: 3rem; }
.gt-category-section { display: flex; flex-direction: column; gap: 1rem; }
.gt-category-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border); padding-bottom: 10px;}
.gt-category-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 600; color: var(--text-primary); }
.gt-view-all-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--brand); font-weight: 600; font-size: 14px; cursor: pointer; transition: var(--transition); }
.gt-view-all-btn:hover { color: var(--brand-dark); transform: translateX(3px); }
.gt-slider-wrapper { position: relative; display: flex; align-items: center; }
.gt-slider-track { display: flex; gap: 20px; overflow-x: auto; scroll-behavior: smooth; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 15px; }
.gt-slider-track::-webkit-scrollbar { display: none; }
.gt-slider-item { flex: 0 0 260px; scroll-snap-align: start; }
.gt-slider-arrow { position: absolute; z-index: 10; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: var(--surface-active); backdrop-filter: blur(10px); border: 1px solid var(--border-md); color: var(--text-primary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-md); opacity: 0; }
.gt-slider-wrapper:hover .gt-slider-arrow { opacity: 1; }
.gt-slider-arrow:hover { background: var(--brand); border-color: var(--brand); }
.gt-slider-arrow.left { left: -20px; }
.gt-slider-arrow.right { right: -20px; }

/* ═══ GIG GRID ═══ */
.gt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 20px; }
.gt-grid.gt-list { grid-template-columns: 1fr; }

/* ═══ GIG CARD ═══ */
.gt-gig-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; height: 100%;}
.gt-gig-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-brand); background: var(--surface-active); }
.gt-grid.gt-list .gt-gig-card { flex-direction: row; height: 130px; }
.gt-gig-thumb { position: relative; width: 100%; height: 180px; background: var(--surface-active); overflow: hidden; flex-shrink: 0; }
.gt-grid.gt-list .gt-gig-thumb { width: 180px; height: 100%; }
.gt-gig-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.gt-gig-card:hover .gt-gig-thumb img { transform: scale(1.05); }
.gt-gig-thumb-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--surface-active) 0%, var(--surface-2) 100%); display: flex; align-items: center; justify-content: center; }
.gt-gig-thumb-placeholder span { font-family: 'Sora', sans-serif; font-size: 40px; font-weight: 700; color: var(--text-number); }
.gt-gig-category-badge { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); color: var(--text-primary); font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 50px; letter-spacing: 0.02em; }
.gt-gig-body { padding: 14px 14px 8px; flex: 1; min-width: 0; }
.gt-gig-seller { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.gt-seller-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1.5px solid var(--border-md); }
.gt-seller-initials { background: var(--brand-light); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--brand); }
.gt-seller-name { font-size: 13px; color: var(--text-secondary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.gt-level-badge { font-size: 10px; font-weight: 600; background: var(--brand-light); color: var(--brand); padding: 2px 8px; border-radius: 50px; flex-shrink: 0; }
.gt-gig-title { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
.gt-gig-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.gt-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #f59e0b; }
.gt-rating em { font-style: normal; color: var(--text-muted); font-weight: 400; }
.gt-delivery { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); }

/* FOOTER & LIKE BTN */
.gt-gig-footer { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); margin-top: auto; }
.gt-like-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; font-size: 13px; font-weight: 500; padding: 4px; }
.gt-like-btn:hover { color: #ef4444; transform: scale(1.1); }
.gt-like-btn.liked { color: #ef4444; }
.like-count { font-size: 12px; font-family: 'Sora', sans-serif; }
.gt-price-wrap { display: flex; align-items: center; gap: 6px; }
.gt-price-label { font-size: 11px; color: var(--text-muted); }
.gt-price { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: var(--brand); }

/* ═══ SKELETON ═══ */
.gt-skeleton { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; animation: gtPulse 1.5s ease infinite; }
.gt-skeleton-thumb { width: 100%; height: 180px; background: var(--surface-active); }
.gt-skeleton-body { padding: 14px; }
.gt-skeleton-line { background: var(--surface-active); border-radius: 4px; margin-bottom: 6px; }
.gt-user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.gt-bd-col { display: contents; }
.gt-empty { text-align: center; padding: 5rem 2rem; grid-column: 1 / -1; }
.gt-empty-icon { width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; background: var(--surface-2); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.gt-empty h3 { font-family: 'Sora', sans-serif; font-size: 18px; color: var(--text-primary); margin-bottom: 8px; }
.gt-empty p { font-size: 14px; color: var(--text-muted); }
.gt-result-info { font-size: 14px; color: var(--text-secondary); margin-bottom: 1.25rem; }
.gt-pagination { display: flex; justify-content: center; margin-top: 3rem; }

/* ═══ DRAWER ═══ */
.gt-drawer { position: fixed; inset: 0; z-index: 200; pointer-events: none; }
.gt-drawer.open { pointer-events: all; }
.gt-drawer-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background 0.3s ease; }
.gt-drawer.open .gt-drawer-backdrop { background: rgba(0,0,0,0.6); }
.gt-drawer-panel { position: absolute; top: 0; right: 0; bottom: 0; width: min(420px, 100vw); background: var(--dark); border-left: 1px solid var(--border-md); box-shadow: -8px 0 32px rgba(0,0,0,0.5); transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
.gt-drawer.open .gt-drawer-panel { transform: translateX(0); }
.gt-drawer-close { display: flex; align-items: center; gap: 8px; border: none; background: transparent; padding: 16px 20px; font-size: 14px; color: var(--text-secondary); cursor: pointer; border-bottom: 1px solid var(--border); transition: color 0.2s; }
.gt-drawer-close:hover { color: var(--brand); }
.gt-drawer-body { flex: 1; overflow-y: auto; padding: 16px; }
.gt-banner-wrap { max-width: 1320px; margin: 0 auto; padding: 0 1.5rem 3rem; }
.gt-banner-img { width: 100%; border-radius: var(--radius-xl); display: block; }

@keyframes gtFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes gtPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

@media (max-width: 768px) {
  .gt-hero { min-height: 480px; }
  .gt-hero-inner { padding: 2rem 1rem; }
  .gt-search-bar { flex-direction: column; border-radius: var(--radius-lg); padding: 12px; gap: 10px; }
  .gt-search-select, .gt-search-btn { width: 100%; border-radius: var(--radius-md); }
  .gt-search-input { padding: 12px 16px 12px 44px; }
  .gt-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
  .gt-slider-item { flex: 0 0 220px; }
  .gt-slider-arrow { display: none; } /* Hide arrows on mobile, users can swipe */
}
@media (max-width: 480px) {
  .gt-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .gt-slider-item { flex: 0 0 200px; }
}
`;

export default React.memo(Freelancers);