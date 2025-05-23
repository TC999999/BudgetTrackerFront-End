import Modal from "../motionWrappers/Modal";

type Props = {
  showPrompt: boolean;
  hidePrompt: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  logOutAndNavigate: () => Promise<void>;
};

// prompt that asks a user if they are sure they want to log out
const Logout: React.FC<Props> = ({
  showPrompt,
  hidePrompt,
  logOutAndNavigate,
}): JSX.Element => {
  return (
    <Modal large={false} show={showPrompt}>
      <header className="text-xl sm:text-3xl text-center text-green-700 font-bold">
        Are You Sure You Want to Log Out?
      </header>
      <div className="buttons flex justify-between m-2">
        <button
          className="cancel-button duration-150"
          onClick={(e) => hidePrompt(e)}
        >
          Cancel
        </button>
        <button
          id="request-logout"
          className="bg-blue-300 border-2 border-blue-500 p-2 rounded-full hover:bg-blue-700 hover:text-white active:bg-blue-600 transition duration-150"
          onClick={logOutAndNavigate}
        >
          Log Out
        </button>
      </div>
    </Modal>
  );
};

export default Logout;
