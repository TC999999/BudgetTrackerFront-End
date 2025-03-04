import { stringHours, minutes } from "./timeMaps";

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
