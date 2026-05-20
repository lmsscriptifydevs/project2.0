import { Alert, Box, Button, CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import swal from "sweetalert";
import Navbar from "../components/Navbar";
import { AllBdOrders } from "../redux/slices/allOrderSlice";
import {
  AcceptOfferRequest,
  AssignToExpertRequest,
  getBuyerOfferRequest,
  RejectOfferRequest
} from "../redux/slices/offersSlice";
import { useDispatch, useSelector } from "../redux/store/store";

const OfferDetail = () => {
  const dispatch = useDispatch();
  const { 
    buyerOfferlist, 
    isLoadingOffer,
    isAssigning,
    assignSuccess,
    assignError
  } = useSelector((state) => state.offers);

  const bdOrders = useSelector(state => state.allOrder?.bdOrders || []);
  const isLoadingBdOrders = useSelector(state => state.allOrder?.isLoading ?? true);

  const { id } = useParams();
  const location = useLocation();

  // ✅ Simple and direct UserData extraction (No Redirects, No Async Delays)
  const UserData = useMemo(() => {
    try {
      const localData = localStorage.getItem("UserData");
      return localData ? JSON.parse(localData) : {};
    } catch {
      return {};
    }
  }, []);

  const isBusinessDeveloper = 
    UserData?.role === 'bidder/company representative/middleman' || 
    UserData?.user_type === 'business_developer';

  // Image preview state
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  // Modal states
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("fast-checkout");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [paymentFormData, setPaymentFormData] = useState({
    username: "",
    email: "",
    password: "",
    amount: "",
    file: null
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    bdOrderId: "",
    assignmentNotes: ""
  });

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sellerId = queryParams.get("seller_id");
  const gig_id = queryParams.get("gig_id");
  const package_id = queryParams.get("package_id");

  // Load offers
  useEffect(() => {
    if (id) {
      dispatch(getBuyerOfferRequest({ requestId: id }));
    }
  }, [dispatch, id]);

  // Load BD orders for assignment modal
  useEffect(() => {
    dispatch(AllBdOrders());
  }, [dispatch]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  // Handle assignment status changes
  useEffect(() => {
    if (assignSuccess) {
      setToast({
        show: true,
        message: "Offer assigned successfully!",
        type: "success"
      });
      setShowAssignModal(false);
      dispatch(getBuyerOfferRequest({ requestId: id }));
    }

    if (assignError) {
      setToast({
        show: true,
        message: assignError,
        type: "error"
      });
    }
  }, [assignSuccess, assignError, dispatch, id]);

  // Utility function to calculate duration
  const getDuration = useCallback((created, due) => {
    const diffInMs = new Date(due || Date.now()) - new Date(created || Date.now());
    const diffInSeconds = Math.floor(diffInMs / 1000);

    if (diffInSeconds < 60) return "Duration: Just now";
    if (diffInSeconds < 3600) return `Duration: ${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `Duration: ${Math.floor(diffInSeconds / 3600)} hours`;
    if (diffInSeconds < 2592000) return `Duration: ${Math.floor(diffInSeconds / 86400)} days`;
    if (diffInSeconds < 31536000) return `Duration: ${Math.floor(diffInSeconds / 2592000)} months`;
    return `Duration: ${Math.floor(diffInSeconds / 31536000)} years`;
  }, []);

  // Modal management functions
  const openPaymentModal = useCallback((offerId) => {
    setSelectedOfferId(offerId);
    setPaymentMethod("fast-checkout");
    setShowPaymentModal(true);
    setPaymentFormData({
      username: "",
      email: "",
      password: "",
      amount: "",
      file: null
    });
    setSelectedImagePreview(null);
  }, []);

  const openAssignModal = useCallback((offerId) => {
    setSelectedOfferId(offerId);
    setShowAssignModal(true);
    setAssignmentFormData({
      bdOrderId: "",
      assignmentNotes: ""
    });
  }, []);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    setSelectedOfferId(null);
    setIsProcessing(false);
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview(null);
    }
  }, [selectedImagePreview]);

  const closeAssignModal = useCallback(() => {
    setShowAssignModal(false);
    setSelectedOfferId(null);
  }, []);

  // Form handlers
  const handlePaymentInputChange = useCallback((e) => {
    const { name, type, files, value } = e.target;

    if (type === 'file' && files?.[0]) {
      const selectedFile = files[0];

      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);

      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImagePreview(imageUrl);

      setPaymentFormData(prev => ({ ...prev, [name]: selectedFile }));
    } else {
      setPaymentFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [selectedImagePreview]);

  const handleAssignmentInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAssignmentFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAssignToExpert = async (e) => {
    e.preventDefault();
    if (!assignmentFormData.bdOrderId) {
      setToast({ show: true, message: "Please select a BD Order", type: "error" });
      return;
    }

    try {
      await dispatch(AssignToExpertRequest({
        offerId: selectedOfferId,
        bdOrderId: assignmentFormData.bdOrderId,
        assignmentNotes: assignmentFormData.assignmentNotes,
        seller_id: sellerId,
        gig_id,
        package_id
      })).unwrap();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleFastCheckout = async (e) => {
    e.preventDefault();
    if (!paymentFormData.file) {
      setToast({ show: true, message: "Please upload a receipt", type: "error" });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      const currentOffers = Array.isArray(buyerOfferlist) ? buyerOfferlist : (buyerOfferlist?.data || []);
      const currentOffer = currentOffers.find(o => o.id === selectedOfferId);

      const fields = {
        seller_id: sellerId || currentOffer?.seller_id || currentOffer?.user_id,
        gig_id: gig_id || currentOffer?.gig_id,
        package_id: package_id || currentOffer?.package_id,
        offerId: selectedOfferId,
        payment_method: 'bank_transfer',
        transfer_receipt: paymentFormData.file,
        status: 'pending_verification',
      };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      await dispatch(AcceptOfferRequest(formData)).unwrap();
      setToast({ show: true, message: "Receipt submitted successfully!", type: "success" });
      await dispatch(getBuyerOfferRequest({ requestId: id }));
      closePaymentModal();
    } catch (error) {
      setToast({ show: true, message: error.message || "Transfer failed", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    const requiredFields = ['username', 'email', 'password', 'amount'];
    if (requiredFields.some(field => !paymentFormData[field])) {
      setToast({ show: true, message: "Please fill all fields", type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentFormData.email)) {
      setToast({ show: true, message: "Invalid email", type: "error" });
      return;
    }

    if (parseFloat(paymentFormData.amount) <= 0) {
      setToast({ show: true, message: "Invalid amount", type: "error" });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        offerId: selectedOfferId,
        paymentMethod: 'card',
        cardDetails: {
          holderName: paymentFormData.username,
          email: paymentFormData.email,
          amount: parseFloat(paymentFormData.amount),
        },
        seller_id: sellerId,
        gig_id,
        package_id
      };

      const response = await dispatch(AcceptOfferRequest(paymentData)).unwrap();

      if (response?.payment_form_html) {
        const win = window.open("", "_blank");
        if (win) {
          win.document.open();
          win.document.write(response.payment_form_html);
          win.document.close();
        }
      }

      setToast({ show: true, message: "Payment processed!", type: "success" });
      await dispatch(getBuyerOfferRequest({ requestId: id }));
      closePaymentModal();

      // ❌ REMOVED REDIRECT (navigate) completely as requested

    } catch (error) {
      setToast({ show: true, message: error.message || "Payment failed", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (offerId) => {
    const result = await swal({
      title: "Are you sure?",
      text: "Reject this offer?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (!result) return;

    setIsProcessing(true);
    try {
      await dispatch(RejectOfferRequest({ offerId })).unwrap();
      setToast({ show: true, message: "Offer rejected!", type: "success" });
      await dispatch(getBuyerOfferRequest({ requestId: id }));
    } catch (error) {
      setToast({ show: true, message: error.message || "Rejection failed", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const renderOrderOptions = () => {
    if (isLoadingBdOrders) return <option disabled>Loading BD orders...</option>;

    const ordersArray = bdOrders || [];
    if (ordersArray.length === 0) return <option disabled>No BD orders available</option>;

    return ordersArray.map(order => {
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
          {orderTitle} (BD Order ID: {bdOrderId}) - {clientName}
        </option>
      );
    });
  };

  // ✅ SAFELY MAPPING ALL OFFERS (Prevents blank screen / disappearing data)
  const safeOffersList = useMemo(() => {
    if (Array.isArray(buyerOfferlist)) return buyerOfferlist;
    if (buyerOfferlist?.data && Array.isArray(buyerOfferlist.data)) return buyerOfferlist.data;
    if (buyerOfferlist?.offers && Array.isArray(buyerOfferlist.offers)) return buyerOfferlist.offers;
    return [];
  }, [buyerOfferlist]);

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#ffffff", paddingBottom: "100px" }}>
      <Navbar FirstNav="none" />

      {/* 🚀 GRAPETASK DARK THEME UI CSS 🚀 */}
      <style>{`
        .gt-page-title {
          font-weight: 800;
          color: #ffffff;
          font-size: 28px;
          margin-bottom: 24px;
        }
        
        .gt-offer-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        .gt-offer-card:hover {
          border-color: rgba(240, 89, 31, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 15px 40px -10px rgba(240, 89, 31, 0.15);
        }
        
        .gt-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.06);
          object-fit: cover;
        }
        
        .gt-name {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }
        
        .gt-desc {
          font-size: 15px;
          color: #d4d4d8;
          line-height: 1.6;
        }
        
        .gt-badge {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #d4d4d8;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .gt-badge-highlight {
          background: rgba(240, 89, 31, 0.1);
          border: 1px solid rgba(240, 89, 31, 0.3);
          color: #f0591f;
        }
        
        .gt-btn-primary {
          background: linear-gradient(135deg, #f0591f, #e64d18) !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          padding: 10px 24px !important;
          box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3) !important;
          transition: all 0.3s ease !important;
          text-transform: none !important;
        }
        .gt-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(240, 89, 31, 0.5) !important;
        }
        
        .gt-btn-danger {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          color: #ef4444 !important;
          font-weight: 600 !important;
          border-radius: 12px !important;
          padding: 10px 24px !important;
          transition: all 0.3s ease !important;
          text-transform: none !important;
        }
        .gt-btn-danger:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #ffffff !important;
          border-color: rgba(239, 68, 68, 0.5) !important;
        }

        /* MODAL STYLES */
        .gt-dark-modal {
          background: #020617;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          color: #ffffff;
        }
        
        .gt-dark-input {
          background: rgba(255,255,255,0.02) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
        }
        .gt-dark-input:focus {
          border-color: #f0591f !important;
          box-shadow: 0 0 0 2px rgba(240,89,31,0.2) !important;
        }

        .gt-modal-sidebar {
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px 0 0 24px;
          padding: 24px;
        }

        .gt-payment-tab {
          background: transparent;
          border: 1px solid transparent;
          color: #a1a1aa;
          padding: 16px;
          border-radius: 12px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        .gt-payment-tab:hover { background: rgba(255,255,255,0.04); color: #ffffff; }
        .gt-payment-tab.active {
          background: rgba(240, 89, 31, 0.1);
          border-color: rgba(240, 89, 31, 0.3);
          color: #ffffff;
        }

        .gt-modal-close-btn {
          background: rgba(255,255,255,0.05) !important;
          color: #a1a1aa !important;
          min-width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          padding: 0 !important;
        }
        .gt-modal-close-btn:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
      `}</style>

      <Snackbar
        open={toast.show}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.type} sx={{ width: '100%', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <div className="container pt-5 mt-4">
        <h2 className="gt-page-title">
          Offer Requests <span style={{ color: "#71717a" }}>({safeOffersList?.length || 0})</span>
        </h2>

        <div className="row">
          {isLoadingOffer ? (
            <div className="col-12 text-center py-5">
              <CircularProgress sx={{ color: "#f0591f" }} />
              <Typography variant="h6" className="mt-3" style={{ color: "#a1a1aa" }}>Loading your offers...</Typography>
            </div>
          ) : safeOffersList?.length > 0 ? (
            safeOffersList.map((offer, index) => {
              const sender = offer?.expert || offer?.user || offer?.seller || offer?.business || offer?.client || {};
              const senderName = sender?.fname ? `${sender.fname} ${sender?.lname || ''}` : 'Unknown User';

              return (
                <div className="col-12 mb-4" key={offer?.id || index}>
                  <div className="gt-offer-card">
                    <div className="row align-items-start">
                      
                      <div className="col-md-8 col-12 d-flex mb-4 mb-md-0">
                        <img
                          src={sender?.image || '/default-avatar.png'}
                          className="gt-avatar"
                          alt={senderName}
                          onError={(e) => e.target.src = '/default-avatar.png'}
                        />
                        <div className="ms-3">
                          <h4 className="gt-name">{senderName}</h4>
                          <p className="gt-desc mb-3">
                            {offer?.description || 'No description provided for this offer.'}
                          </p>
                          
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <span className="gt-badge gt-badge-highlight">
                              Total Budget: <strong>${offer?.price || 0}</strong>
                            </span>
                            <span className="gt-badge">
                              {getDuration(offer?.created_at, offer?.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col-12 d-flex flex-column gap-2 justify-content-end align-items-md-end">
                        {isBusinessDeveloper ? (
                          <Button
                            className="gt-btn-primary w-100"
                            onClick={() => openAssignModal(offer.id)}
                            disabled={isAssigning}
                          >
                            {isAssigning ? "Processing..." : "Assign to Expert"}
                          </Button>
                        ) : (
                          <Button
                            className="gt-btn-primary w-100"
                            onClick={() => openPaymentModal(offer.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Accept Offer"}
                          </Button>
                        )}

                        <Button
                          className="gt-btn-danger w-100 mt-2"
                          onClick={() => handleReject(offer.id)}
                          disabled={isProcessing || isAssigning}
                        >
                          Reject Offer
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5 mt-4 gt-offer-card border-dashed">
              <h4 style={{ color: "#a1a1aa", fontWeight: 600 }}>No offers found at the moment</h4>
              <p style={{ color: "#71717a" }}>When you receive offers, they will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      <Modal
        open={showPaymentModal}
        onClose={closePaymentModal}
        aria-labelledby="payment-modal-title"
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: '850px' },
          bgcolor: 'transparent',
          p: 0,
          outline: 'none'
        }}>
          <div className="gt-dark-modal d-flex flex-column flex-md-row overflow-hidden">
            
            {/* Sidebar inside modal */}
            <div className="col-md-4 col-12 gt-modal-sidebar">
              <h5 className="fw-bold mb-4">Payment Method</h5>
              
              <button
                className={`gt-payment-tab ${paymentMethod === 'fast-checkout' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('fast-checkout')}
                disabled={isProcessing}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: paymentMethod === 'fast-checkout' ? '#f0591f' : 'rgba(255,255,255,0.2)' }}></div>
                <div className="fw-bold">Bank Transfer</div>
              </button>

              <button
                className={`gt-payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
                disabled={isProcessing}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: paymentMethod === 'card' ? '#f0591f' : 'rgba(255,255,255,0.2)' }}></div>
                <div>
                  <div className="fw-bold">Credit/Debit Card</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>Visa, Mastercard</div>
                </div>
              </button>
            </div>

            {/* Main content inside modal */}
            <div className="col-md-8 col-12 p-4 p-md-5 position-relative">
              <Button onClick={closePaymentModal} disabled={isProcessing} className="gt-modal-close-btn position-absolute" style={{ top: 20, right: 20 }}>
                ✕
              </Button>
              
              {paymentMethod === 'fast-checkout' && (
                <>
                  <h4 className="fw-bold mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Complete via Bank Transfer</h4>
                  
                  <div className="row mb-4">
                    <div className="col-sm-6 mb-3">
                      <p className="mb-1" style={{ color: '#a1a1aa', fontSize: 14 }}>Account Title</p>
                      <h6 className="fw-bold">GrapeTask (Private) Limited</h6>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <p className="mb-1" style={{ color: '#a1a1aa', fontSize: 14 }}>Account Number</p>
                      <h6 className="fw-bold">021720016063135</h6>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <p className="mb-1" style={{ color: '#a1a1aa', fontSize: 14 }}>IBAN</p>
                      <h6 className="fw-bold">PK945ONE0021720016063135</h6>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <p className="mb-1" style={{ color: '#a1a1aa', fontSize: 14 }}>Bank Name</p>
                      <h6 className="fw-bold">SONERI BANK LTD</h6>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Upload Transfer Receipt *</label>
                    <input
                      className="form-control gt-dark-input"
                      type="file"
                      name="file"
                      accept="image/*,.pdf"
                      onChange={handlePaymentInputChange}
                      disabled={isProcessing}
                    />
                    {selectedImagePreview && (
                      <img src={selectedImagePreview} className="mt-3 rounded-3 border" style={{ borderColor: 'rgba(255,255,255,0.1)' }} width={120} height={120} alt="Receipt Preview" />
                    )}
                  </div>

                  <Button onClick={handleFastCheckout} disabled={isProcessing || !paymentFormData.file} className="gt-btn-primary w-100">
                    {isProcessing ? 'Processing...' : 'Submit Receipt'}
                  </Button>
                </>
              )}

              {paymentMethod === 'card' && (
                <form onSubmit={handleCardPayment}>
                  <h4 className="fw-bold mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Credit / Debit Card Details</h4>
                  
                  <div className="mb-3">
                    <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Cardholder Name *</label>
                    <input type="text" name="username" className="form-control gt-dark-input" value={paymentFormData.username} onChange={handlePaymentInputChange} required disabled={isProcessing} />
                  </div>
                  
                  <div className="mb-3">
                    <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Email Address *</label>
                    <input type="email" name="email" className="form-control gt-dark-input" value={paymentFormData.email} onChange={handlePaymentInputChange} required disabled={isProcessing} />
                  </div>
                  
                  <div className="row">
                    <div className="col-6 mb-4">
                      <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Card PIN *</label>
                      <input type="password" name="password" className="form-control gt-dark-input" value={paymentFormData.password} onChange={handlePaymentInputChange} maxLength={6} minLength={4} required disabled={isProcessing} />
                    </div>
                    <div className="col-6 mb-4">
                      <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Amount *</label>
                      <input type="number" name="amount" className="form-control gt-dark-input" value={paymentFormData.amount} onChange={handlePaymentInputChange} min="1" step="0.01" required disabled={isProcessing} />
                    </div>
                  </div>

                  <Button type="submit" disabled={isProcessing} className="gt-btn-primary w-100">
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Box>
      </Modal>

      {/* ── ASSIGN TO EXPERT MODAL ── */}
      <Modal open={showAssignModal} onClose={closeAssignModal} aria-labelledby="assign-modal-title">
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: '600px' },
          bgcolor: 'transparent',
          p: 0,
          outline: 'none'
        }}>
          <div className="gt-dark-modal p-4 p-md-5 position-relative">
            <Button onClick={closeAssignModal} disabled={isAssigning} className="gt-modal-close-btn position-absolute" style={{ top: 20, right: 20 }}>
              ✕
            </Button>
            
            <h4 className="fw-bold mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Assign to Expert</h4>
            
            <form onSubmit={handleAssignToExpert}>
              <div className="mb-4">
                <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Select BD Order *</label>
                <select name="bdOrderId" className="form-select gt-dark-input" value={assignmentFormData.bdOrderId} onChange={handleAssignmentInputChange} required disabled={isAssigning}>
                  <option value="">Select a BD Order</option>
                  {renderOrderOptions()}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2 fw-bold" style={{ color: '#d4d4d8' }}>Assignment Notes (Optional)</label>
                <textarea name="assignmentNotes" className="form-control gt-dark-input" rows="4" value={assignmentFormData.assignmentNotes} onChange={handleAssignmentInputChange} placeholder="Add instructions for the expert..." disabled={isAssigning} />
              </div>

              <Button type="submit" disabled={isAssigning} className="gt-btn-primary w-100">
                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
              </Button>
            </form>
          </div>
        </Box>
      </Modal>

    </div>
  );
};

export default OfferDetail;