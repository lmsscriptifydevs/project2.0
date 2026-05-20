import React from "react";
import mainimg from "../assets/mainbig.webp";
import recent from "../assets/ffff.webp";
import recent1 from "../assets/rectan.webp";
import recent2 from "../assets/recran.webp";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// PERF: module-level data – avoid recreating array on every render
const SLIDER_DATA = [
  { image: recent1 },
  { image: recent },
  { image: mainimg },
  { image: recent2 },
];

const ImageSlider = () => {
  return (
    <div className="imgSlider">
      <Carousel
        showThumbs={true}
        infiniteLoop={true}
        autoPlay={false}
        dots={false}
        showArrows={true}
        showStatus={false}
      >
        {SLIDER_DATA.map((item, index) => (
          <div key={item.image}>
            <img src={item.image} className="w-100" alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageSlider;
