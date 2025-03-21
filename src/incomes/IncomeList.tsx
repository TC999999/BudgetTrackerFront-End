import { useState, useCallback } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { removeIncome } from "../features/actions/incomes";
import { useAppDispatch } from "../features/hooks";
import IncomeCard from "./IncomeCard";
import UpdateIncomeForm from "./UpdateIncomeForm";

type Props = {
  incomeList: Income[];
};

// returns a list on income cards that can be viewed, edited, or deleted
const IncomeList: React.FC<Props> = ({ incomeList }): JSX.Element => {
  const dispatch = useAppDispatch();

  // to use for editing a single income, retrieve info to be used for income edit
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  // changes state for selected income for edit
  const selectIncome = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      income: Income | null
    ): void => {
      e.preventDefault();
      setSelectedIncome(income);
    },
    [selectedIncome]
  );

  // delete a single income
  const deleteIncome = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: string
    ): Promise<void> => {
      try {
        e.preventDefault();
        let submitData: deleteIncomeType = { id };
        await dispatch(removeIncome(submitData)).unwrap();
      } catch (err) {
        console.log("err");
      }
    },
    []
  );

  return (
    <div className="income-list-and-edit-form">
      {selectedIncome && (
        <UpdateIncomeForm income={selectedIncome} selectIncome={selectIncome} />
      )}
      <ul className="income-list flex flex-wrap justify-center">
        {incomeList.map((i) => (
          <li key={`income-${i._id}`}>
            <IncomeCard
              income={i}
              deleteIncome={deleteIncome}
              selectIncome={selectIncome}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;
