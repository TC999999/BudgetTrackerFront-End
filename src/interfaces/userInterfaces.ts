import { Transaction } from "./transactionInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  error: string | null;
};

export interface UserInfoInterface {
  _id: string;
  username: string;
  totalAssets: number;
}

export type NewTransactionInterface = {
  user: {
    _id: string;
    totalAssets: number;
  };
  transaction: Transaction;
};

export type EditUser = {
  username: string;
  email: string;
  password: string;
};

export type SubmitEditUser = {
  _id: string;
  username: string;
  email: string;
  password: string;
};

export type EditUserErrors = {
  username: string;
  email: string;
  password: string;
};

export type EditUserFlashErrors = {
  username: boolean;
  email: boolean;
  password: boolean;
};
