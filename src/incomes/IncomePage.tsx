import { useState, useCallback } from "react";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import IncomeList from "./IncomeList";
import NewIncomeForm from "./NewIncomeForm";
import { toast } from "react-toastify";

// Shows the list of incomes the current user has
const IncomePage = (): JSX.Element => {
  const notify = () =>
    toast.error("You have reached the maximum number of incomes");
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  // state that shows the form to add a new income
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);

  // Shows income form unless the user already has 3 incomes
  const showIncomeFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (userStatus.user!.incomes.length < 3) {
      setShowIncomeForm(true);
    } else {
      notify();
    }
  };

  // Hides income form
  const hideIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(false);
    },
    [showIncomeForm]
  );

  return (
    <div id="income-page">
      <header className="additional-nav-header">
        <nav className="buttons flex justify-around w-full">
          <button
            className={`nav-button border-green-500 bg-green-400 ${
              userStatus.user!.incomes.length < 3
                ? "hover:bg-green-700 hover:text-white active:bg-green-500 duration-150"
                : "cursor-not-allowed"
            }`}
            onClick={(e) => showIncomeFormState(e)}
          >
            Add New Income
          </button>
        </nav>
      </header>
      <main>
        {showIncomeForm && (
          <NewIncomeForm hideIncomeFormState={hideIncomeFormState} />
        )}
        <header>
          <h1 className="text-center text-xl sm:text-3xl text-green-700 underline font-bold">
            Your Current Incomes ({userStatus.user!.incomes.length}/3)
          </h1>
        </header>
        <IncomeList incomeList={userStatus.user!.incomes} />
      </main>
    </div>
  );
};

export default IncomePage;
