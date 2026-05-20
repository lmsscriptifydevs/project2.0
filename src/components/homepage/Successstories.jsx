import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Button, Skeleton, Stack, Avatar } from "@mui/material";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Icons
import { 
  RiDoubleQuotesL, 
  RiArrowLeftSLine, 
  RiArrowRightSLine, 
  RiCompass3Fill, 
  RiArrowRightUpLine,
  RiStarFill,
  RiVerifiedBadgeFill
} from "react-icons/ri";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SuccessStoriesSlider = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Custom Navigation Refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("https://portal.grapetask.co/api/success-stories/");
        if (res.data.status === "success") {
          setStories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />

      <Box sx={{ 
        background: '#020617', /* mainBg */
        py: { xs: 8, md: 10 }, 
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        color: '#ffffff', /* pureWhite */
        position: 'relative', 
        overflow: 'hidden' 
      }}>

        {/* 🟠 Primary Orange Glow */}
        <Box sx={{
          position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(240, 89, 31, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)'
        }} />

        {/* 🌌 Secondary Blue Blur Glow */}
        <Box sx={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)'
        }} />

        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 3, md: 5 }, position: 'relative', zIndex: 2 }}>

          {/* 🚀 Header Area */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={3} mb={5}>
            <Box>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Typography sx={{ color: '#f0591f', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, mb: 1 }}>
                  Community Success
                </Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, lineHeight: 1.1, color: '#ffffff' }}>
                  Inspiring <Box component="span" sx={{ color: '#f0591f' }}>Success Stories</Box>
                </Typography>
              </motion.div>
            </Box>

            {/* Custom Slider Navigation */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Stack direction="row" spacing={1.5} sx={{ alignSelf: 'flex-end' }}>
                <Box ref={prevRef} className="gt-nav-btn"><RiArrowLeftSLine size={20} /></Box>
                <Box ref={nextRef} className="gt-nav-btn"><RiArrowRightSLine size={20} /></Box>
              </Stack>
            </motion.div>
          </Stack>

          {/* 🚀 Slider Area */}
          {loading ? (
            <Stack direction="row" spacing={3} sx={{ overflow: 'hidden' }}>
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} variant="rectangular" width="33%" height={400} sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }} />
              ))}
            </Stack>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Box className="gt-swiper-container">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  loop={stories.length > 3} 
                  navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                  onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                    1100: { slidesPerView: 3 }
                  }}
                  className="gt-success-swiper"
                >
                  {stories.map((story) => (
                    <SwiperSlide key={story.id} style={{ height: 'auto' }}>
                      <Box className="gt-premium-card">

                        {/* Top Left Quote Icon */}
                        <Box sx={{ mb: 1.5 }}>
                           <RiDoubleQuotesL color="#f0591f" size={28} opacity={0.3} />
                        </Box>

                        {/* 1. Profile Section */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{
                            width: 50, height: 50, borderRadius: '12px', 
                            background: '#f0591f', padding: '2px', flexShrink: 0 
                          }}>
                            <Avatar 
                              src={story.image_url} 
                              alt={story.user_name} 
                              sx={{ width: '100%', height: '100%', borderRadius: '10px', bgcolor: '#020617' }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {story.user_name} <RiVerifiedBadgeFill color="#2ed573" size={16} style={{ flexShrink: 0 }} />
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', /* mediumGrayTitle */ fontWeight: 600, mt: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {story.profession || "Professional Freelancer"}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* 2. Story Content */}
                        <Typography sx={{ 
                          mt: 2.5, mb: 3, flexGrow: 1, 
                          color: '#71717a', /* bodyGrayText */ fontSize: '0.875rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif",
                          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          "{story.portfolio_summary || story.story_content || "Exceeding expectations and delivering high-quality work consistently on GrapeTask."}"
                        </Typography>

                        {/* Divider */}
                        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mb: 2.5 }} />

                        {/* 3. Footer: Stats & Button */}
                        <Box>
                          {/* Stats Row */}
                          <Stack direction="row" spacing={2.5} mb={2.5}>
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: '#52525b', /* darkGrayNumber */ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>Rating</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <RiStarFill color="#f1c40f" size={14} /> {story.rating || '5.0'}
                              </Typography>
                            </Box>

                            {/* Vertical Divider */}
                            <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.06)', height: 'auto', alignSelf: 'stretch' }} /> 

                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: '#52525b', /* darkGrayNumber */ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>Orders</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
                                {story.completed_orders || '100+'}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Sleek Action Button */}
                          <Button 
                            fullWidth
                            onClick={() => navigate(`/success-stories/${story.id}`)}
                            endIcon={<RiArrowRightUpLine size={16} />}
                            className="gt-read-btn"
                          >
                            Read Full Story
                          </Button>

                        </Box>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </motion.div>
          )}

          {/* 🚀 Main Bottom Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
            <Box textAlign="center" mt={6}>
              <Button 
                className="gt-btn-main"
                onClick={() => navigate("/success-stories")}
                startIcon={<RiCompass3Fill size={20} />}
              >
                Explore More Stories
              </Button>
            </Box>
          </motion.div>

        </Box>

        {/* 🚀 CUSTOM GLOBAL CSS 🚀 */}
        <style>
          {`
            /* Navigation Top Arrows */
            .gt-nav-btn {
              width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); /* lightBorder */
              background: rgba(255,255,255,0.02); /* cardBg */ color: #fff; display: flex; align-items: center; justify-content: center;
              cursor: pointer; transition: all 0.3s ease;
            }
            .gt-nav-btn:hover { background: #f0591f; border-color: #f0591f; transform: translateY(-2px); }

            /* Swiper Dots / Pagination */
            .gt-swiper-container .swiper { padding-bottom: 60px !important; }
            .gt-swiper-container .swiper-pagination-bullet {
              background: #52525b; /* darkGrayNumber */ opacity: 1; width: 6px; height: 6px; transition: all 0.4s ease;
            }
            .gt-swiper-container .swiper-pagination-bullet-active {
              background: #f0591f !important; opacity: 1; width: 24px; border-radius: 10px; 
            }

            /* 🌟 VIP CARD DESIGN (COMPACT & CLEAN) 🌟 */
            .gt-premium-card {
              background: rgba(255, 255, 255, 0.02); /* cardBg */ 
              border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
              border-radius: 16px; 
              padding: 24px; 
              height: 100%;
              display: flex; 
              flex-direction: column;
              transition: all 0.4s ease;
            }
            .gt-premium-card:hover { 
              background: rgba(255, 255, 255, 0.04); /* cardBgActive */
              border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */ 
              transform: translateY(-4px); 
              box-shadow: 0 15px 35px rgba(0,0,0,0.25);
            }

            /* Read Story Full-Width Button */
            .gt-read-btn {
              background: rgba(240, 89, 31, 0.06) !important;
              color: #f0591f !important;
              font-size: 0.85rem !important; 
              font-weight: 700 !important;
              text-transform: none !important;
              padding: 10px 16px !important; 
              border-radius: 10px !important;
              transition: all 0.3s ease !important;
            }
            .gt-read-btn:hover {
              background: rgba(240, 89, 31, 0.15) !important;
              color: #f0591f !important;
            }

            /* Main Discover Button */
            .gt-btn-main {
              background: #ffffff !important; color: #020617 !important; /* pureWhite & mainBg */
              padding: 14px 35px !important; border-radius: 10px !important;
              font-size: 0.95rem !important; font-weight: 800 !important; text-transform: none !important;
              box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important; transition: 0.4s !important;
            }
            .gt-btn-main:hover { 
              background: #f0591f !important; color: #fff !important;
              transform: translateY(-3px); box-shadow: 0 12px 25px rgba(240, 89, 31, 0.3) !important; 
            }

            @media (max-width: 768px) { 
              .gt-premium-card { padding: 20px; } 
            }
          `}
        </style>
      </Box>
    </>
  );
};

export default SuccessStoriesSlider;