import React from "react";
import take from "../assets/task.webp";
import { BsCircleFill } from "react-icons/bs";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Take = () => {
  return (
    <>
      <div className="container">
        <div className="row  justify-content-center pt-4">
          <div className="col-lg-10 col-12 mb-4">
            <Link to="/freelancers">
              <img src={take} className="w-25 mt-lg-5 mt-md-3 mt-3" alt="" loading="lazy" decoding="async" />
            </Link>
            <h5 className="font-22 font-500 cocon mt-3">
              Content Writing Skills Test
            </h5>
            <div className="mycardtake mt-3 p-4 rounded-3">
              <div>
                <h6 className="font-22 font-500 cocon">Test Syllabus</h6>
                <div className="d-flex mt-3">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    Seo in content writing
                  </p>
                </div>
                <div className="d-flex">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    Research techniques
                  </p>
                </div>
                <div className="d-flex ">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    Spellings
                  </p>
                </div>
                <div className="d-flex ">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    Seo in content writing
                  </p>
                </div>
                <div className="d-flex ">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">Grammer</p>
                </div>
                <div className="d-flex ">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    Commonly confused words
                  </p>
                </div>
              </div>
            </div>
            <div className="mycardtake mt-3 p-4 rounded-3">
              <div>
                <h6 className="font-22 font-500 cocon">Duration</h6>
                <div className="d-flex mt-3">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    40 minutes
                  </p>
                </div>
              </div>
            </div>
            <div className="mycardtake mt-3 p-4 rounded-3">
              <div>
                <h6 className="font-22 font-500 cocon">Questions</h6>
                <div className="d-flex mt-3">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    40 multiple choice questions
                  </p>
                </div>
              </div>
            </div>
            <div className="mycardtake mt-3 p-4 rounded-3">
              <div>
                <h6 className="font-22 font-500 cocon">Instructions</h6>
                <div className="d-flex mt-3">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    Each question has between 2 and 8 options; one or more may
                    be correct.
                  </p>
                </div>
                <div className="d-flex">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    In order to pass, you will need to answer at least 60% of
                    the questions correctly.
                  </p>
                </div>
                <div className="d-flex">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    The clock timing of your test is located at the top of the
                    test window..
                  </p>
                </div>
                <div className="d-flex">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    Once you have answered a question, you cannot go back and
                    change your answer..
                  </p>
                </div>
                <div className="d-flex">
                  <BsCircleFill className="takegraycolor" />
                  <p className="font-15 poppins takegraycolor ms-2">
                    {" "}
                    There is a 1 day waiting period between test retakes. You
                    can only take a test twice in a three months time window.
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button className="btn-stepper poppins px-3  font-16">
                Take Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Take;
