import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  count: 0,
  loading: false,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationData: (state, action) => {
      state.data = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.count = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Sets loading state (true or false)
    },
  },
});

export const { setNotificationData, setLoading, setNotificationCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
