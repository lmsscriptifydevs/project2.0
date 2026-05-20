import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MouseIcon from '@mui/icons-material/Mouse';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import { getSingleGigStats } from '../redux/slices/gigsSlice';
import { getGigThumbnail } from '../utils/helpers';
import { getPerformanceLevel } from './GigStates';

const DEFAULT_IMAGE = "https://via.placeholder.com/120";

export default function GigStatsDetail() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gig = location.state?.gig;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('30');

  useEffect(() => {
    if (!gig || !gig.id) {
      navigate('/gigs/states', { replace: true });
      return;
    }

    setLoading(true);
    dispatch(getSingleGigStats(gig.id))
      .unwrap()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || 'Failed to load gig stats');
        setLoading(false);
      });
  }, [dispatch, gig, navigate]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
    }
  };

  // Convert the new backend `charts` structure into recharts format
  const chartData = useMemo(() => {
    if (!stats || !stats.charts) return [];
    
    const { labels = [], datasets = [] } = stats.charts;
    const viewsData = datasets.find(d => d.label === 'Views')?.data || [];
    const likesData = datasets.find(d => d.label === 'Likes')?.data || [];
    const ordersData = datasets.find(d => d.label === 'Orders')?.data || [];

    let formattedData = labels.map((label, index) => {
      const cleanLabel = label.replace(/^0+/, '');
      return {
        date: cleanLabel,
        Views: parseInt(viewsData[index] || 0, 10),
        Likes: parseInt(likesData[index] || 0, 10),
        Orders: parseInt(ordersData[index] || 0, 10),
        rawDate: new Date(label + ' 2026') // Used for sorting internally if needed
      };
    });

    // The backend provides last 30 days. We filter the array length based on selection.
    // Assuming labels are ordered oldest to newest.
    if (timeFilter === '7') {
      formattedData = formattedData.slice(-7);
    } else if (timeFilter === '15') {
      formattedData = formattedData.slice(-15);
    }
    // if '30', keep all 30 days

    return formattedData;
  }, [stats, timeFilter]);

  if (!gig) return null;

  const overview = stats?.overview || {};
  const gigInfo = overview.gig_info || gig;
  const completedOrders = overview.total_completed_orders ?? gig.orders ?? 0;
  const avgRating = overview.average_rating ?? gig.ratings_avg_ratings ?? 0;
  const totalReviews = overview.total_reviews ?? 0;

  const perf = getPerformanceLevel(gigInfo.total_impressions || 0, gigInfo.total_clicks || 0, completedOrders);

  return (
    <>
      <Navbar FirstNav="none" />
      <Box sx={{ minHeight: '100vh', bgcolor: '#020617', color: '#ffffff', pt: 3, pb: 8 }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate('/gigs/states')}
            size="small"
            sx={{ color: '#a1a1aa', mb: 3, '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' }, textTransform: 'none', fontWeight: 600 }}
          >
            Back to Analytics Dashboard
          </Button>

          {/* Compact Premium Gig Overview Header */}
          <Card sx={{
            p: 2.5,
            mb: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            alignItems: { xs: 'flex-start', sm: 'center' },
            boxShadow: 'none'
          }}>
            <Box
              component="img"
              src={getGigThumbnail(gig.media) || DEFAULT_IMAGE}
              alt={gig.title}
              sx={{
                width: { xs: '100%', sm: 120 },
                height: 80,
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6" fontWeight="800" sx={{ color: '#ffffff', fontFamily: 'Inter, sans-serif', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {gigInfo.title || gig.title}
                </Typography>
                <Chip
                  label={perf.label}
                  size="small"
                  sx={{
                    bgcolor: perf.bg,
                    color: perf.color,
                    fontWeight: 'bold',
                    border: '1px solid',
                    borderColor: perf.color,
                    height: 22,
                    fontSize: '0.65rem'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#a1a1aa', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                <span>Category: <strong style={{ color: '#e2e8f0' }}>{gig.category?.title || 'General'}</strong></span>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                <span>Base Price: <strong style={{ color: '#10b981' }}>${parseInt(gig.packages?.[0]?.total || 0, 10)}</strong></span>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                <span>ID: <strong style={{ color: '#71717a' }}>{parseInt(gigInfo.id || gig.id || 0, 10)}</strong></span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={(gigInfo.status || 'draft').toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: gigInfo.status === 'publish' || gigInfo.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    color: gigInfo.status === 'publish' || gigInfo.status === 'published' ? '#10b981' : '#fbbf24',
                    fontWeight: 'bold',
                    border: '1px solid',
                    borderColor: gigInfo.status === 'publish' || gigInfo.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    height: 20,
                    fontSize: '0.65rem'
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#fbbf24' }}>
                    {parseFloat(avgRating || 0).toString()} <span style={{ color: '#71717a', fontWeight: 'normal' }}>({parseInt(totalReviews || 0, 10)})</span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#f0591f', mb: 2 }} size={40} thickness={4} />
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Syncing live analytics...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Typography variant="body1" color="error">{error}</Typography>
              <Button variant="outlined" color="error" size="small" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </Box>
          ) : stats ? (
            <>
              {/* Compact SaaS Stats Metrics */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { icon: VisibilityIcon, label: 'Impressions', value: gigInfo.total_impressions || 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                  { icon: MouseIcon, label: 'Clicks', value: gigInfo.total_clicks || 0, color: '#f0591f', bg: 'rgba(240,89,31,0.1)' },
                  { icon: AssessmentIcon, label: 'Reach', value: gigInfo.total_reach || 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                  { icon: ThumbUpIcon, label: 'Likes', value: gigInfo.total_likes || 0, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
                  { icon: ShoppingCartIcon, label: 'Orders', value: completedOrders, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                  { icon: StarIcon, label: 'Reviews', value: totalReviews, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                ].map((stat, index) => (
                  <Grid item xs={6} sm={4} md={4} lg={2} key={index}>
                    <Card sx={{
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <stat.icon sx={{ color: stat.color, fontSize: 14 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="800" sx={{ color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {parseInt(stat.value || 0, 10).toString()}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Performance Chart */}
              <Card sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                boxShadow: 'none'
              }}>
                <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="800" sx={{ color: '#ffffff', mb: 0.5 }}>Growth Trends</Typography>
                    <Typography variant="caption" sx={{ color: '#71717a' }}>Analyze your gig's daily trajectory</Typography>
                  </Box>
                  
                  <ToggleButtonGroup
                    value={timeFilter}
                    exclusive
                    onChange={handleFilterChange}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      '& .MuiToggleButton-root': {
                        color: '#a1a1aa',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(240, 89, 31, 0.15)',
                          color: '#f0591f',
                          borderColor: 'rgba(240, 89, 31, 0.3)',
                          '&:hover': { bgcolor: 'rgba(240, 89, 31, 0.2)' }
                        },
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                      }
                    }}
                  >
                    <ToggleButton value="7">7 Days</ToggleButton>
                    <ToggleButton value="15">15 Days</ToggleButton>
                    <ToggleButton value="30">30 Days</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                
                {chartData.length > 0 ? (
                  <>
                    <Box sx={{ display: 'flex', gap: 3, mb: 3, ml: { xs: 0, sm: 2 }, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                        <Typography variant="caption" sx={{ color: '#e2e8f0', fontWeight: 600 }}>Views</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                        <Typography variant="caption" sx={{ color: '#e2e8f0', fontWeight: 600 }}>Likes</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" sx={{ color: '#e2e8f0', fontWeight: 600 }}>Orders</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: 320 }}>
                      <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#71717a" 
                            fontSize={11} 
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={20}
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', padding: '12px' }}
                            itemStyle={{ color: '#fff', fontWeight: '700', padding: '2px 0', fontSize: '0.85rem' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          />
                          <Area type="monotone" dataKey="Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 4, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }} />
                          <Area type="monotone" dataKey="Likes" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLikes)" activeDot={{ r: 4, fill: '#ef4444', stroke: '#0f172a', strokeWidth: 2 }} />
                          <Area type="step" dataKey="Orders" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" activeDot={{ r: 4, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <Typography variant="body2" sx={{ color: '#71717a', fontWeight: 500 }}>No chart data generated for the selected period.</Typography>
                  </Box>
                )}
              </Card>
            </>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
