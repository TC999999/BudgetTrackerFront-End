import IncomeSkeletonCard from "./IncomeSkeletonCard";

type Props = { cards: number };
// returns a list of  skeleton cards to be used for IncomeList.tsx before the incomes load
const IncomeSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => <IncomeSkeletonCard key={`skeleton-income-${i}`} />);
};

export default IncomeSkeleton;
