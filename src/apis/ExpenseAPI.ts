import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  submitNewExpense,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";

type Method = "post" | "get" | "delete";

// sends data to backend for operations invloving retrieving user transactions; since we
// are not performing any major updates to the redux state, we are doing this instead of
// a thunk action
export default class ExpenseAPI {
  static async request(
    endpoint: string,
    method: Method,
    data = {}
  ): Promise<any> {
    const url = `${API_URL}/expenses/${endpoint}`;
    try {
      let res: AxiosResponse = await axios({
        method: method,
        url,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response.data.error.message);
    }
  }

  // sends data for a new expense for a single budget and single user, returns the
  // new expense data as well as the new value of the the money spent from the budget's
  // allocated funds
  static async addNewExpense(
    expenseData: submitNewExpense,
    user: string
  ): Promise<any> {
    let res = await this.request(
      `add/budget/${expenseData.budgetID}/user/${user}`,
      "post",
      expenseData
    );
    return res;
  }

  // retrieves and returns all of the expenses that belong to a single budget if that budget
  // belongs to a single user
  static async getAllBudgetExpenses(id: string, user: string): Promise<any> {
    let res = await this.request(`budget/${id}/user/${user}`, "get");
    return res.expenses;
  }

  // retrieves and returns a user's five most recent expenses spent on budgets
  static async getRecentUserExpenses(id: string): Promise<any> {
    let res = await this.request(`user/${id}/recent`, "get");
    return res.expenses;
  }

  // sends data for a single expense that belongs to a single budget and user to be deleted;
  // returns the deleted expense data to be filtered from state as well as the new value of
  // the money spent on that budget
  static async deleteExpense(
    expenseData: deleteExpenseInterface,
    user: string
  ): Promise<any> {
    let res = await this.request(
      `delete/${expenseData._id}/budget/${expenseData.budgetID}/user/${user}`,
      "delete",
      expenseData
    );
    return res;
  }
}
