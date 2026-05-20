import {
  Add,
  CheckCircle,
  Delete,
  Edit,
  Error as ErrorIcon,
  MoreVert,
  Visibility,
  WarningAmber as WarningIcon,
  Share, // <-- Naya Share Icon Import Kiya Hai
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Social Icons Import Kiye Hain Share Modal Ke Liye
import { FaFacebook, FaWhatsapp, FaTwitter, FaLinkedin, FaCopy, FaTimes } from "react-icons/fa";

import { GigDelete } from "../redux/slices/gigsSlice";
import { getPersonalGigs } from "../redux/slices/offersSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { titleToSlug, getGigThumbnail } from "../utils/helpers";
import Navbar from "./Navbar";

// --- Constants ---
const STATUS_CONFIG = {
  active: {
    color: "success",
    label: "Active",
    icon: <CheckCircle fontSize="small" />,
  },
  draft: { color: "default", label: "Draft", icon: <Edit fontSize="small" /> },
  paused: {
    color: "warning",
    label: "Paused",
    icon: <WarningIcon fontSize="small" />,
  },
  rejected: {
    color: "error",
    label: "Rejected",
    icon: <ErrorIcon fontSize="small" />,
  },
  published: {
    color: "success",
    label: "Published",
    icon: <CheckCircle fontSize="small" />,
  },
  publish: {
    color: "success",
    label: "Published",
    icon: <CheckCircle fontSize="small" />,
  },
};

const DEFAULT_IMAGE = "https://via.placeholder.com/80";

// --- Memoized Components ---
const StatusChip = memo(({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  
  const getChipColor = () => {
    switch(status) {
      case "active":
      case "published":
      case "publish":
        return { bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.3)" };
      case "draft":
        return { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", border: "1px solid rgba(251, 191, 36, 0.3)" };
      case "paused":
        return { bg: "rgba(241, 186, 62, 0.15)", color: "#f1ba3e", border: "1px solid rgba(241, 186, 62, 0.3)" };
      case "rejected":
        return { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)" };
    }
  };
  
  const chipColor = getChipColor();

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      sx={{
        background: chipColor.bg,
        color: chipColor.color,
        border: chipColor.border,
        fontWeight: "700",
        fontSize: "0.85rem"
      }}
      size="small"
    />
  );
});

const GigRow = memo(({ gig, onMenuOpen }) => {
  const handleMenuClick = useCallback(
    (event) => {
      onMenuOpen(event, gig);
    },
    [gig, onMenuOpen],
  );

  return (
    <TableRow hover sx={{ "&:hover": { background: "rgba(240, 89, 31, 0.06)" } }}>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              getGigThumbnail(gig.media) || DEFAULT_IMAGE
            }
            alt={gig.title}
            loading="lazy"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
              marginRight: 12,
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "700", color: "#e2e8f0" }} noWrap>
              {gig.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "#71717a" }}>
              ID: {gig.id}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <StatusChip status={gig.status} />
      </TableCell>
      <TableCell sx={{ color: "#e2e8f0", fontWeight: "700" }}>${gig.packages?.[0]?.total || 0}</TableCell>
      <TableCell sx={{ color: "#cbd5e1" }}>{gig.orders || 0}</TableCell>
      <TableCell sx={{ color: "#fbbf24", fontWeight: "700" }}>{gig.ratings_avg_ratings || "-"}</TableCell>
      <TableCell align="center">
        <IconButton size="small" onClick={handleMenuClick} sx={{ color: "#71717a", "&:hover": { color: "#f0591f" } }}>
          <MoreVert />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

const StatsCard = memo(({ value, label, color = "primary" }) => (
  <Card sx={{ 
    p: 3, 
    textAlign: "center", 
    height: "100%",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      border: "1px solid rgba(240, 89, 31, 0.4)",
      background: "rgba(240, 89, 31, 0.05)"
    }
  }}>
    <Typography variant="h4" sx={{ color: color === "primary" ? "#f0591f" : color === "success" ? "#22c55e" : color === "warning" ? "#fbbf24" : "#a1a1aa", fontWeight: "800", mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="body2" sx={{ color: "#71717a", fontSize: "0.9rem" }}>
      {label}
    </Typography>
  </Card>
));

const EmptyState = memo(({ onCreateNew }) => (
  <TableRow>
    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ color: "#cbd5e1", gutterBottom: true }}>
        No gigs found
      </Typography>
      <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
        Create your first gig to start selling your services.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreateNew}
        sx={{
          background: "linear-gradient(135deg, #f0591f, #e64d18)",
          "&:hover": { background: "linear-gradient(135deg, #e64d18, #d94410)" },
          color: "#fff",
          fontWeight: "700"
        }}
      >
        Create Your First Gig
      </Button>
    </TableCell>
  </TableRow>
));

// --- Main Component ---
const GigsManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store data
  const { personalGigs, loading } = useSelector((state) => state.offers);

  // UI state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGig, setSelectedGig] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 🔥 Share Modal States 🔥
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copyText, setCopyText] = useState("Copy");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // PERF STARTUP: Defer localStorage read to avoid blocking render
  const [UserData, setUserData] = useState(null);
  useEffect(() => {
    const readUserData = () => {
      try {
        const data = JSON.parse(localStorage.getItem("UserData"));
        setUserData(data);
      } catch {
        setUserData(null);
      }
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(readUserData, { timeout: 0 });
    } else {
      setTimeout(readUserData, 0);
    }
  }, []);

  const { publishedCount, draftCount, totalOrders } = useMemo(() => {
    const published = personalGigs.filter(
      (g) => ["published", "publish", "active"].includes(g?.status?.toLowerCase()),
    ).length;
    const draft = personalGigs.filter((g) => g?.status?.toLowerCase() === "draft").length;
    const orders = personalGigs.reduce((acc, g) => acc + (g.orders || 0), 0);

    return {
      publishedCount: published,
      draftCount: draft,
      totalOrders: orders,
    };
  }, [personalGigs]);

  // --- Event Handlers ---
  const handleMenuOpen = useCallback((event, gig) => {
    setAnchorEl(event.currentTarget);
    setSelectedGig(gig);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const getSellerName = useCallback((seller) => {
    if (Array.isArray(seller)) {
      return seller[0]?.fname || "seller";
    }
    return seller?.fname || "seller";
  }, []);

  const handleView = useCallback(() => {
    if (selectedGig) {
      const slug = titleToSlug(selectedGig.title);
      const sellerName = getSellerName(selectedGig.seller);
      navigate(`/g/${slug}/${sellerName}/${selectedGig.id}`);
    }
    setAnchorEl(null);
    setSelectedGig(null);
  }, [selectedGig, getSellerName, navigate]);

  const handleEdit = useCallback(() => {
    if (selectedGig) {
      navigate("/multiSteps", {
        state: { gig: selectedGig, isEditMode: true, gig_id: selectedGig.id },
      });
    }
    setAnchorEl(null);
    setSelectedGig(null);
  }, [selectedGig, navigate]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  }, []);

  // 🔥 Share Gig Logic 🔥
  const handleShareClick = useCallback(() => {
    setShareModalOpen(true);
    setAnchorEl(null);
  }, []);

  const handleShareModalClose = useCallback(() => {
    setShareModalOpen(false);
  }, []);

  // URL generator helper
  const getGigUrl = () => {
    if (!selectedGig) return "";
    const slug = titleToSlug(selectedGig.title);
    const sellerName = getSellerName(selectedGig.seller);
    const baseUrl = window.location.origin; // Dynamically gets https://portal.grapetask.co
    return `${baseUrl}/g/${slug}/${sellerName}/${selectedGig.id}`;
  };

  const handleSocialShare = (platform) => {
    const url = getGigUrl();
    const encodedLink = encodeURIComponent(url);
    const text = encodeURIComponent(`Check out this amazing gig on GrapeTask: ${selectedGig?.title}`);

    let shareUrl = "";
    if (platform === "facebook") shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    if (platform === "whatsapp") shareUrl = `https://api.whatsapp.com/send?text=${text} ${encodedLink}`;
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${text}`;
    if (platform === "linkedin") shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;

    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  const handleCopyLink = () => {
    const url = getGigUrl();
    navigator.clipboard.writeText(url);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 2000);
  };
  // 🔥 End Share Gig Logic 🔥

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedGig) {
      toast.error("No gig selected for deletion");
      return;
    }
    try {
      setActionLoading(true);
      await dispatch(GigDelete(selectedGig.id)).unwrap();
      toast.success("Gig deleted successfully");
      setSnackbar({ open: true, message: "Gig deleted successfully", severity: "success" });
      setDeleteDialogOpen(false);
      setSelectedGig(null);
    } catch (error) {
      toast.error(error?.message || error || "Failed to delete gig");
      setSnackbar({ open: true, message: error?.message || error || "Failed to delete gig", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  }, [selectedGig, dispatch]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedGig(null);
  }, []);

  const handleCreateNew = useCallback(() => {
    navigate("/multiSteps");
  }, [navigate]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    if (UserData?.id) {
      dispatch(getPersonalGigs({ user_id: UserData.id }));
    }
  }, [dispatch, UserData?.id]);

  // --- Render ---
  if (loading && personalGigs.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your gigs...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar FirstNav="none" />
      <Box sx={{ 
        p: { xs: 2, md: 3 },
        background: "#020617",
        minHeight: "100vh"
      }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "800", color: "#ffffff", mb: 0.5 }}>
              Manage Gigs
            </Typography>
            <Typography variant="body1" sx={{ color: "#71717a" }}>
              Create, edit, and manage your services
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{
              background: "linear-gradient(135deg, #f0591f, #e64d18)",
              "&:hover": { background: "linear-gradient(135deg, #e64d18, #d94410)" },
              minWidth: "160px",
              color: "#fff",
              fontWeight: "700",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(240, 89, 31, 0.25)"
            }}
          >
            Create New Gig
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard value={personalGigs.length} label="Total Gigs" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard value={publishedCount} label="Published" color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard value={draftCount} label="Drafts" color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard value={totalOrders} label="Total Orders" color="text" />
          </Grid>
        </Grid>

        {/* Gigs Table */}
        <Card sx={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "18px", backdropFilter: "blur(12px)" }}>
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table sx={{ "& .MuiTableCell-head": { color: "#e2e8f0", fontWeight: "700", borderColor: "rgba(255, 255, 255, 0.1)" }, "& .MuiTableRow-hover:hover": { background: "rgba(240, 89, 31, 0.08)" } }}>
              <TableHead>
                <TableRow sx={{ borderBottom: "2px solid rgba(255, 255, 255, 0.1)" }}>
                  <TableCell>Gig</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ "& .MuiTableCell-body": { color: "#cbd5e1", borderColor: "rgba(255, 255, 255, 0.06)" } }}>
                {personalGigs.length === 0 ? (
                  <EmptyState onCreateNew={handleCreateNew} />
                ) : (
                  personalGigs.map((gig) => (
                    <GigRow key={gig.id} gig={gig} onMenuOpen={handleMenuOpen} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionProps={{ timeout: 150 }}
          PaperProps={{
            sx: {
              background: "rgba(12, 21, 37, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)"
            }
          }}
        >
          <MenuItem onClick={handleView} sx={{ color: "#cbd5e1", "&:hover": { background: "rgba(240, 89, 31, 0.1)", color: "#f0591f" } }}>
            <Visibility sx={{ mr: 1 }} fontSize="small" /> View Gig
          </MenuItem>

          {/* 🔥 SHARE GIG BUTTON ADDED HERE 🔥 */}
          <MenuItem onClick={handleShareClick} sx={{ color: "#cbd5e1", "&:hover": { background: "rgba(240, 89, 31, 0.1)", color: "#f0591f" } }}>
            <Share sx={{ mr: 1 }} fontSize="small" /> Share Gig
          </MenuItem>
          {/* 🔥 ----------------------------- 🔥 */}

          <MenuItem onClick={handleEdit} sx={{ color: "#cbd5e1", "&:hover": { background: "rgba(240, 89, 31, 0.1)", color: "#f0591f" } }}>
            <Edit sx={{ mr: 1 }} fontSize="small" /> Edit Gig
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: "#ef4444", "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}>
            <Delete sx={{ mr: 1 }} fontSize="small" /> Delete Gig
          </MenuItem>
        </Menu>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { background: "rgba(12, 21, 37, 0.98)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", backdropFilter: "blur(12px)" }
          }}
        >
          <DialogTitle sx={{ color: "#ffffff", fontWeight: "700" }}>Delete Gig</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#cbd5e1" }}>
              Are you sure you want to delete "{selectedGig?.title}"? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={actionLoading} sx={{ color: "#71717a" }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{ color: "#ef4444", "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: "#ef4444" }} /> : <Delete />}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* 🔥 SHARE DIALOG MODAL 🔥 */}
        <Dialog
          open={shareModalOpen}
          onClose={handleShareModalClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              background: "linear-gradient(145deg, #111827, #020617)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              padding: "10px"
            }
          }}
        >
          <DialogTitle sx={{ color: "#fff", fontWeight: "800", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Share this Gig
            <IconButton onClick={handleShareModalClose} sx={{ color: "#a1a1aa" }}>
              <FaTimes size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#a1a1aa", fontSize: "14px", mb: 3 }}>
              Boost your views by sharing "{selectedGig?.title}" on social media!
            </Typography>

            {/* Social Icons Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", mb: 3 }}>
              <Button onClick={() => handleSocialShare('facebook')} sx={{ background: "rgba(24,119,242,0.1)", color: "#1877F2", border: "1px solid rgba(24,119,242,0.2)", py: 1.5, borderRadius: "14px", minWidth: 0, "&:hover": { background: "rgba(24,119,242,0.2)" } }}>
                <FaFacebook size={24} />
              </Button>
              <Button onClick={() => handleSocialShare('whatsapp')} sx={{ background: "rgba(37,211,102,0.1)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)", py: 1.5, borderRadius: "14px", minWidth: 0, "&:hover": { background: "rgba(37,211,102,0.2)" } }}>
                <FaWhatsapp size={24} />
              </Button>
              <Button onClick={() => handleSocialShare('twitter')} sx={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", py: 1.5, borderRadius: "14px", minWidth: 0, "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
                <FaTwitter size={24} />
              </Button>
              <Button onClick={() => handleSocialShare('linkedin')} sx={{ background: "rgba(10,102,194,0.1)", color: "#0A66C2", border: "1px solid rgba(10,102,194,0.2)", py: 1.5, borderRadius: "14px", minWidth: 0, "&:hover": { background: "rgba(10,102,194,0.2)" } }}>
                <FaLinkedin size={24} />
              </Button>
            </Box>

            {/* Copy Link Input */}
            <Box sx={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", p: 0.5 }}>
              <input 
                type="text" 
                value={getGigUrl()} 
                readOnly 
                style={{ flex: 1, background: "none", border: "none", color: "#d4d4d8", fontSize: "13px", padding: "0 10px", outline: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} 
              />
              <Button 
                onClick={handleCopyLink}
                sx={{ background: "#f0591f", color: "#fff", border: "none", px: 2, py: 1, borderRadius: "8px", fontSize: "13px", fontWeight: "600", textTransform: "none", "&:hover": { background: "#d94410" } }}
                startIcon={<FaCopy size={14} />}
              >
                {copyText}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        {/* 🔥 END SHARE DIALOG 🔥 */}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%", background: snackbar.severity === "success" ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)", color: "#fff" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default memo(GigsManage);