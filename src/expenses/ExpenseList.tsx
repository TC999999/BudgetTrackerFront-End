import { useCallback } from "react";
import ExpenseCard from "./ExpenseCard";
import {
  ExpenseInterface,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { useAppDispatch } from "../features/hooks";
import { removeExpense } from "../features/actions/expenses";

type Props = {
  expensesList: ExpenseInterface[];
  isFrontPage: boolean;
  budgetID: string | null;
};

type infoInterface = {
  transaction: number;
  _id: string;
};

const ExpenseList: React.FC<Props> = ({
  expensesList,
  isFrontPage,
  budgetID,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const deleteExpense = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        e.preventDefault();
        let submitData: deleteExpenseInterface = {
          ...info,
          transaction: info.transaction,
          budgetID,
        };
        await dispatch(removeExpense(submitData)).unwrap();
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch]
  );

  return (
    <div className="expense-list bg-white border-2 border-green-500 m-2 rounded-md">
      <header className="expense-list-headers grid grid-cols-4 bg-green-200 border-b-2 border-green-500 px-4 py-2">
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Name
        </b>
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Money Spent
        </b>
        {isFrontPage && (
          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Budget Title
          </b>
        )}

        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Date
        </b>
        {!isFrontPage && (
          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Delete
          </b>
        )}
      </header>
      <div className="expense-card-list striped">
        {expensesList.map((e) => {
          return (
            <ExpenseCard
              key={e._id}
              expense={e}
              isFrontPage={isFrontPage}
              deleteExpense={deleteExpense}
            />
          );
        })}
        {!expensesList.length && (
          <div className="no-expenses text-center text-xl p-6">
            <p className="italic">No Expenses Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
