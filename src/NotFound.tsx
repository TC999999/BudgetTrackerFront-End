import { Link } from "react-router-dom";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";

// Error page for 404 errors (invalid browser URL routes)
const NotFound = (): JSX.Element => {
  const userExists = useAppSelector(
    (store) => store.user.userInfo.userExists,
    shallowEqual
  );

  return (
    <div id="not-found-page" className="text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">404 ERROR</h1>
      <h1 className="text-6xl p-2">
        The Page you were trying to look for does not exist!
      </h1>
      {!userExists && (
        <h1 className="text-xl text-green-500 underline hover:text-green-200 active:text-green-600">
          <Link to="/">Go Back to Login</Link>
        </h1>
      )}
    </div>
  );
};

export default NotFound;
