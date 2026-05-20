import { Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';
import { AcceptOfferRequest } from "../../redux/slices/offersSlice";
import "../../style/paymentCard.scss";
import { 
  ContentCopy, 
  Person, 
  Pin, 
  Public, 
  AccountBalance, 
  CloudUpload, 
  CheckCircle 
} from '@mui/icons-material';

const GRAPE_TASK_THEME = {
  backgrounds: {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)"
  },
  accents: {
    primaryOrange: "#f0591f",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)"
  },
  text: {
    pureWhite: "#ffffff",
    pureBlack: "#000000",
    lightGrayHover: "#d4d4d8",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    darkGrayNumber: "#52525b"
  },
  borders: {
    lightBorder: "rgba(255, 255, 255, 0.06)",
    mediumBorder: "rgba(255, 255, 255, 0.07)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)"
  }
};

const PaymentViaCard = ({ selectedPackage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Redux state
  const { isLoadingCreate: isLoading, getError: error } = useSelector(state => state.offers || {});

  // Core state
  const [paymentMethod, setPaymentMethod] = useState("fast-checkout");
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "", title: "" });
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [successData, setSuccessData] = useState(null);
  // Form data
  const [paymentFormData, setPaymentFormData] = useState({
    username: "",
    email: "",
    password: "",
    amount: "",
    file: null
  });

  const paymentWindowIntervalRef = useRef(null);
  const successNavigateTimeoutRef = useRef(null);

  // Extract query parameters
  const sellerId = queryParams.get("seller_id");
  const gig_id = queryParams.get("gig_id");
  const package_id = queryParams.get("package_id");

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      setToast({ 
        show: true, 
        message: error, 
        type: "error",
        title: "✗ Error"
      });
    }
  }, [error]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Form input handler
  const handlePaymentInputChange = useCallback((e) => {
    const { name, type, files, value } = e.target;

    if (type === 'file' && files?.[0]) {
      const selectedFile = files[0];

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setToast({ show: true, message: "File size must be less than 5MB", type: "error" });
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setToast({ show: true, message: "Only images (JPEG, PNG, GIF) and PDF files are allowed", type: "error" });
        return;
      }

      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }

      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImagePreview(imageUrl);
      setPaymentFormData(prev => ({ ...prev, [name]: selectedFile }));
    } else {
      setPaymentFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [selectedImagePreview]);

  // Close modal handler
  const closePaymentModal = useCallback(() => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview(null);
    }
    // Navigate back or close modal
    navigate(-1);
  }, [selectedImagePreview, navigate]);

  // Success handler for Redux action
  const handleSuccess = useCallback((response) => {
    // Store success data for display in account
    setSuccessData({
      orderId: response?.data?.order_id || response?.order_id,
      seller: response?.data?.seller_name || response?.seller_name,
      gig: response?.data?.gig_title || response?.gig_title,
      amount: response?.data?.amount || response?.amount,
      timestamp: new Date().toISOString()
    });

    setToast({ 
      show: true, 
      message: response?.data?.message || "Transaction completed successfully!", 
      type: "success",
      title: "✓ Success"
    });
    
    // Reset form
    setPaymentFormData({
      username: "",
      email: "",
      password: "",
      amount: "",
      file: null
    });
    
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview(null);
    }

    // PERF: store timeout id; clear on unmount to avoid navigate after user left
    if (successNavigateTimeoutRef.current) {
      clearTimeout(successNavigateTimeoutRef.current);
      successNavigateTimeoutRef.current = null;
    }
    successNavigateTimeoutRef.current = setTimeout(() => {
      successNavigateTimeoutRef.current = null;
      navigate("/payment/success");
    }, 2500);
  }, [selectedImagePreview, navigate]);

  // Error handler for Redux action
  const handleError = useCallback((error) => {
    let errorMessage = "An error occurred";
    if (error?.payload) {
      errorMessage = typeof error.payload === 'string' ? error.payload : error.payload?.message || errorMessage;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    setToast({ 
      show: true, 
      message: errorMessage, 
      type: "error",
      title: "✗ Error"
    });
  }, []);

  // Fast checkout handler
  const handleFastCheckout = async (e) => {
    e.preventDefault();

    if (!paymentFormData.file) {
      setToast({ 
        show: true, 
        message: "Please upload a receipt", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    if (!sellerId || !gig_id || !package_id) {
      setToast({ 
        show: true, 
        message: "Missing required parameters (seller_id, gig_id, package_id)", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('seller_id', sellerId);
      formData.append('gig_id', gig_id);
      formData.append('package_id', package_id);
      formData.append('payment_method', 'bank_transfer');
      formData.append('transfer_receipt', paymentFormData.file);
      formData.append('status', 'pending_verification');

      const response = await dispatch(AcceptOfferRequest(formData)).unwrap();
      setIsProcessing(false);
      handleSuccess(response);
    } catch (error) {
      setIsProcessing(false);
      handleError(error);
    }
  };

  // Card payment handler
  const handleCardPayment = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['username', 'email', 'password', 'amount'];
    const missingFields = requiredFields.filter(field => !paymentFormData[field]?.toString().trim());
    
    if (missingFields.length > 0) {
      setToast({ 
        show: true, 
        message: `Please fill in: ${missingFields.join(', ')}`, 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paymentFormData.email)) {
      setToast({ 
        show: true, 
        message: "Please enter a valid email address", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    // Amount validation
    const amount = parseFloat(paymentFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      setToast({ 
        show: true, 
        message: "Please enter a valid amount greater than 0", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    // PIN validation
    if (paymentFormData.password.length < 4 || paymentFormData.password.length > 6) {
      setToast({ 
        show: true, 
        message: "Card PIN must be 4-6 digits", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    if (!sellerId || !gig_id || !package_id) {
      setToast({ 
        show: true, 
        message: "Missing required parameters (seller_id, gig_id, package_id)", 
        type: "error",
        title: "✗ Error"
      });
      return;
    }

    try {
      setIsProcessing(true);
      const paymentData = {
        paymentMethod: 'card',
        cardDetails: {
          holderName: paymentFormData.username.trim(),
          email: paymentFormData.email.trim(),
          amount: amount,
          pin: paymentFormData.password
        },
        seller_id: sellerId,
        gig_id,
        package_id
      };

      const response = await dispatch(AcceptOfferRequest(paymentData)).unwrap();
      setIsProcessing(false);

      // Handle payment form HTML response
      if (response?.payment_form_html) {
        const paymentWindow = window.open("", "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");
        if (paymentWindow) {
          paymentWindow.document.open();
          paymentWindow.document.write(response.payment_form_html);
          paymentWindow.document.close();
          
          // PERF: store interval id; clear on unmount to avoid setToast after navigate-away
          if (paymentWindowIntervalRef.current) {
            clearInterval(paymentWindowIntervalRef.current);
            paymentWindowIntervalRef.current = null;
          }
          paymentWindowIntervalRef.current = setInterval(() => {
            if (paymentWindow.closed) {
              if (paymentWindowIntervalRef.current) {
                clearInterval(paymentWindowIntervalRef.current);
                paymentWindowIntervalRef.current = null;
              }
              setToast({ 
                show: true, 
                message: "Payment window closed. Please check your payment status.", 
                type: "info",
                title: "ℹ Info"
              });
            }
          }, 1000);
        } else {
          setToast({ 
            show: true, 
            message: "Please allow popups to complete payment", 
            type: "error",
            title: "✗ Error"
          });
        }
      } else {
        // If no payment form HTML, treat as success
        handleSuccess(response);
      }
    } catch (error) {
      setIsProcessing(false);
      handleError(error);
    }
  };

  // Close toast handler
  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
      if (paymentWindowIntervalRef.current) {
        clearInterval(paymentWindowIntervalRef.current);
        paymentWindowIntervalRef.current = null;
      }
      if (successNavigateTimeoutRef.current) {
        clearTimeout(successNavigateTimeoutRef.current);
        successNavigateTimeoutRef.current = null;
      }
    };
  }, [selectedImagePreview]);

  return (
    <>
      <Navbar FirstNav="none" />
      <div 
        className="container-fluid p-lg-5 p-md-4 p-3 pt-5"
        style={{ 
          backgroundColor: GRAPE_TASK_THEME.backgrounds.mainBg,
          minHeight: '100vh'
        }}
      >
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 
              className="font-500 mb-0"
              style={{ 
                color: GRAPE_TASK_THEME.text.pureWhite,
                fontFamily: 'poppins, sans-serif'
              }}
            >
              Add payment method
            </h5>
            <Button 
              onClick={closePaymentModal} 
              disabled={isLoading || isProcessing}
              sx={{
                color: GRAPE_TASK_THEME.text.pureWhite,
                '&:hover': {
                  backgroundColor: GRAPE_TASK_THEME.accents.secondaryBlueBlur
                }
              }}
            >
              ✕
            </Button>
          </div>

          <div className="row">
            {/* Payment Method Selection */}
            <div className="col-lg-4 col-md-4 col-12 mb-4">
              <div 
                className="nav flex-column nav-pills p-3 rounded-3 h-100"
                style={{ 
                  backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBg,
                  border: `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`
                }}
              >
                <button
                  className={`nav-link d-flex align-items-center mb-2 rounded-2`}
                  onClick={() => setPaymentMethod('fast-checkout')}
                  disabled={isLoading || isProcessing}
                  style={{
                    backgroundColor: paymentMethod === 'fast-checkout' ? GRAPE_TASK_THEME.backgrounds.cardBgActive : 'transparent',
                    border: paymentMethod === 'fast-checkout' ? `2px solid ${GRAPE_TASK_THEME.accents.primaryOrange}` : `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`,
                    color: GRAPE_TASK_THEME.text.pureWhite,
                    cursor: isLoading || isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className="me-3">
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: paymentMethod === 'fast-checkout' ? GRAPE_TASK_THEME.accents.primaryOrange : GRAPE_TASK_THEME.text.bodyGrayText,
                        border: `2px solid ${paymentMethod === 'fast-checkout' ? GRAPE_TASK_THEME.accents.primaryOrange : GRAPE_TASK_THEME.text.bodyGrayText}`
                      }}
                    ></div>
                  </div>
                  <div>
                    <h6 
                      className="mb-0 font-16 font-500"
                      style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                    >
                      Fast Checkout
                    </h6>
                  </div>
                </button>

                <button
                  className={`nav-link d-flex align-items-center mb-2 rounded-2`}
                  onClick={() => setPaymentMethod('card')}
                  disabled={isLoading || isProcessing}
                  style={{
                    backgroundColor: paymentMethod === 'card' ? GRAPE_TASK_THEME.backgrounds.cardBgActive : 'transparent',
                    border: paymentMethod === 'card' ? `2px solid ${GRAPE_TASK_THEME.accents.primaryOrange}` : `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`,
                    color: GRAPE_TASK_THEME.text.pureWhite,
                    cursor: isLoading || isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className="me-3">
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: paymentMethod === 'card' ? GRAPE_TASK_THEME.accents.primaryOrange : GRAPE_TASK_THEME.text.bodyGrayText,
                        border: `2px solid ${paymentMethod === 'card' ? GRAPE_TASK_THEME.accents.primaryOrange : GRAPE_TASK_THEME.text.bodyGrayText}`
                      }}
                    ></div>
                  </div>
                  <div className="text-start">
                    <h6 
                      className="mb-0 font-16 font-500"
                      style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                    >
                      Payment Card
                    </h6>
                    <p 
                      className="mb-0 font-12"
                      style={{ color: GRAPE_TASK_THEME.text.bodyGrayText }}
                    >
                      Visa, Mastercard
                    </p>
                  </div>
                </button>

                <button
                  className={`nav-link d-flex align-items-center rounded-2`}
                  onClick={() => setPaymentMethod('paypal')}
                  disabled
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`,
                    color: GRAPE_TASK_THEME.text.bodyGrayText,
                    cursor: 'not-allowed'
                  }}
                >
                  <div className="me-3">
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: GRAPE_TASK_THEME.text.bodyGrayText,
                        border: `2px solid ${GRAPE_TASK_THEME.text.bodyGrayText}`
                      }}
                    ></div>
                  </div>
                  <div>
                    <h6 
                      className="mb-0 font-16"
                      style={{ color: GRAPE_TASK_THEME.text.bodyGrayText }}
                    >
                      PayPal
                    </h6>
                    <small style={{ color: GRAPE_TASK_THEME.text.darkGrayNumber }}>(Coming Soon)</small>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="col-lg-8 col-md-8 col-12">
              <div 
                className="p-4 rounded-3 h-100"
                style={{ 
                  backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBg,
                  border: `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`
                }}
              >
{/* Fast Checkout Form - Pro Fintech Style */}
{paymentMethod === 'fast-checkout' && (
  <div className="animate__animated animate__fadeInUp">
    <div className="d-flex align-items-center mb-4 mt-2">
      <div 
        style={{ 
          backgroundColor: GRAPE_TASK_THEME.accents.primaryOrange, 
          width: '6px', height: '28px', borderRadius: '4px', marginRight: '15px',
          boxShadow: `0 0 20px ${GRAPE_TASK_THEME.accents.primaryOrange}80`
        }} 
      />
      <div>
        <h6 className="font-700 font-24 poppins mb-0" style={{ color: '#fff', lineHeight: 1 }}>
          Bank Transfer Details
        </h6>
        <small style={{ color: GRAPE_TASK_THEME.text.bodyGrayText }}>Transfer funds and upload your receipt below</small>
      </div>
    </div>

    {/* Bank Info Cards */}
    <div className="row g-3">
      {[
        { label: "Account Title", value: "GrapeTask (Private) Limited", icon: <Person fontSize="small" /> },
        { label: "Account Number", value: "021720016063135", icon: <Pin fontSize="small" /> },
        { label: "IBAN Number", value: "PK945ONE0021720016063135", icon: <Public fontSize="small" /> },
        { label: "Bank Name", value: "SONERI BANK LTD", icon: <AccountBalance fontSize="small" /> },
      ].map((item, index) => (
        <div className="col-lg-6 col-12" key={index}>
          <div 
            className="payment-card-premium p-3 rounded-4"
            onClick={() => {
              navigator.clipboard.writeText(item.value);
              setToast({ show: true, message: `${item.label} copied!`, type: "success", title: "Success" });
            }}
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.02)", 
              border: `1px solid rgba(255, 255, 255, 0.08)`,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(240, 89, 31, 0.06)";
              e.currentTarget.style.borderColor = GRAPE_TASK_THEME.accents.primaryOrange;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div 
                  className="icon-wrapper p-2 rounded-3 me-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(240, 89, 31, 0.1)', color: GRAPE_TASK_THEME.accents.primaryOrange }}
                >
                  {item.icon}
                </div>
                <div>
                  <small className="poppins font-600" style={{ color: GRAPE_TASK_THEME.text.bodyGrayText, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {item.label}
                  </small>
                  <div className="font-600 font-16 poppins mt-1" style={{ color: '#fff', wordBreak: 'break-all' }}>
                    {item.value}
                  </div>
                </div>
              </div>
              <ContentCopy sx={{ fontSize: 16, color: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Modern Upload Section */}
    <div className="mt-5 pt-4" style={{ borderTop: `1px solid rgba(255,255,255,0.05)` }}>
      <div 
        className="upload-drop-zone rounded-4 p-5 d-flex flex-column align-items-center justify-content-center"
        onClick={() => document.getElementById('transferFile').click()}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.01)",
          border: `2px dashed ${selectedImagePreview ? GRAPE_TASK_THEME.accents.primaryOrange : 'rgba(240, 89, 31, 0.3)'}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: '200px'
        }}
      >
        {/* CRITICAL FIX: name="file" attribute added here */}
        <input 
          type="file" 
          id="transferFile" 
          name="file" 
          hidden 
          accept="image/*,.pdf" 
          onChange={handlePaymentInputChange} 
        />
        
        {selectedImagePreview ? (
          <div className="text-center animate__animated animate__fadeIn">
            <div className="position-relative d-inline-block">
              <img 
                src={selectedImagePreview} 
                style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '16px', border: `2px solid ${GRAPE_TASK_THEME.accents.primaryOrange}` }} 
                alt="Receipt" 
              />
              <div style={{ position: 'absolute', top: -10, right: -10, backgroundColor: '#22c55e', borderRadius: '50%', color: '#fff', padding: '2px', display: 'flex' }}>
                <CheckCircle sx={{ fontSize: 24 }} />
              </div>
            </div>
            <p className="mt-3 font-600 poppins mb-0" style={{ color: '#fff' }}>Receipt Selected Successfully</p>
            <small style={{ color: GRAPE_TASK_THEME.accents.primaryOrange, cursor: 'pointer' }}>Click to change file</small>
          </div>
        ) : (
          <>
            <div className="mb-3 p-3 rounded-circle" style={{ backgroundColor: 'rgba(240, 89, 31, 0.1)', color: GRAPE_TASK_THEME.accents.primaryOrange }}>
              <CloudUpload sx={{ fontSize: 40 }} />
            </div>
            <h6 className="font-600 poppins" style={{ color: '#fff' }}>Upload Payment Proof</h6>
            <p className="font-13 text-center mb-0" style={{ color: GRAPE_TASK_THEME.text.bodyGrayText }}>
              Click to browse or drag your receipt here
            </p>
          </>
        )}
      </div>
    </div>

    {/* Button with fixed logic */}
    <Button
      fullWidth
      variant="contained"
      onClick={handleFastCheckout}
      disabled={isLoading || isProcessing || !paymentFormData.file}
      sx={{
        mt: 4, py: 2,
        borderRadius: '14px',
        fontSize: '16px', fontWeight: 700,
        backgroundColor: GRAPE_TASK_THEME.accents.primaryOrange,
        color: '#fff',
        '&:hover': {
          backgroundColor: '#ff6b3d',
          transform: 'translateY(-2px)',
          boxShadow: `0 10px 20px rgba(240, 89, 31, 0.4)`,
        },
        '&:disabled': {
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.2)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {isLoading || isProcessing ? (
        <CircularProgress size={24} sx={{ color: '#fff' }} />
      ) : (
        'SUBMIT PAYMENT PROOF'
      )}
    </Button>
  </div>
)}
                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleCardPayment}>
                    <h6 
                      className="font-600 font-20 poppins mb-4"
                      style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                    >
                      Payment Card Details
                    </h6>

                    <div className="row">
                      <div className="col-md-6 col-12 mb-3">
                        <label 
                          htmlFor="username" 
                          className="form-label"
                          style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                        >
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-control"
                          value={paymentFormData.username}
                          onChange={handlePaymentInputChange}
                          required
                          disabled={isLoading || isProcessing}
                          placeholder="Enter full name as on card"
                          style={{
                            backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBgActive,
                            borderColor: GRAPE_TASK_THEME.borders.lightBorder,
                            color: GRAPE_TASK_THEME.text.pureWhite
                          }}
                        />
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        <label 
                          htmlFor="email" 
                          className="form-label"
                          style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          value={paymentFormData.email}
                          onChange={handlePaymentInputChange}
                          required
                          disabled={isLoading || isProcessing}
                          placeholder="your@email.com"
                          style={{
                            backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBgActive,
                            borderColor: GRAPE_TASK_THEME.borders.lightBorder,
                            color: GRAPE_TASK_THEME.text.pureWhite
                          }}
                        />
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        <label 
                          htmlFor="password" 
                          className="form-label"
                          style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                        >
                          Card PIN * <small style={{ color: GRAPE_TASK_THEME.text.bodyGrayText }}>(4-6 digits)</small>
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          value={paymentFormData.password}
                          onChange={handlePaymentInputChange}
                          maxLength={6}
                          minLength={4}
                          pattern="[0-9]{4,6}"
                          required
                          disabled={isLoading || isProcessing}
                          placeholder="Enter PIN"
                          style={{
                            backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBgActive,
                            borderColor: GRAPE_TASK_THEME.borders.lightBorder,
                            color: GRAPE_TASK_THEME.text.pureWhite
                          }}
                        />
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        <label 
                          htmlFor="amount" 
                          className="form-label"
                          style={{ color: GRAPE_TASK_THEME.text.pureWhite }}
                        >
                          Amount *
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          className="form-control"
                          value={paymentFormData.amount}
                          onChange={handlePaymentInputChange}
                          min="0.01"
                          step="0.01"
                          required
                          disabled={isLoading || isProcessing}
                          placeholder="0.00"
                          style={{
                            backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBgActive,
                            borderColor: GRAPE_TASK_THEME.borders.lightBorder,
                            color: GRAPE_TASK_THEME.text.pureWhite
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading || isProcessing}
                      startIcon={isLoading || isProcessing ? <CircularProgress size={20} /> : null}
                      sx={{
                        backgroundColor: GRAPE_TASK_THEME.accents.primaryOrange,
                        color: GRAPE_TASK_THEME.text.pureWhite,
                        '&:hover': {
                          backgroundColor: '#e04a1a'
                        },
                        '&:disabled': {
                          backgroundColor: GRAPE_TASK_THEME.text.darkGrayNumber,
                          color: GRAPE_TASK_THEME.text.bodyGrayText
                        }
                      }}
                    >
                      {isLoading || isProcessing ? 'Processing...' : 'Complete Payment'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div 
            className={`toast show position-fixed top-0 end-0 m-3`}
            style={{ 
              zIndex: 1055,
              backgroundColor: toast.type === 'success' 
                ? 'rgba(34, 197, 94, 0.9)' 
                : toast.type === 'error' 
                ? 'rgba(239, 68, 68, 0.9)' 
                : 'rgba(59, 130, 246, 0.9)',
              border: `1px solid ${toast.type === 'success' 
                ? GRAPE_TASK_THEME.accents.primaryOrange 
                : toast.type === 'error' 
                ? '#ef4444' 
                : '#3b82f6'}`,
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div 
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                padding: '12px 16px',
                borderBottom: `1px solid ${toast.type === 'success' 
                  ? GRAPE_TASK_THEME.accents.primaryOrange 
                  : toast.type === 'error' 
                  ? '#ef4444' 
                  : '#3b82f6'}`
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ color: GRAPE_TASK_THEME.text.pureWhite }}>
                  {toast.title}
                </strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseToast}
                  style={{ filter: 'brightness(1.2)' }}
                ></button>
              </div>
            </div>
            <div 
              style={{
                color: GRAPE_TASK_THEME.text.pureWhite,
                padding: '12px 16px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {toast.message}
            </div>
          </div>
        )}

 {/* Success Popup - Modern & Professional Update */}
{successData && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(2, 6, 23, 0.92)', // Deep dark overlay
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(12px)', // High-end glass effect
      padding: '20px'
    }}
  >
    <div
      className="animate__animated animate__zoomIn" // Smooth entry animation
      style={{
        background: "#0f172a", // Deep Navy/Black solid background
        border: `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`,
        padding: '48px 32px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        borderRadius: '24px',
        color: GRAPE_TASK_THEME.text.pureWhite,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}
    >
      {/* Top Close Icon (Optional) */}
      <button 
        onClick={() => setSuccessData(null)}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', color: GRAPE_TASK_THEME.text.bodyGrayText,
          cursor: 'pointer', fontSize: '18px'
        }}
      >
        ✕
      </button>

      {/* Animated Success Icon */}
      <div className="mb-4 d-flex justify-content-center">
        <div style={{
          width: '90px', height: '90px', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)', // Soft green glow
          borderRadius: '50%', display: 'flex', 
          alignItems: 'center', justifyContent: 'center',
          border: '2px solid #22c55e',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
        }}>
          <CheckCircle sx={{ fontSize: 50, color: '#22c55e' }} />
        </div>
      </div>

      <h3 className="poppins font-700 mb-2" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
        Order Created!
      </h3>
      
      <p className="poppins mb-4" style={{ color: GRAPE_TASK_THEME.text.mediumGrayTitle, fontSize: '15px', lineHeight: '1.6' }}>
        Thank you for choosing <span style={{ color: GRAPE_TASK_THEME.accents.primaryOrange, fontWeight: 600 }}>Grapetask</span>.<br />
        Your request is pending for approval. We'll notify you once it's verified.
      </p>

      {/* Action Buttons */}
      <div className="d-flex flex-column gap-3 mt-2">
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/order")} // Ya jo bhi aapka orders page hai
          sx={{
            py: 1.8,
            borderRadius: '14px',
            backgroundColor: GRAPE_TASK_THEME.accents.primaryOrange,
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: 'Poppins',
            boxShadow: `0 8px 20px ${GRAPE_TASK_THEME.accents.primaryOrange}40`,
            '&:hover': {
              backgroundColor: '#ff6b3d',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Track Order Status
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => setSuccessData(null)} // Sirf popup band karne ke liye
          sx={{
            py: 1.2,
            color: GRAPE_TASK_THEME.text.bodyGrayText,
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' }
          }}
        >
          Close and return
        </Button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default PaymentViaCard;