import {
  NewTransactionErrors,
  NewTransaction,
} from "../../interfaces/transactionInterfaces";
import {
  returnTitleErrors,
  returnValueErrors,
  returnDateErrors,
} from "./commonHandlers";

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
  setter: React.Dispatch<React.SetStateAction<NewTransactionErrors>>,
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
  setter: React.Dispatch<React.SetStateAction<NewTransactionErrors>>
) => {
  switch (name) {
    case "title":
      if (typeof value === "string")
        setter((data) => ({
          ...data,
          title: returnTitleErrors(value, "Transaction"),
        }));
      break;
    case "value":
      if (typeof value === "number")
        setter((data) => ({
          ...data,
          value: returnValueErrors(value, "Transaction"),
        }));
      break;
    case "date":
      if (typeof value === "string")
        setter((data) => ({
          ...data,
          date: returnDateErrors(value, "Transaction"),
        }));
      break;
    default:
      break;
  }
};

// updates user update form errors state when the form is submitted; returns true if all inputs are error
// free
export const handleEditUserSubmitErrors = (
  newAssetInfo: NewTransaction,
  setter: React.Dispatch<React.SetStateAction<NewTransactionErrors>>
): boolean => {
  handleUserEditInputErrors("value", newAssetInfo.value, setter);
  handleUserEditInputErrors("title", newAssetInfo.title, setter);
  handleUserEditInputErrors("date", newAssetInfo.date, setter);
  return (
    returnTitleErrors(newAssetInfo.title, "Transaction") === "" &&
    returnValueErrors(newAssetInfo.value, "Transaction") === "" &&
    returnDateErrors(newAssetInfo.date, "Transaction") === ""
  );
};
