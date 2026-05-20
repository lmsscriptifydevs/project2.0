import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Spinner, Badge, Input, Button, Card, CardBody } from "reactstrap";
import { 
    FaArrowLeft, FaPaperPlane, FaPaperclip, FaFileAlt, 
    FaTicketAlt, FaCalendarAlt, FaUserCircle, FaDownload, FaChevronRight 
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DisputeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [sending, setSending] = useState(false);

    const BASE_URL = "https://portal.grapetask.co/api";
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    const fetchDetails = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/disputes/show/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDispute(res.data);
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            toast.error("Could not load dispute details");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            fetchDetails();
        } catch (err) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="loader-container">
            <Spinner style={{color: '#f0591f'}} />
        </div>
    );

    if (!dispute) return <div className="text-center p-5 text-white poppins">Dispute not found</div>;

    return (
        <>
            <Navbar />
        <div className="dispute-page-wrapper py-3 py-md-5 px-2 px-md-4 min-vh-100 poppins">
            <ToastContainer theme="dark" />
            
            {/* Header Area */}
            <div className="container-fluid max-width-chat p-0 mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <button className="back-btn-modern" onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h4 className="fw-bold mb-0 text-white cocon">Ticket Details</h4>
                            <div className="d-flex align-items-center gap-2 mt-1">
                                <span className="text-white-50 font-12">Disputes</span>
                                <FaChevronRight size={8} className="text-white-50" />
                                <span className="text-orange font-12 fw-bold">#GT-{dispute.ticket_id}</span>
                            </div>
                        </div>
                    </div>
                    <Badge className="status-badge-premium">
                        {dispute.status?.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="container-fluid max-width-chat p-0">
                <div className="row g-4">
                    {/* LEFT: CHAT AREA */}
                    <div className="col-lg-8 order-2 order-lg-1">
                        <div className="chat-card-premium shadow-2xl">
                            <div className="messages-flow p-3 p-md-4">
                                {dispute.messages.map((msg, index) => (
                                    <div key={index} className={`d-flex mb-4 ${msg.sender.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`message-bubble ${msg.sender.role === 'user' ? 'user' : 'support'}`}>
                                            <div className="bubble-meta">
                                                <FaUserCircle className="me-1 opacity-70" />
                                                {msg.sender.name}
                                            </div>
                                            <div className="message-text">{msg.message}</div>
                                            
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
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="chat-input-section">
                                {selectedFile && (
                                    <div className="selected-file-pill mx-4 mt-3">
                                        <FaPaperclip className="me-2" />
                                        <span>{selectedFile.name}</span>
                                        <button className="ms-auto" onClick={() => setSelectedFile(null)}>&times;</button>
                                    </div>
                                )}
                                <form onSubmit={handleSendReply} className="p-3 p-md-4 d-flex align-items-center gap-2">
                                    <button type="button" className="attach-btn-modern" onClick={() => fileInputRef.current.click()}>
                                        <FaPaperclip />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="d-none" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                    
                                    <Input 
                                        type="text" 
                                        className="chat-input-field-premium" 
                                        placeholder="Type your response..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                    />
                                    
                                    <Button type="submit" className="send-btn-modern" disabled={sending || (!replyMessage && !selectedFile)}>
                                        {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <div className="col-lg-4 order-1 order-lg-2">
                        <Card className="sidebar-info-card border-0">
                            <CardBody className="p-4">
                                <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                                    <div className="orange-dot"></div> Information
                                </h5>
                                
                                <div className="info-group mb-4">
                                    <label className="text-white-50 font-11 text-uppercase tracking-wider fw-bold">Issue Category</label>
                                    <div className="text-white fw-medium">{dispute.issue_type}</div>
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
                                        <div className="text-white font-13 fw-bold">April 14, 2026</div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
                .dispute-page-wrapper {
                    background-color: #020617;
                    color: #ffffff;
                }

                .max-width-chat { max-width: 1200px; margin: 0 auto; }

                /* Back Button */
                .back-btn-modern {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.3s;
                }

                .back-btn-modern:hover {
                    background: #f0591f;
                    border-color: #f0591f;
                    transform: translateX(-3px);
                }

                /* Chat Card */
                .chat-card-premium {
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    height: 70vh;
                    display: flex;
                    flex-direction: column;
                    backdrop-filter: blur(10px);
                }

                .messages-flow {
                    flex-grow: 1;
                    overflow-y: auto;
                    scrollbar-width: thin;
                }

                /* Message Bubbles */
                .message-bubble {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .message-bubble.user {
                    background: linear-gradient(135deg, #f0591f 0%, #d94e1a 100%);
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 10px 15px -3px rgba(240, 89, 31, 0.2);
                }

                .message-bubble.support {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-bottom-left-radius: 4px;
                }

                .bubble-meta {
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                }

                /* Evidence/Attachments */
                .evidence-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 10px;
                    border-radius: 12px;
                    text-decoration: none !important;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: 0.2s;
                }

                .evidence-link:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: #f0591f;
                }

                /* Input Section */
                .chat-input-section {
                    background: rgba(0, 0, 0, 0.2);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .chat-input-field-premium {
                    background: rgba(255, 255, 255, 0.03) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 14px !important;
                    color: white !important;
                    padding: 12px 18px !important;
                }

                .chat-input-field-premium:focus {
                    border-color: #f0591f !important;
                    box-shadow: none !important;
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
                }

                .attach-btn-modern {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    color: #94a3b8;
                    width: 48px;
                    height: 48px;
                    transition: 0.3s;
                }

                .attach-btn-modern:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Sidebar Info */
                .sidebar-info-card {
                    background: rgba(255, 255, 255, 0.02) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 24px !important;
                }

                .desc-box {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    border-radius: 14px;
                    font-size: 13px;
                    line-height: 1.6;
                    border-left: 3px solid #f0591f;
                }

                .orange-dot {
                    width: 8px;
                    height: 8px;
                    background: #f0591f;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #f0591f;
                }

                .status-badge-premium {
                    background: rgba(240, 89, 31, 0.15) !important;
                    color: #f0591f !important;
                    border: 1px solid rgba(240, 89, 31, 0.4);
                    padding: 8px 16px !important;
                    border-radius: 12px !important;
                    font-weight: 700;
                }

                .selected-file-pill {
                    background: rgba(240, 89, 31, 0.1);
                    border: 1px dashed #f0591f;
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

                .font-11 { font-size: 11px; }
                .font-12 { font-size: 12px; }
                .text-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .chat-card-premium { height: 60vh; }
                    .message-bubble { max-width: 92%; }
                    .dispute-page-wrapper { padding-top: 20px; }
                    .max-width-chat { padding: 0 10px; }
                }

                .loader-container {
                    height: 100vh; background: #020617; display: flex; align-items: center; justify-content: center;
                }
            `}</style>
        </div>
        <Footer />
        </>
    );
};

export default DisputeDetail;
