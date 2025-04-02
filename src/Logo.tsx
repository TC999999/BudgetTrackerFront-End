import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div id="app-logo" className="text-center py-2">
      <Link to="/">
        <b className="text-green-500 text-xl sm:text-3xl hover:text-green-300 hover:underline active:text-green-100">
          Personal Piggybank
        </b>
      </Link>
    </div>
  );
};

export default Logo;
