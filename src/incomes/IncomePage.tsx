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
    <div className="income-page">
      <header>
        <nav className="buttons sticky top-0 bg-emerald-900 flex justify-around p-2 w-full">
          <button
            className="border-2 border-gray-500 p-1 sm:p-2 text-sm sm:text-base rounded-full text-white bg-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-100 duration-150"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="border-2 border-green-500 p-1 sm:p-2 text-sm sm:text-base rounded-full bg-green-400 hover:bg-green-700 hover:text-white active:bg-green-500 duration-150"
            onClick={(e) => changeIncomeFormState(e)}
          >
            Add New Income
          </button>
        </nav>
      </header>
      <main>
        {showIncomeForm && (
          <NewIncomeForm changeIncomeFormState={changeIncomeFormState} />
        )}
        <header>
          <h1 className="text-center text-xl sm:text-3xl text-green-700 underline font-bold">
            Your Current Incomes
          </h1>
        </header>

        <IncomeList incomeList={userStatus.user!.incomes} />
      </main>
    </div>
  );
};

export default IncomePage;
