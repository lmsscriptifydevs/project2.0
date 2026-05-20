import moment from "moment";
import userFallback from "../../../assets/chatImg.webp";
import { useUserData } from "../../../utils/useLocalStorage";

const ReadChat = ({ conversation, onClick, isSelected, isOnline }) => {
  const currentUser = useUserData();
  const theme = {
    pureWhite: "#ffffff",
    mediumGray: "#a1a1aa",
    bodyGray: "#71717a",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
    lightBorder: "rgba(255, 255, 255, 0.06)",
    primaryOrange: "#f0591f"
  };

  const rawUser = conversation?.user;
  const otherUser = rawUser && rawUser.id !== currentUser.id ? rawUser : null;
  const displayName = otherUser ? `${otherUser.fname || ""} ${otherUser.lname || ""}`.trim() || otherUser.name || "User" : "User";

  const lastMsgRaw = conversation?.last_message ?? conversation?.lastMessage;
  const lastMessage = typeof lastMsgRaw === "string" ? lastMsgRaw : lastMsgRaw?.message ?? lastMsgRaw?.body ?? "No messages yet";

  const timeRaw = (typeof lastMsgRaw === "object" && lastMsgRaw?.created_at) || conversation?.last_message_time || conversation?.lastMessageTime;
  const time = timeRaw ? moment(timeRaw).format("HH:mm") : "";

  return (
    <div
      className="d-flex align-items-center p-3 mb-1"
      onClick={onClick}
      style={{ 
        cursor: "pointer", 
        transition: "0.3s",
        backgroundColor: isSelected ? theme.cardBgActive : "transparent",
        borderRadius: '12px',
        borderLeft: isSelected ? `3px solid ${theme.primaryOrange}` : "3px solid transparent"
      }}
    >
      <div className="position-relative">
        <img
          src={otherUser?.image || userFallback}
          width={45}
          height={45}
          alt="user"
          style={{ borderRadius: "50%", objectFit: "cover", border: `1px solid ${theme.lightBorder}` }}
        />
        {isOnline && (
          <span className="position-absolute rounded-circle"
            style={{ 
              width: "12px", height: "12px", bottom: "2px", right: "2px",
              backgroundColor: "#22c55e", border: "2px solid #020617",
              boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)"
            }}
          ></span>
        )}
      </div>

      <div className="ms-3 w-100 overflow-hidden">
        <div className="d-flex justify-content-between align-items-center">
          <p className="fw-semibold mb-0 text-truncate" style={{ color: theme.pureWhite, fontSize: "14px" }}>
            {displayName}
          </p>
          <p className="mb-0" style={{ fontSize: "11px", color: theme.bodyGray }}>{time}</p>
        </div>
        <p className="mb-0 mt-1 text-truncate" style={{ color: theme.mediumGray, fontSize: "12px" }}>
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ReadChat;