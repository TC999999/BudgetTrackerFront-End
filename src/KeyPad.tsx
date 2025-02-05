interface Props {
  handlePress: any;
  handleDelete: any;
  num: number;
}

const KeyPad: React.FC<Props> = (props) => {
  return (
    <div className="keypad-div flex justify-center">
      <div>
        <div className="nums-above-zero w-40 keypad-key-buttons grid grid-cols-3">
          <button
            className="button"
            value={1}
            onClick={(e) => props.handlePress(e)}
          >
            1
          </button>
          <button
            className="button"
            value={2}
            onClick={(e) => props.handlePress(e)}
          >
            2
          </button>
          <button
            className="button"
            value={3}
            onClick={(e) => props.handlePress(e)}
          >
            3
          </button>
          <button
            className="button"
            value={4}
            onClick={(e) => props.handlePress(e)}
          >
            4
          </button>
          <button
            className="button"
            value={5}
            onClick={(e) => props.handlePress(e)}
          >
            5
          </button>
          <button
            className="button"
            value={6}
            onClick={(e) => props.handlePress(e)}
          >
            6
          </button>
          <button
            className="button"
            value={7}
            onClick={(e) => props.handlePress(e)}
          >
            7
          </button>
          <button
            className="button"
            value={8}
            onClick={(e) => props.handlePress(e)}
          >
            8
          </button>
          <button
            className="button"
            value={9}
            onClick={(e) => props.handlePress(e)}
          >
            9
          </button>
        </div>

        {props.num > 0 && (
          <div className="show-when-numbers keypad-key-buttons grid grid-cols-3">
            <button
              className="button"
              value={0}
              onClick={(e) => props.handlePress(e)}
            >
              0
            </button>
            <button
              className="button-delete col-span-2"
              onClick={(e) => props.handleDelete(e)}
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
