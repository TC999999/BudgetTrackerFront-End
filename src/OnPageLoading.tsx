import { useAppSelector } from "./features/hooks";
import { UserContextInterface } from "./interfaces/userInterfaces";

type Props = {
  loadingMsg: string;
};

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
