// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import multiStepFormReducer from './slices/multiStepFormSlice';
import reviewsReducer from './slices/reviewsSlice';
export const store = configureStore({
  reducer: {
    multiStepForm: multiStepFormReducer,
     reviews: reviewsReducer,
  },
});