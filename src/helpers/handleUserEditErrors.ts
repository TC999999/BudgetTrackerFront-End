import {
  UserEditErrors,
  UserEditInterface,
} from "../interfaces/userInterfaces";

// returns custom strings for input errors in transaction form title
const handleTransactionTitleErrors = (title: string): string => {
  if (title.length === 0) {
    return "Transaction title cannot be empty";
  } else if (!/^[\w ]+$/i.test(title)) {
    return "Transaction title input contains invalid characters";
  } else if (/^\s+|\s+$/g.test(title)) {
    return "Transaction title input cannot have spaces at beginning or end.";
  } else if (0 < title.length && title.length < 3) {
    return "Transaction title too short";
  } else if (20 < title.length) {
    return "Transaction title too long";
  } else {
    return "";
  }
};

// returns custom string error if transaction value is 0 or less
const handleUserAssetsErrors = (newAssets: number): string => {
  return newAssets <= 0 ? "Transaction value must be greater than $0.00" : "";
};

// returns custom strings for input errors in transaction form date
const handleTransactionDateErrors = (date: string): string => {
  return date.length <= 0 ? "Transaction Date is Required" : "";
};

// returns custom string error if operation is subtract when new asset value exceeds original asset value
const handleSubtractErrors = (
  newAssets: number,
  totalAssets: number
): string => {
  return newAssets > totalAssets
    ? "Cannot subtract a value greater than current total assets"
    : "";
};

// returns custom string error if operation is add when new asset value exceeds maximum asset value
const handleAddErrors = (newAssets: number, maxVal: number): string => {
  return newAssets > maxVal ? "You've reached the maximum asset value." : "";
};

// updates user update form errors state when a radio button is selected
export const handleUserComparisons = (
  newAssets: number,
  setter: React.Dispatch<React.SetStateAction<UserEditErrors>>,
  operation: string,
  maxVal: number,
  totalAssets: number
): boolean => {
  let errorExists: boolean = false;
  switch (operation) {
    case "subtract":
      let subtractMessage = handleSubtractErrors(newAssets, totalAssets);
      setter((data) => ({
        ...data,
        value: subtractMessage,
      }));
      errorExists = subtractMessage.length > 0;
      break;
    default:
      let addMessage = handleAddErrors(newAssets, maxVal);
      setter((data) => ({
        ...data,
        value: addMessage,
      }));
      errorExists = addMessage.length > 0;
      break;
  }
  return errorExists;
};

// updates user update form errors state when an input value changes
export const handleUserEditInputErrors = (
  name: "title" | "value" | "date",
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<UserEditErrors>>
) => {
  switch (name) {
    case "title":
      if (typeof value === "string")
        setter((data) => ({
          ...data,
          title: handleTransactionTitleErrors(value),
        }));
      break;
    case "value":
      if (typeof value === "number")
        setter((data) => ({ ...data, value: handleUserAssetsErrors(value) }));
      break;
    case "date":
      if (typeof value === "string")
        setter((data) => ({
          ...data,
          date: handleTransactionDateErrors(value),
        }));
      break;
    default:
      break;
  }
};

// updates user update form errors state when the form is submitted; returns true if all inputs are error
// free
export const handleEditUserSubmitErrors = (
  newAssetInfo: UserEditInterface,
  setter: React.Dispatch<React.SetStateAction<UserEditErrors>>
): boolean => {
  handleUserEditInputErrors("value", newAssetInfo.value, setter);
  handleUserEditInputErrors("title", newAssetInfo.title, setter);
  handleUserEditInputErrors("date", newAssetInfo.date, setter);
  return (
    handleTransactionTitleErrors(newAssetInfo.title) === "" &&
    handleUserAssetsErrors(newAssetInfo.value) === "" &&
    handleTransactionDateErrors(newAssetInfo.date) === ""
  );
};
