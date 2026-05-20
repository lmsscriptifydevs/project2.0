import React, { Suspense, lazy } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Stack, 
  InputBase, 
  IconButton,
  Button,
  Avatar
} from "@mui/material";
import { 
  RiDoubleQuotesL, 
  RiVerifiedBadgeFill, 
  RiTeamFill, 
  RiSendPlane2Fill,
  RiStarFill,
  RiArrowRightUpLine
} from "react-icons/ri";

// 🚀 SLIDER CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// 🚀 IMAGES (Path fixed to ../../)
import p1 from "../../assets/home/profile1.png";
import p2 from "../../assets/home/profile2.png";
import p3 from "../../assets/home/profile3.jpg";

// Lazy-load the Highest component
const Highest = lazy(() => import("../Highest"));

// Testimonials Data
const TESTIMONIALS = [
  {
    id: 1,
    name: "Ali Hassan",
    role: "UI/UX Designer",
    text: "The interface is clean and the projects are high-quality. Payouts are smooth and always on time. Best platform for Pakistani talent.",
    image: p2,

  },
  {
    id: 2,
    name: "Muhammad Ali",
    role: "Full Stack Expert",
    text: "GrapeTask has completely changed the freelance landscape in Pakistan. Secure, fast, and highly professional service every single time.",
    image: p1,
 
  },
  {
    id: 3,
    name: "Fatima Ali",
    role: "Back-End Specialist",
    text: "I've worked on many platforms, but the community and support here is unmatched. Proudly Pakistani and truly global quality!",
    image: p3,
 
  }
];

const CombinedSection = () => {
  // Slider Settings - Premium smooth sliding effect
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)", 
    appendDots: dots => (
      <Box sx={{ bottom: "-40px", display: "flex", justifyContent: { xs: 'center', md: 'flex-end' }, pr: { md: 2 } }}>
        <ul className="gt-custom-dots"> {dots} </ul>
      </Box>
    ),
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Box sx={{ 
        bgcolor: '#020617', /* mainBg */
        pb: 12, pt: 8, 
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        position: 'relative', 
        overflow: 'hidden', 
        color: '#ffffff' /* pureWhite */
      }}>
        {/* Background Subtle Glows */}
        <Box className="gt-bg-aura" />
        <Box className="gt-bg-glow-orb" />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>

          {/* Highest Section (Lazy Loaded) */}
          <Suspense fallback={
            <Box className="gt-loading-skeleton">
               <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <RiDoubleQuotesL size={50} color="rgba(240, 89, 31, 0.2)" />
               </motion.div>
               <Typography sx={{ color: '#71717a', /* bodyGrayText */ fontWeight: 700, letterSpacing: '2px', mt: 2 }}>
                  LOADING ELITE EXPERIENCES...
               </Typography>
            </Box>
          }>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
              <Highest />
            </motion.div>
          </Suspense>

          {/* Premium VIP Divider */}
          <Box className="gt-divider-vip" />

          {/* Integrated Testimonial Section Using MUI Grid */}
          <Grid container spacing={6} alignItems="center">

            {/* Left Content Area */}
            <Grid item xs={12} md={6}>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <span className="gt-badge-vip">TESTIMONIAL</span>

                  <Typography variant="h2" sx={{ 
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' }, 
                    fontWeight: 800, 
                    lineHeight: 1.15, 
                    mb: 3,
                    color: '#ffffff' /* pureWhite */
                  }}>
                    Success speaks <br /> 
                    <Box component="span" sx={{ color: '#f0591f' }}>for itself</Box>
                  </Typography>

                  <Typography sx={{ color: '#71717a', /* bodyGrayText */ fontSize: '1.05rem', lineHeight: 1.7, mb: 2 }}>
                    Join thousands of users that trust our platform for high-quality freelance services. We help businesses connect with qualified experts.
                  </Typography>
                  <Typography sx={{ color: '#71717a', /* bodyGrayText */ fontSize: '1.05rem', lineHeight: 1.7, mb: 5 }}>
                    Whether you require experienced assistance or a creative mind, we have the ideal solution for you.
                  </Typography>

                  {/* Input Box */}
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#a1a1aa', /* mediumGrayTitle */ mb: 1.5 }}>
                    Share your experience with us
                  </Typography>

                  <Box className="gt-premium-input" sx={{ mx: { xs: 'auto', md: 0 } }}>
                    <InputBase 
                      placeholder="Write your assessment..." 
                      sx={{ color: '#ffffff', flex: 1, px: 2, fontSize: '0.95rem' }} 
                    />
                    <IconButton className="gt-send-btn">
                      <RiSendPlane2Fill size={20} color="#ffffff" />
                    </IconButton>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Slider & FLAT Card Area */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ pb: 4 }}>
                  <Slider {...sliderSettings}>
                    {TESTIMONIALS.map((item) => (
                      <Box key={item.id} sx={{ p: { xs: 0, sm: 1 } }}>

                        {/* 🌟 VIP FLAT CARD DESIGN (No Shadow, Pure Glass) 🌟 */}
                        <Box sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.02)', /* cardBg */
                          border: '1px solid rgba(255, 255, 255, 0.06)', /* lightBorder */
                          borderRadius: '20px',
                          p: { xs: 3, sm: 4 },
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            bgcolor: 'rgba(255, 255, 255, 0.04)', /* cardBgActive */
                            borderColor: 'rgba(240, 89, 31, 0.4)', /* orangeBorderActive */
                          }
                        }}>

                          {/* Top Quote Icon */}
                          <Box sx={{ mb: 3 }}>
                            <RiDoubleQuotesL color="#f0591f" size={32} opacity={0.3} />
                          </Box>

                          {/* 1. Profile Layout */}
                          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <Box sx={{
                              width: 55, height: 55, borderRadius: '14px',
                              background: 'linear-gradient(135deg, #f1c40f 0%, #e67e22 100%)',
                        p: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <Avatar 
                                src={item.image} 
                                alt={item.name}
                                variant="rounded"
                                sx={{ width: '100%', height: '100%', borderRadius: '12px', bgcolor: '#020617' /* mainBg */ }}
                              />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                {item.name} <RiVerifiedBadgeFill color="#2ed573" size={18} />
                              </Typography>
                              <Typography sx={{ fontSize: '0.8rem', color: '#a1a1aa', /* mediumGrayTitle */ fontWeight: 600, mt: 0.2 }}>
                                {item.role}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* 2. Text Area (Clean & Normal Font) */}
                          <Typography sx={{ 
                            fontSize: '0.95rem', 
                            lineHeight: 1.7, 
                            color: '#71717a', /* bodyGrayText */
                            fontFamily: "'Inter', sans-serif",
                            mb: 4,
                            display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            "{item.text}"
                          </Typography>

                          {/* Divider Line */}
                          <Box sx={{ height: '1px', bgcolor: 'rgba(255, 255, 255, 0.06)', /* lightBorder */ mb: 3 }} />


                        </Box>
                      </Box>
                    ))}
                  </Slider>
                </Box>
              </motion.div>
            </Grid>

          </Grid>

        </Container>

        {/* 🚀 CSS FOR EFFECTS & DOTS 🚀 */}
        <style>
          {`
            /* Background Effects */
            .gt-bg-aura {
              position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
              width: 100%; height: 50%;
              background: radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.05) 0%, transparent 70%); /* secondaryBlueBlur */
              pointer-events: none;
            }
            .gt-bg-glow-orb {
              position: absolute; top: 20%; right: -5%; width: 500px; height: 500px;
              background: radial-gradient(circle, rgba(240, 89, 31, 0.05) 0%, transparent 60%);
              filter: blur(60px); pointer-events: none;
            }

            /* Badges & Lines */
            .gt-loading-skeleton { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.02); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.06); margin: 40px 0; }
            .gt-divider-vip { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(240, 89, 31, 0.15), transparent); margin: 60px 0; }
            .gt-badge-vip { display: inline-block; background: rgba(240, 89, 31, 0.05); border: 1px solid rgba(240, 89, 31, 0.3); color: #f0591f; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; }

            /* Input Field */
            .gt-premium-input { display: flex; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 6px; max-width: 420px; transition: 0.3s; }
            .gt-premium-input:focus-within { border-color: rgba(240, 89, 31, 0.4); background: rgba(255, 255, 255, 0.04); }
            .gt-send-btn { background: #f0591f !important; width: 45px; height: 45px; border-radius: 10px !important; transition: 0.3s !important; }
            .gt-send-btn:hover { background: #d04b17 !important; transform: scale(1.05); }

            /* 🌟 SLIDER DOTS (Pill Shape) 🌟 */
            .gt-custom-dots { display: flex !important; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; }
            .gt-custom-dots li { margin: 0; width: auto; height: auto; }
            .gt-custom-dots li button { border: none; background: #52525b; opacity: 0.5; width: 8px; height: 8px; border-radius: 50%; color: transparent; cursor: pointer; transition: all 0.4s ease; padding: 0; }
            .gt-custom-dots li.slick-active button { background: #f0591f; opacity: 1; width: 26px; border-radius: 10px; } 
          `}
        </style>
      </Box>
    </>
  );
};

export default CombinedSection;