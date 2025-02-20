import { OneTimeCodeFormData } from "../interfaces/authInterfaces";

export const joinOTPCode = (formData: OneTimeCodeFormData): string => {
  let code = Object.values(formData).join("");
  return code;
};
