import { createSlice } from "@reduxjs/toolkit";
import { LOADING_INITIAL_STATE } from "../config";
import { addToAssets } from "../actions/users";
import { ActionInterface } from "../../interfaces/miscTypes";

const loadSlice = createSlice({
  name: "loading",
  initialState: LOADING_INITIAL_STATE,
  reducers: {
    //sets state for errors involving failure to submit data
    setLoadError: (state, action: ActionInterface) => {
      state.loadError = action.payload;
    },
    // changes on page loading state when submitting a form
    setFormLoading: (state, action: ActionInterface) => {
      state.loadingInfo.formLoading = action.payload;
    },
    // changes on page loading state for when getting data
    setPageLoading: (state, action: ActionInterface) => {
      state.loadingInfo.pageLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToAssets.pending, (state) => {
        state.loadingInfo.formLoading = true;
      })
      .addCase(addToAssets.fulfilled, (state) => {
        state.loadingInfo.formLoading = false;
      })
      .addCase(addToAssets.rejected, (state) => {
        state.loadingInfo.formLoading = false;
      });
  },
});

export const { setFormLoading, setPageLoading, setLoadError } =
  loadSlice.actions;

export default loadSlice.reducer;
