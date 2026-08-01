import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    aiResult: null,
    complaints: [],
    stats: {
        total: 0,
        open: 0,
        closed: 0,
        highSeverity: 0,
    },
};

const complaintSlice = createSlice({
    name: "complaint",
    initialState,
    reducers: {

        setAIResult: (state, action) => {
            state.aiResult = action.payload;
        },

        clearAIResult: (state) => {
            state.aiResult = null;
        },

        setComplaints: (state, action) => {
            state.complaints = action.payload;
        },

        setStats: (state, action) => {
            state.stats = action.payload;
        },

    },
});

export const {
    setAIResult,
    clearAIResult,
    setComplaints,
    setStats,
} = complaintSlice.actions;

export default complaintSlice.reducer;