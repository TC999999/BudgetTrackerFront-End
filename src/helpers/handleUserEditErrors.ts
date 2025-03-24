import {
  UserEditErrors,
  UserEditInterface,
} from "../interfaces/userInterfaces";

// returns custom string error if new funds value is 0 or less
const handleUserAssetsErrors = (newAssets: number): string => {
  return newAssets <= 0 ? "New assets must be greater than $0.00" : "";
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
  name: "value",
  value: number,
  setter: React.Dispatch<React.SetStateAction<UserEditErrors>>
) => {
  switch (name) {
    case "value":
      setter((data) => ({ ...data, value: handleUserAssetsErrors(value) }));
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
  return handleUserAssetsErrors(newAssetInfo.value) === "";
};
