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

  // retrieves and returns all of the incomes of a single user
  static async getAllUserIncomes(id: string): Promise<any> {
    let res = await this.request(`user/${id}`, "get");
    return res.userIncomes;
  }

  // sends new income data for a single user; returns that data to be saved in state
  static async addNewUserIncome(
    newIncomeData: SubmitIncomeSignUp,
    id: string
  ): Promise<any> {
    let res = await this.request(`add/new/user/${id}`, "post", newIncomeData);
    return res.newUserIncome;
  }

  // sends data to update a single income for a user and returns the updated income data to
  // update the state
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

  // sends data to delete a single income for a user returns the deleted income data
  //to filtered from the state
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
