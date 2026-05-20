import React, { useState, useRef, useEffect } from "react";

const QUICK_CHIPS = [
    "How do I get started?",
    "Pricing plans?",
    "Contact support",
    "Report a bug",
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
    const [fabPos, setFabPos] = useState({ right: 24, bottom: 24 });
    const [thinkingMode, setThinkingMode] = useState(false);
    const [modePopupOpen, setModePopupOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);
    const textareaRef = useRef(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);
    const modePopupRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Close mode popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modePopupRef.current && !modePopupRef.current.contains(e.target)) {
                setModePopupOpen(false);
            }
        };
        if (modePopupOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [modePopupOpen]);

    const handleMouseDown = (e) => {
        isDragging.current = false;
        hasMoved.current = false;
        dragStart.current = {
            x: e.clientX + fabPos.right,
            y: e.clientY + fabPos.bottom,
        };
        const onMove = (ev) => {
            isDragging.current = true;
            hasMoved.current = true;
            setFabPos({
                right: Math.max(10, Math.min(window.innerWidth - 70, dragStart.current.x - ev.clientX)),
                bottom: Math.max(10, Math.min(window.innerHeight - 70, dragStart.current.y - ev.clientY)),
            });
        };
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const handleTouchStart = (e) => {
        isDragging.current = false;
        hasMoved.current = false;
        const touch = e.touches[0];
        dragStart.current = {
            x: touch.clientX + fabPos.right,
            y: touch.clientY + fabPos.bottom,
        };
        const onMove = (ev) => {
            isDragging.current = true;
            hasMoved.current = true;
            const t = ev.touches[0];
            setFabPos({
                right: Math.max(10, Math.min(window.innerWidth - 70, dragStart.current.x - t.clientX)),
                bottom: Math.max(10, Math.min(window.innerHeight - 70, dragStart.current.y - t.clientY)),
            });
        };
        const onEnd = () => {
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onEnd);
        };
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", onEnd);
    };

    const handleFabClick = () => {
        if (!hasMoved.current) toggleChat();
    };

    const toggleChat = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen && window.innerWidth > 480) {
            setTimeout(() => textareaRef.current?.focus(), 460);
        }
        if (isOpen && infoOpen) setInfoOpen(false);
        if (isOpen) setModePopupOpen(false);
    };

    const toggleInfo = () => setInfoOpen((prev) => !prev);

    const newChat = () => {
        if (window.confirm("Do you want to clear this conversation?")) {
            setMessages([]);
            setIsFirstMessageSent(false);
            setInfoOpen(false);
        }
    };

    const handleTextChange = (e) => {
        setInputText(e.target.value);
        e.target.style.height = "inherit";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const selectMode = (mode) => {
        setThinkingMode(mode === "deep");
        setModePopupOpen(false);
    };

    const sendMessage = async (overrideText = null) => {
        const promptToSend = (overrideText ?? inputText).trim();
        if (!promptToSend || isTyping) return;

        setInputText("");
        setIsFirstMessageSent(true);
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: promptToSend },
        ]);
        setIsTyping(true);

        try {
            const url = new URL("https://api.scriptifydevs.xyz/cline/glm5.1/chatbot.php");
            url.searchParams.append("message", promptToSend);
            url.searchParams.append("thinking", thinkingMode ? "true" : "false");

            const res = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
            });
            const rawText = await res.text();
            let finalAnswer = rawText;
            try {
                const json = JSON.parse(rawText);
                if (json.error) {
                    finalAnswer = `⚠️ ${json.error}`;
                } else if (json.content) {
                    finalAnswer = json.content;
                } else if (json.answer) {
                    finalAnswer = json.answer;
                } else if (json.response) {
                    finalAnswer = json.response;
                } else if (json.reply) {
                    finalAnswer = json.reply;
                }
            } catch (_) {}

            setMessages((prev) => [...prev, { sender: "bot", text: finalAnswer }]);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: `⚠️ **Error:** Unable to connect.\nDetail: \`${err.message}\`` },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderMarkdown = (text) => {
        if (!text) return { __html: "" };
        let h = text.replace(/</g, "<").replace(/>/g, ">");
        h = h.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        h = h.replace(/`(.*?)`/g, "<code>$1</code>");
        h = h.replace(/\n/g, "<br>");
        return { __html: h };
    };

    // Calculate window position smartly
    const getWindowStyle = () => {
        const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
        const chatW = Math.min(380, winW - 20);
        const chatH = Math.min(600, winH - 100);

        let right = fabPos.right;
        let bottom = fabPos.bottom + 70;

        if (bottom + chatH > winH - 10) {
            bottom = Math.max(10, winH - chatH - 10);
        }
        if (right + chatW > winW - 10) {
            right = winW - chatW - 10;
        }

        return { right, bottom, width: chatW, height: chatH };
    };

    const windowStyle = getWindowStyle();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                :root {
                    --gt-primary: #f0591f;
                    --gt-primary-glow: rgba(240, 89, 31, 0.35);
                    --gt-dark: #030712;
                    --gt-slate: #1e293b;
                    --gt-slate2: #0f172a;
                    --gt-text-muted: #94a3b8;
                    --gt-border: rgba(255,255,255,0.08);
                }

                * { box-sizing: border-box; }

                #gt-chatbot-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14px;
                }

                /* ── FAB ── */
                #gt-fab {
                    position: fixed;
                    width: 56px;
                    height: 56px;
                    border-radius: 18px;
                    background: var(--gt-primary);
                    border: none;
                    cursor: grab;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 24px var(--gt-primary-glow), 0 2px 8px rgba(0,0,0,0.3);
                    z-index: 9999;
                    user-select: none;
                    -webkit-user-select: none;
                    transition: box-shadow 0.3s, background 0.3s, transform 0.2s;
                }
                #gt-fab:active { cursor: grabbing; transform: scale(0.95); }
                #gt-fab.open { background: #1e293b; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
                #gt-fab:hover:not(:active) { box-shadow: 0 12px 32px var(--gt-primary-glow); }

                .fab-i img {
                    width: 28px; height: 28px;
                    object-fit: contain; pointer-events: none;
                    border-radius: 6px;
                }
                .fab-close { display: none; color: white; pointer-events: none; }
                #gt-fab.open .fab-chat { display: none; }
                #gt-fab.open .fab-close { display: flex; align-items: center; justify-content: center; }

                /* ── CHAT WINDOW ── */
                #gt-window {
                    position: fixed;
                    background: var(--gt-dark);
                    border: 1px solid var(--gt-border);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
                    z-index: 9998;
                    opacity: 0;
                    transform: translateY(16px) scale(0.96);
                    pointer-events: none;
                    transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                #gt-window.open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }

                /* ── TOPBAR ── */
                .gt-topbar {
                    padding: 14px 18px;
                    background: rgba(255,255,255,0.025);
                    border-bottom: 1px solid var(--gt-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                }
                .gt-topbar-left { display: flex; align-items: center; gap: 10px; }
                .gt-topbar-av {
                    position: relative; width: 36px; height: 36px; flex-shrink: 0;
                }
                .gt-topbar-av img {
                    width: 100%; height: 100%;
                    border-radius: 12px; background: white; padding: 4px;
                }
                .online-dot {
                    position: absolute; bottom: -1px; right: -1px;
                    width: 10px; height: 10px; background: #22c55e;
                    border: 2px solid var(--gt-dark); border-radius: 50%;
                }
                .gt-topbar-name { font-weight: 700; color: white; font-size: 0.9rem; line-height: 1.2; }
                .gt-topbar-sub { font-size: 0.7rem; color: #22c55e; font-weight: 600; }
                .gt-topbar-btns { display: flex; align-items: center; gap: 2px; position: relative; }
                .tbar-btn {
                    background: none; border: none; color: var(--gt-text-muted);
                    padding: 7px; cursor: pointer; border-radius: 10px;
                    transition: background 0.2s, color 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .tbar-btn:hover { background: rgba(255,255,255,0.06); color: white; }

                /* ── MODE SELECTOR (below input) ── */
                .gt-mode-bar {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 2px 0;
                    flex-shrink: 0;
                }
                .gt-mode-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    color: #94a3b8;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 0.72rem;
                    font-weight: 600;
                    transition: all 0.25s;
                    flex: 1;
                    justify-content: center;
                }
                .gt-mode-btn:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.15);
                }
                .gt-mode-btn.active-deep {
                    background: rgba(59,130,246,0.12);
                    border-color: rgba(59,130,246,0.3);
                    color: #60a5fa;
                }
                .gt-mode-btn.active-instant {
                    background: rgba(34,197,94,0.12);
                    border-color: rgba(34,197,94,0.3);
                    color: #4ade80;
                }
                .gt-mode-btn svg {
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                }

                /* ── BODY ── */
                .gt-body {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.08) transparent;
                    min-height: 0;
                }
                .gt-body::-webkit-scrollbar { width: 4px; }
                .gt-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

                /* ── MESSAGES ── */
                .gt-usr, .gt-bot { display: flex; gap: 8px; max-width: 88%; }
                .gt-usr { align-self: flex-end; flex-direction: row-reverse; }
                .gt-bot { align-self: flex-start; }

                .msg-av {
                    width: 28px; height: 28px;
                    border-radius: 9px;
                    flex-shrink: 0;
                    margin-top: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                .msg-av.user-av {
                    background: var(--gt-primary);
                    color: white;
                }
                .msg-av.bot-av {
                    background: white;
                    color: var(--gt-primary);
                }
                .msg-av img {
                    width: 20px; height: 20px;
                    object-fit: contain;
                }

                .bub {
                    padding: 12px 16px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    line-height: 1.55;
                    word-break: break-word;
                }
                .gt-usr .bub {
                    background: var(--gt-primary);
                    color: white;
                    border-bottom-right-radius: 6px;
                }
                .gt-bot .bub {
                    background: var(--gt-slate);
                    color: #e2e8f0;
                    border-bottom-left-radius: 6px;
                }
                .gt-bot .bub code {
                    background: rgba(255,255,255,0.08);
                    padding: 1px 5px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }

                /* ── TYPING ── */
                .gt-typing {
                    display: flex; gap: 4px;
                    padding: 10px 14px;
                    background: var(--gt-slate);
                    border-radius: 14px; border-bottom-left-radius: 4px;
                    width: fit-content;
                }
                .gt-typing span {
                    width: 5px; height: 5px;
                    background: var(--gt-text-muted);
                    border-radius: 50%;
                    animation: gtBounce 1.4s infinite;
                }
                .gt-typing span:nth-child(2) { animation-delay: 0.2s; }
                .gt-typing span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes gtBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                    40% { transform: translateY(-5px); opacity: 1; }
                }

                /* ── EMPTY STATE ── */
                .gt-empty-state {
                    text-align: center;
                    padding: 20px 10px;
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    flex: 1; justify-content: center;
                }
                .gt-empty-logo {
                    width: 64px; height: 64px;
                    background: white; border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 24px var(--gt-primary-glow);
                    margin-bottom: 4px;
                }
                .gt-empty-logo img { width: 44px; height: 44px; }
                .gt-empty-state h3 { color: white; font-size: 1rem; font-weight: 700; margin: 0; }
                .gt-empty-state p { color: var(--gt-text-muted); font-size: 0.8rem; margin: 0; }

                .gt-empty-chips {
                    display: flex; flex-wrap: wrap; gap: 6px;
                    justify-content: center; margin-top: 4px;
                }
                .gt-empty-chip {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #cbd5e1; padding: 6px 12px;
                    border-radius: 100px; font-size: 0.78rem;
                    cursor: pointer; transition: all 0.2s;
                    font-family: inherit;
                }
                .gt-empty-chip:hover {
                    background: var(--gt-primary);
                    border-color: var(--gt-primary); color: white;
                    transform: translateY(-1px);
                }

                /* ── INPUT ── */
                .gt-input-area {
                    padding: 10px 14px 14px;
                    border-top: 1px solid var(--gt-border);
                    flex-shrink: 0;
                }
                .gt-input-row {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    display: flex; align-items: flex-end; padding: 6px;
                    transition: border-color 0.2s;
                }
                .gt-input-row:focus-within { border-color: rgba(240,89,31,0.4); }

                #gt-ta {
                    flex: 1; background: none; border: none; color: white;
                    padding: 8px; resize: none; font-size: 0.875rem; outline: none;
                    max-height: 100px; font-family: inherit; line-height: 1.5;
                }
                #gt-ta::placeholder { color: #475569; }

                .ibtn {
                    width: 36px; height: 36px; border-radius: 10px; border: none;
                    background: none; color: var(--gt-text-muted); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .ibtn:hover { background: rgba(255,255,255,0.06); color: white; }
                .ibtn.send {
                    background: var(--gt-primary); color: white;
                    margin-left: 4px;
                    box-shadow: 0 4px 12px var(--gt-primary-glow);
                }
                .ibtn.send:hover { transform: scale(1.08); }

                .gt-powered {
                    text-align: center; font-size: 0.65rem;
                    color: #334155; margin-top: 8px; letter-spacing: 0.4px;
                }
                .gt-powered b { color: var(--gt-primary); }

                /* ── INFO PANEL ── */
                .gt-info-panel {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: var(--gt-dark); z-index: 10;
                    transform: translateX(100%);
                    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
                    padding: 24px; overflow-y: auto;
                }
                .gt-info-panel.show { transform: translateX(0); }

                .gt-info-hero { text-align: center; margin-bottom: 24px; }
                .gt-av-ring {
                    width: 80px; height: 80px; border-radius: 26px; background: white;
                    margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
                .gt-av-ring img { width: 56px; }
                .gt-info-nm { font-size: 1.1rem; font-weight: 800; color: white; }
                .gt-info-badge {
                    display: inline-block; padding: 3px 10px;
                    background: rgba(34,197,94,0.1); color: #22c55e;
                    border-radius: 100px; font-size: 0.7rem; font-weight: 700; margin-top: 6px;
                }
                .gt-info-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    padding: 14px; border-radius: 16px;
                    display: flex; align-items: center; gap: 12px;
                    text-decoration: none; transition: background 0.2s;
                }
                .gt-info-card:hover { background: rgba(255,255,255,0.06); }
                .card-icon {
                    width: 36px; height: 36px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .ci-email { background: #3b82f6; }
                .card-lbl { display: block; font-size: 0.7rem; color: #64748b; margin-bottom: 2px; }
                .card-val { color: white; font-weight: 600; font-size: 0.85rem; }
                .gt-back-btn {
                    margin-top: 16px; width: 100%; padding: 11px;
                    background: var(--gt-primary); border: none;
                    border-radius: 12px; color: white;
                    font-weight: 700; cursor: pointer; font-family: inherit;
                    font-size: 0.875rem; transition: opacity 0.2s;
                }
                .gt-back-btn:hover { opacity: 0.9; }
            `}</style>

            <div id="gt-chatbot-root">
                <audio ref={audioRef} src="/tick.mp3" preload="auto" />

                {/* FAB Button */}
                <button
                    id="gt-fab"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onClick={handleFabClick}
                    className={isOpen ? "open" : ""}
                    style={{ right: fabPos.right, bottom: fabPos.bottom }}
                >
                    <div className="fab-i fab-chat">
                        <img src="https://api.scriptifydevs.xyz/logo.png" alt="Logo" />
                    </div>
                    <div className="fab-i fab-close">
                        <svg viewBox="0 0 24 24" width="22" height="22">
                            <path fill="white" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </div>
                </button>

                {/* Chat Window */}
                <div
                    id="gt-window"
                    className={isOpen ? "open" : ""}
                    style={windowStyle}
                >
                    {/* Topbar */}
                    <div className="gt-topbar">
                        <div className="gt-topbar-left">
                            <div className="gt-topbar-av">
                                <img src="https://api.scriptifydevs.xyz/logo.png" alt="Bot" />
                                <div className="online-dot" />
                            </div>
                            <div>
                                <div className="gt-topbar-name">Assistant</div>
                                <div className="gt-topbar-sub">● Online</div>
                            </div>
                        </div>
                        <div className="gt-topbar-btns">
                            <button className="tbar-btn" onClick={toggleInfo} title="Info">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </button>
                            <button className="tbar-btn" onClick={newChat} title="New Chat">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className={`gt-info-panel ${infoOpen ? "show" : ""}`}>
                        <div className="gt-info-hero">
                            <div className="gt-av-ring">
                                <img src="https://api.scriptifydevs.xyz/logo.png" alt="Logo" />
                            </div>
                            <div className="gt-info-nm">GrapeTask AI</div>
                            <div className="gt-info-badge">Version 2.0</div>
                        </div>
                        <div className="gt-info-cards">
                            <a href="mailto:support@grapetask.com" className="gt-info-card">
                                <div className="card-icon ci-email">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                </div>
                                <div className="card-txt">
                                    <span className="card-lbl">Contact Support</span>
                                    <span className="card-val">grapetask786@gmail.com</span>
                                </div>
                            </a>
                        </div>
                        <div className="gt-info-cards">
                            <a href="https://wa.me/+923411228760" className="gt-info-card">
                                <div className="card-icon ci-email">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                </div>
                                <div className="card-txt">
                                    <span className="card-lbl">Watsapp Support</span>
                                    <span className="card-val">+923411228760</span>
                                </div>
                            </a>
                        </div>
                        <button className="gt-back-btn" onClick={toggleInfo}>← Back to Chat</button>
                    </div>

                    {/* Messages */}
                    <div className="gt-body" id="gt-msgs">
                        {!isFirstMessageSent && (
                            <div className="gt-empty-state">
                                <div className="gt-empty-logo">
                                    <img src="https://api.scriptifydevs.xyz/logo.png" alt="Logo" />
                                </div>
                                <h3>How can I help you?</h3>
                                <p>Ask me anything about GrapeTask</p>
                                <div className="gt-empty-chips">
                                    {QUICK_CHIPS.map((chip) => (
                                        <button key={chip} className="gt-empty-chip" onClick={() => sendMessage(chip)}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={msg.sender === "user" ? "gt-usr" : "gt-bot"}>
                                {msg.sender === "bot" ? (
                                    <div className="msg-av bot-av">
                                        <img src="https://api.scriptifydevs.xyz/logo.png" alt="Bot" />
                                    </div>
                                ) : (
                                    <div className="msg-av user-av">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="bub">
                                    {msg.text && (
                                        msg.sender === "bot"
                                            ? <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                                            : <div>{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="gt-bot">
                                <div className="msg-av bot-av">
                                    <img src="https://api.scriptifydevs.xyz/logo.png" alt="Bot" />
                                </div>
                                <div className="gt-typing"><span /><span /><span /></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="gt-input-area">
                        <div className="gt-input-row">
                            <textarea
                                ref={textareaRef}
                                id="gt-ta"
                                rows="2"
                                placeholder="Message..."
                                value={inputText}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="ibtn send" onClick={() => sendMessage()}>
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.06-.87.49-.87.99l.01 4.61c0 .71.73 1.2 1.39.92z" />
                                </svg>
                            </button>
                        </div>
                        {/* Mode Selector Bar */}
                        <div className="gt-mode-bar">
                            <button
                                className={`gt-mode-btn ${!thinkingMode ? "active-instant" : ""}`}
                                onClick={() => selectMode("instant")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                Instant
                            </button>
                            <button
                                className={`gt-mode-btn ${thinkingMode ? "active-deep" : ""}`}
                                onClick={() => selectMode("deep")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M12 2a10 10 0 1 0 10 10" />
                                    <path d="M12 6v6l4 2" />
                                    <path d="M22 12h-4" />
                                </svg>
                                Deep Thinking
                            </button>
                        </div>
                        <div className="gt-powered">⚡ by <b>GrapeTask AI</b> ·</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
