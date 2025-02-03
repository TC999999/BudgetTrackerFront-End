import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import axios from "axios";
import {
  newExpenseInterface,
  deleteExpenseInterface,
} from "../../interfaces/expenseInterfaces";

export const addNewExpense = createAsyncThunk<newExpenseInterface, any>(
  "expenses/add/new",
  async (data: newExpenseInterface, thunkAPI) => {
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

export const removeExpense = createAsyncThunk<deleteExpenseInterface, any>(
  "expenses/delete",
  async (data: deleteExpenseInterface, thunkAPI) => {
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
