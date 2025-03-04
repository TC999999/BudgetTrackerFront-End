import { Income } from "../interfaces/incomeInterfaces";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import { useRef } from "react";

type Props = {
  income: Income;
  deleteIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => Promise<void>;
};

const IncomeCard: React.FC<Props> = ({ income, deleteIncome }): JSX.Element => {
  const lastDate = useRef<dateInfo>(makeDateString(income.lastReceived));
  const nextDate = useRef<dateInfo>(makeDateString(income.nextReceived));
  return (
    <div className="p-2 m-4 text-center border-4 border-green-700 bg-white rounded-lg">
      <h1 className="text-4xl text-green-600 underline">{income.title}</h1>
      <div className="salary-div text-3xl">
        <p className="underline">Salary: </p>

        <p className="salary-number font-bold">${income.salary}</p>

        <p className="readable-salary-interval">
          {income.readableUpdateTimeString}
        </p>
      </div>
      <div className="next-and-last-received-dates">
        <div className="last-received-date text-2xl">
          <p className="font-bold">Last Received On: </p>
          <p>
            {lastDate.current.date} at {lastDate.current.time}
          </p>
        </div>
        <div className="next-received-date text-2xl">
          <p className="font-bold">Next Received On: </p>
          <p>
            {nextDate.current.date} at {nextDate.current.time}
          </p>
        </div>
      </div>
      <div className="delete-button">
        <button onClick={(e) => deleteIncome(e, income._id)}>
          Delete Income
        </button>
      </div>
    </div>
  );
};

export default IncomeCard;
