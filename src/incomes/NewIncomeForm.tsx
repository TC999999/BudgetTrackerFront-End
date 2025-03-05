import { useCallback, useState, useMemo } from "react";
import {
  NewIncome,
  IncomeErrors,
  SubmitIncomeSignUp,
  UpdateTime,
  FlashIncomeErrors,
} from "../interfaces/incomeInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { months, hours, minutes, daysOfWeek } from "../helpers/timeMaps";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getDaysInAMonth } from "../helpers/getDaysInAMonth";
import { makeCronString } from "../helpers/makeCronString";
import { makeReadableUpdateTimeString } from "../helpers/makeReadableUpdateTimeString";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "../helpers/handleIncomeErrors";
import { addNewIncome } from "../features/actions/incomes";
import KeyPad from "../KeyPad";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setSmallLoading } from "../features/auth/authSlice";

type Props = {
  changeIncomeFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  handleIncomes?: (e: React.FormEvent, income: SubmitIncomeSignUp) => void;
};

const NewIncomeForm: React.FC<Props> = ({
  changeIncomeFormState,
  handleIncomes,
}) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

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
  const [formData, setFormData] = useState<NewIncome>(initialState);
  const [formErrors, setFormErrors] = useState<IncomeErrors>(initialErrors);
  const [flashErrors, setFlashErrors] =
    useState<FlashIncomeErrors>(initialFlashErrors);
  const readableUpdateTimeString: string = useMemo(
    () => makeReadableUpdateTimeString(formData.updateTime),
    [formData.updateTime]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleIncomeInputErrors("title", value, setFormErrors);
    setFormData((data) => ({ ...data, title: value }));
  };

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

  const handleTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      updateTime: { ...formData.updateTime, [name]: value },
    }));
  };

  const handleDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleWeek = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        dispatch(setSmallLoading(true));
        handleIncomes(e, submitData);
        dispatch(setSmallLoading(false));
      } else {
        await dispatch(addNewIncome(submitData)).unwrap();
      }
      changeIncomeFormState(e);
    } else {
      if (formData.title === "" || formErrors.title)
        setFlashErrors((flash) => ({ ...flash, title: true }));
      if (formData.salary === 0 || formErrors.salary)
        setFlashErrors((flash) => ({ ...flash, salary: true }));
      setTimeout(() => {
        setFlashErrors(initialFlashErrors);
      }, 500);
    }
  };

  return !userStatus.smallLoading ? (
    <div className="modal-layer-1">
      <div className="modal-layer-2-lg">
        <div className="modal-layer-3 text-center">
          <h1 className="text-3xl text-green-800 font-bold underline">
            Add a New Income
          </h1>
          <div className="new-income-form-div">
            <form className="new-income-form" onSubmit={handleSubmit}>
              <div className="form-inputs sm:flex sm:justify-center sm:items-center">
                <div className="title-and-salary sm:w-80">
                  <div className="new-income-title-div">
                    <label className="text-lg block" htmlFor="title">
                      Income Title:{" "}
                    </label>
                    <input
                      className={`input sm:text-sm md:text-base ${
                        formErrors.title ? "input-error" : "input-valid"
                      } ${flashErrors.title ? "animate-blinkError" : ""}`}
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={"Where does this income come from?"}
                    />
                    <div className="title-error text-red-600 font-bold sm:text-sm">
                      <p>{formErrors.title}</p>
                    </div>
                    <div className="income-title-info text-sm pb-2">
                      <p>Title must be between 4-20 characters</p>
                      <p>Title may include letters and numbers.</p>
                      <p>Title cannot contain special characters</p>
                      <p>(e.g. !, ?, @, #, () [], /).</p>
                    </div>
                  </div>
                  <div className="new-income-salary">
                    <label className="text-lg block" htmlFor="Salary">
                      Income Value ($ U.S.):{" "}
                    </label>
                    <input
                      type="text"
                      className={`input sm:text-sm md:text-base ${
                        formErrors.salary && "input-error"
                      } ${flashErrors.salary ? "animate-blinkError" : ""}`}
                      id="salary"
                      name="salary"
                      value={`$${(formData.salary / 100).toFixed(2)}`}
                      placeholder={"$0.00"}
                      readOnly
                    />

                    <div className="salary-error text-red-600 font-bold sm:text-sm">
                      <p>{formErrors.salary}</p>
                    </div>
                    <div className="income-salary-info text-sm pb-2">
                      <p>Salary must be greater than $0.00</p>
                    </div>

                    <KeyPad
                      handlePress={handlePress}
                      handleDelete={handleDelete}
                      num={formData.salary}
                    />
                  </div>
                </div>
                <div className="update-schedule">
                  <div className="schedule-headers flex justify-center">
                    <div className="time-show text-center text-3xl text-green-700 w-96">
                      <div className="question-header">
                        <h1 className="text-green-800 underline">
                          When do you receive your income?
                        </h1>
                      </div>
                      <div className="readable-update-time-string font-bold">
                        <h1>{readableUpdateTimeString}</h1>
                      </div>
                    </div>
                  </div>
                  <div className="time-div">
                    <h2 className="text-2xl">Time:</h2>
                    <div className="flex justify-center items-center">
                      <div className="hour-select-div">
                        <label className="block" htmlFor="hour">
                          Hour:
                        </label>
                        <select
                          name="hour"
                          className="w-24 text-xl text-center border-2 focus:border-green-800 focus:outline-none"
                          id="hour"
                          value={formData.updateTime.hour}
                          onChange={handleTime}
                          size={5}
                        >
                          {Array.from(hours).map(([k, v]) => (
                            <option
                              className={`hover:bg-green-200 w-full
                            ${
                              formData.updateTime.hour === k
                                ? "bg-green-300"
                                : ""
                            }
                          `}
                              key={`hour-${k}`}
                              value={k}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="colon-div">
                        <p className="text-5xl">:</p>
                      </div>
                      <div className="minute-select-div">
                        <label className="block" htmlFor="minute">
                          Minute:
                        </label>
                        <select
                          name="minute"
                          className="w-12 text-xl text-center border-2 focus:border-green-800 focus:outline-none"
                          id="minute"
                          value={formData.updateTime.minute}
                          onChange={handleTime}
                          size={5}
                        >
                          {Array.from(minutes).map(([k, v]) => (
                            <option
                              className={`hover:bg-green-200 w-full ${
                                formData.updateTime.minute === k
                                  ? "bg-green-300"
                                  : ""
                              }`}
                              key={`minute-${k}`}
                              value={k}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="time-info text-sm">
                      <p>
                        Adjust the time that your income comes through with the
                        sliders above.
                      </p>
                    </div>
                  </div>
                  <div className="date-div">
                    <h1 className="text-2xl">Date:</h1>
                    <div className="sm:flex sm:justify-center p-2 w-full">
                      <div className="dayOfMonth-div m-2">
                        <label
                          htmlFor="dayOfMonth"
                          className="text-lg block text-center"
                        >
                          Day:
                        </label>
                        <select
                          name="dayOfMonth"
                          id="dayOfMonth"
                          value={formData.updateTime.dayOfMonth}
                          onChange={handleDate}
                          className="text-lg text-center border-2 focus:border-green-800 focus:outline-none"
                          size={5}
                        >
                          {Array.from(
                            getDaysInAMonth(formData.updateTime.month)
                          ).map(([k, v]) => (
                            <option
                              className={`hover:bg-green-200 w-full
                            ${
                              formData.updateTime.dayOfMonth === k
                                ? "bg-green-300"
                                : ""
                            }`}
                              key={`dayOfMonth-${k}`}
                              value={k}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formData.updateTime.dayOfMonth !== "*" && (
                        <div className="month-div m-2">
                          <label
                            htmlFor="month"
                            className="text-lg block text-center"
                          >
                            Month:
                          </label>
                          <select
                            name="month"
                            id="month"
                            value={formData.updateTime.month}
                            onChange={handleMonth}
                            className="text-lg text-center border-2 focus:border-green-800 focus:outline-none"
                            size={5}
                          >
                            {Array.from(months).map(([k, v]) => (
                              <option
                                className={`hover:bg-green-200 w-full
                            ${
                              formData.updateTime.month === k
                                ? "bg-green-300"
                                : ""
                            }`}
                                key={`month-${k}`}
                                value={k}
                              >
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="dayOfWeek-div m-2">
                        <label
                          htmlFor="dayOfWeek"
                          className="text-lg block text-center"
                        >
                          Day of Week:
                        </label>
                        <select
                          name="dayOfWeek"
                          id="dayOfWeek"
                          value={formData.updateTime.dayOfWeek}
                          onChange={handleWeek}
                          className="text-lg text-center border-2 focus:border-green-800 focus:outline-none"
                          size={5}
                        >
                          {Array.from(daysOfWeek).map(([k, v]) => (
                            <option
                              className={`hover:bg-green-200 focus:bg-green-200 w-full
                            ${
                              formData.updateTime.dayOfWeek === k
                                ? "bg-green-300"
                                : ""
                            }`}
                              key={`dayOfWeek-${k}`}
                              value={k}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="info-div text-sm">
                      <p>Adjust the date with the sliders above.</p>
                      <p>
                        To avoid any possible errors, we are only allowing
                        weekly, monthly, or yearly incomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="buttons flex justify-between m-2">
                <button
                  className="cancel-button"
                  onClick={(e) => changeIncomeFormState(e)}
                >
                  Cancel
                </button>

                <button className="submit-button bg-green-300 border-2 border-green-700 rounded-full p-2 hover:bg-green-600 hover:text-white active:bg-green-700">
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default NewIncomeForm;
