import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Grid, Stack, Typography, Avatar, TextField, Button, Divider, Chip, Skeleton, Alert, Fade, useMediaQuery
} from "@mui/material";
import axios from "axios";

import {
  RiArrowLeftLine, RiDoubleQuotesL, RiVerifiedBadgeFill, RiStarFill,
  RiGraduationCapFill, RiPsychotherapyFill, RiCheckDoubleLine,
  RiTrophyFill, RiCalendarLine, RiHeartLine, RiHeartFill,
  RiSendPlane2Fill, RiChat3Line, RiUserLine, RiTimeLine,
  RiCheckboxCircleFill, RiArrowRightUpLine
} from "react-icons/ri";

const Footer = lazy(() => import("../components/Footer"));

const BASE = "https://portal.grapetask.co/api";

const T = {
  mainBg: "#020617",
  cardBg: "rgba(255,255,255,0.02)",
  cardBgActive: "rgba(255,255,255,0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59,130,246,0.05)",
  pureWhite: "#ffffff",
  lightGrayHover: "#d4d4d8",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  darkGrayNumber: "#52525b",
  lightBorder: "rgba(255,255,255,0.06)",
  mediumBorder: "rgba(255,255,255,0.07)",
  orangeBorderActive: "rgba(240,89,31,0.4)",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
`;

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  /* like state */
  const likeKey = `ss_liked_${id}`;
  const [liked, setLiked] = useState(() => localStorage.getItem(likeKey) === "1");
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  /* comment state */
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/success-stories/${id}`);
      const d = res.data.data || res.data;
      setStory(d);
      setLikesCount(d.likes_count ?? 0);
      setComments(d.comments ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchStory();
  }, [fetchStory]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((p) => (wasLiked ? p - 1 : p + 1));
    try {
      const res = await axios.post(`${BASE}/success-stories/${id}/like`);
      const { is_liked } = res.data;
      setLiked(is_liked);
      setLikesCount((p) => {
        if (is_liked !== !wasLiked) return wasLiked ? p + 1 : p - 1;
        return p;
      });
      localStorage.setItem(likeKey, is_liked ? "1" : "0");
    } catch {
      setLiked(wasLiked);
      setLikesCount((p) => (wasLiked ? p + 1 : p - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentError("");
    setSuccessMsg("");
    if (!userName.trim()) return setCommentError("Please enter your name.");
    if (!commentText.trim()) return setCommentError("Please write a comment.");

    setSubmitting(true);
    try {
      const res = await axios.post(`${BASE}/success-stories/${id}/comment`, {
        user_name: userName.trim(),
        comment: commentText.trim(),
      });
      if (res.data.status) {
        setComments((prev) => [res.data.data, ...prev]);
        setCommentText("");
        setSuccessMsg("Comment posted!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setCommentError(msgs ? Object.values(msgs).flat().join(" ") : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const levels = [
    { id: "1", title: "Level 1", color: "#d97736", items: ["5 Orders", "1 Month", "Rating 4+", "$25+"] },
    { id: "2", title: "Level 2", color: "#94a3b8", items: ["10 Orders", "2 Months", "Rating 4+", "$100+"] },
    { id: "3", title: "Level 3", color: "#fbbf24", items: ["20 Orders", "3 Months", "Rating 4+", "$200+"] },
    { id: "T", title: "Top Rated", color: "#f97316", items: ["100 Orders", "6 Months", "Rating 4+", "$1000+"] },
  ];

  if (loading) return (
    <>
      <style>{FONTS}</style>
      <Box sx={{ minHeight: "100vh", bgcolor: T.mainBg, pt: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Container maxWidth="xl">
          <Skeleton variant="rectangular" height={420} sx={{ borderRadius: '32px', bgcolor: T.cardBg, mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton height={300} sx={{ bgcolor: T.cardBg, borderRadius: '32px' }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton height={300} sx={{ bgcolor: T.cardBg, borderRadius: '32px' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );

  if (!story) return null;

  const readTime = Math.max(1, Math.ceil((story.story_content?.split(" ")?.length || 0) / 200));

  return (
    <>
      <style>{`
        ${FONTS}

        .gt-root * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        .gt-sora  { font-family: 'Sora', sans-serif !important; }

        @keyframes gt-fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hero Container ── */
        .gt-hero-container {
          position: relative;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
          background: ${T.cardBg};
          border: 1px solid ${T.lightBorder};
          min-height: 40vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 50px 40px;
          gap: 40px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
          animation: gt-fadeInUp 0.6s ease both;
        }
        
        .gt-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a192f, #0f172a, #020617);
          z-index: 0;
        }

        .gt-hero-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 80% 20%, rgba(240,89,31,0.15) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 40%);
          z-index: 1;
        }

        .gt-hero-content {
          position: relative;
          z-index: 2;
        }

        .gt-hero-image-frame {
          width: 320px;
          height: 320px;
          border-radius: 32px;
          border: 4px solid rgba(240,89,31,0.4);
          padding: 12px;
          background: rgba(255,255,255,0.02);
          box-shadow: 0 20px 50px rgba(240,89,31,0.2);
          transform: rotate(3deg);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          flex-shrink: 0;
        }
        .gt-hero-image-frame:hover {
          transform: rotate(0deg) translateY(-10px);
          border-color: ${T.primaryOrange};
          box-shadow: 0 30px 60px rgba(240,89,31,0.3);
        }
        .gt-hero-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }

        /* ── Back button ── */
        .gt-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 100px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          color: ${T.pureWhite}; cursor: pointer;
          font-size: 0.85rem; font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          margin-bottom: 24px;
        }
        .gt-back-btn:hover {
          background: ${T.primaryOrange};
          border-color: ${T.primaryOrange};
          transform: translateX(-4px);
        }

        /* ── Badge ── */
        .gt-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 100px;
          background: rgba(240,89,31,0.15);
          border: 1px solid rgba(240,89,31,0.3);
          color: ${T.primaryOrange};
          font-size: 0.7rem; font-weight: 800;
          letter-spacing: 1.5px; text-transform: uppercase;
        }

        /* ── Bento Box Generic ── */
        .gt-bento-card {
          background: ${T.cardBg};
          border: 1px solid ${T.lightBorder};
          border-radius: 32px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          animation: gt-fadeInUp 0.6s ease both;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .gt-bento-card:hover {
          background: ${T.cardBgActive};
          border-color: rgba(240,89,31,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }

        /* ── Metric Box ── */
        .gt-metric-box {
          background: ${T.cardBg};
          border: 1px solid ${T.lightBorder};
          border-radius: 24px;
          padding: 24px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }
        .gt-metric-box:hover {
          border-color: ${T.orangeBorderActive};
          background: rgba(240,89,31,0.05);
          transform: translateY(-4px);
        }

        /* ── Article body ── */
        .gt-article-body {
          font-size: 1.1rem;
          line-height: 2;
          color: ${T.lightGrayHover};
          font-weight: 400;
          word-break: break-word;
        }

        /* ── Like button ── */
        .gt-btn-primary {
          width: 100%; padding: 16px;
          border-radius: 16px; cursor: pointer;
          font-weight: 800; font-size: 0.95rem;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s ease;
          border: 1px solid ${T.primaryOrange};
        }
        .gt-btn-primary.liked { background: ${T.primaryOrange}; color: #fff; }
        .gt-btn-primary.unliked { background: rgba(240,89,31,0.1); color: ${T.primaryOrange}; }
        .gt-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(240,89,31,0.3); }

        /* ── Comment Card ── */
        .gt-comment-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid ${T.lightBorder};
          border-radius: 20px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
        }
        .gt-comment-card:hover { border-color: ${T.mediumBorder}; background: rgba(255,255,255,0.04); }

        /* ── TextField overrides ── */
        .gt-input .MuiOutlinedInput-root {
          color: ${T.pureWhite};
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
        }
        .gt-input .MuiOutlinedInput-root fieldset { border-color: ${T.lightBorder}; }
        .gt-input .MuiOutlinedInput-root:hover fieldset { border-color: ${T.mediumBorder}; }
        .gt-input .MuiOutlinedInput-root.Mui-focused fieldset { border-color: ${T.primaryOrange}; }
        .gt-input input::placeholder, .gt-input textarea::placeholder { color: ${T.darkGrayNumber}; opacity: 1; }

        /* ── Skill chip ── */
        .gt-skill-chip {
          padding: 8px 16px; border-radius: 100px;
          background: ${T.mainBg};
          border: 1px solid ${T.lightBorder};
          color: ${T.lightGrayHover};
          font-size: 0.8rem; font-weight: 600;
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.2s ease;
        }
        .gt-skill-chip:hover {
          border-color: ${T.primaryOrange};
          background: ${T.primaryOrange};
          color: ${T.pureWhite};
          transform: translateY(-2px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .gt-hero-container { padding: 32px 24px; border-radius: 24px; flex-direction: column-reverse; text-align: center; gap: 24px; }
          .gt-hero-image-frame { width: 240px; height: 240px; transform: rotate(0deg); margin: 0 auto; }
          .gt-bento-card { padding: 20px; border-radius: 24px; }
          .gt-metric-box { padding: 16px; border-radius: 16px; }
          .gt-article-body { font-size: 1rem; line-height: 1.8; }
          .gt-hero-content .gt-back-btn { margin-bottom: 32px; }
          .gt-hero-content .gt-sora { font-size: 2rem !important; margin: 0 auto 24px auto !important; }
          .gt-hero-content .MuiStack-root { justify-content: center; }
        }
      `}</style>

      <Box className="gt-root" sx={{ bgcolor: T.mainBg, color: T.pureWhite, minHeight: "100vh", pb: 12, pt: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">

          {/* ─── HERO BENTO BOX ─── */}
          <Box className="gt-hero-container">
            <Box className="gt-hero-bg" />
            <Box className="gt-hero-overlay" />

            {/* Content Side */}
            <Box className="gt-hero-content" sx={{ flex: 1 }}>
              <span className="gt-back-btn" onClick={() => navigate('/success-stories')}>
                <RiArrowLeftLine size={16} /> Back to Wall
              </span>

              <Box sx={{ mb: 2 }}>
                <span className="gt-badge">
                  <RiTrophyFill size={10} /> Top Rated Journey
                </span>
              </Box>

              <Typography className="gt-sora" sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 900, lineHeight: 1.1,
                letterSpacing: '-0.03em', color: T.pureWhite,
                maxWidth: 700, mb: 4,
                wordBreak: 'break-word',
              }}>
                The Journey of <br />
                <span style={{ color: T.primaryOrange, fontSize: '0.8em', display: 'inline-block', marginTop: '10px' }}>{story.user_name}</span>
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px 6px 6px', borderRadius: '100px', border: `1px solid ${T.lightBorder}`, backdropFilter: 'blur(10px)' }}>
                  <Avatar src={story.image_url} sx={{ width: 36, height: 36, border: `2px solid ${T.primaryOrange}` }} />
                  <Typography sx={{ color: T.pureWhite, fontSize: '0.95rem', fontWeight: 700 }}>
                    {story.user_name}
                  </Typography>
                  <RiVerifiedBadgeFill color={T.primaryOrange} size={16} />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '100px', border: `1px solid ${T.lightBorder}`, backdropFilter: 'blur(10px)' }}>
                  <RiTimeLine size={16} color={T.primaryOrange} />
                  <Typography sx={{ color: T.pureWhite, fontSize: '0.9rem', fontWeight: 600 }}>{readTime} min read</Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Image Frame Side */}
            <Box className="gt-hero-content">
              <Box className="gt-hero-image-frame">
                <img 
                  src={story.image_url || "/default-avatar.png"} 
                  alt={story.user_name} 
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Success&background=020617&color=f0591f"; }}
                />
              </Box>
            </Box>
          </Box>

          {/* ─── MAIN GRID ─── */}
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: 1 }}>
            <br></br> <br></br>
            {/* LEFT: Metrics + Article + Comments */}
            <Grid item xs={12} md={8}>
              
              {/* Metrics Grid */}
              <Grid container spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
                {[
                  { label: 'Orders Completed', value: `${story.completed_orders || 0}`, color: T.primaryOrange },
                  { label: 'Rating', value: `${story.rating || '5.0'}`, color: '#fbbf24' },
                  { label: 'Appreciations', value: likesCount, color: T.pureWhite },
                  { label: 'Comments', value: comments.length || 0, color: '#60a5fa' },
                ].map((m, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <Box className="gt-metric-box">
                      {m.label === 'Rating' ? (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                           <RiStarFill color={m.color} size={22} />
                           <Typography className="gt-sora" sx={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>
                             {m.value}
                           </Typography>
                        </Stack>
                      ) : (
                        <Typography className="gt-sora" sx={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>
                          {m.value}
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: T.mediumGrayTitle, textTransform: 'uppercase', letterSpacing: '1px', mt: 1 }}>
                        {m.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Article Content */}
              <Box className="gt-bento-card" sx={{ mb: { xs: 3, md: 4 }, position: 'relative' }}>
                <RiDoubleQuotesL style={{
                  position: 'absolute', top: 32, right: 32,
                  fontSize: '8rem', color: T.primaryOrange, opacity: 0.05,
                  pointerEvents: 'none'
                }} />
                <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.4rem', color: T.pureWhite, mb: 3 }}>
                   Story Background
                </Typography>
                <Box>
                  {story.story_content?.split("\\n").map((para, i) =>
                    para.trim() && (
                      <Typography key={i} className="gt-article-body" sx={{ mb: 3 }}>
                        {para.trim()}
                      </Typography>
                    )
                  )}
                </Box>
              </Box>

              {/* Path/Levels Grid */}
              <Box className="gt-bento-card" sx={{ mb: { xs: 3, md: 4 } }}>
                 <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.4rem', color: T.pureWhite, mb: 3 }}>
                    Growth <span style={{ color: T.primaryOrange }}>Path</span>
                 </Typography>
                 <Grid container spacing={3}>
                    {levels.map((lvl) => (
                      <Grid item xs={12} sm={6} key={lvl.id}>
                         <Box sx={{ p: 3, bgcolor: "rgba(255,255,255,0.02)", border: `1px solid ${T.lightBorder}`, borderRadius: "20px", transition: "all 0.3s ease", "&:hover": { borderColor: lvl.color, transform: "translateY(-4px)" } }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: lvl.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 900, color: "#fff", mb: 2 }}>{lvl.id}</Box>
                            <Typography sx={{ fontWeight: 800, mb: 2, fontSize: '1.1rem' }}>{lvl.title}</Typography>
                            <Stack spacing={1.5}>
                              {lvl.items.map((item, i) => (
                                <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                                  <RiCheckDoubleLine color={lvl.color} size={18} />
                                  <Typography sx={{ color: T.mediumGrayTitle, fontSize: '0.9rem' }}>{item}</Typography>
                                </Stack>
                              ))}
                            </Stack>
                         </Box>
                      </Grid>
                    ))}
                 </Grid>
              </Box>

              {/* Comments Section */}
              <Box className="gt-bento-card" id="discussion" sx={{ animationDelay: '0.2s' }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '14px',
                    background: 'rgba(240,89,31,0.1)',
                    border: `1px solid rgba(240,89,31,0.2)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <RiChat3Line color={T.primaryOrange} size={20} />
                  </Box>
                  <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.4rem', color: T.pureWhite }}>
                    Community Thoughts
                  </Typography>
                  <Chip label={comments.length || 0} sx={{ bgcolor: T.cardBgActive, color: T.pureWhite, fontWeight: 800, border: `1px solid ${T.lightBorder}` }} />
                </Stack>

                {/* Comment Form */}
                <Box component="form" onSubmit={handleComment} sx={{ mb: 5, p: 3, background: 'rgba(0,0,0,0.2)', border: `1px solid ${T.lightBorder}`, borderRadius: '24px' }}>
                  <Typography className="gt-sora" sx={{ color: T.pureWhite, fontWeight: 700, fontSize: '1rem', mb: 3 }}>
                    Share your perspective
                  </Typography>

                  <Stack spacing={2.5}>
                    {commentError && (
                      <Alert severity="error" sx={{ bgcolor: 'rgba(240,89,31,0.07)', color: T.primaryOrange, border: `1px solid ${T.orangeBorderActive}`, borderRadius: '12px', fontSize: '0.85rem' }}>{commentError}</Alert>
                    )}
                    {successMsg && (
                      <Alert severity="success" sx={{ bgcolor: 'rgba(34,197,94,0.06)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', fontSize: '0.85rem' }}>{successMsg}</Alert>
                    )}

                    <TextField className="gt-input" fullWidth placeholder="Your full name" value={userName} onChange={(e) => setUserName(e.target.value)} InputProps={{ startAdornment: <RiUserLine style={{ marginRight: 12, color: T.mediumGrayTitle }} size={18} /> }} />
                    <TextField className="gt-input" fullWidth multiline rows={4} placeholder="What did you think about this journey?" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                    
                    <Stack direction="row" justifyContent="flex-end">
                      <Button type="submit" disabled={submitting} endIcon={<RiSendPlane2Fill />} sx={{
                        background: T.primaryOrange, color: '#fff', borderRadius: '12px', padding: '12px 32px', fontFamily: 'Sora', fontWeight: 800, textTransform: 'none',
                        '&:hover': { background: T.primaryOrange, opacity: 0.9, transform: 'translateY(-2px)' }
                      }}>
                        {submitting ? "Posting…" : "Post Comment"}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                {/* Comments List */}
                <Stack spacing={2.5}>
                  {comments.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography sx={{ color: T.darkGrayNumber, fontSize: '1rem' }}>No comments yet. Be the first to share your thoughts.</Typography>
                    </Box>
                  )}
                  {comments.map((c, i) => (
                    <Fade in key={c.id ?? i}>
                      <Box className="gt-comment-card">
                        <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                          <Avatar sx={{ bgcolor: 'rgba(240,89,31,0.15)', color: T.primaryOrange, fontWeight: 800, width: 40, height: 40, border: `1px solid rgba(240,89,31,0.3)` }}>
                            {c.user_name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography className="gt-sora" sx={{ fontWeight: 700, fontSize: '0.95rem', color: T.pureWhite }}>{c.user_name}</Typography>
                            <Typography sx={{ color: T.darkGrayNumber, fontSize: '0.75rem', fontWeight: 600 }}>{timeAgo(c.created_at)}</Typography>
                          </Box>
                        </Stack>
                        <Typography sx={{ color: T.lightGrayHover, fontSize: '1rem', lineHeight: 1.8, pl: '56px' }}>{c.comment}</Typography>
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* RIGHT: Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 32 }}>
                <Stack spacing={{ xs: 3, md: 4 }}>

                  {/* Author Bento */}
                  <Box className="gt-bento-card" sx={{ animationDelay: '0.1s' }}>
                    <Stack alignItems="center" spacing={3}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar src={story.image_url} sx={{ width: 100, height: 100, borderRadius: '24px', border: `3px solid ${T.orangeBorderActive}` }} />
                        <Box sx={{ position: 'absolute', bottom: -8, right: -8, width: 28, height: 28, borderRadius: '8px', background: T.primaryOrange, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${T.cardBg}` }}>
                          <RiVerifiedBadgeFill color="#fff" size={14} />
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.2rem', color: T.pureWhite, mb: 0.5 }}>{story.user_name}</Typography>
                        <Typography sx={{ color: T.primaryOrange, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                           {story.professional_title || "Top Rated Freelancer"}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ width: '100%', borderColor: T.lightBorder }} />

                      <button className={`gt-btn-primary ${liked ? 'liked' : 'unliked'}`} onClick={handleLike} disabled={likeLoading}>
                        {liked ? <><RiHeartFill size={18} /> Appreciated</> : <><RiHeartLine size={18} /> Appreciate Story</>}
                      </button>
                    </Stack>
                  </Box>

                  {/* Info Cards */}
                  <Box className="gt-bento-card" sx={{ animationDelay: '0.2s', p: 3 }}>
                     <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        <RiGraduationCapFill color="#60a5fa" size={28} />
                        <Box>
                           <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: T.mediumGrayTitle, letterSpacing: '1px' }}>EDUCATION</Typography>
                           <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: T.pureWhite }}>{story.education || "BSc in Field (2022)"}</Typography>
                        </Box>
                     </Stack>
                     <Divider sx={{ borderColor: T.lightBorder, my: 2 }} />
                     <Stack direction="row" spacing={2} alignItems="center">
                        <RiPsychotherapyFill color="#c084fc" size={28} />
                        <Box>
                           <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: T.mediumGrayTitle, letterSpacing: '1px' }}>PERSONALITY</Typography>
                           <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: T.pureWhite }}>{story.personality_type || "INFJ"}</Typography>
                        </Box>
                     </Stack>
                  </Box>

                  {/* CTA Bento */}
                  <Box className="gt-bento-card" sx={{ animationDelay: '0.3s', background: `linear-gradient(145deg, rgba(240,89,31,0.1) 0%, rgba(240,89,31,0.02) 100%)`, borderColor: T.orangeBorderActive }}>
                    <Typography className="gt-sora" sx={{ color: T.pureWhite, fontWeight: 800, fontSize: '1.2rem', mb: 1.5 }}>Join The Ranks</Typography>
                    <Typography sx={{ color: T.lightGrayHover, fontSize: '0.95rem', lineHeight: 1.7, mb: 3 }}>Build your portfolio and become the next top rated success story on GrapeTask.</Typography>
                    <button onClick={() => navigate('/freelancers')} style={{ width: '100%', padding: '16px', borderRadius: '16px', cursor: 'pointer', background: T.primaryOrange, border: 'none', color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(240,89,31,0.4)';}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
                      Start Earning <RiArrowRightUpLine size={18} />
                    </button>
                  </Box>

                </Stack>
              </Box>
            </Grid>
          </Grid>

        </Container>
      </Box>
      <Suspense fallback={<Skeleton height={200} sx={{ bgcolor: T.cardBg }} />}><Footer /></Suspense>
    </>
  );
};

export default StoryDetail;
