import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { preloadRoutes } from "../utils/preloadRoutes";


import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// DIRECT IMPORTS (Critical / High-traffic pages – no spinner issues here)
// ============================================================================
import UserHistory from "../pages/UserHistory";
// Auth & Public
import Signin from "../components/Signin";
import Index from "../pages/Index";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import OnboardingGuard from "../components/OnboardingGuard";
import OtpGuard from "../components/OtpGuard";



// Main User Pages - LAZY LOADED for better performance
const Profile = lazy(() => import("../components/Profile"));
const Chat = lazy(() => import("../pages/Chat"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const FreelancerChat = lazy(() => import("../pages/freelancers/FrelancerChat"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));

// ============================================================================
// LAZY LOADED COMPONENTS (Heavy or Rarely Visited pages)
// ============================================================================

// Admin
const AdminDashboard = lazy(() => import("../pages/admin-panel"));
const AdminUsers = lazy(() => import("../pages/admin-panel/users"));
const BlogListPage = lazy(() => import("../pages/admin-panel/blog/BlogList"));
const CreateBlogPage = lazy(() => import("../pages/admin-panel/blog/create"));
const AdminOrders = lazy(() => import("../pages/admin-panel/orders/index"));
const AdminPayments = lazy(() => import("../pages/admin-panel/payment/index"));
const AdminBids = lazy(() => import("../pages/admin-panel/bids/index"));
const AdminWithdrawalManagement = lazy(
  () => import("../pages/admin-panel/withdraw/index"),
);
const AdminChat = lazy(() => import("../pages/admin-panel/chat/AdminChat"));

// Main App (secondary pages)
const ProfileOtherPerson = lazy(() => import("../pages/ProfileOtherPerson"));
const FollowersPage = lazy(() => import("../pages/FollowersPage"));
const BuyerRequest = lazy(() => import("../pages/BuyerRequest"));
const JobInvitation = lazy(
  () => import("../pages/freelancers/FreelancersJobInvitations"),
);
const Earning = lazy(() => import("../pages/Earning"));
const Spending = lazy(() => import("../pages/Spending"));
const ClientOffers = lazy(() => import("../pages/ClientOffers"));
const PaymentViaCard = lazy(
  () => import("../pages/freelancers/PaymentViaCard"),
);
const PayoutMethod = lazy(() => import("../pages/Payoutmethod/PayoutMethod"));

// Public Pages
const AboutUS = lazy(() => import("../pages/AboutUS"));
const WhyGrapeTask = lazy(() => import("../pages/WhyGrapeTask"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const SearchGigsMainBanner = lazy(
  () => import("../pages/SearchGigsMainBanner"),
);
const CategoryWiseGigs = lazy(
  () => import("../pages/CategoryWiseGigs"),
);
const MeetTopRatedFreelancer = lazy(
  () => import("../pages/MeetTopRatedFreelancer"),
);
const Level = lazy(() => import("../pages/Level"));
const Help = lazy(() => import("../pages/Help"));
const FreelancersGigs = lazy(
  () => import("../pages/freelancers/FreelancersGigs"),
);
const Blogopen = lazy(() => import("../components/Blogopen"));

// Auth Extra
const Forgot = lazy(() => import("../pages/Forgot"));
const Otp = lazy(() => import("../pages/Otp"));
const OtpResetPassword = lazy(() => import("../pages/otpResetPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const AuthCallback = lazy(() => import("../pages/AuthCallback"));

// Business
const BuyBids = lazy(() => import("../pages/PurchaseBids"));
const UserBuyerRequest = lazy(() => import("../pages/UserBuyerRequest"));
const HireExpert = lazy(() => import("../pages/HireExpert"));
const Applicants = lazy(() => import("../pages/Applicants"));
const Freelancers = lazy(() => import("../pages/freelancers/Freelancers"));

// BD <-> Expert Tasks
const BdTaskCreate = lazy(() => import("../pages/BdTaskCreate"));
const BdReceivedProposals = lazy(() => import("../pages/BdReceivedProposals"));
const ExpertViewBdRequests = lazy(() => import("../pages/ExpertViewBdRequests"));

// Other Core
const Account = lazy(() => import("../components/Account"));
const BonousReward = lazy(() => import("../components/BonousReward"));
const Chattingwindow = lazy(
  () => import("../components/frelancerChat/Chat/Chating"),
);
const Gigs2 = lazy(() => import("../components/Gigs2"));

const GigsManage = lazy(() => import("../components/GigsManage"));
const GigStates = lazy(() => import("../pages/GigStates"));
const GigStatsDetail = lazy(() => import("../pages/GigStatsDetail"));

const Interview = lazy(() => import("../components/Interview"));
const Order = lazy(() => import("../components/Orders/Order"));
const Privacy = lazy(() => import("../components/Privacy"));
const ProfileUser = lazy(() => import("../components/profile/Profile"));
const Refund = lazy(() => import("../components/Refund"));
const Shipping = lazy(() => import("../components/Shipping"));
const Take = lazy(() => import("../components/Take"));
const Terms = lazy(() => import("../components/Terms"));

// Additional
const RecruitProcess = lazy(() => import("../pages/RecruitProcess"));
const OfferDetail = lazy(() => import("../pages/OfferDetail"));
const MultiSteps = lazy(() => import("../pages/Stepper/MultiSteps"));

// Referral
const Entercode = lazy(() => import("../pages/Referal/Entercode"));
const Level1 = lazy(() => import("../pages/Referal/Level1"));
const Level2 = lazy(() => import("../pages/Referal/Level2"));
const Level3 = lazy(() => import("../pages/Referal/Level3"));
const Referl = lazy(() => import("../pages/Referal/Referl"));
const Thanks = lazy(() => import("../pages/Referal/Thanks"));
const ReferalList = lazy(() => import("../pages/ReferalList"));

// Job Management
const Accept = lazy(() => import("../pages/StartedJob/Accept"));
const Complete = lazy(() => import("../pages/StartedJob/Complete"));
const Progress = lazy(() => import("../pages/StartedJob/Progress"));

// Footer
const AboutUs = lazy(() => import("../components/footerComponents/AboutUs"));
const AffiliateProgram = lazy(
  () => import("../components/footerComponents/AffiliateProgram"),
);
const BusinessTools = lazy(
  () => import("../components/footerComponents/BusinessTools"),
);
const Careers = lazy(() => import("../components/footerComponents/Careers"));
const Community = lazy(
  () => import("../components/footerComponents/Community"),
);
const ContactUs = lazy(
  () => import("../components/footerComponents/ContactUs"),
);
const DirectContracts = lazy(
  () => import("../components/footerComponents/DirectContracts"),
);
const Enterprise = lazy(
  () => import("../components/footerComponents/Enterprise"),
);
const FreelanceUSA = lazy(
  () => import("../components/footerComponents/FreelanceUSA"),
);
const FreelanceWorldwide = lazy(
  () => import("../components/footerComponents/FreelanceWorldwide"),
);
const HelpSupport = lazy(
  () => import("../components/footerComponents/HelpSupport"),
);
const HireAnAgency = lazy(
  () => import("../components/footerComponents/HireAnAgency"),
);
const HireInUSA = lazy(
  () => import("../components/footerComponents/HireInUSA"),
);
const HireWorldwide = lazy(
  () => import("../components/footerComponents/HireWorldwide"),
);
const HowToFindWork = lazy(
  () => import("../components/footerComponents/HowToFindWork"),
);
const HowToHire = lazy(
  () => import("../components/footerComponents/HowToHire"),
);
const HowClientHireBD = lazy(
  () => import("../components/footerComponents/HowClientHireBD"),
);
const ClientBenefits = lazy(
  () => import("../components/footerComponents/ClientBenefits"),
);
const FreelancerBenefits = lazy(
  () => import("../components/footerComponents/FreelancerBenefits"),
);
const BusinessDeveloperRole = lazy(
  () => import("../components/footerComponents/BusinessDeveloperRole"),
);
const WithdrawalPolicy = lazy(
  () => import("../components/footerComponents/WithdrawalPolicy"),
);
const HowGrapeTaskWorks = lazy(
  () => import("../components/footerComponents/HowGrapeTaskWorks"),
);
const InvestorRelations = lazy(
  () => import("../components/footerComponents/InvestorRelations"),
);
const Leadership = lazy(
  () => import("../components/footerComponents/Leadership"),
);
const ModernSlavery = lazy(
  () => import("../components/footerComponents/ModernSlavery"),
);
const OurImpact = lazy(
  () => import("../components/footerComponents/OurImpact"),
);
const PayrollServices = lazy(
  () => import("../components/footerComponents/PayrollServices"),
);
const Press = lazy(() => import("../components/footerComponents/Press"));
const ProjectCatalog = lazy(
  () => import("../components/footerComponents/ProjectCatalog"),
);
const Resources = lazy(
  () => import("../components/footerComponents/Resources"),
);
const Reviews = lazy(() => import("../components/footerComponents/Reviews"));
const SuccessStories = lazy(
  () => import("../components/footerComponents/SuccessStories"),
);
const TalentMarketplace = lazy(
  () => import("../components/footerComponents/TalentMarketplace"),
);
const TalentScout = lazy(
  () => import("../components/footerComponents/TalentScout"),
);
const TrustSafety = lazy(
  () => import("../components/footerComponents/TrustSafetySecurity"),
);
const CookiePolicy = lazy(
  () => import("../components/footerComponents/CookiePolicy"),
);
const Accessibility = lazy(
  () => import("../components/footerComponents/Accessibility"),
);
const PricingPackages = lazy(
  () => import("../components/footerComponents/PricingPackages"),
);
const FooterPageTheme = lazy(() => import("../components/footerComponents/FooterPageTheme"));
// Success Stories Pages
const AllSuccessStoriesPage = lazy(() => import("../pages/AllSuccessStories"));
const StoryDetailPage = lazy(() => import("../pages/StoryDetail"));
const ClintStoryDetails = lazy(() => import("../pages/ClintStoryDetails"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const DisputeDetail = lazy(() => import("../pages/DisputeDetail"));


// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const USER_ROLES = {
  ADMIN: "admin",
  FREELANCER: "expert/freelancer",
  EXPERT: "expert/freelancer",
  SELLER: "seller", // backend sometimes returns this for freelancer/expert
  CLIENT: "Client",
  BIDDER: "bidder/company representative/middleman",
  COMPANY_REP: "bidder/company representative/middleman",
  MIDDLEMAN: "bidder/company representative/middleman",
};

const SESSION_CONFIG = {
  TIMEOUT_DURATION: 4 * 60 * 60 * 1000,
  WARNING_DURATION: 10 * 60 * 1000, 
  ACTIVITY_EVENTS: [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ],
  VALIDATION_TIMEOUT: 5 * 1000,
};

const SENSITIVE_PATHS = [
  "/admin",
  "/payment",
  "/payout",
  "/earning",
  "/spending",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const clearSensitiveData = () => {
  sessionStorage.clear();
  if (window.sensitiveData) {
    window.sensitiveData = null;
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => (
  <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
    <img
      src="/favicon.png"
      alt=""
      style={{
        width: size === "small" ? 40 : 60,
        height: size === "small" ? 40 : 60,
        animation: "spin 1s linear infinite",
        marginBottom: "1rem",
      }}
    />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <p className="mt-3 text-muted mb-0">{message}</p>
  </div>
);

/** PERF: Lightweight route fallback – Bootstrap spinner only, no image/keyframes during chunk load */
const RouteFallback = memo(function RouteFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
});

// Enhanced Error Boundary
const RouteErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleChunkError = (event) => {
      const isChunkLoadError = 
        event?.message?.includes("Loading chunk") || 
        event?.reason?.message?.includes("Loading chunk") ||
        event?.reason?.name === "ChunkLoadError";

      if (isChunkLoadError) {
        console.warn("ChunkLoadError detected → forcing reload...");
        const isReloaded = sessionStorage.getItem('chunk_reloaded');
        if (!isReloaded) {
          sessionStorage.setItem('chunk_reloaded', 'true');
          window.location.reload(); // ✅ recover automatically
        }
      } else {
        setHasError(true);
        console.error("Route Error:", event);
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleChunkError);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleChunkError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h1 className="display-4 text-danger">Oops!</h1>
          <p className="lead">Something went wrong. Please try refreshing.</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

/** PERF: memo – static content, avoid re-render when route parent updates */
const UnauthorizedPage = memo(function UnauthorizedPage() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="error-page">
          <h1 className="display-1 fw-bold text-danger">403</h1>
          <h2 className="mb-3">Access Denied</h2>
          <p className="lead text-muted mb-4">
            You don't have permission to access this resource.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/** PERF: memo – reduces re-renders when SecurityWrapper updates but modal props unchanged */
const SessionWarningModal = memo(function SessionWarningModal({
  show,
  onExtend,
  onLogout,
  timeLeft,
}) {
  if (!show) return null;
  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Session Expiring</h5>
          </div>
          <div className="modal-body">
            <p>
              Your session will expire in {Math.ceil(timeLeft / 1000)} seconds
              due to inactivity.
            </p>
            <p>Would you like to extend your session?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onLogout}
            >
              Logout
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onExtend}
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// PERF STARTUP: Enhanced protected route – optimistic render, never block UI.
// Renders children immediately if token exists; validation runs in background (App.js).
const EnhancedProtectedRoute = ({
  children,
  requiredRoles = [],
  fallbackPath = "/login",
}) => {
  const {
    isAuthenticated,
    tokenValidated,
    authLoading,
    userDetail: user,
  } = useSelector((state) => state.user);

  const location = useLocation();

  // PERF STARTUP: Defer localStorage read - use state to avoid blocking render
  const [hasToken, setHasToken] = useState(true); // Optimistic: assume token exists initially
  const [tokenChecked, setTokenChecked] = useState(false);
  // PERF STARTUP: Role from storage deferred – never read localStorage during render
  const [roleFromStorage, setRoleFromStorage] = useState(null);

  useEffect(() => {
    // PERF: Check token and optional UserData after first paint (single pass)
    const checkTokenAndRole = () => {
      try {
        const token = localStorage.getItem("accessToken");
        setHasToken(!!token);
        if (requiredRoles.length > 0) {
          const raw = localStorage.getItem("UserData");
          setRoleFromStorage(raw ? JSON.parse(raw).role : null);
        }
      } catch {
        setHasToken(false);
        setRoleFromStorage(null);
      } finally {
        setTokenChecked(true);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(checkTokenAndRole, { timeout: 0 });
    } else {
      setTimeout(checkTokenAndRole, 0);
    }
  }, [requiredRoles.length]);

  // PERF: Optimistic rendering - if we have a token, render children immediately
  // Validation happens in background via App.js useEffect
  // Only redirect if we're CERTAIN user is not authenticated (token validated AND failed)
  const shouldRedirect =
    tokenChecked && (!hasToken || (tokenValidated && !isAuthenticated));

  // PERF: Don't block UI - render children optimistically if token exists
  // Role validation happens after render, redirects if needed
  if (shouldRedirect) {
    return (
      <Navigate to={fallbackPath} replace state={{ from: location.pathname }} />
    );
  }

  // PERF STARTUP: Use Redux role or deferred roleFromStorage – no sync localStorage in render
  const role = user?.role ?? roleFromStorage;
  if (requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // PERF: Render children immediately - no loading spinner blocking UI
  return children;
};

// Role Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  return (
    <EnhancedProtectedRoute requiredRoles={allowedRoles}>
      {children}
    </EnhancedProtectedRoute>
  );
};

// Auth Route Component (redirects authenticated users)
// PERF STARTUP: Defer localStorage read to avoid blocking render
const AuthRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [hasToken, setHasToken] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      try {
        const token = localStorage.getItem("accessToken");
        setHasToken(!!token);
      } catch {
        setHasToken(false);
      } finally {
        setTokenChecked(true);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(checkToken, { timeout: 0 });
    } else {
      setTimeout(checkToken, 0);
    }
  }, []);

  // Only redirect after token is checked
  if (tokenChecked && isAuthenticated && hasToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Enhanced Security Wrapper
const SecurityWrapper = ({ children }) => {
  const location = useLocation();
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  const timeoutRef = useRef();
  const warningTimeoutRef = useRef();
  const countdownIntervalRef = useRef();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    clearSensitiveData();
    window.location.href = "/login?session=expired";
  }, []);

  const showWarning = useCallback(() => {
    setSessionTimeLeft(SESSION_CONFIG.WARNING_DURATION);
    setShowSessionWarning(true);

    // Clear any existing countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(countdownIntervalRef.current);
          handleLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }, [handleLogout]);

  const resetTimeout = useCallback(() => {
    // Clear all existing timeouts and intervals
    clearTimeout(timeoutRef.current);
    clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowSessionWarning(false);

    // PERF STARTUP: localStorage read is in callback (not during render), but still defer for safety
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        warningTimeoutRef.current = setTimeout(
          showWarning,
          SESSION_CONFIG.TIMEOUT_DURATION - SESSION_CONFIG.WARNING_DURATION,
        );
        timeoutRef.current = setTimeout(
          handleLogout,
          SESSION_CONFIG.TIMEOUT_DURATION,
        );
      }
    } catch {
      // Silently fail
    }
  }, [showWarning, handleLogout]);

  const extendSession = useCallback(() => {
    resetTimeout();
    setShowSessionWarning(false);
  }, [resetTimeout]);

  useEffect(() => {
    // PERF STARTUP: Defer localStorage read to avoid blocking render
    const checkTokenAndSetup = () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          resetTimeout();
        }
      } catch {
        // Silently fail
      }
    };

    const handleActivity = () => {
      try {
        if (localStorage.getItem("accessToken")) {
          resetTimeout();
        }
      } catch {
        // Silently fail
      }
    };

    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // PERF: Defer token check until after first paint
    if ("requestIdleCallback" in window) {
      requestIdleCallback(checkTokenAndSetup, { timeout: 0 });
    } else {
      setTimeout(checkTokenAndSetup, 0);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimeout]);

  return (
    <>
      <SessionWarningModal
        show={showSessionWarning}
        onExtend={extendSession}
        onLogout={handleLogout}
        timeLeft={sessionTimeLeft}
      />
      {children}
    </>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.user);

  // PERF STARTUP: Defer localStorage reads - don't block render
  const [tokenExists, setTokenExists] = useState(false);
  const [user, setUser] = useState(null);
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

  useEffect(() => {
    // PERF: Defer localStorage reads until after first paint
    const readLocalStorage = () => {
      try {
        const token = localStorage.getItem("accessToken");
        setTokenExists(!!token);

        const userData = localStorage.getItem("UserData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error reading localStorage:", error);
        setTokenExists(false);
        setUser(null);
      } finally {
        setLocalStorageLoaded(true);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(readLocalStorage, { timeout: 0 });
    } else {
      setTimeout(readLocalStorage, 0);
    }
  }, []);

  // PERF STARTUP: Defer token refresh interval until after mount – no blocking on first paint.
  useEffect(() => {
    let intervalId = null;

    const refreshToken = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const response = await fetch("/api/refresh-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("tokenExpiry", data.expires_at);
        }
      } catch {
        /* token refresh failed */
      }
    };

    const setupInterval = () => {
      intervalId = setInterval(refreshToken, 25 * 60 * 1000);
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(setupInterval, { timeout: 1000 });
    } else {
      setTimeout(setupInterval, 0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // PERF STARTUP: Defer route preloading until after first paint – non-critical, never block UI.
  useEffect(() => {
    if (!isAuthenticated || !tokenExists) return;

    const deferPreload = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            preloadRoutes(user?.role);
          },
          { timeout: 3000 },
        ); // Max 3s wait - low priority
      } else {
        setTimeout(() => {
          preloadRoutes(user?.role);
        }, 500); // Small delay to allow first paint
      }
    };

    deferPreload();
  }, [isAuthenticated, tokenExists, user?.role]);

  return (
    <RouteErrorBoundary>
      {/* PERF STARTUP: SecurityWrapper does not block – session logic runs in useEffect. */}
      <SecurityWrapper>
        <OtpGuard>
        {/* PERF STARTUP: "/" uses direct Index import – no suspend; shell paints immediately. */}
        <OnboardingGuard>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes – Index direct import, no lazy; first paint unblocked */}
            <Route path="/" element={<Index />} />
            <Route path="/whygrapetask" element={<WhyGrapeTask />} />
            <Route path="/aboutus" element={<AboutUS />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/search/gigs" element={<SearchGigsMainBanner />} />
            <Route path="/category-wise-gigs" element={<CategoryWiseGigs />} />
            <Route
              path="/MeetTopRatedFreelancer"
              element={<MeetTopRatedFreelancer />}
            />
            <Route path="/level" element={<Level />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/g/:gigslug/:user/:gigId"
              element={<FreelancersGigs />}
            />
            <Route path="/Blogopen" element={<Blogopen />} />

            {/* Footer Pages */}
            <Route element={<FooterPageTheme />}>
              <Route path="/how-to-hire" element={<HowToHire />} />
              <Route path="/how-client-hire-bd" element={<HowClientHireBD />} />
              <Route path="/client-benefits" element={<ClientBenefits />} />
            <Route
              path="/buyerRequest"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                  ]}
                >
                  <BuyerRequest />
                </RoleProtectedRoute>
              }
            />
              <Route path="/withdrawal-policy" element={<WithdrawalPolicy />} />
              <Route
                path="/how-grapetask-works"
                element={<HowGrapeTaskWorks />}
              />
              <Route path="/talent-marketplace" element={<TalentMarketplace />} />
              <Route path="/project-catalog" element={<ProjectCatalog />} />
              <Route path="/talent-scout" element={<TalentScout />} />
              <Route path="/hire-an-agency" element={<HireAnAgency />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/payroll-services" element={<PayrollServices />} />
              <Route path="/direct-contracts" element={<DirectContracts />} />
              <Route path="/hire-worldwide" element={<HireWorldwide />} />
              <Route path="/hire-in-usa" element={<HireInUSA />} />
              <Route path="/how-to-find-work" element={<HowToFindWork />} />
              <Route
                path="/freelance-jobs-worldwide"
                element={<FreelanceWorldwide />}
              />
              <Route path="/freelance-jobs-usa" element={<FreelanceUSA />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/upwork-reviews" element={<Reviews />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="/business-tools" element={<BusinessTools />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/investor-relations" element={<InvestorRelations />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/our-impact" element={<OurImpact />} />
              <Route path="/press" element={<Press />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/trust-safety" element={<TrustSafety />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/pricing" element={<PricingPackages />} />
              <Route path="/modern-slavery" element={<ModernSlavery />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/shipping" element={<Shipping />} />
            </Route>
            <Route path="/received-offers" element={<ClientOffers />} />
            
            {/* BD <-> Expert Routes */}
            <Route path="/bd-tasks" element={<BdTaskCreate />} />
            <Route path="/bd-received-proposals" element={<BdReceivedProposals />} />
            <Route path="/expert-bd-tasks" element={<ExpertViewBdRequests />} />

            {/* Auth Routes - Using AuthRoute wrapper */}
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signin />
                </AuthRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/forgot"
              element={
                <AuthRoute>
                  <Forgot />
                </AuthRoute>
              }
            />
            <Route
              path="/otp"
              element={<Otp />}
            />
            <Route
              path="/otp-reset-password"
              element={
                <AuthRoute>
                  <OtpResetPassword />
                </AuthRoute>
              }
            />
            <Route
              path="/resetPassword"
              element={
                <AuthRoute>
                  <ResetPassword />
                </AuthRoute>
              }
            />
            {/* Backend Google OAuth redirect lands here with ?token=... */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Admin Routes - Admin Only */}
            <Route
              path="/admin/*"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminUsers />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <BlogListPage />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs/create"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <CreateBlogPage />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminOrders />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/payments"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminPayments />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/bids"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminBids />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admin/withdraw"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminWithdrawalManagement />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/adminInbox"
              element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminChat />
                </RoleProtectedRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <EnhancedProtectedRoute>
                  <Dashboard />
                  </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <EnhancedProtectedRoute>
                   <Profile />
                   </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/profileOtherPerson/:id"
              element={
                <EnhancedProtectedRoute>
                  <ProfileOtherPerson />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <EnhancedProtectedRoute>
                  <ProfileOtherPerson />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/followers"
              element={
                <EnhancedProtectedRoute>
                  <FollowersPage />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/buyerRequest"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                  ]}
                >
                  <BuyerRequest />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/jobInvitation"
              element={
                <EnhancedProtectedRoute>
                  <JobInvitation />
                </EnhancedProtectedRoute>
              }
            />

            {/* Chat Routes */}
            <Route
              path="/Inbox"
              element={
                <EnhancedProtectedRoute>
                <FreelancerChat />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/userchat"
              element={
                <EnhancedProtectedRoute>
                  <Chattingwindow />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/userInbox"
              element={
                <EnhancedProtectedRoute>
                  <FreelancerChat />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <EnhancedProtectedRoute>
                  <Chat />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/chat/:user"
              element={
                <EnhancedProtectedRoute>
                  <Chat />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/frelancerChat"
              element={
                <EnhancedProtectedRoute>
                  <FreelancerChat />
                </EnhancedProtectedRoute>
              }
            />

            {/* Financial Routes - Role-based Security with Onboarding Guard */}
<Route
  path="/earning"
  element={
    <RoleProtectedRoute
      allowedRoles={[
        USER_ROLES.FREELANCER,
        USER_ROLES.EXPERT,
        USER_ROLES.BIDDER,
        USER_ROLES.COMPANY_REP,
        USER_ROLES.MIDDLEMAN,
      ]}
    >
      <Earning />
      </RoleProtectedRoute>
  }
/>

            <Route
              path="/spending"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                  ]}
                >
                  <Spending />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/payoutMethod"
              element={
                <EnhancedProtectedRoute>
                  <PayoutMethod />
                </EnhancedProtectedRoute>
              }
            />

            {/* Payment Routes - Multi-role Access */}
            <Route
              path="/gigs/states"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.FREELANCER,
                    USER_ROLES.SELLER,
                    USER_ROLES.EXPERT,
                  ]}
                >
                  <GigStates />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/gig/stats"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.FREELANCER,
                    USER_ROLES.SELLER,
                    USER_ROLES.EXPERT,
                  ]}
                >
                  <GigStatsDetail />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/order/payment"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.FREELANCER,
                    USER_ROLES.EXPERT,
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                  ]}
                >

                  <PaymentViaCard />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/payment/success"
              element={
                <EnhancedProtectedRoute>
                  <PaymentSuccess />
                </EnhancedProtectedRoute>
              }
            />

            {/* Business Routes - Client/Bidder specific */}
            <Route
              path="/userBuyerRequest"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                  ]}
                >
                  <UserBuyerRequest />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/buy-bids"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                    USER_ROLES.FREELANCER,
                    USER_ROLES.EXPERT,
                  ]}
                >
                  <BuyBids />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/hireExpert"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    USER_ROLES.CLIENT,
                    USER_ROLES.BIDDER,
                    USER_ROLES.COMPANY_REP,
                    USER_ROLES.MIDDLEMAN,
                  ]}
                >
                  <HireExpert />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/applicants"
              element={
                <EnhancedProtectedRoute>
                  <Applicants />
                </EnhancedProtectedRoute>
              }
            />

            <Route
  path="/gigs/manage"
  element={
    <EnhancedProtectedRoute>
      <GigsManage />
      </EnhancedProtectedRoute>
  }
/>

            <Route
              path="/gigs/states"
              element={
                <EnhancedProtectedRoute>
                  <GigStates />
                  </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/:username"
              element={
                <EnhancedProtectedRoute>
                  <Gigs2 />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/recruitProcess"
              element={
                <EnhancedProtectedRoute>
                  <RecruitProcess />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/tack"
              element={
                <EnhancedProtectedRoute>
                  <Take />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/account"
              element={
                <EnhancedProtectedRoute>
                  <Account />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/order"
              element={
                <EnhancedProtectedRoute>
                   <Order />
                   </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/order/:id"
              element={
                <EnhancedProtectedRoute>
                  <Order />
                </EnhancedProtectedRoute>
              }
            />

            {/* Referral Routes */}
            <Route
              path="/profile/referral/link"
              element={
                <EnhancedProtectedRoute>
                  <Level1 />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/level2"
              element={
                <EnhancedProtectedRoute>
                  <Level2 />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/level3"
              element={
                <EnhancedProtectedRoute>
                  <Level3 />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/thanks"
              element={
                <EnhancedProtectedRoute>
                  <Thanks />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/entercode"
              element={
                <EnhancedProtectedRoute>
                  <Entercode />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/referl"
              element={
                <EnhancedProtectedRoute>
                  <Referl />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/profile/referrals"
              element={
                <EnhancedProtectedRoute>
                  <ReferalList />
                </EnhancedProtectedRoute>
              }
            />

            {/* Job Management Routes */}
            <Route
              path="/accept"
              element={
                <EnhancedProtectedRoute>
                  <Accept />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <EnhancedProtectedRoute>
                  <Progress />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/complete"
              element={
                <EnhancedProtectedRoute>
                  <Complete />
                </EnhancedProtectedRoute>
              }
            />

            {/* Misc Protected Routes */}
            <Route
              path="/bonousReward"
              element={
                <EnhancedProtectedRoute>
                  <BonousReward />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/multiSteps"
              element={
                <EnhancedProtectedRoute>
                  <MultiSteps />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/profileSetting"
              element={
                <EnhancedProtectedRoute>
                <ProfileUser />
                 </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <EnhancedProtectedRoute>
                  <Interview />
                </EnhancedProtectedRoute>
              }
            />

            <Route
              path="/offerDetail/:id"
              element={
                <EnhancedProtectedRoute>
                  <OfferDetail />
                </EnhancedProtectedRoute>
              }
            />

{/* ✅ Naya Onboarding Guard applied successfully yahan! */}
            <Route 
              path="/freelancers" 
              element={
                <EnhancedProtectedRoute>
                  <Freelancers />
                  </EnhancedProtectedRoute>
              } 
            />

            {/* Aapka naya history page route */}
            <Route path="/history" element={<UserHistory />} />
            {/* Success Stories Routes */}
            <Route path="/success-stories" element={<AllSuccessStoriesPage />} />
            <Route path="/success-stories/:id" element={<StoryDetailPage />} />
            <Route path="/clintstories/:id" element={<ClintStoryDetails />} />

            <Route path="/dispute/:id" element={<DisputeDetail />} />
            

            <Route path="/Onboarding" element={<Onboarding />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />

         
          </Routes>
        </Suspense>
        </OnboardingGuard>
      </OtpGuard>
      </SecurityWrapper>
    </RouteErrorBoundary>
  );
}

export default AppRoutes;
