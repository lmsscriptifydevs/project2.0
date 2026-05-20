// BuyerDashboard.jsx - Professionally Updated with GrapeTask Dark Theme Schema

import { Button, CircularProgress, Skeleton } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FaArrowUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

// Assets
import arrow from "../assets/chartArrow.webp";
import user from "../assets/gigsRatingComments.webp";
import imagarrow1 from "../assets/imgarrow.webp";
import imagarrow2 from "../assets/imgarrow1.webp";
import imagarrow from "../assets/imgarrow2.webp";
import timepes from "../assets/time (1).webp";

// Components
import Dashboardright from "../components/Dashboardright";
import Navbar from "../components/Navbar";

// Redux
import {
  fetchUserActivities,
  fetchUserStats,
} from "../redux/slices/dashboardSlice";
import { useDispatch, useSelector } from "../redux/store/store";

// ------------------ GrapeTask Dark Theme Schema ------------------
const theme = {
  themeName: "GrapeTask Dark Theme",
  colors: {
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
  },
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

// ------------------ Sub-Components ------------------

const CustomTooltip = React.memo(({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const uvValue = payload[0].value;
  return (
    <div
      className="custom-tooltip rounded-3 p-1 px-2 border-0 shadow-lg"
      style={{ backgroundColor: theme.text.pureBlack }}
    >
      <p
        className="label mb-0 poppins font-12 fw-semibold"
        style={{ color: theme.text.pureWhite }}
      >
        <img src={arrow} className="me-2" width={18} height={9} alt="Arrow" />$
        {uvValue}
      </p>
    </div>
  );
});

const CustomTick = React.memo(({ x, y, payload }) => (
  <text
    x={x}
    y={y + 10}
    fontSize="12"
    className="poppins"
    textAnchor="middle"
    fill={theme.text.mediumGrayTitle}
  >
    {payload.value}
  </text>
));

const StarRating = React.memo(({ rating = 0, size = 16 }) => (
  <div className="d-flex">
    {[...Array(5)].map((_, index) => (
      <AiFillStar
        key={index}
        size={size}
        color={
          index < Math.floor(rating)
            ? theme.accents.primaryOrange
            : theme.text.darkGrayNumber
        }
      />
    ))}
  </div>
));

const StatsCard = React.memo(
  ({ image, title, value = 0, change, period, isLoading, isSpent = false }) => (
    <div className="col-lg-4 col-md-4 col-sm-12 px-2 mt-2">
      <div
        className="d-flex align-items-center p-3 rounded-3 h-100"
        style={{
          backgroundColor: theme.backgrounds.cardBg,
          border: `1px solid ${theme.borders.lightBorder}`,
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width={60}
            height={60}
            sx={{ bgcolor: theme.backgrounds.cardBgActive }}
          />
        ) : (
          <>
            <img
              src={image}
              width={65}
              height={65}
              alt={title}
              onError={(e) => {
                e.target.src = user;
              }}
            />
            <div className="ms-3">
              <p
                className="font-14 poppins mb-0"
                style={{ color: theme.text.bodyGrayText }}
              >
                {title}
              </p>
              <h3
                className="font-24 fw-semibold poppins mb-0"
                style={{ color: theme.text.pureWhite }}
              >
                {isSpent ? `$${Number(value).toLocaleString()}` : value}
              </h3>
              {change && (
                <p className="font-11 poppins mb-0 mt-1">
                  <span style={{ color: theme.accents.primaryOrange }}>
                    <FaArrowUp size={10} /> {change}
                  </span>{" "}
                  <span style={{ color: theme.text.mediumGrayTitle }}>
                    {period}
                  </span>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  ),
);

const ProgressBar = React.memo(({ stars, percentage = 0 }) => (
  <div className="row align-items-center mt-3">
    <div className="col-2">
      <p
        className="mb-0 font-13 poppins"
        style={{ color: theme.text.bodyGrayText }}
      >
        {stars}★
      </p>
    </div>
    <div className="col-10">
      <div
        className="progress w-100"
        style={{
          height: "6px",
          backgroundColor: theme.backgrounds.cardBgActive,
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: theme.accents.primaryOrange,
          }}
        />
      </div>
    </div>
  </div>
));

const ReviewItem = React.memo(({ review }) => (
  <div
    className="mt-4 p-3 rounded-3"
    style={{ borderBottom: `1px solid ${theme.borders.lightBorder}` }}
  >
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <img
          className="rounded-circle"
          src={review.freelancer?.image || user}
          width={45}
          height={45}
          alt="User"
        />
        <div className="ms-2">
          <p
            className="font-15 fw-medium mb-0"
            style={{ color: theme.text.pureWhite }}
          >
            {review.freelancer?.name}
          </p>
          <p
            className="font-12 mb-0"
            style={{ color: theme.text.bodyGrayText }}
          >
            Project: {review.project?.title}
          </p>
        </div>
      </div>
      <StarRating rating={review.rating} />
    </div>
    <p
      className="mt-3 font-14 poppins"
      style={{ color: theme.text.lightGrayHover }}
    >
      {review.comment || "No comment provided"}
    </p>
    <div className="d-flex justify-content-end align-items-center opacity-75">
      <img src={timepes} width={16} height={16} alt="clock" />
      <p
        className="font-12 ms-2 mb-0"
        style={{ color: theme.text.bodyGrayText }}
      >
        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
      </p>
    </div>
  </div>
));

// ------------------ Main Dashboard ------------------

const BuyerDashboard = () => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [isDataFetching, setIsDataFetching] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userStats } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsDataFetching(true);
      await Promise.allSettled([
        dispatch(fetchUserStats()),
        dispatch(fetchUserActivities(timePeriod)),
      ]);
      setIsDataFetching(false);
    };
    loadDashboard();
  }, [dispatch, timePeriod]);

  const safeStats = useMemo(
    () => ({
      totalSpent: Number(userStats?.totalSpent) || 0,
      monthlySpent: Number(userStats?.monthlySpent) || 0,
      activeProjects: Number(userStats?.activeProjects) || 0,
      completedProjects: Number(userStats?.completedProjects) || 0,
      avgRating: Number(userStats?.averageRating) || 0,
      reviewsGiven: Number(userStats?.reviewsGiven) || 0,
      reviews: Array.isArray(userStats?.buyerReviews)
        ? userStats.buyerReviews
        : [],
    }),
    [userStats],
  );

  const chartData = useMemo(() => {
    if (!userStats?.spending?.length) return [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return userStats.spending.map((s) => ({
      name: months[s.month - 1],
      uv: Number(s.total_spent) || 0,
    }));
  }, [userStats]);

  return (
    <div
      style={{ backgroundColor: theme.backgrounds.mainBg, minHeight: "100vh" }}
    >
      <Navbar FirstNav="none" />
      <div className="container-fluid pt-5">
        <div className="row mx-lg-4">
          <div className="col-lg-4 col-12 mb-4">
            <Dashboardright />
          </div>

          <div className="col-lg-8 col-12">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3
                className="poppins fw-semibold mb-0"
                style={{ color: theme.text.pureWhite }}
              >
                My Projects & Spending
              </h3>
              <div className="text-end">
                <Button
                  onClick={() => navigate("/buyerRequest")}
                  className="poppins px-4 py-2"
                  style={{
                    backgroundColor: theme.accents.primaryOrange,
                    color: theme.text.pureWhite,
                    textTransform: "none",
                    borderRadius: "8px",
                  }}
                >
                  Post New Project
                </Button>
                <br />
                <Link
                  to="/paymentMethods"
                  className="font-12 mt-2 d-inline-block text-decoration-none"
                  style={{ color: theme.text.mediumGrayTitle }}
                >
                  Manage Payment Methods
                </Link>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="row g-3">
              <StatsCard
                image={imagarrow}
                title="Total Spent"
                value={safeStats.totalSpent}
                isSpent
                isLoading={isDataFetching}
                change={
                  safeStats.totalSpent > 0
                    ? `${((safeStats.monthlySpent / safeStats.totalSpent) * 100).toFixed(1)}%`
                    : null
                }
                period="this month"
              />
              <StatsCard
                image={imagarrow1}
                title="Active Tasks"
                value={safeStats.activeProjects}
                isLoading={isDataFetching}
              />
              <StatsCard
                image={imagarrow2}
                title="Completed"
                value={safeStats.completedProjects}
                isLoading={isDataFetching}
              />
            </div>

            {/* Spending Chart Container */}
            <div
              className="mt-4 p-4 rounded-4"
              style={{
                backgroundColor: theme.backgrounds.cardBg,
                border: `1px solid ${theme.borders.lightBorder}`,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5
                    className="fw-medium mb-1"
                    style={{ color: theme.text.pureWhite }}
                  >
                    Financial Overview
                  </h5>
                  <p
                    className="font-12 mb-0"
                    style={{ color: theme.text.bodyGrayText }}
                  >
                    Track your investments over time
                  </p>
                </div>
                <select
                  className="form-select border-0 font-12"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  style={{
                    width: "130px",
                    backgroundColor: theme.backgrounds.cardBgActive,
                    color: theme.text.pureWhite,
                    borderRadius: "6px",
                  }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div style={{ width: "100%", height: "280px" }}>
                {isDataFetching ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <CircularProgress
                      style={{ color: theme.accents.primaryOrange }}
                    />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: theme.backgrounds.cardBgActive }}
                      />
                      <XAxis
                        dataKey="name"
                        tick={<CustomTick />}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar
                        dataKey="uv"
                        radius={[6, 6, 0, 0]}
                        onMouseEnter={(_, index) => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(-1)}
                      >
                        {chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              hoverIndex === index
                                ? theme.accents.primaryOrange
                                : "rgba(255, 255, 255, 0.08)"
                            }
                            style={{ transition: "fill 0.3s ease" }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Ratings & Reviews Section */}
            <div
              className="mt-4 p-4 rounded-4"
              style={{
                backgroundColor: theme.backgrounds.cardBg,
                border: `1px solid ${theme.borders.lightBorder}`,
              }}
            >
              <h5
                className="fw-medium mb-4"
                style={{ color: theme.text.pureWhite }}
              >
                Experience History
              </h5>
              <div className="row align-items-center">
                <div
                  className="col-lg-4 text-center border-end"
                  style={{ borderColor: theme.borders.lightBorder }}
                >
                  <h2
                    className="display-5 fw-bold mb-0"
                    style={{ color: theme.text.pureWhite }}
                  >
                    {safeStats.avgRating.toFixed(1)}
                  </h2>
                  <div className="d-flex justify-content-center my-2">
                    <StarRating rating={safeStats.avgRating} size={20} />
                  </div>
                  <p
                    className="font-13 mb-0"
                    style={{ color: theme.text.bodyGrayText }}
                  >
                    Total {safeStats.reviewsGiven} Reviews Given
                  </p>
                </div>
                <div className="col-lg-8 px-lg-5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <ProgressBar
                      key={star}
                      stars={star}
                      percentage={userStats?.ratingDistribution?.[star] || 0}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                {safeStats.reviews.length > 0 ? (
                  safeStats.reviews.map((rev, idx) => (
                    <ReviewItem key={idx} review={rev} />
                  ))
                ) : (
                  <div className="text-center py-5 opacity-50">
                    <p style={{ color: theme.text.bodyGrayText }}>
                      No review data available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
