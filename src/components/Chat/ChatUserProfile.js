import React from "react";
import user from "../../assets/chatImg.webp";

const ChatUserProfile = () => {
  return (
    <>
      <div
        className="bg-white h-100 rounded-3"
        style={{ boxShadow: " 0px -2px 10px 0px #00000014" }}
      >
        <div className="d-flex  p-3 ">
          <img
            src={user}
            width={50}
            height={50}
            alt="w8"
            style={{ clipPath: "circle(50%)" }}
          />
          <div className="ms-2 w-100">
            <p className=" fw-medium font-16 mb-0" style={{ color: "#1D2B3C" }}>
              Kah Tung Yong
            </p>

            <p className="  font-14 mb-0" style={{ color: "#667085" }}>
              Web & APP UI/UX Designer
            </p>
          </div>
        </div>
        <hr
          className="border-0 mt-1 mb-1"
          style={{
            height: "1.5px",
            opacity: "50%",
            backgroundColor: "#667085",
          }}
        />
        <div className="d-flex p-3 justify-content-between align-items-center">
          <p className=" fw-medium font-14 mb-0" style={{ color: "#1D2B3C" }}>
            Orders with you
          </p>
          <p className="font-12  takegraycolor mb-0">Total (1)</p>
        </div>
        <hr
          className="border-0 mt-1 mb-1"
          style={{
            height: "1.5px",
            opacity: "50%",
            backgroundColor: "#667085",
          }}
        />

        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className=" fw-medium font-14 mb-0" style={{ color: "#1D2B3C" }}>
              From
            </p>
            <p className="font-12  takegraycolor mb-0">Korea</p>
          </div>
          <div className="d-flex mt-2 justify-content-between align-items-center">
            <p className=" fw-medium font-14 mb-0" style={{ color: "#1D2B3C" }}>
              English
            </p>
            <p className="font-12  takegraycolor mb-0">Basic</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUserProfile;
