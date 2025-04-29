import { useState, useEffect } from "react";
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

type input = {
  id?: string;

  initialUserInfo: ConfirmUserInfo;
  initialErrors: UserInfoErrors;
  initialFlashErrors: UserInfoFlashErrors;
};

// custom hooks for a form to update a single user
const useEditUser = ({
  id,
  initialUserInfo,
  initialErrors,
  initialFlashErrors,
}: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [formData, setFormData] = useState<ConfirmUserInfo>(initialUserInfo);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (submitError) setSubmitError("");
    let { name, value } = e.target;
    if (name === "username" || name === "email") {
      handleUserInfoInputErrors(name, value, setFormErrors);
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleUserInfoSubmitErrors(formData, setFormErrors) && !submitError) {
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
  };

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
