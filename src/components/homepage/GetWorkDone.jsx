import React, { Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  alpha,
  Stack,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

// Assets
import line from "../../assets/line.webp";
import post from "../../assets/post.webp";
import hire from "../../assets/hire.webp";
import get from "../../assets/getwork.webp";
import make from "../../assets/make.webp";

const STEPS_DATA = [
  {
    id: "01",
    img: post,
    title: "Post a Job & Hire",
    desc: "GrapeTask connects you with top freelancers. Post your job and hire the best in minutes.",
  },
  {
    id: "02",
    img: hire,
    title: "Find Experts",
    desc: "Connect with skilled freelancers across various industries who deliver quality work.",
  },
  {
    id: "03",
    img: get,
    title: "Accomplish Tasks",
    desc: "Browse skilled freelancers, place an order, and get your work delivered on time.",
  },
  {
    id: "04",
    img: make,
    title: "Secure Payment",
    desc: "Pay confidently with our secure payment system and enjoy risk-free transactions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

// Updated card style with NEW color schema
const cardStyle = {
  position: "relative",
  p: { xs: 4, md: 4.5 },
  height: "100%",
  borderRadius: "24px",
  backgroundColor: "rgba(255, 255, 255, 0.02)", // cardBg
  border: `1px solid rgba(255, 255, 255, 0.06)`, // lightBorder
  transition: "all 0.4s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  overflow: "visible",

  "&:hover": {
    transform: "translateY(-10px)",
    backgroundColor: "rgba(255, 255, 255, 0.04)", // cardBgActive
    borderColor: "rgba(240, 89, 31, 0.4)", // orangeBorderActive
    boxShadow: `0 20px 40px ${alpha("#000000", 0.3)}, 0 0 20px ${alpha("#f0591f", 0.15)}`,
    "& .step-badge": {
      backgroundColor: "#f0591f", // primaryOrange
      color: "#ffffff", // pureWhite
      borderColor: "#f0591f",
      transform: "scale(1.1)",
    },
    "& .icon-box": {
      transform: "scale(1.05)",
      borderColor: "rgba(240, 89, 31, 0.4)", // orangeBorderActive
    },
  },
};

const GetWorkDone = () => {
  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "#020617", // mainBg
        position: "relative",
        py: { xs: 10, md: 12 },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: `radial-gradient(circle, ${alpha("#f0591f", 0.06)} 0%, transparent 70%)`,
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Stack alignItems="center" spacing={2} mb={8} textAlign="center">
          <Typography
            variant="h2"
            sx={{
              color: "#ffffff", // pureWhite
              fontWeight: 800,
              fontFamily: "cocon, 'Poppins', sans-serif",
              lineHeight: 1.35,
              maxWidth: "900px",
              mx: "auto",
              fontSize: { xs: "1.6rem", sm: "2.4rem", md: "3.2rem" },
            }}
          >
            <Box component="span" sx={{ color: "#f0591f" }}>GrapeTask{" "}</Box>
            Pakistan's{" "}
            <Box component="span" sx={{ color: "#f0591f" }}>No. 1</Box>
            <br />
            Freelance{" "}
            <Box component="span" sx={{ color: "#f0591f" }}>Marketplace</Box>
          </Typography>

          <Box
            component="img"
            src={line}
            alt="line divider"
            sx={{
              width: "120px",
              mt: 2,
              filter: "drop-shadow(0 5px 15px rgba(240, 89, 31, 0.4))",
            }}
          />
        </Stack>

        <Suspense
          fallback={
            <Typography color="#ffffff" textAlign="center">
              Loading...
            </Typography>
          }
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            <Grid container spacing={3} justifyContent="center">
              {STEPS_DATA.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={step.id}>
                  <motion.div variants={cardVariant} style={{ height: "100%" }}>
                    <Paper elevation={0} sx={cardStyle}>
                      <Box
                        className="step-badge"
                        sx={{
                          position: "absolute",
                          top: 24,
                          right: 24,
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#f0591f", // primaryOrange
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          border: `1px solid ${alpha("#f0591f", 0.3)}`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {step.id}
                      </Box>

                      <Box
                        className="icon-box"
                        sx={{
                          width: "75px",
                          height: "75px",
                          borderRadius: "20px",
                          background: `linear-gradient(135deg, ${alpha("#f0591f", 0.15)} 0%, ${alpha("#f0591f", 0.02)} 100%)`,
                          border: `1px solid rgba(240, 89, 31, 0.1)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 4,
                          transition: "all 0.3s ease",
                          boxShadow: `inset 0 0 15px rgba(255, 255, 255, 0.05)`,
                        }}
                      >
                        <Box
                          component="img"
                          src={step.img}
                          alt={step.title}
                          sx={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                            filter: "drop-shadow(0px 5px 10px rgba(240, 89, 31, 0.4))",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h3"
                        sx={{
                          color: "#ffffff", // pureWhite
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          mb: 1.5,
                          fontFamily: "cocon, 'Poppins', sans-serif",
                        }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#71717a", // bodyGrayText (Updated from #94a3b8)
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {step.desc}
                      </Typography>

                      {index < 3 && (
                        <Box
                          sx={{
                            display: { xs: "none", md: "block" },
                            position: "absolute",
                            top: "60px",
                            right: "-20px",
                            width: "40px",
                            height: "2px",
                            background: `linear-gradient(90deg, rgba(240, 89, 31, 0.5), transparent)`, // primaryOrange
                            zIndex: -1,
                          }}
                        />
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Suspense>
      </Container>
    </Box>
  );
};

export default GetWorkDone;