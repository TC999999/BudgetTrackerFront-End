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

export interface SignUpInterface extends LogInInterface {
  totalAssets: number;
}

export type SignUpErrorInterface = {
  username?: string;
  password?: string;
  totalAssets?: number;
};

export type SignUpErrors = {
  username: string;
  password: string;
  totalAssets: string;
  [key: string]: string;
};
