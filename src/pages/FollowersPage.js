import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import emptyProfile from "../assets/emptyProfileModal.webp";

const FollowersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch followers
  const fetchFollowers = useCallback(async () => {
    try {
      const response = await axios.get("/api/follow/followers");
      setFollowers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch followers", err);
    }
  }, []);

  // Fetch following
  const fetchFollowing = useCallback(async () => {
    try {
      const response = await axios.get("/api/follow/following");
      setFollowing(response.data || []);
    } catch (err) {
      console.error("Failed to fetch following", err);
    }
  }, []);

  // Fetch follow requests
  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get("/api/follow/requests");
      setRequests(response.data || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    Promise.all([fetchFollowers(), fetchFollowing(), fetchRequests()])
      .finally(() => setLoading(false));
  }, [currentUser?.id, fetchFollowers, fetchFollowing, fetchRequests]);

  // Accept follow request
  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post("/api/follow/accept", { follower_id: userId });
      
      // Create conversation for chat
      await axios.post("/api/conversations", {
        participant_id: userId,
        type: "direct"
      });
      
      // Refresh lists
      fetchRequests();
      fetchFollowers();
      
      console.log("✅ Follow request accepted");
    } catch (err) {
      console.error("❌ Failed to accept request", err);
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  // Reject follow request
  const handleRejectRequest = async (userId) => {
    try {
      await axios.post("/api/follow/reject", { follower_id: userId });
      fetchRequests();
      console.log("❌ Follow request rejected");
    } catch (err) {
      console.error("❌ Failed to reject request", err);
    }
  };

  // Unfollow user
  const handleUnfollow = async (userId) => {
    try {
      await axios.post("/api/follow/unfollow", { following_id: userId });
      fetchFollowing();
      console.log("✅ Unfollowed successfully");
    } catch (err) {
      console.error("❌ Failed to unfollow", err);
    }
  };

  // Start chat with user
  const handleStartChat = async (user) => {
    try {
      // Navigate to chat with this user
      navigate(`/chat/${user.id}`, { 
        state: { 
          userId: user.id,
          userName: user.name,
          userImage: user.image
        }
      });
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  // View user profile
  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const renderUserCard = (user, type) => (
    <div
      key={user.id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "var(--card-bg, #1a1a2e)",
        borderRadius: "12px",
        marginBottom: "12px",
        border: "1px solid var(--border-color, #2d2d44)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        onClick={() => handleViewProfile(user.id)}
      >
        <img
          src={user.image || emptyProfile}
          alt={user.name}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--primary-orange, #f0591f)",
          }}
          onError={(e) => { e.target.src = emptyProfile; }}
        />
        <div>
          <h4 style={{ margin: 0, color: "var(--text-primary, #fff)", fontSize: "16px" }}>
            {user.name}
          </h4>
          <p style={{ margin: 0, color: "var(--text-secondary, #aaa)", fontSize: "13px" }}>
            {user.role}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {type === "request" && (
          <>
            <button
              onClick={() => handleAcceptRequest(user.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--primary-orange, #f0591f)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectRequest(user.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "var(--text-secondary, #aaa)",
                border: "1px solid var(--border-color, #2d2d44)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Reject
            </button>
          </>
        )}

        {type === "follower" && (
          <>
            <button
              onClick={() => handleStartChat(user)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--primary-orange, #f0591f)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Message
            </button>
            <button
              onClick={() => handleViewProfile(user.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "var(--text-secondary, #aaa)",
                border: "1px solid var(--border-color, #2d2d44)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              View
            </button>
          </>
        )}

        {type === "following" && (
          <>
            <button
              onClick={() => handleStartChat(user)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--primary-orange, #f0591f)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Message
            </button>
            <button
              onClick={() => handleUnfollow(user.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "var(--text-secondary, #aaa)",
                border: "1px solid var(--border-color, #2d2d44)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Unfollow
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Filter users by search
  const filterUsers = (users) => {
    if (!searchQuery) return users;
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderContent = () => {
    const filteredFollowers = filterUsers(followers);
    const filteredFollowing = filterUsers(following);
    const filteredRequests = filterUsers(requests);

    switch (activeTab) {
      case "followers":
        return filteredFollowers.length === 0 
          ? renderEmptyState("No followers yet")
          : filteredFollowers.map((user) => renderUserCard(user, "follower"));
      case "following":
        return filteredFollowing.length === 0
          ? renderEmptyState("Not following anyone yet")
          : filteredFollowing.map((user) => renderUserCard(user, "following"));
      case "requests":
        return filteredRequests.length === 0
          ? renderEmptyState("No follow requests")
          : filteredRequests.map((user) => renderUserCard(user, "request"));
      default:
        return null;
    }
  };

  const renderEmptyState = (message) => (
    <div style={{
      textAlign: "center",
      padding: "60px 20px",
      color: "var(--text-secondary, #64748b)"
    }}>
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "var(--bg-hover, #f1f5f9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
        fontSize: "32px"
      }}>
        {activeTab === "followers" && "👥"}
        {activeTab === "following" && "👤"}
        {activeTab === "requests" && "📨"}
      </div>
      <p style={{ fontSize: "16px", margin: "0 0 8px 0", fontWeight: 500, color: "var(--text-primary, #1a1a2e)" }}>
        {message}
      </p>
      <p style={{ fontSize: "14px", margin: 0, opacity: 0.7 }}>
        {activeTab === "followers" && "People who follow you will appear here"}
        {activeTab === "following" && "People you follow will appear here"}
        {activeTab === "requests" && "Pending follow requests will appear here"}
      </p>
    </div>
  );

  return (
    <>
      <Navbar FirstNav="none" />
      
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        paddingTop: "80px",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color, #f8fafc)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "50%",
              cursor: "pointer",
              color: "var(--text-primary, #1a1a2e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--bg-hover, #f1f5f9)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <span style={{ fontSize: "20px" }}>←</span>
          </button>
          <div>
            <h1 style={{ 
              color: "var(--text-primary, #1a1a2e)", 
              margin: "0 0 4px 0",
              fontSize: "24px",
              fontWeight: 700
            }}>
              Connections
            </h1>
            <p style={{ 
              color: "var(--text-secondary, #64748b)", 
              margin: 0,
              fontSize: "14px"
            }}>
              Manage your network
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "20px"
        }}>
          {[
            { id: "followers", count: followers.length, label: "Followers", icon: "👥" },
            { id: "following", count: following.length, label: "Following", icon: "👤" },
            { id: "requests", count: requests.length, label: "Requests", icon: "📨", highlight: requests.length > 0 },
          ].map((stat) => (
            <button
              key={stat.id}
              onClick={() => setActiveTab(stat.id)}
              style={{
                padding: "12px 4px",
                backgroundColor: activeTab === stat.id 
                  ? "var(--primary-orange, #f0591f)" 
                  : stat.highlight ? "rgba(255, 107, 107, 0.1)" : "var(--card-bg, #ffffff)",
                color: activeTab === stat.id ? "#fff" : stat.highlight ? "#FF6B6B" : "var(--text-primary, #1a1a2e)",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                boxShadow: activeTab === stat.id 
                  ? "0 3px 8px rgba(240, 89, 31, 0.25)" 
                  : "0 1px 3px rgba(0,0,0,0.05)",
                position: "relative",
                transform: activeTab === stat.id ? "translateY(-1px)" : "translateY(0)"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px", lineHeight: 1 }}>
                {stat.count}
              </div>
              <div style={{ fontSize: "11px", fontWeight: 500, opacity: 0.9, whiteSpace: "nowrap" }}>
                {stat.label}
              </div>
              {stat.highlight && activeTab !== stat.id && (
                <span style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#FF6B6B"
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              backgroundColor: "var(--card-bg, #ffffff)",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "12px",
              fontSize: "14px",
              color: "var(--text-primary, #1a1a2e)",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "14px center"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary-orange, #f0591f)";
              e.target.style.boxShadow = "0 0 0 3px rgba(240, 89, 31, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-color, #e2e8f0)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px",
            color: "var(--text-secondary, #64748b)"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--border-color, #e2e8f0)",
              borderTop: "3px solid var(--primary-orange, #f0591f)",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite"
            }} />
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            {renderContent()}
          </div>
        )}

        {/* Animations */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default FollowersPage;
