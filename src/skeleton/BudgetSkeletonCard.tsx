import Skeleton from "react-loading-skeleton";

// returns card for a single budget to be displayed in BudgetList component
const BudgetSkeletonCard = (): JSX.Element => {
  return (
    <li className="w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
      <div className="budget-card border-2 border-green-400 p-8 m-4 shadow-md bg-white rounded-md">
        <header className="text-center">
          <h3 className="budget-title font-bold text-xl hover:text-green-600 hover:underline active:text-green-100 duration-150">
            <Skeleton />
          </h3>
          <p className="budget-money-allocation font-mono">
            Total Funds Allocated:
          </p>
          <p className="budget-money-allocation-value text-3xl text-green-900">
            <Skeleton />
          </p>
        </header>
        <div className="budget-progress-bar-div my-4">
          <Skeleton />
        </div>
        <div className="fraction-information flex justify-around">
          <div className="budget-money-spend-div text-center">
            <p className="budget-money-spent">Funds</p>
            <p className="budget-money-spent">Spent:</p>
            <p className="budget-money-spent-value text-xl font-bold text-green-900">
              <Skeleton />
            </p>
          </div>
          <div className="budget-money-remaining-div text-center">
            <p className="budget-money-remaining">Funds</p>
            <p className="budget-money-remaining">Remaining:</p>
            <p className="budget-money-remaining-value text-xl font-bold text-green-900">
              <Skeleton />
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BudgetSkeletonCard;
