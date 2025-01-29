import { Link } from "react-router-dom";
const BudgetErrorPage = () => {
  return (
    <div className="budget-error-page">
      <h1>401 ERROR</h1>
      <h1>The budget you were trying to find either:</h1>
      <ul>
        <li>Does not exist</li>
        <li>Does not belong to you</li>
      </ul>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default BudgetErrorPage;
