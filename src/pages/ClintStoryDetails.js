import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Grid, Typography, Button, Skeleton, Stack,
  Avatar, Divider, Chip, TextField, Alert, Fade, useMediaQuery
} from "@mui/material";
import {
  RiDoubleQuotesL, RiArrowLeftLine, RiVerifiedBadgeFill,
  RiHeartFill, RiHeartLine, RiChat3Line, RiSendPlane2Fill,
  RiTimeLine, RiUserLine, RiStackLine, RiStarFill,
  RiArrowRightUpLine, RiCheckboxCircleFill
} from "react-icons/ri";

const Footer = lazy(() => import("../components/Footer"));

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

const ClintStoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const currentUserId = localStorage.getItem("user_id") || 1;

  const fetchStory = async () => {
    try {
      const res = await fetch(`https://portal.grapetask.co/api/client-stories/${id}?user_id=${currentUserId}`);
      const data = await res.json();
      if (data.status) setStory(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchStory();
  }, [id]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`https://portal.grapetask.co/api/client-stories/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, user_name: userName || "Anonymous" })
      });
      const data = await res.json();
      if (data.status) await fetchStory();
    } catch (err) { console.error(err); }
    finally { setIsLiking(false); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim()) {
      setError("Both Name and Comment are required!");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`https://portal.grapetask.co/api/client-stories/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, user_name: userName, comment: commentText })
      });
      const data = await res.json();
      if (data.status) {
        setCommentText("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchStory();
      } else setError(data.message || "Failed to post comment.");
    } catch (err) { setError("Server error. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  /* ─── Loading State ─── */
  if (loading) return (
    <>
      <style>{FONTS}</style>
      <Box sx={{ minHeight: "100vh", bgcolor: T.mainBg, pt: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Container maxWidth="lg">
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

  const readTime = Math.max(1, Math.ceil((story.content?.split(" ")?.length || 0) / 200));

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
          flex: 1;
        }

        .gt-hero-image-frame {
          width: 380px;
          height: 380px;
          border-radius: 32px;
          border: 4px solid rgba(240,89,31,0.4);
          padding: 12px;
          background: rgba(255,255,255,0.02);
          box-shadow: 0 20px 50px rgba(240,89,31,0.2);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        .gt-hero-image-frame:hover {
          transform: translateY(-10px);
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
          .gt-hero-container { padding: 32px 24px; border-radius: 24px; flex-direction: column-reverse; text-align: center; }
          .gt-hero-image-frame { width: 100%; max-width: 380px; height: auto; aspect-ratio: 1; }
          .gt-bento-card { padding: 20px; border-radius: 24px; }
          .gt-metric-box { padding: 16px; border-radius: 16px; }
          .gt-article-body { font-size: 1rem; line-height: 1.8; }
          .gt-hero-content .gt-back-btn { margin-bottom: 32px; }
          .gt-hero-content .gt-sora { font-size: 2.2rem !important; margin: 0 auto 24px auto !important; }
          .gt-hero-content .MuiStack-root { justify-content: center; }
        }
      `}</style>

      <Box className="gt-root" sx={{ bgcolor: T.mainBg, color: T.pureWhite, minHeight: "100vh", pb: 12, pt: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">

          {/* ─── HERO CONTAINER ─── */}
          <Box className="gt-hero-container" sx={{ mb: 4 }}>
            <Box className="gt-hero-bg" />
            <Box className="gt-hero-overlay" />

            {/* Content Side */}
            <Box className="gt-hero-content">
              <span className="gt-back-btn" onClick={() => navigate(-1)}>
                <RiArrowLeftLine size={16} /> Back to Stories
              </span>

              <Box sx={{ mb: 2 }}>
                <span className="gt-badge">
                  <RiStarFill size={10} /> Success Journey
                </span>
              </Box>

              <Typography className="gt-sora" sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 900, lineHeight: 1.1,
                letterSpacing: '-0.03em', color: T.pureWhite,
                maxWidth: 700, mb: 4,
                wordBreak: 'break-word',
              }}>
                {story.title}
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '100px', border: `1px solid ${T.lightBorder}`, backdropFilter: 'blur(10px)' }}>
                  <RiVerifiedBadgeFill color={T.primaryOrange} size={18} />
                  <Typography sx={{ color: T.pureWhite, fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>
                    {story.professional_title}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '100px', border: `1px solid ${T.lightBorder}`, backdropFilter: 'blur(10px)' }}>
                  <RiTimeLine size={16} color={T.primaryOrange} />
                  <Typography sx={{ color: T.pureWhite, fontSize: '0.9rem', fontWeight: 600 }}>
                    {new Date(story.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Image Frame Side */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box className="gt-hero-image-frame">
                <img 
                  src={story.story_image || "/default-placeholder.png"} 
                  alt={story.title} 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"; }}
                />
              </Box>
            </Box>
          </Box>

          {/* ─── MAIN GRID ─── */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            
            {/* LEFT: Metrics + Article + Comments */}
            <Grid item xs={12} md={8}>
              <br></br><br></br>
              {/* Metrics Grid */}
              <Grid container spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
                {[
                  { label: 'Projects Done', value: story.projects_posted || 0, color: T.primaryOrange },
                  { label: 'Appreciations', value: story.likes_count || 0, color: T.pureWhite },
                  { label: 'Comments', value: story.comments?.length || 0, color: '#60a5fa' },
                  { label: 'Skills Hired', value: story.skills_hired?.length || 0, color: T.mediumGrayTitle },
                ].map((m, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <Box className="gt-metric-box">
                      <Typography className="gt-sora" sx={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>
                        {m.value}
                      </Typography>
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
                
                {story.featured_quote && (
                  <Box sx={{ mb: 4, p: 3, borderRadius: '20px', background: 'rgba(240,89,31,0.05)', borderLeft: `4px solid ${T.primaryOrange}` }}>
                    <Typography className="gt-sora" sx={{ fontSize: '1.2rem', fontStyle: 'italic', color: T.pureWhite, fontWeight: 500, lineHeight: 1.6 }}>
                      "{story.featured_quote.replace(/^["“”]+|["“”]+$/g, '')}"
                    </Typography>
                  </Box>
                )}

                <Typography className="gt-article-body" sx={{ whiteSpace: 'pre-wrap' }}>{story.content}</Typography>
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
                  <Chip label={story.comments?.length || 0} sx={{ bgcolor: T.cardBgActive, color: T.pureWhite, fontWeight: 800, border: `1px solid ${T.lightBorder}` }} />
                </Stack>

                {/* Comment Form */}
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 5, p: 3, background: 'rgba(0,0,0,0.2)', border: `1px solid ${T.lightBorder}`, borderRadius: '24px' }}>
                  <Typography className="gt-sora" sx={{ color: T.pureWhite, fontWeight: 700, fontSize: '1rem', mb: 3 }}>
                    Share your perspective
                  </Typography>

                  <Stack spacing={2.5}>
                    {error && (
                      <Alert severity="error" sx={{ bgcolor: 'rgba(240,89,31,0.07)', color: T.primaryOrange, border: `1px solid ${T.orangeBorderActive}`, borderRadius: '12px', fontSize: '0.85rem' }}>{error}</Alert>
                    )}
                    {success && (
                      <Alert severity="success" sx={{ bgcolor: 'rgba(34,197,94,0.06)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', fontSize: '0.85rem' }}>Comment posted successfully!</Alert>
                    )}

                    <TextField className="gt-input" fullWidth placeholder="Your full name" value={userName} onChange={(e) => setUserName(e.target.value)} InputProps={{ startAdornment: <RiUserLine style={{ marginRight: 12, color: T.mediumGrayTitle }} size={18} /> }} />
                    <TextField className="gt-input" fullWidth multiline rows={4} placeholder="What did you think about this client's journey?" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                    
                    <Stack direction="row" justifyContent="flex-end">
                      <Button type="submit" disabled={isSubmitting} endIcon={<RiSendPlane2Fill />} sx={{
                        background: T.primaryOrange, color: '#fff', borderRadius: '12px', padding: '12px 32px', fontFamily: 'Sora', fontWeight: 800, textTransform: 'none',
                        '&:hover': { background: T.primaryOrange, opacity: 0.9, transform: 'translateY(-2px)' }
                      }}>
                        {isSubmitting ? "Posting…" : "Post Comment"}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                {/* Comments List */}
                <Stack spacing={2.5}>
                  {story.comments?.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography sx={{ color: T.darkGrayNumber, fontSize: '1rem' }}>No comments yet. Be the first to share your thoughts.</Typography>
                    </Box>
                  )}
                  {story.comments?.map((c) => (
                    <Fade in key={c.id}>
                      <Box className="gt-comment-card">
                        <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                          <Avatar sx={{ bgcolor: 'rgba(240,89,31,0.15)', color: T.primaryOrange, fontWeight: 800, width: 40, height: 40, border: `1px solid rgba(240,89,31,0.3)` }}>
                            {c.user_name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography className="gt-sora" sx={{ fontWeight: 700, fontSize: '0.95rem', color: T.pureWhite }}>{c.user_name}</Typography>
                            <Typography sx={{ color: T.darkGrayNumber, fontSize: '0.75rem', fontWeight: 600 }}>{new Date(c.created_at).toDateString()}</Typography>
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

                  {/* Story Action Bento */}
                  <Box className="gt-bento-card" sx={{ animationDelay: '0.1s' }}>
                    <Stack alignItems="center" spacing={3}>
                      <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(240,89,31,0.1)', border: `2px solid ${T.orangeBorderActive}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiHeartFill color={T.primaryOrange} size={28} />
                      </Box>

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.2rem', color: T.pureWhite, mb: 0.5 }}>
                          Show your support
                        </Typography>
                        <Typography sx={{ color: T.mediumGrayTitle, fontSize: '0.85rem', fontWeight: 500 }}>
                          If you found this story inspiring, leave an appreciation below.
                        </Typography>
                      </Box>
                      
                      <button className={`gt-btn-primary ${story.has_liked ? 'liked' : 'unliked'}`} onClick={handleLike} disabled={isLiking}>
                        {story.has_liked ? <><RiHeartFill size={18} /> Appreciated</> : <><RiHeartLine size={18} /> Appreciate Story</>}
                      </button>
                    </Stack>
                  </Box>

                  {/* Skills Bento */}
                  {story.skills_hired?.length > 0 && (
                    <Box className="gt-bento-card" sx={{ animationDelay: '0.2s' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(240,89,31,0.1)', border: `1px solid rgba(240,89,31,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <RiStackLine color={T.primaryOrange} size={18} />
                        </Box>
                        <Typography className="gt-sora" sx={{ fontWeight: 800, fontSize: '1.1rem', color: T.pureWhite }}>Top Skills Hired</Typography>
                      </Stack>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {story.skills_hired.map((skill, i) => (
                          <span key={i} className="gt-skill-chip"><RiCheckboxCircleFill size={12} color={T.primaryOrange} /> {skill}</span>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* CTA Bento */}
                  <Box className="gt-bento-card" sx={{ animationDelay: '0.3s', background: `linear-gradient(145deg, rgba(240,89,31,0.1) 0%, rgba(240,89,31,0.02) 100%)`, borderColor: T.orangeBorderActive }}>
                    <Typography className="gt-sora" sx={{ color: T.pureWhite, fontWeight: 800, fontSize: '1.2rem', mb: 1.5 }}>Start Your Journey</Typography>
                    <Typography sx={{ color: T.lightGrayHover, fontSize: '0.95rem', lineHeight: 1.7, mb: 3 }}>Join thousands of clients finding amazing talent on GrapeTask.</Typography>
                    <button onClick={() => navigate('/')} style={{ width: '100%', padding: '16px', borderRadius: '16px', cursor: 'pointer', background: T.primaryOrange, border: 'none', color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(240,89,31,0.4)';}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
                      Post a Project <RiArrowRightUpLine size={18} />
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

export default ClintStoryDetails;
