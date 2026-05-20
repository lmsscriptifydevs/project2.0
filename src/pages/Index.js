import { lazy, Suspense, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "../redux/store/store";
import { geAllGigs } from "../redux/slices/allGigsSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "../components/Navbar";
import WelcomeModal from "../components/WelcomeModal";
import HeroSection from "../components/homepage/HeroSection";
import GetWorkDone from "../components/homepage/GetWorkDone";
import HowGoodCompanies from "../components/homepage/HowGoodCompanies";
import TopRatedFreelancers from "../components/homepage/TopRatedFreelancers";
import BrowseCategories from "../components/homepage/BrowseCategories";
import MakeItReal from "../components/homepage/MakeItReal";
import TrustSection from "../components/homepage/TrustSection";
import AdditionalSections from "../components/homepage/AdditionalSections";
import Successstories from "../components/homepage/Successstories";
import NewsletterStats from "../components/NewsletterStats";
import Faq from "../components/homepage/Faq";
import ClintSucess from "../components/homepage/ClintSucess";

// Lazy-load heavy components
const Footer = lazy(() => import("../components/Footer"));

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { gigsDetail, isLoading } = useSelector(state => state.allGigs);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Process gigs safely
  const Real_Freelancer = useMemo(() => {
    if (!gigsDetail || !Array.isArray(gigsDetail)) return [];
    const first = gigsDetail[0];
    if (first && Array.isArray(first.gigs)) {
      return gigsDetail.flatMap(object => object?.gigs || []).filter(Boolean);
    }
    return gigsDetail.filter(Boolean);
  }, [gigsDetail]);

  const GigsWithThumbnail = useMemo(() => {
    return (Real_Freelancer || []).filter((g) => {
      const m = g?.media || g?.gig?.media || {};
      return m.image1 || m.image_1 || m.image2 || m.image_2 || m.image3 || m.image_3;
    });
  }, [Real_Freelancer]);

  // Defer gigs data loading
  useEffect(() => {
    const loadGigs = () => {
      dispatch(geAllGigs({ page: 1, limit: 12 })).catch(console.error);
    };
    if ("requestIdleCallback" in window) requestIdleCallback(loadGigs, { timeout: 2000 });
    else setTimeout(loadGigs, 100);
  }, [dispatch]);

  // Navigation callbacks
  const handleLearnMore = useCallback(() => navigate("/aboutus"), [navigate]);
  const handleViewAllGigs = useCallback(() => navigate("/search/gigs"), [navigate]);

  return (
    <>
      {/* Modals and Navbar */}
      <WelcomeModal />
      <Navbar />

      {/* Homepage Sections */}
      <HeroSection />
      <GetWorkDone />
      <HowGoodCompanies handleLearnMore={handleLearnMore} />
      <BrowseCategories />
      <TopRatedFreelancers />
      
      <MakeItReal />
      <ClintSucess />
      <TrustSection />
      <AdditionalSections />
      <Successstories />
      <Faq />
      <NewsletterStats />
      

      {/* Footer with Suspense */}
      <Suspense fallback={<div className="loading-footer">Loading Footer...</div>}>
        <Footer />
      </Suspense>

      {/* Toasts */}
      <ToastContainer />
    </>
  );
};

export default Index;