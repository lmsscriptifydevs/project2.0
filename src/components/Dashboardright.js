import { Autocomplete, Button, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, ProgressBar } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Required for proper rendering
import { BsFillPencilFill } from "react-icons/bs";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import doubl from "../assets/tick.png";
import emptyProfile from "../assets/emptyProfileModal.webp";
import pen from "../assets/pen.webp";
import { addUserTag, fetchUserActivities, fetchUserStats, fetchUserTags } from "../redux/slices/dashboardSlice";
import { profileUpdate, userProfile } from "../redux/slices/profileSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useUserData } from "../utils/useLocalStorage";

const Dashboardright = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.profile);
  const { tagsList, isLoading, userStats, activities, error } = useSelector((state) => state.dashboard);
  const UserData = useUserData();
  const userRole = userDetail?.role || UserData?.role || "Client";

  // 🚀 YAHAN NEW LOGIC ADD KI HAI UI DISPLAY KE LIYE
  const displayRole = useMemo(() => {
    const rawRole = userDetail?.role || UserData?.role || "Client";
    const lowerRole = rawRole.toLowerCase();

    // Agar API se BD ya lamba naam aaye toh "Business Developer" dikhaye
    if (lowerRole === "bidder/company representative/middleman" || lowerRole === "bd") {
      return "Business Developer";
    }
    // Agar Expert/Freelancer aaye toh usay "Freelancer" dikhaye
    if (lowerRole === "expert/freelancer") {
      return "Freelancer"; 
    }

    // Baqi sab (jaise Client) waise hi rahenge
    return rawRole; 
  }, [userDetail?.role, UserData?.role]);

  const { percentage1, percentage2, percentage3 } = useMemo(() => {
    if (!userStats) return { percentage1: 0, percentage2: 0, percentage3: 0 };
    const r = (userRole || "").toLowerCase();
    if (r === "expert/freelancer") {
      return {
        percentage1: userStats.projectSuccessRatio || 0,
        percentage2: userStats.totalOrders || 0,
        percentage3: userStats.completeOrders || 0,
      };
    }
    if (r === "bd" || r === "bidder/company representative/middleman") {
      return {
        percentage1: userStats.clientConversionRate || 0,
        percentage2: userStats.totalLeads || 0,
        percentage3: userStats.convertedLeads || 0,
      };
    }
    return {
      percentage1: userStats.projectsPosted || 0,
      percentage2: userStats.activeProjects || 0,
      percentage3: userStats.completedProjects || 0,
    };
  }, [userStats, userRole]);

 // ---------- Name Update -----------
  const [firstName, setFirstName] = useState("");
  const handleNameSubmit = (e) => {
    e.preventDefault();
    let data = {
      fname: firstName,
    };
    dispatch(profileUpdate(data, handleResponse));
  };
  const handleResponse = (data) => {
    if (data?.status) {
      // Handle success (e.g., toast notification)
    } else {
      // Handle error
    }
  };

  // Check if the API calls are being made
  useEffect(() => {
    dispatch(userProfile({ device_token: "123456789" }));
    dispatch(fetchUserStats()).catch(() => {});
    dispatch(fetchUserActivities()).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (userDetail) {
      setFirstName(userDetail.fname);
    }
  }, [userDetail]);

  // ------------- Skills Section -------------
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState([]);
  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const tagsAddCancelledRef = useRef(false);
  useEffect(() => {
    tagsAddCancelledRef.current = false;
    return () => { tagsAddCancelledRef.current = true; };
  }, []);

  const handleTagsAdd = (e) => {
    e.preventDefault();

    if (!tags || tags.length === 0) {
      setShowModal(false);
      return;
    }

    setShowModal(false);

    const requestData = { skill: tags };

    dispatch(addUserTag({ data: requestData }))
      .unwrap()
      .then(() => {
        if (tagsAddCancelledRef.current) return;
        dispatch(fetchUserTags());
      })
      .catch((error) => {
        if (tagsAddCancelledRef.current) return;
        console.error('Failed to add skills:', error);
      });
  };

  const handleResponseTagsAdd = (data) => {
    if (data?.status) {
      // Optionally handle success
    } else {
      // Optionally handle error
    }
  };

  // PERF STARTUP: Defer fetchUserTags until after first paint - UI renders first
  useEffect(() => {
    if (userRole.toLowerCase() === "expert/freelancer" || userRole.toLowerCase() === "bidder/company representative/middleman") {
      const fetchTags = () => {
        dispatch(fetchUserTags());
      };

      // PERF: Defer API call until after first paint
      if ('requestIdleCallback' in window) {
        requestIdleCallback(fetchTags, { timeout: 500 });
      } else {
        setTimeout(fetchTags, 0);
      }
    }
  }, [dispatch, userRole]);

  useEffect(() => {
    // Extract skill names from tagsList
    const skillArray = tagsList.map((val) => val.skill);
    setTags(skillArray);
  }, [tagsList]);

  // PERF: compute once on mount – "Earned in" / "Spent in" labels don't need midnight updates
  const currentMonth = useMemo(
    () => new Date().toLocaleString("default", { month: "long" }),
    []
  );

  // ----------- User Level Display Component -----------
  const UserLevelDisplayComponent = ({ userDetail, userRole }) => {
    // Different level systems based on role
    const getLevelData = () => {
      const role = userRole.toLowerCase();
      const userLevel = userDetail?.level || "New";

      switch (role) {
        case "expert/freelancer":
          const freelancerLevelMap = {
            "New": { percent: 0, color: "secondary" },
            "Level 1": { percent: 25, color: "info" },
            "Level 2": { percent: 50, color: "primary" },
            "Level 3": { percent: 75, color: "warning" },
            "Top Rated": { percent: 100, color: "success" },
          };
          return freelancerLevelMap[userLevel] || { percent: 0, color: "secondary" };

        case "bd":
        case "bidder/company representative/middleman":
          const bdLevelMap = {
            "New": { percent: 0, color: "secondary" },
            "Junior BD": { percent: 30, color: "info" },
            "Senior BD": { percent: 60, color: "primary" },
            "BD Manager": { percent: 90, color: "warning" },
            "BD Director": { percent: 100, color: "success" },
          };
          return bdLevelMap[userLevel] || { percent: 0, color: "secondary" };

        case "client":
        default:
          const clientLevelMap = {
            "New": { percent: 0, color: "secondary" },
            "Verified": { percent: 50, color: "primary" },
            "Premium": { percent: 100, color: "success" },
          };
          return clientLevelMap[userLevel] || { percent: 0, color: "secondary" };
      }
    };

    const { percent, color } = getLevelData();
    const userLevel = userDetail?.level || "New";

    return (
      <div className="d-flex align-items-center justify-content-center w-100">
        <Badge bg={color} className="me-3" style={{ fontSize: "14px", padding: "6px 12px", borderRadius: "8px" }}>
          {userLevel}
        </Badge>
        <ProgressBar
          now={percent}
          label={`${percent}%`}
          variant={color}
          className="flex-grow-1"
          style={{ height: "12px", fontSize: "10px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)" }}
        />
      </div>
    );
  };

  // Role-based progress bar labels
  const getProgressLabels = () => {
    switch (userRole.toLowerCase()) {
      case "expert/freelancer":
        return {
          label1: "Project Success Ratio",
          label2: "Total Orders",
          label3: "Complete Orders"
        };
      case "bd":
      case "bidder/company representative/middleman":
        return {
          label1: "Client Conversion Rate",
          label2: "Total Leads",
          label3: "Converted Leads"
        };
      case "client":
      default:
        return {
          label1: "Projects Posted",
          label2: "Active Projects",
          label3: "Completed Projects"
        };
    }
  };

  const { label1, label2, label3 } = getProgressLabels();

  // Role-based orders section with real data
  const renderOrdersSection = () => {
    if (!userStats) {
      return <div className="text-center py-4 gt-text-muted">Loading metrics...</div>;
    }

    switch (userRole.toLowerCase()) {
      case "expert/freelancer":
        return (
          <div className="mt-4">
            <h6 className="font-18 font-600 poppins gt-text-white mb-3 text-start">Order Overview</h6>
            <div className="gt-card p-4 rounded-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Active orders</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">{userStats.activeOrders || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Earned in {currentMonth}</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">${userStats.monthlyEarnings || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Total Earnings</p>
                <p className="font-16 font-600 poppins gt-text-orange mb-0">${userStats.totalEarnings || 0}</p>
              </div>
            </div>
          </div>
        );

      case "bd":
      case "bidder/company representative/middleman":
        return (
          <div className="mt-4">
            <h6 className="font-18 font-600 poppins gt-text-white mb-3 text-start">Performance</h6>
            <div className="gt-card p-4 rounded-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Active Leads</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">{userStats.activeLeads || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Conversions in {currentMonth}</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">{userStats.monthlyConversions || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Revenue Generated</p>
                <p className="font-16 font-600 poppins gt-text-orange mb-0">${userStats.revenueGenerated || 0}</p>
              </div>
            </div>
          </div>
        );

      case "client":
      default:
        return (
          <div className="mt-4">
            <h6 className="font-18 font-600 poppins gt-text-white mb-3 text-start">Projects</h6>
            <div className="gt-card p-4 rounded-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Active Projects</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">{userStats.activeProjects || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Spent in {currentMonth}</p>
                <p className="font-16 font-600 poppins gt-text-white mb-0">${userStats.monthlySpent || 0}</p>
              </div>
              <hr className="gt-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <p className="font-15 font-500 poppins gt-text-muted mb-0">Total Projects</p>
                <p className="font-16 font-600 poppins gt-text-orange mb-0">{userStats.totalProjects || 0}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Render activities with real data
 const renderActivities = () => {
  if (!activities || activities.length === 0) {
    return (
      <div className="d-flex rounded-4 px-3 mt-3 p-3 align-items-center gt-activity-card">
        <div>
          <img src={doubl} width={40} height={40} alt="Activity" loading="lazy" decoding="async" style={{ filter: 'brightness(0.8)' }} />
        </div>
        <div>
          <h6 className="ms-3 font-14 poppins mb-0 gt-text-muted">
            No Activities Found :)
          </h6>
        </div>
      </div>
    );
  }

      return activities.slice(0, 3).map((activity, index) => (
        <div
          key={activity.id ? activity.id : `act-${index}`} 
          className="d-flex rounded-4 px-3 mt-3 p-3 align-items-start gt-activity-card"
        >
      <div className="flex-shrink-0 pt-1">
        <img src={doubl} width={35} height={35} alt="tick" loading="lazy" decoding="async" />
      </div>
      <div className="ms-3 text-start">
        <h6
          className="font-14 poppins mb-2 gt-text-white"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3, 
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
            lineHeight: "1.5"
          }}
        >
          {activity.description}
        </h6>
        <p className="font-12 poppins gt-text-muted mb-0 fw-medium">
          {new Date(activity.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  ));
};


  // Role-based skills section visibility
  const shouldShowSkillsSection = () => {
    return userRole.toLowerCase() === "expert/freelancer" || userRole.toLowerCase() === "bidder/company representative/middleman";
  };

  // Role-based modal title and placeholder
  const getModalContent = () => {
    switch (userRole.toLowerCase()) {
      case "expert/freelancer":
        return {
          title: "Write your professional title",
          placeholder: "e.g. Full Stack Developer",
          description: "Express your expertise and attract the right clients. Write your professional title here and showcase your skills."
        };
      case "bd":
      case "bidder/company representative/middleman":
        return {
          title: "Write your business role",
          placeholder: "e.g. Senior Business Development Manager",
          description: "Define your business development role and expertise. This helps clients and team members understand your capabilities."
        };
      case "client":
      default:
        return {
          title: "Write your display name",
          placeholder: "Company Name or Your Name",
          description: "Express your identity and personalize your presence. This name will be visible to freelancers and service providers."
        };
    }
  };

  const { title: modalTitle, placeholder: modalPlaceholder, description: modalDescription } = getModalContent();

  return (
    <>
      {/* 🚀 ABSOLUTE NEW LOOK: GRAPETASK THEME MODERN DARK UI 🚀 */}
      <style>{`
        .gt-dashboard-right-wrapper {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #ffffff;
        }

        .gt-text-white { color: #ffffff !important; }
        .gt-text-gray { color: #d4d4d8 !important; } 
        .gt-text-muted { color: #71717a !important; } 
        .gt-text-orange { color: #f0591f !important; }

        /* BENTO BOX CARDS */
        .gt-card {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 28px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .gt-card:hover {
          border-color: rgba(240, 89, 31, 0.4) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(240, 89, 31, 0.15);
        }

        /* BENTO ACTIVITY CARDS */
        .gt-activity-card {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 20px !important;
          transition: all 0.3s ease;
        }
        .gt-activity-card:hover {
          border-color: rgba(240, 89, 31, 0.4) !important;
          background: rgba(240, 89, 31, 0.05) !important;
          transform: scale(1.02);
        }

        /* DIVIDERS */
        .gt-divider {
          border-color: rgba(255, 255, 255, 0.06) !important;
          margin: 20px 0;
        }

        /* BENTO SKILL PILLS */
        .gt-tag-pill {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #d4d4d8;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .gt-tag-pill:hover {
          background: #f0591f;
          color: #ffffff;
          border-color: #f0591f;
          transform: translateY(-2px);
        }

        /* MODALS */
        .gt-dark-modal .modal-content {
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 28px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
        }
        .gt-dark-modal .modal-header, .gt-dark-modal .modal-footer { border-color: rgba(255, 255, 255, 0.06); }
        .gt-dark-modal .btn-close { filter: invert(1) opacity(0.7); }

        .gt-dark-input {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 16px !important;
          color: #ffffff !important;
        }
        .gt-dark-input:focus { border-color: #f0591f !important; }

        /* BUTTONS */
        .gt-btn-primary {
          background: #f0591f !important;
          color: #ffffff !important;
          border-radius: 14px !important;
          font-weight: 700 !important;
        }
        .gt-btn-outline {
          background-color: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 14px !important;
          color: #d4d4d8 !important;
        }
        
        .MuiAutocomplete-root .MuiOutlinedInput-root {
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* ─── RESPONSIVE FIXES ─── */
        @media (max-width: 768px) {
          .gt-dashboard-right-wrapper .gt-card { padding: 16px !important; border-radius: 20px !important; }
          .gt-dashboard-right-wrapper .gt-card p { font-size: 13px !important; }
          .gt-dashboard-right-wrapper .gt-card h6 { font-size: 15px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card { padding: 12px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card h6 { font-size: 12px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card p { font-size: 11px !important; }
          .gt-dashboard-right-wrapper .gt-tag-pill { padding: 6px 12px !important; font-size: 12px !important; }
          .gt-dashboard-right-wrapper .gt-btn-primary,
          .gt-dashboard-right-wrapper .gt-btn-outline { font-size: 13px !important; padding: 8px 16px !important; }
        }
        @media (max-width: 480px) {
          .gt-dashboard-right-wrapper .gt-card { padding: 12px !important; border-radius: 16px !important; }
          .gt-dashboard-right-wrapper .gt-card p { font-size: 12px !important; }
          .gt-dashboard-right-wrapper .gt-card h6 { font-size: 14px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card { padding: 10px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card h6 { font-size: 11px !important; }
          .gt-dashboard-right-wrapper .gt-activity-card p { font-size: 10px !important; }
          .gt-dashboard-right-wrapper .gt-tag-pill { padding: 5px 10px !important; font-size: 11px !important; }
          .gt-dashboard-right-wrapper .gt-btn-primary,
          .gt-dashboard-right-wrapper .gt-btn-outline { font-size: 12px !important; padding: 6px 12px !important; }
        }
      `}</style>

      <div className="container gt-dashboard-right-wrapper">
        <div className="row">
          <div className="col-12 px-2">

            {/* ================== Profile Section ================== */}
            <div className="text-center pt-4">
              {/* REMOVED REDUNDANT PROFILE PICTURE & NAME BECAUSE IT IS NOW IN THE MAIN HEADER */}
              
              <div className="mt-2 d-flex justify-content-center align-items-center">
                <a
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  className="text-decoration-none d-flex align-items-center w-100 justify-content-between p-3 rounded-4"
                  style={{ background: "rgba(240, 89, 31, 0.1)", border: "1px dashed rgba(240, 89, 31, 0.3)" }}
                >
                  <h6 className="font-16 font-600 poppins gt-text-orange mb-0">
                    Edit Basic Info
                  </h6>
                  <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '28px', height: '28px', backgroundColor: '#f0591f' }}>
                    <img
                      src={pen}
                      width={14}
                      height={14}
                      alt="Edit"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                </a>
              </div>

              {/* Circular Progress Bars */}
              <div className="d-flex justify-content-between mt-5 mb-4 gap-2">
                <div className="text-center" style={{ width: '30%' }}>
                  <div className="mx-auto mb-3" style={{ width: '75%', maxWidth: '90px' }}>
                    <CircularProgressbar
                      value={percentage1}
                      text={`${percentage1}%`}
                      styles={buildStyles({
                        textColor: "#ffffff",
                        pathColor: "#f0591f",
                        trailColor: "rgba(255, 255, 255, 0.06)",
                        textSize: "22px",
                        pathTransitionDuration: 0.5
                      })}
                    />
                  </div>
                  <h6 className="font-13 poppins gt-text-muted fw-medium lh-base">
                    {label1}
                  </h6>
                </div>
                <div className="text-center" style={{ width: '30%' }}>
                  <div className="mx-auto mb-3" style={{ width: '75%', maxWidth: '90px' }}>
                    <CircularProgressbar
                      value={percentage2}
                      text={`${percentage2}%`}
                      styles={buildStyles({
                        textColor: "#ffffff",
                        pathColor: "#f0591f",
                        trailColor: "rgba(255, 255, 255, 0.06)",
                        textSize: "22px",
                        pathTransitionDuration: 0.5
                      })}
                    />
                  </div>
                  <h6 className="font-13 poppins gt-text-muted fw-medium lh-base">
                    {label2}
                  </h6>
                </div>
                <div className="text-center" style={{ width: '30%' }}>
                  <div className="mx-auto mb-3" style={{ width: '75%', maxWidth: '90px' }}>
                    <CircularProgressbar
                      value={percentage3}
                      text={`${percentage3}%`}
                      styles={buildStyles({
                        textColor: "#ffffff",
                        pathColor: "#f0591f",
                        trailColor: "rgba(255, 255, 255, 0.06)",
                        textSize: "22px",
                        pathTransitionDuration: 0.5
                      })}
                    />
                  </div>
                  <h6 className="font-13 poppins gt-text-muted fw-medium lh-base">
                    {label3}
                  </h6>
                </div>
              </div>

              {/* Last Activities Section */}
              <div className="mt-5 text-start">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="font-18 font-600 poppins gt-text-white mb-0">
                    Recent Activities
                  </h6>
                  <p className="font-14 fw-bold poppins gt-text-orange mb-0" style={{ cursor: 'pointer' }}>See All</p>
                </div>
                <div className="d-flex flex-column gap-2">
                  {renderActivities()}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================== Skills Section ================== */}
        {shouldShowSkillsSection() && (
          <div className="mt-5">
            <h6 className="font-18 font-600 poppins gt-text-white mb-3 text-start">
              {userRole.toLowerCase() === "expert/freelancer" ? "Skills" : "Expertise Areas"}
            </h6>
            <div className="gt-card p-4 rounded-4 position-relative">
              <div className="position-absolute top-0 end-0 mt-3 me-3">
                <button
                  type="button"
                  className="font-14 poppins fw-bold border-0 gt-text-orange d-flex align-items-center gap-2"
                  onClick={toggleModal}
                  style={{ backgroundColor: "transparent" }}
                >
                  <BsFillPencilFill size={12} /> Edit
                </button>
              </div>

              <Modal className="poppins gt-dark-modal modal-dialog-centered" isOpen={showModal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal} className="font-18 fw-bold">
                  {userRole.toLowerCase() === "expert/freelancer" ? "Manage Skills" : "Manage Expertise Areas"}
                </ModalHeader>
                <form>
                  <ModalBody className="p-4">
                    <p className="font-14 gt-text-muted mb-4">
                      Add relevant tags to help clients understand your core strengths.
                    </p>
                    <div className="form-group">
                      <div className="devices-tag-add">
                        <Autocomplete
                          multiple
                          id="tags"
                          options={[]}
                          freeSolo
                          value={tags}
                          onChange={(e, newValue) => {
                            setTags(newValue.slice(0, 5));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder={userRole.toLowerCase() === "expert/freelancer" ? "Type skill & hit enter..." : "Type expertise & hit enter..."}
                            />
                          )}
                        />
                      </div>
                      <small className="gt-text-muted d-block mt-2 font-12">Maximum 5 tags allowed.</small>
                    </div>
                  </ModalBody>
                  <ModalFooter className="p-3 border-0 bg-transparent">
                    <Button
                      className="gt-btn-outline px-4 py-2 font-14"
                      onClick={toggleModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleTagsAdd}
                      disabled={isLoading}
                      className="gt-btn-primary px-4 py-2 font-14 ms-2"
                    >
                      {isLoading ? <Spinner size="sm" color="light" /> : "Save Changes"}
                    </Button>
                  </ModalFooter>
                </form>
              </Modal>

              <div className="d-flex flex-wrap gap-2 mt-4">
                {tagsList && tagsList.length > 0 ? (
                  tagsList.map((value, index) => (
                    <span
                      className="poppins px-3 py-2 rounded-5 gt-tag-pill d-inline-flex align-items-center"
                      key={value.skill ?? `tag-${index}`}
                    >
                      <span className="mb-0 font-13 fw-medium">{value.skill}</span>
                    </span>
                  ))
                ) : (
                  <p className="font-14 gt-text-muted mb-0">No tags added yet. Click edit to add.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================== Role-based Orders/Performance/Projects Section ================== */}
        {renderOrdersSection()}
      </div>

      {/* ================== Profile Update Modal (Bootstrap Native) ================== */}
      <div
        className="modal fade gt-dark-modal"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleNameSubmit} className="modal-content">
            <div className="modal-header border-0 pt-4 px-4">
               <h5 className="font-20 font-bold poppins gt-text-white mb-0">
                {modalTitle}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body px-4 pb-2">
              <p className="font-14 gt-text-muted poppins mb-4">
                {modalDescription}
              </p>
              <input
                className="form-control gt-dark-input p-3 rounded-3 font-15"
                type="text"
                placeholder={modalPlaceholder}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="modal-footer border-0 px-4 pb-4 pt-3">
              <Button
                className="gt-btn-outline poppins me-2 px-4 py-2 font-15"
                data-bs-dismiss="modal"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-bs-dismiss="modal"
                className="gt-btn-primary poppins px-4 py-2 font-15"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Dashboardright;