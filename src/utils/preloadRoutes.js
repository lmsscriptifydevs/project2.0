// utils/preloadRoutes.js

/**
 * Preload route chunks based on user role.
 * This prevents "Loading chunk failed" errors
 * by warming up important pages right after login.
 */
export const preloadRoutes = (role) => {
  // 🔥 Always preload core high-traffic pages
  import("../pages/Dashboard");
  import("../components/Profile");
  import("../pages/Chat");
  import("../pages/freelancers/FrelancerChat");
  import("../pages/PaymentSuccess");

  // ------------------------------
  // 🎯 Role-specific preloading
  // ------------------------------

  // Freelancer / Expert pages
  if (role === "freelancer" || role === "expert/freelancer") {
    import("../pages/Earning");
    import("../pages/Payoutmethod/PayoutMethod");
 
    import("../pages/freelancers/FreelancersGigs");
    import("../pages/freelancers/FreelancersJobInvitations");
    import("../pages/freelancers/PaymentViaCard");
  }

  // Client pages
  if (role === "Client") {
    import("../pages/Spending");
    import("../pages/UserBuyerRequest");
    import("../pages/PurchaseBids");
    import("../pages/HireExpert");
    import("../pages/Applicants");
    import("../pages/BuyerRequest");
  }

  // Bidder / Company Rep / Middleman pages
  if (
    role === "bidder/company representative/middleman" ||
    role === "bidder" ||
    role === "company representative" ||
    role === "middleman"
  ) {
    import("../pages/BuyerRequest");
    import("../pages/UserBuyerRequest");
    import("../pages/PurchaseBids");
    import("../pages/Applicants");
    import("../pages/HireExpert");
    import("../pages/Spending");
  }

  // Admin pages
  if (role === "admin") {
    import("../pages/admin-panel");
    import("../pages/admin-panel/users");
    import("../pages/admin-panel/blog/BlogList");
    import("../pages/admin-panel/blog/create");
    import("../pages/admin-panel/orders/index");
    import("../pages/admin-panel/payment/index");
    import("../pages/admin-panel/bids/index");
    import("../pages/admin-panel/withdraw/index");
    import("../pages/admin-panel/chat/AdminChat");
  }

  // ------------------------------
  // 📦 Medium-traffic pages (safe for all roles)
  // ------------------------------
  import("../pages/OfferDetail");
  import("../pages/RecruitProcess");
  import("../components/Gigs2");
};
