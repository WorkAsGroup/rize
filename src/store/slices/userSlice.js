import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  activeTab: "Dashboard"
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab =  action.payload
    }
  },
});

export const { setUser, clearUser,setActiveTab } = userSlice.actions;
export default userSlice.reducer;
