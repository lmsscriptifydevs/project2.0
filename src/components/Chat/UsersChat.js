import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import search from "../../../assets/searchbar.webp";
import echo from "../../../echo"; // Aapka Echo setup file
import { fetchConversations, setSelectedConversation } from "../../../redux/slices/messageSlice";
import ReadChat from "./ReadChat";
import UnRead from "./UnRead";

const UsersChat = () => {
  const dispatch = useDispatch();

  // 1. Redux store se real conversations aur loading status utha rahe hain
  const { conversations, selectedConversation, loading } = useSelector((state) => state.message);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Online users track karne ke liye state
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    // Real conversations fetch karo (Dummy API khatam!)
    dispatch(fetchConversations());

    // 3. Presence Channel: Real-time Online/Offline indicator ka asli magic
    const channel = echo.join('user.presence')
      .here((users) => {
        // Jab aap login hon, toh list milegi ke pehle se kon online hai
        const onlineObj = {};
        users.forEach(u => onlineObj[u.id] = true);
        setOnlineUsers(onlineObj);
      })
      .joining((user) => {
        // Naya banda online aya
        setOnlineUsers((prev) => ({ ...prev, [user.id]: true }));
      })
      .leaving((user) => {
        // Banda offline gaya
        setOnlineUsers((prev) => ({ ...prev, [user.id]: false }));
      })
      .error((error) => {
        console.error("Presence Channel Connection Error:", error);
      });

    return () => {
      echo.leave('user.presence');
    };
  }, [dispatch]);

  // 4. Search Filter: Users ko unke naam se filter karna
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    return conversations.filter((conv) => {
      const name = conv.user?.fname || conv.user?.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
  };

  return (
    <div className="bh-white p-3 rounded-3" style={{ boxShadow: "0px -2px 10px 0px #00000014", height: "100%", overflowY: "auto" }}>

      {/* Search Bar Section */}
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-12 px-0">
            <div className="input-group p-2 h-100 poppins border rounded-3">
              <span className="input-group-text border-0 bg-transparent">
                <img src={search} width={16} alt="search" />
              </span>
              <input
                type="text"
                className="form-control border-0 p-0 font-12"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List Section */}
      <div className="mt-2">
        {loading ? (
          <div className="text-center py-3 font-14 text-muted">Loading chats...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-3 font-14 text-muted">No conversations found.</div>
        ) : (
          filteredConversations.map((conv) => {
            // 🟢 Check if this specific user is online in our onlineUsers state
            const isOnline = !!onlineUsers[conv.user?.id];

            // Unread count ki base par correct component choose karna
            const unreadCount = conv.unread_count ?? conv.unreadCount ?? 0;
            const ChatItem = unreadCount > 0 ? UnRead : ReadChat;

            return (
              <ChatItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversation?.id === conv.id}
                onClick={() => handleSelectConversation(conv)}
                isOnline={isOnline} // Yeh prop ab 'Online' status control karegi
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersChat;