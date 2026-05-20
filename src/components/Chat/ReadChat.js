import React from "react";
import user from "../../assets/chatImg.webp";

const ReadChat = () => {
  return (
    <>
      <div className="d-flex mt-3 p-3 ">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2 w-100">
          <div className="d-flex justify-content-between align-items-center">
            <p className=" fw-medium font-16 mb-0" style={{ color: "#1D2B3C" }}>
              Aura ..
            </p>
            <p className="msg-time ms-3 mb-0">13.00</p>
          </div>

          <p className="  font-14 mb-0" style={{ color: "#667085" }}>
            Aura ..
          </p>
        </div>
      </div>
      <hr
        className="border-0 mt-1 mb-1"
        style={{ height: "2px", opacity: "50%", backgroundColor: "#667085" }}
      />
    </>
  );
};

export default ReadChat;
