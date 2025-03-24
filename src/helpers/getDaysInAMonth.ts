import {
  daysOfMonth1,
  daysOfMonth2,
  dayOfMonthFeb,
  thirtyDays,
  thirtyOneDays,
} from "./timeMaps";

// returns a map of numberd days in a month based on which month number is inputted
// for example: getDaysInAMonth("1") returns a map consisting of 31 days, while getDaysInAMonth("2")
// returns a map consisting of 29 days,
export const getDaysInAMonth = (monthNum: string): Map<string, string> => {
  if (thirtyOneDays.includes(monthNum)) {
    return daysOfMonth1;
  } else if (thirtyDays.includes(monthNum)) {
    return daysOfMonth2;
  } else {
    return dayOfMonthFeb;
  }
};
