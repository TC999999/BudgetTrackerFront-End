import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

const BudgetPage = () => {
  const navigate = useNavigate();

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const [budgetList, setBudgetList] = useState<BudgetListInterface[]>([]);

  useEffect(() => {
    let listBudgets = userStatus.user.budgets.map((b) => {
      return {
        _id: b._id,
        title: b.title,
        moneyAllocated: b.moneyAllocated,
        moneySpent: b.moneySpent,
        moneyRemaining: getRemainingMoney(b.moneyAllocated, b.moneySpent),
      };
    });
    setBudgetList(listBudgets);
  }, []);

  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  const HideForm = () => {
    setShowBudgetForm(false);
  };

  return (
    <div className="budget-page">
      {" "}
      <button onClick={() => navigate(-1)}>Back Home</button>
      <h1>BudgetPage</h1>
      <button onClick={() => setShowBudgetForm(true)}>Add a new Budget</button>
      {showBudgetForm && <BudgetForm hideForm={HideForm} />}
      {userStatus.user.budgets.length ? (
        <BudgetList allBudgets={budgetList} />
      ) : (
        <p>no budgets yet</p>
      )}
    </div>
  );
};

export default BudgetPage;
