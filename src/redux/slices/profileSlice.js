import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { dispatch } from '../store/store';

const initialState = {
  isLoading: false,
  createError: null,
  updateError: null,
  getError: null,
  deleteError: null,
  phoneError: null,
  otpError: null,
  userList: [],
  userDetail: {},
  myReferrals: [],
  phoneVerificationLoading: false,
  otpVerificationLoading: false,
};

const profileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },
    // HAS CREATE ERROR
    hasCreateError(state, action) {
      state.isLoading = false;
      state.createError = action.payload;
    },
    // UPDATE ERROR
    hasUpdateError(state, action) {
      state.isLoading = false;
      state.updateError = action.payload;
    },
    // HAS GET ERROR
    hasGetError(state, action) {
      state.isLoading = false;
      state.getError = action.payload;
    },
    // HAS DELETE ERROR
    hasDeleteError(state, action) {
      state.isLoading = false;
      state.deleteError = action.payload;
    },
    // PHONE VERIFICATION LOADING
    startPhoneVerificationLoading(state) {
      state.phoneVerificationLoading = true;
      state.phoneError = null;
    },
    // PHONE VERIFICATION ERROR
    hasPhoneError(state, action) {
      state.phoneVerificationLoading = false;
      state.phoneError = action.payload;
    },
    // OTP VERIFICATION LOADING
    startOtpVerificationLoading(state) {
      state.otpVerificationLoading = true;
      state.otpError = null;
    },
    // OTP VERIFICATION ERROR
    hasOtpError(state, action) {
      state.otpVerificationLoading = false;
      state.otpError = action.payload;
    },
    // GET User Success
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },
    // GET User DETAILS
    getUserDetailsSuccess(state, action) {
      state.isLoading = false;
      state.userDetail = action.payload;
    },
    getMyReferralSuccess(state, action) {
      state.isLoading = false;
      state.myReferrals = action.payload;
    },
    // Clear phone errors
    clearPhoneErrors(state) {
      state.phoneError = null;
    },
    // Clear OTP errors
    clearOtpErrors(state) {
      state.otpError = null;
    },
  },
});

export const { 
  getUserDetailsSuccess,
  clearPhoneErrors,
  clearOtpErrors 
} = profileSlice.actions;

export default profileSlice.reducer;

// User Functions

// User profile
export function userProfile(data) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startLoading());
    try {
      const response = await axios.post('profile', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
      if (!response.data.status) {
        dispatch(profileSlice.actions.hasGetError(response?.data?.message));
      }
      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
      dispatch(profileSlice.actions.getMyReferralSuccess(response.data.referralList));

    } catch (error) {
      dispatch(profileSlice.actions.hasGetError(error?.message));
    }
  };
}

// Profile update
export function profileUpdate(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startLoading());
    try {
      const formData = new FormData();
      data.fname && formData.append('fname', data.fname);
      data.lname && formData.append('lname', data.lname);
      data.phone && formData.append('phone', data.phone);
      data.country && formData.append('country', data.country);
      data.city && formData.append('city', data.city);
      data.state && formData.append('state', data.state);
      data.postalCode && formData.append('postalCode', data.postalCode);
      data.image && formData.append('image', data.image);
      data.device_token && formData.append('device_token', data.device_token);
      data.professional_summary !== undefined && formData.append('professional_summary', data.professional_summary);

      const response = await axios.post('update-profile', formData, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
      });

      handleClose(response.data);
      if (!response.data.status) {
        dispatch(profileSlice.actions.hasGetError(response?.data?.message));
      }
      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
    } catch (error) {
      handleClose(error);
      dispatch(profileSlice.actions.hasGetError(error?.message));
    }
  };
}

// Change Password
export function profileChangePassword(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startLoading());
    try {
      const response = await axios.post('change-password', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      handleClose(response.data);
      if (!response.data.status) {
        dispatch(profileSlice.actions.hasGetError(response?.data?.message));
      }
      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
    } catch (error) {
      handleClose(error);
      dispatch(profileSlice.actions.hasGetError(error?.message));
    }
  };
}

// Send Phone OTP
export function sendPhoneOTP(data) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startPhoneVerificationLoading());
    try {
      const response = await axios.post('send-phone-otp', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });

      if (!response.data.status) {
        dispatch(profileSlice.actions.hasPhoneError(response?.data?.message));
        return Promise.reject(response?.data?.message);
      }

      dispatch(profileSlice.actions.stopLoading());
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(profileSlice.actions.hasPhoneError(error?.message));
      return Promise.reject(error?.message);
    }
  };
}

// Verify Phone OTP
export function verifyPhoneOTP(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startOtpVerificationLoading());
    try {
      const response = await axios.post('verify-phone-otp', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });

      if (!response.data.status) {
        dispatch(profileSlice.actions.hasOtpError(response?.data?.message));
        handleClose(response.data);
        return;
      }

      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
      handleClose(response.data);
    } catch (error) {
      dispatch(profileSlice.actions.hasOtpError(error?.message));
      handleClose(error);
    }
  };
}

// Get Email Verify (existing)
export function getPhoneNumberVer() {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');
    dispatch(profileSlice.actions.startLoading());
    try {
      const response = await axios.get('send-otp', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
    } catch (error) {
      dispatch(profileSlice.actions.hasGetError(error?.message));
    }
  };
}

// OTP Verify (existing)
export function PrifileOtp(data, handleClose) {
  return async () => {
    let accessToken = localStorage.getItem('accessToken');

    dispatch(profileSlice.actions.startLoading());
    try {
      const response = await axios.post('verify-otp', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      handleClose(response.data);
      if (!response.data.status) {
        dispatch(profileSlice.actions.hasGetError(response?.data?.message));
      }
      dispatch(profileSlice.actions.getUserDetailsSuccess(response.data.data));
    } catch (error) {
      handleClose(error);
      dispatch(profileSlice.actions.hasGetError(error?.message));
    }
  };
}