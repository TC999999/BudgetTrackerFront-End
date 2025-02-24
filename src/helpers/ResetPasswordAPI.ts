import {
  ConfirmUserInfo,
  OneTimeCodeData,
  PasswordResetSubmit,
} from "../interfaces/authInterfaces";
import { API_URL } from "../features/config";
import axios from "axios";
import { AxiosResponse } from "axios";

type Method = "post" | "patch";

type Endpoint = "confirmUserInfo" | "confirmOTP" | "resetPassword";

export default class ResetPasswordAPI {
  static async request(
    endpoint: Endpoint,
    data: ConfirmUserInfo | OneTimeCodeData,
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
      throw new Error(err.response.data.error.message);
    }
  }

  static async confirmUserInfo(userInfo: ConfirmUserInfo): Promise<any> {
    let res = await this.request("confirmUserInfo", userInfo, "post");
    return res;
  }

  static async confirmOTP(otcData: OneTimeCodeData): Promise<any> {
    let res = await this.request("confirmOTP", otcData, "post");
    return res;
  }

  static async resetPassword(resetData: PasswordResetSubmit): Promise<any> {
    let res = await this.request("resetPassword", resetData, "patch");
    return res;
  }
}
