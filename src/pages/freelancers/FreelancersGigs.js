import { Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BsChevronLeft } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight, FaCheck } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import axios from "axios";
import star6 from "../../assets/5star.webp";
import ster from "../../assets/Frame.webp";
import icone from "../../assets/icone.webp";
import Loader from "../../assets/LoaderImg.gif";
import timepes from "../../assets/time (1).webp";

import Card from "../../components/Card";
import Footer from "../../components/Footer";
import Chating from "../../components/frelancerChat/Chat/Chating";
import Navbar from "../../components/Navbar";

import { useUserRole } from "../../utils/useLocalStorage";
import {
  getGigThumbnail,
  resolveMediaUrl as resolveMediaUrlHelper,
} from "../../utils/helpers";
import { geAllGigs, getGigDetail } from "../../redux/slices/allGigsSlice";
import {
  fetchMessages,
  clearConversationError,
  createOrFindConversation,
  setSelectedConversation,
} from "../../redux/slices/messageSlice";
import { onMessageListener } from "../firebase";
import "../../style/frelancer.scss";
import "../../style/imgSlider.scss";

// Constants for package types
const PACKAGE_TYPES = {
  BASIC: "basic",
  STANDARD: "standard",
  PREMIUM: "premium",
};

// 🎨 Theme Colors - GrapeTask Dark Theme
const THEME = {
  bg: {
    main: "#020617",
    card: "rgba(255, 255, 255, 0.02)",
    cardActive: "rgba(255, 255, 255, 0.04)",
  },
  accent: {
    primary: "#f0591f",
    blueBlur: "rgba(59, 130, 246, 0.05)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#71717a",
    medium: "#a1a1aa",
    light: "#d4d4d8",
    dark: "#52525b",
  },
  border: {
    light: "rgba(255, 255, 255, 0.06)",
    medium: "rgba(255, 255, 255, 0.07)",
    active: "rgba(240, 89, 31, 0.4)",
  },
  status: {
    success: "#1DBF73",
    warning: "#f0591f",
    error: "#FF5A5F",
  },
};

const FreelancersGigs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gigId } = useParams();
  const { gigsDetail, singleGigDetail, isPreLoading } = useSelector(
    (state) => state.allGigs,
  );
  const { creatingConversation } = useSelector((state) => state.message);

  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [joinedTime, setJoinedTime] = useState({ hours: 0 });
  const mainSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);
  const [validMediaItems, setValidMediaItems] = useState([]);
  const userRole = useUserRole();
  const uDataStr = localStorage.getItem("UserData");
  const tokenStr = localStorage.getItem("accessToken");
  const isLoggedIn = !!uDataStr && uDataStr !== "undefined" && uDataStr !== "null" && !!tokenStr && tokenStr !== "undefined" && tokenStr !== "null";

  const normalizedUserRole = useMemo(() => (userRole || "").trim().toLowerCase(), [userRole]);
  const roleCategory = useMemo(() => {
    if (normalizedUserRole === "client") return "client";
    if (
      normalizedUserRole === "bidder/company representative/middleman" ||
      normalizedUserRole === "bd"
    ) {
      return "businessDeveloper";
    }
    if (
      normalizedUserRole === "expert/freelancer" ||
      normalizedUserRole === "freelancer"
    ) {
      return "expert";
    }
    return "other";
  }, [normalizedUserRole]);
  const canCheckout = roleCategory === "client";
  const checkoutButtonText = useMemo(() => {
    if (canCheckout) return "Proceed to checkout";
    if (roleCategory === "businessDeveloper") return "Checkout unavailable for Business Developers";
    if (roleCategory === "expert") return "Checkout unavailable for Experts";
    return "Only clients can checkout";
  }, [canCheckout, roleCategory]);

  const handlePackageSelection = useCallback(
    (packageId) => {
      if (!singleGigDetail?.seller?.id || !singleGigDetail?.id) {
        toast.error("Missing required information for package selection");
        return;
      }

      navigate(
        `/order/payment?seller_id=${singleGigDetail.seller.id}&gig_id=${singleGigDetail.id}&package_id=${packageId}`,
      );
    },
    [singleGigDetail, navigate],
  );

  const { filteredBasic, filteredStandard, filteredPremium } = useMemo(() => {
    const filterByType = (array, targetType) =>
      array?.filter((obj) => obj.type === targetType) || [];

    return {
      filteredBasic: filterByType(
        singleGigDetail?.packages,
        PACKAGE_TYPES.BASIC,
      ),
      filteredStandard: filterByType(
        singleGigDetail?.packages,
        PACKAGE_TYPES.STANDARD,
      ),
      filteredPremium: filterByType(
        singleGigDetail?.packages,
        PACKAGE_TYPES.PREMIUM,
      ),
    };
  }, [singleGigDetail?.packages]);

  const handleBasic = useCallback(() => {
    if (filteredBasic[0]?.id) {
      handlePackageSelection(filteredBasic[0].id);
    }
  }, [filteredBasic, handlePackageSelection]);

  const handleStandard = useCallback(() => {
    if (filteredStandard[0]?.id) {
      handlePackageSelection(filteredStandard[0].id);
    }
  }, [filteredStandard, handlePackageSelection]);

  const handlePremium = useCallback(() => {
    if (filteredPremium[0]?.id) {
      handlePackageSelection(filteredPremium[0].id);
    }
  }, [filteredPremium, handlePackageSelection]);

  const handleCheckoutAttempt = useCallback(
    (packageId) => {
      if (!canCheckout) {
        if (roleCategory === "businessDeveloper") {
          toast.error(
            "Business Developers cannot proceed to checkout. Please contact the seller instead."
          );
          return;
        }
        if (roleCategory === "expert") {
          toast.error(
            "Experts cannot proceed to checkout. Please contact the seller instead."
          );
          return;
        }

        toast.error("Only clients can proceed to checkout.");
        return;
      }
      handlePackageSelection(packageId);
    },
    [canCheckout, handlePackageSelection, roleCategory]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchData = () => {
      dispatch(getGigDetail(gigId));
      dispatch(geAllGigs());
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchData, { timeout: 500 });
    } else {
      setTimeout(fetchData, 0);
    }

    const setupMessageListener = () => {
      onMessageListener()
        .then((payload) => {
          if (!cancelled) {
            toast.success(payload?.notification?.title, {
              position: "top-right",
              autoClose: 2000,
            });
          }
        })
        .catch((err) => {
          if (!cancelled) console.error("Failed to get message: ", err);
        });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(setupMessageListener, { timeout: 1000 });
    } else {
      setTimeout(setupMessageListener, 500);
    }

    return () => {
      cancelled = true;
    };
  }, [dispatch, gigId]);

  useEffect(() => {
    if (singleGigDetail?.id && singleGigDetail?.seller?.id) {
      const uData = localStorage.getItem("UserData");
      if (!uData) return;

      try {
        const parsed = JSON.parse(uData);
        const v_id = parsed?.id;
        const s_id = singleGigDetail.seller.id;
        const g_id = singleGigDetail.id;

        if (v_id === s_id) return;

        const rawPayload = JSON.stringify({
          a: v_id,
          b: s_id,
          c: g_id,
          type: "view",
          t: Date.now(),
        });

        const encodedTrackData = btoa(rawPayload);

        axios
          .post("https://portal.grapetask.co/algorithms/track_gig_view.php", {
            _token: encodedTrackData,
          })
          .then(() => {})
          .catch(() => {});
      } catch (e) {
        console.error("Tracking Error:", e);
      }
    }
  }, [singleGigDetail]);

  useEffect(() => {
    if (!singleGigDetail?.user?.created_at) return;
    const createdAtDate = new Date(singleGigDetail.user.created_at);
    const timeDifference = Math.abs(Date.now() - createdAtDate.getTime());
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
    );
    setJoinedTime({ hours });
  }, [singleGigDetail?.user?.created_at]);

  const { overallAverageRating, ratingPercentages } = useMemo(() => {
    const getRatingsArray = () => {
      if (!singleGigDetail?.ratings) return [];
      return Array.isArray(singleGigDetail.ratings)
        ? singleGigDetail.ratings
        : [singleGigDetail.ratings];
    };

    const ratings = getRatingsArray().map((item) => parseFloat(item.ratings));
    const validRatings = ratings.filter((value) => !isNaN(value));

    const average =
      validRatings.length > 0
        ? validRatings.reduce((acc, rating) => acc + rating, 0) /
          validRatings.length
        : 0;

    const percentages = [5, 4, 3, 2, 1].map((star) => {
      const count = validRatings.filter(
        (value) => Math.round(value) === star,
      ).length;
      return validRatings.length > 0 ? (count / validRatings.length) * 100 : 0;
    });

    return {
      overallAverageRating: average,
      ratingPercentages: percentages,
    };
  }, [singleGigDetail]);

  const handleStartChat = useCallback(
    async (client) => {
      const uData = localStorage.getItem("UserData");
      const token = localStorage.getItem("accessToken");

      if (!uData || !token) {
        toast.info("Contact with seller", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      if (!client?.id) {
        toast.error("Invalid client information");
        return;
      }

      setSelectedClient(client);
      dispatch(clearConversationError());

      try {
        const response = await dispatch(
          createOrFindConversation({ participantId: client.id })
        ).unwrap();

        if (!response || !response.id) {
          toast.error("Unable to create or fetch conversation");
          return;
        }

        dispatch(setSelectedConversation(response));
        setShowChatModal(true);

        if (!response.messages && response.id) {
          await dispatch(fetchMessages({ receiverId: response.id }));
        }

      } catch (error) {
        console.error("Error creating conversation:", error);
        toast.error("Failed to start conversation. Please try again.");
      }
    },
    [dispatch, navigate]
  );

  const closeChatModal = useCallback(() => {
    setShowChatModal(false);
    setSelectedClient(null);
  }, []);

  const NextArrow = useCallback(
    (props) => (
      <div className="arrow-next rounded-5" onClick={props.onClick} style={{ color: THEME.text.primary, backgroundColor: THEME.bg.card, border: `1px solid ${THEME.border.light}` }}>
        <FaAngleRight />
      </div>
    ),
    [],
  );

  const PrevArrow = useCallback(
    (props) => (
      <div className="arrow-prev rounded-5" onClick={props.onClick} style={{ color: THEME.text.primary, backgroundColor: THEME.bg.card, border: `1px solid ${THEME.border.light}` }}>
        <FaAngleLeft />
      </div>
    ),
    [],
  );

  const settingsMain = useMemo(
    () => ({
      dots: false,
      infinite: validMediaItems.length > 1,
      arrows: validMediaItems.length > 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      swipeToSlide: true,
      asNavFor: thumbnailSliderRef.current,
    }),
    [NextArrow, PrevArrow, validMediaItems.length],
  );

  const settingsThumbs = useMemo(
    () => ({
      dots: false,
      infinite: validMediaItems.length > 4,
      speed: 400,
      slidesToShow: Math.min(validMediaItems.length, 4),
      slidesToScroll: 1,
      focusOnSelect: true,
      swipeToSlide: true,
      asNavFor: mainSliderRef.current,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: Math.min(validMediaItems.length, 4),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(validMediaItems.length, 3),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: Math.min(validMediaItems.length, 2),
            slidesToScroll: 1,
          },
        },
      ],
    }),
    [validMediaItems.length],
  );

  const RecomendedGigsArray = useMemo(
    () =>
      gigsDetail.flatMap(
        (category) =>
          category.gigs?.filter(
            (gig) => gig.category_id === singleGigDetail?.category_id,
          ) || [],
      ),
    [gigsDetail, singleGigDetail?.category_id],
  );

  const settings = useMemo(
    () => ({
      dots: false,
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      speed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 992,
          settings: { slidesToShow: 3, slidesToScroll: 1, initialSlide: 2 },
        },
        {
          breakpoint: 576,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
      ],
    }),
    [],
  );

  const stripHtmlTags = useCallback((html) => {
    if (!html) return "";
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }, []);

  const resolveMediaUrl = useCallback((path) => {
    return resolveMediaUrlHelper(path);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const media = singleGigDetail?.media || {};

    const rawItems = [
      media?.video
        ? {
            type: "video",
            src: resolveMediaUrl(media.video),
            thumb: resolveMediaUrl(media.video),
          }
        : null,
      media?.image1
        ? {
            type: "image",
            src: resolveMediaUrl(media.image1),
            thumb: resolveMediaUrl(media.image1),
          }
        : null,
      media?.image2
        ? {
            type: "image",
            src: resolveMediaUrl(media.image2),
            thumb: resolveMediaUrl(media.image2),
          }
        : null,
      media?.image3
        ? {
            type: "image",
            src: resolveMediaUrl(media.image3),
            thumb: resolveMediaUrl(media.image3),
          }
        : null,
    ].filter(
      (item) => item?.src && typeof item.src === "string" && item.src.trim() !== "",
    );

    const checkImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });

    const checkVideo = (src) =>
      new Promise((resolve) => {
        const video = document.createElement("video");
        const done = (result) => {
          video.removeEventListener("loadeddata", onLoaded);
          video.removeEventListener("error", onError);
          resolve(result);
        };
        const onLoaded = () => done(true);
        const onError = () => done(false);

        video.addEventListener("loadeddata", onLoaded);
        video.addEventListener("error", onError);
        video.preload = "metadata";
        video.src = src;
      });

    const validateMedia = async () => {
      const checked = await Promise.all(
        rawItems.map(async (item) => {
          const isValid =
            item.type === "video"
              ? await checkVideo(item.src)
              : await checkImage(item.src);

          return isValid ? item : null;
        }),
      );

      if (!cancelled) {
        setValidMediaItems(checked.filter(Boolean));
      }
    };

    validateMedia();

    return () => {
      cancelled = true;
    };
  }, [singleGigDetail?.media, resolveMediaUrl]);
  

  const renderMediaSlider = useCallback(() => {
    const mediaItems = validMediaItems;

    if (!mediaItems.length) return null;

    const renderMainMedia = (item, index) => {
      if (item.type === "video") {
        return (
          <video
            key={`main-${index}`}
            controls
            preload="metadata"
            playsInline
            className="fiverr-main-media"
          >
            <source src={item.src} type="video/mp4" />
          </video>
        );
      }

      return (
        <img
          key={`main-${index}`}
          src={item.src}
          alt={`Gig media ${index + 1}`}
          loading="lazy"
          className="fiverr-main-media"
        />
      );
    };

    const renderThumbMedia = (item, index) => (
      <div key={`thumb-${index}`} className="thumb-wrap px-1">
        <div className="fiverr-thumb-frame position-relative">
          {item.type === "video" ? (
            <>
              <video
                src={item.src}
                muted
                preload="metadata"
                playsInline
                className="fiverr-thumb-media"
              />
              <div className="fiverr-play-icon">▶</div>
            </>
          ) : (
            <img
              src={item.thumb}
              alt={`Thumbnail ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="fiverr-thumb-media"
            />
          )}
        </div>
      </div>
    );

    if (mediaItems.length === 1) {
      return (
        <div className="single-media-wrapper">
          <div className="fiverr-main-frame">
            {renderMainMedia(mediaItems[0], 0)}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="main-slider-img">
          <Slider
            {...settingsMain}
            ref={(slider) => {
              mainSliderRef.current = slider;
            }}
          >
            {mediaItems.map((item, index) => (
              <div key={`main-slide-${index}`}>
                <div className="fiverr-main-frame">
                  {renderMainMedia(item, index)}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="main-slider-thumbnail-img mt-3">
          <Slider
            {...settingsThumbs}
            ref={(slider) => {
              thumbnailSliderRef.current = slider;
            }}
          >
            {mediaItems.map((item, index) => renderThumbMedia(item, index))}
          </Slider>
        </div>
      </>
    );
  }, [validMediaItems, settingsMain, settingsThumbs]);

  const renderPackageContent = useCallback(
    (packageData) => (
      <>
        <div className="d-flex justify-content-between poppins">
          <h6 className="font-16 fw-semibold" style={{ color: THEME.text.primary }}>
            {packageData.type.toUpperCase()}
          </h6>
          <h6 className="font-16 fw-semibold" style={{ color: THEME.text.primary }}>
            ${packageData.total}
          </h6>
        </div>

        <div className="mt-3">
          <p className="font-14 inter" style={{ color: THEME.text.secondary }}>
            {stripHtmlTags(packageData.title)}
          </p>
        </div>

        <div className="mt-3">
          <p className="font-14 inter" style={{ color: THEME.text.secondary }}>
            {stripHtmlTags(packageData.description)}
          </p>
        </div>

        <div className="d-flex mt-2" style={{ color: THEME.text.secondary }}>
          <div className="ms-1 font-14 fw-semibold">
            <p>
              <BiTime className="me-2" size={16} />
              {packageData.delivery_time} Days Delivery
            </p>
          </div>
          <div className="ms-4 font-14 fw-semibold">
            <p>
              <TfiReload className="me-2" size={16} />
              {packageData.ravision} Revision
            </p>
          </div>
        </div>

        <div>
          {packageData.features?.map((feature, idx) => (
            <p
              key={feature.description ?? `feat-${idx}`}
              className="font-12"
              style={{ color: feature.included ? THEME.text.secondary : THEME.text.light }}
            >
              <FaCheck
                className={
                  feature.included ? "me-3" : "me-3"
                }
                style={{ color: feature.included ? THEME.accent.primary : THEME.text.light }}
              />
              {feature.description}
            </p>
          ))}
        </div>
      </>
    ),
    [stripHtmlTags],
  );

  const renderPackageTab = useCallback(
    (type, filteredPackages, handleSelect) => {
      const packageData = filteredPackages[0];
      if (!packageData) return null;

      return (
        <div>
          {renderPackageContent(packageData)}
          <div>
            <Button
              className="btn-stepper poppins w-100 font-16"
              data-bs-toggle="offcanvas"
              data-bs-target={`#offcanvas${type}`}
              aria-controls={`offcanvas${type}`}
            >
              Continue
            </Button>
            <Button
              className="btn-stepper-border poppins w-100 mt-3 font-16"
              onClick={() => handleStartChat(singleGigDetail?.seller)}
              disabled={creatingConversation}
            >
              {!isLoggedIn ? "Contact with seller" : "Contact with seller"}
            </Button>
          </div>
        </div>
      );
    },
    [
      renderPackageContent,
      handleStartChat,
      singleGigDetail?.seller,
      creatingConversation,
    ],
  );

  const renderPackageOffcanvas = useCallback(
    (type, filteredPackages, handleSelect) => {
      const packageData = filteredPackages[0];
      if (!packageData) return null;

      return (
        <div
          className="offcanvas offcanvas-end p-3"
          style={{ width: "45%", backgroundColor: THEME.bg.main, borderLeft: `1px solid ${THEME.border.light}` }}
          tabIndex={-1}
          id={`offcanvas${type}`}
          aria-labelledby={`offcanvas${type}Label`}
        >
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title"
              id="offcanvasRightLabel"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              style={{ cursor: "pointer", color: THEME.text.primary }}
            >
              <BsChevronLeft className="text-primary" style={{ color: THEME.accent.primary }} />
            </h5>
          </div>

          <div className="offcanvas-body pe-0">
            <h6 className="font-28 fw-semibold" style={{ color: THEME.text.primary }}>Service Details</h6>
            <p className="frelancer-ofcanva-text poppins mt-3 w-100 mb-0 font-18 fw-medium text-center p-3 mt-2" style={{ color: THEME.text.primary, backgroundColor: THEME.bg.card }}>
              {type}
            </p>

            <div className="appept p-3">
              {renderPackageContent(packageData)}
              {!canCheckout && (
                <p className="text-warning font-14 mb-3">
                  Only clients can proceed to checkout. Business Developers and Experts must contact the seller instead.
                </p>
              )}
              <div>
                <Button
                  onClick={() => handleCheckoutAttempt(packageData.id)}
                  className="btn-stepper poppins w-100 font-16"
                  disabled={!canCheckout}
                >
                  {checkoutButtonText}
                </Button>
                <Button
                  className="btn-stepper-border poppins w-100 mt-3 font-16"
                  onClick={() => handleStartChat(singleGigDetail?.seller)}
                  disabled={creatingConversation}
                >
                  {!isLoggedIn ? "Contact with seller" : "Contact with seller"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [
      renderPackageContent,
      handleStartChat,
      singleGigDetail?.seller,
      creatingConversation,
    ],
  );

  return (
    <>
      <ToastContainer />
      <Navbar FirstNav="none" />

      <div className="container mt-5" style={{ backgroundColor: THEME.bg.main, minHeight: "100vh" }}>
        {isPreLoading ? (
          <div className="row mt-5 justify-content-center">
            <div className="col-12 text-center py-5">
              <img
                src={Loader}
                width={120}
                height={120}
                alt=""
                loading="lazy"
              />
              <h2 className="cocon fw-bold mt-2" style={{ color: THEME.text.primary }}>Loading...</h2>
            </div>
          </div>
        ) : !singleGigDetail ? (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <h2 style={{ color: THEME.text.primary }}>No gig data found</h2>
              <Button onClick={() => navigate(-1)} style={{ backgroundColor: THEME.accent.primary, color: THEME.text.primary }}>Go Back</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="row mt-5">
              <div className="col-lg-8 col-12">
                <div className="d-flex justify-content-between flex-wrap poppins align-items-center">
                  <div className="d-flex align-items-center" style={{ color: THEME.accent.primary }}>
                    <p className="mb-0 font-16" style={{ color: THEME.text.primary }}>
                      {singleGigDetail?.category?.name}
                    </p>
                    <span>
                      <img src={icone} className="mx-3" alt="" loading="lazy" />
                    </span>
                    <p className="mb-0 font-16" style={{ color: THEME.text.primary }}>
                      {singleGigDetail?.subcategory?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 justify-content-center">
              <div className="col-lg-8 col-12 mt-4">
                <div className="Revie p-3" style={{ backgroundColor: THEME.bg.card, borderRadius: "12px" }}>
                  <div>
                    <h3 className="font-24 poppins" style={{ color: THEME.text.primary }}>
                      {singleGigDetail?.title}
                    </h3>
                  </div>

                  <div className="d-flex align-items-lg-center align-items-md-center align-items-start inter mb-lg-0 mb-3">
                    <img
                      src={
                        singleGigDetail?.seller?.image ??
                        singleGigDetail?.user?.image
                      }
                      className="rounded-circle"
                      width={30}
                      height={30}
                      alt="User"
                      style={{ border: `2px solid ${THEME.border.light}` }}
                    />
                    <div className="d-flex ms-2 align-items-center flex-wrap">
                      <div>
                        <h6
                          className="ms-2 font-14 mb-0 inter cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/profileOtherPerson/${singleGigDetail.seller?.fname}`,
                              { state: { userId: singleGigDetail.user_id } },
                            )
                          }
                          style={{ color: THEME.text.primary }}
                        >
                          {singleGigDetail?.seller?.fname}
                        </h6>
                      </div>
                      <div>
                        <p className="font-14 ms-2 mb-0" style={{ color: THEME.text.secondary }}>
                          {singleGigDetail?.seller?.role}
                        </p>
                      </div>
                      <div className="d-flex flex-wrap align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            size={16}
                            className="ms-1"
                            color={
                              i < Math.round(overallAverageRating)
                                ? THEME.accent.primary
                                : THEME.text.light
                            }
                          />
                        ))}

                        <p className="ms-2 font-14 mb-0" style={{ color: THEME.accent.primary }}>
                          ({overallAverageRating.toFixed(1)})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">{renderMediaSlider()}</div>

                  <div className="mt-2 poppins">
                    <h6 className="font-16 font-700" style={{ color: THEME.text.primary }}>About This Gig</h6>
                    <div 
                      className="font-14 mb-1 gig-description-html" 
                      style={{ color: THEME.text.primary }}
                      dangerouslySetInnerHTML={{ __html: singleGigDetail?.description || '' }}
                    />

                    <hr
                      className="border-0 mt-1 mb-1"
                      style={{
                        height: "1.5px",
                        opacity: "1",
                        backgroundColor: THEME.border.light,
                      }}
                    />

                    <p className="font-14 mb-0 poppins mt-3" style={{ color: THEME.text.secondary }}>
                      Product type
                    </p>
                    <p className="font-14 poppins" style={{ color: THEME.text.primary }}>
                      {singleGigDetail?.category?.name}
                    </p>

                    <div className="mt-lg-5">
                      <h3 className="font-20 mt-4 fw-bold" style={{ color: THEME.text.primary }}>About The Seller</h3>
                      <div className="d-flex">
                        <div>
                          <img
                            src={
                              singleGigDetail?.seller?.image ??
                              singleGigDetail?.user?.image
                            }
                            className="rounded-circle"
                            width={100}
                            height={100}
                            alt="User"
                            style={{ border: `2px solid ${THEME.border.light}` }}
                          />
                        </div>
                        <div className="ms-3">
                          <p className="font-14 fw-bold mb-2" style={{ color: THEME.text.primary }}>
                            {singleGigDetail?.seller?.fname}
                          </p>
                          <div className="d-flex">
                            {[...Array(5)].map((_, i) => (
                              <AiFillStar
                                key={i}
                                size={22}
                                color={
                                  i < Math.round(overallAverageRating)
                                    ? THEME.accent.primary
                                    : THEME.text.light
                                }
                              />
                            ))}
                            <p className="ms-2 fw-medium mb-0" style={{ color: THEME.accent.primary }}>
                              ({overallAverageRating.toFixed(1)})
                            </p>
                          </div>
                          <Button
                            className="btn-stepper-border poppins px-3 mt-2 font-16"
                            onClick={() =>
                              handleStartChat(singleGigDetail?.seller)
                            }
                            disabled={creatingConversation}
                          >
                            {!isLoggedIn ? "Contact with seller" : "Contact Me"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="row justify-content-between mt-3">
                      <div className="col-6 text-start">
                        <p className="font-14 mb-0" style={{ color: THEME.text.secondary }}>From</p>
                        <p className="font-14 fw-bold" style={{ color: THEME.text.primary }}>
                          {singleGigDetail?.seller?.country
                            ? singleGigDetail.seller.country
                                .charAt(0)
                                .toUpperCase() +
                              singleGigDetail.seller.country.slice(1)
                            : "Seller has not added their country"}
                        </p>

                        <p className="font-14 mb-0" style={{ color: THEME.text.secondary }}>
                          Avg. response time
                        </p>
                        <p className="font-14 fw-bold" style={{ color: THEME.text.primary }}>
                          {joinedTime.hours > 0
                            ? `${joinedTime.hours} hour${joinedTime.hours !== 1 ? "s" : ""} ago`
                            : "Recently"}
                        </p>

                        <p className="font-14 mb-0" style={{ color: THEME.text.secondary }}>Languages</p>
                        <p className="font-14 fw-bold" style={{ color: THEME.text.primary }}>
                          {singleGigDetail?.seller?.language ?? "English"}
                        </p>
                      </div>

                      <div className="col-6">
                        <p className="font-14 mb-0" style={{ color: THEME.text.secondary }}>
                          Member since
                        </p>
                        <p className="font-14 fw-bold" style={{ color: THEME.text.primary }}>
                          {singleGigDetail?.seller
                            ? new Date(
                                singleGigDetail?.seller?.created_at,
                              ).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>

                        <p className="font-14 mb-0" style={{ color: THEME.text.secondary }}>
                          Last delivery
                        </p>
                        <p className="font-14 fw-bold" style={{ color: THEME.text.primary }}>
                          {singleGigDetail?.last_delivery
                            ? new Date(
                                singleGigDetail.last_delivery.updated_at,
                              ).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "No delivery info"}
                        </p>
                      </div>
                    </div>

                    <hr
                      className="border-0 mt-1 mb-1"
                      style={{
                        height: "1.5px",
                        opacity: "1",
                        backgroundColor: THEME.border.light,
                      }}
                    />

                    <hr
                      className="border-0 mt-4 mb-4"
                      style={{
                        height: "1.5px",
                        opacity: "1",
                        backgroundColor: THEME.border.light,
                      }}
                    />
                    <h5 className="font-24 fw-bold mt-4 mb-4 inter" style={{ color: THEME.text.primary }}>
                      Rating & Reviews
                    </h5>

                    <div className="row align-items-center mb-5 p-4 rounded-4 shadow-sm mx-1" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.border.light}` }}>
                      <div className="col-lg-4 col-md-5 col-sm-12 text-center border-end border-2" style={{ borderColor: THEME.border.light }}>
                        <img
                          src={star6}
                          alt="Stars"
                          width={80}
                          className="mb-2"
                          loading="lazy"
                        />
                        <h2 className="display-4 fw-bold mb-0" style={{ color: THEME.text.primary }}>
                          {overallAverageRating.toFixed(1)}
                        </h2>
                        <div className="d-flex justify-content-center my-2">
                          {[...Array(5)].map((_, i) => (
                            <AiFillStar
                              key={i}
                              size={24}
                              color={
                                i < Math.round(overallAverageRating)
                                  ? THEME.accent.primary
                                  : THEME.text.light
                              }
                            />
                          ))}
                        </div>
                        <p className="fw-medium mb-0" style={{ color: THEME.text.secondary }}>
                          Overall Rating
                        </p>
                      </div>

                      <div className="col-lg-8 col-md-7 col-sm-12 ps-md-4 mt-4 mt-md-0">
                        {[5, 4, 3, 2, 1].map((stars, index) => {
                          const percentage = ratingPercentages[index] || 0;
                          return (
                            <div
                              key={stars}
                              className="d-flex align-items-center mb-2"
                            >
                              <span
                                className="font-14 fw-medium"
                                style={{ width: "60px", color: THEME.text.primary }}
                              >
                                {stars} Stars
                              </span>
                              <div
                                className="progress flex-grow-1 mx-3"
                                style={{ 
                                  height: "10px", 
                                  borderRadius: "10px",
                                  backgroundColor: THEME.bg.cardActive 
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor:
                                      stars >= 4
                                        ? THEME.status.success
                                        : stars === 3
                                          ? THEME.status.warning
                                          : THEME.status.error,
                                    borderRadius: "10px",
                                  }}
                                ></div>
                              </div>
                              <span
                                className="font-14 text-end"
                                style={{ width: "40px", color: THEME.text.secondary }}
                              >
                                {Math.round(percentage)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="reviews-list mt-5">
                      <h4 className="font-20 fw-bold mb-4" style={{ color: THEME.text.primary }}>Recent Feedback</h4>
                      {singleGigDetail?.ratings &&
                      singleGigDetail.ratings.length > 0 ? (
                        singleGigDetail.ratings.map((review, index) => (
                          <div
                            className="review-card p-4 mb-4 rounded-4 border bg-white"
                            key={review.id ?? `review-${index}`}
                            style={{ 
                              transition: "all 0.3s ease",
                              backgroundColor: THEME.bg.card,
                              borderColor: THEME.border.light
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    review.user?.image ||
                                    "https://via.placeholder.com/50"
                                  }
                                  className="rounded-circle border"
                                  width={55}
                                  height={55}
                                  alt={review.user?.fname || "User"}
                                  style={{ 
                                    objectFit: "cover",
                                    border: `1px solid ${THEME.border.light}`
                                  }}
                                />
                                <div className="ms-3">
                                  <h6 className="font-16 fw-bold mb-1" style={{ color: THEME.text.primary }}>
                                    {review.user?.fname
                                      ? `${review.user.fname} ${review.user.lname}`
                                      : "Anonymous"}
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    <span className="badge border rounded-pill px-2 py-1 font-12 d-flex align-items-center" style={{ backgroundColor: THEME.bg.cardActive, color: THEME.text.primary, borderColor: THEME.border.light }}>
                                      <AiFillStar
                                        color={THEME.accent.primary}
                                        size={14}
                                        className="me-1"
                                      />
                                      {review.ratings}
                                    </span>
                                    <span className="ms-2 font-12" style={{ color: THEME.text.secondary }}>
                                      {review.user?.country || "Client"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-end d-none d-sm-block">
                                <p className="font-13 mb-0 d-flex align-items-center" style={{ color: THEME.text.secondary }}>
                                  <BiTime className="me-1" />
                                  {formatDistanceToNow(
                                    new Date(review.created_at || new Date()),
                                    { addSuffix: true },
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="review-content mt-3 ms-sm-5 ps-sm-3">
                              <p
                                className="font-15"
                                style={{ lineHeight: "1.6", color: THEME.text.primary }}
                              >
                                "{review.comments || "No comment provided"}"
                              </p>
                            </div>

                            <div className="d-block d-sm-none text-end mt-2">
                              <p className="font-12 mb-0" style={{ color: THEME.text.secondary }}>
                                {formatDistanceToNow(
                                  new Date(review.created_at || new Date()),
                                  { addSuffix: true },
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-5 rounded-4" style={{ backgroundColor: THEME.bg.card, border: `1px dashed ${THEME.border.light}` }}>
                          <p className="mb-0 font-16" style={{ color: THEME.text.secondary }}>
                            No reviews yet. Be the first to order and review!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-12 mt-4 gigi-tabs poppins">
                <div className="Revie container-fluid pt-0 mt-1" style={{ backgroundColor: THEME.bg.card, borderRadius: "12px" }}>
                  <ul
                    className="nav nav-pills mb-3 row"
                    id="pills-tab"
                    role="tablist"
                  >
                    {["Basic", "Standard", "Premium"].map((type, index) => (
                      <li
                        key={type}
                        className="nav-item col-4 px-0"
                        role="presentation"
                      >
                        <button
                          className={`nav-link pt-3 pb-3 w-100 ${index === 0 ? "active" : ""}`}
                          id={`pills-${type.toLowerCase()}-tab`}
                          data-bs-toggle="pill"
                          data-bs-target={`#pills-${type.toLowerCase()}`}
                          type="button"
                          role="tab"
                          aria-controls={`pills-${type.toLowerCase()}`}
                          aria-selected={index === 0}
                          style={{
                            color: index === 0 ? THEME.text.primary : THEME.text.medium,
                            backgroundColor: index === 0 ? `${THEME.accent.primary}26` : THEME.bg.cardActive,
                            border: `1px solid ${index === 0 ? THEME.border.active : THEME.border.light}`,
                          }}
                        >
                          {type}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-basic"
                      role="tabpanel"
                      aria-labelledby="pills-basic-tab"
                      tabIndex={0}
                    >
                      {renderPackageTab("basic", filteredBasic, handleBasic)}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="pills-standard"
                      role="tabpanel"
                      aria-labelledby="pills-standard-tab"
                      tabIndex={0}
                    >
                      {renderPackageTab(
                        "standard",
                        filteredStandard,
                        handleStandard,
                      )}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="pills-premium"
                      role="tabpanel"
                      aria-labelledby="pills-premium-tab"
                      tabIndex={0}
                    >
                      {renderPackageTab(
                        "premium",
                        filteredPremium,
                        handlePremium,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {RecomendedGigsArray.length >= 3 && (
              <div className="mt-5">
                <h3 className="font-28 cocon" style={{ color: THEME.text.secondary }}>
                  Recommended for you
                </h3>

                <div className="container position-relative mb-5 gigs-slider mt-4">
                  <div className="row">
                    <div className="gigs-slider-bg"></div>
                    <Slider {...settings}>
                      {RecomendedGigsArray.map((innerValue, index) => {
                        const averageRating =
                          innerValue?.rating
                            ?.map((value) => value.ratings)
                            .filter((value) => !isNaN(value))
                            .reduce(
                              (acc, rating, idx, array) =>
                                acc + rating / array.length,
                              0,
                            ) || 0;

                        return (
                          <div
                            className="mt-4"
                            key={innerValue?.id ?? `rec-${index}`}
                          >
                            <div className="cursor-pointer h-100">
                              <div className="h-100">
                                <Card
                                  gigsImg={
                                    getGigThumbnail(innerValue.media) || null
                                  }
                                  minHeight="50px"
                                  heading={
                                    innerValue?.title?.substring(0, 50) + "..."
                                  }
                                  phara={stripHtmlTags(
                                    innerValue?.description?.substring(
                                      0,
                                      100,
                                    ) + "...",
                                  )}
                                  star1={
                                    parseInt(averageRating) >= 1
                                      ? THEME.accent.primary
                                      : THEME.text.light
                                  }
                                  star2={
                                    parseInt(averageRating) >= 2
                                      ? THEME.accent.primary
                                      : THEME.text.light
                                  }
                                  star3={
                                    parseInt(averageRating) >= 3
                                      ? THEME.accent.primary
                                      : THEME.text.light
                                  }
                                  star4={
                                    parseInt(averageRating) >= 4
                                      ? THEME.accent.primary
                                      : THEME.text.light
                                  }
                                  star5={
                                    parseInt(averageRating) >= 5
                                      ? THEME.accent.primary
                                      : THEME.text.light
                                  }
                                  projectNumber="0"
                                  price={innerValue.package?.[0]?.total || "0"}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {["Basic", "Standard", "Premium"].map((type, index) => (
        <div key={`offcanvas-${index}`}>
          {renderPackageOffcanvas(
            type.toLowerCase(),
            type === "Basic"
              ? filteredBasic
              : type === "Standard"
                ? filteredStandard
                : filteredPremium,
            type === "Basic"
              ? handleBasic
              : type === "Standard"
                ? handleStandard
                : handlePremium,
          )}
        </div>
      ))}

      <Offcanvas
        show={showChatModal}
        onHide={closeChatModal}
        placement="end"
        style={{ 
          width: "450px",
          backgroundColor: THEME.bg.main,
          borderLeft: `1px solid ${THEME.border.light}`
        }}
      >
        <Offcanvas.Header closeButton style={{ borderBottom: `1px solid ${THEME.border.light}` }}>
          <Offcanvas.Title style={{ color: THEME.text.primary }}>
            Chat with {selectedClient?.fname} {selectedClient?.lname}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column" style={{ backgroundColor: THEME.bg.main }}>
          <div className="flex-grow-1">
            <Chating />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />

      <style>{`

      /* Force dark theme on all backgrounds */
body, 
html,
#root,
.app,
.container,
.container-fluid,
.row,
.col,
[class*="col-"] {
  background-color: #020617 !important;
  color: #ffffff !important;
}

/* Remove all white backgrounds */
.bg-white {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.bg-light {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

/* Card backgrounds */
.card,
.card-body,
.div,
section,
main {
  background-color: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
}

/* Override any remaining white text */
.text-dark {
  color: #ffffff !important;
}
.offcanvas {
  width: 45% !important;
  background: ${THEME.bg.main} !important;
  border-left: 1px solid ${THEME.border.light} !important;

  @media (max-width: 992px) { width: 60% !important; }
  @media (max-width: 768px) { width: 80% !important; }
  @media (max-width: 576px) { width: 100% !important; }
}

.offcanvas-body::-webkit-scrollbar { width: 8px; }
.offcanvas-body::-webkit-scrollbar-track {
  background: ${THEME.bg.card};
}
.offcanvas-body::-webkit-scrollbar-thumb {
  background: ${THEME.border.light};
  border-radius: 4px;
}
.offcanvas-body::-webkit-scrollbar-thumb:hover {
  background: ${THEME.border.active};
}

p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${THEME.text.secondary};
}

.fiverr-main-frame {
  width: 100%;
  aspect-ratio: 1280 / 769;
  max-width: 1280px;
  border-radius: 20px;
  overflow: hidden;
  background: ${THEME.bg.card};
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid ${THEME.border.light};
}

.fiverr-main-media {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: ${THEME.bg.card};
}

.fiverr-thumb-frame {
  width: 100%;
  height: 96px;
  border-radius: 14px;
  overflow: hidden;
  background: ${THEME.bg.card};
  border: 1px solid ${THEME.border.light};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.fiverr-thumb-media {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.fiverr-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${THEME.accent.primary};
  color: ${THEME.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.fiverr-play-icon:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.main-slider-thumbnail-img {
  max-width: 1280px;
  margin: 0 auto;
}

.thumb-wrap .fiverr-thumb-frame:hover {
  border-color: ${THEME.accent.primary};
  box-shadow: 0 0 0 2px ${THEME.border.active};
}

/* Review Cards */
.review-card {
  background: ${THEME.bg.card} !important;
  border: 1px solid ${THEME.border.light} !important;
  transition: all 0.3s ease;
}

.review-card:hover {
  border-color: ${THEME.border.active};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

/* Rating Section */
.bg-light {
  background: ${THEME.bg.card} !important;
  border: 1px solid ${THEME.border.light};
}

/* Progress bars container */
.progress {
  background: ${THEME.bg.cardActive} !important;
}

/* Tab Navigation */
.nav-pills .nav-link {
  color: ${THEME.text.medium};
  background: ${THEME.bg.cardActive};
  border: 1px solid ${THEME.border.light};
  transition: all 0.2s ease;
}

.nav-pills .nav-link:hover {
  color: ${THEME.text.primary};
  border-color: ${THEME.border.active};
}

.nav-pills .nav-link.active {
  color: ${THEME.text.primary};
  background: ${THEME.accent.primary}26;
  border-color: ${THEME.border.active};
  font-weight: 600;
}

/* Buttons */
.btn-stepper {
  background: ${THEME.accent.primary} !important;
  color: ${THEME.text.primary} !important;
  border: none !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-stepper:hover {
  background: #d94a15 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3);
}

.btn-stepper:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-stepper-border {
  background: transparent !important;
  color: ${THEME.accent.primary} !important;
  border: 1px solid ${THEME.border.active} !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-stepper-border:hover {
  background: ${THEME.accent.primary}15 !important;
  border-color: ${THEME.accent.primary} !important;
}

.btn-stepper-border:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Slider Arrows */
.arrow-next,
.arrow-prev {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  background: ${THEME.bg.card};
  border: 1px solid ${THEME.border.light};
  color: ${THEME.text.primary};
}

.arrow-next:hover,
.arrow-prev:hover {
  background: ${THEME.accent.primary};
  border-color: ${THEME.accent.primary};
  color: ${THEME.text.primary};
}

.arrow-prev { left: 15px; }
.arrow-next { right: 15px; }

/* Card Components */
.card {
  background: ${THEME.bg.card} !important;
  border: 1px solid ${THEME.border.light} !important;
}

/* Form Controls */
.form-control {
  background: ${THEME.bg.cardActive} !important;
  border: 1px solid ${THEME.border.light} !important;
  color: ${THEME.text.primary} !important;
}

.form-control:focus {
  background: ${THEME.bg.cardActive} !important;
  border-color: ${THEME.border.active} !important;
  box-shadow: 0 0 0 3px ${THEME.border.active} !important;
  color: ${THEME.text.primary} !important;
}

/* Badges & Pills */
.badge {
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fiverr-thumb-frame { height: 78px; }
  .fiverr-main-frame { border-radius: 16px; }
}

@media (max-width: 576px) {
  .fiverr-thumb-frame { height: 70px; }
  .fiverr-main-frame { border-radius: 14px; }
}

/* Global text colors */
.text-dark { color: ${THEME.text.primary} !important; }
.text-secondary { color: ${THEME.text.secondary} !important; }
.text-primary { color: ${THEME.accent.primary} !important; }
.text-muted { color: ${THEME.text.light} !important; }

/* Background overrides */
.bg-white { background: ${THEME.bg.card} !important; }
.bg-light { background: ${THEME.bg.card} !important; }

/* Border overrides */
.border { border-color: ${THEME.border.light} !important; }
.border-secondary-subtle { border-color: ${THEME.border.light} !important; }

/* Scrollbar for entire page */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: ${THEME.bg.main};
}
::-webkit-scrollbar-thumb {
  background: ${THEME.border.light};
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: ${THEME.border.active};
}

/* Selection color */
::selection {
  background: ${THEME.accent.primary};
  color: ${THEME.text.primary};
}

/* Focus outline */
*:focus-visible {
  outline: 2px solid ${THEME.border.active};
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Gig Description HTML - Rich text formatting */
.gig-description-html {
  line-height: 1.7;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.gig-description-html h1,
.gig-description-html h2,
.gig-description-html h3 {
  color: #ffffff;
  margin-top: 1.2em;
  margin-bottom: 0.6em;
  font-weight: 600;
}
.gig-description-html h1 { font-size: 1.5rem; }
.gig-description-html h2 { font-size: 1.3rem; }
.gig-description-html h3 { font-size: 1.15rem; }
.gig-description-html p {
  margin-bottom: 0.8em;
  color: #d4d4d8;
}
.gig-description-html ul,
.gig-description-html ol {
  padding-left: 1.5em;
  margin-bottom: 0.8em;
  color: #d4d4d8;
}
.gig-description-html li {
  margin-bottom: 0.3em;
  color: #d4d4d8;
}
.gig-description-html strong,
.gig-description-html b {
  color: #ffffff;
  font-weight: 700;
}
.gig-description-html em,
.gig-description-html i {
  font-style: italic;
}
.gig-description-html u {
  text-decoration: underline;
}
.gig-description-html s,
.gig-description-html strike {
  text-decoration: line-through;
}
.gig-description-html blockquote {
  border-left: 3px solid #f0591f;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  color: #a1a1aa;
  font-style: italic;
}
.gig-description-html pre {
  background: rgba(255,255,255,0.05);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  color: #d4d4d8;
  font-size: 0.9rem;
}
.gig-description-html code {
  background: rgba(255,255,255,0.08);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  color: #f0591f;
}
.gig-description-html a {
  color: #f0591f;
  text-decoration: underline;
}
.gig-description-html img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
}
`}</style>
    </>
  );
};

export default FreelancersGigs;