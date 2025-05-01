import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { setLoadError, setPageLoading } from "../../features/slices/loadSlice";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { Income } from "../../interfaces/incomeInterfaces";
import IncomeAPI from "../../apis/IncomeAPI";
import { toast, Id } from "react-toastify";

type input = string | undefined;

// custom hook for income page: includes retrieval of incomes, showing the form for a new income, adding new incomes
// to the list, updating incomes in the list, and filtering out deleted incomes from the list
const useIncomePage = (id: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum number of incomes");

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
  const showIncomeFormState = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (incomes.length < 3) {
        setShowIncomeForm(true);
      } else {
        notify();
      }
    },
    [showIncomeForm]
  );

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

  return {
    showIncomeForm,
    incomes,
    addToIncomeState,
    updateIncomeState,
    removeFromIncomeState,
    showIncomeFormState,
    hideIncomeFormState,
  };
};

export default useIncomePage;
