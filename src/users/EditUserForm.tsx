import {
  ConfirmUserInfo,
  UserInfoErrors,
  UserInfoFlashErrors,
} from "../interfaces/authInterfaces";

type Props = {
  userInfo: ConfirmUserInfo;
  errors: UserInfoErrors;
  flashErrors: UserInfoFlashErrors;
  submitError: string;
  submitErrorFlash: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};
const EditUserForm: React.FC<Props> = ({
  userInfo,
  errors,
  flashErrors,
  submitError,
  submitErrorFlash,
  handleChange,
  handleSubmit,
}): JSX.Element => {
  return (
    <div
      id="edit-user-info-form"
      className="p-4 m-4 bg-gray-100 border-2 border-green-500 rounded-lg"
    >
      <header>
        <h1 className="text-center text-2xl text-green-600 font-bold">
          Edit Your Information Here
        </h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div id="username-input">
          <label className="text-lg block" htmlFor="username">
            Username:
          </label>
          <input
            className={`input ${errors.username ? "input-error" : ""} ${
              flashErrors.username ? "animate-blinkError" : ""
            }`}
            type="text"
            id="username"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
          />
          <div
            id="username-errors"
            className="text-center text-red-600 font-bold"
          >
            {errors.username}
          </div>
          <div id="username-instructions" className="flex flex-col">
            <small>Your new username must be between 6-30 characters.</small>
            <small>Your new username may include letters and numbers.</small>
            <small>
              Your new username cannot contain spaces or special characters
            </small>
            <small>(e.g. !, ?, @, #, () [], /).</small>
          </div>
        </div>
        <div id="email-input">
          <label className="text-lg block" htmlFor="email">
            Email:
          </label>
          <input
            className={`input ${errors.email ? "input-error" : ""} ${
              flashErrors.email ? "animate-blinkError" : ""
            }`}
            type="text"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
          />

          <div id="email-errors" className="text-center text-red-600 font-bold">
            {errors.email}
          </div>
          <div id="email-instructions" className="text-sm">
            <p>Your new email address must be valid</p>
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
