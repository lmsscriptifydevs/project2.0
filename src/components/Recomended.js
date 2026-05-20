import React from "react";
import figma from "../assets/figma.webp";
import star from "../assets/5star.webp";
import Slider from "react-slick";

// PERF: stable slider config avoids Slider re-initing on every render
const SLIDER_SETTINGS = {
  dots: true,
  speed: 500,
  autoplay: false,
  autoplaySpeed: 1500,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1, infinite: true, dots: true } },
    { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 1, initialSlide: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

function Recomended() {
  return (
    <>
      <div className="container mt-5">
        <h3>Recomended for you</h3>
        <Slider {...SLIDER_SETTINGS}>
          <div>
            <div className="p-2 whitcard">
              <img src={figma} className="w-100" alt="" loading="lazy" decoding="async" />
              <h5>Figma UI UX Design..</h5>
              <p>
                Use Figma to get a job in UI Design, User Interface, User
                Experience design.
              </p>
              <span>
                <img src={star} alt="" loading="lazy" decoding="async" />
                <p>(0)</p>
              </span>
              <div className="text-end">
                <h6 className="colororing">$17.84</h6>
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 whitcard">
              <img src={figma} className="w-100" alt="" loading="lazy" decoding="async" />
              <h5>Figma UI UX Design..</h5>
              <p>
                Use Figma to get a job in UI Design, User Interface, User
                Experience design.
              </p>
              <span>
                <img src={star} alt="" loading="lazy" decoding="async" />
                <p>(0)</p>
              </span>
              <div className="text-end">
                <h6 className="colororing">$17.84</h6>
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 whitcard">
              <img src={figma} className="w-100" alt="" loading="lazy" decoding="async" />
              <h5>Figma UI UX Design..</h5>
              <p>
                Use Figma to get a job in UI Design, User Interface, User
                Experience design.
              </p>
              <span>
                <img src={star} alt="" loading="lazy" decoding="async" />
                <p>(0)</p>
              </span>
              <div className="text-end">
                <h6 className="colororing">$17.84</h6>
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 whitcard">
              <img src={figma} className="w-100" alt="" loading="lazy" decoding="async" />
              <h5>Figma UI UX Design..</h5>
              <p>
                Use Figma to get a job in UI Design, User Interface, User
                Experience design.
              </p>
              <span>
                <img src={star} alt="" loading="lazy" decoding="async" />
                <p>(0)</p>
              </span>
              <div className="text-end">
                <h6 className="colororing">$17.84</h6>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </>
  );
}

export default Recomended;
