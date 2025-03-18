import { MdError } from "react-icons/md";

type Props = {
  changeSubmitError: (e: React.FormEvent, newSubmitError: string) => void;
  submitError: string;
};

const ErrorWindow: React.FC<Props> = ({
  changeSubmitError,
  submitError,
}): JSX.Element => {
  return (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2">
        <div className="submit-form-error-msg p-4 text-center relative bg-gray-100 rounded-lg shadow-sm border-2 border-red-800">
          <div className="flex justify-center p-4">
            <div className="error-icon text-8xl text-red-700 flex items-center">
              <MdError />
            </div>
            <div className="error-message text-xl">
              <b>{submitError}</b>
            </div>
          </div>
          <button
            onClick={(e) => changeSubmitError(e, "")}
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
