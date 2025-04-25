import { useCallback, useState, useMemo } from "react";
import {
  UpdateIncome,
  IncomeErrors,
  SubmitUpdateIncome,
  UpdateTime,
  FlashIncomeErrors,
  Income,
} from "../interfaces/incomeInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { error } from "../interfaces/miscTypes";
import { loading } from "../interfaces/loadingInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { makeCronString } from "../helpers/makeCronString";
import { makeReadableUpdateTimeString } from "../helpers/makeReadableUpdateTimeString";
import { constructUpdateTimeObj } from "../helpers/constructUpdateTimeObj";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "../helpers/handleIncomeErrors";
import { createUpdateIncomeString } from "../helpers/createNotificationString";
import UpdateIncomeForm from "./UpdateIncomeForm";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { setFormLoading } from "../features/slices/loadSlice";
import { shallowEqual } from "react-redux";
import { toast, Id } from "react-toastify";
import IncomeAPI from "../apis/IncomeAPI";

type Props = {
  income: Income;
  selectIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    income: null
  ) => void;
  updateIncomeState: (income: Income) => void;
};

// returns a form for users to update their own incomes
const UpdateIncomeWindow: React.FC<Props> = ({
  income,
  selectIncome,
  updateIncomeState,
}): JSX.Element | null => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (notification: string): Id => toast.success(notification);
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

  // update time is used to construct a new cron string to be sent to backend for update
  const initialState: UpdateIncome = {
    _id: income._id,
    title: income.title,
    salary: +income.salary * 100,
    updateTime: constructUpdateTimeObj(income.cronString),
  };

  const initialErrors: IncomeErrors = {
    title: "",
    salary: "",
  };

  const initialFlashErrors: FlashIncomeErrors = { title: false, salary: false };

  // state for form data used to update income
  const [formData, setFormData] = useState<UpdateIncome>(initialState);
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
    (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  // creates cron string from updateTime value and submits income data to db to be updated.
  // If any input errors are present (e.g. title is empty or contains invalid characters,
  // salary at $0.00), does not send data and insteads flashes erroneous inputs at user
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (handleIncomeSubmitErrors(formData, setFormErrors)) {
        try {
          dispatch(setFormLoading(true));
          let { title, salary, updateTime } = formData;
          let cronString: string = makeCronString(updateTime);
          let submitData: SubmitUpdateIncome = {
            _id: income._id,
            title,
            salary: salary / 100,
            cronString,
            readableUpdateTimeString,
          };
          if (user?._id) {
            let updatedIncome: Income = await IncomeAPI.updateUserIncome(
              submitData,
              user?._id
            );
            updateIncomeState(updatedIncome);
          }
          notify(createUpdateIncomeString(income, submitData));
          selectIncome(e, null);
        } catch (err: any) {
          notifyError(JSON.parse(err.message));
        } finally {
          dispatch(setFormLoading(false));
        }
      } else {
        if (formData.title === "" || formErrors.title)
          setFlashErrors((flash) => ({ ...flash, title: true }));
        if (formData.salary === 0 || formErrors.salary)
          setFlashErrors((flash) => ({ ...flash, salary: true }));
        setTimeout(() => {
          setFlashErrors(initialFlashErrors);
        }, 500);
      }
    },
    [formData, formErrors, flashErrors]
  );

  return !formLoading ? (
    <UpdateIncomeForm
      income={income}
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
      selectIncome={selectIncome}
    />
  ) : null;
};

export default UpdateIncomeWindow;
