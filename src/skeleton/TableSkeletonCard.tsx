import Skeleton from "react-loading-skeleton";
import CardTextSkeleton from "./CardTextSkeleton";

type Props = { cards: number; cols: "4" | "5" };
// returns a list of  skeleton cards to be used for TransactionList.tsx before the expenses load
const SkeletonCard: React.FC<Props> = ({ cards, cols }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <div
        className={`transaction-card grid grid-cols-${cols} p-4`}
        key={`transaction-skeleton-${i}`}
      >
        <Skeleton wrapper={CardTextSkeleton} />
        <Skeleton wrapper={CardTextSkeleton} />
        <Skeleton wrapper={CardTextSkeleton} />
        <Skeleton wrapper={CardTextSkeleton} />
        {cols === "5" && <Skeleton wrapper={CardTextSkeleton} />}
      </div>
    ));
};

export default SkeletonCard;
