import { createSlice } from '@reduxjs/toolkit';

// Initial state definition
const initialState = {
    loading: false,
    error: null,
    success: null,
    examQuestions: [],
    examPatternSections: [],
    activeSubjectId: null,         // Stores the active subject ID
    activeQuestionIndex: 0,        // Stores the active question index
    questionDetails: [],           // Stores the details of a specific question
    examDuration: 0,             // Default exam duration (in minutes)
    questionLoading: false,
    uid: null,                      ///  uniquee id
    examSessionId: 0,
    finishTest: false,
    autoSaveId: 0,
    reload_question: false,
    autoSaveTimeData: [],
    finishedData: {},
};

// Create the slice using `createSlice` from Redux Toolkit
const questionsSlice = createSlice({
    name: 'questions',            // Slice name
    initialState,                 // Initial state of the slice
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;    // Sets loading state (true or false)
        },
        setError: (state, action) => {
            state.error = action.payload;      // Sets error state
        },
        setSuccess: (state, action) => {
            state.success = action.payload;    // Sets success state
        },
        setExamQuestions: (state, action) => {
            state.examQuestions = action.payload;  // Updates the exam questions list
        },
        setActiveSubjectId: (state, action) => {
            state.activeSubjectId = action.payload;  // Sets the active subject ID
        },
        setActiveQuestionIndex: (state, action) => {
            state.activeQuestionIndex = action.payload;  // Sets the active question index
        },
        setExamDuration: (state, action) => {
            state.examDuration = action.payload;  // Updates exam duration
        },
        setExamPatternSections: (state, action) => {
            state.examPatternSections = action.payload;  // Updates the exam pattern sections
        },
        setQuestionDetails: (state, action) => {
            state.questionDetails = action.payload;  // Sets the question details array
        },
        setQuestionLoading: (state, action) => {
            state.questionLoading = action.payload
        },
        setUniqueeId: (state, action) => {
            state.uid = action.payload;
        },
        setExamSessionId: (state, action) => {
            state.examSessionId = action.payload;
        },
        setFinishTest: (state, action) => {
            state.finishTest = action.payload;
        },
        setFinishedData: (state, action) => {
            state.finishedData = action.payload
        },
        setAutoSaveId: (state, action) => {
            state.autoSaveId = action.payload
        },
        setReloadQuestion: (state, action) => {
            state.reload_question = action.payload;
        },
        setAutoSaveTime: (state, action) => {
            state.autoSaveTimeData = action.payload;
        },
        updateQuestionDetail: (state, action) => {
            state.questionDetails = action.payload
        },
        resetQuestionDetails: (state) => {
            state.questionDetails = [];  // Clears all question details
        },
        resetState: (state) => {
            state.examQuestions = [];
            state.examPatternSections = [];
            state.activeSubjectId = null;
            state.activeQuestionIndex = 0;
            state.questionDetails = [];
            state.examDuration = null;
            state.loading = false;
            state.error = null;
            state.success = null;
            state.uid = null;
            state.checkScoreModal = false;
            state.finishTest = false;
            state.finishedData ={};
            state.reload_question = false;
            state.autoSaveTimeData = [];
            state.autoSaveId = 0;
        }
    },
});


export const {
    setLoading,
    setError,
    setSuccess,
    setExamQuestions,
    setActiveSubjectId,
    setActiveQuestionIndex,
    setExamDuration,
    setExamPatternSections,
    setQuestionDetails,
    setQuestionLoading,
    updateQuestionDetail,
    resetQuestionDetails,
    resetState,
    setExamSessionId,
    setUniqueeId,
    setQuestionData,
    setFinishTest,
    setFinishedData,
    setAutoSaveId,
    setReloadQuestion,
    setAutoSaveTime,
} = questionsSlice.actions;

// Exporting the reducer to be used in the store
export default questionsSlice.reducer;