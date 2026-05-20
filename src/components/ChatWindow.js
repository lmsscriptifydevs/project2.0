import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../redux/slices/messageSlice";



import { useUserData } from "../utils/useLocalStorage";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { AiOutlineSend, AiOutlinePaperClip, AiOutlineSmile } from "react-icons/ai";

const ChatWindow = ({ conversation }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      dispatch(sendMessage({
        conversationId: conversation.id,
        content: newMessage.trim()
      }));
      setNewMessage("");
    }
  };

  const getMessageStatusIcon = (status) => {
    if (status === 'read') return <BsCheckAll size={16} color="#34B7F1" />;
    if (status === 'delivered') return <BsCheckAll size={16} color="var(--bodyGrayText)" />;
    return <BsCheck size={16} color="var(--bodyGrayText)" />; // Sent
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
                
                return (
                  <div key={message.id} className={`gt-message-row ${isMine ? 'gt-message-mine' : 'gt-message-theirs'}`}>
                    <div className="gt-message-bubble">
                      <p className="gt-message-text">{message.content}</p>
                      
                      <div className="gt-message-meta">
                        <span className="gt-message-time">
                          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        <button className="gt-icon-btn"><AiOutlinePaperClip size={24} /></button>
        
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
      `}</style>
    </div>
  );
};

export default ChatWindow;