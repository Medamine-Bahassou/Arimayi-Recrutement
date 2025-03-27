import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCandidate: null,
  listCandidate: [],
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      console.log(action)
      state.listCandidate.push(action.payload);
    },
    selectCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
  },
});

export const { addCandidate, selectCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;
