import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Start loading notifications
    startLoading(state) {
      state.isLoading = true;
    },
    // Stop loading notifications
    stopLoading(state) {
      state.isLoading = false;
    },
    // Set an error message when a request fails
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Successfully fetched notifications
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  hasError,
  getNotificationsSuccess,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Async action to fetch notifications from your API
export function fetchNotifications() {
  return async (dispatch) => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("UserData"));
    const userId = userData?.id;
 
    
    dispatch(startLoading());
    try {
      // Adjust the URL to match your endpoint
      const response = 
      await axios.get("notifications/" + userId, {
     
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      dispatch(getNotificationsSuccess(response.data?.data));
    } catch (error) {
      dispatch(hasError(error?.message));
    }
  };
}
