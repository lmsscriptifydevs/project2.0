import { Button, Pagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Freelancer from "../components/Freelancer";
import Navbar from "../components/Navbar";
import { titleToSlug, getGigImages, getGigVideo } from "../utils/helpers";
import { useAccessToken } from "../utils/useLocalStorage";
import Loader from "../assets/LoaderImg.gif";

const CategoryWiseGigs = () => {
  const navigate = useNavigate();
  const token = useAccessToken();

  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(8);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchGigs();
  }, [debouncedSearch, selectedCategory, page]);

  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      let url = `https://portal.grapetask.co/api/category-wise-gigs?page=${page}&per_page=${perPage}`;
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (selectedCategory !== "All Categories") {
        url += `&category_id=${selectedCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status) {
        setGigs(data.data);
        setCategories(data.categories);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching category wise gigs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGigNavigate = useCallback(
    (gig) => {
      const slug = titleToSlug(gig?.title);
      const sellerName = gig?.seller?.fname || "seller";
      navigate(`/g/${slug}/${sellerName}/${gig?.id}`);
    },
    [navigate]
  );

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#ffffff", paddingBottom: "50px" }}>
      {token ? <Navbar FirstNav="none" /> : <Navbar SecondNav="none" />}

      <div className="container mt-4 poppins">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#f0591f" }}>
          Explore Category Wise Gigs
        </h2>

        {/* Search and Filter Section */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-6 mb-3 mb-lg-0">
            <div className="input-group" style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.02)", 
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <span className="input-group-text bg-transparent border-0 text-white pt-2 pb-2">
                <BsSearch />
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white shadow-none"
                placeholder="Search gigs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ color: "#ffffff" }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <select
              className="form-select w-100 py-2 shadow-none"
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
          </div>
        </div>

        {/* Gigs Display Section */}
        <div className="row">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <img src={Loader} width={120} height={120} alt="Loading" />
              <h4 className="mt-3 text-white">Loading Gigs...</h4>
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
                      seller={gig.seller?.fname || "seller"}
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
            <div className="col-12 text-center py-5">
              <h3 style={{ color: "#71717a" }}>No gigs found for this criteria.</h3>
              <Button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All Categories");
                }}
                sx={{
                  mt: 2,
                  backgroundColor: "#f0591f",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#d04715" }
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {!isLoading && totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
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
      </div>

      <Footer />
    </div>
  );
};

export default CategoryWiseGigs;