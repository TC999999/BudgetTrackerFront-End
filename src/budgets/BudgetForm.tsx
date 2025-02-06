import { useState, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { newBudgetInterface } from "../interfaces/budgetInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { addNewBudget } from "../features/actions/budgets";
import SmallLoadingMsg from "../SmallLoadingMsg";

interface Props {
  hideForm: any;
}

const BudgetForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: newBudgetInterface = {
    title: "",
    moneyAllocated: 0,
  };
  const [formData, setFormData] = useState<newBudgetInterface>(initialState);
  const [availableFunds, setAvailableFunds] = useState<number>(
    (userStatus.user.totalAssets || 1) * 100
  );
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.moneyAllocated, num);
      let currency: string = (newNum / 100).toFixed(2);
      if (parseFloat(currency) < (userStatus.user?.totalAssets ?? 1)) {
        setFormData((data) => ({ ...data, moneyAllocated: newNum }));
        setAvailableFunds((userStatus.user.totalAssets || 1) * 100 - newNum);
      } else {
        setKeyPadError(true);
      }
    },
    [formData, keyPadError]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum: number = numPop(formData.moneyAllocated);
      setFormData((data) => ({
        ...data,
        moneyAllocated: newNum,
      }));
      setAvailableFunds((userStatus.user.totalAssets || 1) * 100 - newNum);
      if (keyPadError) {
        setKeyPadError(false);
      }
    },
    [formData, keyPadError]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let submitData: newBudgetInterface = {
        ...formData,
        moneyAllocated: formData.moneyAllocated / 100,
      };
      await dispatch(addNewBudget(submitData)).unwrap();
      props.hideForm();
    } catch (err: any) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div
      tabIndex={-1}
      className="budget-form-div bg-gray-500 bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full p-4 max-w-md max-h-full">
        {isLoading ? (
          <SmallLoadingMsg />
        ) : (
          <div className="new-budget-form relative bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 px-2 py-2 w-full">
            <h1 className="text-xl text-center mx-2 my-2">
              Add a New Budget Form
            </h1>
            <h2 className="text-xl text-center mx-2 my-2">
              Available Funds: ${(availableFunds / 100).toFixed(2)}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="title-div text-center">
                <label className="text-gray-700 block" htmlFor="title">
                  Budget Title:
                </label>
                <input
                  className="text-gray-900 text-lg text-center mb-2 w-96"
                  id="budget_title"
                  type="text"
                  name="title"
                  placeholder="What's this budget for?"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="allocated-funds-div text-center">
                <label className="text-gray-700 block" htmlFor="moneyAllocated">
                  Money Allocated ($ U.S.):
                </label>
                <input
                  className="text-gray-900 text-lg text-center mb-2 w-96"
                  id="budget_allocation"
                  type="text"
                  name="moneyAllocated"
                  placeholder="0.00"
                  value={`$${(formData.moneyAllocated / 100).toFixed(2)}`}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="keyPad-div">
                <KeyPad
                  handlePress={handlePress}
                  handleDelete={handleDelete}
                  num={formData.moneyAllocated}
                />
              </div>
              {keyPadError && (
                <div className="error-message text-center">
                  {keyPadError && (
                    <p className="text-red-500">
                      Budget funds cannot exceed remaining total asset value!
                    </p>
                  )}
                </div>
              )}
              <div className="button-div flex justify-between m-2">
                <button className="add-budget-button  bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                  Add this Budget
                </button>
                <button
                  className="bg-gray-600 text-gray-100 border-2 border-gray-900 rounded-full px-2 py-2 hover:bg-gray-200 hover:text-gray-600"
                  onClick={props.hideForm}
                >
                  Cancel
                </button>
              </div>
              <div className="error-message">
                {userStatus.error && <p>{userStatus.error}</p>}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetForm;
