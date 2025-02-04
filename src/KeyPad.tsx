interface Props {
  handlePress: any;
  handleDelete: any;
  num: number;
}

const KeyPad: React.FC<Props> = (props) => {
  return (
    <div className="keypad-div">
      <button value={1} onClick={(e) => props.handlePress(e)}>
        1
      </button>
      <button value={2} onClick={(e) => props.handlePress(e)}>
        2
      </button>
      <button value={3} onClick={(e) => props.handlePress(e)}>
        3
      </button>
      <button value={4} onClick={(e) => props.handlePress(e)}>
        4
      </button>
      <button value={5} onClick={(e) => props.handlePress(e)}>
        5
      </button>
      <button value={6} onClick={(e) => props.handlePress(e)}>
        6
      </button>
      <button value={7} onClick={(e) => props.handlePress(e)}>
        7
      </button>
      <button value={8} onClick={(e) => props.handlePress(e)}>
        8
      </button>
      <button value={9} onClick={(e) => props.handlePress(e)}>
        9
      </button>
      {props.num > 0 && (
        <div className="show-when-numbers">
          <button value={0} onClick={(e) => props.handlePress(e)}>
            0
          </button>
          <button onClick={(e) => props.handleDelete(e)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default KeyPad;
