import { useState, useCallback } from "react";
import BudgetForm from "./BudgetForm";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../features/slices/loadSlice";
import {
  newBudgetInterface,
  submitBudget,
  BudgetFormErrors,
  BudgetInterface,
  BudgetFlashErrors,
} from "../interfaces/budgetInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import {
  handleBudgetInputErrors,
  handleBudgetSubmitErrors,
} from "../helpers/handleBudgetErrors";
import { setTotalAssets } from "../features/slices/authSlice";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";
import { error } from "../interfaces/miscTypes";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { loading } from "../interfaces/loadingInterfaces";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  addBudget: (newBudget: BudgetInterface) => void;
};

// returns form for creating a new budget
const NewBudgetWindow: React.FC<Props> = ({
  hideForm,
  addBudget,
}): JSX.Element | null => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (title: string, moneyAllocated: number): Id =>
    toast.success(
      `${title} budget created successfully! $${moneyAllocated.toFixed(
        2
      )} allocated to this budget.`
    );
  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );
  const initialState: newBudgetInterface = {
    title: "",
    moneyAllocated: 0,
  };
  const initialErrors: BudgetFormErrors = { title: "", moneyAllocated: "" };

  // sets state for new budget form data
  const [formData, setFormData] = useState<newBudgetInterface>(initialState);
  // sets state for available funds that changes if the new budget fund value changes
  const [availableFunds, setAvailableFunds] = useState<number>(
    user!.totalAssets * 100
  );
  // sets state for errors in the form inputs, updates if errors are detcted
  const [formErrors, setFormErrors] = useState<BudgetFormErrors>(initialErrors);
  // sets state for if errors should be flashed if user attempts to submit errorful data
  const [flashInput, setFlashInput] = useState<BudgetFlashErrors>({
    title: false,
    moneyAllocated: false,
  });

  // Pushes a number on the key pressed by the user to the right of the new budget funds value and creates
  // a new string. If the new budget value exceeds the user's current total asset value, the new budget funds
  // value will not update.
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.moneyAllocated, num);
      handleBudgetInputErrors("moneyAllocated", newNum, setFormErrors);
      if (newNum <= user!.totalAssets * 100) {
        setFormData((data) => ({ ...data, moneyAllocated: newNum }));
        setAvailableFunds(user!.totalAssets * 100 - newNum);
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
    [formData]
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
      setAvailableFunds(user!.totalAssets * 100 - newNum);
    },
    [formData]
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
            moneyAllocated: formData.moneyAllocated / 100,
          };
          let { newUserBudget, newAssets } = await BudgetAPI.addNewBudget(
            submitData
          );
          dispatch(setTotalAssets(newAssets));
          addBudget(newUserBudget);
          hideForm(e);
          notify(submitData.title, submitData.moneyAllocated);
        } else {
          if (formErrors.title || formData.title === "")
            setFlashInput((flash) => ({ ...flash, title: true }));
          if (formErrors.moneyAllocated || formData.moneyAllocated === 0)
            setFlashInput((flash) => ({ ...flash, moneyAllocated: true }));
          setTimeout(() => {
            setFlashInput({ title: false, moneyAllocated: false });
          }, 500);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, formErrors, flashInput]
  );

  return !formLoading ? (
    <BudgetForm
      formData={formData}
      formErrors={formErrors}
      flashErrors={flashInput}
      availableFunds={availableFunds}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handlePress={handlePress}
      handleDelete={handleDelete}
      hideForm={hideForm}
    />
  ) : null;
};

export default NewBudgetWindow;
