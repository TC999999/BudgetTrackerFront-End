import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "get";

// sends data to backend for operations invloving retrieving user transactions; since we
// are not performing any major updates to the redux state, we are doing this instead of
// a thunk action
export default class TokenAPI {
  static async request(method: Method, data = {}): Promise<any> {
    const url = `${API_URL}/auth/token`;
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
  static async getRefreshToken(): Promise<any> {
    let res = await this.request("get");
    return res.token;
  }
}
