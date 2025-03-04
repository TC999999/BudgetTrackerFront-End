import {
  daysOfMonth1,
  daysOfMonth2,
  dayOfMonthFeb,
  thirtyDays,
  thirtyOneDays,
} from "./timeMaps";

export const getDaysInAMonth = (monthNum: string): Map<string, string> => {
  if (thirtyOneDays.includes(monthNum)) {
    return daysOfMonth1;
  } else if (thirtyDays.includes(monthNum)) {
    return daysOfMonth2;
  } else {
    return dayOfMonthFeb;
  }
};
