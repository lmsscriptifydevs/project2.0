import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CreateBuyerRequest, getBds, getClientRequest } from "../redux/slices/buyerRequestSlice";
import { getCategory, getSubCategory } from "../redux/slices/gigsSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useUserData } from "../utils/useLocalStorage";
import "../style/byerRequest.scss";
import "../style/multistep.scss";

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

// Sleek & Compact MUI Styling
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    backgroundColor: theme.cardBg,
    borderRadius: '6px',
    fontSize: '13px',
    minHeight: '38px',
    '& fieldset': { borderColor: theme.mediumBorder, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: theme.lightGrayHover },
    '&.Mui-focused fieldset': { borderColor: theme.primaryOrange, boxShadow: `0 0 0 2px ${theme.secondaryBlueBlur}` },
  },
  '& input': { color: '#ffffff !important' },
  '& textarea': { color: '#ffffff !important' },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 1000px #020617 inset !important`,
    WebkitTextFillColor: '#ffffff !important',
    transition: 'background-color 5000s ease-in-out 0s'
  },
  '& .MuiInputBase-input': { padding: '8px 12px', color: '#ffffff !important' },
  '& .MuiInputBase-inputMultiline': { color: '#ffffff !important' },
  '& .MuiSelect-select': { color: '#ffffff !important' },
  '& .MuiSvgIcon-root': { color: theme.mediumGrayTitle, fontSize: '18px' },
};

const menuProps = {
  PaperProps: {
    sx: {
      bgcolor: theme.mainBg,
      border: `1px solid ${theme.lightBorder}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      mt: 1,
      '& .MuiMenuItem-root': {
        color: theme.pureWhite,
        fontSize: '13px',
        py: 1,
        '&:hover': { bgcolor: theme.cardBgActive },
        '&.Mui-selected': { bgcolor: theme.secondaryBlueBlur, color: theme.primaryOrange, fontWeight: 600 },
        '&.Mui-selected:hover': { bgcolor: theme.cardBgActive }
      }
    }
  }
};

const BuyerRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading: _isLoading } = useSelector((state) => state.allOrder);
  const { userCategory, userSubCategory } = useSelector((state) => state.gig);
  const { requestClientList, isLoadingCreate, isLoadingBuyerList, bdList } = useSelector((state) => state.buyer);

  const UserData = useUserData();

  // Local states
  const [formState, setFormState] = useState({
    gigTitle: "",
    description: "",
    budget: "",
    delivered: "",
    category: "",
    subCategory: "",
    visibility: "public", 
    inviteBDs: [] 
  });
  const [formError, setFormError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [thinkingMode, setThinkingMode] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [aiLoadingPopup, setAiLoadingPopup] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState("");
  const [aiLoadingProgress, setAiLoadingProgress] = useState(0);
  const modelSelectorRef = useRef(null);
  const modelBtnRef = useRef(null);
  const [modelPopupPos, setModelPopupPos] = useState({ top: 0, left: 0 });
  const aiLoadingIntervalRef = useRef(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const detailModalRef = useRef(null);
  const viewAllBtnRef = useRef(null);
  const [viewAllPopupPos, setViewAllPopupPos] = useState({ top: 0, left: 0 });
  const [showViewAllPopup, setShowViewAllPopup] = useState(false);
  const viewAllPopupRef = useRef(null);

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(e.target) &&
          modelBtnRef.current && !modelBtnRef.current.contains(e.target)) {
        setShowModelSelector(false);
      }
    };
    if (showModelSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModelSelector]);

  // Cleanup AI loading interval
  useEffect(() => {
    return () => {
      if (aiLoadingIntervalRef.current) {
        clearInterval(aiLoadingIntervalRef.current);
      }
    };
  }, []);

  const buyerRequestListRef = useRef(null);

  const filteredSubCategories = useMemo(() => {
    const arr = Array.isArray(userSubCategory) ? userSubCategory : [];
    const cat = formState.category;
    return cat ? arr.filter((sub) => parseInt(sub?.category_id) === parseInt(cat)) : [];
  }, [userSubCategory, formState.category]);

  const fetchInitialData = useCallback(() => {
    if (UserData?.id) dispatch(getClientRequest({ client_id: UserData.id }));
    dispatch(getCategory());
    dispatch(getSubCategory());
    dispatch(getBds());
  }, [UserData?.id, dispatch]);

  const handleInputChange = useCallback((field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    setFormError((prev) => (prev ? "" : prev));
  }, []);

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormState((prev) => ({ ...prev, budget: value ? `$${value}` : "" }));
  };

  const validateForm = () => {
    if (!formState.category || !formState.subCategory) {
      setFormError("Please select both category and subcategory");
      return false;
    }
    if (!formState.gigTitle || !formState.description || !formState.budget || !formState.delivered) {
      setFormError("Please fill in all required fields");
      return false;
    }
    if (formState.visibility === "inviteOnly" && formState.inviteBDs.length === 0) {
      setFormError("Please select at least one BD to invite.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Use FormData to support file uploads
    const formData = new FormData();
    formData.append('title', formState.gigTitle);
    formData.append('description', formState.description);
    formData.append('category_id', parseInt(formState.category));
    formData.append('sub_category_id', parseInt(formState.subCategory));
    formData.append('price', formState.budget.replace("$", ""));
    formData.append('date', formState.delivered);
    formData.append('visibility', formState.visibility);
    
    if (formState.visibility === "inviteOnly" && formState.inviteBDs.length > 0) {
      formState.inviteBDs.forEach((bdId) => {
        formData.append('invite_bds[]', bdId);
      });
    }

    // Append media files with media[] key
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('media[]', file);
      });
    }

    dispatch(CreateBuyerRequest(formData, handleResponse));
  };

  const handleResponse = (response) => {
    if (response?.success) {
      setFormState({
        gigTitle: "",
        description: "",
        budget: "",
        delivered: "",
        category: "",
        subCategory: "",
        visibility: "public",
        inviteBDs: []
      });
      setSelectedFiles([]);
      dispatch(getClientRequest({ client_id: UserData.id }));
      buyerRequestListRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setFormError(response?.error || "Request failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = () => {
      fetchInitialData();
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchData, { timeout: 500 });
    } else {
      setTimeout(fetchData, 0);
    }
  }, [fetchInitialData]);

  // AI Loading animation messages
  const loadingMessages = [
    "Analyzing your request...",
    "Generating optimized content...",
    "Applying AI enhancements...",
    "Finalizing improvements..."
  ];

  const startAiLoadingAnimation = () => {
    setAiLoadingPopup(true);
    setAiLoadingProgress(0);
    setAiLoadingMessage(loadingMessages[0]);
    
    let step = 0;
    aiLoadingIntervalRef.current = setInterval(() => {
      step++;
      if (step < loadingMessages.length) {
        setAiLoadingMessage(loadingMessages[step]);
        setAiLoadingProgress(Math.min((step / loadingMessages.length) * 100, 90));
      }
    }, 1500);
  };

  const stopAiLoadingAnimation = () => {
    if (aiLoadingIntervalRef.current) {
      clearInterval(aiLoadingIntervalRef.current);
      aiLoadingIntervalRef.current = null;
    }
    setAiLoadingProgress(100);
    setTimeout(() => {
      setAiLoadingPopup(false);
      setAiLoadingProgress(0);
    }, 500);
  };

  const handleAiGenerate = async () => {
    const aiText = `${formState.gigTitle}\n\n${formState.description}`;
    if (!aiText.trim()) {
      setAiError("Please fill in the Job Title or Description first so AI can improve it.");
      return;
    }
    setAiError("");
    setIsGenerating(true);
    startAiLoadingAnimation();

    const makeRequest = async (retriesLeft) => {
      try {
        const url = new URL("https://api.scriptifydevs.xyz/cline/glm5.1/clint/clintbuyerrequet.php");
        url.searchParams.append("message", aiText);
        url.searchParams.append("thinking", thinkingMode ? "true" : "false");
        url.searchParams.append("model", "gpt4");
        url.searchParams.append("format", "json");

        const response = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If plain text, wrap it
          const text = await response.text();
          data = { success: true, content: text, model: "gpt4" };
        }

        if (data.success) {
          return { success: true, data };
        } else {
          throw new Error(data.content || data.error || "Failed to generate request.");
        }
      } catch (err) {
        if (retriesLeft > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await makeRequest(retriesLeft - 1);
        }
        return { success: false, error: err.message };
      }
    };

    let result = await makeRequest(2);

    if (result.success) {
      const data = result.data;
      const content = data.content || "";

      // If thinking mode, show thinking in console
      if (thinkingMode && data.thinking) {
        console.log('🤔 AI Thinking:', data.thinking);
      }

      // Check if content has structured fields (PROJECT TITLE:, DESCRIPTION:, etc.)
      const hasStructuredFields = /PROJECT\s*TITLE:|DESCRIPTION:|BUDGET:|CATEGORY:/i.test(content);

      if (hasStructuredFields) {
        // Extract fields from the structured content
        const extractField = (label) => {
          const regex = new RegExp(`${label}:\\s*(.*)`, 'i');
          const match = content.match(regex);
          return match ? match[1].trim() : "";
        };

        // Extract PROJECT TITLE
        let title = extractField("PROJECT TITLE") || extractField("TITLE");
        if (title) {
          title = title.replace(/\*\*/g, '').replace(/"/g, '').trim();
        }

        // Extract CATEGORY
        let categoryName = extractField("CATEGORY");
        if (categoryName) {
          categoryName = categoryName.replace(/\*\*/g, '').trim();
        }

        // Extract BUDGET
        let budgetStr = extractField("BUDGET");
        let newBudget = "";
        if (budgetStr && budgetStr.toLowerCase() !== "not specified" && budgetStr.toLowerCase() !== "[please specify your budget]") {
          let nums = budgetStr.replace(/[^0-9]/g, "");
          if (nums) newBudget = `$${nums}`;
        }

        // Extract DESCRIPTION
        let description = "";
        const descMatch = content.match(/DESCRIPTION:\s*([\s\S]*?)(?=\nDELIVERABLES:|\nSKILLS REQUIRED:|\nBUDGET:|\nDEADLINE:|\nSPECIAL NOTES:|$)/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        if (!description) {
          const lines = content.split('\n').filter(l => l.trim());
          const descStart = lines.findIndex(l => l.startsWith('DESCRIPTION:'));
          if (descStart >= 0) {
            description = lines.slice(descStart + 1).join('\n').trim();
          }
        }
        if (description) {
          description = description.replace(/\*\*/g, '').trim();
        }

        // Extract DELIVERABLES
        let deliverables = "";
        const delMatch = content.match(/DELIVERABLES:\s*([\s\S]*?)(?=\nSKILLS REQUIRED:|\nBUDGET:|\nDEADLINE:|\nSPECIAL NOTES:|$)/i);
        if (delMatch) {
          deliverables = delMatch[1].trim();
        }

        // Extract SKILLS REQUIRED
        let skillsStr = "";
        const skillsMatch = content.match(/SKILLS REQUIRED:\s*([\s\S]*?)(?=\nBUDGET:|\nDEADLINE:|\nSPECIAL NOTES:|$)/i);
        if (skillsMatch) {
          skillsStr = skillsMatch[1].trim();
        }

        // Combine description with deliverables and skills
        let fullDescription = description;
        if (deliverables) {
          fullDescription += `\n\nDELIVERABLES:\n${deliverables}`;
        }
        if (skillsStr) {
          fullDescription += `\n\nSKILLS REQUIRED:\n${skillsStr}`;
        }

        // Attempt category mapping
        let matchedCategory = "";
        let matchedSubcategory = "";
        if (categoryName && userCategory?.length > 0) {
          const cat = userCategory.find(c => 
            c.name.toLowerCase().includes(categoryName.toLowerCase()) || 
            categoryName.toLowerCase().includes(c.name.toLowerCase())
          );
          if (cat) {
            matchedCategory = cat.id;
          }
        }

        setFormState(prev => ({
          ...prev,
          gigTitle: title || prev.gigTitle,
          description: fullDescription || prev.description,
          budget: newBudget || prev.budget,
          category: matchedCategory || prev.category,
        }));
      } else {
        // Plain text response - put entire content into description
        // Also try to extract a title from the first line
        const lines = content.split('\n').filter(l => l.trim());
        let newTitle = formState.gigTitle;
        let newDescription = content;

        // If gigTitle is empty, use first line as title
        if (!formState.gigTitle && lines.length > 0) {
          const firstLine = lines[0].replace(/^["']|["']$/g, '').trim();
          if (firstLine.length < 80) {
            newTitle = firstLine;
            newDescription = lines.slice(1).join('\n').trim() || content;
          }
        }

        setFormState(prev => ({
          ...prev,
          gigTitle: newTitle,
          description: newDescription,
        }));
      }
    } else {
      setAiError(result.error || "Failed to generate request.");
    }

    setIsGenerating(false);
    stopAiLoadingAnimation();
  };

  const customLabelStyle = { color: theme.mediumGrayTitle, fontWeight: 500, fontSize: '13px', marginBottom: '6px', display: 'block' };

  // ====== STYLED COMPONENTS ======

  const styles = {
    // Glow button for AI
    aiGlowBtn: {
      position: 'relative',
      overflow: 'hidden',
      border: 'none',
      background: 'linear-gradient(135deg, #f0591f 0%, #ff6b35 50%, #f0591f 100%)',
      color: '#fff',
      padding: '8px 22px',
      borderRadius: '8px',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      textTransform: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(240, 89, 31, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      opacity: isGenerating ? 0.7 : 1,
    },
    // Primary submit button
    submitBtn: {
      border: 'none',
      background: 'linear-gradient(135deg, #f0591f 0%, #ff6b35 50%, #f0591f 100%)',
      color: '#fff',
      padding: '8px 28px',
      borderRadius: '8px',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      textTransform: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(240, 89, 31, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      opacity: isLoadingCreate ? 0.7 : 1,
    },
    // Mode selector button
    modeBtn: (isActive, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '7px 18px',
      borderRadius: '100px',
      border: isActive ? `1.5px solid ${color}40` : '1.5px solid rgba(255,255,255,0.08)',
      background: isActive ? `${color}15` : 'rgba(255,255,255,0.03)',
      color: isActive ? color : '#94a3b8',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '12px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      backdropFilter: isActive ? 'blur(4px)' : 'none',
      boxShadow: isActive ? `0 0 20px ${color}20` : 'none',
    }),
    // AI Loading Overlay
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease',
    },
    // Loading card
    loadingCard: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '40px 50px',
      textAlign: 'center',
      maxWidth: '420px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    // Progress bar
    progressBar: {
      height: '4px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '20px',
      position: 'relative',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #f0591f, #ff6b35)',
      borderRadius: '2px',
      transition: 'width 0.5s ease',
      boxShadow: '0 0 10px rgba(240, 89, 31, 0.5)',
    },
    // Model selector popup
    modelPopup: (top, left) => ({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '16px',
      minWidth: '280px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(240, 89, 31, 0.05)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      animation: 'slideDown 0.2s ease',
    }),
    // Model option card
    modelOption: (isSelected, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      background: isSelected ? `${color}12` : 'transparent',
      border: isSelected ? `1px solid ${color}30` : '1px solid transparent',
      transition: 'all 0.2s ease',
      marginBottom: '8px',
    }),
    // Detail Modal Overlay
    detailOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      animation: 'fadeIn 0.2s ease',
    },
    // Detail Modal Card
    detailModal: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(240, 89, 31, 0.05)',
      position: 'relative',
      animation: 'slideDown 0.3s ease',
    },
    // Tag style
    tag: (bg, color, border) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3px 12px',
      borderRadius: '100px',
      fontSize: '11px',
      fontWeight: 500,
      background: bg,
      color: color,
      border: border,
    }),
  };

  return (
    <div style={{ backgroundColor: theme.mainBg, minHeight: '100vh', color: theme.pureWhite }}>
      {/* Inject keyframes for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .gt-mode-btn:hover {
          transform: translateY(-1px);
        }
        .gt-mode-btn:active {
          transform: translateY(0px);
        }
        .gt-request-card:hover {
          transform: translateY(-2px);
          border-color: rgba(240, 89, 31, 0.2) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        .gt-request-card {
          transition: all 0.3s ease;
        }
        .gt-btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(240, 89, 31, 0.4) !important;
        }
        .gt-btn-glow:active {
          transform: translateY(0px);
        }
        .gt-model-option:hover {
          background: rgba(255,255,255,0.04) !important;
          transform: translateX(4px);
        }
        .gt-spinner {
          animation: spin 1s linear infinite;
        }
        .gt-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <Navbar FirstNav="none" />
      
      {/* AI Loading Popup */}
      {aiLoadingPopup && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingCard}>
            {/* Animated AI Icon */}
            <div style={{ marginBottom: '24px', position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(240,89,31,0.2) 0%, rgba(59,130,246,0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                position: 'relative',
              }}>
                <div className="gt-spinner" style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: '#f0591f',
                  borderRightColor: '#3b82f6',
                }} />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#f0591f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Title */}
            <Typography variant="h6" style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
              AI Enhancement in Progress
            </Typography>

            {/* Message */}
            <Typography style={{ color: theme.mediumGrayTitle, fontSize: '13px', marginBottom: '16px' }}>
              {aiLoadingMessage}
            </Typography>

            {/* Progress Bar */}
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${aiLoadingProgress}%` }} />
            </div>

            {/* Status dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: aiLoadingProgress > (i + 1) * 25 ? '#f0591f' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>

            {/* Model badge */}
            <div style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '100px',
              background: thinkingMode ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
              border: `1px solid ${thinkingMode ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)'}`,
              color: thinkingMode ? '#60a5fa' : '#4ade80',
              fontSize: '11px',
              fontWeight: 500,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {thinkingMode ? (
                  <>
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 6v6l4 2" />
                  </>
                ) : (
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                )}
              </svg>
              {thinkingMode ? 'Deep Thinking' : 'Instant'} Mode
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid py-4 byerRequest poppins">
        <div className="row justify-content-center">
          
          {/* Header with gradient accent */}
          <div className="col-11 mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{
                width: '4px',
                height: '28px',
                background: 'linear-gradient(180deg, #f0591f, #ff6b35)',
                borderRadius: '2px',
              }} />
              <Typography variant="h5" className="fw-semibold" style={{ color: theme.pureWhite, fontSize: '22px' }}>
                Post a Buyer Request
              </Typography>
            </div>
            <p className="font-13 mb-0" style={{ color: theme.bodyGrayText, marginLeft: '16px' }}>
              Fill in the details below to get offers from Business Developers.
            </p>
          </div>

          {/* Compact Form */}
          <div className="col-lg-11 col-12">
            <div className="p-4 rounded-3 shadow-sm" style={{ 
              backgroundColor: theme.cardBg, 
              border: `1px solid ${theme.lightBorder}`,
              position: 'relative',
              // overflow hidden removed to allow model selector popup to show
            }}>
              {/* Subtle gradient accent at top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #f0591f, #ff6b35, transparent)',
              }} />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="h6" className="fw-semibold" style={{ color: theme.pureWhite, fontSize: '15px' }}>
                  Request Details
                </Typography>
              </div>

              {aiError && (
                <div className="alert p-2 rounded-2 mb-3 font-13" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                  {aiError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="alert p-2 rounded-2 mb-3 font-13 d-flex align-items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                    {formError}
                  </div>
                )}

                <div className="row g-3">
                  {/* Job Title */}
                  <div className="col-12">
                    <label htmlFor="gigTitle" style={customLabelStyle}>Job Title</label>
                    <TextField
                      id="gigTitle"
                      size="small"
                      value={formState.gigTitle}
                      onChange={handleInputChange("gigTitle")}
                      placeholder="e.g., Need an expert for UI/UX Design"
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={{ style: { color: 'white' } }}
                      inputProps={{ maxLength: 80 }}
                    />
                  </div>

                  {/* Categories */}
                  <div className="col-md-6">
                    <label style={customLabelStyle}>Category</label>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={formState.category}
                        onChange={handleInputChange("category")}
                        required
                        MenuProps={menuProps}
                      >
                        <MenuItem value="" disabled><em style={{ color: theme.bodyGrayText, fontStyle: 'normal' }}>Select Category</em></MenuItem>
                        {userCategory.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <label style={customLabelStyle}>Subcategory</label>
                    <FormControl fullWidth size="small" disabled={!formState.category} sx={{...inputSx, opacity: !formState.category ? 0.5 : 1}}>
                      <Select
                        displayEmpty
                        value={formState.subCategory}
                        onChange={handleInputChange("subCategory")}
                        required
                        MenuProps={menuProps}
                      >
                        <MenuItem value="" disabled><em style={{ color: theme.bodyGrayText, fontStyle: 'normal' }}>Select Subcategory</em></MenuItem>
                        {filteredSubCategories.map((sub) => (
                          <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* BD Invitations (if inviteOnly) */}
                  {formState.visibility === "inviteOnly" && (
                    <div className="col-12">
                      <label style={customLabelStyle}>Invite BD(s)</label>
                      <FormControl fullWidth size="small" sx={inputSx}>
                        <Select
                          multiple
                          displayEmpty
                          value={formState.inviteBDs}
                          onChange={(e) => {
                            setFormState((prev) => ({ ...prev, inviteBDs: e.target.value }));
                            if (formError) setFormError("");
                          }}
                          MenuProps={menuProps}
                          renderValue={(selected) => {
                            if (selected.length === 0) return <span style={{ color: theme.bodyGrayText }}>Select BDs...</span>;
                            return selected.map((id) => bdList.find((bd) => bd.id === id)?.fname).join(', ');
                          }}
                        >
                          {bdList?.map((bd) => (
                            <MenuItem key={bd.id} value={bd.id}>{bd.fname}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                  {/* Job Details (Budget & Delivery in one row) */}
                  <div className="col-md-6">
                    <label htmlFor="budget" style={customLabelStyle}>Budget ($)</label>
                    <TextField
                      id="budget"
                      size="small"
                      value={formState.budget}
                      onChange={handleBudgetChange}
                      placeholder="$0"
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={{ style: { color: 'white' } }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="delivered" style={customLabelStyle}>Delivery Date</label>
                    <TextField
                      id="delivered"
                      type="date"
                      size="small"
                      value={formState.delivered}
                      onChange={handleInputChange("delivered")}
                      required
                      fullWidth
                      sx={{
                        ...inputSx, 
                        '& input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.6, cursor: 'pointer' } 
                      }}
                      InputProps={{ style: { color: 'white' } }}
                    />
                  </div>

                  {/* Media Upload */}
                  <div className="col-12">
                    <label style={customLabelStyle}>Media Files (Optional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `1.5px dashed ${selectedFiles.length > 0 ? 'rgba(240, 89, 31, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: selectedFiles.length > 0 ? 'rgba(240, 89, 31, 0.03)' : 'transparent',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(240, 89, 31, 0.4)'; e.currentTarget.style.background = 'rgba(240, 89, 31, 0.03)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedFiles.length > 0 ? 'rgba(240, 89, 31, 0.4)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = selectedFiles.length > 0 ? 'rgba(240, 89, 31, 0.03)' : 'transparent'; }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setSelectedFiles(prev => [...prev, ...files]);
                          e.target.value = '';
                        }}
                      />
                      {selectedFiles.length > 0 ? (
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', justifyContent: 'center' }}>
                            {selectedFiles.map((file, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: 'rgba(240, 89, 31, 0.08)',
                                border: '1px solid rgba(240, 89, 31, 0.15)',
                                fontSize: '12px',
                                color: '#d4d4d8',
                              }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f0591f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                </svg>
                                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                <span style={{ color: theme.darkGrayNumber, fontSize: '10px' }}>({(file.size / 1024).toFixed(0)} KB)</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '0 2px',
                                    fontSize: '14px',
                                    lineHeight: 1,
                                    fontFamily: 'inherit',
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <div style={{ color: theme.primaryOrange, fontSize: '12px', fontWeight: 500 }}>
                            + Add More Files
                          </div>
                        </div>
                      ) : (
                        <div>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.mediumGrayTitle} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <div style={{ color: theme.mediumGrayTitle, fontSize: '13px' }}>
                            <span style={{ color: theme.primaryOrange, fontWeight: 600 }}>Click to upload</span> or drag and drop
                          </div>
                          <div style={{ color: theme.darkGrayNumber, fontSize: '11px', marginTop: '4px' }}>
                            Images, Videos, PDF, DOC (Max 10MB each)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label htmlFor="description" style={customLabelStyle}>Description</label>
                    <TextField
                      id="description"
                      size="small"
                      value={formState.description}
                      onChange={handleInputChange("description")}
                      placeholder="Briefly describe what you need..."
                      multiline
                      rows={6}
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={{ style: { color: 'white' } }}
                      inputProps={{ maxLength: 1000 }}
                    />
                    <div className="text-end mt-1 font-11" style={{ color: theme.darkGrayNumber }}>
                      {formState.description.length}/1000
                    </div>
                  </div>

                  {/* AI Section - Beautiful Model Selector + Generate Button */}
                  <div className="col-12">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(240, 89, 31, 0.03)',
                      border: '1px solid rgba(240, 89, 31, 0.1)',
                    }}>
                      {/* AI Icon */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(240,89,31,0.15), rgba(59,130,246,0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0591f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>

                  
                    

                      {/* Generate with AI Button */}
                      <button
                        type="button"
                        className="gt-btn-glow"
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        style={styles.aiGlowBtn}
                      >
                        {isGenerating ? (
                          <>
                            <CircularProgress size={14} thickness={5} style={{ color: '#fff' }} />
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            Generate with AI
                          </>
                        )}
                      </button>

                      {/* Spacer */}
                      <div style={{ flex: 1, minWidth: '20px' }} />

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="gt-btn-glow"
                        disabled={isLoadingCreate}
                        style={styles.submitBtn}
                      >
                        {isLoadingCreate ? (
                          <>
                            <CircularProgress size={14} thickness={5} style={{ color: '#fff' }} />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 2L11 13"/>
                              <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                            Submit Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Buyer Request List */}
          <div className="col-lg-11 col-12 mt-4" ref={buyerRequestListRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '4px',
                height: '24px',
                background: 'linear-gradient(180deg, #f0591f, #ff6b35)',
                borderRadius: '2px',
              }} />
              <Typography variant="h6" className="fw-semibold" style={{ color: theme.pureWhite, fontSize: '16px' }}>
                Your Requests
              </Typography>
              {requestClientList?.length > 0 && (
                <span style={{
                  ...styles.tag('rgba(240,89,31,0.1)', '#f0591f', '1px solid rgba(240,89,31,0.2)'),
                  fontSize: '12px',
                }}>
                  {requestClientList.length} total
                </span>
              )}
            </div>

           {isLoadingBuyerList ? (
              <div className="text-center py-5">
                <CircularProgress size={32} thickness={4} style={{ color: theme.primaryOrange }} />
                <Typography style={{ color: theme.mediumGrayTitle, fontSize: '13px', marginTop: '12px' }}>
                  Loading your requests...
                </Typography>
              </div>
            ) : requestClientList?.length > 0 ? (
              <div className="row g-3">
                {[...requestClientList].reverse().map((request, index) => {
                  
                  // 👇 API ERROR FIX: Yahan hum media ko string se array mein convert kar rahe hain (safely)
                  let mediaItems = [];
                  if (Array.isArray(request.media)) {
                    mediaItems = request.media;
                  } else if (typeof request.media === 'string') {
                    try {
                      mediaItems = JSON.parse(request.media);
                    } catch (e) {
                      console.error("Media parsing error:", e);
                    }
                  }

                  return (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className="gt-request-card p-3 rounded-3" onClick={() => {
                      // Modal state mein theek kiya hua media pass kar rahe hain
                      setSelectedRequest({ ...request, media: mediaItems });
                      setShowDetailModal(true);
                    }} style={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.lightBorder}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                    }}>
                      {/* Status Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{
                          ...styles.tag(
                            request.status === 'active' ? 'rgba(34,197,94,0.1)' : 
                            request.status === 'pending' ? 'rgba(245,158,11,0.1)' : 
                            'rgba(239,68,68,0.1)',
                            request.status === 'active' ? '#22c55e' : 
                            request.status === 'pending' ? '#f59e0b' : 
                            '#ef4444',
                            `1px solid ${
                              request.status === 'active' ? 'rgba(34,197,94,0.2)' : 
                              request.status === 'pending' ? 'rgba(245,158,11,0.2)' : 
                              'rgba(239,68,68,0.2)'
                            }`
                          ),
                          textTransform: 'capitalize',
                        }}>
                          {request.status || 'pending'}
                        </span>
                        <Typography style={{ color: theme.darkGrayNumber, fontSize: '11px' }}>
                          {request.created_at ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true }) : ''}
                        </Typography>
                      </div>

                      {/* Title */}
                      <Typography style={{ color: theme.pureWhite, fontSize: '14px', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                        {request.title || 'Untitled Request'}
                      </Typography>

                      {/* Description (truncated) */}
                      <Typography style={{ color: theme.bodyGrayText, fontSize: '12px', lineHeight: 1.5, marginBottom: '12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {request.description || 'No description provided.'}
                      </Typography>

                    {/* OUTER CARD MEDIA SECTION */}
{mediaItems && mediaItems.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
    {mediaItems.slice(0, 3).map((mediaUrl, mIdx) => {
      if (mIdx === 2 && mediaItems.length > 3) {
        return (
          <div key={mIdx} style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(240, 89, 31, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: theme.primaryOrange, border: '1px solid rgba(240, 89, 31, 0.2)' }}>
            +{mediaItems.length - 2}
          </div>
        );
      }
      return (
        <div
          key={mIdx}
          onClick={(e) => {
            e.stopPropagation(); // Card ka popup open hone se rokega
            setPreviewImage(mediaUrl); // 👇 Naye tab ki bajaye yahan image set kar di
          }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'zoom-in', // cursor change kar diya
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.primaryOrange}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <img
            src={mediaUrl}
            alt="attachment"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      );
    })}
  </div>
)}
                      {/* 👆 NAYA MEDIA SECTION KHATAM 👆 */}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${theme.lightBorder}` }}>
                        <Typography style={{ color: theme.primaryOrange, fontSize: '14px', fontWeight: 700 }}>
                          {request.price ? `$${request.price}` : 'N/A'}
                        </Typography>
                        <Typography style={{ color: theme.mediumGrayTitle, fontSize: '11px' }}>
                          {request.date || 'No deadline'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5" style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.lightBorder}`,
                borderRadius: '12px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(240,89,31,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0591f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <Typography style={{ color: theme.mediumGrayTitle, fontSize: '14px', fontWeight: 500 }}>
                  No requests yet
                </Typography>
                <Typography style={{ color: theme.bodyGrayText, fontSize: '12px', marginTop: '4px' }}>
                  Your posted requests will appear here.
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div style={styles.detailOverlay}>
          <div ref={detailModalRef} style={styles.detailModal}>
            {/* Close button */}
            <button
              type="button"
              onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: theme.mediumGrayTitle,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = theme.mediumGrayTitle; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Gradient accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #f0591f, #ff6b35, #f0591f)',
              borderRadius: '16px 16px 0 0',
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', marginTop: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(240,89,31,0.15), rgba(255,107,53,0.15))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0591f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div>
                <Typography variant="h6" style={{ color: theme.pureWhite, fontSize: '18px', fontWeight: 700, lineHeight: 1.3 }}>
                  {selectedRequest.title || 'Untitled Request'}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{
                    ...styles.tag(
                      selectedRequest.status === 'active' ? 'rgba(34,197,94,0.1)' : 
                      selectedRequest.status === 'pending' ? 'rgba(245,158,11,0.1)' : 
                      'rgba(239,68,68,0.1)',
                      selectedRequest.status === 'active' ? '#22c55e' : 
                      selectedRequest.status === 'pending' ? '#f59e0b' : 
                      '#ef4444',
                      `1px solid ${
                        selectedRequest.status === 'active' ? 'rgba(34,197,94,0.2)' : 
                        selectedRequest.status === 'pending' ? 'rgba(245,158,11,0.2)' : 
                        'rgba(239,68,68,0.2)'
                      }`
                    ),
                    textTransform: 'capitalize',
                    fontSize: '11px',
                  }}>
                    {selectedRequest.status || 'pending'}
                  </span>
                  <span style={{ color: theme.darkGrayNumber, fontSize: '11px' }}>
                    {selectedRequest.created_at ? formatDistanceToNow(new Date(selectedRequest.created_at), { addSuffix: true }) : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <Typography style={{ color: theme.mediumGrayTitle, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Description
              </Typography>
              <Typography style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {selectedRequest.description || 'No description provided.'}
              </Typography>
            </div>

            {/* 👇 YAHAN SE NAYA MEDIA SECTION ADD KAREIN 👇 */}
            {selectedRequest.media && Array.isArray(selectedRequest.media) && selectedRequest.media.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px',
              }}>
                <Typography style={{ color: theme.mediumGrayTitle, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Attached Media
                </Typography>
                
                {/* NAYA MEDIA SECTION JO DETAIL MODAL MEIN HAI */}
<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  {selectedRequest.media.map((mediaUrl, idx) => (
    <div 
      key={idx} 
      onClick={() => setPreviewImage(mediaUrl)} // 👇 Click karne par wahi popup khulega
      style={{ display: 'block' }}
    >
      <div 
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          cursor: 'zoom-in' // cursor change
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.transform = 'scale(1.05)'; 
          e.currentTarget.style.borderColor = theme.primaryOrange; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.transform = 'scale(1)'; 
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; 
        }}
      >
        <img
          src={mediaUrl}
          alt={`Attachment ${idx + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    </div>
  ))}
</div>
              </div>
            )}

            {/* 👆 NAYA MEDIA SECTION YAHAN KHATAM 👆 */}


            

            {/* Info Grid */}
            <div className="row g-3">
              {/* Budget */}
              <div className="col-6">
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  padding: '14px',
                }}>
                  <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Budget
                  </Typography>
                  <Typography style={{ color: theme.primaryOrange, fontSize: '20px', fontWeight: 700 }}>
                    {selectedRequest.price ? `$${selectedRequest.price}` : 'N/A'}
                  </Typography>
                </div>
              </div>

              {/* Deadline */}
              <div className="col-6">
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  padding: '14px',
                }}>
                  <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Deadline
                  </Typography>
                  <Typography style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 600 }}>
                    {selectedRequest.date || 'No deadline'}
                  </Typography>
                </div>
              </div>

              {/* Category */}
              {selectedRequest.category_name && (
                <div className="col-6">
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Category
                    </Typography>
                    <Typography style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500 }}>
                      {selectedRequest.category_name}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Subcategory */}
              {selectedRequest.sub_category_name && (
                <div className="col-6">
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Subcategory
                    </Typography>
                    <Typography style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500 }}>
                      {selectedRequest.sub_category_name}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Visibility */}
              {selectedRequest.visibility && (
                <div className="col-6">
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Visibility
                    </Typography>
                    <Typography style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
                      {selectedRequest.visibility}
                    </Typography>
                  </div>
                </div>
              )}

              {/* ID */}
              {selectedRequest.id && (
                <div className="col-6">
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <Typography style={{ color: theme.mediumGrayTitle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Request ID
                    </Typography>
                    <Typography style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500 }}>
                      #{selectedRequest.id}
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {/* Close button at bottom */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: theme.mediumGrayTitle,
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = theme.mediumGrayTitle; }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 📸 FULL SCREEN IMAGE PREVIEW MODAL 📸 */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)} // Background par click karne se band ho jayega
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            zIndex: 10000, // Sabse upar show karne ke liye
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(240,89,31,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ×
          </button>

          {/* Badi Image */}
          <img
            src={previewImage}
            alt="Full Preview"
            onClick={(e) => e.stopPropagation()} // Image par click karne se band na ho
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              cursor: 'default',
              animation: 'pulse 0.3s ease-out', // Thora sa smooth animation aayega
            }}
          />
        </div>
      )}

    </div>
  );
};

export default BuyerRequest;
