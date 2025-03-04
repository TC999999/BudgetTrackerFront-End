import { SubmitIncomeSignUp } from "../interfaces/incomeInterfaces";

type Props = {
  income: SubmitIncomeSignUp;
};

const SignUpIncomeCard: React.FC<Props> = ({ income }) => {
  return (
    <div className="submit-income-card border-2 p-2 border-green-600 rounded-lg bg-gray-200 m-2">
      <h1 className="text-xl font-bold">{income.title}</h1>
      <p>
        <b>Salary:</b> ${income.salary.toFixed(2)}
      </p>
      <p>
        <b>Gets paid at:</b> {income.readableUpdateTimeString}
      </p>
    </div>
  );
};

export default SignUpIncomeCard;
