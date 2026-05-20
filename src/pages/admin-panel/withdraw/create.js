import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CreateBuyerRequest, getBds, getClientRequest } from "../redux/slices/buyerRequestSlice";
import { getCategory, getSubCategory } from "../redux/slices/gigsSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useUserData } from "../../../utils/useLocalStorage";
import "../style/byerRequest.scss";
import "../style/multistep.scss";

const BlogCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.allOrder);
  const { userCategory, userSubCategory } = useSelector((state) => state.gig);
  const { requestClientList, isLoadingCreate, isLoadingBuyerList, bdList } = useSelector((state) => state.buyer);
  const UserData = useUserData();

  // Local states
  const [formState, setFormState] = useState({
    gigTitle: "",
    description: "",
    budget: "",
    delivered: "",
    category: "",
    subCategory: "",
    visibility: "public", // "public" or "inviteOnly"
    inviteBDs: [] // store selected BD IDs when visibility is invite only
  });
  const [formError, setFormError] = useState("");

  // Ref for buyer request list container
  const buyerRequestListRef = useRef(null);

  const filteredSubCategories = useMemo(() => {
    const arr = Array.isArray(userSubCategory) ? userSubCategory : [];
    const cat = formState.category;
    return cat ? arr.filter((sub) => parseInt(sub?.category_id) === parseInt(cat)) : [];
  }, [userSubCategory, formState.category]);

  // Memoized fetch function
  const fetchInitialData = useCallback(() => {
    if (UserData?.id) {
      dispatch(getClientRequest({ client_id: UserData.id }));
    }
    dispatch(getCategory());
    dispatch(getSubCategory());
    // Dispatch getBds to load BD list
    dispatch(getBds());
  }, [UserData?.id, dispatch]);

  // Handle form field changes
  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    if (formError) setFormError("");
  };

  // Handle budget input with currency formatting
  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormState((prev) => ({ ...prev, budget: value ? `$${value}` : "" }));
  };

  // Form validation
  const validateForm = () => {
    if (!formState.category || !formState.subCategory) {
      setFormError("Please select both category and subcategory");
      return false;
    }
    if (!formState.gigTitle || !formState.description || !formState.budget || !formState.delivered) {
      setFormError("Please fill in all required fields");
      return false;
    }
    // If inviteOnly is selected, ensure at least one BD is invited
    if (formState.visibility === "inviteOnly" && formState.inviteBDs.length === 0) {
      setFormError("Please select at least one BD to invite.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      title: formState.gigTitle,
      description: formState.description,
      category_id: parseInt(formState.category),
      sub_category_id: parseInt(formState.subCategory),
      price: formState.budget.replace("$", ""),
      date: formState.delivered,
      visibility: formState.visibility,
      invite_bds: formState.visibility === "inviteOnly" ? formState.inviteBDs : []
    };

    dispatch(CreateBuyerRequest(requestData, handleResponse));
  };

  // Updated handleResponse: scrolls to buyer request list instead of navigating
  const handleResponse = (response) => {
    if (response?.success) {
      // Optionally, reset the form here:
      setFormState({
        gigTitle: "",
        description: "",
        budget: "",
        delivered: "",
        category: "",
        subCategory: "",
        visibility: "public",
        inviteBDs: []
      });
      // Re-fetch buyer requests so the list is updated
      dispatch(getClientRequest({ client_id: UserData.id }));
      // Scroll smoothly to the buyer request list section
      buyerRequestListRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setFormError(response?.error || "Request failed. Please try again.");
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div>
      <Navbar FirstNav="none" />
      <div className="container-fluid my-lg-5 my-4 byerRequest">
        <div className="row justify-content-center">
          <div className="col-11">
            <Typography variant="h4" className="byerLine cocon blackcolor">
              Buyer Request
            </Typography>
          </div>

          {/* Request Form */}
          <div className="col-lg-11 col-12 bg-white p-3 rounded-3 mt-4 shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="stepOne px-lg-3 pt-4 pb-4 rounded-3 bg-primary-10"
            >
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}

              {/* Job Title */}
              <div className="mb-3">
                <InputLabel htmlFor="gigTitle" className="form-label fw-medium fs-5">
                  Job Title
                </InputLabel>
                <TextField
                  id="gigTitle"
                  value={formState.gigTitle}
                  onChange={handleInputChange("gigTitle")}
                  placeholder="I'm looking for an expert for my project"
                  required
                  fullWidth
                  inputProps={{ maxLength: 80 }}
                />
                <div className="text-end text-muted small mt-1">
                  {formState.gigTitle.length} / 80 max
                </div>
              </div>

              {/* Visibility Option */}
              <div className="mb-3">
                <FormControl fullWidth>
                  <InputLabel id="visibility-label">Request Visibility</InputLabel>
                  <Select
                    labelId="visibility-label"
                    id="visibility"
                    value={formState.visibility}
                    onChange={handleInputChange("visibility")}
                    fullWidth
                  >
                    <MenuItem value="public">Public (All BDs can see)</MenuItem>
                    <MenuItem value="inviteOnly">Invite Only (Selected BDs)</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Conditional BD Invitation (for Invite Only) */}
              {formState.visibility === "inviteOnly" && (
                <div className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel id="invite-bd-label">Invite BD(s)</InputLabel>
                    <Select
                      labelId="invite-bd-label"
                      id="inviteBD"
                      multiple
                      value={formState.inviteBDs}
                      onChange={(e) => {
                        setFormState((prev) => ({ ...prev, inviteBDs: e.target.value }));
                        if (formError) setFormError("");
                      }}
                      renderValue={(selected) =>
                        selected
                          .map((id) => bdList.find((bd) => bd.id === id)?.fname)
                          .join(', ')
                      }
                    >
                      {bdList?.map((bd) => (
                        <MenuItem key={bd.id} value={bd.id}>
                          {bd.fname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Category Selection */}
              <div className="mb-4">
                <InputLabel className="form-label fw-medium fs-5">Category</InputLabel>
                <div className="row g-3">
                  <div className="col-lg-6">
                    <FormControl fullWidth>
                      <InputLabel id="category-label">Select Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={formState.category}
                        onChange={handleInputChange("category")}
                        required
                      >
                        <MenuItem value="">
                          <em>Select Category</em>
                        </MenuItem>
                        {userCategory.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-6">
                    <FormControl fullWidth disabled={!formState.category}>
                      <InputLabel id="subCategory-label">Select Subcategory</InputLabel>
                      <Select
                        labelId="subCategory-label"
                        value={formState.subCategory}
                        onChange={handleInputChange("subCategory")}
                        required
                      >
                        <MenuItem value="">
                          <em>Select Subcategory</em>
                        </MenuItem>
                        {filteredSubCategories.map((sub) => (
                          <MenuItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <InputLabel htmlFor="description" className="form-label fw-medium fs-5">
                  Description
                </InputLabel>
                <TextField
                  id="description"
                  value={formState.description}
                  onChange={handleInputChange("description")}
                  placeholder="Provide details about your project"
                  multiline
                  rows={4}
                  required
                  fullWidth
                  inputProps={{ maxLength: 1000 }}
                />
                <div className="text-end text-muted small mt-1">
                  {formState.description.length} / 1000 max
                </div>
              </div>

              {/* Job Details: Budget and Delivery Date */}
              <div className="mb-4">
                <InputLabel className="form-label fw-medium fs-5">Job Details</InputLabel>
                <div className="row g-3 bg-white p-3 rounded">
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel htmlFor="budget" className="text-muted fs-6">
                        Budget
                      </InputLabel>
                      <TextField
                        id="budget"
                        type="text"
                        value={formState.budget}
                        onChange={handleBudgetChange}
                        placeholder="$0"
                        required
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel htmlFor="delivered" className="text-muted fs-6">
                        Delivery Date
                      </InputLabel>
                      <TextField
                        id="delivered"
                        type="date"
                        value={formState.delivered}
                        onChange={handleInputChange("delivered")}
                        required
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel className="text-muted fs-6">Service</InputLabel>
                      {formState.category && (
                        <Typography variant="body1" className="fs-6 fw-medium">
                          {userCategory.find(c => c.id === parseInt(formState.category))?.name}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-end">
                <Button
                  type="submit"
                  disabled={isLoadingCreate}
                  variant="contained"
                  className="px-4 py-2"
                >
                  {isLoadingCreate ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Request"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Buyer Requests List */}
          <div className="col-lg-11 col-12 mt-5" ref={buyerRequestListRef}>
            <Typography variant="h5" className="fw-semibold mb-4 cocon">
              All Buyer Requests
            </Typography>
            {isLoadingBuyerList ? (
              <div className="text-center py-4">
                <CircularProgress color="primary" />
              </div>
            ) : (
              requestClientList?.map((request) => (
                <div className="card mb-3" key={request.id}>
                  <div className="card-body">
                    <div className="d-flex align-items-start gap-3">
                      <img
                        src={request.client?.image}
                        alt={`${request.client?.name}'s profile`}
                        className="rounded-circle"
                        width="60"
                        height="60"
                      />
                      <div className="flex-grow-1">
                        <Typography variant="h6" className="card-title mb-1">
                          {request.title}
                        </Typography>
                        <Typography variant="body2" className="card-text text-muted mb-2">
                          {request.description}
                        </Typography>
                        <small className="text-muted">
                          Posted {request.created_at ? formatDistanceToNow(new Date(request.created_at)) : '—'} ago
                        </small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/offerDetail/${request.id}`)}
                      >
                        View Offers
                      </Button>
                      <div className="d-flex gap-2">
                        <span className="badge bg-primary">
                          Budget: {request.price}
                        </span>
                        <span className="badge bg-secondary">
                          Delivery: {new Date(request.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
