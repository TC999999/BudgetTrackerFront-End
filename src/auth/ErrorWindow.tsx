import { MdError } from "react-icons/md";

type Props = {
  changeSubmitError: (
    newSubmitError: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  submitError: string;
};

// Error window for ResetPassword.tsx
const ErrorWindow: React.FC<Props> = ({
  changeSubmitError,
  submitError,
}): JSX.Element => {
  return (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2">
        <div
          id="submit-form-error-msg"
          className="p-4 text-center relative bg-gray-100 rounded-lg shadow-sm border-2 border-red-800"
        >
          <div className="flex justify-center p-4">
            <div
              id="error-icon"
              className="text-8xl text-red-700 flex items-center"
            >
              <MdError />
            </div>
            <div id="error-message" className="text-xl">
              <b>{submitError}</b>
            </div>
          </div>
          <button
            onClick={(e) => changeSubmitError("", e)}
            className="border-2 border-red-700 bg-red-400 p-2 rounded-lg font-bold duration-150 hover:bg-red-700 hover:text-white active:bg-red-100 active:text-white"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorWindow;
