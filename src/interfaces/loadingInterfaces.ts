import { error } from "./miscTypes";

export type loading = {
  pageLoading: boolean;
  formLoading: boolean;
};

export type LoadingContext = {
  loadError: error;
  loadingInfo: loading;
};
