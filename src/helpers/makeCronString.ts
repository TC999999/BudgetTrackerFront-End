import { UpdateTime } from "../interfaces/incomeInterfaces";

export const makeCronString = (updateTime: UpdateTime): string => {
  let { minute, hour, dayOfMonth, month, dayOfWeek } = updateTime;
  let cronString: string =
    minute + " " + hour + " " + dayOfMonth + " " + month + " " + dayOfWeek;

  return cronString;
};
