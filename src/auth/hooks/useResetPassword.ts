import { useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../../features/slices/loadSlice";
import {
  CurrentStep,
  ConfirmUserInfo,
  StepCompleted,
} from "../../interfaces/authInterfaces";
import { setResetProgress } from "../../helpers/setResetProgress";
import { loading } from "../../interfaces/loadingInterfaces";

// general custom hook for reset password page, states used across all three forms:
// (confirming user, entering code, changing password); also changes states for user,
// current step, errors, loading status
const useResetPassword = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const initialUser: ConfirmUserInfo = {
    username: "",
    email: "",
  };
  const initiaStepList: StepCompleted = {
    userInfo: false,
    oneTimeCode: false,
    newPassword: false,
    success: false,
  };

  // when the current step changes, also changes the form being shown
  const [currentStep, setCurrentStep] = useState<CurrentStep>("userInfo");
  // state error (if user does not exist, if one time code is wrong, if new passwords don't match)
  const [submitError, setSubmitError] = useState<string>("");
  // form data user information to submit to database
  const [currentUser, setCurrentUser] = useState<ConfirmUserInfo>(initialUser);
  // for progress bar: if step is true, step in progress bar will be given a green background
  const [stepList, setStepList] = useState<StepCompleted>(initiaStepList);

  // returns value for progress bar out of a max value of 100
  const currentProgress: number = useMemo<number>(
    () => setResetProgress(currentStep),
    [currentStep]
  );

  // changes display state of small loading message when a form is submiited (since we are not
  // changing the user or token states in redux and making API calls with regular functiins instead
  // of thunk actions, this is needed)
  const changeLoading = useCallback(
    (loadingStatus: boolean): void => {
      dispatch(setFormLoading(loadingStatus));
    },
    [formLoading]
  );

  // changes current step in step list and marks previous step completion as true, shows a new form and
  // increases the value of progress bar
  const changeStep = useCallback(
    (e: React.FormEvent, newStep: CurrentStep): void => {
      e.preventDefault();
      setStepList((steps) => ({ ...steps, [currentStep]: true }));
      setCurrentStep(newStep);
    },
    [currentStep]
  );

  // changes submit error state and causes error window to appear
  const changeSubmitError = useCallback(
    (
      newSubmitError: string,
      e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      e.preventDefault();
      setSubmitError(newSubmitError);
    },
    [submitError]
  );

  // sets user attempting to reset password in state in this component to be passed down to other
  // password reset forms
  const changeUser = useCallback(
    (e: React.FormEvent, newUser: ConfirmUserInfo): void => {
      e.preventDefault();
      setCurrentUser(newUser);
    },
    [currentUser]
  );

  return {
    currentStep,
    submitError,
    currentUser,
    stepList,
    currentProgress,
    changeLoading,
    changeStep,
    changeSubmitError,
    changeUser,
  };
};

export default useResetPassword;
