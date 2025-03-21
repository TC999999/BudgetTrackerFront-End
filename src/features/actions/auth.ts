import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import {
  LogInInterface,
  SignUpInterface,
} from "../../interfaces/authInterfaces";
import { UserInfoInterface } from "../../interfaces/userInterfaces";
import axios from "axios";

// sends new user data to backend and returns data to be used by redux state
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

// finds out if front end has a token or not (does not return token, returns a boolean on whether it
//  exists in cookies)
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

// authenticates user by sending username and password and returns all user data for redux state
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

// manually removes refresh_token cookie from front end and refreshes page without retrieving user information
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
