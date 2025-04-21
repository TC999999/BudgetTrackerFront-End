import { Transaction } from "./transactionInterfaces";

export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  error: string | null;
};

export type UserEditInterface = {
  title: string;
  value: number;
  date: string;
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

export type UserEditErrors = {
  title: string;
  value: string;
  date: string;
};
