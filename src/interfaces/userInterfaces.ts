import { BudgetInterface } from "./budgetInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  smallLoading: boolean;
  error: string[][] | string | null;
};

export type UserEditInterface = {
  title: string;
  value: number;
  date: string;
};

export interface UserInfoInterface {
  _id: string;
  username: string;
  email: string;
  totalAssets: number;
  budgets: BudgetInterface[];
}

export type UserEditErrors = {
  title: string;
  value: string;
  date: string;
};
