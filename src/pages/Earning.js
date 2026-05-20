import { Button, CircularProgress, Skeleton } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";
import arrow from "../assets/chartArrow.webp";
import imagarrow1 from "../assets/imgarrow.webp";
import imagarrow2 from "../assets/imgarrow1.webp";
import imagarrow from "../assets/imgarrow2.webp";
import timepes from "../assets/time (1).webp";
import Dashboardright from "../components/Dashboardright";
import Navbar from "../components/Navbar";
import { fetchUserStats } from "../redux/slices/dashboardSlice";
import { sellerRating } from "../redux/slices/ratingSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import axios from "../utils/axios";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const uvValue = payload[0].value;
    return (
      <div className="custom-tooltip rounded-3 p-1 px-2 border-0 shadow-lg" style={{ backgroundColor: "#f0591f" }}>
        <p className="label mb-0 text-white poppins font-12 fw-bold">
          ${`${uvValue}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomTick = (props) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y + 10}
      fontSize="12"
      className="poppins fw-medium"
      textAnchor="middle"
      fill="#71717a" // bodyGrayText
    >
      {payload.value}
    </text>
  );
};

const Earning = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hoverIndex, setHoverIndex] = useState(-1);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  const [summaryData, setSummaryData] = useState({
    referral_earning: 0,
    balance: 0,
    gross_earnings: 0,
    net_earnings: 0,
    total_sales: 0
  });
  const [chartData, setChartData] = useState([]);

  const { userRating, allRating } = useSelector((state) => state.rating);
  const { userDetail } = useSelector((state) => state.profile);

  const userId = userDetail?.id;

  useEffect(() => {
    if (userId) {
      const fetchRating = () => {
        dispatch(sellerRating(userId));
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(fetchRating, { timeout: 500 });
      } else {
        setTimeout(fetchRating, 0);
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchStats = () => {
      dispatch(fetchUserStats()).catch(() => {});
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchStats, { timeout: 500 });
    } else {
      setTimeout(fetchStats, 0);
    }
  }, [dispatch]);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    const fetchSummary = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get("/earnings/summary", {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: ac.signal,
        });
        if (!cancelled) {
          setSummaryData({
            referral_earning: res.data.referral_earning || 0,
            balance: parseFloat(res.data.balance) || 0,
            gross_earnings: res.data.gross_earnings || 0,
            net_earnings: res.data.net_earnings || 0,
            total_sales: res.data.total_sales || 0,
          });
        }
      } catch (err) {
        if (!cancelled && err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Error fetching earnings summary:", err);
        }
      } finally {
        if (!cancelled) setLoadingSummary(false);
      }
    };
    fetchSummary();
    return () => { cancelled = true; ac.abort(); };
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    const fetchChartData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get("/earnings/monthly", {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: ac.signal,
        });
        if (!cancelled) setChartData(res.data ?? []);
      } catch (err) {
        if (!cancelled && err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Error fetching monthly earnings:", err);
        }
      } finally {
        if (!cancelled) setLoadingChart(false);
      }
    };
    fetchChartData();
    return () => { cancelled = true; ac.abort(); };
  }, []);

  const handleCellHover = useCallback((index) => setHoverIndex(index), []);
  const handleCellHoverClear = useCallback(() => setHoverIndex(-1), []);

  const {
    overallAverageRating,
    overallAverageFive,
    overallAverageFour,
    overallAverageThree,
  } = useMemo(() => {
    const arr = Array.isArray(allRating) ? allRating : [];
    const filterRating = arr.filter((v) => v != null && !isNaN(v));
    const sum = filterRating.reduce((acc, r) => acc + r, 0);
    const overallAverageRating = filterRating.length
      ? (sum / filterRating.length).toFixed(1)
      : "0";
    const f5 = arr.filter((v) => v === 5);
    const f4 = arr.filter((v) => v === 4);
    const f3 = arr.filter((v) => v === 3);
    return {
      overallAverageRating,
      overallAverageFive: arr.length ? (f5.length / arr.length) * 100 : 0,
      overallAverageFour: arr.length ? (f4.length / arr.length) * 100 : 0,
      overallAverageThree: arr.length ? (f3.length / arr.length) * 100 : 0,
    };
  }, [allRating]);

  return (
    <div className="gt-dark-theme-wrapper">
      <Navbar FirstNav="none" />
      <div className="container-fluid pt-5 gt-main-bg">
        <div className="row mx-lg-4 mx-md-3 mx-xm-3 mx-0">
          <div className="col-lg-4 col-12">
            <Dashboardright />
          </div>
          <div className="col-lg-8 col-12 mt-lg-0 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="byerLine font-22 font-600 cocon gt-text-white">
                Earnings
              </h3>
              <div className="text-end">
                <Button
                  className="gt-btn-primary poppins px-4 py-2 font-15 mb-1"
                  onClick={() => navigate('/payoutMethod')}
                >
                  Withdraw Balance
                </Button>
                <br />
                <Link
                  to="/payoutMethod"
                  className="gt-text-orange font-13 text-decoration-underline poppins"
                >
                  Manage payout methods
                </Link>
              </div>
            </div>

            {/* Earning Summary Grid */}
            <div className="gt-card p-4 rounded-4 mb-4">
              <div className="row g-4">
                {/* Gross Earnings */}
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="d-flex align-items-center gt-stat-box p-3 rounded-4">
                    {loadingSummary ? (
                      <Skeleton variant="rectangular" width={60} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                    ) : (
                      <>
                        <img src={imagarrow} width={60} height={60} alt="Gross" style={{ filter: 'drop-shadow(0 0 10px rgba(240,89,31,0.2))' }} />
                        <div className="ms-3">
                          <p className="font-13 font-500 poppins mb-0 gt-text-muted">Gross Earnings</p>
                          <h3 className="font-22 font-700 poppins gt-text-white mb-0">
                            ${Number(summaryData.gross_earnings || 0).toLocaleString()}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Net Earnings */}
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="d-flex align-items-center gt-stat-box p-3 rounded-4">
                    {loadingSummary ? (
                      <Skeleton variant="rectangular" width={60} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                    ) : (
                      <>
                        <img src={imagarrow1} width={60} height={60} alt="Net" />
                        <div className="ms-3">
                          <p className="font-13 font-500 poppins mb-0 gt-text-muted">Net Earnings</p>
                          <h3 className="font-22 font-700 poppins gt-text-white mb-0">
                            ${Number(summaryData.net_earnings || 0).toLocaleString()}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="d-flex align-items-center gt-stat-box p-3 rounded-4">
                    {loadingSummary ? (
                      <Skeleton variant="rectangular" width={60} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                    ) : (
                      <>
                        <img src={imagarrow2} width={60} height={60} alt="Balance" />
                        <div className="ms-3">
                          <p className="font-13 font-500 poppins mb-0 gt-text-muted">Available Balance</p>
                          <h3 className="font-22 font-700 poppins gt-text-orange mb-0">
                            ${Number(summaryData.balance || 0).toLocaleString()}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="gt-card p-4 rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="poppins">
                  <h5 className="font-18 gt-text-white fw-bold mb-0">Earnings Overview</h5>
                  <p className="font-13 gt-text-muted mb-0">Monthly growth analysis</p>
                </div>
                <select className="gt-dark-select poppins">
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </div>
              <div style={{ width: "100%", height: "300px" }}>
                {loadingChart ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <CircularProgress sx={{ color: '#f0591f' }} />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <XAxis
                        dataKey="month"
                        tick={<CustomTick />}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar dataKey="earnings" radius={[6, 6, 0, 0]} barSize={35}>
                        {chartData.map((entry, index) => (
                          <Cell
                            cursor="pointer"
                            fill={hoverIndex === index ? "#f0591f" : "rgba(255,255,255,0.15)"}
                            onMouseEnter={() => handleCellHover(index)}
                            onMouseLeave={handleCellHoverClear}
                            key={`cell-${index}`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 gt-text-muted">
                    <p>No earnings data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ratings Section */}
            <div className="mt-5">
              <h3 className="font-18 font-600 poppins gt-text-white mb-4">
                Rating & Reviews
              </h3>
              <div className="gt-card p-4 rounded-4">
                <div className="row g-4 align-items-center poppins">
                  <div className="col-lg-5 col-md-5 col-12 text-center border-end-gt">
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            size={28}
                            color={i < Math.floor(overallAverageRating)
                              ? "#f0591f"
                              : "rgba(255,255,255,0.1)"}
                          />
                        ))}
                      </div>
                      <h3 className="mt-3 font-32 fw-bold gt-text-white mb-0">
                        {overallAverageRating} <span className="font-16 gt-text-muted fw-medium">/ 5.0</span>
                      </h3>
                      <p className="mt-2 mb-0 gt-text-gray font-14 fw-semibold text-uppercase">Top Seller Rating</p>
                  </div>

                  <div className="col-lg-7 col-md-7 col-12">
                    <div className="gig-rating-rewies px-lg-3">
                      {[5, 4, 3].map((stars) => (
                        <div key={stars} className="d-flex align-items-center mb-3">
                          <span className="font-13 gt-text-muted fw-bold" style={{ minWidth: '55px' }}>{stars} Stars</span>
                          <div className="progress flex-grow-1 mx-3 gt-progress-bg" style={{ height: "8px" }}>
                            <div
                              className="progress-bar gt-progress-bar"
                              style={{
                                width: `${{5: overallAverageFive, 4: overallAverageFour, 3: overallAverageThree}[stars]}%`
                              }}
                            ></div>
                          </div>
                          <span className="font-13 gt-text-gray fw-bold" style={{ minWidth: '35px' }}>
                            {Math.round({5: overallAverageFive, 4: overallAverageFour, 3: overallAverageThree}[stars])}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className="gt-divider my-4" />

                {/* Reviews List */}
                <div className="gt-reviews-list">
                  {userRating?.length > 0 ? (
                    userRating.map((value, index) => (
                      <div className="gt-activity-card p-3 rounded-4 mb-3" key={`review-${index}`}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center">
                            <img
                              className="rounded-circle border-gt"
                              src={value.user?.image || ""}
                              width={45}
                              height={45}
                              alt="Avatar"
                              onError={(e) => { e.target.src = "/default-avatar.png"; }}
                            />
                            <div className="ms-3">
                              <h6 className="font-15 fw-bold gt-text-white mb-0">
                                {value.user?.fname || "Anonymous"}
                              </h6>
                              <div className="d-flex align-items-center mt-1">
                                <img src={timepes} width={12} height={12} alt="Time" className="opacity-50" />
                                <span className="font-11 ms-1 gt-text-muted fw-medium">
                                  {value.created_at ? formatDistanceToNow(new Date(value.created_at), { addSuffix: true }) : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mb-0 font-14 mt-3 gt-text-gray poppins lh-base">
                          "{value.comments}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 gt-text-muted font-14">No reviews yet</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .gt-dark-theme-wrapper {
          background-color: #020617;
          min-height: 100vh;
        }
        .gt-main-bg { background-color: #020617 !}
        .gt-text-white { color: #ffffff !important; }
        .gt-text-gray { color: #d4d4d8 !important; }
        .gt-text-muted { color: #71717a !important; }
        .gt-text-orange { color: #f0591f !important; }

        .gt-card {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .gt-stat-box {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: 0.3s;
        }
        .gt-stat-box:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: rgba(240, 89, 31, 0.2);
        }

        .gt-btn-primary {
          background-color: #f0591f !important;
          color: white !important;
          text-transform: none !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
        }

        .gt-dark-select {
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 15px;
          border-radius: 8px;
          font-size: 12px;
          outline: none;
        }

        .gt-divider { border-top: 1px solid rgba(255, 255, 255, 0.06); }

        .gt-progress-bg { background-color: rgba(255, 255, 255, 0.05) !important; border-radius: 10px; }
        .gt-progress-bar { background-color: #f0591f !important; border-radius: 10px; }

        .gt-activity-card {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .border-end-gt { border-right: 1px solid rgba(255, 255, 255, 0.06); }
        .border-gt { border: 2px solid rgba(255, 255, 255, 0.1); }

        @media (max-width: 991px) {
          .border-end-gt { border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.06); padding-bottom: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Earning;