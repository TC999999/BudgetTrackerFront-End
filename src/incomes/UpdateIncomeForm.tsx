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
import { months, hours, minutes, daysOfWeek } from "../helpers/timeMaps";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getDaysInAMonth } from "../helpers/getDaysInAMonth";
import { makeCronString } from "../helpers/makeCronString";
import { makeReadableUpdateTimeString } from "../helpers/makeReadableUpdateTimeString";
import { constructUpdateTimeObj } from "../helpers/constructUpdateTimeObj";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "../helpers/handleIncomeErrors";
import { updateIncome } from "../features/actions/incomes";
import KeyPad from "../KeyPad";
import { useAppDispatch, useAppSelector } from "../features/hooks";

type Props = {
  income: Income;
  selectIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    income: null
  ) => void;
};

const UpdateIncomeForm: React.FC<Props> = ({ income, selectIncome }) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

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
  const [formData, setFormData] = useState<UpdateIncome>(initialState);
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
      let submitData: SubmitUpdateIncome = {
        _id: income._id,
        title,
        salary: salary / 100,
        cronString,
        readableUpdateTimeString,
      };
      console.log(submitData);
      await dispatch(updateIncome(submitData)).unwrap();
      selectIncome(e, null);
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
          <header>
            <h1 className="text-3xl text-green-800 font-bold underline">
              Update {income.title} Income
            </h1>
          </header>
          <form className="new-income-form" onSubmit={handleSubmit}>
            <div className="form-inputs sm:flex sm:justify-center sm:items-center">
              <div className="title-and-salary sm:w-80">
                <div className="new-income-title-div">
                  <label className="text-2xl block" htmlFor="title">
                    Income Title:
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
                  <div className="income-title-info flex flex-col">
                    <small>Title must be between 4-20 characters</small>
                    <small>Title may include letters and numbers.</small>
                    <small>Title cannot contain special characters</small>
                    <small>(e.g. !, ?, @, #, () [], /).</small>
                  </div>
                </div>
                <div className="new-income-salary">
                  <label className="text-2xl block" htmlFor="Salary">
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
                  <div className="income-salary-info pb-2">
                    <small>Salary must be greater than $0.00</small>
                  </div>
                  <KeyPad
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    num={formData.salary}
                  />
                </div>
              </div>
              <section className="update-schedule">
                <div className="schedule-headers flex justify-center">
                  <header className="time-show">
                    <h1 className="readable-update-time-string font-bold text-center text-3xl text-green-700 w-96">
                      {readableUpdateTimeString}
                    </h1>
                  </header>
                </div>
                <section className="income-time-input">
                  <header>
                    <h2 className="text-2xl">Time:</h2>
                  </header>
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
                  <div className="flex justify-center">
                    <div className="time-info sm:w-72">
                      <small>
                        Adjust the time that your income comes through with the
                        sliders above.
                      </small>
                    </div>
                  </div>
                </section>
                <section id="income-date-input">
                  <header>
                    <h1 className="text-2xl">Date:</h1>
                  </header>
                  <div className="sm:flex sm:justify-center w-full">
                    <div className="dayOfMonth-div mx-2">
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
                      <div className="month-div mx-2">
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
                    <div className="dayOfWeek-div mx-2">
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
                  <div className="flex justify-center">
                    <div className="info-div flex flex-col sm:w-72">
                      <small>Adjust the date with the sliders above.</small>
                      <small>
                        To avoid any possible errors, you are only allowed to
                        input daily, weekly, monthly, or yearly incomes.
                      </small>
                    </div>
                  </div>
                </section>
              </section>
            </div>
            <div className="buttons flex justify-between m-2">
              <button
                className="cancel-button"
                onClick={(e) => selectIncome(e, null)}
              >
                Cancel
              </button>

              <button className="submit-button bg-green-300 border-2 border-green-700 rounded-full p-2 hover:bg-green-600 hover:text-white active:bg-green-700">
                Update Income
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default UpdateIncomeForm;
