import {
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createOrFindConversation,
  setSelectedConversation,
} from "../redux/slices/messageSlice";
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

const BdReceivedProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Filter by taskId if navigated from BdTaskCreate
  const filterTaskId = location.state?.taskId || new URLSearchParams(location.search).get("taskId");

  const fetchProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = "bd/proposals/received";
      if (filterTaskId) {
        url += `?task_id=${filterTaskId}`;
      }
      const res = await axios.get(url);
      const proposalsData = res.data?.proposals || res.data?.data || res.data || [];
      if (Array.isArray(proposalsData)) {
        setProposals(proposalsData);
      } else {
        setProposals([]);
      }
    } catch (err) {
      console.error(err);
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterTaskId]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleAction = async (proposalId, action) => {
    setActionLoadingId(proposalId);
    const proposal = proposals.find(p => p.id === proposalId) || {};
    try {
      const res = await axios.post("bd/proposals/action", {
        proposal_id: proposalId,
        action: action // "accept" or "reject"
      });
      
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        toast.success(`Proposal ${action}ed successfully!`);
        if (action === "accept") {
          try {
            const expertId = proposal.expert_id;
            
            // Optional: send an initial automated message
            try {
                await axios.post("messages", {
                    message_type: "text",
                    message: `Hi! I have accepted your proposal for the task: ${proposal.task_title}. Let's get started!`,
                    receiver_id: expertId,
                });
            } catch (msgErr) {
                console.error("Failed to send auto message", msgErr);
            }

            // Find or create conversation with the Expert
            const convResponse = await dispatch(
                createOrFindConversation({ participantId: expertId })
            ).unwrap();

            // Set it as active conversation
            dispatch(setSelectedConversation(convResponse));
            
            // Navigate to inbox directly
            setTimeout(() => { 
                navigate(`/Inbox?id=${expertId}`, { 
                  state: { 
                    linkExpertId: expertId, 
                    linkTaskId: proposal.task_id,
                    expertName: proposal.expert_name 
                  } 
                }); 
            }, 1000);
          } catch (convErr) {
             console.error("Failed to setup conversation", convErr);
             // Even if it fails to create conversation locally, still navigate with the ID
             const fallbackId = proposal.expert_id;
             setTimeout(() => { 
                 navigate(`/Inbox?id=${fallbackId}`); 
             }, 1000);
          }
        } else {
          // Refresh list for reject
          fetchProposals();
        }
      } else {
        toast.error(res.data?.message || `Failed to ${action} proposal.`);
      }
    } catch (err) {
      toast.error(`Error processing action. Ensure backend is configured.`);
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ backgroundColor: theme.mainBg, minHeight: '100vh', color: theme.pureWhite }}>
      <Navbar FirstNav="none" />
      <div className="container-fluid py-4 poppins">
        <div className="row justify-content-center">
          
          <div className="col-11 mb-3 d-flex justify-content-between align-items-center">
            <div>
              <Typography variant="h5" className="fw-semibold" style={{ color: theme.pureWhite }}>
                Received Proposals
              </Typography>
              <p className="font-13 mb-0" style={{ color: theme.bodyGrayText }}>
                Review proposals from experts for your posted tasks.
              </p>
            </div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/bd-tasks")}
              style={{
                borderColor: theme.mediumBorder,
                color: theme.pureWhite,
                textTransform: 'none'
              }}
            >
              Back to Tasks
            </Button>
          </div>

          {/* STATS ROW */}
          {!isLoading && proposals.length > 0 && (
            <div className="col-lg-11 col-12 mb-4">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderMid}` }}>
                    <h3 className="mb-1 fw-bold" style={{ color: theme.pureWhite }}>{proposals.length}</h3>
                    <span className="font-12" style={{ color: theme.mediumGrayTitle }}>Total Proposals</span>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.05)', border: `1px solid rgba(251, 191, 36, 0.2)` }}>
                    <h3 className="mb-1 fw-bold" style={{ color: '#fbbf24' }}>{proposals.filter(p => p.status === 'pending' || !p.status).length}</h3>
                    <span className="font-12" style={{ color: '#fbbf24' }}>Pending Review</span>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                    <h3 className="mb-1 fw-bold" style={{ color: '#10b981' }}>{proposals.filter(p => p.status === 'accepted').length}</h3>
                    <span className="font-12" style={{ color: '#10b981' }}>Accepted</span>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: `1px solid rgba(239, 68, 68, 0.2)` }}>
                    <h3 className="mb-1 fw-bold" style={{ color: '#ef4444' }}>{proposals.filter(p => p.status === 'rejected').length}</h3>
                    <span className="font-12" style={{ color: '#ef4444' }}>Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-lg-11 col-12 mt-2">
            {isLoading ? (
              <div className="text-center py-5">
                <CircularProgress size={40} style={{ color: theme.primaryOrange }} />
              </div>
            ) : (
              <div className="row g-3">
                {proposals.map((proposal) => (
                  <div className="col-12" key={proposal.id}>
                    <div className="p-4 rounded-3 d-flex flex-column gap-3 transition-all" 
                         style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
                      
                      <div className="d-flex justify-content-between align-items-start border-bottom pb-3" style={{ borderColor: theme.lightBorder }}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={proposal.expert_image || 'https://via.placeholder.com/48'}
                            alt="Expert"
                            className="rounded-circle object-fit-cover"
                            width="48"
                            height="48"
                            style={{ border: `1px solid ${theme.lightBorder}`, cursor: 'pointer' }}
                            onClick={() => navigate(`/profileOtherPerson/${proposal.expert_id}`)}
                          />
                          <div>
                            <h6 className="mb-0 fw-semibold" style={{ color: theme.pureWhite, cursor: 'pointer' }}
                                onClick={() => navigate(`/profileOtherPerson/${proposal.expert_id}`)}>
                              {proposal.expert_name || "Expert"}
                            </h6>
                            <span className="font-12" style={{ color: theme.darkGrayNumber }}>
                              Applied to: <strong style={{ color: theme.lightGrayHover }}>{proposal.task_title}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="font-18 fw-bold" style={{ color: '#10b981' }}>
                            ${proposal.price}
                          </div>
                          <span className="font-11" style={{ color: theme.darkGrayNumber }}>
                            Delivery: {new Date(proposal.delivery_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-13 fw-semibold mb-2" style={{ color: theme.mediumGrayTitle }}>Cover Letter</h6>
                        <p className="mb-0 font-14" style={{ color: theme.lightGrayHover, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {proposal.cover_letter}
                        </p>
                      </div>

                      <div className="d-flex justify-content-end gap-3 mt-2 pt-3 border-top align-items-center" style={{ borderColor: theme.lightBorder }}>
                        {proposal.status === "pending" || !proposal.status ? (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={actionLoadingId === proposal.id}
                              onClick={() => handleAction(proposal.id, "reject")}
                              style={{
                                borderColor: 'rgba(239, 68, 68, 0.5)',
                                color: '#ef4444',
                                textTransform: 'none',
                                padding: '6px 20px'
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              disabled={actionLoadingId === proposal.id}
                              onClick={() => handleAction(proposal.id, "accept")}
                              style={{
                                backgroundColor: '#10b981',
                                color: theme.pureWhite,
                                textTransform: 'none',
                                padding: '6px 24px',
                                boxShadow: 'none'
                              }}
                            >
                              {actionLoadingId === proposal.id ? <CircularProgress size={20} color="inherit" /> : "Accept & Start Order"}
                            </Button>
                          </>
                        ) : (
                          <div className="px-3 py-1 rounded-pill font-13 fw-semibold" style={{
                            backgroundColor: proposal.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: proposal.status === 'accepted' ? '#10b981' : '#ef4444',
                            border: `1px solid ${proposal.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                          }}>
                            {proposal.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {proposals.length === 0 && (
                  <div className="col-12 text-center py-5 rounded-3" style={{ border: `1px dashed ${theme.mediumBorder}` }}>
                    <Typography className="font-14" style={{ color: theme.bodyGrayText }}>No proposals received yet.</Typography>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BdReceivedProposals;
