import React from "react";
import slick from "../assets/slick.webp";
import micro from "../assets/mickbook.webp";
import googl from "../assets/googl.webp";
import airbab from "../assets/airbab.webp";
import line from "../assets/line.webp";
import Slider from "react-slick";

// PERF: module-level settings – avoid recreating on every render
const SLIDER_SETTINGS = {
  dots: false,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 1500,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1, infinite: true, dots: false } },
    { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 1, initialSlide: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const Treusted = () => {
  return (
    <>
      {/*Trusted by the world best */}
      <div className="container-fluid p-lg-5 p-lg-5 p-md-5 p-sm-4 p-3 mt-lg-5 mt-md-4 mt-3 ">
        <h3 className="text-center cocon ">Trusted by the world best</h3>
        <div className="d-flex justify-content-center">
          <img src={line} className="text-center" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="container pt-5 ">
          <Slider {...SLIDER_SETTINGS}>
            <div className="d-flex justify-content-center">
              <img src={slick} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={micro} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={googl} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={airbab} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={slick} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={micro} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={googl} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="d-flex justify-content-center">
              <img src={airbab} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
          </Slider>
        </div>
        <br />
        {/* <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' />
        <br className='d-lg-block d-md-block d-none' /> */}
      </div>
    </>
  );
};

export default Treusted;
