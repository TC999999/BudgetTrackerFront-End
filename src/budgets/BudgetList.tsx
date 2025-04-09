import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

type Props = {
  allBudgets: BudgetListInterface[];
};

// returns a list of budget cards for all of the budgets a user currenly has; or shows a message
// that the user has no budgets
const BudgetList: React.FC<Props> = ({ allBudgets }): JSX.Element => {
  return (
    <main>
      <header>
        <h1 className="text-center text-2xl sm:text-3xl text-emerald-500 underline font-bold">
          All Current Budgets ({allBudgets!.length}/10)
        </h1>
      </header>
      {allBudgets?.length ? (
        <ul className="budget-list stripedBudgets flex flex-wrap justify-center">
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
