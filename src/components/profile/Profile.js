import { Button } from "@mui/material";
import { City, Country, State } from 'country-state-city';
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import ConnectWindows from "../../assets/ConnectWindows.webp";
import {
  PrifileOtp,
  clearPhoneErrors,
  getPhoneNumberVer,
  profileChangePassword,
  profileUpdate,
  sendPhoneOTP,
  userProfile,
  verifyPhoneOTP
} from "../../redux/slices/profileSlice";
import { useDispatch, useSelector } from "../../redux/store/store";
import "../../style/profile.scss";
import Navbar from "../Navbar";
import ProfileSideBar from "./ProfileSideBar";

const ProfileUser = () => {
  const [tabState, setTabState] = useState("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, isLoading, getError } = useSelector(
    (state) => state.profile
  );
  
  // Error states
  const [isError, setIsError] = useState(false);
  const [isErrorShow, setIsErrorShow] = useState("");
  
  // OTP states
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [showPhoneOTPModal, setShowPhoneOTPModal] = useState(false);
  
  // Phone verification states
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  
  // Location states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Profile states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [value, setValue] = useState();
  const [professionalSummary, setProfessionalSummary] = useState("");
  
  // Password states
  const [currentPas, setCurrentPas] = useState("");
  const [newPas, setNewPas] = useState("");
  const [confirmPas, setConfirmPas] = useState("");

  const renderInput = (inputProps, index) => {
    const isFilled = otp.length > index;
    const backgroundColor = isFilled ? "#f0591f" : "rgba(255, 255, 255, 0.05)";
    const color = "#ffffff";

    return (
      <input
        {...inputProps}
        style={{ 
          backgroundColor, 
          color, 
          borderRadius: '12px', 
          border: `1px solid rgba(255,255,255,0.1)`,
          width: '50px',
          height: '55px',
          fontSize: '22px',
          margin: '0 6px',
          textAlign: 'center',
          outline: 'none',
          transition: 'all 0.3s ease'
        }}
        maxLength={1}
      />
    );
  };

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountries(countryData);
  }, []);

  useEffect(() => {
    if (country) {
      const countryStates = State.getStatesOfCountry(country);
      setStates(countryStates);
      setState("");
      setCities([]);
      setCity("");
    } else {
      setStates([]);
      setCities([]);
      setState("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      const stateCities = City.getCitiesOfState(country, state);
      setCities(stateCities);
      setCity("");
    } else {
      setCities([]);
      setCity("");
    }
  }, [country, state]);

  useEffect(() => {
    const fetchProfile = () => {
      const data = { device_token: "123456789" };
      dispatch(userProfile(data));
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchProfile, { timeout: 500 });
    } else {
      setTimeout(fetchProfile, 0);
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("UserData", JSON.stringify(userDetail));
    setFirstName(userDetail?.fname || "");
    setLastName(userDetail?.lname || "");
    setCountry(userDetail?.country || "");
    setCity(userDetail?.city || "");
    setState(userDetail?.state || "");
    setZip(userDetail?.postalCode || "");
    setValue(userDetail?.phone || "");
    setProfessionalSummary(userDetail?.professional_summary ?? "");
  }, [userDetail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      fname: firstName,
      lname: lastName,
      phone: value,
      country: country,
      city: city,
      state: state,
      postalCode: zip,
      professional_summary: professionalSummary || undefined,
      device_token: "123456",
    };
    dispatch(profileUpdate(data, handleResponse));
  };

  const handleResponse = (data) => {
    if (data?.status) {
      toast.success("Successfully Update Profile");
    } else {
      toast.error(data?.message || "Update failed");
    }
  };

  const handlePhoneVerification = async () => {
    dispatch(clearPhoneErrors());
    if (!phoneCountry.trim() || !phoneValue) {
      toast.error("Please fill all phone details");
      return;
    }
    const data = { phone: phoneValue, country: phoneCountry.trim(), device_token: "123456" };
    try {
      const result = await dispatch(sendPhoneOTP(data));
      if (sendPhoneOTP.fulfilled.match(result)) {
        toast.success("OTP sent successfully");
        setShowPhoneOTPModal(true);
      }
    } catch (error) { console.error(error); }
  };

  const handlePhoneOTPVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
    const data = { token: otp, phone: phoneValue };
    dispatch(verifyPhoneOTP(data, handlePhoneVerifyResponse));
  };

  const handlePhoneVerifyResponse = (data) => {
    if (data?.status) {
      toast.success("Verified successfully");
      setShowPhoneOTPModal(false);
      dispatch(userProfile({ device_token: "123456789" }));
    } else {
      setIsErrorShow(data?.message);
      setIsError(true);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    let data = { password: currentPas, newPassword: newPas, confirmPassword: confirmPas };
    dispatch(profileChangePassword(data, handleResponseChangePassword));
  };

  const handleResponseChangePassword = (data) => {
    if (data?.status) {
      toast.success("Password changed successfully");
      setCurrentPas(""); setNewPas(""); setConfirmPas("");
    } else {
      setIsErrorShow(data?.message);
      setIsError(true);
    }
  };

  const handleEmailverify = () => { dispatch(getPhoneNumberVer()); };

  const handleOTPVerify = (e) => {
    e.preventDefault();
    dispatch(PrifileOtp({ token: otp }, handleResponsePrifileOtp));
  };

  const handleResponsePrifileOtp = (data) => {
    if (data?.status) {
      setOtpStatus(false); setOtp("");
    } else {
      setIsErrorShow(data?.message);
      setIsError(true);
    }
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
      <ToastContainer theme="dark" />
      <Navbar
        FirstNav="none"
        SecondNav="flex"
        userIcon={<HiOutlineUserCircle size={30} color="#ffffff" />}
        userMargin="auto"
      />

      {/* 🚀 ULTRA PREMIUM NEXT-LEVEL UI/UX CSS 🚀 */}
      <style>{`
        .profileSetting { background-color: #0f172a; color: #f8fafc; }
        
        .gt-card-profile {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          padding: 40px;
        }

        .form-control, .form-select { 
            background-color: #0f172a !important; 
            color: #f8fafc !important; 
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }
        .form-control:focus, .form-select:focus {
            border-color: #f0591f !important;
            box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2) !important;
            background-color: rgba(30, 41, 59, 0.5) !important;
        }
        .form-label { color: #cbd5e1 !important; font-weight: 600 !important; font-size: 15px !important; margin-bottom: 8px !important; }
        
        .colororing { color: #f0591f !important; }
        
        .btn-stepper { 
            background: linear-gradient(135deg, #f0591f, #e64d18) !important;
            color: white !important; 
            border: none !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3) !important;
        }
        .btn-stepper:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(240, 89, 31, 0.5) !important;
        }
        
        .btn-stepper-border { 
            background-color: transparent !important; 
            color: #e2e8f0 !important; 
            border: 1px solid rgba(255, 255, 255, 0.2) !important; 
            font-weight: 700 !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }
        .btn-stepper-border:hover {
            background-color: rgba(255, 255, 255, 0.05) !important; 
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
        }

        .PhoneInputInput { background: transparent !important; color: white !important; border: none !important; outline: none !important; }
        .PhoneInput { 
            background-color: #0f172a; 
            padding: 12px 16px; 
            border-radius: 12px; 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            transition: all 0.3s ease;
        }
        .PhoneInput:focus-within {
            border-color: #f0591f;
            box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2);
        }

        /* Sidebar Tabs Profile */
        .sidebar-profile {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px 15px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }
        .side-bar-tabs .list {
          border-radius: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #94a3b8;
        }
        .side-bar-tabs .list:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
        }
        .side-bar-tabs .list.active {
          background: rgba(240, 89, 31, 0.1);
          color: #f0591f;
          font-weight: 700;
        }
        .profile-upload {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 12px;
          transition: 0.3s;
        }
        .profile-upload:hover {
          background: rgba(240, 89, 31, 0.1);
          border-color: #f0591f;
          color: #f0591f;
        }

        .modal-content { 
            background: #0f172a !important; 
            color: white !important; 
            border: 1px solid rgba(255, 255, 255, 0.1) !important; 
            border-radius: 24px !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .btn-close { filter: invert(1) opacity(0.7); transition: 0.3s; }
        .btn-close:hover { filter: invert(1) opacity(1); transform: rotate(90deg); }
      `}</style>

      <div className="container-fluid profileSetting poppins pt-5">
        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <ProfileSideBar setupTabState={setTabState} tabStates={tabState} />
          </div>

          <div className="col-lg-8 col-md-8 col-12 mb-5">
            <div className="gt-card-profile">
              
              {/* --- PROFILE TAB --- */}
              {tabState === "profile" && (
                <form className="prof-fields" onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 className="fw-bold mb-0" style={{ color: "#fff", letterSpacing: "-0.5px" }}>Edit Profile</h2>
                  </div>
                  
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control p-3 font-15"
                        placeholder="e.g. John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control p-3 font-15"
                        placeholder="e.g. Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-12 mb-4">
                      <label className="form-label">Professional Summary</label>
                      <textarea
                        className="form-control p-3 font-15"
                        rows={4}
                        placeholder="Brief description of your skills and experience..."
                        value={professionalSummary}
                        onChange={(e) => setProfessionalSummary(e.target.value)}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">Phone Number</label>
                      <PhoneInput
                        value={value}
                        international
                        defaultCountry="PK"
                        required
                        onChange={setValue}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">Country</label>
                      <select
                        className="form-select font-15 p-3"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">State / Province</label>
                      <select
                        className="form-select font-15 p-3"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={!country}
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label">City</label>
                      <select
                        className="form-select font-15 p-3"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!state}
                      >
                        <option value="">Select City</option>
                        {cities.map((c, i) => (
                          <option key={i} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-lg-6 col-md-6 col-12 mb-5">
                      <label className="form-label">Zip / Postal Code</label>
                      <input
                        type="text"
                        className="form-control p-3 font-15"
                        placeholder="e.g. 10001"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-12 text-end pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <Button type="button" className="btn-stepper-border me-3 px-4 py-3" onClick={() => window.location.reload()}>Discard Changes</Button>
                      <Button type="submit" className="btn-stepper px-5 py-3">Save Profile</Button>
                    </div>
                  </div>
                </form>
              )}

              {/* --- PASSWORD TAB --- */}
              {tabState === "MyOrders" && (
                <div>
                  <div className="d-flex align-items-center mb-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 className="fw-bold mb-0" style={{ color: "#fff", letterSpacing: "-0.5px" }}>Security Settings</h2>
                  </div>
                  
                  <form className="row prof-fields" onSubmit={handleChangePassword}>
                    <div className="col-12 mb-4">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control p-3 font-15"
                        placeholder="Enter current password"
                        value={currentPas}
                        onChange={(e) => setCurrentPas(e.target.value)}
                        required
                      />
                      <p className="mt-2 mb-0 colororing fw-medium cursor-pointer" style={{ fontSize: "14px" }}>Forgot Password?</p>
                    </div>
                    
                    <div className="col-lg-6 col-12 mb-4">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control p-3 font-15"
                        placeholder="Enter new password"
                        value={newPas}
                        onChange={(e) => setNewPas(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-12 mb-5">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control p-3 font-15"
                        placeholder="Confirm new password"
                        value={confirmPas}
                        onChange={(e) => setConfirmPas(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 text-end">
                      <Button type="submit" disabled={isLoading} className="btn-stepper px-5 py-3">
                        {isLoading ? <Spinner size="sm" /> : "Update Password"}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="fw-bold text-white mb-4">Connected Devices</h4>
                    <div className="d-flex p-4 align-items-center justify-content-between" style={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="d-flex align-items-center">
                        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
                          <img src={ConnectWindows} width={30} height={30} alt="windows" />
                        </div>
                        <div className="ms-3">
                          <h6 className="fw-bold text-white mb-1" style={{ fontSize: "15px" }}>Chrome 83, Windows</h6>
                          <p className="mb-0" style={{ color: "#94a3b8", fontSize: "13px" }}>Last Activity 30 minutes ago • Lahore, Pakistan</p>
                        </div>
                      </div>
                      <Button className="btn-stepper-border px-4 py-2" style={{ fontSize: "13px" }}>Sign Out</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Verification Selection */}
      <div className="modal fade" id="verfyModal1" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2">
            <div className="modal-header border-0 pb-0">
               <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body text-center px-4 pb-5">
              <h3 className="fw-bold text-white mb-2">Verify Identity</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px" }}>Choose a method to verify your account.</p>
              <div className="mt-4">
                <Button className="btn-stepper w-100 py-3" onClick={handleEmailverify} data-bs-target="#verfyModal2" data-bs-toggle="modal">Verify via Email OTP</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email OTP Modal */}
      <div className="modal fade" id="verfyModal2" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2 text-center">
            <div className="modal-header border-0 pb-0 d-flex justify-content-between">
               <div className="cursor-pointer d-flex align-items-center justify-content-center" data-bs-target="#verfyModal1" data-bs-toggle="modal" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "50%", width: "40px", height: "40px" }}>
                 <FaAngleLeft size={20} color="#fff" />
               </div>
               <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <form onSubmit={handleOTPVerify} className="px-4 pb-5">
              <h3 className="fw-bold text-white mb-2 mt-2">Enter Verification Code</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "30px" }}>Code sent to: <strong className="text-white">{userDetail?.email}</strong></p>
              <div className="d-flex justify-content-center mb-4">
                <OtpInput value={otp} onChange={setOtp} numInputs={6} renderInput={renderInput} />
              </div>
              <Button type="submit" className="btn-stepper w-100 py-3 mt-2">Verify & Continue</Button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileUser;