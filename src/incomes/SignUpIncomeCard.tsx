import { SubmitIncomeSignUp } from "../interfaces/incomeInterfaces";
import { FaTrashAlt } from "react-icons/fa";

type Props = {
  income: SubmitIncomeSignUp;
  removeIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  index: number;
};

// returns card for a single new income for list of intial incomes user makes when they sign up for an account
const SignUpIncomeCard: React.FC<Props> = ({
  income,
  removeIncome,
  index,
}): JSX.Element => {
  return (
    <div className="submit-income-card border-2 p-2 border-green-600 rounded-lg bg-gray-200 m-2">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{income.title}</h1>
          <p>
            <b>Salary:</b> ${income.salary.toFixed(2)}
          </p>
          <p>
            <b>Gets paid at:</b> {income.readableUpdateTimeString}
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="bg-red-700 p-3 rounded-lg"
            onClick={(e) => removeIncome(e, index)}
          >
            {" "}
            <FaTrashAlt className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpIncomeCard;
