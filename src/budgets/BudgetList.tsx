import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  allBudgets: BudgetListInterface[] | null;
}

const BudgetList: React.FC<Props> = (props) => {
  return (
    <main>
      <header>
        <h1 className="text-center text-2xl sm:text-3xl text-emerald-500 underline font-bold">
          All Current Budgets
        </h1>
      </header>
      {props.allBudgets?.length ? (
        <ul className="budget-list stripedBudgets flex flex-wrap justify-center">
          {props.allBudgets?.map((budget) => (
            <li className="w-5/6 md:w-2/5 xl:w-1/5 " key={budget._id}>
              <BudgetCard budget={budget} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xl m-4 italic">You currently have no budgets</p>
      )}
    </main>
  );
};

export default BudgetList;
