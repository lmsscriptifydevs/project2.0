import { Box, Button, Modal, Pagination, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TiArrowRight, TiTick, TiTimes } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import userImg from "../assets/chatImg.webp";
import search from "../assets/searchbar.webp";
import Navbar from "../components/Navbar";
import { getBdBuyerRequest, getBuyerRequest } from "../redux/slices/buyerRequestSlice";
import { CreateOfferRequest, getExperts, getOfferRequest, getPersonalGigs } from "../redux/slices/offersSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import "../style/userByer.scss";

// --- GRAPETASK DARK THEME ---
const theme = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  pureWhite: "#ffffff",
  pureBlack: "#000000",
  lightGrayHover: "#d4d4d8",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  darkGrayNumber: "#52525b",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  mediumBorder: "rgba(255, 255, 255, 0.07)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "700px", // Compact design
  bgcolor: theme.mainBg,
  border: `1px solid ${theme.mediumBorder}`,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  overflowY: "auto",
  height: "85vh",
  color: theme.pureWhite,
};

const extraCss = `
body {
  background-color: ${theme.mainBg} !important;
  color: ${theme.pureWhite} !important;
}

.userByerMain { background-color: transparent; }

/* Custom Inputs & Placeholders */
input::placeholder, textarea::placeholder {
  color: ${theme.bodyGrayText} !important;
}

.sent-offer-detail-card {
  background: ${theme.cardBg};
  border: 1px solid ${theme.lightBorder};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  transition: all .2s ease-in-out;
}
.sent-offer-detail-card:hover { 
  box-shadow: 0 4px 18px rgba(0,0,0,.2); 
  background: ${theme.cardBgActive};
  border-color: ${theme.mediumBorder};
}
.sodc-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; background: ${theme.cardBgActive};
  border-bottom: 1px solid ${theme.lightBorder}; flex-wrap: wrap; gap: 8px;
}
.sodc-request-title { font-size: 14px; font-weight: 600; color: ${theme.pureWhite}; margin: 0; }
.sodc-status {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 600; text-transform: capitalize;
}
.sodc-status.accepted  { background: rgba(5, 150, 105, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
.sodc-status.rejected  { background: rgba(220, 38, 38, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.sodc-status.pending   { background: rgba(180, 83, 9, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
.sodc-status.expert_assigned { background: ${theme.secondaryBlueBlur}; color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.2); }
.sodc-status.default   { background: ${theme.cardBg}; color: ${theme.lightGrayHover}; border: 1px solid ${theme.lightBorder}; }
.sodc-body { padding: 14px 16px; display: flex; flex-wrap: wrap; gap: 14px; }
.sodc-desc-block { flex: 2; min-width: 200px; }
.sodc-desc-label { font-size: 10px; font-weight: 700; color: ${theme.mediumGrayTitle}; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px; }
.sodc-desc-text  { font-size: 13px; color: ${theme.lightGrayHover}; line-height: 1.5; margin: 0; border-left: 2px solid ${theme.primaryOrange}; padding-left: 10px; font-style: italic; }
.sodc-meta-block { flex: 1; min-width: 160px; display: flex; flex-direction: column; gap: 8px; }
.sodc-meta-row   { display: flex; justify-content: space-between; align-items: center; }
.sodc-meta-key   { font-size: 11px; color: ${theme.mediumGrayTitle}; }
.sodc-meta-val   { font-size: 12px; font-weight: 600; color: ${theme.pureWhite}; }
.sodc-meta-val.green { color: #10b981; }
.sodc-expert-block {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; background: ${theme.cardBg}; border-top: 1px solid ${theme.lightBorder};
}
.sodc-expert-avatar {
  width: 28px; height: 28px; border-radius: 50%; background: ${theme.cardBgActive};
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px; color: ${theme.primaryOrange}; flex-shrink: 0; overflow: hidden; border: 1px solid ${theme.lightBorder};
}
.sodc-expert-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sodc-expert-name { font-size: 12px; font-weight: 600; color: ${theme.pureWhite}; margin: 0; }
.sodc-expert-sub  { font-size: 10px; color: ${theme.mediumGrayTitle}; margin: 0; }
.sodc-invite-tag  {
  margin-left: auto; background: ${theme.secondaryBlueBlur}; color: #60a5fa;
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 20px; letter-spacing: .5px; text-transform: uppercase; border: 1px solid rgba(96, 165, 250, 0.2);
}

/* Custom Tabs Styles */
.custom-nav-pills .nav-link {
  color: ${theme.mediumGrayTitle};
  background: transparent;
  border-radius: 8px !important;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.3s;
}
.custom-nav-pills .nav-link.active {
  background-color: ${theme.cardBgActive};
  color: ${theme.pureWhite};
  border: 1px solid ${theme.orangeBorderActive};
}
.custom-nav-pills .badge-count {
  background: ${theme.secondaryBlueBlur};
  color: ${theme.primaryOrange};
  border: 1px solid ${theme.lightBorder};
}

/* Card Styling */
.dark-card {
  background: ${theme.cardBg};
  border: 1px solid ${theme.lightBorder};
  border-radius: 12px;
  transition: all 0.3s;
}
.dark-card:hover {
  background: ${theme.cardBgActive};
  border-color: ${theme.mediumBorder};
}

/* User Tags (Budget, Offers, etc) */
.dark-tag {
  background: ${theme.cardBgActive};
  border: 1px solid ${theme.lightBorder};
  color: ${theme.lightGrayHover};
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  margin-right: 6px;
  margin-bottom: 6px;
  display: inline-block;
}

/* Form Controls Customization */
.dark-input {
  background-color: ${theme.cardBg} !important;
  border: 1px solid ${theme.mediumBorder} !important;
  color: ${theme.pureWhite} !important;
  border-radius: 8px !important;
  font-size: 13px !important;
}
.dark-input:focus {
  border-color: ${theme.primaryOrange} !important;
  box-shadow: 0 0 0 2px ${theme.orangeBorderActive} !important;
  background-color: ${theme.cardBgActive} !important;
}

/* Custom Scrollbar for Modal */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: ${theme.mainBg}; }
::-webkit-scrollbar-thumb { background: ${theme.darkGrayNumber}; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: ${theme.bodyGrayText}; }
`;

const getInitials = (fname, lname) => {
  const f = fname || "";
  const l = lname || "";
  return `${f[0] || ""}${l[0] || ""}`.toUpperCase() || "?";
};

// Media Gallery Component for displaying images, videos, and PDFs
const MediaGallery = ({ media, maxDisplay = 4 }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Ensure media is always an array, even if null/undefined is passed
  const mediaArray = Array.isArray(media) ? media : [];

  const getMediaType = (url) => {
    const ext = url?.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'other';
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(null);
  };

  const goNext = () => {
    if (lightboxIndex < mediaArray.length - 1) setLightboxIndex(lightboxIndex + 1);
  };

  const goPrev = () => {
    if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
  };

  const displayMedia = mediaArray.slice(0, maxDisplay);
  const remaining = mediaArray.length - maxDisplay;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {displayMedia.map((url, idx) => {
          const type = getMediaType(url);
          return (
            <div
              key={idx}
              onClick={() => type !== 'pdf' && openLightbox(idx)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(240, 89, 31, 0.4)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {type === 'image' && (
                <img
                  src={url}
                  alt={`Media ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              {type === 'video' && (
                <>
                  <video
                    src={url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    preload="metadata"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </>
              )}
              {type === 'pdf' && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%', textDecoration: 'none', color: '#ef4444',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span style={{ fontSize: '9px', marginTop: '2px', color: '#a1a1aa' }}>PDF</span>
                </a>
              )}
              {type === 'other' && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%', textDecoration: 'none', color: '#a1a1aa',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ fontSize: '9px', marginTop: '2px' }}>File</span>
                </a>
              )}
              {idx === maxDisplay - 1 && remaining > 0 && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: 'white',
                  backdropFilter: 'blur(2px)',
                }}>
                  +{remaining}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', width: '40px', height: '40px',
              borderRadius: '50%', cursor: 'pointer',
              fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}
          >
            ✕
          </button>

          <div style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 600,
            background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: '20px',
          }}>
            {lightboxIndex + 1} / {media.length}
          </div>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              style={{
                position: 'absolute', left: '20px',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'white', width: '44px', height: '44px',
                borderRadius: '50%', cursor: 'pointer',
                fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2, transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,89,31,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              ‹
            </button>
          )}

          {lightboxIndex < media.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              style={{
                position: 'absolute', right: '20px',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'white', width: '44px', height: '44px',
                borderRadius: '50%', cursor: 'pointer',
                fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2, transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,89,31,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              ›
            </button>
          )}

          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getMediaType(media[lightboxIndex]) === 'image' ? (
              <img
                src={media[lightboxIndex]}
                alt={`Media ${lightboxIndex + 1}`}
                style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', objectFit: 'contain' }}
              />
            ) : getMediaType(media[lightboxIndex]) === 'video' ? (
              <video
                src={media[lightboxIndex]}
                controls
                autoPlay
                style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={{ textAlign: 'center', color: 'white' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p style={{ fontSize: '16px', marginBottom: '12px' }}>Cannot preview this file</p>
                <a
                  href={media[lightboxIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#f0591f', fontSize: '14px', textDecoration: 'underline' }}
                >
                  Open file directly
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const calculateRequiredBids = (price) => {
  if (!price) return 5;
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.]/g, '')) 
    : price;

  if (numericPrice <= 50) return 5;
  if (numericPrice <= 100) return 10;
  if (numericPrice <= 150) return 15;
  if (numericPrice <= 200) return 20;
  if (numericPrice <= 250) return 25;
  if (numericPrice <= 300) return 30;
  if (numericPrice <= 350) return 35;
  if (numericPrice <= 400) return 40;
  if (numericPrice <= 450) return 45;
  if (numericPrice <= 500) return 50;
  return 55;
};

const UserBuyerRequest = () => {
  // State management
  const [open, setOpen] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [buyerRequestData, setBuyerRequestData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Offer creation states
  const [buyerId, setBuyerId] = useState("");
  const [description, setDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [gigRadio, setGigRadio] = useState(null);
  const [expertId, setExpertId] = useState("");
  const [offerLoader, setOfferLoader] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Assignment states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignExpertId, setAssignExpertId] = useState("");

  const [assignmentFormData, setAssignmentFormData] = useState({
    bdOrderId: '',
    assignmentNotes: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  // Refs
  const searchTimeoutRef = useRef(null);

  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const { requestDetail, isLoading, getError } = useSelector((state) => state.buyer);
  const { 
    personalGigs, 
    offerDetail, 
    offerIsLoading, 
    experts, 
    isLoadingExperts, 
    errorExperts 
  } = useSelector((state) => state.offers);

  const expertOptions = useMemo(() => 
    experts?.map(ex => ({
      value: ex?.id,
      label: `${ex?.fname || ""} ${ex?.lname || ""}`,
      image: ex?.image 
    })) || [],
    [experts]
  );

  // Custom Select Component for Experts - Updated with Dark Theme
  const ExpertSelect = ({ 
    options, 
    value, 
    onChange, 
    isLoading,
    placeholder = "Select an expert..."
  }) => {
    const CustomOption = ({ innerProps, label, data, isFocused, isSelected }) => (
      <div {...innerProps} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 12px',
        cursor: 'pointer',
        backgroundColor: isSelected ? theme.orangeBorderActive : isFocused ? theme.cardBgActive : 'transparent',
        color: isSelected ? theme.pureWhite : theme.lightGrayHover,
        fontSize: '13px'
      }}>
        <img 
          src={data.image || userImg} 
          alt={label} 
          style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            marginRight: '10px',
            objectFit: 'cover' 
          }}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = userImg;
          }}
        />
        <span>{label}</span>
      </div>
    );

    const CustomSingleValue = ({ innerProps, data }) => (
      <div {...innerProps} style={{ 
        display: 'flex', 
        alignItems: 'center',
        paddingLeft: '4px',
        color: theme.pureWhite,
        fontSize: '13px'
      }}>
        <img 
          src={data.image || userImg} 
          alt={data.label} 
          style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            marginRight: '8px',
            objectFit: 'cover' 
          }}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = userImg;
          }}
        />
        <span>{data.label}</span>
      </div>
    );

    return (
      <Select
        options={options}
        value={options.find(option => option.value === value)}
        onChange={(selected) => onChange(selected?.value || "")}
        isClearable
        isLoading={isLoading}
        placeholder={placeholder}
        noOptionsMessage={() => "No experts available"}
        className="basic-single"
        classNamePrefix="select"
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '40px',
            borderRadius: '8px',
            backgroundColor: theme.cardBg,
            border: `1px solid ${state.isFocused ? theme.primaryOrange : theme.mediumBorder}`,
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.primaryOrange}` : 'none',
            '&:hover': {
              borderColor: theme.primaryOrange
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: theme.mainBg,
            border: `1px solid ${theme.lightBorder}`,
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 9999
          }),
          menuList: (base) => ({
            ...base,
            padding: 0
          }),
          input: (base) => ({
            ...base,
            color: theme.pureWhite
          }),
          placeholder: (base) => ({
            ...base,
            color: theme.bodyGrayText,
            fontSize: '13px'
          }),
          singleValue: (base) => ({
            ...base,
            color: theme.pureWhite
          })
        }}
      />
    );
  };

  // Read UserData from localStorage synchronously (simple approach)
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("UserData")) || {};
    } catch (error) {
      console.error("Error parsing UserData:", error);
      return {};
    }
  };
  const [UserData, setUserData] = useState(getUserData);

  const UserRole = UserData?.role;
  const userId = UserData?.id;

  // Constants
  const itemsPerPage = 4;
  const itemsPerPage2 = 4;

  const userSentOffers = useMemo(() => {
    if (!offerDetail || !Array.isArray(offerDetail)) return [];
    return offerDetail.filter(offer => offer && String(offer.user_id) === String(userId));
  }, [offerDetail, userId]);

  // Debounced search handler
  const handleSearchChange = useCallback((value) => {
    setSearchKeyword(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  // Pagination calculations for Sent Offers
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Also sort Sent Offers latest first
    const sortedOffers = [...userSentOffers].sort((a, b) => {
      const dateA = new Date(a?.created_at || 0).getTime();
      const dateB = new Date(b?.created_at || 0).getTime();
      return dateB - dateA;
    });

    return {
      visibleData: sortedOffers.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedOffers.length / itemsPerPage) || 1
    };
  }, [userSentOffers, currentPage]);

  const filteredOfferData = useMemo(() => {
    if (!debouncedSearch) return paginationData.visibleData;

    const searchLower = debouncedSearch.toLowerCase();
    return paginationData.visibleData.filter((value) =>
      value && (value.description || "").toLowerCase().includes(searchLower)
    );
  }, [paginationData.visibleData, debouncedSearch]);

  // --- HOLD / UNHOLD FEATURE (localStorage) ---
  const getHoldList = useCallback(() => {
    try {
      const stored = localStorage.getItem("heldBuyerRequests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const [heldIds, setHeldIds] = useState(() => getHoldList());

  const toggleHold = useCallback((requestId) => {
    setHeldIds(prev => {
      const updated = prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId];
      try {
        localStorage.setItem("heldBuyerRequests", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving hold list:", e);
      }
      return updated;
    });
  }, []);

  const isHeld = useCallback((requestId) => {
    return heldIds.includes(requestId);
  }, [heldIds]);

  // Debug: log requestDetail whenever it changes
  useEffect(() => {
    console.log('🔍 requestDetail from Redux:', requestDetail);
    console.log('🔍 requestDetail type:', typeof requestDetail, Array.isArray(requestDetail) ? 'array' : 'not array');
    if (requestDetail && typeof requestDetail === 'object' && !Array.isArray(requestDetail)) {
      console.log('🔍 requestDetail keys:', Object.keys(requestDetail));
    }
  }, [requestDetail]);

  // Recursive array extraction helper
  const extractArray = useCallback((input, depth = 0) => {
    if (Array.isArray(input)) return input;
    if (input && typeof input === 'object') {
      console.log(`🔍 component extractArray depth=${depth} keys:`, Object.keys(input));
      const keysToTry = ['data', 'requests', 'results', 'list', 'buyer_requests', 'records', 'items', 'buyerRequests', 'request', 'allRequests'];
      for (const key of keysToTry) {
        if (input[key] !== undefined && input[key] !== null) {
          const result = extractArray(input[key], depth + 1);
          if (Array.isArray(result)) return result;
        }
      }
    }
    return []; // Return empty array if no array found
  }, []);

  // Filter and sort all requests
  const filteredActiveData = useMemo(() => {
    let filtered = extractArray(requestDetail);

    // Apply search filter if there is a keyword
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(item => {
        if (!item) return false;
        const titleMatch = (item.title || item.gig?.title || "").toLowerCase().includes(searchLower);
        const descMatch = (item.description || "").toLowerCase().includes(searchLower);
        return titleMatch || descMatch;
      });
    } else {
      // If no search, filter out null items to be safe
      filtered = filtered.filter(item => item !== null && item !== undefined);
    }

    // Strictly sort by latest created_at date
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a?.created_at || 0).getTime();
      const dateB = new Date(b?.created_at || 0).getTime();
      return dateB - dateA; // Latest first
    });
  }, [requestDetail, debouncedSearch]);

  // Separate active and held requests
  const { activeRequests, heldRequests } = useMemo(() => {
    const active = [];
    const held = [];
    for (const req of filteredActiveData) {
      if (req && req.id && heldIds.includes(req.id)) {
        held.push(req);
      } else {
        active.push(req);
      }
    }
    return { activeRequests: active, heldRequests: held };
  }, [filteredActiveData, heldIds]);

  // Then paginate the ACTIVE data only
  const paginationData2 = useMemo(() => {
    const startIndex = (currentPage2 - 1) * itemsPerPage2;
    const endIndex = startIndex + itemsPerPage2;
    return {
      visibleData: activeRequests.slice(startIndex, endIndex),
      totalPages: Math.ceil(activeRequests.length / itemsPerPage2) || 1
    };
  }, [activeRequests, currentPage2]);

  // Pagination for held requests
  const [heldPage, setHeldPage] = useState(1);
  const heldPagination = useMemo(() => {
    const startIndex = (heldPage - 1) * itemsPerPage2;
    const endIndex = startIndex + itemsPerPage2;
    return {
      visibleData: heldRequests.slice(startIndex, endIndex),
      totalPages: Math.ceil(heldRequests.length / itemsPerPage2) || 1
    };
  }, [heldRequests, heldPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage2(1);
  }, [debouncedSearch, activeRequests.length]);

  // Calculate duration memoized function
  const calculateDuration = useCallback((createdAt, date) => {
    const diffInSeconds = Math.floor(
      (new Date() - new Date(createdAt || Date.now())) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hr ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }, []);

  // Event handlers
  const handleClose = useCallback(() => {
    setOpen(false);
    setInviteModal(false);
    setBuyerRequestData(null);
  }, []);

  const handleCreateOfferClick = useCallback((buyerRequest) => {
    setBuyerId(buyerRequest.id);
    setBuyerRequestData(buyerRequest);
    setOpen(true);
  }, []);

  const handleInviteExpertClick = useCallback((buyerRequest) => {
    setBuyerId(buyerRequest.id);
    setBuyerRequestData(buyerRequest);
    setInviteModal(true);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value);
  }, []);

  const handlePageChange2 = useCallback((event, value) => {
    setCurrentPage2(value);
  }, []);

  const handleHeldPageChange = useCallback((event, value) => {
    setHeldPage(value);
  }, []);

  const handlePriceChange = useCallback((e) => {
    let value = e.target.value;
    value = value.replace("$", "");
    value = value.replace(/[^0-9$]/g, "");
    setOfferPrice("$" + value);
  }, []);

  const handleResponseOffer = useCallback((data) => {
    if (data?.status) {
      setOfferLoader(false);
      setOpen(false);
      setInviteModal(false);
      setBuyerRequestData(null);
      toast.success("Offer created successfully!", { theme: "dark" });
    } else {
      setOfferLoader(false);
      const errorMsg = data?.message || "Offer creation failed: Please try again.";

      if (data?.message === "Not enough bids! Please purchase more bids to submit an offer.") {
        toast.error(
          <>
            Not enough bids! Please purchase more bids to submit an offer.
            <br />
            <Button onClick={() => navigate("/buy-bids")} style={{ color: theme.primaryOrange, padding: '4px 0' }}>Buy Bids</Button>
          </>, { theme: "dark" }
        );
      } else {
        toast.error(errorMsg, { theme: "dark" });
      }
    }
  }, [navigate]);

  const handleSubmitOffer = useCallback(async (e) => {
    e.preventDefault();

    const selectedExpertId = inviteModal ? assignExpertId : expertId;

    // Build FormData to support file uploads (media[])
    const formData = new FormData();
    formData.append('id', buyerId);
    formData.append('client_id', buyerRequestData?.client?.id || buyerRequestData?.buyer?.id || buyerRequestData?.client_id);
    formData.append('description', description.trim());
    formData.append('price', offerPrice.replace('$', ''));
    formData.append('date', offerDate);
    if (gigRadio) formData.append('gig_id', gigRadio);
    if (selectedExpertId) formData.append('expert_id', selectedExpertId);

    // Append selected files as media[] (multiple files supported)
    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('media[]', selectedFiles[i]);
      }
    }

    setOfferLoader(true);

    try {
      const resultAction = await dispatch(CreateOfferRequest(formData));

      if (CreateOfferRequest.fulfilled.match(resultAction)) {
        handleResponseOffer(resultAction.payload);

        if (UserRole === 'expert/freelancer' || UserRole === 'bidder/company representative/middleman') {
          dispatch(getBdBuyerRequest());
        } else {
          dispatch(getBuyerRequest());
        }
        dispatch(getOfferRequest());
      } else {
        handleResponseOffer({ status: false, message: resultAction.payload });
      }
    } catch (error) {
      handleResponseOffer({ status: false, message: error.message || 'Offer creation failed. Please try again.' });
    } finally {
      setOfferLoader(false);
    }
  }, [buyerId, description, offerPrice, offerDate, handleResponseOffer, gigRadio, expertId, assignExpertId, inviteModal, buyerRequestData, dispatch, UserRole, selectedFiles]);

  const resetForm = useCallback(() => {
    setDescription("");
    setOfferPrice("");
    setOfferDate("");
    setGigRadio("");
    setExpertId("");
    setSelectedFiles([]);
    setOpen(false);
    setInviteModal(false);
    setAiError("");
  }, []);

  const [thinkingMode, setThinkingMode] = useState(false);

  const handleAiGenerate = async () => {
    if (!description.trim()) {
      setAiError("Please write some rough details first so AI can improve it.");
      return;
    }
    setAiError("");
    setIsGeneratingAi(true);

    const makeRequest = async (retriesLeft, useTextFormat = false) => {
      try {
        const url = new URL("https://api.scriptifydevs.xyz/cline/glm5.1/bd/bd.php ");
        url.searchParams.append("message", description);
        url.searchParams.append("thinking", thinkingMode ? "true" : "false");
        url.searchParams.append("model", "gpt4");
        url.searchParams.append("format", useTextFormat ? "text" : "json");

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { Accept: 'application/json, text/plain, */*' }
        });
        
        // Try to parse as JSON first
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          // If not JSON, treat as plain text success
          data = { success: true, content: text, model: "gpt4" };
        }

        if (data.success) {
          return { success: true, data };
        } else {
          // If JSON format failed with error, try text format as fallback
          if (!useTextFormat) {
            return await makeRequest(retriesLeft, true);
          }
          throw new Error(data.content || data.error || "Failed to generate proposal.");
        }
      } catch (err) {
        if (retriesLeft > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await makeRequest(retriesLeft - 1, useTextFormat);
        }
        return { success: false, error: err.message };
      }
    };

    let result = await makeRequest(2);

    if (result.success) {
      const data = result.data;
      // If thinking mode, show thinking in console
      if (thinkingMode && data.thinking) {
        console.log('🤔 AI Thinking:', data.thinking);
      }
      setDescription(data.content);
    } else {
      setAiError(result.error || "Failed to generate proposal.");
    }

    setIsGeneratingAi(false);
  };

  // Fetch data on mount when UserRole and userId are available
  useEffect(() => {
    if (!UserRole || !userId) return;

    const fetchData = async () => {
      try {
        const promises = [
          dispatch(getOfferRequest()),
          dispatch(getExperts())
        ];

        if (UserRole === 'expert/freelancer' || UserRole === 'bidder/company representative/middleman') {
          promises.push(dispatch(getBdBuyerRequest()));
        } else {
          promises.push(dispatch(getBuyerRequest()));
        }

        if (userId) {
          promises.push(dispatch(getPersonalGigs({ user_id: userId })));
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, UserRole, userId]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{extraCss}</style>
      <Navbar FirstNav="none" />
      <div className="container-fluid pt-4 mb-5 userByerMain" style={{ minHeight: '100vh' }}>
        <h4 className="font-18 font-500 cocon ms-lg-4 mb-3" style={{ color: theme.pureWhite }}>
          Buyer Requests
        </h4>

        <div className="row mx-lg-4 mx-md-3 mx-xm-3 mx-0 poppins rounded-3 p-3 pt-3" style={{ background: theme.cardBg, border: `1px solid ${theme.lightBorder}` }}>
          <div className="col-lg-8 col-12 mb-3 mb-lg-0">
            <ul className="nav nav-pills custom-nav-pills gap-2" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active d-flex align-items-center"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Active
                  <span className="badge-count px-2 py-1 ms-2 rounded-2 font-11 font-600 poppins">
                    {activeRequests?.length || 0}
                  </span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center"
                  id="pills-held-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-held"
                  type="button"
                  role="tab"
                  aria-controls="pills-held"
                  aria-selected="false"
                >
                  On Hold
                  <span className="badge-count px-2 py-1 ms-2 rounded-2 font-11 font-600 poppins">
                    {heldRequests?.length || 0}
                  </span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  Sent Offers
                  <span className="badge-count px-2 py-1 ms-2 rounded-2 font-11 font-600 poppins">
                    {userSentOffers?.length || 0}
                  </span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-6 col-12 pe-lg-0">
            <div className="input-group overflow-hidden" style={{ background: theme.cardBgActive, border: `1px solid ${theme.lightBorder}`, borderRadius: '8px' }}>
              <span className="input-group-text border-0 bg-transparent ps-3 pe-2" id="basic-addon1">
                <img src={search} width={14} alt="Search" loading="lazy" decoding="async" style={{ filter: 'brightness(0.7)' }} />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none font-13"
                placeholder="Search requests..."
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ color: theme.pureWhite }}
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <hr style={{ borderColor: theme.mediumBorder, margin: '0 0 16px 0', opacity: 1 }} />

            {/* Show API error if any */}
            {getError && (
              <div className="alert p-2 rounded-2 mb-3 font-13" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                API Error: {getError}
              </div>
            )}
            
            <div className="tab-content" id="pills-tabContent">
              {/* Active Requests Tab */}
              <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                {isLoading ? (
                  <div className="d-flex justify-content-center p-5">
                    <Spinner style={{ color: theme.primaryOrange }} />
                  </div>
                ) : paginationData2.visibleData.length === 0 ? (
                  <div className="text-center py-5 font-14" style={{ color: theme.bodyGrayText }}>
                    No active requests found
                  </div>
                ) : (
                  paginationData2.visibleData.map((value, index) => {
                    const clientData = value?.client || value?.buyer || {};
                    const requestTitle = value?.title || value?.gig?.title || `Request #${value?.id || index}`;

                    return (
                      <div className="dark-card p-3 mb-3" key={value?.id || index}>
                        <div className="d-flex flex-wrap gap-3">
                          {clientData?.image ? (
                            <img
                              src={clientData.image}
                              width={48}
                              height={48}
                              className="rounded-circle flex-shrink-0"
                              alt="client"
                              style={{ border: `1px solid ${theme.lightBorder}`, objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div style={{
                              width: 48, height: 48, borderRadius: "50%",
                              background: theme.cardBgActive, border: `1px solid ${theme.lightBorder}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 600, fontSize: 16, color: theme.primaryOrange, flexShrink: 0
                            }}>
                              {getInitials(clientData?.fname, clientData?.lname)}
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                              <h5 className="font-15 poppins fw-semibold mb-1" style={{ color: theme.pureWhite }}>
                                {requestTitle}
                              </h5>
                              <span className="font-11 poppins" style={{ color: theme.mediumGrayTitle }}>
                                {value?.created_at && new Date(value.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <p className="font-13 poppins mb-2" style={{ color: theme.lightGrayHover, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {value?.description}
                            </p>
                            
                            <MediaGallery media={value?.media} />
                            
                            <div className="mt-2">
                              <span className="dark-tag">Offers: <strong style={{ color: theme.pureWhite }}>{value?.offers?.length || 0}</strong></span>
                              <span className="dark-tag">Budget: <strong style={{ color: '#10b981' }}>{value?.price}</strong></span>
                              <span className="dark-tag">Bids Needed: <strong style={{ color: theme.pureWhite }}>{calculateRequiredBids(value?.price)}</strong></span>
                              <span className="dark-tag" style={{ border: 'none', background: 'transparent', padding: 0, color: theme.mediumGrayTitle }}>{calculateDuration(value?.created_at, value?.date)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 justify-content-end border-top pt-3" style={{ borderColor: theme.lightBorder }}>
                          {(UserRole === "bidder/company representative/middleman" || UserRole === "bd") && (
                            <Button
                              variant="outlined"
                              size="small"
                              style={{ color: theme.lightGrayHover, borderColor: theme.mediumBorder, textTransform: 'none', fontSize: '13px', borderRadius: '6px' }}
                              onClick={() => handleInviteExpertClick(value)}
                            >
                              Invite Expert
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            size="small"
                            style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, textTransform: 'none', fontSize: '13px', borderRadius: '6px', boxShadow: 'none' }}
                            onClick={() => handleCreateOfferClick(value)}
                          >
                            Create Offer
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {paginationData2.totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-4">
                    <Pagination
                      count={paginationData2.totalPages}
                      page={currentPage2}
                      onChange={handlePageChange2}
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': { color: theme.lightGrayHover, fontSize: '13px' },
                        '& .Mui-selected': { backgroundColor: `${theme.primaryOrange} !important`, color: theme.pureWhite },
                        '& .MuiPaginationItem-root:hover': { backgroundColor: theme.cardBgActive }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* On Hold Tab */}
              <div className="tab-pane fade" id="pills-held" role="tabpanel" aria-labelledby="pills-held-tab" tabIndex={0}>
                {isLoading ? (
                  <div className="d-flex justify-content-center p-5">
                    <Spinner style={{ color: theme.primaryOrange }} />
                  </div>
                ) : heldPagination.visibleData.length === 0 ? (
                  <div className="text-center py-5 font-14" style={{ color: theme.bodyGrayText }}>
                    No requests on hold
                  </div>
                ) : (
                  heldPagination.visibleData.map((value, index) => {
                    const clientData = value?.client || value?.buyer || {};
                    const requestTitle = value?.title || value?.gig?.title || `Request #${value?.id || index}`;

                    return (
                      <div className="dark-card p-3 mb-3" key={value?.id || index}>
                        <div className="d-flex flex-wrap gap-3">
                          {clientData?.image ? (
                            <img
                              src={clientData.image}
                              width={48}
                              height={48}
                              className="rounded-circle flex-shrink-0"
                              alt="client"
                              style={{ border: `1px solid ${theme.lightBorder}`, objectFit: 'cover', opacity: 0.6 }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div style={{
                              width: 48, height: 48, borderRadius: "50%",
                              background: theme.cardBgActive, border: `1px solid ${theme.lightBorder}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 600, fontSize: 16, color: theme.mediumGrayTitle, flexShrink: 0
                            }}>
                              {getInitials(clientData?.fname, clientData?.lname)}
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                              <h5 className="font-15 poppins fw-semibold mb-1" style={{ color: theme.mediumGrayTitle }}>
                                {requestTitle}
                              </h5>
                              <span className="font-11 poppins" style={{ color: theme.mediumGrayTitle }}>
                                {value?.created_at && new Date(value.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <p className="font-13 poppins mb-2" style={{ color: theme.bodyGrayText, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {value?.description}
                            </p>
                            
                            <MediaGallery media={value?.media} />
                            
                            <div className="mt-2">
                              <span className="dark-tag">Offers: <strong style={{ color: theme.mediumGrayTitle }}>{value?.offers?.length || 0}</strong></span>
                              <span className="dark-tag">Budget: <strong style={{ color: '#10b981' }}>{value?.price}</strong></span>
                              <span className="dark-tag">Bids Needed: <strong style={{ color: theme.mediumGrayTitle }}>{calculateRequiredBids(value?.price)}</strong></span>
                              <span className="dark-tag" style={{ border: 'none', background: 'transparent', padding: 0, color: theme.mediumGrayTitle }}>{calculateDuration(value?.created_at, value?.date)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 justify-content-end border-top pt-3" style={{ borderColor: theme.lightBorder }}>
                          <Button
                            variant="outlined"
                            size="small"
                            style={{ color: theme.primaryOrange, borderColor: theme.orangeBorderActive, textTransform: 'none', fontSize: '13px', borderRadius: '6px' }}
                            onClick={() => toggleHold(value.id)}
                          >
                            Unhold
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {heldPagination.totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-4">
                    <Pagination
                      count={heldPagination.totalPages}
                      page={heldPage}
                      onChange={handleHeldPageChange}
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': { color: theme.lightGrayHover, fontSize: '13px' },
                        '& .Mui-selected': { backgroundColor: `${theme.primaryOrange} !important`, color: theme.pureWhite },
                        '& .MuiPaginationItem-root:hover': { backgroundColor: theme.cardBgActive }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Sent Offers Tab */}
              <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                {offerIsLoading ? (
                  <div className="d-flex justify-content-center p-5">
                    <Spinner style={{ color: theme.primaryOrange }} />
                  </div>
                ) : filteredOfferData.length === 0 ? (
                  <div className="text-center py-5 font-14" style={{ color: theme.bodyGrayText }}>
                    No offers sent yet
                  </div>
                ) : (
                  filteredOfferData.map((value, index) => {
                    const requestTitle = value?.title || value?.gig?.title || `Offer #${value?.id || index}`;
                    return (
                      <div className="dark-card p-3 mb-3" key={value?.id || index}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="font-14 fw-semibold m-0" style={{ color: theme.pureWhite }}>{requestTitle}</h6>
                          <div className={`d-flex align-items-center gap-1 font-12 rounded-pill px-2 py-1 ${
                            value?.status === 'accepted' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 
                            value?.status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' : 
                            'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'
                          }`}>
                            {value?.status === 'accepted' && <TiTick size={16} />}
                            {value?.status === 'rejected' && <TiTimes size={16} />}
                            {value?.status === 'pending' && <TiArrowRight size={16} />}
                            <span style={{ textTransform: 'capitalize' }}>{value?.status || "Pending"}</span>
                          </div>
                        </div>
                        <p className="font-13 mb-3" style={{ color: theme.lightGrayHover }}>
                          {value?.description || "No description provided."}
                        </p>
                        <div className="d-flex align-items-center gap-3 pt-2 border-top" style={{ borderColor: theme.lightBorder }}>
                          <span className="font-12" style={{ color: theme.pureWhite }}>Budget: <strong style={{ color: '#10b981' }}>{value?.price || "$0"}</strong></span>
                          <span className="font-12" style={{ color: theme.mediumGrayTitle }}>{calculateDuration(value?.created_at, value?.date)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {paginationData.totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-4">
                    <Pagination
                      count={paginationData.totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': { color: theme.lightGrayHover, fontSize: '13px', border: `1px solid ${theme.lightBorder}` },
                        '& .Mui-selected': { backgroundColor: `${theme.primaryOrange} !important`, borderColor: theme.primaryOrange, color: theme.pureWhite },
                        '& .MuiPaginationItem-root:hover': { backgroundColor: theme.cardBgActive }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Create Offer / Invite Expert */}
      <Modal
        open={open || inviteModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={modalStyle} className="p-4 custom-scrollbar">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: theme.lightBorder }}>
            <h2 className="font-18 fw-bold m-0" style={{ color: theme.pureWhite }}>
              {inviteModal ? "Invite Expert" : `Submit Offer`}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="btn-close btn-close-white"
              style={{ fontSize: '12px', opacity: 0.6 }}
              aria-label="Close"
            />
          </div>

          {buyerRequestData && (
            <div className="mb-4 p-3 rounded-3 d-flex flex-column gap-1" style={{ background: theme.cardBgActive, border: `1px solid ${theme.lightBorder}` }}>
              <strong className="font-14" style={{ color: theme.pureWhite }}>
                {buyerRequestData.title || buyerRequestData.gig?.title || `Request #${buyerId}`}
              </strong>
              {buyerRequestData.price && (
                <span className="font-13" style={{ color: '#10b981' }}>Budget: {buyerRequestData.price}</span>
              )}
            </div>
          )}

          {aiError && (
            <div className="alert p-2 rounded-2 mb-3 font-13" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
              {aiError}
            </div>
          )}

          <form onSubmit={handleSubmitOffer}>
            <div className="row g-3">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-end mb-1">
                  <label className="form-label font-13 fw-semibold mb-0" style={{ color: theme.lightGrayHover }}>
                    Cover Letter / Description
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Mode Toggle: Instant / Deep Thinking */}
                    <button
                      type="button"
                      onClick={() => setThinkingMode(!thinkingMode)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        border: thinkingMode ? '1.5px solid rgba(59,130,246,0.3)' : '1.5px solid rgba(34,197,94,0.3)',
                        background: thinkingMode ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                        color: thinkingMode ? '#60a5fa' : '#4ade80',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '10px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                      title={thinkingMode ? "Switch to Instant mode" : "Switch to Deep Thinking mode"}
                    >
                      {thinkingMode ? (
                        <>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2a10 10 0 1 0 10 10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          Deep
                        </>
                      ) : (
                        <>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                          Instant
                        </>
                      )}
                    </button>

                    <Button
                      variant="text"
                      onClick={handleAiGenerate}
                      disabled={isGeneratingAi}
                      size="small"
                      style={{
                        color: theme.primaryOrange,
                        textTransform: 'none',
                        fontSize: '12px',
                        padding: '2px 8px',
                        fontWeight: 600,
                        opacity: isGeneratingAi ? 0.7 : 1,
                        minWidth: 'auto'
                      }}
                    >
                      {isGeneratingAi ? <Spinner size="sm" style={{ width: '12px', height: '12px', marginRight: '4px' }} /> : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                          <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
                        </svg>
                      )}
                      {isGeneratingAi ? 'Improving...' : 'Improve with AI'}
                    </Button>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  className="form-control dark-input p-3"
                  rows="5"
                  required
                  placeholder="Describe your offer..."
                />
                <p className="font-11 text-end mt-1 mb-0" style={{ color: theme.mediumGrayTitle }}>
                  {description.length}/1000
                </p>
              </div>

              <div className="col-md-6 col-12">
                <label className="form-label font-13 fw-semibold mb-1" style={{ color: theme.lightGrayHover }}>
                  Offer Price
                </label>
                <input
                  type="text"
                  value={offerPrice}
                  onChange={handlePriceChange}
                  placeholder="$0.00"
                  className="form-control dark-input px-3 py-2"
                  required
                />
              </div>

              <div className="col-md-6 col-12">
                <label className="form-label font-13 fw-semibold mb-1" style={{ color: theme.lightGrayHover }}>
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={offerDate}
                  onChange={(e) => setOfferDate(e.target.value)}
                  className="form-control dark-input px-3 py-2"
                  style={{ colorScheme: 'dark' }} // Enables dark mode calendar icon in some browsers
                  required
                />
              </div>

              {/* Media / File Upload Section */}
              <div className="col-12 mt-2">
                <label className="form-label font-13 fw-semibold mb-1" style={{ color: theme.lightGrayHover }}>
                  Attach Files (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.zip,.rar"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setSelectedFiles(prev => [...prev, ...files]);
                    // Reset input value so same file can be selected again
                    e.target.value = '';
                  }}
                  className="form-control dark-input px-3 py-2"
                  style={{ colorScheme: 'dark' }}
                />
                {selectedFiles.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center gap-2 px-2 py-1 rounded-2"
                        style={{
                          background: theme.cardBgActive,
                          border: `1px solid ${theme.lightBorder}`,
                          fontSize: '12px',
                          color: theme.lightGrayHover
                        }}
                      >
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
                          />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        )}
                        <span className="font-11" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '14px',
                            lineHeight: 1
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <small className="font-11 mt-1 d-block" style={{ color: theme.mediumGrayTitle }}>
                  Supported: Images, PDF, DOC, DOCX, ZIP, RAR
                </small>
              </div>

              {(UserRole === "bidder/company representative/middleman" || UserRole === "bd") && (
                <div className="col-12 mt-2">
                  <label className="form-label font-13 fw-semibold mb-1" style={{ color: theme.lightGrayHover }}>
                    Select Expert (Optional)
                  </label>
                  <ExpertSelect 
                    options={expertOptions}
                    value={inviteModal ? assignExpertId : expertId}
                    onChange={inviteModal ? setAssignExpertId : setExpertId} 
                    isLoading={isLoadingExperts}
                  />
                  <small className="font-11 mt-1 d-block" style={{ color: theme.mediumGrayTitle }}>
                    If selected, this will directly invite the expert to work on this request.
                  </small>
                </div>
              )}

              {/* Personal Gigs (Radio Select) */}
              {!inviteModal && personalGigs?.length > 0 && (
                <div className="col-12 mt-3">
                  <label className="form-label font-13 fw-semibold mb-2" style={{ color: theme.lightGrayHover }}>
                    Attach a Gig (Optional)
                  </label>
                  <div className="row g-2">
                    {personalGigs.map((innerValue, idx) => {
                      const isSelected = String(gigRadio) === String(innerValue.id);
                      return (
                        <div className="col-md-4 col-sm-6" key={innerValue.id || idx}>
                          <label 
                            htmlFor={`gigRadio${idx}`} 
                            className="d-block w-100 h-100 p-2 rounded-3 cursor-pointer"
                            style={{ 
                              background: isSelected ? theme.cardBgActive : theme.cardBg,
                              border: `1px solid ${isSelected ? theme.primaryOrange : theme.lightBorder}`,
                              transition: 'all 0.2s'
                            }}
                          >
                            <input
                              checked={isSelected}
                              type="radio"
                              value={innerValue.id}
                              onChange={() => setGigRadio(innerValue.id)}
                              name="gigCheck"
                              id={`gigRadio${idx}`}
                              className="d-none"
                            />
                            <div className="ratio ratio-16x9 mb-2 overflow-hidden rounded">
                              <img
                                src={innerValue.media?.image1 || innerValue.media?.image2 || innerValue.media?.image3 || userImg}
                                alt="Gig"
                                className="object-fit-cover w-100 h-100"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            </div>
                            <p className="font-11 mb-0 lh-sm text-center" style={{ color: isSelected ? theme.pureWhite : theme.lightGrayHover, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {innerValue.title}
                            </p>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 text-end border-top" style={{ borderColor: theme.lightBorder }}>
              <Button
                type="button"
                onClick={resetForm}
                style={{ color: theme.lightGrayHover, marginRight: '10px', textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={offerLoader}
                variant="contained"
                style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, textTransform: 'none', boxShadow: 'none', padding: '6px 20px' }}
              >
                {offerLoader ? <Spinner size="sm" /> : "Send Offer"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default UserBuyerRequest;