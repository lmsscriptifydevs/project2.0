import React from "react";
import { Button } from "@mui/material";
import igmese from "../assets/igmese.webp";
import recomendimg from "../assets/recomend.webp";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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

const Recomend = () => {
  return (
    <>
      <div className="container-fluid haifwhitecolor rounded-3 p-4 mt-2">
        <div className="row">
          <div className="col-lg-3 col-12 align-self-center">
            <h3 className="font-38 fw-semibold poppins mb-0">
              Recomended <span className="colororing mb-0">For YOU</span>{" "}
            </h3>
            <div>
              <img src={recomendimg} className="w-50" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="col-lg-9 col-12">
            <div className="container position-relative  mb-5 gigs-slider mt-4">
              <div className="gigs-slider-bg"></div>
              <Slider {...SLIDER_SETTINGS}>
                <div>
                  <div className="p-2 whitcard">
                    <img src={igmese} className="w-100" alt="" loading="lazy" decoding="async" />
                    <h5 className="mt-3 fw-semibold font-20 poppins">
                      Figma UI UX Design..
                    </h5>
                    <p className="poppins font-12">
                      Use Figma to get a job in UI Design, User Interface, User
                      Experience design.
                    </p>
                    <div className="text-center mb-2">
                      <Button className="btn-stepper poppins w-auto p-1 px-3 mt-2 font-16">
                        Take test
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="p-2 whitcard">
                    <img src={igmese} className="w-100" alt="" loading="lazy" decoding="async" />
                    <h5 className="mt-3 fw-semibold font-20 poppins">
                      Figma UI UX Design..
                    </h5>
                    <p className="poppins font-12">
                      Use Figma to get a job in UI Design, User Interface, User
                      Experience design.
                    </p>
                    <div className="text-center mb-2">
                      <Button className="btn-stepper poppins w-auto p-1 px-3 mt-2 font-16">
                        Take test
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="p-2 whitcard">
                    <img src={igmese} className="w-100" alt="" loading="lazy" decoding="async" />
                    <h5 className="mt-3 fw-semibold font-20 poppins">
                      Figma UI UX Design..
                    </h5>
                    <p className="poppins font-12">
                      Use Figma to get a job in UI Design, User Interface, User
                      Experience design.
                    </p>
                    <div className="text-center mb-2">
                      <Button className="btn-stepper poppins w-auto p-1 px-3 mt-2 font-16">
                        Take test
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="p-2 whitcard">
                    <img src={igmese} className="w-100" alt="" loading="lazy" decoding="async" />
                    <h5 className="mt-3 fw-semibold font-20 poppins">
                      Figma UI UX Design..
                    </h5>
                    <p className="poppins font-12">
                      Use Figma to get a job in UI Design, User Interface, User
                      Experience design.
                    </p>
                    <div className="text-center mb-2">
                      <Button className="btn-stepper poppins w-auto p-1 px-3 mt-2 font-16">
                        Take test
                      </Button>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recomend;
