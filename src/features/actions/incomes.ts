import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  SubmitIncomeSignUp,
  deleteIncomeType,
} from "../../interfaces/incomeInterfaces";
import { API_URL } from "../config";
import axios from "axios";

export const addNewIncome = createAsyncThunk<any, SubmitIncomeSignUp>(
  "incomes/add/new",
  async (data: SubmitIncomeSignUp, thunkAPI) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/incomes/add/new`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const removeIncome = createAsyncThunk<any, deleteIncomeType>(
  "incomes/delete",
  async (data: deleteIncomeType, thunkAPI) => {
    try {
      let res = await axios({
        method: "delete",
        url: `${API_URL}/incomes/delete/${data.id}`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
