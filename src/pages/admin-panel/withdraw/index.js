import {
  AccountBalance,
  CalendarToday,
  Cancel,
  CheckCircle,
  Person,
  Visibility,
  Warning
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  approveWithdrawal,
  fetchUserBalance,
  fetchWithdrawals,
  hideAlert,
  rejectWithdrawal,
  setRejectionReason,
  setSelectedTab,
  setSelectedWithdrawal,
  setShowApproveModal,
  setShowDetailsModal,
  setShowRejectModal,
  setTransactionId
} from '../../../redux/slices/withdrawalSlice';
import SidebarLayout from "../sidebarLayout";
const AdminWithdrawalManagement = () => {
  const dispatch = useDispatch();
  const {
    withdrawals,
    loading,
    selectedTab,
    selectedWithdrawal,
    showDetailsModal,
    showApproveModal,
    showRejectModal,
    rejectionReason,
    transactionId,
    processing,
    alert
  } = useSelector((state) => state.withdrawal|| {});

  // PERF STARTUP: Defer fetchWithdrawals until after first paint - UI renders first
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchWithdrawals(selectedTab));
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchData, { timeout: 500 });
    } else {
      setTimeout(fetchData, 0);
    }
  }, [dispatch, selectedTab]);

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
  };

  const openDetailsModal = async (withdrawal) => {
    dispatch(setSelectedWithdrawal(withdrawal));
    dispatch(fetchUserBalance(withdrawal.user_id));
    dispatch(setShowDetailsModal(true));
  };

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;
    dispatch(approveWithdrawal({
      withdrawalId: selectedWithdrawal.id,
      transactionId
    }));
  };

  const handleReject = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) return;
    dispatch(rejectWithdrawal({
      withdrawalId: selectedWithdrawal.id,
      reason: rejectionReason
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      processing: '#2196F3',
      completed: '#4CAF50',
      rejected: '#F44336',
      cancelled: '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'rejected': return <Cancel sx={{ color: '#F44336' }} />;
      case 'pending': return <Warning sx={{ color: '#FF9800' }} />;
      default: return null;
    }
  };

  const checkBalanceSufficiency = (withdrawal) => {
    if (!withdrawal.current_balance) return null;
    return withdrawal.current_balance >= withdrawal.amount;
  };

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
       <SidebarLayout>
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Withdrawal Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage freelancer withdrawal requests
        </Typography>
      </Box>

      {/* Alert */}
      {alert.show && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3 }}
          onClose={() => dispatch(hideAlert())}
        >
          {alert.message}
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Pending" value="pending" />
          <Tab label="Processing" value="processing" />
          <Tab label="Completed" value="completed" />
          <Tab label="Rejected" value="rejected" />
          <Tab label="All" value="all" />
        </Tabs>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : withdrawals.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No withdrawal requests found
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Freelancer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell>Balance Check</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {withdrawal.user?.fname || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {withdrawal.user_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                            {formatCurrency(withdrawal.amount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fee: {formatCurrency(withdrawal.processing_fee)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={withdrawal.status.toUpperCase()}
                          size="small"
                          icon={getStatusIcon(withdrawal.status)}
                          sx={{
                            backgroundColor: getStatusColor(withdrawal.status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatDate(withdrawal.created_at)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title="Click to check current balance">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openDetailsModal(withdrawal)}
                            startIcon={<AccountBalance />}
                            sx={{ minWidth: '120px' }}
                          >
                            Check Balance
                          </Button>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => openDetailsModal(withdrawal)}
                              sx={{ color: '#2196F3' }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          
                          {withdrawal.status === 'pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    dispatch(setSelectedWithdrawal(withdrawal));
                                    dispatch(setShowApproveModal(true));
                                  }}
                                  sx={{ color: '#4CAF50' }}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    dispatch(setSelectedWithdrawal(withdrawal));
                                    dispatch(setShowRejectModal(true));
                                  }}
                                  sx={{ color: '#F44336' }}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onClose={() => dispatch(setShowDetailsModal(false))} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar><Person /></Avatar>
            <Box>
              <Typography variant="h6">Withdrawal Request Details</Typography>
              <Typography variant="caption" color="text.secondary">
                Request ID: {selectedWithdrawal?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedWithdrawal && (
            <Box sx={{ mt: 2 }}>
              {/* Balance Verification Alert */}
              {selectedWithdrawal.current_balance !== undefined && (
                <Alert 
                  severity={checkBalanceSufficiency(selectedWithdrawal) ? 'success' : 'error'}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body2">
                    <strong>Balance Verification:</strong> {' '}
                    Current Balance: {formatCurrency(selectedWithdrawal.current_balance)} | {' '}
                    Requested: {formatCurrency(selectedWithdrawal.amount)} | {' '}
                    {checkBalanceSufficiency(selectedWithdrawal) 
                      ? '✅ Sufficient Balance' 
                      : '❌ Insufficient Balance'
                    }
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                {/* Left Column */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2196F3' }}>
                    Request Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Freelancer</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {selectedWithdrawal.user?.fname || 'Unknown User'}
                    </Typography>
                  </Box>

<Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Available Amount</Typography>
                    <Typography variant="h5" sx={{ color: '#ed5623', fontWeight: 'bold' }}>
                      {formatCurrency(selectedWithdrawal.user?.wallet_balance)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Requested Amount</Typography>
                    <Typography variant="h5" sx={{ color: '#ed5623', fontWeight: 'bold' }}>
                      {formatCurrency(selectedWithdrawal.amount)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Processing Fee</Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedWithdrawal.processing_fee)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Net Amount</Typography>
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      {formatCurrency(selectedWithdrawal.net_amount)}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Column */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2196F3' }}>
                    Status & Timing
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedWithdrawal.status.toUpperCase()}
                      size="small"
                      icon={getStatusIcon(selectedWithdrawal.status)}
                      sx={{
                        backgroundColor: getStatusColor(selectedWithdrawal.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Requested At</Typography>
                    <Typography variant="body1">
                      {formatDate(selectedWithdrawal.created_at)}
                    </Typography>
                  </Box>

                  {selectedWithdrawal.processed_at && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Processed At</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedWithdrawal.processed_at)}
                      </Typography>
                    </Box>
                  )}

                  {selectedWithdrawal.current_balance !== undefined && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Current Balance</Typography>
                      <Typography variant="h6" sx={{ 
                        color: checkBalanceSufficiency(selectedWithdrawal) ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold' 
                      }}>
                        {formatCurrency(selectedWithdrawal.current_balance)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Note */}
              {selectedWithdrawal.note && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">Note</Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mt: 1 }}>
                    <Typography variant="body2">
                      {selectedWithdrawal.note}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Rejection Reason */}
              {selectedWithdrawal.rejection_reason && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">Rejection Reason</Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#ffebee', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                      {selectedWithdrawal.rejection_reason}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => dispatch(setShowDetailsModal(false))}>Close</Button>
          {selectedWithdrawal?.status === 'pending' && (
            <>
              <Button 
                color="error"
                onClick={() => {
                  dispatch(setShowDetailsModal(false));
                  dispatch(setShowRejectModal(true));
                }}
              >
                Reject
              </Button>
              <Button 
                color="success"
                variant="contained"
                onClick={() => {
                  dispatch(setShowDetailsModal(false));
                  dispatch(setShowApproveModal(true));
                }}
                disabled={!checkBalanceSufficiency(selectedWithdrawal)}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onClose={() => dispatch(setShowApproveModal(false))} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Withdrawal Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to approve this withdrawal request for {formatCurrency(selectedWithdrawal?.amount)}?
          </Typography>
          
          <TextField
            fullWidth
            label="Transaction ID (Optional)"
            value={transactionId}
            onChange={(e) => dispatch(setTransactionId(e.target.value))}
            placeholder="Enter external transaction ID"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setShowApproveModal(false))} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleApprove} 
            variant="contained" 
            color="success"
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onClose={() => dispatch(setShowRejectModal(false))} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Withdrawal Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this withdrawal request:
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => dispatch(setRejectionReason(e.target.value))}
            placeholder="Enter reason for rejection..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setShowRejectModal(false))} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={processing || !rejectionReason.trim()}
          >
            {processing ? <CircularProgress size={20} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </SidebarLayout>

  );
};

export default AdminWithdrawalManagement;