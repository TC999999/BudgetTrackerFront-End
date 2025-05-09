import { useState, useRef, useCallback, useEffect } from "react";
import { registerUser } from "../../features/actions/auth";
import { SignUpInterface } from "../../interfaces/authInterfaces";
import { SubmitIncomeSignUp } from "../../interfaces/incomeInterfaces";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { toast, Id } from "react-toastify";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { shallowEqual } from "react-redux";

type input = {
  initialState: SignUpInterface;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (
    newSubmitError: string,
    e?: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

const useSignUpAdditional = ({
  initialState,
  changeLoading,
  changeSubmitError,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const { error }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const [formData, setFormData] = useState<SignUpInterface>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  // state to show form to add initial incomes
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);

  const notifyIncome = (): Id =>
    toast.error("You have reached the maximum number of allowed incomes!");

  useEffect(() => {
    if (error) changeSubmitError(error);
  }, [error]);

  // max value for total assets
  const maxNum = useRef<number>(999999999999.99);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData]
  );

  // make for state visible unless income list already has 3 incomes
  const showIncomeFormState = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formData.incomes.length < 3) {
        setShowIncomeForm(true);
      } else {
        notifyIncome();
      }
    },
    [formData.incomes, showIncomeForm]
  );

  // update state to make income form invisible
  const changeIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(!showIncomeForm);
    },
    [showIncomeForm]
  );

  // add new income from form to list of incomes in sign up form data
  const handleIncomes = useCallback(
    (e: React.FormEvent, income: SubmitIncomeSignUp): void => {
      e.preventDefault();
      setFormData((data) => ({
        ...data,
        incomes: [...formData.incomes, income],
      }));
    },
    [formData.incomes]
  );

  // remove income from form from list of incomes in sign up form data
  const removeIncome = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      index: number
    ): void => {
      e.preventDefault();
      let newIncomes = formData.incomes.filter((v, i) => {
        if (i !== index) return v;
      });
      setFormData((data) => ({
        ...data,
        incomes: newIncomes,
      }));
    },
    [formData.incomes]
  );

  // updates form data state when the user checks or unchecks the checkbox that this is a trusted device
  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name } = e.target;
      setFormData((data) => ({ ...data, [name]: e.target.checked }));
    },
    [formData]
  );

  // when user clicks key on in-app keypad, pushes number clicked onto the formData's totalAssets field and
  // creates a new string, unless the new currency is greater than the allowed max asset value
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.totalAssets, num);
      if (newNum > maxNum.current) {
        setKeyPadError(true);
      } else {
        setFormData((data) => ({ ...data, totalAssets: newNum }));
      }
    },
    [formData, maxNum.current]
  );

  // removes the rightmost number from the formData's totalAssets string and creates a new string
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.totalAssets);
      setFormData((data) => ({
        ...data,
        totalAssets: newNum,
      }));
      if (keyPadError) {
        setKeyPadError(false);
      }
    },
    [formData.totalAssets, keyPadError]
  );

  // sends new user info to db and creates a new account for user; automatially logs them in as well. If there
  // are any errors in inputs, does not submit data and flashes errorful inputs. If backend error occurs,
  // returns to this page (e.g. username or email already exist).
  // Additionally, temporarily saves info into localstorage since submitting data causes the page to rerender,
  // so this is used to prevent the information (except password) from being cleared.
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      changeLoading(true);

      try {
        const signUpInfo: SignUpInterface = {
          ...formData,
        };
        await dispatch(registerUser(signUpInfo)).unwrap();
        navigate("/");
      } catch (err: any) {
      } finally {
        changeLoading(false);
      }
    },
    [formData]
  );

  return {
    formData,
    keyPadError,
    showIncomeForm,
    showIncomeFormState,
    changeIncomeFormState,
    handleChange,
    handleIncomes,
    removeIncome,
    handleCheckBox,
    handlePress,
    handleDelete,
    handleSubmit,
  };
};

export default useSignUpAdditional;
