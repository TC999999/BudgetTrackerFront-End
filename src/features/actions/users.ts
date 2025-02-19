import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserInfoInterface,
  UserEditInterface,
} from "../../interfaces/userInterfaces";
import { API_URL } from "../config";
import axios from "axios";

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

export const addToAssets = createAsyncThunk<
  UserInfoInterface,
  UserEditInterface
>(
  "user/update/assets",
  async (updateInfo: UserEditInterface = { value: 0 }, thunkAPI) => {
    try {
      let res = await axios({
        method: "patch",
        url: `${API_URL}/users/update/assets`,
        data: updateInfo,
        withCredentials: true,
      });
      return res.data.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
