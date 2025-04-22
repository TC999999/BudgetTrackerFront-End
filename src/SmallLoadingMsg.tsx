import { shallowEqual } from "react-redux";
import { useAppSelector } from "./features/hooks";
import { loading } from "./interfaces/loadingInterfaces";
import { FaRegHourglass } from "react-icons/fa";

// Loading Message for regular form submissions other than logging in and registering users
const SmallLoadingMsg = (): JSX.Element | null => {
  const { formLoading, pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  // message only shows when making smaller CRUD requests, otherwise is null
  return formLoading || pageLoading ? (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2">
        <div className="submit-form-loading-msg p-10 flex justify-center relative bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 w-full">
          <p className="text-2xl">Loading</p>
          <span className="text-2xl animate-bounce [animation-delay:-0.3s]">
            .
          </span>
          <span className="text-2xl animate-bounce [animation-delay:-0.15s]">
            .
          </span>
          <span className="text-2xl animate-bounce">.</span>
          <FaRegHourglass className="text-2xl mx-4 animate-spin text-green-600" />
        </div>
      </div>
    </div>
  ) : null;
};

export default SmallLoadingMsg;
