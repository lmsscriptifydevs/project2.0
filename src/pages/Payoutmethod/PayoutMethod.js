import React, { useState, useEffect, useCallback } from "react";
import {
  FaChevronLeft,
  FaMobileAlt,
  FaUniversity,
  FaCreditCard,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaMoneyBillWave,
  FaHistory
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../style/payout.css";
import Navbar from "../../components/Navbar";
import axios from "../../utils/axios";

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
  orangeBorderActive: "rgba(240, 89, 31, 0.4)"
};

const WALLET_OPTIONS = [
  { value: "JazzCash", label: "JazzCash", icon: FaMobileAlt, color: theme.primaryOrange },
  { value: "EasyPaisa", label: "EasyPaisa", icon: FaMobileAlt, color: "#22c55e" },
  { value: "NayaPay", label: "NayaPay", icon: FaUniversity, color: "#3b82f6" },
  { value: "SadaPay", label: "SadaPay", icon: FaCreditCard, color: "#8b5cf6" },
  { value: "Bank Transfer", label: "Bank Transfer", icon: FaUniversity, color: "#f59e0b" },
  { value: "Other", label: "Other Wallet", icon: FaCreditCard, color: theme.lightGrayHover },
];

const getWalletConfig = (walletType) => {
  const wt = (walletType || "").toLowerCase();
  if (wt.includes("jazzcash")) return WALLET_OPTIONS[0];
  if (wt.includes("easypaisa")) return WALLET_OPTIONS[1];
  if (wt.includes("nayapay")) return WALLET_OPTIONS[2];
  if (wt.includes("sadapay")) return WALLET_OPTIONS[3];
  if (wt.includes("bank")) return WALLET_OPTIONS[4];
  return WALLET_OPTIONS[5];
};

const PayoutMethod = () => {
  const navigate = useNavigate();
  const [savedWallets, setSavedWallets] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);

  // Data States
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);

  const [form, setForm] = useState({
    wallet_type: "JazzCash",
    custom_wallet_name: "", 
    mobile_number: "",
    account_title: "",
  });

  // --- Fetch Data ---
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      try {
        const summaryRes = await axios.get("earnings/summary");
        if (summaryRes.data) {
          setAvailableBalance(Number(summaryRes.data.balance || 0));
        }
      } catch (err) {
        console.error("Balance fetch error", err);
      }

      const payoutRes = await axios.get("get-payout-method");
      if (payoutRes.data.status && payoutRes.data.data) {
        const data = payoutRes.data.data;
        const walletsArray = Array.isArray(data) ? data : [data];
        setSavedWallets(walletsArray);
      } else {
        setSavedWallets([]);
      }

      const historyRes = await axios.get("withdraw/history");
      if (historyRes.data.success && historyRes.data.data) {
        // Handle both older { data: { data: [] } } format and newer { data: [] } format
        const dataArr = Array.isArray(historyRes.data.data) ? historyRes.data.data : historyRes.data.data.data;
        setWithdrawalHistory(dataArr || []);
      }

    } catch (error) {
      if (error?.response?.status !== 404) {
        console.error("Error fetching data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Silent auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      axios.get("withdraw/history")
        .then((historyRes) => {
          if (historyRes.data.success && historyRes.data.data) {
            const dataArr = Array.isArray(historyRes.data.data) ? historyRes.data.data : historyRes.data.data.data;
            setWithdrawalHistory(dataArr || []);
          }
        })
        .catch(() => {});

      axios.get("earnings/summary")
        .then((summaryRes) => {
          if (summaryRes.data) {
            setAvailableBalance(Number(summaryRes.data.balance || 0));
          }
        })
        .catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const isCustomMethod = form.wallet_type === "Bank Transfer" || form.wallet_type === "Other";

  // --- Save / Update Method ---
  const handleSaveMethod = async (e) => {
    e.preventDefault();

    if (isCustomMethod && !form.custom_wallet_name) {
      toast.error(`Please enter your ${form.wallet_type === "Bank Transfer" ? "Bank" : "Wallet"} Name`);
      return;
    }

    setIsSaving(true);
    try {
      const finalWalletType = isCustomMethod 
        ? `${form.wallet_type} - ${form.custom_wallet_name}` 
        : form.wallet_type;

      const payload = {
        wallet_type: finalWalletType,
        mobile_number: form.mobile_number,
        account_title: form.account_title
      };

      let response;
      if (editingWallet) {
        response = await axios.post("update-payout-method", {
          wallet_id: editingWallet.id,
          ...payload,
        });
      } else {
        response = await axios.post("save-payout-method", payload);
      }

      if (response.data.status) {
        toast.success(response.data.message);
        resetForm();
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE METHOD ---
  const handleDeleteMethod = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
      const response = await axios.post("delete-payout-method", { wallet_id: id });
      if (response.data.status) {
        toast.success(response.data.message);
        if (selectedWalletId === id) setSelectedWalletId(null);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  // --- Withdraw Modal & Request ---
  const initiateWithdrawal = () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (savedWallets.length === 0) {
      toast.error("Please add a payout account first");
      return;
    }
    if (Number(withdrawAmount) > availableBalance) {
      toast.error("Amount exceeds available balance!");
      return;
    }

    setSelectedWalletId(savedWallets[0].id);
    setShowWithdrawModal(true);
  };

  const handleWithdrawRequest = async () => {
    const selectedWallet = savedWallets.find(w => w.id === selectedWalletId);
    if (!selectedWallet) return;

    setIsWithdrawing(true);
    try {
      const payload = {
        amount: Number(withdrawAmount),
        note: `Requested via ${selectedWallet.wallet_type}`, 
        paymentMethod: "bank", 
        bankAccountNumber: selectedWallet.mobile_number,
        routingNumber: "00000", 
        accountHolderName: selectedWallet.account_title,
        isFast: false
      };

      const response = await axios.post("withdraw/request", payload);

      if (response.data.success) {
        toast.success(response.data.message);
        setWithdrawAmount("");
        setShowWithdrawModal(false);
        fetchData(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal request failed");
      setShowWithdrawModal(false);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const resetForm = () => {
    setForm({ wallet_type: "JazzCash", custom_wallet_name: "", mobile_number: "", account_title: "" });
    setShowForm(false);
    setEditingWallet(null);
  };

  const startEdit = (wallet) => {
    setEditingWallet(wallet);

    let type = wallet.wallet_type;
    let customName = "";

    if (type.includes("Bank Transfer - ")) {
      type = "Bank Transfer";
      customName = wallet.wallet_type.replace("Bank Transfer - ", "");
    } else if (type.includes("Other - ")) {
      type = "Other";
      customName = wallet.wallet_type.replace("Other - ", "");
    }

    setForm({
      wallet_type: type,
      custom_wallet_name: customName,
      mobile_number: wallet.mobile_number,
      account_title: wallet.account_title,
    });
    setShowForm(true);
  };

  // Common Input Style for Dark Theme
  const inputStyle = {
    backgroundColor: theme.mainBg,
    color: theme.pureWhite,
    border: `1px solid ${theme.mediumBorder}`,
  };

  return (
    <>
      <Navbar FirstNav="none" />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" 
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div className="p-4 rounded-3 shadow poppins text-center" style={{ width: '90%', maxWidth: '600px', backgroundColor: theme.mainBg, border: `1px solid ${theme.lightBorder}` }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: theme.pureWhite }}>Payment Receipt</h5>
              <FaTimes className="cursor-pointer" style={{ color: theme.mediumGrayTitle }} onClick={() => setSelectedReceipt(null)} size={20} />
            </div>
            <div className="mb-4 d-flex justify-content-center align-items-center rounded-3 overflow-hidden p-2" style={{ border: `1px solid ${theme.mediumBorder}`, background: theme.cardBg }}>
              <img src={selectedReceipt} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }} />
            </div>
            <a href={selectedReceipt} download="Payment_Receipt.jpg" target="_blank" rel="noopener noreferrer" 
               className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm d-inline-block text-decoration-none"
               style={{ backgroundColor: '#22c55e', color: theme.pureWhite, border: 'none' }}>
              Download Receipt
            </a>
          </div>
        </div>
      )}

      {/* View Reason Modal */}
      {selectedReason && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" 
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div className="p-4 rounded-3 shadow poppins" style={{ width: '90%', maxWidth: '400px', backgroundColor: theme.mainBg, border: `1px solid ${theme.lightBorder}` }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: '#ef4444' }}>Reason for Rejection</h5>
              <FaTimes className="cursor-pointer" style={{ color: theme.mediumGrayTitle }} onClick={() => setSelectedReason(null)} size={20} />
            </div>
            <div className="p-3 rounded-3 mb-4 mt-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
              <p className="mb-0 font-15 text-start" style={{ lineHeight: '1.6' }}>{selectedReason}</p>
            </div>
            <button className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm"
              style={{ backgroundColor: theme.cardBgActive, color: theme.pureWhite, border: `1px solid ${theme.mediumBorder}` }}
              onClick={() => setSelectedReason(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" 
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div className="p-4 rounded-3 shadow poppins" style={{ width: '90%', maxWidth: '450px', backgroundColor: theme.mainBg, border: `1px solid ${theme.lightBorder}` }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0" style={{ color: theme.pureWhite }}>Select Account</h5>
              <FaTimes className="cursor-pointer" style={{ color: theme.mediumGrayTitle }} onClick={() => setShowWithdrawModal(false)} size={20} />
            </div>
            <p className="font-14 mb-4" style={{ color: theme.bodyGrayText }}>
              Where do you want to receive <strong style={{ color: theme.primaryOrange }}>${Number(withdrawAmount).toFixed(2)}</strong>?
            </p>
            <div className="d-flex flex-column gap-3 mb-4 custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {savedWallets.map((wallet) => {
                const config = getWalletConfig(wallet.wallet_type);
                const isSelected = selectedWalletId === wallet.id;
                return (
                  <div key={wallet.id} onClick={() => setSelectedWalletId(wallet.id)}
                    className="p-3 rounded-3 d-flex align-items-center cursor-pointer transition-all"
                    style={{ 
                      border: isSelected ? `1px solid ${theme.orangeBorderActive}` : `1px solid ${theme.mediumBorder}`, 
                      background: isSelected ? theme.cardBgActive : theme.cardBg 
                    }}>
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ width: 40, height: 40, background: `${config.color}20`, color: config.color }}>
                      <config.icon size={18} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold font-15" style={{ color: theme.pureWhite }}>{wallet.wallet_type}</p>
                      <p className="mb-0 font-12" style={{ color: theme.mediumGrayTitle }}>{wallet.account_title} • {wallet.mobile_number}</p>
                    </div>
                    {isSelected && <FaCheckCircle className="ms-2" style={{color: theme.primaryOrange}} size={20}/>}
                  </div>
                );
              })}
            </div>
            <button className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm"
              style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, border: 'none' }}
              disabled={isWithdrawing || !selectedWalletId}
              onClick={handleWithdrawRequest}>
              {isWithdrawing ? "Processing..." : "Confirm & Withdraw"}
            </button>
          </div>
        </div>
      )}

      {/* Main Container - Dark Theme Applied */}
      <div className="container-fluid p-lg-5 p-md-4 p-3 pt-5 poppins" style={{ backgroundColor: theme.mainBg, color: theme.pureWhite, minHeight: "100vh" }}>
        <h6 className="font-16 fw-semibold cursor-pointer mb-4" onClick={() => navigate(-1)} style={{ color: theme.lightGrayHover }}>
          <FaChevronLeft size={20} className="me-2" /> Back
        </h6>

        <div className="row g-4 justify-content-center">

          {/* Left Column: Manage Accounts List */}
          <div className="col-lg-7">
            <div className="p-4 rounded-3 shadow-sm h-100" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="font-20 fw-bold mb-0">Manage Accounts</h5>
                {!showForm && (
                  <button className="px-3 py-2 rounded-3 font-14 d-flex align-items-center" 
                          style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, border: 'none' }} 
                          onClick={() => setShowForm(true)}>
                    <FaPlus className="me-2" size={12} /> Add Account
                  </button>
                )}
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className="mb-4 p-4 rounded-3 position-relative" style={{ backgroundColor: theme.cardBgActive, border: `1px solid ${theme.lightBorder}` }}>
                  <FaTimes className="position-absolute top-0 end-0 m-3 cursor-pointer" style={{ color: theme.mediumGrayTitle }} onClick={resetForm} />
                  <h6 className="fw-bold mb-4">{editingWallet ? "Edit Account" : "Add New Account"}</h6>

                  <form onSubmit={handleSaveMethod}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label font-13 fw-medium" style={{ color: theme.lightGrayHover }}>Method</label>
                        <select className="form-select" style={inputStyle} value={form.wallet_type} onChange={(e) => setForm({...form, wallet_type: e.target.value})}>
                          {WALLET_OPTIONS.map(opt => <option key={opt.value} value={opt.value} style={{ backgroundColor: theme.mainBg }}>{opt.label}</option>)}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label font-13 fw-medium" style={{ color: theme.lightGrayHover }}>Account/IBAN/Mobile Number</label>
                        <input type="text" className="form-control" style={inputStyle} placeholder="Account Number" required value={form.mobile_number} onChange={(e) => setForm({...form, mobile_number: e.target.value})} />
                      </div>

                      {isCustomMethod && (
                        <div className="col-md-6">
                          <label className="form-label font-13 fw-medium" style={{ color: theme.lightGrayHover }}>
                            {form.wallet_type === "Bank Transfer" ? "Bank Name" : "Wallet Name"}
                          </label>
                          <input type="text" className="form-control" style={inputStyle} placeholder={form.wallet_type === "Bank Transfer" ? "e.g. HBL, Meezan" : "e.g. UPaisa"} 
                            required value={form.custom_wallet_name} onChange={(e) => setForm({...form, custom_wallet_name: e.target.value})} />
                        </div>
                      )}

                      <div className={isCustomMethod ? "col-md-6" : "col-12"}>
                        <label className="form-label font-13 fw-medium" style={{ color: theme.lightGrayHover }}>Account Holder Name</label>
                        <input type="text" className="form-control" style={inputStyle} placeholder="Name on account" required value={form.account_title} onChange={(e) => setForm({...form, account_title: e.target.value})} />
                      </div>

                      <div className="col-12 mt-4">
                        <button className="px-4 py-2 rounded-3 w-100 fw-semibold" style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, border: 'none' }} disabled={isSaving}>
                          {isSaving ? "Saving..." : editingWallet ? "Update Account" : "Save Account"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Scrollable Methods List */}
              {isLoading ? (
                <div className="text-center py-5"><div className="spinner-border" style={{ color: theme.primaryOrange }}></div></div>
              ) : (
                <div className="d-flex flex-column gap-3 custom-scrollbar" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                  {savedWallets.length === 0 ? (
                    <div className="text-center py-5 rounded-3" style={{ border: `1px dashed ${theme.mediumBorder}` }}>
                       <p className="mb-0" style={{ color: theme.bodyGrayText }}>No accounts added yet. Please add one.</p>
                    </div>
                  ) : (
                    savedWallets.map((wallet) => {
                      const config = getWalletConfig(wallet.wallet_type);
                      return (
                        <div key={wallet.id} className="p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: theme.cardBgActive, border: `1px solid ${theme.mediumBorder}` }}>
                          <div className="d-flex align-items-center">
                            <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" 
                              style={{ width: 48, height: 48, background: `${config.color}20`, color: config.color }}>
                              <config.icon size={22} />
                            </div>
                            <div>
                              <p className="mb-0 fw-bold font-16" style={{ color: theme.pureWhite }}>{wallet.wallet_type}</p>
                              <p className="mb-0 font-13" style={{ color: theme.mediumGrayTitle }}>{wallet.account_title} • {wallet.mobile_number}</p>
                            </div>
                          </div>

                          {/* EDIT AND DELETE BUTTONS */}
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                                    style={{ width: 35, height: 35, backgroundColor: 'transparent', border: `1px solid ${theme.lightBorder}`, color: theme.lightGrayHover }} 
                                    onClick={() => startEdit(wallet)}>
                              <FaEdit size={14} />
                            </button>
                            <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                                    style={{ width: 35, height: 35, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }} 
                                    onClick={(e) => handleDeleteMethod(e, wallet.id)}>
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Withdraw Action */}
          <div className="col-lg-5">
            <div className="p-4 rounded-3 shadow-sm h-100" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
              <h5 className="font-18 fw-bold mb-4">Request Withdrawal</h5>

              <div className="mb-4 p-3 rounded-3 text-center" style={{ background: theme.cardBgActive, border: `1px dashed ${theme.mediumBorder}` }}>
                <p className="font-14 mb-1" style={{ color: theme.mediumGrayTitle }}>Available Balance</p>
                <h2 className="fw-bold mb-0" style={{ color: theme.primaryOrange }}>${availableBalance.toFixed(2)}</h2>
              </div>

              <div className="mb-4">
                <label className="form-label font-14 fw-semibold" style={{ color: theme.lightGrayHover }}>Amount to Withdraw ($)</label>
                <div className="input-group input-group-lg" style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.mediumBorder}` }}>
                  <span className="input-group-text border-0" style={{ backgroundColor: theme.cardBgActive, color: theme.primaryOrange }}><FaMoneyBillWave /></span>
                  <input type="number" className="form-control border-0 fw-bold" placeholder="0.00"
                    style={{ backgroundColor: theme.cardBgActive, color: theme.pureWhite }}
                    value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                </div>
              </div>

              <button className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm"
                style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, border: 'none' }}
                onClick={initiateWithdrawal}>
                Withdraw Now
              </button>
            </div>
          </div>
        </div>

        {/* Withdrawal History Section */}
        <div className="row mt-4 justify-content-center">
          <div className="col-lg-12">
            <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
              <h5 className="font-18 fw-bold mb-4 d-flex align-items-center">
                <FaHistory className="me-2" style={{ color: theme.primaryOrange }} /> Withdrawal History
              </h5>
              <div className="table-responsive">
                <table className="table align-middle" style={{ color: theme.pureWhite }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.lightBorder}` }}>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Date</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Method</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Amount</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Fee</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Net Amount</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600' }}>Status</th>
                      <th style={{ backgroundColor: 'transparent', color: theme.mediumGrayTitle, fontWeight: '600', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4" style={{ color: theme.bodyGrayText, backgroundColor: 'transparent', borderBottom: 'none' }}>
                          No withdrawal history found.
                        </td>
                      </tr>
                    ) : (
                      withdrawalHistory.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${theme.lightBorder}` }}>
                          <td className="font-14" style={{ backgroundColor: 'transparent', color: theme.lightGrayHover }}>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="font-14 fw-medium" style={{ backgroundColor: 'transparent', color: theme.pureWhite }}>{item.note || item.payment_method}</td>
                          <td className="font-14 fw-bold" style={{ backgroundColor: 'transparent', color: theme.pureWhite }}>${Number(item.amount).toFixed(2)}</td>
                          <td className="font-14" style={{ backgroundColor: 'transparent', color: '#ef4444' }}>${Number(item.processing_fee).toFixed(2)}</td>
                          <td className="font-14 fw-bold" style={{ backgroundColor: 'transparent', color: theme.primaryOrange }}>${Number(item.net_amount).toFixed(2)}</td>
                          <td style={{ backgroundColor: 'transparent' }}>
                            <span className={`badge px-3 py-2 rounded-pill`} 
                                  style={{ 
                                    backgroundColor: item.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : item.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    color: item.status === 'completed' ? '#4ade80' : item.status === 'pending' ? '#fbbf24' : '#ef4444',
                                    border: `1px solid ${item.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' : item.status === 'pending' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                  }}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ backgroundColor: 'transparent', textAlign: 'center' }}>
                            {item.status === 'completed' && item.screenshot_url && (
                              <button className="btn btn-sm rounded-pill font-13 fw-medium transition-all" 
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)' }} 
                                onClick={() => setSelectedReceipt(item.screenshot_url)}>
                                View Receipt
                              </button>
                            )}
                            {item.status === 'rejected' && item.rejection_reason && (
                              <button className="btn btn-sm rounded-pill font-13 fw-medium transition-all" 
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }} 
                                onClick={() => setSelectedReason(item.rejection_reason)}>
                                View Reason
                              </button>
                            )}
                            {item.status === 'pending' && (
                              <span style={{ color: theme.mediumGrayTitle, fontSize: '13px' }}>-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutMethod;