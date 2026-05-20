import React from "react";
import goodteck from "../../assets/douball.webp";

import Navbar from "../../components/Navbar";
import { Button } from "@mui/material";

const Dopayout = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <div className="container-fluid p-lg-5 p-md-4 p-3 pt-5">
        <h6 className="font-30 font-500 cocon byerLine">payout</h6>
        <div class="row justify-content-center payment-cards mt-4">
          <div className="col-lg-3 col-md-3 col-12 poppins">
            <div
              class="nav flex-column nav-pills me-3 p-4 rounded-3  Paymentwhite h-100"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <button
                class="nav-link active d-flex align-items-center ps-0"
                id="v-pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-home"
                type="button"
                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true"
              >
                <div className="payment-span">
                  <div></div>
                </div>
                <div className="ms-3 text-start">
                  <h6 className="mb-0 font-20">Payment card</h6>
                  <p className="mb-0 font-12 takegraycolor">Visa, Mastercard</p>
                </div>
              </button>
              <button
                class="nav-link ps-0 d-flex align-items-center"
                id="v-pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-profile"
                type="button"
                role="tab"
                aria-controls="v-pills-profile"
                aria-selected="false"
              >
                <div className="payment-span">
                  <div></div>
                </div>
                <div className="ms-3">
                  <h6 className="mb-0 font-20">Paypal</h6>
                </div>
              </button>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-12 mt-lg-0 mt-0 mt-4">
            <div
              class="tab-content Paymentwhite p-lg-4 p-md-4 p-sm-3 p-2 rounded-3 pb-5"
              id="v-pills-tabContent"
            >
              <div
                class="tab-pane fade show active pt-2 pb-2"
                id="v-pills-home"
                role="tabpanel"
                aria-labelledby="v-pills-home-tab"
                tabindex="0"
              >
                <h5 className="font-20 poppins">Payment Card</h5>
                <div className="row mt-4">
                  <div className="col-lg-3 col-6">
                    <div className="textearning">
                      <p className="font-16 takegraycolor poppins">
                        FIRST NAME
                      </p>
                      <p className="font-16 takegraycolor poppins">LAST NAME</p>
                      <p className="font-16 takegraycolor poppins">
                        CARD NUMBER
                      </p>
                      <p className="font-16 takegraycolor poppins">
                        SECURITY CODE
                      </p>
                      <p className="font-16 takegraycolor poppins">
                        EXPIRATION MONTH
                      </p>
                      <p className="font-16 takegraycolor poppins">
                        EXPIRATION YEAR
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6">
                    <div>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        Haider
                      </p>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        Haider
                      </p>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        75* **** ****5
                      </p>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        7**3
                      </p>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        August
                      </p>
                      <p className="font-16 fw-semibold blackcolor poppins">
                        2037
                      </p>
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <Button
                      className="btn-stepper poppins px-3 font-16"
                      data-bs-toggle="modal"
                      data-bs-target="#PayNow"
                    >
                      Pay Now
                    </Button>
                    <Button className="btn-stepper-border poppins px-3 ms-2 font-16">
                      Use another method
                    </Button>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade pt-2 pb-2"
                id="v-pills-profile"
                role="tabpanel"
                aria-labelledby="v-pills-profile-tab"
                tabindex="0"
              >
                <h5 className="font-20 poppins">Paypal Account</h5>
                <div className="row mt-4">
                  <div className="col-lg-2 col-6 ">
                    <div className="textearning">
                      <p className="font-16 takegraycolor poppins">USERNAME</p>
                      <p className="font-16 poppins">EMAIL</p>
                      <p className="font-16 poppins">PASSWORD</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6">
                    <p className="font-16 blackcolor poppins">Haider</p>
                    <p className="font-16 blackcolor poppins">
                      Haider@gmail.com
                    </p>
                    <p className="font-16 blackcolor poppins"> A*******97</p>
                  </div>
                  <div className="d-flex mt-4">
                    <Button
                      className="btn-stepper poppins px-3 font-16"
                      data-bs-toggle="modal"
                      data-bs-target="#PayNow"
                    >
                      Pay Now
                    </Button>
                    <Button className="btn-stepper-border poppins px-3 ms-2 font-16">
                      Use another method
                    </Button>
                  </div>
                </div>
              </div>
              {/* -------modal---------- */}
              <div>
                {/* Button trigger modal */}
                <div
                  className="modal fade "
                  id="PayNow"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex={-1}
                  aria-labelledby="PayNowLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content ">
                      <div className="modal-header border-bottom-0">
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body pt-0 justify-content-center text-center">
                        <div>
                          <img
                            src={goodteck}
                            className=""
                            width={100}
                            height={100}
                            alt="w8"
                          />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-24  cocon">
                            Payment done successfully!
                          </h3>
                          <p className="font-16 mb-0 poppins">
                            Sed ut perspiciatis unde omnis iste natus error sit{" "}
                            <br /> voluptatem accusantium doloremque laudantium,{" "}
                            <br /> totam rem aperiam, eaque ipsa quae ab illo
                            inventore <br /> veritatis et quasi architecto
                            beatae vitae dicta sunt <br /> explicabo.
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center my-4">
                        <Button
                          className="btn-stepper poppins px-3 font-16"
                          data-bs-dismiss="modal"
                        >
                          Done
                        </Button>
                        <Button className="btn-stepper-border poppins px-3 ms-2 font-16">
                          See Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
                    .modal {
                        --bs-modal-width: 500px !important;
                    }
                    `}
      </style>
    </>
  );
};

export default Dopayout;
