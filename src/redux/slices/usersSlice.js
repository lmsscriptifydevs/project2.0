import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from '../../utils/axios';

const initialState = {
  isLoadingRegister: false,
  isLoadingUsers: false,
   // ✅ new
  user: null,
  users: [], // ✅ important fix
  
  
  error: null,
};

// Register
export const userRegister = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "register",
        userData
      );
      if (response.data.status) {
        toast.success("Successfully Registered! Please log in.");
        return response.data;
      } else {
        toast.error(response.data.message || "Registration failed.");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error("Registration failed. Try again.");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// OTP Verification
export const userOtp = createAsyncThunk(
  "user/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "verify-otp",
        otpData
      );
      if (response.data.status) {
        toast.success("OTP verified successfully.");
        return response.data;
      } else {
        toast.error(response.data.message || "OTP verification failed.");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error("OTP verification failed. Try again.");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//fetch users
// Fetch Admin Users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("admin/users", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      
      // Return the WHOLE response data object
      return response.data;
    } catch (error) {
      toast.error("Error fetching users.");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(userRegister.pending, (state) => {
        state.isLoadingRegister = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoadingRegister = false;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoadingRegister = false;
        state.error = action.payload;
      })

      // OTP
      .addCase(userOtp.pending, (state) => {
        state.isLoadingRegister = true;
      })
      .addCase(userOtp.fulfilled, (state, action) => {
        state.isLoadingRegister = false;
        state.user = action.payload;
      })
      .addCase(userOtp.rejected, (state, action) => {
        state.isLoadingRegister = false;
        state.error = action.payload;
      })

     
  },
});

export default userSlice.reducer;
