import {
  Box,
  Button,
  Card,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MouseIcon from '@mui/icons-material/Mouse';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPersonalGigs } from '../redux/slices/offersSlice';
import { getGigThumbnail } from '../utils/helpers';

const DEFAULT_IMAGE = "https://via.placeholder.com/80";

export const getPerformanceLevel = (impressions = 0, clicks = 0, orders = 0) => {
  const score = (orders * 50) + (clicks * 2) + (impressions * 0.5);
  if (score >= 1000) return { label: 'Excellent', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
  if (score >= 500) return { label: 'Best', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
  if (score >= 100) return { label: 'Better', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
  if (score > 0) return { label: 'Good', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' };
  return { label: 'Needs Work', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' };
};

export default function GigStates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { personalGigs, offerIsLoading } = useSelector((state) => state.offers);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("UserData"));
    if (userData?.id) {
      dispatch(getPersonalGigs({ user_id: userData.id }));
    }
  }, [dispatch]);

  const totals = useMemo(() => {
    if (!personalGigs || personalGigs.length === 0) {
      return { impressions: 0, clicks: 0, orders: 0, reach: 0, likes: 0, avgRating: 0 };
    }
    
    let totalRating = 0;
    let gigsWithRating = 0;

    const sums = personalGigs.reduce(
      (acc, g) => {
        if (g.ratings_avg_ratings) {
          totalRating += parseFloat(g.ratings_avg_ratings);
          gigsWithRating++;
        }
        return {
          impressions: acc.impressions + (g.total_impressions || 0),
          clicks: acc.clicks + (g.total_clicks || 0),
          orders: acc.orders + (g.orders || 0),
          reach: acc.reach + (g.total_reach || 0),
          likes: acc.likes + (g.total_likes || 0),
        };
      },
      { impressions: 0, clicks: 0, orders: 0, reach: 0, likes: 0 }
    );

    return {
      ...sums,
      avgRating: gigsWithRating > 0 ? (totalRating / gigsWithRating).toFixed(1) : 0
    };
  }, [personalGigs]);

  return (
    <>
      <Navbar FirstNav="none" />
      <Box sx={{ minHeight: '100vh', bgcolor: '#020617', color: '#ffffff', pt: 4, pb: 8, overflowX: 'hidden' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#ffffff', fontFamily: 'Inter, sans-serif', mb: 0.5, letterSpacing: '-0.02em' }}>
                Gig Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', fontWeight: 500 }}>
                Monitor performance metrics and grow your services effectively.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon fontSize="small" />}
              size="small"
              onClick={() => window.location.reload()}
              sx={{ color: '#f0591f', borderColor: 'rgba(240,89,31,0.3)', borderRadius: '6px', '&:hover': { borderColor: '#f0591f', bgcolor: 'rgba(240,89,31,0.1)' } }}
            >
              Refresh Data
            </Button>
          </Box>

          {/* SaaS Style Compact Aggregated Totals */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { icon: VisibilityIcon, label: 'Impressions', value: totals.impressions, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
              { icon: MouseIcon, label: 'Clicks', value: totals.clicks, color: '#f0591f', bg: 'rgba(240, 89, 31, 0.1)' },
              { icon: AssessmentIcon, label: 'Reach', value: totals.reach, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
              { icon: ShoppingCartIcon, label: 'Orders', value: totals.orders, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
              { icon: ThumbUpIcon, label: 'Likes', value: totals.likes, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
              { icon: StarIcon, label: 'Rating', value: totals.avgRating, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
            ].map((stat, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Card sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon sx={{ color: stat.color, fontSize: 14 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="800" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: 0.5, letterSpacing: '-0.02em' }}>
                    {stat.label === 'Rating' ? stat.value : parseInt(stat.value || 0, 10).toString()}
                    {stat.label === 'Rating' && parseFloat(stat.value) > 0 ? (
                      <StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
                    ) : null}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#e2e8f0', mb: 2 }}>
            Detailed Performance
          </Typography>

          {/* Compact SaaS Table */}
          <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255, 255, 255, 0.015)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', width: '100%', overflowX: 'auto', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4 } }}>
            <Table sx={{ minWidth: 950 }} size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>GIG</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>STATUS</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>RATING</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>ORDERS</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>REACH</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>IMPR.</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}>CLICKS</TableCell>
                  <TableCell align="right" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1.5 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offerIsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8, border: 'none' }}>
                      <CircularProgress sx={{ color: '#f0591f' }} size={30} />
                    </TableCell>
                  </TableRow>
                ) : personalGigs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8, border: 'none' }}>
                      <Typography variant="body2" sx={{ color: '#71717a' }}>No active gigs found to display statistics.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  personalGigs.map((row) => {
                    const perf = getPerformanceLevel(row.total_impressions, row.total_clicks, row.orders);
                    
                    return (
                    <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' }, transition: 'background 0.15s' }}>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            component="img"
                            src={getGigThumbnail(row.media) || DEFAULT_IMAGE}
                            alt={row.title}
                            sx={{ width: 40, height: 30, borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                          <Box sx={{ maxWidth: 200 }}>
                            <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {row.title || `Gig #${row.id}`}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.7rem' }}>ID: {row.id}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Chip
                          label={(row.status || 'draft').toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: row.status === 'publish' || row.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            color: row.status === 'publish' || row.status === 'published' ? '#10b981' : '#fbbf24',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: row.status === 'publish' || row.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                            fontSize: '0.65rem',
                            height: 20
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight="600">{row.ratings_avg_ratings || "-"}</Typography>
                          {row.ratings_avg_ratings && <StarIcon sx={{ color: '#fbbf24', fontSize: 14 }} />}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Typography variant="body2" fontWeight="600">{parseInt(row.orders || 0, 10)}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Typography variant="body2" fontWeight="600">{parseInt(row.total_reach || 0, 10)}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Typography variant="body2" fontWeight="600">{parseInt(row.total_impressions || 0, 10)}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Typography variant="body2" fontWeight="600">{parseInt(row.total_clicks || 0, 10)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', py: 1.5 }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate('/gig/stats', { state: { gig: row } })}
                          sx={{
                            color: '#f0591f',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            '&:hover': { bgcolor: 'rgba(240, 89, 31, 0.1)' }
                          }}
                        >
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
