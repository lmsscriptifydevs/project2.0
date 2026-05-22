import Pusher from "pusher-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConversations, setSelectedConversation, setUserOnline } from "../../../redux/slices/messageSlice";
import ReadChat from "./ReadChat";
import UnRead from "./UnRead";
import axios from "../../../utils/axios";
import userFallback from "../../../assets/chatImg.webp";
import emptyProfile from "../../../assets/emptyProfileModal.webp";
import { useUserData } from "../../../utils/useLocalStorage";
import { Country, State, City } from "country-state-city";
import moment from "moment";

const UsersChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useUserData();
  const { conversations, selectedConversation, loading } = useSelector((state) => state.message);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("inboxTheme") || "dark");
  const [searchFocused, setSearchFocused] = useState(false);
  const [chatWallpaper, setChatWallpaper] = useState(() => localStorage.getItem("chatWallpaper") || "default");
  const wallpaperInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Settings Sub-pages Navigation state
  const [settingsSubPage, setSettingsSubPage] = useState(null); // null, "profile", "chats", "account", "privacy", "lists", "broadcasts", "notifications", "storage", "accessibility"

  // User Data State
  const [currentUserData, setCurrentUserData] = useState(() => {
    try {
      const item = localStorage.getItem("UserData");
      return item ? JSON.parse(item) : {};
    } catch {
      return {};
    }
  });

  // Settings States
  const [profileName, setProfileName] = useState("");
  const [profileStatus, setProfileStatus] = useState("Friday plans?");
  const [profilePhone, setProfilePhone] = useState("+92 300 1234567");

  // Sync current user data
  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      setCurrentUserData(currentUser);
      setProfileName(currentUser.fname || currentUser.name || "");
      setProfileStatus(currentUser.status || "Friday plans?");
      setProfilePhone(currentUser.phone || "+92 300 1234567");
    }
  }, [currentUser]);

  useEffect(() => {
    const handleUserDataChanged = (e) => {
      setCurrentUserData(e.detail);
      setProfileName(e.detail.fname || e.detail.name || "");
      setProfileStatus(e.detail.status || "Friday plans?");
      setProfilePhone(e.detail.phone || "+92 300 1234567");
    };
    window.addEventListener("userDataChanged", handleUserDataChanged);
    return () => window.removeEventListener("userDataChanged", handleUserDataChanged);
  }, []);

  const updateProfileData = (updatedFields) => {
    try {
      const currentUserStr = localStorage.getItem("UserData");
      const currentVal = currentUserStr ? JSON.parse(currentUserStr) : {};
      const updated = { ...currentVal, ...updatedFields };
      if (updatedFields.name) updated.fname = updatedFields.name;
      if (updatedFields.fname) updated.name = updatedFields.fname;
      localStorage.setItem("UserData", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("userDataChanged", { detail: updated }));
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      updateProfileData({ image: base64Url });
    };
    reader.readAsDataURL(file);
  };

  // Profile Edit Toggles
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Modal Overlays
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Account settings
  const [securityNotificationsEnabled, setSecurityNotificationsEnabled] = useState(
    () => localStorage.getItem("securityNotificationsEnabled") === "true"
  );

  // Dynamic Profile Update States
  const [profileFname, setProfileFname] = useState("");
  const [profileLname, setProfileLname] = useState("");
  const [profileFormPhone, setProfileFormPhone] = useState("");
  const [profileCountry, setProfileCountry] = useState("");
  const [profileState, setProfileState] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profilePostalCode, setProfilePostalCode] = useState("");
  const [profileLevel, setProfileLevel] = useState("Intermediate");
  const [profilePrimaryGoal, setProfilePrimaryGoal] = useState("Freelance");
  const [profileOccupation, setProfileOccupation] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");
  const [profileSkills, setProfileSkills] = useState([]);
  const [profileEducations, setProfileEducations] = useState([]);
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [skillInputText, setSkillInputText] = useState("");

  // Fetch complete profile and onboarding data when entering the Account page
  useEffect(() => {
    if (settingsSubPage === "account") {
      setIsLoadingProfileData(true);
      axios.get("/get-user-onboarding")
        .then((res) => {
          if (res.data && res.data.status && res.data.data) {
            const data = res.data.data;
            const profile = data.profile || {};
            const extra = data.extra_details || {};
            
            setProfileFname(profile.fname || "");
            setProfileLname(profile.lname || "");
            setProfileFormPhone(profile.phone || "");
            setProfileCountry(profile.country || "");
            setProfileState(profile.state || "");
            setProfileCity(profile.city || "");
            setProfilePostalCode(profile.postalCode || "");
            setProfileLevel(profile.level || "Intermediate");
            setProfileBio(profile.bio || "");
            
            setProfilePrimaryGoal(extra.primary_goal || "Freelance");
            setProfileOccupation(extra.occupation || "");
            setProfileWebsite(extra.personal_website || "");
            
            setProfileSkills(data.skills || []);
            setProfileEducations(data.educations || []);
          }
        })
        .catch((err) => {
          console.error("Error fetching onboarding details:", err);
        })
        .finally(() => {
          setIsLoadingProfileData(false);
        });
    }
  }, [settingsSubPage]);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInputText.trim()) {
      e.preventDefault();
      const newSkill = skillInputText.trim();
      if (!profileSkills.find(s => s.skill.toLowerCase() === newSkill.toLowerCase())) {
        setProfileSkills([...profileSkills, { skill: newSkill, level: "Intermediate" }]);
      }
      setSkillInputText("");
    }
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    setProfileEducations([...profileEducations, { institution: "", degree: "", passing_year: "" }]);
  };

  const handleRemoveEducation = (index) => {
    setProfileEducations(profileEducations.filter((_, idx) => idx !== index));
  };

  const handleEducationChange = (index, key, value) => {
    const updated = [...profileEducations];
    updated[index][key] = value;
    setProfileEducations(updated);
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileFname || !profileLname) {
      alert("First name and Last name are required.");
      return;
    }
    
    setIsSubmittingProfile(true);
    try {
      const payload = {
        fname: profileFname,
        lname: profileLname,
        phone: profileFormPhone,
        country: profileCountry,
        state: profileState,
        city: profileCity,
        postalCode: profilePostalCode,
        level: profileLevel,
        primary_goal: profilePrimaryGoal,
        occupation: profileOccupation,
        bio: profileBio,
        personal_website: profileWebsite,
        skills: profileSkills,
        educations: profileEducations,
        image: currentUserData?.image || "",
      };

      const res = await axios.post("/submit-full-onboarding", payload);
      if (res.data && res.data.status) {
        const updatedUser = res.data.data;
        updateProfileData(updatedUser);
        alert("Profile updated successfully!");
      } else {
        alert(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        alert(errors[firstErrorKey][0]);
      } else {
        alert(err.response?.data?.message || "An error occurred while updating your profile.");
      }
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Privacy settings
  const [disappearingMessages, setDisappearingMessages] = useState(
    () => localStorage.getItem("disappearingMessages") || "off"
  );
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("blockedUsers");
      return saved ? JSON.parse(saved) : ["John Doe", "Jane Smith"];
    } catch {
      return ["John Doe", "Jane Smith"];
    }
  });
  const [newBlockContactId, setNewBlockContactId] = useState("");

  // Broadcast settings
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);

  // Notification settings
  const [conversationTones, setConversationTones] = useState(
    () => localStorage.getItem("conversationTones") !== "false"
  );
  const [highPriorityNotifications, setHighPriorityNotifications] = useState(
    () => localStorage.getItem("highPriorityNotifications") !== "false"
  );

  // Storage and Data settings
  const [networkUsage, setNetworkUsage] = useState(() => {
    try {
      const saved = localStorage.getItem("networkUsageBytes");
      return saved ? JSON.parse(saved) : { sent: 4529023000, received: 13743895000 };
    } catch {
      return { sent: 4529023000, received: 13743895000 };
    }
  });
  const [autoDownload, setAutoDownload] = useState(() => {
    try {
      const saved = localStorage.getItem("autoDownloadPrefs");
      return saved ? JSON.parse(saved) : { photos: true, audio: false, videos: false, documents: true };
    } catch {
      return { photos: true, audio: false, videos: false, documents: true };
    }
  });

  // Accessibility settings
  const [chatFontSize, setChatFontSizeState] = useState(
    () => localStorage.getItem("chatFontSize") || "medium"
  );

  // Handle wallpaper upload
  const handleWallpaperUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      localStorage.setItem("chatWallpaper", "custom");
      localStorage.setItem("customWallpaperUrl", imageUrl);
      setChatWallpaper("custom");
      window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { detail: "custom" }));
    };
    reader.readAsDataURL(file);
  };

  // Listen for wallpaper changes
  useEffect(() => {
    const handleWallpaperChange = (e) => {
      setChatWallpaper(e.detail);
    };
    window.addEventListener('chatWallpaperChanged', handleWallpaperChange);
    return () => window.removeEventListener('chatWallpaperChanged', handleWallpaperChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("inboxTheme", newTheme);
    window.dispatchEvent(new CustomEvent('inboxThemeChanged', { detail: newTheme }));
  };

  useEffect(() => {
    const handleThemeChange = (e) => setThemeMode(e.detail);
    window.addEventListener('inboxThemeChanged', handleThemeChange);
    return () => window.removeEventListener('inboxThemeChanged', handleThemeChange);
  }, []);

  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(setUserOnline());
    const pusher = new Pusher("9f595c24255fa4029398", { cluster: "mt1", encrypted: true });
    const channel = pusher.subscribe("global-status");
    channel.bind("App\\Events\\UserOnline", (data) => setOnlineUsers(p => ({ ...p, [data.user_id]: true })));
    channel.bind("App\\Events\\UserOffline", (data) => setOnlineUsers(p => ({ ...p, [data.user_id]: false })));
    return () => { pusher.unsubscribe("global-status"); pusher.disconnect(); };
  }, [dispatch]);

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setOnlineUsers(prev => {
        const updated = { ...prev };
        let changed = false;
        conversations.forEach((conv) => {
          if (conv.user && conv.user.id) {
            const userId = conv.user.id;
            if (updated[userId] === undefined) {
              const lastSeen = conv.user.last_seen;
              if (lastSeen) {
                const lastSeenMoment = lastSeen.includes('Z') || lastSeen.includes('+')
                  ? moment(lastSeen)
                  : moment.utc(lastSeen);
                const diffMinutes = Math.abs(moment().diff(lastSeenMoment, 'minutes'));
                if (diffMinutes < 5) {
                  updated[userId] = true;
                  changed = true;
                } else {
                  updated[userId] = false;
                  changed = true;
                }
              } else {
                updated[userId] = false;
                changed = true;
              }
            }
          }
        });
        return changed ? updated : prev;
      });
    }
  }, [conversations]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "updates" | "communities" | "calls" | "profile"
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
  const [showMyStatusesModal, setShowMyStatusesModal] = useState(false); // My statuses list modal
  const [activeStatusUser, setActiveStatusUser] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const statusTimerRef = useRef(null);
  const STATUS_DURATION = 5000; // 5 seconds per status
  
  // Profile tab state
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
    requests: 0
  });
  const [profileSubTab, setProfileSubTab] = useState("overview"); // "overview" | "followers" | "following" | "requests"
  
  // Reset status index when opening new user
  useEffect(() => {
    if (activeStatusUser) {
      setCurrentStatusIndex(0);
      setProgress(0);
      setIsPaused(false);
    }
  }, [activeStatusUser]);
  
  // Auto-progress timer for status viewer
  useEffect(() => {
    if (activeStatusUser && !isPaused) {
      const startTime = Date.now();
      const startProgress = progress;
      
      statusTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = startProgress + (elapsed / STATUS_DURATION) * 100;
        
        if (newProgress >= 100) {
          // Go to next status
          if (currentStatusIndex < activeStatusUser.statuses.length - 1) {
            setCurrentStatusIndex(currentStatusIndex + 1);
            setProgress(0);
          } else {
            // Close viewer when all statuses seen
            setActiveStatusUser(null);
          }
        } else {
          setProgress(newProgress);
        }
      }, 50);
      
      return () => clearInterval(statusTimerRef.current);
    }
  }, [activeStatusUser, currentStatusIndex, isPaused, progress]);

  const [statusText, setStatusText] = useState("");
  const [statusBg, setStatusBg] = useState("linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)");
  const [statusMedia, setStatusMedia] = useState(null); // { type: 'image'|'video', url: string, file: File }
  const [statusMediaPreview, setStatusMediaPreview] = useState(null);
  const statusFileInputRef = useRef(null);
  const statusCameraInputRef = useRef(null);
  const [activeCallMeeting, setActiveCallMeeting] = useState(null);
  const [activeCallRoom, setActiveCallRoom] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const iframeLoadCount = useRef(0);
  const [securityWarningText, setSecurityWarningText] = useState("");
  
  // Speech recognition ref for security monitoring
  const callRecognitionRef = useRef(null);

  const [generatedMeetingLink, setGeneratedMeetingLink] = useState("");
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meetingParam = params.get("meeting");
    if (meetingParam) {
      // Check if user is logged in (check for token)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      
      if (!token || !currentUser) {
        // User not logged in - save meeting ID and redirect to login
        sessionStorage.setItem('pendingMeetingId', meetingParam);
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
        return;
      }
      
      // User is logged in - show meeting
      setActiveCallMeeting({
        id: meetingParam,
        name: "GrapeTask Meeting Room",
        type: "video",
        direction: "incoming",
        time: "Just now"
      });
      
      // Add to user's meetings if not already there
      const savedMeetings = localStorage.getItem('grapetask_meetings');
      const meetings = savedMeetings ? JSON.parse(savedMeetings) : [];
      if (!meetings.find(m => m.id === meetingParam)) {
        const joinedMeeting = {
          id: meetingParam,
          name: "Joined Meeting",
          type: "video",
          direction: "incoming",
          time: "Just now",
          createdBy: 'other',
          status: 'active',
          link: window.location.href
        };
        const updatedMeetings = [joinedMeeting, ...meetings];
        localStorage.setItem('grapetask_meetings', JSON.stringify(updatedMeetings));
        setUserMeetings(updatedMeetings);
      }
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // MiroTalk iframe loading effect
  useEffect(() => {
    if (activeCallMeeting || activeCallRoom) {
      iframeLoadCount.current = 0;
      setShowIframe(false);
      // Show iframe after 2 seconds (loading animation)
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, 2000);
      
      // Start speech recognition for security monitoring
      startCallSecurityMonitoring();
      
      return () => {
        clearTimeout(timer);
        stopCallSecurityMonitoring();
      };
    } else {
      setShowIframe(false);
      stopCallSecurityMonitoring();
    }
  }, [activeCallMeeting, activeCallRoom]);
  
  // ── Call Security Monitoring (Speech Recognition) ─────────────────────────────
  const startCallSecurityMonitoring = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log("Speech recognition not supported");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      
      if (transcript?.trim()) {
        const violation = detectPersonalInfo(transcript);
        
        if (violation) {
          // Send flag to admin (silently fail if API not available)
          try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            fetch('/api/call-flags', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                meeting_id: activeCallMeeting?.id || activeCallRoom,
                transcript: transcript,
                violation_type: violation,
                timestamp: new Date().toISOString()
              })
            }).catch(() => {
              // Silently ignore API errors (backend not ready)
            });
          } catch {
            // Ignore fetch errors
          }
          
          // End call and show warning
          setActiveCallMeeting(null);
          setActiveCallRoom(null);
          setShowIframe(false);
          setSecurityWarningText(`Your ongoing video call has been terminated because our system detected that you were sharing "${violation}" details. This is a severe violation of GrapeTask safety policies. Your account has been flagged, and a security audit report has been submitted to the administration. Repeating this violation will lead to an immediate and permanent account suspension.`);
        }
      }
    };
    
    recognition.onerror = (e) => {
      // Completely silent - ignore all errors (no-speech, aborted, network, etc.)
      // These are normal during call monitoring
      return;
    };
    
    recognition.onend = () => {
      // Restart if call still active
      if (activeCallMeeting || activeCallRoom) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            // Silently ignore restart errors
          }
        }, 1000);
      }
    };
    
    try {
      recognition.start();
      callRecognitionRef.current = recognition;
    } catch (err) {
      // Silently ignore start errors
    }
  };
  
  const stopCallSecurityMonitoring = () => {
    if (callRecognitionRef.current) {
      try {
        callRecognitionRef.current.stop();
      } catch (err) {
        // Silently ignore
      }
      callRecognitionRef.current = null;
    }
  };
  
  // ── Personal Info Detection Function ────────────────────────────────────────
  const detectPersonalInfo = (text) => {
    if (!text) return null;
    
    const cleanText = text.toLowerCase().trim();
    
    // Forbidden keywords check
    const platforms = [
      { name: "WhatsApp", keywords: ['whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me'] },
      { name: "Telegram", keywords: ['telegram', 'tg.me'] },
      { name: "Skype", keywords: ['skype'] },
      { name: "Imo", keywords: ['imo'] },
      { name: "Viber", keywords: ['viber'] },
      { name: "WeChat", keywords: ['wechat'] },
      { name: "Discord", keywords: ['discord'] },
      { name: "Instagram", keywords: ['instagram', 'insta'] },
      { name: "Snapchat", keywords: ['snapchat', 'snap'] },
      { name: "Direct Contact / Phone", keywords: ['phone number', 'mobile number', 'contact number', 'phone no', 'mobile no', 'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe', 'call me', 'contact me on', 'baat karein', 'direct client'] }
    ];
    
    for (const platform of platforms) {
      for (const keyword of platform.keywords) {
        if (cleanText.includes(keyword)) {
          return platform.name;
        }
      }
    }
    
    // Phone number detection (7+ digits)
    const digitsOnly = cleanText.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) {
      return "Phone/Contact Number";
    }
    
    return null;
  };

  const handleCreateMeetingLink = () => {
    const meetId = "meet-" + Math.random().toString(36).substring(2, 10);
    const link = window.location.origin + window.location.pathname + "?meeting=" + meetId;
    
    // Save meeting to user's list
    const newMeeting = {
      id: meetId,
      name: "My GrapeTask Meeting",
      type: "video",
      direction: "outgoing",
      time: "Just now",
      createdBy: 'you',
      status: 'active',
      link: link
    };
    saveMeeting(newMeeting);
    
    setGeneratedMeetingLink(link);
    setShowMeetingLinkModal(true);
  };

  // Load custom status updates from localStorage (filter expired)
  const [myStatuses, setMyStatuses] = useState(() => {
    try {
      const saved = localStorage.getItem("myStatuses");
      if (saved) {
        const allStatuses = JSON.parse(saved);
        const now = new Date();
        // Filter out expired statuses (older than 12 hours)
        return allStatuses.filter(s => new Date(s.expiresAt) > now);
      }
      return [];
    } catch {
      return [];
    }
  });

  const saveStatus = async (text, bg) => {
    // Build status object with 12 hours expiry
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
    
    const newStatus = {
      id: "status-" + Date.now(),
      text: text || "",
      bg,
      time: "Just now",
      createdAt: now.toISOString(),
      expiresAt: expiryTime.toISOString(),
      type: statusMedia?.type || 'text',
      mediaUrl: statusMedia?.url || null,
      views: [], // Array of user IDs who viewed
    };
    
    // If has media, upload to server first (mock for now, save to localStorage)
    if (statusMedia?.file) {
      // TODO: Upload to server /api/statuses/upload
      // For now, create blob URL
      newStatus.mediaUrl = URL.createObjectURL(statusMedia.file);
    }
    
    // Update my statuses
    const updated = [newStatus, ...myStatuses];
    setMyStatuses(updated);
    localStorage.setItem("myStatuses", JSON.stringify(updated));
    
    // Also add to all statuses (for others to see)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const publicStatus = {
      userId: currentUser.id || 'current-user',
      userName: currentUser.fname || currentUser.name || 'You',
      userRole: currentUser.role || 'client',
      userImage: currentUser.image || null,
      statuses: [newStatus]
    };
    
    const allUpdated = [publicStatus, ...allStatuses.filter(s => s.userId !== publicStatus.userId)];
    setAllStatuses(allUpdated);
    localStorage.setItem('grapetask_statuses', JSON.stringify(allUpdated));
    
    // Reset states
    setStatusText("");
    setStatusMedia(null);
    setStatusMediaPreview(null);
    setShowCreateStatusModal(false);
  };
  
  const handleStatusMediaSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const url = URL.createObjectURL(file);
    
    setStatusMedia({ type, url, file });
    setStatusMediaPreview(url);
  };
  
  const clearStatusMedia = () => {
    setStatusMedia(null);
    setStatusMediaPreview(null);
  };

  // Delete own status function
  const deleteStatus = (statusId) => {
    const updated = myStatuses.filter(s => s.id !== statusId);
    setMyStatuses(updated);
    localStorage.setItem("myStatuses", JSON.stringify(updated));
    
    // Also update allStatuses if visible there
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const allUpdated = allStatuses.map(u => {
      if (u.userId === (currentUser.id || 'current-user')) {
        return { ...u, statuses: u.statuses.filter(s => s.id !== statusId) };
      }
      return u;
    }).filter(u => u.statuses.length > 0);
    setAllStatuses(allUpdated);
    localStorage.setItem('grapetask_statuses', JSON.stringify(allUpdated));
  };

  // ── REAL STATUS SYSTEM ────────────────────────────────────────────────────
  // All statuses from server (real data)
  const [allStatuses, setAllStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  
  // User role from localStorage/currentUser
  const currentUserRole = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
    return user.role || 'client';
  }, []);
  
  // Fetch all statuses from server
  useEffect(() => {
    fetchStatuses();
  }, []);
  
  const fetchStatuses = async () => {
    setLoadingStatuses(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/statuses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const now = new Date();
        // Filter expired statuses (12 hours)
        const validStatuses = (data.statuses || []).map(userStatus => ({
          ...userStatus,
          statuses: userStatus.statuses.filter(s => new Date(s.expiresAt) > now)
        })).filter(u => u.statuses.length > 0);
        setAllStatuses(validStatuses);
      }
    } catch (err) {
      // Fallback: use localStorage if API not available
      const saved = localStorage.getItem('grapetask_statuses');
      if (saved) {
        const all = JSON.parse(saved);
        const now = new Date();
        // Filter expired
        const valid = all.map(u => ({
          ...u,
          statuses: u.statuses.filter(s => new Date(s.expiresAt) > now)
        })).filter(u => u.statuses.length > 0);
        setAllStatuses(valid);
      }
    } finally {
      setLoadingStatuses(false);
    }
  };
  
  // Role-based status filtering
  const filteredStatuses = useMemo(() => {
    return allStatuses.filter(userStatus => {
      const statusRole = userStatus.userRole || 'client';
      const currentRole = currentUserRole.toLowerCase();
      
      // Role-based viewing rules:
      // Client → Can see BD statuses
      // BD → Can see BD, Expert statuses
      // Expert → Can see BD, Expert statuses
      
      if (currentRole === 'client') {
        return statusRole === 'bd' || statusRole === 'admin';
      }
      if (currentRole === 'bd') {
        return statusRole === 'bd' || statusRole === 'expert' || statusRole === 'admin';
      }
      if (currentRole === 'expert') {
        return statusRole === 'bd' || statusRole === 'expert' || statusRole === 'admin';
      }
      return true;
    });
  }, [allStatuses, currentUserRole]);

  // Real meetings state (created or joined by user)
  const [userMeetings, setUserMeetings] = useState([]);
  
  // Load user's meetings from localStorage
  useEffect(() => {
    const savedMeetings = localStorage.getItem('grapetask_meetings');
    if (savedMeetings) {
      try {
        setUserMeetings(JSON.parse(savedMeetings));
      } catch (e) {
        console.error('Error loading meetings:', e);
      }
    }
  }, []);
  
  // Save meetings to localStorage
  const saveMeeting = (meeting) => {
    const updatedMeetings = [meeting, ...userMeetings.filter(m => m.id !== meeting.id)];
    setUserMeetings(updatedMeetings);
    localStorage.setItem('grapetask_meetings', JSON.stringify(updatedMeetings));
  };

  // Auto-close status updates viewer after 5 seconds
  useEffect(() => {
    if (activeStatusUser) {
      const timer = setTimeout(() => {
        setActiveStatusUser(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeStatusUser]);

  // Fetch follow stats
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const fetchFollowStats = async () => {
      try {
        // Mock follow stats since backend follow system is not implemented yet
        setFollowStats({
          followers: 0,
          following: 0,
          requests: 0
        });
      } catch (err) {
        console.log("Follow stats fetch failed");
      }
    };

    fetchFollowStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchFollowStats, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Inject a mock active order group if none exist, so the Communities tab remains alive and functional
  const injectedConversations = useMemo(() => {
    if (!conversations) return [];
    const hasCommunity = conversations.some(conv => conv.is_group && (conv.title?.toLowerCase().includes("order") || conv.title?.toLowerCase().includes("job")));
    if (!hasCommunity) {
      return [
        ...conversations,
        {
          id: "mock-order-group",
          is_group: true,
          title: "Active Order #GT-84920 (Logo Design)",
          unread_count: 1,
          last_message: {
            id: "msg-mock-1",
            sender_id: "system",
            message: "Active Order group initialized. Share project files here.",
            created_at: new Date().toISOString(),
            read: false,
          }
        }
      ];
    }
    return conversations;
  }, [conversations]);

  const isCommunityConversation = (conv) => {
    return conv.is_group && (
      conv.title?.toLowerCase().includes("order") || 
      conv.title?.toLowerCase().includes("job") || 
      conv.order_id || 
      conv.type === "order"
    );
  };

  // Check if any community conversation has unread messages
  const hasUnreadCommunity = useMemo(() => {
    return injectedConversations.some(conv => isCommunityConversation(conv) && (conv.unread_count > 0 || conv.unreadCount > 0));
  }, [injectedConversations]);

  const chatsList = useMemo(() => {
    return injectedConversations.filter(conv => !isCommunityConversation(conv));
  }, [injectedConversations]);

  const communitiesList = useMemo(() => {
    return injectedConversations.filter(conv => isCommunityConversation(conv));
  }, [injectedConversations]);

  const filteredChats = useMemo(() => {
    return chatsList.filter((conv) => {
      const name = conv.is_group ? conv.title : (conv.user?.fname || conv.user?.name || "");
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === "unread") {
        const unreadCount = conv.unread_count ?? conv.unreadCount ?? 0;
        return unreadCount > 0;
      }
      if (activeFilter === "favorites") {
        // Check if conversation is marked as favorite
        return conv.is_favorite || conv.favorite || false;
      }
      if (activeFilter === "groups") {
        return conv.is_group;
      }
      return true;
    });
  }, [chatsList, searchQuery, activeFilter]);

  const filteredCommunities = useMemo(() => {
    return communitiesList.filter((conv) => {
      const name = conv.title || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [communitiesList, searchQuery]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      backgroundColor: "var(--wa-panel)",
      position: "relative" 
    }}>

      {/* ── WHATSAPP HEADER ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 16px 8px",
        backgroundColor: "var(--wa-panel)",
        flexShrink: 0,
      }}>
        {/* Logo Title */}
        <span style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "var(--wa-green)",
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px"
        }}>
          GrapeTask
        </span>

        {/* Action Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative" }}>
          {/* Menu Dots Dropdown Trigger */}
          <button 
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--wa-icon)", padding: 0, position: "relative" }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>

            {/* Dropdown Box */}
            {showSettingsDropdown && (
              <div style={{
                position: "absolute",
                top: "30px",
                right: "0",
                backgroundColor: "var(--wa-panel)",
                border: "1px solid var(--wa-divider)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                width: "160px",
                zIndex: 100,
                padding: "4px 0",
                textAlign: "left",
              }}>
                <div 
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowSettingsDropdown(false);
                  }}
                  style={{ padding: "10px 16px", color: "var(--wa-text-primary)", fontSize: "14px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--wa-panel-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  ⚙️ Settings
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ padding: "8px 16px", flexShrink: 0, backgroundColor: "var(--wa-panel)" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--wa-input-bg, #f0f2f5)",
          borderRadius: "24px",
          padding: "8px 16px",
          gap: "10px",
        }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--wa-text-muted)">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder={activeTab === "chats" ? "Search" : "Search updates, calls or groups..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "var(--wa-text-primary)", fontSize: "15px",
            }}
          />
        </div>
      </div>

      {/* ── FILTER PILLS (Only for Chats Tab) ── */}
      {activeTab === "chats" && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px 12px",
          overflowX: "auto",
          backgroundColor: "var(--wa-panel)",
          flexShrink: 0
        }}>
          {["all", "unread", "favorites", "groups"].map((filter) => {
            const isActive = activeFilter === filter;
            const label = filter.charAt(0).toUpperCase() + filter.slice(1);
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: isActive 
                    ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "#d8f3e5")
                    : (themeMode === "dark" ? "#142030" : "#f0f2f5"),
                  color: isActive
                    ? (themeMode === "dark" ? "#F0591F" : "#128C7E")
                    : (themeMode === "dark" ? "#A8BCCE" : "#54656F"),
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </button>
            );
          })}
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "50%",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              border: "none",
              backgroundColor: themeMode === "dark" ? "#142030" : "#f0f2f5",
              color: themeMode === "dark" ? "#A8BCCE" : "#54656F",
            }}
          >
            +
          </button>
        </div>
      )}

      {/* ── TABS RENDERING ── */}

      {/* 1. CHATS TAB */}
      {activeTab === "chats" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px",
                border: "3px solid var(--wa-divider)",
                borderTopColor: "var(--wa-green)",
                borderRadius: "50%",
                animation: "wa-spin 0.8s linear infinite",
              }} />
              <span style={{ color: "var(--wa-text-muted)", fontSize: "13px" }}>Loading chats...</span>
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "8px" }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="var(--wa-divider)">
                <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"/>
              </svg>
              <p style={{ color: "var(--wa-text-muted)", fontSize: "14px", margin: 0 }}>No conversations found</p>
            </div>
          ) : (
            filteredChats.map((conv) => {
              const unreadCount = conv.unread_count ?? conv.unreadCount ?? 0;
              const Component = unreadCount > 0 ? UnRead : ReadChat;
              return (
                <Component
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  isOnline={onlineUsers[conv.user?.id] || false}
                />
              );
            })
          )}
        </div>
      )}

      {/* 2. UPDATES / STATUS TAB */}
      {activeTab === "updates" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          {/* My Status Item */}
          <div 
            onClick={() => {
              if (myStatuses.length > 0) {
                setActiveStatusUser({ userName: "My Status", statuses: myStatuses });
              } else {
                setShowCreateStatusModal(true);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              cursor: "pointer",
              borderBottom: "1px solid var(--wa-divider)",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--wa-panel-hover)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{ position: "relative", marginRight: "14px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                padding: "2px",
                border: myStatuses.length > 0 
                  ? "2px solid var(--wa-green)" 
                  : "2px dashed var(--wa-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img 
                  src={currentUserData?.image || userFallback} 
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
                  alt="My Avatar"
                  onError={e => e.target.src = userFallback}
                />
              </div>
              {myStatuses.length === 0 && (
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "var(--wa-green)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}>
                  +
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "600" }}>My Status</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--wa-text-muted)" }}>
                {myStatuses.length > 0 ? "Tap to view updates" : "Tap to add status update"}
              </p>
            </div>
            {myStatuses.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMyStatusesModal(true);
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer", color: "var(--wa-text-muted)", fontSize: "20px", padding: "8px"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
              </button>
            )}
          </div>

          {/* Recent Statuses Section */}
          <div style={{ padding: "16px 16px 8px", fontSize: "14px", color: "var(--wa-green)", fontWeight: "600" }}>
            Recent updates
          </div>

          {loadingStatuses ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--wa-text-muted)" }}>
              <p>Loading statuses...</p>
            </div>
          ) : filteredStatuses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--wa-text-muted)" }}>
              <p style={{ fontSize: "15px" }}>No status updates available</p>
              <p style={{ fontSize: "13px", opacity: 0.7, marginTop: "8px" }}>
                {currentUserRole === 'client' ? 'BD status updates will appear here' : 
                 currentUserRole === 'bd' ? 'Expert and BD updates will appear here' : 
                 'Expert and BD updates will appear here'}
              </p>
            </div>
          ) : (
            filteredStatuses.map((st) => (
            <div 
              key={st.userId}
              onClick={() => setActiveStatusUser(st)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--wa-panel-hover)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                padding: "2px",
                border: "2px solid var(--wa-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "14px",
              }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "var(--wa-divider)",
                  color: "var(--wa-text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}>
                  {st.userName.charAt(0)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "600" }}>{st.userName}</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--wa-text-muted)" }}>
                  {st.statuses[st.statuses.length - 1].time}
                </p>
              </div>
            </div>
          )))}
        </div>
      )}

      {/* 3. COMMUNITIES TAB */}
      {activeTab === "communities" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          {/* Active Job Discussions Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "var(--wa-input-bg, #f0f2f5)",
            margin: "12px 16px",
            borderRadius: "12px",
            gap: "12px",
          }}>
            <span style={{ fontSize: "28px" }}>👥</span>
            <div>
              <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-text-primary)", fontWeight: "600" }}>Active Order Groups</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--wa-text-second)" }}>Discussions and deliverables for running jobs.</p>
            </div>
          </div>

          {filteredCommunities.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
              <p style={{ color: "var(--wa-text-muted)", fontSize: "14px", margin: 0 }}>No active order groups found</p>
            </div>
          ) : (
            filteredCommunities.map((conv) => {
              const unreadCount = conv.unread_count ?? conv.unreadCount ?? 0;
              const Component = unreadCount > 0 ? UnRead : ReadChat;
              return (
                <Component
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  isOnline={onlineUsers[conv.user?.id] || false}
                />
              );
            })
          )}
        </div>
      )}

      {/* 4. MEETINGS TAB */}
      {activeTab === "calls" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          {/* Create Meeting Link Item */}
          <div 
            onClick={handleCreateMeetingLink}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              cursor: "pointer",
              borderBottom: "1px solid var(--wa-divider)",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--wa-panel-hover)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--wa-green)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "14px",
              fontSize: "20px",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)"
            }}>
              🔗
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "600" }}>Create meeting link</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--wa-text-second)", lineHeight: "1.4" }}>
                Share a link for your GrapeTask meeting. You can send this meeting link to outsiders. They must have a GrapeTask account to join.
              </p>
            </div>
          </div>

          <div style={{ padding: "16px 16px 8px", fontSize: "14px", color: "var(--wa-green)", fontWeight: "600" }}>
            Recent
          </div>

          {/* User's Real Meetings List */}
          {userMeetings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--wa-text-muted)" }}>
              <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📹</span>
              <p style={{ fontSize: "15px", margin: 0 }}>No meetings yet</p>
              <p style={{ fontSize: "13px", marginTop: "8px", opacity: 0.7 }}>Create a meeting link to start</p>
            </div>
          ) : (
            userMeetings.map((meeting) => (
              <div 
                key={meeting.id}
                onClick={() => setActiveCallMeeting(meeting)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--wa-panel-hover)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: meeting.status === 'active' ? "rgba(34, 197, 94, 0.1)" : "var(--wa-input-bg, #f0f2f5)",
                  color: meeting.status === 'active' ? "#22C55E" : "var(--wa-text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "14px",
                  fontSize: "20px",
                }}>
                  {meeting.status === 'active' ? '�' : '��'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "600" }}>
                    {meeting.name || "GrapeTask Meeting"}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <span style={{ fontSize: "13px", color: "var(--wa-text-muted)" }}>
                      {meeting.createdBy === 'you' ? 'You created • ' : 'You joined • '}
                      {meeting.time}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCallMeeting(meeting);
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer", color: "var(--wa-green)", padding: "8px"
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. PROFILE TAB */}
      {activeTab === "profile" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "var(--wa-bg)" }}>
          {/* User Profile Card */}
          <div style={{
            backgroundColor: "var(--wa-panel-bg, var(--wa-panel))",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            textAlign: "center",
            border: "1px solid var(--wa-divider, #e2e8f0)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <img
              src={currentUserData?.image || emptyProfile}
              alt="Profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "12px",
                border: "3px solid var(--wa-green, #00A884)"
              }}
            />
            <h3 style={{ margin: "0 0 4px 0", color: "var(--wa-text-primary)", fontSize: "18px", fontWeight: 600 }}>
              {currentUserData?.fname || currentUserData?.name} {currentUserData?.lname || ""}
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "var(--wa-text-secondary)", fontSize: "14px" }}>
              {currentUserData?.role || currentUser?.role || "User"}
            </p>
            
            {/* Follow Stats - Navigate to /followers page on click */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginBottom: "16px"
            }}>
              <div 
                onClick={() => navigate("/followers", { state: { activeTab: "followers" } })}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--wa-text-primary)" }}>
                  {followStats.followers}
                </div>
                <div style={{ fontSize: "12px", color: "var(--wa-text-secondary)" }}>Followers</div>
              </div>
              <div 
                onClick={() => navigate("/followers", { state: { activeTab: "following" } })}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--wa-text-primary)" }}>
                  {followStats.following}
                </div>
                <div style={{ fontSize: "12px", color: "var(--wa-text-secondary)" }}>Following</div>
              </div>
              {followStats.requests > 0 && (
                <div 
                  onClick={() => setProfileSubTab("requests")}
                  style={{ cursor: "pointer", textAlign: "center", position: "relative" }}
                >
                  <div style={{ 
                    fontSize: "20px", 
                    fontWeight: "bold", 
                    color: "#FF6B6B" 
                  }}>
                    {followStats.requests}
                  </div>
                  <div style={{ fontSize: "12px", color: "#FF6B6B" }}>Requests</div>
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-8px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#FF6B6B"
                  }} />
                </div>
              )}
            </div>
            
            {/* Profile Sub-tabs - Only Overview and Requests */}
            <div style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {[
                { id: "overview", label: "Overview" },
                { id: "requests", label: `Requests (${followStats.requests})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProfileSubTab(tab.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: profileSubTab === tab.id ? "var(--wa-green, #00A884)" : "transparent",
                    color: profileSubTab === tab.id ? "#fff" : "var(--wa-text-secondary)",
                    border: `1px solid ${profileSubTab === tab.id ? "var(--wa-green, #00A884)" : "var(--wa-divider, #e2e8f0)"}`,
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Profile Sub-tab Content */}
          {profileSubTab === "overview" && (
            <div style={{
              backgroundColor: "var(--wa-panel-bg, var(--wa-panel))",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid var(--wa-divider, #e2e8f0)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--wa-text-primary)" }}>Profile Info</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wa-text-secondary)" }}>Email</span>
                  <span style={{ color: "var(--wa-text-primary)" }}>{currentUser?.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wa-text-secondary)" }}>Role</span>
                  <span style={{ color: "var(--wa-text-primary)" }}>{currentUser?.role}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wa-text-secondary)" }}>Status</span>
                  <span style={{ color: "var(--wa-green, #00A884)" }}>● Online</span>
                </div>
              </div>
            </div>
          )}
          
          {profileSubTab === "requests" && (
            <div style={{ 
              textAlign: "center", 
              padding: "40px",
              backgroundColor: "var(--wa-panel-bg, var(--wa-panel))",
              borderRadius: "16px",
              border: "1px solid var(--wa-divider, #e2e8f0)"
            }}>
              {followStats.requests > 0 ? (
                <>
                  <p style={{ color: "#FF6B6B", fontWeight: "bold" }}>
                    You have {followStats.requests} follow request(s)!
                  </p>
                  <button
                    onClick={() => navigate("/followers")}
                    style={{
                      marginTop: "16px",
                      padding: "10px 20px",
                      backgroundColor: "#FF6B6B",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    View Requests
                  </button>
                </>
              ) : (
                <p style={{ color: "var(--wa-text-secondary)" }}>No follow requests</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 0 12px",
        backgroundColor: "var(--wa-panel)",
        borderTop: "1px solid var(--wa-divider)",
        flexShrink: 0,
      }}>
        {/* Chats Tab button */}
        <div 
          onClick={() => setActiveTab("chats")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          <div style={{
            backgroundColor: activeTab === "chats"
              ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "rgba(240, 89, 31, 0.15)")
              : "transparent",
            padding: "4px 18px",
            borderRadius: "16px",
            color: activeTab === "chats" ? "var(--wa-green)" : "var(--wa-icon)"
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </div>
          <span style={{ fontSize: "12px", fontWeight: activeTab === "chats" ? "600" : "500", color: activeTab === "chats" ? "var(--wa-text-primary)" : "var(--wa-text-second)" }}>Chats</span>
        </div>

        {/* Updates Tab button */}
        <div 
          onClick={() => setActiveTab("updates")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          <div style={{
            backgroundColor: activeTab === "updates"
              ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "rgba(240, 89, 31, 0.15)")
              : "transparent",
            padding: "4px 18px",
            borderRadius: "16px",
            color: activeTab === "updates" ? "var(--wa-green)" : "var(--wa-icon)"
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <span style={{ fontSize: "12px", fontWeight: activeTab === "updates" ? "600" : "500", color: activeTab === "updates" ? "var(--wa-text-primary)" : "var(--wa-text-second)" }}>Updates</span>
        </div>

        {/* Communities Tab button */}
        <div 
          onClick={() => setActiveTab("communities")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", position: "relative" }}
        >
          {/* Unread Community dot badge */}
          {hasUnreadCommunity && activeTab !== "communities" && (
            <span style={{
              position: "absolute",
              top: "2px",
              right: "26px",
              width: "10px",
              height: "10px",
              backgroundColor: "#22C55E",
              borderRadius: "50%",
              border: "2px solid var(--wa-panel)",
              zIndex: 10,
            }} />
          )}
          <div style={{
            backgroundColor: activeTab === "communities"
              ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "rgba(240, 89, 31, 0.15)")
              : "transparent",
            padding: "4px 18px",
            borderRadius: "16px",
            color: activeTab === "communities" ? "var(--wa-green)" : "var(--wa-icon)"
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <span style={{ fontSize: "12px", fontWeight: activeTab === "communities" ? "600" : "500", color: activeTab === "communities" ? "var(--wa-text-primary)" : "var(--wa-text-second)" }}>Group</span>
        </div>

        {/* Meetings Tab button */}
        <div 
          onClick={() => setActiveTab("calls")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          <div style={{
            backgroundColor: activeTab === "calls"
              ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "rgba(240, 89, 31, 0.15)")
              : "transparent",
            padding: "4px 18px",
            borderRadius: "16px",
            color: activeTab === "calls" ? "var(--wa-green)" : "var(--wa-icon)"
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.56-.45-1.04-1-1.04z"/>
            </svg>
          </div>
          <span style={{ fontSize: "12px", fontWeight: activeTab === "calls" ? "600" : "500", color: activeTab === "calls" ? "var(--wa-text-primary)" : "var(--wa-text-second)" }}>Meetings</span>
        </div>

        {/* Profile Tab button */}
        <div 
          onClick={() => setActiveTab("profile")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", position: "relative" }}
        >
          {/* Follow Request Notification Badge */}
          {followStats.requests > 0 && activeTab !== "profile" && (
            <span style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#FF6B6B",
              color: "#fff",
              fontSize: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
            }}>
              {followStats.requests > 9 ? "9+" : followStats.requests}
            </span>
          )}
          <div style={{
            backgroundColor: activeTab === "profile"
              ? (themeMode === "dark" ? "rgba(240, 89, 31, 0.2)" : "rgba(240, 89, 31, 0.15)")
              : "transparent",
            padding: "4px 18px",
            borderRadius: "16px",
            color: activeTab === "profile" ? "var(--wa-green)" : "var(--wa-icon)"
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span style={{ fontSize: "12px", fontWeight: activeTab === "profile" ? "600" : "500", color: activeTab === "profile" ? "var(--wa-text-primary)" : "var(--wa-text-second)" }}>Profile</span>
        </div>
      </div>

      {/* ── SETTINGS MODAL ── */}
      {showSettingsModal && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "var(--wa-panel)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
        }}>
          <style>{`
            .settings-option-tile {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 14px 16px;
              cursor: pointer;
              transition: background 0.2s ease;
            }
            .settings-option-tile:hover {
              background-color: var(--wa-panel-hover);
            }
            .settings-switch {
              position: relative;
              display: inline-block;
              width: 40px;
              height: 20px;
            }
            .settings-switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }
            .settings-slider {
              position: absolute;
              cursor: pointer;
              top: 0; left: 0; right: 0; bottom: 0;
              background-color: #555;
              transition: .3s;
              border-radius: 20px;
            }
            .settings-slider:before {
              position: absolute;
              content: "";
              height: 14px;
              width: 14px;
              left: 3px;
              bottom: 3px;
              background-color: white;
              transition: .3s;
              border-radius: 50%;
            }
            input:checked + .settings-slider {
              background-color: var(--wa-green, #22C55E);
            }
            input:checked + .settings-slider:before {
              transform: translateX(20px);
            }
            .settings-btn-primary {
              background-color: var(--wa-green, #22C55E);
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s ease;
            }
            .settings-btn-primary:hover {
              opacity: 0.9;
            }
            .settings-btn-secondary {
              background: none;
              border: 1px solid var(--wa-divider);
              color: var(--wa-text-primary);
              padding: 8px 16px;
              border-radius: 8px;
              cursor: pointer;
            }
            .settings-input {
              width: 100%;
              padding: 8px 12px;
              background-color: var(--wa-surface-bg, rgba(255,255,255,0.05));
              border: 1px solid var(--wa-divider);
              border-radius: 8px;
              color: var(--wa-text-primary);
              outline: none;
            }
            .settings-input:focus {
              border-color: var(--wa-green, #22C55E);
            }
            .profile-edit-section {
              margin-top: 16px;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .profile-edit-label {
              font-size: 12px;
              color: var(--wa-green, #22C55E);
              font-weight: 600;
              margin-bottom: 6px;
              display: block;
            }
            .profile-edit-input {
              width: 100%;
              padding: 10px 12px;
              background-color: var(--wa-panel-hover, rgba(255,255,255,0.05));
              border: 1px solid var(--wa-divider, #e2e8f0);
              border-radius: 8px;
              color: var(--wa-text-primary, #fff);
              outline: none;
              font-size: 14px;
              transition: border-color 0.2s;
            }
            .profile-edit-input:focus {
              border-color: var(--wa-green, #22C55E);
            }
            .profile-edit-textarea {
              width: 100%;
              padding: 10px 12px;
              background-color: var(--wa-panel-hover, rgba(255,255,255,0.05));
              border: 1px solid var(--wa-divider, #e2e8f0);
              border-radius: 8px;
              color: var(--wa-text-primary, #fff);
              outline: none;
              font-size: 14px;
              resize: vertical;
              min-height: 80px;
              transition: border-color 0.2s;
            }
            .profile-edit-textarea:focus {
              border-color: var(--wa-green, #22C55E);
            }
            .profile-edit-select {
              width: 100%;
              padding: 10px 12px;
              background-color: var(--wa-panel-hover, rgba(255,255,255,0.05));
              border: 1px solid var(--wa-divider, #e2e8f0);
              border-radius: 8px;
              color: var(--wa-text-primary, #fff);
              outline: none;
              font-size: 14px;
              cursor: pointer;
            }
            .profile-edit-select option {
              background-color: var(--wa-panel, #0f172a);
              color: var(--wa-text-primary, #fff);
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            .skill-tag {
              background-color: rgba(34, 197, 94, 0.15);
              color: var(--wa-green, #00A884);
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 12px;
              display: flex;
              align-items: center;
              gap: 6px;
              border: 1px solid rgba(34, 197, 94, 0.3);
            }
            .skill-remove-btn {
              background: none;
              border: none;
              color: #EF4444;
              cursor: pointer;
              font-weight: bold;
              font-size: 12px;
              padding: 0;
            }
            .education-card {
              background-color: var(--wa-panel-hover, rgba(255,255,255,0.02));
              border: 1px solid var(--wa-divider, #e2e8f0);
              border-radius: 12px;
              padding: 14px;
              position: relative;
              margin-bottom: 12px;
            }
            .education-delete-btn {
              position: absolute;
              top: 10px;
              right: 10px;
              background: none;
              border: none;
              color: #EF4444;
              cursor: pointer;
              font-size: 14px;
            }
          `}</style>

          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />

          <input
            type="file"
            accept="image/*"
            ref={wallpaperInputRef}
            onChange={handleWallpaperUpload}
            style={{ display: "none" }}
          />

          {/* Settings Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid var(--wa-divider)",
            gap: "16px",
            backgroundColor: "var(--wa-panel)",
          }}>
            <button 
              onClick={() => {
                if (settingsSubPage) {
                  setSettingsSubPage(null);
                } else {
                  setShowSettingsModal(false);
                }
              }}
              style={{ background: "none", border: "none", color: "var(--wa-icon)", cursor: "pointer", fontSize: "20px" }}
            >
              ←
            </button>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--wa-text-primary)" }}>
              {settingsSubPage ? settingsSubPage.charAt(0).toUpperCase() + settingsSubPage.slice(1) : "Settings"}
            </span>
          </div>

          {/* Settings Content Area */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {settingsSubPage === null && (
              <>
                {/* Profile Summary Header */}
                <div 
                  onClick={() => setSettingsSubPage("profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "20px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--wa-divider)",
                    backgroundColor: "var(--wa-panel-hover)",
                    position: "relative"
                  }}
                >
                  {/* Avatar Picker Hover */}
                  <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden" }}>
                    <img 
                      src={currentUserData?.image || userFallback} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      alt="Avatar" 
                      onError={e => e.target.src = userFallback} 
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "var(--wa-text-primary)" }}>
                      {currentUserData?.fname || currentUserData?.name || "GrapeTask User"}
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--wa-green, #22C55E)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>😊</span> {profileStatus}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                    {/* QR Code Button */}
                    <button 
                      onClick={() => setShowQRCodeModal(true)}
                      style={{ background: "none", border: "none", color: "var(--wa-green, #22C55E)", cursor: "pointer", padding: "4px" }}
                      title="Show QR Code"
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13 1h3v2h-3v-2zm-3-3h3v3h-3v-3zm3 3v3h-3v-3h3zm-3-3h-2v-2h2v2zm4-4h2v2h-2V8zm-2 7h2v2h-2v-2zm-3-2h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 1v2h-2v-2h2zm1-3h2v2h-2v-2zm-5-3h2v2h-2v-2z" />
                      </svg>
                    </button>
                    {/* Invite Button */}
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      style={{
                        background: "var(--wa-green, #22C55E)",
                        border: "none",
                        color: "white",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold"
                      }}
                      title="Invite Friend"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Settings Option List */}
                <div style={{ padding: "8px 0" }}>
                  {/* Account */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("account")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>🔑</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Account</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Security notifications, change number</div>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("privacy")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>🔒</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Privacy</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Blocked accounts, disappearing messages</div>
                    </div>
                  </div>

                  {/* Lists */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("lists")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>📋</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Lists</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Manage people and groups</div>
                    </div>
                  </div>

                  {/* Chats */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("chats")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>💬</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Chats</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Theme, wallpapers, chat history</div>
                    </div>
                  </div>

                  {/* Broadcasts */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("broadcasts")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>📣</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Broadcasts</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Manage lists and send broadcasts</div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("notifications")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>🔔</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Notifications</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Message, group & call tones</div>
                    </div>
                  </div>

                  {/* Storage & Data */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("storage")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>🔄</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Storage and data</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Network usage, auto-download</div>
                    </div>
                  </div>

                  {/* Accessibility */}
                  <div className="settings-option-tile" onClick={() => setSettingsSubPage("accessibility")}>
                    <div style={{ color: "var(--wa-icon)", fontSize: "20px" }}>🌐</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Accessibility</div>
                      <div style={{ fontSize: "12px", color: "var(--wa-text-second)", marginTop: "2px" }}>Chat font scale</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Profile Subpage */}
            {settingsSubPage === "profile" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Center Avatar Upload */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div 
                    onClick={() => avatarInputRef.current.click()}
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      border: "3px solid var(--wa-green, #22C55E)"
                    }}
                  >
                    <img 
                      src={currentUserData?.image || userFallback} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      alt="Profile Avatar"
                      onError={e => e.target.src = userFallback} 
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      fontSize: "11px",
                      textAlign: "center",
                      padding: "4px 0",
                      fontWeight: "500"
                    }}>
                      CHANGE PHOTO
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--wa-text-second)" }}>Tap photo to upload new avatar</span>
                </div>

                {/* Edit Name Block */}
                <div style={{ borderBottom: "1px solid var(--wa-divider)", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Your Name</span>
                    {!isEditingName && (
                      <button 
                        onClick={() => setIsEditingName(true)}
                        style={{ background: "none", border: "none", color: "var(--wa-icon)", cursor: "pointer", fontSize: "16px" }}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                  {isEditingName ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={e => setProfileName(e.target.value)}
                        className="settings-input"
                        placeholder="Enter name"
                      />
                      <button 
                        onClick={() => {
                          updateProfileData({ name: profileName, fname: profileName });
                          setIsEditingName(false);
                        }}
                        className="settings-btn-primary"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "500" }}>
                      {currentUserData?.fname || currentUserData?.name || "GrapeTask User"}
                    </div>
                  )}
                  <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "var(--wa-text-second)" }}>
                    This name will be visible to your GrapeTask contacts.
                  </p>
                </div>

                {/* Edit Status Block */}
                <div style={{ borderBottom: "1px solid var(--wa-divider)", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>About / Status</span>
                    {!isEditingStatus && (
                      <button 
                        onClick={() => setIsEditingStatus(true)}
                        style={{ background: "none", border: "none", color: "var(--wa-icon)", cursor: "pointer", fontSize: "16px" }}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                  {isEditingStatus ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        value={profileStatus} 
                        onChange={e => setProfileStatus(e.target.value)}
                        className="settings-input"
                        placeholder="Enter status"
                      />
                      <button 
                        onClick={() => {
                          updateProfileData({ status: profileStatus });
                          setIsEditingStatus(false);
                        }}
                        className="settings-btn-primary"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "500" }}>
                      {profileStatus}
                    </div>
                  )}
                </div>

                {/* Edit Phone Block */}
                <div style={{ borderBottom: "1px solid var(--wa-divider)", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Phone Number</span>
                    {!isEditingPhone && (
                      <button 
                        onClick={() => setIsEditingPhone(true)}
                        style={{ background: "none", border: "none", color: "var(--wa-icon)", cursor: "pointer", fontSize: "16px" }}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                  {isEditingPhone ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        value={profilePhone} 
                        onChange={e => setProfilePhone(e.target.value)}
                        className="settings-input"
                        placeholder="Enter phone"
                      />
                      <button 
                        onClick={() => {
                          updateProfileData({ phone: profilePhone });
                          setIsEditingPhone(false);
                        }}
                        className="settings-btn-primary"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "15px", color: "var(--wa-text-primary)", fontWeight: "500" }}>
                      {profilePhone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Subpage */}
            {settingsSubPage === "account" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Security notifications toggle */}
                <div style={{ borderBottom: "1px solid var(--wa-divider)", paddingBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Security notifications</span>
                    <label className="settings-switch">
                      <input 
                        type="checkbox" 
                        checked={securityNotificationsEnabled} 
                        onChange={e => {
                          const val = e.target.checked;
                          setSecurityNotificationsEnabled(val);
                          localStorage.setItem("securityNotificationsEnabled", String(val));
                        }}
                      />
                      <span className="settings-slider"></span>
                    </label>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--wa-text-second)" }}>
                    Get notified when security keys or settings change.
                  </p>
                </div>

                {/* Dynamic Update Profile Form */}
                <div>
                  <h4 style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Update Profile</h4>
                  
                  {isLoadingProfileData ? (
                    <div style={{ textAlign: "center", padding: "20px", color: "var(--wa-text-second)" }}>
                      Loading profile details...
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfileSubmit} className="profile-edit-section">
                      {/* Basic Fields (For all roles: client, expert, bd) */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label className="profile-edit-label">First Name</label>
                          <input 
                            type="text" 
                            value={profileFname}
                            onChange={e => setProfileFname(e.target.value)}
                            placeholder="John"
                            className="profile-edit-input"
                            required
                          />
                        </div>
                        <div>
                          <label className="profile-edit-label">Last Name</label>
                          <input 
                            type="text" 
                            value={profileLname}
                            onChange={e => setProfileLname(e.target.value)}
                            placeholder="Doe"
                            className="profile-edit-input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="profile-edit-label">Phone Number</label>
                        <input 
                          type="text" 
                          value={profileFormPhone}
                          onChange={e => setProfileFormPhone(e.target.value)}
                          placeholder="e.g. +92 300 1234567"
                          className="profile-edit-input"
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label className="profile-edit-label">Country</label>
                          <input 
                            type="text" 
                            value={profileCountry}
                            onChange={e => {
                              setProfileCountry(e.target.value);
                              setProfileState("");
                              setProfileCity("");
                            }}
                            placeholder="Pakistan"
                            className="profile-edit-input"
                            list="profile-country-list"
                          />
                          <datalist id="profile-country-list">
                            {Country.getAllCountries().map(c => <option key={c.isoCode} value={c.name} />)}
                          </datalist>
                        </div>
                        <div>
                          <label className="profile-edit-label">State / Province</label>
                          <input 
                            type="text" 
                            value={profileState}
                            onChange={e => {
                              setProfileState(e.target.value);
                              setProfileCity("");
                            }}
                            placeholder="Sindh"
                            className="profile-edit-input"
                            list="profile-state-list"
                          />
                          <datalist id="profile-state-list">
                            {(() => {
                              const foundCountry = Country.getAllCountries().find(c => c.name.toLowerCase() === profileCountry.toLowerCase());
                              const statesList = foundCountry ? State.getStatesOfCountry(foundCountry.isoCode) : [];
                              return statesList.map(s => <option key={`${s.isoCode}-${s.name}`} value={s.name} />);
                            })()}
                          </datalist>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label className="profile-edit-label">City</label>
                          <input 
                            type="text" 
                            value={profileCity}
                            onChange={e => setProfileCity(e.target.value)}
                            placeholder="Karachi"
                            className="profile-edit-input"
                            list="profile-city-list"
                          />
                          <datalist id="profile-city-list">
                            {(() => {
                              const foundCountry = Country.getAllCountries().find(c => c.name.toLowerCase() === profileCountry.toLowerCase());
                              const statesList = foundCountry ? State.getStatesOfCountry(foundCountry.isoCode) : [];
                              const foundState = statesList.find(s => s.name.toLowerCase() === profileState.toLowerCase());
                              const citiesList = foundCountry && foundState ? City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode) : [];
                              return citiesList.map((c, i) => <option key={`${c.name}-${i}`} value={c.name} />);
                            })()}
                          </datalist>
                        </div>
                        <div>
                          <label className="profile-edit-label">Postal / Zip Code</label>
                          <input 
                            type="text" 
                            value={profilePostalCode}
                            onChange={e => setProfilePostalCode(e.target.value)}
                            placeholder="75300"
                            className="profile-edit-input"
                          />
                        </div>
                      </div>

                      {/* Professional Info (For Expert and BD roles) */}
                      {(() => {
                        const userRole = (currentUserData?.role || localStorage.getItem("Role") || "client").toLowerCase();
                        const isBd = userRole.includes("bd") || userRole.includes("business") || userRole.includes("bidder") || userRole.includes("middleman") || userRole.includes("representative");
                        const isExpert = userRole.includes("expert") || userRole.includes("freelancer") || userRole.includes("developer") || userRole.includes("designer") || userRole.includes("consultant");
                        if (isBd || isExpert) {
                          return (
                            <>
                              <div style={{ borderTop: "1px solid var(--wa-divider)", paddingTop: "16px", marginTop: "8px" }}>
                                <label className="profile-edit-label">Experience Level</label>
                                <select 
                                  value={profileLevel} 
                                  onChange={e => setProfileLevel(e.target.value)}
                                  className="profile-edit-select"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Expert">Expert / Senior</option>
                                </select>
                              </div>

                              <div>
                                <label className="profile-edit-label">Primary Goal</label>
                                <select 
                                  value={profilePrimaryGoal} 
                                  onChange={e => setProfilePrimaryGoal(e.target.value)}
                                  className="profile-edit-select"
                                >
                                  <option value="Full-time">Full-time Income</option>
                                  <option value="Freelance">Side Income</option>
                                </select>
                              </div>

                              <div>
                                <label className="profile-edit-label">Professional Headline</label>
                                <input 
                                  type="text" 
                                  value={profileOccupation}
                                  onChange={e => setProfileOccupation(e.target.value)}
                                  placeholder="e.g. Senior Frontend Developer | React Expert"
                                  className="profile-edit-input"
                                />
                              </div>

                              <div>
                                <label className="profile-edit-label">About You (Bio)</label>
                                <textarea 
                                  value={profileBio}
                                  onChange={e => setProfileBio(e.target.value)}
                                  placeholder="Briefly describe your expertise..."
                                  className="profile-edit-textarea"
                                  rows="4"
                                  maxLength="500"
                                />
                                <div style={{ fontSize: "11px", textAlign: "right", marginTop: "4px", color: "var(--wa-text-second)" }}>
                                  {profileBio.length} / 500
                                </div>
                              </div>

                              <div>
                                <label className="profile-edit-label">Portfolio / Website Link</label>
                                <input 
                                  type="url" 
                                  value={profileWebsite}
                                  onChange={e => setProfileWebsite(e.target.value)}
                                  placeholder="https://www.myportfolio.com"
                                  className="profile-edit-input"
                                />
                              </div>

                              {/* Skills */}
                              <div>
                                <label className="profile-edit-label">Skills (Press Enter to Add)</label>
                                <input 
                                  type="text" 
                                  value={skillInputText}
                                  onChange={e => setSkillInputText(e.target.value)}
                                  onKeyDown={handleSkillKeyDown}
                                  placeholder="Add skill and press Enter"
                                  className="profile-edit-input"
                                />
                                <div className="skills-container">
                                  {profileSkills.map((s, idx) => (
                                    <span key={idx} className="skill-tag">
                                      {s.skill}
                                      <button 
                                        type="button" 
                                        onClick={() => setProfileSkills(profileSkills.filter((_, i) => i !== idx))}
                                        className="skill-remove-btn"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Educations */}
                              <div>
                                <label className="profile-edit-label">Education History</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                  {profileEducations.map((edu, idx) => (
                                    <div key={idx} className="education-card">
                                      <button 
                                        type="button" 
                                        onClick={() => handleRemoveEducation(idx)}
                                        className="education-delete-btn"
                                        title="Delete Education"
                                      >
                                        🗑️
                                      </button>
                                      <div style={{ marginBottom: "8px" }}>
                                        <input 
                                          type="text" 
                                          value={edu.institution}
                                          onChange={e => handleEducationChange(idx, "institution", e.target.value)}
                                          placeholder="School / University"
                                          className="profile-edit-input"
                                          style={{ padding: "8px", fontSize: "13px" }}
                                          required
                                        />
                                      </div>
                                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                        <input 
                                          type="text" 
                                          value={edu.degree}
                                          onChange={e => handleEducationChange(idx, "degree", e.target.value)}
                                          placeholder="Degree (e.g. BSCS)"
                                          className="profile-edit-input"
                                          style={{ padding: "8px", fontSize: "13px" }}
                                          required
                                        />
                                        <input 
                                          type="text" 
                                          value={edu.passing_year}
                                          onChange={e => handleEducationChange(idx, "passing_year", e.target.value)}
                                          placeholder="Graduation Year (e.g. 2026)"
                                          className="profile-edit-input"
                                          style={{ padding: "8px", fontSize: "13px" }}
                                          required
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <button 
                                    type="button" 
                                    onClick={handleAddEducation}
                                    style={{
                                      width: "100%",
                                      padding: "10px",
                                      background: "none",
                                      border: "1px dashed var(--wa-divider)",
                                      borderRadius: "8px",
                                      color: "var(--wa-green, #00A884)",
                                      cursor: "pointer",
                                      fontSize: "13px",
                                      fontWeight: 500
                                    }}
                                  >
                                    + Add Education
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        }
                        return null;
                      })()}

                      <button 
                        type="submit"
                        className="settings-btn-primary"
                        style={{ marginTop: "12px", width: "100%", padding: "12px", fontSize: "15px" }}
                        disabled={isSubmittingProfile}
                      >
                        {isSubmittingProfile ? "Saving Changes..." : "Update Profile"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Subpage */}
            {settingsSubPage === "privacy" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Disappearing Messages selection */}
                <div style={{ borderBottom: "1px solid var(--wa-divider)", paddingBottom: "20px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--wa-green, #22C55E)", display: "block", marginBottom: "8px" }}>Disappearing messages</label>
                  <select 
                    value={disappearingMessages}
                    onChange={e => {
                      const val = e.target.value;
                      setDisappearingMessages(val);
                      localStorage.setItem("disappearingMessages", val);
                    }}
                    className="settings-input"
                    style={{ background: "var(--wa-panel-hover)" }}
                  >
                    <option value="off">Off</option>
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                    <option value="90d">90 days</option>
                  </select>
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--wa-text-second)" }}>
                    Make new messages disappear from selected chats after set time.
                  </p>
                </div>

                {/* Blocked Users manager */}
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--wa-green, #22C55E)", display: "block", marginBottom: "12px" }}>Blocked accounts</label>
                  
                  {/* Add Block Dropdown */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <select 
                      value={newBlockContactId}
                      onChange={e => setNewBlockContactId(e.target.value)}
                      className="settings-input"
                      style={{ background: "var(--wa-panel-hover)" }}
                    >
                      <option value="">Select contact to block...</option>
                      {conversations && conversations.map((conv) => {
                        const targetUser = conv.participants?.find((p) => String(p.id) !== String(currentUserData.id));
                        if (!targetUser) return null;
                        const userName = targetUser.fname || targetUser.name || "User";
                        if (blockedUsers.includes(userName)) return null;
                        return (
                          <option key={targetUser.id} value={userName}>
                            {userName}
                          </option>
                        );
                      })}
                    </select>
                    <button 
                      onClick={() => {
                        if (!newBlockContactId) return;
                        const updated = [...blockedUsers, newBlockContactId];
                        setBlockedUsers(updated);
                        localStorage.setItem("blockedUsers", JSON.stringify(updated));
                        setNewBlockContactId("");
                      }}
                      className="settings-btn-primary"
                    >
                      Block
                    </button>
                  </div>

                  {/* Blocked Users List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {blockedUsers.length === 0 ? (
                      <span style={{ fontSize: "13px", color: "var(--wa-text-second)" }}>No blocked accounts.</span>
                    ) : (
                      blockedUsers.map((user, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            backgroundColor: "var(--wa-panel-hover)",
                            borderRadius: "8px"
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "var(--wa-text-primary)" }}>{user}</span>
                          <button 
                            onClick={() => {
                              const updated = blockedUsers.filter((u) => u !== user);
                              setBlockedUsers(updated);
                              localStorage.setItem("blockedUsers", JSON.stringify(updated));
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#EF4444",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600"
                            }}
                          >
                            Unblock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lists Subpage */}
            {settingsSubPage === "lists" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Your Active Contacts</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {conversations && conversations.map((conv) => {
                    const targetUser = conv.participants?.find((p) => String(p.id) !== String(currentUserData.id));
                    if (!targetUser) return null;
                    return (
                      <div 
                        key={conv.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px",
                          backgroundColor: "var(--wa-panel-hover)",
                          borderRadius: "8px"
                        }}
                      >
                        <img 
                          src={targetUser.image || userFallback}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                          alt={targetUser.fname}
                          onError={e => e.target.src = userFallback}
                        />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--wa-text-primary)" }}>
                            {targetUser.fname || targetUser.name || "User"}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--wa-text-second)" }}>
                            {targetUser.role || "Expert"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chats Subpage */}
            {settingsSubPage === "chats" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Theme toggler */}
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>App Theme & Styling</h4>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => { if (themeMode !== "light") toggleTheme(); }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: themeMode === "light" ? "2px solid var(--wa-green)" : "1px solid var(--wa-divider)",
                        backgroundColor: themeMode === "light" ? "rgba(34, 197, 94, 0.15)" : "transparent",
                        color: "var(--wa-text-primary)",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      ☀️ Light Theme
                    </button>
                    <button
                      onClick={() => { if (themeMode !== "dark") toggleTheme(); }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: themeMode === "dark" ? "2px solid var(--wa-green)" : "1px solid var(--wa-divider)",
                        backgroundColor: themeMode === "dark" ? "rgba(34, 197, 94, 0.15)" : "transparent",
                        color: "var(--wa-text-primary)",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      🌙 Dark Theme
                    </button>
                  </div>
                </div>

                {/* Wallpaper Section */}
                <div style={{ borderTop: "1px solid var(--wa-divider)", paddingTop: "20px" }}>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>
                    🖼️ Chat Wallpaper
                  </h4>
                  <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "var(--wa-text-second)" }}>
                    Choose a wallpaper for your chat background
                  </p>
                  
                  {/* Wallpaper Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    marginBottom: "16px"
                  }}>
                    {[
                      { id: "default", name: "Default", color: "#e5ddd5" },
                      { id: "dark", name: "Dark", color: "#0f1419" },
                      { id: "blue", name: "Blue", color: "#e3f2fd" },
                      { id: "green", name: "Green", color: "#e8f5e9" },
                      { id: "purple", name: "Purple", color: "#f3e5f5" },
                      { id: "pink", name: "Pink", color: "#fce4ec" },
                      { id: "orange", name: "Orange", color: "#fff3e0" },
                      { id: "gray", name: "Gray", color: "#f5f5f5" },
                    ].map((wallpaper) => (
                      <button
                        key={wallpaper.id}
                        onClick={() => {
                          localStorage.setItem("chatWallpaper", wallpaper.id);
                          window.dispatchEvent(new CustomEvent('chatWallpaperChanged', { detail: wallpaper.id }));
                          setChatWallpaper(wallpaper.id);
                        }}
                        style={{
                          padding: "0",
                          backgroundColor: wallpaper.color,
                          border: chatWallpaper === wallpaper.id ? "3px solid var(--wa-green)" : "2px solid transparent",
                          borderRadius: "12px",
                          cursor: "pointer",
                          aspectRatio: "1",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: chatWallpaper === wallpaper.id ? "0 2px 8px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                      >
                        {chatWallpaper === wallpaper.id && (
                          <span style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "16px",
                            color: wallpaper.id === "dark" ? "#fff" : "#000"
                          }}>
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Wallpaper Upload */}
                  <button
                    onClick={() => wallpaperInputRef.current?.click()}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--wa-surface)",
                      border: "2px dashed var(--wa-divider)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      color: "var(--wa-text-primary)",
                      fontSize: "14px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    📷 Upload Custom Wallpaper
                  </button>
                </div>

                {/* History Toggles */}
                <div style={{ borderTop: "1px solid var(--wa-divider)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Chat Options</h4>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all chat histories? This is a simulation.")) {
                        alert("Chats cleared successfully!");
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "transparent",
                      border: "1px solid #EF4444",
                      color: "#EF4444",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    Clear All Chats
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete all chat histories? This is a simulation.")) {
                        alert("All chats deleted successfully!");
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#EF4444",
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    Delete All Chats
                  </button>
                </div>
              </div>
            )}

            {/* Broadcasts Subpage */}
            {settingsSubPage === "broadcasts" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Send Broadcast Message</h4>
                
                {/* Select Recipients */}
                <div>
                  <label style={{ fontSize: "12px", color: "var(--wa-text-second)", display: "block", marginBottom: "8px" }}>Select Recipients (All default)</label>
                  <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--wa-divider)", borderRadius: "8px", padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {conversations && conversations.map((conv) => {
                      const targetUser = conv.participants?.find((p) => String(p.id) !== String(currentUserData.id));
                      if (!targetUser) return null;
                      return (
                        <label key={conv.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--wa-text-primary)" }}>
                          <input type="checkbox" defaultChecked />
                          {targetUser.fname || targetUser.name || "User"}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message input */}
                <div>
                  <label style={{ fontSize: "12px", color: "var(--wa-text-second)", display: "block", marginBottom: "4px" }}>Broadcast Message</label>
                  <textarea 
                    value={broadcastText}
                    onChange={e => setBroadcastText(e.target.value)}
                    className="settings-input"
                    rows="4"
                    placeholder="Type broadcast message here..."
                    style={{ resize: "none" }}
                  />
                </div>

                <button 
                  onClick={() => {
                    if (!broadcastText) {
                      alert("Please type a message first.");
                      return;
                    }
                    setBroadcastSending(true);
                    setTimeout(() => {
                      setBroadcastSending(false);
                      setBroadcastText("");
                      alert("Broadcast message sent successfully to all recipients!");
                      setSettingsSubPage(null);
                    }, 1500);
                  }}
                  className="settings-btn-primary"
                  disabled={broadcastSending}
                >
                  {broadcastSending ? "Sending Broadcast..." : "Send Broadcast"}
                </button>
              </div>
            )}

            {/* Notifications Subpage */}
            {settingsSubPage === "notifications" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Notification Settings</h4>
                
                {/* Conversation tones */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--wa-text-primary)" }}>Conversation tones</div>
                    <div style={{ fontSize: "11px", color: "var(--wa-text-second)", marginTop: "2px" }}>Play sounds for incoming and outgoing messages.</div>
                  </div>
                  <label className="settings-switch">
                    <input 
                      type="checkbox" 
                      checked={conversationTones}
                      onChange={e => {
                        const val = e.target.checked;
                        setConversationTones(val);
                        localStorage.setItem("conversationTones", String(val));
                      }}
                    />
                    <span className="settings-slider"></span>
                  </label>
                </div>

                {/* High Priority Alerts */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--wa-text-primary)" }}>High priority notifications</div>
                    <div style={{ fontSize: "11px", color: "var(--wa-text-second)", marginTop: "2px" }}>Show previews of notifications at the top of the screen.</div>
                  </div>
                  <label className="settings-switch">
                    <input 
                      type="checkbox" 
                      checked={highPriorityNotifications}
                      onChange={e => {
                        const val = e.target.checked;
                        setHighPriorityNotifications(val);
                        localStorage.setItem("highPriorityNotifications", String(val));
                      }}
                    />
                    <span className="settings-slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Storage and Data Subpage */}
            {settingsSubPage === "storage" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Usage metrics */}
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Network Usage</h4>
                  <div style={{ backgroundColor: "var(--wa-panel-hover)", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "var(--wa-text-second)" }}>Bytes Sent:</span>
                      <span style={{ color: "var(--wa-text-primary)", fontWeight: "500" }}>{(networkUsage.sent / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "var(--wa-text-second)" }}>Bytes Received:</span>
                      <span style={{ color: "var(--wa-text-primary)", fontWeight: "500" }}>{(networkUsage.received / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                    </div>
                    <button 
                      onClick={() => {
                        const cleared = { sent: 0, received: 0 };
                        setNetworkUsage(cleared);
                        localStorage.setItem("networkUsageBytes", JSON.stringify(cleared));
                        alert("Network usage stats reset!");
                      }}
                      style={{
                        marginTop: "8px",
                        padding: "8px",
                        backgroundColor: "transparent",
                        border: "1px solid var(--wa-divider)",
                        color: "var(--wa-text-primary)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Reset Statistics
                    </button>
                  </div>
                </div>

                {/* Auto-download preferences */}
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Media Auto-Download</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["photos", "audio", "videos", "documents"].map((type) => (
                      <label key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
                        <span style={{ textTransform: "capitalize", color: "var(--wa-text-primary)" }}>{type}</span>
                        <input 
                          type="checkbox"
                          checked={autoDownload[type]}
                          onChange={e => {
                            const val = e.target.checked;
                            const updated = { ...autoDownload, [type]: val };
                            setAutoDownload(updated);
                            localStorage.setItem("autoDownloadPrefs", JSON.stringify(updated));
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Subpage */}
            {settingsSubPage === "accessibility" && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-green, #22C55E)", fontWeight: "600" }}>Chat Font Size Scale</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["small", "medium", "large"].map((size) => (
                    <label 
                      key={size}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        backgroundColor: chatFontSize === size ? "rgba(34, 197, 94, 0.1)" : "var(--wa-panel-hover)",
                        border: chatFontSize === size ? "2px solid var(--wa-green)" : "1.5px solid transparent",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: chatFontSize === size ? "600" : "400",
                        color: "var(--wa-text-primary)"
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>{size} size</span>
                      <input 
                        type="radio" 
                        name="chatFontSizeRadio" 
                        value={size}
                        checked={chatFontSize === size}
                        onChange={() => {
                          setChatFontSizeState(size);
                          localStorage.setItem("chatFontSize", size);
                          window.dispatchEvent(new CustomEvent('chatFontSizeChanged', { detail: size }));
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QR CODE MODAL OVERLAY ── */}
      {showQRCodeModal && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "var(--wa-panel)",
            border: "1px solid var(--wa-divider)",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxWidth: "320px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
          }}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--wa-green, #22C55E)" }}>My QR Code</h4>
            
            {/* Avatar & User Name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <img 
                src={currentUserData?.image || userFallback} 
                style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
                alt="Avatar" 
                onError={e => e.target.src = userFallback} 
              />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--wa-text-primary)" }}>
                {currentUserData?.fname || currentUserData?.name || "GrapeTask User"}
              </span>
            </div>

            {/* QR SVG */}
            <div style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "12px",
              display: "inline-block",
              marginBottom: "20px"
            }}>
              <svg width="150" height="150" viewBox="0 0 29 29" style={{ display: "block" }}>
                <path d="M0 0h9v9H0zm2 2v5h5V2zm11 0h4v2h-4zm5 0h4v4h-4zm5 0h2v2h-2zm-6 3v2h2V5zm4 0h2v2h-2zm5 0h2v2h-2zM0 11h2v4H0zm3 0h4v2H3zm6 0h4v2H9zm7 0h2v2h-2zm4 0h2v2h-2zm3 0h2v2h-2zm-12 3h2v2h-2zm4 0h2v2h-2zm8 0h2v4h-2zm-18 2h2v4H0zm3 0h4v2H3zm13 0h2v2h-2zm4 0h2v2h-2zm-12 3h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-11 3h2v2h-2zm4 0h2v2h-2zm3 0h2v2h-2z" fill="#000" />
                <rect x="0" y="20" width="9" height="9" fill="#000" />
                <rect x="2" y="22" width="5" height="5" fill="#fff" />
                <rect x="20" y="20" width="9" height="9" fill="#000" />
                <rect x="22" y="22" width="5" height="5" fill="#fff" />
              </svg>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => {
                  alert("QR code link copied to clipboard!");
                  setShowQRCodeModal(false);
                }}
                className="settings-btn-primary"
                style={{ flex: 1 }}
              >
                Share Code
              </button>
              <button 
                onClick={() => setShowQRCodeModal(false)}
                className="settings-btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INVITE CODE MODAL OVERLAY ── */}
      {showInviteModal && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "var(--wa-panel)",
            border: "1px solid var(--wa-divider)",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxWidth: "320px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
          }}>
            <h4 style={{ margin: "0 0 12px 0", color: "var(--wa-green, #22C55E)" }}>Invite Friends</h4>
            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "var(--wa-text-second)" }}>
              Share this invite link with your friends to connect on GrapeTask.
            </p>

            <div style={{
              backgroundColor: "var(--wa-panel-hover)",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--wa-text-primary)",
              wordBreak: "break-all",
              border: "1px solid var(--wa-divider)",
              marginBottom: "20px",
              textAlign: "left"
            }}>
              {`https://grapetask.com/invite/${currentUserData?.name?.toLowerCase().replace(/\s+/g, '-') || "user"}-invite`}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://grapetask.com/invite/${currentUserData?.name?.toLowerCase().replace(/\s+/g, '-') || "user"}-invite`);
                  alert("Invite link copied to clipboard!");
                  setShowInviteModal(false);
                }}
                className="settings-btn-primary"
                style={{ flex: 1 }}
              >
                Copy Link
              </button>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="settings-btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE STATUS MODAL ── */}
      {showCreateStatusModal && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: statusMediaPreview ? '#000' : statusBg,
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          justifyContent: "space-between",
          color: "#fff",
        }}>
          <input
            type="file"
            accept="image/*,video/*"
            ref={statusFileInputRef}
            onChange={handleStatusMediaSelect}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            accept="image/*,video/*"
            ref={statusCameraInputRef}
            onChange={handleStatusMediaSelect}
            style={{ display: 'none' }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button 
              onClick={() => {
                setShowCreateStatusModal(false);
                clearStatusMedia();
              }}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "24px" }}
            >
              ✕
            </button>
            {!statusMediaPreview && (
              <button 
                onClick={() => {
                  const bgs = [
                    "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
                    "linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)",
                    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)",
                    "#1e3a8a"
                  ];
                  const curIdx = bgs.indexOf(statusBg);
                  const nextIdx = (curIdx + 1) % bgs.length;
                  setStatusBg(bgs[nextIdx]);
                }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}
              >
                🎨 Color
              </button>
            )}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            {/* Media Preview */}
            {statusMediaPreview && (
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px', maxHeight: '60vh' }}>
                {statusMedia?.type === 'video' ? (
                  <video
                    src={statusMediaPreview}
                    controls
                    style={{ width: '100%', maxHeight: '50vh', borderRadius: '12px', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={statusMediaPreview}
                    alt="Status preview"
                    style={{ width: '100%', maxHeight: '50vh', borderRadius: '12px', objectFit: 'contain' }}
                  />
                )}
                <button
                  onClick={clearStatusMedia}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Text Input */}
            <textarea
              value={statusText}
              onChange={e => setStatusText(e.target.value)}
              placeholder={statusMediaPreview ? "Add a caption..." : "Type a status update..."}
              maxLength={150}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "24px",
                textAlign: "center",
                width: "100%",
                maxWidth: "300px",
                resize: "none",
                fontWeight: "600",
                fontFamily: "sans-serif",
                minHeight: statusMediaPreview ? '60px' : '120px',
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Media Upload Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Camera Button - Modern WhatsApp Style */}
              <button
                onClick={() => statusCameraInputRef.current?.click()}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.4)";
                }}
              >
                {/* Camera Icon SVG */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              {/* Gallery Button - Modern WhatsApp Style */}
              <button
                onClick={() => statusFileInputRef.current?.click()}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.4)";
                }}
              >
                {/* Gallery/Photos Icon SVG */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </button>
            </div>

            {/* Send Button */}
            <button 
              onClick={() => {
                if (statusText.trim() || statusMediaPreview) {
                  saveStatus(statusText.trim(), statusBg);
                }
              }}
              disabled={!statusText.trim() && !statusMediaPreview}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: (statusText.trim() || statusMediaPreview) ? "var(--wa-green)" : "rgba(255,255,255,0.3)",
                color: "#fff",
                border: "none",
                fontSize: "22px",
                cursor: (statusText.trim() || statusMediaPreview) ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              ✓
            </button>
          </div>
        </div>
      )}

      {/* ── STATUS VIEWER OVERLAY ── */}
      {activeStatusUser && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "#000",
          zIndex: 400,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Progress Bars */}
          <div style={{ display: "flex", gap: "4px", padding: "16px 16px 0", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
            {activeStatusUser.statuses.map((s, idx) => (
              <div 
                key={s.id} 
                onClick={() => {
                  setCurrentStatusIndex(idx);
                  setProgress(0);
                }}
                style={{
                  height: "3px", 
                  backgroundColor: "rgba(255,255,255,0.3)", 
                  flex: 1, 
                  borderRadius: "2px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: idx < currentStatusIndex ? "100%" : idx === currentStatusIndex ? `${progress}%` : "0%",
                  backgroundColor: "#fff",
                  transition: idx === currentStatusIndex ? "none" : "width 0.3s",
                }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "28px 16px 16px",
            position: "relative",
            zIndex: 10,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img 
                src={activeStatusUser.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeStatusUser.userName)}&background=random`}
                alt=""
                style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }}
              />
              <div>
                <h4 style={{ margin: 0, color: "#fff", fontSize: "15px", fontWeight: 600 }}>{activeStatusUser.userName}</h4>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
                  {activeStatusUser.statuses[currentStatusIndex]?.time}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Delete button - only for own status */}
              {activeStatusUser.userId === (currentUserData?.id || 'current-user') && (
                <button
                  onClick={() => {
                    deleteStatus(activeStatusUser.statuses[currentStatusIndex].id);
                    if (activeStatusUser.statuses.length <= 1) {
                      setActiveStatusUser(null);
                    } else if (currentStatusIndex >= activeStatusUser.statuses.length - 1) {
                      setCurrentStatusIndex(currentStatusIndex - 1);
                    }
                  }}
                  style={{ 
                    background: "rgba(239,68,68,0.8)", 
                    border: "none", 
                    color: "#fff", 
                    cursor: "pointer", 
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  Delete
                </button>
              )}
              <button 
                onClick={() => setActiveStatusUser(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", padding: "8px", borderRadius: "50%" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Status Content - WhatsApp Style */}
          <div 
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onClick={(e) => {
              // Prevent if clicking on buttons
              if (e.target.tagName === 'BUTTON') return;
              
              // Get click position
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              
              // Left 30% = previous, Right 30% = next
              if (x < width * 0.3 && currentStatusIndex > 0) {
                setCurrentStatusIndex(currentStatusIndex - 1);
                setProgress(0);
              } else if (x > width * 0.7) {
                if (currentStatusIndex < activeStatusUser.statuses.length - 1) {
                  setCurrentStatusIndex(currentStatusIndex + 1);
                  setProgress(0);
                } else {
                  // Go to next user's status if available
                  const currentIdx = filteredStatuses.findIndex(u => u.userId === activeStatusUser.userId);
                  if (currentIdx < filteredStatuses.length - 1) {
                    setActiveStatusUser(filteredStatuses[currentIdx + 1]);
                    setCurrentStatusIndex(0);
                    setProgress(0);
                  } else {
                    setActiveStatusUser(null);
                  }
                }
              }
            }}
          >
            {/* Pause Indicator */}
            {isPaused && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              </div>
            )}

            {/* Content Display */}
            {(() => {
              const currentStatus = activeStatusUser.statuses[currentStatusIndex];
              if (!currentStatus) return null;

              if (currentStatus.type === 'video' && currentStatus.mediaUrl) {
                return (
                  <video
                    src={currentStatus.mediaUrl}
                    autoPlay
                    playsInline
                    muted={isPaused}
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "100%", 
                      objectFit: "contain",
                    }}
                  />
                );
              }

              if (currentStatus.type === 'image' && currentStatus.mediaUrl) {
                return (
                  <img
                    src={currentStatus.mediaUrl}
                    alt="Status"
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "100%", 
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                );
              }

              return (
                <div style={{
                  background: currentStatus.bg || "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
                  padding: "40px",
                  borderRadius: "16px",
                  maxWidth: "80%",
                  textAlign: "center",
                }}>
                  <p style={{ color: "#fff", fontSize: "22px", fontWeight: 600, margin: 0 }}>
                    {currentStatus.text}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Bottom padding */}
          <div style={{ height: "60px" }} />
        </div>
      )}

      {/* ── MY STATUSES LIST MODAL ── */}
      {showMyStatusesModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "#fff",
          zIndex: 350,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            background: "var(--wa-green)",
            color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button 
                onClick={() => setShowMyStatusesModal(false)}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>My Status</h3>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>{myStatuses.length} {myStatuses.length === 1 ? 'update' : 'updates'}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowMyStatusesModal(false);
                setShowCreateStatusModal(true);
              }}
              style={{ 
                background: "rgba(255,255,255,0.2)", 
                border: "none", 
                color: "#fff", 
                cursor: "pointer", 
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              Add Status
            </button>
          </div>

          {/* Status List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {myStatuses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--wa-text-muted)" }}>
                <p>No status updates yet</p>
                <button 
                  onClick={() => {
                    setShowMyStatusesModal(false);
                    setShowCreateStatusModal(true);
                  }}
                  style={{
                    marginTop: "16px",
                    padding: "12px 24px",
                    background: "var(--wa-green)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "24px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Add New Status
                </button>
              </div>
            ) : (
              myStatuses.slice().reverse().map((status, index) => (
                <div 
                  key={status.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // View this status
                    setShowMyStatusesModal(false);
                    setActiveStatusUser({
                      userId: currentUserData?.id || 'current-user',
                      userName: currentUserData?.fname || currentUserData?.name || "You",
                      userImage: currentUserData?.image || userFallback,
                      statuses: [status],
                    });
                  }}
                >
                  {/* Status Preview */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    background: status.mediaUrl 
                      ? (status.type === 'video' ? '#000' : `url(${status.mediaUrl}) center/cover no-repeat`)
                      : status.bg || "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: status.type === 'video' ? '2px solid #FF6B6B' : 'none',
                  }}>
                    {status.mediaUrl && status.type === 'video' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    ) : status.mediaUrl && status.type === 'image' ? null : (
                      <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600, padding: "4px" }}>{status.text?.substring(0, 20)}...</span>
                    )}
                  </div>

                  {/* Status Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--wa-text-primary)" }}>
                      {status.text ? status.text.substring(0, 30) + (status.text.length > 30 ? '...' : '') : (status.type === 'image' ? 'Photo' : 'Video')}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--wa-text-muted)" }}>
                      {status.time}
                    </p>
                    {/* Views Count */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--wa-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span style={{ fontSize: "12px", color: "var(--wa-green)", fontWeight: 500 }}>
                        {status.views?.length || 0} {status.views?.length === 1 ? 'view' : 'views'}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStatus(status.id);
                    }}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "none",
                      color: "#EF4444",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── MIROTALK VIDEO CALL MODAL ── */}
      {(activeCallMeeting || activeCallRoom) && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "#020617",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Header with meeting name */}
          <div style={{
            padding: "12px 16px",
            background: "linear-gradient(to right, #1e293b, #0f172a)",
            borderBottom: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>📹</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>
                {activeCallMeeting?.name || "GrapeTask Meeting"}
              </span>
            </div>
          </div>

          {/* MiroTalk Iframe Container */}
          <div style={{ flex: 1, position: "relative" }}>
            {!showIframe && (
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f172a",
                color: "#fff",
                gap: "20px",
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  border: "4px solid #22c55e",
                  borderTop: "4px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }} />
                <p style={{ fontSize: "16px", color: "#94a3b8" }}>Joining meeting...</p>
              </div>
            )}
            <iframe
              onLoad={() => {
                iframeLoadCount.current += 1;
                if (iframeLoadCount.current > 1) {
                  setActiveCallMeeting(null);
                  setActiveCallRoom(null);
                  setShowIframe(false);
                  iframeLoadCount.current = 0;
                }
              }}
              src={`https://p2p.mirotalk.com/join?room=${activeCallMeeting?.id || activeCallRoom}&name=${encodeURIComponent("GrapeTask User")}&chat=0`}
              style={{ 
                width: "100%", 
                height: "100%", 
                border: "none", 
                backgroundColor: "#020617",
                opacity: showIframe ? 1 : 0,
              }}
              allow="camera; microphone; speaker-selection; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay; picture-in-picture"
            />
          </div>

          {/* End Call Button - Fixed at bottom */}
          <div style={{
            padding: "16px 24px",
            background: "linear-gradient(to top, #0f172a, #1e293b)",
            borderTop: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <button 
              onClick={() => {
                setActiveCallMeeting(null);
                setActiveCallRoom(null);
                setShowIframe(false);
                iframeLoadCount.current = 0;
              }}
              style={{ 
                background: "#EF4444", 
                border: "none", 
                color: "#fff", 
                padding: "12px 32px", 
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.4)";
              }}
            >
              <span style={{ fontSize: "20px" }}>📞</span> 
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── MEETING LINK POPUP MODAL ── */}
      {showMeetingLinkModal && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--wa-panel)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "360px",
            border: "1px solid var(--wa-divider)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid var(--wa-divider)"
            }}>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "var(--wa-text-primary)" }}>Meeting Link Created</span>
              <button 
                onClick={() => setShowMeetingLinkModal(false)}
                style={{ background: "none", border: "none", color: "var(--wa-text-second)", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>🔗</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", color: "var(--wa-text-primary)", fontWeight: "600" }}>Shareable Meeting Room</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--wa-text-second)" }}>Outsiders can join using this link.</p>
                </div>
              </div>

              {/* Link Input & Copy Button */}
              <div style={{
                display: "flex",
                backgroundColor: "var(--wa-input-bg, #f0f2f5)",
                borderRadius: "8px",
                padding: "8px 12px",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--wa-divider)"
              }}>
                <input 
                  type="text" 
                  readOnly 
                  value={generatedMeetingLink} 
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    color: "var(--wa-text-primary)"
                  }}
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMeetingLink);
                    setCopiedSuccess(true);
                    setTimeout(() => setCopiedSuccess(false), 2000);
                  }}
                  style={{
                    backgroundColor: "var(--wa-green)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {copiedSuccess ? "Copied! ✓" : "Copy"}
                </button>
              </div>

              <div style={{
                backgroundColor: "rgba(240, 89, 31, 0.1)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "12px",
                color: themeMode === "dark" ? "#ff8c52" : "#d35400",
                lineHeight: "1.4"
              }}>
                ⚠️ <strong>Note:</strong> Anyone opening this link must sign up or login to their GrapeTask account first. Guest logins will be automatically prompted.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: "var(--wa-input-bg, #f0f2f5)",
              borderTop: "1px solid var(--wa-divider)"
            }}>
              <button 
                onClick={() => setShowMeetingLinkModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--wa-text-second)",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setActiveCallMeeting({
                    id: generatedMeetingLink.split("meeting=")[1] || "meet-room",
                    name: "My Active Meeting",
                    type: "video",
                    direction: "outgoing",
                    time: "Just now"
                  });
                  setShowMeetingLinkModal(false);
                }}
                style={{
                  backgroundColor: "var(--wa-green)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Start Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY WARNING MODAL ── */}
      {securityWarningText && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            backgroundColor: "#1e293b",
            border: "2px solid #ef4444",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(239, 68, 68, 0.3)",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "40px",
            }}>
              ⚠️
            </div>
            <h2 style={{
              color: "#ef4444",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "16px",
            }}>
              Security Violation Detected
            </h2>
            <p style={{
              color: "#e2e8f0",
              fontSize: "15px",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}>
              {securityWarningText}
            </p>
            <button
              onClick={() => setSecurityWarningText("")}
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 32px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#dc2626"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ef4444"}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wa-spin { 100% { transform: rotate(360deg); } }
        .wa-chat-item { user-select: none; }
        @keyframes statusProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes callPulse {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .profile-edit-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .profile-edit-label {
          display: block;
          font-size: 13px;
          color: var(--wa-green, #00A884);
          font-weight: 500;
          margin-bottom: 6px;
        }
        .profile-edit-input, .profile-edit-select, .profile-edit-textarea {
          width: 100%;
          padding: 10px 12px;
          background-color: var(--wa-panel-hover, #202c33);
          border: 1px solid var(--wa-divider, #222e35);
          border-radius: 8px;
          color: var(--wa-text-primary, #e9edef);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-edit-input:focus, .profile-edit-select:focus, .profile-edit-textarea:focus {
          border-color: var(--wa-green, #00A884);
          box-shadow: 0 0 0 2px rgba(0, 168, 132, 0.2);
        }
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background-color: rgba(0, 168, 132, 0.15);
          border: 1px solid rgba(0, 168, 132, 0.3);
          border-radius: 16px;
          color: var(--wa-green, #00A884);
          font-size: 13px;
          font-weight: 500;
        }
        .skill-remove-btn {
          background: none;
          border: none;
          color: var(--wa-green, #00A884);
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .skill-remove-btn:hover {
          opacity: 1;
        }
        .education-card {
          position: relative;
          padding: 16px;
          background-color: var(--wa-panel-hover, #202c33);
          border: 1px solid var(--wa-divider, #222e35);
          border-radius: 10px;
          margin-bottom: 8px;
        }
        .education-delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: #EF4444;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .education-delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UsersChat;