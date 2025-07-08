import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { editUser } from "../../features/actions/users";
import { setPageLoading, setLoadError } from "../../features/slices/loadSlice";
import {
  EditUser,
  SubmitEditUser,
  EditUserErrors,
  EditUserFlashErrors,
} from "../../interfaces/userInterfaces";
import { ConfirmUserInfo } from "../../interfaces/authInterfaces";
import {
  handleUserEditInputErrors,
  handleUserEditSubmitErrors,
} from "../../helpers/errorHandlers/handleUserEditErrors";
import UserAPI from "../../apis/UserAPI";
import { toast, Id } from "react-toastify";
import { createEditUserString } from "../../helpers/createNotificationString";

type input = { id: string | undefined; user?: EditUser; mockSubmit?: any };

// custom hooks for a form to update a single user: includes retrieval of user data upon initial render, handlers for
// changes in text inputs, and submitting the data
const useEditUser = ({ id, user, mockSubmit }: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (message: string): Id =>
    toast.success(message, { autoClose: 10000 });

  const initialState: EditUser = {
    username: "",
    email: "",
    password: "",
  };

  const initialNotificationData: ConfirmUserInfo = {
    username: "",
    email: "",
  };

  const initialErrors: EditUserErrors = {
    username: "",
    email: "",
    password: "",
  };

  const initialFlashErrors: EditUserFlashErrors = {
    username: false,
    email: false,
    password: false,
  };

  const [formData, setFormData] = useState<EditUser>(initialState);
  const [formErrors, setFormErrors] = useState<EditUserErrors>(initialErrors);
  const [flashErrors, setFlashErrors] =
    useState<EditUserFlashErrors>(initialFlashErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitErrorFlash, setSubmitErrorFlash] = useState<boolean>(false);
  const notificationData = useRef<ConfirmUserInfo>(initialNotificationData);

  useEffect((): void => {
    const getUser = async (): Promise<void> => {
      try {
        dispatch(setPageLoading(true));
        if (user) {
          setFormData(user);
          notificationData.current = {
            username: user.username,
            email: user.email,
          };
        } else if (id) {
          const userInfo = await UserAPI.getUser(id);
          setFormData((user) => ({ ...user, ...userInfo }));
          notificationData.current = {
            username: userInfo.username,
            email: userInfo.email,
          };
        }
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
      if (name === "username" || name === "email" || name === "password") {
        handleUserEditInputErrors(name, value, setFormErrors);
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
          handleUserEditSubmitErrors(formData, setFormErrors) &&
          !submitError
        ) {
          if (mockSubmit) {
            mockSubmit();
          } else {
            let { username, email, password } = formData;
            const submitData: SubmitEditUser = {
              _id: id!,
              username,
              email,
              password,
            };
            await dispatch(editUser(submitData)).unwrap();
            notify(
              createEditUserString(
                username,
                notificationData.current.username,
                email,
                notificationData.current.email
              )
            );
            navigate("/");
          }
        } else {
          if (formErrors.username || formData.username === "")
            setFlashErrors((flash) => ({ ...flash, username: true }));
          if (formErrors.email || formData.email === "")
            setFlashErrors((flash) => ({ ...flash, email: true }));
          if (formErrors.password || formData.password === "")
            setFlashErrors((flash) => ({ ...flash, password: true }));
          if (submitError) setSubmitErrorFlash(true);
          setTimeout(() => {
            setFlashErrors({ username: false, email: false, password: false });
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
