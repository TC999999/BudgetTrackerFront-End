import Buttons from "../motionWrappers/Buttons";

type Props = {
  incomeListLength: number;
  showIncomeFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

const IncomePageButtons: React.FC<Props> = ({
  incomeListLength,
  showIncomeFormState,
}) => {
  return (
    <Buttons>
      <nav className="buttons flex justify-around w-full">
        <button
          className={`nav-button border-green-500 bg-green-400 ${
            incomeListLength < 3
              ? "hover:bg-green-700 hover:text-white active:bg-green-500 duration-150"
              : "cursor-not-allowed"
          }`}
          onClick={(e) => showIncomeFormState(e)}
        >
          Add New Income
        </button>
      </nav>
    </Buttons>
  );
};

export default IncomePageButtons;
