import { SignUpInterface } from "../interfaces/authInterfaces";
import NewIncomeForm from "../incomes/NewIncomeForm";
import SignUpAdditionalForm from "./SignUpAdditionalForm";
import useSignUpAdditional from "./hooks/useSignUpAdditional";

type Props = {
  initialState: SignUpInterface;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (newSubmitError: string) => void;
};

const SignUpAdditional: React.FC<Props> = ({
  initialState,
  changeLoading,
  changeSubmitError,
}) => {
  const {
    formData,
    keyPadError,
    showIncomeForm,
    showIncomeFormState,
    changeIncomeFormState,
    handleChange,
    handlePress,
    handleDelete,
    handleIncomes,
    removeIncome,
    handleCheckBox,
    handleSubmit,
  } = useSignUpAdditional({ initialState, changeLoading, changeSubmitError });
  return (
    <div>
      {showIncomeForm && (
        <NewIncomeForm
          hideIncomeFormState={changeIncomeFormState}
          handleIncomes={handleIncomes}
        />
      )}

      <SignUpAdditionalForm
        formData={formData}
        keyPadError={keyPadError}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handlePress={handlePress}
        handleDelete={handleDelete}
        showIncomeFormState={showIncomeFormState}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
      />
    </div>
  );
};

export default SignUpAdditional;
