import { UpdateTime } from "../interfaces/incomeInterfaces";

export function constructUpdateTimeObj(cronString: string): UpdateTime {
  let cronSplit: string[] = cronString.split(" ");
  let newUpdateTime: UpdateTime = {
    minute: cronSplit[0],
    hour: cronSplit[1],
    dayOfMonth: cronSplit[2],
    month: cronSplit[3],
    dayOfWeek: cronSplit[4],
  };
  return newUpdateTime;
}
