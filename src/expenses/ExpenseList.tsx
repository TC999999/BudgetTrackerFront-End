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
}) => {
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
    <div className="expense-list">
      <div className="bg-white border-2 border-green-500 m-2 rounded-md">
        <div className="expense-list-headers grid grid-cols-4 bg-green-200 border-b-2 border-green-500 px-4 py-2">
          <div className="text-sm sm:text-base duration-150 text-center content-center">
            Title
          </div>
          <div className="text-sm sm:text-base duration-150 text-center content-center">
            Transaction
          </div>
          {isFrontPage && (
            <div className="text-sm sm:text-base duration-150 text-center content-center">
              Budget
            </div>
          )}

          <div className="text-sm sm:text-base duration-150 text-center content-center">
            Date
          </div>
          {!isFrontPage && (
            <div className="text-sm sm:text-base duration-150 text-center content-center">
              Delete
            </div>
          )}
        </div>
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
    </div>
  );
};

export default ExpenseList;
