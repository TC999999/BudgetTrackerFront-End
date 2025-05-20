import { useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import {
  newBudgetInterface,
  submitBudget,
  BudgetFormErrors,
  BudgetInterface,
  BudgetFlashErrors,
} from "../../interfaces/budgetInterfaces";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import {
  handleBudgetInputErrors,
  handleBudgetSubmitErrors,
} from "../../helpers/errorHandlers/handleBudgetErrors";
import { setTotalAssets } from "../../features/slices/authSlice";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../../apis/BudgetAPI";
import { error } from "../../interfaces/miscTypes";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { dollarConverter } from "../../helpers/currencyConverter";

type input = {
  addBudget: (newBudget: BudgetInterface) => void;
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

// custom hook for adding a budget: includes changes to text input, button presses on the custom keypad component,
// and submitting the data
const useAddBudget = ({ addBudget, hideForm }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (title: string, moneyAllocated: number): Id =>
    toast.success(
      `${title} budget created successfully! ${dollarConverter(
        moneyAllocated
      )} allocated to this budget.`
    );
  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const initialState: newBudgetInterface = {
    title: "",
    moneyAllocated: 0,
  };

  const initialErrors: BudgetFormErrors = { title: "", moneyAllocated: "" };

  const initialFlashErrors: BudgetFlashErrors = {
    title: false,
    moneyAllocated: false,
  };

  // sets state for new budget form data
  const [formData, setFormData] = useState<newBudgetInterface>(initialState);
  // sets state for available funds that changes if the new budget fund value changes
  const [availableFunds, setAvailableFunds] = useState<number>(
    user!.totalAssets
  );
  // sets state for errors in the form inputs, updates if errors are detcted
  const [formErrors, setFormErrors] = useState<BudgetFormErrors>(initialErrors);
  // sets state for if errors should be flashed if user attempts to submit errorful data
  const [flashErrors, setFlashErrors] =
    useState<BudgetFlashErrors>(initialFlashErrors);

  // Pushes a number on the key pressed by the user to the right of the new budget funds value and creates
  // a new string. If the new budget value exceeds the user's current total asset value, the new budget funds
  // value will not update.
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.moneyAllocated, num);
      handleBudgetInputErrors("moneyAllocated", newNum, setFormErrors);
      if (newNum <= user!.totalAssets) {
        setFormData((data) => ({ ...data, moneyAllocated: newNum }));
        setAvailableFunds(user!.totalAssets - newNum);
      } else {
        setFormErrors((data) => ({
          ...data,
          moneyAllocated:
            "Budget funds cannot exceed remaining total asset value!",
        }));
        setTimeout(() => {
          setFormErrors((data) => ({
            ...data,
            moneyAllocated: "",
          }));
        }, 1500);
      }
    },
    [user?.totalAssets, formData, formErrors, availableFunds]
  );

  // Pops the rightmost number on the new budget funds value and creates
  // a new string without that number.
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum: number = numPop(formData.moneyAllocated);
      handleBudgetInputErrors("moneyAllocated", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        moneyAllocated: newNum,
      }));
      setAvailableFunds(user!.totalAssets - newNum);
    },
    [formData, formErrors, availableFunds]
  );

  // updates the values of the form data on user input. If the inputs contain any errors, updates form errors
  // state and lets user know that errors exist
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (name === "title" || name === "moneyAllocated") {
        handleBudgetInputErrors(name, value, setFormErrors);
        setFormData((data) => ({ ...data, [name]: value }));
      }
    },
    [formData, formErrors]
  );

  // sends new budget info to db and updates user state in redux with new budget. If inputs contain errors on
  // submission, does not send data and flashes errorful inputs for user.
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleBudgetSubmitErrors(formData, setFormErrors)) {
          dispatch(setFormLoading(true));
          let submitData: submitBudget = {
            userID: user!._id,
            ...formData,
          };
          let { newUserBudget, newAssets } = await BudgetAPI.addNewBudget(
            submitData
          );
          dispatch(setTotalAssets(newAssets));
          addBudget(newUserBudget);
          hideForm(e);
          notify(submitData.title, submitData.moneyAllocated);
          setFormData(initialState);
          setFormErrors(initialErrors);
          setAvailableFunds(user!.totalAssets);
        } else {
          if (formErrors.title || formData.title === "")
            setFlashErrors((flash) => ({ ...flash, title: true }));
          if (formErrors.moneyAllocated || formData.moneyAllocated === 0)
            setFlashErrors((flash) => ({ ...flash, moneyAllocated: true }));
          setTimeout(() => {
            setFlashErrors({ title: false, moneyAllocated: false });
          }, 500);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, formErrors, user?._id, availableFunds, flashErrors]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      hideForm(e);
      setFormData(initialState);
      setFormErrors(initialErrors);
      setAvailableFunds(user!.totalAssets);
    },
    [formData, formErrors, availableFunds]
  );

  return {
    formData,
    availableFunds,
    formErrors,
    flashErrors,
    handlePress,
    handleDelete,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};

export default useAddBudget;
