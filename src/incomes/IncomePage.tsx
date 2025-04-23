import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { setLoadError, setPageLoading } from "../features/slices/loadSlice";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { Income } from "../interfaces/incomeInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import IncomeAPI from "../apis/IncomeAPI";
import IncomeList from "./IncomeList";
import NewIncomeForm from "./NewIncomeForm";
import Skeleton from "react-loading-skeleton";
import { toast, Id } from "react-toastify";

// Shows the list of incomes the current user has
const IncomePage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum number of incomes");

  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // state that shows the form to add a new income
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [incomes, setIncomes] = useState<Income[]>([]);

  // makes a request to retrive all of a single user's incomes and save them in component
  // state on initial render
  useEffect((): void => {
    const getIncomes = async () => {
      try {
        dispatch(setPageLoading(true));
        if (id) {
          let newIncomes: Income[] = await IncomeAPI.getAllUserIncomes(id);
          setIncomes(newIncomes);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
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

  return (
    <div id="income-page">
      <header id="additional-nav-header">
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
        <header className="text-center">
          <div className="text-xl sm:text-3xl text-green-700 font-bold">
            <h1 className="underline">Your Current Incomes</h1>
            <h2>
              {pageLoading ? <Skeleton width={60} /> : `${incomes.length}/3`}
            </h2>
          </div>
          <small>
            Here you may add, update, or delete any sources of income you may
            have. Each of below income values will be added to your total
            savings automatically on the time noted on "Next Received On". You
            are allowed a maximum of three incomes.
          </small>
        </header>
        <IncomeList
          incomeList={incomes}
          removeFromIncomeState={removeFromIncomeState}
          updateIncomeState={updateIncomeState}
        />
      </main>
    </div>
  );
};

export default IncomePage;
