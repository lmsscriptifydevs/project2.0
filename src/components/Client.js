import line from "../assets/line.webp";
import Testomonial from "./Testomonial";

const Team = () => {
  return (
    <div style={{ backgroundColor: "#020617", padding: "40px 0" }}>
      <div className="container ">
        <div className="row  justify-content-center">
          <h3 className="text-center font-40 font-500 cocon" style={{ color: "#ffffff" }}>
           Client Feedback That Speaks Volumes
          </h3>
          <div className="d-flex justify-content-center mb-5">
            <img src={line} className="text-center" alt="grapetask" />
          </div>
          <Testomonial />
        </div>
      </div>
    </div>
  );
};

export default Team;


