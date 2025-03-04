import { useCallback, useState } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { removeIncome } from "../features/actions/incomes";
import { useAppDispatch } from "../features/hooks";
import IncomeCard from "./IncomeCard";
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  incomeList: Income[];
};

const IncomeList: React.FC<Props> = ({ incomeList }): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const deleteIncome = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: string
    ): Promise<void> => {
      setIsLoading(true);
      try {
        e.preventDefault();
        let submitData: deleteIncomeType = { id };
        await dispatch(removeIncome(submitData)).unwrap();
      } catch (err) {
        console.log("err");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  return (
    <div>
      {isLoading && <SmallLoadingMsg />}
      <div className="income-list-div flex flex-wrap justify-center">
        {incomeList.map((i) => (
          <IncomeCard
            key={`income-${i._id}`}
            income={i}
            deleteIncome={deleteIncome}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
