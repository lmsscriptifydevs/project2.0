import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  isLoading: false,
  getError: null,
  userRating: [],
  userRatingDetain: {},
  allRating: [],
  userallRating: [],
};

const RatingSlice = createSlice({
  name: "rate",
  initialState,
  reducers: {
    //START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    //STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },
    // HAS UPDATE ERROR
    hasGetError(state, action) {
      state.isLoading = false;
      state.getError = action.payload;
    },
    // GET User DETAILS
    getUserRatingSuccess(state, action) {
      state.isLoading = false;
      state.userRating = action.payload;
    },
    getUserRating(state, action) {
      state.isLoading = false;
      state.userRatingDetain = action.payload;
    },
    getRating(state, action) {
      state.allRating = action.payload;
    },
    getUserAllRating(state, action) {
      state.allRating = action.payload;
    },
  },
});

export default RatingSlice.reducer;

// Export actions separately
export const { 
  startLoading, 
  stopLoading, 
  hasGetError, 
  getUserRatingSuccess, 
  getUserRating,
  getRating,
  getUserAllRating 
} = RatingSlice.actions;

// Move async actions to a separate file (recommended) or use a different dispatch approach
export const sellerRating = (userId) => async (dispatch) => {
  dispatch(startLoading());
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      "seller-rating-list",
      {
        params: { userId }, // send userId as query param
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }
    );

    dispatch(getUserRatingSuccess(response.data.data));

    const ratings = response.data.data.map((item) => parseFloat(item.ratings));
    dispatch(getRating(ratings));

  } catch (error) {
    dispatch(hasGetError(error?.message));
  }
};


export const UserRating = () => async (dispatch) => {
  let accessToken = localStorage.getItem("accessToken");
  dispatch(startLoading());
  try {
    const response = await axios.get("user-rating", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
    });
    dispatch(getUserRating(response.data.data));
    const ratings = response.data.data.map((item) => parseFloat(item.ratings));
    dispatch(getUserAllRating(ratings));
  } catch (error) {
    dispatch(hasGetError(error?.message));
  }
};