import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import axios from "axios";
import { newBudgetInterface } from "../../interfaces/budgetInterfaces";

export const addNewBudget = createAsyncThunk<any, newBudgetInterface>(
  "budgets/add/new",
  async (data: newBudgetInterface, thunkAPI) => {
    try {
      let res = await axios({
        method: "post",
        url: `${API_URL}/budgets/add/new`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
