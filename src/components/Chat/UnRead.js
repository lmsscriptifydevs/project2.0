import React from "react";
import user from "../../assets/chatImg.webp";

const UnRead = () => {
  return (
    <>
      <div
        className="d-flex mt-3 p-3 rounded-3"
        style={{ backgroundColor: "#F5F5FF" }}
      >
        <div className="position-relative">
          <img
            src={user}
            className=""
            width={50}
            height={50}
            alt="w8"
            style={{ clipPath: "circle(50%)" }}
          />
        </div>
        <div className="ms-2 w-100">
          <div className="d-flex justify-content-between align-items-center">
            <p className=" fw-medium font-16 mb-0" style={{ color: "#1D2B3C" }}>
              Aura ..
            </p>
            <p className="msg-time  mb-0">13.00</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="  font-14 mb-0" style={{ color: "#667085" }}>
              Aura ..
            </p>
            <p className="mb-0  msg-length">1</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnRead;
