import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../config";
import axios from "axios";
import {
  newBudgetInterface,
  DeleteBudgetInterface,
  SubmitBudgetUpdateInterface,
} from "../../interfaces/budgetInterfaces";

// sends new budget data to db for budgets and user collections and retrieves new list of budgets
// for a single user that contains the new income
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

// sends budget data for updating the db for budgets and user collections and retrieves new list of budgets
// for a single user that contains the updated income
export const updateBudget = createAsyncThunk<any, SubmitBudgetUpdateInterface>(
  "budgets/update",
  async (data: SubmitBudgetUpdateInterface, thunkAPI) => {
    try {
      let res = await axios({
        method: "patch",
        url: `${API_URL}/budgets/update/${data.budgetID}`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

// sends budget data for deleting from the db for budgets and user collections as well as all expenses
// made with that budget and retrieves new list of budgets or a single userthat does not contain the
// deleted income
export const deleteBudget = createAsyncThunk<any, DeleteBudgetInterface>(
  "budgets/delete",
  async (data: any = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "delete",
        url: `${API_URL}/budgets/delete/${data.budgetID}`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);
