import moment from "moment";
import userFallback from "../../../assets/chatImg.webp";
import { useUserData } from "../../../utils/useLocalStorage";

const ReadChat = ({ conversation, onClick, isSelected, isOnline }) => {
  const currentUser = useUserData();
  const theme = {
    pureWhite: "var(--inbox-text-main, #ffffff)",
    mediumGray: "var(--inbox-text-muted, #a1a1aa)",
    bodyGray: "var(--inbox-text-light, #71717a)",
    cardBgActive: "var(--inbox-hover, rgba(255, 255, 255, 0.04))",
    lightBorder: "var(--inbox-border, rgba(255, 255, 255, 0.06))",
    primaryOrange: "var(--inbox-primary, #f0591f)"
  };

  const rawUser = conversation?.user;
  const otherUser = rawUser && rawUser.id !== currentUser.id ? rawUser : null;
  const displayName = conversation?.is_group ? conversation.title : (otherUser ? `${otherUser.fname || ""} ${otherUser.lname || ""}`.trim() || otherUser.name || "User" : "User");

  const shouldRedactText = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase();

    // 1. Email check
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    if (emailRegex.test(text)) {
      return true;
    }

    // 1.5. Handle check (e.g. @username)
    const handleRegex = /@([a-zA-Z0-9._]{2,})/i;
    if (handleRegex.test(text)) {
      return true;
    }

    // 2. Forbidden keywords check
    const forbiddenKeywords = [
      'whatsapp', 'watsap', 'whtsapp', 'whats app', 'wa.me',
      'telegram', 'skype', 'imo', 'viber', 'wechat',
      'phone number', 'mobile number', 'contact number', 'phone no', 'mobile no',
      'number do', 'number de', 'contact karo', 'whatsapp pr', 'whatsapp par', 'whatsapp pe',
      'call me', 'contact me on', 'baat karein', 'direct client'
    ];
    for (const keyword of forbiddenKeywords) {
      if (normalized.includes(keyword)) {
        return true;
      }
    }

    // 3. Spelled-out numbers map & digits count
    const wordsMap = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };
    let textWithDigits = normalized;
    Object.keys(wordsMap).forEach(word => {
      textWithDigits = textWithDigits.replaceAll(word, wordsMap[word]);
    });

    // Clean dates
    let cleanText = textWithDigits.replace(/\b\d{4}[-/]\d{2}[-/]\d{2}\b/g, '');
    cleanText = cleanText.replace(/\b\d{2}[-/]\d{2}[-/]\d{4}\b/g, '');
    cleanText = cleanText.replace(/[#$€£]\d+/g, '');

    // Strip everything except digits and count
    const digitsOnly = cleanText.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) {
      return true;
    }

    return false;
  };

  const lastMsgRaw = conversation?.last_message ?? conversation?.lastMessage;
  let lastMessage = typeof lastMsgRaw === "string" ? lastMsgRaw : lastMsgRaw?.message ?? lastMsgRaw?.body ?? "No messages yet";
  if (shouldRedactText(lastMessage)) {
    lastMessage = "🚫 [Content Blocked]";
  } else if (lastMsgRaw && typeof lastMsgRaw === "object" && lastMsgRaw.message_type === "call") {
    lastMessage = "📞 Live Meeting";
  }

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
        {conversation?.is_group ? (
          <div
            style={{ 
              width: 45, height: 45, borderRadius: "50%", 
              backgroundColor: "var(--inbox-primary)", color: "#fff", 
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: "bold", border: `1px solid ${theme.lightBorder}` 
            }}
          >
            👥
          </div>
        ) : (
          <img
            src={otherUser?.image || userFallback}
            width={45}
            height={45}
            alt="user"
            style={{ borderRadius: "50%", objectFit: "cover", border: `1px solid ${theme.lightBorder}` }}
          />
        )}
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