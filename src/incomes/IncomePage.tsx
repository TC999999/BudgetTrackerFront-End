import { useParams } from "react-router-dom";
import ListHeader from "../ListHeader";
import IncomeList from "./IncomeList";
import NewIncomeForm from "./NewIncomeForm";
import IncomePageButtons from "./IncomePageButtons";
import useIncomePage from "./hooks/useIncomePage";
import Page from "../motionWrappers/Page";

// Shows the list of incomes the current user has
const IncomePage = (): JSX.Element => {
  const { id } = useParams();
  const {
    showIncomeForm,
    incomes,
    addToIncomeState,
    updateIncomeState,
    removeFromIncomeState,
    showIncomeFormState,
    hideIncomeFormState,
  } = useIncomePage(id);

  return (
    <div id="income-page">
      <IncomePageButtons
        incomeListLength={incomes.length}
        showIncomeFormState={showIncomeFormState}
      />
      <Page>
        <NewIncomeForm
          hideIncomeFormState={hideIncomeFormState}
          addToIncomeState={addToIncomeState}
          show={showIncomeForm}
        />
        <main>
          <ListHeader type="Incomes" itemListLength={incomes.length} />
          <IncomeList
            incomeList={incomes}
            removeFromIncomeState={removeFromIncomeState}
            updateIncomeState={updateIncomeState}
          />
        </main>
      </Page>
    </div>
  );
};

export default IncomePage;
