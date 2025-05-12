import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  BudgetInterface,
  DeleteBudgetInterface,
} from "../../interfaces/budgetInterfaces";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { error } from "../../interfaces/miscTypes";
import { setTotalAssets } from "../../features/slices/authSlice";
import { setFormLoading } from "../../features/slices/loadSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { getRemainingMoney } from "../../helpers/getRemainingMoney";
import { calculateNewTotalAssetsWithoutOperation } from "../../helpers/calculateNewTotalAssets";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../../apis/BudgetAPI";
import { dollarConverter } from "../../helpers/currencyConverter";

type input = BudgetInterface;

// custom hooks for form to delete a budget: includes notifications, handling of radio buttons,
// and handling of submitting data
const useDeleteBudget = (budget: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (title: string, addBackToAssets: number): Id =>
    toast.success(
      `${title} budget deleted successfully! ${dollarConverter(
        addBackToAssets
      )} added to available assets.`
    );
  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // constant used if user chooses to return the remaining funds of the budget only

  let remainingMoney = useRef<number>(
    getRemainingMoney(budget.moneyAllocated, budget.moneySpent)
  );

  // initial form data for deleting a budget, the first two remain constant while the last one changes
  // based on which radio button the user selects
  let deleteBudgetData: DeleteBudgetInterface = {
    user: user!._id,
    budgetID: budget._id,
    addBackToAssets: 0,
  };

  // sets state for data to be submitting to backend that will be used to update db
  const [formData, setFormData] =
    useState<DeleteBudgetInterface>(deleteBudgetData);

  // calculates what the user's new total asset value will be before submitting the form
  let newAssets: number = useMemo<number>(
    () =>
      calculateNewTotalAssetsWithoutOperation(
        user!.totalAssets,
        formData.addBackToAssets
      ),
    [formData.addBackToAssets]
  );

  // updates form data based on which radio button the user has selected
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((data) => ({ ...data, [name]: +value }));
    },
    [formData]
  );

  // sends data to backend to delete budget and all expenses made using its funds and navigate back to
  // the budget list page
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));
        let { totalAssets } = await BudgetAPI.deleteBudget(formData);
        dispatch(setTotalAssets(totalAssets));
        navigate(`/budgets/user/${user?._id}`);
        notify(budget.title, formData.addBackToAssets);
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, budget]
  );

  return {
    formData,
    newAssets,
    remainingMoney: remainingMoney.current,
    handleChange,
    handleSubmit,
  };
};

export default useDeleteBudget;
