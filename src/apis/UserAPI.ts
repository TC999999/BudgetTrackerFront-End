import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "get";

// sends data to backend for operations invloving retrieving user info that does not involve
// updating redux state;
export default class UserAPI {
  static async request(
    endpoint: string,
    method: Method,
    data = {}
  ): Promise<any> {
    const url = `${API_URL}/users/${endpoint}`;
    try {
      let res: AxiosResponse = await axios({
        method: method,
        url,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(JSON.stringify(err.response.data.error));
    }
  }

  // retrieves a single user's information
  static async getUser(id: string): Promise<any> {
    let res = await this.request(id, "get");
    return res.user;
  }
}
