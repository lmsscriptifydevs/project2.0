import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks using accessToken from localStorage
export const fetchWithdrawals = createAsyncThunk(
  'withdrawals/fetchWithdrawals',
  async (status, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`/admin/withdrawals?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserBalance = createAsyncThunk(
  'withdrawals/fetchUserBalance',
  async (userId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`/admin/user/${userId}/balance`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return { userId, balance: response.data.balance || 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const approveWithdrawal = createAsyncThunk(
  'withdrawals/approveWithdrawal',
  async ({ withdrawalId, transactionId }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `/admin/withdrawals/${withdrawalId}/approve`,
        { transaction_id: transactionId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const rejectWithdrawal = createAsyncThunk(
  'withdrawals/rejectWithdrawal',
  async ({ withdrawalId, reason }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `/admin/withdrawals/${withdrawalId}/reject`,
        { reason },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  withdrawals: [],
  selectedWithdrawal: null,
  selectedTab: 'pending',
  loading: false,
  processing: false,
  error: null,
  alert: { show: false, type: 'success', message: '' },
  showDetailsModal: false,
  showApproveModal: false,
  showRejectModal: false,
  rejectionReason: '',
  transactionId: ''
};

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setSelectedWithdrawal: (state, action) => {
      state.selectedWithdrawal = action.payload;
    },
    setShowDetailsModal: (state, action) => {
      state.showDetailsModal = action.payload;
    },
    setShowApproveModal: (state, action) => {
      state.showApproveModal = action.payload;
    },
    setShowRejectModal: (state, action) => {
      state.showRejectModal = action.payload;
    },
    setRejectionReason: (state, action) => {
      state.rejectionReason = action.payload;
    },
    setTransactionId: (state, action) => {
      state.transactionId = action.payload;
    },
    showAlert: (state, action) => {
      state.alert = {
        show: true,
        type: action.payload.type,
        message: action.payload.message
      };
    },
    hideAlert: (state) => {
      state.alert = initialState.alert;
    },
    resetWithdrawalState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch withdrawals
      .addCase(fetchWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.alert = {
          show: true,
          type: 'error',
          message: action.payload || 'Failed to fetch withdrawal requests'
        };
      })

      // Fetch user balance
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        if (state.selectedWithdrawal && state.selectedWithdrawal.user_id === action.payload.userId) {
          state.selectedWithdrawal.current_balance = action.payload.balance;
        }
      })

      // Approve withdrawal
      .addCase(approveWithdrawal.pending, (state) => {
        state.processing = true;
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        state.showApproveModal = false;
        state.transactionId = '';
        state.alert = {
          show: true,
          type: 'success',
          message: action.payload.message
        };
      })
      .addCase(approveWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.alert = {
          show: true,
          type: 'error',
          message: action.payload || 'Failed to approve withdrawal'
        };
      })

      // Reject withdrawal
      .addCase(rejectWithdrawal.pending, (state) => {
        state.processing = true;
      })
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        state.processing = false;
        state.showRejectModal = false;
        state.rejectionReason = '';
        state.alert = {
          show: true,
          type: 'success',
          message: action.payload.message
        };
      })
      .addCase(rejectWithdrawal.rejected, (state, action) => {
        state.processing = false;
        state.alert = {
          show: true,
          type: 'error',
          message: action.payload || 'Failed to reject withdrawal'
        };
      });
  }
});

export const {
  setSelectedTab,
  setSelectedWithdrawal,
  setShowDetailsModal,
  setShowApproveModal,
  setShowRejectModal,
  setRejectionReason,
  setTransactionId,
  showAlert,
  hideAlert,
  resetWithdrawalState
} = withdrawalSlice.actions;

export default withdrawalSlice.reducer;
