import {
  NewIncome,
  Income,
  IncomeErrors,
  FlashIncomeErrors,
  SubmitIncomeSignUp,
} from "../interfaces/incomeInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import useIncomeForm from "./hooks/useIncomeForm";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import IncomeForm from "./IncomeForm";

type Props = {
  hideIncomeFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  addToIncomeState?: (income: Income) => void;
  handleIncomes?: (e: React.FormEvent, income: SubmitIncomeSignUp) => void;
};

// returns form to add new income, used for both registration and the income page
const NewIncomeForm: React.FC<Props> = ({
  hideIncomeFormState,
  addToIncomeState,
  handleIncomes,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
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

  const {
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
  } = useIncomeForm({
    initialState,
    initialErrors,
    initialFlashErrors,
    hideIncomeFormState,
    userID: user?._id,
    addToIncomeState,
    handleIncomes,
  });

  return !formLoading ? (
    <IncomeForm
      type="New"
      formData={formData}
      formErrors={formErrors}
      flashErrors={flashErrors}
      readableUpdateTimeString={readableUpdateTimeString}
      handleChange={handleChange}
      handlePress={handlePress}
      handleDelete={handleDelete}
      handleTime={handleTime}
      handleDate={handleDate}
      handleMonth={handleMonth}
      handleWeek={handleWeek}
      handleSubmit={handleSubmit}
      hide={hideIncomeFormState}
    />
  ) : null;
};

export default NewIncomeForm;
