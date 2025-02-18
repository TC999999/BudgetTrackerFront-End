import { ExpenseInterface } from "./expenseInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  error: string[][] | string | null;
};

export type UserEditInterface = {
  value: number;
};

export interface UserInterface {
  _id: string;
  username: string;
  totalAssets: number;
}

export interface UserInfoInterface extends UserInterface {
  recentExpenses: ExpenseInterface[];
}

export type UserEditErrors = {
  value: string;
};
