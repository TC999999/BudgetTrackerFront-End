interface Props {
  handlePress: any;
  handleDelete: any;
  num: number;
}

const KeyPad: React.FC<Props> = (props) => {
  const addNums = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    num: number
  ) => {
    e.preventDefault();
    props.handlePress(num);
  };

  const deleteNum = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    props.handleDelete();
  };

  return (
    <div className="keypad-div">
      <button onClick={(e) => addNums(e, 1)}>1</button>
      <button onClick={(e) => addNums(e, 2)}>2</button>
      <button onClick={(e) => addNums(e, 3)}>3</button>
      <button onClick={(e) => addNums(e, 4)}>4</button>
      <button onClick={(e) => addNums(e, 5)}>5</button>
      <button onClick={(e) => addNums(e, 6)}>6</button>
      <button onClick={(e) => addNums(e, 7)}>7</button>
      <button onClick={(e) => addNums(e, 8)}>8</button>
      <button onClick={(e) => addNums(e, 9)}>9</button>
      {props.num > 0 && (
        <div className="show-when-numbers">
          <button onClick={(e) => addNums(e, 0)}>0</button>
          <button onClick={(e) => deleteNum(e)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default KeyPad;
