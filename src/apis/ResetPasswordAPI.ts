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

// sends data to backend for operations invloving password reset; since we are not performing any major
// updates to the redux state, we are doing this instead of a thunk action
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

  // sends user username and email to backend to confirm a user with both exist
  static async confirmUserInfo(userInfo: ConfirmUserInfo): Promise<any> {
    let res = await this.request("confirmUserInfo", userInfo, "post");
    return res;
  }

  // sends one time code to backend to confirm that code matches
  static async confirmOTP(otcData: OneTimeCodeData): Promise<any> {
    let res = await this.request("confirmOTP", otcData, "post");
    return res;
  }

  // sends new password data to backend to update user password
  static async resetPassword(resetData: PasswordResetSubmit): Promise<any> {
    let res = await this.request("resetPassword", resetData, "patch");
    return res;
  }
}
