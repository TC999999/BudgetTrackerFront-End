import { useAppSelector } from "./features/hooks";
import { hasTokenInterface } from "./interfaces/authInterfaces";

// Error window for when a user opens a page that requires an access token on cookies
// to view and there is not one present
const TokenErrorMsg = (): JSX.Element | null => {
  const { tokenError }: hasTokenInterface = useAppSelector(
    (store) => store.user.hasTokenInfo
  );

  return tokenError ? (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2">
        <div className="no-access-token-error-msg p-10 flex justify-center relative bg-gray-100 rounded-lg shadow-sm border-2 border-red-900 w-full">
          <p className="text-2xl">{tokenError}</p>
        </div>
      </div>
    </div>
  ) : null;
};

export default TokenErrorMsg;
