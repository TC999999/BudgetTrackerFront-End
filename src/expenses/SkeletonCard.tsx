import Skeleton from "react-loading-skeleton";
import cardTextSkeleton from "../skeleton/cardTextSkeleton";

type Props = { cards: number };
// returns a list of  skeleton cards to be used for ExpenseList.tsx before the expenses load
const SkeletonCard: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <div className="expense-card grid grid-cols-4 p-4" key={`skeleton-${i}`}>
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
      </div>
    ));
};

export default SkeletonCard;
