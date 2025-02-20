import { PasswordResetInfo } from "../interfaces/authInterfaces";
import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "get" | "post" | "patch";

type Endpoint = "confirmUserInfo" | "confirmOTP" | "resetPassword";

export default class ResetPasswordAPI {
  static async request(
    endpoint: Endpoint,
    data: PasswordResetInfo,
    method: Method
  ): Promise<any> {
    const url = `${API_URL}/auth/${endpoint}`;
    try {
      let res: AxiosResponse = await axios({
        method: method,
        url,
        data,
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return err;
    }
  }

  static async confirmUserInfo(userInfo: PasswordResetInfo): Promise<any> {
    let res = await this.request("confirmUserInfo", userInfo, "post");
    return res;
  }
}
