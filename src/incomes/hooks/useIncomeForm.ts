import { useState, useMemo, useCallback } from "react";
import { makeReadableUpdateTimeString } from "../../helpers/makeReadableUpdateTimeString";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "../../helpers/errorHandlers/handleIncomeErrors";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import { makeCronString } from "../../helpers/makeCronString";
import { createUpdateIncomeString } from "../../helpers/createNotificationString";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/loadSlice";
import { AppDispatch } from "../../features/store";
import IncomeAPI from "../../apis/IncomeAPI";
import {
  NewIncome,
  Income,
  IncomeErrors,
  SubmitIncomeSignUp,
  UpdateTime,
  UpdateIncome,
  FlashIncomeErrors,
  SubmitUpdateIncome,
} from "../../interfaces/incomeInterfaces";
import { error } from "../../interfaces/miscTypes";
import { toast, Id } from "react-toastify";

type input = {
  initialState: NewIncome | UpdateIncome;
  initialErrors: IncomeErrors;
  initialFlashErrors: FlashIncomeErrors;
  userID?: string;
  income?: Income;
  hideIncomeFormState?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  addToIncomeState?: (income: Income) => void;
  handleIncomes?: (e: React.FormEvent, income: SubmitIncomeSignUp) => void;
  updateIncomeState?: (income: Income) => void;
  selectIncome?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    income: null
  ) => void;
};

// custom hook for the form for adding a new income or updating a single income for a single user: includes handlers
// for adjustments in time and date selectors, errors, title input changes, presses of the keypad component, and
// submission of the data
const useIncomeForm = ({
  initialState,
  initialErrors,
  initialFlashErrors,
  userID,
  income,
  hideIncomeFormState,
  addToIncomeState,
  handleIncomes,
  updateIncomeState,
  selectIncome,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (message: string): Id => toast.success(message);
  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  // state for form data used to create income
  const [formData, setFormData] = useState<NewIncome | UpdateIncome>(
    initialState
  );
  // state for form input error strings
  const [formErrors, setFormErrors] = useState<IncomeErrors>(initialErrors);
  // state for flashing inputs when input errors are present upon submission
  const [flashErrors, setFlashErrors] =
    useState<FlashIncomeErrors>(initialFlashErrors);

  // creates a new readable interval string based on the update time in form data
  const readableUpdateTimeString: string = useMemo(
    () => makeReadableUpdateTimeString(formData.updateTime),
    [formData.updateTime]
  );

  // updates the title value in the form data state, if there is an error in the title input (e.g. title
  // length is too long, title has spaces at start and end) also updates form error state
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target;
      handleIncomeInputErrors("title", value, setFormErrors);
      setFormData((data) => ({ ...data, title: value }));
    },
    [formErrors, formData]
  );

  // callback function for keypad component to update salary value in form data state. Pushes number pressed
  // to the right of the current salary value. If there are any errors in input (e.g. salary value too high),
  // also updates form error state
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let value: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.salary, value);
      handleIncomeInputErrors("salary", newNum, setFormErrors);
      setFormData((data) => ({ ...data, salary: newNum }));
    },
    [formErrors, formData]
  );

  // callback function for keypad component to update salary value in form data state. Pops number from the
  // right of the current salary value. If there are any errors in input (e.g. salary value at $0.00),
  // also updates form error state
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = formData.salary;
      let newNum: number = numPop(num);
      handleIncomeInputErrors("salary", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        salary: newNum,
      }));
    },
    [formErrors, formData]
  );

  // updates either minute or hour values in the updateTime value of the form data state
  const handleTime = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      e.preventDefault();
      const { name, value } = e.target;
      setFormData((data) => ({
        ...data,
        updateTime: { ...formData.updateTime, [name]: value },
      }));
    },
    [formData]
  );

  // updates day of the month value in the updateTime value of the form data state. Also sets day of the week
  // and month values back to default.
  const handleDate = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      e.preventDefault();
      let { value } = e.target;
      setFormData((data) => ({
        ...data,
        updateTime: {
          ...formData.updateTime,
          dayOfWeek: "*",
          dayOfMonth: value,
          month: "*",
        },
      }));
    },
    [formData]
  );

  // updates month value in the updateTime value of the form data state. Also sets day of the week
  // values back to default.
  const handleMonth = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      e.preventDefault();
      let { value } = e.target;
      setFormData((data) => ({
        ...data,
        updateTime: {
          ...formData.updateTime,
          dayOfWeek: "*",
          month: value,
        },
      }));
    },
    [formData]
  );

  // updates day of the week value in the updateTime value of the form data state. Also sets day of the month
  // and month values back to default.
  const handleWeek = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      e.preventDefault();
      let { value } = e.target;
      let newUpdateTime: UpdateTime = {
        ...formData.updateTime,
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: value,
      };
      setFormData((data) => ({
        ...data,
        updateTime: newUpdateTime,
      }));
    },
    [formData]
  );

  // creates cron string from updateTime value and performs one of two actions: If user is signing up, adds an
  // income to list of incomes to be submitted; if user is logged in and on income page, automatically submits
  // data to db to be added. If any input errors are present (e.g. title is empty or contains invalid characters,
  // salary at $0.00), does not send data and insteads flashes erroneous inputs at user
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      try {
        e.preventDefault();
        if (handleIncomeSubmitErrors(formData, setFormErrors)) {
          dispatch(setFormLoading(true));
          let { title, salary, updateTime } = formData;
          let cronString: string = makeCronString(updateTime);
          let submitData: SubmitIncomeSignUp = {
            title,
            salary,
            cronString,
            readableUpdateTimeString,
          };
          if (handleIncomes) {
            handleIncomes(e, submitData);
          } else if (addToIncomeState && userID) {
            let newIncome: Income = await IncomeAPI.addNewUserIncome(
              submitData,
              userID
            );
            addToIncomeState(newIncome);
            notify(`${submitData.title} income created successfully!`);
          } else if (updateIncomeState && userID && income && selectIncome) {
            let updateData: SubmitUpdateIncome = {
              _id: income._id,
              ...submitData,
            };
            let updatedIncome: Income = await IncomeAPI.updateUserIncome(
              updateData,
              userID
            );
            updateIncomeState(updatedIncome);
            notify(createUpdateIncomeString(income, updateData));
            selectIncome(e, null);
          }
          if (hideIncomeFormState) hideIncomeFormState(e);
        } else {
          if (formData.title === "" || formErrors.title)
            setFlashErrors((flash) => ({ ...flash, title: true }));
          if (formData.salary === 0 || formErrors.salary)
            setFlashErrors((flash) => ({ ...flash, salary: true }));
          setTimeout(() => {
            setFlashErrors(initialFlashErrors);
          }, 500);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, formErrors, flashErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    readableUpdateTimeString,
    handleChange,
    handlePress,
    handleDelete,
    handleTime,
    handleDate,
    handleMonth,
    handleWeek,
    handleSubmit,
  };
};

export default useIncomeForm;
