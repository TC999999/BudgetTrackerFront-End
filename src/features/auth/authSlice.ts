import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthInitialStateInterface,
  LogInInterface,
  SignUpInterface,
} from "../../interfaces/authInterfaces";
import {
  UserInfoInterface,
  UserEditInterface,
} from "../../interfaces/userInterfaces";
import { newBudgetInterface } from "../../interfaces/budgetInterfaces";
import axios from "axios";

const API_URL: string = "http://localhost:3001";

const INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: {
      _id: null,
      username: "",
      totalAssets: 0,
      expenses: [],
      budgets: [],
    },
    loading: true,
    userExists: false,
    error: "",
  },

  hasTokenInfo: { hasToken: true, loading: true },
};

interface ActionInterface {
  type: string;
  payload: any;
}

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
    return res.data.newUser;
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

      return res.data.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
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

export const addToAssets = createAsyncThunk<
  UserInfoInterface,
  UserEditInterface
>(
  "user/update/assets",
  async (
    updateInfo: UserEditInterface = { username: "", newAssets: 0 },
    thunkAPI
  ) => {
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

export const addNewBudget = createAsyncThunk<newBudgetInterface, any>(
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

export const checkBudget = createAsyncThunk(
  "budgets/check/match",
  async (data: any = {}, thunkAPI) => {
    try {
      let res = await axios({
        method: "get",
        url: `${API_URL}/budgets/check/match`,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setUserLoading: (state, action: ActionInterface) => {
      state.userInfo.loading = action.payload;
    },
    removeUserError: (state) => {
      state.userInfo.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload;
        state.userInfo.error = null;
        state.hasTokenInfo.hasToken = true;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(logInUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(logInUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload;
        state.userInfo.error = null;
        state.hasTokenInfo.hasToken = true;
      })
      .addCase(logInUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(findToken.pending, (state) => {
        state.hasTokenInfo.loading = true;
      })
      .addCase(findToken.fulfilled, (state, action: any) => {
        state.hasTokenInfo.loading = false;
        state.hasTokenInfo.hasToken = action.payload.token ? true : false;
      })
      .addCase(findToken.rejected, (state) => {
        state.hasTokenInfo.loading = false;
        state.hasTokenInfo.hasToken = false;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(logOutUser.pending, (state) => {
        state.hasTokenInfo.loading = true;
        state.userInfo.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.hasTokenInfo.loading = false;
        state.userInfo.loading = false;
        state.hasTokenInfo.hasToken = false;
        state.userInfo.userExists = false;
        state.userInfo.user = INITIAL_STATE.userInfo.user;
      })
      .addCase(logOutUser.rejected, (state, action: any) => {
        state.hasTokenInfo.loading = false;
        state.userInfo.loading = false;
        state.userInfo.error = action.payload;
      })
      // .addCase(addToAssets.pending, (state) => {
      //   state.userInfo.loading = true;
      // })
      // .addCase(addToAssets.fulfilled, (state, action: any) => {
      //   state.userInfo.loading = false;
      //   state.userInfo.user.totalAssets = action.payload.totalAssets;
      // })
      // .addCase(addToAssets.rejected, (state) => {
      //   state.userInfo.loading = false;
      // })
      .addCase(addToAssets.fulfilled, (state, action: any) => {
        state.userInfo.user.totalAssets = action.payload.totalAssets;
      })
      .addCase(addNewBudget.fulfilled, (state, action: any) => {
        state.userInfo.user.budgets = [
          ...state.userInfo.user.budgets,
          action.payload.budget,
        ];
      });
  },
});

export const { setUserLoading, removeUserError } = authSlice.actions;

export default authSlice.reducer;
