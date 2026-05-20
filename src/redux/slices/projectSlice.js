import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "../../utils/axios";

// Async thunk for fetching buyer's projects
export const buyerProjects = createAsyncThunk(
  'projects/buyerProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/buyer/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Async thunk for fetching active projects
export const getActiveProjects = createAsyncThunk(
  'projects/getActiveProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/buyer/projects/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active projects');
    }
  }
);

// Async thunk for fetching completed projects
export const getCompletedProjects = createAsyncThunk(
  'projects/getCompletedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/buyer/projects/completed');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed projects');
    }
  }
);

// Async thunk for fetching project spending analytics
export const getSpendingAnalytics = createAsyncThunk(
  'projects/getSpendingAnalytics',
  async (period = 'monthly', { rejectWithValue }) => {
    try {
      const response = await axios.get(`/buyer/analytics/spending?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spending analytics');
    }
  }
);

// Async thunk for creating a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/buyer/projects', projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Async thunk for updating project status
export const updateProjectStatus = createAsyncThunk(
  'projects/updateProjectStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/buyer/projects/${projectId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project status');
    }
  }
);

// Async thunk for fetching freelancer reviews given by buyer
export const getFreelancerReviews = createAsyncThunk(
  'projects/getFreelancerReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/buyer/reviews/given');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Async thunk for submitting a review for a freelancer
export const submitFreelancerReview = createAsyncThunk(
  'projects/submitFreelancerReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/buyer/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete(`/buyer/projects/${projectId}`);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

const initialState = {
  // Project data
  userProjects: [],
  activeProjects: [],
  completedProjects: [],
  
  // Analytics data
  spendingAnalytics: {
    monthlyData: [],
    totalSpent: 0,
    averageSpending: 0,
    spendingTrend: 0
  },
  
  // Review data
  freelancerReviews: [],
  averageRatingGiven: 0,
  reviewStats: {
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0
  },
  
  // UI states
  loading: {
    projects: false,
    activeProjects: false,
    completedProjects: false,
    spendingAnalytics: false,
    reviews: false,
    creating: false,
    updating: false,
    deleting: false
  },
  
  error: {
    projects: null,
    activeProjects: null,
    completedProjects: null,
    spendingAnalytics: null,
    reviews: null,
    creating: null,
    updating: null,
    deleting: null
  },
  
  // Pagination and filters
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  
  filters: {
    status: 'all', // all, active, completed, cancelled
    category: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  }
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Clear errors
    clearErrors: (state) => {
      state.error = {
        projects: null,
        activeProjects: null,
        completedProjects: null,
        spendingAnalytics: null,
        reviews: null,
        creating: null,
        updating: null,
        deleting: null
      };
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Reset project state
    resetProjectState: (state) => {
      return initialState;
    },
    
    // Update project in list
    updateProjectInList: (state, action) => {
      const { projectId, updates } = action.payload;
      const projectIndex = state.userProjects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        state.userProjects[projectIndex] = { ...state.userProjects[projectIndex], ...updates };
      }
    }
  },
  
  extraReducers: (builder) => {
    // Buyer Projects
    builder
      .addCase(buyerProjects.pending, (state) => {
        state.loading.projects = true;
        state.error.projects = null;
      })
      .addCase(buyerProjects.fulfilled, (state, action) => {
        state.loading.projects = false;
        state.userProjects = action.payload.projects || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(buyerProjects.rejected, (state, action) => {
        state.loading.projects = false;
        state.error.projects = action.payload;
      });
    
    // Active Projects
    builder
      .addCase(getActiveProjects.pending, (state) => {
        state.loading.activeProjects = true;
        state.error.activeProjects = null;
      })
      .addCase(getActiveProjects.fulfilled, (state, action) => {
        state.loading.activeProjects = false;
        state.activeProjects = action.payload || [];
      })
      .addCase(getActiveProjects.rejected, (state, action) => {
        state.loading.activeProjects = false;
        state.error.activeProjects = action.payload;
      });
    
    // Completed Projects
    builder
      .addCase(getCompletedProjects.pending, (state) => {
        state.loading.completedProjects = true;
        state.error.completedProjects = null;
      })
      .addCase(getCompletedProjects.fulfilled, (state, action) => {
        state.loading.completedProjects = false;
        state.completedProjects = action.payload || [];
      })
      .addCase(getCompletedProjects.rejected, (state, action) => {
        state.loading.completedProjects = false;
        state.error.completedProjects = action.payload;
      });
    
    // Spending Analytics
    builder
      .addCase(getSpendingAnalytics.pending, (state) => {
        state.loading.spendingAnalytics = true;
        state.error.spendingAnalytics = null;
      })
      .addCase(getSpendingAnalytics.fulfilled, (state, action) => {
        state.loading.spendingAnalytics = false;
        state.spendingAnalytics = action.payload || state.spendingAnalytics;
      })
      .addCase(getSpendingAnalytics.rejected, (state, action) => {
        state.loading.spendingAnalytics = false;
        state.error.spendingAnalytics = action.payload;
      });
    
    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.userProjects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload;
      });
    
    // Update Project Status
    builder
      .addCase(updateProjectStatus.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.loading.updating = false;
        const projectIndex = state.userProjects.findIndex(p => p.id === action.payload.id);
        if (projectIndex !== -1) {
          state.userProjects[projectIndex] = action.payload;
        }
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload;
      });
    
    // Freelancer Reviews
    builder
      .addCase(getFreelancerReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(getFreelancerReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.freelancerReviews = action.payload.reviews || [];
        state.averageRatingGiven = action.payload.averageRating || 0;
        state.reviewStats = action.payload.reviewStats || state.reviewStats;
      })
      .addCase(getFreelancerReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload;
      });
    
    // Submit Review
    builder
      .addCase(submitFreelancerReview.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(submitFreelancerReview.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.freelancerReviews.unshift(action.payload);
      })
      .addCase(submitFreelancerReview.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload;
      });
    
    // Delete Project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.userProjects = state.userProjects.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload;
      });
  }
});

export const {
  clearErrors,
  updateFilters,
  updatePagination,
  resetProjectState,
  updateProjectInList
} = projectSlice.actions;

export default projectSlice.reducer;