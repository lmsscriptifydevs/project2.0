import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Line, LineChart } from "recharts";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import plant from "../assets/marquePlant.webp";
import wallet from "../assets/TopRatedWallet.webp";
import { sellerRating } from "../redux/slices/ratingSlice";
import { useDispatch, useSelector } from "../redux/store/store";

const TopRatedSaller = () => {
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    const handleDirectionChange = () => {
      setDirection(window.innerWidth <= 992 ? "left" : "up");
    };
    handleDirectionChange();
    window.addEventListener("resize", handleDirectionChange);
    return () => window.removeEventListener("resize", handleDirectionChange);
  }, []);

  const settings = useMemo(() => ({
    dots: false,
    nextArrow: <></>,
    prevArrow: <></>,
    // speed: 5000,
    // fade: true,
    // autoplay: true,
    // autoplaySpeed: 2000,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  }), []);
  const settingsTwo = useMemo(() => ({
    dots: false,
    nextArrow: <></>,
    prevArrow: <></>,
    // speed: 5000,
    // fade: true,
    // autoplay: true,
    // autoplaySpeed: 2000,
    infinite: true,
    speed: 2800,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  }), []);
  // ===========Top Rated Seller ============
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userRating } = useSelector((state) => state.rating);

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

  const filteredRatingFive = useMemo(
    () => (Array.isArray(userRating) ? userRating.filter((o) => o?.ratings === "5") : []),
    [userRating]
  );
  const filteredRatingFour = useMemo(
    () => (Array.isArray(userRating) ? userRating.filter((o) => o?.ratings === "4") : []),
    [userRating]
  );
  const data = useMemo(() => [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ], []);
  return (
    <>
      <div className="container px-lg-3 px-0">
        <div className="row">
          {/* =============
                DESKTOP MARQUEE SLIDER START
                =============== */}
          <div className="col-lg-6  col-12 px-0">
            <marquee
              direction={direction}
              scrollamount="5"
              className="marqueeTag poppins"
            >
              <div className="d-lg-block d-flex">
                {filteredRatingFive.map((value, index) => (
                  <>
                    <div
                      className="bg-white rounded-4 my-4 mx-lg-0 mx-3"
                      key={value?.user_id ?? value?.seller?.id ?? `five-${index}`}
                    >
                      <div className=" text-center">
                        <img
                          src={value?.seller?.image}
                          alt=""
                          className="freelancer-image"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="text-center poppins px-2 mt-2 pb-2">
                        <p className="font-16 mb-0  fw-medium blackcolor">
                          {value?.seller?.fname + " " + value?.seller?.lname}
                        </p>
                        <p className="font-14 mb-1 takegraycolor">
                          {value?.seller?.role}
                        </p>
                        <div className="text-ceenter mt-1">
                          <Button
                            className="btn-stepper-border rounded-5 poppins px-3  font-16"
                            onClick={() =>
                              navigate(
                                `/profileOtherPerson/${value.seller?.fname}`,
                                { state: { userId: value.user_id } }
                              )
                            }
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index % 2 != 0 && (
                      <div className="plant-card mt-4 bg-white rounded-4 p-2 align-items-center">
                        <img src={plant} className="rounded-4" alt="" loading="lazy" decoding="async" />
                        <div className=" w-100 d-flex justify-content-between">
                          <h5 className="font-12 ms-2 blackcolor mb-0">
                            Plant
                          </h5>
                          <div>
                            <p className="fw-medium colororing font-12 mb-1 text-end">
                              Paid
                            </p>
                            <p className="fw-medium  font-12 text-end mb-0">
                              $17439{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className="chart-card p-3 w-100 rounded-4 mt-4"
                      style={{ backgroundColor: "black" }}
                    >
                      <h6 className="font-12 text-white">Papular</h6>
                      <h3 className="text-white font-28 inter">
                        $<CountUp start={0} end={170527} duration={50} />
                      </h3>
                      <LineChart width={200} height={100} data={data}>
                        <Line
                          type="monotone"
                          dataKey="pv"
                          stroke="#ed5623"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </div>
                  </>
                ))}
              </div>
            </marquee>
          </div>
          <div className="col-lg-6 col-12 px-lg-3 px-0">
            <marquee
              direction={direction}
              scrollamount="3"
              className="marqueeTag poppins"
            >
              <div className="d-lg-block d-flex ">
                {filteredRatingFour.map((value, index) => (
                  <>
                    <div
                      className="bg-white rounded-4 my-4 mx-lg-0 mx-3"
                      key={value?.user_id ?? value?.seller?.id ?? `four-${index}`}
                    >
                      <div className=" text-center">
                        <img
                          src={value?.seller?.image}
                          alt=""
                          className="freelancer-image"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="text-center poppins px-2 mt-2 pb-2">
                        <p className="font-16 mb-0  fw-medium blackcolor">
                          {value?.seller?.fname + " " + value?.seller?.lname}
                        </p>
                        <p className="font-14 mb-1 takegraycolor">
                          {value?.seller?.role}
                        </p>
                        <div className="text-ceenter mt-1">
                          <Button
                            className="btn-stepper-border rounded-5 poppins px-3  font-16"
                            onClick={() =>
                              navigate(
                                `/profileOtherPerson/${value.seller?.fname}`,
                                { state: { userId: value.user_id } }
                              )
                            }
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index % 2 == 0 && (
                      <div
                        className="graph-card p-3 w-100 rounded-4 mt-4"
                        style={{ backgroundColor: "black" }}
                      >
                        <h6 className="font-12 text-white">Rate</h6>
                        <h3 className="text-white font-28 inter">
                          $<CountUp start={0} end={170527} duration={50} />
                        </h3>
                        <h6 className="text-white font-16 inter">
                          <FaArrowUp color="green" className="me-1" />
                          <CountUp start={0} end={170527} duration={50} />
                        </h6>
                      </div>
                    )}
                    <div className="wallet-card mt-4 bg-white rounded-4 p-3 align-items-start">
                      <img src={wallet} className="" alt="w8" loading="lazy" decoding="async" />
                      <div className=" w-100 ms-1">
                        <div className="d-flex justify-content-between">
                          <p className="fw-semibold mb-0  font-16 ">Wallet </p>
                          <p className="fw-medium mb-0 font-12 ">$17439 </p>
                        </div>
                        <h5 className="font-12 takegraycolor">
                          Lorem ipsum dolor.
                        </h5>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </marquee>
          </div>
          {/* =============
                DESKTOP MARQUEE SLIDER END
                =============== */}
          {/* =============
                MOBILE MARQUEE SLIDER START
                =============== */}
          <div className="col-lg-6  gigs-slider d-none col-12">
            <Slider {...settings}>
              {filteredRatingFive.map((value, index) => (
                <div className="bg-white rounded-4 my-4" key={value?.user_id ?? value?.seller?.id ?? `five-m-${index}`}>
                  <div className=" text-center d-flex justify-content-center ">
                    <img
                      src={value?.seller?.image}
                      alt=""
                      className=" rounded-circle "
                      width={150}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="text-center poppins px-2 mt-2 pb-2">
                    <p className="font-16 mb-0  fw-medium blackcolor">
                      {value?.seller?.fname}
                    </p>
                    <p className="font-14 mb-1 takegraycolor">
                      {value?.seller?.role}
                    </p>
                    <div className="text-ceenter mt-1">
                      <Button
                        className="btn-stepper-border rounded-5 poppins px-3  font-16"
                        onClick={() =>
                          navigate(`/profileOtherPerson/${value.user_id}`, {
                            state: { userId: value.user_id },
                          })
                        }
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-lg-6  col-12 d-none pt-4 gigs-slider">
            <Slider {...settingsTwo}>
              {filteredRatingFour.map((value, index) => (
                <div className="bg-white rounded-4 my-4 py-4" key={value?.user_id ?? value?.seller?.id ?? `four-m-${index}`}>
                  <div className=" text-center  d-flex justify-content-center">
                    <img
                      src={value?.seller?.image}
                      alt=""
                      className="rounded-circle  "
                      width={150}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="text-center poppins px-2 mt-2 pb-2">
                    <p className="font-16 mb-0  fw-medium blackcolor">
                      {value?.seller?.fname}
                    </p>
                    <p className="font-14 mb-1 takegraycolor">
                      {value?.seller?.role}
                    </p>
                    <div className="text-ceenter mt-1">
                      <Button
                        className="btn-stepper-border rounded-5 poppins px-3  font-16"
                        onClick={() =>
                          navigate(`/profileOtherPerson/${value.user_id}`, {
                            state: { userId: value.user_id },
                          })
                        }
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          {/* =============
                MOBILE MARQUEE SLIDER END
                =============== */}
        </div>
      </div>

      <style>
        {`.recharts-wrapper{
                      width : 100% !important;

                        }
                        .recharts-wrapper svg{
                      width : 100% !important;

                        }
                        .top-rated-slider-img-mbl{
                            height:400px;
                        }
    @media(max-width:468px){
        .top-rated-slider-img-mbl{
            height:300px;
        }
    }
    @media(max-width:375px){
        .top-rated-slider-img-mbl{
            height:200px;
        }
    }
    `}
      </style>
    </>
  );
};

export default TopRatedSaller;
