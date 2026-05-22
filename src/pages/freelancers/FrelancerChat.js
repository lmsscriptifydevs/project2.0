import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedConversation } from '../../redux/slices/messageSlice';
import '../../style/frelancerChat.scss';
import UsersChat from '../../components/frelancerChat/Chat/UsersChat';
import Chating from '../../components/frelancerChat/Chat/Chating';
import ChatUserProfile from '../../components/frelancerChat/Chat/ChatUserProfile';
import Navbar from '../../components/Navbar';
import { AiOutlineArrowLeft } from 'react-icons/ai';
const Chat = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.message);
  
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("inboxTheme") || "dark");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e) => setThemeMode(e.detail);
    window.addEventListener('inboxThemeChanged', handleThemeChange);
    return () => window.removeEventListener('inboxThemeChanged', handleThemeChange);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setIsMobileChatOpen(true);
      setShowProfileSidebar(false);
    } else {
      setIsMobileChatOpen(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const handleToggleProfile = () => setShowProfileSidebar(prev => !prev);
    const handleMobileBack = () => {
      setIsMobileChatOpen(false);
      setTimeout(() => dispatch(setSelectedConversation(null)), 300);
    };
    const handleCloseProfile = () => setShowProfileSidebar(false);

    window.addEventListener('toggleProfileSidebar', handleToggleProfile);
    window.addEventListener('mobileBackToList', handleMobileBack);
    window.addEventListener('closeProfileSidebar', handleCloseProfile);
    return () => {
      window.removeEventListener('toggleProfileSidebar', handleToggleProfile);
      window.removeEventListener('mobileBackToList', handleMobileBack);
      window.removeEventListener('closeProfileSidebar', handleCloseProfile);
    };
  }, [dispatch]);

  return (
    <div className={`gt-inbox-wrapper theme-${themeMode}`}>
      <Navbar FirstNav='none' />

      <div className="gt-inbox-layout">
        <div className={`gt-inbox-sidebar ${isMobileChatOpen ? 'mobile-hide' : ''}`}>
          <UsersChat />
        </div>

        <div className={`gt-inbox-main ${isMobileChatOpen ? 'mobile-show' : ''}`}>
          <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Chating />
          </div>
        </div>

        <div className={`gt-profile-sidebar ${showProfileSidebar ? 'open' : ''}`}>
          <div className="gt-profile-sidebar-inner">
            <div className="d-md-none" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 100 }}>
              <button
                onClick={() => setShowProfileSidebar(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <AiOutlineArrowLeft size={20} />
              </button>
            </div>
            <div className="d-none d-md-flex" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}>
              <button
                onClick={() => setShowProfileSidebar(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--wa-icon)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <ChatUserProfile />
          </div>
        </div>
      </div>

      <style>{`
        /* ════════════════════════════════════════
           DARK: GrapeTask Navy + Orange + White
        ════════════════════════════════════════ */
        .gt-inbox-wrapper.theme-dark {
          --wa-bg:           #060D18;
          --wa-panel:        #0B1628;
          --wa-panel-hover:  #112036;
          --wa-panel-active: #112036;
          --wa-input-bg:     #142030;
          --wa-divider:      #1C2E46;
          --wa-text-primary: #FFFFFF;
          --wa-text-second:  #A8BCCE;
          --wa-text-muted:   #6B84A0;
          --wa-green:        #F0591F;
          --wa-green-badge:  #F0591F;
          --wa-green-time:   #F07030;
          --wa-sent-bubble:  #1E3A6B;
          --wa-recv-bubble:  #0D1E33;
          --wa-icon:         #A8BCCE;
          --wa-icon-hover:   #FFFFFF;
          --wa-header-bg:    #0B1628;
          --wa-search-bg:    #112036;
          --wa-bubble-text:  #FFFFFF;
          --wa-time-text:    #6B84A0;
          --wa-tick-blue:    #F0591F;
          --wa-shadow:       rgba(0,0,0,0.6);
          --wa-online:       #22C55E;

          --inbox-bg:            #060D18;
          --inbox-surface:       #0B1628;
          --inbox-border:        #1C2E46;
          --inbox-border-mid:    #1C2E46;
          --inbox-primary:       #F0591F;
          --inbox-primary-hover: #D44D1A;
          --inbox-primary-light: rgba(240,89,31,0.15);
          --inbox-text-main:     #FFFFFF;
          --inbox-text-muted:    #A8BCCE;
          --inbox-text-light:    #A8BCCE;
          --inbox-text-body:     #6B84A0;
          --inbox-hover:         #112036;
          --inbox-orange-border: rgba(240,89,31,0.4);
          --inbox-card-bg:       #0B1628;
        }

        /* ════════════════════════════════════════
           LIGHT: WhatsApp exact light theme
        ════════════════════════════════════════ */
        .gt-inbox-wrapper.theme-light {
          --wa-bg:           #F0F2F5;
          --wa-panel:        #FFFFFF;
          --wa-panel-hover:  #F5F6F6;
          --wa-panel-active: #F0F2F5;
          --wa-input-bg:     #F0F2F5;
          --wa-divider:      #E9EDEF;
          --wa-text-primary: #111B21;
          --wa-text-second:  #667781;
          --wa-text-muted:   #8696A0;
          --wa-green:        #F0591F;
          --wa-green-badge:  #F0591F;
          --wa-green-time:   #F07030;
          --wa-sent-bubble:  #FFEBE3;
          --wa-recv-bubble:  #FFFFFF;
          --wa-icon:         #54656F;
          --wa-icon-hover:   #111B21;
          --wa-header-bg:    #F0F2F5;
          --wa-search-bg:    #F0F2F5;
          --wa-bubble-text:  #111B21;
          --wa-time-text:    #667781;
          --wa-tick-blue:    #F0591F;
          --wa-shadow:       rgba(0,0,0,0.08);
          --wa-online:       #25D366;

          --inbox-bg:            #F0F2F5;
          --inbox-surface:       #FFFFFF;
          --inbox-border:        #E9EDEF;
          --inbox-border-mid:    #E9EDEF;
          --inbox-primary:       #F0591F;
          --inbox-primary-hover: #D44D1A;
          --inbox-primary-light: rgba(240,89,31,0.15);
          --inbox-text-main:     #111B21;
          --inbox-text-muted:    #667781;
          --inbox-text-light:    #667781;
          --inbox-text-body:     #8696A0;
          --inbox-hover:         #F0F2F5;
          --inbox-orange-border: rgba(240,89,31,0.4);
          --inbox-card-bg:       #FFFFFF;
        }

        /* ════════════════════════════════════════
           BASE LAYOUT
        ════════════════════════════════════════ */
        .gt-inbox-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--wa-bg);
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }

        .gt-inbox-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          background-color: var(--wa-bg);
          position: relative;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          box-shadow: 0 0 60px var(--wa-shadow);
        }

        /* ── LEFT SIDEBAR ── */
        .gt-inbox-sidebar {
          width: 380px;
          min-width: 380px;
          background-color: var(--wa-panel);
          border-right: 1px solid var(--wa-divider);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
        }
        .gt-inbox-sidebar > div { height: 100%; display: flex; flex-direction: column; }

        /* ── MAIN CHAT AREA ── */
        .gt-inbox-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--wa-bg);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 5;
        }
        .gt-inbox-main > div { height: 100%; display: flex; flex-direction: column; }

        /* ── RIGHT PROFILE SIDEBAR ── */
        .gt-profile-sidebar {
          width: 380px;
          background-color: var(--wa-panel);
          border-left: 1px solid var(--wa-divider);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
          z-index: 20;
        }
        .gt-profile-sidebar:not(.open) {
          width: 0; border-width: 0; opacity: 0; pointer-events: none;
        }
        .gt-profile-sidebar-inner {
          width: 380px; height: 100%;
          display: flex; flex-direction: column;
          overflow-y: auto; position: relative;
        }

        /* ── TABLET ── */
        @media (max-width: 1024px) {
          .gt-inbox-sidebar { width: 320px; min-width: 320px; }
          .gt-profile-sidebar {
            position: absolute; right: -380px; top: 0; height: 100%;
            z-index: 30; box-shadow: -4px 0 20px var(--wa-shadow);
            width: 380px !important; opacity: 1 !important;
            border-width: 1px !important; pointer-events: all !important;
            transition: right 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
          }
          .gt-profile-sidebar:not(.open) { right: -380px; }
          .gt-profile-sidebar.open { right: 0; }
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .gt-inbox-layout { padding: 0; position: relative; overflow: hidden; }
          .gt-inbox-sidebar,
          .gt-inbox-main,
          .gt-profile-sidebar {
            border-radius: 0; border: none; height: 100%;
            position: absolute; top: 0; left: 0;
            width: 100% !important; min-width: unset !important;
          }
          .gt-inbox-sidebar { z-index: 10; transform: translateX(0); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
          .gt-inbox-sidebar.mobile-hide { transform: translateX(-100%); }
          .gt-inbox-main { z-index: 15; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
          .gt-inbox-main.mobile-show { transform: translateX(0); }
          .gt-profile-sidebar {
            z-index: 25; transform: translateX(100%); right: auto !important;
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
            opacity: 1 !important; pointer-events: all !important; width: 100% !important;
          }
          .gt-profile-sidebar.open { transform: translateX(0); }
        }

        /* ── SCROLLBAR ── */
        .gt-inbox-wrapper * { scrollbar-width: thin; scrollbar-color: var(--wa-divider) transparent; }
        .gt-inbox-wrapper ::-webkit-scrollbar { width: 6px; }
        .gt-inbox-wrapper ::-webkit-scrollbar-track { background: transparent; }
        .gt-inbox-wrapper ::-webkit-scrollbar-thumb { background: var(--wa-divider); border-radius: 4px; }
        .gt-inbox-wrapper ::-webkit-scrollbar-thumb:hover { background: var(--wa-text-muted); }

        /* ── INPUT PLACEHOLDER COLOR ── */
        .gt-inbox-wrapper input::placeholder { color: var(--wa-text-muted); }
        .gt-inbox-wrapper textarea::placeholder { color: var(--wa-text-muted); }
      `}</style>
    </div>
  );
};

export default Chat;
