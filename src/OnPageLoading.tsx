import { shallowEqual } from "react-redux";
import { useAppSelector } from "./features/hooks";
import { loading } from "./interfaces/miscTypes";

type Props = {
  loadingMsg: string;
};

// Returns a message on the body and not the modal for when certain data
// (budget data or income data) is loading
const OnPageLoading: React.FC<Props> = ({ loadingMsg }): JSX.Element | null => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.user.loadingInfo,
    shallowEqual
  );
  return pageLoading ? (
    <div className="text-center text-5xl text-green-700 font-bold p-10">
      Loading {loadingMsg}...
    </div>
  ) : null;
};

export default OnPageLoading;
