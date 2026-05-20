import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedConversation } from '../../redux/slices/messageSlice';
import '../../style/frelancerChat.scss';
import UsersChat from '../../components/frelancerChat/Chat/UsersChat';
import Chating from '../../components/frelancerChat/Chat/Chating';
import ChatUserProfile from '../../components/frelancerChat/Chat/ChatUserProfile';
import Navbar from '../../components/Navbar';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { selectedConversation } = useSelector((state) => state.message);
  
  // Local state for mobile/sidebar toggles
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  // Whenever a conversation is selected via Redux, open the mobile chat window
  useEffect(() => {
    if (selectedConversation) {
      setIsMobileChatOpen(true);
      setShowProfileSidebar(false); // Auto-hide profile when switching chats
    }
  }, [selectedConversation]);

  useEffect(() => {
    const handleToggleProfile = () => setShowProfileSidebar(prev => !prev);
    const handleMobileBack = () => {
      setIsMobileChatOpen(false);
      setTimeout(() => {
        dispatch(setSelectedConversation(null));
      }, 300); // clear after animation
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
    <div className="gt-inbox-wrapper">
      <Navbar FirstNav='none' />

      <div className="gt-inbox-layout">
        
        {/* Sidebar: Users List */}
        <div className={`gt-inbox-sidebar ${isMobileChatOpen ? 'mobile-hide' : ''}`}>
          <UsersChat />
        </div>

        {/* Center: Main Chat Window */}
        <div className={`gt-inbox-main ${isMobileChatOpen ? 'mobile-show' : ''}`}>
          <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Chating />
          </div>
        </div>

        {/* Right: User Profile Detail */}
        <div className={`gt-profile-sidebar ${showProfileSidebar ? 'open' : ''}`}>
          <div className="gt-profile-sidebar-inner">
            <div className="d-md-none" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 100 }}>
              <button 
                onClick={() => setShowProfileSidebar(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              >
                <AiOutlineArrowLeft size={20} />
              </button>
            </div>
            
            <div className="d-none d-md-flex" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}>
              <button 
                onClick={() => setShowProfileSidebar(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--inbox-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--inbox-text-muted)'}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <ChatUserProfile />
          </div>
        </div>

      </div>

      {/* 🚀 PREMIUM GRAPETASK DARK THEME CSS 🚀 */}
      <style>{`
        :root {
          --inbox-bg: #020617;
          --inbox-surface: rgba(255, 255, 255, 0.02);
          --inbox-border: rgba(255, 255, 255, 0.06);
          --inbox-primary: #f0591f;
          --inbox-primary-hover: #d44d1a;
          --inbox-primary-light: rgba(240, 89, 31, 0.15);
          --inbox-text-main: #ffffff;
          --inbox-text-muted: #a1a1aa;
          --inbox-text-light: #71717a;
          --inbox-hover: rgba(255, 255, 255, 0.04);
        }

        body {
          background-color: var(--inbox-bg) !important;
          color: var(--inbox-text-main) !important;
        }

        .gt-inbox-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--inbox-bg);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        .gt-inbox-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          background-color: var(--inbox-bg);
          position: relative;
          padding: 24px;
          gap: 20px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* ─── LEFT SIDEBAR (CHATS LIST) ─── */
        .gt-inbox-sidebar {
          width: 340px;
          background-color: var(--inbox-surface);
          border: 1px solid var(--inbox-border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
        }
        .gt-inbox-sidebar > div { height: 100%; display: flex; flex-direction: column; }

        /* ─── MAIN CHAT AREA ─── */
        .gt-inbox-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--inbox-surface);
          border-radius: 20px;
          border: 1px solid var(--inbox-border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 15;
        }
        .gt-inbox-main > div { height: 100%; display: flex; flex-direction: column; }

        /* ─── RIGHT SIDEBAR (PROFILE INFO) ─── */
        @keyframes gt-anim-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gt-profile-sidebar {
          width: 360px;
          background: linear-gradient(-45deg, rgba(2,6,23,0.8), rgba(15,23,42,0.9), rgba(240,89,31,0.05));
          background-size: 200% 200%;
          animation: gt-anim-gradient 10s ease infinite;
          backdrop-filter: blur(30px);
          border: 1px solid var(--inbox-border);
          border-top: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          overflow: hidden;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, border 0.3s;
          z-index: 20;
          margin-left: 0;
        }
        .gt-profile-sidebar:not(.open) {
          width: 0;
          margin-left: -20px; /* Removes the flex gap on desktop */
          border-width: 0;
          opacity: 0;
          pointer-events: none;
        }
        .gt-profile-sidebar-inner { 
          width: 360px; /* Fixed inner width to prevent squishing during animation */
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          overflow-y: hidden; 
          position: relative;
        }

        @media (max-width: 1024px) {
          .gt-inbox-layout { padding: 12px; gap: 12px; }
          .gt-profile-sidebar { position: absolute; right: -360px; height: calc(100% - 24px); z-index: 20; box-shadow: -10px 0 30px rgba(0,0,0,0.4); width: 360px; margin-left: 0 !important; }
          .gt-profile-sidebar:not(.open) { right: -360px; opacity: 1; width: 360px; border-width: 1px; }
          .gt-profile-sidebar.open { right: 12px; }
        }
        
        /* ─── MOBILE SMOOTH SLIDING BEHAVIOR ─── */
        @media (max-width: 768px) {
          .gt-inbox-layout { padding: 0; gap: 0; position: relative; overflow: hidden; }
          .gt-inbox-sidebar, .gt-inbox-main, .gt-profile-sidebar { border-radius: 0; border: none; height: 100%; position: absolute; top: 0; left: 0; width: 100%; }
          
          /* The 3 layers on Mobile */
          /* Layer 1: Sidebar (User List) */
          .gt-inbox-sidebar { z-index: 10; transform: translateX(0); }
          .gt-inbox-sidebar.mobile-hide { transform: translateX(-100%); }
          
          /* Layer 2: Main Chat Window */
          .gt-inbox-main { z-index: 15; transform: translateX(100%); }
          .gt-inbox-main.mobile-show { transform: translateX(0); }
          
          /* Layer 3: Profile Sidebar */
          .gt-profile-sidebar { z-index: 20; transform: translateX(100%); width: 100% !important; right: auto !important; opacity: 1 !important; }
          .gt-profile-sidebar.open { transform: translateX(0); }
        }
        
        /* Overriding child component hardcoded colors for Light Theme */
        .gt-inbox-wrapper * {
          scrollbar-width: thin;
          scrollbar-color: var(--inbox-border) transparent;
        }
        .gt-inbox-wrapper ::-webkit-scrollbar { width: 6px; }
        .gt-inbox-wrapper ::-webkit-scrollbar-thumb { background-color: var(--inbox-border); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default Chat;
