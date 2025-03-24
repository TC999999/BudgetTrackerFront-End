import { OneTimeCodeFormData } from "../interfaces/authInterfaces";

// since OneTimeCode.tsx form data is saved in state as an object with the key-value pair as an index-value
// pair, this is used to join the object values as a single 6 digit number
// for example:
// if the form data was equal to{
//   0: "1",
//   1: "2",
//   2: "3",
//   3: "4",
//   4: "5",
//   5: "6",
// };
// then the return value would be "123456"
export const joinOTPCode = (formData: OneTimeCodeFormData): string => {
  let code = Object.values(formData).join("");
  return code;
};
