import { ExpenseInterface } from "./expenseInterfaces";
import { BudgetInterface } from "./budgetInterfaces";
import { Income } from "./incomeInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  recentExpenses: ExpenseInterface[];
  loading: boolean;
  smallLoading: boolean;
  error: string[][] | string | null;
};

export type UserEditInterface = {
  value: number;
};

export interface UserInfoInterface {
  _id: string;
  username: string;
  email: string;
  totalAssets: number;
  budgets: BudgetInterface[];
  incomes: Income[];
}

export type UserEditErrors = {
  value: string;
};
