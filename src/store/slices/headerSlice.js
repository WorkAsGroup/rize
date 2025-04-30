import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedExam: null,
  examData:[],
  examLabel: null,
  deviceId: null,
};

const heaserSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setSelectedExam: (state, action) => {
      state.selectedExam = action.payload;
    },
    setExamData: (state, action) => {
      state.examData = action.payload;
    },
    setExamLabel: (state, action) => {
      state.examLabel = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    }
  },
});

export const { setSelectedExam, setExamLabel, setDeviceId, setExamData } = heaserSlice.actions;
export default heaserSlice.reducer;
