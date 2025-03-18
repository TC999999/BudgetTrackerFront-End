import { Link } from "react-router-dom";
const BudgetErrorPage = (): JSX.Element => {
  return (
    <div className="budget-error-page text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">401 ERROR</h1>
      <div className="error-list p-2">
        <h1 className="text-5xl">The budget you were trying to find either:</h1>
        <ul className="text-4xl">
          <li>Does not exist</li>
          <li>Does not belong to you</li>
        </ul>
      </div>

      <Link
        className="text-3xl text-green-600 underline hover:text-green-400 active:text-green-500"
        to="/"
      >
        Go Home
      </Link>
    </div>
  );
};

export default BudgetErrorPage;
