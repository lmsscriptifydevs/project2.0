import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userFallback from "../../../assets/chatImg.webp";
import { getUserGigs } from "../../../redux/slices/offersSlice";
import { CircularProgress } from "@mui/material";

const ChatUserProfile = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.message);
  const { userGigs, isLoadingGigs } = useSelector((state) => state.offers);
  const otherUser = selectedConversation?.user;

  useEffect(() => {
    if (otherUser?.id) {
      dispatch(getUserGigs({ id: otherUser.id }));
    }
  }, [dispatch, otherUser?.id]);

  // Use the fetched onboarding data if available, otherwise fallback to the chat user object
  const profileData = userGigs?.id === otherUser?.id ? userGigs : otherUser;

  // GrapeTask Schema Colors (Dark Theme restored & connected to variables)
  const theme = {
    mainBg: "var(--inbox-bg, #020617)",
    cardBg: "var(--inbox-surface, rgba(255,255,255,0.02))",
    primaryOrange: "var(--inbox-primary, #f0591f)",
    pureWhite: "var(--inbox-text-main, #ffffff)",
    mediumGray: "var(--inbox-text-muted, #a1a1aa)",
    bodyGray: "var(--inbox-text-light, #71717a)",
    lightBorder: "var(--inbox-border, rgba(255,255,255,0.06))",
    orangeGlow: "var(--inbox-primary-light, rgba(240, 89, 31, 0.15))",
    lightGray: "var(--inbox-text-muted, #a1a1aa)"
  };

  if (!otherUser) {
    return (
      <div className="h-100 rounded-4 d-flex justify-content-center align-items-center" 
           style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.lightBorder}` }}>
        <p style={{ color: theme.bodyGray, fontSize: '13px' }}>Select a chat to view profile</p>
      </div>
    );
  }

  return (
    <div className="h-100 rounded-4 custom-profile-scroll" 
         style={{ 
           backgroundColor: theme.cardBg, 
           border: `1px solid ${theme.lightBorder}`,
           overflowY: 'auto',
           maxHeight: '100vh',
           paddingBottom: '20px'
         }}>
      
      {/* --- Profile Header Section --- */}
      <div className="d-flex flex-column align-items-center p-4 text-center">
        
        {/* PREMIUM CIRCLE IMAGE START */}
        <div style={{
          position: 'relative',
          padding: '4px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.primaryOrange} 0%, transparent 100%)`,
          boxShadow: `0 0 20px ${theme.orangeGlow}`, // Soft orange glow
          marginBottom: '15px'
        }}>
          <img
            src={otherUser?.image || userFallback}
            alt="profile"
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              objectFit: "cover",
              border: `3px solid ${theme.mainBg}`, // Gap between img and gradient
              display: 'block'
            }}
          />
          {/* Online Indicator Dot */}
          <span style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '14px',
            height: '14px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: `3px solid ${theme.mainBg}`,
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
          }}></span>
        </div>
        {/* PREMIUM CIRCLE IMAGE END */}

        <h6 className="mb-1" style={{ color: theme.pureWhite, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          {profileData?.fname} {profileData?.lname}
        </h6>
        <p className="mb-0" style={{ color: theme.primaryOrange, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {profileData?.extra_details?.occupation || profileData?.role || "GrapeTask User"}
        </p>
      </div>

      {isLoadingGigs ? (
        <div className="d-flex justify-content-center py-4">
          <CircularProgress size={24} sx={{ color: theme.primaryOrange }} />
        </div>
      ) : (
        <div className="p-3 d-flex flex-column gap-3">
          
          {/* About / Bio */}
          {profileData?.bio && (
            <div>
              <span style={{ color: theme.mediumGray, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>About</span>
              <p style={{ color: theme.pureWhite, fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {profileData.bio}
              </p>
            </div>
          )}

          {/* Core Info */}
          <div style={{ backgroundColor: 'var(--inbox-hover, rgba(255,255,255,0.04))', borderRadius: '14px', border: `1px solid ${theme.lightBorder}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ color: theme.bodyGray, fontSize: '13px' }}>Location</span>
              <span style={{ color: theme.pureWhite, fontSize: '13px', fontWeight: '600' }}>{profileData?.city ? `${profileData.city}, ` : ""}{profileData?.country || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ color: theme.bodyGray, fontSize: '13px' }}>Experience</span>
              <span style={{ color: theme.primaryOrange, fontSize: '13px', fontWeight: '700', backgroundColor: theme.orangeGlow, padding: '2px 8px', borderRadius: '6px' }}>{profileData?.level || "Beginner"}</span>
            </div>
            {profileData?.english_level && (
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ color: theme.bodyGray, fontSize: '13px' }}>English</span>
                <span style={{ color: theme.pureWhite, fontSize: '13px', fontWeight: '600' }}>{profileData.english_level}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {profileData?.skills?.length > 0 && (
            <div>
              <span style={{ color: theme.mediumGray, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profileData.skills.map((s, i) => (
                  <span key={i} style={{ 
                    backgroundColor: theme.mainBg, 
                    border: `1px solid ${theme.lightBorder}`, 
                    color: theme.lightGray, 
                    padding: '6px 12px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    fontWeight: '600' 
                  }}>
                    {s.skill || s.name || s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profileData?.educations?.length > 0 && (
            <div>
              <span style={{ color: theme.mediumGray, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>Education</span>
              <div className="d-flex flex-column gap-2">
                {profileData.educations.map((edu, i) => (
                  <div key={i} style={{ backgroundColor: theme.mainBg, border: `1px solid ${theme.lightBorder}`, padding: '12px', borderRadius: '12px' }}>
                    <h6 style={{ color: theme.pureWhite, fontSize: '14px', margin: '0 0 4px 0', fontWeight: '600' }}>{edu.degree}</h6>
                    <p style={{ color: theme.bodyGray, fontSize: '12px', margin: 0 }}>{edu.institution || edu.university}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Styles for Scroll and Hover */}
      <style jsx>{`
        .custom-profile-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .custom-profile-scroll::-webkit-scrollbar-thumb {
          background: ${theme.lightBorder};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ChatUserProfile;