import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Loginleft() {
  return (
    <div className="col-lg-6 col-12 login-panel-left order-1 order-lg-0">
      <div className="login-left-overlay" />
      <div className="login-left-content position-relative">
        <Link to="/" className="login-left-brand">
          <img src={logo} className="login-left-logo" alt="GrapeTask" />
        </Link>
        <h1 className="login-left-title">
          Hey,
          <br className="d-none d-md-block" />
          Welcome  back &nbsp;
          <br className="d-none d-md-block" />
          to GrapeTask &nbsp;
          <br className="d-none d-md-block" />
          Pakistan's 1st Freelance Marketplace
        </h1>
        <p className="login-left-subtitle d-none d-md-block">
          Pakistan’s #1 freelance marketplace. Connect, grow, and get paid.
        </p>
      </div>
    </div>
  );
}

export default Loginleft;
