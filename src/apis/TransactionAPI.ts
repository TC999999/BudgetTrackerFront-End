import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "get";

// type Endpoint = "confirmUserInfo" | "confirmOTP" | "resetPassword";

// sends data to backend for operations invloving password reset; since we are not performing any major
// updates to the redux state, we are doing this instead of a thunk action
export default class TransactionAPI {
  static async request(
    endpoint: string,
    method: Method,
    data = {}
  ): Promise<any> {
    const url = `${API_URL}/transactions/${endpoint}`;
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

  // gets all transactions that a user has
  static async getUserTransactions(id: string): Promise<any> {
    let res = await this.request(`user/${id}`, "get");
    return res.transactions;
  }

  // gets the ten most recent transactions a user has
  static async getRecentUserTransactions(id: string): Promise<any> {
    let res = await this.request(`user/${id}/recent`, "get");
    return res.transactions;
  }
}
