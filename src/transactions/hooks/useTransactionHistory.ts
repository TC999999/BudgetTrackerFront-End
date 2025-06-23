import { useEffect, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import TransactionAPI from "../../apis/TransactionAPI";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { Transaction } from "../../interfaces/transactionInterfaces";
import { setLoadError, setPageLoading } from "../../features/slices/loadSlice";

type input = {
  id: string | undefined;
  transactionList?: Transaction[];
};

// custom hook for transaction history page: retrieves the current user's transactions on initial render
const useTransactionHistory = ({ id, transactionList }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // makes a request to retrieve all of a single user's transactions from db on initial
  // render
  useEffect((): void => {
    async function getUserTransactions() {
      try {
        dispatch(setPageLoading(true));
        if (id) {
          let transactions: Transaction[] =
            await TransactionAPI.getUserTransactions(id);
          setTransactions(transactions);
        } else if (transactionList) {
          setTransactions(transactionList);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
      }
    }
    getUserTransactions();
  }, [id]);

  return { transactions };
};

export default useTransactionHistory;
