import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Spinner, Badge, Input, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { 
    FaArrowLeft, FaPaperPlane, FaPaperclip, FaFileAlt, 
    FaTicketAlt, FaCalendarAlt, FaUserCircle, FaDownload, FaChevronRight,
    FaUsers, FaInfoCircle, FaShieldAlt, FaExpand, FaCompress
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HOST_API } from "../config";
import { useUserData } from "../utils/useLocalStorage";

// Preload the hosted sound to eliminate any latency during chat room interactions
const chatAudio = typeof window !== "undefined" ? new Audio("https://portal.grapetask.co/uploads/sound.mp3") : null;

const playChatSound = () => {
    try {
        if (chatAudio) {
            chatAudio.currentTime = 0; // Rewind to start
            chatAudio.volume = 0.6; // Controlled volume
            chatAudio.play().catch(e => console.log("Audio playback blocked by browser:", e));
        }
    } catch (e) {
        console.error("Audio playback error:", e);
    }
};

const DisputeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesFlowRef = useRef(null);
    const UserData = useUserData();

    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [proposing, setProposing] = useState(false);
    const [voting, setVoting] = useState(false);
    const [refunding, setRefunding] = useState(false);

    // Unified Elegant Responsive Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        subtext: "",
        confirmColor: "#f0591f",
        confirmText: "Confirm",
        onConfirm: () => {}
    });

    const triggerConfirm = (title, message, subtext, confirmText, confirmColor, onConfirm) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            subtext,
            confirmText,
            confirmColor,
            onConfirm: () => {
                onConfirm();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const BASE_URL = (HOST_API || "https://portal.grapetask.co/api").replace(/\/$/, "");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    const fetchDetails = useCallback(async (shouldScroll = false) => {
        try {
            const res = await axios.get(`${BASE_URL}/disputes/show/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setDispute(prev => {
                const isInitialLoad = !prev;
                const prevLength = prev?.messages?.length || 0;
                const nextLength = res.data?.messages?.length || 0;
                
                if (isInitialLoad || shouldScroll || nextLength > prevLength) {
                    if (!isInitialLoad && nextLength > prevLength) {
                        playChatSound();
                    }
                    setTimeout(scrollToBottom, 100);
                }
                return res.data;
            });
            setLoading(false);
        } catch (err) {
            // Silently ignore background polling errors to avoid annoying toast alerts
            if (shouldScroll) {
                toast.error("Could not load dispute details");
            }
            setLoading(false);
        }
    }, [id, token, BASE_URL]);

    const handleResolveDispute = (action) => {
        const title = action === "approve" ? "Approve Cancellation" : "Decline Cancellation";
        const message = action === "approve"
            ? "Are you sure you want to APPROVE the order cancellation?"
            : "Are you sure you want to DECLINE the cancellation?";
        const subtext = action === "approve"
            ? "This will cancel the order immediately in the database and release payouts or process refunds. This action is final."
            : "This will restore the order to active status and resolve the dispute. The expert and BD will continue working.";
        const confirmText = action === "approve" ? "Approve & Cancel" : "Decline & Keep Active";
        const confirmColor = action === "approve" ? "#ef4444" : "#10b981";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setResolving(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/resolve/${id}`, { action }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success(`Dispute successfully resolved!`);
                    fetchDetails(false); // Refresh dispute data
                } else {
                    toast.error(res.data.message || "Failed to resolve dispute.");
                }
            } catch (error) {
                console.error("Resolve error:", error);
                toast.error(error.response?.data?.message || "An error occurred while resolving the dispute.");
            } finally {
                setResolving(false);
            }
        });
    };

    const handleProposeCancellation = () => {
        const title = "Propose Cancellation Agreement";
        const message = "Are you sure you want to propose order cancellation to all participants?";
        const subtext = "This will start the mutual agreement voting process. Client, Expert, and BD will receive a notification to vote. If everyone agrees, the order will be automatically cancelled.";
        const confirmText = "Start Voting Process";
        const confirmColor = "#f0591f";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setProposing(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/propose-cancellation/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success("Mutual cancellation proposed successfully! Voting is now active.");
                    fetchDetails(false);
                } else {
                    toast.error(res.data.message || "Failed to propose cancellation.");
                }
            } catch (error) {
                console.error("Propose error:", error);
                toast.error(error.response?.data?.message || "An error occurred while proposing cancellation.");
            } finally {
                setProposing(false);
            }
        });
    };

    const handleVote = (agree) => {
        const title = agree ? "Agree to Cancellation" : "Decline Cancellation";
        const message = agree 
            ? "Are you sure you want to AGREE to cancel this order?"
            : "Are you sure you want to DECLINE the cancellation agreement?";
        const subtext = agree
            ? "By agreeing, you consent to cancel the order. If all participants (Client, Expert, BD) agree, the order is auto-cancelled."
            : "By declining, you reject the cancellation. The order remains active and GrapeTask Admin will resolve any dispute.";
        const confirmText = agree ? "Yes, Agree" : "Yes, Decline";
        const confirmColor = agree ? "#10b981" : "#ef4444";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setVoting(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/vote/${id}`, { agree }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success("Your vote has been submitted successfully!");
                    fetchDetails(false);
                } else {
                    toast.error(res.data.message || "Failed to submit vote.");
                }
            } catch (error) {
                console.error("Vote error:", error);
                toast.error(error.response?.data?.message || "An error occurred while voting.");
            } finally {
                setVoting(false);
            }
        });
    };

    const handleRequestRefund = () => {
        const title = "Request Money Refund";
        const message = `Are you sure you want to request a money refund of $${dispute?.order_price || 0} for this cancelled order?`;
        const subtext = "Your request will be sent to the GrapeTask Administration for verification. Once approved, the amount will be immediately credited back to your wallet balance.";
        const confirmText = "Yes, Request Refund";
        const confirmColor = "#f0591f";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setRefunding(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/request-refund/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success("Refund requested successfully!");
                    fetchDetails(false);
                } else {
                    toast.error(res.data.message || "Failed to request refund.");
                }
            } catch (error) {
                console.error("Refund request error:", error);
                toast.error(error.response?.data?.message || "An error occurred while requesting refund.");
            } finally {
                setRefunding(false);
            }
        });
    };

    const handleApproveRefund = () => {
        const title = "Approve Money Refund";
        const message = `Are you sure you want to APPROVE the refund of $${dispute?.order_price || 0}?`;
        const subtext = "This will immediately transfer the payment back to the Client's GrapeTask wallet balance. This action cannot be undone.";
        const confirmText = "Approve & Credit Client";
        const confirmColor = "#10b981";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setRefunding(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/approve-refund/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success("Refund approved and balance credited successfully!");
                    fetchDetails(false);
                } else {
                    toast.error(res.data.message || "Failed to approve refund.");
                }
            } catch (error) {
                console.error("Approve refund error:", error);
                toast.error(error.response?.data?.message || "An error occurred while approving refund.");
            } finally {
                setRefunding(false);
            }
        });
    };

    const handleDeclineRefund = () => {
        const title = "Decline Money Refund";
        const message = "Are you sure you want to DECLINE this refund request?";
        const subtext = "This will reject the Client's refund request. The Client will be notified.";
        const confirmText = "Decline Refund";
        const confirmColor = "#ef4444";

        triggerConfirm(title, message, subtext, confirmText, confirmColor, async () => {
            setRefunding(true);
            try {
                const res = await axios.post(`${BASE_URL}/disputes/decline-refund/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "success") {
                    toast.success("Refund request declined successfully!");
                    fetchDetails(false);
                } else {
                    toast.error(res.data.message || "Failed to decline refund.");
                }
            } catch (error) {
                console.error("Decline refund error:", error);
                toast.error(error.response?.data?.message || "An error occurred while declining refund.");
            } finally {
                setRefunding(false);
            }
        });
    };

    useEffect(() => {
        // Initial load with auto scroll
        fetchDetails(true);

        // Setup background polling interval every 3 seconds (WhatsApp-like real-time)
        const intervalId = setInterval(() => {
            fetchDetails(false);
        }, 3000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [fetchDetails]);

    const scrollToBottom = () => {
        if (messagesFlowRef.current) {
            messagesFlowRef.current.scrollTop = messagesFlowRef.current.scrollHeight;
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyMessage && !selectedFile) return;

        setSending(true);
        const formData = new FormData();
        formData.append("message", replyMessage);
        if (selectedFile) {
            formData.append("media[]", selectedFile);
        }

        try {
            await axios.post(`${BASE_URL}/disputes/reply/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setReplyMessage("");
            setSelectedFile(null);
            fetchDetails(true); // Force scroll down when sending a reply
            playChatSound(); // Play instant bubble sent sound
        } catch (err) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    // Render status badge helper
    const renderStatusBadge = (status) => {
        const s = status?.toLowerCase() || "";
        let color = "#f0591f";
        let bg = "rgba(240, 89, 31, 0.15)";
        let border = "rgba(240, 89, 31, 0.4)";
        
        if (s === "resolved" || s === "closed" || s === "completed") {
            color = "#10b981";
            bg = "rgba(16, 185, 129, 0.15)";
            border = "rgba(16, 185, 129, 0.4)";
        } else if (s === "open" || s === "active") {
            color = "#ef4444";
            bg = "rgba(239, 68, 68, 0.15)";
            border = "rgba(239, 68, 68, 0.4)";
        }
        
        return (
            <span className="status-badge-premium" style={{ color, backgroundColor: bg, borderColor: border }}>
                {status?.toUpperCase() || "OPEN"}
            </span>
        );
    };

    // Helper to extract sender role details
    const getSenderInfo = (sender, isMe) => {
        if (isMe) {
            return {
                badgeText: "You",
                badgeClass: "badge-current-user",
                bubbleClass: "bubble-me"
            };
        }
        
        const role = sender?.role?.toLowerCase() || "";
        const name = sender?.name || "";
        
        if (role === "system" || name.toLowerCase() === "system") {
            return {
                badgeText: "System Alert",
                badgeClass: "badge-system",
                bubbleClass: "bubble-system-alert"
            };
        }
        
        switch (role) {
            case "admin":
            case "support":
                return {
                    badgeText: "Admin",
                    badgeClass: "badge-role-admin",
                    bubbleClass: "bubble-role-admin"
                };
            case "expert":
                return {
                    badgeText: "Expert",
                    badgeClass: "badge-role-expert",
                    bubbleClass: "bubble-role-expert"
                };
            case "bd":
            case "business_developer":
                return {
                    badgeText: "BD",
                    badgeClass: "badge-role-bd",
                    bubbleClass: "bubble-role-bd"
                };
            default:
                return {
                    badgeText: "Client",
                    badgeClass: "badge-role-client",
                    bubbleClass: "bubble-role-client"
                };
        }
    };

    if (loading) return (
        <div className="loader-container">
            <Spinner style={{color: '#f0591f'}} />
        </div>
    );

    if (!dispute) return <div className="text-center p-5 text-white poppins">Dispute not found</div>;

    const currentUserId = UserData?.id;
    const currentUserEmail = UserData?.email;
    
    const isAdmin = UserData?.role === "admin" || UserData?.email === "grapetak786@gmail.com";

    const myParticipant = dispute?.participants?.find(p => p.email === currentUserEmail);
    const myRole = myParticipant?.role; // 'client', 'expert', 'bd', or 'admin'
    
    // Check if cancellation is proposed
    const isProposed = dispute?.votes_state?.proposed === true;
    
    // Check if everyone (client, expert, bd) agreed
    const clientAgreed = dispute?.votes_state?.votes?.client === true;
    const expertAgreed = dispute?.votes_state?.votes?.expert === true;
    const bdAgreed = dispute?.votes_state?.votes?.bd === true;
    const allAgreed = clientAgreed && expertAgreed && bdAgreed;
    
    // Check if I have voted
    const myVote = isProposed ? dispute?.votes_state?.votes?.[myRole] : null;
    const hasVoted = isProposed && myVote !== null;
    
    // Lock inputs if chat resolved OR mutual cancellation agreed and user is non-admin
    const isChatLockedForMe = dispute?.status !== "open" || (isProposed && allAgreed && myRole !== "admin");

    return (
        <>
            {!isFullScreen && <Navbar />}
            <div className={`dispute-page-wrapper poppins ${isFullScreen ? 'fullscreen-mode-active min-vh-100' : 'py-3 py-md-5 px-2 px-md-4 min-vh-100'}`}>
                <ToastContainer theme="dark" />
                
                {/* Header Area */}
                {!isFullScreen && (
                    <div className="container-fluid max-width-chat p-0 mb-4 animate-fade-in">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <button className="back-btn-modern" onClick={() => navigate(-1)} title="Back to Disputes">
                                    <FaArrowLeft />
                                </button>
                                <div>
                                    <h4 className="fw-bold mb-0 text-white cocon">Dispute Workspace</h4>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span className="text-white-50 font-12">Disputes</span>
                                        <FaChevronRight size={8} className="text-white-50" />
                                        <span className="text-orange font-12 fw-bold">#GT-{dispute.ticket_id}</span>
                                    </div>
                                </div>
                            </div>
                            {renderStatusBadge(dispute.status)}
                        </div>
                    </div>
                )}

                <div className={`container-fluid ${isFullScreen ? 'max-width-chat-full' : 'max-width-chat'} p-0 animate-fade-in`}>
                    <div className="row g-4">
                        {/* LEFT: CHAT AREA */}
                        <div className={`col-lg-${isFullScreen ? '12' : '8'} order-2 order-lg-1 transition-all duration-300`}>
                            <div className="chat-card-premium shadow-2xl">
                                
                                {/* Live Workspace Header Panel */}
                                <div className="room-banner-premium px-4 py-3 d-flex align-items-center justify-content-between gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="banner-icon-container">
                                            <FaShieldAlt className="text-orange pulsating" />
                                        </div>
                                        <div>
                                            <span className="text-white fw-bold font-13 d-block">Mutual Resolution Workspace</span>
                                            <span className="text-white-50 font-11">Secure 4-Way Discussion Room</span>
                                        </div>

                                        {/* Premium stacked participant avatars in header */}
                                        {dispute.participants && (
                                            <div className="d-flex align-items-center gap-2 ms-lg-4 d-none d-sm-flex">
                                                <div className="avatar-group-premium">
                                                    {dispute.participants.map((member, mIdx) => {
                                                        const role = member.role?.toLowerCase() || "";
                                                        const isOnline = member.online;
                                                        const initial = member.name ? member.name.charAt(0).toUpperCase() : "U";
                                                        
                                                        let avatarClass = "client";
                                                        if (role === "admin") avatarClass = "admin";
                                                        else if (role === "expert") avatarClass = "expert";
                                                        else if (role === "bd") avatarClass = "bd";
                                                        
                                                        return (
                                                            <div 
                                                                key={mIdx} 
                                                                className={`avatar-premium-stacked ${avatarClass}`}
                                                                title={`${member.name} (${member.role}) - ${isOnline ? 'In Chat Room' : 'Offline'}`}
                                                            >
                                                                {initial}
                                                                {isOnline && <span className="stack-online-dot"></span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-2 bg-live-badge px-2.5 py-1 rounded-full">
                                            <span className="live-pulse"></span>
                                            <span className="text-white-50 font-10 uppercase tracking-wider fw-bold">Live Chat</span>
                                        </div>
                                        


                                        <button 
                                            type="button" 
                                            className="fullscreen-toggle-btn-premium" 
                                            onClick={() => setIsFullScreen(!isFullScreen)}
                                            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Chat"}
                                        >
                                            {isFullScreen ? <FaCompress /> : <FaExpand />}
                                        </button>
                                    </div>
                                </div>

                                <div className="messages-flow p-3 p-md-4" ref={messagesFlowRef}>
                                    {dispute.messages.map((msg, index) => {
                                        const text = msg.message || "";
                                        const isMe = (currentUserId && String(msg.sender?.id) === String(currentUserId)) || 
                                                     (currentUserEmail && msg.sender?.email === currentUserEmail) || 
                                                     (msg.sender?.role === "user" && currentUserId === 1755); // Fallback safeguard
                                        
                                        const isSystem = msg.sender?.role === "system" || 
                                                         msg.sender?.name?.toLowerCase() === "system" || 
                                                         text.startsWith("🚨");

                                        const info = getSenderInfo(msg.sender, isMe);

                                        if (isSystem) {
                                            return (
                                                <div key={index} className="w-100 d-flex justify-content-center mb-4">
                                                    <div className="system-alert-banner">
                                                        <div className="d-flex align-items-start gap-3">
                                                            <div className="system-alert-icon-wrap">🚨</div>
                                                            <div className="flex-grow-1">
                                                                <div className="system-alert-title cocon">GrapeTask Mutual Resolution System</div>
                                                                <div className="system-alert-text">{text}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={index} className={`d-flex mb-4 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                                <div className={`message-bubble ${info.bubbleClass}`}>
                                                    <div className="bubble-meta">
                                                        <span className={`chat-role-badge ${info.badgeClass}`}>{info.badgeText}</span>
                                                        <span className="ms-2 text-white fw-bold">{msg.sender?.name}</span>
                                                        {msg.created_at && (
                                                            <span className="ms-2 text-white-50 font-10 opacity-70">
                                                                {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="message-text mt-1">{text}</div>
                                                    
                                                    {msg.media && msg.media.length > 0 && (
                                                        <div className="attachment-area mt-3">
                                                            {msg.media.map((file, fIdx) => (
                                                                <a href={file.file_path} target="_blank" rel="noreferrer" key={fIdx} className="evidence-link">
                                                                    <FaFileAlt className="text-orange" />
                                                                    <div className="flex-grow-1">
                                                                        <div className="text-white font-12">Evidence_{fIdx + 1}</div>
                                                                        <small className="text-white-50 font-10">Click to view</small>
                                                                    </div>
                                                                    <FaDownload size={12} className="text-white-50" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="chat-input-section">
                                    {/* Admin Resolution Console */}
                                    {isAdmin && dispute.status === "open" && (
                                        <div className="admin-resolution-panel-premium mx-3 mx-md-4 mt-3 p-3 shadow-lg">
                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                                <div>
                                                    <h6 className="text-white fw-bold mb-1 cocon d-flex align-items-center gap-2">
                                                        🛡️ Admin Resolution Console
                                                    </h6>
                                                    
                                                    {/* If cancellation not proposed yet */}
                                                    {!isProposed && (
                                                        <div className="text-white-50 font-11">
                                                            Hear all reviews. You can resolve directly, or ask participants for mutual agreement.
                                                        </div>
                                                    )}

                                                    {/* If cancellation proposed but voting is pending */}
                                                    {isProposed && !allAgreed && (
                                                        <div className="text-white-50 font-11 mt-1">
                                                            <div>Mutual agreement is in progress. Real-time voting dashboard:</div>
                                                            <div className="d-flex gap-3 flex-wrap mt-1">
                                                                <span className={clientAgreed ? "text-success" : dispute?.votes_state?.votes?.client === false ? "text-danger" : "text-warning"}>
                                                                    👤 Client: {clientAgreed ? "Agreed ✅" : dispute?.votes_state?.votes?.client === false ? "Declined ❌" : "Waiting ⏳"}
                                                                </span>
                                                                <span className={expertAgreed ? "text-success" : dispute?.votes_state?.votes?.expert === false ? "text-danger" : "text-warning"}>
                                                                    🛠️ Expert: {expertAgreed ? "Agreed ✅" : dispute?.votes_state?.votes?.expert === false ? "Declined ❌" : "Waiting ⏳"}
                                                                </span>
                                                                <span className={bdAgreed ? "text-success" : dispute?.votes_state?.votes?.bd === false ? "text-danger" : "text-warning"}>
                                                                    💼 BD: {bdAgreed ? "Agreed ✅" : dispute?.votes_state?.votes?.bd === false ? "Declined ❌" : "Waiting ⏳"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* If everyone agreed */}
                                                    {isProposed && allAgreed && (
                                                        <div className="text-success font-11 mt-1 fw-bold">
                                                            🎉 ALL PARTICIPANTS (Client, Expert, BD) HAVE AGREED! Finalize order cancellation below.
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    {!isProposed && (
                                                        <>
                                                            <button 
                                                                type="button" 
                                                                className="btn-resolution-decline"
                                                                onClick={handleProposeCancellation}
                                                                disabled={proposing}
                                                                style={{background: '#f59e0b'}}
                                                            >
                                                                {proposing ? <Spinner size="sm" /> : "Ask for Agreement"}
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className="btn-resolution-approve"
                                                                onClick={() => handleResolveDispute("approve")}
                                                                disabled={resolving}
                                                            >
                                                                {resolving ? <Spinner size="sm" /> : "Direct Cancel"}
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {isProposed && allAgreed && (
                                                        <button 
                                                            type="button" 
                                                            className="btn-resolution-approve animate-pulse"
                                                            onClick={() => handleResolveDispute("approve")}
                                                            disabled={resolving}
                                                        >
                                                            {resolving ? <Spinner size="sm" /> : "Finalize & Cancel Order"}
                                                        </button>
                                                    )}

                                                    <button 
                                                        type="button" 
                                                        className="btn-resolution-decline"
                                                        onClick={() => handleResolveDispute("decline")}
                                                        disabled={resolving}
                                                    >
                                                        {resolving ? <Spinner size="sm" /> : isProposed ? "Cancel Agreement Proposal" : "Decline & Keep Active"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Participant Voting Card (Roshan/Raj/Sagar) */}
                                    {!isAdmin && isProposed && dispute.status === "open" && (
                                        <div className="participant-voting-card mx-3 mx-md-4 mt-3 p-3 shadow-lg">
                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                                <div>
                                                    <h6 className="text-white fw-bold mb-1 cocon d-flex align-items-center gap-2">
                                                        🛡️ Mutual Cancellation Vote Required
                                                    </h6>
                                                    <span className="text-white-50 font-11">
                                                        GrapeTask Admin has proposed a cancellation agreement. Do you agree to cancel this order?
                                                    </span>
                                                </div>
                                                
                                                {/* If they haven't voted yet */}
                                                {myVote === null && (
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                        <button 
                                                            type="button" 
                                                            className="btn-resolution-decline"
                                                            onClick={() => handleVote(false)}
                                                            disabled={voting}
                                                            style={{background: '#dc3545'}}
                                                        >
                                                            {voting ? <Spinner size="sm" /> : "No, Keep Active"}
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            className="btn-resolution-approve animate-bounce"
                                                            onClick={() => handleVote(true)}
                                                            disabled={voting}
                                                            style={{background: '#198754'}}
                                                        >
                                                            {voting ? <Spinner size="sm" /> : "Yes, I Agree"}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* If they have voted */}
                                                {myVote !== null && (
                                                    <div className="font-12 fw-bold cocon text-orange">
                                                        {myVote ? "✅ You voted YES (Agreed to cancellation)" : "❌ You voted NO (Declined cancellation)"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Lock banner if everyone agreed and user is client/expert/bd */}
                                    {!isAdmin && isProposed && allAgreed && dispute.status === "open" && (
                                        <div className="system-resolution-badge mx-3 mx-md-4 mt-3 p-3 text-center cocon animate-pulse">
                                            🎉 Client, Expert, and BD have all agreed to the cancellation. Waiting for GrapeTask Admin to close this workspace and finalize.
                                        </div>
                                    )}

                                    {/* Resolved status message locking chat */}
                                    {dispute.status !== "open" && (
                                        <div className="system-resolution-badge mx-3 mx-md-4 mt-3 p-3 text-center cocon">
                                            🔒 This dispute workspace has been resolved and closed by GrapeTask Administration.
                                        </div>
                                    )}

                                    {/* 💸 PREMIUM RESPONSIVE REFUND CONTROL CARD 💸 */}
                                    {dispute.status !== "open" && (
                                        <Card className="gt-card-bg mx-3 mx-md-4 mt-3 border-orange-glow" style={{ borderRadius: "16px", background: "rgba(240, 89, 31, 0.04)" }}>
                                            <CardBody className="p-4">
                                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                                                    <div>
                                                        <h5 className="text-orange cocon fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                                                            <span>💸</span> Refund & Payout Status
                                                        </h5>
                                                        <p className="text-white-50 font-13 mb-0" style={{ lineHeight: "1.5" }}>
                                                            Order Value: <strong className="text-white">${dispute.order_price || 0}</strong> | 
                                                            Status: {
                                                                !dispute.refund_status ? (
                                                                    <span className="badge bg-secondary ms-1">No Request Yet</span>
                                                                ) : dispute.refund_status === 'requested' ? (
                                                                    <span className="badge bg-warning text-dark ms-1">Refund Requested</span>
                                                                ) : dispute.refund_status === 'approved' ? (
                                                                    <span className="badge bg-success ms-1">Refund Approved</span>
                                                                ) : (
                                                                    <span className="badge bg-danger ms-1">Refund Declined</span>
                                                                )
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                                        {/* Client Interface: Request Refund */}
                                                        {myRole === 'client' && !dispute.refund_status && (
                                                            <Button 
                                                                onClick={handleRequestRefund}
                                                                disabled={refunding}
                                                                style={{
                                                                    backgroundColor: "#f0591f",
                                                                    border: "none",
                                                                    fontWeight: 600,
                                                                    borderRadius: "8px",
                                                                    padding: "8px 20px",
                                                                    fontSize: "13px",
                                                                    color: "#ffffff"
                                                                }}
                                                            >
                                                                {refunding ? <Spinner size="sm" /> : "Request Money Refund"}
                                                            </Button>
                                                        )}

                                                        {/* Client Feedback States */}
                                                        {myRole === 'client' && dispute.refund_status === 'requested' && (
                                                            <div className="text-warning font-12 fw-bold d-flex align-items-center gap-1">
                                                                <span>⏳</span> Waiting for GrapeTask Admin approval.
                                                            </div>
                                                        )}

                                                        {/* Admin Interface: Approve / Decline */}
                                                        {isAdmin && dispute.refund_status === 'requested' && (
                                                            <>
                                                                <Button 
                                                                    onClick={handleDeclineRefund}
                                                                    disabled={refunding}
                                                                    color="danger"
                                                                    outline
                                                                    style={{
                                                                        borderRadius: "8px",
                                                                        padding: "8px 18px",
                                                                        fontSize: "13px",
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    Decline Refund
                                                                </Button>
                                                                <Button 
                                                                    onClick={handleApproveRefund}
                                                                    disabled={refunding}
                                                                    style={{
                                                                        backgroundColor: "#10b981",
                                                                        border: "none",
                                                                        color: "#ffffff",
                                                                        fontWeight: 600,
                                                                        borderRadius: "8px",
                                                                        padding: "8px 20px",
                                                                        fontSize: "13px"
                                                                    }}
                                                                >
                                                                    {refunding ? <Spinner size="sm" /> : "Approve & Credit Client"}
                                                                </Button>
                                                            </>
                                                        )}

                                                        {/* General Completed States */}
                                                        {dispute.refund_status === 'approved' && (
                                                            <div className="text-success font-13 fw-bold d-flex align-items-center gap-1">
                                                                <span>🎉</span> Refund approved! Amount credited back to Client balance.
                                                            </div>
                                                        )}

                                                        {dispute.refund_status === 'declined' && (
                                                            <div className="text-danger font-13 fw-bold d-flex align-items-center gap-1">
                                                                <span>❌</span> Refund request was declined by Admin.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {selectedFile && (
                                        <div className="selected-file-pill mx-4 mt-3">
                                            <FaPaperclip className="me-2 animate-bounce" />
                                            <span>{selectedFile.name}</span>
                                            <button className="ms-auto" onClick={() => setSelectedFile(null)}>&times;</button>
                                        </div>
                                    )}
                                    <form onSubmit={handleSendReply} className="p-3 p-md-4 d-flex align-items-center gap-2">
                                        <button 
                                            type="button" 
                                            className="attach-btn-modern" 
                                            onClick={() => fileInputRef.current.click()} 
                                            title="Upload Evidence"
                                            disabled={isChatLockedForMe}
                                        >
                                            <FaPaperclip />
                                        </button>
                                        <input type="file" ref={fileInputRef} className="d-none" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                        
                                        <Input 
                                            type="text" 
                                            className="chat-input-field-premium" 
                                            placeholder={!isChatLockedForMe ? "Type your response..." : "This chat is locked and archived."}
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            disabled={isChatLockedForMe}
                                        />
                                        
                                        <Button type="submit" className="send-btn-modern" disabled={sending || isChatLockedForMe || (!replyMessage && !selectedFile)}>
                                            {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SIDEBAR */}
                        {!isFullScreen && (
                            <div className="col-lg-4 order-1 order-lg-2">
                                {/* Information Card */}
                                <Card className="sidebar-info-card border-0">
                                <CardBody className="p-4">
                                    <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2 cocon">
                                        <FaInfoCircle className="text-orange" /> Ticket Info
                                    </h5>
                                    
                                    <div className="info-group mb-4">
                                        <label className="text-white-50 font-11 text-uppercase tracking-wider fw-bold">Issue Category</label>
                                        <div className="text-white fw-medium mt-1">{dispute.issue_type}</div>
                                    </div>

                                    <div className="info-group mb-4">
                                        <label className="text-white-50 font-11 text-uppercase tracking-wider fw-bold">Dispute Description</label>
                                        <div className="desc-box mt-2">
                                            {dispute.description}
                                        </div>
                                    </div>

                                    <hr className="border-white-10 my-4" />

                                    <div className="d-flex align-items-center gap-3">
                                        <div className="date-icon-box">
                                            <FaCalendarAlt className="text-orange" />
                                        </div>
                                        <div>
                                            <div className="text-white-50 font-11">CREATED ON</div>
                                            <div className="text-white font-13 fw-bold">
                                                {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "April 14, 2026"}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Discussion Group Members Card */}
                            <Card className="sidebar-info-card border-0 mt-4">
                                <CardBody className="p-4">
                                    <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2 cocon">
                                        <FaUsers className="text-orange" /> Discussion Group
                                    </h5>
                                    <div className="d-flex flex-column gap-3">
                                        {dispute.participants && dispute.participants.map((member, mIdx) => {
                                            const role = member.role?.toLowerCase() || "";
                                            const isOnline = member.online;
                                            
                                            let badgeClass = "client";
                                            let badgeText = "Client";
                                            let avatarClass = "client";
                                            
                                            if (role === "admin") {
                                                badgeClass = "admin";
                                                badgeText = "Admin";
                                                avatarClass = "admin";
                                            } else if (role === "expert") {
                                                badgeClass = "expert";
                                                badgeText = "Expert";
                                                avatarClass = "expert";
                                            } else if (role === "bd") {
                                                badgeClass = "bd";
                                                badgeText = "BD";
                                                avatarClass = "bd";
                                            }
                                            
                                            const initial = member.name ? member.name.charAt(0).toUpperCase() : "U";

                                            return (
                                                <div className="member-row" key={mIdx}>
                                                    <div className={`member-avatar ${avatarClass}`}>{initial}</div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <span className="member-name">{member.name}</span>
                                                            <span className={`member-badge ${badgeClass}`}>{badgeText}</span>
                                                        </div>
                                                        <span className={`member-status ${isOnline ? "online" : ""}`}>
                                                            {isOnline ? "In Chat Room" : (role === "admin" ? "Arriving shortly" : "Offline")}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        )}
                    </div>
                </div>

                <style>{`
                    .dispute-page-wrapper {
                        background: radial-gradient(circle at 10% 20%, rgba(240, 89, 31, 0.04), transparent 400px),
                                    radial-gradient(circle at 90% 80%, rgba(79, 70, 229, 0.03), transparent 400px),
                                    #060a13;
                        color: #ffffff;
                    }

                    .max-width-chat { max-width: 1200px; margin: 0 auto; transition: max-width 0.3s ease-in-out; }
                    .max-width-chat-full { max-width: 100%; padding-left: 15px !important; padding-right: 15px !important; margin: 0 auto; transition: max-width 0.3s ease-in-out; }

                    /* Back Button */
                    .back-btn-modern {
                        width: 42px;
                        height: 42px;
                        border-radius: 12px;
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .back-btn-modern:hover {
                        background: #f0591f;
                        border-color: #f0591f;
                        transform: translateX(-3px);
                        box-shadow: 0 0 15px rgba(240, 89, 31, 0.4);
                    }

                    /* Chat Card */
                    .chat-card-premium {
                        background: rgba(15, 23, 42, 0.55);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        border-radius: 24px;
                        height: 75vh;
                        display: flex;
                        flex-direction: column;
                        backdrop-filter: blur(20px);
                        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
                    }

                    .messages-flow {
                        flex-grow: 1;
                        overflow-y: auto;
                        scrollbar-width: thin;
                        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
                    }

                    .messages-flow::-webkit-scrollbar {
                        width: 6px;
                    }
                    .messages-flow::-webkit-scrollbar-thumb {
                        background-color: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }

                    /* Live Workspace Header Panel */
                    .room-banner-premium {
                        background: rgba(255, 255, 255, 0.02);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                        border-top-left-radius: 24px;
                        border-top-right-radius: 24px;
                    }
                    .banner-icon-container {
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        background: rgba(240, 89, 31, 0.1);
                        border: 1px solid rgba(240, 89, 31, 0.2);
                    }
                    .pulsating {
                        animation: pulse 2s infinite alternate;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.8; }
                        100% { transform: scale(1.15); opacity: 1; }
                    }
                    .bg-live-badge {
                        background: rgba(16, 185, 129, 0.1);
                        border: 1px solid rgba(16, 185, 129, 0.2);
                    }
                    .live-pulse {
                        width: 8px;
                        height: 8px;
                        background: #10b981;
                        border-radius: 50%;
                        display: inline-block;
                        box-shadow: 0 0 8px #10b981;
                        animation: livePulse 1.5s infinite;
                    }
                    .fullscreen-toggle-btn-premium {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: rgba(255, 255, 255, 0.7);
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .fullscreen-toggle-btn-premium:hover {
                        background: rgba(240, 89, 31, 0.15);
                        border-color: rgba(240, 89, 31, 0.3);
                        color: #f0591f;
                        transform: scale(1.05);
                    }
                    @keyframes livePulse {
                        0% { transform: scale(0.9); opacity: 0.6; }
                        50% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(0.9); opacity: 0.6; }
                    }

                    /* Message Bubbles - Color-Coded Roles */
                    .message-bubble {
                        max-width: 80%;
                        padding: 15px 20px;
                        border-radius: 20px;
                        font-size: 14px;
                        line-height: 1.6;
                        transition: all 0.2s ease-in-out;
                    }

                    .message-bubble.bubble-me {
                        background: linear-gradient(135deg, #f0591f 0%, #d94e1a 100%);
                        color: white;
                        border-bottom-right-radius: 4px;
                        box-shadow: 0 8px 20px rgba(240, 89, 31, 0.15);
                    }
                    .message-bubble.bubble-role-expert {
                        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                        color: white;
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        border-bottom-left-radius: 4px;
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.08);
                    }
                    .message-bubble.bubble-role-bd {
                        background: linear-gradient(135deg, #022c22 0%, #064e3b 100%);
                        color: white;
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        border-bottom-left-radius: 4px;
                        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.08);
                    }
                    .message-bubble.bubble-role-admin {
                        background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
                        color: white;
                        border: 1px solid rgba(245, 158, 11, 0.3);
                        border-bottom-left-radius: 4px;
                        box-shadow: 0 8px 20px rgba(245, 158, 11, 0.08);
                    }
                    .message-bubble.bubble-role-client {
                        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                        color: white;
                        border: 1px solid rgba(240, 89, 31, 0.2);
                        border-bottom-left-radius: 4px;
                        box-shadow: 0 8px 20px rgba(240, 89, 31, 0.04);
                    }

                    .bubble-meta {
                        font-size: 11px;
                        margin-bottom: 6px;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 4px;
                    }

                    /* Badges for Sender Roles */
                    .chat-role-badge {
                        font-size: 8px;
                        font-weight: 800;
                        padding: 1px 6px;
                        border-radius: 4px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .chat-role-badge.badge-current-user {
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                    }
                    .chat-role-badge.badge-role-admin {
                        background: rgba(245, 158, 11, 0.2);
                        color: #fbbf24;
                        border: 1px solid rgba(245, 158, 11, 0.3);
                    }
                    .chat-role-badge.badge-role-expert {
                        background: rgba(99, 102, 241, 0.2);
                        color: #a5b4fc;
                        border: 1px solid rgba(99, 102, 241, 0.3);
                    }
                    .chat-role-badge.badge-role-bd {
                        background: rgba(16, 185, 129, 0.2);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.3);
                    }
                    .chat-role-badge.badge-role-client {
                        background: rgba(240, 89, 31, 0.2);
                        color: #fb923c;
                        border: 1px solid rgba(240, 89, 31, 0.3);
                    }

                    /* System Alert Banner */
                    .system-alert-banner {
                        background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.03) 100%);
                        border: 1px solid rgba(239, 68, 68, 0.2);
                        box-shadow: 0 10px 35px rgba(239, 68, 68, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.03);
                        border-left: 4px solid #ef4444;
                        padding: 18px 22px;
                        border-radius: 16px;
                        max-width: 90%;
                        width: 100%;
                    }
                    .system-alert-icon-wrap {
                        font-size: 22px;
                        line-height: 1;
                    }
                    .system-alert-title {
                        font-size: 12px;
                        font-weight: 700;
                        color: #ef4444;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 4px;
                    }
                    .system-alert-text {
                        font-size: 13px;
                        color: #cbd5e1;
                        line-height: 1.6;
                    }

                    /* Evidence & Attachments */
                    .evidence-link {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: rgba(0, 0, 0, 0.25);
                        padding: 10px 14px;
                        border-radius: 12px;
                        text-decoration: none !important;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .evidence-link:hover {
                        background: rgba(255, 255, 255, 0.05);
                        border-color: #f0591f;
                        transform: translateY(-1px);
                    }

                    /* Input Section */
                    .chat-input-section {
                        background: rgba(0, 0, 0, 0.15);
                        border-top: 1px solid rgba(255, 255, 255, 0.06);
                    }

                    .chat-input-field-premium {
                        background: rgba(255, 255, 255, 0.03) !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        border-radius: 14px !important;
                        color: white !important;
                        padding: 12px 18px !important;
                    }

                    .chat-input-field-premium:focus {
                        border-color: #f0591f !important;
                        box-shadow: 0 0 10px rgba(240, 89, 31, 0.15) !important;
                    }

                    .send-btn-modern {
                        background: #f0591f !important;
                        border: none !important;
                        border-radius: 14px !important;
                        width: 50px;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 15px rgba(240, 89, 31, 0.3) !important;
                        transition: 0.3s !important;
                    }
                    .send-btn-modern:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(240, 89, 31, 0.5) !important;
                    }

                    .attach-btn-modern {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 14px;
                        color: #94a3b8;
                        width: 48px;
                        height: 48px;
                        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .attach-btn-modern:hover {
                        color: white;
                        background: rgba(255, 255, 255, 0.08);
                        border-color: rgba(255, 255, 255, 0.15);
                    }

                    /* Sidebar Cards & Lists */
                    .sidebar-info-card {
                        background: rgba(15, 23, 42, 0.35) !important;
                        border: 1px solid rgba(255, 255, 255, 0.06) !important;
                        border-radius: 24px !important;
                        backdrop-filter: blur(15px);
                    }

                    .desc-box {
                        background: rgba(0, 0, 0, 0.2);
                        padding: 15px 18px;
                        border-radius: 14px;
                        font-size: 13px;
                        line-height: 1.6;
                        border-left: 3px solid #f0591f;
                        color: #e2e8f0;
                    }

                    .date-icon-box {
                        width: 36px;
                        height: 36px;
                        background: rgba(240, 89, 31, 0.1);
                        border: 1px solid rgba(240, 89, 31, 0.2);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .status-badge-premium {
                        background: rgba(240, 89, 31, 0.15);
                        color: #f0591f;
                        border: 1px solid rgba(240, 89, 31, 0.4);
                        padding: 8px 18px;
                        border-radius: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        font-size: 11px;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    }

                    .selected-file-pill {
                        background: rgba(240, 89, 31, 0.08);
                        border: 1px dashed rgba(240, 89, 31, 0.4);
                        padding: 8px 15px;
                        border-radius: 10px;
                        font-size: 12px;
                        color: #f0591f;
                        display: flex;
                        align-items: center;
                    }
                    .selected-file-pill button {
                        background: none; border: none; color: #f0591f; font-size: 18px; line-height: 1;
                    }

                    /* 4-Way Discussion Member List */
                    .member-row {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 8px 0;
                    }
                    .member-avatar {
                        width: 38px;
                        height: 38px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 14px;
                        color: white;
                    }
                    .member-avatar.admin {
                        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
                        box-shadow: 0 0 10px rgba(217, 119, 6, 0.2);
                    }
                    .member-avatar.bd {
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                        box-shadow: 0 0 10px rgba(5, 150, 105, 0.2);
                    }
                    .member-avatar.expert {
                        background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
                        box-shadow: 0 0 10px rgba(79, 70, 229, 0.2);
                    }
                    .member-avatar.client {
                        background: linear-gradient(135deg, #f0591f 0%, #d94e1a 100%);
                        box-shadow: 0 0 10px rgba(240, 89, 31, 0.2);
                    }
                    .member-name {
                        font-size: 13px;
                        font-weight: 600;
                        color: white;
                    }
                    .member-badge {
                        font-size: 9px;
                        font-weight: 700;
                        padding: 2px 6px;
                        border-radius: 6px;
                        text-transform: uppercase;
                    }
                    .member-badge.admin {
                        background: rgba(217, 119, 6, 0.15);
                        color: #f59e0b;
                        border: 1px solid rgba(217, 119, 6, 0.3);
                    }
                    .member-badge.bd {
                        background: rgba(5, 150, 105, 0.15);
                        color: #10b981;
                        border: 1px solid rgba(5, 150, 105, 0.3);
                    }
                    .member-badge.expert {
                        background: rgba(79, 70, 229, 0.15);
                        color: #818cf8;
                        border: 1px solid rgba(79, 70, 229, 0.3);
                    }
                    .member-badge.client {
                        background: rgba(240, 89, 31, 0.15);
                        color: #fb923c;
                        border: 1px solid rgba(240, 89, 31, 0.3);
                    }
                    .member-status {
                        font-size: 10px;
                        color: #94a3b8;
                        display: block;
                        margin-top: 1px;
                    }
                    .member-status.online {
                        color: #10b981;
                    }
                    .member-status.online::before {
                        content: "● ";
                        font-size: 10px;
                        vertical-align: middle;
                    }

                    /* Animation helper */
                    .animate-fade-in {
                        animation: fadeIn 0.4s ease-out forwards;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .font-11 { font-size: 11px; }
                    .font-12 { font-size: 12px; }
                    .text-white-10 { border-color: rgba(255, 255, 255, 0.08) !important; }

                    /* Mobile Adjustments */
                    @media (max-width: 768px) {
                        .chat-card-premium { height: 65vh; }
                        .message-bubble { max-width: 90%; }
                        .dispute-page-wrapper { padding-top: 20px; }
                        .max-width-chat { padding: 0 10px; }
                    }

                    .loader-container {
                        height: 100vh; background: #060a13; display: flex; align-items: center; justify-content: center;
                    }

                    /* Premium Overlapping Avatar Stack */
                    .avatar-group-premium {
                        display: flex;
                        margin-left: 8px;
                    }
                    .avatar-premium-stacked {
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        color: white;
                        border: 2px solid #0c1524;
                        margin-left: -8px;
                        position: relative;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: pointer;
                    }
                    .avatar-premium-stacked:first-child {
                        margin-left: 0;
                    }
                    .avatar-premium-stacked:hover {
                        transform: translateY(-3px) scale(1.15);
                        z-index: 10;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                    }
                    
                    /* Stacked Avatar Gradient Backgrounds */
                    .avatar-premium-stacked.client {
                        background: linear-gradient(135deg, #4f46e5, #3b82f6);
                        box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
                    }
                    .avatar-premium-stacked.expert {
                        background: linear-gradient(135deg, #10b981, #059669);
                        box-shadow: 0 0 8px rgba(16, 185, 129, 0.2);
                    }
                    .avatar-premium-stacked.bd {
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        box-shadow: 0 0 8px rgba(245, 158, 11, 0.2);
                    }
                    .avatar-premium-stacked.admin {
                        background: linear-gradient(135deg, #ec4899, #db2777);
                        box-shadow: 0 0 8px rgba(236, 72, 153, 0.2);
                    }
                    
                    /* Glowing Online Indicator inside Stack */
                    .stack-online-dot {
                        position: absolute;
                        bottom: -2px;
                        right: -2px;
                        width: 9px;
                        height: 9px;
                        background: #10b981;
                        border: 2px solid #0c1524;
                        border-radius: 50%;
                        box-shadow: 0 0 6px #10b981;
                    }

                    /* Absolute Fullscreen Native Mode Styles */
                    .fullscreen-mode-active {
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: hidden;
                    }
                    .fullscreen-mode-active .chat-card-premium {
                        height: 100vh !important;
                        border-radius: 0px !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .fullscreen-mode-active .room-banner-premium {
                        border-radius: 0px !important;
                    }
                    .fullscreen-mode-active .max-width-chat-full {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .fullscreen-mode-active .row {
                        margin: 0 !important;
                    }
                    .fullscreen-mode-active .col-lg-12 {
                        padding: 0 !important;
                    }

                    /* Admin Resolution Console Panel */
                    .admin-resolution-panel-premium {
                        background: rgba(240, 89, 31, 0.05);
                        border: 1px solid rgba(240, 89, 31, 0.2);
                        border-radius: 16px;
                    }
                    .btn-resolution-approve {
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        transition: all 0.2s ease-in-out;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                    .btn-resolution-approve:hover:not(:disabled) {
                        background: #bd2130;
                        transform: scale(1.03);
                        box-shadow: 0 0 10px rgba(220, 53, 69, 0.35);
                    }
                    .btn-resolution-decline {
                        background: #198754;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        transition: all 0.2s ease-in-out;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                    .btn-resolution-decline:hover:not(:disabled) {
                        background: #157347;
                        transform: scale(1.03);
                        box-shadow: 0 0 10px rgba(25, 135, 84, 0.35);
                    }
                    .btn-resolution-approve:disabled, .btn-resolution-decline:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                    
                    /* Resolved Banner */
                    .system-resolution-badge {
                        background: rgba(16, 185, 129, 0.08);
                        border: 1px solid rgba(16, 185, 129, 0.2);
                        border-radius: 12px;
                        color: #10b981;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }

                    /* Dynamic Tester Toggle */
                    .tester-toggle-btn-premium {
                        background: rgba(240, 89, 31, 0.08);
                        border: 1.5px solid rgba(240, 89, 31, 0.25);
                        padding: 4px 10px;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease-in-out;
                    }
                    .tester-toggle-btn-premium:hover {
                        background: rgba(240, 89, 31, 0.15);
                        transform: scale(1.05);
                        border-color: rgba(240, 89, 31, 0.55);
                    }

                    /* Propose agreement button */
                    .btn-resolution-propose {
                        background: #f59e0b;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        transition: all 0.2s ease-in-out;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                    .btn-resolution-propose:hover:not(:disabled) {
                        background: #d97706;
                        transform: scale(1.03);
                        box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
                    }

                    /* Participant voting card */
                    .participant-voting-card {
                        background: rgba(245, 158, 11, 0.05);
                        border: 1.5px solid rgba(245, 158, 11, 0.25);
                        border-radius: 16px;
                    }
                `}</style>
            </div>
            {!isFullScreen && <Footer />}

            {/* Unified Elegant Responsive Confirmation Modal */}
            <Modal 
                isOpen={confirmModal.isOpen} 
                toggle={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                centered
                style={{
                    maxWidth: "500px",
                    width: "92%",
                    margin: "0.5rem auto"
                }}
            >
                <ModalHeader 
                    toggle={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                    style={{ 
                        backgroundColor: "#020617", 
                        borderBottom: "1px solid rgba(255, 255, 255, 0.07)", 
                        color: confirmModal.confirmColor, 
                        fontFamily: "Cocon, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        padding: "16px 20px"
                    }}
                >
                    {confirmModal.title}
                </ModalHeader>
                <ModalBody style={{ backgroundColor: "#020617", color: "#ffffff", padding: "24px 20px" }}>
                    <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "12px", lineHeight: "1.4" }}>
                        {confirmModal.message}
                    </p>
                    {confirmModal.subtext && (
                        <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.92rem", lineHeight: "1.5", marginBottom: 0 }}>
                            {confirmModal.subtext}
                        </p>
                    )}
                </ModalBody>
                <ModalFooter style={{ backgroundColor: "#020617", borderTop: "1px solid rgba(255, 255, 255, 0.07)", padding: "12px 20px" }}>
                    <Button 
                        color="secondary" 
                        outline 
                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                        style={{ 
                            borderColor: "rgba(255, 255, 255, 0.07)", 
                            color: "#d4d4d8",
                            borderRadius: "8px",
                            padding: "8px 18px",
                            fontSize: "13px",
                            fontWeight: 600
                        }}
                    >
                        No, Cancel
                    </Button>
                    <Button 
                        onClick={confirmModal.onConfirm} 
                        style={{ 
                            backgroundColor: confirmModal.confirmColor, 
                            border: "none", 
                            color: "#ffffff", 
                            fontWeight: 600,
                            borderRadius: "8px",
                            padding: "8px 20px",
                            fontSize: "13px"
                        }}
                    >
                        {confirmModal.confirmText}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default DisputeDetail;
