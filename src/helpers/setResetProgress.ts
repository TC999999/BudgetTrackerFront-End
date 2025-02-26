import { CurrentStep } from "../interfaces/authInterfaces";

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
