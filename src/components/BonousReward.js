import React from "react";
import "react-circular-progressbar/dist/styles.css";
import handblus from "../assets/handblusdil.webp";
import awrro from "../assets/awrroline.webp";
import reward from "../assets/boysreward.webp";
import like from "../assets/like.webp";
import share from "../assets/share.webp";
import hone from "../assets/hone.webp";
import Navbar from "./Navbar";
import { Button } from "@mui/material";

const BonousReward = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <div className="container-fluid pt-5 p-5 poppins">
        <h6 className="font-28 font-500 cocon byerLine">Bonus and Rewards</h6>
        <div className="row mt-4">
          <div className="col-lg-9 col-12 appeptjob p-3">
            <div className="appept  bonus-left-cards container-fluid p-3 rounded-3">
              <div className="row">
                <div className="d-flex align-items-center col-lg-10 col-12 flex-lg-nowrap flexmd-nowrap flex-sm-nowrap flex-wrap">
                  <img
                    src={handblus}
                    className=" me-3"
                    width={140}
                    height={140}
                    alt="w8"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="w-100 m-1">
                    <h5 className=" mb-0 font-20 ">
                      Health Insurance for Top Rated
                    </h5>
                    <p className=" mb-0 mt-2 font-20   takegraycolor">
                      Treatment under 10,000PKr On Special Cases.
                    </p>
                    <p className="text-decoration-underline mb-0 mt-2 font-18 ">
                      Reed more
                    </p>
                    <div className="w-100">
                      <div
                        className="progress w-100  mt-3"
                        style={{ height: "10px" }}
                        role="progressbar"
                        aria-label="Warning example"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-12 mt-lg-0 mt-2 d-flex align-items-center">
                  <Button className="btn-stepper poppins px-3  font-16">
                    Reedem
                  </Button>
                </div>
              </div>
            </div>
            <div className="appept  bonus-left-cards container-fluid p-3 rounded-3">
              <div className="row">
                <div className="d-flex align-items-center col-lg-10 col-12 flex-lg-nowrap flexmd-nowrap flex-sm-nowrap flex-wrap">
                  <img
                    src={awrro}
                    className=" me-3"
                    width={140}
                    height={140}
                    alt="w8"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="w-100 m-1">
                    <h5 className=" mb-0 font-20 ">
                      Order value more than $500 in a month
                    </h5>
                    <p className=" mb-0 mt-2 font-20   takegraycolor">
                      Taxes reduces 10%-7% for level 2 and 3.
                    </p>
                    <p className="text-decoration-underline mb-0 mt-2 font-18 ">
                      Reed more
                    </p>
                    <div className="w-100">
                      <div
                        className="progress w-100  mt-3"
                        style={{ height: "10px" }}
                        role="progressbar"
                        aria-label="Warning example"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-12 mt-lg-0 mt-2 d-flex align-items-center">
                  <Button className="btn-stepper-border poppins px-3  font-16">
                    Reedem
                  </Button>
                </div>
              </div>
            </div>
            <div className="appept  bonus-left-cards container-fluid p-3 rounded-3">
              <div className="row">
                <div className="d-flex align-items-center col-lg-10 col-12 flex-lg-nowrap flexmd-nowrap flex-sm-nowrap flex-wrap">
                  <img
                    src={awrro}
                    className=" me-3"
                    width={140}
                    height={140}
                    alt="w8"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="w-100 m-1">
                    <h5 className=" mb-0 font-20 ">
                      Order value more tahn $1000 in a month
                    </h5>
                    <p className=" mb-0 mt-2 font-20   takegraycolor">
                      Taxes reduced from 10%-7% for level 1, 2 and 3.
                    </p>
                    <p className="text-decoration-underline mb-0 mt-2 font-18 ">
                      Reed more
                    </p>
                    <div className="w-100">
                      <div
                        className="progress w-100  mt-3"
                        style={{ height: "10px" }}
                        role="progressbar"
                        aria-label="Warning example"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-12 mt-lg-0 mt-2 d-flex align-items-center">
                  <Button className="btn-stepper-border poppins px-3  font-16">
                    Reedem
                  </Button>
                </div>
              </div>
            </div>
            <div className="appept  bonus-left-cards container-fluid p-3 rounded-3">
              <div className="row">
                <div className="d-flex align-items-center col-lg-10 col-12 flex-lg-nowrap flexmd-nowrap flex-sm-nowrap flex-wrap">
                  <img
                    src={reward}
                    className=" me-3"
                    width={140}
                    height={140}
                    alt="w8"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="w-100 m-1">
                    <h5 className=" mb-0 font-20 ">
                      Freelancer and seller relationship
                    </h5>
                    <p className=" mb-0 mt-2 font-20   takegraycolor">
                      maintains relationship for 1 Year Will Be rewarded.
                    </p>
                    <p className="text-decoration-underline mb-0 mt-2 font-18 ">
                      Reed more
                    </p>
                    <div className="w-100">
                      <div
                        className="progress w-100  mt-3"
                        style={{ height: "10px" }}
                        role="progressbar"
                        aria-label="Warning example"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-12 d-flex mt-lg-0 mt-lg-0 mt-2 align-items-center">
                  <Button className="btn-stepper poppins px-3  font-16">
                    Reedem
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-12 mt-lg-0 mt-4">
            <div className="jobprogress position-relative rounded-3 px-3 p-4">
              <h6 className="font-12 fw-bold ">Refer and Earn</h6>
              <h6 className="font-16 font-500 ">
                Refer you Friend <br />
                and Win Rewards
              </h6>
              <button
                type="button"
                className="btn-white font-12 fw-bold border-0 rounded-3 p-2"
              >
                Refer Now
              </button>
              <img
                src={like}
                className="imgesposstion  position-absolute"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bonous mt-3 position-relative rounded-3 px-3 p-4">
              <h6 className="font-12 fw-bold ">Rewards</h6>
              <h6 className="font-16 font-500 ">
                Like, Share <br />& get free coupons
              </h6>
              <button
                type="button"
                className="btn-blue fw-bold font-12 border-0 rounded-3 p-2"
              >
                Share Now
              </button>
              <img src={share} className="imgesone position-absolute" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="bonous mt-3 rounded-3 position-relative px-3 p-4">
              <h6 className="font-12 fw-bold ">Begineer guide</h6>
              <h6 className="font-16 font-500 ">Learn how to get started</h6>
              <button
                type="button"
                className="btn-blue fw-bold font-12 border-0 rounded-3 p-2"
              >
                Start Now
              </button>
              <img src={hone} className="imgestwo position-absolute" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonousReward;
