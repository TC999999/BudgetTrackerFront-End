import { useCallback } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { removeIncome } from "../features/actions/incomes";
import { useAppDispatch } from "../features/hooks";
import IncomeCard from "./IncomeCard";

type Props = {
  incomeList: Income[];
};

const IncomeList: React.FC<Props> = ({ incomeList }): JSX.Element => {
  const dispatch = useAppDispatch();
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
    <div className="income-list-div flex flex-wrap justify-center">
      {incomeList.map((i) => (
        <IncomeCard
          key={`income-${i._id}`}
          income={i}
          deleteIncome={deleteIncome}
        />
      ))}
    </div>
  );
};

export default IncomeList;
