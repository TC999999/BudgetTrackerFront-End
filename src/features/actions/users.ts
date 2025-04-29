import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserInfoInterface,
  NewTransactionInterface,
} from "../../interfaces/userInterfaces";
import { NewTransactionUI } from "../../interfaces/transactionInterfaces";
import { SubmitUserInfoEdit } from "../../interfaces/authInterfaces";
import { API_URL } from "../config";
import axios from "axios";

// returns the data for the current user from the id stored in the refresh_token stored in cookies
export const getCurrentUser = createAsyncThunk<UserInfoInterface, any>(
  "users/get/currentuser",
  async (data: any = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "get",
        url: `${API_URL}/users/get/currentuser`,
        data,
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

// updates a user's total assets based on the value in sent data
export const addToAssets = createAsyncThunk<
  NewTransactionInterface,
  NewTransactionUI
>(
  "user/update/assets",
  async (
    updateInfo: NewTransactionUI = { title: "", value: 0, date: "" },
    thunkAPI
  ) => {
    try {
      let res = await axios({
        method: "patch",
        url: `${API_URL}/users/update/assets`,
        data: updateInfo,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error);
    }
  }
);

// updates a user's total assets based on the value in sent data
export const editUser = createAsyncThunk<any, SubmitUserInfoEdit>(
  "user/edit",
  async (updateInfo = { _id: "", username: "", email: "" }, thunkAPI) => {
    try {
      let res = await axios({
        method: "patch",
        url: `${API_URL}/users/${updateInfo._id}/edit`,
        data: updateInfo,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error);
    }
  }
);
