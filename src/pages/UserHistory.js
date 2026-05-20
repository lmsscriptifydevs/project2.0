import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    AiOutlineWallet, 
    AiOutlineRise, 
    AiOutlineBank, 
    AiOutlineHourglass,
    AiOutlineSearch,
    AiOutlineSwap,
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineArrowLeft,
    AiOutlineArrowRight
} from "react-icons/ai";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- THEME COLOR SCHEMA ---
const THEME = {
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

const UserHistory = () => {
    const [activeTab, setActiveTab] = useState('transactions'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionsData, setTransactionsData] = useState([]);
    const [withdrawalsData, setWithdrawalsData] = useState([]);
    const [transactionStats, setTransactionStats] = useState({ available_balance: 0, total_earned: 0, total_withdrawn: 0 });
    const [withdrawalSummary, setWithdrawalSummary] = useState({ total_requested: 0, total_completed: 0, pending_amount: 0, pending_count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedReason, setSelectedReason] = useState(null);

    const fetchData = async (page = 1, tab = activeTab) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken'); 
            if (!token) {
                setError("Login required.");
                setLoading(false);
                return;
            }
            const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

            if (tab === 'transactions') {
                const response = await axios.get(`https://portal.grapetask.co/api/user/history?page=${page}`, { headers });
                if (response.data.success) {
                    // Handle nested data structures
                    const dataArr = Array.isArray(response.data.data) ? response.data.data : (response.data.data.data || []);
                    setTransactionsData(dataArr); 
                    setTransactionStats(response.data.stats || transactionStats);
                    
                    const pagination = response.data.pagination || response.data.data;
                    setCurrentPage(pagination.current_page || 1);
                    setTotalPages(pagination.last_page || 1);
                }
            } else if (tab === 'withdrawals') {
                const response = await axios.get(`https://portal.grapetask.co/api/withdraw/history?page=${page}`, { headers });
                if (response.data.success) {
                    // Handle nested data structures
                    const dataArr = Array.isArray(response.data.data) ? response.data.data : (response.data.data.data || []);
                    setWithdrawalsData(dataArr);
                    setWithdrawalSummary(response.data.summary || withdrawalSummary);
                    
                    const pagination = response.data.pagination || response.data.data;
                    setCurrentPage(pagination.current_page || 1);
                    setTotalPages(pagination.last_page || 1);
                }
            }
        } catch (err) {
            setError("Server error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, activeTab);
        
        // Auto-refresh data every 10 seconds silently
        const interval = setInterval(() => {
            fetchData(currentPage, activeTab);
        }, 10000);

        return () => clearInterval(interval);
    }, [currentPage, activeTab]);

    const handleTabChange = (tab) => {
        setSearchTerm(''); 
        setCurrentPage(1); 
        setActiveTab(tab);
    };

    const filteredTransactions = transactionsData.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredWithdrawals = withdrawalsData.filter(item => 
        item.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.account_holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        let config = { color: THEME.text.bodyGrayText, bg: "rgba(255,255,255,0.05)" };
        
        if (s === 'completed' || s === 'earn' || s === 'bd_commission') {
            config = { color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
        } else if (s === 'pending') {
            config = { color: THEME.accents.primaryOrange, bg: "rgba(240, 89, 31, 0.1)" };
        } else if (s === 'rejected' || s === 'spend') {
            config = { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
        }

        return (
            <span className="badge d-inline-flex align-items-center px-3 py-1 rounded-pill font-11 fw-medium" 
                style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.color}30` }}>
                <AiOutlineCheckCircle className="me-1"/> {s}
            </span>
        );
    };

    return (
        <div style={{ backgroundColor: THEME.backgrounds.mainBg, minHeight: '100vh', color: THEME.text.pureWhite }}>
            <Navbar FirstNav="none" />

            {/* View Receipt Modal */}
            {selectedReceipt && (
                <div className="modal-overlay d-flex align-items-center justify-content-center" 
                     style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
                    <div className="p-4 rounded-3 shadow poppins text-center" style={{ width: '90%', maxWidth: '600px', backgroundColor: THEME.backgrounds.mainBg, border: `1px solid ${THEME.borders.lightBorder}` }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: THEME.text.pureWhite }}>Payment Receipt</h5>
                            <button className="btn p-0 border-0 bg-transparent" onClick={() => setSelectedReceipt(null)}>
                                <AiOutlineCloseCircle size={24} color={THEME.text.mediumGrayTitle} />
                            </button>
                        </div>
                        <div className="mb-4 d-flex justify-content-center align-items-center rounded-3 overflow-hidden p-2" style={{ border: `1px solid ${THEME.borders.mediumBorder}`, background: THEME.backgrounds.cardBg }}>
                            <img src={selectedReceipt} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                        <a href={selectedReceipt} download="Payment_Receipt.jpg" target="_blank" rel="noopener noreferrer" 
                           className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm d-inline-block text-decoration-none"
                           style={{ backgroundColor: '#22c55e', color: THEME.text.pureWhite, border: 'none' }}>
                            Download Receipt
                        </a>
                    </div>
                </div>
            )}

            {/* View Reason Modal */}
            {selectedReason && (
                <div className="modal-overlay d-flex align-items-center justify-content-center" 
                     style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
                    <div className="p-4 rounded-3 shadow poppins" style={{ width: '90%', maxWidth: '400px', backgroundColor: THEME.backgrounds.mainBg, border: `1px solid ${THEME.borders.lightBorder}` }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#ef4444' }}>Reason for Rejection</h5>
                            <button className="btn p-0 border-0 bg-transparent" onClick={() => setSelectedReason(null)}>
                                <AiOutlineCloseCircle size={24} color={THEME.text.mediumGrayTitle} />
                            </button>
                        </div>
                        <div className="p-3 rounded-3 mb-4 mt-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                            <p className="mb-0 font-15 text-start" style={{ lineHeight: '1.6' }}>{selectedReason}</p>
                        </div>
                        <button className="w-100 py-3 rounded-3 font-16 fw-bold shadow-sm"
                            style={{ backgroundColor: THEME.backgrounds.cardBgActive, color: THEME.text.pureWhite, border: `1px solid ${THEME.borders.mediumBorder}` }}
                            onClick={() => setSelectedReason(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .poppins { font-family: 'Poppins', sans-serif; }
                .cocon { font-family: 'Sora', sans-serif; }
                
                /* AGGRESSIVE DARK OVERRIDE */
                .table, .table-responsive, .card, .card-header, .card-body {
                    background-color: transparent !important;
                    color: ${THEME.text.pureWhite} !important;
                    border: none !important;
                }

                .glass-card { 
                    background: ${THEME.backgrounds.cardBg} !important; 
                    border: 1px solid ${THEME.borders.lightBorder} !important; 
                    backdrop-filter: blur(20px);
                    border-radius: 12px;
                }

                .custom-table thead th {
                    background: rgba(255,255,255,0.03) !important;
                    color: ${THEME.text.mediumGrayTitle} !important;
                    border-bottom: 1px solid ${THEME.borders.lightBorder} !important;
                    text-transform: uppercase;
                    font-size: 11px;
                    padding: 15px !important;
                }

                .custom-table tbody td {
                    background: transparent !important;
                    color: ${THEME.text.lightGrayHover} !important;
                    border-bottom: 1px solid ${THEME.borders.lightBorder} !important;
                    padding: 20px 15px !important;
                }

                .custom-table tbody tr:hover td {
                    background-color: ${THEME.backgrounds.cardBgActive} !important;
                }

                .tab-btn {
                    border: none;
                    background: transparent;
                    color: ${THEME.text.bodyGrayText};
                    padding: 12px 20px;
                    font-size: 14px;
                    transition: 0.3s;
                    border-bottom: 2px solid transparent;
                }

                .tab-btn.active {
                    color: ${THEME.accents.primaryOrange} !important;
                    font-weight: 600;
                    border-bottom: 2px solid ${THEME.accents.primaryOrange};
                }

                .search-box {
                    background: rgba(255,255,255,0.05) !important;
                    border: 1px solid ${THEME.borders.lightBorder} !important;
                    color: white !important;
                    border-radius: 8px !important;
                }
                
                .search-box:focus {
                    border-color: ${THEME.accents.primaryOrange} !important;
                    outline: none;
                    box-shadow: none;
                }

                .pagination-btn {
                    background: ${THEME.backgrounds.cardBg};
                    border: 1px solid ${THEME.borders.lightBorder};
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    transition: 0.2s;
                }

                .pagination-btn:hover:not(:disabled) {
                    border-color: ${THEME.accents.primaryOrange};
                    background: ${THEME.accents.primaryOrange}20;
                }
            `}</style>

            <div className="container-fluid pt-5 pb-5 poppins">
                <div className="row mx-lg-5 mx-md-3 mx-0">

                    {/* --- HEADER --- */}
                    <div className="col-12 mb-4">
                        <h2 className="fw-bold cocon mb-1">Financial <span style={{ color: THEME.accents.primaryOrange }}>History</span></h2>
                        <p style={{ color: THEME.text.bodyGrayText, fontSize: '14px' }}>All your transactions and earnings in one place.</p>
                    </div>

                    {/* --- STATS --- */}
                    <div className="row g-3 mb-5 mx-0">
                        {[
                            { label: "Available", val: transactionStats.available_balance, color: THEME.accents.primaryOrange, icon: <AiOutlineWallet/> },
                            { label: "Total Earned", val: transactionStats.total_earned, color: "#22c55e", icon: <AiOutlineRise/> },
                            { label: "Total Withdrawn", val: transactionStats.total_withdrawn || withdrawalSummary.total_completed, color: "#3b82f6", icon: <AiOutlineBank/> },
                            { label: "Pending", val: withdrawalSummary.pending_amount, color: "#eab308", icon: <AiOutlineHourglass/> }
                        ].map((stat, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="glass-card p-3 h-100">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-2" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                                        <div>
                                            <div className="font-11" style={{ color: THEME.text.mediumGrayTitle }}>{stat.label}</div>
                                            <div className="fw-bold font-16">${Number(stat.val).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- TABLE CONTENT --- */}
                    <div className="col-12">
                        <div className="glass-card overflow-hidden shadow-sm">
                            <div className="p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-bottom border-white border-opacity-10">
                                <div className="d-flex">
                                    <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => handleTabChange('transactions')}>Transactions</button>
                                    <button className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => handleTabChange('withdrawals')}>Withdrawals</button>
                                </div>
                                <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
                                    <AiOutlineSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: THEME.text.bodyGrayText }} />
                                    <input type="text" className="form-control search-box ps-5 py-2 font-13" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table custom-table mb-0 align-middle">
                                    {activeTab === 'transactions' ? (
                                        <>
                                            <thead>
                                                <tr>
                                                    <th>REFERENCE / INFO</th>
                                                    <th>DATE</th>
                                                    <th className="text-center">STATUS</th>
                                                    <th className="text-end">AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTransactions.length > 0 ? filteredTransactions.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <div className="fw-medium">Ref: #{item.id}</div>
                                                            <div className="font-11" style={{ color: THEME.text.bodyGrayText }}>{item.title || 'System Commission'}</div>
                                                        </td>
                                                        <td>{new Date(item.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                        <td className="text-center">{getStatusBadge(item.status)}</td>
                                                        <td className={`text-end fw-bold font-16 ${item.status === 'spend' ? 'text-danger' : 'text-success'}`}>
                                                            {item.status === 'spend' ? '-' : '+'} ${Number(item.price).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan="4" className="text-center py-5">No records found.</td></tr>}
                                            </tbody>
                                        </>
                                    ) : (
                                        <>
                                            <thead>
                                                <tr>
                                                    <th>METHOD / HOLDER</th>
                                                    <th>REQUEST DATE</th>
                                                    <th className="text-center">STATUS</th>
                                                    <th className="text-end">AMOUNT</th>
                                                    <th className="text-center">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredWithdrawals.length > 0 ? filteredWithdrawals.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <div className="fw-medium text-capitalize">{item.payment_method}</div>
                                                            <div className="font-11" style={{ color: THEME.text.bodyGrayText }}>{item.account_holder_name}</div>
                                                        </td>
                                                        <td>{new Date(item.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                        <td className="text-center">{getStatusBadge(item.status)}</td>
                                                        <td className="text-end fw-bold font-16">${Number(item.net_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                                                        <td className="text-center">
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
                                                                <span style={{ color: THEME.text.mediumGrayTitle, fontSize: '13px' }}>-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan="5" className="text-center py-5">No withdrawals found.</td></tr>}
                                            </tbody>
                                        </>
                                    )}
                                </table>
                            </div>

                            {!loading && totalPages > 1 && (
                                <div className="p-4 d-flex justify-content-between align-items-center border-top border-white border-opacity-10">
                                    <div className="font-12" style={{ color: THEME.text.bodyGrayText }}>Page {currentPage} of {totalPages}</div>
                                    <div className="d-flex gap-2">
                                        <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}><AiOutlineArrowLeft/></button>
                                        <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}><AiOutlineArrowRight/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserHistory;