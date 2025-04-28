import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice' // example slice
import headerReducer from "./slices/headerSlice";
import examsReducer from "./slices/examSlice";

const rootReducer = combineReducers({
    user: userReducer,
    header: headerReducer,
    questions: examsReducer,
});
export default rootReducer;