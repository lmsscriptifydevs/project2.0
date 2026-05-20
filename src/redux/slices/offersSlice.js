import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  offerIsLoading: false,
  isLoadingCreate: false,
  isLoadingOffer: false,
  getError: null,
  offerDetail: [],
  personalGigs: [],
  isLoadingExperts: false,
  errorExperts: null,
  experts: [],
  userGigs: {},
  buyerOfferlist: [],
  isAssigning: false,
  assignError: null,
  assignSuccess: false,
}

const OffersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    //START LOADING
    startLoading(state) {
      state.offerIsLoading = true
    },
    startLoadingCreate(state) {
      state.isLoadingCreate = true
    },
    startLoadingOfferDetail(state) {
      state.isLoadingOffer = true
    },
    //STOP LOADING
    stopLoading(state) {
      state.offerIsLoading = false;
      state.isLoadingCreate = false;
      state.isLoadingOffer = false;
    },
 
    // HAS UPDATE ERROR
    hasGetError(state, action) {
      state.offerIsLoading = false;
      state.isLoadingCreate = false;
      state.isLoadingOffer = false;  
      state.getError = action.payload
    },

    startLoadingExperts: (state) => {
      state.isLoadingExperts = true;
      state.errorExperts = null;
    },
    // Action when experts are successfully fetched
    getExpertsSuccess: (state, action) => {
      state.isLoadingExperts = false;
      state.experts = action.payload;
    },
    // Action when fetching experts fails
    hasGetErrorExperts: (state, action) => {
      state.isLoadingExperts = false;
      state.errorExperts = action.payload;
    },

    // GET All OFFERS DETAILS
    getAllOfferDetails(state, action) {
      state.offerIsLoading = false;
      state.offerDetail = action.payload
    },
    // GET GIGS DETAILS
    getOfferGigDetails(state, action) {
      state.offerIsLoading = false;
      state.personalGigs= action.payload
    },
    // GET USER GIGS DETAILS
    getUserGigDetails(state, action) {
      state.offerIsLoading = false;
      state.userGigs= action.payload
    },
    // GET BUYER OFFER DETAILS
    getBuyerOfferDetail(state, action) {
      state.isLoadingOffer = false;
      state.buyerOfferlist= action.payload
    },

    startAssigning: (state) => {
      state.isAssigning = true;
      state.assignSuccess = false;
      state.assignError = null;
    },
    assignSuccess: (state) => {
      state.isAssigning = false;
      state.assignSuccess = true;
    },
    assignError: (state, action) => {
      state.isAssigning = false;
      state.assignError = action.payload;
    },
  },
})

export const { 
  getAllOfferDetails, 
  getOfferGigDetails, 
  getBuyerOfferDetail, 
  getUserGigDetails, 
  startLoadingExperts,
  getExpertsSuccess,
  hasGetErrorExperts,
} = OffersSlice.actions;

export default OffersSlice.reducer

// User Functions

//Invite to Job
export function inviteToJob(data, handleClose) {
  return async (dispatch) => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startLoadingCreate());
    
    try {
      const response = await axios.post('job-invitation', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });

      // Handle optional callback
      if (handleClose) handleClose(response.data);

      // Check for server-side errors
      if (!response.data.status) {
        const errorMsg = response.data.message || "Request failed";
        dispatch(OffersSlice.actions.hasGetError(errorMsg));
        throw new Error(errorMsg);
      }

      // Stop loading on success
      dispatch(OffersSlice.actions.stopLoading());
      return response.data;
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      
      if (handleClose) handleClose(error);
      throw error;
    }
  };
}

// Create Offer Request - FIXED VERSION

export const CreateOfferRequest = createAsyncThunk(
  'offers/createOffer',
  async (data, { rejectWithValue }) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      // Check if data is FormData (for file uploads) or plain object
      const isFormData = data instanceof FormData;
      
      const headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      };

      // Only set Content-Type for JSON; for FormData, let browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.post('offer-request', data, { headers });

      if (!response.data.status) {
        const errorMsg = response.data.message || "Request failed";
        return rejectWithValue(errorMsg); // If error, reject with message
      }

      return response.data; // Return response data if successful
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      return rejectWithValue(errorMsg); // Reject with error message
    }
  }
);


export const AcceptOfferRequest = createAsyncThunk(
  'offers/acceptOffer',
  async (data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      };

      const payload = data instanceof FormData ? data : JSON.stringify(data);

      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.post('accept-offer', payload, { headers });

      if (!response.data.status) {
        return rejectWithValue(response.data.message || "Request failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


//reject offer 
export function RejectOfferRequest(data, handleClose) {
  return async (dispatch) => {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(OffersSlice.actions.startLoadingCreate());

    try {
      const response = await axios.post('reject-offer', data, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Handle optional callback
      if (handleClose) handleClose(response.data);

      // Check for server-side errors
      if (!response.data.status) {
        const errorMsg = response.data.message || "Request failed";
        dispatch(OffersSlice.actions.hasGetError(errorMsg));
        throw new Error(errorMsg);
      }

      // Stop loading on success
      dispatch(OffersSlice.actions.stopLoading());
      return response.data;
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      
      if (handleClose) handleClose(error);
      throw error;
    }
  };
}

//Assign to Expert Request
export function AssignToExpertRequest(data) {
  return async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startAssigning());
    
    try {
      // Configure headers dynamically
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      };

      // Use FormData instance for files
      const payload = data instanceof FormData 
        ? data 
        : JSON.stringify(data);

      // Set content type automatically
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.post('assign-to-expert', payload, { headers });
      
      if (!response.data.status) {
        const errorMsg = response.data.message || "Assignment failed";
        dispatch(OffersSlice.actions.assignError(errorMsg));
        throw new Error(errorMsg);
      }

      dispatch(OffersSlice.actions.assignSuccess());
      return response.data;
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(OffersSlice.actions.assignError(errorMsg));
      throw error;
    }
  };
}

//getting experts 
export function getExperts(handleClose) {
  return async (dispatch) => {
    let accessToken = localStorage.getItem("accessToken");
    dispatch(OffersSlice.actions.startLoadingExperts());
    
    try {
      const response = await axios.get("experts", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      
      if (response.data) {
        dispatch(OffersSlice.actions.getExpertsSuccess(response.data));
      } else {
        dispatch(OffersSlice.actions.hasGetErrorExperts(response.data.message));
      }
      
      if (handleClose) handleClose(response.data);
      return response.data;
      
    } catch (error) {
      const errorMsg = error.message;
      dispatch(OffersSlice.actions.hasGetErrorExperts(errorMsg));
      
      if (handleClose) handleClose(error);
      throw error;
    }
  };
}

//Get getOfferGigs
export function getPersonalGigs(data) {
  return async (dispatch) => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startLoading());
    
    try {
      const response = await axios.get('user-gig-detail', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        params: data
      });

      dispatch(OffersSlice.actions.getOfferGigDetails(response.data.data));
      return response.data.data;
      
    } catch (error) {
      const errorMsg = error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      throw error;
    }
  };
}

// Get get ALL OFFER Request
export function getOfferRequest() {
  return async (dispatch) => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startLoading());
    
    try {
      const response = await axios.get('offer-request', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });

      dispatch(OffersSlice.actions.getAllOfferDetails(response.data.data));
      return response.data.data;
      
    } catch (error) {
      const errorMsg = error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      throw error;
    }
  };
}

//Get get Offer Request
export function getBuyerOfferRequest(data) {
  return async (dispatch) => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startLoadingOfferDetail());
    
    try {
      const response = await axios.get('buyer-offer-list', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        params: data
      });

      dispatch(OffersSlice.actions.getBuyerOfferDetail(response.data.data));
      return response.data.data;
      
    } catch (error) {
      const errorMsg = error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      throw error;
    }
  };
}

//Get getUserGigs
export function getUserGigs(data) {
  return async (dispatch) => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(OffersSlice.actions.startLoading());
    
    try {
      const response = await axios.get('gig-user', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        params: data
      });

      dispatch(OffersSlice.actions.getUserGigDetails(response.data.data));
      return response.data.data;
      
    } catch (error) {
      const errorMsg = error.message;
      dispatch(OffersSlice.actions.hasGetError(errorMsg));
      throw error;
    }
  };
}