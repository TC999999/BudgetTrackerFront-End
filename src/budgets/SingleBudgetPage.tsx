import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";

const SingleBudgetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<BudgetInterface | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const HideForm = () => {
    setShowExpenseForm(false);
  };

  useEffect(() => {
    const getBudget = () => {
      let arr = userStatus.user.budgets.filter((b) => {
        return b._id === id;
      });
      return arr[0];
    };
    let currentBudget = getBudget();
    if (currentBudget) {
      setBudget(currentBudget);
    } else {
      navigate("/budgets/error/unauthorized");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="budget-page">
      <button onClick={() => navigate(-1)}>Back to All Budgets</button>
      <BudgetPageCard budget={budget} />
      <button onClick={() => setShowExpenseForm(true)}>Add Expense</button>
      {showExpenseForm && <ExpenseForm hideForm={HideForm} budget={budget} />}
    </div>
  );
};

export default SingleBudgetPage;
