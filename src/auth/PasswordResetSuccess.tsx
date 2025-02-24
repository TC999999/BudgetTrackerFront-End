import { useNavigate } from "react-router-dom";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const navigateToLoginPage = (): void => {
    navigate("/");
  };

  return (
    <div className="text-center">
      <div className="head-text p-2">
        <h1 className="text-3xl sm:text-5xl font-bold duration-150">
          Your password has been successfully reset!{" "}
        </h1>
      </div>
      <div className="body-text p-2">
        <p className="text-xl sm:text-2xl duration-150">
          Please return to the log-in page by using the button below or
          refreshing the page.
        </p>
      </div>

      <div>
        <button
          className="border-2 border-green-600 bg-green-400 rounded-full p-2 hover:text-white hover:bg-green-600 duration-150 active:bg-green-300 active:text-black"
          onClick={navigateToLoginPage}
        >
          Go back to Login page
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
