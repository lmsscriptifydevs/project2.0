import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  isPreLoading: false,
  getError: null,
  gigsList: [],
  gigsDetail: [],
  pagination: {
    currentPage: 1,
    perPage: 12,
    total: 0,
    totalPages: 1
  },

  error: null ,
  singleGigDetail: [],
};

const allGigsSlice = createSlice({
  name: 'allGigs',
  initialState,
  reducers: {
    //START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    startPreLoading(state) {
      state.isPreLoading = true;
    },
    //STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
      state.isPreLoading = false;
    },
    // HAS UPDATE ERROR
    hasGetError(state, action) {
      state.isLoading = false;
      state.isPreLoading = false;
      state.getError = action.payload;
    },
    // GET Gigs Success
    getGigssSuccess(state, action) {
      state.isLoading = false;
      state.isPreLoading = false;
      state.gigsList = action.payload;
    },
    // GET Gigs DETAILS
    getGigsDetailsSuccess(state, action) {
      state.isLoading = false;
      state.isPreLoading = false;
      state.gigsDetail = action.payload;
    },
    getSingleGigsDetailsSuccess(state, action) {
      state.isLoading = false;
      state.isPreLoading = false;
      state.singleGigDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Gigs
      .addCase(geAllGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(geAllGigs.fulfilled, (state, action) => {
  state.isLoading = false;
  state.gigsDetail = action.payload.data;   // flat gigs array
  state.pagination = action.payload.pagination; // pagination metadata
})


      .addCase(geAllGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.getError = action.payload;
      })
      // Get Gig Detail
      .addCase(getGigDetail.pending, (state) => {
        state.isPreLoading = true;
      })
      .addCase(getGigDetail.fulfilled, (state, action) => {
        state.isPreLoading = false;
        state.singleGigDetail = action.payload;
      })
      .addCase(getGigDetail.rejected, (state, action) => {
        state.isPreLoading = false;
        state.getError = action.payload;
      });
  },
});

export const { 
  getGigsDetailsSuccess,
  startLoading,
  startPreLoading,
  stopLoading,
  hasGetError,
  getGigssSuccess,
  getSingleGigsDetailsSuccess 
} = allGigsSlice.actions;

export default allGigsSlice.reducer;

// ✅ Convert to createAsyncThunk
// allGigsSlice.js
export const geAllGigs = createAsyncThunk(
  'allGigs/getAllGigs',
  async ({ page = 1, limit = 4, categoryId = '', search = '' }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('category-wise-gigs', {
        params: {
          page,
          per_page: limit,
          category_id: categoryId,
          search
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);



export const getGigDetail = createAsyncThunk(
  'allGigs/getGigDetail',
  async (gigId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('gig-detail/' + gigId, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
    
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);