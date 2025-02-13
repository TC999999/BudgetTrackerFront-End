import {
  UserEditErrors,
  UserEditInterface,
} from "../interfaces/userInterfaces";

const handleUserAssetsErrors = (newAssets: number): string => {
  return newAssets <= 0 ? "New assets must be greater than $0.00" : "";
};

const handleSubtractErrors = (
  newAssets: number,
  totalAssets: number
): string => {
  return newAssets > totalAssets
    ? "Cannot subtract a value greater than current total assets"
    : "";
};

const handleAddErrors = (newAssets: number, maxVal: number): string => {
  return newAssets > maxVal ? "You've reached the maximum asset value." : "";
};

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

export const handleUserEditInputErrors = (
  name: string,
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

export const handleEditUserSubmitErrors = (
  newAssetInfo: UserEditInterface,
  setter: React.Dispatch<React.SetStateAction<UserEditErrors>>
): boolean => {
  handleUserEditInputErrors("value", newAssetInfo.value, setter);
  return handleUserAssetsErrors(newAssetInfo.value) === "";
};
