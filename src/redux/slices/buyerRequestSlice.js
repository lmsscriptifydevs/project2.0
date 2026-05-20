import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  isLoadingCreate: false,
  isLoadingBuyerList: false,
  bdListLoading: false, // New loading state
  getError: null,
  requestDetail: [],
  requestClientList: [],
  bdList: [],
};

const BuyerSlice = createSlice({
  name: 'buyer',
  initialState,
  reducers: {
    // Loading controls
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    startLoadingCreate: (state) => {
      state.isLoadingCreate = true;
    },
    stopLoadingCreate: (state) => {
      state.isLoadingCreate = false;
    },
    startLoadingBuyerList: (state) => {
      state.isLoadingBuyerList = true;
    },
    stopLoadingBuyerList: (state) => {
      state.isLoadingBuyerList = false;
    },
    startLoadingBds: (state) => {
      state.bdListLoading = true;
    },
    stopLoadingBds: (state) => {
      state.bdListLoading = false;
    },

    // Error handling
    hasGetError: (state, action) => {
      state.getError = action.payload;
    },

    // Data setters
    getUserDetailsSuccess: (state, action) => {
      state.requestDetail = action.payload;
      state.getError = null;
    },
    getClientDetail: (state, action) => {
      state.requestClientList = action.payload;
      state.getError = null;
    },
   // Update the getBdsSuccess reducer
getBdsSuccess: (state, action) => {
  // Handle both array and object responses
 state.bdList = action.payload?.data || 
                 action.payload?.users || 
                 action.payload?.results || 
                 action.payload || [];
  state.getError = null;
  state.bdListLoading = false;
},
    getBdsFailure: (state) => {
      state.bdListLoading = false;
    }
  },
});

export const {
  startLoading,
  stopLoading,
  startLoadingCreate,
  stopLoadingCreate,
  startLoadingBuyerList,
  stopLoadingBuyerList,
  startLoadingBds,
  stopLoadingBds,
  hasGetError,
  getUserDetailsSuccess,
  getClientDetail,
  getBdsSuccess,
  getBdsFailure
} = BuyerSlice.actions;

export default BuyerSlice.reducer;

// Thunk Actions
export const CreateBuyerRequest = (data, handleClose) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    dispatch(hasGetError('Authentication required'));
    return;
  }

  dispatch(startLoadingCreate());

  try {
    // Check if data is FormData (for file uploads) or plain object
    const isFormData = data instanceof FormData;
    
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    // If FormData, let axios set Content-Type automatically (multipart/form-data)
    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post('buyer-request', data, config);

    if (response.data.status) {
      handleClose({ success: true, data: response.data });
    } else {
      dispatch(hasGetError(response.data.message || 'Request failed'));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(hasGetError(errorMessage));
    handleClose({ success: false, error: errorMessage });
  } finally {
    dispatch(stopLoadingCreate());
  }
};

export const getBuyerRequest = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    dispatch(hasGetError('Authentication required'));
    return;
  }

  dispatch(startLoading());

  try {
    const response = await axios.get('buyer-request', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Debug: log the raw API response
    console.log('🔍 getBuyerRequest raw response:', response.data);
    console.log('🔍 getBuyerRequest response keys:', Object.keys(response.data));
    
    // Recursively extract array from nested response structures
    const extractArray = (input, depth = 0) => {
      if (Array.isArray(input)) return input;
      if (input && typeof input === 'object') {
        console.log(`🔍 extractArray depth=${depth} keys:`, Object.keys(input));
        // Try all possible array keys recursively
        const keysToTry = ['data', 'requests', 'results', 'list', 'buyer_requests', 'records', 'items', 'buyerRequests', 'request', 'allRequests'];
        for (const key of keysToTry) {
          if (input[key] !== undefined && input[key] !== null) {
            const result = extractArray(input[key], depth + 1);
            if (Array.isArray(result)) return result;
          }
        }
      }
      return []; // Return empty array if no array found - FIXED
    };
    
    let data = extractArray(response.data);
    console.log('🔍 getBuyerRequest final extracted data:', data);
    console.log('🔍 getBuyerRequest extracted data length:', data.length);
    dispatch(getUserDetailsSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(hasGetError(errorMessage));
  } finally {
    dispatch(stopLoading());
  }
};

export const getBdBuyerRequest = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    dispatch(hasGetError('Authentication required'));
    return;
  }

  dispatch(startLoading());

  try {
    const response = await axios.get('bd-buyer-request', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Debug: log the raw API response
    console.log('🔍 getBdBuyerRequest raw response:', response.data);
    console.log('🔍 getBdBuyerRequest response keys:', Object.keys(response.data));
    
    // Recursively extract array from nested response structures
    const extractArray = (input, depth = 0) => {
      if (Array.isArray(input)) return input;
      if (input && typeof input === 'object') {
        console.log(`🔍 extractArray depth=${depth} keys:`, Object.keys(input));
        // Try all possible array keys recursively
        const keysToTry = ['data', 'requests', 'results', 'list', 'buyer_requests', 'records', 'items', 'buyerRequests', 'request', 'allRequests'];
        for (const key of keysToTry) {
          if (input[key] !== undefined && input[key] !== null) {
            const result = extractArray(input[key], depth + 1);
            if (Array.isArray(result)) return result;
          }
        }
      }
      return []; // Return empty array if no array found - FIXED
    };
    
    let data = extractArray(response.data);
    console.log('🔍 getBdBuyerRequest final extracted data:', data);
    console.log('🔍 getBdBuyerRequest extracted data length:', data.length);
    dispatch(getUserDetailsSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(hasGetError(errorMessage));
  } finally {
    dispatch(stopLoading());
  }
};

export const getBds = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    dispatch(hasGetError('Authentication required'));
    return;
  }

  dispatch(startLoadingBds());

  try {
    const response = await axios.get('/bds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(getBdsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(hasGetError(errorMessage));
    dispatch(getBdsFailure());
  }
};

export const getClientRequest = (data) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    dispatch(hasGetError('Authentication required'));
    return;
  }

  dispatch(startLoadingBuyerList());

  try {
    const response = await axios.get('buyer-client-list', {
      params: data,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(getClientDetail(response.data.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(hasGetError(errorMessage));
  } finally {
    dispatch(stopLoadingBuyerList());
  }
};