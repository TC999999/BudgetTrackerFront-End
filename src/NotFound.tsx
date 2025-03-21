import { Link } from "react-router-dom";

// Error page for 404 errors
const NotFound = (): JSX.Element => {
  return (
    <div className="not-found-page text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">404 ERROR</h1>
      <h1 className="text-6xl p-2">
        The Page you were trying to look for does not exist!
      </h1>
      <Link
        className="text-3xl text-green-600 underline hover:text-green-400 active:text-green-500"
        to="/"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
