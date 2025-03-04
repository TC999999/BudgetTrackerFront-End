import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import IncomeList from "./IncomeList";
import NewIncomeForm from "./NewIncomeForm";

const IncomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);

  const changeIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(!showIncomeForm);
    },
    [showIncomeForm]
  );

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <button onClick={(e) => changeIncomeFormState(e)}>Add New Income</button>
      <h1 className="text-center text-3xl text-green-700 underline font-bold">
        Your Current Incomes
      </h1>
      {showIncomeForm && (
        <NewIncomeForm changeIncomeFormState={changeIncomeFormState} />
      )}
      <IncomeList incomeList={userStatus.user!.incomes} />
    </div>
  );
};

export default IncomePage;
