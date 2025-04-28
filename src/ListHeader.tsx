import { useAppSelector } from "./features/hooks";
import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import { loading } from "./interfaces/loadingInterfaces";
import Skeleton from "react-loading-skeleton";

type Props = {
  type: "Incomes" | "Transactions" | "Budgets";
  itemListLength: number;
};

// header for full page list components (incomes, transactions, budgets)
const ListHeader: React.FC<Props> = ({ type, itemListLength }) => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // returns the title for the list depending on the type in props
  const constructTitle: string = useMemo(() => {
    const makeTitle = (): string => {
      switch (type) {
        case "Incomes":
          return "All Current Incomes";
        case "Budgets":
          return "All Current Budgets";
        case "Transactions":
          return "Full Transaction History";
      }
    };
    return makeTitle();
  }, [type]);

  // returns the number of items in the list depending on the type in props
  const maxListLength: string = useMemo(() => {
    const getMaxLength = (): string => {
      switch (type) {
        case "Incomes":
          return `(${itemListLength}/3)`;
        case "Budgets":
          return `(${itemListLength}/10)`;
        case "Transactions":
          return "";
      }
    };
    return getMaxLength();
  }, [type, itemListLength]);

  // returns a description of the list depending on the type in props
  const getMessage: string = useMemo(() => {
    const returnMessage = (): string => {
      switch (type) {
        case "Incomes":
          return "Here you may add, update, or delete any sources of income you may have. Each of below income values will be added to your total savings automatically on the time noted on 'Next Received On'. You are allowed a maximum of three incomes";
        case "Budgets":
          return "Here you may set aside funds in order to make plans for future budgets or record current budgets you may have. You are allowed a maximum of ten budgets.";
        case "Transactions":
          return "Here are all transactions made from funds directly from your savings. They cannot be edited or deleted. They may include incomes that you do not recieve anymore";
      }
    };
    return returnMessage();
  }, [type]);

  return (
    <header className="text-center">
      <div className="text-2xl sm:text-3xl text-emerald-500 font-bold">
        <h1 className="underline">{constructTitle}</h1>
        {type !== "Transactions" && (
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
