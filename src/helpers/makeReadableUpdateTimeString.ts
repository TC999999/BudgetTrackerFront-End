import { UpdateTime } from "../interfaces/incomeInterfaces";
import { daysOfWeekString } from "./timeMaps";
import { makeTimeString } from "./makeTimeString";
import { makeDayMonthString } from "./makeDayMonthString";

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
