import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>404 ERROR</h1>
      <h1>The Page you were trying to look for does not exist!</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;
