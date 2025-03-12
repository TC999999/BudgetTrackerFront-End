import { useState, useCallback } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { removeIncome } from "../features/actions/incomes";
import { useAppDispatch } from "../features/hooks";
import IncomeCard from "./IncomeCard";
import UpdateIncomeForm from "./UpdateIncomeForm";

type Props = {
  incomeList: Income[];
};

const IncomeList: React.FC<Props> = ({ incomeList }): JSX.Element => {
  const dispatch = useAppDispatch();
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
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
