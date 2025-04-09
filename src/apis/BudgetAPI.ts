import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  DeleteBudgetInterface,
  submitBudget,
  SubmitBudgetUpdateInterface,
} from "../interfaces/budgetInterfaces";

type Method = "post" | "get" | "patch" | "delete";

// sends data to backend for operations invloving rretrieving user transactions; since we are not performing
// any major updates to the redux state, we are doing this instead of a thunk action
export default class BudgetAPI {
  static async request(
    endpoint: string,
    method: Method,
    data = {}
  ): Promise<any> {
    const url = `${API_URL}/budgets/${endpoint}`;
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

  // adds a new budget to db and returns its information
  static async addNewBudget(budgetData: submitBudget): Promise<any> {
    let res = await this.request(
      `add/user/${budgetData.userID}`,
      "post",
      budgetData
    );
    return res;
  }

  // returns all the budgets for a single user
  static async getAllBudgets(id: string): Promise<any> {
    let res = await this.request(`all/user/${id}`, "get");
    return res.budgets;
  }

  // returns information for a single user budget
  static async getUserBudget(budgetID: string, id: string): Promise<any> {
    let res = await this.request(`${budgetID}/user/${id}`, "get");
    return res.budget;
  }

  // updates a budget and returns updated information
  static async updateBudget(
    budgetData: SubmitBudgetUpdateInterface
  ): Promise<any> {
    let res = await this.request(
      `update/${budgetData.budgetID}/user/${budgetData.userID}`,
      "patch",
      budgetData
    );
    return res;
  }

  // deletes a budget and returns information
  static async deleteBudget(budgetData: DeleteBudgetInterface): Promise<any> {
    let res = await this.request(
      `delete/${budgetData.budgetID}/user/${budgetData.user}`,
      "delete",
      budgetData
    );
    return res;
  }
}
