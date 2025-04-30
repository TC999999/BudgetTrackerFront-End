import { useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "../../helpers/handleExpenseErrors";
import {
  newExpenseInterface,
  ExpenseFormErrors,
  submitNewExpense,
  ExpenseInterface,
  ExpenseFlashErrors,
} from "../../interfaces/expenseInterfaces";
import {
  BudgetInterface,
  BudgetUpdate,
} from "../../interfaces/budgetInterfaces";
import { error } from "../../interfaces/miscTypes";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { toast, Id } from "react-toastify";
import ExpenseAPI from "../../apis/ExpenseAPI";

type input = {
  initialState: newExpenseInterface;
  initialMoney: string;
  initialErrors: ExpenseFormErrors;
  initialFlashErrors: ExpenseFlashErrors;
  budget: BudgetInterface;
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm"
  ) => void;
  addExpense: (newExpense: ExpenseInterface) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
};

// custom hook for new expense forms
const useExpenseForm = ({
  initialState,
  initialMoney,
  initialErrors,
  initialFlashErrors,
  budget,
  hideExpenseForm,
  addExpense,
  updateBudget,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (title: string, transaction: number): Id =>
    toast.success(
      `${title} expense created successfully! $${transaction.toFixed(
        2
      )} spent. $${availableMoney} remaining in ${budget.title}.`
    );
  const notifyError = (error: error) =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // sets ref for the original amount of remaining money that the budget for this expense has
  const originalMoney = useRef<string>(initialMoney);
  // form data state for new expense
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  // sets state for the changing amount of remaining money that the budget for this expense has if expense
  // was to be applied
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);
  // sets error strings for expense form to be shown to user
  const [formErrors, setFormErrors] =
    useState<ExpenseFormErrors>(initialErrors);

  // booleans for form errors to be flashed on submission
  const [flashErrors, setFlashErrors] =
    useState<ExpenseFlashErrors>(initialFlashErrors);

  // pushes number on the key clicked by user to the right side of the new expense's transaction value and
  // returns a new string
  const handlePress = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    let num = +e.currentTarget.value;
    let newNum = currencyConverter(formData.transaction, num);
    handleExpenseInputErrors("transaction", newNum, setFormErrors);
    let original = parseFloat(originalMoney.current) * 100;
    if (newNum <= original) {
      let newAvailableMoney = original - newNum;
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      setAvailableMoney((newAvailableMoney / 100).toFixed(2));
    } else {
      setFormErrors((data) => ({
        ...data,
        transaction: "Expense transaction value cannot exceed available budget",
      }));
      setTimeout(() => {
        setFormErrors((data) => ({
          ...data,
          transaction: "",
        }));
      }, 1500);
    }
  };

  // pops number from the right side of the new expense's transaction value and
  // returns a new string
  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    let newNum: number = numPop(formData.transaction);
    handleExpenseInputErrors("transaction", newNum, setFormErrors);
    setFormData((data) => ({
      ...data,
      transaction: newNum,
    }));
    let newAvailableMoney = parseFloat(originalMoney.current) * 100 - newNum;
    setAvailableMoney((newAvailableMoney / 100).toFixed(2));
  };

  // updates form data values based on user input, if input contains errors (e.g. expense title too long),
  // updates form error state and lets user know
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    handleExpenseInputErrors(name, value, setFormErrors);
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // sends new expense data to backend to be added to db and updates user state. If any inputs
  // contain errors, does not send data and flashes errorful inputs
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleExpenseSubmitErrors(formData, setFormErrors)) {
        dispatch(setFormLoading(true));
        let submitData: submitNewExpense = {
          ...formData,
          budgetID: budget?._id,
          transaction: formData.transaction / 100,
        };
        const { spentMoney, newExpense } = await ExpenseAPI.addNewExpense(
          submitData,
          user!._id
        );
        addExpense(newExpense);
        updateBudget(spentMoney);
        hideExpenseForm(e, "showExpenseForm");
        notify(submitData.title, submitData.transaction);
      } else {
        if (formErrors.title || formData.title === "")
          setFlashErrors((flash) => ({ ...flash, title: true }));
        if (formErrors.date || formData.date === "")
          setFlashErrors((flash) => ({ ...flash, date: true }));
        if (formErrors.transaction || formData.transaction === 0)
          setFlashErrors((flash) => ({ ...flash, transaction: true }));
        setTimeout(() => {
          setFlashErrors({ title: false, date: false, transaction: false });
        }, 500);
      }
    } catch (err: any) {
      notifyError(JSON.parse(err.message));
    } finally {
      dispatch(setFormLoading(false));
    }
  };

  return {
    formData,
    availableMoney,
    formErrors,
    flashErrors,
    handlePress,
    handleDelete,
    handleChange,
    handleSubmit,
  };
};

export default useExpenseForm;
