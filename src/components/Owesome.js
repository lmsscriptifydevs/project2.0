import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import owesom1 from "../assets/Rectangle1.webp";
import owesom2 from "../assets/Rectangle2.webp";
import owesom3 from "../assets/Rectangle3.webp";

// PERF: module-level settings – avoid Slider re-initing on every render
const SLIDER_SETTINGS = {
  dots: false,
  autoplay: true,
  autoplaySpeed: 5000,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: false } },
    { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1, initialSlide: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const Owesome = () => {
  return (
    <>
      <div className="container-fluid position-relative gigs-slider mt-4">
        <div className="row">
          <h6 className="font-22 font-500 cocon position-relative z-1 pt-3 ms-2">
            My Owesome <br />
            Projects
          </h6>
          <div className="col-lg-3 col-12 position-relative  text-center mt-5 pt-5  z-1">
            <h6 className="font-22 font-500 cocon">
              <span className="colororing ">01</span> / 05
            </h6>
          </div>
          <div className="col-lg-9 col-12">
            <div className="gigs-slider-bg" style={{ height: "70%" }}></div>
            <Slider {...SLIDER_SETTINGS}>
              <div>
                <img src={owesom1} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
              <div>
                <img src={owesom2} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
              <div>
                <img src={owesom3} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
              <div>
                <img src={owesom1} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
              <div>
                <img src={owesom2} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
              <div>
                <img src={owesom3} className="w-100" alt="" loading="lazy" decoding="async" />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Owesome;
