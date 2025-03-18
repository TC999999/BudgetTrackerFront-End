import { digits } from "./interfaces/authInterfaces";

type Props = {
  handlePress: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    number: digits
  ) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const FullKeyPad: React.FC<Props> = ({
  handlePress,
  handleDelete,
}): JSX.Element => {
  return (
    <div className="keypad-div flex justify-center p-4">
      <div className="nums-above-zero w-40 keypad-key-buttons grid grid-cols-3 gap-1">
        <button className="button" onClick={(e) => handlePress(e, "1")}>
          1
        </button>
        <button className="button" onClick={(e) => handlePress(e, "2")}>
          2
        </button>
        <button className="button" onClick={(e) => handlePress(e, "3")}>
          3
        </button>
        <button className="button" onClick={(e) => handlePress(e, "4")}>
          4
        </button>
        <button className="button" onClick={(e) => handlePress(e, "5")}>
          5
        </button>
        <button className="button" onClick={(e) => handlePress(e, "6")}>
          6
        </button>
        <button className="button" onClick={(e) => handlePress(e, "7")}>
          7
        </button>
        <button className="button" onClick={(e) => handlePress(e, "8")}>
          8
        </button>
        <button className="button" onClick={(e) => handlePress(e, "9")}>
          9
        </button>
        <button className="button" onClick={(e) => handlePress(e, "0")}>
          0
        </button>
        <button
          className="button-delete col-span-2"
          onClick={(e) => handleDelete(e)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FullKeyPad;
