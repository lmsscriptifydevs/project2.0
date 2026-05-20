import { Button } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsPlusLg, BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteSweep, MdEditNote } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { geAllGigs } from "../redux/slices/allGigsSlice";
import { GigDelete } from "../redux/slices/gigsSlice";
import { getPersonalGigs } from "../redux/slices/offersSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { titleToSlug, getGigImages, getGigVideo } from "../utils/helpers";
import Dashboardright from "./Dashboardright";
import Freelancer from "./Freelancer";
import Navbar from "./Navbar";

// Helper: Calculate average rating
const getAverageRating = (ratingsData) => { // eslint-disable-line no-unused-vars
  if (ratingsData === null || ratingsData === undefined || ratingsData === '') {
    return 0;
  }
  
  if (typeof ratingsData === 'number') {
    return isNaN(ratingsData) ? 0 : Math.round(Math.max(0, Math.min(5, ratingsData)));
  }
  
  if (typeof ratingsData === 'string') {
    const parsed = parseFloat(ratingsData.trim());
    return isNaN(parsed) ? 0 : Math.round(Math.max(0, Math.min(5, parsed)));
  }
  
  if (typeof ratingsData === 'boolean') {
    return ratingsData ? 1 : 0;
  }
  
  if (Array.isArray(ratingsData)) {
    if (ratingsData.length === 0) return 0;
    const extractedRatings = ratingsData.map(item => extractRatingValue(item)).filter(r => r !== null);
    if (extractedRatings.length === 0) return 0;
    const sum = extractedRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / extractedRatings.length;
    return Math.round(Math.max(0, Math.min(5, average)));
  }
  
  if (typeof ratingsData === 'object') {
    const possibleRatings = [
      ratingsData.ratings, ratingsData.rating, ratingsData.rate,
      ratingsData.score, ratingsData.stars, ratingsData.value,
      ratingsData.average, ratingsData.avg, ratingsData.mean
    ];
    
    for (const possibleRating of possibleRatings) {
      if (possibleRating !== undefined && possibleRating !== null) {
        const result = getAverageRating(possibleRating);
        if (result > 0) return result;
      }
    }
    
    const numericValues = Object.values(ratingsData)
      .map(val => extractRatingValue(val))
      .filter(val => val !== null);
    
    if (numericValues.length > 0) {
      const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      return Math.round(Math.max(0, Math.min(5, average)));
    }
  }
  
  return 0;
};

const extractRatingValue = (item) => {
  if (item === null || item === undefined) return null;
  
  if (typeof item === 'number') {
    return isNaN(item) ? null : Math.max(0, Math.min(5, item));
  }
  
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (trimmed === '') return null;
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? null : Math.max(0, Math.min(5, parsed));
  }
  
  if (typeof item === 'object') {
    const ratingFields = [
      'rating', 'ratings', 'rate', 'score', 'stars', 
      'value', 'star', 'point', 'points', 'grade'
    ];
    
    for (const field of ratingFields) {
      if (item[field] !== undefined && item[field] !== null) {
        const extracted = extractRatingValue(item[field]);
        if (extracted !== null) return extracted;
      }
    }
  }
  
  return null;
};

const getGigImageArray = (media) => {
  return getGigImages(media);
};

const getGigVideoUrl = (media) => {
  return getGigVideo(media);
};

const getSellerName = (seller) => {
  if (Array.isArray(seller)) {
    return seller[0]?.fname || 'seller';
  }
  return seller?.fname || 'seller';
};

const Gigs2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { personalGigs } = useSelector((state) => state.offers);
  const { gigsDetail } = useSelector((state) => state.allGigs);

  // PERF STARTUP: Defer localStorage read to avoid blocking render
  const [UserData, setUserData] = useState(null);
  useEffect(() => {
    const readUserData = () => {
      try {
        const data = JSON.parse(localStorage.getItem("UserData"));
        setUserData(data);
      } catch {
        setUserData(null);
      }
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(readUserData, { timeout: 0 });
    } else {
      setTimeout(readUserData, 0);
    }
  }, []);

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  }), []);

  // PERF STARTUP: Defer API calls until after first paint - UI renders first, data loads in background
  useEffect(() => {
    const fetchData = () => {
      if (UserData?.id) {
        dispatch(getPersonalGigs({ user_id: UserData.id }));
      }
      dispatch(geAllGigs());
    };
    
    // PERF: Defer API calls until after first paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchData, { timeout: 500 });
    } else {
      setTimeout(fetchData, 0);
    }
  }, [dispatch, UserData?.id]);

  const Real_Freelancer = useMemo(() => {
    const gigs = gigsDetail?.flatMap((obj) => obj.gigs || []) || [];
    const uniqueGigs = [];
    const seenIds = new Set();

    for (const gig of gigs) {
      if (gig?.id && !seenIds.has(gig.id)) {
        seenIds.add(gig.id);
        uniqueGigs.push(gig);
      }
    }

    return uniqueGigs.filter(gig => gig && gig.id);
  }, [gigsDetail]);

  const handleGigDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      dispatch(GigDelete(id));
    }
  }, [dispatch]);

  const handleGigNavigate = useCallback((gig) => {
    const slug = titleToSlug(gig.title);
    const sellerName = getSellerName(gig.seller);
    navigate(`/g/${slug}/${sellerName}/${gig.id}`);
  }, [navigate]);

  const handleDropdownClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <Navbar FirstNav="none" />
      <div className="container-fluid pt-5 pb-5">
        <div className="row mx-lg-4 mx-md-3 mx-0">
          <div className="col-lg-4 col-12">
            <Dashboardright />
          </div>

          <div className="col-lg-8 col-12 mt-lg-0 mt-4">
            {(UserData?.role === "expert/freelancer" || 
              UserData?.role === "bidder/company representative/middleman") && (
              <>
                <div className="d-flex flex-wrap justify-content-between">
                  <h6 className="font-22 byerLine font-500 cocon">Gigs</h6>
                  <Button
                    onClick={() => navigate("/multiSteps")}
                    className="btn-stepper poppins px-3 font-16"
                  >
                    <BsPlusLg className="me-2" /> Create new gig
                  </Button>
                </div>

                <div className="row">
                  {personalGigs.length > 0 ? (
                    personalGigs.map((gig, index) => {
                      const avgRating = Number(gig.ratings_avg_ratings) || 0;
                      const ratingCount = Number(gig.ratings_coun) || 0;
                      const deliveryTime = gig?.packages?.[0]?.delivery_time || "N/A";
                      const stars = Array.from({ length: 5 }, (_, i) =>
                        avgRating > i ? "#ed5623" : "#D4D4D4"
                      );

                      return (
                        <div className="col-lg-4 col-md-4 col-sm-6 col-12 mt-4" key={gig.id ?? `gig-${index}`}>
                          <Freelancer
                            handleNavigate={() => handleGigNavigate(gig)}
                            images={getGigImageArray(gig.media)}
                            video={getGigVideoUrl(gig.media)}
                            heading={gig?.title}
                            price={gig.packages?.[0]?.total}
                            seller={getSellerName(gig.seller)}
                            rating={avgRating}
                            ratingCount={ratingCount}
                            star1={stars[0]}
                            star2={stars[1]}
                            star3={stars[2]}
                            star4={stars[3]}
                            star5={stars[4]}
                            delivery={deliveryTime}
                            gigId={gig.id}
                            gigData={gig}
                            gigStatus={gig.status}
                            isPro={gig.seller?.isPro || false}
                            sellerAvatar={gig.seller?.image}
                            arrow={
                              <div 
                                className="dropdown gig-editable"
                                onClick={handleDropdownClick}
                              >
                                <span
                                  className="dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <BsThreeDotsVertical />
                                </span>
                                <ul className="dropdown-menu poppins">
                                  <li>
                                 <button
  type="button"
  className="dropdown-item textgray font-12 fw-semibold"
  style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
  onClick={(e) => {
    e.stopPropagation();
    navigate("/multiSteps", { 
      state: { 
        gig: gig, // Pass complete gig instead of gig.draft
        isEditMode: true,
        gig_id: gig.id
      } 
    });
  }}
>
  <MdEditNote size={20} className="textgray" /> Edit
</button>
  <li>
                                    <button
                                      type="button"
                                      className="dropdown-item textgray font-12 fw-semibold"
                                      style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGigDelete(gig.id);
                                      }}
                                    >
                                      <MdDeleteSweep size={20} className="textgray" /> Delete
                                    </button>
                                  </li>
                                  </li>
                                </ul>
                              </div>
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <h3 className="cocon mt-3 text-muted">No gigs found</h3>
                  )}
                </div>
              </>
            )}

            <h4 className="font-22 byerLine font-500 cocon mt-4">
              Most Popular Gigs
            </h4>

            <div className="gigs-slider-container mb-5 mt-4">
              <Slider {...sliderSettings}>
                {Real_Freelancer.slice(0, 8).map((gig, index) => {
                  const avgRating = Number(gig.ratings_avg_ratings) || 0;
                  const ratingCount = Number(gig.ratings_coun) || 0;
                  const deliveryTime = gig?.packages?.[0]?.delivery_time || "N/A";
                  const stars = Array.from({ length: 5 }, (_, i) =>
                    avgRating > i ? "#ed5623" : "#D4D4D4"
                  );

                  return (
                    <div key={gig.id ?? `gig-${index}`} className="px-2">
                      <Freelancer
                        handleNavigate={() => handleGigNavigate(gig)}
                        images={getGigImageArray(gig.media)}
                        video={getGigVideoUrl(gig.media)}
                        heading={gig?.title}
                        seller={getSellerName(gig.seller)}
                        rating={avgRating}
                        ratingCount={ratingCount}
                        star1={stars[0]}
                        star2={stars[1]}
                        star3={stars[2]}
                        star4={stars[3]}
                        star5={stars[4]}
                        delivery={deliveryTime}
                        price={gig.packages?.[0]?.total}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>

            <div className="mt-5">
              {/* Optional banner placeholder */}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gigs-slider-container {
          width: 100%;
          overflow: hidden;
          padding: 0 15px;
        }
        .gigs-slider-container .slick-slide {
          padding: 0 10px;
        }
        .gigs-slider-container .slick-list {
          margin: 0 -10px;
        }
        .gigs-slider-container .slick-prev:before,
        .gigs-slider-container .slick-next:before {
          color: #ed5623;
        }
      `}</style>
    </>
  );
};

export default Gigs2;