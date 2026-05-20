import pLimit from "p-limit";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// MUI Components
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownload from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Assets & Utils
import DefaultImage from "../../assets/default.webp";
import search from "../../assets/searchbar.webp";
import {
  AllBdOrders,
  AllClientOrders,
  AllExpertOrders,
  OrderComplete,
  OrderSubmit,
  ReviewSubmit,
} from "../../redux/slices/allOrderSlice";
import { downloadAuthenticatedFile } from "../../redux/slices/messageSlice";
import axios from "../../utils/axios";
import Navbar from "../Navbar";

// Constants
const CHUNK_SIZE = 2 * 1024 * 1024;
const CONCURRENCY_LIMIT = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
  "application/x-rar-compressed",
];

// Order flow: Expert delivers → BD checks & if fulfilled sends to Client → Client checks & if approved receives order (complete).
// Reviews: Client reviews first (quality of work + BD). BD and Expert can review only after client has reviewed (BD: rate Client + Expert communication; Expert: rate BD + Client communication).
// Payment: Client pays developer (BD) then expert (handled by backend).
const STATUS_CONFIG = {
  groups: {
    Active: new Set([
      "active",
      "project started",
      "revision_requested",
      "in revision",
      "submitted_to_bd",
      "expert_assigned",
      "accepted",
      "bd_revision_requested",
      "awaiting_files",
        "pending acceptance",
    ]),
    Delivered: new Set(["delivered", "submitted", "submitted_to_bd"]),
    Completed: new Set(["completed"]),
    "Pending Verification": new Set([
      "pending_verification",
      "under_review",
      "pending",
      "pending acceptance",
    ]),
    Disputed: new Set(["disputed", "Disputed".toLowerCase()]),
    Cancelled: new Set(["cancelled", "rejected"]),
  },
  display: {
    // Active tab
    active: "Active",
    "project started": "In Progress",
    revision_requested: "Revision Requested",
    "in revision": "In Revision",
    submitted_to_bd: "Submitted to BD",
    expert_assigned: "Expert Assigned",

    // Delivered tab
    delivered: "Delivered",
    submitted: "Submitted",

    // Completed tab
    completed: "Completed",
    accepted: "Accepted",

    // Pending Verification tab
    pending_verification: "Pending Verification",
    under_review: "Under Review",
    pending: "Pending",

    // Disputed tab
    disputed: "Disputed",

    // Cancelled tab
    cancelled: "Cancelled",
    rejected: "Rejected",
    awaiting_files: "Awaiting Files",       // ✅ ADD
      "pending acceptance": "Pending Payment", // ✅ ADD
  },
  badgeClasses: {
    active: "bg-primary",
    "project started": "bg-primary",
    revision_requested: "bg-warning text-dark",
    "in revision": "bg-warning text-dark",
    submitted_to_bd: "bg-info text-dark",
    expert_assigned: "bg-primary",
    delivered: "bg-success",
    submitted: "bg-info text-dark",
    completed: "bg-success",
    accepted: "bg-success",
    pending_verification: "bg-warning text-dark",
    under_review: "bg-warning text-dark",
    pending: "bg-warning text-dark",
    disputed: "bg-danger",
    cancelled: "bg-secondary",
    rejected: "bg-secondary",
    awaiting_files: "bg-info text-dark",     // ✅ ADD
    "pending acceptance": "bg-warning text-dark", // ✅ ADD
  },
};

// Custom Hooks
// PERF STARTUP: Non-blocking user data hook - reads after first paint
const useUserData = () => {
  const [userData, setUserData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const readUserData = () => {
      try {
        const data = JSON.parse(localStorage.getItem("UserData") || "{}");
        console.log("🟢 Current user data:", data);
        setUserData(data);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setUserData({});
      } finally {
        setIsLoaded(true);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(readUserData, { timeout: 0 });
    } else {
      setTimeout(readUserData, 0);
    }
  }, []);

  return isLoaded ? userData : {};
};

const useOrdersData = (user) => {
  const dispatch = useDispatch();
  const { expertOrders, clientOrders, bdOrders, isLoading, getError } =
    useSelector((state) => state.allOrder);

  // Debug logging
  useEffect(() => {
    console.log("🔵 User role:", user?.role);
    console.log("🔵 User ID:", user?.id);
    console.log("🔵 Expert orders:", expertOrders?.length);
    console.log("🔵 Client orders:", clientOrders?.length);
    console.log("🔵 BD orders:", bdOrders?.length);
  }, [expertOrders, clientOrders, bdOrders, user?.role, user?.id]);

  useEffect(() => {
    if (!user?.role) {
      console.log("❌ No user role found");
      return;
    }

    const isExpert =
      user.role === "expert/freelancer" ||
      user.role === "seller" ||
      user.role === "expert";
    const fetchData = async () => {
      try {
        console.log("🟡 Fetching orders for role:", user.role);
        if (isExpert) {
          console.log("🟡 Dispatching AllExpertOrders");
          await dispatch(AllExpertOrders()).unwrap();
        } else if (user.role === "Client") {
          console.log("🟡 Dispatching AllClientOrders for client_id:", user.id);
          await dispatch(AllClientOrders({ client_id: user.id })).unwrap();
        } else if (user.role === "bidder/company representative/middleman") {
          console.log("🟡 Dispatching AllBdOrders");
          await dispatch(AllBdOrders()).unwrap();
        }
        console.log("✅ Orders fetched successfully");
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        toast.error(error.message || "Failed to load orders");
      }
    };

    fetchData();
  }, [dispatch, user?.role, user?.id]);

  const isExpertRole =
    user?.role === "expert/freelancer" ||
    user?.role === "seller" ||
    user?.role === "expert";
  return useMemo(() => {
    if (isExpertRole) {
      console.log("🔴 Returning expert orders:", expertOrders?.length);
      return { orders: expertOrders || [], isLoading, getError };
    }
    if (user?.role === "Client") {
      console.log("🔴 Returning client orders:", clientOrders?.length);
      return { orders: clientOrders || [], isLoading, getError };
    }
    if (user?.role === "bidder/company representative/middleman") {
      console.log("🔴 Returning BD orders:", bdOrders?.length);
      return { orders: bdOrders || [], isLoading, getError };
    }
    console.log("❌ No matching role, returning empty orders");
    return { orders: [], isLoading: false, getError: null };
  }, [
    user?.role,
    isExpertRole,
    expertOrders,
    clientOrders,
    bdOrders,
    isLoading,
    getError,
  ]);
};

// Optimized DownloadAttachments Component
const DownloadAttachments = React.memo(({ offer, hasDeliveryAttachment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  const attachments = useMemo(() => offer?.delivery_attachments || [], [offer]);
  const multipleFiles = attachments.length > 1;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadFile = useCallback(
    async (file) => {
      try {
        toast.info(`Starting download: ${file.name}`, {
          autoClose: 2000,
          hideProgressBar: true,
        });

        const baseUrl = axios.defaults.baseURL ? axios.defaults.baseURL.replace(/\/api\/?$/, "") : "https://portal.grapetask.co";
        const cleanPath = file.path.startsWith("/") ? file.path.substring(1) : file.path;
        const directDownloadUrl = `${baseUrl}/${cleanPath}`;

        try {
          const response = await fetch(directDownloadUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        } catch (fetchError) {
          console.log("Fetch download failed (likely CORS), falling back to new tab:", fetchError);
          window.open(directDownloadUrl, "_blank");
        }
        
      } catch (error) {
        console.error("Download error:", error);
        toast.error(`Failed to download ${file.name}: ${error.message}`);
      }
    },
    [],
  );

  const handleDownloadAll = useCallback(async () => {
    if (!attachments.length) {
      toast.error("No files to download");
      return;
    }

    for (const file of attachments) {
      try {
        await downloadFile(file);
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Error downloading ${file.name}:`, error);
      }
    }
  }, [downloadFile, attachments]);

  const formatFileName = useCallback((name, maxLength = 30) => {
    if (!name || name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.slice(0, name.lastIndexOf("."));
    const truncated = nameWithoutExt.slice(0, maxLength - extension.length - 4);
    return `${truncated}...${extension}`;
  }, []);

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    const iconMap = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      txt: "📄",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      zip: "📦",
      rar: "📦",
    };
    return iconMap[ext] || "📄";
  };

  if (!hasDeliveryAttachment || !attachments.length) return null;

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Button
        ref={buttonRef}
        variant="outlined"
        size="small"
        startIcon={<FileDownload />}
        endIcon={
          multipleFiles ? (
            <ExpandMoreIcon
              sx={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          ) : null
        }
        onClick={() =>
          multipleFiles ? setIsOpen(!isOpen) : downloadFile(attachments[0])
        }
        sx={{
          borderColor: "#6B7280",
          color: "#374151",
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#F9FAFB",
            borderColor: "#9CA3AF",
            transform: "translateY(-1px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
          "&:active": { transform: "translateY(0px)" },
        }}
      >
        Download {multipleFiles ? "Files" : "File"}
      </Button>

      {multipleFiles && (
        <Paper
          ref={dropdownRef}
          sx={{
            display: isOpen ? "block" : "none",
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 1000,
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "250px",
            maxWidth: "350px",
            maxHeight: "300px",
            overflowY: "auto",
            padding: 0,
            animation: isOpen ? "slideDown 0.2s ease" : undefined,
          }}
        >
          <Box
            sx={{
              padding: "12px 16px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#374151" }}
            >
              {attachments.length} File{attachments.length > 1 ? "s" : ""}{" "}
              Available
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant="text"
                onClick={handleDownloadAll}
                sx={{
                  fontSize: "0.75rem",
                  textTransform: "none",
                  color: "#3B82F6",
                  "&:hover": { backgroundColor: "#EFF6FF" },
                }}
              >
                Download All
              </Button>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{
                  color: "#6B7280",
                  "&:hover": { backgroundColor: "#F3F4F6" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ padding: "8px 0" }}>
            {attachments.map((file, index) => (
              <Box
                key={`${file.name}-${index}`}
                component="button"
                onClick={() => downloadFile(file)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "10px 16px",
                  fontSize: "0.875rem",
                  color: "#374151",
                  backgroundColor: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": { backgroundColor: "#F9FAFB", color: "#1F2937" },
                  "&:focus": {
                    backgroundColor: "#EFF6FF",
                    outline: "2px solid #3B82F6",
                    outlineOffset: "-2px",
                  },
                }}
              >
                <span style={{ fontSize: "1.2rem", minWidth: "20px" }}>
                  {getFileIcon(file.name)}
                </span>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatFileName(file.name)}
                  </Typography>
                  {file.size && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#6B7280", display: "block" }}
                    >
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                  )}
                </Box>
                <FileDownload sx={{ fontSize: "1rem", color: "#9CA3AF" }} />
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
});

DownloadAttachments.displayName = "DownloadAttachments";

// ReviewModal: Only for Client — Step 1: Rate Expert, Step 2: Rate Business Developer
const ReviewModal = React.memo(
  ({
    open,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    isSubmitting,
    orderData,
  }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = ["Rate Expert", "Rate Business Developer"];

    const handleNext = useCallback(() => {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    }, [currentStep, steps.length]);

    const handleBack = useCallback(() => {
      if (currentStep > 0) setCurrentStep(currentStep - 1);
    }, [currentStep]);

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        currentStep === steps.length - 1 ? onSubmit(e) : handleNext();
      },
      [currentStep, steps.length, onSubmit, handleNext],
    );

    const isStepValid = useCallback(() => {
      if (currentStep === 0) {
        return (
          formData.expert_rating >= 1 &&
          formData.expert_rating <= 5 &&
          formData.expert_comment.trim().length > 0
        );
      }
      if (currentStep === 1) {
        return (
          formData.bd_rating >= 1 &&
          formData.bd_rating <= 5 &&
          formData.bd_comment.trim().length > 0
        );
      }
      return false;
    }, [currentStep, formData]);

    const renderRatingSection = useCallback(
      (type, title, person, ratingField, commentField, placeholder) => (
        <div className="mb-4">
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <img
                src={person?.image || DefaultImage}
                alt={title}
                width={60}
                height={60}
                className="rounded-circle me-3"
                style={{ objectFit: "cover", border: '2px solid #f0591f' }}
              />
              <div className="text-start">
                <h6 className="mb-1" style={{ color: '#ffffff' }}>{title}</h6>
                <p style={{ color: '#a1a1aa', margin: 0 }}>
                  {person?.fname || person?.name || ""}{" "}
                  {person?.lname || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#d4d4d8', fontWeight: 500, fontSize: '0.875rem' }}>
              How would you rate the {type}? *
            </label>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Rating
                name={ratingField}
                value={formData[ratingField]}
                onChange={(event, newValue) =>
                  onInputChange({
                    target: { name: ratingField, value: newValue },
                  })
                }
                size="large"
                icon={<StarIcon sx={{ fontSize: 40, color: '#f0591f' }} />}
                emptyIcon={<StarBorderIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.06)' }} />}
              />
            </Box>
          </div>

          <div className="mb-3">
            <label htmlFor={commentField} className="form-label" style={{ color: '#d4d4d8', fontWeight: 500, fontSize: '0.875rem' }}>
              Comment about the {type} *
            </label>
            <textarea
              id={commentField}
              name={commentField}
              rows="3"
              value={formData[commentField]}
              onChange={onInputChange}
              placeholder={placeholder}
              required
              maxLength={500}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                color: "#ffffff",
                padding: "10px 14px",
                resize: "none",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = '#f0591f'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.07)'}
            />
            <small style={{ color: '#71717a' }}>
              {(formData[commentField] || "").length}/500 characters
            </small>
          </div>
        </div>
      ),
      [formData, onInputChange],
    );

    const renderStepContent = useCallback(() => {
      if (currentStep === 0) {
        return renderRatingSection(
          "quality of work",
          "Rate the Expert",
          orderData?.seller,
          "expert_rating",
          "expert_comment",
          "How was the quality of work? Was it delivered on time? Any feedback for the expert...",
        );
      }
      if (currentStep === 1) {
        return renderRatingSection(
          "BD service",
          "Rate the Business Developer",
          orderData?.bd,
          "bd_rating",
          "bd_comment",
          "How was the communication? Did they help match you with the right expert?",
        );
      }
      return null;
    }, [currentStep, orderData, renderRatingSection]);

    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "50%" },
            maxHeight: "90vh",
            bgcolor: "#020617",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: '16px',
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            overflow: "auto",
            p: 4,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1 font-500 cocon" style={{ color: '#ffffff' }}>Write Review</h5>
              <small style={{ color: '#a1a1aa' }}>
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
              </small>
            </div>
            <IconButton onClick={onClose} disabled={isSubmitting} sx={{ color: '#a1a1aa' }}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="mb-4">
            <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(255, 255, 255, 0.06)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  height: "100%",
                  backgroundColor: "#f0591f",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="d-flex gap-2 justify-content-between mt-4">
              <div>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    sx={{ borderColor: "rgba(255, 255, 255, 0.07)", color: "#d4d4d8", "&:hover": { borderColor: "#f0591f", color: "#f0591f" } }}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                  disabled={isSubmitting}
                  sx={{ borderColor: "rgba(255, 255, 255, 0.07)", color: "#d4d4d8", "&:hover": { borderColor: "#f0591f", color: "#f0591f" } }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isStepValid()}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                  sx={{ backgroundColor: "#f0591f", "&:hover": { backgroundColor: "#d94e18" }, borderRadius: "8px" }}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentStep === steps.length - 1
                      ? "Submit Review"
                      : "Next"}
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    );
  },
);

ReviewModal.displayName = "ReviewModal";

// OrderTableTab Component
const OrderTableTab = React.memo(
  ({
    id,
    orders,
    userRole,
    renderOrderRow,
    emptyMessage,
    isActive = false,
  }) => {
    const hasDeliveredOrCompleted = useMemo(
      () =>
        orders.some((order) =>
          ["delivered", "completed", "submitted_to_bd"].includes(
            (order.status || "").toLowerCase(),
          ),
        ),
      [orders],
    );

    console.log(`📊 Tab ${id} orders:`, orders.length);

    return (
      <div
        className={`tab-pane fade ${isActive ? "show active" : ""}`}
        id={id}
        role="tabpanel"
      >
        <div className="container-fluid ProfileVisit order-table my-42">
          <div className="row justify-content-center">
            <div className="col-12 gt-card-bg rounded-3 px-0">
              <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
                <Table sx={{ minWidth: 650 }} aria-label="orders table" className="gt-dark-table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-16 poppins fw-medium ps-4 gt-text-white border-bottom-light">
                        {userRole === "Client" ? "Seller" : "Buyer"}
                      </TableCell>
                      <TableCell className="font-16 poppins fw-medium ps-4 gt-text-white border-bottom-light">
                        BD
                      </TableCell>
                      <TableCell
                        className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                        align="center"
                      >
                        Gig
                      </TableCell>
                      <TableCell
                        className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                        align="center"
                      >
                        Due Date
                      </TableCell>
                      <TableCell
                        className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                        align="center"
                      >
                        Total
                      </TableCell>
                      <TableCell
                        className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                        align="center"
                      >
                        Status
                      </TableCell>
                      {hasDeliveredOrCompleted && (
                        <TableCell
                          className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                          align="center"
                        >
                          Files
                        </TableCell>
                      )}
                      <TableCell
                        className="font-16 poppins fw-medium gt-text-white border-bottom-light"
                        align="center"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => {
                        return renderOrderRow(order, userRole === "Client");
                      })
                    ) : (
                      <TableRow className="gt-table-row">
                        <TableCell
                          colSpan={hasDeliveredOrCompleted ? 8 : 7}
                          className="text-center py-5 border-bottom-light"
                        >
                          <Typography variant="body1" className="gt-text-muted">
                            {emptyMessage}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

OrderTableTab.displayName = "OrderTableTab";

// Main Order Component
const Order = () => {
  const dispatch = useDispatch();
  const user = useUserData();
  const { orders, isLoading, getError } = useOrdersData(user);
  const { id: urlOrderId } = useParams();

  // PERF STARTUP: Defer accessToken read to avoid blocking render
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const readToken = () => {
      try {
        setAccessToken(localStorage.getItem("accessToken"));
      } catch {
        setAccessToken(null);
      }
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(readToken, { timeout: 0 });
    } else {
      setTimeout(readToken, 0);
    }
  }, []);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Active"); // React-controlled tabs

  // PERF: debounce search to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!urlOrderId || !orders?.length || selectedOrder) return;
    const matched = orders.find((o) => String(o.id) === String(urlOrderId));
    if (matched) {
      setSelectedOrder({
        id: matched.id,
        price: matched.price || 0,
        due_date: matched.due_date || matched.offer?.date,
        status: matched.status ?? matched.offer?.status ?? matched.order_status,
        description: matched.description || "",
        gig: {
          title: matched.gig?.title || matched.title || "Custom Order",
          id: matched.gig?.id || matched.gig_id,
        },
        client: matched.client,
        seller: matched.seller,
        bd: matched.bd,
        attachments: matched.attachments || [],
        delivery_attachments: matched.delivery_attachments || [],
        revision_count: matched.revision_count || 0,
        created_at: matched.created_at,
        offer_id: matched.offer_id,
        ...matched,
      });
    }
  }, [urlOrderId, orders, selectedOrder]);

  const [actionLoading, setActionLoading] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [orderFiles, setOrderFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderCompletionModal, setOrderCompletionModal] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    expert_rating: 0,
    expert_comment: "",
    bd_rating: 0,
    bd_comment: "",
    client_rating: 0,
    client_comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [revisionDialogOpen, setRevisionDialogOpen] = useState(false);
  const [revisionInstructions, setRevisionInstructions] = useState("");


  // Debug orders data
  useEffect(() => {
    console.log("🎯 Main component - All orders:", orders);
    console.log("🎯 Main component - User role:", user?.role);
    console.log("🎯 Main component - Orders count:", orders?.length);
  }, [orders, user?.role]);

  // Memoized handlers
  const closeReviewModal = useCallback(() => {
    setReviewFormData({
      expert_rating: 0,
      expert_comment: "",
      bd_rating: 0,
      bd_comment: "",
      client_rating: 0,
      client_comment: "",
    });
    setShowReviewModal(false);
  }, []);

  const handleReviewInputChange = useCallback((e) => {
    setReviewFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  }, []);

  // Resolve order status (BD/API may put it on order, offer, or order_status)
  const getOrderStatus = useCallback((order) => {
    if (!order) return "";
    const raw = order.status ?? order.offer?.status ?? order.order_status ?? "";
    return String(raw).toLowerCase().trim();
  }, []);

  // FIXED: Enhanced filter function with proper status matching
  const filterOrders = useCallback(
    (array, statusGroup) => {
      if (!Array.isArray(array)) {
        console.log("❌ Filter received non-array:", array);
        return [];
      }

      const allowedStatuses = STATUS_CONFIG.groups[statusGroup] || new Set();
      const query = debouncedSearchQuery.toLowerCase().trim();

      console.log(
        `🔍 Filtering ${array.length} orders for status group: ${statusGroup}`,
      );
      console.log(`🔍 Allowed statuses:`, Array.from(allowedStatuses));

      const filtered = array.filter((order) => {
        if (!order) return false;
        const orderStatus = getOrderStatus(order);
        if (!orderStatus) return false;

        // Create normalized versions for comparison
        const normalizedAllowedStatuses = new Set(
          Array.from(allowedStatuses).map((s) => s.toLowerCase()),
        );

        // Check if order status matches any in the allowed statuses
        const matchesStatus = normalizedAllowedStatuses.has(orderStatus);

        console.log(
          `🔍 Order ${order.id} status: "${orderStatus}" matches "${statusGroup}":`,
          matchesStatus,
        );

        if (!matchesStatus) return false;
        if (!debouncedSearchQuery) return true;

        // Search in relevant fields
        const searchableFields = [
          order?.gig?.title,
          order?.client?.fname,
          order?.client?.lname,
          order?.seller?.fname,
          order?.seller?.lname,
          order?.title,
          order?.description,
        ].filter(Boolean);

        const searchableText = searchableFields.join(" ").toLowerCase();
        const matchesSearch = searchableText.includes(query);

        return matchesSearch;
      });

      console.log(`✅ Found ${filtered.length} orders for ${statusGroup}`);
      return filtered;
    },
    [debouncedSearchQuery, getOrderStatus],
  );

  // Memoized filtered orders
  const [
    activeOrders,
    deliveredOrders,
    completedOrders,
    pendingVerificationOrders,
    disputedOrders,
    cancelledOrders,
  ] = useMemo(() => {
    console.log(
      "🔄 Recalculating filtered orders from",
      orders.length,
      "total orders",
    );
    const filtered = [
      filterOrders(orders, "Active"),
      filterOrders(orders, "Delivered"),
      filterOrders(orders, "Completed"),
      filterOrders(orders, "Pending Verification"),
      filterOrders(orders, "Disputed"),
      filterOrders(orders, "Cancelled"),
    ];

    console.log("📈 Final filtered counts:", {
      active: filtered[0].length,
      delivered: filtered[1].length,
      completed: filtered[2].length,
      pending: filtered[3].length,
      disputed: filtered[4].length,
      cancelled: filtered[5].length,
    });

    return filtered;
  }, [orders, filterOrders]);

  const handleActionMenuClose = useCallback(() => setAnchorEl(null), []);

  // File upload handling
  const uploadFileInChunks = useCallback(
    async (file, offerId) => {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: { loaded: 0, total: file.size, percent: 0, status: 'uploading' },
      }));

      for (let index = 0; index < totalChunks; index++) {
        const chunkStart = index * CHUNK_SIZE;
        const chunkEnd = Math.min((index + 1) * CHUNK_SIZE, file.size);
        const chunk = file.slice(chunkStart, chunkEnd);

        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("chunk_index", index);
        formData.append("total_chunks", totalChunks);
        formData.append("file_name", file.name);
        formData.append("offer_id", offerId);

        try {
          await axios.post(`/order/upload-chunk`, formData, {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
            onUploadProgress: (event) => {
              setUploadProgress((prev) => {
                const loadedFromPreviousChunks = index * CHUNK_SIZE;
                const newLoaded = loadedFromPreviousChunks + event.loaded;
                const newPercent = Math.round((newLoaded / file.size) * 100);
                
                return {
                  ...prev,
                  [file.name]: {
                    loaded: newLoaded,
                    total: file.size,
                    percent: Math.min(newPercent, 100),
                    status: 'uploading'
                  },
                };
              });
            },
          });
        } catch (err) {
          console.error(`Error uploading chunk ${index + 1}:`, err);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'error' }
          }));
          toast.error(`Failed to upload ${file.name}`);
          return;
        }
      }
      
      setUploadProgress((prev) => {
        const nextState = {
          ...prev,
          [file.name]: { loaded: file.size, total: file.size, percent: 100, status: 'done' },
        };
        
        // Use a timeout to check if ALL files are done
        setTimeout(() => {
          checkAndAutoSubmit(offerId, nextState);
        }, 500);
        
        return nextState;
      });
    },
    [accessToken],
  );

  // Helper for auto-submitting when all files finish
  const checkAndAutoSubmit = async (offerId, progressState) => {
    // Only proceed if we have files in state and ALL of them have percent === 100
    const allFiles = Object.values(progressState);
    if (allFiles.length === 0) return;
    
    const allDone = allFiles.every(f => f.percent === 100 && f.status === 'done');
    if (!allDone) return; // Still waiting for others
    
    // Prevent double submission
    if (window.isAutoSubmittingOrder) return;
    window.isAutoSubmittingOrder = true;

    try {
      const currentUserId = user?.id ?? JSON.parse(localStorage.getItem("UserData") || "{}")?.id;
      const currentRole = user?.role ?? JSON.parse(localStorage.getItem("UserData") || "{}")?.role;
      const orderId = selectedOrder?.id || offerId; // Fallback if selectedOrder is not synced

      const metadataForm = new FormData();
      metadataForm.append("delivery_message", submissionMessage?.trim() ? submissionMessage : "Here is my delivered work.");
      metadataForm.append("offer_id", offerId);
      metadataForm.append("has_files", "0"); 
      
      if (currentUserId) metadataForm.append("seller_id", String(currentUserId));
      if (orderId) metadataForm.append("order_id", String(orderId));
      if (currentRole === "expert" || currentRole === "expert/freelancer") {
        metadataForm.append("submitter_role", "seller");
      }

      await dispatch(OrderSubmit({ orderId: orderId, payload: metadataForm })).unwrap();
      
      toast.success("File uploaded & Order submitted successfully!");
      handleCloseSubmissionDialog();
      
      if (currentRole === "expert/freelancer" || currentRole === "seller" || currentRole === "expert") {
        await dispatch(AllExpertOrders()).unwrap();
      }
    } catch (err) {
      console.error("Auto-submit order error", err);
    } finally {
      window.isAutoSubmittingOrder = false;
    }
  };

  const handleOrderFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error(
        `These files exceed 5GB: ${oversizedFiles.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    setOrderFiles((prev) => [...prev, ...files]);

    // Automatically start uploading as soon as file is selected
    files.forEach(file => {
      uploadFileInChunks(file, selectedOrder.offer_id);
    });
  }, [uploadFileInChunks, selectedOrder]);

  const removeOrderFile = useCallback(
    (index) => {
      setOrderFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        const fileToRemove = orderFiles[index];
        if (fileToRemove) delete newProgress[fileToRemove.name];
        return newProgress;
      });
    },
    [orderFiles],
  );



  const handleApproveToBD = useCallback(async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      await axios.post(
        `/order/approve-bd`,
        { order_id: selectedOrder.id, action: "approve_and_submit_to_client" },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.success("Order approved and submitted to client successfully!");
      handleActionMenuClose();
      if (user?.role === "bidder/company representative/middleman")
        await dispatch(AllBdOrders()).unwrap();
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error(error.response?.data?.message || "Failed to approve order");
    } finally {
      setActionLoading(false);
    }
  }, [selectedOrder, accessToken, handleActionMenuClose, user?.role, dispatch]);

  const refreshOrders = useCallback(async () => {
    console.log("🔄 Refreshing orders for role:", user?.role);
    if (user?.role === "Client") {
      await dispatch(AllClientOrders({ client_id: user?.id })).unwrap();
    } else if (user?.role === "bidder/company representative/middleman") {
      await dispatch(AllBdOrders()).unwrap();
    } else if (
      user?.role === "expert/freelancer" ||
      user?.role === "seller" ||
      user?.role === "expert"
    ) {
      await dispatch(AllExpertOrders()).unwrap();
    }
  }, [user?.role, user?.id, dispatch]);

  const handleRequestRevision = useCallback(async () => {
    if (!selectedOrder || !revisionInstructions.trim()) {
      toast.error("Please provide revision instructions");
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(
        `/order/request-revision`,
        { order_id: selectedOrder.id, revision_notes: revisionInstructions },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.success("Revision requested successfully!");
      setRevisionDialogOpen(false);
      setRevisionInstructions("");
      await refreshOrders();
    } catch (error) {
      console.error("Error requesting revision:", error);
      toast.error(
        error.response?.data?.message || "Failed to request revision",
      );
    } finally {
      setActionLoading(false);
    }
  }, [selectedOrder, revisionInstructions, accessToken]);

  const handleDisputeOrder = useCallback(async () => {
    if (!selectedOrder || !disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(
        `/order/dispute`,
        { order_id: selectedOrder.id, dispute_reason: disputeReason },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.warning("Order disputed successfully!");
      setDisputeDialogOpen(false);
      setDisputeReason("");
      await refreshOrders();
    } catch (error) {
      console.error("Error disputing order:", error);
      toast.error(error.response?.data?.message || "Failed to dispute order");
    } finally {
      setActionLoading(false);
    }
  }, [selectedOrder, disputeReason, accessToken]);

  const handleApproveOrder = useCallback(async () => {
    if (!selectedOrder) return;
    setCompletingOrder(true);
    try {
      const payload = new FormData();
      payload.append("status", "completed");
      payload.append("order_id", String(selectedOrder.id));

      await dispatch(OrderComplete({ orderId: selectedOrder.id, payload })).unwrap();

      toast.success("Order completed successfully!");
      setOrderCompletionModal(false);
      await refreshOrders();

      // ✅ Review Modal sirf Client ke liye khulega
      if (user?.role === "Client") {
        setShowReviewModal(true);
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error(error?.message || "Failed to complete order");
    } finally {
      setCompletingOrder(false);
    }
  }, [selectedOrder, dispatch, refreshOrders, user?.role]);

  const handleCloseSubmissionDialog = useCallback(() => {
    setSubmissionDialogOpen(false);
    setSubmissionMessage("");
    setOrderFiles([]);
    setUploadProgress({});
    setSelectedOrder(null);
  }, []);

  const handleSubmitOrder = useCallback(async () => {
    if (!selectedOrder || !submissionMessage.trim()) {
      toast.error("Please provide order description");
      return;
    }

    // Check if files are still uploading
    const isAnyFileUploading = orderFiles.some(file => uploadProgress[file.name]?.percent < 100 && uploadProgress[file.name]?.status !== 'error');
    if (isAnyFileUploading) {
      toast.warning("Please wait for all files to finish uploading before submitting.");
      return;
    }

    setSubmittingOrder(true);

    try {
      // Submit metadata. Since files are already uploaded automatically, we pass has_files: 0 
      // so backend instantly marks order as submitted/delivered.
      const metadataForm = new FormData();
      metadataForm.append("delivery_message", submissionMessage);
      metadataForm.append("offer_id", selectedOrder.offer_id);
      metadataForm.append("has_files", "0"); // Files are already uploaded!
      const currentUserId =
        user?.id ?? JSON.parse(localStorage.getItem("UserData") || "{}")?.id;
      const currentRole =
        user?.role ??
        JSON.parse(localStorage.getItem("UserData") || "{}")?.role;
      if (currentUserId) {
        metadataForm.append("seller_id", String(currentUserId));
      }
      if (selectedOrder.id) {
        metadataForm.append("order_id", String(selectedOrder.id));
      }
      if (currentRole === "expert" || currentRole === "expert/freelancer") {
        metadataForm.append("submitter_role", "seller");
      }

      await dispatch(
        OrderSubmit({
          orderId: selectedOrder.id,
          payload: metadataForm,
        }),
      ).unwrap();

      toast.success("Order submitted successfully!");
      handleCloseSubmissionDialog();

      // Refresh orders
      if (
        user?.role === "expert/freelancer" ||
        user?.role === "seller" ||
        user?.role === "expert"
      ) {
        await dispatch(AllExpertOrders()).unwrap();
      }
    } catch (err) {
      console.error("Submit order error", err);
      toast.error(
        err.response?.data?.message || err.message || "Error submitting order",
      );
    } finally {
      setSubmittingOrder(false);
    }
  }, [
    selectedOrder,
    submissionMessage,
    orderFiles,
    uploadProgress,
    dispatch,
    user?.role,
    handleCloseSubmissionDialog,
  ]);

  const isAnyFileUploading = orderFiles.some(file => uploadProgress[file.name]?.percent < 100 && uploadProgress[file.name]?.status !== 'error');

  const handleActionMenuOpen = useCallback((event, order) => {
    setAnchorEl(event.currentTarget);
    const resolvedOrderStatus =
      order.status ?? order.offer?.status ?? order.order_status;
    setSelectedOrder({
      id: order.id,
      price: order.price || 0,
      due_date: order.due_date || order.offer?.date,
      status: resolvedOrderStatus,
      description: order.description || "",
      gig: {
        title: order.gig?.title || order.title || "Custom Order",
        id: order.gig?.id || order.gig_id,
      },
      client: order.client,
      seller: order.seller,
      bd: order.bd,
      attachments: order.attachments || [],
      delivery_attachments: order.delivery_attachments || [],
      revision_count: order.revision_count || 0,
      created_at: order.created_at,
      offer_id: order.offer_id,
      ...order,
    });
  }, []);

  const handleOpenSubmissionDialog = useCallback(() => {
    if (!selectedOrder) {
      toast.error("No order selected");
      return;
    }
    setSubmissionDialogOpen(true);
    handleActionMenuClose();
  }, [selectedOrder, handleActionMenuClose]);

  const openReviewModalForOrder = useCallback((order) => {
    setSelectedOrder({
      id: order.id,
      price: order.price || 0,
      due_date: order.due_date || order.offer?.date,
      status: order.status ?? order.offer?.status ?? order.order_status,
      description: order.description || "",
      gig: {
        title: order.gig?.title || order.title || "Custom Order",
        id: order.gig?.id || order.gig_id,
      },
      client: order.client,
      seller: order.seller,
      bd: order.bd,
      offer_id: order.offer_id,
      ...order,
    });
    setShowReviewModal(true);
  }, []);

  // Review submission: Only Client can write review after order is completed
  const handleReviewSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (user?.role !== "Client") {
        toast.error("Only clients can submit reviews.");
        return;
      }

      if (
        !reviewFormData.expert_rating ||
        reviewFormData.expert_rating < 1 ||
        reviewFormData.expert_rating > 5
      ) {
        toast.error("Please provide a valid rating for the Expert (1-5)");
        return;
      }
      if (!reviewFormData.expert_comment.trim()) {
        toast.error("Please write a comment about the Expert's work");
        return;
      }
      if (
        !reviewFormData.bd_rating ||
        reviewFormData.bd_rating < 1 ||
        reviewFormData.bd_rating > 5
      ) {
        toast.error(
          "Please provide a valid rating for the Business Developer (1-5)",
        );
        return;
      }
      if (!reviewFormData.bd_comment.trim()) {
        toast.error("Please write a comment about the BD's service");
        return;
      }

      setIsSubmittingReview(true);
      const formData = new FormData();
      formData.append("offer_id", selectedOrder?.offer_id);
      formData.append("order_id", selectedOrder?.id);
      formData.append("reviewer_role", "Client");
      formData.append(
        "expert_rating",
        parseInt(reviewFormData.expert_rating, 10),
      );
      formData.append("expert_comment", reviewFormData.expert_comment.trim());
      formData.append("bd_rating", parseInt(reviewFormData.bd_rating, 10));
      formData.append("bd_comment", reviewFormData.bd_comment.trim());

      try {
        await dispatch(ReviewSubmit(formData)).unwrap();
        toast.success("Review submitted successfully!");
        closeReviewModal();
        await refreshOrders();
      } catch (error) {
        console.error("Review submission error:", error);
        toast.error(error?.message || "Failed to submit review.");
      } finally {
        setIsSubmittingReview(false);
      }
    },
    [
      reviewFormData,
      selectedOrder,
      user?.role,
      dispatch,
      closeReviewModal,
      refreshOrders,
    ],
  );

  const renderActionButton = useCallback(
    (order) => {
      const orderStatus = getOrderStatus(order);
      if (!orderStatus) return null;

      const isFinished = ["completed", "accepted"].includes(orderStatus);

      // 1. EXPERT / SELLER ROLE
      if (
        user?.role === "expert/freelancer" ||
        user?.role === "seller" ||
        user?.role === "expert"
      ) {
        if (!isFinished && [
          "active", "project started", "revision_requested", 
          "in revision", "expert_assigned", "awaiting_files"
        ].includes(orderStatus)) {
          return (
            <Button
              style={{ backgroundColor: "#ed5623", color: "white" }}
              variant="contained"
              startIcon={<FileUploadIcon style={{ color: "white" }} />}
              onClick={(e) => handleActionMenuOpen(e, order)}
              size="small"
            >
              Submit
            </Button>
          );
        }
        // Expert ko sirf Text dikhega
        if (isFinished) {
          return (
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#2e7d32", textTransform: "uppercase" }}>
              Completed
            </Typography>
          );
        }
      }

      // 2. BD ROLE (Middleman)
      if (user?.role === "bidder/company representative/middleman") {
        if (orderStatus === "submitted_to_bd") {
          return (
            <Button variant="contained" color="primary" onClick={(e) => handleActionMenuOpen(e, order)} size="small">
              BD Actions
            </Button>
          );
        }
        if (["delivered"].includes(orderStatus)) {
          return (
            <Button variant="outlined" onClick={(e) => handleActionMenuOpen(e, order)} size="small">
              Actions
            </Button>
          );
        }
        // BD ko bhi sirf Text dikhega
        if (isFinished) {
          return (
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#2e7d32", textTransform: "uppercase" }}>
              Completed
            </Typography>
          );
        }
      }

      // 3. CLIENT ROLE (Sirf yahan "Write Review" button aayega)
      if (user?.role === "Client") {
        if (orderStatus === "delivered") {
          return (
            <Button variant="contained" color="primary" onClick={(e) => handleActionMenuOpen(e, order)} size="small">
              Actions
            </Button>
          );
        }

        if (isFinished) {
          // Check karein ke review ho chuka hai ya nahi
          if (order.client_review_submitted) {
            return (
              <Button variant="text" color="success" size="small" disabled sx={{ fontWeight: 600 }}>
                Reviewed ✓
              </Button>
            );
          }
          return (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => openReviewModalForOrder(order)}
              size="small"
              sx={{ borderRadius: "20px", fontWeight: 600 }}
            >
              Write Review
            </Button>
          );
        }
      }

      return null;
    },
    [user?.role, handleActionMenuOpen, getOrderStatus, openReviewModalForOrder]
  );

  // Order row renderer
  const renderOrderRow = useCallback(
    (order, showSeller = false) => {
      if (!order) {
        console.log("❌ renderOrderRow received null order");
        return null;
      }

      const resolvedStatus = getOrderStatus(order);
      console.log(
        `🟢 Rendering order row:`,
        order.id,
        resolvedStatus || order.status,
      );

      const orderStatus = resolvedStatus;
      const hasDeliveryAttachment =
        (orderStatus === "delivered" ||
          orderStatus === "completed" ||
          orderStatus === "submitted_to_bd") &&
        (order.attachment || order?.delivery_attachments?.length > 0);
      const statusDisplay =
        STATUS_CONFIG.display[orderStatus] ||
        order.status ||
        order.offer?.status ||
        order.order_status ||
        orderStatus;
      const statusClass =
        STATUS_CONFIG.badgeClasses[orderStatus] || "bg-light text-dark";

      return (
        <TableRow key={order.id} className="gt-table-row" hover>
          <TableCell className="ps-4 gt-text-light border-bottom-light">
            <div className="d-flex align-items-center">
              <img
                src={
                  showSeller
                    ? order?.seller?.image || DefaultImage
                    : order?.client?.image || DefaultImage
                }
                alt="User"
                width={40}
                height={40}
                className="rounded-circle me-2"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  if (e.target.src !== DefaultImage)
                    e.target.src = DefaultImage;
                }}
              />
              <span>
                {showSeller ? (
                  order?.seller ? (
                    // Agar seller hai toh uska naam
                    `${order.seller.fname || ''} ${order.seller.lname || ''}`.trim()
                  ) : order?.bd ? (
                    // Agar seller nahi hai lekin BD hai
                    `${order.bd.fname || ''} ${order.bd.lname || ''} (BD)`.trim()
                  ) : (
                    // Agar dono nahi hain
                    'Expert Pending'
                  )
                ) : (
                  // Buyer side ka logic wahi rahega
                  `${order?.client?.fname || ""} ${order?.client?.lname || ""}`.trim() || "Unknown Buyer"
                )}
              </span>
            </div>
          </TableCell>
          <TableCell className="ps-4 gt-text-light border-bottom-light">
            <div className="d-flex align-items-center">
              <img
                src={order?.bd?.image || DefaultImage}
                alt="BD"
                width={40}
                height={40}
                className="rounded-circle me-2"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  if (e.target.src !== DefaultImage)
                    e.target.src = DefaultImage;
                }}
              />
              <span>
                {`${order?.bd?.fname || ""} ${order?.bd?.lname || ""}`.trim() ||
                  "Unknown BD"}
              </span>
            </div>
          </TableCell>
          <TableCell align="center" className="gt-text-light border-bottom-light">
            <div className="d-flex flex-column">
              <strong className="gt-text-white">
                {order?.gig?.title || order?.title || "Custom Order"}
              </strong>
              {order?.description && (
                <small className="gt-text-muted">
                  {order.description.length > 30
                    ? `${order.description.substring(0, 30)}...`
                    : order.description}
                </small>
              )}
            </div>
          </TableCell>
          <TableCell align="center" className="gt-text-light border-bottom-light">
            <div className="d-flex flex-column">
              <span>
                {order?.offer?.date
                  ? formatDate(order.offer.date)
                  : order?.due_date
                    ? formatDate(order.due_date)
                    : "N/A"}
              </span>
              {order?.due_date && (
                <small
                  className={
                    new Date(order.due_date) < new Date()
                      ? "gt-text-danger"
                      : "gt-text-success"
                  }
                >
                  {new Date(order.due_date) < new Date()
                    ? "Overdue"
                    : "On time"}
                </small>
              )}
            </div>
          </TableCell>
          <TableCell align="center" className="gt-text-light border-bottom-light">
            <strong className="gt-text-white">
              ${order?.price ? Number(order.price).toFixed(2) : "0.00"}
            </strong>
          </TableCell>
          <TableCell align="center" className="border-bottom-light">
            <Badge
              badgeContent={
                order.revision_count > 0 ? order.revision_count : null
              }
              color="secondary"
            >
              <span className={`badge ${statusClass}`}>{statusDisplay}</span>
            </Badge>
          </TableCell>
          {["delivered", "completed", "submitted_to_bd"].includes(
            orderStatus,
          ) && (
            <TableCell align="center" className="border-bottom-light">
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {hasDeliveryAttachment || orderStatus === "submitted_to_bd" ? (
                  <DownloadAttachments
                    offer={order}
                    hasDeliveryAttachment={true}
                  />
                ) : (
                  <span className="gt-text-muted">N/A</span>
                )}
              </div>
            </TableCell>
          )}
          <TableCell align="center" className="border-bottom-light">
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {renderActionButton(order)}
            </div>
          </TableCell>
        </TableRow>
      );
    },
    [formatDate, renderActionButton, getOrderStatus],
  );

  // Enhanced error and loading states with better debugging
  if (isLoading)
    return (
      <div className="col-12 text-center py-5">
        <CircularProgress />
        <Typography variant="h6" className="mt-3">
          Loading orders...
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-2">
          User Role: {user?.role} | User ID: {user?.id}
        </Typography>
      </div>
    );

  if (getError) {
    console.error("❌ Orders error in component:", getError);
    return (
      <div className="alert alert-danger mx-3 mt-3">
        <h5>Error Loading Orders</h5>
        <p>{getError}</p>
        <Typography variant="body2" className="mt-2">
          User Role: {user?.role} | User ID: {user?.id}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  console.log("🎨 Final render - Orders:", orders.length);
  console.log("🎨 Final render - Filtered counts:", {
    active: activeOrders.length,
    delivered: deliveredOrders.length,
    completed: completedOrders.length,
    pending: pendingVerificationOrders.length,
    disputed: disputedOrders.length,
    cancelled: cancelledOrders.length,
  });

  return (
    <>
      <style>{`
        /* GrapeTask Dark Theme Overrides */
        .gt-orders-wrapper {
          background-color: #020617;
          min-height: 100vh;
        }
        .gt-card-bg {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .gt-text-white { color: #ffffff !important; }
        .gt-text-light { color: #d4d4d8 !important; }
        .gt-text-muted { color: #71717a !important; }
        .border-bottom-light { border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important; }
        
        /* Table Default Fixes to Kill White Backgrounds */
        .gt-card-bg .MuiPaper-root,
        .gt-dark-table,
        .gt-dark-table .MuiTableBody-root,
        .gt-dark-table .MuiTableHead-root,
        .gt-dark-table .MuiTableRow-root,
        .gt-dark-table .MuiTableCell-root,
        .gt-table-row {
          background-color: transparent !important;
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
          color: #d4d4d8 !important;
        }
        
        /* Action Menu & Dialog Fixes (Premium Dark Look) */
        .MuiMenu-paper, .MuiDialog-paper {
          background-color: #0f172a !important; /* Tailwind Slate 900 */
          color: #f9fafb !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5) !important;
        }
        .MuiMenuItem-root {
          color: #d4d4d8 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 14px !important;
          transition: 0.2s !important;
        }
        .MuiMenuItem-root:hover {
          background-color: rgba(240, 89, 31, 0.15) !important;
          color: #f0591f !important;
        }
        .MuiDialogTitle-root {
          color: #ffffff !important;
          font-family: 'Fraunces', serif !important;
          font-weight: 600 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .MuiDialogContent-root {
          color: #94a3b8 !important;
          padding-top: 20px !important;
        }
        .MuiDialogContent-root strong {
          color: #ffffff !important;
        }
        .MuiDialogActions-root {
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          padding: 16px !important;
        }
        
        /* Dark theme inputs inside Dialogs */
        .MuiDialogContent-root textarea, .MuiDialogContent-root input[type="file"] {
          background-color: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .MuiDialogContent-root textarea:focus {
          border-color: #f0591f !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(240, 89, 31, 0.15) !important;
        }
        .gt-dark-table .MuiTableHead-root .MuiTableCell-root {
          color: #ffffff !important;
          font-weight: 600 !important;
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        .gt-dark-table .MuiTableRow-root:hover { 
          background-color: rgba(255, 255, 255, 0.04) !important; 
        }
        
        .gt-nav-pills .nav-link {
          color: #a1a1aa !important;
          border-radius: 8px;
          margin-bottom: 5px;
          transition: all 0.2s ease;
        }
        .gt-nav-pills .nav-link:hover {
          color: #d4d4d8 !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .gt-nav-pills .nav-link.active {
          background-color: #f0591f !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3) !important;
        }
        
        .gt-search-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .gt-search-container:focus-within {
          border-color: rgba(240, 89, 31, 0.4);
          background: rgba(255, 255, 255, 0.04);
        }
        .gt-search-input {
          background: transparent !important;
          border: none !important;
          color: #ffffff !important;
        }
        .gt-search-input::placeholder { color: #71717a !important; }
        .gt-search-icon-wrapper { background: transparent !important; border: none !important; }
        
        .gt-text-danger { color: #ef4444 !important; }
        .gt-text-success { color: #10b981 !important; }
      `}</style>
      
      <div className="gt-orders-wrapper">
      <Navbar FirstNav="none" />
      <div className="container-fluid p-lg-5 p-md-5 p-sm-4 p-3 pt-5">
        <div className="row">
          <div className="container-fluid">
            <div className="row justify-content-lg-between justify-content-end align-items-center mb-4">
              <div className="col-lg-5 col-12">
                <h5 className="cocon byerLine font-22 gt-text-white mb-2">Manage Orders</h5>
                <Typography variant="body2" className="gt-text-muted">
                  Role: <strong className="gt-text-light">{user?.role}</strong> | Total Orders: <strong className="gt-text-light">{orders.length}</strong>
                </Typography>
              </div>
              <div className="col-lg-4 mt-lg-0 mt-4 col-md-6 col-sm-8 col-12">
                <div className="gt-search-container">
                  <div className="input-group p-2 h-100">
                    <span className="input-group-text pt-0 pb-0 gt-search-icon-wrapper">
                      <img src={search} width={16} alt="Search" style={{ filter: 'brightness(0) invert(0.7)' }} />
                    </span>
                    <input
                      type="text"
                      className="form-control p-0 font-12 gt-search-input shadow-none"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gt-card-bg rounded-4 p-4 mt-3 w-100">
            <div className="d-flex flex-wrap gap-2 mb-4">
              {[
                { label: "Active", count: activeOrders.length, color: "#0069ff" },
                { label: "Delivered", count: deliveredOrders.length, color: "#c471ed" },
                { label: "Completed", count: completedOrders.length, color: "#1dbf73" },
                { label: "Pending", count: pendingVerificationOrders.length, color: "#ffb33e" },
                { label: "Disputed", count: disputedOrders.length, color: "#ff4c4c" },
                { label: "Cancelled", count: cancelledOrders.length, color: "#9ca3af" },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className="btn"
                  style={{
                    backgroundColor: activeTab === tab.label ? `${tab.color}15` : 'transparent',
                    border: activeTab === tab.label ? `1px solid ${tab.color}50` : '1px solid rgba(255,255,255,0.05)',
                    color: activeTab === tab.label ? tab.color : '#a1a1aa',
                    borderRadius: '20px',
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: tab.color
                  }}></span>
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {activeTab === "Active" && (
                <OrderTableTab
                  id="tab-active"
                  orders={activeOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No active orders found."
                  isActive={true}
                />
              )}
              {activeTab === "Delivered" && (
                <OrderTableTab
                  id="tab-delivered"
                  orders={deliveredOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No delivered orders found."
                  isActive={true}
                />
              )}
              {activeTab === "Completed" && (
                <OrderTableTab
                  id="tab-completed"
                  orders={completedOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No completed orders found."
                  isActive={true}
                />
              )}
              {activeTab === "Pending" && (
                <OrderTableTab
                  id="tab-pending"
                  orders={pendingVerificationOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No orders pending verification."
                  isActive={true}
                />
              )}
              {activeTab === "Disputed" && (
                <OrderTableTab
                  id="tab-disputed"
                  orders={disputedOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No disputed orders found."
                  isActive={true}
                />
              )}
              {activeTab === "Cancelled" && (
                <OrderTableTab
                  id="tab-cancelled"
                  orders={cancelledOrders}
                  userRole={user?.role}
                  renderOrderRow={renderOrderRow}
                  emptyMessage="No cancelled orders found."
                  isActive={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
      >
        {user?.role === "expert/freelancer" ||
        user?.role === "seller" ||
        user?.role === "expert" ? (
          <MenuItem
            onClick={handleOpenSubmissionDialog}
            disabled={actionLoading}
          >
            <FileUploadIcon fontSize="small" className="me-2" />
            Submit Work
          </MenuItem>
        ) : (
          (user?.role === "Client" ||
            user?.role === "bidder/company representative/middleman") && (
            <>
              {user?.role === "bidder/company representative/middleman" &&
              selectedOrder?.status === "submitted_to_bd" ? (
                <>
                  <MenuItem
                    onClick={handleApproveToBD}
                    disabled={actionLoading}
                  >
                    Approve & Submit to Client
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRevisionDialogOpen(true);
                      handleActionMenuClose();
                    }}
                    disabled={actionLoading}
                  >
                    Request Revision
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDisputeDialogOpen(true);
                      handleActionMenuClose();
                    }}
                    disabled={actionLoading}
                  >
                    Dispute Order
                  </MenuItem>
                </>
              ) : selectedOrder?.status === "Disputed" ? (
                <MenuItem disabled>Order is Disputed</MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      setOrderCompletionModal(true);
                      handleActionMenuClose();
                    }}
                    disabled={actionLoading}
                  >
                    Approve & Complete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRevisionDialogOpen(true);
                      handleActionMenuClose();
                    }}
                    disabled={actionLoading}
                  >
                    Request Revision
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDisputeDialogOpen(true);
                      handleActionMenuClose();
                    }}
                    disabled={actionLoading}
                  >
                    Dispute Order
                  </MenuItem>
                </>
              )}
              <MenuItem onClick={handleActionMenuClose}>Cancel</MenuItem>
            </>
          )
        )}
      </Menu>

      {/* Order Submission Modal */}
      <Dialog
        open={submissionDialogOpen}
        onClose={handleCloseSubmissionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <div className="mb-4">
                <h6>Order Details</h6>
                <div className="d-flex justify-content-between">
                  <span>
                    Gig:{" "}
                    <strong>
                      {selectedOrder.gig?.title || "Custom Order"}
                    </strong>
                  </span>
                  <span>
                    Price:{" "}
                    <strong>
                      $
                      {selectedOrder.price
                        ? Number(selectedOrder.price).toFixed(2)
                        : "0.00"}
                    </strong>
                  </span>
                </div>
                <div className="mt-2">
                  <span>Due Date: </span>
                  <strong
                    className={
                      selectedOrder.due_date &&
                      new Date(selectedOrder.due_date) < new Date()
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {selectedOrder?.offer?.date ? formatDate(selectedOrder.offer.date) : "N/A"}
{selectedOrder?.offer?.date && new Date(selectedOrder.offer.date) < new Date() && " (Overdue)"}
                  </strong>
                </div>
                {selectedOrder.description && (
                  <div className="mt-2">
                    <span>Description: </span>
                    <small className="text-muted">
                      {selectedOrder.description}
                    </small>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Order Description *</label>
                <textarea
                  value={submissionMessage}
                  onChange={(e) => setSubmissionMessage(e.target.value)}
                  placeholder="Describe your completed work..."
                  rows={4}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Attach Files</label>
                <input
                  type="file"
                  multiple
                  onChange={handleOrderFileChange}
                  className="form-control"
                />
                <small className="text-muted">
                  Upload your deliverables (Any file type, Max 5GB per file)
                </small>
              </div>
              {orderFiles.length > 0 && (
                <div className="mb-3">
                  <h6>Selected Files ({orderFiles.length}):</h6>
                  {orderFiles.map((file, index) => {
                    const progress = uploadProgress[file.name];
                    const isUploading = progress && progress.percent < 100 && progress.status !== 'error';
                    const isError = progress && progress.status === 'error';
                    const isDone = progress && progress.percent === 100;
                    
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="d-flex flex-column p-2 border rounded mb-2"
                        style={{ borderColor: isError ? '#ef4444' : isDone ? '#10b981' : '#e5e7eb' }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="me-2 text-truncate" style={{ maxWidth: '70%' }}>
                            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isError ? '#ef4444' : isDone ? '#10b981' : '#3b82f6' }}>
                            {isError ? 'Failed' : isDone ? 'Uploaded ✓' : `${progress?.percent || 0}%`}
                          </span>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeOrderFile(index)}
                            disabled={submittingOrder}
                            sx={{ minWidth: 'auto', p: '2px 8px' }}
                          >
                            Remove
                          </Button>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={progress?.percent || 0}
                          color={isError ? 'error' : isDone ? 'success' : 'primary'}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSubmissionDialog}
            disabled={submittingOrder}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitOrder}
            variant="contained"
            disabled={
              submittingOrder || !submissionMessage.trim() || !selectedOrder || isAnyFileUploading
            }
          >
            {submittingOrder ? (
              <>
                <CircularProgress size={20} className="me-2" />
                Submitting...
              </>
            ) : isAnyFileUploading ? (
              "Waiting for files to upload..."
            ) : (
              "Submit Order"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Completion Modal */}
      <Dialog
        open={orderCompletionModal}
        onClose={() => setOrderCompletionModal(false)}
      >
        <DialogTitle>Complete Order</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to mark this order as completed?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will complete the order and prompt you to leave a
            review.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOrderCompletionModal(false)}
            disabled={completingOrder}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproveOrder}
            variant="contained"
            disabled={completingOrder}
          >
            {completingOrder ? (
              <>
                <CircularProgress size={20} className="me-2" />
                Completing...
              </>
            ) : (
              "Complete & Review"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Revision Modal */}
      <Dialog
        open={revisionDialogOpen}
        onClose={() => setRevisionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Request Revision</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide detailed instructions for the revision:
          </Typography>
          <textarea
            value={revisionInstructions}
            onChange={(e) => setRevisionInstructions(e.target.value)}
            placeholder="What changes are needed? Be specific about what you'd like to see different..."
            rows={4}
            className="form-control"
            required
            maxLength={500}
          />
          <small className="text-muted">
            {revisionInstructions.length}/500 characters
          </small>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRevisionDialogOpen(false);
              setRevisionInstructions("");
            }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequestRevision}
            variant="contained"
            disabled={actionLoading || !revisionInstructions.trim()}
          >
            {actionLoading ? (
              <>
                <CircularProgress size={20} className="me-2" />
                Requesting...
              </>
            ) : (
              "Request Revision"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dispute Order Modal */}
      <Dialog
        open={disputeDialogOpen}
        onClose={() => setDisputeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Dispute Order</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide the reason for disputing this order:
          </Typography>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Warning: Disputing an order will require admin intervention to
            resolve.
          </Typography>
          <textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="Why are you disputing this order? Please be specific about the issues..."
            rows={4}
            className="form-control"
            required
            maxLength={500}
          />
          <small className="text-muted">
            {disputeReason.length}/500 characters
          </small>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDisputeDialogOpen(false);
              setDisputeReason("");
            }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisputeOrder}
            variant="contained"
            color="error"
            disabled={actionLoading || !disputeReason.trim()}
          >
            {actionLoading ? (
              <>
                <CircularProgress size={20} className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit Dispute"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onClose={closeReviewModal}
        onSubmit={handleReviewSubmit}
        formData={reviewFormData}
        onInputChange={handleReviewInputChange}
        isSubmitting={isSubmittingReview}
        orderData={selectedOrder}
      />
      </div>
    </>
  );
};

export default Order;
