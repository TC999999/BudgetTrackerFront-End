import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { editUser } from "../../features/actions/users";
import { setPageLoading, setLoadError } from "../../features/slices/loadSlice";
import {
  ConfirmUserInfo,
  SubmitUserInfoEdit,
  UserInfoErrors,
  UserInfoFlashErrors,
} from "../../interfaces/authInterfaces";
import {
  handleUserInfoInputErrors,
  handleUserInfoSubmitErrors,
} from "../../helpers/handleUserInfoErrors";
import UserAPI from "../../apis/UserAPI";

type input = string | undefined;

// custom hooks for a form to update a single user
const useEditUser = (id: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const initialState: ConfirmUserInfo = {
    username: "retrieving data",
    email: "retrieving data",
  };

  const initialErrors: UserInfoErrors = {
    username: "",
    email: "",
  };

  const initialFlashErrors: UserInfoFlashErrors = {
    username: false,
    email: false,
  };

  const [formData, setFormData] = useState<ConfirmUserInfo>(initialState);
  const [formErrors, setFormErrors] = useState<UserInfoErrors>(initialErrors);
  const [flashErrors, setFlashErrors] =
    useState<UserInfoFlashErrors>(initialFlashErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitErrorFlash, setSubmitErrorFlash] = useState<boolean>(false);

  useEffect((): void => {
    const getUser = async (): Promise<void> => {
      try {
        dispatch(setPageLoading(true));
        if (id) {
          const userInfo = await UserAPI.getUser(id);
          setFormData(userInfo);
        }
        setFormErrors(initialErrors);
        setFlashErrors(initialFlashErrors);
        setSubmitError("");
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
      }
    };
    getUser();
  }, [id]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault();
      if (submitError) setSubmitError("");
      let { name, value } = e.target;
      if (name === "username" || name === "email") {
        handleUserInfoInputErrors(name, value, setFormErrors);
        setFormData((data) => ({ ...data, [name]: value }));
      }
    },
    [submitError, formErrors, formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (
          handleUserInfoSubmitErrors(formData, setFormErrors) &&
          !submitError
        ) {
          let { username, email } = formData;
          const submitData: SubmitUserInfoEdit = {
            _id: id!,
            username,
            email,
          };
          await dispatch(editUser(submitData)).unwrap();
          navigate("/");
        } else {
          if (formErrors.username || formData.username === "")
            setFlashErrors((flash) => ({ ...flash, username: true }));
          if (formErrors.email || formData.email === "")
            setFlashErrors((flash) => ({ ...flash, email: true }));
          if (submitError) setSubmitErrorFlash(true);
          setTimeout(() => {
            setFlashErrors({ username: false, email: false });
            setSubmitErrorFlash(false);
          }, 500);
        }
      } catch (err: any) {
        setSubmitError(err.message);
      }
    },
    [formData, submitError, formErrors, flashErrors, submitErrorFlash]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    submitError,
    submitErrorFlash,
    handleChange,
    handleSubmit,
  };
};

export default useEditUser;
