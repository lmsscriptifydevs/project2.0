import Pusher from "pusher-js";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import search from "../../../assets/searchbar.webp";
import { fetchConversations, setSelectedConversation, setUserOnline } from "../../../redux/slices/messageSlice";
import ReadChat from "./ReadChat";
import UnRead from "./UnRead";

const UsersChat = () => {
  const dispatch = useDispatch();
  const { conversations, selectedConversation, loading } = useSelector((state) => state.message);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("inboxTheme") || "dark");

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("inboxTheme", newTheme);
    window.dispatchEvent(new CustomEvent('inboxThemeChanged', { detail: newTheme }));
  };

  useEffect(() => {
    const handleThemeChange = (e) => {
      setThemeMode(e.detail);
    };
    window.addEventListener('inboxThemeChanged', handleThemeChange);
    return () => window.removeEventListener('inboxThemeChanged', handleThemeChange);
  }, []);

  // Updated to hook natively into GrapeTask Dark Theme variables
  const theme = {
    mainBg: "var(--inbox-bg, #020617)",
    cardBg: "transparent",
    lightBorder: "var(--inbox-border, rgba(255,255,255,0.06))",
    pureWhite: "var(--inbox-text-main, #ffffff)",
    bodyGray: "var(--inbox-text-light, #71717a)"
  };

  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(setUserOnline());
    const pusher = new Pusher("9f595c24255fa4029398", { cluster: "mt1", encrypted: true });
    const channel = pusher.subscribe("global-status");

    channel.bind("App\\Events\\UserOnline", (data) => setOnlineUsers(p => ({ ...p, [data.user_id]: true })));
    channel.bind("App\\Events\\UserOffline", (data) => setOnlineUsers(p => ({ ...p, [data.user_id]: false })));

    return () => { pusher.unsubscribe("global-status"); pusher.disconnect(); };
  }, [dispatch]);

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    return conversations.filter((conv) => {
      const name = conv.is_group ? conv.title : (conv.user?.fname || conv.user?.name || "");
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  return (
    <div className="p-4 h-100 d-flex flex-column" style={{ backgroundColor: theme.cardBg, border: "none" }}>
      
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: theme.pureWhite, letterSpacing: "-0.5px" }}>Chats</h2>
        <button
          onClick={toggleTheme}
          style={{
            background: themeMode === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
            border: "1px solid var(--inbox-border, rgba(255,255,255,0.06))",
            color: "var(--inbox-text-muted, #a1a1aa)",
            borderRadius: "20px",
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.2px"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--inbox-primary, #f0591f)";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "var(--inbox-primary, #f0591f)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = themeMode === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)";
            e.currentTarget.style.color = "var(--inbox-text-muted, #a1a1aa)";
            e.currentTarget.style.borderColor = "var(--inbox-border, rgba(255,255,255,0.06))";
          }}
        >
          {themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      {/* Search Bar Section */}
      <div className="mb-4">
        <div className="d-flex align-items-center px-3 py-2" style={{ backgroundColor: "var(--inbox-hover, rgba(255,255,255,0.04))", border: `1px solid ${theme.lightBorder}`, borderRadius: "16px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} 
             onFocus={(e) => { e.currentTarget.style.borderColor = "var(--inbox-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--inbox-primary-light)"; }} 
             onBlur={(e) => { e.currentTarget.style.borderColor = theme.lightBorder; e.currentTarget.style.boxShadow = "none"; }}>
          <img src={search} width={14} alt="search" style={{ opacity: 0.6 }} />
          <input
            type="text"
            className="form-control bg-transparent border-0 font-13 ms-2 shadow-none"
            placeholder="Search or start a chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ color: theme.pureWhite, padding: 0 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
          <div style={{ width: 30, height: 30, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--inbox-primary)", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 12 }}></div>
          <span style={{ color: theme.bodyGray, fontSize: '13px' }}>Loading chats...</span>
        </div>
      ) : (
        <div className="custom-chat-list flex-grow-1" style={{ overflowY: 'auto', paddingRight: '4px', margin: '0 -10px', padding: '0 10px' }}>
          {filteredConversations?.length === 0 ? (
            <div className="text-center py-5" style={{ color: theme.bodyGray, fontSize: '13px' }}>No conversations found.</div>
          ) : (
            filteredConversations.map((conv) => {
              const unreadCount = conv.unread_count ?? conv.unreadCount ?? 0;
              const Component = unreadCount > 0 ? UnRead : ReadChat;
              return (
                <Component
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  isOnline={onlineUsers[conv.user?.id] || false}
                />
              );
            })
          )}
        </div>
      )}

      {/* Custom Premium Scrollbar Styling */}
      <style>{`
        .custom-chat-list::-webkit-scrollbar {
          width: 4px;
        }
        .custom-chat-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-chat-list::-webkit-scrollbar-thumb {
          background: var(--inbox-border, rgba(255, 255, 255, 0.1));
          border-radius: 10px;
        }
        .custom-chat-list::-webkit-scrollbar-thumb:hover {
          background: var(--inbox-primary, #f0591f);
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UsersChat;