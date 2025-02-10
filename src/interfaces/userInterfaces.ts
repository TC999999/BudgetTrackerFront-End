import { ExpenseInterface } from "./expenseInterfaces";
import { BudgetInterface } from "./budgetInterfaces";
import { SignUpErrorInterface } from "./authInterfaces";

export interface UserContextInterface {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  error: SignUpErrorInterface | string | null;
}

export interface UserEditInterface {
  value: number;
}

export interface UserInterface {
  _id: string;
  username: string;
  totalAssets: number;
}

export interface UserInfoInterface extends UserInterface {
  expenses: ExpenseInterface[];
  budgets: BudgetInterface[];
}
