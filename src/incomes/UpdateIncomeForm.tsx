import {
  UpdateIncome,
  IncomeErrors,
  FlashIncomeErrors,
  Income,
} from "../interfaces/incomeInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { constructUpdateTimeObj } from "../helpers/constructUpdateTimeObj";
import IncomeForm from "./IncomeForm";
import useIncomeForm from "./hooks/useIncomeForm";

type Props = {
  income: Income;
  selectIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    income: null
  ) => void;
  updateIncomeState: (income: Income) => void;
};

// returns a form for users to update their own incomes
const UpdateIncomeForm: React.FC<Props> = ({
  income,
  selectIncome,
  updateIncomeState,
}): JSX.Element | null => {
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
    userID: user?._id,
    income,
    updateIncomeState,
    selectIncome,
  });

  return !formLoading ? (
    <IncomeForm
      type="Update"
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
      hide={selectIncome}
      incomeTitle={income.title}
    />
  ) : null;
};

export default UpdateIncomeForm;
