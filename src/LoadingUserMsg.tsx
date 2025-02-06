import { useAppSelector } from "./features/hooks";
import { UserContextInterface } from "./interfaces/userInterfaces";
import { FaRegHourglass } from "react-icons/fa";

const LoadingMsg = () => {
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  return userStatus.loading ? (
    <div
      tabIndex={-1}
      className="loading-message-div bg-gray-500 bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full p-4 max-w-md max-h-full">
        <div className="loading-msg relative bg-gray-100 p-10 flex justify-center border-2 border-green-700 rounded-full">
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

export default LoadingMsg;
