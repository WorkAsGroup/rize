import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // example slice
import headerReducer from "./slices/headerSlice";
import examsReducer from "./slices/examSlice";
import notificationReducer from "./slices/NotificationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  header: headerReducer,
  questions: examsReducer,
  notifications: notificationReducer,
});
export default rootReducer;
