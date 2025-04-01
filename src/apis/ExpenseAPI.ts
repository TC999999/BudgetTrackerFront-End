import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "get";

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

  // gets all expenses in a budget
  static async getAllBudgetExpenses(id: string): Promise<any> {
    let res = await this.request(`budget/${id}`, "get");
    return res.expenses;
  }

  // gets all expenses in a budget
  static async getRecentUserExpenses(id: string): Promise<any> {
    let res = await this.request(`user/${id}/recent`, "get");
    return res.expenses;
  }
}
