// Used for keypads: when a numbered key is clicked, joins that new number to the right side of the original
// number and returns the new number as a number type
export const currencyConverter = (
  originalNum: number,
  newNum: number
): number => {
  return (originalNum * 1000 + newNum) / 100;
};

// Used for keypads: when a delete key is clicked, removes a single number from the right side of the original
// number and returns the number without that right most number or 0 if string is empty
export const numPop = (num: number): number => {
  let newNum = num * 100;
  return (newNum - (newNum % 10)) / 1000;
};

// converts a number to a USD string
export const dollarConverter = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
