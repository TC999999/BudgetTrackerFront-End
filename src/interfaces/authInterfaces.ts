import { UserContextInterface } from "./userInterfaces";

export interface AuthInitialStateInterface {
  userInfo: UserContextInterface;
  hasTokenInfo: hasTokenInterface;
}

export interface hasTokenInterface {
  hasToken: boolean;
  loading: boolean;
}

export interface LogInInterface {
  username: string;
  password: string;
}

export interface SignUpInterface extends LogInInterface {
  totalAssets: number;
}

export interface SignUpErrorInterface {
  username?: string;
  password?: string;
  totalAssets?: number;
}
