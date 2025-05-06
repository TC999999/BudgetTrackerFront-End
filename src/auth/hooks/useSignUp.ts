import { useState, useCallback, useMemo } from "react";
import {
  SignUpInterface,
  SignUpSensitiveSubmit,
} from "../../interfaces/authInterfaces";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/loadSlice";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { loading } from "../../interfaces/loadingInterfaces";
import { stepList, step } from "../../interfaces/registerInterfaces";
import { setRegisterProgress } from "../../helpers/setResetProgress";

// custom hook for when a user initially registers: includes handlers for text inputs, the custom keypad component
// inputs, showing the form for initial incomes, handling the checkbox for trusted devices, and handling data
// submission
const useSignUp = () => {
  const initialState: SignUpInterface = {
    username: "",
    password: "",
    email: "",
    totalAssets: 0,
    incomes: [],
    trusted: true,
  };

  const initialStepList: stepList = {
    showSensitiveForm: false,
    showOTPForm: false,
    showAdditionalForm: false,
  };

  const dispatch: AppDispatch = useAppDispatch();
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // states for form data values, strings for form errors, and whether to flash errorful inputs to user
  const [registerData, setRegisterData] =
    useState<SignUpInterface>(initialState);
  const [stepList, setStepList] = useState<stepList>(initialStepList);
  const [currentStep, setCurrentStep] = useState<step>("showSensitiveForm");
  const [submitError, setSubmitError] = useState<string>("");

  // returns value for progress bar out of a max value of 99
  const currentProgress: number = useMemo<number>(
    () => setRegisterProgress(currentStep),
    [currentStep]
  );

  const handleDataChange = useCallback(
    (
      e: React.FormEvent,
      newUser: SignUpInterface | SignUpSensitiveSubmit
    ): void => {
      e.preventDefault();
      setRegisterData((prevUser) => ({ ...prevUser, ...newUser }));
    },
    [registerData]
  );

  const changeLoading = useCallback(
    (loadingStatus: boolean): void => {
      dispatch(setFormLoading(loadingStatus));
    },
    [formLoading]
  );

  const changeStep = useCallback(
    (e: React.FormEvent, newStep: step): void => {
      e.preventDefault();
      setStepList((steps) => ({ ...steps, [currentStep]: true }));
      setCurrentStep(newStep);
    },
    [stepList, currentStep]
  );

  // changes submit error state and causes error window to appear
  const changeSubmitError = useCallback(
    (
      newSubmitError: string,
      e?: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      if (e) e.preventDefault();
      setSubmitError(newSubmitError);
    },
    [submitError]
  );

  return {
    registerData,
    stepList,
    currentStep,
    currentProgress,
    submitError,
    handleDataChange,
    changeLoading,
    changeStep,
    changeSubmitError,
  };
};

export default useSignUp;
