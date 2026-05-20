import {
  Box,
  IconButton,
  Modal,
  Button as MuiButton,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Offcanvas,
  Spinner,
} from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaCheck,
  FaDollarSign,
  FaEye,
  FaRegEnvelope,
  FaTimes,
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

// Components
import Navbar from '../../components/Navbar';
import Chating from '../../components/frelancerChat/Chat/Chating';

// Redux
import searchIcon from '../../assets/searchbar.webp';
import {
  acceptJobInvitation,
  fetchJobInvitations,
  rejectJobInvitation,
} from '../../redux/slices/jobInvitationSlice';
import {
  clearConversationError,
  createOrFindConversation,
  setSelectedConversation,
} from '../../redux/slices/messageSlice';

// Instead of importing from assets
const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=random";

// Constants
const ITEMS_PER_PAGE = 4;
const DEBOUNCE_DELAY = 300;
const STATUS_FILTER_OPTIONS = ['all', 'pending', 'accepted', 'rejected'];

/**
 * Utility function to calculate time duration from a given date
 */
const calculateDuration = (createdAt) => {
  const diffInSeconds = Math.floor((new Date() - new Date(createdAt)) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Returns the appropriate badge variant based on invitation status
 */
const getStatusBadgeVariant = (status) => {
  const badgeMap = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
  };
  return badgeMap[status] || 'secondary';
};

/**
 * StatusFilterTabs component for filtering invitations by status
 */
const StatusFilterTabs = ({ statusFilter, setStatusFilter, statusCounts }) => (
  <div className="col-lg-8 col-12">
    <ul className="nav nav-pills custom-nav-pills" role="tablist">
      {STATUS_FILTER_OPTIONS.map((status) => (
        <li key={status} className="nav-item d-flex align-items-center ms-lg-3 ms-0" role="presentation">
          <button
            className={`nav-link rounded-0 ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
            type="button"
            aria-label={`Filter by ${status} invitations`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
            <span className="badge-count p-1 rounded-2">
              {statusCounts[status]}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * SearchInput component for filtering invitations by keyword
 */
const SearchInput = ({ searchKeyword, onSearchChange }) => (
  <div className="col-lg-4 col-md-6 col-sm-6 col-12 my-lg-0 my-3 pe-lg-0">
    <div className="input-group p-2 search-wrapper">
      <span className="input-group-text pt-0 pb-0 bg-transparent border-0" id="basic-addon1">
        <img src={searchIcon} width={16} height={16} alt="Search" className="search-icon-filter" />
      </span>
      <input
        type="text"
        className="form-control p-0 font-12 custom-search-input"
        id="floatingInputGroup1"
        placeholder="Search..."
        value={searchKeyword}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search job invitations"
      />
    </div>
  </div>
);

/**
 * Modal for confirming job invitation acceptance
 */
const AcceptConfirmationModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  invitation,
  isProcessing,
}) => (
  <Modal
    open={show}
    onClose={onClose}
    aria-labelledby="accept-modal-title"
    aria-describedby="accept-modal-description"
  >
    <Box className="dark-modal-box" sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: 500 },
      bgcolor: '#020617', // mainBg
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.07)', // mediumBorder
      boxShadow: 24,
      p: 4,
      color: '#ffffff'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6" id="accept-modal-title" sx={{ color: '#ffffff' }}>
          Confirm Job Acceptance
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          aria-label="Close accept modal"
          sx={{ color: '#a1a1aa' }}
        >
          <MdClose />
        </IconButton>
      </div>
      
      {invitation && (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#d4d4d8' }}>
            Are you sure you want to accept this job invitation?
          </Typography>
          
          <div className="confirmation-details p-3 mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#ffffff' }}>
              <strong style={{ color: '#a1a1aa' }}>Job Title:</strong> {invitation.buyer_request?.title || 'N/A'}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Client:</strong> {invitation.client?.fname} {invitation.client?.lname}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Price:</strong> ${invitation.buyer_request?.price?.toLocaleString() || 'N/A'}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: '#d4d4d8', mb: 0 }}>
              <strong style={{ color: '#a1a1aa' }}>Due Date:</strong> {invitation?.created_at 
                ? format(new Date(invitation.created_at), 'MMM dd, yyyy')
                : 'N/A'}
            </Typography>
          </div>
          
          <Typography variant="body2" sx={{ mb: 3, color: '#71717a' }}>
            By accepting, you're committing to complete this job according to the client's requirements.
          </Typography>
        </>
      )}
      
      <div className="d-flex justify-content-end gap-2">
        <MuiButton
          variant="outlined"
          onClick={onClose}
          disabled={isProcessing}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', color: '#d4d4d8', '&:hover': { borderColor: '#d4d4d8' } }}
        >
          Cancel
        </MuiButton>
        <MuiButton
          variant="contained"
          onClick={onConfirm}
          disabled={isProcessing}
          sx={{ bgcolor: '#f0591f', color: '#ffffff', '&:hover': { bgcolor: '#d04815' } }}
        >
          {isProcessing ? (
            <>
              <Spinner size="sm" className="me-2" />
              Accepting...
            </>
          ) : (
            'Confirm Acceptance'
          )}
        </MuiButton>
      </div>
    </Box>
  </Modal>
);

/**
 * InvitationCard component to display individual job invitation
 */
const InvitationCard = ({ 
  invitation, 
  onAccept, 
  onReject, 
  onStartChat, 
  onViewDetails,
  isProcessing,
}) => {
  const clientName = `${invitation?.client?.fname || ''} ${invitation?.client?.lname || ''}`;
  const bdName = `${invitation?.bd?.fname || ''} ${invitation?.bd?.lname || ''}`;
  const jobTitle = invitation?.buyer_request?.title || 'Untitled Job';
  const jobDescription = invitation?.buyer_request?.description || 'No description provided';
  const jobPrice = invitation?.buyer_request?.price?.toLocaleString() || 'N/A';
  const dueDate = invitation?.created_at
    ? format(new Date(invitation.created_at), 'MMM dd, yyyy')
    : 'N/A';

  return (
    <div className="invitation-card p-3 mt-2">
      <div className="d-flex flex-wrap">
        <img
          src={invitation?.client?.image || defaultAvatar}
          width={60}
          height={60}
          className="rounded-circle flex-shrink-0 border-light-custom"
          alt={clientName}
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        <div className="ms-3 flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="invitation-title fw-semibold mb-1">
                {jobTitle}
              </h5>
              <p className="invitation-description mb-1">
                {jobDescription}
              </p>
              <div className="invitation-meta">
                <small className="d-block mb-1">
                  <strong>Client:</strong> {clientName}
                </small>
                <small className="d-block mb-1">
                  <strong>Invited By:</strong> {bdName}
                </small>
                <small className="date-text">
                  {format(new Date(invitation?.created_at), 'MMM dd, yyyy')}
                </small>
              </div>
            </div>
            <div className="ms-3">
              <Badge bg={getStatusBadgeVariant(invitation.status)} className="status-badge">
                {invitation.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-3 flex-wrap align-items-center">
        <div className="d-flex gap-2 flex-wrap action-buttons">
          <Button
            size="sm"
            variant="outline-light"
            className="poppins px-4 fw-normal font-16 w-auto custom-btn-outline"
            onClick={() => onViewDetails(invitation)}
          >
            <FaEye className="me-1" />
            View Details
          </Button>
          
          <Button
            size="sm"
            variant="outline-light"
            className="poppins px-4 fw-normal font-16 w-auto custom-btn-outline"
            onClick={() => onStartChat(invitation.bd, invitation)}
          >
            <FaRegEnvelope className="me-1" />
            Chat
          </Button>
          
          {invitation.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="poppins px-4 fw-normal font-16 w-auto custom-btn-primary"
                onClick={() => onAccept(invitation)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FaCheck className="me-1" />
                    Accept
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline-danger"
                className="poppins px-4 fw-normal font-16 w-auto custom-btn-danger"
                onClick={() => onReject(invitation.id)}
                disabled={isProcessing}
              >
                <FaTimes className="me-1" />
                Reject
              </Button>
            </>
          )}
        </div>
        
        <div className="invitation-details d-flex flex-wrap gap-2 mt-2 mt-lg-0">
          <span className="detail-badge">
            <FaDollarSign className="me-1 accent-icon" />
            {jobPrice}
          </span>
          <span className="detail-badge">
            <FaCalendarAlt className="me-1 accent-icon" />
            Due: {dueDate}
          </span>
          <span className="detail-badge">
            {calculateDuration(invitation?.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal for rejecting a job invitation with reason
 */
const RejectModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  rejectReason, 
  setRejectReason, 
  isProcessing,
}) => (
  <Modal
    open={show}
    onClose={onClose}
    aria-labelledby="reject-modal-title"
    aria-describedby="reject-modal-description"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: 400 },
      bgcolor: '#020617',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      boxShadow: 24,
      p: 4,
      color: '#ffffff'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6" id="reject-modal-title" sx={{ color: '#ffffff' }}>
          Reject Job Invitation
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ color: '#a1a1aa' }}
        >
          <MdClose />
        </IconButton>
      </div>
      
      <Typography variant="body2" sx={{ mb: 3, color: '#71717a' }} id="reject-modal-description">
        Please provide a reason for rejecting this invitation.
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Reason for Rejection"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="e.g., Budget doesn't match my rates, Timeline is too tight..."
        variant="outlined"
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: '#d4d4d8',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.06)' },
            '&:hover fieldset': { borderColor: '#f0591f' },
            '&.Mui-focused fieldset': { borderColor: '#f0591f' },
          },
          '& .MuiInputLabel-root': { color: '#a1a1aa' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#f0591f' }
        }}
      />
      
      <div className="d-flex justify-content-end gap-2">
        <MuiButton
          variant="outlined"
          onClick={onClose}
          disabled={isProcessing}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', color: '#d4d4d8', '&:hover': { borderColor: '#d4d4d8' } }}
        >
          Cancel
        </MuiButton>
        <MuiButton
          variant="contained"
          color="error"
          onClick={onSubmit}
          disabled={!rejectReason.trim() || isProcessing}
          sx={{ bgcolor: '#dc3545' }}
        >
          {isProcessing ? (
            <>
              <Spinner size="sm" className="me-2" />
              Submitting...
            </>
          ) : (
            'Submit Rejection'
          )}
        </MuiButton>
      </div>
    </Box>
  </Modal>
);

/**
 * Modal for displaying detailed invitation information
 */
const InvitationDetailsModal = ({ 
  invitation, 
  show, 
  onClose,
}) => {
  if (!invitation) return null;

  const clientName = `${invitation.client?.fname || ''} ${invitation.client?.lname || ''}`;
  const bdName = `${invitation.bd?.fname || ''} ${invitation.bd?.lname || ''}`;
  const jobTitle = invitation.buyer_request?.title || 'N/A';
  const jobDescription = invitation.buyer_request?.description || 'N/A';
  const jobPrice = invitation.buyer_request?.price?.toLocaleString() || 'N/A';
  const dueDate = invitation.offer?.date 
    ? format(new Date(invitation.offer?.date), 'MMM dd, yyyy')
    : 'N/A';

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="invitation-details-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: '60%' },
        bgcolor: '#020617',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: 24,
        p: 4,
        color: '#ffffff',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)'}}>
          <Typography variant="h5" component="h2" sx={{ color: '#ffffff' }}>
            Job Invitation Details
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#a1a1aa' }}
          >
            <MdClose />
          </IconButton>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <Typography variant="h6" gutterBottom sx={{ color: '#f0591f' }}>
              Job Information
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Title:</strong> {jobTitle}
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Description:</strong> {jobDescription}
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Price:</strong> ${jobPrice}
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Due Date:</strong> {dueDate}
            </Typography>
          </div>
          
          <div className="col-md-6 mb-4">
            <Typography variant="h6" gutterBottom sx={{ color: '#f0591f' }}>
              Client Information
            </Typography>
            <div className="d-flex align-items-center mb-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <img
                src={invitation.client?.image || defaultAvatar}
                width={60}
                height={60}
                className="rounded-circle me-3"
                alt={clientName}
                onError={(e) => e.target.src = defaultAvatar}
              />
              <div>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>
                  {clientName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#71717a' }}>
                  Invited by: {bdName}
                </Typography>
              </div>
            </div>
            
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Status:</strong> 
              <Badge bg={getStatusBadgeVariant(invitation.status)} className="ms-2">
                {invitation.status}
              </Badge>
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
              <strong style={{ color: '#a1a1aa' }}>Invitation Date:</strong> {format(new Date(invitation.created_at), 'MMM dd, yyyy hh:mm a')}
            </Typography>
            
            {invitation.status === 'rejected' && invitation.rejectReason && (
              <Typography variant="body1" paragraph sx={{ color: '#d4d4d8' }}>
                <strong style={{ color: '#a1a1aa' }}>Rejection Reason:</strong> {invitation.rejectReason}
              </Typography>
            )}
          </div>
        </div>
        
        <div className="d-flex justify-content-end mt-2 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)'}}>
          <MuiButton 
            variant="contained" 
            onClick={onClose}
            sx={{ bgcolor: '#f0591f', '&:hover': { bgcolor: '#d04815' } }}
          >
            Close
          </MuiButton>
        </div>
      </Box>
    </Modal>
  );
};

/**
 * Main JobInvitationsPage component
 */
const JobInvitationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { 
    invitations = [], 
    isLoadingInvitations, 
    error,
  } = useSelector(state => state.jobInvitation);
  const { 
    error: conversationError,
  } = useSelector(state => state.message);
  
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedInvitationForAccept, setSelectedInvitationForAccept] = useState(null);

  // Local state
  const [processingInvitations, setProcessingInvitations] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedInvitationId, setSelectedInvitationId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedInvitationForDetails, setSelectedInvitationForDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark', // Updated to dark
    });
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  // PERF STARTUP: Defer fetchJobInvitations
  useEffect(() => {
    const fetchInvitations = () => {
      dispatch(fetchJobInvitations());
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchInvitations, { timeout: 500 });
    } else {
      setTimeout(fetchInvitations, 0);
    }
  }, [dispatch]);

  // Redirect to login when unauthenticated (401)
  useEffect(() => {
    if (!error) return;
    const msg = (typeof error === 'string' ? error : '').toLowerCase();
    if (msg.includes('unauthenticated') || msg.includes('please log in') || msg.includes('authentication required')) {
      toast.error('Please log in to view job invitations.', { theme: 'dark' });
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  // Handle conversation errors
  useEffect(() => {
    if (conversationError) {
      showToast(conversationError, 'error');
      dispatch(clearConversationError());
    }
  }, [conversationError, dispatch, showToast]);

  // Filter and paginate invitations
  // Filter, Sort, and paginate invitations
  const { visibleData, totalPages } = useMemo(() => {
    // 1. Redux array ki copy banayein taake state directly mutate na ho
    let filtered = [...invitations];

    // 2. LATEST FIRST SORTING LOGIC YAHAN HAI
    // created_at date ko compare karke descending order mein sort karein
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 3. Search Keyword ke hisaab se filter karein
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(({ buyer_request, client }) => {
        const title = buyer_request?.title?.toLowerCase() || '';
        const description = buyer_request?.description?.toLowerCase() || '';
        const clientName = `${client?.fname || ''} ${client?.lname || ''}`.toLowerCase();
        
        return title.includes(search) || 
               description.includes(search) || 
               clientName.includes(search);
      });
    }

    // 4. Status ke hisaab se filter karein
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // 5. Pagination apply karein
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    return {
      visibleData: filtered.slice(start, end),
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    };
  }, [invitations, debouncedSearch, statusFilter, currentPage]);

  // Calculate status counts
  const statusCounts = useMemo(() => ({
    all: invitations.length,
    pending: invitations.filter(inv => inv.status === 'pending').length,
    accepted: invitations.filter(inv => inv.status === 'accepted').length,
    rejected: invitations.filter(inv => inv.status === 'rejected').length,
  }), [invitations]);


  const handleAcceptClick = useCallback((invitation) => {
    setSelectedInvitationForAccept(invitation);
    setShowAcceptModal(true);
  }, []);

  const handleConfirmAccept = useCallback(async () => {
    if (!selectedInvitationForAccept?.id) return;
    
    const invitationId = selectedInvitationForAccept.id;
    if (processingInvitations.includes(invitationId)) return;
    
    setProcessingInvitations(prev => [...prev, invitationId]);
    
    try {
      const result = await dispatch(acceptJobInvitation(invitationId)).unwrap();
      dispatch(fetchJobInvitations());
      showToast(result?.message || 'Job invitation accepted successfully!', 'success');
      setShowAcceptModal(false);
      setSelectedInvitationForAccept(null);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      const msg = typeof error === 'string' ? error : (error?.message || 'Failed to accept invitation. Please try again.');
      showToast(msg, 'error');
    } finally {
      setProcessingInvitations(prev => prev.filter(id => id !== invitationId));
    }
  }, [dispatch, processingInvitations, selectedInvitationForAccept, showToast]);

  // Handle rejecting an invitation
  const handleReject = useCallback(async () => {
    if (!selectedInvitationId || !rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }
    
    setProcessingInvitations(prev => [...prev, selectedInvitationId]);
    
    try {
      const result = await dispatch(rejectJobInvitation({ 
        invitationId: selectedInvitationId, 
        reason: rejectReason.trim(),
      })).unwrap();
      
      showToast(result?.message || 'Job invitation rejected successfully!', 'success');
      setRejectReason('');
      setSelectedInvitationId(null);
      setShowRejectModal(false);
      dispatch(fetchJobInvitations());
    } catch (error) {
      showToast(error?.message || 'Failed to reject invitation', 'error');
    } finally {
      setProcessingInvitations(prev => prev.filter(id => id !== selectedInvitationId));
    }
  }, [dispatch, selectedInvitationId, rejectReason, showToast]);

  const openRejectModal = useCallback((id) => {
    setSelectedInvitationId(id);
    setShowRejectModal(true);
  }, []);

  const closeRejectModal = useCallback(() => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedInvitationId(null);
  }, []);

  // Start chat with client
  const handleStartChat = useCallback(async (client, invitation) => {
    if (!client?.id || !invitation?.id) return;
    
    setSelectedClient(client);
    dispatch(clearConversationError());
    
    try {
      const response = await dispatch(createOrFindConversation({
        participantId: client.id,
        jobInvitationId: invitation.id,
        initialMessage: `Hi! I'd like to discuss your job invitation for "${invitation.buyer_request?.title || 'this project'}"`,
      })).unwrap();

      dispatch(setSelectedConversation(response));
      setShowChatModal(true);
      showToast('Chat started successfully!', 'success');
    } catch (error) {
      console.error('Error starting chat:', error);
      showToast('Failed to start conversation. Please try again.', 'error');
    }
  }, [dispatch, showToast]);

  const handleViewDetails = useCallback((invitation) => {
    setSelectedInvitationForDetails(invitation);
    setShowDetailsModal(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedInvitationForDetails(null);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchKeyword(value);
  }, []);

  const handlePageChange = useCallback((_, value) => {
    setCurrentPage(value);
  }, []);

  if (isLoadingInvitations && !invitations.length) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#020617' }}>
        <Spinner animation="border" role="status" size="lg" style={{ color: '#f0591f' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    const isAuthError = /unauthenticated|please log in|authentication required/i.test(typeof error === 'string' ? error : '');
    return (
      <>
        <Navbar FirstNav="none" />
        <div className="container mt-5 userByerMain p-4">
          <Alert variant="danger" className="dark-alert">
            <Alert.Heading>Could not load job invitations</Alert.Heading>
            <p className="mb-0 text-light">{typeof error === 'string' ? error : 'Something went wrong. Please try again.'}</p>
            <div className="mt-3 d-flex gap-2 flex-wrap">
              {isAuthError ? (
                <Button variant="primary" className="custom-btn-primary" onClick={() => navigate('/login', { replace: true })}>
                  Log in
                </Button>
              ) : (
                <Button variant="outline-light" className="custom-btn-outline" onClick={() => dispatch(fetchJobInvitations())}>
                  Try again
                </Button>
              )}
            </div>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar FirstNav="none" />
      
      <main className="container-fluid pt-5 mb-5 userByerMain">
        <h1 className="byerLine font-20 font-500 cocon ms-lg-4 mb-4">
          Job Invitations
        </h1>
        <div className="main-content-card rounded-4 p-4">
          <div className="row mb-4">
            <StatusFilterTabs 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              statusCounts={statusCounts}
            />
            <SearchInput 
              searchKeyword={searchKeyword}
              onSearchChange={handleSearchChange}
            />
          </div>

          <hr className="section-divider" />

          <section className="invitations-container" aria-live="polite">
            {visibleData.length === 0 ? (
              <div className="text-center py-5">
                <Typography variant="h6" sx={{ color: '#a1a1aa' }}>
                  {debouncedSearch ? 'No invitations found' : 'No Invites Yet?'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#71717a' }}>
                  {debouncedSearch ? 'Try adjusting your search terms' : "Don't worry, good things take time!"}
                </Typography>
              </div>
            ) : (
              visibleData.map((invitation) => (
               <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptClick}
                  onReject={openRejectModal}
                  onStartChat={handleStartChat}
                  onViewDetails={handleViewDetails}
                  isProcessing={processingInvitations.includes(invitation.id)}
                />
              ))
            )}
          </section>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  shape="rounded"
                  page={currentPage}
                  onChange={handlePageChange}
                  className="custom-pagination"
                  aria-label="Invitations pagination"
                />
              </Stack>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      <RejectModal
        show={showRejectModal}
        onClose={closeRejectModal}
        onSubmit={handleReject}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isProcessing={processingInvitations.includes(selectedInvitationId)}
      />

      {/* Details Modal */}
      <InvitationDetailsModal
        invitation={selectedInvitationForDetails}
        show={showDetailsModal}
        onClose={closeDetailsModal}
      />

      {/* Chat Offcanvas */}
      <Offcanvas 
        show={showChatModal} 
        onHide={() => setShowChatModal(false)}
        placement="end"
        className="chat-offcanvas dark-offcanvas"
        aria-labelledby="chat-offcanvas-title"
      >
        <Offcanvas.Header closeButton className="dark-offcanvas-header border-bottom-dark">
          <Offcanvas.Title id="chat-offcanvas-title" className="text-white">
            Chat with {selectedClient?.fname} {selectedClient?.lname}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column dark-offcanvas-body">
          <div className="flex-grow-1">
            <Chating />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Accept Confirmation Modal */}
      <AcceptConfirmationModal
        show={showAcceptModal}
        onClose={() => {
          setShowAcceptModal(false);
          setSelectedInvitationForAccept(null);
        }}
        onConfirm={handleConfirmAccept}
        invitation={selectedInvitationForAccept}
        isProcessing={processingInvitations.includes(selectedInvitationForAccept?.id)}
      />

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Updated to dark
      />

      {/* ======================================= */}
      {/* GRAPETASK DARK THEME - CORE STYLES        */}
      {/* ======================================= */}
      <style>{`
        /* Global Backgrounds & Typography */
        .userByerMain {
          background-color: #020617; /* mainBg */
          min-height: calc(100vh - 56px);
          color: #d4d4d8; /* lightGrayHover */
          font-family: 'Poppins', sans-serif;
        }
        
        .byerLine {
          color: #ffffff !important; /* pureWhite */
          letter-spacing: 0.5px;
        }

        /* Main Container Card */
        .main-content-card {
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
        }
        
        /* Navigation Tabs (Filter) */
        .custom-nav-pills .nav-link {
          color: #a1a1aa; /* mediumGrayTitle */
          font-weight: 500;
          padding: 12px 24px;
          border-bottom: 3px solid transparent;
          background: none;
          border-radius: 0;
          transition: all 0.3s ease;
        }
        
        .custom-nav-pills .nav-link.active {
          background-color: transparent;
          color: #f0591f; /* primaryOrange */
          border-bottom-color: #f0591f;
        }
        
        .custom-nav-pills .nav-link:hover:not(.active) {
          color: #d4d4d8; /* lightGrayHover */
          background-color: rgba(255, 255, 255, 0.04); /* cardBgActive */
        }
        
        /* Badge Count */
        .badge-count {
          background-color: #f0591f; /* primaryOrange */
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 8px;
          min-width: 24px;
          text-align: center;
          box-shadow: 0 0 10px rgba(240, 89, 31, 0.3);
        }
        
        /* Search Input */
        .search-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .search-wrapper:focus-within {
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          box-shadow: 0 0 0 3px rgba(240, 89, 31, 0.1);
        }
        .custom-search-input {
          background: transparent !important;
          border: none !important;
          color: #ffffff !important; /* pureWhite */
          box-shadow: none !important;
        }
        .custom-search-input::placeholder {
          color: #71717a !important; /* bodyGrayText */
        }
        .search-icon-filter {
          filter: invert(0.6) sepia(1) saturate(0) hue-rotate(0deg); /* Make it gray */
        }

        /* Divider */
        .section-divider {
          opacity: 1;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.07); /* mediumBorder */
          border: none;
          margin: 2rem 0;
        }
        
        /* Invitation Cards */
        .invitation-card {
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 1.25rem;
          position: relative;
          overflow: hidden;
        }
        
        .invitation-card:hover {
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.05); /* secondaryBlueBlur */
          transform: translateY(-3px);
        }
        
        .invitation-title {
          color: #ffffff; /* pureWhite */
          font-size: 1.15rem;
          line-height: 1.4;
          letter-spacing: 0.3px;
        }
        
        .invitation-description {
          color: #71717a; /* bodyGrayText */
          font-size: 0.95rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .invitation-meta small {
          font-size: 0.85rem;
          color: #a1a1aa; /* mediumGrayTitle */
        }
        .invitation-meta small strong {
          color: #d4d4d8; /* lightGrayHover */
          font-weight: 500;
        }
        .date-text {
          color: #71717a !important; /* bodyGrayText */
          margin-top: 4px;
        }
        
        /* Badges & Micro details */
        .detail-badge {
          background-color: rgba(255, 255, 255, 0.04);
          color: #d4d4d8 !important; /* lightGrayHover */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        .accent-icon {
          color: #f0591f; /* primaryOrange */
        }
        
        /* Buttons */
        .custom-btn-primary {
          background-color: #f0591f !important;
          border-color: #f0591f !important;
          color: #ffffff !important;
          transition: all 0.3s ease;
        }
        .custom-btn-primary:hover:not(:disabled) {
          background-color: #d04815 !important; /* Darker orange */
          box-shadow: 0 4px 12px rgba(240, 89, 31, 0.3);
        }
        
        .custom-btn-outline {
          color: #d4d4d8 !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          background: transparent;
        }
        .custom-btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: #d4d4d8 !important;
          color: #ffffff !important;
        }
        
        .custom-btn-danger {
          color: #ff6b6b !important;
          border-color: rgba(255, 107, 107, 0.3) !important;
        }
        .custom-btn-danger:hover {
          background-color: rgba(255, 107, 107, 0.1) !important;
          border-color: #ff6b6b !important;
        }
        
        /* Image Borders */
        .border-light-custom {
          border: 2px solid rgba(255, 255, 255, 0.06);
          padding: 2px;
          background: #020617;
        }

        /* Material UI Pagination Override */
        .custom-pagination .MuiPaginationItem-root {
          color: #a1a1aa !important; /* mediumGrayTitle */
          border-color: rgba(255, 255, 255, 0.06) !important;
        }
        .custom-pagination .MuiPaginationItem-root:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        .custom-pagination .MuiPaginationItem-root.Mui-selected {
          background-color: #f0591f !important; /* primaryOrange */
          color: #ffffff !important;
        }

        /* Offcanvas Overrides */
        .dark-offcanvas {
          background-color: #020617 !important;
          border-left: 1px solid rgba(255, 255, 255, 0.07) !important;
        }
        .border-bottom-dark {
          border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
        }
        .dark-offcanvas .btn-close {
          filter: invert(1) grayscale(100%) brightness(200%);
        }
        
        .chat-offcanvas {
          width: 450px !important;
        }

        /* Alerts */
        .dark-alert {
          background-color: rgba(220, 53, 69, 0.1) !important;
          border-color: rgba(220, 53, 69, 0.3) !important;
          color: #ff6b6b !important;
        }
        
        @media (max-width: 768px) {
          .chat-offcanvas {
            width: 100% !important;
          }
          .custom-nav-pills .nav-link {
            padding: 8px 12px;
            font-size: 0.875rem;
          }
          .action-buttons {
            width: 100%;
          }
          .action-buttons > button {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
};

export default JobInvitationsPage;