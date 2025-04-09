import { useAppSelector, useAppDispatch } from "./features/hooks";
import { useNavigate } from "react-router-dom";
import { hasTokenInterface } from "./interfaces/authInterfaces";
import { setTokenError } from "./features/auth/authSlice";

// Error window for when a user opens a page that requires an access token on cookies
// to view and there is not one present
const TokenErrorMsg = (): JSX.Element | null => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tokenError }: hasTokenInterface = useAppSelector(
    (store) => store.user.hasTokenInfo
  );

  // gets rid of token error and navigates back to home page
  const goHome = () => {
    navigate("/");
    dispatch(setTokenError(""));
  };

  return tokenError ? (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2">
        <div className="no-access-token-error-msg p-10 flex flex-col relative bg-gray-100 rounded-lg shadow-sm border-2 border-red-900 w-full text-center">
          <p className="text-2xl">{tokenError}</p>
          <button
            className="text-white transition duration-150 border border-red-700 p-2 rounded-full bg-red-500 hover:bg-red-200 hover:text-black active:bg-red-100"
            onClick={goHome}
          >
            Click Here to Go Home
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default TokenErrorMsg;
