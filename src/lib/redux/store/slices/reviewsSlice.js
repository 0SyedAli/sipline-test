// store/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  rating: null,
  loading: false,
  error: null,
};

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ shopId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}review/shopReviews?shopId=${shopId}`
      );
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching overall rating
export const fetchRating = createAsyncThunk(
  'reviews/fetchRating',
  async ({ adminId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}review/overAllRating?adminId=${adminId}`
      );
      if (!response.ok) throw new Error('Failed to fetch rating');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchRating
      .addCase(fetchRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRating.fulfilled, (state, action) => {
        state.loading = false;
        state.rating = action.payload;
      })
      .addCase(fetchRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
