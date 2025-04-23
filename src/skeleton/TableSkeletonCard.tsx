import Skeleton from "react-loading-skeleton";
import cardTextSkeleton from "./cardTextSkeleton";

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
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
        <Skeleton wrapper={cardTextSkeleton} />
        {cols === "5" && <Skeleton wrapper={cardTextSkeleton} />}
      </div>
    ));
};

export default SkeletonCard;
