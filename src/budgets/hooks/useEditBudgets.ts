import { useState, useMemo, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { setTotalAssets } from "../../features/slices/authSlice";
import { setFormLoading } from "../../features/slices/loadSlice";
import { shallowEqual } from "react-redux";
import {
  BudgetInterface,
  BudgetEditInterface,
  UpdateBudgetFormErrors,
  UpdateBudgetFlashErrors,
  SubmitBudgetUpdateInterface,
  BudgetUpdate,
} from "../../interfaces/budgetInterfaces";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { error } from "../../interfaces/miscTypes";
import { currencyConverter, numPop } from "../../helpers/currencyConverter";
import { getNewBudgetValue } from "../../helpers/showBudgetValue";
import { getRemainingMoney } from "../../helpers/getRemainingMoney";
import { calculateNewTotalAssets } from "../../helpers/calculateNewTotalAssets";
import { createUpdateBudgetString } from "../../helpers/createNotificationString";
import {
  handleUpdateBudgetInputErrors,
  handleUpdateBudgetSubmitErrors,
  handleUpdateBudgetComparisons,
} from "../../helpers/handleBudgetErrors";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../../apis/BudgetAPI";

type input = {
  budget: BudgetInterface;
  hideEditForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showEditForm"
  ) => void;

  updateBudget: (updatedBudget: BudgetUpdate) => void;
};

// custom hook for form for updating a single budget: includes handlers for text inputs for both change
// in funds and title, key presses on custom key pad component, radio buttons that checks if the funds are being
// added or subtracted, and submission of data
const useEditBudget = ({ budget, hideEditForm, updateBudget }: input) => {
  const dispatch: AppDispatch = useAppDispatch();

  const notify = (notificationString: string): Id =>
    toast.success(notificationString);

  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const initialState: BudgetEditInterface = {
    title: budget.title,
    addedMoney: 0,
    operation: "add",
  };

  const initialErrors: UpdateBudgetFormErrors = {
    title: "",
    addedMoney: "",
  };

  const initialFlashErrors: UpdateBudgetFlashErrors = { title: false };

  // sets state for form data used to update this budget
  const [formData, setFormData] = useState<BudgetEditInterface>(initialState);
  // sets state for input errors from form data
  const [formErrors, setFormErrors] =
    useState<UpdateBudgetFormErrors>(initialErrors);
  // sets state form if the inputs should flash when users attempt to submit errorful data
  const [flashErrors, setFlashErrors] =
    useState<UpdateBudgetFlashErrors>(initialFlashErrors);
  // calculates the initial remaining funds value for this budget
  const remainingMoney = useRef<number>(
    getRemainingMoney(budget.moneyAllocated, budget.moneySpent)
  );

  // calculates the new remaining funds value for this budget based on the initial remaining money,
  // the change of money by the user, and whether the user intends to add to or subtract from the initial
  // value
  const newRemainingMoney: number = useMemo<number>(() => {
    return getNewBudgetValue(
      remainingMoney.current,
      formData.addedMoney,
      formData.operation
    );
  }, [formData]);

  // calculates the new total funds value for this budget based on the budget's allocated funds,
  // the change of money by the user, and whether the user intends to add to or subtract from the initial
  // value
  const newBudget: number = useMemo<number>(() => {
    return getNewBudgetValue(
      budget.moneyAllocated,
      formData.addedMoney,
      formData.operation
    );
  }, [formData.addedMoney, formData.operation]);

  // calculates the new total assets value  based on the original total asset value,
  // the change of money by the user, and whether the user intends to add to or subtract from the initial
  // value
  const newTotalAssets: number = useMemo<number>(() => {
    return calculateNewTotalAssets(
      user!.totalAssets,
      formData.addedMoney,
      formData.operation
    );
  }, [formData.addedMoney, formData.operation]);

  // pushes number on the key pressed by tbe userto the right of the current money change value and
  // creates a new money change string. If the the created string contains any errors (e.g. the added value
  // is greater than the user's total assets or the subtracted value is greater than the budget's remaining
  // value), the form data will not update
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.addedMoney, num);
      let errors = handleUpdateBudgetComparisons(
        newNum,
        user!.totalAssets * 100,
        formData.operation,
        remainingMoney.current,
        setFormErrors
      );
      if (!errors) {
        setFormData((data) => ({ ...data, addedMoney: newNum }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, addedMoney: "" }));
        }, 1500);
      }
    },
    [formData, formErrors, user?.totalAssets, remainingMoney.current]
  );

  // pops the rightmost number from the money change string, creates a new string, and updates the form data's
  // money change value
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.addedMoney);
      setFormData((data) => ({
        ...data,
        addedMoney: newNum,
      }));
      if (formErrors.addedMoney)
        setFormErrors((data) => ({ ...data, addedMoney: "" }));
    },
    [formData, formErrors]
  );

  // updates the form data state's operation value to either add or subtract; when the form is submitted,
  // checks operation value if we should subtract from or add to total assets
  const handleRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (
        !handleUpdateBudgetComparisons(
          formData.addedMoney,
          user!.totalAssets * 100,
          value,
          remainingMoney.current,
          setFormErrors
        )
      ) {
        setFormData((data) => ({
          ...data,
          [name]: value,
        }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, addedMoney: "" }));
        }, 1500);
      }
    },
    [formData, formErrors, user?._id, remainingMoney.current]
  );

  // updates the title value of form data. If input contains an error, updates form errors state and changes
  // front end to show user the error
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (name === "title" || name === "addedMoney") {
        handleUpdateBudgetInputErrors(name, value, setFormErrors);
        setFormData((data) => ({
          ...data,
          [name]: value,
        }));
      }
    },
    [formErrors, formData]
  );

  // submits the new budget information to backed to be updated to the db. If the inputs contain errors
  // (e.g. title length is too long), does not send data and flashes the erroneous inputs to the user.
  const handleSubmit = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
      e.preventDefault();
      try {
        if (handleUpdateBudgetSubmitErrors(formData, setFormErrors)) {
          dispatch(setFormLoading(true));
          let submitData: SubmitBudgetUpdateInterface = {
            userID: user!._id,
            budgetID: budget._id,
            title: formData.title,
            addedMoney:
              formData.operation === "add"
                ? formData.addedMoney
                : -formData.addedMoney,
          };
          let { newUserBudget, newAssets } = await BudgetAPI.updateBudget(
            submitData
          );
          updateBudget(newUserBudget);
          dispatch(setTotalAssets(newAssets));
          hideEditForm(e, "showEditForm");
          notify(createUpdateBudgetString(budget.title, formData));
        } else {
          if (formErrors.title || formData.title === "")
            setFlashErrors({ title: true });
          setTimeout(() => {
            setFlashErrors({ title: false });
          }, 500);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, formErrors, user?._id, flashErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    newRemainingMoney,
    newBudget,
    newTotalAssets,
    handlePress,
    handleDelete,
    handleRadio,
    handleChange,
    handleSubmit,
  };
};

export default useEditBudget;
