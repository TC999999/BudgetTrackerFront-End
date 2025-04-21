export type infoInterface = {
  _id: string;
  transaction?: number;
};

export type error = {
  message: string;
  status: number | null;
};

export type loading = {
  pageLoading: boolean;
  formLoading: boolean;
};
