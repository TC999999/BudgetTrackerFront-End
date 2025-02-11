type Props = {
  handlePress: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  num: number;
};

const KeyPad: React.FC<Props> = ({ handlePress, handleDelete, num }) => {
  return (
    <div className="keypad-div flex justify-center">
      <div>
        <div className="nums-above-zero w-40 keypad-key-buttons grid grid-cols-3 gap-1">
          <button className="button" value={1} onClick={(e) => handlePress(e)}>
            1
          </button>
          <button className="button" value={2} onClick={(e) => handlePress(e)}>
            2
          </button>
          <button className="button" value={3} onClick={(e) => handlePress(e)}>
            3
          </button>
          <button className="button" value={4} onClick={(e) => handlePress(e)}>
            4
          </button>
          <button className="button" value={5} onClick={(e) => handlePress(e)}>
            5
          </button>
          <button className="button" value={6} onClick={(e) => handlePress(e)}>
            6
          </button>
          <button className="button" value={7} onClick={(e) => handlePress(e)}>
            7
          </button>
          <button className="button" value={8} onClick={(e) => handlePress(e)}>
            8
          </button>
          <button className="button" value={9} onClick={(e) => handlePress(e)}>
            9
          </button>
        </div>

        {num > 0 && (
          <div className="show-when-numbers keypad-key-buttons grid grid-cols-3 gap-1 mt-1">
            <button
              className="button"
              value={0}
              onClick={(e) => handlePress(e)}
            >
              0
            </button>
            <button
              className="button-delete col-span-2"
              onClick={(e) => handleDelete(e)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyPad;
