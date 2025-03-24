import { UpdateTime } from "../interfaces/incomeInterfaces";

// To be used in income forms: constructs string to be used in a cron job scheduling function to be sent
// to backend.
// For example:
// if updateTime were {
//   minute: "30",
//   hour: "13",
//   dayOfMonth: "14",
//   month: "3",
//   dayOfWeek: "*",
// }
// the return value would be "30 13 14 3 *", which means 1:30 p.m. on March, 14
export const makeCronString = (updateTime: UpdateTime): string => {
  let { minute, hour, dayOfMonth, month, dayOfWeek } = updateTime;
  let cronString: string =
    minute + " " + hour + " " + dayOfMonth + " " + month + " " + dayOfWeek;

  return cronString;
};
