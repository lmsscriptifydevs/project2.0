import React from "react";
import levelimge from "../assets/levelimage.webp";
import levels from "../assets/level.webp";
import { BiCheckCircle } from "react-icons/bi";
function updateValue(value) {
  document.getElementById("minValue").textContent = value;
  document.getElementById("maxValue").textContent = parseInt(value) + 10; // Incrementing value by 10
}
function updateValue1(value) {
  document.getElementById("minValue").textContent = value;
  document.getElementById("maxValue").textContent = parseInt(value) + 5; // Incrementing value by 10
}
function updateValue2(value) {
  document.getElementById("minValue").textContent = value;
  document.getElementById("maxValue").textContent = parseInt(value) + 100; // Incrementing value by 10
}

const Level = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="container">
          <div className="d-flex justify-content-between mt-5 mb-5">
            <div>
              <h4>Level overview</h4>
            </div>
            <div>
              <h6 className="mb-0">How the level system works</h6>
            </div>
          </div>
          <div className="row justify-content-center mt-5">
            <div className="col-lg-3 col-12">
              <div className="Reviews  p-3 rounded-3 ">
                <div className="text-center">
                  <div className="mb-3">
                    <img src={levelimge} width={100} alt="" />
                  </div>
                  <img src={levels} width={120} alt="" />
                </div>
                <div className="mt-3">
                  <h6>Lorem ipsum</h6>
                  <p className="font-14">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-12 mt-lg-0 mt-md-3 mt-3">
              <div className="p-3 rounded-3 Reviews ">
                <div className="bgredcolor p-2 rounded-3">
                  <h6>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </h6>
                  <p className="font-14 mb-0">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatibus quibusdam nulla veritatis,
                  </p>
                </div>
                <div className="mt-3">
                  <h6>Lorem ipsum dolor sit adipisicing</h6>
                  <p className="font-14">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatibus veritatis,
                  </p>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className=" p-3 rounded-3 bgcolorlevel">
                      <h6>Success score</h6>
                      <h4>4</h4>
                      <div className="d-flex align-items-center">
                        <div>
                          <span id="minValue">0</span>
                        </div>
                        <input
                          type="range"
                          className="form-range customRange1 mx-2"
                          min="0"
                          max="100"
                          step="1"
                          onChange={(e) => updateValue(e.target.value)}
                        />
                        <div>
                          <span id="maxValue">10</span>
                        </div>
                      </div>

                      <div className="mt-3 bgcolorwhite p-1 rounded-3">
                        <p className="mb-0 font-14">
                          <BiCheckCircle /> in progress
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12  mt-lg-0 mt-md-3 mt-3">
                    <div className=" p-3 rounded-3 bgcolorlevel">
                      <h6>Rating</h6>
                      <h4>4.9</h4>
                      <div className="d-flex">
                        <div>
                          <span>0</span>
                        </div>
                        <input
                          type="range"
                          className="form-range customRange1 mx-2"
                          min="0"
                          max="100"
                          step="1"
                          onChange={(e) => updateValue1(e.target.value)}
                        />
                        <div>
                          <span>5</span>
                        </div>
                      </div>
                      <div className="mt-3 bgcolorgreen p-1 rounded-3">
                        <p className="mb-0 font-14">
                          <BiCheckCircle /> Qualifies for next level
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12  mt-lg-0 mt-md-3 mt-3">
                    <div className=" p-3 rounded-3 bgcolorlevel h-100">
                      <h6>Response rate</h6>
                      <h4>-</h4>
                      <div className="d-flex">
                        <div>
                          <span>0</span>
                        </div>
                        <input
                          type="range"
                          className="form-range customRange1 mx-2"
                          min="0"
                          max="100"
                          step="1"
                          onChange={(e) => updateValue2(e.target.value)}
                        />
                        <div>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12  mt-lg-0 mt-md-3 mt-3">
                    <div className=" p-3 rounded-3 mt-lg-5 bgcolorlevel">
                      <div className="d-flex justify-content-between">
                        <h6>Order</h6>
                        <h6>54/5</h6>
                      </div>
                      <div className="mt-3 bgcolorgreen p-1 rounded-3">
                        <p className="mb-0 font-14">
                          <BiCheckCircle /> Qualifies for next level
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12  mt-lg-0 mt-md-3 mt-3">
                    <div className=" p-3 rounded-3 mt-lg-5 bgcolorlevel">
                      <div className="d-flex justify-content-between">
                        <h6>Unique clients</h6>
                        <h6>20/3</h6>
                      </div>
                      <div className="mt-3 bgcolorgreen p-1 rounded-3">
                        <p className="mb-0 font-14">
                          <BiCheckCircle /> Qualifies for next level
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12  mt-lg-0 mt-md-3 mt-3">
                    <div className=" p-3 rounded-3 mt-lg-5 bgcolorlevel">
                      <div className="d-flex justify-content-between">
                        <h6>Earning</h6>
                        <h6>$4,945.63/$400</h6>
                      </div>
                      <div className="mt-3 bgcolorgreen p-1 rounded-3">
                        <p className="mb-0 font-14">
                          <BiCheckCircle /> Qualifies for next level
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level;
