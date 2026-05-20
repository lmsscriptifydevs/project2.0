import { Box, Button, CircularProgress, Modal } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { MdLocationOn, MdWork, MdSchool, MdLanguage, MdVerifiedUser } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Chating from '../components/frelancerChat/Chat/Chating';
import { AllBdOrders } from "../redux/slices/allOrderSlice";
import {
  clearConversationError,
  createOrFindConversation,
  setSelectedConversation
} from "../redux/slices/messageSlice";
import { inviteToJob } from '../redux/slices/offersSlice';

const ProfileReview = ({ expertDetail }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Toast notification function
  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark", 
    });
  };

  // Redux selectors
  const { isAssigning } = useSelector((state) => state.offers);
  const bdOrders = useSelector(state => state.allOrder?.bdOrders || []);
  const isLoadingBdOrders = useSelector(state => state.allOrder?.isLoading ?? true);
  const { creatingConversation } = useSelector((state) => state.message);

  // State management
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState({ bdOrderId: '', assignmentNotes: '' });

  const [apiData, setApiData] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUserOnboardingData = async () => {
      try {

        const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          console.warn("No authentication token found!");
          setIsProfileLoading(false);
          return;
        }

        // 🚀 FIX: Used HTTPS instead of HTTP to prevent Mixed Content & CORS errors
        const response = await fetch('https://portal.grapetask.co/api/get-user-onboarding', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const result = await response.json();
        
        if (response.ok && result.status) {
          setApiData(result.data); 
        } else {
          console.error("API Error Response:", result);
          // Toast hata diya taake bar bar error user ko tang na kare agar dusri profile dekh raha ho
        }
      } catch (error) {
        console.error("Fetch API Error:", error);
        showToast("Network issue or CORS error. Showing default data.", 'warning');
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserOnboardingData();
  }, []);

  // Load BD orders for assignment modal
  useEffect(() => {
    dispatch(AllBdOrders());
  }, [dispatch]);

  // Start chat with expert
  const handleStartChat = async (client) => {
    setSelectedClient(client);
    dispatch(clearConversationError());

    try {
      const response = await dispatch(createOrFindConversation({
        participantId: client.id
      })).unwrap();

      dispatch(setSelectedConversation(response));
      setShowChatModal(true);
      showToast('Chat started successfully!', 'success');
    } catch (error) {
      showToast('Failed to start conversation. Please try again.', 'error');
    }
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedClient(null);
  };

  const handleJobInvitation = () => {
    setShowAssignModal(true);
  };

  const closeAssignModal = () => setShowAssignModal(false);

  const handleAssignmentInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAssignmentFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAssignToExpert = async (e) => {
  e.preventDefault();

  if (!assignmentFormData.bdOrderId) {
    showToast("Please select a BD Order", 'error');
    return;
  }

  // logic: Hamesha expert ki ID lo jo props se ya URL se aa rahi hai
  // apiData ko yahan se nikaal dein kyunki wo BD (aapki apni) ID ho sakti hai
  const expertIdToInvite = expertDetail?.id || id; 

  const data = {
    bdOrderId: assignmentFormData.bdOrderId,
    assignmentNotes: assignmentFormData.assignmentNotes,
    seller_id: expertIdToInvite, 
  };

  console.log("Sending Invitation to Expert ID:", expertIdToInvite); // Debugging ke liye

  dispatch(inviteToJob(data))
    .then((res) => {
      showToast(res?.message || "Expert successfully invited", 'success');
      setAssignmentFormData({ bdOrderId: '', assignmentNotes: '' });
      setShowAssignModal(false);
    })
    .catch((err) => {
      showToast(err?.message || "Assignment failed", 'error');
    });
};
  // Render BD order options
  const renderOrderOptions = () => {
    if (isLoadingBdOrders) return <option disabled>Loading BD orders...</option>;
    if (!bdOrders || bdOrders.length === 0) return <option disabled>No BD orders available</option>;

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
        <option key={bdOrderId} value={bdOrderId}>
          {orderTitle} (ID: {bdOrderId}) - {clientName}
        </option>
      );
    });
  };

  // 🟢 Smart Data Mapping (Prefers API Data, falls back to Props data)
 const profile = expertDetail || {};
const extraDetails = apiData?.extra_details || {};
const skills = expertDetail?.skills || apiData?.skills || [];
const educations = expertDetail?.education || apiData?.educations || [];
const certifications = apiData?.certifications || [];

const occupationLabel = (() => {
  const occupation = extraDetails?.occupation || profile?.role || 'Professional Freelancer';
  const normalized = String(occupation).trim().toLowerCase();
  if (normalized === 'bidder/company representative/middleman' || normalized === 'bd') {
    return 'Business Developer';
  }
  return occupation;
})();

  // 🟢 Beautiful Loader
  if (isProfileLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#f0591f' }} size={50} />
        <p className="mt-3 gt-text-gray font-15">Loading Profile Details...</p>
      </div>
    );
  }

  return (
    <>
      <style>{InternalCSS}</style>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      
      <div className="container py-4">
        {/* --- 1. PROFILE HEADER CARD --- */}
        <div className="gt-dark-card mb-4">
          <div className='d-flex p-4 align-items-center flex-wrap gap-4'>
            <div className="avatar-wrapper">
              <img 
                src={profile?.image || "https://portal.grapetask.co/user.png"} 
                alt="Expert Profile" 
                className="profile-avatar"
                onError={(e) => { e.target.src = "https://portal.grapetask.co/user.png"; }}
              />
            </div>
            
            <div className='flex-grow-1'>
              <h6 className='gt-text-white font-24 font-600 mb-1 d-flex align-items-center gap-2'>
                {profile?.fname} {profile?.lname}
                <span className="badge-new">{profile?.level || 'Level 1'}</span>
              </h6>
              <p className='gt-text-orange font-16 mb-2'>
                {occupationLabel}
              </p>
              
              <div className="d-flex flex-wrap align-items-center gap-3 font-14 gt-text-gray mb-3">
                <span className="d-flex align-items-center gap-1">
                  <MdLocationOn className='gt-text-orange' size={18} /> {profile?.country || 'Not Set'}
                </span>
                <span className="divider-dot">•</span>
                <span className="gt-text-white">Profile: <strong className="text-success">{profile?.profile_completion || '0%'}</strong> Complete</span>
                <span className="divider-dot">•</span>
                <span className="gt-text-white">@{profile?.user_name || 'username'}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className='px-4 pb-4 w-100 border-top border-dark-subtle pt-3'>
            <div className="d-flex flex-column gap-3 w-100">
              <div className="d-flex flex-row gap-2 w-100">
                <Button className='gt-btn-solid flex-grow-1'>
                  Available Now
                </Button>
                <Button
                  type="button"
                  disabled={isAssigning}
                  startIcon={isAssigning ? <CircularProgress size={14} sx={{ color: 'white' }} /> : null}
                  className="gt-btn-solid flex-grow-1"
                  onClick={handleJobInvitation}
                >
                  {isAssigning ? 'Inviting...' : 'Invite to Job'}
                </Button>
              </div>
              
              <Button
                onClick={() => handleStartChat(profile)}
                disabled={creatingConversation}
                className='gt-btn-outline w-100 mt-1 mt-md-0'
              >
                {creatingConversation ? 'Opening Chat...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </div>

        {/* --- 2. STACKED INFO BOXES --- */}
        <div className="d-flex flex-column gap-4">
          
          {/* A. Info Grid Box */}
          <div className="gt-dark-card p-4">
            <h6 className="gt-text-white font-18 font-600 mb-4 border-left-orange pl-2">Overview</h6>
            <div className="info-grid mt-2">
              <div className="info-item">
                <MdWork className="info-icon" />
                <div>
                  <h6 className="gt-text-white font-15 mb-1">Primary Goal</h6>
                  <p className="gt-text-gray font-14 mb-0">{extraDetails?.primary_goal || 'Not Specified'}</p>
                </div>
              </div>
              
              <div className="info-item">
                <MdLanguage className="info-icon" />
                <div>
                  <h6 className="gt-text-white font-15 mb-1">Website / Portfolio</h6>
                  {extraDetails?.personal_website ? (
                    <a href={extraDetails.personal_website} target="_blank" rel="noreferrer" className="gt-text-orange font-14 mb-0" style={{ textDecoration: 'underline' }}>Visit Website</a>
                  ) : (
                    <p className="gt-text-gray font-14 mb-0">No website linked</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <MdVerifiedUser className="info-icon" />
                <div>
                  <h6 className="gt-text-white font-15 mb-1">Certifications</h6>
                  {certifications.length > 0 ? (
                    certifications.map((cert, idx) => (
                      <p key={idx} className="gt-text-gray font-14 mb-1">
                        {cert.name} <span className="gt-text-white">({cert.year})</span>
                      </p>
                    ))
                  ) : (
                    <p className="gt-text-gray font-14 mb-0">None Added</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <MdSchool className="info-icon" />
                <div>
                  <h6 className="gt-text-white font-15 mb-1">Education</h6>
                  {educations.length > 0 ? (
                    educations.map((edu, idx) => (
                       <div key={idx} className="mb-2">
                          <p className="gt-text-white font-14 mb-1">{edu?.institution}</p>
                          <p className="gt-text-gray font-13 mb-0">{edu?.degree} (Passed: {edu?.passing_year})</p>
                       </div>
                    ))
                  ) : (
                    <p className="gt-text-gray font-14 mb-1">No education added</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* B. Bio Box */}
          <div className="gt-dark-card p-4">
            <h6 className="gt-text-white font-18 font-600 mb-3 border-left-orange pl-2">Professional Summary</h6>
            <p className='mb-0 gt-text-gray font-15 lh-lg' style={{ textAlign: 'justify' }}>
              {profile?.bio || "No description provided by the freelancer at the moment."}
            </p>
          </div>

          {/* C. Skills Box */}
          <div className="gt-dark-card p-4">
            <h6 className="gt-text-white font-18 font-600 mb-3 border-left-orange pl-2">Expertise & Skills</h6>
            <div className='d-flex flex-wrap gap-2 mt-3'>
              {skills?.length > 0 ? (
                skills.map((val, index) => (
                  <div className='gt-skill-badge px-3 py-2' key={index}>
                    <span className='font-14'>{val?.skill || val}</span>
                    {val?.level && <span className='font-12 text-muted ms-2' style={{ opacity: 0.6 }}>({val?.level})</span>}
                  </div>
                ))
              ) : (
                <p className='gt-text-gray font-14 mb-0'>No skills added yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* --- Chat Offcanvas --- */}
        <Offcanvas 
          show={showChatModal} 
          onHide={closeChatModal} 
          placement="end" 
          style={{ width: '450px', backgroundColor: '#020617', color: '#fff', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-dark-subtle">
            <Offcanvas.Title className="gt-text-white font-18">
              Chat with {selectedClient?.fname || 'User'}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0 d-flex flex-column">
            <div className="flex-grow-1">
              <Chating />
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* --- Assign Modal --- */}
        <Modal open={showAssignModal} onClose={closeAssignModal}>
          <Box
            sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: '500px' },
              bgcolor: '#020617', border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.9)', p: 0
            }}
          >
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-dark-subtle pb-3">
                <h5 className="font-600 font-18 gt-text-white mb-0">Assign to Expert</h5>
                <Button onClick={closeAssignModal} disabled={isAssigning} sx={{ minWidth: 'auto', color: '#a1a1aa' }}>✕</Button>
              </div>

              <form onSubmit={handleAssignToExpert}>
                <div className="mb-4">
                  <label className="form-label font-14 gt-text-gray mb-2">Select BD Order *</label>
                  <select
                    name="bdOrderId"
                    className="form-select gt-dark-input font-14"
                    value={assignmentFormData.bdOrderId}
                    onChange={handleAssignmentInputChange}
                    required disabled={isAssigning}
                  >
                    <option value="">Select a BD Order</option>
                    {renderOrderOptions()}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label font-14 gt-text-gray mb-2">Assignment Notes (Optional)</label>
                  <textarea
                    name="assignmentNotes"
                    className="form-control gt-dark-input font-14"
                    rows="3"
                    value={assignmentFormData.assignmentNotes}
                    onChange={handleAssignmentInputChange}
                    placeholder="Add specific instructions..."
                    disabled={isAssigning}
                  />
                </div>

                <div className="d-flex gap-3">
                  <Button type="submit" disabled={isAssigning} className="gt-btn-solid flex-grow-1 font-14 py-2">
                    {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                  </Button>
                  <Button type="button" onClick={closeAssignModal} disabled={isAssigning} className="gt-btn-outline flex-grow-1 font-14 py-2">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default ProfileReview;

/* ==========================================
   GRAPETASK DARK THEME - INTERNAL CSS
   ========================================== */
const InternalCSS = `
  /* Layout & Typography */
  .font-600 { font-weight: 600 !important; }
  .gt-text-white { color: #ffffff !important; }
  .gt-text-orange { color: #f0591f !important; }
  .gt-text-gray { color: #a1a1aa !important; }
  .divider-dot { color: rgba(255,255,255,0.2); }
  .border-dark-subtle { border-color: rgba(255, 255, 255, 0.08) !important; }
  
  .border-left-orange {
    border-left: 3px solid #f0591f;
    padding-left: 12px;
  }

  /* Cards */
  .gt-dark-card {
    background: #060b19; /* Solid deep background */
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  }
  .gt-dark-card:hover {
    border-color: rgba(240, 89, 31, 0.2);
  }

  /* Profile Avatar */
  .avatar-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 3px solid #f0591f;
    padding: 4px;
    background: rgba(240, 89, 31, 0.1);
  }
  .profile-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .badge-new {
    background: rgba(240, 89, 31, 0.15);
    color: #f0591f;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
  }
  .info-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .info-icon {
    color: #f0591f;
    font-size: 22px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .info-grid { grid-template-columns: 1fr; }
  }

  /* Skills */
  .gt-skill-badge {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #e4e4e7;
    transition: all 0.2s;
  }
  .gt-skill-badge:hover {
    background-color: rgba(240, 89, 31, 0.1);
    border-color: rgba(240, 89, 31, 0.4);
    color: #ffffff;
  }

  /* BUTTONS */
  .gt-btn-solid {
    background-color: #f0591f !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    text-transform: none !important;
    font-weight: 500 !important;
    font-size: 15px !important; 
    padding: 12px 16px !important; 
    box-shadow: 0 4px 12px rgba(240, 89, 31, 0.25) !important;
  }
  .gt-btn-solid:hover {
    background-color: #d84f1b !important;
    transform: translateY(-2px);
  }

  .gt-btn-outline {
    background-color: transparent !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 8px !important;
    text-transform: none !important;
    font-weight: 500 !important;
    font-size: 15px !important; 
    padding: 12px 16px !important; 
  }
  .gt-btn-outline:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-color: #f0591f !important;
    color: #f0591f !important;
  }

  /* Inputs */
  .gt-dark-input {
    background-color: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
    border-radius: 8px !important;
    padding: 12px !important;
  }
  .gt-dark-input:focus {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-color: #f0591f !important;
    box-shadow: 0 0 0 2px rgba(240, 89, 31, 0.2) !important;
  }
  .gt-dark-input option {
    background-color: #020617;
    color: #ffffff;
  }
`;