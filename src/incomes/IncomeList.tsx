import { useState, useCallback } from "react";
import { Income, deleteIncomeType } from "../interfaces/incomeInterfaces";
import { infoInterface } from "../interfaces/miscTypes";
import { error } from "../interfaces/miscTypes";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../features/slices/loadSlice";
import IncomeCard from "./IncomeCard";
import IncomeSkeleton from "../skeleton/IncomeSkeleton";
import UpdateIncomeForm from "./UpdateIncomeForm";
import OnPageLoading from "../OnPageLoading";
import SecondPrompt from "../SecondPrompt";
import IncomeAPI from "../apis/IncomeAPI";
import { toast, Id } from "react-toastify";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { loading } from "../interfaces/loadingInterfaces";

type Props = {
  incomeList: Income[];
  removeFromIncomeState: (id: string) => void;
  updateIncomeState: (income: Income) => void;
};

// returns a list on income cards that can be viewed, edited, or deleted
const IncomeList: React.FC<Props> = ({
  incomeList,
  removeFromIncomeState,
  updateIncomeState,
}): JSX.Element => {
  const dispatch: AppDispatch = useAppDispatch();

  const notify = (message: string): Id =>
    toast.success(`Income ${message} deleted successfully`);

  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // to use for editing a single income, retrieve info to be used for income edit
  const [selectedIncomeForEdit, setSelectedIncomeForEdit] =
    useState<Income | null>(null);

  // to use for deleting a single income, retrieve info to be used for income deletion
  const [selectedIncomeForDelete, setSelectedIncomeForDelete] =
    useState<infoInterface | null>(null);

  // changes state for selected income for edit
  const selectIncome = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      income: Income | null
    ): void => {
      e.preventDefault();
      setSelectedIncomeForEdit(income);
    },
    [selectedIncomeForEdit]
  );

  // updates state to show the prompt window for when a user clicks delete
  // income button on an income card
  const showSecondPrompt = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      income: infoInterface
    ): void => {
      e.preventDefault();
      setSelectedIncomeForDelete(income);
    },
    [selectedIncomeForDelete]
  );

  // updates state to hide the prompt window for when a user either clicks cancel on the prompt window or
  // after the user successfully submits a delete request
  const hidePrompt = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setSelectedIncomeForDelete(null);
    },
    []
  );

  // sends a request to backend to delete a single income from the db and filter it out of
  // income page list state
  const deleteIncome = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        dispatch(setFormLoading(true));
        e.preventDefault();
        let submitData: deleteIncomeType = { id: info._id };
        if (user?._id) {
          let delIncome = await IncomeAPI.deleteUserIncome(
            submitData,
            user._id
          );
          removeFromIncomeState(info._id);
          setSelectedIncomeForDelete(null);
          notify(delIncome.title);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    []
  );

  return !pageLoading ? (
    <div id="income-list-and-edit-form">
      {selectedIncomeForDelete && (
        <SecondPrompt
          deleteFunction={deleteIncome}
          hidePrompt={hidePrompt}
          itemForDeletion={selectedIncomeForDelete}
          type={"Income"}
        />
      )}

      {selectedIncomeForEdit && (
        <UpdateIncomeForm
          income={selectedIncomeForEdit}
          selectIncome={selectIncome}
          updateIncomeState={updateIncomeState}
        />
      )}

      <div>
        {!pageLoading && incomeList.length > 0 && (
          <ul id="income-list">
            {incomeList.map((i) => (
              <li key={`income-${i._id}`}>
                <IncomeCard
                  income={i}
                  showSecondPrompt={showSecondPrompt}
                  selectIncome={selectIncome}
                />
              </li>
            ))}
          </ul>
        )}

        {pageLoading && <IncomeSkeleton cards={3} />}

        {!pageLoading && !incomeList.length && (
          <p className="text-3xl m-4 text-center italic">
            You currently have no incomes
          </p>
        )}
      </div>
    </div>
  ) : (
    <OnPageLoading loadingMsg="Incomes" />
  );
};

export default IncomeList;
