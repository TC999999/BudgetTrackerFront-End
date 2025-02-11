import { ExpenseInterface } from "./expenseInterfaces";
import { BudgetInterface } from "./budgetInterfaces";

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
  expenses: ExpenseInterface[];
  budgets: BudgetInterface[];
}
