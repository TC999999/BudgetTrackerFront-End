import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

type Props = {
  allBudgets: BudgetListInterface[];
};

// returns a list of budget cards for all of the budgets a user currenly has; or shows a message
// that the user has no budgets
const BudgetList: React.FC<Props> = ({ allBudgets }): JSX.Element => {
  return (
    <main id="budget-list-page">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl text-emerald-500 underline font-bold">
          All Current Budgets ({allBudgets!.length}/10)
        </h1>
        <small>
          This page allows you set aside funds in order to make plans for future
          budgets or record current budgets you may have. You are allowed a
          maximum of ten budgets.
        </small>
      </header>
      {allBudgets?.length ? (
        <ul
          id="budget-list"
          className="stripedBudgets flex flex-wrap justify-center"
        >
          {allBudgets.map((budget) => (
            <li className="w-5/6 md:w-2/5 xl:w-1/5 " key={budget._id}>
              <BudgetCard budget={budget} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-3xl m-4 text-center italic">
          You currently have no budgets
        </p>
      )}
    </main>
  );
};

export default BudgetList;
