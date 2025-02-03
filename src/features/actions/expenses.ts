import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import axios from "axios";
import {
  newExpenseInterface,
  deleteExpenseInterface,
} from "../../interfaces/expenseInterfaces";

export const addNewExpense = createAsyncThunk<any, newExpenseInterface>(
  "expenses/add/new",
  async (data, thunkAPI) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/expenses/add/new`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

export const removeExpense = createAsyncThunk<any, deleteExpenseInterface>(
  "expenses/delete",
  async (data, thunkAPI) => {
    try {
      let res = await axios({
        method: "delete",
        url: `${API_URL}/expenses/delete`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
