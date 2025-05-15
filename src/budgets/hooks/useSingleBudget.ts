import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { addNewExpense } from "../../helpers/addNewExpense";
import {
  BudgetInterface,
  BudgetUpdate,
} from "../../interfaces/budgetInterfaces";
import { ExpenseInterface } from "../../interfaces/expenseInterfaces";
import { setLoadError, setPageLoading } from "../../features/slices/loadSlice";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../../apis/BudgetAPI";
import ExpenseAPI from "../../apis/ExpenseAPI";

type FormState = "showExpenseForm" | "showDeleteForm" | "showEditForm" | null;

type input = {
  budgetID?: string;
  id?: string;
};

// custom hook for page displaying a single budget, includes showing forms, adding new expenses to their
// proper places in the list, and filtering out deleted expenses
const useSingleBudget = ({ budgetID, id }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const notify = (message: string): Id => toast.error(message);
  const [currentBudget, setCurrentBudget] = useState<BudgetInterface>({
    _id: "",
    title: "",
    moneySpent: 0,
    moneyAllocated: 0,
  });

  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  const [formsState, setFormsState] = useState<FormState>(null);

  // retrieves budget from db based on id string in url parameters upon initial render
  useEffect((): void => {
    const getBudget = async () => {
      try {
        dispatch(setPageLoading(true));
        if (budgetID && id) {
          let budget = await BudgetAPI.getUserBudget(budgetID, id);
          let expenses = await ExpenseAPI.getAllBudgetExpenses(budgetID, id);
          setCurrentBudget(budget);
          setExpenses(expenses);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
      }
    };
    getBudget();
  }, []);

  // sets state for which form should be shown. Will not show expense form if total budget funds and money
  // spent with budget funds are equal
  const showFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
    ): void => {
      e.preventDefault();
      if (
        form === "showExpenseForm" &&
        formsState === "showExpenseForm" &&
        currentBudget &&
        +currentBudget.moneyAllocated === +currentBudget.moneySpent
      ) {
        notify("You have used all of the allocated funds for this budget");
      } else {
        setFormsState(form);
      }
    },
    [formsState, currentBudget]
  );

  // callback function to hide forms when cancelling or after submission
  const changeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setFormsState(null);
    },
    [formsState]
  );

  // updates a budget's state with partial update data
  const updateBudget = useCallback(
    (updatedBudget: BudgetUpdate): void => {
      setCurrentBudget((prevBudget) => ({ ...prevBudget, ...updatedBudget }));
    },
    [currentBudget]
  );

  // adds a new expense to the budget state after successfully adding it to the db
  const addExpense = useCallback(
    (newExpense: ExpenseInterface): void => {
      setExpenses((expenses) => addNewExpense(expenses, [newExpense]));
    },
    [expenses]
  );

  // removes an expense from the budget state after successfully removing it
  // from the db
  const filterExpense = useCallback(
    (id: string): void => {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => {
          return expense._id !== id;
        })
      );
    },
    [expenses]
  );

  return {
    currentBudget,
    expenses,
    formsState,
    showFormState,
    changeFormState,
    updateBudget,
    addExpense,
    filterExpense,
  };
};

export default useSingleBudget;
