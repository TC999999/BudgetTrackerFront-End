import { ExpenseInterface } from "./expenseInterfaces";
import { BudgetInterface } from "./budgetInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  recentExpenses: ExpenseInterface[];
  loading: boolean;
  error: string[][] | string | null;
};

export type UserEditInterface = {
  value: number;
};

export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  totalAssets: number;
}

export interface UserInfoInterface extends UserInterface {
  budgets: BudgetInterface[];
}

export type UserEditErrors = {
  value: string;
};
