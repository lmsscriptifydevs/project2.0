import moment from "moment";
import userFallback from "../../../assets/chatImg.webp";
import { useUserData } from "../../../utils/useLocalStorage";

const UnRead = ({ conversation, onClick, isSelected, isOnline }) => {
  const currentUser = useUserData();
  const theme = {
    pureWhite: "#ffffff",
    primaryOrange: "#f0591f",
    bodyGray: "#71717a",
    cardBg: "rgba(255, 255, 255, 0.03)",
    lightBorder: "rgba(255, 255, 255, 0.06)"
  };

  const rawUser = conversation?.user;
  const otherUser = rawUser && rawUser.id !== currentUser.id ? rawUser : null;
  const displayName = otherUser ? `${otherUser.fname || ""} ${otherUser.lname || ""}`.trim() : "User";

  const lastMsgRaw = conversation?.last_message ?? conversation?.lastMessage;
  const lastMessage = typeof lastMsgRaw === "string" ? lastMsgRaw : lastMsgRaw?.message ?? lastMsgRaw?.body ?? "No messages yet";
  const timeRaw = conversation?.last_message_time || (typeof lastMsgRaw === "object" && lastMsgRaw?.created_at);
  const time = timeRaw ? moment(timeRaw).format("HH:mm") : "";
  const unreadCount = conversation?.unread_count ?? conversation?.unreadCount ?? 0;

  return (
    <div
      className="d-flex align-items-center p-3 mb-1"
      style={{ 
        backgroundColor: isSelected ? "rgba(255,255,255,0.05)" : theme.cardBg, 
        cursor: "pointer", 
        transition: "0.2s",
        borderRadius: '12px',
        borderLeft: `3px solid ${theme.primaryOrange}`
      }}
      onClick={onClick}
    >
      <div className="position-relative">
        <img
          src={otherUser?.image || userFallback}
          width={45}
          height={45}
          alt="user"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        {isOnline && (
          <span className="position-absolute rounded-circle"
            style={{ 
              width: "12px", height: "12px", bottom: "2px", right: "2px",
              backgroundColor: "#22c55e", border: "2px solid #020617"
            }}
          ></span>
        )}
      </div>

      <div className="ms-3 w-100 overflow-hidden">
        <div className="d-flex justify-content-between align-items-center">
          <p className="fw-bold mb-0 text-truncate" style={{ color: theme.pureWhite, fontSize: "14px" }}>
            {displayName}
          </p>
          <p className="mb-0 fw-bold" style={{ fontSize: "11px", color: theme.primaryOrange }}>{time}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <p className="mb-0 fw-medium text-truncate" style={{ color: theme.pureWhite, fontSize: "12px", maxWidth: '80%' }}>
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <span style={{ 
              backgroundColor: theme.primaryOrange, color: 'white', 
              fontSize: '10px', padding: '2px 7px', borderRadius: '50%', fontWeight: 'bold' 
            }}>
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnRead;