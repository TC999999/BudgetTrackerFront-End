export type Transaction = {
  _id: string;
  date: string;
  fromIncome: boolean;
  operation: "add" | "subtract";
  title: string;
  transaction: number;
};

export type NewTransaction = {
  title: string;
  value: number;
  operation: "add" | "subtract";
  date: string;
};

export type NewTransactionUI = {
  _id: string;
  title: string;
  value: number;
  date: string;
};

export type NewTransactionErrors = {
  title: string;
  value: string;
  date: string;
};

export type NewTransactionFlashErrors = {
  title: boolean;
  value: boolean;
  date: boolean;
};
