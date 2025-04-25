import { useCallback, useState, useMemo } from "react";
import {
  NewIncome,
  Income,
  IncomeErrors,
  SubmitIncomeSignUp,
  UpdateTime,
  FlashIncomeErrors,
} from "../interfaces/incomeInterfaces";
import { error } from "../interfaces/miscTypes";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { makeCronString } from "../helpers/makeCronString";
import { makeReadableUpdateTimeString } from "../helpers/makeReadableUpdateTimeString";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "../helpers/handleIncomeErrors";
import NewIncomeForm from "./NewIncomeForm";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { setFormLoading } from "../features/slices/loadSlice";
import { shallowEqual } from "react-redux";
import { toast, Id } from "react-toastify";
import IncomeAPI from "../apis/IncomeAPI";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { loading } from "../interfaces/loadingInterfaces";

type Props = {
  hideIncomeFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  addToIncomeState?: (income: Income) => void;
  handleIncomes?: (e: React.FormEvent, income: SubmitIncomeSignUp) => void;
};

// returns form to add new income, used for both registration and the income page
const NewIncomeWindow: React.FC<Props> = ({
  hideIncomeFormState,
  addToIncomeState,
  handleIncomes,
}): JSX.Element | null => {
  const dispatch: AppDispatch = useAppDispatch();

  const notify = (incomeTitle: string): Id =>
    toast.success(`${incomeTitle} income successfully created`);

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

  // update time is used to construct a cron string to be sent to backend
  const initialState: NewIncome = {
    title: "",
    salary: 0,
    updateTime: {
      minute: "0",
      hour: "0",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    },
  };

  const initialErrors: IncomeErrors = {
    title: "",
    salary: "",
  };

  const initialFlashErrors: FlashIncomeErrors = { title: false, salary: false };

  // state for form data used to create income
  const [formData, setFormData] = useState<NewIncome>(initialState);
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
    [formLoading, formData]
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
    [formData.salary]
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
    [formData.salary]
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
          let { title, salary, updateTime } = formData;
          let cronString: string = makeCronString(updateTime);
          let submitData: SubmitIncomeSignUp = {
            title,
            salary: salary / 100,
            cronString,
            readableUpdateTimeString,
          };
          if (handleIncomes) {
            dispatch(setFormLoading(true));
            handleIncomes(e, submitData);
          } else if (addToIncomeState && user?._id) {
            dispatch(setFormLoading(true));
            let newIncome: Income = await IncomeAPI.addNewUserIncome(
              submitData,
              user?._id
            );
            addToIncomeState(newIncome);
            notify(submitData.title);
          }
          hideIncomeFormState(e);
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

  return !formLoading ? (
    <NewIncomeForm
      formData={formData}
      formErrors={formErrors}
      flashErrors={flashErrors}
      readableUpdateTimeString={readableUpdateTimeString}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handlePress={handlePress}
      handleDelete={handleDelete}
      handleTime={handleTime}
      handleDate={handleDate}
      handleMonth={handleMonth}
      handleWeek={handleWeek}
      hideIncomeFormState={hideIncomeFormState}
    />
  ) : null;
};

export default NewIncomeWindow;
