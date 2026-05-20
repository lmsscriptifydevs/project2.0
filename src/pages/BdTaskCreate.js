import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCategory, getSubCategory } from "../redux/slices/gigsSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useUserData } from "../utils/useLocalStorage";
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

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    backgroundColor: theme.cardBg,
    borderRadius: '6px',
    fontSize: '13px',
    minHeight: '38px',
    '& fieldset': { borderColor: theme.mediumBorder, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: theme.lightGrayHover },
    '&.Mui-focused fieldset': { borderColor: theme.primaryOrange, boxShadow: `0 0 0 2px ${theme.secondaryBlueBlur}` },
  },
  '& input': { color: '#ffffff !important' },
  '& textarea': { color: '#ffffff !important' },
  '& .MuiInputBase-input': { padding: '8px 12px', color: '#ffffff !important' },
  '& .MuiSelect-select': { color: '#ffffff !important' },
  '& .MuiSvgIcon-root': { color: theme.mediumGrayTitle, fontSize: '18px' },
};

const menuProps = {
  PaperProps: {
    sx: {
      bgcolor: theme.mainBg,
      border: `1px solid ${theme.lightBorder}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      mt: 1,
      '& .MuiMenuItem-root': {
        color: theme.pureWhite,
        fontSize: '13px',
        py: 1,
        '&:hover': { bgcolor: theme.cardBgActive },
        '&.Mui-selected': { bgcolor: theme.secondaryBlueBlur, color: theme.primaryOrange, fontWeight: 600 },
        '&.Mui-selected:hover': { bgcolor: theme.cardBgActive }
      }
    }
  }
};

const BdTaskCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userCategory, userSubCategory } = useSelector((state) => state.gig);
  const UserData = useUserData();

  const [formState, setFormState] = useState({
    gigTitle: "",
    description: "",
    budget: "",
    delivered: "",
    category: "",
    subCategory: "",
  });
  const [formError, setFormError] = useState("");
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [myTasks, setMyTasks] = useState([]);

  const taskListRef = useRef(null);

  const filteredSubCategories = useMemo(() => {
    const arr = Array.isArray(userSubCategory) ? userSubCategory : [];
    const cat = formState.category;
    return cat ? arr.filter((sub) => parseInt(sub?.category_id) === parseInt(cat)) : [];
  }, [userSubCategory, formState.category]);

  const fetchInitialData = useCallback(() => {
    dispatch(getCategory());
    dispatch(getSubCategory());
    fetchMyTasks();
  }, [dispatch]);

  const fetchMyTasks = async () => {
    try {
      setIsLoadingList(true);
      const res = await axios.get("bd/tasks");
      
      const tasksData = res.data?.tasks || res.data?.data || res.data || [];
      if (Array.isArray(tasksData)) {
        setMyTasks(tasksData);
      } else {
        setMyTasks([]);
      }
    } catch (err) {
      console.error(err);
      setMyTasks([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleInputChange = useCallback((field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    setFormError("");
  }, []);

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormState((prev) => ({ ...prev, budget: value ? `$${value}` : "" }));
  };

  const validateForm = () => {
    if (!formState.category || !formState.subCategory) {
      setFormError("Please select both category and subcategory");
      return false;
    }
    if (!formState.gigTitle || !formState.description || !formState.budget || !formState.delivered) {
      setFormError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      title: formState.gigTitle,
      description: formState.description,
      category_id: parseInt(formState.category),
      sub_category_id: parseInt(formState.subCategory),
      price: formState.budget.replace("$", ""),
      delivery_date: formState.delivered,
    };

    setIsLoadingCreate(true);
    try {
      const res = await axios.post("bd/tasks/create", requestData);
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        toast.success("Task posted successfully for experts!");
        setFormState({
          gigTitle: "",
          description: "",
          budget: "",
          delivered: "",
          category: "",
          subCategory: "",
        });
        fetchMyTasks();
        taskListRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setFormError(res.data?.message || "Task creation failed.");
      }
    } catch (err) {
      setFormError("Error creating task. Ensure backend is configured.");
      console.error(err);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const customLabelStyle = { color: theme.mediumGrayTitle, fontWeight: 500, fontSize: '13px', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ backgroundColor: theme.mainBg, minHeight: '100vh', color: theme.pureWhite }}>
      <Navbar FirstNav="none" />
      <div className="container-fluid py-4 poppins">
        <div className="row justify-content-center">
          
          <div className="col-11 mb-3">
            <Typography variant="h5" className="fw-semibold" style={{ color: theme.pureWhite }}>
              Post a Task for Experts
            </Typography>
            <p className="font-13 mb-0" style={{ color: theme.bodyGrayText }}>Post requirements to receive proposals directly from Experts.</p>
          </div>

          <div className="col-lg-11 col-12">
            <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.lightBorder}` }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="h6" className="fw-semibold" style={{ color: theme.pureWhite, fontSize: '15px' }}>
                  Task Details
                </Typography>
              </div>

              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="alert p-2 rounded-2 mb-3 font-13" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                    {formError}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12">
                    <label style={customLabelStyle}>Job Title</label>
                    <TextField
                      size="small"
                      value={formState.gigTitle}
                      onChange={handleInputChange("gigTitle")}
                      placeholder="e.g., Need an expert for UI/UX Design"
                      required
                      fullWidth
                      sx={inputSx}
                      inputProps={{ maxLength: 80 }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={customLabelStyle}>Category</label>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={formState.category}
                        onChange={handleInputChange("category")}
                        required
                        MenuProps={menuProps}
                      >
                        <MenuItem value="" disabled><em style={{ color: theme.bodyGrayText }}>Select Category</em></MenuItem>
                        {userCategory.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <label style={customLabelStyle}>Subcategory</label>
                    <FormControl fullWidth size="small" disabled={!formState.category} sx={{...inputSx, opacity: !formState.category ? 0.5 : 1}}>
                      <Select
                        displayEmpty
                        value={formState.subCategory}
                        onChange={handleInputChange("subCategory")}
                        required
                        MenuProps={menuProps}
                      >
                        <MenuItem value="" disabled><em style={{ color: theme.bodyGrayText }}>Select Subcategory</em></MenuItem>
                        {filteredSubCategories.map((sub) => (
                          <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <label style={customLabelStyle}>Budget ($)</label>
                    <TextField
                      size="small"
                      value={formState.budget}
                      onChange={handleBudgetChange}
                      placeholder="$0"
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
                      value={formState.delivered}
                      onChange={handleInputChange("delivered")}
                      required
                      fullWidth
                      sx={{
                        ...inputSx, 
                        '& input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.6, cursor: 'pointer' } 
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label style={customLabelStyle}>Description</label>
                    <TextField
                      size="small"
                      value={formState.description}
                      onChange={handleInputChange("description")}
                      placeholder="Briefly describe what you need..."
                      multiline
                      rows={6}
                      required
                      fullWidth
                      sx={inputSx}
                      inputProps={{ maxLength: 1000 }}
                    />
                    <div className="text-end mt-1 font-11" style={{ color: theme.darkGrayNumber }}>
                      {formState.description.length} / 1000
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end align-items-center gap-3 mt-3 pt-3 border-top" style={{ borderColor: theme.lightBorder }}>
                  <Button
                    type="submit"
                    disabled={isLoadingCreate}
                    variant="contained"
                    size="small"
                    style={{
                      backgroundColor: theme.primaryOrange,
                      color: theme.pureWhite,
                      borderRadius: '6px',
                      padding: '6px 24px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '13px',
                      boxShadow: 'none',
                      opacity: isLoadingCreate ? 0.7 : 1
                    }}
                  >
                    {isLoadingCreate ? <CircularProgress size={16} color="inherit" /> : "Post Task"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Active Requests List */}
          <div className="col-lg-11 col-12 mt-4 pt-2" ref={taskListRef}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Typography variant="h6" className="fw-semibold" style={{ color: theme.pureWhite, fontSize: '16px' }}>
                Your Posted Tasks
              </Typography>
            </div>
            
            {isLoadingList ? (
              <div className="text-center py-4">
                <CircularProgress size={30} style={{ color: theme.primaryOrange }} />
              </div>
            ) : (
              <div className="row g-3">
                {myTasks.map((task) => (
                  <div className="col-12" key={task.id}>
                    <div className="p-3 rounded-3 d-flex flex-column gap-2" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.mediumBorder}` }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold" style={{ color: theme.pureWhite, fontSize: '14px' }}>
                          {task.title}
                        </h6>
                        <span className="font-11" style={{ color: theme.darkGrayNumber }}>
                          {task.created_at ? formatDistanceToNow(new Date(task.created_at)) + ' ago' : ''}
                        </span>
                      </div>
                      
                      <p className="mb-1" style={{ color: theme.lightGrayHover, fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </p>

                      <div className="d-flex flex-wrap justify-content-between align-items-center mt-2 gap-2 border-top pt-2" style={{ borderColor: theme.lightBorder }}>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="rounded-pill px-2 py-1" style={{ backgroundColor: theme.secondaryBlueBlur, color: theme.primaryOrange, fontSize: '11px', border: `1px solid ${theme.orangeBorderActive}` }}>
                            Budget: ${task.price}
                          </span>
                          
                          {/* Stats Badges */}
                          {task.total_proposals !== undefined && (
                            <>
                              <span className="rounded-pill px-2 py-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: theme.pureWhite, fontSize: '11px', border: `1px solid ${theme.borderMid}` }}>
                                {task.total_proposals} Total
                              </span>
                              {task.pending_proposals > 0 && (
                                <span className="rounded-pill px-2 py-1" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', fontSize: '11px', border: `1px solid rgba(251, 191, 36, 0.2)` }}>
                                  {task.pending_proposals} Pending
                                </span>
                              )}
                              {task.accepted_proposals > 0 && (
                                <span className="rounded-pill px-2 py-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '11px', border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                                  {task.accepted_proposals} Accepted
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/bd-received-proposals`, { state: { taskId: task.id } })}
                          style={{
                            backgroundColor: theme.primaryOrange,
                            color: theme.pureWhite,
                            borderRadius: '6px',
                            fontSize: '12px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            padding: '4px 14px'
                          }}
                        >
                          View Proposals
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {myTasks.length === 0 && (
                  <div className="col-12 text-center py-4 rounded-3" style={{ border: `1px dashed ${theme.mediumBorder}` }}>
                    <Typography className="font-13" style={{ color: theme.bodyGrayText }}>No tasks posted yet.</Typography>
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

export default BdTaskCreate;
