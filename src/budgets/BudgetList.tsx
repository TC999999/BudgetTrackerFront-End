import BudgetCard from "./BudgetCard";
import BudgetSkeleton from "../skeleton/BudgetSkeleton";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";

type Props = {
  allBudgets: BudgetListInterface[];
};

// returns a list of budget cards for all of the budgets a user currenly has; or shows a message
// that the user has no budgets
const BudgetList: React.FC<Props> = ({ allBudgets }): JSX.Element => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );
  return (
    <div>
      {!pageLoading && allBudgets.length > 0 && (
        <ul
          id="budget-list"
          className="stripedBudgets flex flex-wrap justify-center"
        >
          {allBudgets.map((budget) => (
            <BudgetCard budget={budget} key={budget._id} />
          ))}
        </ul>
      )}

      {pageLoading && (
        <ul
          id="budget-list"
          className="stripedBudgets flex flex-wrap justify-center"
        >
          <BudgetSkeleton cards={10} />
        </ul>
      )}

      {!pageLoading && !allBudgets.length && (
        <p className="text-3xl m-4 text-center italic">
          You currently have no budgets
        </p>
      )}
    </div>
  );
};

export default BudgetList;
