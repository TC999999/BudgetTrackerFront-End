import {
  NewIncome,
  Income,
  IncomeErrors,
  FlashIncomeErrors,
  SubmitIncomeSignUp,
} from "../interfaces/incomeInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import useNewIncomeForm from "./formHooks/useNewIncomeForm";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { months, hours, minutes, daysOfWeek } from "../helpers/timeMaps";
import { getDaysInAMonth } from "../helpers/getDaysInAMonth";
import KeyPad from "../KeyPad";

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
  } = useNewIncomeForm({
    initialState,
    initialErrors,
    initialFlashErrors,
    hideIncomeFormState,
    userID: user?._id,
    addToIncomeState,
    handleIncomes,
  });

  return !formLoading ? (
    <div className="modal-layer-1">
      <div className="modal-layer-2-lg">
        <div className="modal-layer-3 text-center">
          <header>
            <h1 className="text-3xl text-green-800 font-bold underline">
              Add a New Income
            </h1>
          </header>
          <form id="new-income-form" onSubmit={handleSubmit}>
            <div
              id="form-inputs"
              className="sm:flex sm:justify-center sm:items-center"
            >
              <div id="title-and-salary" className="sm:w-80">
                <div id="new-income-title-div">
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
                  {formErrors.title && (
                    <div
                      id="title-error-message"
                      className="text-red-600 font-bold sm:text-sm"
                    >
                      <p>{formErrors.title}</p>
                    </div>
                  )}
                  <div id="income-title-requirements" className="flex flex-col">
                    <small>Title must be between 4-20 characters</small>
                    <small>Title may include letters and numbers.</small>
                    <small>Title cannot contain special characters</small>
                    <small>(e.g. !, ?, @, #, () [], /).</small>
                  </div>
                </div>
                <div id="new-income-salary-div">
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
                  {formErrors.salary && (
                    <div
                      id="salary-error-message"
                      className="text-red-600 font-bold sm:text-sm"
                    >
                      <p>{formErrors.salary}</p>
                    </div>
                  )}
                  <div id="income-salary-requirements" className=" pb-2">
                    <small>Salary must be greater than $0.00</small>
                  </div>
                  <KeyPad
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    num={formData.salary}
                  />
                </div>
              </div>
              <section id="update-schedule">
                <div id="schedule-headers" className="flex justify-center">
                  <header id="time-show">
                    <h1
                      id="readable-update-time-string"
                      className="font-bold text-center text-3xl text-green-700 w-96"
                    >
                      {readableUpdateTimeString}
                    </h1>
                  </header>
                </div>
                <section id="income-time-input">
                  <header>
                    <h2 className="text-2xl">Time:</h2>
                  </header>
                  <div className="flex justify-center items-center">
                    <div id="hour-select-div">
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
                    <div id="colon-div">
                      <p className="text-5xl">:</p>
                    </div>
                    <div id="minute-select-div">
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
                    <div id="time-requirements" className="sm:w-72">
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
                  <div className="flex justify-center w-full">
                    <div id="dayOfMonth-div" className="mx-2">
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
                      <div id="month-div" className="mx-2">
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
                    <div id="dayOfWeek-div" className="mx-2">
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
                    <div
                      id="date-requirements"
                      className="flex flex-col sm:w-72"
                    >
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
            <div id="buttons" className="flex justify-between m-2">
              <button
                className="cancel-button"
                onClick={(e) => hideIncomeFormState(e)}
              >
                Cancel
              </button>

              <button className="submit-button">Add Income</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default NewIncomeForm;
