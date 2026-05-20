import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// MUI Imports
import { 
  Box, Typography, Button, Skeleton, Stack, 
  Avatar, Container, Grid, Chip
} from "@mui/material";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Icons
import { 
  RiDoubleQuotesL, 
  RiArrowLeftLine, 
  RiArrowRightLine, 
  RiHeartFill,
  RiChat3Fill,
  RiVerifiedBadgeFill,
  RiArrowRightUpLine,
  RiUserLine,
  RiBriefcase4Fill
} from "react-icons/ri";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ClientSuccessSlider = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // GrapeTask Dark Theme Schema Integrated
  const theme = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
    cardBgHover: "rgba(255, 255, 255, 0.06)",
    primaryOrange: "#f0591f",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
    pureWhite: "#ffffff",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    lightBorder: "rgba(255, 255, 255, 0.06)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    gradient: "linear-gradient(135deg, rgba(240, 89, 31, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)"
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("https://portal.grapetask.co/api/client-stories/");
        if (res.data.status) setStories(res.data.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <Box sx={{ background: theme.mainBg, py: 10, position: 'relative', overflow: 'hidden' }}>
      
      {/* 🌌 Atmospheric Subtle Glow */}
      <Box sx={{
        position: 'absolute', top: -150, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '400px',
        background: `radial-gradient(circle, ${theme.secondaryBlueBlur} 0%, transparent 70%)`,
        filter: 'blur(100px)', pointerEvents: 'none'
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header Section */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={8} spacing={3}>
          <Box>
            <Typography sx={{ color: theme.primaryOrange, fontWeight: 800, letterSpacing: '2px', fontSize: '0.7rem', mb: 1, textTransform: 'uppercase' }}>
              Wall of Fame
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 900, color: theme.pureWhite, lineHeight: 1 }}>
              Client <span style={{ color: theme.primaryOrange }}>Success</span>
            </Typography>
          </Box>

          {/* Minimal Navigation Buttons */}
          <Stack direction="row" spacing={2}>
            <motion.div
              ref={prevRef}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: theme.cardBg,
                border: `1px solid ${theme.lightBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = theme.primaryOrange}
              onMouseLeave={(e) => e.target.style.borderColor = theme.lightBorder}
            >
              <RiArrowLeftLine size={20} color={theme.pureWhite} />
            </motion.div>
            <motion.div
              ref={nextRef}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: theme.cardBg,
                border: `1px solid ${theme.lightBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = theme.primaryOrange}
              onMouseLeave={(e) => e.target.style.borderColor = theme.lightBorder}
            >
              <RiArrowRightLine size={20} color={theme.pureWhite} />
            </motion.div>
          </Stack>
        </Stack>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={450} 
                  sx={{ 
                    bgcolor: theme.cardBg, 
                    borderRadius: '20px',
                    border: `1px solid ${theme.lightBorder}`
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            speed={800}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 2.5, spaceBetween: 30 },
              1200: { slidesPerView: 3, spaceBetween: 30 }
            }}
          >
            {stories.map((item, index) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  style={{ height: '100%' }}
                >
                  <Box 
                    className="premium-card"
                    sx={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.lightBorder}`,
                      borderRadius: '20px',
                      p: 3,
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.cardBgHover,
                        borderColor: theme.primaryOrange,
                        boxShadow: theme.shadow
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: theme.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 1
                      }
                    }}
                  >
                    <RiDoubleQuotesL 
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontSize: '2rem',
                        color: theme.primaryOrange,
                        opacity: 0.3
                      }}
                    />
                    
                    <Stack spacing={2.5} sx={{ height: '100%' }}>
                      {/* Client Identity */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          src={item.story_image || "/default-placeholder.png"} 
                          sx={{ 
                            width: 56, height: 56, 
                            borderRadius: '16px', 
                            border: `2px solid ${theme.lightBorder}`, 
                            p: '2px', 
                            bgcolor: 'transparent',
                            transition: 'border-color 0.3s ease',
                            '&:hover': { borderColor: theme.primaryOrange }
                          }} 
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: theme.pureWhite, fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                            {item.professional_title}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.8 }}>
                            <RiVerifiedBadgeFill color={theme.primaryOrange} size={16} />
                            <Typography sx={{ color: theme.bodyGrayText, fontSize: '0.75rem', fontWeight: 600 }}>Verified Client Success</Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Skills Hired */}
                      {item.skills_hired && item.skills_hired.length > 0 && (
                        <Box>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {item.skills_hired.slice(0, 3).map((skill, i) => (
                              <Chip
                                key={i}
                                label={skill}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(240, 89, 31, 0.1)',
                                  color: theme.primaryOrange,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  height: '20px'
                                }}
                              />
                            ))}
                            {item.skills_hired.length > 3 && (
                              <Chip
                                label={`+${item.skills_hired.length - 3}`}
                                size="small"
                                sx={{
                                  bgcolor: theme.cardBgActive,
                                  color: theme.bodyGrayText,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  height: '20px'
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      )}

                      {/* Short & Impactful Text */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ color: theme.pureWhite, fontSize: '1.1rem', fontWeight: 700, mb: 1, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: theme.bodyGrayText, fontSize: '0.85rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.content}
                        </Typography>
                      </Box>

                      {/* Minimal Stats Bar */}
                      <Stack direction="row" spacing={3} sx={{ pt: 2, borderTop: `1px solid ${theme.lightBorder}` }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <RiHeartFill color={theme.primaryOrange} size={16} />
                          <Typography sx={{ color: theme.pureWhite, fontWeight: 600, fontSize: '0.8rem' }}>{item.likes_count || 0}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <RiChat3Fill color="#60a5fa" size={16} />
                          <Typography sx={{ color: theme.pureWhite, fontWeight: 600, fontSize: '0.8rem' }}>{item.comments_count || item.comments?.length || 0}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ ml: 'auto' }}>
                          <Typography sx={{ color: theme.primaryOrange, fontWeight: 800, fontSize: '0.85rem' }}>{item.projects_posted}+</Typography>
                          <Typography sx={{ color: theme.bodyGrayText, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>Done</Typography>
                        </Stack>
                      </Stack>

                      {/* Minimalist Button */}
                      <Button 
                        fullWidth
                        onClick={() => navigate(`/clintstories/${item.id}`)}
                        endIcon={<RiArrowRightUpLine />}
                        sx={{ 
                          py: 1.2, borderRadius: '12px', 
                          bgcolor: 'transparent', 
                          color: theme.pureWhite, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none',
                          border: `1px solid ${theme.lightBorder}`,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: theme.cardBgActive, 
                            borderColor: theme.primaryOrange,
                            color: theme.primaryOrange,
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Read Story
                      </Button>
                    </Stack>
                  </Box>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>

      {/* 🎨 Custom Styled-Components-like CSS */}
      <style>{`
        .nav-trigger {
          width: 44px; height: 44px; border-radius: 10px;
          background: ${theme.cardBg}; border: 1px solid ${theme.lightBorder};
          color: ${theme.mediumGrayTitle}; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-trigger:hover {
          background: ${theme.cardBgActive};
          color: ${theme.primaryOrange};
          border-color: ${theme.orangeBorderActive};
          transform: translateY(-2px);
        }

        .premium-card {
          background: ${theme.cardBg};
          backdrop-filter: blur(8px);
          border: 1px solid ${theme.lightBorder};
          border-radius: 20px;
          padding: 28px;
          height: 420px;
          position: relative;
          transition: all 0.4s ease;
          margin: 10px 0;
        }

        .premium-card:hover {
          background: ${theme.cardBgActive};
          border-color: ${theme.orangeBorderActive};
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }

        .bg-quote {
          position: absolute;
          top: 20px;
          right: 24px;
          font-size: 3rem;
          color: ${theme.primaryOrange};
          opacity: 0.04;
          pointer-events: none;
        }

        .swiper-pagination-bullet {
          background: ${theme.bodyGrayText} !important;
        }
        .swiper-pagination-bullet-active {
          background: ${theme.primaryOrange} !important;
        }
      `}</style>
    </Box>
  );
};

export default ClientSuccessSlider;