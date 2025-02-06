import { useState, useRef, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { newExpenseInterface } from "../interfaces/expenseInterfaces";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { addNewExpense } from "../features/actions/expenses";
import SmallLoadingMsg from "../SmallLoadingMsg";

interface Props {
  hideForm: any;
  budget: BudgetInterface | null;
}

const ExpenseForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const initialState: newExpenseInterface = {
    title: "",
    transaction: 0,
  };
  const initialMoney: string = getRemainingMoney(
    props.budget?.moneyAllocated || "",
    props.budget?.moneySpent || 0
  );
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const originalMoney = useRef<string>(initialMoney);
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[] | any>([]);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formErrors.length) {
        setFormErrors([]);
      }
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.transaction, num);
      let original = parseFloat(originalMoney.current) * 100;
      if (newNum <= original) {
        let newAvailableMoney = original - newNum;
        setFormData((data) => ({
          ...data,
          transaction: newNum,
        }));
        setAvailableMoney((newAvailableMoney / 100).toFixed(2));
      } else {
        setKeyPadError(true);
      }
    },
    [formData, keyPadError, formErrors]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formErrors.length) {
        setFormErrors([]);
      }
      let newNum: number = numPop(formData.transaction);
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      if (keyPadError) {
        setKeyPadError(false);
      }
      let newAvailableMoney = parseFloat(originalMoney.current) * 100 - newNum;
      setAvailableMoney((newAvailableMoney / 100).toFixed(2));
    },
    [formData, keyPadError, formErrors]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (formErrors.length) {
      setFormErrors([]);
    }
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let submitData = {
        ...formData,
        budgetID: props.budget?._id,
        transaction: formData.transaction / 100,
      };
      await dispatch(addNewExpense(submitData)).unwrap();
      props.hideForm(e, "showExpenseForm");
    } catch (err) {
      setIsLoading(false);
      setFormErrors(err || []);
    }
  };

  return (
    <div
      tabIndex={-1}
      className="new-expense-form-div bg-gray-500 bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full p-4 max-w-md max-h-full">
        {isLoading ? (
          <SmallLoadingMsg />
        ) : (
          <div className="new-expense-form relative bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 px-2 py-2 w-full">
            <h2 className="text-2xl text-green-700 text-center">
              Add a New Expense!
            </h2>
            <h2 className="text-lg text-center">
              Available Budget Funds: ${availableMoney}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="title-div text-center">
                <label className="text-gray-700 text-lg block" htmlFor="title">
                  Expense Title:
                </label>
                <input
                  className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:outline-none focus:border-green-700"
                  id="expense_title"
                  type="text"
                  name="title"
                  placeholder="What's this expense for?"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="transaction-div">
                <label
                  htmlFor="transaction"
                  className="text-gray-700 text-lg block"
                >
                  Transaction Value ($ U.S.):
                </label>
                <input
                  className="text-gray-900 text-xl text-center mb-2 w-96 focus:outline-none "
                  id="expense_transaction"
                  type="text"
                  name="trasaction"
                  placeholder="0.00"
                  value={`$${(formData.transaction / 100).toFixed(2)}`}
                  readOnly
                />
              </div>
              <div className="keyPad-div">
                <KeyPad
                  handlePress={handlePress}
                  handleDelete={handleDelete}
                  num={formData.transaction}
                />
              </div>
              {keyPadError && (
                <div className="error-message text-center">
                  <p className="text-red-700 font-bold">
                    Expense transaction value cannot exceed available budget
                  </p>
                </div>
              )}
              <div className="button-div flex justify-between m-2">
                <button className="add-expense-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                  Add this Expense
                </button>
                <button
                  className="bg-gray-600 text-gray-100 border-2 border-gray-900 rounded-full px-2 py-2 hover:bg-gray-200 hover:text-gray-600"
                  onClick={(e) => props.hideForm(e, "showExpenseForm")}
                >
                  Cancel
                </button>
              </div>
              {formErrors?.length > 0 && (
                <div className="error-message text-center">
                  {formErrors.map((e: string, i: number) => {
                    return (
                      <p key={i} className="text-red-700 font-bold">
                        {e}
                      </p>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
