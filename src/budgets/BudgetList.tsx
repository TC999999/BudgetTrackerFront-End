import BudgetCard from "./BudgetCard";
import OnPageLoading from "../OnPageLoading";
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
  return !pageLoading ? (
    <section id="budget-list-page">
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
    </section>
  ) : (
    <OnPageLoading loadingMsg="Budgets" />
  );
};

export default BudgetList;
