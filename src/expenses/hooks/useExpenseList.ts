import { useState, useCallback } from "react";
import { deleteExpenseInterface } from "../../interfaces/expenseInterfaces";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { BudgetUpdate } from "../../interfaces/budgetInterfaces";
import { error, infoInterface } from "../../interfaces/miscTypes";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import ExpenseAPI from "../../apis/ExpenseAPI";
import { toast, Id } from "react-toastify";

type input = {
  budgetID?: string;
  filterExpense?: (id: string) => void;
  updateBudget?: (updatedBudget: BudgetUpdate) => void;
};

// custom hook for expense list: inclues selecting an expense for deletion, deleting an expense, updating a budget
// an expense is deleted or added, and showing a prompt for when a user attempts to delete an expense
const useExpenseList = ({ budgetID, filterExpense, updateBudget }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const [selectedExpense, setSelectedExpense] = useState<infoInterface | null>(
    null
  );
  const notifyDelete = (expenseTitle: string): Id =>
    toast.success(`${expenseTitle} expense successfully deleted`);

  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  // since filterExpense is an optional prop function, this function calls on filterExpense
  // if it exists
  const callFilterExpense = (id: string) => {
    if (filterExpense) {
      filterExpense(id);
    }
  };

  // since updateBudget is an optional prop function, this function calls on updateBudget
  // if it exists
  const callUpdateBudget = (updatedBudget: BudgetUpdate) => {
    if (updateBudget) {
      updateBudget(updatedBudget);
    }
  };

  // updates state to show the prompt window for when a user clicks delete
  // expense button on an expense card
  const showSecondPrompt = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      expense: infoInterface
    ): void => {
      e.preventDefault();
      setSelectedExpense(expense);
    },
    [selectedExpense]
  );

  // updates state to hide the prompt window for when a user either clicks cancel on the prompt window or
  // after the user successfully submits a delete request
  const hidePrompt = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent) => {
      e.preventDefault();
      setSelectedExpense(null);
    },
    [selectedExpense]
  );

  // makes a request to delete a single expense from the db, and if the user is on the single
  // budget page, update the expense list state with that expense filtered out; additionally,
  // update the budget value to account for the money spent on that expense
  const deleteExpense = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        e.preventDefault();
        dispatch(setFormLoading(true));
        if (budgetID) {
          let submitData: deleteExpenseInterface = {
            _id: info._id,
            transaction: info.transaction!,
            budgetID,
          };
          let { delExpense, newUserBudget } = await ExpenseAPI.deleteExpense(
            submitData,
            user!._id
          );
          callFilterExpense(delExpense._id);
          callUpdateBudget(newUserBudget);
          setSelectedExpense(null);
          notifyDelete(delExpense.title);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [selectedExpense, user?._id]
  );

  return { selectedExpense, showSecondPrompt, hidePrompt, deleteExpense };
};

export default useExpenseList;
