import { useCallback } from "react";
import ExpenseCard from "./ExpenseCard";
import {
  ExpenseInterface,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { useAppDispatch } from "../features/hooks";
import { removeExpense } from "../features/actions/expenses";

interface Props {
  expensesList: ExpenseInterface[];
  isFrontPage: boolean;
  budgetID: string | null;
}

interface infoInterface {
  transaction: string;
  _id: string;
}

const ExpenseList: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const deleteExpense = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ) => {
      e.preventDefault();
      let submitData: deleteExpenseInterface = {
        ...info,
        transaction: +info.transaction,
        budgetID: props.budgetID,
      };
      await dispatch(removeExpense(submitData)).unwrap();
    },
    [dispatch]
  );

  return (
    <div className="expense-list">
      {props.expensesList.map((e) => {
        return (
          <ExpenseCard
            key={e._id}
            expense={e}
            isFrontPage={props.isFrontPage}
            deleteExpense={deleteExpense}
          />
        );
      })}
    </div>
  );
};

export default ExpenseList;
