import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import { loading } from "./interfaces/loadingInterfaces";
import Skeleton from "react-loading-skeleton";
import { ListHeaderType } from "./interfaces/miscTypes";
import useListHeader from "./hooks/useListHeader";

// header for full page list components (incomes, transactions, budgets, expenses)
const ListHeader: React.FC<ListHeaderType> = ({ type, itemListLength }) => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const { constructTitle, maxListLength, getMessage } = useListHeader({
    type,
    itemListLength,
  });

  return (
    <header className="text-center">
      <div className="text-2xl sm:text-3xl text-emerald-500 font-bold">
        <h1 className="underline">{constructTitle}</h1>
        {(type === "Incomes" || type === "Budgets") && (
          <h2>
            {pageLoading ? <Skeleton width={60} /> : <p>{maxListLength}</p>}
          </h2>
        )}
      </div>
      <small className="text-xs sm:text-sm">{getMessage}</small>
    </header>
  );
};

export default ListHeader;
