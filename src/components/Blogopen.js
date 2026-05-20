import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import openblog from "../assets/blogopen.webp";

const Blogopen = () => {
  return (
    <>
      <Navbar SecondNav="none" />
      <div className="container-fluid pt-lg-5 pt-md-4 pt-3 ">
        <div className="row justify-content-center mx-lg-4 mx-md-3 mx-xm-3 mx-0">
          <img src={openblog} className="w-100" alt="" />
          <div className="col-lg-9 col-12 poppins mt-lg-5 mt-md-5 mt-3">
            <p className="font-18  colororing ">
              Legal Advice | Sunday, July 19, 2022{" "}
            </p>
            <h6 className="font-38 font-500 cocon blackcolor">
              Failing to Carry Out The Terms of <br />A Business Contract
            </h6>
            <hr />
            <p className="font-18 takegraycolor">
              Uniquely matrix economically sound value through cooperative
              technology. Competently parallel task fully researched data and
              enterprise process improvements. Collaboratively expedite quality
              manufactured products via client-focused results quickly
              communicate enabled technology and turnkey leadership skills.
              Uniquely enable accurate supply chains rather than friction
              technology.
            </p>
            <h6 className="font-38 font-500 cocon blackcolor">
              Equal Justice for all Livings
            </h6>
            <p className="font-18 takegraycolor">
              Appropriately empower dynamic leadership skills after business
              portals. Globally my cardinate interactive supply chains with
              distinctive quality vectors global sources services. Uniquely
              matrix economically sound value through cooperative technology.
              Competently parallel task fully researched data and enterprise
              process improvements.
            </p>
            <div>
              <ul className="font-18 takegraycolor">
                <li>
                  Dynamically target high-payoff intellectual capital for
                  customized
                </li>
                <li>Interactively procrastinate high-payoff content</li>
                <li>
                  Credibly reinter mediate backend ideas for cross-platform
                  models
                </li>
              </ul>
            </div>
            <div className="backgroundoring mt-5">
              <div className="p-5">
                <h3 className="font-28 font-600">
                  “Democracy must be built through open societies that share
                  information. When there is information, there is
                  enlightenment. When there is no sharing of power, no rule of
                  law, no accountability, there is abuse, corruption,
                  subjugation and indignation.”
                </h3>
              </div>
            </div>
            <div>
              <h6 className="font-38 font-500 cocon blackcolor mt-5">
                Make real time a law services
              </h6>
              <p className="font-18 mt-3 takegraycolor">
                Collaboratively administrate empowered markets via plug-and-play
                networks. Dynamically procrastinate B2C users after installed
                base benefits. Dramatically visualize customer directed
                convergence without revolutionary ROI.
              </p>
            </div>
            <div className=" mt-3">
              <div>
                <p className="font-18 mt-2 takegraycolor">
                  1. It brings the right people together with all the right
                  information and tools to get work done
                </p>
              </div>
              <div>
                <p className="font-18 mt-2 takegraycolor">
                  2. We provide operational efficiency, data security, and
                  flexible scale
                </p>
              </div>
              <div>
                <p className="font-18 mt-2 takegraycolor">
                  3. Your best work, together in one package that works
                  seamlessly from your computer
                </p>
              </div>
              <div>
                <p className="font-18 mt-2 takegraycolor">
                  4. Delivers the tools you need to save time Improve field
                  performance always
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blogopen;
