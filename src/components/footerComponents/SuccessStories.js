import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Skeleton, 
  Stack, 
  Avatar, 
  Pagination,
  Chip,
  Divider
} from "@mui/material";
import axios from "axios";

// Icons
import { 
  RiDoubleQuotesL, 
  RiStarFill, 
  RiVerifiedBadgeFill, 
  RiBriefcase4Fill,
  RiArrowRightUpLine,
  RiTrophyFill,
  RiCalendarEventFill
} from "react-icons/ri";

import Footer from "../Footer";
import Navbar from "../Navbar";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://portal.grapetask.co/api/success-stories?page=${page}`);
        if (res.data.status === "success") {
          setStories(res.data.data);
          setTotalPages(res.data.pagination.total_pages);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchStories();
  }, [page]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, type: "spring", bounce: 0.4 } 
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ 
        bgcolor: '#030712', // Ultra Deep Dark Theme
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        color: '#ffffff',
        minHeight: '100vh',
        position: 'relative',
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 6, md: 8 }, 
        overflow: 'hidden'
      }}>

        {/* --- PREMIUM ANIMATED BACKGROUND GLOW --- */}
        <Box className="bg-glow bg-glow-primary" sx={{ top: '-10%', left: '-10%' }} />
        <Box className="bg-glow bg-glow-secondary" sx={{ bottom: '10%', right: '-5%' }} />
        <Box className="bg-glow bg-glow-accent" sx={{ top: '40%', left: '40%', width: '20%', height: '20%' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

          {/* --- HERO HEADER SECTION --- */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 }, px: { xs: 2, md: 0 } }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

              {/* ORANGE CHIP / BADGE */}
              <Chip 
                label="GrapeTask Hall of Fame" 
                icon={<RiTrophyFill color="#f0591f" />}
                sx={{ 
                  bgcolor: 'rgba(240, 89, 31, 0.1)', 
                  color: '#f0591f', 
                  fontWeight: 800, 
                  mb: { xs: 1.5, md: 2 }, 
                  border: '1px solid rgba(240, 89, 31, 0.3)',
                  px: { xs: 1.5, md: 2 }, 
                  py: { xs: 2, md: 2.5 }, 
                  fontSize: { xs: '0.8rem', md: '0.9rem' }, 
                  borderRadius: '30px'
                }} 
              />

              {/* MAIN HEADING */}
              <Typography variant="h1" sx={{ 
                fontSize: { xs: '1.9rem', sm: '3.2rem', md: '4.5rem' }, 
                fontWeight: 900, 
                color: '#f0591f',
                lineHeight: { xs: 1.25, md: 1.1 },
                mt: { xs: -1, md: -2 }, 
                mb: { xs: 2, md: 3 },
                letterSpacing: { xs: '-0.5px', md: '-1px' }
              }}>
                Inspiring Journeys,<br /> Extraordinary Results.
              </Typography>

              {/* SUBTITLE */}
              <Typography sx={{ 
                color: '#94a3b8', 
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' }, 
                maxWidth: { xs: '95%', sm: '80%', md: '700px' }, 
                mx: 'auto', 
                lineHeight: 1.6 
              }}>
                Discover the top-rated freelancers who turned their skills into massive success stories on GrapeTask. Read their journey and get inspired today.
              </Typography>

            </motion.div>
          </Box>

          {/* --- MAIN CARDS GRID --- */}
          <motion.div variants={containerVariants} initial="hidden" animate={loading ? "hidden" : "visible"}>
            <Grid container spacing={4}>
              {loading ? (
                Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Skeleton variant="rectangular" height={550} sx={{ bgcolor: '#0f172a', borderRadius: '24px' }} />
                  </Grid>
                ))
              ) : (
                stories.map((story) => (
                  <Grid item xs={12} sm={6} lg={4} key={story.id}>
                    <motion.div variants={cardVariants} whileHover={{ y: -12 }} style={{ height: '100%' }}>
                      <Box className="premium-bento-card">

                        {/* CARD HEADER: Profile & Name */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar 
                              src={story.image_url} 
                              sx={{ width: 64, height: 64, borderRadius: '16px', border: '2px solid rgba(240, 89, 31, 0.5)' }}
                            />
                            <Box className="avatar-glow" />
                          </Box>
                          <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 0.5, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {story.user_name} <RiVerifiedBadgeFill color="#3b82f6" size={20} />
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: '#f0591f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RiBriefcase4Fill /> {story.profession}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* 🌟 NEW: CLEAN SINGLE TEXT LINE FOR TAGS 🌟 */}
                        <Typography sx={{ 
                          fontSize: '0.85rem', 
                          color: '#94a3b8', 
                          mb: 3, 
                          lineHeight: 1.6,
                          fontWeight: 500
                        }}>
                          {story.level && (
                            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{story.level}</span>
                          )}
                          {story.level && (story.personality_type || story.education) && (
                            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>•</span>
                          )}

                          {story.personality_type && (
                            <span style={{ color: '#c084fc' }}>{story.personality_type}</span>
                          )}
                          {story.personality_type && story.education && (
                            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>•</span>
                          )}

                          {story.education && (
                            <span style={{ color: '#60a5fa' }}>{story.education}</span>
                          )}
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

                        {/* CONTENT: Story Snippet */}
                        <Box sx={{ position: 'relative', mb: 4, flexGrow: 1 }}>
                          <RiDoubleQuotesL color="rgba(240, 89, 31, 0.2)" size={40} style={{ position: 'absolute', top: -10, left: -10, zIndex: 0 }} />
                          <Typography sx={{ 
                            fontSize: '1rem', 
                            lineHeight: 1.7, 
                            color: '#cbd5e1', 
                            position: 'relative', zIndex: 1,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {story.story_content || story.portfolio_summary}
                          </Typography>
                        </Box>

                        {/* STATS HIGHLIGHT BOX */}
                        <Box className="stats-box" sx={{ mb: 3 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>Orders</Typography>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>{story.completed_orders || story.total_orders?.split(' ')[0]}</Typography>
                            </Box>
                            <Box sx={{ width: '1px', height: '30px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Box>
                              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>Rating</Typography>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <RiStarFill color="#fbbf24" size={16} /> {story.rating || '5.0'}
                              </Typography>
                            </Box>
                            <Box sx={{ width: '1px', height: '30px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Box>
                              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>Joined</Typography>
                              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <RiCalendarEventFill color="#94a3b8" /> {story.join_date ? new Date(story.join_date).getFullYear() : '2024'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {/* ACTION BUTTON */}
                        <Button 
                          fullWidth 
                          onClick={() => navigate(`/success-stories/${story.id}`)}
                          className="premium-action-btn"
                          endIcon={<RiArrowRightUpLine />}
                        >
                          Read Full Journey
                        </Button>

                      </Box>
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </motion.div>

          {/* --- PAGINATION --- */}
          {!loading && totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(e, v) => setPage(v)} 
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': { color: '#94a3b8', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', m: 0.5, '&:hover': { bgcolor: '#f0591f', color: '#fff', borderColor: '#f0591f' } },
                    '& .Mui-selected': { bgcolor: '#f0591f !important', color: '#fff', border: 'none', boxShadow: '0 8px 20px rgba(240, 89, 31, 0.4)' }
                  }}
                />
              </Box>
            </motion.div>
          )}
        </Container>

        {/* 🚀 CUSTOM GLOBAL CSS 🚀 */}
        <style>
          {`
            /* Background Ambient Glow */
            .bg-glow {
              position: absolute;
              filter: blur(120px);
              border-radius: 50%;
              z-index: 0;
              opacity: 0.6;
              animation: float 10s ease-in-out infinite;
            }
            .bg-glow-primary { width: 45%; height: 45%; background: radial-gradient(circle, rgba(240,89,31,0.15) 0%, transparent 70%); }
            .bg-glow-secondary { width: 35%; height: 35%; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); animation-delay: -5s; }
            .bg-glow-accent { background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%); animation-duration: 15s; }

            @keyframes float {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-30px) scale(1.05); }
            }

            /* Main Premium Card Setup */
            .premium-bento-card {
              background: rgba(15, 23, 42, 0.4);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 28px;
              padding: 32px;
              height: 100%;
              display: flex;
              flex-direction: column;
              position: relative;
              overflow: hidden;
              box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .premium-bento-card::before {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 2px;
              background: linear-gradient(90deg, transparent, rgba(240, 89, 31, 0.5), transparent);
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            .premium-bento-card:hover {
              background: rgba(30, 41, 59, 0.6);
              border-color: rgba(240, 89, 31, 0.3);
              box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(240,89,31,0.1);
            }

            .premium-bento-card:hover::before {
              opacity: 1;
            }

            /* Avatar Glow Effect */
            .avatar-glow {
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              width: 100%; height: 100%;
              border-radius: 16px;
              box-shadow: 0 0 20px rgba(240,89,31,0.4);
              z-index: -1;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .premium-bento-card:hover .avatar-glow { opacity: 1; }

            /* Stats Inner Box */
            .stats-box {
              background: rgba(0, 0, 0, 0.2);
              border: 1px solid rgba(255,255,255,0.03);
              border-radius: 16px;
              padding: 16px 24px;
            }

            /* Action Button */
            .premium-action-btn {
              background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%) !important;
              color: #f8fafc !important;
              border: 1px solid rgba(255,255,255,0.1) !important;
              text-transform: none !important;
              font-weight: 700 !important;
              font-size: 1rem !important;
              border-radius: 14px !important;
              padding: 14px !important;
              transition: all 0.3s ease !important;
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
            }

            .premium-action-btn:hover {
              background: linear-gradient(135deg, #f0591f 0%, #d8450f 100%) !important;
              border-color: #f0591f !important;
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(240,89,31,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
            }
          `}
        </style>
      </Box>

      <Footer />
    </>
  );
};

export default SuccessStories;