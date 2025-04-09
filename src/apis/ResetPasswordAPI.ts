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

  // sends username and email to backend; returns the same username and email if they exist
  // in the db, returns an error if not found
  static async confirmUserInfo(userInfo: ConfirmUserInfo): Promise<any> {
    let res = await this.request("confirmUserInfo", userInfo, "post");
    return res;
  }

  // after user inputs verification code, sends code to backend to confirm that a document
  // with the username, email, and code exists; returns success message if document exists
  // and code matches, returns error if not
  static async confirmOTP(otcData: OneTimeCodeData): Promise<any> {
    let res = await this.request("confirmOTP", otcData, "post");
    return res;
  }

  // when user submits a new password, sends data to back end to update password data on
  // db; returns success message if verification code has already been confirmed, returns
  // error it not
  static async resetPassword(resetData: PasswordResetSubmit): Promise<any> {
    let res = await this.request("resetPassword", resetData, "patch");
    return res;
  }
}
