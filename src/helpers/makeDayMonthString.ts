import { daysString, monthString } from "./timeMaps";

const makeEndString = (month: string, dayOfMonth: string) => {
  if (month !== "*" && dayOfMonth !== "*") {
    return " every year";
  } else {
    return "";
  }
};

export const makeDayMonthString = (
  month: string,
  dayOfMonth: string,
  dayOfWeek: string
): string => {
  //   let endingStr: string = dayOfMonth !== "*" ? ", once a year" : "";

  let str: string =
    dayOfMonth === "*" && month === "*"
      ? " on every day of the year"
      : daysString.get(dayOfMonth)! +
        monthString.get(month) +
        makeEndString(month, dayOfMonth);
  let dayMonthString: string = dayOfWeek === "*" ? str : "";

  return dayMonthString;
};
