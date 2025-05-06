import { UserContextInterface } from "./userInterfaces";
import { SubmitIncomeSignUp } from "./incomeInterfaces";

export type AuthInitialStateInterface = {
  userInfo: UserContextInterface;
};

export type LogInInterface = {
  username: string;
  password: string;
  trusted: boolean;
};

export type SignUpSensitive = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

export type SignUpSensitiveSubmit = {
  username: string;
  password: string;
  email: string;
};

export type SignUpInterface = {
  username: string;
  password: string;
  totalAssets: number;
  email: string;
  incomes: SubmitIncomeSignUp[];
  trusted: boolean;
};

export type LogInErrors = {
  username: string;
  password: string;
};

export interface SignUpErrors extends LogInErrors {
  email: string;
  confirmPassword: string;
}

export type LogInFlashErrors = {
  username: boolean;
  password: boolean;
};

export interface SignUpFlashErrors extends LogInFlashErrors {
  email: boolean;
  confirmPassword: boolean;
}

export type SubmitUserInfoEdit = {
  _id: string;
  username: string;
  email: string;
};

export type CurrentStep =
  | "userInfo"
  | "oneTimeCode"
  | "newPassword"
  | "success";

export type StepCompleted = {
  userInfo: boolean;
  oneTimeCode: boolean;
  newPassword: boolean;
  success: boolean;
};

export type ConfirmUserInfo = {
  username: string;
  email: string;
};

export type UserInfoErrors = {
  username: string;
  email: string;
};

export type UserInfoFlashErrors = {
  username: boolean;
  email: boolean;
};

export type OneTimeCodeData = {
  username: string;
  email: string;
  code: string;
};

export type digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type OneTimeCodeFormData = {
  0: digits;
  1: digits;
  2: digits;
  3: digits;
  4: digits;
  5: digits;
};

export type OneTimeCodeSelect = {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
};

export type PasswordResetInfo = {
  newPassword: string;
  confirmNewPassword: string;
};

export type PasswordResetErrors = {
  newPassword: string;
  confirmNewPassword: string;
};

export type PasswordResetFlashErrors = {
  newPassword: boolean;
  confirmNewPassword: boolean;
};

export type PasswordResetSubmit = {
  username: string;
  email: string;
  newPassword: string;
};

export type PasswordResetInput = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (newSubmitError: string, e: React.FormEvent) => void;
  currentUser: ConfirmUserInfo;
};
