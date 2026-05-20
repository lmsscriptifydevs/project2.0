import { Button, Pagination } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsSearch, BsPlusLg } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import Footer from "../components/Footer";
import Freelancer from "../components/Freelancer";
import Navbar from "../components/Navbar";
import { titleToSlug, getGigImages, getGigVideo } from "../utils/helpers";
import { useAccessToken } from "../utils/useLocalStorage";
import Loader from "../assets/LoaderImg.gif";
import BrowseCategories from "../components/homepage/BrowseCategories";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={"slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")}
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
    style={{ ...props.style, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0591f", borderRadius: "50%", width: "40px", height: "40px", zIndex: 2, left: "-15px", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
  >
  </button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={"slick-next slick-arrow" + (currentSlide === slideCount - 1 ? " slick-disabled" : "")}
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button"
    style={{ ...props.style, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0591f", borderRadius: "50%", width: "40px", height: "40px", zIndex: 2, right: "-15px", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
  >
  </button>
);

const SearchGigsMainBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAccessToken();

  const receivedData = useMemo(
    () => (location.state?.data ? location.state.data : { search: "" }),
    [location.state]
  );
  
  const [searchKeyword, setSearchKeyword] = useState(receivedData?.search || "");
  const [locationKeyword, setLocationKeyword] = useState(receivedData?.location || "");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(searchKeyword);
  const [debouncedLocationKeyword, setDebouncedLocationKeyword] = useState(locationKeyword);
  const [gigs, setGigs] = useState([]);
  const [recommendedGigs, setRecommendedGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [allGigsCache, setAllGigsCache] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      setDebouncedLocationKeyword(locationKeyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchKeyword, locationKeyword]);

  useEffect(() => {
    setAllGigsCache(null); // Invalidate cache when category changes
  }, [selectedCategory]);

  useEffect(() => {
    fetchGigs();
  }, [debouncedSearchKeyword, debouncedLocationKeyword, selectedCategory, page]);

  useEffect(() => {
    fetchRecommendedGigs();
  }, []);

  const fetchRecommendedGigs = async () => {
    try {
      const response = await fetch(`https://portal.grapetask.co/api/category-wise-gigs?page=1&per_page=12`);
      const data = await response.json();
      if (data.status) {
        setRecommendedGigs(data.data);
      }
    } catch (error) {
      console.error("Error fetching recommended gigs:", error);
    }
  };

  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      if (debouncedSearchKeyword || debouncedLocationKeyword) {
        let allGigs = allGigsCache;
        
        // Fetch all pages using auto-pagination if not cached yet
        if (!allGigs) {
          allGigs = [];
          let currentPage = 1;
          let total = 1;
          
          while (currentPage <= total) {
            let url = `https://portal.grapetask.co/api/category-wise-gigs?page=${currentPage}&per_page=100`;
            if (selectedCategory !== "All Categories") {
              url += `&category_id=${selectedCategory}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status) {
              allGigs = [...allGigs, ...data.data];
              total = data.pagination?.total_pages || 1;
              if (categories.length === 0) setCategories(data.categories || []);
            } else {
              break;
            }
            currentPage++;
          }
          setAllGigsCache(allGigs);
        }

        // Apply local filtering to find exact matches
        const locLower = debouncedLocationKeyword ? debouncedLocationKeyword.toLowerCase() : "";
        const searchLower = debouncedSearchKeyword ? debouncedSearchKeyword.toLowerCase() : "";
        
        const filteredGigs = allGigs.filter(gig => {
          let matchSearch = true;
          let matchLoc = true;
          
          if (searchLower) {
            const titleMatch = gig.title && gig.title.toLowerCase().includes(searchLower);
            let tagsMatch = false;
            if (gig.tags) {
              try {
                const tagsArr = typeof gig.tags === 'string' && gig.tags.startsWith('[') ? JSON.parse(gig.tags) : (Array.isArray(gig.tags) ? gig.tags : [gig.tags]);
                tagsMatch = tagsArr.some(t => t.toLowerCase().includes(searchLower));
              } catch(e) {
                 tagsMatch = typeof gig.tags === 'string' && gig.tags.toLowerCase().includes(searchLower);
              }
            }
            matchSearch = titleMatch || tagsMatch;
          }
          
          if (locLower) {
            const seller = gig.seller;
            if (!seller) {
              matchLoc = false;
            } else {
              matchLoc = (seller.city && seller.city.toLowerCase().includes(locLower)) ||
                         (seller.state && seller.state.toLowerCase().includes(locLower)) ||
                         (seller.country && seller.country.toLowerCase().includes(locLower));
            }
          }
          
          return matchSearch && matchLoc;
        });

        // Apply local pagination
        const totalPgs = Math.ceil(filteredGigs.length / perPage) || 1;
        setTotalPages(totalPgs);
        
        let safePage = page;
        if (safePage > totalPgs) {
           safePage = totalPgs;
           setPage(safePage);
        }
        
        const startIdx = (safePage - 1) * perPage;
        setGigs(filteredGigs.slice(startIdx, startIdx + perPage));

      } else {
        // Standard API pagination when no search/location filters are applied
        let url = `https://portal.grapetask.co/api/category-wise-gigs?page=${page}&per_page=${perPage}`;
        if (selectedCategory !== "All Categories") {
          url += `&category_id=${selectedCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status) {
          setGigs(data.data);
          if (categories.length === 0) {
            setCategories(data.categories || []);
          }
          setTotalPages(data.pagination?.total_pages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching category wise gigs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSellerName = (seller) => {
    if (Array.isArray(seller)) {
      return seller[0]?.fname || "seller";
    }
    return seller?.fname || "seller";
  };

  const handleGigNavigate = useCallback(
    (gig) => {
      const slug = titleToSlug(gig?.title);
      const sellerName = getSellerName(gig?.seller);
      navigate(`/g/${slug}/${sellerName}/${gig?.id}`);
    },
    [navigate]
  );

  const handleCreateGig = useCallback(() => navigate("/multiSteps"), [navigate]);

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#ffffff", paddingBottom: "50px" }}>
      {token ? <Navbar FirstNav="none" /> : <Navbar SecondNav="none" />}

      <div className="container my-3 poppins">
        {/* Top Header & Create Gig Button */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-0 mt-sm-0 mt-4 pe-lg-0">
            <div className="d-flex gap-2" style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.02)", 
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "8px",
              overflow: "hidden",
              flexWrap: "nowrap"
            }}>
              <div className="input-group" style={{ flex: 1 }}>
                <span className="input-group-text bg-transparent border-0 text-white pt-2 pb-2">
                  <BsSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 text-white shadow-none"
                  placeholder="Search Keyword..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setPage(1);
                  }}
                  style={{ color: "#ffffff" }}
                />
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", margin: "8px 0" }}></div>
              <div className="input-group" style={{ flex: 1 }}>
                <span className="input-group-text bg-transparent border-0 text-white pt-2 pb-2">
                  <GoLocation />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 text-white shadow-none"
                  placeholder="Search City..."
                  value={locationKeyword}
                  onChange={(e) => {
                    setLocationKeyword(e.target.value);
                    setPage(1);
                  }}
                  style={{ color: "#ffffff" }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-3 mt-sm-3 mt-4 pe-lg-0 text-end justify-content-lg-end justify-content-start d-flex align-items-center gap-3">
             <select
              className="form-select shadow-none d-inline-block w-auto"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "#a1a1aa",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
              }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="All Categories" style={{ backgroundColor: "#020617" }}>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ backgroundColor: "#020617" }}>
                  {cat.name}
                </option>
              ))}
            </select>

            <Button onClick={handleCreateGig} className="btn-stepper poppins px-3 font-16" sx={{ backgroundColor: "#f0591f", color: "#fff", "&:hover": { backgroundColor: "#d04715" } }}>
              <BsPlusLg className="me-2" /> Create your new gig
            </Button>
          </div>
        </div>

        {/* Gigs Results */}
        <div className="row">
          <h3 className="mt-4 mb-4">
            Results for <span style={{ color: "#f0591f" }}>{searchKeyword ? searchKeyword : "All Gigs"}</span>
            {locationKeyword && <span style={{ fontSize: '0.8em', color: '#a1a1aa' }}> in {locationKeyword}</span>}
          </h3>
          
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <img src={Loader} width={120} height={120} alt="Loading" loading="lazy" />
              <h2 className="cocon fw-bold mt-2 text-white">Loading…</h2>
            </div>
          ) : gigs.length > 0 ? (
            gigs.map((gig) => {
              const avgRating = Number(gig.ratings_avg_ratings) || 0;
              const ratingCount = Number(gig.ratings_count) || 0;
              const deliveryTime = gig?.packages?.[0]?.delivery_time || "N/A";
              const stars = Array.from({ length: 5 }, (_, i) => (avgRating > i ? "#f0591f" : "#52525b"));

              return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={gig.id}>
                  <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)"}
                  >
                    <Freelancer
                      gigId={gig.id}
                      handleNavigate={() => handleGigNavigate(gig)}
                      images={getGigImages(gig.media)}
                      video={getGigVideo(gig.media)}
                      heading={gig.title}
                      seller={getSellerName(gig.seller)}
                      rating={avgRating}
                      ratingCount={ratingCount}
                      star1={stars[0]}
                      star2={stars[1]}
                      star3={stars[2]}
                      star4={stars[3]}
                      star5={stars[4]}
                      delivery={deliveryTime}
                      price={gig.packages?.[0]?.total || "0"}
                      customStyles={{
                        titleColor: "#ffffff",
                        sellerColor: "#a1a1aa",
                        priceColor: "#f0591f",
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5 my-5">
              <h2 className="cocon fw-bold mb-3" style={{ color: "#f0591f" }}>No Gigs Found</h2>
              <p className="font-16 text-muted mb-4" style={{ color: "#a1a1aa" }}>We couldn't find any gigs matching "{searchKeyword}". Try exploring other popular categories below!</p>
              <Button onClick={() => { setSearchKeyword(""); setPage(1); }} sx={{ backgroundColor: "#f0591f", color: "#fff", "&:hover": { backgroundColor: "#d04715" } }} className="poppins px-4 py-2 font-16 rounded-3">
                Clear Search
              </Button>
            </div>
          )}
          
          {/* Pagination Section */}
          {!isLoading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 mb-4">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#d4d4d8" },
                  "& .Mui-selected": { backgroundColor: "rgba(240, 89, 31, 0.4) !important", color: "#f0591f" },
                  "& .MuiPaginationItem-root:hover": { backgroundColor: "rgba(255, 255, 255, 0.04)" }
                }}
              />
            </div>
          )}

          {/* Show Browse Categories if no gigs found */}
          {!isLoading && gigs.length === 0 && (
            <div className="col-12 mt-5 pt-5">
              <h3 className="cocon fw-bold mb-4 text-center">Explore Categories</h3>
              <div style={{ marginTop: "-50px" }}>
                 <BrowseCategories />
              </div>
            </div>
          )}

          {/* Recommended Gigs Slider */}
          <div className="col-12 mt-5 pt-4 border-top border-secondary" style={{ position: "relative" }}>
            <h3 className="cocon fw-bold mb-4 text-center">Recommended For You</h3>
            {recommendedGigs && recommendedGigs.length > 0 ? (
              <div className="px-4 pb-5">
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={4}
                  slidesToScroll={1}
                  prevArrow={<SlickArrowLeft />}
                  nextArrow={<SlickArrowRight />}
                  responsive={[
                    { breakpoint: 1200, settings: { slidesToShow: 3 } },
                    { breakpoint: 992, settings: { slidesToShow: 2 } },
                    { breakpoint: 576, settings: { slidesToShow: 1 } },
                  ]}
                >
                  {recommendedGigs.map((gig) => {
                    const avgRating = Number(gig.ratings_avg_ratings) || 0;
                    const ratingCount = Number(gig.ratings_count || gig.ratings_coun) || 0;
                    const deliveryTime = gig?.packages?.[0]?.delivery_time || "N/A";
                    const stars = Array.from({ length: 5 }, (_, i) => (avgRating > i ? "#f0591f" : "#52525b"));

                    return (
                      <div key={gig.id} className="p-2" style={{ height: "100%" }}>
                        <div style={{
                          backgroundColor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          borderRadius: "12px",
                          overflow: "hidden",
                          height: "100%",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)"}
                        >
                          <Freelancer
                            gigId={gig.id}
                            handleNavigate={() => handleGigNavigate(gig)}
                            images={getGigImages(gig.media)}
                            video={getGigVideo(gig.media)}
                            heading={gig.title}
                            seller={getSellerName(gig.seller)}
                            rating={avgRating}
                            ratingCount={ratingCount}
                            star1={stars[0]}
                            star2={stars[1]}
                            star3={stars[2]}
                            star4={stars[3]}
                            star5={stars[4]}
                            delivery={deliveryTime}
                            price={gig.packages?.[0]?.total || "0"}
                            customStyles={{
                              titleColor: "#ffffff",
                              sellerColor: "#a1a1aa",
                              priceColor: "#f0591f",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <div className="text-center">
                <img src={Loader} width={60} height={60} alt="Loading" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchGigsMainBanner;