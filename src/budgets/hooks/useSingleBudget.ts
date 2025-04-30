import { useState, useEffect } from "react";
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

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

type input = {
  budgetID?: string;
  id?: string;
  initialFormState: FormStateInterface;
};

const useSingleBudget = ({ budgetID, id, initialFormState }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const notify = (message: string): Id => toast.error(message);
  const [currentBudget, setCurrentBudget] = useState<BudgetInterface>({
    _id: "",
    title: "",
    moneySpent: 0,
    moneyAllocated: "",
  });

  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  const [formsState, setFormsState] =
    useState<FormStateInterface>(initialFormState);

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
  const showFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
  ): void => {
    e.preventDefault();
    if (
      form === "showExpenseForm" &&
      formsState.showExpenseForm === false &&
      currentBudget &&
      +currentBudget.moneyAllocated === +currentBudget.moneySpent
    ) {
      notify("You have used all of the allocated funds for this budget");
    } else {
      setFormsState((formState) => ({
        ...formState,
        [form]: !formsState[form],
      }));
    }
  };

  // callback function to hide forms when cancelling or after submission
  const changeFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
  ): void => {
    e.preventDefault();
    setFormsState((formState) => ({
      ...formState,
      [form]: false,
    }));
  };

  // updates a budget's state with partial update data
  const updateBudget = (updatedBudget: BudgetUpdate): void => {
    setCurrentBudget((prevBudget) => ({ ...prevBudget, ...updatedBudget }));
  };

  // adds a new expense to the budget state after successfully adding it to the db
  const addExpense = (newExpense: ExpenseInterface): void => {
    setExpenses((expenses) => addNewExpense(expenses, [newExpense]));
  };

  // removes an expense from the budget state after successfully removing it
  // from the db
  const filterExpense = (id: string): void => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => {
        return expense._id !== id;
      })
    );
  };

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
