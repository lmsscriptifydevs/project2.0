import axios from "axios";
// config
import { HOST_API } from "../config";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
});

// Attach Bearer token so protected APIs (e.g. job-invitations) always get auth
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// On 401: clear token and redirect to login (session=expired) if on a protected page.
// Session can also "expire" from inactivity timeout (see SESSION_CONFIG in routes/index.js – now 4 hours).
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/profile",
  "/orders",
  "/earning",
  "/spending",
  "/chat",
  "/payout",
  "/admin",
  "/referral",
  "/applicants",
  "/account",
  "/gigs",
  "/level",
  "/offer",
  "/hire-expert",
  "/buyer-request",
  "/started-job",
  "/multi-steps",
  "/bonus",
  "/interview",
  "/freelancers",
  "/payment-success",
  "/payout-method",
  "/referal",
  "/enter-code",
  "/thanks",
  "/referal-list",
  "/accept",
  "/progress",
  "/complete",
  "/profile-user",
  "/offer-detail",
  "/job-invitations",
  "/meet-top-rated",
  "/search-gigs",
  "/inbox",
  "/purchase-bids",
  "/user-buyer-request",
  "/profile-other",
];
function isProtectedPath(pathname) {
  const p = (pathname || "").split("?")[0];
  if (p === "/") return false;
  if (p === "/auth/callback") return false;
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(prefix + "/"),
  );
}

let didRedirect401 = false;
function clearAuthAndRedirect() {
  if (didRedirect401) return;
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname === "/auth/callback") return;
  didRedirect401 = true;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("UserData");
  localStorage.removeItem("Role");
  if (pathname && isProtectedPath(pathname)) {
    window.location.replace("/login?session=expired");
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
