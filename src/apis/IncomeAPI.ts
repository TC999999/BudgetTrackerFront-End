import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  SubmitIncomeSignUp,
  deleteIncomeType,
  SubmitUpdateIncome,
} from "../interfaces/incomeInterfaces";

type Method = "get" | "post" | "patch" | "delete";

// sends data to backend for operations invloving password reset; since we are not performing any major
// updates to the redux state, we are doing this instead of a thunk action
export default class IncomeAPI {
  static async request(
    endpoint: string,
    method: Method,
    data = {}
  ): Promise<any> {
    const url = `${API_URL}/incomes/${endpoint}`;
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

  //returns all incomes that a user has
  static async getAllUserIncomes(id: string): Promise<any> {
    let res = await this.request(`user/${id}`, "get");
    return res.userIncomes;
  }

  //creates a new income for a single user
  static async addNewUserIncome(
    newIncomeData: SubmitIncomeSignUp,
    id: string
  ): Promise<any> {
    let res = await this.request(`add/new/user/${id}`, "post", newIncomeData);
    return res.newUserIncome;
  }

  // updates and returns a single income that a user has
  static async updateUserIncome(
    data: SubmitUpdateIncome,
    user: string
  ): Promise<any> {
    let res = await this.request(
      `${data._id}/update/user/${user}`,
      "patch",
      data
    );
    return res.updatedIncome;
  }

  // deletes and returns a single income that a user has
  static async deleteUserIncome(
    data: deleteIncomeType,
    user: string
  ): Promise<any> {
    let res = await this.request(
      `${data.id}/delete/user/${user}`,
      "delete",
      data
    );
    return res.updatedIncome;
  }
}
