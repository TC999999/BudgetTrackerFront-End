import { useParams } from "react-router-dom";
import {
  ConfirmUserInfo,
  UserInfoErrors,
  UserInfoFlashErrors,
} from "../interfaces/authInterfaces";
import useEditUser from "./formHooks/useEditUser";

// returns a form component for updating a single user
const EditUserForm = (): JSX.Element => {
  const { id } = useParams();

  const initialUserInfo: ConfirmUserInfo = {
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

  const {
    formData,
    formErrors,
    flashErrors,
    submitError,
    submitErrorFlash,
    handleChange,
    handleSubmit,
  } = useEditUser({ id, initialUserInfo, initialErrors, initialFlashErrors });

  return (
    <div
      id="edit-user-info-form"
      className="p-4 m-4 bg-gray-100 border-2 border-green-700 rounded-lg"
    >
      <header className="text-center">
        <h1 className="text-2xl sm:text-4xl text-green-700 font-bold underline">
          Edit Your Information Here
        </h1>
        <small className="text-sm sm:text-base">
          Here you may edit either your username, your email address, or both.
          If you wish to change your password, you will need to log out and
          click the "Reset Your Password Here" link.
        </small>
      </header>
      <form onSubmit={handleSubmit}>
        <div id="username-input">
          <label className="text-base smt:text-lg block" htmlFor="username">
            Username:
          </label>
          <input
            className={`input ${formErrors.username ? "input-error" : ""} ${
              flashErrors.username ? "animate-blinkError" : ""
            }`}
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <div
            id="username-errors"
            className="text-center text-red-600 font-bold"
          >
            {formErrors.username}
          </div>
          <div
            id="username-instructions"
            className="flex flex-col text-sm sm:text-base"
          >
            <small>Your new username must be between 6-30 characters.</small>
            <small>Your new username may include letters and numbers.</small>
            <small>
              Your new username cannot contain spaces or special characters
            </small>
            <small>(e.g. !, ?, @, #, () [], /).</small>
          </div>
        </div>
        <div id="email-input">
          <label className="text-base smt:text-lg  block" htmlFor="email">
            Email:
          </label>
          <input
            className={`input ${formErrors.email ? "input-error" : ""} ${
              flashErrors.email ? "animate-blinkError" : ""
            }`}
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div id="email-errors" className="text-center text-red-600 font-bold">
            {formErrors.email}
          </div>
          <div id="email-instructions" className="text-sm sm:text-base">
            <small>Your new email address must be valid</small>
          </div>
        </div>

        <div id="submit-error" className="text-center text-red-600 font-bold">
          <p className={`${submitErrorFlash ? "animate-blinkErrorText" : ""}`}>
            {submitError}
          </p>
        </div>
        <div className="flex justify-center">
          <button className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
