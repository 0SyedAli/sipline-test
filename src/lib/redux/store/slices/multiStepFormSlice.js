// store/slices/multiStepFormSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminId: null,
  token: null,
  profileData: null,
  shopData: null
};

const multiStepFormSlice = createSlice({
  name: 'multiStepForm',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.adminId = action.payload.adminId;
      state.token = action.payload.token;
    },

    updateForm: (state, action) => {
      // console.log("action:", action.payload);
      state.profileData = {
        ...state.profileData, // Keep existing profileData
        ...action.payload,   // Add/Update fields from the dispatched action
      };
    },
    updateShopData: (state, action) => {
      // console.log("action:", action.payload);
      state.shopData = {
        ...state.shopData, // Keep existing profileData
        ...action.payload,   // Add/Update fields from the dispatched action
      };
    },
    resetForm: () => initialState,
  },
});

export const { updateForm, resetForm, setAdmin, updateShopData} = multiStepFormSlice.actions;
export default multiStepFormSlice.reducer;