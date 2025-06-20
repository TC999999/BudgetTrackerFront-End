import { useState, useRef, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import {
  currencyConverter,
  dollarConverter,
  numPop,
} from "../../helpers/currencyConverter";
import { getRemainingMoney } from "../../helpers/getRemainingMoney";
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "../../helpers/errorHandlers/handleExpenseErrors";
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
import { DateTime } from "luxon";

type input = {
  budget: BudgetInterface;
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm"
  ) => void;
  addExpense: (newExpense: ExpenseInterface) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
  show: boolean;
  mock?: any;
};

// custom hook for form for adding a new expense: includes handling of the custom keypad component, changes
// in title text input, and submission of form data
const useExpenseForm = ({
  budget,
  hideExpenseForm,
  addExpense,
  updateBudget,
  show,
  mock,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (title: string, transaction: number): Id =>
    toast.success(
      `${title} expense created successfully! ${dollarConverter(
        transaction
      )} spent. ${dollarConverter(availableMoney)} remaining in ${
        budget.title
      }.`
    );
  const notifyError = (error: error) =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const initialState: newExpenseInterface = {
    title: "",
    transaction: 0,
    date: "",
  };

  const initialMoney: number = getRemainingMoney(
    budget.moneyAllocated,
    budget.moneySpent
  );

  const initialErrors: ExpenseFormErrors = {
    title: "",
    transaction: "",
    date: "",
  };

  const initialFlashErrors: ExpenseFlashErrors = {
    title: false,
    transaction: false,
    date: false,
  };

  // sets ref for the original amount of remaining money that the budget for this expense has
  const originalMoney = useRef<number>(initialMoney);
  // form data state for new expense
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  // sets state for the changing amount of remaining money that the budget for this expense has if expense
  // was to be applied
  const [availableMoney, setAvailableMoney] = useState<number>(initialMoney);
  // sets error strings for expense form to be shown to user
  const [formErrors, setFormErrors] =
    useState<ExpenseFormErrors>(initialErrors);
  // booleans for form errors to be flashed on submission
  const [flashErrors, setFlashErrors] =
    useState<ExpenseFlashErrors>(initialFlashErrors);

  useEffect(() => {
    if (show === true) {
      setFormData((prev) => ({
        ...prev,
        date: DateTime.now().toFormat("yyyy-MM-dd'T'T"),
      }));
    }
  }, [show]);

  useEffect(() => {
    setAvailableMoney(
      getRemainingMoney(budget.moneyAllocated, budget.moneySpent)
    );
    originalMoney.current = getRemainingMoney(
      budget.moneyAllocated,
      budget.moneySpent
    );
  }, [budget.moneyAllocated, budget.moneySpent]);

  // pushes number on the key clicked by user to the right side of the new expense's transaction value and
  // returns a new string
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.transaction, num);
      handleExpenseInputErrors("transaction", newNum, setFormErrors);
      let original = originalMoney.current;
      if (newNum <= original) {
        let newAvailableMoney = original - newNum;
        setFormData((data) => ({
          ...data,
          transaction: newNum,
        }));
        setAvailableMoney(newAvailableMoney);
      } else {
        setFormErrors((data) => ({
          ...data,
          transaction:
            "Expense transaction value cannot exceed available budget",
        }));
        setTimeout(() => {
          setFormErrors((data) => ({
            ...data,
            transaction: "",
          }));
        }, 1500);
      }
    },
    [formData, formErrors]
  );

  // pops number from the right side of the new expense's transaction value and
  // returns a new string
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum: number = numPop(formData.transaction);
      handleExpenseInputErrors("transaction", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      let newAvailableMoney = originalMoney.current - newNum;
      setAvailableMoney(newAvailableMoney);
    },
    [formData, formErrors]
  );

  // updates form data values based on user input, if input contains errors (e.g. expense title too long),
  // updates form error state and lets user know
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (name === "title" || name === "transaction" || name === "date") {
        handleExpenseInputErrors(name, value, setFormErrors);
        setFormData((data) => ({ ...data, [name]: value }));
      }
    },
    [formErrors, formData]
  );

  // sends new expense data to backend to be added to db and updates user state. If any inputs
  // contain errors, does not send data and flashes errorful inputs
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleExpenseSubmitErrors(formData, setFormErrors)) {
          let newBudgetUpdate;
          let newAddedExpense;
          if (mock) {
            mock();
          } else {
            dispatch(setFormLoading(true));
            let submitData: submitNewExpense = {
              ...formData,
              budgetID: budget?._id,
            };
            const { spentMoney, newExpense } = await ExpenseAPI.addNewExpense(
              submitData,
              user!._id
            );
            newBudgetUpdate = spentMoney;
            newAddedExpense = newExpense;
            notify(submitData.title, submitData.transaction);
          }
          addExpense(newAddedExpense);
          updateBudget(newBudgetUpdate);
          hideExpenseForm(e, "showExpenseForm");
          setFormData(initialState);
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
    },
    [formData, formErrors, flashErrors, user?._id]
  );

  // clears and resets form data and hides form when the user clicks cancel
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      hideExpenseForm(e, "showExpenseForm");
      setFormData(initialState);
      setAvailableMoney(initialMoney);
      setFormErrors(initialErrors);
    },
    [formData, formErrors]
  );

  return {
    formData,
    availableMoney,
    formErrors,
    flashErrors,
    handlePress,
    handleDelete,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};

export default useExpenseForm;
