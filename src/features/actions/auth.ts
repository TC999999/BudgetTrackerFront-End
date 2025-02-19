import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import {
  LogInInterface,
  SignUpInterface,
} from "../../interfaces/authInterfaces";
import { UserInfoInterface } from "../../interfaces/userInterfaces";
import axios from "axios";

export const registerUser = createAsyncThunk<
  UserInfoInterface,
  SignUpInterface
>("auth/register", async (data: SignUpInterface, thunkAPI) => {
  try {
    let res = await axios({
      method: "post",
      url: `${API_URL}/auth/register`,
      data,
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data.error.message);
  }
});

export const findToken = createAsyncThunk(
  "auth/token",
  async (data: any = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "get",
        url: `${API_URL}/auth/token`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.res.data.errors);
    }
  }
);

export const logInUser = createAsyncThunk<UserInfoInterface, LogInInterface>(
  "auth/login",
  async (
    userInfo: LogInInterface = { username: "", password: "" },
    thunkAPI
  ) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/auth/login`,
        data: userInfo,
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const logOutUser = createAsyncThunk(
  "auth/logout",
  async (data: any = {}, thunkAPI) => {
    try {
      await axios({
        method: "get",
        url: `${API_URL}/auth/logOut`,
        data,
        withCredentials: true,
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
