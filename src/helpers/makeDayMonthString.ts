import { daysString, monthString } from "./timeMaps";

// used for income forms and cards: returns string that changes depending on the month and
// dayofmonth values have numeric values or not
const makeEndString = (month: string, dayOfMonth: string) => {
  if (month !== "*" && dayOfMonth !== "*") {
    return " every year";
  } else {
    return "";
  }
};

// used for income forms and cards: takes numeric strings inputs and returns a readable date interval string
// by getting data from the respective hashmaps and if the month and dayofmonth values have numeric
// values or not
// For example
// if parameters were (
//   month: "3",
//   dayOfMonth: "14",
//   dayOfWeek: "*",
// )
// the return value would be March, 14 every year
export const makeDayMonthString = (
  month: string,
  dayOfMonth: string,
  dayOfWeek: string
): string => {
  let str: string =
    dayOfMonth === "*" && month === "*"
      ? " on every day of the year"
      : daysString.get(dayOfMonth)! +
        monthString.get(month) +
        makeEndString(month, dayOfMonth);
  let dayMonthString: string = dayOfWeek === "*" ? str : "";
  return dayMonthString;
};
