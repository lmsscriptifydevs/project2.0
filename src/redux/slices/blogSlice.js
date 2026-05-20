// src/redux/slices/blogSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

// 🔹 Fetch all blogs
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("/admin/blogs", {
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

// 🔹 Create a new blog
// export const createBlog = createAsyncThunk(
//   "blogs/create",
//   async (formData, thunkAPI) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await axios.post("/admin/blogs", formData, {
//         headers: {
//                   Authorization: `Bearer ${token}`,
//               },
//       });
//       // assuming your API returns { data: { /* new blog */ } }
//       return response.data.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || err.message
//       );
//     }
//   }
// );


export const createBlog = createAsyncThunk(
  "blogs/create",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/admin/blogs",          // assuming axios.baseURL = http://…/api
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


const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //── Fetch blogs ───────────────────────────────────────
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //── Create blog ───────────────────────────────────────
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // prepend the new blog
        state.list.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
