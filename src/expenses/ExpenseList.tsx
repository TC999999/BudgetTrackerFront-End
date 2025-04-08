import { useCallback } from "react";
import ExpenseCard from "./ExpenseCard";
import {
  ExpenseInterface,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { BudgetUpdate } from "../interfaces/budgetInterfaces";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { setSmallLoading } from "../features/auth/authSlice";
import ExpenseAPI from "../apis/ExpenseAPI";

// isFrontPage prop tells frontend if user is on dashboard or single budget page; passes down to expense card.
type Props = {
  expensesList: ExpenseInterface[];
  isFrontPage: boolean;
  budgetID: string | null;
  filterExpense?: (id: string) => void;
  updateBudget?: (updatedBudget: BudgetUpdate) => void;
};

type infoInterface = {
  transaction: number;
  _id: string;
};

// returns expense list to be used for budget expenses on a single budget page and a user's most recent
// expenses on the dashboard
const ExpenseList: React.FC<Props> = ({
  expensesList,
  isFrontPage,
  budgetID,
  filterExpense,
  updateBudget,
}): JSX.Element => {
  const userStatus = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();

  const callFilterExpense = (id: string) => {
    if (filterExpense) {
      filterExpense(id);
    }
  };

  const callUpdateBudget = (updatedBudget: BudgetUpdate) => {
    if (updateBudget) {
      updateBudget(updatedBudget);
    }
  };

  // deletes expense from db and filters from budget page
  const deleteExpense = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        e.preventDefault();
        dispatch(setSmallLoading(true));
        let submitData: deleteExpenseInterface = {
          ...info,
          transaction: info.transaction,
          budgetID,
        };
        let { delExpense, newUserBudget } = await ExpenseAPI.deleteExpense(
          submitData,
          userStatus.user!._id
        );
        callFilterExpense(delExpense._id);
        callUpdateBudget(newUserBudget);
        dispatch(setSmallLoading(false));
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  return (
    <div className="expense-list bg-white border-2 border-green-500 m-2 rounded-md">
      <header className="expense-list-headers grid grid-cols-4 bg-green-200 border-b-2 border-green-500 px-4 py-2">
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Name
        </b>

        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Cost
        </b>

        {isFrontPage && (
          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Budget
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
