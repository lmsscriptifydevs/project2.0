import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../redux/slices/messageSlice";
import { useUserData } from "../utils/useLocalStorage";
import { BsCheckAll, BsCheck, BsImages, BsFileEarmark } from "react-icons/bs";
import { AiOutlineSend, AiOutlinePaperClip, AiOutlineSmile, AiOutlineCamera } from "react-icons/ai";
import { HiOutlinePhotograph, HiOutlineCamera, HiOutlineDocumentText } from "react-icons/hi";

const ChatWindow = ({ conversation }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const currentUser = useUserData();

  const messages = conversation?.messages || [];
  const loading = false;

  useEffect(() => {
    if (isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    isInitialLoad.current = true;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    }, 50);
    return () => clearTimeout(timer);
  }, [conversation?.id]);

  const containsContactDetails = (text) => {
    if (!text) return false;
    const forbiddenKeywords = [
      'whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me',
      'telegram', 'skype', 'imo', 'viber', 'wechat',
      'phone number', 'mobile number', 'contact number', 'phone no', 'mobile no',
      'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe',
      'call me', 'contact me on', 'baat karein', 'direct client'
    ];
    const normalizedText = text.toLowerCase();
    for (const keyword of forbiddenKeywords) {
      if (normalizedText.includes(keyword)) return true;
    }
    
    // Clean dates and currency/price/IDs to avoid false positives
    let cleanText = normalizedText.replace(/\b\d{4}[-\/]\d{2}[-\/]\d{2}\b/g, '');
    cleanText = cleanText.replace(/\b\d{2}[-\/]\d{2}[-\/]\d{4}\b/g, '');
    cleanText = cleanText.replace(/[#$€£]\d+/g, '');
    
    const numPattern = /(?:\d[\s-]?){7,15}/;
    if (numPattern.test(cleanText)) {
      return true;
    }
    return false;
  };

  const renderMessageText = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="gt-clickable-link"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (content) {
      if (containsContactDetails(content)) {
        setShowWarning(true);
        return;
      }
      dispatch(sendMessage({
        conversationId: conversation.id,
        content: content
      }));
      setNewMessage("");
    }
  };

  const handleFileUpload = (file, type) => {
    if (!file) return;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', conversation.id);
    formData.append('type', type);
    
    // Here you would typically send to your API
    console.log(`Uploading ${type}:`, file.name);
    
    // For now, just dispatch a message with file info
    dispatch(sendMessage({
      conversationId: conversation.id,
      content: `📎 ${file.name}`,
      file: file,
      fileType: type
    }));
    
    setShowMediaOptions(false);
  };

  const handleMediaOptionClick = (option) => {
    switch(option) {
      case 'gallery':
        imageInputRef.current?.click();
        break;
      case 'camera':
        cameraInputRef.current?.click();
        break;
      case 'document':
        fileInputRef.current?.click();
        break;
      default:
        break;
    }
  };

  const getMessageStatusIcon = (status) => {
    if (status === 'read') return <BsCheckAll size={16} color="#34B7F1" />;
    if (status === 'delivered') return <BsCheckAll size={16} color="var(--bodyGrayText)" />;
    return <BsCheck size={16} color="var(--bodyGrayText)" />;
  };

  return (
    <div className="gt-chat-window-wrapper">
      {/* Messages Area */}
      <div ref={messagesContainerRef} className="gt-messages-container">
        {loading ? (
          <div className="gt-chat-loading">
            <div className="gt-spinner"></div>
          </div>
        ) : (
          <div className="gt-messages-list">
            <div style={{ marginTop: "auto" }} />
            
            {/* WhatsApp Style Date Badge */}
            {messages?.length > 0 && (
              <div className="gt-date-badge-wrapper">
                <span className="gt-date-badge">Today</span>
              </div>
            )}
            
            {/* End to End Encryption Notice */}
            {messages?.length > 0 && (
              <div className="gt-encryption-notice">
                <span className="gt-enc-icon">🔒</span> Messages and calls are end-to-end encrypted. No one outside of this chat, not even GrapeTask, can read or listen to them.
              </div>
            )}

            {messages?.length > 0 ? (
              messages.map((message) => {
                const isMine = message.senderId === currentUser?.id || message.sender_id === currentUser?.id || message.isMine;
                const hasFile = message.file_path || message.filePath;
                const fileName = message.file_name || message.fileName || "";
                
                const isImg = hasFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                const isAud = hasFile && /\.(mp3|wav|ogg|m4a|aac)$/i.test(fileName);
                const isVideo = hasFile && /\.(mp4|webm|ogg|mov)$/i.test(fileName);
                
                const fileUrl = hasFile ? (message.file_path || message.filePath).startsWith("http") ? (message.file_path || message.filePath) : `https://portal.grapetask.co/storage/${message.file_path || message.filePath}` : "";
                
                return (
                  <div key={message.id} className={`gt-message-row ${isMine ? 'gt-message-mine' : 'gt-message-theirs'}`}>
                    <div className="gt-message-bubble">
                      {!isMine && conversation.is_group && (
                        <span className="gt-message-sender-name">
                          {message.sender?.fname || message.sender_name || "Member"} ({message.sender?.role || 'user'})
                        </span>
                      )}
                      
                      {message.message && (
                        <p className="gt-message-text">{renderMessageText(message.message)}</p>
                      )}
                      
                      {isImg && (
                        <div className="gt-message-media-wrap">
                          <img src={fileUrl} alt={fileName} className="gt-message-img" onClick={() => window.open(fileUrl, '_blank')} />
                        </div>
                      )}
                      
                      {isAud && (
                        <div className="gt-message-audio-wrap">
                          <audio controls className="gt-message-audio">
                            <source src={fileUrl} type={`audio/${fileName.split('.').pop()}`} />
                            Your browser does not support the audio.
                          </audio>
                        </div>
                      )}
                      
                      {isVideo && (
                        <div className="gt-message-video-wrap">
                          <video controls className="gt-message-video">
                            <source src={fileUrl} type={`video/${fileName.split('.').pop()}`} />
                            Your browser does not support video.
                          </video>
                        </div>
                      )}
                      
                      {hasFile && !isImg && !isAud && !isVideo && (
                        <div className="gt-message-file-card">
                          <span className="gt-file-card-icon">📁</span>
                          <div className="gt-file-card-details">
                            <span className="gt-file-card-name" title={fileName}>{fileName}</span>
                            <span className="gt-file-card-size">
                              {message.file_size ? `${(message.file_size / 1024).toFixed(1)} KB` : "Attachment"}
                            </span>
                          </div>
                          <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer" className="gt-file-card-btn">
                            ⬇️
                          </a>
                        </div>
                      )}
                      
                      <div className="gt-message-meta">
                        <span className="gt-message-time">
                          {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMine && (
                          <span className="gt-message-status">
                            {getMessageStatusIcon(message.status || 'read')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="gt-empty-chat">
                <div className="gt-empty-chat-msg">Say hi to start the conversation!</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="gt-chat-input-area">
        <button className="gt-icon-btn"><AiOutlineSmile size={24} /></button>
        
        {/* Media Options Button */}
        <div className="gt-media-btn-wrapper">
          <button 
            className="gt-icon-btn" 
            onClick={() => setShowMediaOptions(!showMediaOptions)}
          >
            <AiOutlinePaperClip size={24} />
          </button>
          
          {/* WhatsApp Style Media Options */}
          {showMediaOptions && (
            <div className="gt-media-options">
              <button 
                className="gt-media-option"
                onClick={() => handleMediaOptionClick('gallery')}
              >
                <BsImages size={20} />
                <span>Gallery</span>
              </button>
              <button 
                className="gt-media-option"
                onClick={() => handleMediaOptionClick('camera')}
              >
                <AiOutlineCamera size={20} />
                <span>Camera</span>
              </button>
              <button 
                className="gt-media-option"
                onClick={() => handleMediaOptionClick('document')}
              >
                <BsFileEarmark size={20} />
                <span>Document</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files[0], 'image')}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files[0], 'camera')}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files[0], 'document')}
        />
        
        <form onSubmit={handleSubmit} className="gt-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="gt-chat-input"
          />
        </form>
        
        {newMessage.trim() ? (
          <button className="gt-send-btn" onClick={handleSubmit}>
            <AiOutlineSend size={20} />
          </button>
        ) : (
          <button className="gt-send-btn disabled">
            <AiOutlineSend size={20} />
          </button>
        )}
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="gt-security-modal-overlay">
          <div className="gt-security-modal">
            <div className="gt-security-icon-wrap">⚠️</div>
            <h3 className="gt-security-title">Contact Sharing Restricted</h3>
            <p className="gt-security-body">
              For security, escrow protection, and quality assurance, sharing phone numbers, WhatsApp, emails, or off-platform communication references in Roman Urdu or English is prohibited.
            </p>
            <div className="gt-security-alert">
              <strong>Warning:</strong> Repeated attempts to share contact details will result in your GrapeTask account being <strong>banned / blocked</strong> permanently.
            </div>
            <button className="gt-security-close-btn" onClick={() => setShowWarning(false)}>
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gt-chat-window-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          position: relative;
        }

        .gt-messages-container {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background-color: var(--inbox-surface);
        }
        
        /* Custom Scrollbar for messages */
        .gt-messages-container::-webkit-scrollbar { width: 6px; }
        .gt-messages-container::-webkit-scrollbar-thumb { background-color: var(--inbox-border); border-radius: 4px; }

        .gt-messages-list {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: flex-end;
          gap: 4px;
        }

        .gt-date-badge-wrapper {
          display: flex;
          justify-content: center;
          margin: 24px 0 16px 0;
        }
        .gt-date-badge {
          background-color: var(--inbox-bg);
          color: var(--inbox-text-muted);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid var(--inbox-border);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .gt-encryption-notice {
          background-color: var(--inbox-primary-light);
          color: var(--inbox-primary-hover);
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          padding: 8px 16px;
          border-radius: 8px;
          margin: 0 auto 24px;
          max-width: 80%;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .gt-enc-icon { font-size: 10px; margin-right: 4px; }

        .gt-message-row {
          display: flex;
          margin-bottom: 12px;
          width: 100%;
        }
        .gt-message-mine {
          justify-content: flex-end;
        }
        .gt-message-theirs {
          justify-content: flex-start;
        }

        .gt-message-bubble {
          max-width: 65%;
          padding: 10px 14px;
          border-radius: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        
        /* Modern Fiverr/Upwork Style Bubble Colors */
        .gt-message-mine .gt-message-bubble {
          background-color: var(--inbox-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .gt-message-theirs .gt-message-bubble {
          background-color: var(--inbox-hover);
          color: var(--inbox-text-main);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--inbox-border);
        }

        .gt-message-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          padding-bottom: 2px;
        }

        .gt-message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          align-self: flex-end;
          margin-top: 2px;
        }
        .gt-message-time {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .gt-message-theirs .gt-message-time {
          color: var(--inbox-text-muted);
        }
        .gt-message-status {
          display: flex;
          align-items: center;
        }

        .gt-empty-chat {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .gt-empty-chat-msg {
          background-color: var(--inbox-bg);
          color: var(--inbox-text-muted);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--inbox-border);
        }

        /* ─── INPUT AREA ─── */
        .gt-chat-input-area {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          background-color: var(--inbox-surface);
          gap: 12px;
          border-top: 1px solid var(--inbox-border);
        }
        
        .gt-icon-btn {
          background: transparent;
          border: none;
          color: var(--inbox-text-muted);
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
        }
        .gt-icon-btn:hover {
          background-color: var(--inbox-hover);
          color: var(--inbox-text-main);
        }

        /* ─── MEDIA OPTIONS (WhatsApp Style) ─── */
        .gt-media-btn-wrapper {
          position: relative;
        }

        .gt-media-options {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: var(--inbox-surface);
          border: 1px solid var(--inbox-border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 8px;
          margin-bottom: 8px;
          z-index: 9999;
          min-width: 140px;
          animation: slideUp 0.2s ease-out;
          display: block;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gt-media-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
          color: var(--inbox-text-main);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }

        .gt-media-option:hover {
          background-color: var(--inbox-hover);
        }

        .gt-media-option:active {
          background-color: var(--inbox-primary-light);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .gt-media-options {
            left: auto;
            right: 0;
          }
          
          .gt-chat-input-area {
            padding: 12px 16px;
            gap: 8px;
          }
          
          .gt-messages-container {
            padding: 16px 20px;
          }
        }

        .gt-input-form {
          flex: 1;
          display: flex;
        }
        .gt-chat-input {
          width: 100%;
          background-color: var(--inbox-bg);
          border: 1px solid var(--inbox-border);
          color: var(--inbox-text-main);
          padding: 12px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gt-chat-input:focus {
          border-color: var(--inbox-primary);
          box-shadow: 0 0 0 3px var(--inbox-primary-light);
          background-color: var(--inbox-surface);
        }
        .gt-chat-input::placeholder {
          color: var(--inbox-text-light);
          font-weight: 400;
        }

        .gt-send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--inbox-primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .gt-send-btn:hover {
          background-color: var(--inbox-primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .gt-send-btn.disabled {
          background-color: var(--inbox-bg);
          color: var(--inbox-text-light);
          border: 1px solid var(--inbox-border);
          cursor: default;
          transform: none;
          box-shadow: none;
        }

        /* ─── RICH BUBBLES AND MODAL STYLES ─── */
        .gt-message-sender-name {
          font-size: 11px;
          font-weight: 700;
          color: var(--inbox-primary-hover);
          margin-bottom: 4px;
          display: block;
        }
        .gt-clickable-link {
          color: #34B7F1;
          text-decoration: underline;
          word-break: break-all;
        }
        .gt-message-mine .gt-clickable-link {
          color: #fff;
          text-decoration: underline;
        }
        .gt-message-media-wrap {
          margin: 4px 0;
          border-radius: 8px;
          overflow: hidden;
          max-height: 240px;
          cursor: pointer;
        }
        .gt-message-img {
          width: 100%;
          max-height: 240px;
          object-fit: cover;
          transition: transform 0.2s;
        }
        .gt-message-img:hover {
          transform: scale(1.02);
        }
        .gt-message-audio-wrap {
          margin: 6px 0;
        }
        .gt-message-audio {
          max-width: 100%;
          border-radius: 8px;
          outline: none;
        }
        .gt-message-video-wrap {
          margin: 6px 0;
          border-radius: 8px;
          overflow: hidden;
          max-height: 240px;
        }
        .gt-message-video {
          width: 100%;
          max-height: 240px;
          object-fit: cover;
        }
        .gt-message-file-card {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          padding: 8px 12px;
          margin: 6px 0;
          gap: 10px;
        }
        .gt-message-mine .gt-message-file-card {
          background: rgba(255, 255, 255, 0.15);
        }
        .gt-file-card-icon {
          font-size: 20px;
        }
        .gt-file-card-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .gt-file-card-name {
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gt-file-card-size {
          font-size: 10px;
          opacity: 0.8;
        }
        .gt-file-card-btn {
          font-size: 16px;
          padding: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        /* ─── SECURITY MODAL ─── */
        .gt-security-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          padding: 20px;
        }
        .gt-security-modal {
          background: var(--inbox-surface);
          border: 1px solid var(--inbox-border);
          border-radius: 16px;
          padding: 28px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          animation: modalAppear 0.3s ease-out;
        }
        @keyframes modalAppear {
          from { transform: scale(0.9) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .gt-security-icon-wrap {
          font-size: 40px;
          margin-bottom: 12px;
        }
        .gt-security-title {
          color: #ef4444;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .gt-security-body {
          font-size: 13px;
          color: var(--inbox-text-main);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .gt-security-alert {
          background-color: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 10px 14px;
          border-radius: 6px;
          color: #991b1b;
          font-size: 12px;
          text-align: left;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .gt-security-close-btn {
          width: 100%;
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .gt-security-close-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;