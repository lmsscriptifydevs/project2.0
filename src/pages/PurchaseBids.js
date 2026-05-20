import {
  Box,
  Button,
  CircularProgress,
  Container,
  Modal,
  TextField,
  Typography,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { purchaseBidPackage, fetchBidsHistory } from "../redux/slices/bidsSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useUserData } from "../utils/useLocalStorage";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// --- Theme Constants ---
const THEME = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  pureWhite: "#ffffff",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)"
};

const BuyBids = () => {
  const dispatch = useDispatch();
  const userData = useUserData();
  const { bidsHistory, bidsHistoryLoading } = useSelector((state) => state.bids);

  const [amount, setAmount] = useState("");
  const [purchaseLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    amount: '',
    file: null
  });
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  const conversionRate = 15;
  const computedBids = amount ? Math.floor(Number(amount) / conversionRate) : 0;

  const validateAmount = (value) => {
    const numValue = Number(value);
    if (!value || isNaN(numValue) || numValue <= 0) return "Please enter a valid amount greater than 0";
    if (numValue < 15) return "Minimum amount is PKR 15";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, file }));
        setSelectedImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFastCheckout = async (e) => {
    e.preventDefault();
    if (!formData.file) { toast.error("Please upload receipt."); return; }
    setIsProcessing(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('amount', amount);
      formDataToSend.append('payment_method', 'bank_transfer');
      formDataToSend.append('transfer_receipt', formData.file, formData.file.name);
      const response = await dispatch(purchaseBidPackage(formDataToSend)).unwrap();
      if (response.status) {
        toast.success("Receipt submitted! Pending verification.");
        setShowPaymentModal(false);
        setAmount("");
        setSelectedImagePreview(null);
        dispatch(fetchBidsHistory());
      }
    } catch (error) { toast.error("Transfer failed."); } finally { setIsProcessing(false); }
  };

  const openPaymentModal = () => {
    const error = validateAmount(amount);
    if (error) { toast.error(error); return; }
    setShowPaymentModal(true);
  };

  // Fetch bid history on mount
  useEffect(() => {
    dispatch(fetchBidsHistory());
  }, [dispatch]);

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper to get status chip color
  const getStatusChip = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "approved") {
      return <Chip label={status} size="small" sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "#4caf50", fontWeight: 600 }} />;
    } else if (s === "pending") {
      return <Chip label={status} size="small" sx={{ bgcolor: "rgba(255, 193, 7, 0.2)", color: "#ffc107", fontWeight: 600 }} />;
    } else if (s === "rejected" || s === "failed") {
      return <Chip label={status} size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.2)", color: "#f44336", fontWeight: 600 }} />;
    }
    return <Chip label={status || "-"} size="small" sx={{ color: THEME.bodyGrayText }} />;
  };

  // Extract history array from API response
  const historyData = bidsHistory?.data || bidsHistory?.history || bidsHistory || [];

  return (
    <Box sx={{ bgcolor: THEME.mainBg, minHeight: '100vh', pb: 5 }}>
      <Navbar FirstNav="none" />
      <ToastContainer theme="dark" />
      
      <Container maxWidth="md" sx={{ mt: 8 }}>
        {/* Buy Bids Card */}
        <Card sx={{ 
          p: { xs: 2, sm: 4 }, 
          bgcolor: THEME.cardBg, 
          backdropFilter: 'blur(10px)', 
          border: `1px solid ${THEME.lightBorder}`,
          borderRadius: 4,
          textAlign: 'center',
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: THEME.pureWhite, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Buy Bids
          </Typography>
          <Typography variant="body1" sx={{ color: THEME.bodyGrayText, mb: 4 }}>
            Refill your account to keep bidding on tasks
          </Typography>

          {/* Current Balance Display */}
          <Box sx={{ 
            bgcolor: 'rgba(240, 89, 31, 0.1)', 
            p: 2, 
            borderRadius: 3, 
            border: `1px solid ${THEME.orangeBorderActive}`,
            mb: 4
          }}>
            <Typography variant="caption" sx={{ color: THEME.primaryOrange, textTransform: 'uppercase', fontWeight: 700 }}>
              Current Bid Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: THEME.pureWhite, fontSize: { xs: '2rem', sm: '3rem' } }}>
              {userData?.total_bids || 0}
            </Typography>
          </Box>
          
          <TextField
            label="Enter Amount (PKR)"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: THEME.pureWhite,
                "& fieldset": { borderColor: THEME.lightBorder },
                "&:hover fieldset": { borderColor: THEME.bodyGrayText },
                "&.Mui-focused fieldset": { borderColor: THEME.primaryOrange },
              },
              "& .MuiInputLabel-root": { color: THEME.bodyGrayText },
              "& .MuiInputLabel-root.Mui-focused": { color: THEME.primaryOrange },
              mb: 2
            }}
            helperText={<span style={{ color: THEME.bodyGrayText }}>Min: PKR 15 | 1 Bid = PKR {conversionRate}</span>}
          />

          <Box sx={{ my: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
             <Typography variant="body1" sx={{ color: THEME.mediumGrayTitle }}>
               Total Bids to Receive: 
               <span style={{ color: THEME.primaryOrange, fontWeight: 'bold', fontSize: '1.2rem', marginLeft: '8px' }}>
                 {computedBids}
               </span>
             </Typography>
          </Box>
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={openPaymentModal}
            disabled={purchaseLoading || !amount || Number(amount) < 15}
            sx={{
              bgcolor: THEME.primaryOrange,
              "&:hover": { bgcolor: "#d84f1a" },
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: `0 4px 15px ${THEME.primaryOrange}40`
            }}
          >
            {purchaseLoading ? <CircularProgress size={24} color="inherit" /> : "Proceed to Payment"}
          </Button>
        </Card>

        {/* Bid History Table */}
        <Card sx={{ 
          p: { xs: 2, md: 4 }, 
          bgcolor: THEME.cardBg, 
          backdropFilter: 'blur(10px)', 
          border: `1px solid ${THEME.lightBorder}`,
          borderRadius: 4
        }}>
          <Typography variant="h5" fontWeight="800" sx={{ color: THEME.pureWhite, mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Bid Purchase History
          </Typography>
          <Typography variant="body2" sx={{ color: THEME.bodyGrayText, mb: 3 }}>
            Your complete bid purchase and reward history
          </Typography>

          {bidsHistoryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: THEME.primaryOrange }} />
            </Box>
          ) : historyData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" sx={{ color: THEME.bodyGrayText }}>
                No bid history found yet. Purchase your first bid package above!
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ 
              bgcolor: 'transparent', 
              border: `1px solid ${THEME.lightBorder}`, 
              borderRadius: 2,
              overflowX: 'auto'
            }}>
              <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
                <TableHead>
                  <TableRow sx={{ 
                    '& th': { 
                      color: THEME.mediumGrayTitle, 
                      fontWeight: 700, 
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      borderBottom: `1px solid ${THEME.lightBorder}`,
                      bgcolor: 'rgba(255,255,255,0.02)'
                    } 
                  }}>
                    <TableCell>#</TableCell>
                    <TableCell>Amount (PKR)</TableCell>
                    <TableCell>Bids Received</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((item, index) => (
                    <TableRow key={item.id || index} sx={{ 
                      '& td': { 
                        color: THEME.pureWhite, 
                        borderBottom: `1px solid ${THEME.lightBorder}`,
                        fontSize: '0.9rem'
                      },
                      '&:hover': { bgcolor: THEME.cardBgActive },
                      transition: 'background 0.2s'
                    }}>
                      <TableCell sx={{ color: THEME.bodyGrayText }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {item.amount || item.total_amount || item.price || "-"}
                      </TableCell>
                      <TableCell>{item.bids || item.bids_received || item.quantity || "-"}</TableCell>
                      <TableCell sx={{ color: THEME.bodyGrayText }}>
                        {item.payment_method || item.method || item.type || "-"}
                      </TableCell>
                      <TableCell>{getStatusChip(item.status)}</TableCell>
                      <TableCell sx={{ color: THEME.bodyGrayText, fontSize: '0.8rem' }}>
                        {formatDate(item.created_at || item.date || item.purchase_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Container>

      {/* Payment Modal - Only Bank Transfer */}
      <Modal open={showPaymentModal} onClose={() => !isProcessing && setShowPaymentModal(false)}>
        <Box sx={{
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: { xs: '98%', sm: '95%', md: '800px' }, 
          maxHeight: { xs: '95vh', sm: '90vh' },
          overflowY: 'auto',
          bgcolor: "#0f172a", 
          borderRadius: { xs: 2, sm: 4 },
          border: `1px solid ${THEME.lightBorder}`, 
          p: { xs: 2, sm: 3, md: 4 }, 
          outline: 'none'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: THEME.pureWhite, mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Secure Checkout
          </Typography>
          <Typography variant="body2" sx={{ color: THEME.bodyGrayText, mb: 3 }}>
            Order Summary: PKR {amount} for {computedBids} Bids
          </Typography>

          {/* Forms Section - Only Bank Transfer */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: { xs: 2, sm: 3 }, borderRadius: 3, border: `1px solid ${THEME.lightBorder}` }}>
            <Box component="form" onSubmit={handleFastCheckout}>
              {/* Instruction Banner */}
              <Box sx={{
                bgcolor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: 2,
                p: { xs: 1.5, sm: 2 },
                mb: 2.5,
                textAlign: 'center'
              }}>
                <Typography sx={{ color: '#fbbf24', fontSize: { xs: '0.8rem', sm: '0.85rem' }, fontWeight: 600 }}>
                  AIS MA ONLY BANK TRANSFER CHIA MUAJ OK ✓
                </Typography>
              </Box>

              {/* Bank Account - GrapeTask (Private) Limited - SONERI BANK LTD */}
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.08)',
                p: { xs: 2, sm: 2.5 },
                mb: 2
              }}>
                <Typography sx={{ 
                  color: '#fbbf24', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  Bank Account — GrapeTask (Private) Limited
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1.5
                }}>
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>
                      Account Title
                    </Typography>
                    <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>
                      GrapeTask (Private) Limited
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>
                      Account No
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ color: '#e2e8f0', fontSize: { xs: '0.8rem', sm: '0.85rem' }, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '1px', wordBreak: 'break-all' }}>
                        021720016063135
                      </Typography>
                      <Tooltip title="Copy Account Number">
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText('021720016063135'); toast.success('Account number copied!'); }} sx={{ color: '#94a3b8', '&:hover': { color: '#fbbf24' } }}>
                          <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>
                      IBAN
                    </Typography>
                    <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '1px', wordBreak: 'break-all' }}>
                      PK945ONE0021720016063135
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>
                      Bank Name
                    </Typography>
                    <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>
                      SONERI BANK LTD
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.3 }}>
                      Branch
                    </Typography>
                    <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>
                      Daharki Branch
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Instruction Text */}
              <Typography sx={{ color: '#94a3b8', fontSize: { xs: '0.75rem', sm: '0.8rem' }, mb: 2, textAlign: 'center', fontStyle: 'italic' }}>
                AOS MA YA HTA KE RO YA ADD KE RMDUJA OAK ✓
              </Typography>

              <Typography sx={{ color: THEME.mediumGrayTitle, fontSize: '0.85rem', mb: 1 }}>Upload Receipt (ScreenShot Submit as a proof)</Typography>
              <input 
                type="file" 
                name="file" 
                onChange={handleInputChange} 
                style={{ 
                  color: THEME.bodyGrayText, 
                  marginBottom: '15px',
                  width: '100%',
                  fontSize: '0.85rem'
                }} 
              />
              {selectedImagePreview && (
                  <Box sx={{ mb: 2, width: '80px', height: '80px', borderRadius: 2, overflow: 'hidden', border: `1px solid ${THEME.lightBorder}` }}>
                      <img src={selectedImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
              )}
              <Button type="submit" fullWidth variant="contained" disabled={isProcessing || !formData.file} sx={{ bgcolor: THEME.primaryOrange, py: 1.5 }}>
                {isProcessing ? <CircularProgress size={20} color="inherit" /> : 'Submit Proof'}
              </Button>
            </Box>
          </Box>
          
          <Button fullWidth onClick={() => setShowPaymentModal(false)} sx={{ mt: 2, color: THEME.bodyGrayText }}>
            Cancel Transaction
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BuyBids;