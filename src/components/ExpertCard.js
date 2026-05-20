import React, { memo, useMemo } from "react";
import { MdLocationOn, MdVerified } from "react-icons/md";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const FALLBACK_AVATAR = "https://portal.grapetask.co/user.png";

// Theme Configuration based on your JSON
const THEME = {
  backgrounds: {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
  },
  accents: {
    primaryOrange: "#f0591f",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  },
  text: {
    pureWhite: "#ffffff",
    pureBlack: "#000000",
    lightGrayHover: "#d4d4d8",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    darkGrayNumber: "#52525b",
  },
  borders: {
    lightBorder: "rgba(255, 255, 255, 0.06)",
    mediumBorder: "rgba(255, 255, 255, 0.07)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)",
  },
};

const ExpertCard = memo(function ExpertCard({ user, showExpertDetail }) {
  const fullName = `${user?.fname ?? ""} ${user?.lname ?? ""}`.trim() || "Unnamed Expert";
  const role = user?.role || "Freelancer";
  const country = user?.country || "Location not specified";
  const city = user?.city ?? "";
  const location = city && country ? `${city}, ${country}` : country;

  const { description, hourlyRate, uniqueSkills, uniqueCategories } = useMemo(() => {
    const desc = user?.gigs?.[0]?.description
      ? user.gigs[0].description.replace(/<[^>]+>/g, "").substring(0, 110) + "..."
      : "No description available.";
    
    let rate = "0";
    if (user?.gigs?.[0]?.packages?.length) {
      const pkg = user.gigs[0].packages.find(
        (p) => p.total && p.total !== "$0" && p.total !== "0"
      );
      if (pkg) rate = String(pkg.total).replace("$", "");
    }

    const skills = Array.isArray(user?.skills) ? user.skills : [];
    const skillsFiltered = skills.filter((s) => typeof s === "string" && s.trim() !== "");
    const cats = user?.gigs?.map((g) => g?.category?.name).filter(Boolean) || [];
    const catsUnique = [...new Set(cats)];

    return {
      description: desc,
      hourlyRate: rate,
      uniqueSkills: skillsFiltered,
      uniqueCategories: catsUnique,
    };
  }, [user?.gigs, user?.skills]);

  const userLevel = user?.level || "New";

  return (
    <div
      className="expert-card-dark position-relative p-4 mb-3"
      onClick={() => showExpertDetail(user)}
      style={{
        cursor: "pointer",
        backgroundColor: THEME.backgrounds.cardBg,
        border: `1px solid ${THEME.borders.lightBorder}`,
        borderRadius: "16px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = THEME.backgrounds.cardBgActive;
        e.currentTarget.style.borderColor = THEME.borders.orangeBorderActive;
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = THEME.backgrounds.cardBg;
        e.currentTarget.style.borderColor = THEME.borders.lightBorder;
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* Header: Profile + Badge */}
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-center">
          <div className="position-relative">
            <img
              src={(user?.image && user?.image !== "null" && user?.image !== "") ? user.image : FALLBACK_AVATAR}
              alt={fullName}
              width={65}
              height={65}
              className="rounded-circle object-fit-cover"
              style={{ border: `2px solid ${THEME.accents.primaryOrange}` }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_AVATAR;
              }}
            />
            {user?.status === "Active" && (
              <span 
                className="position-absolute bottom-0 end-0 rounded-circle"
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#22c55e",
                  border: `2px solid ${THEME.backgrounds.mainBg}`
                }}
              ></span>
            )}
          </div>
          <div className="ms-3">
            <h6 className="mb-1 d-flex align-items-center" style={{ color: THEME.text.pureWhite, fontSize: "18px", fontWeight: "600" }}>
              {fullName} <MdVerified className="ms-1 text-info" size={16} />
            </h6>
            <p className="mb-1" style={{ color: THEME.accents.primaryOrange, fontSize: "13px", fontWeight: "500" }}>
              {role}
            </p>
            <p className="mb-0 d-flex align-items-center" style={{ color: THEME.text.bodyGrayText, fontSize: "12px" }}>
              <MdLocationOn className="me-1" /> {location}
            </p>
          </div>
        </div>
        
        {/* Rate Display */}
        <div className="text-end">
          <span style={{ color: THEME.text.pureWhite, fontSize: "20px", fontWeight: "700" }}>
            ${hourlyRate}
          </span>
          <span style={{ color: THEME.text.bodyGrayText, fontSize: "12px" }}>/hr</span>
        </div>
      </div>

      {/* Stats Line */}
      <div className="mt-3 d-flex gap-3 align-items-center" style={{ color: THEME.text.mediumGrayTitle, fontSize: "12px" }}>
        <span>Level: <b style={{color: THEME.text.pureWhite}}>{userLevel}</b></span>
        <span style={{ color: THEME.borders.mediumBorder }}>|</span>
        <span>Orders: <b style={{color: THEME.text.pureWhite}}>{user?.complete_orders || 0}</b></span>
        <span style={{ color: THEME.borders.mediumBorder }}>|</span>
        <span style={{ color: "#22c55e" }}>{user?.success_ratio || 0}% Success</span>
      </div>

      {/* Service Title */}
      {user?.gigs?.[0]?.title && (
        <div className="mt-3 p-2 rounded" style={{ backgroundColor: THEME.accents.secondaryBlueBlur, borderLeft: `3px solid ${THEME.accents.primaryOrange}` }}>
           <p className="mb-0 italic" style={{ color: THEME.text.lightGrayHover, fontSize: "13px", fontStyle: "italic" }}>
             "{user.gigs[0].title}"
           </p>
        </div>
      )}

      {/* Description */}
      <div className="mt-3">
        <p style={{ color: THEME.text.bodyGrayText, fontSize: "14px", lineHeight: "1.6" }}>
          {description}
        </p>
      </div>

      {/* Skills Badges */}
      {uniqueSkills.length > 0 && (
        <div className="mt-3 d-flex flex-wrap gap-2">
          {uniqueSkills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: THEME.text.lightGrayHover,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                border: `1px solid ${THEME.borders.lightBorder}`
              }}
            >
              {skill}
            </span>
          ))}
          {uniqueSkills.length > 5 && (
            <span style={{ color: THEME.text.mediumGrayTitle, fontSize: "11px", alignSelf: "center" }}>
              +{uniqueSkills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Bottom Action Hint */}
      <div className="mt-4 pt-3 d-flex justify-content-between align-items-center" style={{ borderTop: `1px solid ${THEME.borders.lightBorder}` }}>
        <span style={{ 
            color: user?.status === "Active" ? "#22c55e" : THEME.text.darkGrayNumber, 
            fontSize: "12px", 
            fontWeight: "600" 
        }}>
          {user?.status === "Active" ? "● Available Now" : "○ Offline"}
        </span>
        <button 
          className="btn btn-sm px-4" 
          style={{ 
            backgroundColor: THEME.accents.primaryOrange, 
            color: THEME.text.pureWhite,
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "13px"
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
});

export default ExpertCard;