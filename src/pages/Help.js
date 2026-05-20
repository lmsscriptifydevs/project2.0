import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Table } from "reactstrap";
import { FaPlus, FaCloudUploadAlt, FaCommentDots } from "react-icons/fa";
import { useUserData } from "../utils/useLocalStorage";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HOST_API } from "../config";

const DisputeCenter = () => {
    const UserData = useUserData();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // API & UI States
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form States
    const [disputeType, setDisputeType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [attachedFile, setAttachedFile] = useState(null);
    const [fileName, setFileName] = useState("No file chosen");

    // base URL for your portal (uses local API in development)
    const BASE_URL = (HOST_API || "https://portal.grapetask.co/api").replace(/\/$/, "");

    // 1. Fetch Disputes with AbortController
    useEffect(() => {
        let cancelled = false;
        const ac = new AbortController();

        const fetchDisputes = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
                
                const res = await axios.get(`${BASE_URL}/disputes/list`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    signal: ac.signal,
                });

                if (!cancelled) {
                    setDisputes(res.data || []);
                }
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error("Error fetching disputes:", err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchDisputes();

        return () => {
            cancelled = true;
            ac.abort();
        };
    }, []);

    const toggleModal = () => setShowCreateModal(!showCreateModal);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setAttachedFile(file);
            setFileName(file.name);
        }
    };

    // 2. Submit Dispute Logic
    const handleSubmitDispute = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const formData = new FormData();
        
        formData.append("issue_type", disputeType);
        formData.append("description", `${title}: ${description}`);
        
        if (attachedFile) {
            formData.append("media[]", attachedFile);
        }

        try {
            await axios.post(`${BASE_URL}/disputes/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }
            });

            toast.success("Dispute Created Successfully!");
            toggleModal();
            window.location.reload(); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            
            {/* ── PREMIUM DARK THEME STYLES ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

                :root {
                    --gt-main-bg: #020617;
                    --gt-card-bg: rgba(255, 255, 255, 0.02);
                    --gt-card-bg-active: rgba(255, 255, 255, 0.04);
                    --gt-orange: #f0591f;
                    --gt-orange-glow: rgba(240, 89, 31, 0.18);
                    --gt-orange-border: rgba(240, 89, 31, 0.4);
                    --gt-blue-blur: rgba(59, 130, 246, 0.05);
                    --gt-white: #ffffff;
                    --gt-gray-hover: #d4d4d8;
                    --gt-gray-title: #a1a1aa;
                    --gt-gray-body: #71717a;
                    --gt-gray-num: #52525b;
                    --gt-border-light: rgba(255, 255, 255, 0.06);
                    --gt-border-med: rgba(255, 255, 255, 0.07);
                }

                .gt-page-wrapper {
                    background-color: var(--gt-main-bg);
                    min-height: 100vh;
                    color: var(--gt-white);
                    font-family: 'DM Sans', sans-serif;
                }

                .gt-header-border { border-bottom: 1px solid var(--gt-border-light); }
                
                .gt-card {
                    background: var(--gt-card-bg);
                    border: 1px solid var(--gt-border-med);
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    overflow: hidden;
                }

                /* ── BEAUTIFUL BUTTONS ── */
                .gt-btn-primary {
                    background: linear-gradient(135deg, var(--gt-orange) 0%, #d94e18 100%);
                    color: var(--gt-white);
                    border: none;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px var(--gt-orange-glow);
                }
                .gt-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(240, 89, 31, 0.35);
                    color: var(--gt-white);
                }
                .gt-btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                .gt-btn-outline {
                    border: 1px solid var(--gt-orange-border);
                    color: var(--gt-orange);
                    background: rgba(240, 89, 31, 0.05);
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .gt-btn-outline:hover {
                    background: var(--gt-orange);
                    color: var(--gt-white);
                    box-shadow: 0 4px 15px var(--gt-orange-glow);
                }

                .gt-btn-dark {
                    background-color: rgba(255,255,255,0.05);
                    color: var(--gt-gray-title);
                    border: 1px solid var(--gt-border-med);
                    font-weight: 500;
                    transition: 0.3s;
                }
                .gt-btn-dark:hover { 
                    background-color: rgba(255,255,255,0.1); 
                    color: var(--gt-white); 
                }

                /* ── RESPONSIVE TABLE FIX FOR WHITE BACKGROUND ── */
                .gt-table-wrapper {
                    overflow-x: auto;
                    border-radius: 12px;
                }
                .gt-table-wrapper::-webkit-scrollbar { height: 8px; }
                .gt-table-wrapper::-webkit-scrollbar-track { background: var(--gt-main-bg); border-radius: 4px; }
                .gt-table-wrapper::-webkit-scrollbar-thumb { background: var(--gt-gray-num); border-radius: 4px; }
                .gt-table-wrapper::-webkit-scrollbar-thumb:hover { background: var(--gt-gray-body); }

                /* Overriding Bootstrap defaults completely */
                .gt-dark-table {
                    --bs-table-bg: transparent !important;
                    --bs-table-accent-bg: transparent !important;
                    --bs-table-striped-bg: transparent !important;
                    --bs-table-active-bg: transparent !important;
                    --bs-table-hover-bg: transparent !important;
                    color: var(--gt-gray-hover) !important;
                    margin-bottom: 0;
                    min-width: 700px;
                    border-color: var(--gt-border-light);
                }
                
                .gt-dark-table td, 
                .gt-dark-table th {
                    background-color: transparent !important; /* Forces out any white */
                    border-bottom: 1px solid var(--gt-border-light) !important;
                    color: var(--gt-gray-hover) !important;
                    vertical-align: middle;
                    padding: 16px;
                }

                .gt-dark-table thead th {
                    background-color: rgba(255,255,255,0.03) !important;
                    color: var(--gt-gray-title) !important;
                    font-weight: 600;
                    border-top: none !important;
                    letter-spacing: 0.5px;
                }

                .gt-dark-table tbody tr {
                    background-color: transparent !important;
                    transition: all 0.2s ease;
                }

                /* Custom Hover effect targeting the cells */
                .gt-dark-table tbody tr:hover td {
                    background-color: var(--gt-card-bg-active) !important;
                }

                /* ── MODAL STYLING ── */
                .gt-modal-content {
                    background-color: #0b1121 !important; 
                    border: 1px solid var(--gt-border-med);
                    color: var(--gt-white);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }
                .gt-modal-header { border-bottom: 1px solid var(--gt-border-light); padding: 24px 32px; }
                .gt-modal-body { padding: 32px; }
                .gt-modal-footer { border-top: 1px solid var(--gt-border-light); padding: 20px 32px; }
                .gt-modal-header .btn-close { filter: invert(1) grayscale(100%) brightness(200%); opacity: 0.5; }
                .gt-modal-header .btn-close:hover { opacity: 1; }

                /* ── FORM INPUTS ── */
                .gt-input {
                    background-color: var(--gt-card-bg) !important;
                    border: 1.5px solid var(--gt-border-med) !important;
                    color: var(--gt-white) !important;
                    border-radius: 12px;
                    padding: 14px 16px !important;
                    transition: all 0.3s ease;
                }
                .gt-input:focus {
                    border-color: var(--gt-orange-border) !important;
                    box-shadow: 0 0 0 4px var(--gt-orange-glow) !important;
                    background-color: var(--gt-card-bg-active) !important;
                }
                .gt-input::placeholder { color: var(--gt-gray-num); }
                .gt-input option { background-color: #0b1121; color: var(--gt-white); }

                /* ── UPLOAD BOX ── */
                .gt-upload-box {
                    border: 2px dashed var(--gt-border-med);
                    background: var(--gt-card-bg);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                }
                .gt-upload-box:hover {
                    border-color: var(--gt-orange);
                    background: rgba(240, 89, 31, 0.05);
                    transform: translateY(-2px);
                }

                /* ── BADGES ── */
                .gt-badge-open {
                    background: rgba(234, 179, 8, 0.1);
                    color: #eab308;
                    border: 1px solid rgba(234, 179, 8, 0.3);
                    padding: 6px 12px;
                }
                .gt-badge-resolved {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    padding: 6px 12px;
                }
                .gt-badge-type {
                    background: var(--gt-orange-glow);
                    color: var(--gt-orange);
                    border: 1px solid var(--gt-orange-border);
                    padding: 6px 12px;
                }

                /* ── RESPONSIVE MEDIA QUERIES ── */
                @media (max-width: 768px) {
                    .gt-page-wrapper { padding: 20px 15px !important; }
                    .gt-header-border { flex-direction: column; align-items: flex-start !important; gap: 16px; }
                    .gt-btn-primary { width: 100%; justify-content: center; }
                    .gt-card { padding: 20px !important; border-radius: 12px; }
                    .gt-modal-body, .gt-modal-header, .gt-modal-footer { padding: 20px; }
                    .gt-modal-footer { flex-direction: column; gap: 12px; }
                    .gt-modal-footer button { width: 100%; margin: 0 !important; }
                }
            `}</style>

            <div className="gt-page-wrapper px-lg-5 px-md-4 px-3 py-4">
                {/* ── HEADER ── */}
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 pb-3 gt-header-border">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: "var(--gt-white)", fontFamily: "'Fraunces', serif" }}>
                            Dispute Center
                        </h2>
                        <p className="font-14 mb-0" style={{ color: "var(--gt-gray-body)" }}>
                            Track and manage your service disputes effectively.
                        </p>
                    </div>
                    <button className="btn gt-btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2" onClick={toggleModal}>
                        <FaPlus size={14} /> Create New Dispute
                    </button>
                </div>

                {/* ── MAIN TABLE CARD ── */}
                <div className="gt-card p-4">
                    {loading ? (
                        <div className="text-center py-5 my-4">
                            <Spinner style={{ color: "var(--gt-orange)", width: '3rem', height: '3rem' }} />
                            <p className="mt-3 font-15 fw-medium" style={{ color: "var(--gt-gray-body)" }}>Fetching disputes...</p>
                        </div>
                    ) : (
                        <div className="gt-table-wrapper">
                            <Table className="font-14 gt-dark-table align-middle m-0 border-0">
                                <thead>
                                    <tr>
                                        <th width="12%">Ticket ID</th>
                                        <th width="15%">Issue Type</th>
                                        <th width="40%">Description</th>
                                        <th width="15%">Status</th>
                                        <th width="18%" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disputes.length > 0 ? disputes.map((d) => (
                                        <tr key={d.id}>
                                            <td className="fw-bold" style={{ color: "var(--gt-orange)" }}>#GT-{d.id}</td>
                                            <td>
                                                <Badge className="gt-badge-type" pill>
                                                    {d.issue_type}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: '300px', color: "var(--gt-gray-hover)" }}>
                                                    {d.description}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge className={d.status === 'open' ? 'gt-badge-open' : 'gt-badge-resolved'} pill>
                                                    {d.status?.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="text-center">
                                                {d.status === 'resolved' ? (
                                                    <span className="text-muted font-13 fw-semibold d-inline-flex align-items-center gap-1" style={{ opacity: 0.65 }}>
                                                        🔒 Closed
                                                    </span>
                                                ) : (
                                                    <button 
                                                        className="btn btn-sm gt-btn-outline px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2" 
                                                        onClick={() => navigate(`/dispute/${d.id}`)}
                                                    >
                                                        <FaCommentDots /> View Chat
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 my-3">
                                                <div style={{ color: "var(--gt-gray-body)" }}>
                                                    <p className="mb-1 fw-medium" style={{ fontSize: '16px' }}>No disputes found</p>
                                                    <small>You haven't opened any disputes yet.</small>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── CREATE DISPUTE MODAL ── */}
            <Modal isOpen={showCreateModal} toggle={toggleModal} size="lg" centered contentClassName="gt-modal-content">
                <ModalHeader toggle={toggleModal} className="gt-modal-header border-0">
                    <span style={{ color: "var(--gt-white)", fontSize: "22px", fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                        Submit Dispute Ticket
                    </span>
                </ModalHeader>
                <form onSubmit={handleSubmitDispute}>
                    <ModalBody className="gt-modal-body">
                        <div className="row">
                            <div className="col-12 col-md-6 mb-4">
                                <label className="form-label font-13 fw-medium text-uppercase" style={{ color: "var(--gt-gray-title)", letterSpacing: "0.5px" }}>
                                    Issue Category
                                </label>
                                <select required className="form-select gt-input" value={disputeType} onChange={(e)=>setDisputeType(e.target.value)}>
                                    <option value="" disabled>Select Category</option>
                                    <option value="Order Issue">Order Issue</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="Other">Other Support</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 mb-4">
                                <label className="form-label font-13 fw-medium text-uppercase" style={{ color: "var(--gt-gray-title)", letterSpacing: "0.5px" }}>
                                    Subject
                                </label>
                                <input required className="form-control gt-input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Milestone 1 payment missing" />
                            </div>
                            <div className="col-12 mb-4">
                                <label className="form-label font-13 fw-medium text-uppercase" style={{ color: "var(--gt-gray-title)", letterSpacing: "0.5px" }}>
                                    Description
                                </label>
                                <textarea required className="form-control gt-input" rows={5} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Explain your problem in detail... Please include order numbers or usernames if applicable." />
                            </div>
                            <div className="col-12">
                                <label className="form-label font-13 fw-medium text-uppercase" style={{ color: "var(--gt-gray-title)", letterSpacing: "0.5px" }}>
                                    Attach Evidence (Optional)
                                </label>
                                <div className="gt-upload-box" onClick={() => fileInputRef.current.click()}>
                                    <FaCloudUploadAlt size={42} className="mb-3" style={{ color: "var(--gt-orange)" }} />
                                    <p className="mb-1 font-15 fw-bold" style={{ color: "var(--gt-white)" }}>{fileName}</p>
                                    <small style={{ color: "var(--gt-gray-num)" }}>Click to browse • PNG, JPG or PDF (Max 5MB)</small>
                                    <input type="file" ref={fileInputRef} className="d-none" onChange={handleFileChange} accept="image/*,.pdf" />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="gt-modal-footer border-0">
                        <button type="button" className="btn gt-btn-dark rounded-pill px-4 py-2 me-2" onClick={toggleModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn gt-btn-primary rounded-pill px-5 py-2" disabled={submitting}>
                            {submitting ? <Spinner size="sm" color="light" className="mx-3" /> : "Submit Ticket"}
                        </button>
                    </ModalFooter>
                </form>
            </Modal>
            <Footer />
        </>
    );
};

export default DisputeCenter;
