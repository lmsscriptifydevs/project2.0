import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell, FaTimes, FaCircle, FaCheckDouble, FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "https://portal.grapetask.co/api";
const POLL_INTERVAL = 30000;
const TOAST_DURATION = 6000;

// ─── THEME COLORS ──────────────────────────────────────────────────────────────
const theme = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  pureWhite: "#ffffff",
  pureBlack: "#000000",
  lightGrayHover: "#d4d4d8",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  darkGrayNumber: "#52525b",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  mediumBorder: "rgba(255, 255, 255, 0.07)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)"
};

// ─── HELPER: PARSE NOTIFICATION DATA ───────────────────────────────────────────
const parseNotif = (n) => {
  if (!n) return {};
  const payload = n.data?.data || n.data || {}; 
  const typeString = (n.type || "").split('\\').pop(); 
  const formattedType = typeString.replace(/([A-Z])/g, " $1").trim();
  
  return {
    id: n.id,
    title: payload.title || formattedType || "Notification",
    message: payload.message || "",
    orderId: payload.order_id,
    amount: payload.amount,
    actionUrl: payload.action_url,
    isUnread: n.read_at === null,
    createdAt: n.created_at,
    rawType: payload.type || typeString,
  };
};

// ─── OPTIMIZED SOUND UTILITY ───────────────────────────────────────────────────
// Audio file ko bahar load kiya hai taake har dafa function call pe lag na ho
const notifAudio = typeof window !== "undefined" ? new Audio("https://portal.grapetask.co/uploads/sound.mp3") : null;

const playSound = (type = "new") => {
  try {
    if (type === "new") {
      // Naye notification ke liye aapki apni file bajegi
      if (notifAudio) {
        notifAudio.currentTime = 0; // Sound ko shuru se play karne ke liye
        notifAudio.volume = 0.6; // Volume control
        notifAudio.play().catch(err => console.log("Audio play blocked by browser:", err));
      }
    } else if (type === "click") {
      // Click ke liye purana (original digital) sound bajega
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (error) {
    console.error("Sound error:", error);
  }
};

// ─── TIME AGO ──────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ─── TYPE STYLE ────────────────────────────────────────────────────────────────
const getTypeStyle = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("order") || t.includes("offer_accepted")) return { color: "#10b981", label: "Order Update" };
  if (t.includes("payout") || t.includes("payment")) return { color: "#f59e0b", label: "Payment" };
  if (t.includes("important")) return { color: "#ef4444", label: "Important" };
  if (t.includes("offer")) return { color: "#8b5cf6", label: "Offer" };
  return { color: "#6366f1", label: "Notification" };
};

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const NotificationToast = ({ notification, onClose, onRead }) => {
  const [visible, setVisible] = useState(false);
  const parsed = parseNotif(notification);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, TOAST_DURATION);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={() => { playSound("click"); onRead(parsed.id); onClose(); }}
      style={{
        width: "340px",
        background: theme.mainBg,
        border: `1px solid ${theme.lightBorder}`,
        borderRadius: "14px",
        padding: "16px 18px",
        cursor: "pointer",
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${theme.orangeBorderActive}`,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        borderLeft: `4px solid ${theme.primaryOrange}`,
        position: "relative",
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); setVisible(false); setTimeout(onClose, 400); }}
        style={{ position: "absolute", top: "10px", right: "12px", background: "none", border: "none", cursor: "pointer", color: theme.bodyGrayText, fontSize: "14px" }}
      >
        <FaTimes />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(240,89,31,0.15)", border: `2px solid ${theme.orangeBorderActive}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MdNotificationsActive size={18} color={theme.primaryOrange} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "11px", color: theme.bodyGrayText, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>
            New Notification
          </div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: theme.pureWhite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {parsed.title}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: theme.mediumGrayTitle, margin: "0 0 10px 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {parsed.message || "You have a new update."}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: theme.darkGrayNumber }}>{timeAgo(parsed.createdAt)}</span>
        <span style={{ fontSize: "11px", color: theme.primaryOrange, fontWeight: "600" }}>Tap to view →</span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, height: "3px", borderRadius: "0 0 14px 14px", background: theme.primaryOrange, animation: `notif-progress ${TOAST_DURATION}ms linear forwards` }} />
      <style>{`@keyframes notif-progress { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
};

// ─── DETAIL VIEW ───────────────────────────────────────────────────────────────
const NotificationDetail = ({ notification, onBack, unreadCount, onMarkAllRead }) => {
  const parsed = parseNotif(notification);
  const typeStyle = getTypeStyle(parsed.rawType);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.mainBg }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", background: theme.mainBg, borderBottom: `1px solid ${theme.mediumBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onBack}
            style={{ background: theme.cardBg, border: `1px solid ${theme.lightBorder}`, borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.pureWhite, transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.cardBgActive)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.cardBg)}
          >
            <FaArrowLeft size={13} />
          </button>
          <span style={{ color: theme.pureWhite, fontWeight: "700", fontSize: "15px" }}>Detail</span>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{ background: "rgba(240,89,31,0.1)", border: `1px solid ${theme.orangeBorderActive}`, borderRadius: "8px", color: theme.primaryOrange, fontSize: "11px", fontWeight: "600", padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <FaCheckDouble size={10} />
            All read
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px", background: theme.mainBg }}>
        {/* Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <span style={{ background: typeStyle.color + "15", color: typeStyle.color, borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", border: `1px solid ${typeStyle.color}40` }}>
            {typeStyle.label}
          </span>
          {parsed.isUnread && (
            <span style={{ background: "rgba(240,89,31,0.15)", color: theme.primaryOrange, borderRadius: "20px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", border: `1px solid ${theme.orangeBorderActive}` }}>
              Unread
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "17px", fontWeight: "800", color: theme.pureWhite, margin: "0 0 16px 0", lineHeight: "1.3" }}>
          {parsed.title}
        </h3>

        {/* Message Box */}
        <div style={{ background: theme.cardBg, borderRadius: "12px", padding: "16px", border: `1px solid ${theme.lightBorder}`, borderLeft: `4px solid ${theme.primaryOrange}`, marginBottom: "16px" }}>
          {parsed.message ? (
             <p style={{ fontSize: "14.5px", color: theme.pureWhite, margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
               {parsed.message}
             </p>
          ) : (
             <p style={{ fontSize: "14.5px", color: theme.bodyGrayText, margin: 0, fontStyle: "italic" }}>
               No additional details available.
             </p>
          )}
        </div>

        {/* Extra info: Order ID + Amount */}
        {(parsed.orderId || parsed.amount) && (
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.mediumBorder}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            {parsed.orderId && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: parsed.amount ? "10px" : "0", paddingBottom: parsed.amount ? "10px" : "0", borderBottom: parsed.amount ? `1px solid ${theme.lightBorder}` : "none" }}>
                <span style={{ fontSize: "13px", color: theme.mediumGrayTitle, fontWeight: "600" }}>Order ID</span>
                <span style={{ fontSize: "14px", color: theme.pureWhite, fontWeight: "700" }}>#{parsed.orderId}</span>
              </div>
            )}
            {parsed.amount && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: theme.mediumGrayTitle, fontWeight: "600" }}>Amount</span>
                <span style={{ fontSize: "15px", color: "#10b981", fontWeight: "800" }}>${parsed.amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Time */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: theme.bodyGrayText, fontSize: "12px", marginBottom: "20px" }}>
          <span>🕐</span>
          <span>{formatDate(parsed.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN NOTIFICATION BELL ─────────────────────────────────────────────────────
const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const dropdownRef = useRef(null);
  const seenIdsRef = useRef(new Set());
  const pollingRef = useRef(null);

  // ── Fetch list ────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return [];
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const json = await res.json();
      let list = [];
      if (json?.data?.data && Array.isArray(json.data.data)) {
        list = json.data.data;
      } else if (Array.isArray(json?.data)) {
        list = json.data;
      } else if (Array.isArray(json)) {
        list = json;
      }
      return list;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Mark single read ──────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
      });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  }, [token]);

  // ── Mark all read ─────────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  }, [token]);

  // ── Polling ───────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    const list = await fetchNotifications();
    if (!list) return;
    setNotifications(list);

    const newOnes = list.filter((n) => !seenIdsRef.current.has(n.id) && n.read_at === null);
    if (newOnes.length > 0) {
      playSound("new"); // <--- Yahan se MP3/ACC bajega
      newOnes.slice(0, 2).forEach((n) => {
        const toastId = Date.now() + Math.random();
        setToasts((prev) => [...prev, { ...n, toastId }]);
        seenIdsRef.current.add(n.id);
      });
    }
    list.forEach((n) => seenIdsRef.current.add(n.id));
    setUnreadCount(list.filter((n) => n.read_at === null).length);
  }, [fetchNotifications]);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetchNotifications().then((list) => {
      if (list) {
        setNotifications(list);
        list.forEach((n) => seenIdsRef.current.add(n.id));
        setUnreadCount(list.filter((n) => n.read_at === null).length);
      }
    });
    pollingRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollingRef.current);
  }, [token, poll, fetchNotifications]);

  // ── Click outside ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSelectedNotif(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBellClick = () => {
    const opening = !showDropdown;
    setShowDropdown(opening);
    setSelectedNotif(null);
    if (opening) {
      fetchNotifications().then((list) => {
        if (list) {
          setNotifications(list);
          setUnreadCount(list.filter((n) => n.read_at === null).length);
        }
      });
    }
  };

  const handleNotifClick = (n) => {
    playSound("click"); // <--- Yahan se original click sound bajega
    setSelectedNotif(n);
    if (n.read_at === null) markAsRead(n.id);
  };

  const removeToast = (toastId) => setToasts((prev) => prev.filter((t) => t.toastId !== toastId));

  return (
    <>
      {/* ── BELL ── */}
      <div className="position-relative" ref={dropdownRef} style={{ display: "inline-block" }}>
        <button
          onClick={handleBellClick}
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "6px 8px", display: "flex", alignItems: "center" }}
        >
          <FaBell
            color={theme.lightGrayHover}
            size={23}
            style={{
              filter: unreadCount > 0 ? `drop-shadow(0 0 6px ${theme.orangeBorderActive})` : "none",
              transition: "filter 0.3s",
              animation: unreadCount > 0 ? "bell-shake 2s ease-in-out infinite" : "none",
            }}
          />
          {unreadCount > 0 && (
            <span style={{ position: "absolute", top: "2px", right: "2px", minWidth: "18px", height: "18px", borderRadius: "9px", background: theme.primaryOrange, color: theme.pureWhite, fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${theme.mainBg}`, lineHeight: 1, padding: "0 3px", animation: "badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* ── DROPDOWN ── */}
        {showDropdown && (
          <div style={{ position: "absolute", top: "calc(100% + 12px)", right: "-80px", width: "400px", maxHeight: "550px", background: theme.mainBg, border: `1px solid ${theme.mediumBorder}`, borderRadius: "16px", boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)", zIndex: 1050, overflow: "hidden", display: "flex", flexDirection: "column", animation: "dropdown-open 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>

            {/* DETAIL VIEW */}
            {selectedNotif ? (
              <NotificationDetail
                notification={selectedNotif}
                onBack={() => setSelectedNotif(null)}
                unreadCount={unreadCount}
                onMarkAllRead={markAllAsRead}
              />
            ) : (
              <>
                {/* LIST HEADER */}
                <div style={{ padding: "16px 20px", background: theme.mainBg, borderBottom: `1px solid ${theme.mediumBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MdNotificationsActive size={20} color={theme.primaryOrange} />
                    <span style={{ color: theme.pureWhite, fontWeight: "700", fontSize: "16px" }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span style={{ background: theme.primaryOrange, color: theme.pureWhite, borderRadius: "20px", padding: "2px 8px", fontSize: "11px", fontWeight: "700" }}>
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} style={{ background: "rgba(240,89,31,0.1)", border: `1px solid ${theme.orangeBorderActive}`, borderRadius: "8px", color: theme.primaryOrange, fontSize: "12px", fontWeight: "600", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(240,89,31,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(240,89,31,0.1)"}>
                      <FaCheckDouble size={12} /> Mark all read
                    </button>
                  )}
                </div>

                {/* LIST BODY */}
                <div style={{ overflowY: "auto", flex: 1, background: theme.mainBg, minHeight: "200px" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: theme.bodyGrayText }}>
                      <div style={{ width: "32px", height: "32px", border: `3px solid ${theme.lightBorder}`, borderTop: `3px solid ${theme.primaryOrange}`, borderRadius: "50%", margin: "0 auto 10px", animation: "spin 0.8s linear infinite" }} />
                      <span style={{ fontSize: "13px" }}>Loading...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px 20px", color: theme.darkGrayNumber }}>
                      <FaBell size={36} style={{ opacity: 0.2, marginBottom: "12px" }} />
                      <p style={{ fontSize: "15px", margin: 0 }}>Koi notification nahi hai</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const parsed = parseNotif(n);
                      const typeStyle = getTypeStyle(parsed.rawType);
                      
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.lightBorder}`, cursor: "pointer", background: parsed.isUnread ? theme.cardBgActive : "transparent", transition: "background 0.2s", display: "flex", gap: "14px", alignItems: "flex-start" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = parsed.isUnread ? theme.secondaryBlueBlur : theme.cardBg)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = parsed.isUnread ? theme.cardBgActive : "transparent")}
                        >
                          <div style={{ paddingTop: "6px", flexShrink: 0 }}>
                            <FaCircle size={10} color={parsed.isUnread ? theme.primaryOrange : "transparent"} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                              <div style={{ fontSize: "14px", fontWeight: parsed.isUnread ? "700" : "500", color: parsed.isUnread ? theme.pureWhite : theme.mediumGrayTitle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "240px" }}>
                                {parsed.title}
                              </div>
                              <span style={{ background: typeStyle.color + "15", color: typeStyle.color, borderRadius: "10px", padding: "2px 8px", fontSize: "10px", fontWeight: "700", flexShrink: 0, marginLeft: "6px" }}>
                                {typeStyle.label}
                              </span>
                            </div>
                            {parsed.message && (
                              <p style={{ fontSize: "13px", color: theme.bodyGrayText, margin: "0 0 8px 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {parsed.message}
                              </p>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "12px", color: theme.darkGrayNumber }}>{timeAgo(parsed.createdAt)}</span>
                              <span style={{ fontSize: "12px", color: theme.primaryOrange, fontWeight: "600" }}>View →</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── TOASTS ── */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99999, display: "flex", flexDirection: "column-reverse", gap: "12px", pointerEvents: "none" }}>
        {toasts.map((toast) => (
          <div key={toast.toastId} style={{ pointerEvents: "all" }}>
            <NotificationToast notification={toast} onClose={() => removeToast(toast.toastId)} onRead={markAsRead} />
          </div>
        ))}
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes bell-shake {
          0%, 90%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-10deg); }
          94% { transform: rotate(10deg); }
          96% { transform: rotate(-8deg); }
          98% { transform: rotate(8deg); }
        }
        @keyframes badge-pop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes dropdown-open {
          0% { opacity: 0; transform: translateY(-10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default NotificationBell;