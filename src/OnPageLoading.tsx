import { useAppSelector } from "./features/hooks";
import { UserContextInterface } from "./interfaces/userInterfaces";

type Props = {
  loadingMsg: string;
};

// Returns a message on the body and not the modal for when certain data
// (budget data or income data) is loading
const OnPageLoading: React.FC<Props> = ({ loadingMsg }): JSX.Element | null => {
  const { smallLoading }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  return smallLoading ? (
    <div className="text-center text-5xl text-green-700 font-bold p-10">
      Loading {loadingMsg}...
    </div>
  ) : null;
};

export default OnPageLoading;
