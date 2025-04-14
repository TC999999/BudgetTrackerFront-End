export type UserContextInterface = {
  user: UserInfoInterface | null;
  userExists: boolean;
  loading: boolean;
  smallLoading: boolean;
  error: string | null;
};

export type error = {
  message: string;
  status: number | null;
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

export type UserEditErrors = {
  title: string;
  value: string;
  date: string;
};
