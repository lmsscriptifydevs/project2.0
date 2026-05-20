import { Outlet } from "react-router-dom";
import "./footerPageTheme.css";

const FooterPageTheme = () => {
  return (
    <div className="footer-page-theme">
      <Outlet />
    </div>
  );
};

export default FooterPageTheme;
