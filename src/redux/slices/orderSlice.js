// src/redux/slices/orderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

// 🔹 Fetch all blogs
export const fetchProjects = createAsyncThunk(
  "orders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // assuming your API returns { data: [...] }
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs."
      );
    }
  }
);


export const  updateProjectStatus = createAsyncThunk(
  "project status/update",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/admin/orders",          // assuming axios.baseURL = http://…/api
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          // prevent any JSON transform
          transformRequest: [(data, headers) => data],
        }
      );
      toast.success("Blog created!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //── Fetch blogs ───────────────────────────────────────
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //── Create blog ───────────────────────────────────────
      .addCase(updateProjectStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // prepend the new blog
        state.list.unshift(action.payload);
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
