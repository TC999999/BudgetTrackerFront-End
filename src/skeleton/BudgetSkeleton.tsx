import BudgetSkeletonCard from "./BudgetSkeletonCard";

type Props = { cards: number };
// returns a list of  skeleton cards to be used for BudgetList.tsx before the budgets load
const BudgetSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => <BudgetSkeletonCard key={`skeleton-budget-${i}`} />);
};

export default BudgetSkeleton;
