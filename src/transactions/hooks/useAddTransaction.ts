import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { error } from "../../interfaces/miscTypes";
import {
  NewTransactionUI,
  Transaction,
  NewTransaction,
  NewTransactionErrors,
  NewTransactionFlashErrors,
} from "../../interfaces/transactionInterfaces";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { addToAssets } from "../../features/actions/users";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import { calculateNewTotalAssetsUserDashboard } from "../../helpers/calculateNewTotalAssets";
import {
  handleUserComparisons,
  handleUserEditInputErrors,
  handleEditUserSubmitErrors,
} from "../../helpers/errorHandlers/handleNewTransactionErrors";
import { createUpdateUserString } from "../../helpers/createNotificationString";
import { toast, Id } from "react-toastify";
import { DateTime } from "luxon";

type input = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  updateTransactions: (newTransaction: Transaction) => void;
  show: boolean;
  mockSubmit?: any;
};

// custom hook for form for adding a new transaction: includes handlers for calculating the new value of
// the remaining savings, key presses on the custom keypad component, presses of the radio buttons to update
// options, and submitting the data
const useAddTransaction = ({
  hideForm,
  updateTransactions,
  show,
  mockSubmit,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (notification: string): Id => toast.success(notification);
  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const initialState: NewTransaction = {
    title: "",
    value: 0,
    operation: "add",
    date: "",
  };

  // inital empty string errors for error state
  const initialErrors: NewTransactionErrors = {
    title: "",
    value: "",
    date: "",
  };

  const initialFlashErrors: NewTransactionFlashErrors = {
    title: false,
    value: false,
    date: false,
  };

  // sets state for initial form data
  const [formData, setFormData] = useState<NewTransaction>(initialState);
  // reference hook for maximum value for new asset value
  const maxNum = useRef<number>(999999999999.99);
  // sets state for input errors in form
  const [formErrors, setFormErrors] =
    useState<NewTransactionErrors>(initialErrors);
  // sets state for flashing inputs after attempting to submit errorful data in form
  const [flashErrors, setFlashErrors] =
    useState<NewTransactionFlashErrors>(initialFlashErrors);

  useEffect(() => {
    if (show === true) {
      setFormData((prev) => ({
        ...prev,
        date: DateTime.now().toFormat("yyyy-MM-dd'T'T"),
      }));
    }
  }, [show, formData.date]);

  // calcuates new asset value based on original asset value, the inputted monetary value to be added or
  // subtracted from the original, and the operation that changes with the press of a radio button. Used to
  // display on the form window for users.
  const newTotalAssets: number = useMemo<number>(() => {
    return calculateNewTotalAssetsUserDashboard(
      user!.totalAssets,
      formData.value,
      formData.operation
    );
  }, [user!.totalAssets, formData.value, formData.operation]);

  // updates date to current date
  const handleDate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        date: DateTime.now().toFormat("yyyy-MM-dd'T'T"),
      }));
    },
    [formData.date]
  );

  // updates the formdata state if the input that was changed was the title or date input
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (name === "title" || name === "date") {
        handleUserEditInputErrors(name, value, setFormErrors);
        setFormData((data) => ({ ...data, [name]: value }));
      }
    },
    [formErrors, formErrors]
  );

  // updates form data state when a user presses a key on keypad: pushes the number on the key to the right
  // most side of the current inputted value and handles input errors (input value too high or at $0.00)
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.value, num);
      if (
        !handleUserComparisons(
          newNum,
          setFormErrors,
          formData.operation,
          maxNum.current,
          user!.totalAssets
        )
      ) {
        setFormData((data) => ({
          ...data,
          value: newNum,
        }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, value: "" }));
        }, 1500);
      }
    },
    [formData, user?.totalAssets, maxNum.current]
  );

  // updates form data state when user clicks on delete key: pops the right-most number of the current added
  // asset value
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.value);
      handleUserEditInputErrors("value", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        value: newNum,
      }));
    },
    [formData, formErrors]
  );

  // updates form data state when user clicks on radio button: changes operation to either add or subtract.
  // If click error occurs (e.g. add value exceeds maximum value or subtract value exceeds original asset
  // value), neither button nor state changes
  const handleRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (
        (value === "add" || value === "subtract") &&
        !handleUserComparisons(
          formData.value,
          setFormErrors,
          value,
          maxNum.current,
          user!.totalAssets * 100
        )
      ) {
        setFormData((data) => ({
          ...data,
          [name]: value,
        }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, value: "" }));
        }, 1500);
      }
    },
    [formData, maxNum.current, user?.totalAssets, formErrors]
  );

  // sends data to update to backend, sets new total asset value in redux state. If input errors occur,
  // (e.g. value to be added exceeds maximum value or value to be subtracted exceeds original asset
  // value), does not send data and erroneous inputs flash at user
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleEditUserSubmitErrors(formData, setFormErrors)) {
          let newTransaction;
          if (mockSubmit) {
            mockSubmit();
          } else {
            const { value, operation } = formData;
            const submitData: NewTransactionUI = {
              ...formData,
              _id: user!._id,
              value: operation === "add" ? +value : -value,
            };
            let { transaction } = await dispatch(
              addToAssets(submitData)
            ).unwrap();
            newTransaction = transaction;
            notify(createUpdateUserString(submitData));
          }
          updateTransactions(newTransaction!);
          hideForm(e);
          setFormData(initialState);
        } else {
          if (formErrors.title || formData.title === "")
            setFlashErrors((flash) => ({ ...flash, title: true }));
          if (formErrors.date || formData.date === "")
            setFlashErrors((flash) => ({ ...flash, date: true }));
          if (formErrors.value || formData.value === 0)
            setFlashErrors((flash) => ({ ...flash, value: true }));
          setTimeout(() => {
            setFlashErrors({ title: false, date: false, value: false });
          }, 500);
        }
      } catch (err: any) {
        notifyError(err);
      }
    },
    [formData, formErrors, flashErrors]
  );

  // hides the form and resets all form data and form error data back to its original state
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      hideForm(e);
      setFormData(initialState);
      setFormErrors(initialErrors);
    },
    [formData, formErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    newTotalAssets,
    handleChange,
    handlePress,
    handleDelete,
    handleDate,
    handleRadio,
    handleSubmit,
    handleCancel,
  };
};

export default useAddTransaction;
