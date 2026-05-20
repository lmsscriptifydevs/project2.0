import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { RiArrowLeftLine, RiDoubleQuotesR } from "react-icons/ri";

const AllSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://portal.grapetask.co/api/success-stories/")
      .then(res => setStories(res.data.data));
  }, []);

  return (
    <div style={{ backgroundColor: "#1a2b3b", minHeight: "100vh", padding: "80px 5%" }}>
      <button onClick={() => navigate(-1)} style={{ color: "#f0591f", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: 800, marginBottom: "40px" }}>
        <RiArrowLeftLine /> Back to Home
      </button>

      <h1 style={{ color: "#fff", fontSize: "3rem", fontWeight: 800, marginBottom: "50px" }}>
        All <span style={{ color: "#f0591f" }}>Success Stories</span>
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" }}>
        {stories.map(story => (
          <motion.div 
            key={story.id} 
            onClick={() => navigate(`/success-stories/${story.id}`)}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "30px", borderRadius: "24px", cursor: "pointer" }}
            whileHover={{ y: -10, borderColor: "#f0591f" }}
          >
            <img src={story.image_url} style={{ width: "60px", height: "60px", borderRadius: "15px", marginBottom: "20px", border: "2px solid #f0591f" }} alt="" />
            <h3 style={{ color: "#fff" }}>{story.user_name}</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>{story.portfolio_summary.substring(0, 100)}...</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllSuccessStories;