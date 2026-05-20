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
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
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
      const cleanPath = file.path.startsWith("/") ? file.path.substring(1) : file.path;
      const directDownloadUrl = `${baseUrl}/${cleanPath}`;

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
  const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
  const [showMembersListModal, setShowMembersListModal] = useState(false);
  const [activeDropdownMsgId, setActiveDropdownMsgId] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [activeCallRoom, setActiveCallRoom] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [securityWarningText, setSecurityWarningText] = useState("");
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [mediaPreviewFiles, setMediaPreviewFiles] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaCaption, setMediaCaption] = useState("");

  useEffect(() => {
    const handleGlobalEscape = (e) => {
      if (e.key === "Escape") {
        setLightboxMedia(null);
      }
    };
    if (lightboxMedia) {
      document.addEventListener("keydown", handleGlobalEscape);
      return () => document.removeEventListener("keydown", handleGlobalEscape);
    }
  }, [lightboxMedia]);

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

  useEffect(() => {
    const closeDropdown = () => {
      setActiveDropdownMsgId(null);
      setShowHeaderMenu(false);
    };
    window.addEventListener("click", closeDropdown);
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
      await axios.delete('/messages', {
        data: { message_id: messageId, delete_type: deleteType }
      });
      dispatch(deleteMessageLocally({ messageId, deleteType }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete message.");
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

  // Voice Note states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const options = { mimeType: "audio/webm" };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (err) {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const voiceFile = new File([audioBlob], `voice_note_${Date.now()}.webm`, { type: "audio/webm" });
        setSelectedFile(voiceFile);
        
        // Setup file preview URL so it can be played back
        const audioUrl = URL.createObjectURL(audioBlob);
        setFilePreview(audioUrl);
        
        // Stop all tracks on the stream to release mic icon
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start(200); // chunk size 200ms
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // discard recording callback
      mediaRecorderRef.current.stop();
      // stop stream tracks
      try {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (err) {}
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    const baseUrl = window.location.origin.replace(":3000", ":8000");
    const cleanPath = filePath.replace("public/", "");
    const token = localStorage.getItem("accessToken");
    return `${baseUrl}/api/messages/file/${cleanPath}?token=${token}`;
  };

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
    if (!receiverId || !onlineUsers) return false;
    return onlineUsers[receiverId] === "online";
  }, [receiverId, onlineUsers]);

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

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mediaFiles = files.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    const otherFiles = files.filter(f => !f.type.startsWith("image/") && !f.type.startsWith("video/"));

    if (mediaFiles.length > 0) {
      const newItems = mediaFiles.map(file => {
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

    if (otherFiles.length > 0) {
      const file = otherFiles[0];
      setSelectedFile(file);
      const isPreviewable = file.type === "application/pdf";
      if (isPreviewable) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result || "");
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
    e.target.value = "";
  };

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
      `}</style>

      {/* ── CHAT CONTAINER ── */}
      <div style={{ height: "100vh", maxHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", width: "100%", backgroundColor: T.mainBg }}>

        {/* ── HEADER ── */}
        <div style={{
          flexShrink: 0, padding: "12px 20px",
          backgroundColor: T.headerBg,
          borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 10,
          backdropFilter: "blur(12px)",
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
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${isReceiverOnline ? "#22c55e" : T.border}` }}
                />
                <div style={{
                  position: "absolute", bottom: 1, right: 1,
                  width: 11, height: 11, borderRadius: "50%",
                  backgroundColor: isReceiverOnline ? "#22c55e" : T.darkGray,
                  border: `2px solid ${T.mainBg}`,
                }} />
              </div>
            )}
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: T.white }}>
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
                <small style={{ color: isSomeoneTyping ? T.orange : isReceiverOnline ? "#22c55e" : T.bodyGray, fontSize: "12px", fontWeight: 500 }}>
                  {isSomeoneTyping ? "typing..." : isReceiverOnline ? "● Online" : "Offline"}
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
          style={{
            flex: "1 1 auto", overflowY: "auto",
            maxHeight: "calc(100vh - 150px)",
            display: "flex", flexDirection: "column",
            padding: "16px 20px",
            backgroundColor: T.mainBg,
            backgroundImage: "radial-gradient(ellipse at 20% 80%, rgba(240,89,31,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.03) 0%, transparent 50%)",
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

              return (
                <div key={msg.id || i} style={{ display: "flex", marginBottom: "10px", justifyContent: isSender ? "flex-end" : "flex-start" }}>
                  {/* Avatar for receiver */}
                  {!isSender && (
                    <img src={selectedConversation?.is_group ? (msgSender?.image || userImg) : (receiver?.image || userImg)} alt="" onError={(e) => (e.target.src = userImg)}
                      style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", marginRight: 8, marginTop: "auto", flexShrink: 0 }}
                    />
                  )}

                  {isSender && (
                    <MessageOptions 
                      msg={msg} 
                      isSender={isSender} 
                      activeDropdownMsgId={activeDropdownMsgId} 
                      setActiveDropdownMsgId={setActiveDropdownMsgId} 
                      onDeleteMessage={handleDeleteMessage} 
                      T={T} 
                    />
                  )}

                  <div style={{
                    padding: msg.message_type === "offer" ? "0" : isVisualAttachment ? "0" : "10px 14px",
                    borderRadius: isSender ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    maxWidth: msg.message_type === "offer" ? "90%" : "72%",
                    backgroundColor: msg.message_type === "offer" ? "transparent" : isVisualAttachment ? "transparent" : isSender ? T.senderBubble : T.receiverBubble,
                    boxShadow: msg.message_type === "offer" ? "none" : isVisualAttachment ? "none" : isSender ? "0 2px 8px rgba(240,89,31,0.25)" : "0 2px 8px rgba(0,0,0,0.2)",
                    wordBreak: "break-word",
                    width: msg.message_type === "offer" ? "min(90%, 480px)" : "auto",
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

                    {msg.file_path && (
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
                      <div style={{ marginBottom: "2px", fontSize: "14px", lineHeight: 1.5, color: isSender ? "#ffffff" : T.lightGray }}>
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

                    {msg.message_type !== "offer" && (
                      <div style={{ textAlign: "right", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                        <span style={{ fontSize: "11px", color: isSender ? (isVisualAttachment ? "var(--inbox-text-light, #a1a1aa)" : "rgba(255,255,255,0.55)") : T.bodyGray }}>{time}</span>
                        {isSender && (() => {
                          const totalExpected = selectedConversation?.is_group 
                            ? (selectedConversation.participants?.length || 1) - 1 
                            : 1;
                          const actualRead = Array.isArray(msg.read_by) ? msg.read_by.length : (msg.read ? 1 : 0);
                          const readByAll = actualRead >= totalExpected && totalExpected > 0;
                          
                          const tooltip = Array.isArray(msg.read_by) && msg.read_by.length > 0
                            ? "Seen by:\n" + msg.read_by.map(r => `${r.name} (${formatRoleForDisplay(r.role)})`).join("\n")
                            : msg.read ? "Read" : "Sent (Unread)";

                          return (
                            <div title={tooltip} style={{ display: "flex", alignItems: "center", cursor: "help" }}>
                              {readByAll ? (
                                <BsCheck2All size={14} color="#38bdf8" />
                              ) : actualRead > 0 ? (
                                <BsCheck2All size={14} color={isVisualAttachment ? "var(--inbox-text-light, #a1a1aa)" : "rgba(255,255,255,0.5)"} />
                              ) : (
                                <BsCheck2 size={14} color={isVisualAttachment ? "var(--inbox-text-light, #a1a1aa)" : "rgba(255,255,255,0.5)"} />
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
          flexShrink: 0, padding: "12px 85px 12px 20px",
          backgroundColor: T.headerBg,
          borderTop: `1px solid ${T.border}`,
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
                <div style={{ display: "flex", alignItems: "center", backgroundColor: T.cardBgActive, borderRadius: "28px", border: `1px solid ${T.orange}`, overflow: "hidden", width: "100%", padding: "6px 14px", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                    <span className="recording-blink-dot" style={{ width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%", display: "inline-block" }}></span>
                    <span style={{ color: T.white, fontSize: "14px", fontWeight: "600", fontFamily: "monospace" }}>
                      Recording Voice Note: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  
                  {/* Cancel Recording button */}
                  <button 
                    onClick={cancelRecording}
                    style={{
                      background: "none", border: "none", color: "#ef4444",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600",
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "8px 12px", borderRadius: "14px",
                      backgroundColor: "rgba(239, 68, 68, 0.1)"
                    }}
                  >
                    🗑️ Cancel
                  </button>

                  {/* Stop and Preview button */}
                  <button 
                    onClick={stopRecording}
                    style={{
                      border: "none", color: "#ffffff",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600",
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "8px 16px", borderRadius: "14px",
                      backgroundColor: T.orange
                    }}
                  >
                    ⏹️ Stop & Preview
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", backgroundColor: T.cardBgActive, borderRadius: "28px", border: `1px solid ${T.borderMid}`, overflow: "hidden", transition: "border-color 0.2s", gap: 0, width: "100%" }}>
                  <input
                    ref={inputRef}
                    value={inputVal}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onPaste={handlePaste}
                    disabled={!receiverId || loading || !isCommunicationAllowed}
                    placeholder="Type a message..."
                    style={{
                      flex: 1, border: "none", padding: "12px 18px",
                      fontSize: "14px", outline: "none",
                      backgroundColor: "transparent", color: T.white,
                    }}
                  />
                  
                  {/* Microphone / Record button */}
                  <button
                    onClick={startRecording}
                    disabled={!receiverId || loading || !isCommunicationAllowed}
                    style={{
                      background: "transparent", border: "none", color: T.bodyGray,
                      padding: "0 12px", cursor: "pointer", transition: "color 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px"
                    }}
                    type="button"
                    title="Record voice note"
                    onMouseEnter={e => e.currentTarget.style.color = T.orange}
                    onMouseLeave={e => e.currentTarget.style.color = T.bodyGray}
                  >
                    🎙️
                  </button>

                  <label htmlFor="fileInput" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 14px", cursor: "pointer", color: T.bodyGray, transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = T.orange}
                    onMouseLeave={e => e.currentTarget.style.color = T.bodyGray}
                  >
                    <IoMdAttach style={{ fontSize: "22px" }} />
                  </label>
                  <input type="file" id="fileInput" multiple style={{ display: "none" }} onChange={handleFileChange} />
                  <button
                    onClick={handleSend}
                    disabled={(!inputVal?.trim() && !selectedFile) || !receiverId || loading || !isCommunicationAllowed}
                    style={{
                      backgroundColor: T.orange, color: "#ffffff", border: "none",
                      padding: "10px 18px", cursor: "pointer", minWidth: "52px", minHeight: "52px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background-color 0.2s",
                      opacity: (!inputVal?.trim() && !selectedFile) ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#d94e18"; }}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = T.orange}
                  >
                    <RiSendPlaneFill style={{ fontSize: "20px" }} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
      {lightboxMedia && createPortal((
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
            backgroundColor: "rgba(11, 20, 26, 0.98)",
            zIndex: 100010,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Floating Control Bar (WhatsApp style) */}
          <div style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            zIndex: 100015
          }}>
            <button 
              onClick={() => handleDownload(lightboxMedia.filePath, lightboxMedia.fileName, lightboxMedia.msgId)}
              style={{
                background: "rgba(11, 20, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(11, 20, 26, 0.95)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(11, 20, 26, 0.8)"}
              title="Download"
            >
              ⬇️
            </button>
            <button 
              onClick={() => setLightboxMedia(null)}
              style={{
                background: "rgba(239, 68, 68, 0.85)",
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.85)";
              }}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Top-Left File Title Info */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#ffffff",
            backgroundColor: "rgba(11, 20, 26, 0.8)",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 100015,
            maxWidth: "calc(100% - 150px)",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}>
            {lightboxMedia.fileName ? lightboxMedia.fileName.replace(/^\d+_/, "") : "Media Viewer"}
          </div>

          {/* Media Center Content */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflow: "hidden"
          }}>
            {lightboxMedia.type === "image" ? (
              <img 
                src={lightboxMedia.url} 
                alt="Viewer" 
                style={{
                  maxHeight: "85vh",
                  maxWidth: "95vw",
                  objectFit: "contain",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
              />
            ) : lightboxMedia.type === "video" ? (
              <video 
                src={lightboxMedia.url} 
                controls 
                autoPlay
                style={{
                  maxHeight: "85vh",
                  maxWidth: "95vw",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
              />
            ) : lightboxMedia.type === "pdf" ? (
              <iframe 
                src={lightboxMedia.url} 
                title="PDF Viewer"
                style={{
                  width: "90vw",
                  height: "80vh",
                  border: "none",
                  borderRadius: "6px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  backgroundColor: "#ffffff"
                }}
              />
            ) : null}
          </div>
        </div>
      ), document.body)}
    </>
  );
};

export default Chatting;