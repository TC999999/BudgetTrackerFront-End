export const currencyConverter = (
  originalNum: number | undefined | null,
  newNum: number
) => {
  let numStr = originalNum + newNum.toString();
  return parseFloat(numStr);
};

export const numPop = (num: number) => {
  let numCopy = num.toString().slice();
  let sliceNum = numCopy.slice(0, numCopy.length - 1);
  return sliceNum === "" || sliceNum === "-" ? 0 : parseFloat(sliceNum);
};
