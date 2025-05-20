import { Income } from "../interfaces/incomeInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import IncomeCard from "./IncomeCard";
import IncomeSkeleton from "../skeleton/IncomeSkeleton";
import UpdateIncomeForm from "./UpdateIncomeForm";
import OnPageLoading from "../OnPageLoading";
import SecondPrompt from "../SecondPrompt";
import useIncomeList from "./hooks/useIncomeList";
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
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    showEditForm,
    selectedIncomeForEdit,
    selectedIncomeForDelete,
    selectIncome,
    unselectIncome,
    showSecondPrompt,
    hidePrompt,
    deleteIncome,
  } = useIncomeList({ removeFromIncomeState });

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
          unselectIncome={unselectIncome}
          updateIncomeState={updateIncomeState}
          show={showEditForm}
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
