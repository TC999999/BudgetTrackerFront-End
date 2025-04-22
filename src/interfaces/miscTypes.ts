export type infoInterface = {
  _id: string;
  transaction?: number;
};

export type error = {
  message: string;
  status: number | null;
};

export type ActionInterface = {
  type: string;
  payload: any;
};
