import { stringHours, minutes } from "./timeMaps";

// used for income forms: returns readable time string by getting data from respective hashmaps
// For example
// if updateTime were {
//   hour: "13"
//   minute: "30",
// }
// the return value would be 1:30 p.m.

// if updateTime were {
//   hour: "2"
//   minute: "15",
// }
// the return value would be 2:15 a.m.

// if updateTime were {
//   hour: "12"
//   minute: "00",
// }
// the return value would be "Noon"
export const makeTimeString = (hour: string, minute: string): string => {
  let amOrPm: string = parseInt(hour) < 12 ? "a.m." : "p.m.";
  let timeString: string =
    stringHours.get(hour) + ":" + minutes.get(minute) + " " + amOrPm;
  if (timeString === "12:00 a.m.") {
    return "Midnight";
  }
  if (timeString === "12:00 p.m.") {
    return "Noon";
  }
  return timeString;
};
