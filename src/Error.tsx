import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import { error } from "./interfaces/miscTypes";

// returns a general error window for non browser url 404 errors
const Error = () => {
  const { message, status }: error = useAppSelector(
    (store) => store.loading.loadError,
    shallowEqual
  );

  return (
    <div id="error-page" className="text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">{status} ERROR</h1>
      <h1 className="text-6xl p-2">{message}</h1>
    </div>
  );
};

export default Error;
