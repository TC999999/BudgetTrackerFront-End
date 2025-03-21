import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  SubmitIncomeSignUp,
  SubmitUpdateIncome,
  deleteIncomeType,
} from "../../interfaces/incomeInterfaces";
import { API_URL } from "../config";
import axios from "axios";

// sends new income data to the db to be added to incomes collection and scheduler and returns a
// new list of the user's incomes that contain the new income.
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

// sends new income data to the db to update an income on the incomes collection and scheduler and
// returns a new list of the user's incomes that contain the updated income.
export const updateIncome = createAsyncThunk<any, SubmitUpdateIncome>(
  "incomes/update",
  async (data: SubmitUpdateIncome, thunkAPI) => {
    try {
      let res = await axios({
        method: "patch",
        url: `${API_URL}/incomes/update/${data._id}`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

// sends income data to be deleted from the db and scheduler and returns a new list of the user's incomes that
// do not contain the deleted income.
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
