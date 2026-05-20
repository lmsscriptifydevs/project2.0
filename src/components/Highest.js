import { useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import line from "../assets/line.webp";
import { sellerRating } from "../redux/slices/ratingSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import "../style/imgSlider.scss";
import { getGigThumbnail } from "../utils/helpers";
import Card from "./Card";

const Highest = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.rating);

  // PERF STARTUP: Defer sellerRating until after mount – shell renders first, no API block.
  useEffect(() => {
    const deferDataLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          dispatch(sellerRating()).catch(err => console.error('Error loading ratings:', err));
        }, { timeout: 1000 });
      } else {
        setTimeout(() => {
          dispatch(sellerRating()).catch(err => console.error('Error loading ratings:', err));
        }, 100);
      }
    };
    deferDataLoad();
  }, [dispatch]);

  const TopRatedGigs = useMemo(() => {
    const arr = Array.isArray(userDetail) ? userDetail : [];
    return arr.filter((obj) => obj?.ratings === "5");
  }, [userDetail]);

  const setting = useMemo(() => ({
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    // fade:true,
    speed: 1000,
    slidesToShow: 4,
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
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  }), []);
  function stripHtmlTags(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }
  return (
    <>
      {/* Highest Rated Freelancers section */}
      {TopRatedGigs.length >= 4 && (
        <div className="container-fluid p-lg-5 p-md-5 p-sm-4 p-3 mt-5 height-slider">
          <div className="row justify-content-center">
            <h3 className="text-center cocon">Top Ranked Gigs.</h3>
            <div className="d-flex justify-content-center mt-3">
              <img src={line} className="text-center" alt="" loading="lazy" decoding="async" />
            </div>
            <div
              className="container rounded-3  gigs-slider mt-4 pt-3"
              style={{ backgroundColor: "#F5F5FF" }}
            >
              <Slider {...setting}>
                {TopRatedGigs.map((innerValue) => (
                  <Card
                    gigsImg={getGigThumbnail(innerValue.gig?.media) || null}
                    minHeight="50px"
                    heading={innerValue.title.substring(0, 50) + "..."}
                    phara={stripHtmlTags(
                      innerValue.description.substring(0, 100) + "..."
                    )}
                    star1="#ed5623"
                    star2="#ed5623"
                    star3="#ed5623"
                    star4="#ed5623"
                    star5="#ed5623"
                    projectNumber="0"
                    // price={innerValue.package[0]?.total}
                  />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Highest;
