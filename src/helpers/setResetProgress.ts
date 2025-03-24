import { CurrentStep } from "../interfaces/authInterfaces";

// used for password reset pagesets value of progress bar out of a max value of 100 based on value of
// current step
export const setResetProgress = (step: CurrentStep): number => {
  switch (step) {
    case "userInfo":
      return 25;
    case "oneTimeCode":
      return 50;
    case "newPassword":
      return 75;
    case "success":
      return 100;
  }
};
