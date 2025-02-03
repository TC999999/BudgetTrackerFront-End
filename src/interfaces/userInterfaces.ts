import { ExpenseInterface } from "./expenseInterfaces";
import { BudgetInterface } from "./budgetInterfaces";

export interface UserContextInterface {
  user: UserInfoInterface;
  userExists: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserEditInterface {
  value: number;
}

export interface UserInterface {
  _id: string | null;
  username: string | null;
  totalAssets: number | null;
}

export interface UserInfoInterface extends UserInterface {
  expenses: ExpenseInterface[];
  budgets: BudgetInterface[];
}
