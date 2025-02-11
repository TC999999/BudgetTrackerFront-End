import { UserContextInterface } from "./userInterfaces";

export type AuthInitialStateInterface = {
  userInfo: UserContextInterface;
  hasTokenInfo: hasTokenInterface;
};

export type hasTokenInterface = {
  hasToken: boolean;
  loading: boolean;
};

export interface LogInInterface {
  username: string;
  password: string;
}

export type LogInErrors = {
  username: string;
  password: string;
  [key: string]: string;
};

export interface SignUpInterface extends LogInInterface {
  totalAssets: number;
}

export type SignUpErrors = {
  username: string;
  password: string;
  totalAssets: string;
  [key: string]: string;
};
