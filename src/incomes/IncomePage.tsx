import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import { Income } from "../interfaces/incomeInterfaces";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";
import IncomeAPI from "../apis/IncomeAPI";
import IncomeList from "./IncomeList";
import OnPageLoading from "../OnPageLoading";
import NewIncomeForm from "./NewIncomeForm";
import { toast } from "react-toastify";

// Shows the list of incomes the current user has
const IncomePage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const notify = () =>
    toast.error("You have reached the maximum number of incomes");

  // state that shows the form to add a new income
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [incomes, setIncomes] = useState<Income[]>([]);

  // makes a request to retrive all of a single user's incomes and save them in component
  // state on initial render
  useEffect(() => {
    const getIncomes = async () => {
      try {
        dispatch(setSmallLoading(true));
        if (id) {
          let newIncomes: Income[] = await IncomeAPI.getAllUserIncomes(id);
          setIncomes(newIncomes);
        }
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    };
    getIncomes();
  }, [id]);

  // adds a single income to state after a form submission
  const addToIncomeState = useCallback(
    (income: Income): void => {
      setIncomes((incomes) => [...incomes, income]);
    },
    [incomes]
  );

  // updates a single income in state after a form submission
  const updateIncomeState = useCallback(
    (income: Income): void => {
      setIncomes((incomes) =>
        incomes.map((i) => {
          return i._id === income._id ? income : i;
        })
      );
    },
    [incomes]
  );

  // removes a single income from state after a button press
  const removeFromIncomeState = useCallback(
    (id: string): void => {
      setIncomes((incomes) =>
        incomes.filter((i) => {
          return i._id !== id;
        })
      );
    },
    [incomes]
  );

  // updates state to show new income form unless the user already has 3 incomes
  const showIncomeFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (incomes.length < 3) {
      setShowIncomeForm(true);
    } else {
      notify();
    }
  };

  // updates state to hide new income form
  const hideIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(false);
    },
    [showIncomeForm]
  );

  return incomes.length ? (
    <div id="income-page">
      <header className="additional-nav-header">
        <nav className="buttons flex justify-around w-full">
          <button
            className={`nav-button border-green-500 bg-green-400 ${
              incomes.length < 3
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
          <NewIncomeForm
            hideIncomeFormState={hideIncomeFormState}
            addToIncomeState={addToIncomeState}
          />
        )}
        <header>
          <h1 className="text-center text-xl sm:text-3xl text-green-700 underline font-bold">
            Your Current Incomes ({incomes.length}/3)
          </h1>
        </header>
        <IncomeList
          incomeList={incomes}
          removeFromIncomeState={removeFromIncomeState}
          updateIncomeState={updateIncomeState}
        />
      </main>
    </div>
  ) : (
    <OnPageLoading loadingMsg="Incomes" />
  );
};

export default IncomePage;
