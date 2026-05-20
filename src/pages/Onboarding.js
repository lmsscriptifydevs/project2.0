import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, CheckCircle, ChevronRight, ChevronLeft, 
  Camera, Phone, MapPin, Link as LinkIcon, Gift, 
  Trash2, X, Star, FileText, GraduationCap, AlertCircle
} from "lucide-react";
import axios from "../utils/axios";
import axiosDirect from "axios";
import Cropper from "react-easy-crop"; 
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Country, State, City } from "country-state-city";

import "react-toastify/dist/ReactToastify.css";

// ==========================================
// THEME & STYLES (Proper Frame Design)
// ==========================================
const THEME = {
  mainBg: "#030712",
  cardBg: "#0f172a",
  accent: "#f0591f",
  accentHover: "#d44d1a",
  accentGlow: "rgba(240, 89, 31, 0.15)",
  border: "rgba(255, 255, 255, 0.08)",
  textMain: "#f9fafb",
  textMuted: "#94a3b8",
  success: "#10b981",
  error: "#ef4444",
  inputBg: "rgba(255, 255, 255, 0.03)"
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .ob-container { min-height: 100vh; background: #030712; color: ${THEME.textMain}; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ob-card { width: 100%; max-width: 800px; background: ${THEME.cardBg}; border: 1px solid ${THEME.border}; border-radius: 24px; padding: 50px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
  
  .stepper { display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; }
  .step-dot { height: 6px; border-radius: 10px; transition: 0.4s ease; }

  .title-section { text-align: center; margin-bottom: 40px; }
  .title-section h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; }
  .title-section p { color: ${THEME.textMuted}; font-size: 15px; }

  .input-wrapper { margin-bottom: 24px; text-align: left; position: relative; }
  .ob-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 10px; }
  .ob-field { width: 100%; background: ${THEME.inputBg}; border: 1px solid ${THEME.border}; border-radius: 12px; padding: 16px; color: #fff; transition: 0.2s; font-size: 15px; }
  .ob-field:focus { border-color: ${THEME.accent}; outline: none; background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px ${THEME.accentGlow}; }
  .ob-field::placeholder { color: #475569; }
  .ob-field.error { border-color: ${THEME.error}; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15); }
  .ob-field.success { border-color: ${THEME.success}; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }

  .responsive-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  
  .PhoneInput { width: 100%; background: ${THEME.inputBg}; border: 1px solid ${THEME.border}; border-radius: 12px; padding: 12px 16px; color: #fff; transition: 0.2s; font-size: 15px; display: flex; align-items: center; }
  .PhoneInput.error { border-color: ${THEME.error}; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15); }
  .PhoneInput:focus-within:not(.error) { border-color: ${THEME.accent}; outline: none; background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px ${THEME.accentGlow}; }
  .PhoneInputInput { border: none; background: transparent; color: #fff; outline: none; width: 100%; margin-left: 10px; font-size: 15px; }
  .PhoneInputCountry { margin-right: 10px; }
  .PhoneInputCountrySelect { background: #0f172a; color: #fff; }
  
  .skill-badge { background: rgba(255, 255, 255, 0.05); color: ${THEME.textMain}; padding: 8px 14px; border-radius: 20px; font-size: 13px; display: flex; align-items: center; gap: 8px; border: 1px solid ${THEME.border}; }
  .repeat-box { background: rgba(255,255,255,0.02); padding: 24px; border-radius: 16px; border: 1px solid ${THEME.border}; margin-bottom: 20px; position: relative; }
  
  .nav-buttons { display: flex; gap: 15px; margin-top: 40px; }
  .btn-back { background: rgba(255,255,255,0.05); color: #fff; border: none; padding: 0 20px; border-radius: 14px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
  .btn-back:hover { background: rgba(255,255,255,0.1); }
  .btn-primary { background: ${THEME.accent}; color: white; padding: 16px 30px; border-radius: 14px; font-weight: 600; font-size: 16px; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; flex: 1; justify-content: center; }
  .btn-primary:hover:not(:disabled) { background: ${THEME.accentHover}; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .error-text { color: ${THEME.error}; font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 4px; font-weight: 500; }
  .success-text { color: ${THEME.success}; font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 4px; font-weight: 500; }

  .crop-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
  .crop-modal-content { background: ${THEME.cardBg}; width: 90%; max-width: 500px; border-radius: 24px; padding: 24px; border: 1px solid ${THEME.border}; }
  .crop-container { position: relative; width: 100%; height: 300px; background: #000; border-radius: 16px; overflow: hidden; margin: 20px 0; }

  @media (max-width: 768px) { .ob-card { padding: 30px 20px; } .responsive-grid { grid-template-columns: 1fr; } }
`;

// Image Crop Utilities
const createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
});

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 300; canvas.height = 300;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 300, 300);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
};

export default function CompleteOnboarding() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle, checking, available, taken
  
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("ob_step");
    return saved ? parseInt(saved, 10) : 1; 
  });

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("ob_form");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      role: "", level: "", primary_goal: "",
      fname: "", lname: "", user_name: "", phone: "", country: "",
      city: "", state: "", postalCode: "",
      bio: "", occupation: "", personal_website: "",
      skills: [], educations: [], agree_with_terms: false
    };
  });

  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Cropper States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => { localStorage.setItem("ob_step", step); }, [step]);
  useEffect(() => { localStorage.setItem("ob_form", JSON.stringify(form)); }, [form]);

  // 1. Fetch User Data First (using auth validate route format you provided)
  useEffect(() => {
    // Apki validate wali API hit ho rahi hai
    axios.get('/auth/validate').then((res) => {
        if(res.data && res.data.success && res.data.user) {
            const user = res.data.user;
            // Split name into fname and lname safely
            const nameParts = user.name ? user.name.split(' ') : [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setForm(prev => ({
                ...prev,
                role: user.role || prev.role, 
                fname: firstName || prev.fname,
                lname: lastName || prev.lname,
                email: user.email || prev.email,
            }));
        }
    }).catch(err => console.log("Auth validate error", err));

    // Default Country Set via IP
    if (!form.country) {
      axiosDirect.get('https://ipapi.co/json/')
        .then((res) => {
          if (res.data && res.data.country_name) {
             setForm(prev => ({ ...prev, 
               country: res.data.country_name || "Pakistan",
               state: res.data.region || "",
               city: res.data.city || ""
             }));
          } else {
             setForm(prev => ({ ...prev, country: "Pakistan" }));
          }
        }).catch(() => { setForm(prev => ({ ...prev, country: "Pakistan" })); });
    }
  }, []);

  // 👉 2. INSTANT USERNAME CHECK (Debounced)
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (form.user_name && form.user_name.length >= 4) {
        setUsernameStatus("checking");
        setFieldErrors(prev => ({ ...prev, username: null }));
        
        try {
          // Backend ka /check-username route hit karega
          const res = await axios.post("/check-username", { user_name: form.user_name });
          if (res.data.available) {
            setUsernameStatus("available");
          } else {
            setUsernameStatus("taken");
            setFieldErrors(prev => ({ ...prev, username: "Yeh username kisi aur ne liya hua hai." }));
          }
        } catch (error) {
          setUsernameStatus("idle");
        }
      } else {
         setUsernameStatus("idle");
      }
    };

    // 500ms wait karega typing rukne ka, phir API hit karega (server overload bachanay k liye)
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.user_name]);

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // 👉 DYNAMIC ROLE LOGIC
  const isClient = form.role?.toLowerCase() === "client";
  const TOTAL_STEPS = isClient ? 1 : 4; 

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const countries = Country.getAllCountries();
  const selectedCountryObj = countries.find(c => c.name.toLowerCase() === form.country.toLowerCase());
  const states = selectedCountryObj ? State.getStatesOfCountry(selectedCountryObj.isoCode) : [];
  const selectedStateObj = states.find(s => s.name.toLowerCase() === form.state.toLowerCase());
  const cities = selectedStateObj && selectedCountryObj ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode) : [];

  // ==========================================
  // REAL-TIME VALIDATION HANDLERS
  // ==========================================
  const handlePhoneChange = (val) => {
    updateForm("phone", val || "");
    if (val) {
        if (!isValidPhoneNumber(val)) {
            setFieldErrors(prev => ({ ...prev, phone: "Bhai, mukammal aur sahi phone number darj karein." }));
        } else {
            setFieldErrors(prev => ({ ...prev, phone: null }));
        }
    } else {
        setFieldErrors(prev => ({ ...prev, phone: "Phone number zaruri hai." }));
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    updateForm("personal_website", val);
    if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
        setFieldErrors(prev => ({ ...prev, website: "URL 'http://' ya 'https://' se shuru hona chahiye." }));
    } else {
        setFieldErrors(prev => ({ ...prev, website: null }));
    }
  };

  const handleUsernameChange = (e) => {
    let val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''); // sirf alphabets, numbers, underscore allow
    updateForm("user_name", val);
    if (val.length > 0 && val.length < 4) {
        setFieldErrors(prev => ({ ...prev, username: "Username kam az kam 4 characters ka hona chahiye." }));
    } else {
        setFieldErrors(prev => ({ ...prev, username: null }));
    }
  };

  // Button Enable/Disable Logic
  const canProceed = () => {
    if (step === 1) { 
      if (!avatarPreview) return false;
      const isPhoneValid = form.phone && isValidPhoneNumber(form.phone) && !fieldErrors.phone;
      
      // Username lazmi available hona chahiye
      if (usernameStatus !== 'available') return false;

      const commonFieldsFilled = form.fname && form.lname && form.user_name && !fieldErrors.username &&
                                 isPhoneValid && form.country && form.state && 
                                 form.city && form.postalCode;
      
      if (!commonFieldsFilled) return false;
      
      if (!isClient) {
        if (!form.level || !form.primary_goal) return false;
      } else {
        // Client specific logic inside step 1 
        if (!form.agree_with_terms) return false;
      }
      return true;
    }
    
    if (step === 2 && !isClient) { 
      if (fieldErrors.website) return false; 
      return form.occupation && form.bio && form.skills.length >= 5;
    }
    if (step === 3 && !isClient) { 
      if (form.educations.length === 0) return false;
      for (let edu of form.educations) {
        if (!edu.institution || !edu.degree || !edu.passing_year) return false;
      }
      return true;
    }
    if (step === 4 && !isClient) return form.agree_with_terms;
    return false;
  };

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      let finalImageUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile, "profile.jpg"); 
        const imgRes = await axios.post("/upload-media", fd);
        finalImageUrl = imgRes.data?.data?.file_url || "";
      }
      
      const payload = { ...form, image: finalImageUrl, agree_with_terms: 1 };
      const res = await axios.post("/submit-full-onboarding", payload);
      
      if (res.data.status) {
        localStorage.removeItem("ob_step");
        localStorage.removeItem("ob_form");
        localStorage.setItem("IsOnboarded", "1");
        setStep(TOTAL_STEPS + 1); // Goes to Success step
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        if (errors.user_name) {
          toast.error("Yeh username pehle se kisi ne rakha hua hai.");
          setStep(1); 
        } else if (errors.personal_website) {
          toast.error("Aapki website URL ka format theek nahi hai.");
          setStep(isClient ? 1 : 2); 
        } else {
          const firstErrorKey = Object.keys(errors)[0];
          toast.error(errors[firstErrorKey][0]);
        }
      } else {
        toast.error(err.response?.data?.message || "Failed to submit profile.");
      }
    } finally { setLoading(false); }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTempImageSrc(URL.createObjectURL(e.target.files[0]));
      setCropModalOpen(true);
    }
  };

  const saveCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(tempImageSrc, croppedAreaPixels);
      setImageFile(croppedBlob);
      setAvatarPreview(URL.createObjectURL(croppedBlob));
      setCropModalOpen(false); setTempImageSrc(null);
    } catch (e) { toast.error("Image crop failed."); }
  };

  return (
    <div className="ob-container">
      <style>{styles}</style>
      <ToastContainer theme="dark" position="top-center" />

      {/* CROPPER MODAL */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div className="crop-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="crop-modal-content" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Profile Photo</h3>
              <div className="crop-container">
                <Cropper image={tempImageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={(c, pixels) => setCroppedAreaPixels(pixels)} onZoomChange={setZoom} />
              </div>
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{ width: '100%', marginBottom: 20, accentColor: THEME.accent }}/>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setCropModalOpen(false); setTempImageSrc(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveCroppedImage} style={{ flex: 1, padding: 12, borderRadius: 12, background: THEME.accent, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ob-card">
        {/* Only show stepper if it is NOT a client */}
        {step <= TOTAL_STEPS && !isClient && (
          <div className="stepper">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div key={idx} className="step-dot" style={{ 
                width: step === idx + 1 ? 40 : 12, 
                background: step >= idx + 1 ? THEME.accent : 'rgba(255,255,255,0.1)' 
              }}/>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* ======================================= */}
          {/* STEP 1: PERSONAL INFO (FOR BOTH ROLES)  */}
          {/* ======================================= */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="title-section" style={{marginBottom: 30}}>
                <h1>Personal Details</h1>
                <p>Welcome! Complete your {form.role} profile to continue.</p>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ position: 'relative', display: 'inline-block' }} onClick={() => fileRef.current.click()}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `2px dashed ${THEME.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto' }}>
                    {avatarPreview ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" /> : <Camera size={28} color={THEME.textMuted} />}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 10, color: THEME.textMuted }}>Upload Photo</div>
                </div>
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={onFileChange} />
              </div>

              {/* Expert Specific Logic */}
              {!isClient && (
                <div className="responsive-grid" style={{marginBottom: 20}}>
                  <div className="input-wrapper" style={{marginBottom: 0}}>
                      <label className="ob-label"><Star size={14}/> Experience Level</label>
                      <select className="ob-field" value={form.level} onChange={e => updateForm("level", e.target.value)}>
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert / Senior</option>
                      </select>
                  </div>
                  <div className="input-wrapper" style={{marginBottom: 0}}>
                      <label className="ob-label"><Briefcase size={14}/> Primary Goal</label>
                      <select className="ob-field" value={form.primary_goal} onChange={e => updateForm("primary_goal", e.target.value)}>
                          <option value="">Select Goal</option>
                          <option value="Full-time">Full-time Income</option>
                          <option value="Freelance">Side Income</option>
                      </select>
                  </div>
                </div>
              )}

              <div className="responsive-grid">
                <div className="input-wrapper">
                    <label className="ob-label">First Name</label>
                    <input className="ob-field" placeholder="John" value={form.fname} onChange={e => updateForm("fname", e.target.value)} />
                </div>
                <div className="input-wrapper">
                    <label className="ob-label">Last Name</label>
                    <input className="ob-field" placeholder="Doe" value={form.lname} onChange={e => updateForm("lname", e.target.value)} />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="ob-label"><Phone size={14}/> Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="PK"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="e.g. +92 300 1234567"
                  className={`PhoneInput ${fieldErrors.phone ? 'error' : ''}`}
                />
                {fieldErrors.phone && <span className="error-text"><AlertCircle size={14}/> {fieldErrors.phone}</span>}
              </div>

              {/* 👉 INSTANT USERNAME CHECKING UI */}
              <div className="responsive-grid">
                <div className="input-wrapper">
                    <label className="ob-label">Username</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }}>@</span>
                      
                      <input 
                        className={`ob-field ${fieldErrors.username ? 'error' : usernameStatus === 'available' ? 'success' : ''}`} 
                        style={{paddingLeft: '35px', paddingRight: '45px'}} 
                        placeholder="username" 
                        value={form.user_name} 
                        onChange={handleUsernameChange} 
                      />
                      
                      {/* Icons for Username Validation */}
                      <div style={{position:'absolute', right:16, top:16}}>
                        {usernameStatus === 'checking' && <Spinner size="sm" color="light"/>}
                        {usernameStatus === 'available' && <CheckCircle size={18} color={THEME.success}/>}
                        {usernameStatus === 'taken' && <X size={18} color={THEME.error}/>}
                      </div>

                    </div>
                    {fieldErrors.username && <span className="error-text"><AlertCircle size={14}/> {fieldErrors.username}</span>}
                    {usernameStatus === 'available' && <span className="success-text"><CheckCircle size={14}/> Username available!</span>}
                </div>

                <div className="input-wrapper">
                    <label className="ob-label"><MapPin size={14}/> Country</label>
                    <input className="ob-field" placeholder="Pakistan" value={form.country} onChange={e => updateForm("country", e.target.value)} list="country-list" />
                    <datalist id="country-list">
                      {countries.map(c => <option key={c.isoCode} value={c.name} />)}
                    </datalist>
                </div>
              </div>

              <div className="responsive-grid">
                <div className="input-wrapper" style={{marginBottom: 0}}>
                    <label className="ob-label">State / Province</label>
                    <input className="ob-field" placeholder="e.g. Sindh" value={form.state} onChange={e => updateForm("state", e.target.value)} list="state-list" />
                    <datalist id="state-list">
                      {states.map(s => <option key={`${s.isoCode}-${s.name}`} value={s.name} />)}
                    </datalist>
                </div>
                <div className="input-wrapper" style={{marginBottom: 0}}>
                    <label className="ob-label">City</label>
                    <input className="ob-field" placeholder="e.g. Karachi" value={form.city} onChange={e => updateForm("city", e.target.value)} list="city-list" />
                    <datalist id="city-list">
                      {cities.map((c, i) => <option key={`${c.name}-${i}`} value={c.name} />)}
                    </datalist>
                </div>
              </div>

              <div className="input-wrapper" style={{marginTop: 24}}>
                  <label className="ob-label">Postal / Zip Code</label>
                  <input className="ob-field" placeholder="e.g. 75300" value={form.postalCode} onChange={e => updateForm("postalCode", e.target.value)} />
              </div>

              {/* 👉 AGAR CLIENT HAI TO YAHI PAR TERMS AAYENGI AUR FINAL SUBMIT HOGA */}
              {isClient && (
                <label style={{display:'flex', gap:15, cursor:'pointer', background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: `1px solid ${THEME.border}`, marginTop: 24}}>
                  <input type="checkbox" style={{width:20, height:20, accentColor: THEME.accent, marginTop: 2}} checked={form.agree_with_terms} onChange={e => updateForm("agree_with_terms", e.target.checked)} />
                  <span style={{fontSize: 13, color: '#cbd5e1', lineHeight: 1.6}}>I confirm that the information provided is accurate and I agree to the GrapeTask Terms of Service and Privacy Policy.</span>
                </label>
              )}
              
              <div className="nav-buttons" style={{marginTop: 40}}>
                {isClient ? (
                   // Client ka submit button
                   <button className="btn-primary" disabled={!canProceed() || loading} onClick={submitOnboarding}>
                     {loading ? <Spinner size="sm" color="light"/> : "Complete Registration"}
                   </button>
                ) : (
                   // Expert ka Next button
                   <button className="btn-primary" disabled={!canProceed()} onClick={nextStep}>
                      Continue <ChevronRight size={18}/>
                   </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* STEP 2: EXPERT SPECIFIC - WORK & BIO */}
          {/* ======================================= */}
          {step === 2 && !isClient && (
            <motion.div key="s2-exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="title-section">
                <h1>Professional Profile</h1>
                <p>Highlight your skills and expertise.</p>
              </div>
              
              <div className="input-wrapper">
                <label className="ob-label"><FileText size={14}/> Professional Headline</label>
                <input className="ob-field" placeholder="e.g. Senior Frontend Developer | React Expert" value={form.occupation} onChange={e => updateForm("occupation", e.target.value)} />
              </div>

              <div className="input-wrapper">
                <label className="ob-label">About You (Bio)</label>
                <textarea className="ob-field" rows="4" maxLength="500" placeholder="Briefly describe your expertise..." value={form.bio} onChange={e => updateForm("bio", e.target.value)} />
                <div style={{fontSize:12, textAlign:'right', marginTop:6, color: THEME.textMuted}}>{form.bio.length} / 500</div>
              </div>

              <div className="input-wrapper">
                <label className="ob-label">
                  <LinkIcon size={14}/> Portfolio / Website Link (Optional)
                </label>
                <input 
                  className={`ob-field ${fieldErrors.website ? 'error' : ''}`} 
                  placeholder="https://www.myportfolio.com" 
                  value={form.personal_website} 
                  onChange={handleUrlChange} 
                />
                {fieldErrors.website && <span className="error-text"><AlertCircle size={14}/> {fieldErrors.website}</span>}
              </div>

              <div className="input-wrapper">
                <label className="ob-label">Skills</label>
                <input className="ob-field" placeholder="Type a skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && skillInput.trim()) {
                      e.preventDefault();
                      if(!form.skills.find(s=>s.skill === skillInput.trim())) {
                        updateForm("skills", [...form.skills, {skill: skillInput.trim(), level: "Intermediate"}]);
                      }
                      setSkillInput("");
                    }
                  }}
                />
                <div style={{fontSize: 12, color: '#94a3b8', marginTop: 8, marginBottom: 4}}>
                  Add a skill and press Enter on your keyboard. Add at least 5 skills relevant to your category.
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:12}}>
                  {form.skills.map((s, i) => (
                    <span key={i} className="skill-badge">
                      {s.skill} <X size={14} style={{cursor:'pointer'}} onClick={() => updateForm("skills", form.skills.filter((_, idx)=>idx!==i))}/>
                    </span>
                  ))}
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-back" onClick={prevStep}><ChevronLeft size={20}/></button>
                <button className="btn-primary" disabled={!canProceed()} onClick={nextStep}>Education History <ChevronRight size={18}/></button>
              </div>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* STEP 3: EXPERT SPECIFIC - EDUCATION */}
          {/* ======================================= */}
          {step === 3 && !isClient && (
            <motion.div key="s3-exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="title-section">
                <h1>Education</h1>
                <p>Add your academic background.</p>
              </div>

              <div style={{maxHeight: 350, overflowY: 'auto', paddingRight: 5, marginBottom: 20}}>
                {form.educations.map((edu, idx) => (
                    <div key={idx} className="repeat-box">
                        <div style={{position:'absolute', right:15, top:15, cursor: 'pointer', color: THEME.error}} onClick={() => updateForm("educations", form.educations.filter((_,i)=>i!==idx))}>
                           <Trash2 size={16} />
                        </div>
                        <div className="input-wrapper" style={{marginBottom: 15}}>
                            <label className="ob-label"><GraduationCap size={14}/> School / University</label>
                            <input className="ob-field" placeholder="Institution Name" value={edu.institution} onChange={e => {
                                const copy = [...form.educations]; copy[idx].institution = e.target.value; updateForm("educations", copy);
                            }}/>
                        </div>
                        <div className="responsive-grid">
                            <input className="ob-field" placeholder="Degree (e.g. BSCS)" value={edu.degree} onChange={e => {
                                const copy = [...form.educations]; copy[idx].degree = e.target.value; updateForm("educations", copy);
                            }}/>
                            <input className="ob-field" placeholder="Graduation Year" value={edu.passing_year} onChange={e => {
                                const copy = [...form.educations]; copy[idx].passing_year = e.target.value; updateForm("educations", copy);
                            }}/>
                        </div>
                    </div>
                ))}

                <button style={{width: '100%', padding: 15, background: 'transparent', border: `1px dashed ${THEME.border}`, borderRadius: 12, color: THEME.accent, fontWeight: 600, cursor: 'pointer'}} 
                  onClick={() => updateForm("educations", [...form.educations, {institution:"", degree:"", passing_year:""}])}>
                  + Add Education
                </button>
              </div>

              <div className="nav-buttons">
                <button className="btn-back" onClick={prevStep}><ChevronLeft size={20}/></button>
                <button className="btn-primary" disabled={!canProceed()} onClick={nextStep}>
                  Review & Finish <ChevronRight size={18}/>
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* STEP 4: FINAL STEP (EXPERT ONLY) */}
          {/* ======================================= */}
          {step === 4 && !isClient && (
            <motion.div key="s4-exp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{textAlign:'center', marginBottom: 40}}>
                <div style={{width:80, height:80, background:THEME.accentGlow, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
                    <Gift size={36} color={THEME.accent}/>
                </div>
                <h1>Ready to Join!</h1>
                <p style={{color: THEME.textMuted}}>Please confirm your details to complete registration.</p>
              </div>

              <div style={{background: 'rgba(16, 185, 129, 0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: 30, display: 'flex', gap: 15, alignItems:'center'}}>
                 <div style={{background: THEME.success, borderRadius: '50%', padding: 4}}><CheckCircle size={20} color="#fff"/></div>
                 <div>
                   <div style={{fontSize: 15, fontWeight: 600, color: '#fff'}}>Profile Ready</div>
                   <div style={{fontSize: 13, color: THEME.textMuted}}>@{form.user_name} confirmed!</div>
                 </div>
              </div>

              <label style={{display:'flex', gap:15, cursor:'pointer', background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: `1px solid ${THEME.border}`}}>
                <input type="checkbox" style={{width:20, height:20, accentColor: THEME.accent, marginTop: 2}} checked={form.agree_with_terms} onChange={e => updateForm("agree_with_terms", e.target.checked)} />
                <span style={{fontSize: 13, color: '#cbd5e1', lineHeight: 1.6}}>I confirm that the information provided is accurate and I agree to the GrapeTask Terms of Service and Privacy Policy.</span>
              </label>

              <div className="nav-buttons" style={{marginTop: 40}}>
                <button className="btn-back" onClick={prevStep} disabled={loading}><ChevronLeft size={20}/></button>
                <button className="btn-primary" disabled={!form.agree_with_terms || loading} onClick={submitOnboarding}>
                  {loading ? <Spinner size="sm" color="light"/> : "Complete Registration"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SUCCESS MESSAGE (ALL ROLES) */}
          {/* ======================================= */}
          {step > TOTAL_STEPS && (
            <motion.div key="s-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} style={{textAlign:'center', padding:'60px 20px'}}>
              <div style={{position: 'relative', width: 100, height: 100, margin: '0 auto 30px'}}>
                <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                   style={{width: '100%', height: '100%', background: THEME.success, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'}}>
                   <CheckCircle size={50} color="#ffffff" strokeWidth={2.5}/>
                </motion.div>
                <motion.div animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{position: 'absolute', top: -10, right: -10, color: THEME.accent}}>✨</motion.div>
                <motion.div animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{position: 'absolute', bottom: 10, left: -20, color: '#fcd34d'}}>⭐</motion.div>
              </div>

              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: '-1px'}}>
                Welcome Aboard!
              </motion.h1>
              
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{color: THEME.textMuted, fontSize: 16, maxWidth: 400, margin: '0 auto'}}>
                Your account has been successfully verified and set up. Get ready to explore amazing opportunities!
              </motion.p>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15}}>
                <Spinner size="md" style={{ color: THEME.accent }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: THEME.textMuted, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Redirecting to Dashboard
                </span>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}