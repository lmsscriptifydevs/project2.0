// redux/slices/authSlice.js
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('accessToken');
      return rejectWithValue('Invalid token');
    }
  }
);