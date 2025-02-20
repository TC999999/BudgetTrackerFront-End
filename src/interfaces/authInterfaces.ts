import { UserContextInterface } from "./userInterfaces";

export type AuthInitialStateInterface = {
  userInfo: UserContextInterface;
  hasTokenInfo: hasTokenInterface;
};

export type hasTokenInterface = {
  hasToken: boolean;
  loading: boolean;
};

export type LogInInterface = {
  username: string;
  password: string;
};

export interface SignUpInterface extends LogInInterface {
  totalAssets: number;
  email: string;
}

export type LogInErrors = {
  username: string;
  password: string;
  [key: string]: string;
};

export interface SignUpErrors extends LogInErrors {
  email: string;
}

export type LogInFlashErrors = {
  username: boolean;
  password: boolean;
};

export interface SignUpFlashErrors extends LogInFlashErrors {
  email: boolean;
}
