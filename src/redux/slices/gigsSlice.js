import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { dispatch } from "../store/store";
import { getPersonalGigs } from "./offersSlice";

const initialState = {
  isLoading: false,
  getError: null,
  userList: [],
  userDetail: {},
  GigOverView: {},
  userCategory: [],
  userSubCategory: [],
  draftGigs: [],
  draftLoading: false,
  draftError: null,
  lastSaved: null,
  currentStep: 0,
  validationErrors: {},
  autoSaveEnabled: true
};

// Build FormData for draft with image/video/pdf FILES (backend: image1, image2, image3, video, pdf_file1, pdf_file2)
// Call this in the component so File objects are not lost via Redux serialization.
export function buildDraftFormData(draftData) {
  const formData = new FormData();
  const serializeData = (data) => {
    try {
      return typeof data === 'object' ? JSON.stringify(data) : String(data ?? '');
    } catch (e) {
      return JSON.stringify([]);
    }
  };

  // 1) Append media FILES first (must be real File instances – build in component before dispatch)
  const images = draftData.images || [];
  const existingImageUrls = [];
  for (let i = 0; i < 3; i++) {
    const item = images[i];
    const file = item?.fileObject ?? (item instanceof File ? item : null);
    if (file instanceof File) {
      formData.append(`image${i + 1}`, file);
    } else if (typeof item === 'string' && item.length > 0) {
      existingImageUrls.push({ slot: `image${i + 1}`, url: item });
    } else if (item?.url && typeof item.url === 'string') {
      existingImageUrls.push({ slot: `image${i + 1}`, url: item.url });
    }
  }
  if (existingImageUrls.length > 0) {
    existingImageUrls.forEach(({ slot, url }) => {
      formData.append(slot, url);
    });
  }
  const videoItem = draftData.video;
  const videoFile = videoItem?.fileObject ?? (videoItem instanceof File ? videoItem : null);
  if (videoFile instanceof File) {
    formData.append('video', videoFile);
  } else if (typeof videoItem === 'string' && videoItem.length > 0) {
    formData.append('video', videoItem);
  } else if (videoItem?.url && typeof videoItem.url === 'string') {
    formData.append('video', videoItem.url);
  }
  const documents = draftData.documents || [];
  for (let i = 0; i < 2; i++) {
    const item = documents[i];
    const file = item?.fileObject ?? (item instanceof File ? item : null);
    if (file instanceof File) {
      formData.append(`pdf_file${i + 1}`, file);
    } else if (typeof item === 'string' && item.length > 0) {
      formData.append(`pdf_file${i + 1}`, item);
    } else if (item?.url && typeof item.url === 'string') {
      formData.append(`pdf_file${i + 1}`, item.url);
    }
  }

  // 2) Append other fields (backend decodes JSON for tags, packages, faqs, requirements)
  const skipKeys = ['images', 'video', 'documents'];
  Object.keys(draftData).forEach(key => {
    if (skipKeys.includes(key)) return;
    const value = draftData[key];
    if (value === undefined || value === null) return;
    if (typeof value === 'object') {
      formData.append(key, serializeData(value));
    } else {
      formData.append(key, value);
    }
  });

  formData.append('currentStep', draftData.currentStep ?? 0);
  formData.append('lastSaved', draftData.lastSaved || new Date().toISOString());
  formData.append('version', '2.0');

  if (process.env.NODE_ENV === 'development') {
    const entries = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        entries.push(`${key}: [File] ${value.name} (${(value.size / 1024).toFixed(1)}KB)`);
      } else {
        const str = typeof value === 'string' ? value.substring(0, 60) : value;
        entries.push(`${key}: ${str}`);
      }
    }
    console.log('[DRAFT-FORMDATA] Built FormData with', entries.length, 'entries:', entries);
  }

  return formData;
}

export const saveDraft = createAsyncThunk(
  'gigs/saveDraft',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // Accept FormData built in component (so video/pdf File objects are preserved)
      const formData = payload instanceof FormData ? payload : buildDraftFormData(payload);

      const response = await axios.post('/draft-gigs', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // do not set Content-Type; browser sets multipart/form-data with boundary
        },
        timeout: 60000, // 60s for file uploads
      });

      return response.data;
    } catch (error) {
      console.error('Draft save error:', error);
      return rejectWithValue(error.response?.data || {
        message: error.message || 'Failed to save draft',
      });
    }
  }
);

export const autoSaveDraft = createAsyncThunk(
  'gigs/autoSaveDraft',
  async (draftData, { rejectWithValue }) => {
    try {
      // Only auto-save if there are significant changes
      if (!draftData.gigTitle || draftData.gigTitle.length < 5) {
        return rejectWithValue({ message: 'Insufficient data for auto-save' });
      }

      const accessToken = localStorage.getItem("accessToken");
      const lightweightData = {
        ...draftData,
        // Exclude large file objects for auto-save
        uploadedImages: draftData.uploadedImages?.map(img => ({
          name: img.name,
          size: img.size,
          type: img.type,
          // Don't include file content for auto-save
        })) || [],
        uploadedVideos: draftData.uploadedVideos?.map(vid => ({
          name: vid.name,
          size: vid.size,
          type: vid.type,
        })) || [],
        uploadedPDFs: draftData.uploadedPDFs?.map(pdf => ({
          name: pdf.name,
          size: pdf.size,
          type: pdf.type,
        })) || [],
        lastSaved: new Date().toISOString(),
        isAutoSave: true
      };

      const response = await axios.post('/draft-gigs/auto-save', lightweightData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout for auto-save
      });
      return response.data;
    } catch (error) {
      // Don't show errors for auto-save failures
      console.warn('Auto-save failed:', error);
      return rejectWithValue(error.response?.data || { message: 'Auto-save failed' });
    }
  }
);

export const getSingleGigStats = createAsyncThunk(
  'gigs/getSingleGigStats',
  async (gigId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post('/gig/stats', { gig_id: gigId }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch gig stats'
      );
    }
  }
);

export const getDraftGigs = createAsyncThunk(
  'gigs/getDraftGigs',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get('/draft-gigs', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          include: 'metadata',
          sort: 'lastSaved:desc'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to load drafts' 
      });
    }
  }
);

export const deleteDraft = createAsyncThunk(
  'gigs/deleteDraft',
  async (draftId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/draft-gigs/${draftId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return draftId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to delete draft' 
      });
    }
  }
);

export const loadDraft = createAsyncThunk(
  'gigs/loadDraft',
  async (draftId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`/draft-gigs/${draftId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to load draft' 
      });
    }
  }
);

const gigSlice = createSlice({
  name: "gig",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.getError = null;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    hasGetError(state, action) {
      state.isLoading = false;
      state.getError = action.payload;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },
    getUserDetailsSuccess(state, action) {
      state.isLoading = false;
      state.userDetail = action.payload;
    },
    getuserSubCategory(state, action) {
      state.isLoading = false;
      state.userSubCategory = action.payload;
    },
    getuserCategory(state, action) {
      state.isLoading = false;
      state.userCategory = action.payload;
    },
    clearDraftError(state) {
      state.draftError = null;
    },
    clearDraftState(state) {
      state.draftGigs = [];
      state.draftLoading = false;
      state.draftError = null;
      state.lastSaved = null;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setValidationErrors(state, action) {
      state.validationErrors = action.payload;
    },
    clearValidationErrors(state) {
      state.validationErrors = {};
    },
    updateDraftLocal(state, action) {
      const { id, updates } = action.payload;
      const draftIndex = state.draftGigs.findIndex(draft => draft.id === id);
      if (draftIndex !== -1) {
        state.draftGigs[draftIndex] = {
          ...state.draftGigs[draftIndex],
          ...updates,
          lastSaved: new Date().toISOString()
        };
        state.lastSaved = new Date().toISOString();
      }
    },
    toggleAutoSave(state, action) {
      state.autoSaveEnabled = action.payload ?? !state.autoSaveEnabled;
    },
    // New reducer for handling gig data updates
    updateGigData(state, action) {
      if (state.userDetail) {
        state.userDetail = { ...state.userDetail, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Draft
      .addCase(saveDraft.pending, (state) => {
        state.draftLoading = true;
        state.draftError = null;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.draftLoading = false;
        state.lastSaved = new Date().toISOString();
        
        const draftData = action.payload.data;
        const index = state.draftGigs.findIndex(draft => draft.id === draftData.id);
        
        if (index !== -1) {
          state.draftGigs[index] = { ...state.draftGigs[index], ...draftData };
        } else {
          state.draftGigs.push(draftData);
        }
        
        // Limit drafts to last 10 to prevent storage issues
        if (state.draftGigs.length > 10) {
          state.draftGigs = state.draftGigs.slice(-10);
        }
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.draftLoading = false;
        state.draftError = action.payload?.message || 'Failed to save draft';
      })
      
      // Auto Save Draft
      .addCase(autoSaveDraft.fulfilled, (state, action) => {
        state.lastSaved = new Date().toISOString();
        const draftData = action.payload.data;
        
        const index = state.draftGigs.findIndex(draft => draft.id === draftData.id);
        if (index !== -1) {
          state.draftGigs[index] = { ...state.draftGigs[index], ...draftData };
        }
      })
      .addCase(autoSaveDraft.rejected, (state) => {
        // Silent failure for auto-save - don't set error state
        console.warn('Auto-save failed silently');
      })
      
      // Get Draft Gigs
      .addCase(getDraftGigs.pending, (state) => {
        state.draftLoading = true;
        state.draftError = null;
      })
      .addCase(getDraftGigs.fulfilled, (state, action) => {
        state.draftLoading = false;
        state.draftGigs = action.payload.data || [];
      })
      .addCase(getDraftGigs.rejected, (state, action) => {
        state.draftLoading = false;
        state.draftError = action.payload?.message || 'Failed to load drafts';
      })
      
      // Load Draft
      .addCase(loadDraft.fulfilled, (state, action) => {
        state.userDetail = action.payload.data;
        state.currentStep = action.payload.data.currentStep || 0;
      })
      .addCase(loadDraft.rejected, (state, action) => {
        state.draftError = action.payload?.message || 'Failed to load draft';
      })
      
      // Delete Draft
      .addCase(deleteDraft.fulfilled, (state, action) => {
        state.draftGigs = state.draftGigs.filter(draft => draft.id !== action.payload);
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.draftError = action.payload?.message || 'Failed to delete draft';
      })

       // Gig Delete
    .addCase(GigDelete.pending, (state) => {
      state.isLoading = true;
      state.getError = null;
    })
    .addCase(GigDelete.fulfilled, (state, action) => {
      state.isLoading = false;
      // The gig will be removed from the list when getPersonalGigs refreshes
    })
    .addCase(GigDelete.rejected, (state, action) => {
      state.isLoading = false;
      state.getError = action.payload;
    });
  }
});

// Export Actions and Reducer correctly
export const {
  getUserDetailsSuccess,
  getUsersSuccess,
  getuserCategory,
  getuserSubCategory,
  hasGetError,
  startLoading,
  stopLoading,
  clearDraftError,
  clearDraftState,
  setCurrentStep,
  setValidationErrors,
  clearValidationErrors,
  updateDraftLocal,
  toggleAutoSave,
  updateGigData
} = gigSlice.actions;

export default gigSlice.reducer;

// Enhanced User Functions with better error handling and validation
// gigsSlice.js
export const updateGigStep = createAsyncThunk(
  'gigs/updateGigStep',
  async ({ route, payload }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`/${route}`, payload, {
        headers: {  Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);

// GIG getCategory
export function getCategory() {
  return async () => {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(gigSlice.actions.startLoading());
    try {
      const response = await axios.get("category", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      dispatch(gigSlice.actions.getuserCategory(response.data.categories || []));
    } catch (error) {
      console.error("Category Error:", error);
      dispatch(gigSlice.actions.hasGetError(
        error.response?.data?.message || error.message || "Failed to load categories"
      ));
    }
  };
}

export function getSubCategory() {
  return async () => {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(gigSlice.actions.startLoading());
    try {
      const response = await axios.get("subCategory", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      dispatch(gigSlice.actions.getuserSubCategory(response.data.subCategories || []));
    } catch (error) {
      console.error("Subcategory Error:", error);
      dispatch(gigSlice.actions.hasGetError(
        error.response?.data?.message || error.message || "Failed to load subcategories"
      ));
    }
  };
}

// Enhanced GIG Overview with validation
export function Overview(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      // Basic validation
      const errors = {};
      if (!data.title || data.title.length < 10) {
        errors.title = "Title must be at least 10 characters";
      }
      if (!data.category_id) {
        errors.category = "Category is required";
      }
      if (!data.subcategory_id) {
        errors.subCategory = "Sub-category is required";
      }
      
      if (Object.keys(errors).length > 0) {
        dispatch(gigSlice.actions.setValidationErrors(errors));
        handleClose({ status: false, message: "Validation failed", errors });
        return;
      }

      const response = await axios.post("gig-overView", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        localStorage.setItem("gigId", response.data.data.id);
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(1)); // Move to next step
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Overview Error:", error);
      handleClose({ 
        status: false, 
        message: error.response?.data?.message || error.message 
      });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG Pricing with comprehensive data handling
export function Pricing(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      // Enhanced validation for pricing
      const errors = {};
      
      // Validate package prices
      const packages = ['basic', 'standard', 'premium'];
      packages.forEach(pkg => {
        if (!data[`total_${pkg}`] || data[`total_${pkg}`] === "$") {
          errors[`total_${pkg}`] = `${pkg.charAt(0).toUpperCase() + pkg.slice(1)} package price is required`;
        }
      });

      if (Object.keys(errors).length > 0) {
        dispatch(gigSlice.actions.setValidationErrors(errors));
        handleClose({ status: false, message: "Pricing validation failed", errors });
        return;
      }

      // Prepare the complete data object with enhanced serialization
      const pricingData = {
        // Basic package fields
        title_basic: data.title_basic || "",
        source_file_basic: data.source_file_basic || "no",
        resulation_basic: data.resulation_basic || "no",
        ravision_basic: data.ravision_basic || "0",
        delivery_time_basic: data.delivery_time_basic || "3",
        total_basic: data.total_basic?.replace('$', '') || "0",
        
        // Standard package fields
        title_standard: data.title_standard || "",
        source_file_standard: data.source_file_standard || "no",
        resulation_standard: data.resulation_standard || "no",
        ravision_standard: data.ravision_standard || "0",
        delivery_time_standard: data.delivery_time_standard || "3",
        total_standard: data.total_standard?.replace('$', '') || "0",
        
        // Premium package fields
        title_premium: data.title_premium || "",
        source_file_premium: data.source_file_premium || "no",
        resulation_premium: data.resulation_premium || "no",
        ravision_premium: data.ravision_premium || "0",
        delivery_time_premium: data.delivery_time_premium || "3",
        total_premium: data.total_premium?.replace('$', '') || "0",
        
        // Additional service details with safe serialization
        experience_level: data.experience_level || "intermediate",
        languages: JSON.stringify(data.languages || []),
        skills: JSON.stringify(data.skills || []),
        availability: data.availability || "within_3_days",
        response_time: data.response_time || "within_24_hours",
        supported_formats: JSON.stringify(data.supported_formats || []),
        usage_rights: data.usage_rights || "personal_use",
        revisions_included: data.revisions_included ? 1 : 0,
        support_included: data.support_included ? 1 : 0,
        
        // Gig ID
        gig_id: data.gig_id || localStorage.getItem("gigId")
      };

      const response = await axios.post("gig-package", pricingData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(2)); // Move to next step
        dispatch(gigSlice.actions.updateGigData(pricingData));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Pricing Error:", error);
      handleClose({ 
        status: false, 
        message: error.response?.data?.message || error.message 
      });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG Description with HTML sanitization check
export function Description(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      // Validate description length (strip HTML tags)
      const plainText = data.description?.replace(/<[^>]*>/g, '') || '';
      if (plainText.length < 120) {
        const errors = { description: "Description must be at least 120 characters" };
        dispatch(gigSlice.actions.setValidationErrors(errors));
        handleClose({ status: false, message: "Description too short", errors });
        return;
      }

      const response = await axios.post("gig-description", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(3));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Description Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG userFaqs with array validation
export function userFaqs(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    try {
      const response = await axios.post("gig-question", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("FAQ Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG Requirements with validation
export function Requirements(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      // Validate requirements
      if (!data.requirements || data.requirements.length === 0) {
        const errors = { requirements: "At least one requirement is needed" };
        dispatch(gigSlice.actions.setValidationErrors(errors));
        handleClose({ status: false, message: "Requirements are required", errors });
        return;
      }

      const response = await axios.post("gig-requirement", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(4));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Requirements Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG userGallery with improved file handling
export function userGallery(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      // Validate at least one image
      if (!data.imageFile1 && !data.imageFile2 && !data.imageFile3) {
        const errors = { gallery: "At least one image is required" };
        dispatch(gigSlice.actions.setValidationErrors(errors));
        handleClose({ status: false, message: "At least one image is required", errors });
        return;
      }

      const formData = new FormData();
      
      // Append basic data
      formData.append("gig_id", data.gigID || localStorage.getItem("gigId"));
      
      // Append files with null checks
      if (data.imageFile1) formData.append("image1", data.imageFile1);
      if (data.imageFile2) formData.append("image2", data.imageFile2);
      if (data.imageFile3) formData.append("image3", data.imageFile3);
      if (data.videoFile) formData.append("video", data.videoFile);
      if (data.pdfFile1) formData.append("pdf_file1", data.pdfFile1);
      if (data.pdfFile2) formData.append("pdf_file2", data.pdfFile2);

      const response = await axios.post("gig-gallery", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accessToken,
        },
        onUploadProgress: (progressEvent) => {
          // You can dispatch progress updates here if needed
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${progress}%`);
        }
      });

      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(5));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Gallery Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// get draft by id
export function getDraftById(id) {
  return async () => {
    let accessToken = localStorage.getItem("accessToken");
    
    dispatch(gigSlice.actions.startLoading());
    try {
      const response = await axios.get(`draft-gigs/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.setCurrentStep(response.data.data.currentStep || 0));
        return response.data;
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
        return null;
      }
    } catch (error) {
      console.error("Get Draft Error:", error);
      dispatch(gigSlice.actions.hasGetError(
        error.response?.data?.message || error.message || "Failed to load draft"
      ));
      return null;
    }
  };
}

// Upload gallery media files to gig-gallery endpoint (separate from publish)
export const uploadGigGallery = createAsyncThunk(
  'gigs/uploadGigGallery',
  async ({ gigId, images, video, documents }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();

      formData.append('gig_id', gigId);

      let hasNewFiles = false;
      const fileLog = [];

      if (Array.isArray(images)) {
        images.forEach((item, i) => {
          const file = item?.fileObject ?? (item instanceof File ? item : null);
          if (file instanceof File) {
            formData.append(`image${i + 1}`, file);
            hasNewFiles = true;
            fileLog.push(`image${i + 1}: ${file.name} (${(file.size / 1024).toFixed(1)}KB, ${file.type})`);
          } else {
            fileLog.push(`image${i + 1}: skipped (not a File, has url: ${!!item?.url})`);
          }
        });
      }

      const videoFile = video?.fileObject ?? (video instanceof File ? video : null);
      if (videoFile instanceof File) {
        formData.append('video', videoFile);
        hasNewFiles = true;
        fileLog.push(`video: ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(1)}MB)`);
      }

      if (Array.isArray(documents)) {
        documents.forEach((item, i) => {
          const file = item?.fileObject ?? (item instanceof File ? item : null);
          if (file instanceof File) {
            formData.append(`pdf_file${i + 1}`, file);
            hasNewFiles = true;
            fileLog.push(`pdf_file${i + 1}: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
          }
        });
      }

      console.log('[GIG-GALLERY] Upload check:', {
        gigId,
        hasNewFiles,
        totalImages: images?.length || 0,
        files: fileLog
      });

      if (!hasNewFiles) {
        console.log('[GIG-GALLERY] No new files to upload, skipping');
        return { status: true, message: 'No new files to upload', skipped: true };
      }

      console.log('[GIG-GALLERY] Sending', fileLog.length, 'files to gig-gallery endpoint...');

      const response = await axios.post('gig-gallery', formData, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (pct % 25 === 0) console.log(`[GIG-GALLERY] Upload progress: ${pct}%`);
        }
      });

      console.log('[GIG-GALLERY] Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[GIG-GALLERY] Upload FAILED:', error?.response?.status, error?.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========= Publish with final validation

export const gigPublish = createAsyncThunk(
  'gigs/gigPublish',
  async (data, { rejectWithValue }) => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('gig-publish', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        timeout: 60000,
      });

      if (response.data.status) {
        localStorage.removeItem("gigId");
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// =============DELETE GIG===================
// ============= DELETE GIG ===================
export const GigDelete = createAsyncThunk(
  'gigs/GigDelete',
  async (gigId, { rejectWithValue, dispatch }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("gig-delete/" + gigId, [], {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      if (response.data.status) {
        // Refresh the gigs list after successful deletion
        const userData = JSON.parse(localStorage.getItem("UserData"));
        if (userData?.id) {
          dispatch(getPersonalGigs({ user_id: userData.id }));
        }
        return { success: true, message: 'Gig deleted successfully', data: response.data };
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete gig');
      }
    } catch (error) {
      console.error("Delete Error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete gig'
      );
    }
  }
);

// ==================
// UPDATE GIG Functions (Enhanced)
// ==================

// Enhanced GIG Overview Update
export function GigOverViewUpdate(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(gigSlice.actions.startLoading());
    dispatch(gigSlice.actions.clearValidationErrors());
    
    try {
      const response = await axios.post('update-gig-overView', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Overview Update Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// Enhanced GIG Pricing Update
export function GigPricingUpdate(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(gigSlice.actions.startLoading());
    
    try {
      const pricingData = {
        // ... (same structure as Pricing function)
        title_basic: data.title_basic || "",
        source_file_basic: data.source_file_basic || "no",
        resulation_basic: data.resulation_basic || "no",
        ravision_basic: data.ravision_basic || "0",
        delivery_time_basic: data.delivery_time_basic || "3",
        total_basic: data.total_basic?.replace('$', '') || "0",
        title_standard: data.title_standard || "",
        source_file_standard: data.source_file_standard || "no",
        resulation_standard: data.resulation_standard || "no",
        ravision_standard: data.ravision_standard || "0",
        delivery_time_standard: data.delivery_time_standard || "3",
        total_standard: data.total_standard?.replace('$', '') || "0",
        title_premium: data.title_premium || "",
        source_file_premium: data.source_file_premium || "no",
        resulation_premium: data.resulation_premium || "no",
        ravision_premium: data.ravision_premium || "0",
        delivery_time_premium: data.delivery_time_premium || "3",
        total_premium: data.total_premium?.replace('$', '') || "0",
        experience_level: data.experience_level || "intermediate",
        languages: JSON.stringify(data.languages || []),
        skills: JSON.stringify(data.skills || []),
        availability: data.availability || "within_3_days",
        response_time: data.response_time || "within_24_hours",
        supported_formats: JSON.stringify(data.supported_formats || []),
        usage_rights: data.usage_rights || "personal_use",
        revisions_included: data.revisions_included ? 1 : 0,
        support_included: data.support_included ? 1 : 0,
        gig_id: data.gig_id
      };

      const response = await axios.post('update-gig-package', pricingData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
      handleClose(response.data);
      
      if (response.data.status) {
        dispatch(gigSlice.actions.getUserDetailsSuccess(response.data.data));
        dispatch(gigSlice.actions.updateGigData(pricingData));
      } else {
        dispatch(gigSlice.actions.hasGetError(response.data.message));
      }
    } catch (error) {
      console.error("Pricing Update Error:", error);
      handleClose({ status: false, message: error.response?.data?.message || error.message });
      dispatch(gigSlice.actions.hasGetError(error.message));
    }
  };
}

// ... (Other update functions follow the same enhanced pattern)

// Utility function to validate gig data before submission
export const validateGigStep = (step, data) => {
  const errors = {};
  
  switch (step) {
    case 0: // Overview
      if (!data.title || data.title.length < 10) {
        errors.title = "Title must be at least 10 characters";
      }
      if (!data.category_id) {
        errors.category = "Category is required";
      }
      if (!data.subcategory_id) {
        errors.subCategory = "Sub-category is required";
      }
      break;
      
    case 1: // Pricing
      if (!data.total_basic || data.total_basic === "$") {
        errors.total_basic = "Basic package price is required";
      }
      if (!data.total_standard || data.total_standard === "$") {
        errors.total_standard = "Standard package price is required";
      }
      if (!data.total_premium || data.total_premium === "$") {
        errors.total_premium = "Premium package price is required";
      }
      break;
      
    case 2: // Description
      const plainText = data.description?.replace(/<[^>]*>/g, '') || '';
      if (plainText.length < 120) {
        errors.description = "Description must be at least 120 characters";
      }
      break;
      
    case 3: // Requirements
      if (!data.requirements || data.requirements.length === 0) {
        errors.requirements = "At least one requirement is needed";
      }
      break;
      
    case 4: // Gallery
      if (!data.imageFile1 && !data.imageFile2 && !data.imageFile3) {
        errors.gallery = "At least one image is required";
      }
      break;
  }
  
  return errors;
};

// New function to get gig progress
export const getGigProgress = (gigData) => {
  const steps = [
    gigData.title && gigData.category_id && gigData.subcategory_id,
    gigData.total_basic && gigData.total_standard && gigData.total_premium,
    gigData.description && gigData.description.replace(/<[^>]*>/g, '').length >= 120,
    gigData.requirements && gigData.requirements.length > 0,
    gigData.imageFile1 || gigData.imageFile2 || gigData.imageFile3
  ];
  
  const completedSteps = steps.filter(Boolean).length;
  return Math.round((completedSteps / steps.length) * 100);
};