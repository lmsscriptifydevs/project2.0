import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  Tabs,
  Tab
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../utils/axios";
import { toast } from "react-toastify";

// --- GRAPETASK DARK THEME ---
const theme = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  pureWhite: "#ffffff",
  pureBlack: "#000000",
  lightGrayHover: "#d4d4d8",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  darkGrayNumber: "#52525b",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  mediumBorder: "rgba(255, 255, 255, 0.07)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  bgcolor: theme.mainBg,
  border: `1px solid ${theme.mediumBorder}`,
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  p: 4,
  color: theme.pureWhite,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    backgroundColor: theme.cardBg,
    borderRadius: '6px',
    fontSize: '13px',
    '& fieldset': { borderColor: theme.mediumBorder, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: theme.lightGrayHover },
    '&.Mui-focused fieldset': { borderColor: theme.primaryOrange, boxShadow: `0 0 0 2px ${theme.secondaryBlueBlur}` },
  },
  '& input': { color: '#ffffff !important' },
  '& textarea': { color: '#ffffff !important' },
  '& .MuiInputBase-input': { padding: '8px 12px' },
};

const ExpertViewBdRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [historyProposals, setHistoryProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [proposalData, setProposalData] = useState({
    price: "",
    deliveryDate: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 0) {
        const res = await axios.get("expert/bd-tasks");
        const tasksData = res.data?.tasks || res.data?.data || res.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } else {
        const res = await axios.get("expert/bd-tasks/history");
        const proposalsData = res.data?.proposals || res.data?.data || res.data || [];
        setHistoryProposals(Array.isArray(proposalsData) ? proposalsData : []);
      }
      
    } catch (err) {
      console.error(err);
      if (activeTab === 0) setTasks([]);
      else setHistoryProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setProposalData({
      price: task.price || "",
      deliveryDate: "",
      coverLetter: "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setProposalData((prev) => ({ ...prev, price: value ? `$${value}` : "" }));
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const requestData = {
      task_id: selectedTask.id,
      price: proposalData.price.replace("$", ""),
      delivery_date: proposalData.deliveryDate,
      cover_letter: proposalData.coverLetter,
    };

    try {
      const res = await axios.post("expert/bd-tasks/proposal", requestData);
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        toast.success("Proposal sent successfully!");
        handleCloseModal();
        fetchTasks();
      } else {
        toast.error(res.data?.message || "Failed to send proposal.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error sending proposal.";
      
      if (errorMessage.includes("Insufficient bids")) {
        toast.error(
          <div>
            {errorMessage}
            <br />
            <Button 
              size="small"
              onClick={() => navigate("/buy-bids")} 
              style={{ color: theme.pureWhite, backgroundColor: theme.primaryOrange, padding: '4px 12px', marginTop: '8px', textTransform: 'none' }}
            >
              Buy Bids
            </Button>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.error(errorMessage);
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customLabelStyle = { color: theme.mediumGrayTitle, fontWeight: 500, fontSize: '13px', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ backgroundColor: theme.mainBg, minHeight: '100vh', color: theme.pureWhite }}>
      <Navbar FirstNav="none" />
      <div className="container-fluid py-4 poppins">
        <div className="row justify-content-center">
          
          <div className="col-11 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <div>
              <Typography variant="h5" className="fw-semibold" style={{ color: theme.pureWhite }}>
                BD Tasks
              </Typography>
              <p className="font-13 mb-0" style={{ color: theme.bodyGrayText }}>View and apply for tasks posted by Business Developers.</p>
            </div>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{
                minHeight: '36px',
                '& .MuiTabs-indicator': { backgroundColor: theme.primaryOrange },
                '& .MuiTab-root': { 
                  color: theme.bodyGrayText, 
                  textTransform: 'none', 
                  minHeight: '36px',
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: '6px 16px'
                },
                '& .Mui-selected': { color: `${theme.pureWhite} !important` }
              }}
            >
              <Tab label="Available Tasks" />
              <Tab label="My Proposals History" />
            </Tabs>
          </div>

          <div className="col-lg-11 col-12 mt-2">
            {isLoading ? (
              <div className="text-center py-5">
                <CircularProgress size={40} style={{ color: theme.primaryOrange }} />
              </div>
            ) : (
              <div className="row g-3">
                {activeTab === 0 ? (
                  <>
                    {tasks.map((task) => (
                      <div className="col-12" key={task.id}>
                        <div className="p-4 rounded-3 d-flex flex-column gap-3 transition-all" 
                             style={{ backgroundColor: theme.cardBg, border: `1px solid ${task.has_applied ? theme.orangeBorderActive : theme.mediumBorder}` }}>
                      
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1 fw-semibold" style={{ color: theme.pureWhite }}>
                            {task.title}
                          </h5>
                          <span className="font-12" style={{ color: theme.darkGrayNumber }}>
                            Posted by {task.bd_name || "BD"} • {task.created_at ? formatDistanceToNow(new Date(task.created_at)) + ' ago' : ''}
                          </span>
                        </div>
                        <span className="rounded-pill px-3 py-1 fw-semibold" style={{ backgroundColor: theme.secondaryBlueBlur, color: '#10b981', fontSize: '14px', border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                          ${task.price}
                        </span>
                      </div>
                      
                      <p className="mb-0" style={{ color: theme.lightGrayHover, fontSize: '14px', lineHeight: 1.6 }}>
                        {task.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-3" style={{ borderColor: theme.lightBorder }}>
                        <div className="font-12" style={{ color: theme.mediumGrayTitle }}>
                          Delivery: <strong style={{ color: theme.pureWhite }}>{new Date(task.delivery_date).toLocaleDateString()}</strong>
                        </div>
                        
                        {task.proposals_count >= 30 ? (
                          <span className="font-12 fw-semibold px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            Offer Expired
                          </span>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            {task.has_applied && (
                              <span className="font-12 fw-semibold px-3 py-1 rounded-pill" style={{ 
                                backgroundColor: task.proposal_status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : 
                                               task.proposal_status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 
                                               'rgba(245, 158, 11, 0.1)', 
                                color: task.proposal_status === 'accepted' ? '#10b981' : 
                                       task.proposal_status === 'rejected' ? '#ef4444' : 
                                       '#f59e0b', 
                                border: `1px solid ${
                                  task.proposal_status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : 
                                  task.proposal_status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 
                                  'rgba(245, 158, 11, 0.2)'
                                }` 
                              }}>
                                {task.proposal_status === 'accepted' ? 'Accepted' : 
                                 task.proposal_status === 'rejected' ? 'Rejected' : 
                                 'Pending Review'}
                              </span>
                            )}
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenModal(task)}
                              style={{
                                backgroundColor: theme.primaryOrange,
                                color: theme.pureWhite,
                                borderRadius: '6px',
                                padding: '6px 20px',
                                fontSize: '13px',
                                textTransform: 'none',
                                boxShadow: 'none'
                              }}
                            >
                              {task.has_applied ? "Send Another Proposal" : "Send Proposal"}
                            </Button>
                          </div>
                        )}
                      </div>
                        </div>
                      </div>
                    ))}
                    
                    {tasks.length === 0 && (
                      <div className="col-12 text-center py-5 rounded-3" style={{ border: `1px dashed ${theme.mediumBorder}` }}>
                        <Typography className="font-14" style={{ color: theme.bodyGrayText }}>No BD tasks available at the moment.</Typography>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {historyProposals.map((proposal) => (
                      <div className="col-12" key={proposal.id}>
                        <div className="p-4 rounded-3 d-flex flex-column gap-3 transition-all" 
                             style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
                          
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-1 fw-semibold" style={{ color: theme.pureWhite }}>
                                {proposal.task_title}
                              </h5>
                              <span className="font-12" style={{ color: theme.darkGrayNumber }}>
                                Posted by {proposal.bd_name || "BD"} • Applied {proposal.created_at ? formatDistanceToNow(new Date(proposal.created_at)) + ' ago' : ''}
                              </span>
                            </div>
                            <span className="rounded-pill px-3 py-1 fw-semibold" style={{ backgroundColor: theme.secondaryBlueBlur, color: '#10b981', fontSize: '14px', border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                              Your Bid: ${proposal.price}
                            </span>
                          </div>
                          
                          <p className="mb-0" style={{ color: theme.lightGrayHover, fontSize: '14px', lineHeight: 1.6 }}>
                            <strong style={{ color: theme.mediumGrayTitle }}>Cover Letter:</strong><br />
                            {proposal.cover_letter}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-3" style={{ borderColor: theme.lightBorder }}>
                            <div className="font-12" style={{ color: theme.mediumGrayTitle }}>
                              Delivery: <strong style={{ color: theme.pureWhite }}>{new Date(proposal.delivery_date).toLocaleDateString()}</strong>
                            </div>
                            
                            <span className="font-12 fw-semibold px-3 py-1 rounded-pill" style={{ 
                              backgroundColor: proposal.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : 
                                             proposal.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 
                                             'rgba(245, 158, 11, 0.1)', 
                              color: proposal.status === 'accepted' ? '#10b981' : 
                                     proposal.status === 'rejected' ? '#ef4444' : 
                                     '#f59e0b', 
                              border: `1px solid ${
                                proposal.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : 
                                proposal.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 
                                'rgba(245, 158, 11, 0.2)'
                              }` 
                            }}>
                              {proposal.status === 'accepted' ? 'Accepted' : 
                               proposal.status === 'rejected' ? 'Rejected' : 
                               'Pending Review'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {historyProposals.length === 0 && (
                      <div className="col-12 text-center py-5 rounded-3" style={{ border: `1px dashed ${theme.mediumBorder}` }}>
                        <Typography className="font-14" style={{ color: theme.bodyGrayText }}>You haven't submitted any proposals yet.</Typography>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="fw-semibold mb-3 border-bottom pb-2" style={{ borderColor: theme.lightBorder }}>
            Send Proposal
          </Typography>
          
          {selectedTask && (
            <div className="mb-3 p-2 rounded" style={{ backgroundColor: theme.cardBgActive }}>
              <Typography className="font-13 fw-semibold text-truncate" style={{ color: theme.pureWhite }}>{selectedTask.title}</Typography>
              <Typography className="font-12" style={{ color: theme.primaryOrange }}>Client Budget: ${selectedTask.price}</Typography>
            </div>
          )}

          <form onSubmit={handleSubmitProposal}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={customLabelStyle}>Your Price ($)</label>
                <TextField
                  size="small"
                  value={proposalData.price}
                  onChange={handlePriceChange}
                  required
                  fullWidth
                  sx={inputSx}
                />
              </div>
              <div className="col-md-6">
                <label style={customLabelStyle}>Delivery Date</label>
                <TextField
                  type="date"
                  size="small"
                  value={proposalData.deliveryDate}
                  onChange={(e) => setProposalData(p => ({ ...p, deliveryDate: e.target.value }))}
                  required
                  fullWidth
                  sx={{
                    ...inputSx, 
                    '& input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(1)' } 
                  }}
                />
              </div>
              <div className="col-12">
                <label style={customLabelStyle}>Cover Letter</label>
                <TextField
                  size="small"
                  multiline
                  rows={4}
                  value={proposalData.coverLetter}
                  onChange={(e) => setProposalData(p => ({ ...p, coverLetter: e.target.value }))}
                  required
                  fullWidth
                  sx={inputSx}
                  placeholder="Explain why you are the best fit for this task..."
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style={{ borderColor: theme.lightBorder }}>
              <Button
                onClick={handleCloseModal}
                style={{ color: theme.lightGrayHover, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                style={{ backgroundColor: theme.primaryOrange, color: theme.pureWhite, textTransform: 'none', boxShadow: 'none' }}
              >
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ExpertViewBdRequests;
