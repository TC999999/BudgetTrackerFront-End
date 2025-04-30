import { useState, useCallback } from "react";
import { Income, deleteIncomeType } from "../../interfaces/incomeInterfaces";
import { infoInterface } from "../../interfaces/miscTypes";
import { error } from "../../interfaces/miscTypes";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import IncomeAPI from "../../apis/IncomeAPI";
import { toast, Id } from "react-toastify";
import { UserContextInterface } from "../../interfaces/userInterfaces";

type input = {
  removeFromIncomeState: (id: string) => void;
};

const useIncomeList = ({ removeFromIncomeState }: input) => {
  const dispatch: AppDispatch = useAppDispatch();

  const notify = (message: string): Id =>
    toast.success(`Income ${message} deleted successfully`);

  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // to use for editing a single income, retrieve info to be used for income edit
  const [selectedIncomeForEdit, setSelectedIncomeForEdit] =
    useState<Income | null>(null);

  // to use for deleting a single income, retrieve info to be used for income deletion
  const [selectedIncomeForDelete, setSelectedIncomeForDelete] =
    useState<infoInterface | null>(null);

  // changes state for selected income for edit
  const selectIncome = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      income: Income | null
    ): void => {
      e.preventDefault();
      setSelectedIncomeForEdit(income);
    },
    [selectedIncomeForEdit]
  );

  // updates state to show the prompt window for when a user clicks delete
  // income button on an income card
  const showSecondPrompt = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      income: infoInterface
    ): void => {
      e.preventDefault();
      setSelectedIncomeForDelete(income);
    },
    [selectedIncomeForDelete]
  );

  // updates state to hide the prompt window for when a user either clicks cancel on the prompt window or
  // after the user successfully submits a delete request
  const hidePrompt = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setSelectedIncomeForDelete(null);
    },
    [selectedIncomeForDelete]
  );

  // sends a request to backend to delete a single income from the db and filter it out of
  // income page list state
  const deleteIncome = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        dispatch(setFormLoading(true));
        e.preventDefault();
        let submitData: deleteIncomeType = { id: info._id };
        if (user?._id) {
          let delIncome = await IncomeAPI.deleteUserIncome(
            submitData,
            user._id
          );
          removeFromIncomeState(info._id);
          setSelectedIncomeForDelete(null);
          notify(delIncome.title);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [selectedIncomeForDelete, user?._id]
  );

  return {
    selectedIncomeForEdit,
    selectedIncomeForDelete,
    selectIncome,
    showSecondPrompt,
    hidePrompt,
    deleteIncome,
  };
};

export default useIncomeList;
