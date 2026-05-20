import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  AiFillStar,
  AiOutlineCalendar,
  AiOutlineMessage,
  AiOutlineProject,
  AiOutlineRise,
  AiOutlineTeam,
  AiOutlineWallet
} from "react-icons/ai";
import { BiTime, BiTrendingUp } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "../redux/store/store";

// Components
import Dashboardright from "../components/Dashboardright";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import DetailsOnboard from "../components/DetailsOnboard";

// Assets
import bannerimg from "../assets/bannerimg.webp";
import timepes from "../assets/time (1).webp";

// Redux actions
import { sellerRating } from "../redux/slices/ratingSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.profile);
  const { userStats } = useSelector((state) => state.dashboard);
  const [activeTab, setActiveTab] = useState("overview");

  const { userRating, allRating } = useSelector((state) => state.rating);

  // PERF STARTUP: Defer localStorage read to avoid blocking render
  const [UserData, setUserData] = useState({});
  useEffect(() => {
    const readUserData = () => {
      try {
        const data = JSON.parse(localStorage.getItem("UserData") || "{}");
        setUserData(data);
      } catch {
        setUserData({});
      }
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(readUserData, { timeout: 0 });
    } else {
      setTimeout(readUserData, 0);
    }
  }, []);

  const userRole = useMemo(() => {
    return userDetail?.role || UserData?.role || "Client";
  }, [userDetail?.role, UserData?.role]);

  const userId = userDetail?.id;

  // PERF STARTUP: Defer sellerRating until after first paint - UI renders first
  useEffect(() => {
    if (userId) {
      const fetchRating = () => {
        dispatch(sellerRating(userId));
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(fetchRating, { timeout: 500 });
      } else {
        setTimeout(fetchRating, 0);
      }
    }
  }, [dispatch, userId]);

  // Calculate ratings - MEMOIZED to avoid recalculating on every render
  const ratingCalculations = useMemo(() => {
    if (!allRating || allRating.length === 0) {
      return {
        filterRating: [],
        overallAverageRating: 0,
        overallAverageFive: 0,
        overallAverageFour: 0,
        overallAverageThree: 0,
        filterRatingFive: [],
        filterRatingFour: [],
        filterRatingThree: []
      };
    }

    const filterRating = allRating.filter(
      (value) => value !== null && !isNaN(value)
    );
    const overallAverageRating = filterRating.length > 0
      ? parseInt(filterRating.reduce((acc, rating) => acc + rating, 0) / filterRating.length)
      : 0;

    const filterRatingFive = allRating.filter((value) => value === 5);
    const overallAverageFive = allRating.length ? (filterRatingFive.length / allRating.length) * 100 : 0;

    const filterRatingFour = allRating.filter((value) => value === 4);
    const overallAverageFour = allRating.length ? (filterRatingFour.length / allRating.length) * 100 : 0;

    const filterRatingThree = allRating.filter((value) => value === 3);
    const overallAverageThree = allRating.length ? (filterRatingThree.length / allRating.length) * 100 : 0;

    return {
      filterRating,
      overallAverageRating,
      overallAverageFive,
      overallAverageFour,
      overallAverageThree,
      filterRatingFive,
      filterRatingFour,
      filterRatingThree
    };
  }, [allRating]);

  const {
    overallAverageRating,
  } = ratingCalculations;

  // Role-based quick actions - MEMOIZED
  const getQuickActions = useMemo(() => {
    switch (userRole.toLowerCase()) {
      case "expert/freelancer":
        return [
          { label: "Create Gig", icon: <AiOutlineProject />, path: "/multiSteps" },
          { label: "Messages", icon: <AiOutlineMessage />, path: "/inbox" },
          { label: "Earnings", icon: <AiOutlineWallet />, path: "/earning" },
          { label: "Portfolio", icon: <AiOutlineTeam />, path: "/portfolio" }
        ];
      case "bd":
      case "bidder/company representative/middleman":
        return [
          { label: "New Lead", icon: <AiOutlineTeam />, path: "/userBuyerRequest" },
          { label: "Messages", icon: <AiOutlineMessage />, path: "/inbox" },
          { label: "Post BD Task", icon: <AiOutlineProject />, path: "/bd-tasks" },
          { label: "Performance", icon: <BiTrendingUp />, path: "/performance" }
        ];
      case "client":
      default:
        return [
          { label: "Post Project", icon: <AiOutlineProject />, path: "/buyerRequest" },
          { label: "Messages", icon: <AiOutlineMessage />, path: "/inbox" },
          { label: "My Projects", icon: <AiOutlineWallet />, path: "/order" },
          { label: "Find Talent", icon: <AiOutlineTeam />, path: "/freelancers" }
        ];
    }
  }, [userRole]);

  // Role-based metrics cards - MEMOIZED
  const getMetricsCards = useMemo(() => {
    if (!userStats) return [];

    switch (userRole.toLowerCase()) {
      case "expert/freelancer":
        return [
          { label: "Create Gig", icon: <AiOutlineProject />, path: "/multiSteps" },
          { label: "Messages", icon: <AiOutlineMessage />, path: "/inbox" },
          { label: "BD Tasks", icon: <AiOutlineTeam />, path: "/expert-bd-tasks" },
          { label: "Earnings", icon: <AiOutlineWallet />, path: "/earning" }
        ];
      case "bd":
      case "bidder/company representative/middleman":
        return [
          { title: "Response Time", value: `${userStats.avgResponseTime || 0}h`, icon: <BiTime />, trend: userStats.responseTrend || "up" },
          { title: "Lead Conversion", value: `${userStats.leadConversion || 0}%`, icon: <BiTrendingUp />, trend: userStats.conversionTrend || "up" },
          { title: "Client Satisfaction", value: `${userStats.clientSatisfaction || 0}/5`, icon: <AiFillStar />, trend: userStats.satisfactionTrend || "up" },
          { title: "New Contacts", value: userStats.newContacts || 0, icon: <AiOutlineTeam />, trend: userStats.contactsTrend || "up" }
        ];
      case "client":
      default:
        return [
          { title: "Avg. Project Cost", value: `$${userStats.avgProjectCost || 0}`, icon: <AiOutlineWallet />, trend: userStats.costTrend || "steady" },
          { title: "Project Completion", value: `${userStats.projectCompletion || 0}%`, icon: <AiOutlineProject />, trend: userStats.completionTrend || "up" },
          { title: "Freelancer Rating", value: `${userStats.freelancerRating || 0}/5`, icon: <AiFillStar />, trend: userStats.ratingTrend || "up" },
          { title: "Active Contracts", value: userStats.activeContracts || 0, icon: <AiOutlineTeam />, trend: userStats.contractsTrend || "up" }
        ];
    }
  }, [userRole, userStats]);

  // Event handlers - MEMOIZED to prevent re-renders
  const handleRatingsTab = useCallback(() => setActiveTab('ratings'), []);
  const handleAnalyticsTab = useCallback(() => setActiveTab('analytics'), []);
  const handleActionClick = useCallback((path) => navigate(path), [navigate]);

  return (
    <div className="gt-dark-dashboard">
      <Navbar FirstNav="none" />

      <div className="container-fluid pt-5 gt-main-bg">
        
        {/* MASSIVE PROFILE HEADER MOVED TO TOP FOR COHESIVE DESIGN */}
        <DetailsOnboard />

        <div className="row mx-lg-4 mx-md-3 mx-xm-3 mx-2 mt-2 flex-column-reverse flex-lg-row">
          
          {/* Main Content Area (Left Column - LinkedIn Style) */}
          <div className="col-lg-8 col-12 mt-lg-0 mt-4">
            
            {/* Quick Actions Section */}
            <div className="card mb-4 border-0 shadow-none gt-card">
              <div className="card-body p-lg-4 p-3">
                <h5 className="card-title mb-4 gt-text-white fw-bold">Quick Actions</h5>
                <div className="row g-2">
                  {getQuickActions.map((action) => (
                    <div key={action.path} className="col-6 col-md-3 mb-2">
                      <div 
                        className="text-center p-3 p-md-4 rounded-4 cursor-pointer gt-quick-action h-100"
                        onClick={() => handleActionClick(action.path)}
                      >
                        <div className="fs-3 mb-2 mb-md-3" style={{ color: '#f0591f' }}>{action.icon}</div>
                        <div className="small fw-semibold gt-text-gray">{action.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* If Not Client, show extra metrics and tabs */}
            {userRole?.toLowerCase() !== "client" && (
              <>
                {/* Performance Metrics */}
                <div className="row g-2 mb-4">
                  {getMetricsCards.map((metric) => (
                    <div key={metric.title} className="col-6 col-md-6 col-lg-3 mb-2">
                      <div className="card border-0 shadow-none h-100 gt-card p-2 p-md-3">
                        <div className="card-body p-2 p-md-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="rounded p-2" style={{ backgroundColor: 'rgba(240, 89, 31, 0.1)', color: '#f0591f' }}>
                              {metric.icon}
                            </div>
                            <span className="gt-trend-badge" style={{ 
                              color: metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ef4444' : '#f59e0b',
                              backgroundColor: metric.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : metric.trend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                            }}>
                              {metric.trend === 'up' ? '\u2191' : metric.trend === 'down' ? '\u2193' : '\u2192'}
                            </span>
                          </div>
                          <div className="mt-2 mt-md-3">
                            <h6 className="card-title mb-1 gt-text-gray font-14">{metric.title}</h6>
                            <h4 className="fw-bold gt-text-white mb-0">{metric.value}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Tabs */}
                <div className="overflow-auto pb-2">
                  <ul className="nav nav-tabs mb-4 gt-nav-tabs flex-nowrap" id="dashboardTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link ${activeTab === 'ratings' ? 'active' : ''}`}
                        onClick={handleRatingsTab}
                      >
                        <AiFillStar className="me-1" style={{ color: '#f0591f' }} /> Ratings & Reviews
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={handleAnalyticsTab}
                      >
                        <BiTrendingUp className="me-1" style={{ color: '#f0591f' }} /> Analytics
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content" id="dashboardTabContent">
                  {/* Ratings Tab */}
                  {activeTab === 'ratings' && (
                    <div className="tab-pane fade show active">
                      <div className="mt-4">
                        <h3 className="font-20 mt-4 cocon gt-text-white">Rating & Reviews</h3>

                        {/* ENTIRE REVIEWS SECTION WRAPPED IN ONE DARK CARD TO KILL WHITE BACKGROUND */}
                        <div className="Revie p-3 p-md-4 mt-4 gt-card rounded-4">
                          <div className="row align-items-center poppins">
                            <div className="col-lg-5 col-md-5 col-sm-6 col-12 pe-lg-4 text-center">
                                <div>
                                  {[...Array(5)].map((_, i) => (
                                    <AiFillStar 
                                      key={i} 
                                      size={30} 
                                      color={i < overallAverageRating ? "#f0591f" : "rgba(255, 255, 255, 0.1)"} 
                                    />
                                  ))}
                                </div>
                                <h3 className="mt-3 font-28 fw-bold gt-text-white">
                                  {overallAverageRating} out of 5
                                </h3>
                                <p className="mt-1 mb-0 gt-text-gray font-15">Top Rating</p>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt-lg-0 mt-4 border-start-lg border-secondary-subtle">
                              <div className="gig-rating-rewies ps-lg-4">
                                {[5, 4, 3].map((star) => {
                                  const filterRatingStar = allRating.filter((value) => value === star);
                                  const percentage = allRating?.length ? (filterRatingStar?.length / allRating?.length) * 100 : 0;

                                  return (
                                    <div key={star} className="row align-items-center mb-3">
                                      <div className="col-3">
                                        <p className="mb-0 font-14 fw-medium gt-text-gray">
                                          {star} Stars
                                        </p>
                                      </div>
                                      <div className="col-7">
                                        <div className="progress w-100 gt-progress-bg" style={{ height: "8px" }}>
                                          <div
                                            className="progress-bar gt-progress-bar"
                                            style={{ width: `${percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className="col-2 text-end">
                                        <span className="font-14 fw-medium gt-text-gray">
                                          {Math.round(percentage)}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reviews List Area */}
                        <div className="mt-5">
                          <h4 className="font-18 mb-4 cocon gt-text-white">Recent Feedback</h4>
                          {userRating?.length > 0 ? (
                            userRating.map((value, index) => (
                              <div className="mt-3 gt-card p-3 p-md-4 rounded-4" key={value.id ?? `review-${index}`}>
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img
                                      className="rounded-circle"
                                      src={value.user?.image || ""}
                                      width={45}
                                      height={45}
                                      alt="User"
                                      loading="lazy"
                                      style={{ border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover' }}
                                      onError={(e) => e.target.src = '/default-avatar.png'}
                                    />
                                    <p className="ms-3 font-16 fw-bold gt-text-white mb-0">
                                      {value.user?.fname || "Anonymous"}
                                    </p>
                                  </div>
                                </div>
                                <p className="mb-0 font-15 mt-3 gt-text-gray text-capitalize" style={{ lineHeight: '1.6' }}>
                                  {value.comments}
                                </p>
                                <div className="d-flex justify-content-end align-items-center mt-3">
                                  <img src={timepes} width={14} height={14} alt="time" style={{ opacity: 0.5 }} />
                                  <p className="font-13 ms-2 fw-medium gt-text-muted mb-0">
                                    {value.created_at
                                      ? formatDistanceToNow(new Date(value.created_at), { addSuffix: true })
                                      : ''}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-5 gt-card rounded-4">
                               <p className="gt-text-gray font-15 mb-0">No reviews yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div className="tab-pane fade show active">
                      <h5 className="mb-4 mt-2 gt-text-white fw-bold">Performance Analytics</h5>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <div className="card border-0 shadow-none h-100 gt-card">
                            <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0">
                              <h6 className="mb-0 gt-text-white fw-bold">Earnings Overview</h6>
                            </div>
                            <div className="card-body">
                              <div className="chart-placeholder rounded-3" style={{height: '250px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)'}}>
                                <div className="d-flex align-items-center justify-content-center h-100 gt-text-muted font-14">
                                  Earnings chart visualization
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="card border-0 shadow-none h-100 gt-card">
                            <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0">
                              <h6 className="mb-0 gt-text-white fw-bold">Engagement Metrics</h6>
                            </div>
                            <div className="card-body">
                              <div className="chart-placeholder rounded-3" style={{height: '250px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)'}}>
                                <div className="d-flex align-items-center justify-content-center h-100 gt-text-muted font-14">
                                  Engagement metrics chart
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card border-0 shadow-none gt-card mb-4">
                        <div className="card-header bg-transparent pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <h6 className="mb-0 gt-text-white fw-bold">Recent Performance</h6>
                        </div>
                        <div className="card-body px-0 pb-0">
                          <div className="table-responsive">
                            <table className="table gt-dark-table mb-0">
                              <thead>
                                <tr>
                                  <th scope="col" className="gt-text-muted font-14 ps-4">Metric</th>
                                  <th scope="col" className="gt-text-muted font-14">Current</th>
                                  <th scope="col" className="gt-text-muted font-14">Previous</th>
                                  <th scope="col" className="gt-text-muted font-14 pe-4">Change</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="gt-text-gray ps-4">Response Rate</td>
                                  <td className="gt-text-white fw-medium">95%</td>
                                  <td className="gt-text-gray">89%</td>
                                  <td className="pe-4" style={{ color: '#10b981', fontWeight: 'bold' }}>+6%</td>
                                </tr>
                                <tr>
                                  <td className="gt-text-gray ps-4">Completed Projects</td>
                                  <td className="gt-text-white fw-medium">24</td>
                                  <td className="gt-text-gray">18</td>
                                  <td className="pe-4" style={{ color: '#10b981', fontWeight: 'bold' }}>+6</td>
                                </tr>
                                <tr>
                                  <td className="gt-text-gray ps-4">Client Satisfaction</td>
                                  <td className="gt-text-white fw-medium">4.8/5</td>
                                  <td className="gt-text-gray">4.6/5</td>
                                  <td className="pe-4" style={{ color: '#10b981', fontWeight: 'bold' }}>+0.2</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Dashboardright component (LinkedIn Style) */}
          <div className="col-lg-4 col-12">
            <Dashboardright />
          </div>
        </div>
      </div>

      <div className="container-fluid p-lg-5 p-md-4 p-3 mt-lg-2 mt-md-2 mt-2 gt-main-bg">
        <div className="mx-lg-4 mx-md-3 mx-0">
          <img src={bannerimg} className="w-100 rounded-4" style={{ border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }} alt="Promotional Banner" loading="lazy" decoding="async" />
        </div>
      </div>

      <Footer />

      <style>{`
        .gt-dark-dashboard {
          background-color: #020617; 
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #ffffff;
        }
        .gt-main-bg { background-color: transparent !important; }
        .gt-text-white { color: #ffffff !important; }
        .gt-text-gray { color: #d4d4d8 !important; }
        .gt-text-muted { color: #71717a !important; }
        .gt-card {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 28px !important;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .gt-card:hover {
          border-color: rgba(240, 89, 31, 0.4) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(240, 89, 31, 0.15);
        }
        .gt-quick-action {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .gt-quick-action:hover {
          background: #f0591f;
          border-color: #f0591f;
          transform: scale(1.05);
        }
        .gt-quick-action:hover .gt-text-gray,
        .gt-quick-action:hover .fs-3 {
          color: #ffffff !important;
        }
        .gt-trend-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          border: none;
        }
        .gt-nav-tabs {
          border: none;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          padding: 8px;
          border-radius: 20px;
          display: inline-flex;
          margin-bottom: 2rem !important;
        }
        .gt-nav-tabs .nav-link {
          color: #a1a1aa !important;
          border: none;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 14px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .gt-nav-tabs .nav-link:hover { color: #ffffff !important; }
        .gt-nav-tabs .nav-link.active {
          background: rgba(255, 255, 255, 0.06) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .gt-progress-bg { background: rgba(255, 255, 255, 0.06) !important; border-radius: 20px; height: 8px !important; }
        .gt-progress-bar { background: #f0591f !important; border-radius: 20px; }
        .gt-dark-table { color: #d4d4d8 !important; background: transparent !important; }
        .gt-dark-table th {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
          padding: 20px 16px;
          font-weight: 800;
          font-size: 13px;
          color: #a1a1aa !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: transparent !important;
        }
        .gt-dark-table td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
          padding: 20px 16px;
          font-weight: 600;
          font-size: 15px;
          color: #ffffff !important;
          background: transparent !important;
        }
        .gt-dark-table tr:hover td { background: rgba(255, 255, 255, 0.04) !important; color: #ffffff !important; }
        .gt-dark-table tbody tr:last-child td { border-bottom: none !important; }
        @media (max-width: 768px) {
          .gt-card { border-radius: 20px !important; }
          .gt-quick-action { padding: 12px 8px !important; border-radius: 16px; }
          .gt-quick-action .fs-3 { font-size: 1.5rem !important; }
          .gt-nav-tabs { gap: 8px; padding: 6px; border-radius: 16px; overflow-x: auto; flex-wrap: nowrap; width: 100%; }
          .gt-nav-tabs .nav-link { font-size: 13px; padding: 10px 16px; border-radius: 12px; }
          .gt-trend-badge { padding: 4px 8px; font-size: 11px; }
          .gt-dark-table th, .gt-dark-table td { padding: 12px 10px; font-size: 13px; }
          .gt-dark-table th { font-size: 11px; }
        }
        @media (max-width: 480px) {
          .gt-card { border-radius: 16px !important; }
          .gt-quick-action { padding: 10px 6px !important; border-radius: 14px; }
          .gt-quick-action .fs-3 { font-size: 1.3rem !important; }
          .gt-quick-action .small { font-size: 11px !important; }
          .gt-nav-tabs .nav-link { font-size: 12px; padding: 8px 12px; }
          .gt-dark-table th, .gt-dark-table td { padding: 10px 8px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(Dashboard);