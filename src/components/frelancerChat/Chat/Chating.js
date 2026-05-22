import { Download, FileDownload, Handshake, Videocam } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import pLimit from "p-limit";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Rating,
  Typography,
} from "@mui/material";

import { IoMdAttach } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsMicFill, BsStopFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import moment from "moment";
import userImg from "../../../assets/chatImg.webp";
import DefaultImage from "../../../assets/default.webp";
import echo from "../../../echo";
import {
  AllBdOrders,
  OrderComplete,
  OrderSubmit,
  ReviewSubmit,
} from "../../../redux/slices/allOrderSlice";
import {
  clearMessages,
  createOrFindConversation,
  deleteMessageLocally,
  downloadAuthenticatedFile,
  downloadFileDirect,
  downloadFileDirectSimple,
  downloadWithIframe,
  downloadWithNewWindow,
  fetchMessages,
  handleTypingIndicator,
  markMessagesAsRead,
  sendMessage,
  setSelectedConversation,
  setUserOffline,
  setUserOnline,
} from "../../../redux/slices/messageSlice";
import {
  AcceptOfferRequest,
  CreateOfferRequest,
  RejectOfferRequest,
  getExperts,
  getOfferRequest,
  getPersonalGigs,
  inviteToJob,
} from "../../../redux/slices/offersSlice";
import axios from "../../../utils/axios";
import { BsCheck2, BsCheck2All } from "react-icons/bs";

// ─── THEME (GrapeTask Dark Theme) ────────────────────────────
const T = {
  mainBg: "var(--inbox-bg, #020617)",
  cardBg: "var(--inbox-surface, rgba(255, 255, 255, 0.02))",
  cardBgActive: "var(--inbox-hover, rgba(255, 255, 255, 0.04))",
  orange: "var(--inbox-primary, #f0591f)",
  orangeBorder: "var(--inbox-orange-border, rgba(240, 89, 31, 0.4))",
  white: "var(--inbox-text-main, #ffffff)",
  lightGray: "var(--inbox-text-muted, #d4d4d8)",
  midGray: "var(--inbox-text-light, #a1a1aa)",
  bodyGray: "var(--inbox-text-body, #71717a)",
  darkGray: "var(--inbox-border, rgba(255, 255, 255, 0.06))",
  border: "var(--inbox-border, rgba(255, 255, 255, 0.06))",
  borderMid: "var(--inbox-border-mid, rgba(255, 255, 255, 0.07))",
  senderBubble: "var(--inbox-primary, #f0591f)",
  receiverBubble: "var(--inbox-hover, rgba(255, 255, 255, 0.04))",
  inputBg: "var(--inbox-bg, #020617)",
  headerBg: "var(--inbox-surface, #0b1329)",
  surfaceBg: "var(--inbox-surface, #0b1329)",
};
// ──────────────────────────────────────────────────────────────────────────────

const canCommunicateDirectly = (
  senderRole,
  receiverRole,
  currentUserId,
  receiverId,
  conversationData,
) => {
  const isSenderClient = senderRole?.toLowerCase().includes("client");
  const isSenderExpert =
    senderRole?.toLowerCase().includes("expert") ||
    senderRole?.toLowerCase().includes("freelancer");
  const isSenderBD =
    senderRole?.toLowerCase().includes("bidder") ||
    senderRole?.toLowerCase().includes("representative") ||
    senderRole?.toLowerCase().includes("middleman");
  const isReceiverClient = receiverRole?.toLowerCase().includes("client");
  const isReceiverExpert =
    receiverRole?.toLowerCase().includes("expert") ||
    receiverRole?.toLowerCase().includes("freelancer");
  const isReceiverBD =
    receiverRole?.toLowerCase().includes("bidder") ||
    receiverRole?.toLowerCase().includes("representative") ||
    receiverRole?.toLowerCase().includes("middleman");
  if (isSenderBD || isReceiverBD) return true;
  if (
    (isSenderClient && isReceiverExpert) ||
    (isSenderExpert && isReceiverClient)
  ) {
    if (
      conversationData?.participants?.some(
        (p) =>
          p.role?.toLowerCase().includes("bidder") ||
          p.role?.toLowerCase().includes("representative") ||
          p.role?.toLowerCase().includes("middleman"),
      )
    )
      return true;
    return false;
  }
  return true;
};

// ─── FOLLOW SYSTEM RESTRICTIONS ─────────────────────────────────────────────
const canFollow = (followerRole, followingRole) => {
  const isFollowerClient = followerRole?.toLowerCase().includes("client");
  const isFollowerExpert = followerRole?.toLowerCase().includes("expert") || followerRole?.toLowerCase().includes("freelancer");
  const isFollowerBD = followerRole?.toLowerCase().includes("bidder") || followerRole?.toLowerCase().includes("middleman") || followerRole?.toLowerCase().includes("company representative");
  
  const isFollowingClient = followingRole?.toLowerCase().includes("client");
  const isFollowingExpert = followingRole?.toLowerCase().includes("expert") || followingRole?.toLowerCase().includes("freelancer");
  const isFollowingBD = followingRole?.toLowerCase().includes("bidder") || followingRole?.toLowerCase().includes("middleman") || followingRole?.toLowerCase().includes("company representative");
  
  // Block: Client ↔ Expert, Client ↔ Client
  if (isFollowerClient && isFollowingExpert) return false;
  if (isFollowerExpert && isFollowingClient) return false;
  if (isFollowerClient && isFollowingClient) return false;
  
  // Allow: All other combinations
  // Client ↔ BD, BD ↔ Client, BD ↔ BD, BD ↔ Expert, Expert ↔ BD, Expert ↔ Expert
  return true;
};

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
const ReviewModal = React.memo(
  ({ open, onClose, onSubmit, formData, onInputChange, isSubmitting, userRole, orderData }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = useMemo(
      () =>
        userRole === "Client"
          ? ["Rate Expert", "Rate Business Developer"]
          : ["Rate Expert"],
      [userRole],
    );
    const handleNext = useCallback(() => {
      if (currentStep < steps?.length - 1) setCurrentStep(currentStep + 1);
    }, [currentStep, steps?.length]);
    const handleBack = useCallback(() => {
      if (currentStep > 0) setCurrentStep(currentStep - 1);
    }, [currentStep]);
    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        currentStep === steps?.length - 1 ? onSubmit(e) : handleNext();
      },
      [currentStep, steps?.length, onSubmit, handleNext],
    );
    const isStepValid = useCallback(() => {
      switch (currentStep) {
        case 0:
          return (
            formData.expert_rating >= 1 &&
            formData.expert_rating <= 5 &&
            formData.expert_comment?.trim()?.length > 0
          );
        case 1:
          return (
            formData.bd_rating >= 1 &&
            formData.bd_rating <= 5 &&
            formData.bd_comment?.trim()?.length > 0
          );
        default:
          return false;
      }
    }, [currentStep, formData]);

    const renderRatingSection = (type, title, person, ratingField, commentField, placeholder) => (
      <div className="mb-4">
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img
              src={person?.image || DefaultImage}
              alt={title}
              width={60}
              height={60}
              className="rounded-circle me-3"
              style={{ objectFit: "cover", border: `2px solid ${T.orange}` }}
            />
            <div className="text-start">
              <h6 className="mb-1" style={{ color: T.white }}>{title}</h6>
              <p style={{ color: T.midGray, marginBottom: 0 }}>
                {person?.fname} {person?.lname}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" style={{ color: T.lightGray }}>
            How would you rate the {type}? *
          </label>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Rating
              name={ratingField}
              value={formData[ratingField]}
              onChange={(event, newValue) =>
                onInputChange({ target: { name: ratingField, value: newValue } })
              }
              size="large"
              icon={<StarIcon sx={{ fontSize: 40, color: T.orange }} />}
              emptyIcon={<StarBorderIcon sx={{ fontSize: 40, color: T.darkGray }} />}
            />
          </Box>
        </div>
        <div className="mb-3">
          <label htmlFor={commentField} className="form-label" style={{ color: T.lightGray }}>
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
              backgroundColor: T.cardBgActive,
              border: `1px solid ${T.borderMid}`,
              borderRadius: "8px",
              color: T.white,
              padding: "10px 14px",
              resize: "none",
              outline: "none",
            }}
          />
          <small style={{ color: T.bodyGray }}>{formData[commentField]?.length}/500 characters</small>
        </div>
      </div>
    );

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return renderRatingSection(
            "quality of work", "Rate the Expert", orderData?.seller,
            "expert_rating", "expert_comment",
            "How was the quality of work? Was it delivered on time?",
          );
        case 1:
          return renderRatingSection(
            "BD service", "Rate the Business Developer", orderData?.bd,
            "bd_rating", "bd_comment",
            "How was the communication? Did they help match you with the right expert?",
          );
        default:
          return null;
      }
    };

    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "50%" },
            maxHeight: "90vh",
            bgcolor: "#020617",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: "16px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            overflow: "auto",
            p: 4,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 style={{ color: "#ffffff", fontWeight: 600, marginBottom: 2 }}>Write Review</h5>
              <small style={{ color: "#a1a1aa" }}>
                Step {currentStep + 1} of {steps?.length}: {steps[currentStep]}
              </small>
            </div>
            <IconButton onClick={onClose} disabled={isSubmitting} sx={{ color: "#a1a1aa" }}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="mb-4">
            <div style={{
              height: "4px", borderRadius: "2px",
              backgroundColor: "rgba(255, 255, 255, 0.06)", overflow: "hidden",
            }}>
              <div style={{
                width: `${((currentStep + 1) / steps?.length) * 100}%`,
                height: "100%",
                backgroundColor: "#f0591f",
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="d-flex gap-2 justify-content-between mt-4">
              <div>
                {currentStep > 0 && (
                  <Button variant="outlined" onClick={handleBack} disabled={isSubmitting}
                    sx={{ borderColor: "rgba(255, 255, 255, 0.07)", color: "#d4d4d8", "&:hover": { borderColor: "#f0591f", color: "#f0591f" } }}>
                    Back
                  </Button>
                )}
              </div>
              <div className="d-flex gap-2">
                <Button variant="outlined" onClick={onClose} disabled={isSubmitting}
                  sx={{ borderColor: "rgba(255, 255, 255, 0.07)", color: "#d4d4d8", "&:hover": { borderColor: "#f0591f", color: "#f0591f" } }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained"
                  disabled={isSubmitting || !isStepValid()}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{ backgroundColor: "#f0591f", "&:hover": { backgroundColor: "#d94e18" }, borderRadius: "8px" }}>
                  {isSubmitting ? "Submitting..." : currentStep === steps?.length - 1 ? "Submit Review" : "Next"}
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

// ─── EXPERT SELECT ────────────────────────────────────────────────────────────
const ExpertSelect = ({ options, value, onChange, isLoading, placeholder = "Select an expert..." }) => {
  const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value]);
  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} style={{
      display: "flex", alignItems: "center",
      padding: "8px 12px", cursor: "pointer",
      backgroundColor: "transparent",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(240,89,31,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <img src={data.image || userImg} alt={label}
        style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
        onError={(e) => { e.target.onerror = null; e.target.src = userImg; }}
      />
      <span style={{ color: T.white }}>{label}</span>
    </div>
  );
  const CustomSingleValue = ({ innerProps, data }) => (
    <div {...innerProps} style={{ display: "flex", alignItems: "center", paddingLeft: "4px" }}>
      <img src={data.image || userImg} alt={data.label}
        style={{ width: "28px", height: "28px", borderRadius: "50%", marginRight: "8px", objectFit: "cover" }}
        onError={(e) => { e.target.onerror = null; e.target.src = userImg; }}
      />
      <span style={{ color: T.white }}>{data.label}</span>
    </div>
  );
  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(s) => onChange(s?.value || "")}
      isClearable
      isLoading={isLoading}
      isSearchable
      placeholder={<span style={{ color: T.bodyGray }}>{placeholder}</span>}
      noOptionsMessage={() => "No experts available"}
      className="basic-single"
      classNamePrefix="select"
      components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
      filterOption={(option, inputValue) => option.label.toLowerCase().includes(inputValue.toLowerCase())}
      menuPlacement="auto"
      menuPortalTarget={document.body}
      styles={{
        control: (base) => ({
          ...base, minHeight: "44px", borderRadius: "8px",
          backgroundColor: T.cardBgActive,
          border: `1px solid ${T.borderMid}`,
          boxShadow: "none",
          "&:hover": { borderColor: T.orange },
        }),
        menu: (base) => ({
          ...base, backgroundColor: T.surfaceBg, border: `1px solid ${T.borderMid}`,
          borderRadius: "10px", overflow: "hidden",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({ ...base, padding: "4px", maxHeight: "240px" }),
        input: (base) => ({ ...base, color: T.white }),
        singleValue: (base) => ({ ...base, color: T.white }),
        clearIndicator: (base) => ({ ...base, color: T.bodyGray, "&:hover": { color: T.orange } }),
        dropdownIndicator: (base) => ({ ...base, color: T.bodyGray }),
        indicatorSeparator: () => ({ display: "none" }),
      }}
    />
  );
};

// ─── DOWNLOAD ATTACHMENTS ─────────────────────────────────────────────────────
const DownloadAttachments = ({ offer, hasDeliveryAttachment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => { if (event.key === "Escape") setIsOpen(false); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const constructFileUrl = (filePath) => {
    const pathParts = filePath.split("/");
    if (pathParts?.length < 2) return null;
    return `/files/${pathParts[0]}/${pathParts[pathParts?.length - 1]}`;
  };

  const downloadFile = async (file) => {
    try {
      toast.info(`Starting download: ${file.name}`, { autoClose: 2000, hideProgressBar: true });

      const baseUrl = axios.defaults.baseURL ? axios.defaults.baseURL.replace(/\/api\/?$/, "") : "https://portal.grapetask.co";
      const directDownloadUrl = file.path.startsWith("http://") || file.path.startsWith("https://") 
        ? file.path 
        : `${baseUrl}/${file.path.startsWith("/") ? file.path.substring(1) : file.path}`;

      try {
        const response = await fetch(directDownloadUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = file.name || "download";
        document.body.appendChild(link); link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (fetchError) {
        console.log("Fetch download failed (likely CORS), falling back to new tab:", fetchError);
        window.open(directDownloadUrl, "_blank");
      }
    } catch (error) { 
      alert(`Download failed: ${error.message}`); 
    }
  };

  const handleDownloadAll = async () => {
    for (const file of offer.order.delivery_attachments) {
      await downloadFile(file);
      await new Promise((r) => setTimeout(r, 100));
    }
  };

  const formatFileName = (name, maxLength = 30) => {
    if (!name) return "Unknown file";
    if (name?.length <= maxLength) return name;
    const ext = name.split(".").pop();
    const base = name.slice(0, name.lastIndexOf("."));
    return `${base.slice(0, maxLength - ext.length - 4)}...${ext}`;
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return "📄";
    const ext = fileName.split(".").pop()?.toLowerCase();
    const map = { pdf: "📄", doc: "📝", docx: "📝", txt: "📄", jpg: "🖼️", jpeg: "🖼️", png: "🖼️", gif: "🖼️", zip: "📦", rar: "📦" };
    return map[ext] || "📄";
  };

  if (!hasDeliveryAttachment || !offer.order?.delivery_attachments?.length) return null;
  const attachments = offer.order.delivery_attachments;
  const multipleFiles = attachments.length > 1;

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Button
        ref={buttonRef}
        variant="outlined"
        size="small"
        startIcon={<FileDownload />}
        endIcon={multipleFiles ? (
          <ExpandMoreIcon sx={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
        ) : null}
        onClick={() => { if (multipleFiles) setIsOpen(!isOpen); else downloadFile(attachments[0]); }}
        sx={{
          borderColor: T.borderMid, color: T.lightGray, borderRadius: "10px",
          textTransform: "none", fontWeight: 500,
          "&:hover": { backgroundColor: T.cardBgActive, borderColor: T.orange, color: T.orange },
        }}
      >
        Download {multipleFiles ? "Files" : "File"}
      </Button>

      {multipleFiles && (
        <Paper
          ref={dropdownRef}
          sx={{
            display: isOpen ? "block" : "none",
            position: "absolute", top: "110%", left: 0, zIndex: 1000,
            backgroundColor: T.surfaceBg,
            border: `1px solid ${T.borderMid}`,
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            minWidth: "250px", maxWidth: "350px", maxHeight: "300px",
            overflowY: "auto", padding: 0,
          }}
        >
          <Box sx={{
            padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: T.white }}>
              {attachments.length} Files Available
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button size="small" variant="text" onClick={handleDownloadAll}
                sx={{ fontSize: "0.75rem", textTransform: "none", color: T.orange, "&:hover": { backgroundColor: "rgba(240,89,31,0.1)" } }}>
                Download All
              </Button>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: T.bodyGray }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ padding: "8px 0" }}>
            {attachments.map((file, index) => (
              <Box key={index} component="button" onClick={() => downloadFile(file)}
                sx={{
                  display: "flex", alignItems: "center", gap: 2,
                  padding: "10px 16px", fontSize: "0.875rem", color: T.lightGray,
                  backgroundColor: "transparent", border: "none",
                  width: "100%", textAlign: "left", cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": { backgroundColor: T.cardBgActive, color: T.white },
                }}
              >
                <span style={{ fontSize: "1.2rem", minWidth: "20px" }}>{getFileIcon(file.name)}</span>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{
                    fontWeight: 500, color: T.lightGray,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{formatFileName(file.name)}</Typography>
                  {file.size && (
                    <Typography variant="caption" sx={{ color: T.bodyGray, display: "block" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                  )}
                </Box>
                <Download sx={{ fontSize: "1rem", color: T.bodyGray }} />
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

// ─── CUSTOM WHATSAPP AUDIO PLAYER ─────────────────────────────────────────────
const WhatsAppAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    let d = audioRef.current.duration;
    if (d === Infinity || isNaN(d)) {
      // Workaround for Chrome WebM duration bug
      audioRef.current.currentTime = 1e101;
      audioRef.current.addEventListener('timeupdate', function getDuration() {
        setDuration(audioRef.current.duration);
        audioRef.current.currentTime = 0;
        audioRef.current.removeEventListener('timeupdate', getDuration);
      });
    } else {
      setDuration(d);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "24px",
      padding: "8px 16px",
      minWidth: "260px",
      maxWidth: "320px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    }}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          backgroundColor: "#f0591f",
          border: "none",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(240,89,31,0.4)",
          transition: "transform 0.1s, background-color 0.2s",
          flexShrink: 0
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#d94e18"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f0591f"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Progress Slider & Time info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: "100%",
            accentColor: "#f0591f",
            cursor: "pointer",
            height: "4px",
            borderRadius: "2px",
            margin: 0
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#a1a1aa", fontWeight: 500 }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Custom Waveform icon / Microphone decorator */}
      <span style={{ fontSize: "16px", color: "#f0591f", opacity: 0.8, flexShrink: 0 }}>🎙️</span>
    </div>
  );
};

// ─── BATCH MESSAGE OPTIONS DROPDOWN COMPONENT (WhatsApp Style) ─────────────────
const BatchMessageOptions = ({ msg, isSender, activeDropdownMsgId, setActiveDropdownMsgId, onDeleteMessage, onDeleteBatch, isBatch, batchMessages, T, getFileUrl }) => {
  const isOpen = activeDropdownMsgId === msg.id;
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showDeleteSelection, setShowDeleteSelection] = useState(false);

  // If in selection mode, show which items are selected
  const isItemSelected = (msgId) => selectedForDelete.includes(msgId);

  const toggleItemSelection = (msgId) => {
    if (isItemSelected(msgId)) {
      setSelectedForDelete(prev => prev.filter(id => id !== msgId));
    } else {
      setSelectedForDelete(prev => [...prev, msgId]);
    }
  };

  // Get selected count text
  const getSelectedCount = () => {
    const count = selectedForDelete.length;
    return count > 0 ? `(${count})` : '';
  };

  return (
    <div style={{ position: "relative", marginRight: 8 }}>
      {/* 3-dots button */}
      {!showDeleteSelection && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdownMsgId(isOpen ? null : msg.id);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            opacity: 0.6,
            color: isSender ? "rgba(255,255,255,0.8)" : "#666",
          }}
        >
          <BsThreeDotsVertical size={16} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && !showDeleteSelection && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: "200px",
            zIndex: 1000,
            padding: "8px 0",
          }}
        >
          {/* Delete for Everyone */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isBatch && batchMessages.length > 1) {
                // Show selection UI for batch
                setShowDeleteSelection(true);
                setActiveDropdownMsgId(null);
              } else {
                onDeleteMessage(msg.id, 'everyone');
                setActiveDropdownMsgId(null);
              }
            }}
            style={{
              width: "100%",
              padding: "10px 16px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🗑️</span>
            {isBatch ? `Delete for Everyone (${batchMessages.length})` : "Delete for Everyone"}
          </button>

          {/* Delete for Me */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isBatch && batchMessages.length > 1) {
                setShowDeleteSelection(true);
                setActiveDropdownMsgId(null);
              } else {
                onDeleteMessage(msg.id, 'me');
                setActiveDropdownMsgId(null);
              }
            }}
            style={{
              width: "100%",
              padding: "10px 16px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🗑️</span>
            {isBatch ? `Delete for Me (${batchMessages.length})` : "Delete for Me"}
          </button>

          {/* Cancel */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdownMsgId(null);
            }}
            style={{
              width: "100%",
              padding: "10px 16px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#666",
              borderTop: "1px solid #eee",
              marginTop: "4px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Delete Selection Mode */}
      {showDeleteSelection && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => setShowDeleteSelection(false)}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#fff", margin: 0, fontSize: "18px" }}>
              Select to Delete {getSelectedCount()}
            </h3>
            <button
              onClick={() => setShowDeleteSelection(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Grid of items */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {batchMessages.map((batchMsg) => (
              <div
                key={batchMsg.id}
                onClick={() => toggleItemSelection(batchMsg.id)}
                style={{
                  aspectRatio: "1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  border: isItemSelected(batchMsg.id) ? "3px solid #00A884" : "3px solid transparent",
                }}
              >
                {batchMsg.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={getFileUrl(batchMsg.file_path)}
                    alt={batchMsg.file_name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : batchMsg.file_name?.match(/\.(mp4|webm|mov|ogg|quicktime|m4v|3gp)$/i) ? (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#1a1a1a", position: "relative" }}>
                    <video src={getFileUrl(batchMsg.file_path)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "4px", right: "4px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>▶</div>
                  </div>
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>📄</div>
                )}
                
                {/* Checkmark for selected */}
                {isItemSelected(batchMsg.id) && (
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#00A884",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                  }}>✓</div>
                )}
              </div>
            ))}
          </div>

          {/* Footer with delete buttons */}
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "16px",
              display: "flex",
              gap: "12px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                if (selectedForDelete.length > 0) {
                  onDeleteBatch(selectedForDelete, 'me');
                }
                setShowDeleteSelection(false);
                setSelectedForDelete([]);
              }}
              disabled={selectedForDelete.length === 0}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: selectedForDelete.length > 0 ? "#333" : "#222",
                color: selectedForDelete.length > 0 ? "#fff" : "#666",
                border: "none",
                borderRadius: "8px",
                cursor: selectedForDelete.length > 0 ? "pointer" : "not-allowed",
                fontSize: "14px",
              }}
            >
              Delete for Me {getSelectedCount()}
            </button>
            <button
              onClick={() => {
                if (selectedForDelete.length > 0) {
                  onDeleteBatch(selectedForDelete, 'everyone');
                }
                setShowDeleteSelection(false);
                setSelectedForDelete([]);
              }}
              disabled={selectedForDelete.length === 0}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: selectedForDelete.length > 0 ? "#FF6B6B" : "#442222",
                color: selectedForDelete.length > 0 ? "#fff" : "#666",
                border: "none",
                borderRadius: "8px",
                cursor: selectedForDelete.length > 0 ? "pointer" : "not-allowed",
                fontSize: "14px",
              }}
            >
              Delete for Everyone {getSelectedCount()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MESSAGE OPTIONS DROPDOWN COMPONENT ───────────────────────────────────────
const MessageOptions = ({ msg, isSender, activeDropdownMsgId, setActiveDropdownMsgId, onDeleteMessage, T }) => {
  const isOpen = activeDropdownMsgId === msg.id;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", margin: "0 8px", alignSelf: "center" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdownMsgId(isOpen ? null : msg.id);
        }}
        style={{
          background: "none",
          border: "none",
          color: T.bodyGray,
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        ⋮
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: isSender ? 0 : "auto",
          left: isSender ? "auto" : 0,
          backgroundColor: "var(--inbox-card-bg, #0f172a)",
          border: "1px solid var(--inbox-border, rgba(255, 255, 255, 0.08))",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          zIndex: 100,
          minWidth: "140px",
          overflow: "hidden",
          marginTop: "4px"
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteMessage(msg.id, 'me');
              setActiveDropdownMsgId(null);
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              textAlign: "left",
              background: "none",
              border: "none",
              color: "var(--inbox-text-main, #ffffff)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.2s",
              display: "block"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            🗑️ Delete for me
          </button>
          {isSender && msg.message_type !== "deleted" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMessage(msg.id, 'everyone');
                setActiveDropdownMsgId(null);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "13px",
                cursor: "pointer",
                transition: "background 0.2s",
                display: "block"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              🚫 Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN CHATTING COMPONENT ──────────────────────────────────────────────────
const Chatting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const iframeLoadCount = useRef(0);

  const { personalGigs, experts, isLoadingExperts } = useSelector((state) => state.offers);
  const { selectedConversation, messages, loading, typingUsers, onlineUsers } = useSelector((s) => s.message);
  const { offers } = useSelector((s) => s.offers);
  
  const bdOrders = useSelector((state) => state.allOrder?.bdOrders || []);
  const isLoadingBdOrders = useSelector((state) => state.allOrder?.isLoading ?? true);

  useEffect(() => {
    if (scrollRef.current && messages && messages.length > 0) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const readUserData = () => {
      try { setCurrentUser(JSON.parse(localStorage.getItem("UserData")) || {}); }
      catch { setCurrentUser({}); }
    };
    if ("requestIdleCallback" in window) requestIdleCallback(readUserData, { timeout: 0 });
    else setTimeout(readUserData, 0);
  }, []);

  const [chatWallpaper, setChatWallpaper] = useState(() => localStorage.getItem("chatWallpaper") || "default");
  const [chatFontSize, setChatFontSize] = useState(() => localStorage.getItem("chatFontSize") || "medium");

  useEffect(() => {
    const handleUserDataChanged = (e) => {
      setCurrentUser(e.detail);
    };
    const handleWallpaperChange = (e) => {
      setChatWallpaper(e.detail);
    };
    const handleFontSizeChange = (e) => {
      setChatFontSize(e.detail);
    };

    window.addEventListener("userDataChanged", handleUserDataChanged);
    window.addEventListener("chatWallpaperChanged", handleWallpaperChange);
    window.addEventListener("chatFontSizeChanged", handleFontSizeChange);

    return () => {
      window.removeEventListener("userDataChanged", handleUserDataChanged);
      window.removeEventListener("chatWallpaperChanged", handleWallpaperChange);
      window.removeEventListener("chatFontSizeChanged", handleFontSizeChange);
    };
  }, []);

  const getBubbleFontSize = () => {
    if (chatFontSize === "small") return "12px";
    if (chatFontSize === "large") return "17.5px";
    return "14.2px"; // default medium
  };

  const UserRole = currentUser?.role;
  const userId = currentUser?.id;

  const receiver =
    selectedConversation?.user ||
    selectedConversation?.users?.find((u) => u.id !== currentUser.id);
  const receiverId = receiver?.id;
  const receiverRole = receiver?.role;

  const isCommunicationAllowed = useMemo(() => {
    if (!receiverId || !receiverRole) return true;
    return canCommunicateDirectly(UserRole, receiverRole, userId, receiverId, selectedConversation);
  }, [UserRole, receiverRole, userId, receiverId, selectedConversation]);

  const [inputVal, setInputVal] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // Multiple images support
  const [currentBatchId, setCurrentBatchId] = useState(null); // For grouping multiple media
  const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
  const [showMembersListModal, setShowMembersListModal] = useState(false);
  const [activeDropdownMsgId, setActiveDropdownMsgId] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  // ── Attachment popup + Camera states ──
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' = front, 'environment' = back
  const [cameraMode, setCameraMode] = useState('photo'); // 'photo' | 'video'
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const videoMediaRecorderRef = useRef(null);
  const videoRecordingIntervalRef = useRef(null);
  const videoChunksRef = useRef([]);
  
  // ── Voice Recording States ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordingIntervalRef = useRef(null);
  const isCancelledRef = useRef(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const touchStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [activeCallRoom, setActiveCallRoom] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [securityWarningText, setSecurityWarningText] = useState("");
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const activeThumbnailRef = useRef(null);
  const [mediaPreviewFiles, setMediaPreviewFiles] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaCaption, setMediaCaption] = useState("");

  // ── WhatsApp Style Emoji/GIF/Stickers Panel ──
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState('emoji'); // 'emoji' | 'gif' | 'stickers'
  const [gifs, setGifs] = useState([]);
  const [gifSearch, setGifSearch] = useState('');
  const [stickers, setStickers] = useState([
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
    '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '👍', '👎', '👏', '🙌', '🤝', '🤞', '✌️', '🤟', '🤘', '👌',
  ]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const emojiPanelRef = useRef(null);
  const tabsPanelRef = useRef(null);

  // Sample GIFs for demo (working URLs)
  const sampleGifs = useMemo(() => [
    { id: '1', url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGtxaXl0dWswbXNubDc5aWtxOHB4dGZ5d2RneXhlNHZkdGZydnJ4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyE/giphy.gif', title: 'Hello' },
    { id: '2', url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnlocWJtZWZyYzlhZGR4aWltcTJkZ2U1eW15cXU3ZDRtZzhiZ3B0ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif', title: 'Thumbs Up' },
    { id: '3', url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGZ5dWw1a2l6d2x1bHVsdWh2eWk2dHZtbnJ6d3h3eGZ5Y2d5aGJ0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKDMPKsTyss9zHy/giphy.gif', title: 'Happy' },
    { id: '4', url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWx0aHh3bWloaGV0bGZ0eGJkdmF4aWx5eW14dHV1eWZ5ZGV5aGJ0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNDKGNf2v2UKUU/giphy.gif', title: 'Love' },
    { id: '5', url: 'https://media.giphy.com/media/tIeCLkJ8o0Zuo/giphy.gif', title: 'Laugh' },
    { id: '6', url: 'https://media.giphy.com/media/26gsjCZpPolPr3SFq/giphy.gif', title: 'Cool' },
  ], []);

  // Fetch GIFs from Giphy API
  const fetchGifs = useCallback(async (query = 'trending') => {
    setIsLoadingGifs(true);
    try {
      // Use sample GIFs for now (API key issues)
      setTimeout(() => {
        setGifs(sampleGifs.map(gif => ({
          id: gif.id,
          title: gif.title,
          images: {
            fixed_height_small: { url: gif.url },
            fixed_height_small_still: { url: gif.url }
          }
        })));
        setIsLoadingGifs(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      setGifs([]);
      setIsLoadingGifs(false);
    }
  }, [sampleGifs]);

  // Load trending GIFs when GIF tab opens
  useEffect(() => {
    if (showEmojiPanel && activePanelTab === 'gif') {
      if (gifs.length === 0) {
        fetchGifs('trending');
      }
    }
  }, [showEmojiPanel, activePanelTab, fetchGifs, gifs.length]);

  // Show tabs panel when input is focused
  const [showTabsPanel, setShowTabsPanel] = useState(false);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inputContainer = document.querySelector('.chat-input-container');

      // Check if click is inside any of our panels
      const isInsideEmojiPanel = emojiPanelRef.current && emojiPanelRef.current.contains(e.target);
      const isInsideTabsPanel = tabsPanelRef.current && tabsPanelRef.current.contains(e.target);
      const isInsideInput = inputContainer && inputContainer.contains(e.target);

      // Don't close if clicking inside any panel or input
      if (isInsideEmojiPanel || isInsideTabsPanel || isInsideInput) {
        return;
      }

      // Close everything if clicking outside
      setShowTabsPanel(false);
      setShowEmojiPanel(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPanel, showTabsPanel]);

  // Send GIF as message (using text type with GIF URL)
  const sendGif = useCallback(async (gifUrl) => {
    if (!receiverId || !isCommunicationAllowed) {
      toast.error("Cannot send message to this user");
      return;
    }
    if (!gifUrl) {
      toast.error("Invalid GIF");
      return;
    }
    try {
      // Send as text message with GIF URL
      const messageData = {
        receiver_id: receiverId,
        message: gifUrl,
      };
      await dispatch(sendMessage(messageData)).unwrap();
      toast.success("GIF sent!");
      setShowEmojiPanel(false);
    } catch (err) {
      toast.error(err || "Failed to send GIF");
    }
  }, [receiverId, isCommunicationAllowed, dispatch]);

  // Add emoji to input (instead of sending directly)
  const addEmojiToInput = useCallback((emoji) => {
    setInputVal(prev => prev + emoji);
    // Keep panel open so user can add more emojis
    // User will type message and press send manually
  }, []);

  // Send sticker as message (large emoji)
  const sendSticker = useCallback(async (emoji) => {
    if (!receiverId || !isCommunicationAllowed) {
      toast.error("Cannot send message to this user");
      return;
    }
    try {
      // Send sticker as a separate large message
      const messageData = {
        receiver_id: receiverId,
        message: emoji,
      };
      await dispatch(sendMessage(messageData)).unwrap();
      toast.success("Sticker sent!");
    } catch (err) {
      toast.error(err || "Failed to send sticker");
    }
  }, [receiverId, isCommunicationAllowed, dispatch]);

  useEffect(() => {
    let recognition = null;
    if (activeCallRoom) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const lastResultIndex = event.results.length - 1;
          const transcript = event.results[lastResultIndex]?.[0]?.transcript;
          if (transcript?.trim()) {
            const violation = detectPersonalInfo(transcript);
            
            axios.post('/call-flags', {
              conversation_id: selectedConversation?.id || null,
              transcript: transcript,
              violation_type: violation || "Clean"
            }).catch(err => console.error("Error logging call: ", err));

            if (violation) {
              setActiveCallRoom(null);
              setSecurityWarningText(`Your ongoing voice call has been terminated because our system detected that you were sharing "${violation}" details. This is a severe violation of GrapeTask safety policies. Your account has been flagged, and a security audit report has been submitted to the administration. Repeating this violation will lead to an immediate and permanent account suspension.`);
            }
          }
        };

        recognition.onstart = () => {
          console.log("Speech recognition session started.");
        };

        recognition.onerror = (e) => {
          console.error("Speech Recognition Error: ", e);
          toast.warning(`Speech Recognition Warning: ${e.error}`);
        };

        recognition.onend = () => {
          if (activeCallRoom && recognition) {
            setTimeout(() => {
              try {
                if (activeCallRoom && recognition) {
                  recognition.start();
                }
              } catch (err) {
                console.error("Failed to restart speech recognition:", err);
              }
            }, 3000);
          }
        };

        try {
          recognition.start();
        } catch (e) {
          console.error("Speech recognition start failed:", e);
        }
      }
    }

    return () => {
      if (recognition) {
        recognition.onend = null;
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [activeCallRoom, selectedConversation]);

  useEffect(() => {
    if (activeCallRoom) {
      iframeLoadCount.current = 0;
      setShowIframe(false);
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowIframe(false);
    }
  }, [activeCallRoom]);

  const handleIframeLoad = () => {
    iframeLoadCount.current += 1;
    if (iframeLoadCount.current > 1) {
      setActiveCallRoom(null);
    }
  };



  const handleStartCall = async () => {
    if (!selectedConversation) return;

    const generatedRoomName = `grapetask-call-${selectedConversation.id}-${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await dispatch(sendMessage({
        conversation_id: selectedConversation.id,
        receiver_id: receiverId || null,
        message: generatedRoomName,
        message_type: "call"
      })).unwrap();

      setActiveCallRoom(generatedRoomName);
    } catch (err) {
      toast.error("Failed to start video call.");
    }
  };

  // ── Camera Functions ────────────────────────────────────────────────────────
  const openCamera = async () => {
    setCapturedPhoto(null);
    setRecordedVideo(null);
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: cameraMode === 'video' // Enable audio for video mode
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      toast.error("Could not access camera. Please allow camera permission.");
      setShowCameraModal(false);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setCapturedPhoto(null);
    setShowCameraModal(false);
  };

  const flipCamera = async () => {
    const newFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(newFacing);
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      toast.error("Could not flip camera.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (cameraFacing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhoto(dataUrl);
  };

  const sendCapturedPhoto = () => {
    if (!capturedPhoto) return;
    const blob = dataURLtoBlob(capturedPhoto);
    const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
    setSelectedFile(file);
    setFilePreview(capturedPhoto);
    closeCamera();
  };

  // ── Video Recording Functions ───────────────────────────────────────────────
  const startVideoRecording = () => {
    if (!cameraStream) return;
    
    videoChunksRef.current = [];
    
    // Try different mime types for better compatibility
    let mimeType = 'video/webm';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
      mimeType = 'video/webm;codecs=h264';
    }
    
    const mediaRecorder = new MediaRecorder(cameraStream, {
      mimeType: mimeType,
      videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
    });
    
    videoMediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo({ url: videoUrl, blob: videoBlob });
    };
    
    mediaRecorder.start(100);
    setIsRecordingVideo(true);
    setVideoRecordingTime(0);
    
    // Timer
    videoRecordingIntervalRef.current = setInterval(() => {
      setVideoRecordingTime(prev => prev + 1);
    }, 1000);
  };
  
  const stopVideoRecording = () => {
    if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state !== 'inactive') {
      videoMediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
    setVideoRecordingTime(0);
    if (videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
  };
  
  const cancelVideoRecording = () => {
    if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state !== 'inactive') {
      videoMediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
    setRecordedVideo(null);
    if (videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
    videoChunksRef.current = [];
  };
  
  const sendRecordedVideo = () => {
    if (!recordedVideo) return;
    const file = new File([recordedVideo.blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
    setSelectedFile(file);
    setFilePreview(recordedVideo.url);
    closeCamera();
  };
  
  const formatVideoTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };


  useEffect(() => {
    const closeDropdown = (e) => {
      // If user clicked the attach button or inside attach menu, don't auto-close
      if (e.target.closest('.wa-attach-btn') || e.target.closest('.wa-attach-container')) {
        return;
      }
      setActiveDropdownMsgId(null);
      setShowHeaderMenu(false);
      setShowAttachMenu(false);
    };
    window.addEventListener("click", closeDropdown, true);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const handleClearChat = async () => {
    if (!selectedConversation) return;
    
    const result = await Swal.fire({
      title: 'Clear Chat?',
      text: "Are you sure you want to clear all messages? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f0591f',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, clear it!',
      background: T.headerBg,
      color: T.white,
      customClass: {
        popup: 'swal2-dark-custom'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.post('/messages/clear', {
          conversation_id: selectedConversation.id
        });
        dispatch(clearMessages());
        toast.success("Chat cleared successfully.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to clear chat.");
      }
    }
  };

  const handleDeleteMessage = async (messageId, deleteType) => {
    try {
      await axios.post('/messages/delete', {
        message_id: messageId,
        delete_type: deleteType
      });
      dispatch(deleteMessageLocally({ messageId, deleteType }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete message.");
    }
  };

  const handleDeleteBatch = async (messageIds, deleteType) => {
    try {
      for (const messageId of messageIds) {
        await axios.post('/messages/delete', {
          message_id: messageId,
          delete_type: deleteType
        });
        dispatch(deleteMessageLocally({ messageId, deleteType }));
      }
      toast.success(`${messageIds.length} item(s) deleted successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete messages.");
    }
  };

  const shouldRedactText = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase();

    // 1. Email check
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    if (emailRegex.test(text)) {
      return true;
    }

    // 1.5. Handle check (e.g. @username)
    const handleRegex = /@([a-zA-Z0-9._]{2,})/i;
    if (handleRegex.test(text)) {
      return true;
    }

    // 2. Forbidden keywords check
    const forbiddenKeywords = [
      'whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me',
      'telegram', 'skype', 'imo', 'viber', 'wechat',
      'phone number', 'mobile number', 'contact number', 'phone no', 'mobile no',
      'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe',
      'call me', 'contact me on', 'baat karein', 'direct client'
    ];
    for (const keyword of forbiddenKeywords) {
      if (normalized.includes(keyword)) {
        return true;
      }
    }

    // 3. Spelled-out numbers map & digits count
    const wordsMap = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };
    let textWithDigits = normalized;
    Object.keys(wordsMap).forEach(word => {
      textWithDigits = textWithDigits.replaceAll(word, wordsMap[word]);
    });

    // Clean dates
    let cleanText = textWithDigits.replace(/\b\d{4}[-/]\d{2}[-/]\d{2}\b/g, '');
    cleanText = cleanText.replace(/\b\d{2}[-/]\d{2}[-/]\d{4}\b/g, '');
    cleanText = cleanText.replace(/[#$€£]\d+/g, '');

    // Strip everything except digits and count
    const digitsOnly = cleanText.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) {
      return true;
    }

    return false;
  };

  const renderMessageText = (text) => {
    if (!text) return "";

    if (shouldRedactText(text)) {
      return (
        <span style={{ fontStyle: "italic", fontSize: "13.5px", fontWeight: 500, opacity: 0.9 }}>
          🚫 [Content Blocked: Contact Info Violation]
        </span>
      );
    }

    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const parts = text.split(urlRegex);
    if (parts.length === 1) return text;
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#38bdf8",
              textDecoration: "underline",
              wordBreak: "break-all",
              fontWeight: 500
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleStartPersonalChat = async (targetUser) => {
    try {
      const response = await dispatch(createOrFindConversation({ receiver_id: targetUser.id })).unwrap();
      if (response?.conversation) {
        dispatch({ type: "message/setSelectedConversation", payload: response.conversation });
        setSelectedMemberProfile(null);
        setShowMembersListModal(false);
      }
    } catch (error) {
      toast.error("Failed to start personal chat.");
    }
  };

  const getFileUrl = useCallback((filePath) => {
    if (!filePath) return "";
    const baseUrl = window.location.origin.replace(":3000", ":8000");
    const cleanPath = filePath.replace("public/", "");
    const token = localStorage.getItem("accessToken");
    return `${baseUrl}/api/messages/file/${cleanPath}?token=${token}`;
  }, []);

  const formatRoleForDisplay = (role) => {
    if (!role) return "";
    const low = role.toLowerCase();
    if (low.includes("bidder") || low.includes("representative") || low.includes("middleman") || low === "bd") {
      return "BD";
    }
    if (low.includes("expert") || low.includes("freelancer")) {
      return "Expert";
    }
    if (low.includes("client") || low.includes("buyer")) {
      return "Client";
    }
    if (low.includes("admin")) {
      return "Admin";
    }
    return role;
  };

  // WhatsApp-style Chat Wallpaper Functions
  const getChatBackground = () => {
    const customUrl = localStorage.getItem("customWallpaperUrl");
    
    if (chatWallpaper === "custom" && customUrl) {
      return "transparent";
    }
    
    const colors = {
      default: "#e5ddd5",
      dark: "#0f1419",
      blue: "#e3f2fd",
      green: "#e8f5e9",
      purple: "#f3e5f5",
      pink: "#fce4ec",
      orange: "#fff3e0",
      gray: "#f5f5f5"
    };
    
    return colors[chatWallpaper] || colors.default;
  };

  const getChatBackgroundImage = () => {
    const customUrl = localStorage.getItem("customWallpaperUrl");
    
    if (chatWallpaper === "custom" && customUrl) {
      return `url(${customUrl})`;
    }
    
    // WhatsApp-style subtle patterns
    const patterns = {
      default: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      dark: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      blue: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a90e2' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      green: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234caf50' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      purple: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239c27b0' fill-opacity='0.05'%3E%3Cpath d='M11 11h2v2h-2v-2zm8 0h2v2h-2v-2zm-8 8h2v2h-2v-2zm8 0h2v2h-2v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      pink: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e91e63' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM0 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S0 25.523 0 20zm20 0c0-5.523-4.477-10-10-10S0 14.477 0 20s4.477 10 10 10 10-4.477 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      orange: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9800' fill-opacity='0.05'%3E%3Cpath d='M2 2h4v4H2V2zm4 4h4v4H6V6zm4-4h4v4h-4V2zm8 4h4v4h-4V6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      gray: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23607d8b' fill-opacity='0.05'%3E%3Cpath d='M1 1h2v2H1V1zm4 4h2v2H5V5zm4-4h2v2H9V1zm4 4h2v2h-2V5zm4-4h2v2h-2V1zm4 4h2v2h-2V5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    };
    
    return patterns[chatWallpaper] || patterns.default;
  };

  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [description, setDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [offerExpertId, setOfferExpertId] = useState("");
  const [assignExpertId, setAssignExpertId] = useState("");
  const [gigRadio, setGigRadio] = useState("");
  const [offerLoader, setOfferLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderSubmissionModal, setOrderSubmissionModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [orderFiles, setOrderFiles] = useState([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [orderCompletionModal, setOrderCompletionModal] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(false);
  const [offerDetailsModal, setOfferDetailsModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("fast-checkout");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({ username: "", email: "", password: "", amount: "", file: null });
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState({ bdOrderId: "", assignmentNotes: "" });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ expert_rating: 0, expert_comment: "", bd_rating: 0, bd_comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toastState, setToastState] = useState({ show: false, message: "", type: "success" });
  const [bdActionLoading, setBdActionLoading] = useState(false);
  const [revisionDialogOpen, setRevisionDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [revisionInstructions, setRevisionInstructions] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [selectedOfferForBd, setSelectedOfferForBd] = useState(null);
  
  // Custom Link Order state
  const [linkOrderModalOpen, setLinkOrderModalOpen] = useState(false);
  const [linkOrderId, setLinkOrderId] = useState("");
  const [linkOrderNotes, setLinkOrderNotes] = useState("");
  const location = useLocation();
  const linkExpertId = location.state?.linkExpertId;

  const isFreelancer = useMemo(() =>
    currentUser.role?.toLowerCase().includes("expert/freelancer") ||
    currentUser.role?.toLowerCase().includes("freelancer"),
    [currentUser.role]);

  const isBd = useMemo(() =>
    currentUser.role?.toLowerCase().includes("bidder/company representative/middleman") ||
    currentUser.role?.toLowerCase().includes("middleman") ||
    currentUser.role?.toLowerCase().includes("company representative"),
    [currentUser.role]);

  const isClient = useMemo(() =>
    currentUser.role?.toLowerCase().includes("client") ||
    currentUser.user_type?.toLowerCase().includes("client"),
    [currentUser.role, currentUser.user_type]);

  const expertOptions = useMemo(() =>
    experts?.map((ex) => ({ value: String(ex.id), label: `${ex.fname} ${ex.lname}`, image: ex.image })) || [],
    [experts]);

  const isReceiverOnline = useMemo(() => {
    if (!receiverId) return false;
    const statusInRedux = onlineUsers ? onlineUsers[receiverId] : undefined;
    if (statusInRedux === "online" || statusInRedux === true) return true;
    if (statusInRedux === "offline") return false;

    // Fallback: check if receiver's last_seen from DB is within 5 minutes
    if (receiver?.last_seen) {
      const lastSeenMoment = receiver.last_seen.includes('Z') || receiver.last_seen.includes('+')
        ? moment(receiver.last_seen)
        : moment.utc(receiver.last_seen);
      const diffMinutes = Math.abs(moment().diff(lastSeenMoment, 'minutes'));
      return diffMinutes < 5;
    }
    return false;
  }, [receiverId, onlineUsers, receiver?.last_seen]);

  const isReceiverTyping = useMemo(() => {
    if (!receiverId || !selectedConversation?.id || !typingUsers) return false;
    const convoTyping = typingUsers[selectedConversation.id];
    if (!convoTyping) return false;
    return !!convoTyping[receiverId];
  }, [receiverId, typingUsers, selectedConversation?.id]);

  const calculateDeliveryDays = (dateString) => {
    if (!dateString) return 0;
    try {
      const diffTime = Math.max(0, new Date(dateString) - new Date());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch { return 0; }
  };
  const getDeliveryInfo = (offer) => {
    if (offer.delivery_days) return `${offer.delivery_days} days`;
    if (offer.date) return `${calculateDeliveryDays(offer.date)} days`;
    return "Not specified";
  };
  const getExpiryInfo = (offer) => {
    if (!offer.expires_at) return null;
    const expiryDate = new Date(offer.expires_at);
    const now = new Date();
    const isExpired = expiryDate < now;
    return {
      date: expiryDate.toLocaleDateString(), isExpired,
      timeLeft: isExpired ? null : Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)),
    };
  };

  const handleBdApproveToClient = async (offerId) => {
    setBdActionLoading(true);
    try {
      await axios.post(`/order/approve-bd`, { order_id: offerId, action: "approve_and_submit_to_client" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
      toast.success("Order approved and submitted to client successfully!");
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve order");
    } finally { setBdActionLoading(false); }
  };

  const handleBdRequestRevision = async () => {
    if (!selectedOfferForBd || !revisionInstructions?.trim()) { toast.error("Please provide revision instructions"); return; }
    setBdActionLoading(true);
    try {
      await axios.post(`/order/request-revision`, { order_id: selectedOfferForBd.id, revision_notes: revisionInstructions },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
      toast.success("Revision requested successfully!");
      setRevisionDialogOpen(false); setRevisionInstructions(""); setSelectedOfferForBd(null);
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request revision");
    } finally { setBdActionLoading(false); }
  };

  const handleBdDisputeOrder = async () => {
    if (!selectedOfferForBd || !disputeReason?.trim()) { toast.error("Please provide a reason for the dispute"); return; }
    setBdActionLoading(true);
    try {
      await axios.post(`/order/dispute`, { order_id: selectedOfferForBd.id, dispute_reason: disputeReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
      toast.warning("Order disputed successfully!");
      setDisputeDialogOpen(false); setDisputeReason(""); setSelectedOfferForBd(null);
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to dispute order");
    } finally { setBdActionLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [dispatch(getOfferRequest())];
        if (userId) promises.push(dispatch(getPersonalGigs({ user_id: userId })));
        if (isBd) {
          promises.push(dispatch(getExperts()));
          promises.push(dispatch(AllBdOrders()));
        }
        await Promise.all(promises);
      } catch (error) { console.error("Error fetching data:", error); }
    };
    if ("requestIdleCallback" in window) requestIdleCallback(fetchData, { timeout: 500 });
    else setTimeout(fetchData, 0);
  }, [dispatch, UserRole, userId, isBd]);

  const renderOrderOptions = () => {
    const optionStyle = { backgroundColor: "#020617", color: "#ffffff" };
    if (isLoadingBdOrders) return <option style={optionStyle} disabled>Loading BD orders...</option>;
    if (!bdOrders || bdOrders.length === 0) return <option style={optionStyle} disabled>No BD orders available</option>;

    return bdOrders.map(order => {
      if (!order) return null;
      
      const bdOrderId = order.bdOrderId || order.id || order._id || 'N/A';
      const orderTitle = order.buyerrequest?.title || order.subject || `BD Order #${bdOrderId}`;
      
      let clientName = 'Unknown Client';
      if (order.client?.fname) clientName = order.client.fname;
      else if (order.buyer?.fname) clientName = order.buyer.fname;
      else if (order.user?.fname) clientName = order.user.fname;
      else if (typeof order.client === 'string') clientName = order.client;

      return (
        <option key={bdOrderId} value={bdOrderId} style={optionStyle}>
          {orderTitle} (ID: {bdOrderId}) - {clientName}
        </option>
      );
    });
  };

  useEffect(() => {
    if (userId) {
      const setOnline = () => dispatch(setUserOnline());
      if ("requestIdleCallback" in window) requestIdleCallback(setOnline, { timeout: 500 });
      else setTimeout(setOnline, 0);
    }
    const handleBeforeUnload = () => { if (userId) dispatch(setUserOffline()); };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (userId) dispatch(setUserOffline());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (!selectedConversation?.id || !receiverId) return;
    const conversationChannel = `conversation.${selectedConversation.id}`;
    const presenceChannel = "user.presence";
    dispatch(fetchMessages({ receiverId, silent: true }));

    echo.private(conversationChannel)
      .listen(".message.sent", (event) => {
        if (event.sender_id !== currentUser.id) {
          dispatch({ type: "message/addNewMessage", payload: event });
          dispatch(markMessagesAsRead({ conversation_id: selectedConversation.id, message_ids: [event.id] }));
        }
      })
      .listen(".user.typing", (event) => {
        if (event.user_id !== currentUser.id) {
          dispatch({ type: "message/updateTypingUsers", payload: event });
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            dispatch({ type: "message/clearTypingUser", payload: { user_id: event.user_id, conversation_id: event.conversation_id } });
          }, 3000);
        }
      })
      .listen(".message.read", (event) => {
        if (event.read_by_user_id !== currentUser.id)
          dispatch({ type: "message/markMessagesAsReadByUser", payload: event });
      })
      .listen(".message.deleted", (event) => {
        dispatch({
          type: "message/deleteMessageLocally",
          payload: { messageId: event.message_id, deleteType: event.delete_type }
        });
      });

    echo.join(presenceChannel)
      .here((users) => users.forEach((u) => dispatch({ type: "message/updateUserOnlineStatus", payload: { user_id: u.id, status: "online" } })))
      .joining((user) => dispatch({ type: "message/updateUserOnlineStatus", payload: { user_id: user.id, status: "online" } }))
      .leaving((user) => dispatch({ type: "message/updateUserOnlineStatus", payload: { user_id: user.id, status: "offline" } }))
      .error((error) => console.error("Presence error:", error));

    return () => { echo.leave(conversationChannel); echo.leave(presenceChannel); };
  }, [dispatch, selectedConversation?.id, receiverId, currentUser.id]);

  useEffect(() => {
    if (!messages || messages.length === 0 || !selectedConversation?.id) return;
    const unreadMessageIds = messages
      .filter(msg => !msg.read && msg.sender_id !== currentUser.id)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      dispatch(markMessagesAsRead({
        conversation_id: selectedConversation.id,
        message_ids: unreadMessageIds
      }));
    }
  }, [messages, selectedConversation?.id, currentUser.id, dispatch]);

  useEffect(() => {
    if (linkExpertId && String(linkExpertId) === String(receiverId) && !linkOrderModalOpen) {
      setLinkOrderModalOpen(true);
    }
  }, [linkExpertId, receiverId]);

  const handleLinkOrderSubmit = async (e) => {
    e.preventDefault();
    if (!linkOrderId) { toast.error("Please select an order to assign"); return; }
    setIsAssigning(true);
    
    const data = {
      bdOrderId: linkOrderId,
      assignmentNotes: linkOrderNotes,
      seller_id: receiverId,
    };

    try {
      await dispatch(inviteToJob(data));
      setLinkOrderModalOpen(false);
      toast.success("Assigned to expert successfully!");
      setLinkOrderNotes("");
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch (error) {
      toast.error(error.message || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleTypingChange = useCallback((isTyping) => {
    if (!selectedConversation?.id || !receiverId || !isCommunicationAllowed) return;
    setIsUserTyping(isTyping);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    dispatch(handleTypingIndicator({ receiver_id: receiverId, is_typing: isTyping }));
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsUserTyping(false);
        dispatch(handleTypingIndicator({ receiver_id: receiverId, is_typing: false }));
      }, 3000);
    }
  }, [dispatch, selectedConversation?.id, receiverId, isCommunicationAllowed]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputVal(value);
    if (isCommunicationAllowed) {
      if (value.length > 0 && !isUserTyping) handleTypingChange(true);
      else if (value.length === 0 && isUserTyping) handleTypingChange(false);
    }
  }, [isUserTyping, handleTypingChange, isCommunicationAllowed]);

  const detectPersonalInfo = (text) => {
    if (!text) return null;
    const normalized = text.toLowerCase();

    // 1. Email check
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    if (emailRegex.test(text)) {
      return "Email Address";
    }

    // 1.5. Handle check (e.g. @username)
    const handleRegex = /@([a-zA-Z0-9._]{2,})/i;
    if (handleRegex.test(text)) {
      return "Social Media Username / Handle";
    }

    // 2. Forbidden keywords check
    const platforms = [
      { name: "WhatsApp", keywords: ['whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me'] },
      { name: "Telegram", keywords: ['telegram', 'tg.me'] },
      { name: "Skype", keywords: ['skype'] },
      { name: "Imo", keywords: ['imo'] },
      { name: "Viber", keywords: ['viber'] },
      { name: "WeChat", keywords: ['wechat'] },
      { name: "Facebook", keywords: ['facebook', 'fb'] },
      { name: "YouTube", keywords: ['youtube', 'youtu.be'] },
      { name: "Discord", keywords: ['discord'] },
      { name: "Instagram", keywords: ['instagram', 'insta'] },
      { name: "Snapchat", keywords: ['snapchat', 'snap'] },
      { name: "Direct Contact / Phone keywords", keywords: ['phone number', 'mobile number', 'contact number', 'phone no', 'mobile no', 'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe', 'call me', 'contact me on', 'baat karein', 'direct client'] }
    ];

    for (const platform of platforms) {
      for (const keyword of platform.keywords) {
        if (normalized.includes(keyword)) {
          return platform.name;
        }
      }
    }

    // 3. Spelled-out numbers map & digits count
    const wordsMap = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };
    let textWithDigits = normalized;
    Object.keys(wordsMap).forEach(word => {
      textWithDigits = textWithDigits.replaceAll(word, wordsMap[word]);
    });

    // Clean dates
    let cleanText = textWithDigits.replace(/\b\d{4}[-/]\d{2}[-/]\d{2}\b/g, '');
    cleanText = cleanText.replace(/\b\d{2}[-/]\d{2}[-/]\d{4}\b/g, '');
    cleanText = cleanText.replace(/[#$€£]\d+/g, '');

    // Strip everything except digits and count
    const digitsOnly = cleanText.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) {
      return "Phone/Contact Number";
    }

    return null;
  };

  const handleSend = useCallback(async () => {
    if (!isCommunicationAllowed) { toast.error("Communication with this user is restricted."); return; }
    if ((!inputVal?.trim() && !selectedFile) || !receiverId) return;

    if (!selectedFile && inputVal?.trim()) {
      const violation = detectPersonalInfo(inputVal.trim());
      if (violation) {
        setSecurityWarningText(`You are trying to share ${violation} details. This is NOT allowed on GrapeTask. Repeating this action will result in your account being suspended immediately.`);
        return;
      }
    }

    const messageData = { receiver_id: receiverId, message_type: selectedFile ? "file" : "text", message: inputVal?.trim(), file: selectedFile };
    try {
      if (isUserTyping) handleTypingChange(false);
      await dispatch(sendMessage(messageData)).unwrap();
      setInputVal(""); setSelectedFile(null); setFilePreview(null);
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {
      if (typeof err === "string" && err.includes("Security Block")) {
        setSecurityWarningText(err);
      } else {
        toast.error(err || "Failed to send message");
      }
    }
  }, [inputVal, selectedFile, receiverId, isUserTyping, handleTypingChange, dispatch, isCommunicationAllowed]);

  // ── Send Voice Message Directly (WhatsApp Style) ──
  const sendVoiceMessage = async (file) => {
    if (!receiverId || !isCommunicationAllowed) {
      toast.error("Cannot send message to this user");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('receiver_id', receiverId);
      formData.append('conversation_id', selectedConversation?.id || '');
      formData.append('message_type', 'voice');
      
      await dispatch(sendMessage(formData)).unwrap();
    } catch (err) {
      toast.error(err || "Failed to send voice message");
    }
  };

  // ── Voice Recording Functions ──
  const startVoiceRecording = async () => {
    // Prevent multiple recordings
    if (isRecording || recordingIntervalRef.current) return;
    
    // Reset cancelled flag
    isCancelledRef.current = false;
    setIsCancelled(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Only send if not cancelled
        if (!isCancelledRef.current && chunks.length > 0) {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const file = new File([blob], `voice_note_${Date.now()}.webm`, { type: 'audio/webm' });
          
          // Auto-send immediately (WhatsApp style)
          sendVoiceMessage(file);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer using ref to prevent duplicates
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopVoiceRecording = () => {
    // Prevent multiple stops
    if (!isRecording && !recordingIntervalRef.current) return;
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const cancelVoiceRecording = () => {
    // Only cancel if actually recording
    if (!isRecording && !recordingIntervalRef.current) return;
    
    // Mark as cancelled so it won't auto-send
    setIsCancelled(true);
    isCancelledRef.current = true;
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  // ── Slide to Cancel Handlers ──
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !isRecording) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartXRef.current - touchX;
    
    // If dragged left more than 100px, cancel
    if (diff > 100) {
      cancelVoiceRecording();
      isDraggingRef.current = false;
    }
  };

  const handleMouseDown = (e) => {
    touchStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !isRecording) return;
    
    const mouseX = e.clientX;
    const diff = touchStartXRef.current - mouseX;
    
    // If dragged left more than 100px, cancel
    if (diff > 100) {
      cancelVoiceRecording();
      isDraggingRef.current = false;
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    const videoFiles = files.filter(f => f.type.startsWith("video/"));
    const otherFiles = files.filter(f => !f.type.startsWith("image/") && !f.type.startsWith("video/"));

    // Handle all files (images, videos, documents) together in modal
    const mediaItems = [];

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        mediaItems.push({
          file,
          preview: URL.createObjectURL(file),
          selected: true,
          type: "image"
        });
      });
    }

    if (videoFiles.length > 0) {
      videoFiles.forEach(file => {
        mediaItems.push({
          file,
          preview: URL.createObjectURL(file),
          selected: true,
          type: "video"
        });
      });
    }

    // Documents (PDF, Word, Excel, etc.)
    if (otherFiles.length > 0) {
      otherFiles.forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        let docType = "file";
        if (ext === 'pdf') docType = "pdf";
        else if (['doc', 'docx'].includes(ext)) docType = "word";
        else if (['xls', 'xlsx'].includes(ext)) docType = "excel";
        else if (['ppt', 'pptx'].includes(ext)) docType = "ppt";
        else if (['zip', 'rar'].includes(ext)) docType = "zip";
        
        mediaItems.push({
          file,
          preview: null, // Documents don't have previews
          selected: true,
          type: docType,
          fileName: file.name,
          fileSize: file.size
        });
      });
    }

    if (mediaItems.length > 0) {
      setSelectedImages(mediaItems);
      setShowImageUploadModal(true);
    }
    e.target.value = "";
  };

  // Cancel image upload modal
  const cancelImageUpload = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    setImageCaption("");
    setSelectedImages([]);
    setShowImageUploadModal(false);
  }, []);

  // Send image with caption
  const sendImageWithCaption = useCallback(async () => {
    if (!selectedFile || !receiverId) return;
    if (!isCommunicationAllowed) { toast.error("Communication with this user is restricted."); return; }

    try {
      const messageData = {
        receiver_id: receiverId,
        message_type: "file",
        message: imageCaption?.trim() || "",
        file: selectedFile,
      };
      await dispatch(sendMessage(messageData)).unwrap();
      setSelectedFile(null);
      setFilePreview(null);
      setImageCaption("");
      setShowImageUploadModal(false);
      toast.success("Image sent!");
    } catch (err) {
      toast.error(err || "Failed to send image");
    }
  }, [selectedFile, receiverId, imageCaption, isCommunicationAllowed, dispatch]);

  const handleSendMedia = async () => {
    if (mediaPreviewFiles.length === 0 || !receiverId) return;
    if (!isCommunicationAllowed) { toast.error("Communication with this user is restricted."); return; }

    const itemsToSend = [...mediaPreviewFiles];

    // Clear state immediately to make UI responsive
    setMediaPreviewFiles([]);
    setActiveMediaIndex(0);
    setMediaCaption("");

    for (const item of itemsToSend) {
      const messageData = { 
        receiver_id: receiverId, 
        message_type: "file", 
        message: item.caption.trim(), 
        file: item.file 
      };

      try {
        if (isUserTyping) handleTypingChange(false);
        await dispatch(sendMessage(messageData)).unwrap();
      } catch (err) {
        if (typeof err === "string" && err.includes("Security Block")) {
          setSecurityWarningText(err);
          // Revoke remaining files to clean up
          itemsToSend.forEach(remainingItem => {
            if (remainingItem.url && remainingItem.url.startsWith("blob:")) {
              URL.revokeObjectURL(remainingItem.url);
            }
          });
          return;
        } else {
          toast.error(`Failed to send ${item.file.name}: ` + (err || "error"));
        }
      } finally {
        if (item.url && item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      }
    }
  };

  const handleCancelMediaPreview = () => {
    mediaPreviewFiles.forEach(item => {
      if (item.url && item.url.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
    });
    setMediaPreviewFiles([]);
    setActiveMediaIndex(0);
    setMediaCaption("");
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          pastedFiles.push(file);
        }
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();
      const newItems = pastedFiles.map(file => {
        const isImage = file.type.startsWith("image/");
        return {
          file,
          url: URL.createObjectURL(file),
          type: isImage ? "image" : "video",
          caption: ""
        };
      });

      setMediaPreviewFiles(prev => {
        const updated = [...prev, ...newItems];
        if (prev.length === 0) {
          setActiveMediaIndex(0);
          setMediaCaption("");
        }
        return updated;
      });
    }
  };

  const handleCaptionChange = (val) => {
    setMediaCaption(val);
    setMediaPreviewFiles(prev => {
      const updated = [...prev];
      if (updated[activeMediaIndex]) {
        updated[activeMediaIndex] = { ...updated[activeMediaIndex], caption: val };
      }
      return updated;
    });
  };

  const handleRemoveMediaItem = (index, e) => {
    e.stopPropagation();
    const item = mediaPreviewFiles[index];
    if (item && item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    }
    
    const updated = mediaPreviewFiles.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setMediaPreviewFiles([]);
      setActiveMediaIndex(0);
      setMediaCaption("");
      return;
    }

    let newIndex = activeMediaIndex;
    if (activeMediaIndex >= updated.length) {
      newIndex = updated.length - 1;
    }
    setMediaPreviewFiles(updated);
    setActiveMediaIndex(newIndex);
    setMediaCaption(updated[newIndex]?.caption || "");
  };

  const handleDownload = async (filePath, fileName, msgId) => {
    setDownloadingFileId(msgId);
    try { await dispatch(downloadAuthenticatedFile({ filePath, fileName })).unwrap(); }
    catch { try { await downloadFileDirectSimple(filePath); } catch { try { downloadFileDirect(filePath); } catch { try { downloadWithIframe(filePath); } catch { try { downloadWithNewWindow(filePath); } catch { alert("All download methods failed."); } } } } }
    finally { setDownloadingFileId(null); }
  };

  const openOfferModal = useCallback(() => {
    if (!receiverId) { toast.error("No receiver selected"); return; }
    if (isBd) setOpen(true); else toast.error("Only Business Developers can create offers.");
  }, [receiverId, isBd]);

  const resetOfferForm = () => { setDescription(""); setOfferPrice(""); setOfferDate(""); setOfferExpertId(""); setGigRadio(""); setOpen(false); };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!description?.trim() || !offerPrice || !offerDate) { toast.error("Please fill all required fields"); return; }
    if (!receiverId) { toast.error("No receiver selected"); return; }
    if (!isBd) { toast.error("Only Business Developers can create offers."); return; }
    setOfferLoader(true);
    const payload = { client_id: receiverId, description: description?.trim(), price: offerPrice.toString(), date: offerDate, expert_id: offerExpertId };
    if (gigRadio) payload.gig_id = gigRadio;
    try {
      const response = await dispatch(CreateOfferRequest(payload));
      let offerData, success = false;
      if (response?.payload) { offerData = response.payload; success = response.payload.status === true || response.payload.status === "true"; }
      else if (response?.data) { offerData = response.data; success = response.data.status === true || response.data.status === "true"; }
      else { offerData = response; success = response?.status === true || response?.status === "true"; }

      if (success && offerData?.data?.id) {
        try {
          await dispatch(sendMessage({ receiver_id: receiverId, offer_id: offerData.data.id, message_type: "offer", message: `New offer: $${offerData.data.price}` }));
        } catch (messageError) { console.error("Error sending offer message:", messageError); }
        setOpen(false); resetOfferForm(); toast.success("🎉 Offer created and sent successfully!");
        setTimeout(() => dispatch(fetchMessages({ receiverId, silent: false })), 1500);
      } else {
        const errorMsg = offerData?.message || "Offer creation failed.";
        if (errorMsg.includes("Not enough bids")) {
          toast.error(<div>Not enough bids! <Button onClick={() => navigate("/buy-bids")} variant="contained" size="small" sx={{ mt: 1, backgroundColor: T.orange }}>Buy Bids</Button></div>, { autoClose: 10000 });
        } else toast.error(errorMsg);
      }
    } catch { toast.error("Error creating offer."); }
    finally { setOfferLoader(false); }
  };

  const handleDeclineOffer = async (offerId) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "Do you want to decline this offer?", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, decline it!" });
    if (!result.isConfirmed) return;
    try {
      await dispatch(RejectOfferRequest({ offer_id: offerId })).unwrap();
      await dispatch(sendMessage({ receiver_id: receiverId, message_type: "offer_declined", message: "Offer declined", offer_id: offerId }));
      toast.info("Offer declined"); dispatch(fetchMessages({ receiverId, silent: true }));
    } catch { toast.error("Failed to decline offer"); }
  };

  const handleCompleteOrder = async (orderId) => {
    if (!orderId) { toast.error("Order ID is required"); return; }
    setCompletingOrder(true);
    try {
      const formData = new FormData(); formData.append("status", "completed"); formData.append("order_id", orderId);
      const result = await dispatch(OrderComplete({ orderId, payload: formData }));
      if (OrderComplete.fulfilled.match(result)) { toast.success("Order completed successfully!"); setOrderCompletionModal(false); dispatch(fetchMessages({ receiverId, silent: true })); }
      else toast.error(result.payload || "Failed to complete order");
    } catch { toast.error("Unexpected error occurred while completing order"); }
    finally { setCompletingOrder(false); }
  };

  const CHUNK_SIZE = 2 * 1024 * 1024;
  const CONCURRENCY_LIMIT = 4;

  const uploadFileInChunks = async (file, offerId) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const accessToken = localStorage.getItem("accessToken");

    setUploadProgress((prev) => ({ ...prev, [file.name]: { percent: 0, status: 'uploading' } }));

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
          headers: { Accept: "application/json", "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` },
          onUploadProgress: (event) => {
            const loadedFromPreviousChunks = index * CHUNK_SIZE;
            const newLoaded = loadedFromPreviousChunks + event.loaded;
            const overallPercent = Math.round((newLoaded / file.size) * 100);
            setUploadProgress((prev) => ({ ...prev, [file.name]: { percent: Math.min(overallPercent, 100), status: 'uploading' } }));
          },
        });
      } catch (err) {
        console.error(`Error uploading chunk ${index + 1}:`, err);
        setUploadProgress((prev) => ({ ...prev, [file.name]: { ...prev[file.name], status: 'error' } }));
        toast.error(`File upload failed at chunk ${index + 1}. Please try again.`);
        return;
      }
    }
    setUploadProgress((prev) => {
      const nextState = { ...prev, [file.name]: { percent: 100, status: 'done' } };
      setTimeout(() => checkAndAutoSubmit(offerId, nextState), 500);
      return nextState;
    });
  };

  const checkAndAutoSubmit = async (offerId, progressState) => {
    const allFiles = Object.values(progressState);
    if (allFiles.length === 0) return;
    
    const allDone = allFiles.every(f => f.percent === 100 && f.status === 'done');
    if (!allDone) return;
    
    if (window.isAutoSubmittingOrderChat) return;
    window.isAutoSubmittingOrderChat = true;

    try {
      const metadataForm = new FormData(); 
      metadataForm.append("delivery_message", orderDescription?.trim() ? orderDescription : "Here is my delivered work."); 
      metadataForm.append("offer_id", offerId);
      metadataForm.append("has_files", "0");
      
      await dispatch(OrderSubmit({ orderId: offerId, payload: metadataForm }));
      toast.success("File uploaded & Order submitted successfully!"); 
      setOrderSubmissionModal(false); 
      setOrderDescription(""); 
      setOrderFiles([]); 
      setSelectedOffer(null); 
      setUploadProgress({});
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch { 
      console.error("Auto-submit order error"); 
    } finally { 
      window.isAutoSubmittingOrderChat = false; 
    }
  };

  const isAnyFileUploading = orderFiles.some(file => uploadProgress[file.name]?.percent < 100 && uploadProgress[file.name]?.status !== 'error');

  const handleSubmitOrder = async () => {
    if (!selectedOffer || !orderDescription?.trim()) { toast.error("Please provide order description"); return; }
    
    if (isAnyFileUploading) {
      toast.warning("Please wait for all files to finish uploading before submitting.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const metadataForm = new FormData(); 
      metadataForm.append("delivery_message", orderDescription); 
      metadataForm.append("offer_id", selectedOffer.id);
      metadataForm.append("has_files", "0"); // Files are already uploaded automatically
      
      await dispatch(OrderSubmit({ orderId: selectedOffer.id, payload: metadataForm }));
      toast.success("Order submitted successfully!"); 
      setOrderSubmissionModal(false); 
      setOrderDescription(""); 
      setOrderFiles([]); 
      setSelectedOffer(null); 
      setUploadProgress({});
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch { toast.error("Error submitting order"); }
    finally { setSubmittingOrder(false); }
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;
  const handleOrderFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) { toast.error(`Files exceed 5GB: ${oversized.map((f) => f.name).join(", ")}`); return; }
    setOrderFiles((prev) => [...prev, ...files]);
    
    // Automatically start uploading as soon as file is selected
    files.forEach(file => {
      uploadFileInChunks(file, selectedOffer.id);
    });
  };
  const removeOrderFile = (index) => setOrderFiles((prev) => prev.filter((_, i) => i !== index));
  const viewOfferDetails = (offer) => { setOfferDetailsModal(true); setOfferDetails(offer); };

  const openPaymentModal = useCallback((offer) => {
    setSelectedOfferId(offer.id); setPaymentMethod("fast-checkout"); setShowPaymentModal(true);
    setPaymentFormData({ username: "", email: "", password: "", amount: offer.price || "", file: null }); setSelectedImagePreview(null);
  }, []);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false); setSelectedOfferId(null); setIsProcessing(false);
    if (selectedImagePreview) { URL.revokeObjectURL(selectedImagePreview); setSelectedImagePreview(null); }
  }, [selectedImagePreview]);

  const openAssignModal = useCallback((offer) => { setSelectedOfferId(offer.id); setShowAssignModal(true); setAssignmentFormData({ bdOrderId: "", assignmentNotes: "" }); }, []);
  const closeAssignModal = useCallback(() => { setShowAssignModal(false); setSelectedOfferId(null); }, []);

  const handlePaymentInputChange = useCallback((e) => {
    const { name, type, files, value } = e.target;
    if (type === "file" && files?.[0]) {
      const sel = files[0];
      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview(URL.createObjectURL(sel));
      setPaymentFormData((prev) => ({ ...prev, [name]: sel }));
    } else setPaymentFormData((prev) => ({ ...prev, [name]: value }));
  }, [selectedImagePreview]);

  const handleAssignmentInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAssignmentFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAssignToExpert = async (e) => {
    e.preventDefault();
    if (!assignExpertId) { setToastState({ show: true, message: "Please select an expert", type: "error" }); return; }
    setIsAssigning(true);
    try {
      await dispatch(inviteToJob({ offerId: selectedOfferId, seller_id: assignExpertId, notes: assignmentFormData.assignmentNotes }));
      closeAssignModal();
      setToastState({ show: true, message: "Assigned to expert successfully!", type: "success" });
      dispatch(fetchMessages({ receiverId, silent: true }));
    } catch (error) { setToastState({ show: true, message: error.message || "Assignment failed", type: "error" }); }
    finally { setIsAssigning(false); }
  };

  const handleFastCheckout = async (e) => {
    e.preventDefault();
    if (!paymentFormData.file) { toast.error("Please upload a receipt"); return; }
    setIsProcessing(true);
    try {
      const formData = new FormData(); formData.append("offerId", selectedOfferId);
      formData.append("payment_method", "bank_transfer"); formData.append("transfer_receipt", paymentFormData.file); formData.append("status", "pending_verification");
      const res = await dispatch(AcceptOfferRequest(formData)); closePaymentModal();
      toast.success(res?.message || "Receipt submitted successfully!");
    } catch (error) { toast.error(error.message || "Transfer failed"); }
    finally { setIsProcessing(false); }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (["username", "email", "password", "amount"].some((f) => !paymentFormData[f])) { setToastState({ show: true, message: "Please fill all fields", type: "error" }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentFormData.email)) { setToastState({ show: true, message: "Invalid email", type: "error" }); return; }
    setIsProcessing(true);
    try {
      const response = await dispatch(AcceptOfferRequest({ offerId: selectedOfferId, paymentMethod: "card", cardDetails: { holderName: paymentFormData.username, email: paymentFormData.email, amount: parseFloat(paymentFormData.amount) } })).unwrap();
      if (response?.payment_form_html) { const win = window.open("", "_blank"); if (win) { win.document.open(); win.document.write(response.payment_form_html); win.document.close(); } }
      setToastState({ show: true, message: "Payment processed!", type: "success" }); closePaymentModal();
      if (!response?.payment_form_html) navigate("/payment/success");
    } catch (error) { setToastState({ show: true, message: error.message || "Payment failed", type: "error" }); }
    finally { setIsProcessing(false); }
  };

  const handleReject = async (offerId) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "Reject this offer?", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, reject it!" });
    if (!result.isConfirmed) return;
    setIsProcessing(true);
    try { await dispatch(RejectOfferRequest({ offerId })).unwrap(); setToastState({ show: true, message: "Offer rejected!", type: "success" }); }
    catch (error) { setToastState({ show: true, message: error.message || "Rejection failed", type: "error" }); }
    finally { setIsProcessing(false); }
  };

  const handleRejectDelivery = async (offerId) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "Reject this order submission?", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, reject it!" });
    if (!result.isConfirmed) return;
    setIsProcessing(true);
    try { await dispatch(RejectOfferRequest({ offerId })).unwrap(); setToastState({ show: true, message: "Delivery rejected!", type: "success" }); dispatch(fetchMessages({ receiverId, silent: true })); }
    catch (error) { setToastState({ show: true, message: error.message || "Rejection failed", type: "error" }); }
    finally { setIsProcessing(false); }
  };

  const openReviewModal = () => setShowReviewModal(true);
  const closeReviewModal = () => { setReviewFormData({ expert_rating: 0, expert_comment: "", bd_rating: 0, bd_comment: "" }); setShowReviewModal(false); };
  const handleReviewInputChange = (e) => setReviewFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!reviewFormData.expert_rating || reviewFormData.expert_rating < 1 || reviewFormData.expert_rating > 5) { toast.error("Please provide a valid rating for the expert"); return; }
    if (!reviewFormData.expert_comment.trim()) { toast.error("Please provide a comment about the expert work"); return; }
    if (isClient) {
      if (!reviewFormData.bd_rating || reviewFormData.bd_rating < 1 || reviewFormData.bd_rating > 5) { toast.error("Please provide a valid rating for the Business Developer"); return; }
      if (!reviewFormData.bd_comment.trim()) { toast.error("Please provide a comment about the BD service"); return; }
    }
    setIsSubmittingReview(true);
    const formData = new FormData();
    formData.append("expert_rating", parseInt(reviewFormData.expert_rating, 10)); formData.append("expert_comment", reviewFormData.expert_comment.trim());
    if (isClient) { formData.append("bd_rating", parseInt(reviewFormData.bd_rating, 10)); formData.append("bd_comment", reviewFormData.bd_comment.trim()); }
    formData.append("offer_id", selectedOffer?.order.offer_id); formData.append("order_id", selectedOffer?.order?.id); formData.append("reviewer_role", currentUser?.role);
    try { await dispatch(ReviewSubmit(formData)).unwrap(); toast.success("Review submitted successfully!"); closeReviewModal(); setOrderCompletionModal(false); }
    catch (error) { toast.error(error?.message || "Failed to submit review."); }
    finally { setIsSubmittingReview(false); }
  }, [reviewFormData, selectedOffer, isClient, currentUser?.role, dispatch, closeReviewModal]);

  const handleCloseToast = useCallback(() => setToastState((prev) => ({ ...prev, show: false })), []);

  const filteredMessages = useMemo(() => {
    if (!messages?.length) return [];
    if (isCommunicationAllowed) return messages;
    return messages.filter((msg) => {
      const isOfferMessage = msg.message_type?.includes("offer");
      const isSystemMessage = msg.message_type === "system";
      const isCallMessage = msg.message_type === "call";
      const isFromBD = msg.sender_role?.toLowerCase().includes("bidder") || msg.sender_role?.toLowerCase().includes("representative") || msg.sender_role?.toLowerCase().includes("middleman");
      const isFromCurrentUser = msg.sender_id === userId;
      return isOfferMessage || isSystemMessage || isCallMessage || isFromBD || isFromCurrentUser;
    });
  }, [messages, isCommunicationAllowed, userId]);

  const conversationMedia = useMemo(() => {
    if (!filteredMessages) return [];
    return filteredMessages
      .filter((m) => m.file_path && m.file_name?.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|ogg|quicktime|m4v|3gp)$/i))
      .map((m) => {
        const isImg = m.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        return {
          id: m.id,
          url: getFileUrl(m.file_path),
          type: isImg ? "image" : "video",
          fileName: m.file_name,
          filePath: m.file_path,
          msgId: m.id
        };
      });
  }, [filteredMessages, getFileUrl]);

  const activeLightboxIndex = useMemo(() => {
    if (!lightboxMedia) return -1;
    if (lightboxMedia.type === "pdf") return -1;
    return conversationMedia.findIndex(item => item.msgId === lightboxMedia.msgId || item.url === lightboxMedia.url);
  }, [lightboxMedia, conversationMedia]);

  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeLightboxIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxMedia(null);
      } else if (e.key === "ArrowRight") {
        if (activeLightboxIndex >= 0 && activeLightboxIndex < conversationMedia.length - 1) {
          setLightboxMedia(conversationMedia[activeLightboxIndex + 1]);
        }
      } else if (e.key === "ArrowLeft") {
        if (activeLightboxIndex > 0) {
          setLightboxMedia(conversationMedia[activeLightboxIndex - 1]);
        }
      }
    };
    if (lightboxMedia) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [lightboxMedia, conversationMedia, activeLightboxIndex]);

  // ─── OFFER MESSAGE RENDER ──────────────────────────────────────────────────
  const renderOfferMessage = (msg) => {
    const offer = msg?.offer || offers?.find((o) => o.id === msg.offer_id);
    if (!offer) {
      return (
        <Box sx={{ background: T.cardBg, borderRadius: "16px", p: 3, mb: 2, border: `1px solid ${T.border}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 3 }}>
            <CircularProgress size={20} sx={{ color: T.orange }} />
            <Typography variant="body2" sx={{ ml: 1, color: T.midGray }}>Loading offer details...</Typography>
          </Box>
        </Box>
      );
    }

    const rawStatus = offer.order?.status || offer.status || "pending";
    const offerStatus = String(rawStatus).toLowerCase().trim().replace(/\s+/g, " ");
    const offerOnlyStatus = String(offer.status ?? "pending").toLowerCase().trim().replace(/\s+/g, " ");
    
    const hasOrderId = offer.order_id || offer.order?.id;
    const isOfferSent = msg.sender_id === currentUser.id;
    const isClientUser = currentUser.id === offer.buyer_id;
    const isClientByRole = currentUser?.role?.toLowerCase().includes("client") || currentUser?.user_type?.toLowerCase().includes("client");
    const isSeller = currentUser.id === offer.seller_id || currentUser.id === offer.expert_id;
    const isBdUser = currentUser?.role === "bidder/company representative/middleman";
    const pendingVerification = offerStatus === "pending_verification" || offerStatus === "pending acceptance";
    const canAcceptOffer = (isClientUser || isClientByRole) && !isOfferSent && offerOnlyStatus === "pending";
    const canDeclineOffer = (isClientUser || isClientByRole) && !isOfferSent && offerOnlyStatus === "pending";
    
    const canSubmitOrder = (isOfferSent || isSeller) && (offerStatus === "accepted" || offerStatus === "project started" || offerStatus === "expert_assigned" || offerStatus === "in revision" || offerStatus === "active");
    const canInviteExpert = isBdUser && (offerStatus === "accepted" || offerStatus === "project started" || offerStatus === "active" || offerStatus === "expert_assigned");
    const canAcceptDelivery = isClientUser && offerStatus === "delivered" && hasOrderId;
    const canRejectDelivery = isClientUser && offerStatus === "delivered" && hasOrderId;
    const canWriteReview = isClientUser && offerStatus === "completed" && !offer.review_submitted;
    const canBdApproveToClient = isBdUser && offerStatus === "submitted_to_bd";
    const canBdRequestRevision = isBdUser && offerStatus === "submitted_to_bd";
    const canBdDisputeOrder = isBdUser && offerStatus === "submitted_to_bd";
    const hasDeliveryAttachment = (offerStatus === "delivered" || offerStatus === "completed" || offerStatus === "submitted_to_bd") && (offer.attachment || offer.order?.delivery_attachments);

    const statusConfig = {
      pending: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "⏳", label: "Pending" },
      pending_verification: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "⏳", label: "Pending Verification" },
      accepted: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)", icon: "✅", label: "Accepted" },
      declined: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", icon: "❌", label: "Declined" },
      rejected: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", icon: "❌", label: "Rejected" },
      delivered: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "rgba(59,130,246,0.25)", icon: "📦", label: "Delivered" },
      completed: { bg: "rgba(168,85,247,0.12)", color: "#a855f7", border: "rgba(168,85,247,0.25)", icon: "🎉", label: "Completed" },
      expired: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", icon: "⏰", label: "Expired" },
      submitted_to_bd: { bg: "rgba(14,165,233,0.12)", color: "#0ea5e9", border: "rgba(14,165,233,0.25)", icon: "📋", label: "Submitted to BD" },
      "project started": { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)", icon: "🚀", label: "Project Started" },
      expert_assigned: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)", icon: "👨‍💻", label: "Expert Assigned" },
      "pending acceptance": { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "⏳", label: "Pending Acceptance" },
      cancelled: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", icon: "🚫", label: "Cancelled" },
      bd_revision_requested: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "🔄", label: "Revision Requested" },
      revision_requested: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "🔄", label: "Revision Requested" },
      disputed: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", icon: "⚠️", label: "Disputed" },
      "in revision": { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)", icon: "🔄", label: "In Revision" },
      active: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)", icon: "🟢", label: "Active" },
    };
    const cs = statusConfig[offerStatus] || statusConfig.pending;
    const deliveryInfo = getDeliveryInfo(offer);
    const expiryInfo = getExpiryInfo(offer);

    return (
      <Box sx={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        borderRadius: "16px", p: 3, mb: 2,
        border: `1px solid ${cs.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(8px)",
      }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: T.white, fontSize: "1rem", fontWeight: 600 }}>
            <Handshake style={{ fontSize: 20, color: T.orange }} />
            Custom Offer
          </Typography>
          <Chip
            label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>{cs.icon} {cs.label}</Box>}
            size="small"
            sx={{ backgroundColor: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, fontWeight: 500 }}
          />
        </Box>

        <Typography sx={{ mb: 2, color: T.lightGray, fontSize: "0.9rem", lineHeight: 1.5 }}>
          {offer.description || "Custom offer for your project."}
        </Typography>

        <Box sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}` }}>
          <Typography sx={{ color: T.midGray, fontSize: "0.875rem" }}>
            <span style={{ color: T.bodyGray }}>Price: </span>
            <span style={{ color: T.white, fontWeight: 700, fontSize: "1rem" }}>${offer.price}</span>
          </Typography>
          <Typography sx={{ color: T.midGray, fontSize: "0.875rem" }}>
            <span style={{ color: T.bodyGray }}>Delivery: </span>
            <span style={{ color: T.lightGray, fontWeight: 500 }}>{deliveryInfo}</span>
          </Typography>
        </Box>

        {expiryInfo && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: expiryInfo.isExpired ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)", border: `1px solid ${expiryInfo.isExpired ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}` }}>
            <Typography variant="caption" sx={{ color: expiryInfo.isExpired ? "#ef4444" : "#3b82f6" }}>
              {expiryInfo.isExpired ? `⏰ Expired on ${expiryInfo.date}` : `⏳ Expires on ${expiryInfo.date} (${expiryInfo.timeLeft} days left)`}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" size="small" onClick={() => viewOfferDetails(offer)}
            sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: T.orange, color: T.orange, backgroundColor: "rgba(240,89,31,0.08)" } }}>
            👁️ View Details
          </Button>

          {canAcceptOffer && (
            <Button variant="contained" size="small" disabled={pendingVerification} onClick={() => openPaymentModal(offer)}
              sx={{ backgroundColor: T.orange, textTransform: "none", borderRadius: "8px", "&:hover": { backgroundColor: "#d94e18" }, "&:disabled": { backgroundColor: "rgba(240,89,31,0.3)", color: T.bodyGray } }}>
              {pendingVerification ? "⏳ Pending Verification" : `✅ Accept $${offer.price}`}
            </Button>
          )}
          {canDeclineOffer && (
            <Button variant="outlined" size="small" onClick={() => handleDeclineOffer(offer.id)}
              sx={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" } }}>
              ❌ Decline
            </Button>
          )}
          {canSubmitOrder && (
            <Button variant="contained" size="small" onClick={() => { setSelectedOffer(offer); setOrderSubmissionModal(true); }}
              sx={{ backgroundColor: T.orange, textTransform: "none", borderRadius: "8px", "&:hover": { backgroundColor: "#d94e18" } }}>
              Submit Order
            </Button>
          )}
          {canAcceptDelivery && (
            <Button variant="contained" size="small" onClick={() => { setSelectedOffer(offer); setOrderCompletionModal(true); }}
              sx={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", textTransform: "none", borderRadius: "8px", "&:hover": { backgroundColor: "rgba(34,197,94,0.25)" } }}>
              ✅ Accept Delivery
            </Button>
          )}
          {canRejectDelivery && (
            <Button variant="outlined" size="small" onClick={() => handleRejectDelivery(offer.id)}
              sx={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" } }}>
              ❌ Reject Delivery
            </Button>
          )}
          {canBdApproveToClient && (
            <>
              <Button variant="contained" size="small" onClick={() => handleBdApproveToClient(offer.order.id)} disabled={bdActionLoading}
                sx={{ backgroundColor: T.orange, textTransform: "none", borderRadius: "8px", "&:hover": { backgroundColor: "#d94e18" } }}>
                {bdActionLoading ? "Processing..." : "✅ Approve to Client"}
              </Button>
              <Button variant="outlined" size="small" onClick={() => { setSelectedOfferForBd(offer); setRevisionDialogOpen(true); }} disabled={bdActionLoading}
                sx={{ borderColor: "rgba(251,191,36,0.4)", color: "#fbbf24", textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: "#fbbf24", backgroundColor: "rgba(251,191,36,0.08)" } }}>
                🔄 Request Revision
              </Button>
              <Button variant="outlined" size="small" onClick={() => { setSelectedOfferForBd(offer); setDisputeDialogOpen(true); }} disabled={bdActionLoading}
                sx={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" } }}>
                ⚠️ Dispute Order
              </Button>
            </>
          )}
          <DownloadAttachments offer={offer} hasDeliveryAttachment={hasDeliveryAttachment} />
          {canInviteExpert && (
            <Button variant="outlined" size="small" onClick={() => openAssignModal(offer)}
              sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: T.orange, color: T.orange } }}>
              👨‍💻 Invite Expert
            </Button>
          )}
        </Box>

        {(offerLoader || isProcessing || bdActionLoading) && (
          <Box sx={{ position: "absolute", inset: 0, background: "rgba(2,6,23,0.7)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px" }}>
            <CircularProgress size={24} sx={{ color: T.orange }} />
          </Box>
        )}
      </Box>
    );
  };

  const typingUserIds = typingUsers?.[selectedConversation?.id] || {};
  const isSomeoneTyping = Object.entries(typingUserIds).some(([uid, t]) => t && uid !== currentUser.id?.toString());

  // ─── NO CONVERSATION ───────────────────────────────────────────────────────
  if (!selectedConversation) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: T.mainBg }}>
        <Box sx={{ textAlign: "center", p: 4 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "rgba(240,89,31,0.1)", border: `2px solid ${T.orangeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: 32 }}>💬</span>
          </div>
          <Typography variant="h5" sx={{ color: T.white, fontWeight: 600, mb: 1 }}>Select a conversation</Typography>
          <Typography variant="body1" sx={{ color: T.bodyGray }}>Choose a contact from the sidebar to begin messaging</Typography>
        </Box>
      </Box>
    );
  }

  // ─── MODAL STYLE HELPER ───────────────────────────────────────────────────
  const darkModalSx = {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    bgcolor: T.surfaceBg, border: `1px solid ${T.borderMid}`, borderRadius: 4,
    boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset", overflow: "auto", p: 4,
  };
  
  const dialogPaperProps = {
    sx: {
      backgroundColor: T.surfaceBg,
      backgroundImage: "none",
      border: `1px solid ${T.borderMid}`,
      borderRadius: 4,
      color: T.white,
      boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset",
    }
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .dark-input { background-color: ${T.cardBgActive} !important; border: 1px solid ${T.borderMid} !important; color: ${T.white} !important; border-radius: 8px; padding: 10px 14px; width: 100%; outline: none; }
        .dark-input:focus { border-color: ${T.orange} !important; }
        .dark-input::placeholder { color: ${T.bodyGray}; }
        .dark-textarea { background-color: ${T.cardBgActive}; border: 1px solid ${T.borderMid}; color: ${T.white}; border-radius: 8px; padding: 10px 14px; width: 100%; outline: none; resize: vertical; }
        .dark-textarea:focus { border-color: ${T.orange}; }
        .dark-textarea::placeholder { color: ${T.bodyGray}; }
        .dark-label { color: ${T.lightGray}; font-size: 0.875rem; margin-bottom: 6px; display: block; font-weight: 500; }
        .dark-muted { color: ${T.bodyGray}; font-size: 0.75rem; }
        .typing-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background-color: ${T.midGray}; animation: typingPulse 1.4s infinite ease-in-out; }
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingPulse { 0%,60%,100% { transform: scale(0.6); opacity: 0.4; } 30% { transform: scale(1); opacity: 1; } }
        @keyframes recordingBlink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .recording-blink-dot { animation: recordingBlink 1s infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(240,89,31,0.4); }
        @keyframes wa-popup-in {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.85); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes wa-camera-in {
          0%   { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── CHAT CONTAINER ── */}
      <div style={{ height: "100vh", maxHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", width: "100%", backgroundColor: "var(--wa-bg, #111B21)" }}>

        {/* ── HEADER ── */}
        <div style={{
          flexShrink: 0, padding: "10px 16px",
          backgroundColor: "var(--wa-header-bg, #202C33)",
          borderBottom: "1px solid var(--wa-divider, #374045)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 10,
          minHeight: "60px",
          cursor: "pointer"
        }} onClick={(e) => {
          if (!selectedConversation?.is_group) {
            const event = new CustomEvent('toggleProfileSidebar');
            window.dispatchEvent(event);
          }
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="d-md-none"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('mobileBackToList'));
              }}
              style={{
                background: "transparent",
                border: "none",
                color: T.white,
                padding: "8px",
                marginRight: "-4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            {selectedConversation?.is_group ? (
              <div
                style={{ 
                  width: "44px", height: "44px", borderRadius: "50%", 
                  backgroundColor: "var(--inbox-primary)", color: "#fff", 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: "bold", border: `2px solid ${T.border}` 
                }}
              >
                👥
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={receiver?.image || userImg}
                  alt="user"
                  onError={(e) => (e.target.src = userImg)}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 1, right: 1,
                  width: 12, height: 12, borderRadius: "50%",
                  backgroundColor: isReceiverOnline ? "var(--wa-online, #00A884)" : "transparent",
                  border: isReceiverOnline ? "2px solid var(--wa-header-bg, #202C33)" : "none",
                }} />
              </div>
            )}
            <div>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "16px", color: "var(--wa-text-primary, #E9EDEF)", lineHeight: 1.2 }}>
                {selectedConversation?.is_group ? selectedConversation.title : (receiver?.fname || receiver?.name || "User")}
              </p>
              {selectedConversation?.is_group ? (
                (() => {
                  const otherParticipants = selectedConversation.participants?.filter(p => p.id !== currentUser.id) || [];
                  const onlineCount = otherParticipants.filter(p => 
                    onlineUsers[p.id] === "online" || onlineUsers[p.id] === true
                  ).length || 0;
                  const totalCount = otherParticipants.length || 0;
                  return (
                    <small 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMembersListModal(true);
                      }}
                      style={{ 
                        color: T.bodyGray, 
                        fontSize: "12px", 
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "2px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--inbox-primary)"}
                      onMouseLeave={e => e.currentTarget.style.color = T.bodyGray}
                    >
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                      {onlineCount} of {totalCount} members active (Click to view members)
                    </small>
                  );
                })()
              ) : (
                <small style={{ color: isSomeoneTyping ? "var(--wa-green)" : isReceiverOnline ? "var(--wa-online, #00A884)" : "var(--wa-text-muted, #667781)", fontSize: "13px", fontWeight: 400 }}>
                  {isSomeoneTyping ? "typing..." : isReceiverOnline ? "online" : (() => {
                    if (receiver?.last_seen) {
                      const lastSeenMoment = receiver.last_seen.includes('Z') || receiver.last_seen.includes('+')
                        ? moment(receiver.last_seen)
                        : moment.utc(receiver.last_seen).local();
                      return "last seen " + lastSeenMoment.fromNow();
                    }
                    return "offline";
                  })()}
                </small>
              )}
              {!isCommunicationAllowed && (
                <small style={{ color: "#fbbf24", display: "block", fontSize: "11px" }}>
                  ⚠️ BD mediation required
                </small>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isBd && !(selectedConversation?.order_status === "completed" || selectedConversation?.order?.status === "completed") && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {(receiverRole?.toLowerCase().includes('expert') || receiverRole?.toLowerCase().includes('freelancer')) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setLinkOrderModalOpen(true)}
                    style={{
                      borderColor: T.orange,
                      color: T.orange,
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "7px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Assign to Expert
                  </Button>
                )}
                {receiverRole?.toLowerCase().includes('client') && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Handshake style={{ fontSize: 16 }} />}
                    onClick={openOfferModal}
                    style={{
                      backgroundColor: T.orange,
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "7px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      boxShadow: `0 4px 14px rgba(240,89,31,0.4)`,
                    }}
                  >
                    Create Offer
                  </Button>
                )}
              </div>
            )}

            {/* Live Meeting Video Call Button */}
            {!(selectedConversation?.order_status === "completed" || selectedConversation?.order?.status === "completed") && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCall();
                }}
                style={{ color: T.white, padding: "8px", marginRight: "4px" }}
                title="Start Live Meeting"
              >
                <Videocam style={{ fontSize: "22px" }} />
              </IconButton>
            )}

            {/* 3-dots options menu for chat clear */}
            <div style={{ position: "relative" }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHeaderMenu(!showHeaderMenu);
                }}
                style={{ color: T.white, padding: "8px" }}
              >
                <span style={{ fontSize: "20px", fontWeight: "bold", lineHeight: 1 }}>⋮</span>
              </IconButton>
              {showHeaderMenu && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "45px",
                  backgroundColor: T.headerBg,
                  border: `1px solid ${T.border}`,
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  zIndex: 100,
                  minWidth: "150px",
                  overflow: "hidden"
                }} onClick={(e) => e.stopPropagation()}>
                  {/* Close Chat Button */}
                  <button
                    className="d-none d-md-flex"
                    onClick={() => {
                      setShowHeaderMenu(false);
                      dispatch(setSelectedConversation(null));
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "transparent",
                      color: T.white,
                      border: "none",
                      borderBottom: `1px solid ${T.border}`,
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      alignItems: "center",
                      gap: "8px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    ✕ Close Chat
                  </button>

                  {/* Clear Chat Button */}
                  <button
                    onClick={() => {
                      setShowHeaderMenu(false);
                      handleClearChat();
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "transparent",
                      color: "#ef4444",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    🗑️ Clear Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MESSAGES AREA ── */}
        <div
          ref={scrollRef}
          className="chat-messages-area"
          style={{
            flex: "1 1 auto", overflowY: "auto",
            maxHeight: "calc(100vh - 150px)",
            display: "flex", flexDirection: "column",
            padding: "8px 5%",
            backgroundColor: getChatBackground(),
            backgroundImage: getChatBackgroundImage(),
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <CircularProgress size={20} style={{ color: T.orange }} />
              <span style={{ color: T.midGray, fontSize: "14px" }}>Loading messages...</span>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((msg, i) => {
              const isSender = String(msg.sender_id) === String(currentUser.id);
              const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
              const msgSender = selectedConversation?.participants?.find((p) => String(p.id) === String(msg.sender_id));
              const senderName = msgSender ? `${msgSender.fname} (${formatRoleForDisplay(msgSender.role || 'User')})` : (msg.sender_role ? `User (${formatRoleForDisplay(msg.sender_role)})` : "User");

              const isVisualAttachment = msg.file_path && !msg.message && (
                msg.file_name?.match(/\.(jpg|jpeg|png|gif|webp|mp3|wav|ogg|webm|m4a|3gp|aac)$/i) || 
                msg.file_name?.includes("voice_note")
              );
              // Check if part of batch (from backend or time-based)
              const BATCH_TIME_WINDOW = 30000; // 30 seconds
              const isPartOfBatch = (() => {
                // First check if backend has batch_id
                if (msg.batch_id && msg.file_path) return true;
                // Otherwise use time-based grouping
                if (!msg.file_path || msg.message) return false;
                // Check if there are other media messages within time window from same sender
                const currentTime = new Date(msg.created_at).getTime();
                const prevMsg = filteredMessages[i-1];
                const nextMsg = filteredMessages[i+1];
                const isSameSender = (m) => String(m.sender_id) === String(msg.sender_id);
                const isMediaOnly = (m) => m.file_path && !m.message;
                const isWithinTimeWindow = (m) => {
                  if (!m) return false;
                  const otherTime = new Date(m.created_at).getTime();
                  return Math.abs(currentTime - otherTime) < BATCH_TIME_WINDOW;
                };
                // Check if prev or next message is also media from same sender within time window
                const hasAdjacentMedia = (
                  (prevMsg && isSameSender(prevMsg) && isMediaOnly(prevMsg) && isWithinTimeWindow(prevMsg)) ||
                  (nextMsg && isSameSender(nextMsg) && isMediaOnly(nextMsg) && isWithinTimeWindow(nextMsg))
                );
                return hasAdjacentMedia;
              })();
              const isBatchStart = isPartOfBatch && (!filteredMessages[i-1] || !(filteredMessages[i-1].file_path && !filteredMessages[i-1].message) || String(filteredMessages[i-1].sender_id) !== String(msg.sender_id) || (new Date(msg.created_at).getTime() - new Date(filteredMessages[i-1].created_at).getTime()) > BATCH_TIME_WINDOW);
              const isBatchEnd = isPartOfBatch && (!filteredMessages[i+1] || !(filteredMessages[i+1].file_path && !filteredMessages[i+1].message) || String(filteredMessages[i+1].sender_id) !== String(msg.sender_id) || (new Date(filteredMessages[i+1].created_at).getTime() - new Date(msg.created_at).getTime()) > BATCH_TIME_WINDOW);

              return (
                <div key={msg.id || i} style={{ display: "flex", marginBottom: "10px", justifyContent: isSender ? "flex-end" : "flex-start" }}>
                  {/* Avatar for receiver */}
                  {!isSender && (
                    <img src={selectedConversation?.is_group ? (msgSender?.image || userImg) : (receiver?.image || userImg)} alt="" onError={(e) => (e.target.src = userImg)}
                      style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", marginRight: 8, marginTop: "auto", flexShrink: 0 }}
                    />
                  )}

                  {/* Show 3-dots menu only for last message in batch or non-batched messages */}
                  {isSender && (!isPartOfBatch || isBatchEnd) && (
                    <BatchMessageOptions 
                      msg={msg}
                      isSender={isSender}
                      activeDropdownMsgId={activeDropdownMsgId}
                      setActiveDropdownMsgId={setActiveDropdownMsgId}
                      onDeleteMessage={handleDeleteMessage}
                      onDeleteBatch={handleDeleteBatch}
                      isBatch={isPartOfBatch}
                      batchMessages={isPartOfBatch ? (() => {
                        const batch = [];
                        let idx = i;
                        const currentSenderId = String(msg.sender_id);
                        const BATCH_TIME_WINDOW = 30000;
                        while (idx < filteredMessages.length) {
                          const currentMsg = filteredMessages[idx];
                          if (msg.batch_id && currentMsg.batch_id === msg.batch_id) {
                            if (currentMsg.file_path) batch.push(currentMsg);
                            idx++;
                            continue;
                          }
                          if (!msg.batch_id && currentMsg.file_path && !currentMsg.message) {
                            const isSameSender = String(currentMsg.sender_id) === currentSenderId;
                            const timeDiff = Math.abs(new Date(currentMsg.created_at).getTime() - new Date(msg.created_at).getTime());
                            if (isSameSender && timeDiff < BATCH_TIME_WINDOW) {
                              batch.push(currentMsg);
                              idx++;
                              continue;
                            }
                          }
                          break;
                        }
                        return batch;
                      })() : [msg]}
                      T={T}
                      getFileUrl={getFileUrl}
                    />
                  )}

                  <div style={{
                    padding: msg.message_type === "offer" ? "0" : isVisualAttachment ? "0" : "7px 12px",
                    borderRadius: isSender ? "7.5px 7.5px 0 7.5px" : "7.5px 7.5px 7.5px 0",
                    maxWidth: msg.message_type === "offer" ? "90%" : "72%",
                    backgroundColor: msg.message_type === "offer" ? "transparent" : isVisualAttachment ? "transparent" : isSender ? "var(--wa-sent-bubble, #005C4B)" : "var(--wa-recv-bubble, #202C33)",
                    boxShadow: msg.message_type === "offer" ? "none" : isVisualAttachment ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
                    wordBreak: "break-word",
                    width: msg.message_type === "offer" ? "min(90%, 480px)" : "auto",
                    position: "relative",
                  }}>
                    {!isSender && selectedConversation?.is_group && msgSender && (
                      <div 
                        onClick={() => setSelectedMemberProfile(msgSender)}
                        style={{ 
                          fontSize: "11px", 
                          fontWeight: "700", 
                          color: "var(--inbox-primary)", 
                          marginBottom: "4px",
                          cursor: "pointer",
                          display: "inline-block"
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                      >
                        {senderName}
                      </div>
                    )}

                    {/* Batch Grid for Multiple Media */}
                    {isBatchStart && (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr", // Exactly 2 columns
                        gridTemplateRows: "1fr 1fr", // Exactly 2 rows
                        gap: "4px",
                        marginBottom: "4px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        maxWidth: "300px", // Fixed width for 2x2
                        aspectRatio: "1", // Square container
                      }}>
                        {/* Find all messages in this batch (by batch_id or time window) */}
                        {(() => {
                          const batchMessages = [];
                          let idx = i;
                          const currentSenderId = String(msg.sender_id);
                          while (idx < filteredMessages.length) {
                            const currentMsg = filteredMessages[idx];
                            // Check if same batch_id
                            if (msg.batch_id && currentMsg.batch_id === msg.batch_id) {
                              if (currentMsg.file_path) {
                                batchMessages.push(currentMsg);
                              }
                              idx++;
                              continue;
                            }
                            // Or check time-based grouping
                            if (!msg.batch_id && currentMsg.file_path && !currentMsg.message) {
                              const isSameSender = String(currentMsg.sender_id) === currentSenderId;
                              const timeDiff = Math.abs(new Date(currentMsg.created_at).getTime() - new Date(msg.created_at).getTime());
                              if (isSameSender && timeDiff < BATCH_TIME_WINDOW) {
                                batchMessages.push(currentMsg);
                                idx++;
                                continue;
                              }
                            }
                            break;
                          }
                          const totalCount = batchMessages.length;
                          const showCount = Math.min(totalCount, 4);
                          const remainingCount = totalCount - 4;

                          return batchMessages.slice(0, showCount).map((batchMsg, batchIdx) => (
                            <div
                              key={batchMsg.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                const isVideo = batchMsg.file_name?.match(/\.(mp4|webm|mov|ogg|quicktime|m4v|3gp)$/i);
                                setLightboxMedia({
                                  url: getFileUrl(batchMsg.file_path),
                                  type: isVideo ? "video" : "image",
                                  fileName: batchMsg.file_name,
                                  filePath: batchMsg.file_path,
                                  msgId: batchMsg.id
                                });
                              }}
                              style={{
                                aspectRatio: "1",
                                cursor: "zoom-in",
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {batchMsg.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                  src={getFileUrl(batchMsg.file_path)}
                                  alt={batchMsg.file_name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : batchMsg.file_name?.match(/\.(mp4|webm|mov|ogg|quicktime|m4v|3gp)$/i) ? (
                                <div style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "#1a1a1a",
                                  position: "relative",
                                }}>
                                  <video
                                    src={getFileUrl(batchMsg.file_path)}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div style={{
                                    position: "absolute",
                                    bottom: "4px",
                                    right: "4px",
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                    color: "#fff",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                  }}>▶</div>
                                </div>
                              ) : (
                                <div style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "24px",
                                }}>📄</div>
                              )}
                              {/* Show +X count on 4th item if more exist */}
                              {batchIdx === 3 && remainingCount > 0 && (
                                <div style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(0,0,0,0.6)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#fff",
                                  fontSize: "28px",
                                  fontWeight: 700,
                                }}>
                                  +{remainingCount}
                                </div>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                    )}

                    {msg.file_path && !isPartOfBatch && (
                      <div style={{ marginTop: "6px", marginBottom: "6px" }}>
                        {msg.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div style={{ marginBottom: "4px" }}>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxMedia({
                                  url: getFileUrl(msg.file_path),
                                  type: "image",
                                  fileName: msg.file_name,
                                  filePath: msg.file_path,
                                  msgId: msg.id
                                });
                              }}
                              style={{ cursor: "zoom-in" }}
                            >
                              <img 
                                src={getFileUrl(msg.file_path)} 
                                alt={msg.file_name} 
                                style={{ 
                                  maxWidth: "100%", 
                                  maxHeight: "220px", 
                                  borderRadius: "10px", 
                                  objectFit: "cover",
                                  border: `1px solid ${T.border}`
                                }} 
                              />
                            </div>
                          </div>
                        ) : msg.file_name?.match(/\.(mp4|webm|mov|ogg|quicktime|m4v|3gp)$/i) ? (
                          <div style={{ marginBottom: "4px", position: "relative" }}>
                            <video 
                              src={getFileUrl(msg.file_path)} 
                              controls
                              style={{ 
                                display: "block",
                                maxWidth: "100%", 
                                maxHeight: "250px", 
                                borderRadius: "10px", 
                                border: `1px solid ${T.border}`
                              }} 
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxMedia({
                                  url: getFileUrl(msg.file_path),
                                  type: "video",
                                  fileName: msg.file_name,
                                  filePath: msg.file_path,
                                  msgId: msg.id
                                });
                              }}
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "rgba(11, 20, 26, 0.8)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#ffffff",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "14px",
                                transition: "background 0.2s"
                              }}
                              title="Zoom Video"
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(11, 20, 26, 0.95)"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(11, 20, 26, 0.8)"}
                            >
                              🔍
                            </button>
                          </div>
                        ) : msg.file_name?.match(/\.pdf$/i) ? (
                          <div style={{ marginBottom: "4px" }}>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxMedia({
                                  url: getFileUrl(msg.file_path),
                                  type: "pdf",
                                  fileName: msg.file_name,
                                  filePath: msg.file_path,
                                  msgId: msg.id
                                });
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                backgroundColor: isSender ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                cursor: "pointer",
                                transition: "background 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isSender ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSender ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}
                            >
                              <span style={{ fontSize: "24px" }}>📄</span>
                              <div style={{ flex: 1, overflow: "hidden" }}>
                                <div style={{ fontSize: "13px", fontWeight: 600, color: isSender ? "#fff" : T.white, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                  {msg.file_name.replace(/^\d+_/, "")}
                                </div>
                                <div style={{ fontSize: "11px", color: isSender ? "rgba(255,255,255,0.7)" : T.bodyGray }}>
                                  PDF Document • Click to View
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (msg.file_name?.match(/\.(mp3|wav|ogg|webm|m4a|3gp|aac)$/i) || msg.file_name?.includes("voice_note")) ? (
                          <div style={{ marginBottom: "4px" }}>
                            <WhatsAppAudioPlayer src={getFileUrl(msg.file_path)} />
                          </div>
                        ) : null}

                        {!(msg.file_name?.match(/\.(mp3|wav|ogg|webm|m4a|3gp|aac|jpg|jpeg|png|gif|webp|mp4|mov|quicktime|m4v|3gp|pdf)$/i) || msg.file_name?.includes("voice_note")) && (
                          <>
                            <button
                              style={{ background: "none", border: "none", color: isSender ? "#fff" : T.orange, padding: 0, cursor: "pointer", textDecoration: "underline", fontSize: "13px", display: "flex", alignItems: "center", gap: 6 }}
                              disabled={downloadingFileId === msg.id}
                              onClick={() => handleDownload(msg.file_path, msg.file_name, msg.id)}
                            >
                              {downloadingFileId === msg.id ? (
                                <CircularProgress size={14} style={{ color: isSender ? "#fff" : T.orange }} />
                              ) : (
                                <>
                                  📎 {(() => {
                                    if (!msg.file_name) return "Attachment";
                                    const cleanName = msg.file_name.replace(/^\d+_/, "");
                                    return cleanName.length > 25 
                                      ? cleanName.substring(0, 22) + "..." + cleanName.split('.').pop()
                                      : cleanName;
                                  })()}
                                </>
                              )}
                            </button>
                            <small style={{ display: "block", color: isSender ? "rgba(255,255,255,0.6)" : T.bodyGray, fontSize: "11px", marginTop: 2 }}>
                              {msg.file_size ? `${(msg.file_size / 1024).toFixed(1)} KB` : ""}
                            </small>
                          </>
                        )}
                      </div>
                    )}

                    {msg.message && msg.message_type !== "offer" && msg.message_type !== "call" && (
                      <div style={{ marginBottom: "2px", fontSize: getBubbleFontSize(), lineHeight: 1.5, color: "var(--wa-bubble-text, #E9EDEF)" }}>
                        {renderMessageText(msg.message)}
                      </div>
                    )}

                    {msg.message_type === "call" && (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "6px 8px",
                        minWidth: "220px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(34, 197, 94, 0.15)",
                            fontSize: "20px"
                          }}>
                            📹
                          </span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: isSender ? "#fff" : T.white }}>
                              Grapetask Live Meeting
                            </div>
                            <div style={{ fontSize: "12px", color: isSender ? "rgba(255,255,255,0.7)" : T.bodyGray }}>
                              Click Join to start video & screen share
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCallRoom(msg.message);
                          }}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            backgroundColor: "#22c55e",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background 0.2s, transform 0.1s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "4px"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#22c55e"}
                        >
                          Join Meeting
                        </button>
                      </div>
                    )}

                    {msg.message_type === "offer" && renderOfferMessage(msg)}

                    {(msg.message_type === "offer_accepted" || msg.message_type === "offer_declined" || msg.message_type === "order_submitted") && (
                      <div style={{ backgroundColor: "rgba(240,89,31,0.08)", padding: "5px 10px", borderRadius: "6px", marginBottom: "4px", border: `1px solid ${T.orangeBorder}` }}>
                        <small style={{ color: T.orange }}>{msg.message}</small>
                      </div>
                    )}

                    {/* Show time and ticks only for last message in batch or non-batched messages */}
                    {msg.message_type !== "offer" && (!isPartOfBatch || isBatchEnd) && (
                      <div style={{ textAlign: "right", marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                        <span style={{ fontSize: "11px", color: "var(--wa-time-text, #8696A0)", letterSpacing: "0.01em" }}>{time}</span>
                        {isSender && (() => {
                          const totalExpected = selectedConversation?.is_group 
                            ? (selectedConversation.participants?.length || 1) - 1 
                            : 1;
                          const actualRead = Array.isArray(msg.read_by) ? msg.read_by.length : (msg.read ? 1 : 0);
                          const readByAll = actualRead >= totalExpected && totalExpected > 0;
                          
                          const tooltip = Array.isArray(msg.read_by) && msg.read_by.length > 0
                            ? "Seen by:\n" + msg.read_by.map(r => `${r.name} (${formatRoleForDisplay(r.role)})`).join("\n")
                            : msg.read ? "Read" : "Sent (Unread)";

                          const isAnyReceiverOnline = selectedConversation?.is_group 
                            ? selectedConversation.participants?.some(p => p.id !== currentUser.id && (onlineUsers[p.id] === 'online' || onlineUsers[p.id] === true))
                            : isReceiverOnline;

                          return (
                            <div title={tooltip} style={{ display: "flex", alignItems: "center", cursor: "help" }}>
                              {readByAll ? (
                                <BsCheck2All size={15} color="#f0591f" />
                              ) : (actualRead > 0 || isAnyReceiverOnline) ? (
                                <BsCheck2All size={15} color="rgba(255,255,255,0.55)" />
                              ) : (
                                <BsCheck2 size={15} color="rgba(255,255,255,0.55)" />
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {!isSender && (
                    <MessageOptions 
                      msg={msg} 
                      isSender={isSender} 
                      activeDropdownMsgId={activeDropdownMsgId} 
                      setActiveDropdownMsgId={setActiveDropdownMsgId} 
                      onDeleteMessage={handleDeleteMessage} 
                      T={T} 
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              {!isCommunicationAllowed ? (
                <div style={{ backgroundColor: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "12px", padding: "20px", maxWidth: "400px" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: 600, color: "#fbbf24" }}>Direct communication restricted.</p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: T.midGray }}>All communications must go through a Business Developer.</p>
                  <p style={{ margin: 0, fontSize: "14px", color: T.bodyGray }}>Please contact your BD to mediate this conversation.</p>
                </div>
              ) : (
                <div style={{ color: T.bodyGray }}>
                  <span style={{ fontSize: 40 }}>👋</span>
                  <p style={{ marginTop: 12, fontSize: "15px" }}>Start the conversation!</p>
                </div>
              )}
            </div>
          )}

          {/* Typing bubble */}
          {isSomeoneTyping && (
            <div style={{ display: "flex", marginBottom: "10px", justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
              <img src={receiver?.image || userImg} alt="" onError={(e) => (e.target.src = userImg)}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{
                padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                backgroundColor: T.receiverBubble, display: "flex", alignItems: "center", gap: 5,
              }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* ── INPUT AREA ── */}
        <div style={{
          flexShrink: 0, padding: "8px 16px",
          backgroundColor: "var(--wa-panel, #202C33)",
          borderTop: "1px solid var(--wa-divider, #374045)",
        }}>
          {(selectedConversation?.order_status === "completed" || selectedConversation?.order?.status === "completed") ? (
            <div style={{ backgroundColor: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "10px", padding: "12px 16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#a855f7", fontWeight: "600" }}>
                🎉 Order Completed
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: T.midGray }}>
                This order has been completed. The conversation is now read-only.
              </p>
            </div>
          ) : !isCommunicationAllowed ? (
            <div style={{ backgroundColor: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "10px", padding: "12px 16px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#fbbf24" }}>
                <strong>⚠️ Communication Restricted</strong><br />
                <span style={{ color: T.midGray }}>You cannot communicate directly with {receiver?.fname || "this user"}. Please contact a Business Developer.</span>
              </p>
            </div>
          ) : (
            <>
              {selectedFile && (
                <div style={{ 
                  marginBottom: "12px", 
                  display: "flex", 
                  flexDirection: "column",
                  padding: "12px", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  borderRadius: "14px", 
                  border: `1px solid ${T.border}` 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {selectedFile.type?.startsWith("image/") && filePreview ? (
                      <img src={filePreview} alt="preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: `1px solid ${T.border}` }} />
                    ) : selectedFile.type === "application/pdf" || selectedFile.name?.toLowerCase().endsWith(".pdf") ? (
                      <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                        📕
                      </div>
                    ) : (selectedFile.type?.startsWith("audio/") || selectedFile.name?.includes("voice_note")) ? (
                      <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(34, 197, 94, 0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                        🎙️
                      </div>
                    ) : (
                      <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                        📎
                      </div>
                    )}
                    
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                      <span style={{ color: T.white, fontSize: "14px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedFile.name}
                      </span>
                      <span style={{ color: T.midGray, fontSize: "12px", marginTop: "2px" }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || "Attachment"}
                      </span>
                    </div>

                    <button 
                      onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                      style={{ 
                        backgroundColor: "rgba(239,68,68,0.1)", 
                        border: "1px solid rgba(239,68,68,0.2)", 
                        color: "#ef4444", 
                        padding: "6px 12px", 
                        borderRadius: "8px", 
                        fontSize: "12px", 
                        cursor: "pointer", 
                        fontWeight: "600",
                        transition: "all 0.2s",
                        marginRight: "8px"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={loading}
                      style={{ 
                        backgroundColor: T.orange, 
                        border: "none", 
                        color: "#ffffff", 
                        padding: "6px 16px", 
                        borderRadius: "8px", 
                        fontSize: "12px", 
                        cursor: "pointer", 
                        fontWeight: "600",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 8px rgba(240,89,31,0.3)"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d94e18"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.orange; }}
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>

                  {/* Audio note play preview */}
                  {(selectedFile.type?.startsWith("audio/") || selectedFile.name?.includes("voice_note")) && (
                    <div style={{ marginTop: "10px" }}>
                      <WhatsAppAudioPlayer src={filePreview || URL.createObjectURL(selectedFile)} />
                    </div>
                  )}
                </div>
              )}

              {isRecording ? (
                <div 
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleDragEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    backgroundColor: "var(--wa-input-bg, #2A3942)", 
                    borderRadius: "28px", 
                    overflow: "hidden", 
                    width: "100%", 
                    padding: "8px 12px",
                    gap: "8px",
                    minHeight: "52px",
                    userSelect: "none",
                    touchAction: "none"
                  }}
                >
                  {/* Recording Red Dot */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    flexShrink: 0
                  }}>
                    <span style={{ 
                      width: "10px", 
                      height: "10px", 
                      backgroundColor: "#ff3131", 
                      borderRadius: "50%",
                      animation: "blink 1s infinite",
                      boxShadow: "0 0 8px #ff3131"
                    }}></span>
                  </div>

                  {/* Recording Timer */}
                  <span style={{ 
                    color: "#ff3131", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    fontFamily: "monospace",
                    minWidth: "45px"
                  }}>
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                  </span>

                  {/* Slide to Cancel with Chevron - Responsive */}
                  <div style={{ 
                    flex: 1, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    gap: "8px",
                    overflow: "hidden"
                  }}>
                    <span style={{ 
                      color: "var(--wa-text-second, #8696A0)", 
                      fontSize: "clamp(12px, 3vw, 14px)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap"
                    }}>
                      <span style={{ 
                        display: "inline-flex", 
                        animation: "slideLeft 1.5s infinite ease-in-out"
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </span>
                      <span className="slide-text">Slide to cancel</span>
                    </span>
                  </div>

                  {/* Lock Icon (WhatsApp Style) */}
                  <button 
                    onClick={stopVoiceRecording}
                    style={{
                      background: "none", 
                      border: "none", 
                      color: "var(--wa-text-second, #8696A0)",
                      cursor: "pointer",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    title="Lock recording"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  width: "100%", 
                  gap: "8px",
                }}>
                  {/* ── Input Row with Voice Button ── */}
                  <div className="chat-input-container" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      backgroundColor: "var(--wa-input-bg, #2A3942)", 
                      borderRadius: "28px", 
                      border: "none", 
                      overflow: "hidden", 
                      gap: 0, 
                      flex: 1,
                      minHeight: "52px",
                      transform: showAttachMenu ? "translateY(-100px)" : "translateY(0)",
                      transition: "transform 0.25s ease-out"
                    }}>
                      {/* Attachment Button - Left side of input */}
                      <button
                        onClick={() => setShowAttachMenu(p => !p)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: showAttachMenu ? "var(--wa-green)" : "var(--wa-icon, #AEBAC1)",
                          padding: "0 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color 0.2s",
                        }}
                        title="Attach"
                      >
                        <IoMdAttach style={{ fontSize: "22px", transform: showAttachMenu ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s" }} />
                      </button>

                      <input
                        ref={inputRef}
                        value={inputVal}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        onPaste={handlePaste}
                        onFocus={() => {
                          // Only show tabs panel on focus, not the content
                          setShowTabsPanel(true);
                        }}
                        disabled={!receiverId || loading || !isCommunicationAllowed}
                        placeholder="Type a message"
                        style={{
                          flex: 1, border: "none", padding: "13px 16px",
                          fontSize: "15px", outline: "none",
                          backgroundColor: "transparent",
                          color: "var(--wa-text-primary, #E9EDEF)",
                          caretColor: "var(--wa-green, #00A884)",
                          opacity: 1,
                        }}
                      />

                      {/* Hidden file inputs */}
                      <input ref={galleryInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleFileChange} />
                      <input ref={documentInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" multiple style={{ display: "none" }} onChange={handleFileChange} />
                    </div>

                    {/* Send Button - Only shows when typing */}
                    {(inputVal?.trim() || selectedFile) && (
                      <button
                        onClick={handleSend}
                        disabled={(!inputVal?.trim() && !selectedFile) || !receiverId || loading || !isCommunicationAllowed}
                        style={{
                          backgroundColor: "var(--wa-green, #00A884)",
                          color: "#ffffff",
                          border: "none",
                          padding: "0",
                          cursor: "pointer",
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginLeft: "4px",
                          transition: "background-color 0.2s, transform 0.1s",
                        }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "#009070"; e.currentTarget.style.transform = "scale(1.05)"; } }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--wa-green, #00A884)"; e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        <RiSendPlaneFill style={{ fontSize: "20px" }} />
                      </button>
                    )}

                    {/* ── Voice Button (Always Visible) ── */}
                    {!inputVal?.trim() && !selectedFile && (
                      <button
                        onMouseDown={(e) => {
                          touchStartXRef.current = e.clientX;
                          setIsRecording(true);
                          startVoiceRecording();
                        }}
                        onMouseUp={() => {
                          if (isRecording) {
                            stopVoiceRecording();
                          }
                        }}
                        onMouseLeave={() => {
                          if (isRecording) {
                            stopVoiceRecording();
                          }
                        }}
                        onTouchStart={(e) => {
                          touchStartXRef.current = e.touches[0].clientX;
                          setIsRecording(true);
                          startVoiceRecording();
                        }}
                        onTouchEnd={() => {
                          if (isRecording) {
                            stopVoiceRecording();
                          }
                        }}
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          backgroundColor: isRecording ? "#FF4444" : "var(--wa-green, #00A884)",
                          border: "none",
                          color: "#ffffff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "background-color 0.2s, transform 0.1s",
                          transform: isRecording ? "scale(1.1)" : "scale(1)",
                        }}
                        title={isRecording ? "Recording... Slide left to cancel" : "Hold to record voice message"}
                      >
                        {isRecording ? <BsStopFill style={{ fontSize: "18px" }} /> : <MdKeyboardVoice style={{ fontSize: "22px" }} />}
                      </button>
                    )}
                  </div>

                  {/* ── WhatsApp Style Tab Bar (Below Input) ── */}
                  {showTabsPanel && (
                    <div
                      ref={tabsPanelRef}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "8px",
                        padding: "6px 12px",
                        backgroundColor: "#fff",
                        borderTop: "1px solid #E9EDEF",
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        animation: "slideUp 0.2s ease-out",
                      }}>
                      {/* ABC - Keyboard Button */}
                      <button
                        onClick={() => {
                          setShowEmojiPanel(false);
                          inputRef.current?.focus();
                        }}
                        style={{
                          background: !showEmojiPanel ? "#00A884" : "#F0F2F5",
                          border: "none",
                          color: !showEmojiPanel ? "#fff" : "#667781",
                          cursor: "pointer",
                          padding: "6px 14px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          boxShadow: !showEmojiPanel ? "0 2px 4px rgba(0,168,132,0.3)" : "none",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="M6 8h.01M6 12h.01M6 16h.01"/>
                        </svg>
                        ABC
                      </button>

                      {/* Emoji Button */}
                      <button
                        onClick={() => {
                          setShowEmojiPanel(true);
                          setActivePanelTab('emoji');
                        }}
                        style={{
                          background: showEmojiPanel && activePanelTab === 'emoji' ? "#00A884" : "#F0F2F5",
                          border: "none",
                          color: showEmojiPanel && activePanelTab === 'emoji' ? "#fff" : "#667781",
                          cursor: "pointer",
                          padding: "6px 14px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          boxShadow: showEmojiPanel && activePanelTab === 'emoji' ? "0 2px 4px rgba(0,168,132,0.3)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>😊</span>
                        Emoji
                      </button>

                      {/* GIF Button */}
                      <button
                        onClick={() => {
                          setShowEmojiPanel(true);
                          setActivePanelTab('gif');
                          if (gifs.length === 0) fetchGifs('trending');
                        }}
                        style={{
                          background: showEmojiPanel && activePanelTab === 'gif' ? "#00A884" : "#F0F2F5",
                          border: "none",
                          color: showEmojiPanel && activePanelTab === 'gif' ? "#fff" : "#667781",
                          cursor: "pointer",
                          padding: "6px 14px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          boxShadow: showEmojiPanel && activePanelTab === 'gif' ? "0 2px 4px rgba(0,168,132,0.3)" : "none",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <text x="2" y="14" fontSize="11" fontWeight="bold" fontFamily="Arial">GIF</text>
                        </svg>
                        GIF
                      </button>

                      {/* Stickers Button */}
                      <button
                        onClick={() => {
                          setShowEmojiPanel(true);
                          setActivePanelTab('stickers');
                        }}
                        style={{
                          background: showEmojiPanel && activePanelTab === 'stickers' ? "#00A884" : "#F0F2F5",
                          border: "none",
                          color: showEmojiPanel && activePanelTab === 'stickers' ? "#fff" : "#667781",
                          cursor: "pointer",
                          padding: "6px 14px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          boxShadow: showEmojiPanel && activePanelTab === 'stickers' ? "0 2px 4px rgba(0,168,132,0.3)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>🎨</span>
                        Stickers
                      </button>

                      {/* Close Button */}
                      <button
                        onClick={() => {
                          setShowEmojiPanel(false);
                          setShowTabsPanel(false);
                        }}
                        style={{
                          background: "#F0F2F5",
                          border: "none",
                          color: "#667781",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </>
          )}

          {/* ── WhatsApp Style Emoji/GIF/Stickers Panel ── */}
          {showEmojiPanel && (
            <div
              ref={emojiPanelRef}
              style={{
                width: "100%",
                height: "300px",
                backgroundColor: "#F0F2F5",
                borderTop: "1px solid #D1D7DB",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px 16px 0 0",
                marginTop: "8px",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                animation: "slideUp 0.2s ease-out",
              }}
            >
              <style>{`
                @keyframes slideUp {
                  from { transform: translateY(100%); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
              `}</style>

              {/* Panel Content */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Emoji Tab */}
                {activePanelTab === 'emoji' && (
                  <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "8px",
                  }}>
                    {stickers.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => addEmojiToInput(emoji)}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: "28px",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "8px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* GIF Tab */}
                {activePanelTab === 'gif' && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Search Bar */}
                    <div style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--wa-border, #D1D7DB)",
                      display: "flex",
                      gap: "8px",
                    }}>
                      <input
                        type="text"
                        value={gifSearch}
                        onChange={(e) => setGifSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            fetchGifs(gifSearch || 'trending');
                          }
                        }}
                        placeholder="Search GIFs..."
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "20px",
                          border: "1px solid var(--wa-border, #D1D7DB)",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "#fff",
                        }}
                      />
                      <button
                        onClick={() => fetchGifs(gifSearch || 'trending')}
                        style={{
                          padding: "10px 16px",
                          backgroundColor: "var(--wa-green, #00A884)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Search
                      </button>
                    </div>

                    {/* GIF Grid */}
                    <div style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "12px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                    }}>
                      {isLoadingGifs ? (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--wa-text-muted)" }}>
                          Loading GIFs...
                        </div>
                      ) : gifs.length === 0 ? (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--wa-text-muted)" }}>
                          No GIFs found. Try searching!
                        </div>
                      ) : (
                        gifs.map((gif) => (
                          <button
                            key={gif.id}
                            onClick={() => sendGif(gif.images.fixed_height_small.url)}
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: "0",
                              cursor: "pointer",
                              borderRadius: "8px",
                              overflow: "hidden",
                              transition: "transform 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          >
                            <img
                              src={gif.images.fixed_height_small_still?.url || gif.images.fixed_height_small.url}
                              alt={gif.title}
                              style={{
                                width: "100%",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              loading="lazy"
                            />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Stickers Tab */}
                {activePanelTab === 'stickers' && (
                  <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "12px",
                  }}>
                    {/* Sample stickers - in real app these would come from a stickers API */}
                    {['❤️', '🔥', '👍', '🎉', '😂', '😍', '🥳', '🎂', '🌹', '🌟', '💯', '✨', '🙏', '💪', '🤝', '🎁'].map((sticker, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendSticker(sticker)}
                        style={{
                          background: "#fff",
                          border: "1px solid var(--wa-border, #D1D7DB)",
                          fontSize: "40px",
                          cursor: "pointer",
                          padding: "16px",
                          borderRadius: "12px",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "var(--wa-green-light, #E0F2F1)";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Image Upload Modal - Multiple Images Grid ── */}
          {showImageUploadModal && selectedImages.length > 0 && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}>
              <div style={{
                backgroundColor: "#fff",
                borderRadius: "24px",
                padding: "32px",
                maxWidth: "520px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
                animation: "slideUp 0.3s ease-out",
              }}>
                {/* Title */}
                <h2 style={{
                  margin: "0 0 8px 0",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}>
                  📎 Send Files
                </h2>
                <p style={{
                  margin: "0 0 24px 0",
                  fontSize: "14px",
                  color: "#666",
                }}>
                  {selectedImages.filter(img => img.selected).length} of {selectedImages.length} selected
                </p>

                {/* Multiple Images/Video - Horizontal Scroll */}
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  marginBottom: "24px",
                  overflowX: "auto",
                  overflowY: "hidden",
                  paddingBottom: "8px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#ccc transparent",
                }}>
                  {selectedImages.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const updated = [...selectedImages];
                        updated[index].selected = !updated[index].selected;
                        setSelectedImages(updated);
                      }}
                      style={{
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        flexShrink: 0,
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: item.selected ? "3px solid #00A884" : "3px solid transparent",
                        boxShadow: item.selected ? "0 4px 12px rgba(0,168,132,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Image, Video or Document Display */}
                      {item.type === "image" ? (
                        <img
                          src={item.preview}
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : item.type === "video" ? (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#1a1a1a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}>
                          <video
                            src={item.preview}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {/* Video Icon Overlay */}
                          <div style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            backgroundColor: "rgba(0,0,0,0.7)",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}>
                            ▶
                          </div>
                        </div>
                      ) : (
                        /* Document Card */
                        <div style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px",
                          boxSizing: "border-box",
                        }}>
                          {/* File Icon */}
                          <div style={{
                            fontSize: "36px",
                            marginBottom: "8px",
                          }}>
                            {item.type === "pdf" ? "📄" :
                             item.type === "word" ? "📝" :
                             item.type === "excel" ? "📊" :
                             item.type === "ppt" ? "📽️" :
                             item.type === "zip" ? "🗜️" : "📎"}
                          </div>
                          {/* File Name */}
                          <div style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#333",
                            textAlign: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            marginBottom: "4px",
                          }}>
                            {item.fileName}
                          </div>
                          {/* File Size */}
                          <div style={{
                            fontSize: "10px",
                            color: "#666",
                          }}>
                            {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      )}
                      {/* Selection checkmark */}
                      {item.selected && (
                        <div style={{
                          position: "absolute",
                          top: "-2px",
                          right: "-2px",
                          backgroundColor: "#00A884",
                          color: "#fff",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          border: "2px solid #fff",
                          zIndex: 2,
                        }}>
                          ✓
                        </div>
                      )}
                      {/* Type Badge */}
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: item.type === "video" ? "rgba(220,53,69,0.9)" : 
                                         item.type === "image" ? "rgba(0,168,132,0.9)" : 
                                         "rgba(108,117,125,0.9)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        {item.type === "video" ? "VIDEO" : 
                         item.type === "image" ? "IMG" : 
                         item.type === "pdf" ? "PDF" :
                         item.type === "word" ? "DOC" :
                         item.type === "excel" ? "XLS" :
                         item.type === "ppt" ? "PPT" :
                         item.type === "zip" ? "ZIP" : "FILE"}
                      </div>
                      {/* Hover overlay */}
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: item.selected ? "transparent" : "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: item.selected ? 0 : 1,
                        transition: "opacity 0.2s",
                      }}>
                        <span style={{
                          color: "#fff",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}>+</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Caption Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "10px",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                  }}>
                    Add a caption
                  </label>
                  <textarea
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Type a caption for your images..."
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid #e8e8e8",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "none",
                      minHeight: "80px",
                      fontFamily: "inherit",
                    }}
                    maxLength={200}
                  />
                  <div style={{
                    textAlign: "right",
                    fontSize: "12px",
                    color: "#999",
                    marginTop: "6px",
                  }}>
                    {imageCaption.length}/200
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: "flex",
                  gap: "12px",
                }}>
                  <button
                    onClick={cancelImageUpload}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      borderRadius: "14px",
                      border: "2px solid #e0e0e0",
                      backgroundColor: "#fff",
                      color: "#333",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Send all selected files (images, videos, documents)
                      const mediaToSend = selectedImages.filter(item => item.selected);
                      if (mediaToSend.length === 0) {
                        toast.error("Please select at least one file");
                        return;
                      }
                      // Generate batch ID for grouping multiple media
                      const batchId = mediaToSend.length > 1 ? `batch-${Date.now()}` : null;
                      setCurrentBatchId(batchId);

                      // Send each item
                      mediaToSend.forEach(async (item) => {
                        try {
                          let messageType = "file";
                          if (item.type === "video") messageType = "video";
                          else if (item.type === "image") messageType = "file";
                          else messageType = "file"; // documents

                          const messageData = {
                            receiver_id: receiverId,
                            message_type: messageType,
                            message: imageCaption?.trim() || "",
                            file: item.file,
                            batch_id: batchId, // For grouping in chat
                          };
                          await dispatch(sendMessage(messageData)).unwrap();
                        } catch (err) {
                          toast.error(`Failed to send ${item.type}`);
                        }
                      });
                      setSelectedImages([]);
                      setImageCaption("");
                      setShowImageUploadModal(false);
                      setCurrentBatchId(null);
                      toast.success(`${mediaToSend.length} item(s) sent!`);
                    }}
                    disabled={selectedImages.filter(img => img.selected).length === 0}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      borderRadius: "14px",
                      border: "none",
                      backgroundColor: selectedImages.filter(img => img.selected).length > 0 ? "#00A884" : "#ccc",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: selectedImages.filter(img => img.selected).length > 0 ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                      boxShadow: selectedImages.filter(img => img.selected).length > 0 ? "0 4px 12px rgba(0,168,132,0.4)" : "none",
                    }}
                  >
                    <span>Send {selectedImages.filter(img => img.selected).length > 0 && `(${selectedImages.filter(img => img.selected).length})`}</span>
                    <span style={{ fontSize: "18px" }}>➤</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Voice Recording & Menu Animations */}
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            @keyframes slideLeft {
              0%, 100% { transform: translateX(0); opacity: 0.5; }
              50% { transform: translateX(-4px); opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes wa-slide-up {
              0% { transform: translateX(-50%) translateY(100%); opacity: 0; }
              100% { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes wa-camera-in {
              0% { opacity: 0; transform: scale(0.9); }
              100% { opacity: 1; transform: scale(1); }
            }
            .wa-attach-container {
              animation: wa-slide-up 0.25s ease-out;
            }
            .wa-camera-modal {
              animation: wa-camera-in 0.25s ease;
            }
            /* Camera responsive styles */
            @media (max-width: 768px) {
              .wa-camera-modal {
                width: 100vw !important;
                height: 100vh !important;
                border-radius: 0 !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
              }
            }
            @media (max-width: 400px) {
              .slide-text {
                display: none;
              }
            }
          `}</style>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CAMERA MODAL – WhatsApp Style
      ════════════════════════════════════════ */}
      {showCameraModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeCamera(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            className="wa-camera-modal"
            style={{
              position: "relative",
              width: "min(95vw, 500px)",
              height: "min(90vh, 700px)",
              backgroundColor: "#000",
              borderRadius: "20px",
              overflow: "hidden",
              animation: "wa-camera-in 0.25s ease",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            {/* Header - Close Button Only */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              padding: "16px 20px", zIndex: 10,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
            }}>
              {/* Close */}
              <button
                onClick={closeCamera}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
                  width: "44px", height: "44px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(8px)", fontSize: "22px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.6)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              >
                ✕
              </button>
            </div>

            {/* Video / Preview */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#111", overflow: "hidden" }}>
              {/* Live video feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  display: capturedPhoto ? "none" : "block",
                  transform: cameraFacing === "user" ? "scaleX(-1)" : "scaleX(1)",
                  transition: "transform 0.3s",
                }}
              />
              {/* Captured photo preview */}
              {capturedPhoto && (
                <img
                  src={capturedPhoto}
                  alt="captured"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              {/* Recorded video preview */}
              {recordedVideo?.url && (
                <video
                  src={recordedVideo.url}
                  controls
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", backgroundColor: "#000" }}
                />
              )}
              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {/* Mode Toggle - Photo/Video */}
            {!capturedPhoto && !recordedVideo && (
              <div style={{
                position: "absolute",
                bottom: "140px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                background: "rgba(0,0,0,0.6)",
                padding: "6px",
                borderRadius: "24px",
                zIndex: 100,
                backdropFilter: "blur(8px)",
              }}>
                <button
                  onClick={() => setCameraMode('photo')}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "none",
                    background: cameraMode === 'photo' ? "#fff" : "transparent",
                    color: cameraMode === 'photo' ? "#000" : "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Photo
                </button>
                <button
                  onClick={() => setCameraMode('video')}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "none",
                    background: cameraMode === 'video' ? "#fff" : "transparent",
                    color: cameraMode === 'video' ? "#000" : "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Video
                </button>
              </div>
            )}

            {/* Controls Bar */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              padding: "20px 24px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              zIndex: 10,
            }}>
              {!capturedPhoto && !recordedVideo ? (
                <>
                  {/* Retake placeholder (spacing) */}
                  <div style={{ width: "52px" }} />

                  {/* Photo Shutter / Video Record Button */}
                  {cameraMode === 'photo' ? (
                    <button
                      onClick={capturePhoto}
                      style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: "transparent",
                        border: "4px solid #fff",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "transform 0.1s",
                        padding: 0,
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
                      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "50%",
                        backgroundColor: "#fff",
                      }} />
                    </button>
                  ) : (
                    <button
                      onMouseDown={startVideoRecording}
                      onMouseUp={stopVideoRecording}
                      onMouseLeave={isRecordingVideo ? stopVideoRecording : undefined}
                      onTouchStart={startVideoRecording}
                      onTouchEnd={stopVideoRecording}
                      style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: isRecordingVideo ? "#ff3131" : "transparent",
                        border: "4px solid #fff",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                        padding: 0,
                      }}
                    >
                      <div style={{
                        width: isRecordingVideo ? "32px" : "64px",
                        height: isRecordingVideo ? "32px" : "64px",
                        borderRadius: isRecordingVideo ? "8px" : "50%",
                        backgroundColor: "#ff3131",
                        transition: "all 0.2s",
                      }} />
                    </button>
                  )}

                  {/* Flip Camera */}
                  <button
                    onClick={flipCamera}
                    style={{
                      width: "56px", height: "56px", borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                      fontSize: "24px", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      backdropFilter: "blur(8px)", transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    🔄
                  </button>
                </>
              ) : capturedPhoto ? (
                <>
                  {/* Retake Photo */}
                  <button
                    onClick={() => setCapturedPhoto(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                      padding: "12px 20px", borderRadius: "28px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 600, backdropFilter: "blur(8px)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    🔁 Retake
                  </button>

                  {/* Send Photo */}
                  <button
                    onClick={sendCapturedPhoto}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "var(--wa-green, #F0591F)", border: "none", color: "#fff",
                      padding: "12px 24px", borderRadius: "28px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(240,89,31,0.4)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(240,89,31,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(240,89,31,0.4)"; }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    Send
                  </button>
                </>
              ) : recordedVideo ? (
                <>
                  {/* Retake Video */}
                  <button
                    onClick={cancelVideoRecording}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                      padding: "12px 20px", borderRadius: "28px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 600, backdropFilter: "blur(8px)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    🔁 Retake
                  </button>

                  {/* Send Video */}
                  <button
                    onClick={sendRecordedVideo}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "var(--wa-green, #F0591F)", border: "none", color: "#fff",
                      padding: "12px 24px", borderRadius: "28px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(240,89,31,0.4)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(240,89,31,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(240,89,31,0.4)"; }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    Send
                  </button>
                </>
              ) : null}
            </div>

            {/* Video Recording Timer */}
            {isRecordingVideo && (
              <div style={{
                position: "absolute",
                top: "60px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                zIndex: 100,
              }}>
                <span style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#ff3131",
                  borderRadius: "50%",
                  animation: "blink 1s infinite",
                }} />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  {formatVideoTime(videoRecordingTime)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── OFFER MODAL ── */}
      <Modal open={open} onClose={resetOfferForm}>
        <Box sx={{ ...darkModalSx, width: { xs: "95%", sm: "85%", md: "70%" }, maxWidth: 620, mt: 6, maxHeight: "90vh" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ color: T.white, fontWeight: 700 }}>Send Custom Offer</Typography>
            <IconButton onClick={resetOfferForm} sx={{ color: T.midGray }}><CloseIcon /></IconButton>
          </Box>

          <form onSubmit={handleSubmitOffer}>
            <div className="mb-3">
              <label className="dark-label">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you'll deliver..." maxLength={500} required rows={4} className="dark-textarea" />
              <small className="dark-muted">{description.length}/500 characters</small>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="dark-label">Delivery Date *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={offerDate}
                    onChange={(e) => setOfferDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: `1px solid rgba(255,255,255,0.07)`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: offerDate ? "#ffffff" : "#71717a",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer",
                      colorScheme: "dark",
                      WebkitAppearance: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#f0591f"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                  />
                </div>
                {offerDate && (
                  <small style={{ color: "#a1a1aa", fontSize: "12px", marginTop: 4, display: "block" }}>
                    📅 {new Date(offerDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                    {" · "}
                    {Math.ceil((new Date(offerDate) - new Date()) / (1000 * 60 * 60 * 24))} days from today
                  </small>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="dark-label">Price (USD) *</label>
                <input type="number" value={offerPrice} placeholder="0.00"
                  onChange={(e) => setOfferPrice(e.target.value)} required className="dark-input" min="0" step="0.01" />
              </div>
            </div>

            {isBd && (
              <div className="mb-3">
                <label className="dark-label">Select Expert</label>
                <ExpertSelect options={expertOptions} value={offerExpertId} onChange={setOfferExpertId} isLoading={isLoadingExperts} placeholder="-- Select an Expert --" />
                <small className="dark-muted">If selected, this will invite the expert and update status to "Project Started".</small>
              </div>
            )}

            {personalGigs && personalGigs.length > 0 && (
              <div className="mt-3 mb-3">
                <label className="dark-label">Select Gig (Optional)</label>
                <div className="row">
                 {personalGigs?.map((gig, idx) => {
  const gigId = String(gig.id);
  const selected = gigRadio === gigId;
  
  return (
    <div className="col-lg-3 mt-3" key={gig.id || idx}>
      <div 
        style={{
          position: "relative",
          backgroundColor: T.cardBgActive,
          border: `1px solid ${selected ? T.orange : T.border}`,
          borderRadius: "12px",
          padding: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        // Sirf setGigRadio(gigId) karein, toggle logic hata dein agar zarurat nahi
        onClick={() => setGigRadio(gigId)} 
      >
        {/* Radio button ko sirf state handle karne dein */}
        <input
          type="radio"
          value={gigId}
          checked={selected}
          readOnly // onChange ki jagah readOnly kyunke hum Div se control kar rahe hain
          name="gigCheck"
          style={{ display: "none" }}
        />
        
        {/* Label se htmlFor hata dein taake double click trigger na ho */}
        <div style={{ display: "block", cursor: "pointer" }}>
          <img 
            height={110} 
            src={gig.media?.image1 || gig.media?.image2 || gig.media?.image3 || userImg} 
            alt="Gig"
            style={{ width: "100%", objectFit: "cover", borderRadius: "8px" }} 
            onError={(e) => (e.target.src = userImg)} 
          />
          <p style={{ 
            color: T.midGray, 
            fontSize: "11px", 
            marginTop: 6, 
            marginBottom: 0, 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap" 
          }}>
            {gig.title}
          </p>
        </div>

        {selected && (
          <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: T.orange,
            color: "#fff", // Color white kar dein behtar dikhega
            borderRadius: "999px",
            padding: "2px 8px",
            fontSize: "11px",
            fontWeight: 700,
            zIndex: 2 // Isse upar rakhein
          }}>
            Selected
          </div>
        )}
      </div>
    </div>
  );
})}
                 
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outlined" onClick={resetOfferForm}
                sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: T.orange, color: T.orange } }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained"
                disabled={offerLoader || !description?.trim() || !offerPrice || !offerDate}
                startIcon={offerLoader ? <CircularProgress size={20} /> : null}
                sx={{ backgroundColor: T.orange, textTransform: "none", borderRadius: "8px", fontWeight: 600, "&:hover": { backgroundColor: "#d94e18" }, boxShadow: `0 4px 14px rgba(240,89,31,0.3)` }}>
                {offerLoader ? "Sending..." : "Send Offer"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* ── ORDER SUBMISSION MODAL ── */}
      <Dialog open={orderSubmissionModal} onClose={() => setOrderSubmissionModal(false)} maxWidth="md" fullWidth
        PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>Submit Order</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <div className="mb-3">
            <label className="dark-label">Order Description *</label>
            <textarea value={orderDescription} onChange={(e) => setOrderDescription(e.target.value)}
              placeholder="Describe your completed work..." rows={4} className="dark-textarea" required />
          </div>
              <div className="mb-3">
                <label className="dark-label">Attach Files</label>
                <input type="file" multiple onChange={handleOrderFileChange}
                  style={{ display: "block", width: "100%", backgroundColor: T.cardBgActive, border: `1px solid ${T.borderMid}`, borderRadius: "8px", padding: "8px 12px", color: T.lightGray }} />
                <small className="dark-muted">Upload your deliverables (Any file type, Max 5GB per file)</small>
              </div>
          {orderFiles.length > 0 && (
            <div className="mb-3">
              <h6 style={{ color: T.white }}>Selected Files:</h6>
              {orderFiles.map((file, index) => {
                const progress = uploadProgress[file.name];
                const isError = progress && progress.status === 'error';
                const isDone = progress && progress.percent === 100;
                
                return (
                  <div key={index} style={{ display: "flex", flexDirection: "column", padding: "10px 14px", backgroundColor: T.cardBgActive, border: `1px solid ${isError ? '#ef4444' : isDone ? '#10b981' : T.border}`, borderRadius: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: T.lightGray, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{file.name}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: isError ? '#ef4444' : isDone ? '#10b981' : '#3b82f6' }}>
                        {isError ? 'Failed' : isDone ? 'Uploaded ✓' : `${progress?.percent || 0}%`}
                      </span>
                      <Button size="small" onClick={() => removeOrderFile(index)} disabled={submittingOrder}
                        sx={{ color: "#ef4444", minWidth: "auto", ml: 1, p: "2px 6px" }}>Remove</Button>
                    </div>
                    <LinearProgress variant="determinate" value={progress?.percent || 0}
                      color={isError ? 'error' : isDone ? 'success' : 'primary'}
                      sx={{ backgroundColor: T.border, height: 6, borderRadius: 3 }} />
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${T.border}`, p: 2, gap: 1 }}>
          <Button onClick={() => setOrderSubmissionModal(false)} sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none" }} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmitOrder} variant="contained" disabled={submittingOrder || isAnyFileUploading}
            sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "#d94e18" } }}>
            {submittingOrder ? <><CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} /> Submitting...</> : isAnyFileUploading ? "Waiting for files..." : "Submit Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── OFFER DETAILS MODAL ── */}
      <Dialog open={offerDetailsModal} onClose={() => setOfferDetailsModal(false)} maxWidth="sm" fullWidth
        PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>Offer Details</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {offerDetails ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Description", value: offerDetails.description },
                { label: "Price", value: `$${offerDetails.price}` },
                { label: "Delivery", value: `${calculateDeliveryDays(offerDetails.date)} days` },
                { label: "Created", value: new Date(offerDetails.created_at).toLocaleString() },
                offerDetails.expires_at && { label: "Expires", value: new Date(offerDetails.expires_at).toLocaleString() },
              ].filter(Boolean).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: T.bodyGray, minWidth: 90, fontSize: "13px" }}>{item.label}:</span>
                  <span style={{ color: T.lightGray, fontSize: "13px" }}>{item.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: T.bodyGray, minWidth: 90, fontSize: "13px" }}>Status:</span>
                <Chip label={offerDetails.status} size="small"
                  sx={{ backgroundColor: offerDetails.status === "accepted" ? "rgba(34,197,94,0.12)" : offerDetails.status === "declined" ? "rgba(239,68,68,0.12)" : "rgba(251,191,36,0.12)", color: offerDetails.status === "accepted" ? "#22c55e" : offerDetails.status === "declined" ? "#ef4444" : "#fbbf24", border: "none" }} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}><CircularProgress sx={{ color: T.orange }} /></div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${T.border}`, p: 2 }}>
          <Button onClick={() => setOfferDetailsModal(false)} sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none" }} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── BD REVISION MODAL ── */}
      <Dialog open={revisionDialogOpen} onClose={() => setRevisionDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>Request Revision</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ mb: 2, color: T.midGray, fontSize: "14px" }}>Please provide detailed instructions for the revision:</Typography>
          <textarea value={revisionInstructions} onChange={(e) => setRevisionInstructions(e.target.value)}
            placeholder="What changes are needed? Be specific..." rows={4} className="dark-textarea" required maxLength={500} />
          <small className="dark-muted">{revisionInstructions.length}/500 characters</small>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${T.border}`, p: 2, gap: 1 }}>
          <Button onClick={() => { setRevisionDialogOpen(false); setRevisionInstructions(""); }} disabled={bdActionLoading}
            sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none" }} variant="outlined">Cancel</Button>
          <Button onClick={handleBdRequestRevision} variant="contained" disabled={bdActionLoading || !revisionInstructions?.trim()}
            sx={{ backgroundColor: "#fbbf24", color: "#000", textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "#f59e0b" } }}>
            {bdActionLoading ? "Requesting..." : "Request Revision"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── BD DISPUTE MODAL ── */}
      <Dialog open={disputeDialogOpen} onClose={() => setDisputeDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>Dispute Order</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ mb: 1, color: T.midGray, fontSize: "14px" }}>Please provide the reason for disputing this order:</Typography>
          <Typography sx={{ mb: 2, color: "#ef4444", fontSize: "13px" }}>⚠️ Warning: Disputing will require admin intervention to resolve.</Typography>
          <textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="Why are you disputing this order? Please be specific..." rows={4} className="dark-textarea" required maxLength={500} />
          <small className="dark-muted">{disputeReason.length}/500 characters</small>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${T.border}`, p: 2, gap: 1 }}>
          <Button onClick={() => { setDisputeDialogOpen(false); setDisputeReason(""); }} disabled={bdActionLoading}
            sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none" }} variant="outlined">Cancel</Button>
          <Button onClick={handleBdDisputeOrder} variant="contained" color="error" disabled={bdActionLoading || !disputeReason?.trim()}
            sx={{ textTransform: "none", fontWeight: 600 }}>
            {bdActionLoading ? "Submitting..." : "Submit Dispute"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── PAYMENT MODAL ── */}
      <Modal open={showPaymentModal} onClose={closePaymentModal}>
        <Box sx={{ ...darkModalSx, width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" }, maxWidth: "1000px", maxHeight: "90vh", p: 0 }}>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h5 style={{ color: T.white, fontWeight: 700, margin: 0 }}>Add payment method</h5>
              <IconButton onClick={closePaymentModal} disabled={isProcessing} sx={{ color: T.midGray }}><CloseIcon /></IconButton>
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-4 col-12 mb-4">
                <div style={{ backgroundColor: T.cardBgActive, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "16px", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { key: "fast-checkout", label: "Fast Checkout", sub: "Bank Transfer", color: T.orange },
                    { key: "card", label: "Payment Card", sub: "Visa, Mastercard", color: "#22c55e" },
                    { key: "paypal", label: "PayPal", sub: "Coming Soon", color: "#fbbf24", disabled: true },
                  ].map((pm) => (
                    <button key={pm.key} onClick={() => !pm.disabled && setPaymentMethod(pm.key)} disabled={isProcessing || pm.disabled}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: "10px", border: `1px solid ${paymentMethod === pm.key ? pm.color : T.border}`,
                        backgroundColor: paymentMethod === pm.key ? `${pm.color}14` : "transparent",
                        cursor: pm.disabled ? "not-allowed" : "pointer", opacity: pm.disabled ? 0.4 : 1, transition: "all 0.2s",
                      }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: pm.color, flexShrink: 0 }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: T.white, fontSize: "14px", fontWeight: 500 }}>{pm.label}</div>
                        <div style={{ color: T.bodyGray, fontSize: "12px" }}>{pm.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-lg-8 col-md-8 col-12">
                <div style={{ backgroundColor: T.cardBgActive, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "24px", height: "100%" }}>
                  {paymentMethod === "fast-checkout" && (
                    <>
                      <h6 style={{ color: T.white, fontWeight: 700, marginBottom: 20 }}>Fast Checkout - Bank Transfer</h6>
                      <div className="row mb-4">
                        {[
                          { label: "Account Title", value: "GrapeTask (Private) Limited" },
                          { label: "Account No", value: "021720016063135" },
                          { label: "IBAN", value: "PK945ONE0021720016063135" },
                          { label: "Bank Name", value: "SONERI BANK LTD" },
                          { label: "Branch", value: "Daharki Branch" },
                        ].map((item, i) => (
                          <div key={i} className="col-md-6 mb-3">
                            <div style={{ fontSize: "12px", color: T.bodyGray, marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: "14px", color: T.white, fontWeight: 500, backgroundColor: T.cardBg, padding: "8px 12px", borderRadius: "8px", border: `1px solid ${T.border}` }}>{item.value}</div>
                          </div>
                        ))}
                        <div className="col-12 mb-3">
                          <label className="dark-label">Upload Transfer Receipt *</label>
                          <input type="file" name="file" accept="image/*,.pdf" onChange={handlePaymentInputChange} disabled={isProcessing}
                            style={{ display: "block", width: "100%", backgroundColor: T.cardBg, border: `1px solid ${T.borderMid}`, borderRadius: "8px", padding: "8px 12px", color: T.lightGray }} />
                          {selectedImagePreview && (
                            <img src={selectedImagePreview} style={{ marginTop: 12, borderRadius: "8px", width: 120, height: 120, objectFit: "cover", border: `1px solid ${T.border}` }} alt="Receipt" />
                          )}
                        </div>
                      </div>
                      <Button variant="contained" onClick={handleFastCheckout} disabled={isProcessing || !paymentFormData.file}
                        startIcon={isProcessing ? <CircularProgress size={18} /> : null}
                        sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, borderRadius: "10px", "&:hover": { backgroundColor: "#d94e18" }, boxShadow: `0 4px 14px rgba(240,89,31,0.3)` }}>
                        {isProcessing ? "Processing..." : "Complete Order"}
                      </Button>
                    </>
                  )}

                  {paymentMethod === "card" && (
                    <form onSubmit={handleCardPayment}>
                      <h6 style={{ color: T.white, fontWeight: 700, marginBottom: 20 }}>Payment Card Details</h6>
                      <div className="row">
                        {[
                          { id: "username", label: "Cardholder Name", type: "text" },
                          { id: "email", label: "Email Address", type: "email" },
                          { id: "password", label: "Card PIN", type: "password" },
                          { id: "amount", label: "Amount", type: "number" },
                        ].map((field) => (
                          <div key={field.id} className="col-md-6 mb-3">
                            <label className="dark-label">{field.label} *</label>
                            <input type={field.type} id={field.id} name={field.id} className="dark-input"
                              value={paymentFormData[field.id]} onChange={handlePaymentInputChange} required disabled={isProcessing} />
                          </div>
                        ))}
                      </div>
                      <Button type="submit" variant="contained" disabled={isProcessing}
                        startIcon={isProcessing ? <CircularProgress size={18} /> : null}
                        sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, borderRadius: "10px", "&:hover": { backgroundColor: "#d94e18" } }}>
                        {isProcessing ? "Processing..." : "Complete Payment"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* ── ORDER COMPLETION MODAL ── */}
      <Dialog open={orderCompletionModal} onClose={() => setOrderCompletionModal(false)}
        PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>Complete Order</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ mb: 2, color: T.midGray }}>Are you sure you want to mark this order as completed?</Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${T.border}`, p: 2, gap: 1 }}>
          <Button onClick={() => setOrderCompletionModal(false)} sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none" }} variant="outlined">Cancel</Button>
          <Button onClick={() => { setSelectedOffer(selectedOffer); openReviewModal(selectedOffer); }} variant="contained" disabled={completingOrder}
            sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "#d94e18" } }}>
            {completingOrder ? "Completing..." : "Complete Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── REVIEW MODAL ── */}
      <ReviewModal
        open={showReviewModal} onClose={closeReviewModal} onSubmit={handleReviewSubmit}
        formData={reviewFormData} onInputChange={handleReviewInputChange}
        isSubmitting={isSubmittingReview} userRole={currentUser?.role} orderData={selectedOffer?.order}
      />

      {/* ── LINK ORDER MODAL (For BD to link expert to an existing order) ── */}
      <Modal open={linkOrderModalOpen} onClose={() => setLinkOrderModalOpen(false)}>
        <Box sx={{ ...darkModalSx, width: { xs: "95%", sm: "80%", md: "50%" }, maxWidth: "600px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h5 style={{ color: T.white, fontWeight: 700, margin: 0 }}>Assign to Expert</h5>
            <IconButton onClick={() => setLinkOrderModalOpen(false)} disabled={isAssigning} sx={{ color: T.midGray }}><CloseIcon /></IconButton>
          </div>
          <form onSubmit={handleLinkOrderSubmit}>
            <div className="mb-4">
              <label className="dark-label">Select BD Order *</label>
              <select 
                className="dark-input" 
                value={linkOrderId} 
                onChange={(e) => setLinkOrderId(e.target.value)}
                required
                style={{ appearance: "none", backgroundColor: "rgba(255, 255, 255, 0.03)", color: "#ffffff" }}
              >
                <option value="" style={{ backgroundColor: "#020617", color: "#a1a1aa" }}>Select a BD Order</option>
                {renderOrderOptions()}
              </select>
            </div>
            <div className="mb-4">
              <label className="dark-label">Assignment Notes (Optional)</label>
              <textarea 
                className="dark-textarea" 
                rows="3" 
                value={linkOrderNotes} 
                onChange={(e) => setLinkOrderNotes(e.target.value)}
                placeholder="Add specific instructions..."
              />
            </div>
            <p style={{
              color: T.orange, fontSize: "13px", fontWeight: 500,
              backgroundColor: "rgba(240, 89, 31, 0.1)", padding: "10px", borderRadius: "8px",
              marginTop: "8px", marginBottom: "16px", lineHeight: 1.5
            }}>
              First chat conversation, then link order with an expert! 
            </p>
            <div className="d-flex gap-3 mt-2">
              <Button type="submit" variant="contained" disabled={isAssigning || !linkOrderId}
                startIcon={isAssigning ? <CircularProgress size={18} /> : null}
                sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, borderRadius: "8px", flexGrow: 1, "&:hover": { backgroundColor: "#d94e18" } }}>
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </Button>
              <Button variant="outlined" onClick={() => setLinkOrderModalOpen(false)} disabled={isAssigning}
                sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none", borderRadius: "8px", flexGrow: 1, "&:hover": { borderColor: T.orange, color: T.orange } }}>
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* ── INVITE EXPERT MODAL ── */}
      <Modal open={showAssignModal} onClose={closeAssignModal}>
        <Box sx={{ ...darkModalSx, width: { xs: "95%", sm: "90%", md: "70%", lg: "60%" }, maxWidth: "800px", maxHeight: "90vh", p: 0 }}>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h5 style={{ color: T.white, fontWeight: 700, margin: 0 }}>Invite Expert</h5>
              <IconButton onClick={closeAssignModal} disabled={isAssigning} sx={{ color: T.midGray }}><CloseIcon /></IconButton>
            </div>
            <form onSubmit={handleAssignToExpert}>
              <div className="mb-3">
                <label className="dark-label">Select Expert</label>
                <ExpertSelect options={expertOptions} value={assignExpertId} onChange={setAssignExpertId} isLoading={isLoadingExperts} />
                <small className="dark-muted">Selecting an expert will invite them and update status to "Project Started".</small>
              </div>
              <div className="mb-4">
                <label className="dark-label">Assignment Notes (Optional)</label>
                <textarea name="assignmentNotes" rows={4} value={assignmentFormData.assignmentNotes}
                  onChange={handleAssignmentInputChange} placeholder="Add instructions for the expert..." disabled={isAssigning} className="dark-textarea" />
              </div>
              <div className="d-flex gap-2">
                <Button type="submit" variant="contained" disabled={isAssigning}
                  startIcon={isAssigning ? <CircularProgress size={18} /> : null}
                  sx={{ backgroundColor: T.orange, textTransform: "none", fontWeight: 600, borderRadius: "10px", "&:hover": { backgroundColor: "#d94e18" } }}>
                  {isAssigning ? "Inviting..." : "Invite Expert"}
                </Button>
                <Button type="button" variant="outlined" onClick={closeAssignModal} disabled={isAssigning}
                  sx={{ borderColor: T.borderMid, color: T.lightGray, textTransform: "none", borderRadius: "10px", "&:hover": { borderColor: T.orange, color: T.orange } }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      {/* ── TOAST ── */}
      {toastState.show && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "12px 20px", borderRadius: "10px", color: "white",
          backgroundColor: toastState.type === "success" ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
          backdropFilter: "blur(12px)", border: `1px solid ${toastState.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: "14px", fontWeight: 500 }}>{toastState.message}</span>
          <button onClick={handleCloseToast}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0, opacity: 0.7 }}>
            ×
          </button>
        </div>
      )}
      {/* ── GROUP MEMBERS LIST MODAL ── */}
      <Dialog 
        open={showMembersListModal} 
        onClose={() => setShowMembersListModal(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: T.cardBgActive || "#0f172a",
            border: `1px solid ${T.border || "rgba(255,255,255,0.08)"}`,
            borderRadius: "16px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)"
          }
        }}
      >
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Group Members</span>
          <IconButton onClick={() => setShowMembersListModal(false)} sx={{ color: T.midGray }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2, maxHeight: "400px", overflowY: "auto" }}>
          {selectedConversation?.participants?.map((p) => {
            const isPOnline = onlineUsers[p.id] === "online" || onlineUsers[p.id] === true || p.id === currentUser.id;
            return (
              <div 
                key={p.id} 
                onClick={() => {
                  setSelectedMemberProfile(p);
                  setShowMembersListModal(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "10px 12px", 
                  borderRadius: "10px", 
                  cursor: "pointer",
                  transition: "background 0.2s",
                  marginBottom: "4px"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img 
                    src={p.image || userImg} 
                    alt="" 
                    onError={(e) => (e.target.src = userImg)}
                    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} 
                  />
                  <div>
                    <Typography style={{ color: T.white, fontWeight: 600, fontSize: "14px" }}>
                      {p.fname || p.name}
                    </Typography>
                    <Typography style={{ color: T.bodyGray, fontSize: "12px" }}>
                      {formatRoleForDisplay(p.role || 'Member')}
                    </Typography>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: "50%", 
                    backgroundColor: isPOnline ? "#22c55e" : "#71717a" 
                  }} />
                  <span style={{ color: isPOnline ? "#22c55e" : T.bodyGray, fontSize: "11px", fontWeight: 500 }}>
                    {isPOnline ? "Active" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>

      {/* ── MEMBER PROFILE DETAIL MODAL ── */}
      <Dialog 
        open={Boolean(selectedMemberProfile)} 
        onClose={() => setSelectedMemberProfile(null)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: T.cardBgActive || "#0f172a",
            border: `1px solid ${T.border || "rgba(255,255,255,0.08)"}`,
            borderRadius: "16px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)"
          }
        }}
      >
        <DialogTitle sx={{ color: T.white, borderBottom: `1px solid ${T.border}`, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>User Profile</span>
          <IconButton onClick={() => setSelectedMemberProfile(null)} sx={{ color: T.midGray }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, textAlign: "center" }}>
          <img 
            src={selectedMemberProfile?.image || userImg} 
            alt="" 
            onError={(e) => (e.target.src = userImg)}
            style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", marginBottom: 16, border: `3px solid ${T.orange}` }} 
          />
          <Typography style={{ color: T.white, fontWeight: 700, fontSize: "20px", marginBottom: 4 }}>
            {selectedMemberProfile?.fname || selectedMemberProfile?.name}
          </Typography>
          <Typography style={{ color: T.orange, fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
            {formatRoleForDisplay(selectedMemberProfile?.role || 'Member')}
          </Typography>

          <div style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.03)", 
            borderRadius: "12px", 
            padding: "16px", 
            textAlign: "left", 
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: T.bodyGray, fontSize: "11px", display: "block" }}>About</span>
              <span style={{ color: T.lightGray, fontSize: "13px", fontWeight: 500 }}>
                {selectedMemberProfile?.about || "No info provided"}
              </span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: T.bodyGray, fontSize: "11px", display: "block" }}>Location</span>
              <span style={{ color: T.lightGray, fontSize: "13px", fontWeight: 500 }}>
                {selectedMemberProfile?.location || "Not specified"}
              </span>
            </div>
            <div>
              <span style={{ color: T.bodyGray, fontSize: "11px", display: "block" }}>Experience</span>
              <span style={{ color: T.lightGray, fontSize: "13px", fontWeight: 500 }}>
                {selectedMemberProfile?.experience || "Not specified"}
              </span>
            </div>
          </div>

          {selectedMemberProfile?.id !== currentUser.id && (
            <Button
              onClick={() => handleStartPersonalChat(selectedMemberProfile)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: T.orange,
                color: "#ffffff",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "14px",
                "&:hover": { backgroundColor: "#d94e18" }
              }}
            >
              💬 Message Personal
            </Button>
          )}
        </DialogContent>
      </Dialog>
      {/* ── VIDEO CALL MODAL ── */}
      {activeCallRoom && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#020617",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 24px",
            backgroundColor: "#0f172a",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "20px" }}>📹</span>
              <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "16px" }}>
                Grapetask Live Meeting
              </span>
            </div>
            <Button
              variant="contained"
              onClick={() => setActiveCallRoom(null)}
              style={{
                backgroundColor: "#ef4444",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "8px 18px"
              }}
            >
              End Call
            </Button>
          </div>
          {/* MiroTalk Iframe Container */}
          {showIframe ? (
            <iframe
              onLoad={handleIframeLoad}
              src={`https://p2p.mirotalk.com/join?room=${activeCallRoom}&name=${encodeURIComponent((currentUser.fname ? `${currentUser.fname} ${currentUser.lname || ""}` : currentUser.name) || "Grapetask User")}&chat=0`}
              style={{ width: "100%", flexGrow: 1, border: "none", backgroundColor: "#020617" }}
              allow="camera; microphone; speaker-selection; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay; picture-in-picture"
            />
          ) : (
            <div style={{ width: "100%", flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", color: "#8a99af", gap: 15 }}>
              <div style={{
                border: "4px solid rgba(255,255,255,0.05)",
                borderTop: "4px solid #ed5623",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite"
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ fontWeight: 500, fontSize: "14px", color: "#ffffff" }}>Connecting secure audio & speech audit session...</p>
              <p style={{ fontSize: "12px", color: "#8a99af" }}>Please grant microphone permission if prompted by your browser</p>
            </div>
          )}
        </div>
      )}

      {/* ── SECURITY WARNING MODAL CARD ── */}
      {securityWarningText && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 100000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "#1e293b",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            {/* Warning Icon Container */}
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              border: "2px solid rgba(239, 68, 68, 0.4)"
            }}>
              <span style={{ fontSize: "32px" }}>⚠️</span>
            </div>
            
            {/* Title */}
            <h3 style={{
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 12px 0",
              letterSpacing: "-0.01em"
            }}>
              Security System Violation
            </h3>
            
            {/* Subtitle / Description */}
            <p style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "14px",
              lineHeight: 1.6,
              margin: "0 0 24px 0"
            }}>
              {securityWarningText}
            </p>

            {/* Warning message card */}
            <div style={{
              width: "100%",
              padding: "14px 18px",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              borderLeft: "4px solid #ef4444",
              borderRadius: "8px",
              textAlign: "left",
              marginBottom: "28px"
            }}>
              <span style={{
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "4px"
              }}>
                Strict Policy Notice
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12.5px", lineHeight: 1.5 }}>
                To protect users and keep payments secure, off-platform communication is not allowed. Continuing to share contact info will result in an immediate account ban.
              </span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => setSecurityWarningText("")}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* ── WHATSAPP MEDIA PREVIEW MODAL ── */}
      {mediaPreviewFiles.length > 0 && createPortal((
        <div className="wa-preview-modal">
          {/* Header */}
          <div className="wa-preview-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button 
                onClick={handleCancelMediaPreview}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Cancel"
              >
                ✕
              </button>
              <span style={{ fontSize: "16px", fontWeight: 500 }}>
                Preview Media ({activeMediaIndex + 1} of {mediaPreviewFiles.length})
              </span>
            </div>
            <div className="wa-preview-filename" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
              {mediaPreviewFiles[activeMediaIndex]?.file?.name} ({mediaPreviewFiles[activeMediaIndex] ? (mediaPreviewFiles[activeMediaIndex].file.size / (1024 * 1024)).toFixed(2) : 0} MB)
            </div>
          </div>

          {/* Center Content Preview */}
          <div className="wa-preview-body">
            {mediaPreviewFiles[activeMediaIndex]?.type === "image" ? (
              <img 
                src={mediaPreviewFiles[activeMediaIndex]?.url} 
                alt="Preview" 
              />
            ) : (
              <video 
                src={mediaPreviewFiles[activeMediaIndex]?.url} 
                controls 
                autoPlay
                key={mediaPreviewFiles[activeMediaIndex]?.url}
              />
            )}
          </div>

          {/* Footer Area with Carousel and Caption Input */}
          <div className="wa-preview-footer">
            
            {/* Thumbnails carousel */}
            <div className="wa-preview-carousel">
              {mediaPreviewFiles.map((item, idx) => {
                const isActive = idx === activeMediaIndex;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setActiveMediaIndex(idx);
                      setMediaCaption(item.caption || "");
                    }}
                    className="wa-preview-thumb"
                    style={{
                      border: isActive ? "2.5px solid #00a884" : "1px solid rgba(255,255,255,0.2)"
                    }}
                  >
                    {item.type === "image" ? (
                      <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={{ position: "absolute", fontSize: "14px", color: "#fff", textShadow: "1px 1px 2px #000" }}>📹</span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemoveMediaItem(idx, e)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(0, 0, 0, 0.7)",
                        border: "none",
                        color: "#ff4d4d",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        zIndex: 10
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {/* Add More Files Button */}
              <button
                onClick={() => document.getElementById("addMorePreviewInput").click()}
                className="wa-preview-add-btn"
                style={{
                  borderRadius: "6px",
                  border: "2px dashed rgba(255, 255, 255, 0.4)",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "border-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#00a884"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"}
                title="Add more media"
              >
                +
              </button>
              <input 
                type="file"
                id="addMorePreviewInput"
                multiple
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Input Bar */}
            <div className="wa-preview-input-container">
              <input 
                type="text"
                value={mediaCaption}
                onChange={(e) => handleCaptionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMedia();
                  } else if (e.key === "Escape") {
                    handleCancelMediaPreview();
                  }
                }}
                placeholder="Add a caption..."
                autoFocus
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "15px",
                  padding: "10px 6px"
                }}
              />
              
              <button 
                onClick={handleSendMedia}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#00a884",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontSize: "18px",
                  transition: "transform 0.1s, background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#008f72"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00a884"}
                title="Send"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      ), document.body)}

      {/* ── RESPONSIVE STYLE RULES ── */}
      <style>{`
        .wa-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(11, 20, 26, 0.98);
          z-index: 100005;
          display: flex;
          flex-direction: column;
        }
        .wa-preview-header {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          color: #ffffff;
          background-color: #111b21;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          height: 64px;
          box-sizing: border-box;
        }
        .wa-preview-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background-color: rgba(11, 20, 26, 0.3);
          overflow: hidden;
        }
        .wa-preview-body img, .wa-preview-body video {
          max-height: 58vh;
          max-width: 90%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
        }
        .wa-preview-footer {
          background-color: #111b21;
          padding: 16px 24px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }
        .wa-preview-carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 800px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding: 4px 0;
        }
        .wa-preview-thumb {
          position: relative;
          width: 55px;
          height: 55px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          background-color: #000;
          box-sizing: border-box;
        }
        .wa-preview-add-btn {
          width: 55px;
          height: 55px;
        }
        .wa-preview-input-container {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 800px;
          background-color: #2a3942;
          border-radius: 10px;
          padding: 6px 12px;
          gap: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .wa-preview-header {
            padding: 12px 16px;
            height: 56px;
          }
          .wa-preview-filename {
            display: none;
          }
          .wa-preview-body {
            padding: 16px;
          }
          .wa-preview-body img, .wa-preview-body video {
            max-height: 42vh;
            max-width: 95%;
          }
          .wa-preview-footer {
            padding: 12px 16px 16px;
          }
          .wa-preview-carousel {
            margin-bottom: 10px;
            gap: 8px;
          }
          .wa-preview-thumb {
            width: 44px;
            height: 44px;
          }
          .wa-preview-add-btn {
            width: 44px;
            height: 44px;
            font-size: 16px;
          }
          .wa-preview-input-container {
            padding: 4px 10px;
          }
        }
      `}</style>
      {lightboxMedia && (() => {
        const activeMedia = (activeLightboxIndex >= 0 && conversationMedia && conversationMedia[activeLightboxIndex]) ? conversationMedia[activeLightboxIndex] : lightboxMedia;
        return createPortal((
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setLightboxMedia(null);
              }
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(10, 10, 10, 0.96)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 100010,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              userSelect: "none"
            }}
          >
            <style>{`
              .lightbox-thumbnail-scroll::-webkit-scrollbar {
                height: 4px;
              }
              .lightbox-thumbnail-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .lightbox-thumbnail-scroll::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
              }
              @media (max-width: 768px) {
                .lightbox-content-wrapper {
                  padding: 10px 16px !important;
                }
                .lightbox-nav-arrow {
                  width: 40px !important;
                  height: 40px !important;
                  font-size: 18px !important;
                }
                .lightbox-nav-left {
                  left: 10px !important;
                }
                .lightbox-nav-right {
                  right: 10px !important;
                }
                .lightbox-media-display {
                  max-height: 60vh !important;
                }
                .lightbox-title-info {
                  max-width: 160px !important;
                  top: 15px !important;
                  left: 15px !important;
                }
                .lightbox-controls-bar {
                  top: 15px !important;
                  right: 15px !important;
                }
              }
            `}</style>

            {/* Floating Control Bar */}
            <div className="lightbox-controls-bar" style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              zIndex: 100015
            }}>
              <button 
                onClick={() => setLightboxMedia(null)}
                style={{
                  background: "rgba(239, 68, 68, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.8)"}
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Media Center Content Row with Navigation Arrows */}
            <div className="lightbox-content-wrapper" style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              height: "calc(100% - 150px)",
              overflow: "hidden",
              padding: "20px 80px",
              boxSizing: "border-box"
            }}>
              
              {/* Left Nav Arrow */}
              {activeLightboxIndex > 0 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxMedia(conversationMedia[activeLightboxIndex - 1]);
                  }}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(30, 30, 30, 0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100012,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(30, 30, 30, 0.6)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                  title="Previous"
                >
                  ‹
                </button>
              )}

              {/* Main Media Display Wrapper */}
              <div 
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setLightboxMedia(null);
                  }
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%"
                }}
              >
                {activeMedia.type === "image" ? (
                  <img 
                    className="lightbox-media-display"
                    src={activeMedia.url} 
                    alt="Viewer" 
                    style={{
                      maxHeight: "72vh",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 10px 35px rgba(0,0,0,0.8)",
                      transition: "transform 0.2s"
                    }}
                  />
                ) : activeMedia.type === "video" ? (
                  <video 
                    className="lightbox-media-display"
                    src={activeMedia.url} 
                    controls 
                    autoPlay
                    style={{
                      maxHeight: "72vh",
                      maxWidth: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 10px 35px rgba(0,0,0,0.8)"
                    }}
                  />
                ) : activeMedia.type === "pdf" ? (
                  <iframe 
                    src={activeMedia.url} 
                    title="PDF Viewer"
                    style={{
                      width: "85vw",
                      height: "75vh",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 10px 35px rgba(0,0,0,0.8)",
                      backgroundColor: "#ffffff"
                    }}
                  />
                ) : null}

                {/* Index Counter */}
                {activeLightboxIndex >= 0 && conversationMedia.length > 0 && (
                  <div style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "14px",
                    marginTop: "16px",
                    fontWeight: 500,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }}>
                    {activeLightboxIndex + 1} of {conversationMedia.length}
                  </div>
                )}
              </div>

              {/* Right Nav Arrow */}
              {activeLightboxIndex >= 0 && activeLightboxIndex < conversationMedia.length - 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxMedia(conversationMedia[activeLightboxIndex + 1]);
                  }}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(30, 30, 30, 0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100012,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(30, 30, 30, 0.6)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                  title="Next"
                >
                  ›
                </button>
              )}

            </div>

            {/* Bottom Thumbnails Section */}
            {activeLightboxIndex >= 0 && conversationMedia.length > 0 && (
              <div style={{
                width: "100%",
                backgroundColor: "rgba(15, 15, 15, 0.85)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "12px 0 20px 0",
                display: "flex",
                justifyContent: "center",
                zIndex: 100015
              }}>
                <div 
                  className="lightbox-thumbnail-scroll"
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    padding: "4px 20px",
                    maxWidth: "90vw",
                    scrollbarWidth: "thin",
                    scrollBehavior: "smooth"
                  }}
                >
                  {conversationMedia.map((item, idx) => {
                    const isActive = idx === activeLightboxIndex;
                    return (
                      <div 
                        key={idx} 
                        ref={isActive ? activeThumbnailRef : null}
                        onClick={() => setLightboxMedia(item)}
                        style={{
                          position: "relative",
                          flex: "0 0 54px",
                          height: "54px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: isActive ? "3px solid #f0591f" : "1.5px solid rgba(255,255,255,0.25)",
                          opacity: isActive ? 1 : 0.45,
                          transition: "all 0.2s",
                          boxSizing: "border-box",
                          backgroundColor: "#1c1c1e"
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.opacity = "0.85";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.opacity = "0.45";
                        }}
                      >
                        {item.type === "image" ? (
                          <img 
                            src={item.url} 
                            alt="Thumb" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", position: "relative" }}>
                            <video 
                              src={item.url} 
                              preload="metadata"
                              muted
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            />
                            <div style={{
                              position: "absolute",
                              top: 0, left: 0, right: 0, bottom: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              backgroundColor: "rgba(0,0,0,0.35)",
                              color: "#fff",
                              fontSize: "11px"
                            }}>
                              ▶
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ), document.body);
      })()}

      {/* ── Gallery Modal (For viewing all batch images) ── */}
      {showGalleryModal && createPortal((
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGalleryModal(false);
              setGalleryMedia([]);
            }
          }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 2147483647,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}>
            <h3 style={{ color: "#fff", margin: 0, fontSize: "18px" }}>
              📷 All Photos ({galleryMedia.length})
            </h3>
            <button
              onClick={() => {
                setShowGalleryModal(false);
                setGalleryMedia([]);
              }}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Scrollable Grid */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "12px",
            padding: "10px",
          }}>
            {galleryMedia.map((media, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setLightboxMedia(media);
                }}
                style={{
                  aspectRatio: "1",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={media.fileName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}>
                    <video
                      src={media.url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}>▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ), document.body)}

      {/* ── Attachment Menu Portal (Outside all containers) ── */}
      {createPortal(
        <div
          className="wa-attach-container"
          onClick={e => e.stopPropagation()}
          style={{
            position: "fixed",
            bottom: "12px",
            left: "50%",
            transform: showAttachMenu ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.95)",
            opacity: showAttachMenu ? 1 : 0,
            pointerEvents: showAttachMenu ? "auto" : "none",
            display: showAttachMenu ? "grid" : "none",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "20px 24px",
            backgroundColor: "#ffffff",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
            zIndex: 2147483647,
            width: "95%",
            maxWidth: "420px",
            transition: "all 0.25s ease-out"
          }}
        >
          {/* Gallery */}
          <button
            onClick={() => { setShowAttachMenu(false); galleryInputRef.current?.click(); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "12px", borderRadius: "16px",
              color: "#666", fontSize: "13px", fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{
              width: "60px", height: "60px", borderRadius: "16px",
              backgroundColor: "#7C3AED",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
            }}>🖼️</span>
            Gallery
          </button>

          {/* Camera */}
          <button
            onClick={() => { setShowAttachMenu(false); openCamera(); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "12px", borderRadius: "16px",
              color: "#666", fontSize: "13px", fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{
              width: "60px", height: "60px", borderRadius: "16px",
              backgroundColor: "#DC2626",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)"
            }}>📷</span>
            Camera
          </button>

          {/* Document */}
          <button
            onClick={() => { setShowAttachMenu(false); documentInputRef.current?.click(); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "12px", borderRadius: "16px",
              color: "#666", fontSize: "13px", fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{
              width: "60px", height: "60px", borderRadius: "16px",
              backgroundColor: "#2563EB",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}>📄</span>
            Document
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default Chatting;