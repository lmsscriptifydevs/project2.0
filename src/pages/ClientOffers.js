import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import { 
    FaUser, FaCalendarAlt, 
    FaExternalLinkAlt, FaCheck, FaTimes 
} from "react-icons/fa";
import { Button, Modal, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Profilreviw from "../components/Profilreviw"; 
import Chating from "../components/frelancerChat/Chat/Chating"; 

// Redux Actions
import {
  clearConversationError,
  createOrFindConversation,
  setSelectedConversation,
} from "../redux/slices/messageSlice";

import axios from "../utils/axios";
import { Spinner } from "reactstrap";

const ClientOffers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { creatingConversation } = useSelector((state) => state.message);

    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isProcessing, setIsProcessing] = useState(null);

    const [bdModal, setBdModal] = useState(false);
    const [selectedBd, setSelectedBd] = useState(null);

    // ── Offer Detail Modal State ──
    const [offerDetailModal, setOfferDetailModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const handleShowBdProfile = (bdData) => {
        setSelectedBd(bdData);
        setBdModal(true);
    };

    const closeBdModal = () => {
        setBdModal(false);
        setSelectedBd(null);
    };

    // ── Offer Detail Modal Handlers ──
    const handleShowOfferDetail = (offer) => {
        setSelectedOffer(offer);
        setOfferDetailModal(true);
    };

    const closeOfferDetailModal = () => {
        setOfferDetailModal(false);
        setSelectedOffer(null);
    };

    const handleAcceptOffer = async (offer) => {
        const id = offer.user_id;
        const offerId = offer.id;
        setIsProcessing(offerId);
        try {
            const convResponse = await dispatch(
                createOrFindConversation({ participantId: id })
            ).unwrap();

            await axios.post("messages", {
                message_type: "offer",
                message: `Accepted Offer: $${offer.price} - ${offer.description}`,
                receiver_id: id,
                offer_id: offerId
            });

            dispatch(setSelectedConversation(convResponse));
            toast.success("Offer accepted! Opening chat...");
            setTimeout(() => { navigate(`/Inbox?id=${id}`); }, 1000);
        } catch (error) {
            toast.error("Failed to process offer.");
        } finally {
            setIsProcessing(null);
        }
    };

    const handleRejectOffer = async (offerId) => {
        if (!window.confirm("Kiya aap waqai ye offer reject kerna chahte hain?")) return;
        setIsProcessing(offerId);
        try {
            const res = await axios.post("reject-offer", { offerId });
            if (res.data.status) {
                toast.info("Offer rejected.");
                setOffers(prev => prev.filter(o => o.id !== offerId));
            }
        } catch (error) {
            toast.error("Error rejecting offer.");
        } finally {
            setIsProcessing(null);
        }
    };

    const checkAuthAndFetch = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) { navigate("/login"); return; }
        try {
            const authRes = await axios.get("auth/validate", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = authRes.data.user.role.toLowerCase();
            if (userRole.includes("client")) {
                setIsVerifying(false);
                const offerRes = await axios.get("buyer-offer-list", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (offerRes.data.status) { setOffers(offerRes.data.data || []); }
            } else { navigate("/dashboard"); }
        } catch (error) { navigate("/login"); }
        finally { setIsLoading(false); }
    }, [navigate]);

    useEffect(() => { checkAuthAndFetch(); }, [checkAuthAndFetch]);

    if (isVerifying) return <div className="text-center mt-5 pt-5"><Spinner color="primary" /></div>;

    return (
        <>
            <Navbar FirstNav="none" />
            <ToastContainer position="bottom-right" theme="dark" />

            <div className="offers-page-wrapper">
                <div className="container py-5">
                    
                    {/* --- Page Header --- */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-dark-subtle">
                        <div>
                            <h3 className="fw-bold gt-text-white mb-1">Your Proposals</h3>
                            <p className="gt-text-gray font-14 mb-0">Review and respond to offers from developers.</p>
                        </div>
                        <div className="offer-count-badge shadow-sm">
                            {offers.length} Active
                        </div>
                    </div>

                    {/* --- Loading / Empty State --- */}
                    {isLoading ? (
                        <div className="text-center py-5"><Spinner color="#f0591f" /></div>
                    ) : offers.length === 0 ? (
                        <div className="gt-empty-state text-center p-5 mx-auto" style={{ maxWidth: '500px' }}>
                            <div className="empty-icon mb-3 opacity-50">📬</div>
                            <h5 className="gt-text-white mb-2">No offers yet</h5>
                            <p className="gt-text-gray font-14 mb-0">Wait for developers to send you proposals. They will appear here once submitted.</p>
                        </div>
                    ) : (
                        /* --- GRID LAYOUT FOR COMPACT CARDS --- */
                        <div className="row g-4">
                            {offers.map((offer) => (
                                <div key={offer.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="gt-compact-card h-100 d-flex flex-column p-3">
                                        
                                        {/* Top Row: BD Info & Price */}
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                            {/* BD Profile Info */}
                                            <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => handleShowBdProfile(offer.business)}>
                                                <div className="compact-avatar-wrapper flex-shrink-0">
                                                    {offer.business?.image ? (
                                                        <img src={offer.business.image} alt="BD" />
                                                    ) : (
                                                        <div className="avatar-placeholder"><FaUser size={12} /></div>
                                                    )}
                                                    <div className="online-dot"></div>
                                                </div>
                                                <div className="text-truncate">
                                                    <h6 className="mb-0 fw-bold gt-text-white hover-orange font-14 text-truncate">
                                                        {offer.business?.fname} {offer.business?.lname}
                                                    </h6>
                                                    <span className="gt-text-gray font-11 d-flex align-items-center gap-1 mt-1">
                                                        <FaCalendarAlt size={10} /> {offer.date}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price & Status */}
                                            <div className="text-end flex-shrink-0">
                                                <h5 className="mb-1 fw-bold text-success font-16">${offer.price}</h5>
                                                <span className="compact-status">PROPOSAL</span>
                                            </div>
                                        </div>

                                        {/* Middle Row: Description (Flex Grow forces footer to bottom) */}
                                        <div className="description-text flex-grow-1 mb-3">
                                            <p className="mb-0 font-13 gt-text-body line-clamp-3" title={offer.description}>
                                                {offer.description}
                                            </p>
                                        </div>

                                        {/* Bottom Row: Actions (mt-auto pushes it to bottom) */}
                                        <div className="mt-auto pt-3 border-top border-dark-subtle d-flex justify-content-between align-items-center">
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="gt-btn-sm gt-btn-primary d-flex align-items-center gap-1 shadow-sm"
                                                    onClick={() => handleAcceptOffer(offer)}
                                                    disabled={isProcessing === offer.id}
                                                >
                                                    {isProcessing === offer.id ? <Spinner size="sm" /> : <FaCheck size={11} />} 
                                                    Accept
                                                </button>
                                                <button 
                                                    className="gt-btn-sm gt-btn-secondary d-flex align-items-center gap-1"
                                                    onClick={() => handleShowOfferDetail(offer)}
                                                >
                                                    <FaExternalLinkAlt size={10} /> Details
                                                </button>
                                            </div>
                                            <button 
                                                className="gt-btn-sm-icon text-danger"
                                                onClick={() => handleRejectOffer(offer.id)}
                                                disabled={isProcessing === offer.id}
                                                title="Reject Offer"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Dark Theme Sidebar (Offcanvas) --- */}
            <Offcanvas 
                show={bdModal} 
                onHide={closeBdModal} 
                placement="end" 
                style={{ width: '450px', backgroundColor: '#020617', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
                <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-dark-subtle pb-3">
                    <Offcanvas.Title className="gt-text-white font-16 fw-bold d-flex align-items-center gap-2">
                        <FaUser className="gt-text-orange" size={14} /> Freelancer Profile
                    </Offcanvas.Title>
                </Offcanvas.Header>
                
                <Offcanvas.Body className="p-0 d-flex flex-column custom-scrollbar">
                    {selectedBd && (
                        <>
                            <div className="flex-grow-1 p-3">
                                <Profilreviw expertDetail={selectedBd} />
                            </div>
                            <div className="p-3 border-top border-dark-subtle" style={{ backgroundColor: '#020617' }}>
                                <button 
                                    className="gt-btn-primary w-100 py-2 font-14 fw-bold shadow-sm rounded-2"
                                    onClick={() => handleAcceptOffer({user_id: selectedBd.id, price: '---', description: 'Interested in your profile'})}
                                    disabled={isProcessing === selectedBd.id}
                                    style={{ border: 'none' }}
                                >
                                    {isProcessing === selectedBd.id ? <Spinner size="sm" /> : `MESSAGE ${selectedBd.fname?.toUpperCase()}`}
                                </button>
                            </div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

            {/* ── OFFER DETAIL MODAL ── */}
            <Modal 
                open={offerDetailModal} 
                onClose={closeOfferDetailModal}
                aria-labelledby="offer-detail-modal"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '95%', sm: '90%', md: '600px' },
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        bgcolor: '#0b0f1e',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.9)',
                        p: 0,
                        outline: 'none',
                    }}
                    className="offer-detail-modal-box"
                >
                    {selectedOffer && (
                        <>
                            {/* Modal Header */}
                            <div className="modal-header-custom p-4 border-bottom border-dark-subtle d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold gt-text-white mb-1 font-18">Offer Details</h5>
                                    <span className="gt-text-gray font-13">Full proposal information</span>
                                </div>
                                <button 
                                    onClick={closeOfferDetailModal}
                                    className="modal-close-btn"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4">
                                {/* Sender Info Section */}
                                <div className="detail-section mb-4">
                                    <h6 className="gt-text-orange font-13 fw-bold mb-3 section-label">
                                        <span className="label-line"></span> SENDER INFORMATION
                                    </h6>
                                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="modal-avatar-wrapper">
                                            {selectedOffer.business?.image ? (
                                                <img src={selectedOffer.business.image} alt="Sender" />
                                            ) : (
                                                <div className="avatar-placeholder-lg"><FaUser size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="gt-text-white font-16 fw-bold mb-1">
                                                {selectedOffer.business?.fname} {selectedOffer.business?.lname}
                                            </h6>
                                            <p className="gt-text-gray font-13 mb-1">
                                                @{selectedOffer.business?.user_name || 'username'}
                                            </p>
                                            {selectedOffer.business?.country && (
                                                <span className="gt-text-gray font-12 d-flex align-items-center gap-1">
                                                    🌍 {selectedOffer.business.country}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Offer Details Grid */}
                                <div className="detail-section mb-4">
                                    <h6 className="gt-text-orange font-13 fw-bold mb-3 section-label">
                                        <span className="label-line"></span> PROPOSAL DETAILS
                                    </h6>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">💰 Budget</span>
                                            <span className="detail-value text-success fw-bold">${selectedOffer.price}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">📅 Date</span>
                                            <span className="detail-value">{selectedOffer.date}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">🆔 Offer ID</span>
                                            <span className="detail-value font-mono">{selectedOffer.id}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">📋 Status</span>
                                            <span className="detail-value">
                                                <span className="status-badge-offer">PROPOSAL</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="detail-section mb-4">
                                    <h6 className="gt-text-orange font-13 fw-bold mb-3 section-label">
                                        <span className="label-line"></span> DESCRIPTION
                                    </h6>
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p className="gt-text-body font-14 mb-0 lh-lg" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {selectedOffer.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Info if available */}
                                {selectedOffer.business?.bio && (
                                    <div className="detail-section mb-4">
                                        <h6 className="gt-text-orange font-13 fw-bold mb-3 section-label">
                                            <span className="label-line"></span> ABOUT THE SENDER
                                        </h6>
                                        <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p className="gt-text-body font-13 mb-0 lh-lg">
                                                {selectedOffer.business.bio}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer-custom p-4 border-top border-dark-subtle d-flex gap-3">
                                <button 
                                    className="gt-btn-primary flex-grow-1 py-2 font-14 fw-bold rounded-2"
                                    onClick={() => {
                                        closeOfferDetailModal();
                                        handleAcceptOffer(selectedOffer);
                                    }}
                                    disabled={isProcessing === selectedOffer.id}
                                    style={{ border: 'none' }}
                                >
                                    {isProcessing === selectedOffer.id ? <Spinner size="sm" /> : '✓ Accept Proposal'}
                                </button>
                                <button 
                                    className="gt-btn-outline-modal flex-grow-1 py-2 font-14 fw-bold rounded-2"
                                    onClick={closeOfferDetailModal}
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>

            {/* ==========================================
                GRAPETASK DARK THEME - GRID COMPACT CSS
                ========================================== */}
            <style>{`
                /* Global Page Wrapper */
                .offers-page-wrapper {
                    background-color: #020617;
                    min-height: 100vh;
                }
                
                /* Typography & Utilities */
                .gt-text-white { color: #ffffff !important; }
                .gt-text-orange { color: #f0591f !important; }
                .gt-text-gray { color: #a1a1aa !important; }
                .gt-text-body { color: #d4d4d8 !important; }
                .border-dark-subtle { border-color: rgba(255, 255, 255, 0.08) !important; }
                .font-11 { font-size: 11px; }
                .font-12 { font-size: 12px; }
                .font-13 { font-size: 13px; }
                .font-14 { font-size: 14px; }
                .font-16 { font-size: 16px; }
                .cursor-pointer { cursor: pointer; }
                .text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* Header Badge */
                .offer-count-badge {
                    background: rgba(240, 89, 31, 0.1);
                    color: #f0591f;
                    border: 1px solid rgba(240, 89, 31, 0.2);
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 13px;
                }

                /* Empty State */
                .gt-empty-state {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                }
                .empty-icon { font-size: 50px; }

                /* GRID COMPACT CARD STYLE */
                .gt-compact-card {
                    background: #0b0f1e; 
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .gt-compact-card:hover {
                    border-color: rgba(240, 89, 31, 0.4);
                    background: #0f1426;
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                }

                /* Compact Avatars */
                .compact-avatar-wrapper {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    border: 1px solid rgba(240, 89, 31, 0.3);
                    position: relative;
                    padding: 2px;
                    background: rgba(240, 89, 31, 0.05);
                }
                .compact-avatar-wrapper img {
                    width: 100%; height: 100%; border-radius: 6px; object-fit: cover;
                }
                .avatar-placeholder {
                    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #a1a1aa;
                }
                .online-dot {
                    width: 10px; height: 10px; background: #22c55e; 
                    border: 2px solid #0b0f1e; border-radius: 50%;
                    position: absolute; bottom: -2px; right: -2px;
                }
                .hover-orange { transition: 0.2s; }
                .hover-orange:hover { color: #f0591f !important; }

                /* Status & Details */
                .compact-status {
                    font-size: 10px; font-weight: 700; padding: 3px 8px; 
                    background: rgba(59, 130, 246, 0.1); color: #60a5fa; 
                    border-radius: 6px; letter-spacing: 0.5px;
                }
                .description-text {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 10px;
                    border-radius: 8px;
                    border-left: 2px solid rgba(255, 255, 255, 0.1);
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3; 
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.5;
                }

                /* COMPACT BUTTONS */
                .gt-btn-sm {
                    font-size: 12px !important; 
                    padding: 6px 12px !important; 
                    border-radius: 6px !important;
                    font-weight: 600 !important;
                    transition: all 0.2s;
                }
                .gt-btn-primary {
                    background-color: #f0591f !important;
                    color: #ffffff !important;
                    border: 1px solid #f0591f !important;
                }
                .gt-btn-primary:hover {
                    background-color: #d84f1b !important;
                    border-color: #d84f1b !important;
                }
                .gt-btn-primary:disabled {
                    background-color: #52525b !important; border-color: #52525b !important; color: #a1a1aa !important;
                }
                
                .gt-btn-secondary {
                    background-color: transparent !important;
                    color: #d4d4d8 !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                }
                .gt-btn-secondary:hover {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    color: #ffffff !important;
                }

                /* Icon Only Button (Reject) */
                .gt-btn-sm-icon {
                    background: rgba(239, 68, 68, 0.1); 
                    border: 1px solid transparent; 
                    color: #ef4444;
                    width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 6px;
                    transition: 0.2s;
                }
                .gt-btn-sm-icon:hover { 
                    background: rgba(239, 68, 68, 0.2); 
                    border-color: rgba(239, 68, 68, 0.3);
                }

                /* Custom Scrollbar for Sidebar */
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                /* ── OFFER DETAIL MODAL STYLES ── */
                .offer-detail-modal-box::-webkit-scrollbar { width: 4px; }
                .offer-detail-modal-box::-webkit-scrollbar-track { background: transparent; }
                .offer-detail-modal-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

                .modal-close-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #a1a1aa;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modal-close-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: #ffffff;
                    border-color: rgba(255,255,255,0.2);
                }

                .section-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .label-line {
                    display: inline-block;
                    width: 30px;
                    height: 2px;
                    background: #f0591f;
                    border-radius: 2px;
                }

                .modal-avatar-wrapper {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 2px solid #f0591f;
                    padding: 3px;
                    background: rgba(240, 89, 31, 0.1);
                    flex-shrink: 0;
                }
                .modal-avatar-wrapper img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .avatar-placeholder-lg {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #a1a1aa;
                    background: rgba(255,255,255,0.05);
                    border-radius: 50%;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                @media (max-width: 500px) {
                    .detail-grid { grid-template-columns: 1fr; }
                }
                .detail-item {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 10px;
                    padding: 14px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .detail-label {
                    font-size: 12px;
                    color: #a1a1aa;
                    font-weight: 500;
                }
                .detail-value {
                    font-size: 15px;
                    color: #ffffff;
                    font-weight: 600;
                }
                .font-mono {
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    color: #a1a1aa;
                }

                .status-badge-offer {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 12px;
                    background: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                }

                .gt-btn-outline-modal {
                    background-color: transparent !important;
                    color: #d4d4d8 !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    transition: all 0.2s;
                }
                .gt-btn-outline-modal:hover {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    color: #ffffff !important;
                }
            `}</style>
        </>
    );
};

export default ClientOffers;