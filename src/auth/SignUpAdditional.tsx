import { SignUpInterface } from "../interfaces/authInterfaces";
import NewIncomeForm from "../incomes/NewIncomeForm";
import SignUpAdditionalForm from "./SignUpAdditionalForm";
import useSignUpAdditional from "./hooks/useSignUpAdditional";
import AuthTabs from "../motionWrappers/AuthTabs";

type Props = {
  initialState: SignUpInterface;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (newSubmitError: string) => void;
  show: boolean;
};

// full page for both form for additional information for user sign up and a new income form for
// initial incomes
const SignUpAdditional: React.FC<Props> = ({
  initialState,
  changeLoading,
  changeSubmitError,
  show,
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
    <AuthTabs show={show}>
      <NewIncomeForm
        hideIncomeFormState={changeIncomeFormState}
        handleIncomes={handleIncomes}
        show={showIncomeForm}
      />

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
    </AuthTabs>
  );
};

export default SignUpAdditional;
