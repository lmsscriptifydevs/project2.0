import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from "../../utils/axios";

// Async thunks
export const fetchBidPayments = createAsyncThunk(
  'bidPayment/fetchBidPayments',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${HOST_API}admin/bid-payments`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bid payments');
      }

      const data = await response.json();
      return data.bidPayments || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveBidPayment = createAsyncThunk(
  'bidPayment/approveBidPayment',
  async (bidId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${HOST_API}admin/bid-payments/${bidId}/approve`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve bid payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectBidPayment = createAsyncThunk(
  'bidPayment/rejectBidPayment',
  async (bidId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${HOST_API}admin/bid-payments/${bidId}/reject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject bid payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch bid packages
export const getBidPackages = createAsyncThunk(
  'bids/getBidPackages',
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('/bid-packages', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Failed to fetch bid packages' }
      );
    }
  }
);

// Async thunk to purchase a bid package
export const purchaseBidPackage = createAsyncThunk(
  'bids/purchaseBidPackage',
  async (payload, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('/purchase-bids', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Purchase failed' }
      );
    }
  }
);

// ✅ Async thunk to fetch user's bid purchase history
export const fetchBidsHistory = createAsyncThunk(
  'bids/fetchBidsHistory',
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('/bids-history', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Failed to fetch bids history' }
      );
    }
  }
);

// ✅ New async thunk to fetch bids for admin
export const getBids = createAsyncThunk(
  'bids/getBids',
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('/admin/bids', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Failed to fetch bids' }
      );
    }
  }
);

const bidsSlice = createSlice({
  name: 'bidPayment',
  initialState: {
    bidPayments: [],
    bidsHistory: [],
    bidsHistoryLoading: false,
    bidsHistoryError: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bid payments
      .addCase(fetchBidPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBidPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bidPayments = action.payload;
      })
      .addCase(fetchBidPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Approve bid payment
      .addCase(approveBidPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveBidPayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(approveBidPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // purchaseBidPackage
      .addCase(purchaseBidPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchaseBidPackage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(purchaseBidPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || "Purchase failed";
      })
      

      // Fetch bids history
      .addCase(fetchBidsHistory.pending, (state) => {
        state.bidsHistoryLoading = true;
        state.bidsHistoryError = null;
      })
      .addCase(fetchBidsHistory.fulfilled, (state, action) => {
        state.bidsHistoryLoading = false;
        state.bidsHistory = action.payload;
      })
      .addCase(fetchBidsHistory.rejected, (state, action) => {
        state.bidsHistoryLoading = false;
        state.bidsHistoryError = action.payload;
      })
      // Reject bid payment
      .addCase(rejectBidPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectBidPayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(rejectBidPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bidsSlice.actions;

export default bidsSlice.reducer;

