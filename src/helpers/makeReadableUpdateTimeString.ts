import { UpdateTime } from "../interfaces/incomeInterfaces";
import { daysOfWeekString } from "./timeMaps";
import { makeTimeString } from "./makeTimeString";
import { makeDayMonthString } from "./makeDayMonthString";

// used for income forms: returns a readble string for income update intervals based on
// updateTime object that uses both time and date values
// For example:
// if updateTime were {
//   minute: "30",
//   hour: "13",
//   dayOfMonth: "14",
//   month: "3",
//   dayOfWeek: "*",
// }
// the return value would be 1:30 p.m. on March, 14 every year
export const makeReadableUpdateTimeString = (
  updateTime: UpdateTime
): string => {
  let readableUpdateTimeString: string =
    makeTimeString(updateTime.hour, updateTime.minute) +
    makeDayMonthString(
      updateTime.month,
      updateTime.dayOfMonth,
      updateTime.dayOfWeek
    ) +
    daysOfWeekString.get(updateTime.dayOfWeek);
  return readableUpdateTimeString;
};
