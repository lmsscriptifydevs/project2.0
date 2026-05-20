import { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";
import { fetchMessages } from "../redux/slices/messageSlice";
import { useUserData } from "../utils/useLocalStorage";
import { AiOutlineSearch, AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";

const EMPTY_CONVERSATIONS = [];

const FreelanceInbox = () => {
  const dispatch = useDispatch();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  const { conversations = EMPTY_CONVERSATIONS, loading } = useSelector((state) => state.message);
  const currentUser = useUserData();

  // PERF STARTUP: Defer fetchMessages until after first paint - UI renders first
  useEffect(() => {
    const fetchMessagesData = () => {
      dispatch(fetchMessages());
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchMessagesData, { timeout: 500 });
    } else {
      setTimeout(fetchMessagesData, 0);
    }
  }, [dispatch]);

  const handleConversationClick = useCallback((conversation) => {
    setSelectedConversation(conversation);
  }, []);

  const getOtherParticipant = useCallback(
    (conversation) => conversation.participants?.find((p) => p.id !== currentUser?.id) || conversation.user,
    [currentUser?.id]
  );

  const handleConversationSelect = (conv) => {
    setSelectedConversation(conv);
    setIsMobileChatOpen(true);
    setShowProfileSidebar(false);
  };

  const handleBackToList = () => {
    setIsMobileChatOpen(false);
    setSelectedConversation(null);
  };

  const toggleProfile = () => {
    setShowProfileSidebar(!showProfileSidebar);
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(conv => {
      const otherUser = getOtherParticipant(conv);
      const name = otherUser?.fname || otherUser?.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, getOtherParticipant]);

  const activeUser = selectedConversation ? getOtherParticipant(selectedConversation) : null;

  return (
    <div className="gt-inbox-wrapper">
      <Navbar FirstNav="none" />

      <div className="gt-inbox-layout">
        
        {/* LEFT SIDEBAR: CONVERSATION LIST */}
        <div className={`gt-inbox-sidebar ${isMobileChatOpen ? 'mobile-hidden' : ''}`}>
          <div className="gt-sidebar-header">
            <h2 className="gt-inbox-title">Chats</h2>
            <div className="gt-search-wrapper">
              <AiOutlineSearch className="gt-search-icon" />
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="gt-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="gt-conversations-list">
            {loading ? (
              <div className="gt-loading-state">
                <div className="gt-spinner"></div>
                <p>Loading chats...</p>
              </div>
            ) : filteredConversations?.length > 0 ? (
              [...filteredConversations].sort((a, b) => {
                const aTime = a.lastMessage?.createdAt || a.updated_at || a.created_at || '';
                const bTime = b.lastMessage?.createdAt || b.updated_at || b.created_at || '';
                return new Date(bTime) - new Date(aTime);
              }).map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                const isActive = selectedConversation?.id === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    className={`gt-conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="gt-avatar-wrap">
                      {otherUser?.image ? (
                        <img src={otherUser.image} alt={otherUser.fname || "User"} className="gt-avatar" />
                      ) : (
                        <div className="gt-avatar-placeholder">
                          {(otherUser?.fname || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Placeholder for online status if needed */}
                      <span className="gt-online-indicator"></span>
                    </div>
                    <div className="gt-conv-details">
                      <div className="gt-conv-header">
                        <span className="gt-conv-name">{otherUser?.fname || "Unknown"}</span>
                        <span className="gt-conv-time">
                          {conversation.lastMessage?.createdAt 
                            ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : ''}
                        </span>
                      </div>
                      <div className="gt-conv-footer">
                        <span className="gt-conv-preview">
                          {conversation.lastMessage?.text || "No messages yet"}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="gt-unread-badge">{conversation.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="gt-empty-state">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className={`gt-inbox-main ${!isMobileChatOpen ? 'mobile-hidden' : ''}`}>
          {selectedConversation ? (
            <div className="gt-chat-container">
              {/* WhatsApp Style Chat Header */}
              <div className="gt-chat-header" onClick={toggleProfile}>
                <div className="d-flex align-items-center gap-3">
                  <button className="gt-back-btn d-md-none" onClick={(e) => { e.stopPropagation(); handleBackToList(); }}>
                    <AiOutlineArrowLeft size={24} />
                  </button>
                  <div className="gt-avatar-wrap">
                    {activeUser?.image ? (
                      <img src={activeUser.image} alt={activeUser.fname} className="gt-avatar" />
                    ) : (
                      <div className="gt-avatar-placeholder">{(activeUser?.fname || "?").charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="gt-header-info">
                    <h3 className="gt-header-name">{activeUser?.fname || "Unknown"}</h3>
                    <p className="gt-header-status">Click here for contact info</p>
                  </div>
                </div>
                <div className="gt-header-actions">
                  <BiDotsVerticalRounded size={24} style={{ color: 'var(--mediumGrayTitle)', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Chat Messages Window */}
              <div className="gt-chat-messages-area">
                <ChatWindow conversation={selectedConversation} />
              </div>
            </div>
          ) : (
            <div className="gt-chat-placeholder">
              <div className="gt-placeholder-content">
                <div className="gt-placeholder-icon">💬</div>
                <h2>GrapeTask Messages</h2>
                <p>Select a conversation from the left to start chatting.<br/>Fast, secure, and seamlessly integrated.</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: PROFILE INFO (WhatsApp Style Slide-out) */}
        <div className={`gt-profile-sidebar ${showProfileSidebar ? 'open' : ''}`}>
          <div className="gt-profile-header">
            <button className="gt-close-btn" onClick={toggleProfile}>
              <AiOutlineClose size={24} />
            </button>
            <h4>Contact Info</h4>
          </div>
          
          <div className="gt-profile-body">
            {activeUser ? (
              <div className="gt-profile-card">
                <div className="gt-profile-avatar-large-wrap">
                  {activeUser?.image ? (
                    <img src={activeUser.image} alt="Profile" className="gt-profile-avatar-large" />
                  ) : (
                    <div className="gt-avatar-placeholder-large">{(activeUser?.fname || "?").charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <h2 className="gt-profile-name-large">{activeUser?.fname || "Unknown"} {activeUser?.lname || ""}</h2>
                <p className="gt-profile-role">{activeUser?.role || "GrapeTask User"}</p>
                
                <div className="gt-profile-details-list">
                  <div className="gt-profile-detail-item">
                    <span className="gt-detail-label">Email</span>
                    <span className="gt-detail-value">{activeUser?.email || "Hidden"}</span>
                  </div>
                  <div className="gt-profile-detail-item">
                    <span className="gt-detail-label">Phone</span>
                    <span className="gt-detail-value">{activeUser?.phone || "Hidden"}</span>
                  </div>
                  {activeUser?.country && (
                    <div className="gt-profile-detail-item">
                      <span className="gt-detail-label">Location</span>
                      <span className="gt-detail-value">{activeUser.city ? `${activeUser.city}, ` : ''}{activeUser.country}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center mt-5 text-muted">No user selected</p>
            )}
          </div>
        </div>

      </div>

      {/* 🚀 PREMIUM FIVERR/UPWORK STYLE LIGHT THEME CSS 🚀 */}
      <style>{`
        :root {
          --inbox-bg: #f9fafb;
          --inbox-surface: #ffffff;
          --inbox-border: #e2e8f0;
          --inbox-primary: #10b981; /* Upwork style green */
          --inbox-primary-hover: #059669;
          --inbox-primary-light: #ecfdf5;
          --inbox-text-main: #0f172a;
          --inbox-text-muted: #64748b;
          --inbox-text-light: #94a3b8;
          --inbox-hover: #f1f5f9;
        }

        .gt-inbox-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--inbox-bg);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        .gt-inbox-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          background-color: var(--inbox-bg);
          position: relative;
          padding: 24px;
          gap: 20px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* ─── LEFT SIDEBAR (CHATS LIST) ─── */
        .gt-inbox-sidebar {
          width: 320px;
          background-color: var(--inbox-surface);
          border: 1px solid var(--inbox-border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          overflow: hidden;
        }

        .gt-sidebar-header {
          padding: 20px;
          background-color: var(--inbox-surface);
          border-bottom: 1px solid var(--inbox-border);
        }
        .gt-inbox-title {
          color: var(--inbox-text-main);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        
        .gt-search-wrapper {
          position: relative;
          background-color: var(--inbox-bg);
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border: 1px solid var(--inbox-border);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gt-search-wrapper:focus-within {
          border-color: var(--inbox-primary);
          box-shadow: 0 0 0 3px var(--inbox-primary-light);
        }
        .gt-search-icon {
          color: var(--inbox-text-muted);
          font-size: 18px;
          margin-right: 10px;
        }
        .gt-search-input {
          background: transparent;
          border: none;
          color: var(--inbox-text-main);
          width: 100%;
          font-size: 14px;
          outline: none;
          font-weight: 500;
        }
        .gt-search-input::placeholder { color: var(--inbox-text-light); font-weight: 400; }

        .gt-conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }
        .gt-conversations-list::-webkit-scrollbar { width: 4px; }
        .gt-conversations-list::-webkit-scrollbar-thumb { background-color: var(--inbox-border); border-radius: 4px; }

        .gt-conversation-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 2px;
        }
        .gt-conversation-item:hover { background-color: var(--inbox-hover); }
        .gt-conversation-item.active { background-color: var(--inbox-primary-light); }

        .gt-avatar-wrap {
          position: relative;
          margin-right: 14px;
        }
        .gt-avatar, .gt-avatar-placeholder {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--inbox-border);
        }
        .gt-avatar-placeholder {
          background: linear-gradient(135deg, var(--inbox-primary), var(--inbox-primary-hover));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }
        .gt-online-indicator {
          position: absolute;
          bottom: 0px; right: 0px;
          width: 12px; height: 12px;
          background-color: var(--inbox-primary);
          border: 2px solid var(--inbox-surface);
          border-radius: 50%;
        }

        .gt-conv-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .gt-conv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .gt-conv-name {
          color: var(--inbox-text-main);
          font-weight: 700;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gt-conv-time {
          color: var(--inbox-text-light);
          font-size: 11px;
          font-weight: 500;
          flex-shrink: 0;
        }
        .gt-conv-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .gt-conv-preview {
          color: var(--inbox-text-muted);
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
        .gt-unread-badge {
          background-color: var(--inbox-primary);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        /* ─── MAIN CHAT AREA ─── */
        .gt-inbox-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--inbox-surface);
          border-radius: 16px;
          border: 1px solid var(--inbox-border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          position: relative;
          overflow: hidden;
        }

        .gt-chat-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--inbox-bg);
        }
        .gt-placeholder-content {
          text-align: center;
          color: var(--inbox-text-muted);
        }
        .gt-placeholder-icon {
          font-size: 56px;
          margin-bottom: 20px;
          opacity: 0.2;
        }
        .gt-placeholder-content h2 {
          color: var(--inbox-text-main);
          font-weight: 700;
          font-size: 22px;
          margin-bottom: 10px;
        }
        .gt-placeholder-content p {
          font-size: 14px;
        }

        .gt-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .gt-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background-color: var(--inbox-surface);
          border-bottom: 1px solid var(--inbox-border);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .gt-chat-header:hover {
          background-color: var(--inbox-hover);
        }
        .gt-header-info {
          display: flex;
          flex-direction: column;
        }
        .gt-header-name {
          color: var(--inbox-text-main);
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 2px 0;
        }
        .gt-header-status {
          color: var(--inbox-primary);
          font-size: 12px;
          font-weight: 600;
          margin: 0;
        }
        .gt-back-btn {
          background: transparent;
          border: none;
          color: var(--inbox-text-main);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .gt-chat-messages-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: #ffffff;
          overflow: hidden; /* Let ChatWindow handle inner scroll */
        }

        /* ─── RIGHT SIDEBAR (PROFILE INFO) ─── */
        /* It is always visible on desktop if chat is open, acting as 3rd pane */
        .gt-profile-sidebar {
          width: 320px;
          background-color: var(--inbox-surface);
          border: 1px solid var(--inbox-border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          overflow: hidden;
          transition: width 0.3s ease, margin 0.3s ease, opacity 0.3s ease;
        }
        /* Hidden state on desktop when no chat is open (or manually closed) */
        .gt-profile-sidebar:not(.open) {
          width: 0;
          border: none;
          opacity: 0;
          margin: 0;
        }

        .gt-profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background-color: var(--inbox-surface);
          border-bottom: 1px solid var(--inbox-border);
        }
        .gt-profile-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--inbox-text-main);
        }
        .gt-close-btn {
          background: transparent;
          border: none;
          color: var(--inbox-text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .gt-close-btn:hover { background: var(--inbox-hover); color: var(--inbox-text-main); }

        .gt-profile-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .gt-profile-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gt-profile-avatar-large-wrap {
          width: 120px; height: 120px;
          margin-bottom: 16px;
          border-radius: 50%;
          border: 3px solid var(--inbox-primary-light);
          padding: 3px;
        }
        .gt-profile-avatar-large, .gt-avatar-placeholder-large {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .gt-avatar-placeholder-large {
          background: linear-gradient(135deg, var(--inbox-primary), var(--inbox-primary-hover));
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 40px; font-weight: bold;
        }
        .gt-profile-name-large {
          color: var(--inbox-text-main);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 4px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        .gt-profile-role {
          color: var(--inbox-text-muted);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        
        .gt-profile-details-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .gt-profile-detail-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: var(--inbox-hover);
          border-radius: 12px;
          border: 1px solid var(--inbox-border);
        }
        .gt-detail-label {
          color: var(--inbox-text-muted);
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .gt-detail-value {
          color: var(--inbox-text-main);
          font-size: 14px;
          font-weight: 600;
        }

        /* ─── LOADING & EMPTY STATES ─── */
        .gt-loading-state, .gt-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: var(--inbox-text-muted);
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }
        .gt-spinner {
          width: 24px; height: 24px;
          border: 2px solid var(--inbox-border);
          border-top-color: var(--inbox-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── RESPONSIVE BEHAVIOR ─── */
        @media (max-width: 1024px) {
          .gt-inbox-layout { padding: 12px; gap: 12px; }
          .gt-profile-sidebar { position: absolute; right: 0; height: calc(100% - 24px); z-index: 10; box-shadow: -10px 0 30px rgba(0,0,0,0.1); }
          .gt-profile-sidebar:not(.open) { right: -320px; width: 320px; opacity: 1; }
        }
        @media (max-width: 768px) {
          .gt-inbox-layout { padding: 0; gap: 0; }
          .gt-inbox-sidebar, .gt-inbox-main { border-radius: 0; border: none; }
          .gt-inbox-sidebar {
            width: 100%;
            position: absolute;
            inset: 0;
            z-index: 5;
          }
          .gt-inbox-main {
            width: 100%;
            position: absolute;
            inset: 0;
            z-index: 5;
          }
          .mobile-hidden {
            display: none !important;
          }
          .gt-profile-sidebar {
            width: 100%;
            border-radius: 0;
            height: 100%;
          }
          .gt-profile-sidebar:not(.open) { right: -100%; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default FreelanceInbox;
