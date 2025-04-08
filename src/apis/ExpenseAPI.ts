import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  submitNewExpense,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";

type Method = "post" | "get" | "delete";

// sends data to backend for operations invloving rretrieving user transactions; since we are not performing
// any major updates to the redux state, we are doing this instead of a thunk action
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

  // adds a new expense to a budget
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

  // gets all expenses in a budget
  static async getAllBudgetExpenses(id: string, user: string): Promise<any> {
    let res = await this.request(`budget/${id}/user/${user}`, "get");
    return res.expenses;
  }

  // gets a user's most recent expenses in a budget
  static async getRecentUserExpenses(id: string): Promise<any> {
    let res = await this.request(`user/${id}/recent`, "get");
    return res.expenses;
  }

  // deletes an expense from a budget
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
