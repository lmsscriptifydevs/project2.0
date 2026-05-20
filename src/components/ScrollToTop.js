import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

/** PERF: memo avoids re-render when parent re-renders; component returns null so effect-only work. */
const ScrollToTop = memo(function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
});

export default ScrollToTop;