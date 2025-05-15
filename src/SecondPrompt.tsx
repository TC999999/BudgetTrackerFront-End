import { useMemo } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import { infoInterface } from "./interfaces/miscTypes";
import { loading } from "./interfaces/loadingInterfaces";
import { budgetFunds } from "./interfaces/budgetInterfaces";
import {
  calcNewMoneyRemaining,
  calcNewMoneySpent,
} from "./helpers/calculateExpenseDelete";
import { dollarConverter } from "./helpers/currencyConverter";
import { FaArrowRight } from "react-icons/fa6";
import useFormAnimation from "./hooks/useFormAnimation";

type Props = {
  deleteFunction: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    info: infoInterface
  ) => Promise<void>;
  hidePrompt: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  itemForDeletion: infoInterface | null;
  BudgetFunds?: budgetFunds;
  type: "Expense" | "Income";
};

// returns a second prompt asking if a user is sure if they want to delete an expense or income
const SecondPrompt: React.FC<Props> = ({
  deleteFunction,
  hidePrompt,
  itemForDeletion,
  type,
  BudgetFunds,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // uses callback function from props to delete either an income or expense from db and state
  const deleteFromState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (itemForDeletion) deleteFunction(e, itemForDeletion);
  };

  const remainingMoney: string | undefined = useMemo(() => {
    if (BudgetFunds && itemForDeletion?.transaction)
      return dollarConverter(
        calcNewMoneyRemaining(
          BudgetFunds.moneyRemaining,
          itemForDeletion.transaction
        )
      );
  }, [BudgetFunds, itemForDeletion]);

  const moneySpent: string | undefined = useMemo(() => {
    if (BudgetFunds && itemForDeletion?.transaction)
      return dollarConverter(
        calcNewMoneySpent(BudgetFunds.moneySpent, itemForDeletion.transaction)
      );
  }, [BudgetFunds, itemForDeletion]);

  const { animationClass, changeAnimationClass } = useFormAnimation(hidePrompt);

  return !formLoading ? (
    <div className="modal-layer-1">
      <div className={`modal-layer-2 ${animationClass}`}>
        <div className="modal-layer-3 text-center">
          <header>
            <h1 className="text-3xl text-green-700">
              Are You Sure You Want To Delete This {type}?
            </h1>
          </header>
          <section>
            <p>
              <span className="font-bold text-red-600">WARNING:</span> Once you
              delete this {type.toLowerCase()}, you will not be able to get it
              back again.
            </p>
            {itemForDeletion?.transaction && (
              <p>
                The money spent on this expense (
                <span className="text-green-600 font-bold">
                  {dollarConverter(itemForDeletion.transaction)}
                </span>
                ) will be returned to the allocated funds for this budget.
              </p>
            )}
            {BudgetFunds && itemForDeletion?.transaction && (
              <div className="flex justify-center">
                <table className="table-fixed border border-green-500">
                  <thead className="bg-green-500">
                    <tr className="rounded-full">
                      <th></th>
                      <th className="p-2">Before Delete</th>
                      <th></th>
                      <th className="p-2">After Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-green-500">
                      <td className="font-bold border-r border-green-500 p-2">
                        Funds Remaining
                      </td>
                      <td className="text-xl text-green-700">
                        {dollarConverter(BudgetFunds.moneyRemaining)}
                      </td>
                      <td>
                        <FaArrowRight />
                      </td>
                      <td className="text-xl text-green-700">
                        {remainingMoney}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold border-r border-green-500 p-2">
                        Funds Spent
                      </td>
                      <td className="text-xl text-green-700">
                        {dollarConverter(BudgetFunds.moneySpent)}
                      </td>
                      <td>
                        <FaArrowRight />
                      </td>
                      <td className="text-xl text-green-700">{moneySpent}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <div id="buttons" className="flex justify-between m-2">
            <button
              id="cancel-button"
              className="p-2 border border-gray-600 bg-gray-500 text-white rounded-full hover:bg-gray-200 hover:text-black active:bg-gray-300"
              onClick={(e) => changeAnimationClass(e)}
            >
              Cancel
            </button>
            <button
              id="submit-button"
              className="p-2 border border-red-600 bg-red-500 text-white rounded-full hover:bg-red-200
              hover:text-black active:bg-red-300"
              onClick={(e) => deleteFromState(e)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default SecondPrompt;
