import { useState, useCallback } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import IncomeCard from "./IncomeCard";
import UpdateIncomeForm from "./UpdateIncomeForm";
import IncomeAPI from "../apis/IncomeAPI";
import { setSmallLoading } from "../features/auth/authSlice";
import { toast } from "react-toastify";

type Props = {
  incomeList: Income[];
  removeFromIncomeState: (id: string) => void;
  updateIncomeState: (income: Income) => void;
};

// returns a list on income cards that can be viewed, edited, or deleted
const IncomeList: React.FC<Props> = ({
  incomeList,
  removeFromIncomeState,
  updateIncomeState,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const notify = () => toast.success(`Income deleted successfully`);
  const notifyError = (message: string) => toast.error(message);

  const { user } = useAppSelector((store) => store.user.userInfo);

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

  // sends a request to backend to delete a single income from the db and filter it out of
  // income page list state
  const deleteIncome = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: string
    ): Promise<void> => {
      try {
        dispatch(setSmallLoading(true));
        e.preventDefault();
        let submitData: deleteIncomeType = { id };
        if (user?._id) {
          await IncomeAPI.deleteUserIncome(submitData, user._id);
          removeFromIncomeState(id);
          notify();
        }
      } catch (err: any) {
        notifyError(err);
      } finally {
        dispatch(setSmallLoading(false));
      }
    },
    []
  );

  return (
    <div className="income-list-and-edit-form">
      {selectedIncome && (
        <UpdateIncomeForm
          income={selectedIncome}
          selectIncome={selectIncome}
          updateIncomeState={updateIncomeState}
        />
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
