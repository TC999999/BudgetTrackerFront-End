import { Income } from "../interfaces/incomeInterfaces";
import {
  makeDateString,
  dateInfo,
  makeDateStringIncomeCard,
} from "../helpers/makeDateString";
import { useMemo } from "react";

type Props = {
  income: Income;
  deleteIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => Promise<void>;
  selectIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    income: Income
  ) => void;
};

// Card for IncomePage.tsx, shows the title, salary, update interval, and when the next income update is
const IncomeCard: React.FC<Props> = ({
  income,
  deleteIncome,
  selectIncome,
}): JSX.Element => {
  // makes readable date string for last time income was received
  const lastDate = useMemo<string>(
    () => makeDateStringIncomeCard(income.lastReceived),
    [income.lastReceived]
  );

  // makes readable date string for next time income will be received
  const nextDate = useMemo<dateInfo>(
    () => makeDateString(income.nextReceived),
    [income.nextReceived]
  );

  return (
    <div className="p-2 m-4 text-center border-4 border-green-700 bg-white rounded-lg">
      <header>
        <h1 className="text-2xl sm:text-4xl text-green-600 underline">
          {income.title}
        </h1>
      </header>
      <div className="salary-information text-xl sm:text-3xl">
        <p className="underline">Salary: </p>
        <p className="salary-number font-bold">${income.salary}</p>
        <p className="readable-salary-interval">
          {income.readableUpdateTimeString}
        </p>
      </div>
      <div className="next-and-last-received-dates text-lg sm:text-2xl">
        <div className="last-received-date">
          <p className="font-bold">Last Received On: </p>
          <p>{lastDate}</p>
        </div>
        <div className="next-received-date">
          <p className="font-bold">Next Received On: </p>
          <p>
            {nextDate.date} at {nextDate.time}
          </p>
        </div>
      </div>
      <div className="flex justify-around">
        <button
          className="border-2 p-1 sm:p-2 mt-2 text-sm sm:text-base text-white border-red-700 bg-red-600 rounded-full duration-150 hover:bg-red-300 hover:text-black"
          onClick={(e) => deleteIncome(e, income._id)}
        >
          Delete Income
        </button>

        <button
          className="border-2 p-1 sm:p-2 mt-2 text-sm sm:text-base text-white border-orange-700 bg-orange-600 rounded-full duration-150 hover:bg-orange-300 hover:text-black"
          onClick={(e) => selectIncome(e, income)}
        >
          Update Income
        </button>
      </div>
    </div>
  );
};

export default IncomeCard;
