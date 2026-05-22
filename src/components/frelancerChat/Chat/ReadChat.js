import moment from "moment";
import userFallback from "../../../assets/chatImg.webp";
import { useUserData } from "../../../utils/useLocalStorage";

const ReadChat = ({ conversation, onClick, isSelected, isOnline }) => {
  const currentUser = useUserData();

  const rawUser = conversation?.user;
  const otherUser = rawUser && rawUser.id !== currentUser.id ? rawUser : null;
  const displayName = conversation?.is_group
    ? conversation.title
    : otherUser
    ? `${otherUser.fname || ""} ${otherUser.lname || ""}`.trim() || otherUser.name || "User"
    : "User";

  const shouldRedactText = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase();
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    if (emailRegex.test(text)) return true;
    const handleRegex = /@([a-zA-Z0-9._]{2,})/i;
    if (handleRegex.test(text)) return true;
    const forbiddenKeywords = ['whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me', 'telegram', 'skype', 'imo', 'viber', 'wechat', 'phone number', 'mobile number', 'contact number', 'phone no', 'mobile no', 'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe', 'call me', 'contact me on', 'baat karein', 'direct client'];
    for (const keyword of forbiddenKeywords) {
      if (normalized.includes(keyword)) return true;
    }
    const wordsMap = { 'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9' };
    let textWithDigits = normalized;
    Object.keys(wordsMap).forEach(word => { textWithDigits = textWithDigits.replaceAll(word, wordsMap[word]); });
    let cleanText = textWithDigits.replace(/\b\d{4}[-/]\d{2}[-/]\d{2}\b/g, '');
    cleanText = cleanText.replace(/\b\d{2}[-/]\d{2}[-/]\d{4}\b/g, '');
    cleanText = cleanText.replace(/[#$€£]\d+/g, '');
    const digitsOnly = cleanText.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) return true;
    return false;
  };

  const lastMsgRaw = conversation?.last_message ?? conversation?.lastMessage;
  let lastMessage = typeof lastMsgRaw === "string" ? lastMsgRaw : lastMsgRaw?.message ?? lastMsgRaw?.body ?? "No messages yet";
  if (shouldRedactText(lastMessage)) {
    lastMessage = "🚫 [Content Blocked]";
  } else if (lastMsgRaw && typeof lastMsgRaw === "object" && lastMsgRaw.message_type === "call") {
    lastMessage = "📞 Live Meeting";
  } else if (lastMsgRaw && typeof lastMsgRaw === "object" && lastMsgRaw.message_type === "audio") {
    lastMessage = "🎤 Voice message";
  } else if (lastMsgRaw && typeof lastMsgRaw === "object" && lastMsgRaw.message_type === "file") {
    lastMessage = "📎 File";
  } else if (lastMsgRaw && typeof lastMsgRaw === "object" && lastMsgRaw.message_type === "image") {
    lastMessage = "📷 Photo";
  }

  const timeRaw = (typeof lastMsgRaw === "object" && lastMsgRaw?.created_at) || conversation?.last_message_time || conversation?.lastMessageTime;
  const time = timeRaw ? moment(timeRaw).format("HH:mm") : "";

  return (
    <div
      onClick={onClick}
      className="wa-chat-item"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        cursor: "pointer",
        backgroundColor: isSelected ? "var(--wa-panel-active)" : "transparent",
        borderBottom: "1px solid var(--wa-divider)",
        transition: "background-color 0.15s ease",
        position: "relative",
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--wa-panel-hover)"; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {conversation?.is_group ? (
          <div style={{
            width: 49, height: 49, borderRadius: "50%",
            backgroundColor: "#00A884", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
          }}>
            👥
          </div>
        ) : (
          <img
            src={otherUser?.image || userFallback}
            width={49} height={49}
            alt="user"
            style={{ borderRadius: "50%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.src = userFallback; }}
          />
        )}
        {isOnline && (
          <span style={{
            position: "absolute", bottom: "1px", right: "1px",
            width: "13px", height: "13px",
            backgroundColor: "var(--wa-online)",
            border: "2px solid var(--wa-panel)",
            borderRadius: "50%",
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, marginLeft: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
          <span style={{
            fontSize: "16px", fontWeight: "400",
            color: "var(--wa-text-primary)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: 1, marginRight: "8px",
          }}>
            {displayName}
          </span>
          <span style={{ fontSize: "12px", color: "var(--wa-text-muted)", flexShrink: 0 }}>{time}</span>
        </div>
        <div style={{
          fontSize: "14px", color: "var(--wa-text-second)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center"
        }}>
          {lastMsgRaw && lastMsgRaw.sender_id === currentUser.id && (() => {
            const isRead = !!lastMsgRaw.read;
            const tickColor = isRead ? "#f0591f" : "var(--wa-text-muted)";
            const tickText = (isRead || isOnline) ? "✓✓" : "✓";
            return (
              <span style={{ 
                marginRight: "4px", 
                color: tickColor,
                fontSize: "14px",
                fontWeight: "800",
                display: "inline-flex"
              }}>
                {tickText}
              </span>
            );
          })()}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {lastMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadChat;