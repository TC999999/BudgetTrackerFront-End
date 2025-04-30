import NewIncomeForm from "../incomes/NewIncomeForm";
import SignUpForm from "./SignUpForm";
import useSignUp from "./hooks/useSignUp";

// returns window allowing users to create a new account
const SignUp = (): JSX.Element => {
  const {
    formData,
    keyPadError,
    formErrors,
    submitError,
    submitErrorFlash,
    flashErrors,
    showIncomeForm,
    handleChange,
    showIncomeFormState,
    changeIncomeFormState,
    handleIncomes,
    removeIncome,
    handleCheckBox,
    handleSubmit,
    handlePress,
    handleDelete,
  } = useSignUp();

  return (
    <main
      id="register-page"
      className="bg-[url('/signUp.jpg')] bg-cover bg-center bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex flex-start w-full md:inset-0 h-full max-h-full"
    >
      {showIncomeForm && (
        <NewIncomeForm
          hideIncomeFormState={changeIncomeFormState}
          handleIncomes={handleIncomes}
        />
      )}

      <SignUpForm
        formData={formData}
        signUpErrors={formErrors}
        keyPadError={keyPadError}
        flashErrors={flashErrors}
        submitError={submitError}
        submitErrorFlash={submitErrorFlash}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handlePress={handlePress}
        handleDelete={handleDelete}
        showIncomeFormState={showIncomeFormState}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
      />
    </main>
  );
};

export default SignUp;
